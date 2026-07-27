import {
  BookData,
  PageMetadata,
  StructuredHunt,
  ReferenceGraph,
  PageNode,
  PageEdge,
  ValidationResult,
  ValidationError,
} from '../types';
import { getHuntSolutionPath, runHuntProgram } from '../domain/huntEngine';

const PRINTED_REF_PATTERN = /^(\d+)\.(\d{2})$/;

export function createPageMetadata(bookData: BookData): PageMetadata[] {
  const huntsByPage = new Map<number, Set<string>>();
  const linkedPagesByPage = new Map<number, Set<number>>();

  bookData.hunts.forEach(hunt => {
    const path = getHuntSolutionPath(hunt);

    path.forEach((step, index) => {
      if (!huntsByPage.has(step.expectedPage)) {
        huntsByPage.set(step.expectedPage, new Set());
      }
      huntsByPage.get(step.expectedPage)?.add(hunt.id);

      const next = path[index + 1];
      if (next && next.expectedPage !== step.expectedPage) {
        if (!linkedPagesByPage.has(step.expectedPage)) {
          linkedPagesByPage.set(step.expectedPage, new Set());
        }
        linkedPagesByPage.get(step.expectedPage)?.add(next.expectedPage);
      }
    });
  });

  return bookData.pages.map(page => ({
    id: `page${page.pageNumber}`,
    logicalName: page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    pageNumber: page.pageNumber,
    usedByHunts: Array.from(huntsByPage.get(page.pageNumber) ?? []).sort(),
    references: Array.from(linkedPagesByPage.get(page.pageNumber) ?? [])
      .sort((a, b) => a - b)
      .map(pageNumber => `page${pageNumber}`),
    constraints: page.pageNumber === 1 ? ['ENTRY_POINT'] : [],
  }));
}

export function createStructuredHunts(bookData: BookData): StructuredHunt[] {
  return bookData.hunts.map(hunt => {
    const path = getHuntSolutionPath(hunt);
    const pageNumbers = Array.from(new Set(path.map(step => step.expectedPage)));
    const entryPage = path[0]?.expectedPage ?? 1;
    const exitPage = path[path.length - 1]?.expectedPage;

    return {
      id: hunt.id,
      name: hunt.name,
      concept: hunt.concept,
      entryPageId: `page${entryPage}`,
      exitPageIds: exitPage ? [`page${exitPage}`] : [],
      dependencies: [],
      pages: pageNumbers.map(pageNumber => `page${pageNumber}`),
    };
  });
}

/**
 * Builds graph edges from executable hunt programs, never from clue prose.
 * Repeated visits are preserved because transitions are read in path order.
 */
export function buildReferenceGraph(bookData: BookData): ReferenceGraph {
  const nodes: PageNode[] = bookData.pages.map(page => ({
    id: `page${page.pageNumber}`,
    logicalName: page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    pageNumber: page.pageNumber,
  }));

  const edges: PageEdge[] = [];

  bookData.hunts.forEach(hunt => {
    const path = getHuntSolutionPath(hunt);
    path.slice(0, -1).forEach((step, index) => {
      const next = path[index + 1];
      edges.push({
        from: `page${step.expectedPage}`,
        to: `page${next.expectedPage}`,
        refId: step.refId,
      });
    });
  });

  return { nodes, edges };
}

function pushError(
  errors: ValidationError[],
  error: ValidationError,
): void {
  errors.push(error);
}

export function validateBookStructure(bookData: BookData): ValidationResult {
  const errors: ValidationError[] = [];
  const pageMap = new Map(bookData.pages.map(page => [page.pageNumber, page]));
  const refLocations = new Map<string, number[]>();
  const sourceIds = new Map<string, string[]>();

  bookData.pages.forEach(page => {
    if (!Number.isInteger(page.pageNumber) || page.pageNumber < 1) {
      pushError(errors, {
        type: 'ERROR',
        code: 'INVALID_PAGE_NUMBER',
        message: `Page "${page.title}" has invalid page number ${page.pageNumber}.`,
        context: { pageId: `page${page.pageNumber}` },
      });
    }

    page.references.forEach(ref => {
      const locations = refLocations.get(ref.id) ?? [];
      locations.push(page.pageNumber);
      refLocations.set(ref.id, locations);

      if (ref.sourceId) {
        const addresses = sourceIds.get(ref.sourceId) ?? [];
        addresses.push(ref.id);
        sourceIds.set(ref.sourceId, addresses);
      }

      const match = ref.id.match(PRINTED_REF_PATTERN);
      if (!match) {
        pushError(errors, {
          type: 'ERROR',
          code: 'INVALID_REF_ID_SCHEMA',
          message: `Reference "${ref.id}" must use "page.slot" with a two-digit slot, such as "10.02".`,
          context: { pageId: `page${page.pageNumber}`, refId: ref.id },
        });
        return;
      }

      if (Number(match[1]) !== page.pageNumber) {
        pushError(errors, {
          type: 'ERROR',
          code: 'REF_ID_PAGE_MISMATCH',
          message: `Reference "${ref.id}" is stored on page ${page.pageNumber}.`,
          context: { pageId: `page${page.pageNumber}`, refId: ref.id },
        });
      }
    });

    if (page.grid) {
      if (page.grid.length !== 10 || page.grid.some(row => row.length !== 10)) {
        pushError(errors, {
          type: 'ERROR',
          code: 'INVALID_GRID_SIZE',
          message: `Page ${page.pageNumber} must have a 10×10 grid.`,
          context: { pageId: `page${page.pageNumber}` },
        });
      }

      page.grid.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          if (!cell.refId) return;

          const match = cell.refId.match(PRINTED_REF_PATTERN);
          if (!match) {
            pushError(errors, {
              type: 'ERROR',
              code: 'INVALID_GRID_REF_ID_SCHEMA',
              message: `Grid address "${cell.refId}" at column ${columnIndex}, row ${rowIndex} is invalid.`,
              context: {
                pageId: `page${page.pageNumber}`,
                refId: cell.refId,
                position: `${columnIndex},${rowIndex}`,
              },
            });
          } else if (Number(match[1]) !== page.pageNumber) {
            pushError(errors, {
              type: 'ERROR',
              code: 'GRID_REF_ID_PAGE_MISMATCH',
              message: `Grid address "${cell.refId}" is printed on page ${page.pageNumber}.`,
              context: {
                pageId: `page${page.pageNumber}`,
                refId: cell.refId,
                position: `${columnIndex},${rowIndex}`,
              },
            });
          }

          if (!refLocations.has(cell.refId)) {
            pushError(errors, {
              type: 'ERROR',
              code: 'GRID_REF_WITHOUT_ENTRY',
              message: `Grid address "${cell.refId}" has no Captain's Log entry.`,
              context: {
                pageId: `page${page.pageNumber}`,
                refId: cell.refId,
                position: `${columnIndex},${rowIndex}`,
              },
            });
          }
        });
      });
    }
  });

  refLocations.forEach((locations, refId) => {
    if (locations.length > 1) {
      pushError(errors, {
        type: 'ERROR',
        code: 'DUPLICATE_REF_ID',
        message: `Reference "${refId}" is defined ${locations.length} times.`,
        context: { pageId: `page${locations[0]}`, refId },
      });
    }
  });

  bookData.pages.forEach(page => {
    page.references.forEach(ref => {
      const mentionedAddresses = ref.content.match(/\b\d+\.\d{2}\b/g) ?? [];
      mentionedAddresses.forEach(mentionedRefId => {
        if (!refLocations.has(mentionedRefId)) {
          pushError(errors, {
            type: 'ERROR',
            code: 'BROKEN_TEXT_REFERENCE',
            message: `Reference ${ref.id} mentions missing address ${mentionedRefId}.`,
            context: {
              pageId: `page${page.pageNumber}`,
              refId: mentionedRefId,
            },
          });
        }
      });
    });
  });

  sourceIds.forEach((addresses, sourceId) => {
    if (addresses.length > 1) {
      pushError(errors, {
        type: 'ERROR',
        code: 'DUPLICATE_SOURCE_ID',
        message: `Stable source ID "${sourceId}" is assigned to multiple references.`,
        context: { refId: addresses[0] },
      });
    }
  });

  const reachablePages = new Set<number>();

  bookData.hunts.forEach(hunt => {
    const run = runHuntProgram(hunt);
    const startNode = hunt.program.nodes[hunt.program.startNodeId];

    if (!startNode) {
      pushError(errors, {
        type: 'ERROR',
        code: 'MISSING_PROGRAM_START',
        message: `Hunt "${hunt.name}" has no start node "${hunt.program.startNodeId}".`,
        context: { huntId: hunt.id, nodeId: hunt.program.startNodeId },
      });
    } else if (startNode.refId !== hunt.startRefId) {
      pushError(errors, {
        type: 'ERROR',
        code: 'START_REF_MISMATCH',
        message: `Hunt "${hunt.name}" starts at ${hunt.startRefId}, but its program starts at ${startNode.refId}.`,
        context: { huntId: hunt.id, refId: hunt.startRefId, nodeId: startNode.sourceId },
      });
    }

    Object.values(hunt.program.nodes).forEach(node => {
      const actualPages = refLocations.get(node.refId);
      if (!actualPages) {
        pushError(errors, {
          type: 'ERROR',
          code: 'MISSING_PROGRAM_REF',
          message: `Hunt "${hunt.name}" node "${node.sourceId}" uses missing reference ${node.refId}.`,
          context: { huntId: hunt.id, refId: node.refId, nodeId: node.sourceId },
        });
      } else if (!actualPages.includes(node.expectedPage)) {
        pushError(errors, {
          type: 'ERROR',
          code: 'PROGRAM_PAGE_MISMATCH',
          message: `Hunt "${hunt.name}" expects ${node.refId} on page ${node.expectedPage}, but it is on page ${actualPages.join(', ')}.`,
          context: {
            huntId: hunt.id,
            refId: node.refId,
            pageId: `page${node.expectedPage}`,
            nodeId: node.sourceId,
          },
        });
      }

      if (node.instruction.kind === 'GOTO' && !hunt.program.nodes[node.instruction.targetNodeId]) {
        pushError(errors, {
          type: 'ERROR',
          code: 'MISSING_PROGRAM_TARGET',
          message: `Hunt "${hunt.name}" node "${node.sourceId}" points to missing node "${node.instruction.targetNodeId}".`,
          context: {
            huntId: hunt.id,
            nodeId: node.sourceId,
          },
        });
      }
    });

    if (!run.completed) {
      pushError(errors, {
        type: 'ERROR',
        code: 'UNSOLVABLE_HUNT',
        message: `Hunt "${hunt.name}" did not finish: ${run.error}`,
        context: { huntId: hunt.id },
      });
    }

    run.path.forEach(step => {
      if (!pageMap.has(step.expectedPage)) {
        pushError(errors, {
          type: 'ERROR',
          code: 'MISSING_EXPECTED_PAGE',
          message: `Hunt "${hunt.name}" expects missing page ${step.expectedPage}.`,
          context: { huntId: hunt.id, pageId: `page${step.expectedPage}` },
        });
      }
      reachablePages.add(step.expectedPage);
    });
  });

  bookData.pages.forEach(page => {
    if (!reachablePages.has(page.pageNumber)) {
      pushError(errors, {
        type: 'WARNING',
        code: 'UNREACHABLE_PAGE',
        message: `Page ${page.pageNumber} "${page.title}" is not used by any executable hunt path.`,
        context: { pageId: `page${page.pageNumber}` },
      });
    }
  });

  bookData.nights.forEach(night => {
    night.huntIds.forEach(huntId => {
      if (!bookData.hunts.some(hunt => hunt.id === huntId)) {
        pushError(errors, {
          type: 'ERROR',
          code: 'NIGHT_MISSING_HUNT',
          message: `${night.title} includes missing hunt "${huntId}".`,
          context: { huntId },
        });
      }
    });
  });

  return {
    isValid: !errors.some(error => error.type === 'ERROR'),
    errors,
  };
}

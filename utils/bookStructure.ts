import {
  BookData,
  PageMetadata,
  StructuredHunt,
  ReferenceGraph,
  PageNode,
  PageEdge,
  ValidationResult,
  ValidationError,
  TreasureHunt
} from '../types';

/**
 * STEP 3: Page Metadata Layer
 * Creates metadata for existing pages without changing their structure
 */
export function createPageMetadata(bookData: BookData): PageMetadata[] {
  return bookData.pages.map(page => {
    // Extract all reference IDs from this page's references and grid
    const pageRefIds = new Set<string>();

    // Add references from the references array
    page.references.forEach(ref => {
      // Parse reference content to find page links (simplified logic)
      // This would need to be enhanced based on actual reference content patterns
      const content = ref.content.toLowerCase();
      if (content.includes('page') || content.includes('go to')) {
        // Extract page numbers from content (basic implementation)
        const pageMatches = content.match(/page\s*(\d+)/gi);
        if (pageMatches) {
          pageMatches.forEach(match => {
            const pageNum = match.match(/(\d+)/)?.[1];
            if (pageNum) {
              pageRefIds.add(`page${pageNum}`);
            }
          });
        }
      }
    });

    // Add references from grid cells
    if (page.grid) {
      page.grid.forEach(row => {
        row.forEach(cell => {
          if (cell.refId) {
            // Convert refId to page reference if it follows the pattern
            // refId format: "101" = Page 1, Ref 01
            const pageNum = Math.floor(parseInt(cell.refId) / 100);
            if (pageNum > 0 && pageNum !== page.pageNumber) {
              pageRefIds.add(`page${pageNum}`);
            }
          }
        });
      });
    }

    return {
      id: `page${page.pageNumber}`,
      logicalName: page.title.toLowerCase().replace(/\s+/g, '-'),
      pageNumber: page.pageNumber,
      usedByHunts: [], // Will be populated by hunt analysis
      references: Array.from(pageRefIds),
      constraints: page.pageNumber === 1 ? ['ENTRY_POINT'] : []
    };
  });
}

/**
 * STEP 2: Hunt Abstraction
 * Creates structured hunt definitions from existing TreasureHunt data
 */
export function createStructuredHunts(bookData: BookData): StructuredHunt[] {
  return bookData.hunts.map(hunt => {
    // Extract unique pages from solution path
    const pageNumbers = new Set<number>();
    hunt.solutionPath.forEach(step => {
      pageNumbers.add(step.expectedPage);
    });

    // Determine entry and exit pages
    const entryPage = hunt.solutionPath[0]?.expectedPage || 1;
    const exitPages = hunt.solutionPath.length > 0
      ? [hunt.solutionPath[hunt.solutionPath.length - 1].expectedPage]
      : [];

    return {
      id: hunt.id,
      name: hunt.name,
      concept: hunt.concept,
      entryPageId: `page${entryPage}`,
      exitPageIds: exitPages.map(p => `page${p}`),
      dependencies: [], // Could be populated based on hunt relationships
      pages: Array.from(pageNumbers).map(p => `page${p}`)
    };
  });
}

/**
 * STEP 4: Reference Graph Builder
 * Builds a graph from existing page and hunt data
 */
export function buildReferenceGraph(
  pages: PageMetadata[],
  hunts: StructuredHunt[]
): ReferenceGraph {
  const nodes: PageNode[] = pages.map(page => ({
    id: page.id,
    logicalName: page.logicalName,
    pageNumber: page.pageNumber
  }));

  const edges: PageEdge[] = [];

  // Build edges from page references
  pages.forEach(page => {
    page.references.forEach(targetPageId => {
      // Find the target page
      const targetPage = pages.find(p => p.id === targetPageId);
      if (targetPage) {
        edges.push({
          from: page.id,
          to: targetPageId,
          refId: `${page.pageNumber}xx` // Placeholder - would need actual refId
        });
      }
    });
  });

  // Add edges from hunt solution paths
  hunts.forEach(hunt => {
    for (let i = 0; i < hunt.pages.length - 1; i++) {
      const fromPage = hunt.pages[i];
      const toPage = hunt.pages[i + 1];
      edges.push({
        from: fromPage,
        to: toPage,
        refId: `hunt-${hunt.id}-step${i}`
      });
    }
  });

  return { nodes, edges };
}

/**
 * STEP 5: Validation Layer
 * Validates the book structure before PDF generation
 */
export function validateBookStructure(bookData: BookData): ValidationResult {
  const errors: ValidationError[] = [];
  const pageMap = new Map<number, typeof bookData.pages[0]>();
  const refMap = new Map<string, { page: number; ref: any }>();

  // Build lookup maps
  bookData.pages.forEach(page => {
    pageMap.set(page.pageNumber, page);
    page.references.forEach(ref => {
      refMap.set(ref.id, { page: page.pageNumber, ref });
    });
  });

  // Validate hunts
  bookData.hunts.forEach(hunt => {
    // Check start reference exists
    if (!refMap.has(hunt.startRefId)) {
      errors.push({
        type: 'ERROR',
        code: 'MISSING_START_REF',
        message: `Hunt "${hunt.name}" references non-existent start refId: ${hunt.startRefId}`,
        context: { huntId: hunt.id, refId: hunt.startRefId }
      });
    }

    // Check solution path references exist
    hunt.solutionPath.forEach((step, index) => {
      if (!refMap.has(step.refId)) {
        errors.push({
          type: 'ERROR',
          code: 'MISSING_STEP_REF',
          message: `Hunt "${hunt.name}" step ${index + 1} references non-existent refId: ${step.refId}`,
          context: { huntId: hunt.id, refId: step.refId }
        });
      }

      // Check expected page exists
      if (!pageMap.has(step.expectedPage)) {
        errors.push({
          type: 'ERROR',
          code: 'MISSING_EXPECTED_PAGE',
          message: `Hunt "${hunt.name}" step ${index + 1} expects non-existent page: ${step.expectedPage}`,
          context: { huntId: hunt.id, pageId: `page${step.expectedPage}` }
        });
      }
    });
  });

  // Check for unreachable pages
  const reachablePages = new Set<number>();
  bookData.hunts.forEach(hunt => {
    hunt.solutionPath.forEach(step => {
      reachablePages.add(step.expectedPage);
    });
  });

  bookData.pages.forEach(page => {
    if (!reachablePages.has(page.pageNumber)) {
      errors.push({
        type: 'WARNING',
        code: 'UNREACHABLE_PAGE',
        message: `Page ${page.pageNumber} "${page.title}" is not referenced by any hunt`,
        context: { pageId: `page${page.pageNumber}` }
      });
    }
  });

  // Check for pages with no outbound references
  bookData.pages.forEach(page => {
    const hasRefs = page.references.length > 0 ||
      (page.grid && page.grid.some(row => row.some(cell => cell.refId)));

    if (!hasRefs) {
      errors.push({
        type: 'INFO',
        code: 'NO_OUTBOUND_REFS',
        message: `Page ${page.pageNumber} "${page.title}" has no outbound references`,
        context: { pageId: `page${page.pageNumber}` }
      });
    }
  });

  return {
    isValid: !errors.some(e => e.type === 'ERROR'),
    errors
  };
}
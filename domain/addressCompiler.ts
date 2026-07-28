import { BookData, Reference } from '../types';

export interface AddressAllocation {
  sourceId: string;
  pageNumber: number;
  slot: number;
}

export function formatPrintedAddress(pageNumber: number, slot: number): string {
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    throw new Error(`Invalid page number: ${pageNumber}`);
  }
  if (!Number.isInteger(slot) || slot < 0 || slot > 99) {
    throw new Error(`Reference slot must be between 0 and 99: ${slot}`);
  }
  return `${pageNumber}.${String(slot).padStart(2, '0')}`;
}

/**
 * Resolves authoring tokens such as {{ref sandy-shores.dock}} after pagination.
 * Existing literal references remain supported during the migration.
 */
export function compileReferenceTokens(
  text: string,
  addressBySourceId: ReadonlyMap<string, string>,
): string {
  return text.replace(/\{\{ref\s+([a-zA-Z0-9._-]+)\}\}/g, (_token, sourceId: string) => {
    const address = addressBySourceId.get(sourceId);
    if (!address) {
      throw new Error(`No printed address allocated for source ID "${sourceId}".`);
    }
    return address;
  });
}

export function createAddressIndex(
  allocations: AddressAllocation[],
): Map<string, string> {
  const index = new Map<string, string>();
  const usedAddresses = new Set<string>();

  allocations.forEach(allocation => {
    const address = formatPrintedAddress(allocation.pageNumber, allocation.slot);
    if (index.has(allocation.sourceId)) {
      throw new Error(`Duplicate source ID "${allocation.sourceId}".`);
    }
    if (usedAddresses.has(address)) {
      throw new Error(`Duplicate printed address "${address}".`);
    }
    index.set(allocation.sourceId, address);
    usedAddresses.add(address);
  });

  return index;
}

export function compileReference(
  reference: Reference,
  addressBySourceId: ReadonlyMap<string, string>,
  addressByOldPrintedId: ReadonlyMap<string, string> = new Map(),
): Reference {
  const id = reference.sourceId
    ? addressBySourceId.get(reference.sourceId) ?? reference.id
    : addressByOldPrintedId.get(reference.id) ?? reference.id;

  return {
    ...reference,
    id,
    content: compileReferenceTokens(reference.content, addressBySourceId),
  };
}

/**
 * Content-preserving compiler entry point. Page allocation can later be moved
 * ahead of this step without changing authoring files or the renderer.
 */
export function compileBookAddresses(
  book: BookData,
  allocations: AddressAllocation[],
): BookData {
  const addressBySourceId = createAddressIndex(allocations);
  const addressByOldPrintedId = new Map<string, string>();

  book.hunts.forEach(hunt => {
    Object.values(hunt.program.nodes).forEach(node => {
      const allocatedAddress = addressBySourceId.get(node.sourceId);
      if (!allocatedAddress) return;
      const existingAddress = addressByOldPrintedId.get(node.refId);
      if (existingAddress && existingAddress !== allocatedAddress) {
        throw new Error(
          `Printed reference "${node.refId}" was allocated to both "${existingAddress}" and "${allocatedAddress}".`,
        );
      }
      addressByOldPrintedId.set(node.refId, allocatedAddress);
    });
  });

  const hunts = book.hunts.map(hunt => {
    const nodes = Object.fromEntries(
      Object.entries(hunt.program.nodes).map(([nodeId, node]) => [
        nodeId,
        {
          ...node,
          refId: addressBySourceId.get(node.sourceId) ?? node.refId,
        },
      ]),
    );
    const startNode = nodes[hunt.program.startNodeId];

    return {
      ...hunt,
      startRefId: startNode?.refId ?? hunt.startRefId,
      program: {
        ...hunt.program,
        nodes,
      },
    };
  });

  return {
    ...book,
    hunts,
    pages: book.pages.map(page => ({
      ...page,
      references: page.references.map(reference =>
        compileReference(reference, addressBySourceId, addressByOldPrintedId)),
      grid: page.grid?.map(row => row.map(cell => ({
        ...cell,
        refId: cell.sourceId
          ? addressBySourceId.get(cell.sourceId) ?? cell.refId
          : (cell.refId ? addressByOldPrintedId.get(cell.refId) ?? cell.refId : undefined),
      }))),
    })),
  };
}

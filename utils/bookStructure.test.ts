import { describe, expect, it } from 'vitest';
import { STATIC_BOOK } from '../data/staticBook';
import { runHuntProgram } from '../domain/huntEngine';
import { validateBookStructure } from './bookStructure';

describe('book structure', () => {
  it('has no structural errors', () => {
    const result = validateBookStructure(STATIC_BOOK);
    expect(result.errors.filter(error => error.type === 'ERROR')).toEqual([]);
  });

  it('can programmatically finish every hunt', () => {
    STATIC_BOOK.hunts.forEach(hunt => {
      const result = runHuntProgram(hunt);
      expect(result.completed, `${hunt.id}: ${result.error ?? 'did not finish'}`).toBe(true);
      expect(result.path[0]?.refId).toBe(hunt.startRefId);
      expect(result.path.at(-1)?.refId).toBeTruthy();
    });
  });

  it('detects duplicate printed reference addresses', () => {
    const firstPage = STATIC_BOOK.pages[0];
    const duplicate = firstPage.references[0];
    const changedBook = {
      ...STATIC_BOOK,
      pages: STATIC_BOOK.pages.map(page => (
        page.pageNumber === firstPage.pageNumber
          ? { ...page, references: [...page.references, { ...duplicate }] }
          : page
      )),
    };

    const result = validateBookStructure(changedBook);
    expect(result.errors.some(error => error.code === 'DUPLICATE_REF_ID')).toBe(true);
  });

  it('detects a broken program transition', () => {
    const firstHunt = STATIC_BOOK.hunts[0];
    const startNode = firstHunt.program.nodes[firstHunt.program.startNodeId];
    const changedBook = {
      ...STATIC_BOOK,
      hunts: STATIC_BOOK.hunts.map(hunt => (
        hunt.id === firstHunt.id
          ? {
              ...hunt,
              program: {
                ...hunt.program,
                nodes: {
                  ...hunt.program.nodes,
                  [startNode.sourceId]: {
                    ...startNode,
                    instruction: { kind: 'GOTO' as const, targetNodeId: 'missing.node' },
                  },
                },
              },
            }
          : hunt
      )),
    };

    const result = validateBookStructure(changedBook);
    expect(result.errors.some(error => error.code === 'MISSING_PROGRAM_TARGET')).toBe(true);
    expect(result.errors.some(error => error.code === 'UNSOLVABLE_HUNT')).toBe(true);
  });
});


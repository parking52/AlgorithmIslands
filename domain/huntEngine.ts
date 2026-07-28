import {
  HuntMechanic,
  HuntProgram,
  HuntProgramNode,
  HuntStep,
  TreasureHunt,
} from '../types';

export interface HuntRunResult {
  completed: boolean;
  path: HuntStep[];
  visitedNodeIds: string[];
  error?: string;
}

export interface HuntMetrics {
  steps: number;
  pageFlips: number;
  uniquePages: number;
  revisits: number;
}

/**
 * Creates an explicit executable program from an authored sequence.
 *
 * This is the migration-friendly form of the hunt language. Rich operations
 * can be added later without changing the renderer or answer-guide API.
 */
export function createLinearProgram(
  huntId: string,
  mechanic: HuntMechanic,
  steps: HuntStep[],
): HuntProgram {
  const nodes: Record<string, HuntProgramNode> = {};

  steps.forEach((step, index) => {
    const sourceId = step.sourceId ?? `${huntId}.step-${String(index + 1).padStart(2, '0')}`;
    const next = steps[index + 1];
    const nextSourceId = next?.sourceId
      ?? (next ? `${huntId}.step-${String(index + 2).padStart(2, '0')}` : undefined);

    nodes[sourceId] = {
      ...step,
      sourceId,
      instruction: nextSourceId
        ? { kind: 'GOTO', targetNodeId: nextSourceId }
        : { kind: 'FINISH' },
    };
  });

  const first = steps[0];
  const startNodeId = first?.sourceId ?? `${huntId}.step-01`;

  return {
    mechanic,
    startNodeId,
    nodes,
    maxSteps: Math.max(steps.length * 2, 10),
  };
}

/**
 * Follows the structured program without reading or parsing child-facing prose.
 */
export function runHuntProgram(hunt: TreasureHunt): HuntRunResult {
  const { program } = hunt;
  const maxSteps = program.maxSteps ?? Math.max(Object.keys(program.nodes).length * 2, 10);
  const visitedNodeIds: string[] = [];
  const path: HuntStep[] = [];
  let currentNodeId = program.startNodeId;

  for (let iteration = 0; iteration < maxSteps; iteration += 1) {
    const node = program.nodes[currentNodeId];
    if (!node) {
      return {
        completed: false,
        path,
        visitedNodeIds,
        error: `Program references missing node "${currentNodeId}".`,
      };
    }

    visitedNodeIds.push(currentNodeId);
    path.push({
      sourceId: node.sourceId,
      refId: node.refId,
      description: node.description,
      expectedPage: node.expectedPage,
    });

    if (node.instruction.kind === 'FINISH') {
      return { completed: true, path, visitedNodeIds };
    }

    currentNodeId = node.instruction.targetNodeId;
  }

  return {
    completed: false,
    path,
    visitedNodeIds,
    error: `Program exceeded its ${maxSteps}-step safety limit.`,
  };
}

export function getHuntSolutionPath(hunt: TreasureHunt): HuntStep[] {
  return runHuntProgram(hunt).path;
}

export function getHuntMetrics(hunt: TreasureHunt): HuntMetrics {
  const path = getHuntSolutionPath(hunt);
  const uniquePages = new Set(path.map(step => step.expectedPage)).size;
  const pageFlips = path.slice(1).reduce((count, step, index) => (
    step.expectedPage === path[index].expectedPage ? count : count + 1
  ), 0);

  return {
    steps: path.length,
    pageFlips,
    uniquePages,
    revisits: Math.max(path.length - uniquePages, 0),
  };
}

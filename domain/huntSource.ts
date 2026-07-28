import { parse } from 'yaml';
import { z } from 'zod';
import { TreasureHunt } from '../types';
import { createLinearProgram } from './huntEngine';

const stepSchema = z.object({
  sourceId: z.string().min(1),
  refId: z.string().regex(/^\d+\.\d{2}$/),
  description: z.string().min(1),
  expectedPage: z.number().int().positive(),
});

const huntSourceSchema = z.object({
  id: z.string().regex(/^hunt[a-zA-Z0-9-]+$/),
  name: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  startRefId: z.string().regex(/^\d+\.\d{2}$/),
  description: z.string().min(1),
  topic: z.string().min(1),
  concept: z.string().min(1),
  mechanic: z.enum([
    'REFERENCE_CHAIN',
    'GRID_MOVEMENT',
    'AGGREGATION',
    'FILTER_AND_REDUCE',
    'BINARY_SEARCH',
    'FUNCTION_CALL',
    'SET_MEMBERSHIP',
    'ITERATION',
    'CONDITIONAL',
    'INDIRECTION',
    'TRANSFORMATION',
    'CALL_STACK',
    'PARALLEL',
  ]),
  steps: z.array(stepSchema).min(1),
});

const huntFileSchema = z.object({
  hunts: z.array(huntSourceSchema).min(1),
});

export type HuntSource = z.infer<typeof huntSourceSchema>;

export function loadHuntSource(rawYaml: string): TreasureHunt[] {
  const source = huntFileSchema.parse(parse(rawYaml));

  return source.hunts.map(hunt => ({
    id: hunt.id,
    name: hunt.name,
    difficulty: hunt.difficulty,
    startRefId: hunt.startRefId,
    description: hunt.description,
    topic: hunt.topic,
    concept: hunt.concept,
    program: createLinearProgram(hunt.id, hunt.mechanic, hunt.steps),
  }));
}

export function getHuntSourceJsonSchema() {
  return z.toJSONSchema(huntFileSchema, {
    target: 'draft-2020-12',
  });
}

export enum TerrainType {
  EMPTY = 'EMPTY',
  TREE = 'TREE',
  ROCK = 'ROCK',
  WATER = 'WATER',
  SAND = 'SAND',
  START = 'START',
  X_MARK = 'X_MARK',
  HOUSE = 'HOUSE',
  COIN = 'COIN',
  CHEST = 'CHEST',
  VOLCANO = 'VOLCANO'
}

export interface MapCell {
  terrain: TerrainType;
  label?: string; // Visible label (e.g. "A1")
  refId?: string; // Hidden ref ID at this location
}

// Helper to define grid easier
export type GridRow = MapCell[];
export type GridData = GridRow[];

export interface Reference {
  id: string; // e.g. "101" for Page 1, Ref 01
  type: 'CLUE' | 'PUZZLE' | 'TREASURE' | 'POINTER' | 'DECOY';
  content: string; 
  value?: number; 
}

export interface PageData {
  pageNumber: number;
  title: string;
  grid?: GridData; // Optional, some pages might just be reference lists
  references: Reference[];
}

export interface HuntStep {
  refId: string;
  description: string;
  expectedPage: number;
}

export interface TreasureHunt {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  startRefId: string;
  description: string;
  solutionPath: HuntStep[];
}

export interface BookData {
  title: string;
  intro: string;
  hunts: TreasureHunt[];
  pages: PageData[];
}
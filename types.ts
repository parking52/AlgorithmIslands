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
  VOLCANO = 'VOLCANO',
  GEM = 'GEM',
  PARROT = 'PARROT',
  SHELL = 'SHELL'
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
  type: 'CLUE' | 'PUZZLE' | 'TREASURE' | 'POINTER' | 'DECOY' | 'COIN';
  content: string; 
  value?: number; 
}

export interface PageData {
  pageNumber: number;
  title: string;
  grid?: GridData; // Optional, some pages might just be reference lists
  references: Reference[];
}

// NEW: Extended Page Metadata (Non-breaking extension)
export interface PageMetadata {
  id: string; // Unique identifier (can reuse existing if present)
  logicalName: string; // Stable identifier independent of page number
  pageNumber: number; // Existing page number (keep for compatibility)
  usedByHunts: string[]; // Array of hunt IDs that use this page
  references: string[]; // Array of page IDs this page links to
  constraints: string[]; // Array of constraints like ["FIXED_PAGE", "ENTRY_POINT"]
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
  // Pedagogical info
  topic: string; // e.g. "Pointers"
  concept: string; // e.g. "Teaches how memory works..."
}

// NEW: Structured Hunt Abstraction (Non-breaking extension)
export interface StructuredHunt {
  id: string;
  name: string;
  concept: string;
  entryPageId: string; // Reference to page logical name
  exitPageIds: string[]; // Array of page logical names where hunt can end
  dependencies: string[]; // Array of hunt IDs this hunt depends on
  pages: string[]; // Array of page logical names used by this hunt
}

export interface BookData {
  title: string;
  intro: string;
  hunts: TreasureHunt[];
  pages: PageData[];
}

// NEW: Reference Graph Types
export interface PageNode {
  id: string;
  logicalName: string;
  pageNumber: number;
}

export interface PageEdge {
  from: string; // Page ID
  to: string; // Page ID
  refId: string; // Reference ID that creates this link
}

export interface ReferenceGraph {
  nodes: PageNode[];
  edges: PageEdge[];
}

// NEW: Validation Types
export interface ValidationError {
  type: 'ERROR' | 'WARNING' | 'INFO';
  code: string;
  message: string;
  context?: {
    huntId?: string;
    pageId?: string;
    refId?: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
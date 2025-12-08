import { BookData, TerrainType, GridData, MapCell } from "../types";

// --- Helper to create empty 10x10 grids ---
const createGrid = (fill: TerrainType = TerrainType.EMPTY): GridData => {
  return Array(10).fill(null).map(() => 
    Array(10).fill(null).map(() => ({ terrain: fill }))
  );
};

// ==========================================
// PAGE 1: PIRATE BEACH (The Basics)
// IDs: 100-199
// ==========================================
const grid1 = createGrid(TerrainType.SAND);
grid1[0][0].terrain = TerrainType.START; grid1[0][0].label = "Dock";
grid1[4][4].terrain = TerrainType.TREE; grid1[4][4].label = "Palm (143)"; grid1[4][4].refId = "143"; 
grid1[5][5].terrain = TerrainType.ROCK; grid1[5][5].label = "Skull Rock"; grid1[5][5].refId = "150";
grid1[4][9].terrain = TerrainType.EMPTY; grid1[4][9].label = "To Jungle (199)"; grid1[4][9].refId = "199"; 
grid1[8][1].terrain = TerrainType.WATER; grid1[8][2].terrain = TerrainType.WATER;
grid1[2][3].refId = "105"; 

// ==========================================
// PAGE 2: JUNGLE MAZE (Loops)
// IDs: 200-299
// ==========================================
const grid2 = createGrid(TerrainType.TREE); 
for(let i=0; i<10; i++) { grid2[4][i].terrain = TerrainType.EMPTY; } 
grid2[4][0].terrain = TerrainType.START; grid2[4][0].label = "From Beach"; 
grid2[4][9].terrain = TerrainType.HOUSE; grid2[4][9].label = "Hut (120)"; 
grid2[1][1].terrain = TerrainType.X_MARK; grid2[1][1].refId = "299"; 
grid2[4][5].terrain = TerrainType.ROCK; grid2[4][5].label = "Mossy Rock"; grid2[4][5].refId = "255";

// ==========================================
// PAGE 3: LOGIC LAGOON (Conditionals, Variables, Debugging)
// IDs: 300-399
// ==========================================
const grid3 = createGrid(TerrainType.WATER);

// -- Hunt 5 Zone (Top Left: Conditionals) --
// Create a path of Sand and Rocks
grid3[0][0].terrain = TerrainType.START; grid3[0][0].label = "Start A";
// Path: (0,0)S -> (1,0)R -> (1,1)S -> (2,1)S -> (3,1)R -> (3,2)S
grid3[0][0].terrain = TerrainType.SAND; 
grid3[1][0].terrain = TerrainType.ROCK; 
grid3[1][1].terrain = TerrainType.SAND; 
grid3[2][1].terrain = TerrainType.SAND; 
grid3[3][1].terrain = TerrainType.ROCK; 
grid3[3][2].terrain = TerrainType.SAND; grid3[3][2].refId = "305"; // Destination

// -- Hunt 6 Zone (Middle: Variables/Coins) --
// A winding canyon path with coins
grid3[4][0].terrain = TerrainType.START; grid3[4][0].label = "Start B";
grid3[4][0].terrain = TerrainType.SAND;
grid3[4][1].terrain = TerrainType.COIN; // Coin 1
grid3[4][2].terrain = TerrainType.SAND;
grid3[5][2].terrain = TerrainType.SAND;
grid3[5][3].terrain = TerrainType.COIN; // Coin 2
grid3[5][4].terrain = TerrainType.SAND;
grid3[4][4].terrain = TerrainType.COIN; // Coin 3
grid3[4][5].terrain = TerrainType.HOUSE; grid3[4][5].label = "Shop"; // End

// -- Hunt 9 Zone (Bottom: Debugging) --
// A path with a trap
grid3[8][0].terrain = TerrainType.START; grid3[8][0].label = "Start C";
grid3[8][0].terrain = TerrainType.SAND;
grid3[8][1].terrain = TerrainType.SAND;
grid3[8][2].terrain = TerrainType.VOLCANO; // The bug!
grid3[7][1].terrain = TerrainType.SAND; // The detour
grid3[7][2].terrain = TerrainType.SAND; // The detour
grid3[8][3].terrain = TerrainType.X_MARK; grid3[8][3].refId = "399"; // Treasure

// ==========================================
// PAGE 4: FUNCTION FOREST (Functions, Binary Search)
// IDs: 400-499
// ==========================================
const grid4 = createGrid(TerrainType.EMPTY);

// -- Hunt 8 Zone (Top: Open Field for Functions) --
// Just empty grass (EMPTY) with a start point
grid4[5][5].terrain = TerrainType.START; grid4[5][5].label = "Dance Floor";
grid4[8][3].terrain = TerrainType.X_MARK; grid4[8][3].refId = "480"; // Destination of Monkey Dance

// -- Hunt 7 Zone (Bottom Row: Binary Search Chests) --
// 8 Chests at row 9
const chestIds = ["500", "505", "510", "515", "520", "525", "530", "535"];
for(let i=1; i<=8; i++) {
  grid4[9][i].terrain = TerrainType.CHEST;
  grid4[9][i].label = chestIds[i-1];
  grid4[9][i].refId = chestIds[i-1];
}


// ==========================================
// DATA EXPORT
// ==========================================
export const STATIC_BOOK: BookData = {
  title: "The Algorithm Islands",
  intro: "Welcome, young captain. Use your pencil to trace the logic of the ancients.",
  hunts: [
    // --- EXISTING HUNTS ---
    {
      id: "hunt1",
      name: "1. The Island Hop (Pointers)",
      difficulty: "Easy",
      startRefId: "101",
      description: "Learn to jump between pages using pointers.",
      solutionPath: [
        { refId: "101", description: "Start Page 1 -> Page 2.", expectedPage: 1 },
        { refId: "201", description: "Page 2 -> Page 1.", expectedPage: 2 },
        { refId: "102", description: "Treasure found.", expectedPage: 1 },
      ]
    },
    {
      id: "hunt2",
      name: "2. The Loop-de-Loop (Loops)",
      difficulty: "Medium",
      startRefId: "205",
      description: "Execute a movement loop.",
      solutionPath: [
        { refId: "205", description: "Start Page 2.", expectedPage: 2 },
        { refId: "210", description: "Loop Right x9 -> Hut (120).", expectedPage: 2 },
        { refId: "120", description: "Hut -> (5,5) Page 1.", expectedPage: 1 },
        { refId: "150", description: "Skull Rock Treasure.", expectedPage: 1 },
      ]
    },
    {
      id: "hunt3",
      name: "3. The Zig-Zag Sum (Math)",
      difficulty: "Hard",
      startRefId: "190",
      description: "Pattern movement + simple hash sum.",
      solutionPath: [
        { refId: "190", description: "ZigZag to Palm (143).", expectedPage: 1 },
        { refId: "143", description: "Sum 1+4+3=8. Go to 108.", expectedPage: 1 },
        { refId: "108", description: "Treasure.", expectedPage: 1 }
      ]
    },
    {
      id: "hunt4",
      name: "4. The Map Crossing (Edges)",
      difficulty: "Hard",
      startRefId: "160",
      description: "Moving between maps.",
      solutionPath: [
        { refId: "160", description: "Skull Rock -> Edge.", expectedPage: 1 },
        { refId: "199", description: "Edge -> Page 2 Start.", expectedPage: 1 },
        { refId: "222", description: "Walk East to Mossy Rock.", expectedPage: 2 },
        { refId: "255", description: "Treasure.", expectedPage: 2 }
      ]
    },
    // --- NEW HUNTS ---
    {
      id: "hunt5",
      name: "5. The Conditional Coast (If/Else)",
      difficulty: "Medium",
      startRefId: "301",
      description: "Follow logic: IF Sand move East, ELSE (Rock) move South.",
      solutionPath: [
        { refId: "301", description: "Start A (Page 3). Begin logic path.", expectedPage: 3 },
        { refId: "305", description: "End of logic path at (3,2). Dig here.", expectedPage: 3 },
        { refId: "310", description: "Treasure found.", expectedPage: 3 }
      ]
    },
    {
      id: "hunt6",
      name: "6. The Variable Valley (Variables)",
      difficulty: "Medium",
      startRefId: "320",
      description: "Count Coins while walking. Value determines destination.",
      solutionPath: [
        { refId: "320", description: "Start B (Page 3). Set Coins = 0.", expectedPage: 3 },
        { refId: "325", description: "Walk path to Shop. Counted 3 Coins.", expectedPage: 3 },
        { refId: "330", description: "Check Shop Rule: 3 Coins -> Ref 390.", expectedPage: 3 },
        { refId: "390", description: "Treasure bought!", expectedPage: 3 }
      ]
    },
    {
      id: "hunt7",
      name: "7. The Binary Beach (Binary Search)",
      difficulty: "Hard",
      startRefId: "401",
      description: "Find the treasure in sorted chests efficiently.",
      solutionPath: [
        { refId: "401", description: "Go to Page 4. Check Middle Chest (515).", expectedPage: 4 },
        { refId: "515", description: "Clue: 'Lower'. Check middle of left half (505).", expectedPage: 4 },
        { refId: "505", description: "Clue: 'Higher'. Check 510.", expectedPage: 4 },
        { refId: "510", description: "Treasure Found.", expectedPage: 4 }
      ]
    },
    {
      id: "hunt8",
      name: "8. The Function Falls (Functions)",
      difficulty: "Hard",
      startRefId: "450",
      description: "Define a move sequence 'Monkey Dance' and reuse it.",
      solutionPath: [
        { refId: "450", description: "Start Page 4 (Dance Floor). Do 'Monkey Dance', East, 'Monkey Dance'.", expectedPage: 4 },
        { refId: "480", description: "End at (8,3). Read Ref 480.", expectedPage: 4 },
        { refId: "499", description: "Treasure.", expectedPage: 4 }
      ]
    },
    {
      id: "hunt9",
      name: "9. Debugger's Dungeon (Debugging)",
      difficulty: "Hard",
      startRefId: "380",
      description: "Fix a buggy path that leads to a volcano.",
      solutionPath: [
        { refId: "380", description: "Start C (Page 3). Path 'E, E, E' hits Volcano.", expectedPage: 3 },
        { refId: "385", description: "Debug: Change 2nd 'E' to 'N' (detour).", expectedPage: 3 },
        { refId: "399", description: "Follow new path to X Mark.", expectedPage: 3 }
      ]
    }
  ],
  pages: [
    {
      pageNumber: 1,
      title: "Sandy Shores",
      grid: grid1,
      references: [
        { id: "101", type: "POINTER", content: "Go to Page 2 Ref 201." },
        { id: "102", type: "TREASURE", content: "Captain's Spyglass!" },
        { id: "105", type: "CLUE", content: "Message in a bottle." },
        { id: "120", type: "POINTER", content: "Go to (5,5) on this page." },
        { id: "150", type: "TREASURE", content: "Golden Monkey!" },
        { id: "190", type: "CLUE", content: "Start Dock (0,0). ZigZag 4 times (S, E, S, E...). Read Ref on object." },
        { id: "143", type: "PUZZLE", content: "Palm Tree. Add my digits (1+4+3) to get X. Open Ref 10X." },
        { id: "108", type: "TREASURE", content: "Silver Compass!" },
        { id: "160", type: "CLUE", content: "Start Skull Rock. Go East to edge." },
        { id: "199", type: "POINTER", content: "Go to Page 2 'From Beach'. Read Ref 222." },
      ]
    },
    {
      pageNumber: 2,
      title: "Dense Jungle",
      grid: grid2,
      references: [
        { id: "201", type: "POINTER", content: "Treasure is back on Page 1. Ref 102." },
        { id: "205", type: "CLUE", content: "Start 'From Beach'. Read Ref 210." },
        { id: "210", type: "CLUE", content: "Loop 9 times Right. Read ID on object." },
        { id: "222", type: "CLUE", content: "Walk East to Mossy Rock." },
        { id: "255", type: "TREASURE", content: "Jewels!" },
        { id: "299", type: "TREASURE", content: "Hidden Jungle Chest." },
      ]
    },
    {
      pageNumber: 3,
      title: "Logic Lagoon",
      grid: grid3,
      references: [
        // Hunt 5
        { id: "301", type: "CLUE", content: "Start A (0,0). Move East. RULE: If on SAND, move East again. ELSE (if Rock), move South." },
        { id: "305", type: "POINTER", content: "You navigated the reef! Check Ref 310." },
        { id: "310", type: "TREASURE", content: "Logic Pearl found." },
        
        // Hunt 6
        { id: "320", type: "CLUE", content: "Start B (4,0). Set Coins = 0. Follow the path. If you step on a Coin, Coins = Coins + 1. Go to the Shop (House)." },
        { id: "325", type: "POINTER", content: "Welcome to the Shop. Check your Coin purse." },
        { id: "330", type: "PUZZLE", content: "If Coins = 2, read Ref 388. If Coins = 3, read Ref 390." },
        { id: "390", type: "TREASURE", content: "You bought the Magic Sword!" },
        { id: "388", type: "DECOY", content: "Not enough money." },

        // Hunt 9
        { id: "380", type: "CLUE", content: "Start C (8,0). The map says 'East, East, East'. But step 2 hits a Volcano! Fix the bug: Change step 2 to 'North', then continue East." },
        { id: "399", type: "TREASURE", content: "Debugger's Shield found." }
      ]
    },
    {
      pageNumber: 4,
      title: "Function Forest",
      grid: grid4,
      references: [
        // Hunt 7 (Binary)
        { id: "401", type: "CLUE", content: "The treasure is in a chest at Row 9. The IDs are sorted. Start by checking the Middle Chest (Ref 515)." },
        { id: "515", type: "PUZZLE", content: "The treasure ID is LOWER than 515." },
        { id: "505", type: "PUZZLE", content: "The treasure ID is HIGHER than 505." },
        { id: "535", type: "PUZZLE", content: "The treasure ID is LOWER than 535." },
        { id: "510", type: "TREASURE", content: "You found it! Efficient searching!" },
        
        // Hunt 8 (Functions)
        { id: "450", type: "CLUE", content: "Start 'Dance Floor'. DEFINE 'Monkey Dance' = [North, North, East, South]. EXECUTE: Monkey Dance -> East -> Monkey Dance." },
        { id: "480", type: "POINTER", content: "You finished the dance. The crowd cheers. Check Ref 499." },
        { id: "499", type: "TREASURE", content: "Dancer's Boots found." }
      ]
    }
  ]
};
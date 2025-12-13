import { BookData, TerrainType, GridData, Reference } from "../types";

// --- Helpers ---
const createGrid = (fill: TerrainType = TerrainType.EMPTY): GridData => {
  return Array(10).fill(null).map(() => 
    Array(10).fill(null).map(() => ({ terrain: fill }))
  );
};

const addBorder = (grid: GridData, terrain: TerrainType = TerrainType.ROCK) => {
  for(let i=0; i<10; i++) {
    grid[0][i].terrain = terrain;
    grid[9][i].terrain = terrain;
    grid[i][0].terrain = terrain;
    grid[i][9].terrain = terrain;
  }
};

// --- Page-Specific Reference Aggregator ---
const page1Refs: Reference[] = [];
const page2Refs: Reference[] = [];
const page3Refs: Reference[] = [];
const page4Refs: Reference[] = [];
const page5Refs: Reference[] = [];
const page6Refs: Reference[] = [];

// ==========================================
// GRIDS & TOPOGRAPHY
// ==========================================

// --- PAGE 1: Sandy Shores ---
const grid1 = createGrid(TerrainType.SAND);
// Water West
for(let y=0;y<10;y++) { grid1[y][0].terrain = TerrainType.WATER; grid1[y][1].terrain = TerrainType.WATER; }
grid1[2][2].terrain = TerrainType.WATER; grid1[3][2].terrain = TerrainType.WATER;
// Landmarks
grid1[0][2].terrain = TerrainType.START; grid1[0][2].label = "Dock"; grid1[0][2].refId = "105"; // Dock with Ref
grid1[5][5].terrain = TerrainType.ROCK; grid1[5][5].label = "Skull Rock"; grid1[5][5].refId = "150"; // Hunt 3 Start
grid1[2][8].terrain = TerrainType.PARROT; grid1[2][8].refId = "120"; // Hunt 1 Step (Was TREE)
grid1[8][8].terrain = TerrainType.HOUSE; grid1[8][8].label = "Shop"; grid1[8][8].refId = "190"; // Hunt 4 (Merchant) Start
grid1[4][9].terrain = TerrainType.START; grid1[4][9].label = "Jungle"; grid1[4][9].refId = "199"; // Hunt 2 Path
// Hunt 8 (Migrating Shell) - Step 0 (x=0)
grid1[9][0].terrain = TerrainType.SHELL; 

// Hunt 4 (Merchant) Setup - The Coin Square
// Shop is at (8,8). We form a square with (6,8), (6,6), (8,6).
grid1[6][6].terrain = TerrainType.COIN; grid1[6][6].refId = "166"; // Corner
grid1[8][6].terrain = TerrainType.COIN; grid1[8][6].refId = "186"; // Corner
grid1[6][8].terrain = TerrainType.COIN; grid1[6][8].refId = "168"; // Corner

// Hunt 4 (Merchant) - Decoy Coins (4 scattered)
grid1[4][2].terrain = TerrainType.COIN; grid1[4][2].refId = "142";
grid1[7][3].terrain = TerrainType.COIN; grid1[7][3].refId = "173";
grid1[2][6].terrain = TerrainType.COIN; grid1[2][6].refId = "126";
grid1[5][1].terrain = TerrainType.COIN; grid1[5][1].refId = "151";

// --- PAGE 2: Dense Jungle ---
const grid2 = createGrid(TerrainType.TREE);
// Clear Paths
for(let x=0; x<10; x++) grid2[4][x].terrain = TerrainType.EMPTY; // Horiz Path
for(let y=0; y<10; y++) grid2[y][5].terrain = TerrainType.EMPTY; // Vert Path
// Landmarks
grid2[4][0].terrain = TerrainType.START; grid2[4][0].label = "Beach";
grid2[4][9].terrain = TerrainType.START; grid2[4][9].label = "Canyon"; grid2[4][9].refId = "299"; // Hunt 2
grid2[1][1].terrain = TerrainType.ROCK; grid2[1][1].refId = "250"; // Hunt 1
grid2[7][8].terrain = TerrainType.GEM; grid2[7][8].refId = "280"; // Hunt 3 Gem
grid2[3][3].terrain = TerrainType.GEM; grid2[3][3].refId = "281"; // Hunt 3 Gem 2
grid2[2][2].terrain = TerrainType.TREE; // Was Coin, now Tree
// Hunt 8 (Migrating Shell) - Step 1 (x=2)
grid2[9][2].terrain = TerrainType.SHELL; 

// Hunt 6 (Monkey Dance) Setup - P2
grid2[6][2].terrain = TerrainType.START; grid2[6][2].label = "Monkey Spot"; grid2[6][2].refId = "260";
grid2[6][2].terrain = TerrainType.START; 
grid2[5][2].terrain = TerrainType.EMPTY; grid2[4][2].terrain = TerrainType.EMPTY;
grid2[4][3].terrain = TerrainType.EMPTY; grid2[4][4].terrain = TerrainType.EMPTY;
grid2[5][4].terrain = TerrainType.X_MARK; grid2[5][4].refId = "275"; // Dance Landing

// Hunt 7 (Unique Grotto) Endpoints - Hidden in jungle
grid2[1][8].terrain = TerrainType.ROCK; grid2[1][8].refId = "221"; // Decoy
grid2[8][1].terrain = TerrainType.ROCK; grid2[8][1].refId = "222"; // Decoy
grid2[0][5].terrain = TerrainType.CHEST; grid2[0][5].refId = "223"; // Real Treasure

// --- PAGE 3: Volcano Canyon ---
const grid3 = createGrid(TerrainType.SAND); 
addBorder(grid3, TerrainType.ROCK);
// River
for(let y=0;y<10;y++) { grid3[y][4].terrain = TerrainType.WATER; grid3[y][5].terrain = TerrainType.WATER; }
grid3[4][4].terrain = TerrainType.SAND; grid3[4][5].terrain = TerrainType.SAND; // Bridge
// Landmarks
grid3[4][0].terrain = TerrainType.START; grid3[4][0].label = "Jungle";
grid3[4][9].terrain = TerrainType.ROCK; 
grid3[1][8].terrain = TerrainType.CHEST; grid3[1][8].refId = "399"; // Hunt 1 End
grid3[0][0].terrain = TerrainType.START; grid3[0][0].label = "Start"; // Old Hunt 5
grid3[5][4].terrain = TerrainType.CHEST; grid3[5][4].refId = "354"; // Old Hunt 5 End (kept as scenery)
grid3[8][8].terrain = TerrainType.SAND; // Was Coin
// Hunt 8 (Migrating Shell) - Step 2 (x=4)
grid3[9][4].terrain = TerrainType.SHELL; 

// Hunt 2 (Border Patrol) Finale
grid3[4][8].terrain = TerrainType.START; grid3[4][8].label = "Sign"; grid3[4][8].refId = "305"; 
grid3[7][8].terrain = TerrainType.CHEST; grid3[7][8].label = "Supply"; grid3[7][8].refId = "205"; // Treasure

// Hunt 7 (Unique Grotto) Setup
grid3[8][0].terrain = TerrainType.START; grid3[8][0].label = "Quest"; grid3[8][0].refId = "390"; 
grid3[7][1].terrain = TerrainType.ROCK; 
grid3[7][2].terrain = TerrainType.ROCK; 
grid3[7][3].terrain = TerrainType.ROCK;
// The Grotto Entrance (Was Volcano)
grid3[8][2].terrain = TerrainType.ROCK; grid3[8][2].label = "Cave"; grid3[8][2].refId = "366"; 

// Hunt 6 (Monkey Dance) Setup - P3
grid3[6][2].terrain = TerrainType.X_MARK; grid3[6][2].refId = "360"; // Dance Start 2
grid3[4][3].terrain = TerrainType.WATER; 
grid3[4][2].terrain = TerrainType.SAND; 
grid3[4][3].terrain = TerrainType.SAND; 
grid3[4][4].terrain = TerrainType.SAND; 
grid3[5][4].terrain = TerrainType.CHEST; grid3[5][4].refId = "375"; // Dance End

// --- PAGE 4: Function Forest ---
const grid4 = createGrid(TerrainType.EMPTY);
addBorder(grid4, TerrainType.TREE); 
grid4[5][5].terrain = TerrainType.START; grid4[5][5].label = "Lab"; grid4[5][5].refId = "450"; // Hunt 6 Def
grid4[2][2].terrain = TerrainType.TREE; grid4[2][2].refId = "490"; // Hunt 7 Script
grid4[8][2].terrain = TerrainType.TREE; // Was Coin
// Hunt 8 (Migrating Shell) - Step 3 (TARGET x=6)
grid4[9][6].terrain = TerrainType.SHELL; grid4[9][6].refId = "411";

// --- PAGE 5: Deep Archive ---
const grid5 = createGrid(TerrainType.EMPTY);
addBorder(grid5, TerrainType.ROCK);
// Gems (Spread out randomly, no IDs for counting exercise)
grid5[1][2].terrain = TerrainType.GEM; 
grid5[6][7].terrain = TerrainType.GEM;
grid5[3][8].terrain = TerrainType.GEM; 
grid5[6][1].terrain = TerrainType.GEM;
// Hunt 8 (Migrating Shell) - Step 4 (x=8)
grid5[9][8].terrain = TerrainType.SHELL; 

// Landmarks
grid5[0][5].terrain = TerrainType.HOUSE; grid5[0][5].label = "Vault"; grid5[0][5].refId = "555"; // Hunt 4 End
grid5[9][5].terrain = TerrainType.CHEST; grid5[9][5].label = "Sum"; grid5[9][5].refId = "506"; // Hunt 3 End
grid5[2][5].terrain = TerrainType.CHEST; grid5[2][5].label = "Set"; grid5[2][5].refId = "599"; // Hunt 8 End

// Hunt 5 (Binary Search) Setup
// Row of Chests: 510, 520, 530, 540, 550, 560, 570
for(let i=1; i<=7; i++) {
  const id = (500 + i*10).toString();
  grid5[8][i].terrain = TerrainType.CHEST; 
  grid5[8][i].label = id; 
  grid5[8][i].refId = id;
}

// --- PAGE 6: The Glittering Grotto ---
const grid6 = createGrid(TerrainType.ROCK);

// --- Entrance ---
grid6[9][5].terrain = TerrainType.START; grid6[9][5].label = "In"; grid6[9][5].refId = "600";
grid6[8][5].terrain = TerrainType.COIN; grid6[8][5].label = "3";
grid6[7][5].terrain = TerrainType.COIN; grid6[7][5].label = "4"; // Split point

// --- Path A (Left) ---
// Sequence: 3, 4, 8, 5, 9, 5(Dupe)
grid6[7][4].terrain = TerrainType.COIN; grid6[7][4].label = "8";
grid6[7][3].terrain = TerrainType.COIN; grid6[7][3].label = "7";
grid6[6][3].terrain = TerrainType.COIN; grid6[6][3].label = "5";
grid6[5][3].terrain = TerrainType.COIN; grid6[5][3].label = "9";
grid6[4][3].terrain = TerrainType.COIN; grid6[4][3].label = "1";
grid6[4][2].terrain = TerrainType.COIN; grid6[4][2].label = "5"; // Duplicate
grid6[4][1].terrain = TerrainType.START; grid6[4][1].label = "Out A"; grid6[4][1].refId = "601";

// --- Path B (Right) ---
// Sequence: 3, 4, 7, 2, 10, 2(Dupe)
grid6[7][6].terrain = TerrainType.COIN; grid6[7][6].label = "7";
grid6[7][7].terrain = TerrainType.COIN; grid6[7][7].label = "1";
grid6[6][7].terrain = TerrainType.COIN; grid6[6][7].label = "2";
grid6[5][7].terrain = TerrainType.COIN; grid6[5][7].label = "10";
grid6[5][8].terrain = TerrainType.COIN; grid6[5][8].label = "2"; // Duplicate
grid6[4][8].terrain = TerrainType.START; grid6[4][8].label = "Out B"; grid6[4][8].refId = "602";

// --- Path C (Center) ---
// Sequence: 3, 4, 1, 12, 5, 6, 10 (Unique)
grid6[6][5].terrain = TerrainType.COIN; grid6[6][5].label = "1";
grid6[5][5].terrain = TerrainType.COIN; grid6[5][5].label = "12";
grid6[4][5].terrain = TerrainType.COIN; grid6[4][5].label = "5";
grid6[3][5].terrain = TerrainType.COIN; grid6[3][5].label = "6";
grid6[2][5].terrain = TerrainType.COIN; grid6[2][5].label = "10";
grid6[1][5].terrain = TerrainType.START; grid6[1][5].label = "Out C"; grid6[1][5].refId = "603";


// ==========================================
// REFERENCES (Grouped by Hunt)
// ==========================================

// Hunt 1: Inter-Island Pointers
page1Refs.push({ id: "101", type: "CLUE", content: "My first map piece is in the Ancient Ruin, Ref 250. Go there." });
page2Refs.push({ id: "250", type: "POINTER", content: "Ancient Ruin. 'The Blue Parrot will help you (Ref 120)." });
page1Refs.push({ id: "120", type: "POINTER", content: "A blue parrot squawks: 'Treasure, Ref 399. Treasure, Ref 399'." });
page3Refs.push({ id: "399", type: "TREASURE", content: "My first treasure! You followed the pointers across 3 maps!" });

// Hunt 2: Border Patrol
page2Refs.push({ id: "210", type: "CLUE", content: "Patrol the border of Page 1. Start at the Dock (Ref 105)." });
page1Refs.push({ id: "105", type: "POINTER", content: "Move East until you hit a wall or water, then move South until you hit the map edge. Read the sign there." });
page1Refs.push({ id: "199", type: "POINTER", content: "You enter Page 2 at the West opening (Beach). Then go East." });
page2Refs.push({ id: "299", type: "POINTER", content: "You enter Page 3 at the West opening (Jungle). Then go East." });
page3Refs.push({ id: "305", type: "POINTER", content: "A wooden sign points South. Follow it!" });
page3Refs.push({ id: "205", type: "TREASURE", content: "Patrol Complete! You found the hidden supply cache." });

// Hunt 3: Global Sum
page1Refs.push({ id: "150", type: "PUZZLE", content: "A rock shaped like a skull. Etching: 'Count Gems on Page 2 + Gems on Page 5. Add 500. The sum is the Treasure ID on Page 5.'" });
page2Refs.push({ id: "280", type: "TREASURE", content: "A Shiny Gem." });
page2Refs.push({ id: "281", type: "TREASURE", content: "A Shiny Gem." });
page5Refs.push({ id: "506", type: "TREASURE", content: "The gem mine! You counted 2 gems on Page 2 and 4 gems on Page 5." });

// Hunt 4: Merchant's Quest (Square Geometry + Sum)
page1Refs.push({ id: "190", type: "POINTER", content: "Shopkeeper: 'Find the 3 coins that form a perfect 2x2 square with my Shop on this map. Sum them up + 500 to find the Vault.'" });
page1Refs.push({ id: "166", type: "COIN", content: "Gold Coin. Value: 20." });
page1Refs.push({ id: "186", type: "COIN", content: "Gold Coin. Value: 15." });
page1Refs.push({ id: "168", type: "COIN", content: "Gold Coin. Value: 20." });
// Decoy Coins
page1Refs.push({ id: "142", type: "COIN", content: "Gold Coin. Value: 1." });
page1Refs.push({ id: "173", type: "COIN", content: "Gold Coin. Value: 5." });
page1Refs.push({ id: "126", type: "COIN", content: "Gold Coin. Value: 10." });
page1Refs.push({ id: "151", type: "COIN", content: "Gold Coin. Value: 2." });
// Finale
page5Refs.push({ id: "555", type: "TREASURE", content: "You found the vault!" });

// Hunt 5: Binary Beach (Page Flipping)
// Clues pointing to remote keys
page5Refs.push({ id: "510", type: "PUZZLE", content: "Empty. Check Ref 215 for a clue." });
page5Refs.push({ id: "520", type: "PUZZLE", content: "Empty. Check Ref 340 for a clue." });
page5Refs.push({ id: "530", type: "TREASURE", content: "CORRECT! You narrowed it down." });
page5Refs.push({ id: "540", type: "PUZZLE", content: "This safe is empty. Check Ref 440 for a clue." });
page5Refs.push({ id: "550", type: "PUZZLE", content: "Empty. Check Ref 460 for a clue." });
page5Refs.push({ id: "560", type: "PUZZLE", content: "Empty. Check Ref 460 for a clue" });
page5Refs.push({ id: "570", type: "PUZZLE", content: "Empty. Check Ref 460 for a clue" });

// The Keys (Hints) - placed in free slots to avoid collisions
page2Refs.push({ id: "215", type: "CLUE", content: "Inside Chest 510 is a note: 'The Treasure ID is HIGHER than 510'." }); 
page3Refs.push({ id: "340", type: "CLUE", content: "Inside Chest 520 is a note: 'The Treasure ID is HIGHER than 520'." }); 
page4Refs.push({ id: "440", type: "CLUE", content: "Inside Chest 540 is a note: 'The Treasure ID is LOWER than 540'." }); 
page4Refs.push({ id: "460", type: "CLUE", content: "Inside Chest 550 is a note: 'The Treasure ID is LOWER than 550'." }); 

// Hunt 6: Monkey Dance
page4Refs.push({ id: "450", type: "CLUE", content: "MONKEY_DANCE: Step North, Step North, Step East, Step East, Step South. (N-N-E-E-S)." });
page2Refs.push({ id: "260", type: "CLUE", content: "To find the treasure, you must first learn the dance! Ref 450. Then return here and perform it." });
page2Refs.push({ id: "275", type: "POINTER", content: "Good dance! Now go to Ref 360 and perform MONKEY_DANCE again." });
page3Refs.push({ id: "360", type: "CLUE", content: "Perform MONKEY_DANCE starting here." });
page3Refs.push({ id: "375", type: "TREASURE", content: "MONKEY MASTER! You find the treasure." });

// Hunt 7: The Grotto of Uniqueness
page3Refs.push({ id: "390", type: "CLUE", content: "This treasure lies beyond the Glittering Grotto. Go East and enter the Cave.'" });
page3Refs.push({ id: "366", type: "POINTER", content: "You enter the dark cave. Find Ref 600." });
// Page 6 Refs
page6Refs.push({ id: "600", type: "CLUE", content: "Grotto: Follow the path of coins. The correct path NEVER has the same coin value twice." });
page6Refs.push({ id: "601", type: "POINTER", content: "Tunnel Exit A. Check Ref 221 on Page 2." });
page6Refs.push({ id: "602", type: "POINTER", content: "Tunnel Exit B. Check Ref 222 on Page 2." });
page6Refs.push({ id: "603", type: "POINTER", content: "Tunnel Exit C. Check Ref 223 on Page 2." });
// Page 2 Results
page2Refs.push({ id: "221", type: "DECOY", content: "A dead end. The path you took had duplicate coins." });
page2Refs.push({ id: "222", type: "DECOY", content: "Nothing here but spiders. The path you took had duplicate coins." });
page2Refs.push({ id: "223", type: "TREASURE", content: "You found the treasure! You chose the path with no duplicate values." });


// Hunt 8: The Migrating Shell (Iteration)
page1Refs.push({ id: "100", type: "CLUE", content: "A rare shell moves 2 steps East on every page. Find the shell after 4 iterations to find a clue." });
page4Refs.push({ id: "411", type: "POINTER", content: "You found the Migrating Shell! The Key is 590 + the column of the shell at the next iteration." });
page5Refs.push({ id: "599", type: "TREASURE", content: "ITERATION MASTER! You predicted the movement of the shell." });


page4Refs.push({ id: "490", type: "CLUE", content: "A very nice flower." }); 

// --- Flavor Refs (Decoys) ---
const addFlavor = (
  grid: GridData, 
  refs: Reference[], 
  startId: number, 
  targetTypes: TerrainType[] = [TerrainType.CHEST, TerrainType.GEM, TerrainType.COIN]
) => {
  let id = startId;
  grid.forEach(row => row.forEach(cell => {
    // Add decoy refs to specified types that don't have one
    if (targetTypes.includes(cell.terrain)) {
      if (!cell.refId) {
        cell.refId = id.toString();
        refs.push({ id: id.toString(), type: 'DECOY', content: "Empty." });
        id++;
      }
    }
  }));
};
// Use default types for Page 5 but exclude GEM to ensure they have no IDs for the counting puzzle
addFlavor(grid5, page5Refs, 581, [TerrainType.CHEST, TerrainType.COIN]);
addFlavor(grid2, page2Refs, 285); // Default behavior

export const STATIC_BOOK: BookData = {
  title: "The Pirate Archipelalgo",
  intro: "Pick a hunt, go to the starting reference ID, and follow the instructions to jump between pages until you find the treasure!",
  hunts: [
    {
      id: "hunt1", name: "1. The Inter-Island Pointers", difficulty: "Easy", startRefId: "101",
      description: "Follow the trail across 3 different islands.", topic: "Pointers", concept: "Following references.",
      solutionPath: [{ refId: "101", description: "Start P1", expectedPage: 1 }, { refId: "250", description: "To P2", expectedPage: 2 }, { refId: "120", description: "To P1", expectedPage: 1 }, { refId: "399", description: "To P3 Treasure", expectedPage: 3 }]
    },
    {
      id: "hunt2", name: "2. The Border Patrol", difficulty: "Medium", startRefId: "210",
      description: "Execute a loop.", topic: "Loops", concept: "Iteration until condition met.",
      solutionPath: [
          { refId: "210", description: "Start P1", expectedPage: 1 }, 
          { refId: "199", description: "Hit P1 Edge", expectedPage: 1 }, 
          { refId: "299", description: "Cross P2", expectedPage: 2 },
          { refId: "305", description: "Sign in Canyon", expectedPage: 3 },
          { refId: "205", description: "Finish P3", expectedPage: 3 }
      ]
    },
    {
      id: "hunt3", name: "3. The Global Sum", difficulty: "Hard", startRefId: "150",
      description: "Sum items.", topic: "Distributed Computing", concept: "Aggregating data.",
      solutionPath: [{ refId: "150", description: "Start P1", expectedPage: 1 }, { refId: "506", description: "Sum 6 + 500", expectedPage: 5 }]
    },
    {
      id: "hunt4", name: "4. The Merchant's Quest", difficulty: "Medium", startRefId: "190",
      description: "Find the square of coins on P1.", topic: "Geometry", concept: "Pattern recognition & Sum.",
      solutionPath: [
        { refId: "190", description: "Start Shop P1", expectedPage: 1 },
        { refId: "166", description: "Coin (20) at (6,6)", expectedPage: 1 },
        { refId: "186", description: "Coin (15) at (8,6)", expectedPage: 1 },
        { refId: "168", description: "Coin (20) at (6,8)", expectedPage: 1 },
        { refId: "555", description: "Vault P5 (Sum 55)", expectedPage: 5 }
      ]
    },
    {
      id: "hunt5", name: "5. The Binary Beach", difficulty: "Hard", startRefId: "540",
      description: "Check chests on P5 using hints from other pages.", topic: "Binary Search", concept: "O(log n) search.",
      solutionPath: [
        { refId: "540", description: "Start Middle P5. Go P4.", expectedPage: 5 },
        { refId: "440", description: "Hint: LOWER.", expectedPage: 4 },
        { refId: "520", description: "Check 520 P5. Go P3.", expectedPage: 5 },
        { refId: "340", description: "Hint: HIGHER. Must be 530.", expectedPage: 3 },
        { refId: "530", description: "Treasure P5.", expectedPage: 5 }
      ]
    },
    {
      id: "hunt6", name: "6. The Monkey Dance", difficulty: "Medium", startRefId: "260",
      description: "Pattern: N-N-E-E-S.", topic: "Functions", concept: "Reusing code patterns.",
      solutionPath: [
        { refId: "260", description: "Start P2. Dance.", expectedPage: 2 },
        { refId: "275", description: "Land (4,5). Go P3.", expectedPage: 2 },
        { refId: "360", description: "Start P3. Dance.", expectedPage: 3 },
        { refId: "375", description: "Land (5,4). Treasure.", expectedPage: 3 }
      ]
    },
    {
      id: "hunt7", name: "7. The Grotto of Uniqueness", difficulty: "Medium", startRefId: "390",
      description: "Find the path with unique coin values.", topic: "Sets / Hashing", concept: "Detecting duplicates.",
      solutionPath: [
        { refId: "390", description: "Start P3 Quest.", expectedPage: 3 },
        { refId: "366", description: "Find Cave P3.", expectedPage: 3 },
        { refId: "600", description: "Enter Grotto P6.", expectedPage: 6 },
        { refId: "603", description: "Path C (Unique).", expectedPage: 6 },
        { refId: "223", description: "P2 Treasure.", expectedPage: 2 }
      ]
    },
    {
      id: "hunt8", name: "8. The Migrating Shell", difficulty: "Hard", startRefId: "100",
      description: "Track the moving shell (i++).", topic: "Iteration", concept: "Variable dependent on index.",
      solutionPath: [
        { refId: "100", description: "Start P1 Clue.", expectedPage: 1 },
        { refId: "411", description: "Found Shell on P4 (9,6).", expectedPage: 4 },
        { refId: "599", description: "Treasure P5.", expectedPage: 5 }
      ]
    }
  ],
  pages: [
    { pageNumber: 1, title: "Sandy Shores", grid: grid1, references: page1Refs },
    { pageNumber: 2, title: "Dense Jungle", grid: grid2, references: page2Refs },
    { pageNumber: 3, title: "Volcano Canyon", grid: grid3, references: page3Refs },
    { pageNumber: 4, title: "Function Forest", grid: grid4, references: page4Refs },
    { pageNumber: 5, title: "Deep Archive", grid: grid5, references: page5Refs },
    { pageNumber: 6, title: "The Glittering Grotto", grid: grid6, references: page6Refs },
  ]
};
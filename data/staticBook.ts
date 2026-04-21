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
const page7Refs: Reference[] = [];
const page8Refs: Reference[] = [];
const page9Refs: Reference[] = [];
const page10Refs: Reference[] = [];

// ==========================================
// GRIDS & TOPOGRAPHY
// ==========================================

// --- PAGE 1: Sandy Shores ---
const grid1 = createGrid(TerrainType.SAND);
// Water West
for(let y=0;y<10;y++) { grid1[y][0].terrain = TerrainType.WATER; grid1[y][1].terrain = TerrainType.WATER; }
grid1[2][2].terrain = TerrainType.WATER; grid1[3][2].terrain = TerrainType.WATER;
// Landmarks
grid1[0][2].terrain = TerrainType.START; grid1[0][2].label = "Dock"; grid1[0][2].refId = "1.05"; // Dock with Ref
grid1[5][5].terrain = TerrainType.ROCK; grid1[5][5].label = "Skull Rock"; grid1[5][5].refId = "1.50"; // Hunt 3 Start
grid1[2][8].terrain = TerrainType.PARROT; grid1[2][8].refId = "1.20"; // Hunt 1 Step (Was TREE)
grid1[8][8].terrain = TerrainType.HOUSE; grid1[8][8].label = "Shop"; grid1[8][8].refId = "1.90"; // Hunt 4 (Merchant) Start
grid1[4][9].terrain = TerrainType.START; grid1[4][9].label = "Jungle"; grid1[4][9].refId = "1.99"; // Hunt 2 Path
// Hunt 8 (Migrating Shell) - Step 0 (x=0)
grid1[9][0].terrain = TerrainType.SHELL; 

// Hunt 4 (Merchant) Setup - The Coin Square
// Shop is at (8,8). We form a square with (6,8), (6,6), (8,6).
grid1[6][6].terrain = TerrainType.COIN; grid1[6][6].refId = "1.66"; // Corner
grid1[8][6].terrain = TerrainType.COIN; grid1[8][6].refId = "1.86"; // Corner
grid1[6][8].terrain = TerrainType.COIN; grid1[6][8].refId = "1.68"; // Corner

// Hunt 4 (Merchant) - Decoy Coins (4 scattered)
grid1[4][2].terrain = TerrainType.COIN; grid1[4][2].refId = "1.42";
grid1[7][3].terrain = TerrainType.COIN; grid1[7][3].refId = "1.73";
grid1[2][6].terrain = TerrainType.COIN; grid1[2][6].refId = "1.26";
grid1[5][1].terrain = TerrainType.COIN; grid1[5][1].refId = "1.51";

// --- PAGE 2: Dense Jungle ---
const grid2 = createGrid(TerrainType.TREE);
// Clear Paths
for(let x=0; x<10; x++) grid2[4][x].terrain = TerrainType.EMPTY; // Horiz Path
for(let y=0; y<10; y++) grid2[y][5].terrain = TerrainType.EMPTY; // Vert Path
// Landmarks
grid2[4][0].terrain = TerrainType.START; grid2[4][0].label = "Beach";
grid2[4][9].terrain = TerrainType.START; grid2[4][9].label = "Canyon"; grid2[4][9].refId = "2.99"; // Hunt 2
grid2[1][1].terrain = TerrainType.ROCK; grid2[1][1].refId = "2.50"; // Hunt 1
grid2[7][8].terrain = TerrainType.GEM; grid2[7][8].refId = "2.80"; // Hunt 3 Gem
grid2[3][3].terrain = TerrainType.GEM; grid2[3][3].refId = "2.81"; // Hunt 3 Gem 2
grid2[2][2].terrain = TerrainType.TREE; // Was Coin, now Tree
// Hunt 8 (Migrating Shell) - Step 1 (x=2)
grid2[9][2].terrain = TerrainType.SHELL; 

// Hunt 6 (Monkey Dance) Setup - P2
grid2[6][2].terrain = TerrainType.START; grid2[6][2].label = "Monkey Spot"; grid2[6][2].refId = "2.60";
grid2[6][2].terrain = TerrainType.START; 
grid2[5][2].terrain = TerrainType.EMPTY; grid2[4][2].terrain = TerrainType.EMPTY;
grid2[4][3].terrain = TerrainType.EMPTY; grid2[4][4].terrain = TerrainType.EMPTY;
grid2[5][4].terrain = TerrainType.X_MARK; grid2[5][4].refId = "2.75"; // Dance Landing

// Hunt 7 (Unique Grotto) Endpoints - Hidden in jungle
grid2[1][8].terrain = TerrainType.ROCK; grid2[1][8].refId = "2.21"; // Decoy
grid2[8][1].terrain = TerrainType.ROCK; grid2[8][1].refId = "2.22"; // Decoy
grid2[0][5].terrain = TerrainType.CHEST; grid2[0][5].refId = "2.23"; // Real Treasure

// --- PAGE 3: Volcano Canyon ---
const grid3 = createGrid(TerrainType.SAND); 
addBorder(grid3, TerrainType.ROCK);
// River
for(let y=0;y<10;y++) { grid3[y][4].terrain = TerrainType.WATER; grid3[y][5].terrain = TerrainType.WATER; }
grid3[4][4].terrain = TerrainType.SAND; grid3[4][5].terrain = TerrainType.SAND; // Bridge
// Landmarks
grid3[4][0].terrain = TerrainType.START; grid3[4][0].label = "Jungle";
grid3[4][9].terrain = TerrainType.ROCK; 
grid3[1][8].terrain = TerrainType.CHEST; grid3[1][8].refId = "3.99"; // Hunt 1 End
grid3[0][0].terrain = TerrainType.START; grid3[0][0].label = "Start"; // Old Hunt 5
grid3[5][4].terrain = TerrainType.CHEST; grid3[5][4].refId = "3.54"; // Old Hunt 5 End (kept as scenery)
grid3[8][8].terrain = TerrainType.SAND; // Was Coin
// Hunt 8 (Migrating Shell) - Step 2 (x=4)
grid3[9][4].terrain = TerrainType.SHELL; 

// Hunt 2 (Border Patrol) Finale
grid3[4][8].terrain = TerrainType.START; grid3[4][8].label = "Sign"; grid3[4][8].refId = "3.05"; 
grid3[7][8].terrain = TerrainType.CHEST; grid3[7][8].label = "Supply"; grid3[7][8].refId = "3.04"; // Treasure

// Hunt 7 (Unique Grotto) Setup
grid3[8][0].terrain = TerrainType.START; grid3[8][0].label = "Quest"; grid3[8][0].refId = "3.90"; 
grid3[7][1].terrain = TerrainType.ROCK; 
grid3[7][2].terrain = TerrainType.ROCK; 
grid3[7][3].terrain = TerrainType.ROCK;
// The Grotto Entrance (Was Volcano)
grid3[8][2].terrain = TerrainType.ROCK; grid3[8][2].label = "Cave"; grid3[8][2].refId = "3.66"; 

// Hunt 6 (Monkey Dance) Setup - P3
grid3[6][2].terrain = TerrainType.X_MARK; grid3[6][2].refId = "3.60"; // Dance Start 2
grid3[4][3].terrain = TerrainType.WATER; 
grid3[4][2].terrain = TerrainType.SAND; 
grid3[4][3].terrain = TerrainType.SAND; 
grid3[4][4].terrain = TerrainType.SAND; 
grid3[5][4].terrain = TerrainType.CHEST; grid3[5][4].refId = "3.75"; // Dance End

// --- PAGE 4: Function Forest ---
const grid4 = createGrid(TerrainType.EMPTY);
addBorder(grid4, TerrainType.TREE); 
grid4[5][5].terrain = TerrainType.START; grid4[5][5].label = "Lab"; grid4[5][5].refId = "4.50"; // Hunt 6 Def
grid4[2][2].terrain = TerrainType.TREE; grid4[2][2].refId = "4.90"; // Hunt 7 Script
grid4[8][2].terrain = TerrainType.TREE; // Was Coin
// Hunt 8 (Migrating Shell) - Step 3 (TARGET x=6)
grid4[9][6].terrain = TerrainType.SHELL; grid4[9][6].refId = "4.11";

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
grid5[0][5].terrain = TerrainType.HOUSE; grid5[0][5].label = "Vault"; grid5[0][5].refId = "5.55"; // Hunt 4 End
grid5[9][5].terrain = TerrainType.CHEST; grid5[9][5].label = "Sum"; grid5[9][5].refId = "5.06"; // Hunt 3 End
grid5[2][5].terrain = TerrainType.CHEST; grid5[2][5].label = "Set"; grid5[2][5].refId = "5.99"; // Hunt 8 End

// Hunt 5 (Binary Search) Setup
// Row of Chests: 5.10, 5.20, 5.30, 5.40, 5.50, 5.60, 5.70
for(let i=1; i<=7; i++) {
  const id = `5.${i}0`;
  grid5[8][i].terrain = TerrainType.CHEST; 
  grid5[8][i].label = id; 
  grid5[8][i].refId = id;
}

// --- PAGE 6: The Glittering Grotto ---
const grid6 = createGrid(TerrainType.ROCK);

// --- Entrance ---
grid6[9][5].terrain = TerrainType.START; grid6[9][5].label = "In"; grid6[9][5].refId = "6.00";
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
grid6[4][1].terrain = TerrainType.START; grid6[4][1].label = "Out A"; grid6[4][1].refId = "6.01";

// --- Path B (Right) ---
// Sequence: 3, 4, 7, 2, 10, 2(Dupe)
grid6[7][6].terrain = TerrainType.COIN; grid6[7][6].label = "7";
grid6[7][7].terrain = TerrainType.COIN; grid6[7][7].label = "1";
grid6[6][7].terrain = TerrainType.COIN; grid6[6][7].label = "2";
grid6[5][7].terrain = TerrainType.COIN; grid6[5][7].label = "10";
grid6[5][8].terrain = TerrainType.COIN; grid6[5][8].label = "2"; // Duplicate
grid6[4][8].terrain = TerrainType.START; grid6[4][8].label = "Out B"; grid6[4][8].refId = "6.02";

// --- Path C (Center) ---
// Sequence: 3, 4, 1, 12, 5, 6, 10 (Unique)
grid6[6][5].terrain = TerrainType.COIN; grid6[6][5].label = "1";
grid6[5][5].terrain = TerrainType.COIN; grid6[5][5].label = "12";
grid6[4][5].terrain = TerrainType.COIN; grid6[4][5].label = "5";
grid6[3][5].terrain = TerrainType.COIN; grid6[3][5].label = "6";
grid6[2][5].terrain = TerrainType.COIN; grid6[2][5].label = "10";
grid6[1][5].terrain = TerrainType.START; grid6[1][5].label = "Out C"; grid6[1][5].refId = "6.03";


// ==========================================
// REFERENCES (Grouped by Hunt)
// ==========================================

// Hunt 1: Inter-Island Pointers
page1Refs.push({ id: "1.01", type: "CLUE", content: "My first map piece is in the Ancient Ruin, Ref 2.50. Go there." });
page2Refs.push({ id: "2.50", type: "POINTER", content: "Ancient Ruin. 'The Blue Parrot will help you (Ref 1.20)." });
page1Refs.push({ id: "1.20", type: "POINTER", content: "A blue parrot squawks: 'Treasure, Ref 3.99. Treasure, Ref 3.99'." });
page3Refs.push({ id: "3.99", type: "TREASURE", content: "My first treasure! You followed the pointers across 3 maps!" });

// Hunt 2: Border Patrol
page2Refs.push({ id: "2.10", type: "CLUE", content: "Patrol the border of Page 1. Start at the Dock (Ref 1.05)." });
page1Refs.push({ id: "1.05", type: "POINTER", content: "Move East until you hit a wall or water, then move South until you hit the map edge. Read the sign there." });
page1Refs.push({ id: "1.99", type: "POINTER", content: "You enter Page 2 at the West opening (Beach). Then go East." });
page2Refs.push({ id: "2.99", type: "POINTER", content: "You enter Page 3 at the West opening (Jungle). Then go East." });
page3Refs.push({ id: "3.05", type: "POINTER", content: "A wooden sign points South. Follow it!" });
page3Refs.push({ id: "3.04", type: "TREASURE", content: "Patrol Complete! You found the hidden supply cache." });

// Hunt 3: Global Sum
page1Refs.push({ id: "1.50", type: "PUZZLE", content: "A rock shaped like a skull. Etching: 'Count Gems on Page 2 + Gems on Page 5. Add 500. The sum is the Treasure ID on Page 5.'" });
page2Refs.push({ id: "2.80", type: "TREASURE", content: "A Shiny Gem." });
page2Refs.push({ id: "2.81", type: "TREASURE", content: "A Shiny Gem." });
page5Refs.push({ id: "5.06", type: "TREASURE", content: "The gem mine! You counted 2 gems on Page 2 and 4 gems on Page 5." });

// Hunt 4: Merchant's Quest (Square Geometry + Sum)
page1Refs.push({ id: "1.90", type: "POINTER", content: "Shopkeeper: 'Find the 3 coins that form a perfect 2x2 square with my Shop on this map. Sum them up + 500 to find the Vault.'" });
page1Refs.push({ id: "1.66", type: "COIN", content: "Gold Coin. Value: 20." });
page1Refs.push({ id: "1.86", type: "COIN", content: "Gold Coin. Value: 15." });
page1Refs.push({ id: "1.68", type: "COIN", content: "Gold Coin. Value: 20." });
// Decoy Coins
page1Refs.push({ id: "1.42", type: "COIN", content: "Gold Coin. Value: 1." });
page1Refs.push({ id: "1.73", type: "COIN", content: "Gold Coin. Value: 5." });
page1Refs.push({ id: "1.26", type: "COIN", content: "Gold Coin. Value: 10." });
page1Refs.push({ id: "1.51", type: "COIN", content: "Gold Coin. Value: 2." });
// Finale
page5Refs.push({ id: "5.55", type: "TREASURE", content: "You found the vault!" });

// Hunt 5: Binary Beach (Page Flipping)
// Clues pointing to remote keys
page5Refs.push({ id: "5.10", type: "PUZZLE", content: "Empty. Check Ref 2.15 for a clue." });
page5Refs.push({ id: "5.20", type: "PUZZLE", content: "Empty. Check Ref 3.40 for a clue." });
page5Refs.push({ id: "5.30", type: "TREASURE", content: "CORRECT! You narrowed it down." });
page5Refs.push({ id: "5.40", type: "PUZZLE", content: "This safe is empty. Check Ref 4.40 for a clue." });
page5Refs.push({ id: "5.50", type: "PUZZLE", content: "Empty. Check Ref 4.60 for a clue." });
page5Refs.push({ id: "5.60", type: "PUZZLE", content: "Empty. Check Ref 4.60 for a clue" });
page5Refs.push({ id: "5.70", type: "PUZZLE", content: "Empty. Check Ref 4.60 for a clue" });

// The Keys (Hints) - placed in free slots to avoid collisions
page2Refs.push({ id: "2.15", type: "CLUE", content: "Inside Chest 5.10 is a note: 'The Treasure ID is HIGHER than 5.10'." }); 
page3Refs.push({ id: "3.40", type: "CLUE", content: "Inside Chest 5.20 is a note: 'The Treasure ID is HIGHER than 5.20'." }); 
page4Refs.push({ id: "4.40", type: "CLUE", content: "Inside Chest 5.40 is a note: 'The Treasure ID is LOWER than 5.40'." }); 
page4Refs.push({ id: "4.60", type: "CLUE", content: "Inside Chest 5.50 is a note: 'The Treasure ID is LOWER than 5.50'." }); 

// Hunt 6: Monkey Dance
page4Refs.push({ id: "4.50", type: "CLUE", content: "MONKEY_DANCE: Step North, Step North, Step East, Step East, Step South. (N-N-E-E-S)." });
page2Refs.push({ id: "2.60", type: "CLUE", content: "To find the treasure, you must first learn the dance! Ref 4.50. Then return here and perform it." });
page2Refs.push({ id: "2.75", type: "POINTER", content: "Good dance! Now go to Ref 3.60 and perform MONKEY_DANCE again." });
page3Refs.push({ id: "3.60", type: "CLUE", content: "Perform MONKEY_DANCE starting here." });
page3Refs.push({ id: "3.75", type: "TREASURE", content: "MONKEY MASTER! You find the treasure." });

// Hunt 7: The Grotto of Uniqueness
page3Refs.push({ id: "3.90", type: "CLUE", content: "This treasure lies beyond the Glittering Grotto. Go East and enter the Cave.'" });
page3Refs.push({ id: "3.66", type: "POINTER", content: "You enter the dark cave. Find Ref 6.00." });
// Page 6 Refs
page6Refs.push({ id: "6.00", type: "CLUE", content: "Grotto: Follow the path of coins. The correct path NEVER has the same coin value twice." });
page6Refs.push({ id: "6.01", type: "POINTER", content: "Tunnel Exit A. Check Ref 2.21 on Page 2." });
page6Refs.push({ id: "6.02", type: "POINTER", content: "Tunnel Exit B. Check Ref 2.22 on Page 2." });
page6Refs.push({ id: "6.03", type: "POINTER", content: "Tunnel Exit C. Check Ref 2.23 on Page 2." });
// Page 2 Results
page2Refs.push({ id: "2.21", type: "DECOY", content: "A dead end. The path you took had duplicate coins." });
page2Refs.push({ id: "2.22", type: "DECOY", content: "Nothing here but spiders. The path you took had duplicate coins." });
page2Refs.push({ id: "2.23", type: "TREASURE", content: "You found the treasure! You chose the path with no duplicate values." });


// Hunt 8: The Migrating Shell (Iteration)
page1Refs.push({ id: "1.00", type: "CLUE", content: "A rare shell moves 2 steps East on every page. Find the shell after 4 iterations to find a clue." });
page4Refs.push({ id: "4.11", type: "POINTER", content: "You found the Migrating Shell! The Key is 5.90 + the column of the shell at the next iteration." });
page5Refs.push({ id: "5.99", type: "TREASURE", content: "ITERATION MASTER! You predicted the movement of the shell." });


page4Refs.push({ id: "4.90", type: "CLUE", content: "A very nice flower." });

// Hunt 11: Offset Oracle references (created as +10 offsets)
page4Refs.push({ id: "4.60", type: "POINTER", content: "Offset successful! Now go to Ref 1.90." });
page2Refs.push({ id: "2.00", type: "TREASURE", content: "OFFSET MASTER! You successfully applied the +10 transformation to all references." }); 

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
addFlavor(grid5, page5Refs, 5.81, [TerrainType.CHEST, TerrainType.COIN]);
addFlavor(grid2, page2Refs, 2.85); // Default behavior

// ==========================================
// NEW PAGES FOR HUNT 9: The Sunsnake Dance
// ==========================================

// --- PAGE 7: Desert Dance Floor ---
const grid7 = createGrid(TerrainType.SAND);
addBorder(grid7, TerrainType.ROCK);
// Dance starting positions
grid7[2][2].terrain = TerrainType.START; grid7[2][2].refId = "7.00"; // Even reference
grid7[0][5].refId = "7.07";

grid7[4][1].terrain = TerrainType.START; grid7[4][1].refId = "7.11"; // Odd reference
grid7[7][3].terrain = TerrainType.SAND; grid7[7][3].refId = "7.02"; // Odd reference

grid7[4][8].terrain = TerrainType.SAND; grid7[3][7].refId = "7.14"; // Even reference
grid7[5][6].terrain = TerrainType.SAND; grid7[5][6].refId = "7.17"; // Arrival


// --- PAGE 8: Pointer Canyon ---
const grid8 = createGrid(TerrainType.SAND);
addBorder(grid8, TerrainType.ROCK);
// River through middle
for(let x=0; x<10; x++) { grid8[4][x].terrain = TerrainType.WATER; grid8[5][x].terrain = TerrainType.WATER; }
// Pointer start and notes
grid8[1][1].terrain = TerrainType.START; grid8[1][1].label = "Pointer Start"; grid8[1][1].refId = "8.00";
grid8[3][2].terrain = TerrainType.PARROT; grid8[3][2].refId = "8.22";
grid8[3][4].terrain = TerrainType.PARROT;
grid8[8][8].terrain = TerrainType.COIN; 
grid8[7][5].terrain = TerrainType.COIN;

grid8[2][8].terrain = TerrainType.CHEST; grid8[2][8].refId = "8.09";

// --- PAGE 9: Adventure Reference Page ---
const grid9 = createGrid(TerrainType.EMPTY);
addBorder(grid9, TerrainType.ROCK);
grid9[1][1].terrain = TerrainType.PARROT; grid9[1][1].label = "Adventure Index";
grid9[2][2].terrain = TerrainType.COIN; grid9[2][2].label = "10-20";


// Page 7 References (Dance Learning)
page7Refs.push({ id: "7.00", type: "PUZZLE", content: "To find the treasure, you must learn the Sunsnake Dance - NORTH-EAST-EAST-NORTH-EAST. Do it from here." });
page7Refs.push({ id: "7.07", type: "CLUE", content: "You mastered the Sunsnake pattern. There is a twist, if the reference number is odd, the dance is actually SOUTH-EAST-SOUTH-SOUTH-EAST. Go to 7.11." });
page7Refs.push({ id: "7.11", type: "CLUE", content: "Perform the Sunsnake dance from here to find the treasure! Are we on an odd or even reference?" });
page7Refs.push({ id: "7.14", type: "CLUE", content: "Another Sunsnake dance from here!" });
page7Refs.push({ id: "7.02", type: "CLUE", content: "Another Sunsnake dance from here!" });
page7Refs.push({ id: "7.17", type: "TREASURE", content: "Bravo! You finished this hunt!." });

// Page 8 References (Pointer Canyon)
page8Refs.push({ id: "8.00", type: "CLUE", content: "#8.22.\n                   If a reference says #X.Y, do not go to Ref X.Y. Instead go to the map coordinates of where that reference is located. Here, #8.22 brings you to 4.03" });
page4Refs.push({ id: "4.03", type: "POINTER", content: "8.17" }); // Pushing to page4!
page8Refs.push({ id: "8.17", type: "POINTER", content: "#8.09" });
page8Refs.push({ id: "8.07", type: "POINTER", content: "." });
page8Refs.push({ id: "8.04", type: "POINTER", content: "." });
page8Refs.push({ id: "8.02", type: "TREASURE", content: "Pointer master! You resolved the pointer chain correctly." });


// Hunt 11: The Offset Oracle
page9Refs.push({ id: "9.12", type: "CLUE", content: "OFFSET ORACLE: For this hunt, ALL references are offset by +10. When you see 'Ref X.YY', you must go to Ref (X.YY + 10). \n 9.00." });
page9Refs.push({ id: "9.10", type: "CLUE", content: "5.80"});
page5Refs.push({ id: "5.80", type: "CLUE", content: "You should not be there." });
page5Refs.push({ id: "5.90", type: "CLUE", content: "9.10" });
page9Refs.push({ id: "9.20", type: "CLUE", content: "8.10" });
page8Refs.push({ id: "8.20", type: "TREASURE", content: "Offset master! You resolved the pointer chain correctly." });


// Hunt 12: Parallel Processors (Parallel Computing)
page10Refs.push({ id: "10.00", type: "CLUE", content: "Parallel Walkers: Two monkeys will meet where the treasure is hidden. Their walks are described in 10.10 and 10.20. The tresure is hidden in 10.AB" });
page10Refs.push({ id: "10.10", type: "PUZZLE", content: "Monkey A: The monkey goes SOUTH-SOUTH-EAST. The monkey tells you about the rock number they meet." });
page10Refs.push({ id: "10.20", type: "PUZZLE", content: "Monkey B: The monkey goes WEST-SOUTH. The monkey tells you about the rock number they meet." });
page10Refs.push({ id: "10.42", type: "TREASURE", content: "Parallel walks master! Their outputs were successfully combined." });
page10Refs.push({ id: "10.24", type: "PUZZLE", content: "." });
page10Refs.push({ id: "10.47", type: "PUZZLE", content: "." });
page10Refs.push({ id: "10.2", type: "PUZZLE", content: "." });
page10Refs.push({ id: "10.55", type: "PUZZLE", content: "." });
page10Refs.push({ id: "10.64", type: "PUZZLE", content: "." });

// --- PAGE 10: Parallel Processors ---
const grid10 = createGrid(TerrainType.EMPTY);
addBorder(grid10, TerrainType.ROCK);
// Workers and outputs
grid10[1][2].terrain = TerrainType.START; grid10[1][2].label = "Monkey A";
grid10[1][7].terrain = TerrainType.START; grid10[1][7].label = "Monkey B";
grid10[6][1].terrain = TerrainType.ROCK; grid10[6][1].label = "Rock 1";
grid10[6][2].terrain = TerrainType.ROCK; grid10[6][2].label = "Rock 2";
grid10[6][3].terrain = TerrainType.ROCK; grid10[6][3].label = "Rock 3";
grid10[6][4].terrain = TerrainType.ROCK; grid10[6][4].label = "Rock 4";
grid10[6][5].terrain = TerrainType.ROCK; grid10[6][5].label = "Rock 5";
grid10[6][6].terrain = TerrainType.ROCK; grid10[6][6].label = "Rock 6";
grid10[6][7].terrain = TerrainType.ROCK; grid10[6][7].label = "Rock 7";
grid10[6][8].terrain = TerrainType.ROCK; grid10[6][8].label = "Rock 8";




export const STATIC_BOOK: BookData = {
  title: "The Pirate Archipelalgo",
  intro: "Pick a hunt, go to the starting reference ID, and follow the instructions to jump between pages until you find the treasure!",
  hunts: [
    {
      id: "hunt1", name: "1. The Inter-Island Pointers", difficulty: "Easy", startRefId: "1.01",
      description: "Follow the trail across 3 different islands.", topic: "Pointers", concept: "Following references.",
      solutionPath: [{ refId: "1.01", description: "Start P1", expectedPage: 1 }, { refId: "2.50", description: "To P2", expectedPage: 2 }, { refId: "1.20", description: "To P1", expectedPage: 1 }, { refId: "3.99", description: "To P3 Treasure", expectedPage: 3 }]
    },
    {
      id: "hunt2", name: "2. The Border Patrol", difficulty: "Medium", startRefId: "2.10",
      description: "Execute a loop.", topic: "Loops", concept: "Iteration until condition met.",
      solutionPath: [
          { refId: "2.10", description: "Start P1", expectedPage: 1 }, 
          { refId: "1.99", description: "Hit P1 Edge", expectedPage: 1 }, 
          { refId: "2.99", description: "Cross P2", expectedPage: 2 },
          { refId: "3.05", description: "Sign in Canyon", expectedPage: 3 },
          { refId: "3.04", description: "Finish P3", expectedPage: 3 }
      ]
    },
    {
      id: "hunt3", name: "3. The Global Sum", difficulty: "Hard", startRefId: "1.50",
      description: "Sum items.", topic: "Distributed Computing", concept: "Aggregating data.",
      solutionPath: [{ refId: "1.50", description: "Start P1", expectedPage: 1 }, { refId: "5.06", description: "Sum 6 + 500", expectedPage: 5 }]
    },
    {
      id: "hunt4", name: "4. The Merchant's Quest", difficulty: "Medium", startRefId: "1.90",
      description: "Find the square of coins on P1.", topic: "Geometry", concept: "Pattern recognition & Sum.",
      solutionPath: [
        { refId: "1.90", description: "Start Shop P1", expectedPage: 1 },
        { refId: "1.66", description: "Coin (20) at (6,6)", expectedPage: 1 },
        { refId: "1.86", description: "Coin (15) at (8,6)", expectedPage: 1 },
        { refId: "1.68", description: "Coin (20) at (6,8)", expectedPage: 1 },
        { refId: "5.55", description: "Vault P5 (Sum 55)", expectedPage: 5 }
      ]
    },
    {
      id: "hunt5", name: "5. The Binary Beach", difficulty: "Hard", startRefId: "5.40",
      description: "Check chests on P5 using hints from other pages.", topic: "Binary Search", concept: "O(log n) search.",
      solutionPath: [
        { refId: "5.40", description: "Start Middle P5. Go P4.", expectedPage: 5 },
        { refId: "4.40", description: "Hint: LOWER.", expectedPage: 4 },
        { refId: "5.20", description: "Check 5.20 P5. Go P3.", expectedPage: 5 },
        { refId: "3.40", description: "Hint: HIGHER. Must be 5.30.", expectedPage: 3 },
        { refId: "5.30", description: "Treasure P5.", expectedPage: 5 }
      ]
    },
    {
      id: "hunt6", name: "6. The Monkey Dance", difficulty: "Medium", startRefId: "2.60",
      description: "Pattern: N-N-E-E-S.", topic: "Functions", concept: "Reusing code patterns.",
      solutionPath: [
        { refId: "2.60", description: "Start P2. Dance.", expectedPage: 2 },
        { refId: "2.75", description: "Land (4,5). Go P3.", expectedPage: 2 },
        { refId: "3.60", description: "Start P3. Dance.", expectedPage: 3 },
        { refId: "3.75", description: "Land (5,4). Treasure.", expectedPage: 3 }
      ]
    },
    {
      id: "hunt7", name: "7. The Grotto of Uniqueness", difficulty: "Medium", startRefId: "3.90",
      description: "Find the path with unique coin values.", topic: "Sets / Hashing", concept: "Detecting duplicates.",
      solutionPath: [
        { refId: "3.90", description: "Start P3 Quest.", expectedPage: 3 },
        { refId: "3.66", description: "Find Cave P3.", expectedPage: 3 },
        { refId: "6.00", description: "Enter Grotto P6.", expectedPage: 6 },
        { refId: "6.03", description: "Path C (Unique).", expectedPage: 6 },
        { refId: "2.23", description: "P2 Treasure.", expectedPage: 2 }
      ]
    },
    {
      id: "hunt8", name: "8. The Migrating Shell", difficulty: "Hard", startRefId: "1.00",
      description: "Track the moving shell (i++).", topic: "Iteration", concept: "Variable dependent on index.",
      solutionPath: [
        { refId: "1.00", description: "Start P1 Clue.", expectedPage: 1 },
        { refId: "4.11", description: "Found Shell on P4 (9,6).", expectedPage: 4 },
        { refId: "5.99", description: "Treasure P5.", expectedPage: 5 }
      ]
    },
    {
      id: "hunt9", name: "9. The Sunsnake Dance", difficulty: "Hard", startRefId: "7.00",
      description: "Master conditional functions with even/odd logic.", topic: "Conditional Logic", concept: "Functions with different behavior based on input parity.",
      solutionPath: [
        { refId: "7.00", description: "Learn Sunsnake Dance on P7 (even start)", expectedPage: 7 }
      ]
    },
    {
      id: "hunt10", name: "10. The Pointer Oracle", difficulty: "Medium", startRefId: "8.00",
      description: "Learn pointer indirection with ! and !!.", topic: "Pointers", concept: "Resolve a reference to a value, then resolve the pointer again.",
      solutionPath: [
        { refId: "8.00", description: "Read the pointer rule on Page 8.", expectedPage: 8 }
      ]
    },
    {
      id: "hunt11", name: "11. The Offset Oracle", difficulty: "Medium", startRefId: "9.12",
      description: "Apply +10 offset to all references.", topic: "Transformation/Offset", concept: "Applying mathematical transformations to data.",
      solutionPath: [
        { refId: "9.12", description: "Learn offset rule on P9.", expectedPage: 9 },
        { refId: "2.60", description: "2.50 + 10 = 2.60 (monkey dance clue)", expectedPage: 2 },
        { refId: "4.60", description: "4.50 + 10 = 4.60 (offset pointer)", expectedPage: 4 },
        { refId: "2.00", description: "1.90 + 10 = 2.00 (offset treasure)", expectedPage: 2 }
      ]
    },
    {
      id: "hunt12", name: "12. The Parallel Processors", difficulty: "Hard", startRefId: "10.00",
      description: "Run multiple workers at once and combine their outputs.", topic: "Parallel Computing", concept: "Splitting work into concurrent tasks and aggregating results.",
      solutionPath: [
        { refId: "10.00", description: "Launch the parallel workers.", expectedPage: 10 },
        { refId: "42.42", description: "god catch Paul!", expectedPage: 10 },
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
    { pageNumber: 7, title: "Desert Dance Floor", grid: grid7, references: page7Refs },
    { pageNumber: 8, title: "Pointer Canyon", grid: grid8, references: page8Refs },
    { pageNumber: 9, title: "Adventure Reference Page", grid: grid9, references: page9Refs },
    { pageNumber: 10, title: "Parallel Processors", grid: grid10, references: page10Refs },
  ]
};
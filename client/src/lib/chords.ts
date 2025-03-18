import { type ChordData, type DifficultyLevel, difficultyLevels } from "@shared/schema";

// CHORD TYPE DEFINITIONS

// Chord pattern definitions - these are the different chord types regardless of root note
export interface ChordPattern {
  type: string;                 // 'major', 'minor', 'augmented', 'diminished', 'sus2', 'sus4', etc.
  display: string;              // How to display this chord type (e.g., '', 'm', 'aug', 'dim')
  intervals: number[];          // Intervals in semitones from root (0 = root)
  inversion: number;            // 0 = root position, 1 = first inversion, 2 = second inversion, etc.
  inversionDisplay?: string;    // How to display the inversion (e.g., '1st inv', '2nd inv')
}

// A complete chord with a specific root and pattern
export interface ChordDefinition {
  id: number;
  rootNum: number;              // Numeric root (1=C, 2=C#, ..., 12=B)
  pattern: ChordPattern;        // The chord pattern/type
  name: string;                 // Generated name (e.g., 'C', 'Cm', 'G/B')
  notes: string[];              // Traditional note representation ('C4', 'E4', etc.)
  noteNumbers: number[];        // Numeric representation (1=C, 2=C#, ..., 12=B)
  difficulty: DifficultyLevel;
}

// Note name to number mapping (1-12)
const noteToNumber: Record<string, number> = {
  'C': 1,  'C#': 2,  'Db': 2, 
  'D': 3,  'D#': 4,  'Eb': 4,
  'E': 5,  'F': 6,  'F#': 7, 
  'Gb': 7, 'G': 8,  'G#': 9,
  'Ab': 9, 'A': 10, 'A#': 11,
  'Bb': 11,'B': 12
};

// UTILITY FUNCTIONS

// Convert a note string (e.g., 'C4') to a numeric value (1-12)
export function noteToNumeric(noteStr: string): number {
  // Extract the note name without octave
  const noteName = noteStr.replace(/[0-9]/g, '');
  return noteToNumber[noteName] || 0;
}

// Convert a numeric note (1-12) to a string with octave
export function numericToNote(noteNum: number, octave: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  // Adjust for 1-based indexing
  const index = (noteNum - 1) % 12; 
  return `${noteNames[index]}${octave}`;
}

// Get root note name (letter) from numeric value
export function getRootName(rootNum: number): string {
  const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  return noteNames[(rootNum - 1) % 12];
}

// CHORD PATTERNS DEFINITIONS

// Define the chord patterns (types) independently of root notes
export const chordPatterns: ChordPattern[] = [
  // Root position chords
  { type: 'major', display: '', intervals: [0, 4, 7], inversion: 0 },
  { type: 'minor', display: 'm', intervals: [0, 3, 7], inversion: 0 },
  { type: 'augmented', display: 'aug', intervals: [0, 4, 8], inversion: 0 },
  { type: 'diminished', display: 'dim', intervals: [0, 3, 6], inversion: 0 },
  { type: 'sus2', display: 'sus2', intervals: [0, 2, 7], inversion: 0 },
  { type: 'sus4', display: 'sus4', intervals: [0, 5, 7], inversion: 0 },

  // First inversions
  { type: 'major', display: '', intervals: [-8, 0, 3], inversion: 1, inversionDisplay: '1st inv' },
  { type: 'minor', display: 'm', intervals: [-9, 0, 4], inversion: 1, inversionDisplay: '1st inv' },
  { type: 'augmented', display: 'aug', intervals: [-8, 0, 4], inversion: 1, inversionDisplay: '1st inv' },
  { type: 'diminished', display: 'dim', intervals: [-9, 0, 3], inversion: 1, inversionDisplay: '1st inv' },

  // Second inversions
  { type: 'major', display: '', intervals: [-5, -1, 0], inversion: 2, inversionDisplay: '2nd inv' },
  { type: 'minor', display: 'm', intervals: [-5, -2, 0], inversion: 2, inversionDisplay: '2nd inv' },
  { type: 'augmented', display: 'aug', intervals: [-4, 0, 4], inversion: 2, inversionDisplay: '2nd inv' },
  { type: 'diminished', display: 'dim', intervals: [-6, -3, 0], inversion: 2, inversionDisplay: '2nd inv' }
];

// CHORD GENERATION FUNCTIONS

// Generate a chord name based on pattern and root
function generateChordName(pattern: ChordPattern, rootNum: number): string {
  const rootName = getRootName(rootNum);
  
  // For inversions, use the inversionDisplay property if available
  if (pattern.inversion > 0 && pattern.inversionDisplay) {
    return `${rootName}${pattern.display} ${pattern.inversionDisplay}`;
  }
  // Fallback for inversions without inversionDisplay property
  else if (pattern.inversion > 0) {
    // First inversion
    if (pattern.inversion === 1) {
      return `${rootName}${pattern.display} 1st inv`;
    } 
    // Second inversion
    else if (pattern.inversion === 2) {
      return `${rootName}${pattern.display} 2nd inv`;
    }
    // In case we add other inversions in the future
    else {
      return `${rootName}${pattern.display} ${pattern.inversion}th inv`;
    }
  }
  
  // Standard chord naming (non-inverted)
  return `${rootName}${pattern.display}`;
}

// Calculate note numbers for a chord based on root and pattern
function calculateChordNotes(rootNum: number, pattern: ChordPattern): number[] {
  return pattern.intervals.map(interval => {
    let note = rootNum + interval;
    
    // Ensure notes are in range 1-12
    while (note > 12) note -= 12;
    while (note < 1) note += 12;
    
    return note;
  });
}

// Generate actual notes with octaves based on a chord pattern and root
function generateChordNotes(rootNum: number, pattern: ChordPattern, baseOctave: number = 4): string[] {
  const noteNumbers = calculateChordNotes(rootNum, pattern);
  const result: string[] = [];
  
  if (pattern.inversion === 0) {
    // Root position - normal octave assignment
    let prevNoteNum = 0;
    let currentOctave = baseOctave;
    
    for (const noteNum of noteNumbers) {
      // If the current note number is less than the previous one, increment the octave
      if (noteNum <= prevNoteNum) {
        currentOctave++;
      }
      result.push(numericToNote(noteNum, currentOctave));
      prevNoteNum = noteNum;
    }
  } 
  else if (pattern.inversion === 1) {
    // First inversion - typical layout: third, fifth, root+octave
    // These are based on the calculated note numbers, not the actual intervals
    result.push(numericToNote(noteNumbers[0], baseOctave));
    result.push(numericToNote(noteNumbers[1], baseOctave));
    result.push(numericToNote(noteNumbers[2], baseOctave + 1));
  } 
  else if (pattern.inversion === 2) {
    // Second inversion - typical layout: fifth, root+octave, third+octave
    result.push(numericToNote(noteNumbers[0], baseOctave));
    result.push(numericToNote(noteNumbers[1], baseOctave + 1));
    result.push(numericToNote(noteNumbers[2], baseOctave + 1));
  }
  
  return result;
}

// Create a specific chord definition
function createChordDef(
  rootNum: number, 
  pattern: ChordPattern, 
  id: number, 
  difficulty: DifficultyLevel
): ChordDefinition {
  const noteNumbers = calculateChordNotes(rootNum, pattern);
  const notes = generateChordNotes(rootNum, pattern);
  const name = generateChordName(pattern, rootNum);
  
  return {
    id,
    rootNum,
    pattern,
    name,
    notes,
    noteNumbers,
    difficulty
  };
}

// GENERATE CHORD DEFINITIONS FOR EACH DIFFICULTY LEVEL

// Generate chords for all difficulty levels
let allChordDefs: ChordDefinition[] = [];
let idCounter = 1;

// Define which roots and patterns to use for each difficulty level
const rootsLevel1 = [1, 6, 8, 10]; // C, F, G, A (plus D, E for minors)
const rootsLevel2 = [2, 3, 4, 5, 7, 9, 11, 12]; // C#, D, Eb, E, F#, Ab, Bb, B
const rootsLevel3 = [1, 3, 5, 6, 8, 10]; // C, D, E, F, G, A (white keys)
const rootsLevel4 = [2, 4, 7, 9, 11]; // C#, Eb, F#, Ab, Bb (black keys)
// For inversions, use all 12 notes
const allRoots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // All 12 notes (C through B)
const rootsLevel5 = allRoots; // All 12 roots for level 5
const rootsLevel6 = allRoots; // All 12 roots for level 6
const rootsLevel7 = [1, 3, 6, 8, 10]; // C, D, F, G, A

// Create a map to hold chord definitions by difficulty
const chordsByDifficulty: Record<DifficultyLevel, ChordDefinition[]> = {
  'level1': [],
  'level2': [],
  'level3': [],
  'level4': [],
  'level5': [],
  'level6': [],
  'level7': []
};

// Level 1: Major/Minor Triads (root position only)
rootsLevel1.forEach(rootNum => {
  // Add major chords for all roots
  const majorPattern = chordPatterns.find(p => p.type === 'major' && p.inversion === 0);
  if (majorPattern) {
    chordsByDifficulty['level1'].push(createChordDef(rootNum, majorPattern, idCounter++, 'level1'));
  }
  
  // Add minor chords for all roots
  const minorPattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 0);
  if (minorPattern) {
    chordsByDifficulty['level1'].push(createChordDef(rootNum, minorPattern, idCounter++, 'level1'));
  }
});

// Add D minor, E minor
const minorPattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 0);
if (minorPattern) {
  chordsByDifficulty['level1'].push(createChordDef(3, minorPattern, idCounter++, 'level1')); // D minor
  chordsByDifficulty['level1'].push(createChordDef(5, minorPattern, idCounter++, 'level1')); // E minor
}

// Level 2: Major and minor triads with white key roots only
const whiteKeyRoots = [1, 3, 5, 6, 8, 10, 12]; // C, D, E, F, G, A, B

whiteKeyRoots.forEach(rootNum => {
  const majorPattern = chordPatterns.find(p => p.type === 'major' && p.inversion === 0);
  if (majorPattern) {
    // Add all white key major triads for level 2
    chordsByDifficulty['level2'].push(createChordDef(rootNum, majorPattern, idCounter++, 'level2'));
  }
  
  const minorPattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 0);
  if (minorPattern) {
    // Add all white key minor triads for level 2
    chordsByDifficulty['level2'].push(createChordDef(rootNum, minorPattern, idCounter++, 'level2'));
  }
});

// Level 3: Aug/Dim/Sus chords with white keys
rootsLevel3.forEach(rootNum => {
  const augPattern = chordPatterns.find(p => p.type === 'augmented' && p.inversion === 0);
  const dimPattern = chordPatterns.find(p => p.type === 'diminished' && p.inversion === 0);
  const sus2Pattern = chordPatterns.find(p => p.type === 'sus2' && p.inversion === 0);
  const sus4Pattern = chordPatterns.find(p => p.type === 'sus4' && p.inversion === 0);
  
  if (augPattern) {
    chordsByDifficulty['level3'].push(createChordDef(rootNum, augPattern, idCounter++, 'level3'));
  }
  
  if (dimPattern) {
    chordsByDifficulty['level3'].push(createChordDef(rootNum, dimPattern, idCounter++, 'level3'));
  }
  
  // Add sus chords for all white key roots
  if (sus2Pattern) {
    chordsByDifficulty['level3'].push(createChordDef(rootNum, sus2Pattern, idCounter++, 'level3'));
  }
  
  if (sus4Pattern) {
    chordsByDifficulty['level3'].push(createChordDef(rootNum, sus4Pattern, idCounter++, 'level3'));
  }
});

// Level 4: All 12 keys, using proper naming
rootsLevel4.forEach(rootNum => {
  const augPattern = chordPatterns.find(p => p.type === 'augmented' && p.inversion === 0);
  const dimPattern = chordPatterns.find(p => p.type === 'diminished' && p.inversion === 0);
  const sus2Pattern = chordPatterns.find(p => p.type === 'sus2' && p.inversion === 0);
  const sus4Pattern = chordPatterns.find(p => p.type === 'sus4' && p.inversion === 0);
  
  if (augPattern) {
    chordsByDifficulty['level4'].push(createChordDef(rootNum, augPattern, idCounter++, 'level4'));
  }
  
  if (dimPattern) {
    chordsByDifficulty['level4'].push(createChordDef(rootNum, dimPattern, idCounter++, 'level4'));
  }
  
  // Only add sus chords for select black keys
  if (rootNum === 2 && sus2Pattern) { // C# sus2
    chordsByDifficulty['level4'].push(createChordDef(rootNum, sus2Pattern, idCounter++, 'level4'));
  }
  
  if (rootNum === 4 && sus4Pattern) { // Eb sus4
    chordsByDifficulty['level4'].push(createChordDef(rootNum, sus4Pattern, idCounter++, 'level4'));
  }
});

// Level 5: First inversions
rootsLevel5.forEach(rootNum => {
  const majorInv1Pattern = chordPatterns.find(p => p.type === 'major' && p.inversion === 1);
  const minorInv1Pattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 1);
  
  if (majorInv1Pattern) {
    chordsByDifficulty['level5'].push(createChordDef(rootNum, majorInv1Pattern, idCounter++, 'level5'));
  }
  
  if (minorInv1Pattern) {
    chordsByDifficulty['level5'].push(createChordDef(rootNum, minorInv1Pattern, idCounter++, 'level5'));
  }
});

// Level 6: Second inversions
rootsLevel6.forEach(rootNum => {
  const majorInv2Pattern = chordPatterns.find(p => p.type === 'major' && p.inversion === 2);
  const minorInv2Pattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 2);
  
  if (majorInv2Pattern) {
    chordsByDifficulty['level6'].push(createChordDef(rootNum, majorInv2Pattern, idCounter++, 'level6'));
  }
  
  if (minorInv2Pattern) {
    chordsByDifficulty['level6'].push(createChordDef(rootNum, minorInv2Pattern, idCounter++, 'level6'));
  }
});

// Level 7: Comprehensive review of all chord types from previous levels
// We'll select a representative subset of all previous chords
const patterns = {
  major: chordPatterns.find(p => p.type === 'major' && p.inversion === 0),
  minor: chordPatterns.find(p => p.type === 'minor' && p.inversion === 0),
  aug: chordPatterns.find(p => p.type === 'augmented' && p.inversion === 0),
  dim: chordPatterns.find(p => p.type === 'diminished' && p.inversion === 0),
  sus2: chordPatterns.find(p => p.type === 'sus2' && p.inversion === 0),
  sus4: chordPatterns.find(p => p.type === 'sus4' && p.inversion === 0),
  majorInv1: chordPatterns.find(p => p.type === 'major' && p.inversion === 1),
  minorInv1: chordPatterns.find(p => p.type === 'minor' && p.inversion === 1),
  majorInv2: chordPatterns.find(p => p.type === 'major' && p.inversion === 2),
  minorInv2: chordPatterns.find(p => p.type === 'minor' && p.inversion === 2)
};

// Add a variety of chords to level 7
if (patterns.major) {
  chordsByDifficulty['level7'].push(createChordDef(1, patterns.major, idCounter++, 'level7')); // C
  chordsByDifficulty['level7'].push(createChordDef(6, patterns.major, idCounter++, 'level7')); // F
}

if (patterns.minor) {
  chordsByDifficulty['level7'].push(createChordDef(10, patterns.minor, idCounter++, 'level7')); // Am
  chordsByDifficulty['level7'].push(createChordDef(3, patterns.minor, idCounter++, 'level7')); // Dm
}

if (patterns.aug) {
  chordsByDifficulty['level7'].push(createChordDef(1, patterns.aug, idCounter++, 'level7')); // Caug
}

if (patterns.dim) {
  chordsByDifficulty['level7'].push(createChordDef(3, patterns.dim, idCounter++, 'level7')); // Ddim
}

if (patterns.sus2) {
  chordsByDifficulty['level7'].push(createChordDef(1, patterns.sus2, idCounter++, 'level7')); // Csus2
}

if (patterns.sus4) {
  chordsByDifficulty['level7'].push(createChordDef(3, patterns.sus4, idCounter++, 'level7')); // Dsus4
}

if (patterns.majorInv1) {
  chordsByDifficulty['level7'].push(createChordDef(1, patterns.majorInv1, idCounter++, 'level7')); // C/E
}

if (patterns.minorInv1) {
  chordsByDifficulty['level7'].push(createChordDef(10, patterns.minorInv1, idCounter++, 'level7')); // Am/C
}

if (patterns.majorInv2) {
  chordsByDifficulty['level7'].push(createChordDef(8, patterns.majorInv2, idCounter++, 'level7')); // G/D
}

if (patterns.minorInv2) {
  chordsByDifficulty['level7'].push(createChordDef(3, patterns.minorInv2, idCounter++, 'level7')); // Dm/A
}

// Combine all chord definitions
for (const level of difficultyLevels) {
  allChordDefs = [...allChordDefs, ...chordsByDifficulty[level]];
}

// Export all chord definitions
export const chordDefinitions = chordsByDifficulty;

// PUBLIC API FUNCTIONS

// Get chord definitions by difficulty level
export function getChordsByDifficulty(difficulty: DifficultyLevel): ChordDefinition[] {
  return chordDefinitions[difficulty] || [];
}

// Get a random chord from a specific difficulty
export function getRandomChord(difficulty: DifficultyLevel): ChordDefinition {
  const chords = getChordsByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * chords.length);
  return chords[randomIndex];
}

// Check if the selected notes match the chord using numeric representation
export function checkChordMatch(selectedNotes: string[], chordNotes: string[]): boolean {
  if (selectedNotes.length !== chordNotes.length) {
    return false;
  }
  
  // Convert selected notes to numeric values (1-12)
  const selectedNoteNumbers = selectedNotes.map(noteToNumeric);
  
  // Normalize both arrays (sort them)
  const sortedSelected = [...selectedNoteNumbers].sort((a, b) => a - b);
  
  // Normalize chord notes (already precomputed in the chord)
  // This is a fallback in case we're using the string-based notes
  const chordNoteNumbers = chordNotes.map(noteToNumeric).sort((a, b) => a - b);
  
  // Check if each note in the selected set matches the corresponding note in the chord
  return sortedSelected.every((noteNum, index) => noteNum === chordNoteNumbers[index]);
}

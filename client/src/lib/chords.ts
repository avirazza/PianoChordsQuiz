import {
  type ChordData,
  type DifficultyLevel,
  difficultyLevels,
  type Note,
} from "@shared/schema";

// CHORD TYPE DEFINITIONS

// Chord pattern definitions - these are the different chord types regardless of root note
export interface ChordPattern {
  type: string; // 'major', 'minor', 'augmented', 'diminished', 'sus2', 'sus4', etc.
  display: string; // How to display this chord type (e.g., '', 'm', 'aug', 'dim')
  intervals: number[]; // Intervals in semitones from root (0 = root)
  inversion: number; // 0 = root position, 1 = first inversion, 2 = second inversion, etc.
  inversionDisplay?: string; // How to display the inversion (e.g., '1st inv', '2nd inv')
}

// A complete chord with a specific root and pattern
export interface ChordDefinition {
  id: number;
  rootNum: number; // Numeric root (1=C, 2=C#, ..., 12=B)
  pattern: ChordPattern; // The chord pattern/type
  name: string; // Generated name (e.g., 'C', 'Cm', 'G/B')
  notes: string[]; // Traditional note representation ('C4', 'E4', etc.)
  noteNumbers: number[]; // Numeric representation (1=C, 2=C#, ..., 12=B)
  difficulty: DifficultyLevel;
}

// Note name to number mapping (1-12)
const noteToNumber: Record<string, number> = {
  C: 1,
  "C#": 2,
  Db: 2,
  D: 3,
  "D#": 4,
  Eb: 4,
  E: 5,
  F: 6,
  "F#": 7,
  Gb: 7,
  G: 8,
  "G#": 9,
  Ab: 9,
  A: 10,
  "A#": 11,
  Bb: 11,
  B: 12,
};

// UTILITY FUNCTIONS

// Convert a note string (e.g., 'C4') to a numeric value (1-12)
export function noteToNumeric(noteStr: string): number {
  // Extract the note name without octave
  const noteName = noteStr.replace(/[0-9]/g, "");
  return noteToNumber[noteName] || 0;
}

// Convert a numeric note (1-12) to a string with octave
export function numericToNote(noteNum: number, octave: number): string {
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  // Adjust for 1-based indexing
  const index = (noteNum - 1) % 12;
  return `${noteNames[index]}${octave}`;
}

// Get root note name (letter) from numeric value
export function getRootName(rootNum: number): string {
  const noteNames = [
    "C",
    "C#",
    "D",
    "Eb",
    "E",
    "F",
    "F#",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
  ];
  return noteNames[(rootNum - 1) % 12];
}

// CHORD PATTERNS DEFINITIONS

// Define the chord patterns (types) independently of root notes
export const chordPatterns: ChordPattern[] = [
  // Root position chords - triads
  { type: "major", display: "", intervals: [0, 4, 7], inversion: 0 },
  { type: "minor", display: "m", intervals: [0, 3, 7], inversion: 0 },
  { type: "augmented", display: "aug", intervals: [0, 4, 8], inversion: 0 },
  { type: "diminished", display: "dim", intervals: [0, 3, 6], inversion: 0 },
  { type: "sus2", display: "sus2", intervals: [0, 2, 7], inversion: 0 },
  { type: "sus4", display: "sus4", intervals: [0, 5, 7], inversion: 0 },

  // First inversions - triads
  {
    type: "major",
    display: "",
    intervals: [-8, 0, 3],
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  {
    type: "minor",
    display: "m",
    intervals: [-9, 0, 4],
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  {
    type: "augmented",
    display: "aug",
    intervals: [-8, 0, 4],
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  {
    type: "diminished",
    display: "dim",
    intervals: [-9, 0, 3],
    inversion: 1,
    inversionDisplay: "1st inv",
  },

  // Second inversions - triads
  {
    type: "major",
    display: "",
    intervals: [-5, -1, 0],
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  {
    type: "minor",
    display: "m",
    intervals: [-5, -2, 0],
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  {
    type: "augmented",
    display: "aug",
    intervals: [-4, 0, 4],
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  {
    type: "diminished",
    display: "dim",
    intervals: [-6, -3, 0],
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  
  // Root position - 7th chords
  { type: "dominant7", display: "7", intervals: [0, 4, 7, 10], inversion: 0 },
  { type: "major7", display: "maj7", intervals: [0, 4, 7, 11], inversion: 0 },
  { type: "minor7", display: "m7", intervals: [0, 3, 7, 10], inversion: 0 },
  { type: "minorMajor7", display: "mMaj7", intervals: [0, 3, 7, 11], inversion: 0 },
  { type: "diminished7", display: "dim7", intervals: [0, 3, 6, 9], inversion: 0 },
  { type: "halfdiminished7", display: "m7b5", intervals: [0, 3, 6, 10], inversion: 0 },
  { type: "diminishedMajor7", display: "dimMaj7", intervals: [0, 3, 6, 11], inversion: 0 },
  { type: "augmentedMinor7", display: "aug7", intervals: [0, 4, 8, 10], inversion: 0 },
  { type: "augmentedMajor7", display: "augMaj7", intervals: [0, 4, 8, 11], inversion: 0 },
  
  // First inversion - 7th chords
  { 
    type: "dominant7", 
    display: "7", 
    intervals: [-2, 0, 3, 6], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "major7", 
    display: "maj7", 
    intervals: [-1, 0, 3, 7], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "minor7", 
    display: "m7", 
    intervals: [-2, 0, 4, 7], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "minorMajor7", 
    display: "mMaj7", 
    intervals: [-1, 0, 4, 8], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "diminished7", 
    display: "dim7", 
    intervals: [-3, 0, 3, 6], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "halfdiminished7", 
    display: "m7b5", 
    intervals: [-2, 0, 3, 7], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "diminishedMajor7", 
    display: "dimMaj7", 
    intervals: [-1, 0, 3, 8], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "augmentedMinor7", 
    display: "aug7", 
    intervals: [-2, 0, 4, 6], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  { 
    type: "augmentedMajor7", 
    display: "augMaj7", 
    intervals: [-1, 0, 4, 7], 
    inversion: 1,
    inversionDisplay: "1st inv",
  },
  
  // Second inversion - 7th chords
  { 
    type: "dominant7", 
    display: "7", 
    intervals: [-4, -1, 0, 3], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "major7", 
    display: "maj7", 
    intervals: [-5, -1, 0, 4], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "minor7", 
    display: "m7", 
    intervals: [-5, -1, 0, 3], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "minorMajor7", 
    display: "mMaj7", 
    intervals: [-4, 0, 1, 4], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "diminished7", 
    display: "dim7", 
    intervals: [-3, 0, 3, 6], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "halfdiminished7", 
    display: "m7b5", 
    intervals: [-4, 0, 2, 7], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "diminishedMajor7", 
    display: "dimMaj7", 
    intervals: [-3, 0, 2, 5], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "augmentedMinor7", 
    display: "aug7", 
    intervals: [-4, 0, 2, 6], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  { 
    type: "augmentedMajor7", 
    display: "augMaj7", 
    intervals: [-4, 0, 1, 5], 
    inversion: 2,
    inversionDisplay: "2nd inv",
  },
  
  // Third inversion - 7th chords 
  { 
    type: "dominant7", 
    display: "7", 
    intervals: [-7, -4, -1, 0], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "major7", 
    display: "maj7", 
    intervals: [-8, -5, -1, 0], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "minor7", 
    display: "m7", 
    intervals: [-7, -4, -1, 0], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "minorMajor7", 
    display: "mMaj7", 
    intervals: [-8, -4, -1, 0], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "diminished7", 
    display: "dim7", 
    intervals: [-3, 0, 3, 6], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "halfdiminished7", 
    display: "m7b5", 
    intervals: [-7, -3, 0, 3], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "diminishedMajor7", 
    display: "dimMaj7", 
    intervals: [-8, -4, -1, 0], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "augmentedMinor7", 
    display: "aug7", 
    intervals: [-6, -2, 0, 4], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  },
  { 
    type: "augmentedMajor7", 
    display: "augMaj7", 
    intervals: [-7, -3, 0, 4], 
    inversion: 3,
    inversionDisplay: "3rd inv",
  }
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
  return pattern.intervals.map((interval) => {
    let note = rootNum + interval;

    // Ensure notes are in range 1-12
    while (note > 12) note -= 12;
    while (note < 1) note += 12;

    return note;
  });
}

// Generate actual notes with octaves based on a chord pattern and root
function generateChordNotes(
  rootNum: number,
  pattern: ChordPattern,
  baseOctave: number = 4,
): string[] {
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
  } else if (pattern.inversion === 1) {
    // First inversion - typical layout: third, fifth, root+octave
    // These are based on the calculated note numbers, not the actual intervals
    result.push(numericToNote(noteNumbers[0], baseOctave));
    result.push(numericToNote(noteNumbers[1], baseOctave));
    result.push(numericToNote(noteNumbers[2], baseOctave + 1));
  } else if (pattern.inversion === 2) {
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
  difficulty: DifficultyLevel,
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
    difficulty,
  };
}

// GENERATE CHORD DEFINITIONS FOR EACH DIFFICULTY LEVEL

// Generate chords for all difficulty levels
let allChordDefs: ChordDefinition[] = [];
let idCounter = 1;
const allRoots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const whiteKeyRoots = [1, 3, 5, 6, 8, 10, 12]; // C, D, E, F, G, A, B
// Define which roots and patterns to use for each difficulty level
const rootsLevel1 = [1, 6, 8]; // C, F, G,  (plus D, E, A  for minors)
const rootsLevel2 = allRoots;
const rootsLevel3 = whiteKeyRoots; // C, D, E, F, G, A, B (white keys)
const rootsLevel4 = allRoots;

// All 12 notes (C through B)
const rootsLevel5 = allRoots; // All 12 roots for level 5
const rootsLevel6 = allRoots; // All 12 roots for level 6
const rootsLevel7 = allRoots;

// Create a map to hold chord definitions by difficulty
const chordsByDifficulty: Record<DifficultyLevel, ChordDefinition[]> = {
  level1: [],
  level2: [],
  level3: [],
  level4: [],
  level5: [],
  level6: [],
  level7: [],
  level8: [],
  level9: [],
};

// Level 1: Major/Minor Triads (root position only)
rootsLevel1.forEach((rootNum) => {
  // Add major chords for all roots
  const majorPattern = chordPatterns.find(
    (p) => p.type === "major" && p.inversion === 0,
  );
  if (majorPattern) {
    chordsByDifficulty["level1"].push(
      createChordDef(rootNum, majorPattern, idCounter++, "level1"),
    );
  }
});

// Add D minor, E minor, A minor.
const minorPattern = chordPatterns.find(
  (p) => p.type === "minor" && p.inversion === 0,
);
if (minorPattern) {
  chordsByDifficulty["level1"].push(
    createChordDef(3, minorPattern, idCounter++, "level1"),
  ); // D minor
  chordsByDifficulty["level1"].push(
    createChordDef(5, minorPattern, idCounter++, "level1"),
  ); // E minor
  chordsByDifficulty["level1"].push(
    createChordDef(10, minorPattern, idCounter++, "level1"),
  ); // A minor
}

// Level 2: Major and minor triads

rootsLevel2.forEach((rootNum) => {
  const majorPattern = chordPatterns.find(
    (p) => p.type === "major" && p.inversion === 0,
  );
  if (majorPattern) {
    // Add all major triads for level 2
    chordsByDifficulty["level2"].push(
      createChordDef(rootNum, majorPattern, idCounter++, "level2"),
    );
  }

  const minorPattern = chordPatterns.find(
    (p) => p.type === "minor" && p.inversion === 0,
  );
  if (minorPattern) {
    // Add all minor triads for level 2
    chordsByDifficulty["level2"].push(
      createChordDef(rootNum, minorPattern, idCounter++, "level2"),
    );
  }
});

// Level 3: Aug/Dim/Sus chords with white keys
rootsLevel3.forEach((rootNum) => {
  const augPattern = chordPatterns.find(
    (p) => p.type === "augmented" && p.inversion === 0,
  );
  const dimPattern = chordPatterns.find(
    (p) => p.type === "diminished" && p.inversion === 0,
  );
  const sus2Pattern = chordPatterns.find(
    (p) => p.type === "sus2" && p.inversion === 0,
  );
  const sus4Pattern = chordPatterns.find(
    (p) => p.type === "sus4" && p.inversion === 0,
  );

  if (augPattern) {
    chordsByDifficulty["level3"].push(
      createChordDef(rootNum, augPattern, idCounter++, "level3"),
    );
  }

  if (dimPattern) {
    chordsByDifficulty["level3"].push(
      createChordDef(rootNum, dimPattern, idCounter++, "level3"),
    );
  }

  // Add sus chords for all white key roots
  if (sus2Pattern) {
    chordsByDifficulty["level3"].push(
      createChordDef(rootNum, sus2Pattern, idCounter++, "level3"),
    );
  }

  if (sus4Pattern) {
    chordsByDifficulty["level3"].push(
      createChordDef(rootNum, sus4Pattern, idCounter++, "level3"),
    );
  }
});

// Level 4: All 12 keys, using proper naming
rootsLevel4.forEach((rootNum) => {
  const augPattern = chordPatterns.find(
    (p) => p.type === "augmented" && p.inversion === 0,
  );
  const dimPattern = chordPatterns.find(
    (p) => p.type === "diminished" && p.inversion === 0,
  );
  const sus2Pattern = chordPatterns.find(
    (p) => p.type === "sus2" && p.inversion === 0,
  );
  const sus4Pattern = chordPatterns.find(
    (p) => p.type === "sus4" && p.inversion === 0,
  );

  if (augPattern) {
    chordsByDifficulty["level4"].push(
      createChordDef(rootNum, augPattern, idCounter++, "level4"),
    );
  }

  if (dimPattern) {
    chordsByDifficulty["level4"].push(
      createChordDef(rootNum, dimPattern, idCounter++, "level4"),
    );
  }

  if (sus2Pattern) {
    chordsByDifficulty["level4"].push(
      createChordDef(rootNum, sus2Pattern, idCounter++, "level4"),
    );
  }

  if (sus4Pattern) {
    chordsByDifficulty["level4"].push(
      createChordDef(rootNum, sus4Pattern, idCounter++, "level4"),
    );
  }
});

// Level 5: First inversions
rootsLevel5.forEach((rootNum) => {
  const majorInv1Pattern = chordPatterns.find(
    (p) => p.type === "major" && p.inversion === 1,
  );
  const minorInv1Pattern = chordPatterns.find(
    (p) => p.type === "minor" && p.inversion === 1,
  );

  if (majorInv1Pattern) {
    chordsByDifficulty["level5"].push(
      createChordDef(rootNum, majorInv1Pattern, idCounter++, "level5"),
    );
  }

  if (minorInv1Pattern) {
    chordsByDifficulty["level5"].push(
      createChordDef(rootNum, minorInv1Pattern, idCounter++, "level5"),
    );
  }
});

// Level 6: Second inversions
rootsLevel6.forEach((rootNum) => {
  const majorInv2Pattern = chordPatterns.find(
    (p) => p.type === "major" && p.inversion === 2,
  );
  const minorInv2Pattern = chordPatterns.find(
    (p) => p.type === "minor" && p.inversion === 2,
  );

  if (majorInv2Pattern) {
    chordsByDifficulty["level6"].push(
      createChordDef(rootNum, majorInv2Pattern, idCounter++, "level6"),
    );
  }

  if (minorInv2Pattern) {
    chordsByDifficulty["level6"].push(
      createChordDef(rootNum, minorInv2Pattern, idCounter++, "level6"),
    );
  }
});

// Level 7: Comprehensive review - ALL combinations of chord types, inversions, and root notes
// Generate all possible combinations for a truly comprehensive level 7

// First, let's organize our chord patterns by type and inversion for easier access
const patternsByTypeAndInversion: Record<string, Record<number, ChordPattern>> = {};

// Helper to organize the patterns
function organizePatterns() {
  // Initialize the nested structure for all chord types
  [
    "major", "minor", "augmented", "diminished", "sus2", "sus4",
    "dominant7", "major7", "minor7", "minorMajor7", 
    "diminished7", "halfdiminished7", "diminishedMajor7", 
    "augmentedMinor7", "augmentedMajor7"
  ].forEach(type => {
    patternsByTypeAndInversion[type] = {};
  });
  
  // Organize each pattern by type and inversion
  chordPatterns.forEach(pattern => {
    if (!patternsByTypeAndInversion[pattern.type]) {
      patternsByTypeAndInversion[pattern.type] = {};
    }
    patternsByTypeAndInversion[pattern.type][pattern.inversion] = pattern;
  });
}

// Call the helper to organize our patterns
organizePatterns();

// List of all chord types we want to include
const allChordTypes = ["major", "minor", "augmented", "diminished", "sus2", "sus4"];
const basic7thChordTypes = ["dominant7", "major7", "minor7", "minorMajor7"];
const exotic7thChordTypes = ["diminished7", "halfdiminished7", "diminishedMajor7", "augmentedMinor7", "augmentedMajor7"];

// Level 7: All non-7th chords (triads) and their inversions
allRoots.forEach(rootNum => {
  // For each root note, iterate through all triad chord types
  allChordTypes.forEach(chordType => {
    // Get all available inversions for this chord type
    const inversions = Object.keys(patternsByTypeAndInversion[chordType]).map(Number);
    
    // Add each inversion of this chord type with this root
    inversions.forEach(inversion => {
      const pattern = patternsByTypeAndInversion[chordType][inversion];
      if (pattern) {
        chordsByDifficulty["level7"].push(
          createChordDef(rootNum, pattern, idCounter++, "level7")
        );
      }
    });
  });
});

// Level 8: Basic 7th chords - dominant7, major7, minor7, and minorMajor7
[1, 6, 8, 10, 3, 5].forEach(rootNum => { // C, F, G, A, D, E
  // For each root note, iterate through basic 7th chord types
  basic7thChordTypes.forEach(chordType => {
    // Include all inversions (0, 1, 2, 3)
    for (let inversion = 0; inversion <= 3; inversion++) {
      // Find the pattern for this chord type and inversion
      const pattern = chordPatterns.find(p => p.type === chordType && p.inversion === inversion);
      if (pattern) {
        chordsByDifficulty["level8"].push(
          createChordDef(rootNum, pattern, idCounter++, "level8")
        );
      }
    }
  });
});

// Level 9: Exotic 7th chords - all augmented and diminished 7th variants
[1, 6, 8, 10, 3, 5].forEach(rootNum => { // C, F, G, A, D, E
  // For each root note, iterate through exotic 7th chord types
  exotic7thChordTypes.forEach(chordType => {
    // Include all inversions (0, 1, 2, 3)
    for (let inversion = 0; inversion <= 3; inversion++) {
      // Find the pattern for this chord type and inversion
      const pattern = chordPatterns.find(p => p.type === chordType && p.inversion === inversion);
      if (pattern) {
        chordsByDifficulty["level9"].push(
          createChordDef(rootNum, pattern, idCounter++, "level9")
        );
      }
    }
  });
});

// CHORD MATCHING LOGIC

/**
 * Compare two chords to see if they match, enforcing the correct inversion order
 * Uses a mathematical approach with numeric note representation (1-12)
 * 
 * @param userNotes Array of note strings (e.g. ["C4", "E4", "G4"])
 * @param targetNotes Array of note strings for the target chord
 * @returns boolean indicating whether the chords match
 */
export function checkChordMatch(userNotes: string[], targetNotes: string[]): boolean {
  // Ensure we have the same number of notes
  if (userNotes.length !== targetNotes.length) {
    return false;
  }
  
  // Extract both note values and octaves
  const userNotesWithOctaves = userNotes.map(noteStr => {
    const noteName = noteStr.replace(/[0-9]/g, "");
    const octave = parseInt(noteStr.match(/[0-9]+/)?.[0] || "4", 10);
    return {
      note: noteToNumber[noteName] || 0,
      octave
    };
  });
  
  const targetNotesWithOctaves = targetNotes.map(noteStr => {
    const noteName = noteStr.replace(/[0-9]/g, "");
    const octave = parseInt(noteStr.match(/[0-9]+/)?.[0] || "4", 10);
    return {
      note: noteToNumber[noteName] || 0,
      octave
    };
  });
  
  // Convert notes to numeric representation (1-12) regardless of octave
  const userNumeric = userNotes.map(noteToNumeric);
  const targetNumeric = targetNotes.map(noteToNumeric);
  
  // First check: Do we have the same notes (regardless of order)?
  const userNotesSorted = [...userNumeric].sort((a, b) => a - b);
  const targetNotesSorted = [...targetNumeric].sort((a, b) => a - b);
  
  // Check if the collections of notes match (ignoring octaves and order)
  for (let i = 0; i < userNotesSorted.length; i++) {
    if (userNotesSorted[i] !== targetNotesSorted[i]) {
      return false; // Different notes in the chord
    }
  }
  
  // Second check: Is the bottom note correct? (critical for inversions)
  // Sort the user notes by octave first, then by note number within the same octave
  userNotesWithOctaves.sort((a, b) => {
    if (a.octave !== b.octave) return a.octave - b.octave;
    return a.note - b.note;
  });
  
  targetNotesWithOctaves.sort((a, b) => {
    if (a.octave !== b.octave) return a.octave - b.octave;
    return a.note - b.note;
  });
  
  // Check if the bottom note matches (this enforces correct inversion)
  if (userNotesWithOctaves[0].note !== targetNotesWithOctaves[0].note) {
    return false; // Wrong bottom note = wrong inversion
  }
  
  // The chord has the same notes and the correct bottom note, so it's valid
  return true;
}

import {
  type ChordData,
  type DifficultyLevel,
  difficultyLevels,
} from "@shared/schema";

// Note name to number mapping (1-12)
export const noteToNumber: Record<string, number> = {
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

// Number to note name mapping
export const numberToNote: Record<number, string> = {
  1: "C",
  2: "C#",
  3: "D",
  4: "Eb",
  5: "E",
  6: "F",
  7: "F#",
  8: "G",
  9: "Ab",
  10: "A",
  11: "Bb",
  12: "B",
};

// Chord pattern definitions
export interface ChordPattern {
  type: string;
  display: string;
  intervals: number[];
  inversion: number;
  // Mapping of interval positions to scale degrees
  // For example, in a major triad [0, 4, 7], the scaleDegrees would be { 0: "1", 4: "3", 7: "5" }
  scaleDegreeMap: Record<number, string>;
}

// Helper function to get inversion display text
export function getInversionDisplay(inversion: number): string {
  // Convert inversion number to text for display
  switch(inversion) {
    case 0: return ''; // Root position
    case 1: return '1st inv';
    case 2: return '2nd inv';
    case 3: return '3rd inv';
    case 4: return '4th inv';
    default: return `${inversion}th inv`;
  }
}

// Define all chord patterns
export const chordPatterns: ChordPattern[] = [
  // Major chords
  { 
    type: "major", 
    display: "", 
    intervals: [0, 4, 7], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 4: "3", 7: "5" }  // Root position: 1-3-5
  },
  { 
    type: "major", 
    display: "", 
    intervals: [0, 3, 8], 
    inversion: 1,
    scaleDegreeMap: { 0: "3", 3: "5", 8: "1" }  // First inversion: 3-5-1
  },
  { 
    type: "major", 
    display: "", 
    intervals: [0, 5, 9], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 5: "1", 9: "3" }  // Second inversion: 5-1-3
  },

  // Minor chords
  { 
    type: "minor", 
    display: "m", 
    intervals: [0, 3, 7], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 3: "b3", 7: "5" }  // Root position: 1-b3-5
  },
  { 
    type: "minor", 
    display: "m", 
    intervals: [0, 4, 9], 
    inversion: 1,
    scaleDegreeMap: { 0: "b3", 4: "5", 9: "1" }  // First inversion: b3-5-1
  },
  { 
    type: "minor", 
    display: "m", 
    intervals: [0, 5, 8], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 5: "1", 8: "b3" }  // Second inversion: 5-1-b3
  },

  // Augmented chords
  { 
    type: "augmented", 
    display: "aug", 
    intervals: [0, 4, 8], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 4: "3", 8: "#5" }  // Root position: 1-3-#5
  },
  { 
    type: "augmented", 
    display: "aug", 
    intervals: [0, 4, 8], 
    inversion: 1,
    scaleDegreeMap: { 0: "3", 4: "#5", 8: "1" }  // First inversion: 3-#5-1
  },
  { 
    type: "augmented", 
    display: "aug", 
    intervals: [0, 4, 8], 
    inversion: 2,
    scaleDegreeMap: { 0: "#5", 4: "1", 8: "3" }  // Second inversion: #5-1-3
  },

  // Diminished chords
  { 
    type: "diminished", 
    display: "dim", 
    intervals: [0, 3, 6], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5" }  // Root position: 1-b3-b5
  },
  { 
    type: "diminished", 
    display: "dim", 
    intervals: [0, 3, 9], 
    inversion: 1,
    scaleDegreeMap: { 0: "b3", 3: "b5", 9: "1" }  // First inversion: b3-b5-1
  },
  { 
    type: "diminished", 
    display: "dim", 
    intervals: [0, 6, 9], 
    inversion: 2,
    scaleDegreeMap: { 0: "b5", 6: "1", 9: "b3" }  // Second inversion: b5-1-b3
  },

  // Sus2 chords
  { 
    type: "sus2", 
    display: "sus2", 
    intervals: [0, 2, 7], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 2: "2", 7: "5" }  // Root position: 1-2-5
  },
  { 
    type: "sus2", 
    display: "sus2", 
    intervals: [0, 5, 10], 
    inversion: 1,
    scaleDegreeMap: { 0: "2", 5: "5", 10: "1" }  // First inversion: 2-5-1
  },
  { 
    type: "sus2", 
    display: "sus2", 
    intervals: [0, 5, 7], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 5: "1", 7: "2" }  // Second inversion: 5-1-2
  },

  // Sus4 chords
  { 
    type: "sus4", 
    display: "sus4", 
    intervals: [0, 5, 7], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 5: "4", 7: "5" }  // Root position: 1-4-5
  },
  { 
    type: "sus4", 
    display: "sus4", 
    intervals: [0, 2, 7], 
    inversion: 1,
    scaleDegreeMap: { 0: "4", 2: "5", 7: "1" }  // First inversion: 4-5-1
  },
  { 
    type: "sus4", 
    display: "sus4", 
    intervals: [0, 5, 10], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 5: "1", 10: "4" }  // Second inversion: 5-1-4
  },
  
  // 7th chords (dominant 7th)
  { 
    type: "dominant7", 
    display: "7", 
    intervals: [0, 4, 7, 10], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 4: "3", 7: "5", 10: "b7" }  // Root position: 1-3-5-b7
  },
  { 
    type: "dominant7", 
    display: "7", 
    intervals: [0, 3, 6, 8], 
    inversion: 1,
    scaleDegreeMap: { 0: "3", 3: "5", 6: "b7", 8: "1" }  // First inversion: 3-5-b7-1
  },
  { 
    type: "dominant7", 
    display: "7", 
    intervals: [0, 3, 5, 9], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 3: "b7", 5: "1", 9: "3" }  // Second inversion: 5-b7-1-3
  },
  { 
    type: "dominant7", 
    display: "7", 
    intervals: [0, 2, 6, 9], 
    inversion: 3,
    scaleDegreeMap: { 0: "b7", 2: "1", 6: "3", 9: "5" }  // Third inversion: b7-1-3-5
  },
  
  // Major 7th chords
  { 
    type: "major7", 
    display: "maj7", 
    intervals: [0, 4, 7, 11], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 4: "3", 7: "5", 11: "7" }  // Root position: 1-3-5-7
  },
  { 
    type: "major7", 
    display: "maj7", 
    intervals: [0, 3, 7, 8], 
    inversion: 1,
    scaleDegreeMap: { 0: "3", 3: "5", 7: "7", 8: "1" }  // First inversion: 3-5-7-1
  },
  { 
    type: "major7", 
    display: "maj7", 
    intervals: [0, 4, 5, 9], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 4: "7", 5: "1", 9: "3" }  // Second inversion: 5-7-1-3
  },
  { 
    type: "major7", 
    display: "maj7", 
    intervals: [0, 1, 5, 8], 
    inversion: 3,
    scaleDegreeMap: { 0: "7", 1: "1", 5: "3", 8: "5" }  // Third inversion: 7-1-3-5
  },
  
  // Minor 7th chords
  { 
    type: "minor7", 
    display: "m7", 
    intervals: [0, 3, 7, 10], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 3: "b3", 7: "5", 10: "b7" }  // Root position: 1-b3-5-b7
  },
  { 
    type: "minor7", 
    display: "m7", 
    intervals: [0, 4, 7, 9], 
    inversion: 1,
    scaleDegreeMap: { 0: "b3", 4: "5", 7: "b7", 9: "1" }  // First inversion: b3-5-b7-1
  },
  { 
    type: "minor7", 
    display: "m7", 
    intervals: [0, 3, 5, 8], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 3: "b7", 5: "1", 8: "b3" }  // Second inversion: 5-b7-1-b3
  },
  { 
    type: "minor7", 
    display: "m7", 
    intervals: [0, 2, 5, 9], 
    inversion: 3,
    scaleDegreeMap: { 0: "b7", 2: "1", 5: "b3", 9: "5" }  // Third inversion: b7-1-b3-5
  },
  
  // Diminished 7th chords
  { 
    type: "diminished7", 
    display: "dim7", 
    intervals: [0, 3, 6, 9], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5", 9: "bb7" }  // Root position: 1-b3-b5-bb7
  },
  { 
    type: "diminished7", 
    display: "dim7", 
    intervals: [0, 3, 6, 9], 
    inversion: 1,
    scaleDegreeMap: { 0: "b3", 3: "b5", 6: "bb7", 9: "1" }  // First inversion: b3-b5-bb7-1
  },
  { 
    type: "diminished7", 
    display: "dim7", 
    intervals: [0, 3, 6, 9], 
    inversion: 2,
    scaleDegreeMap: { 0: "b5", 3: "bb7", 6: "1", 9: "b3" }  // Second inversion: b5-bb7-1-b3
  },
  { 
    type: "diminished7", 
    display: "dim7", 
    intervals: [0, 3, 6, 9], 
    inversion: 3,
    scaleDegreeMap: { 0: "bb7", 3: "1", 6: "b3", 9: "b5" }  // Third inversion: bb7-1-b3-b5
  },
  
  // Half-diminished 7th chords (m7b5)
  { 
    type: "halfdiminished7", 
    display: "m7b5", 
    intervals: [0, 3, 6, 10], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5", 10: "b7" }  // Root position: 1-b3-b5-b7
  },
  { 
    type: "halfdiminished7", 
    display: "m7b5", 
    intervals: [0, 3, 7, 9], 
    inversion: 1,
    scaleDegreeMap: { 0: "b3", 3: "b5", 7: "b7", 9: "1" }  // First inversion: b3-b5-b7-1
  },
  { 
    type: "halfdiminished7", 
    display: "m7b5", 
    intervals: [0, 4, 6, 9], 
    inversion: 2,
    scaleDegreeMap: { 0: "b5", 4: "b7", 6: "1", 9: "b3" }  // Second inversion: b5-b7-1-b3
  },
  { 
    type: "halfdiminished7", 
    display: "m7b5", 
    intervals: [0, 2, 5, 8], 
    inversion: 3,
    scaleDegreeMap: { 0: "b7", 2: "1", 5: "b3", 8: "b5" }  // Third inversion: b7-1-b3-b5
  },
  
  // Minor with Major 7th chords (mMaj7)
  { 
    type: "minorMajor7", 
    display: "mMaj7", 
    intervals: [0, 3, 7, 11], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 3: "b3", 7: "5", 11: "7" }  // Root position: 1-b3-5-7
  },
  { 
    type: "minorMajor7", 
    display: "mMaj7", 
    intervals: [0, 4, 8, 9], 
    inversion: 1,
    scaleDegreeMap: { 0: "b3", 4: "5", 8: "7", 9: "1" }  // First inversion: b3-5-7-1
  },
  { 
    type: "minorMajor7", 
    display: "mMaj7", 
    intervals: [0, 4, 5, 8], 
    inversion: 2,
    scaleDegreeMap: { 0: "5", 4: "7", 5: "1", 8: "b3" }  // Second inversion: 5-7-1-b3
  },
  { 
    type: "minorMajor7", 
    display: "mMaj7", 
    intervals: [0, 1, 4, 9], 
    inversion: 3,
    scaleDegreeMap: { 0: "7", 1: "1", 4: "b3", 9: "5" }  // Third inversion: 7-1-b3-5
  },
  
  // Diminished with Major 7th (dimMaj7)
  { 
    type: "diminishedMajor7", 
    display: "dimMaj7", 
    intervals: [0, 3, 6, 11], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5", 11: "7" }  // Root position: 1-b3-b5-7
  },
  { 
    type: "diminishedMajor7", 
    display: "dimMaj7", 
    intervals: [0, 3, 8, 9], 
    inversion: 1,
    scaleDegreeMap: { 0: "b3", 3: "b5", 8: "7", 9: "1" }  // First inversion: b3-b5-7-1
  },
  { 
    type: "diminishedMajor7", 
    display: "dimMaj7", 
    intervals: [0, 5, 6, 9], 
    inversion: 2,
    scaleDegreeMap: { 0: "b5", 5: "7", 6: "1", 9: "b3" }  // Second inversion: b5-7-1-b3
  },
  { 
    type: "diminishedMajor7", 
    display: "dimMaj7", 
    intervals: [0, 1, 4, 7], 
    inversion: 3,
    scaleDegreeMap: { 0: "7", 1: "1", 4: "b3", 7: "b5" }  // Third inversion: 7-1-b3-b5
  },
  
  // Augmented with Minor 7th (aug7)
  { 
    type: "augmentedMinor7", 
    display: "aug7", 
    intervals: [0, 4, 8, 10], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 4: "3", 8: "#5", 10: "b7" }  // Root position: 1-3-#5-b7
  },
  { 
    type: "augmentedMinor7", 
    display: "aug7", 
    intervals: [0, 4, 6, 8], 
    inversion: 1,
    scaleDegreeMap: { 0: "3", 4: "#5", 6: "b7", 8: "1" }  // First inversion: 3-#5-b7-1
  },
  { 
    type: "augmentedMinor7", 
    display: "aug7", 
    intervals: [0, 2, 4, 8], 
    inversion: 2,
    scaleDegreeMap: { 0: "#5", 2: "b7", 4: "1", 8: "3" }  // Second inversion: #5-b7-1-3
  },
  { 
    type: "augmentedMinor7", 
    display: "aug7", 
    intervals: [0, 2, 6, 10], 
    inversion: 3,
    scaleDegreeMap: { 0: "b7", 2: "1", 6: "3", 10: "#5" }  // Third inversion: b7-1-3-#5
  },
  
  // Augmented with Major 7th (augMaj7)
  { 
    type: "augmentedMajor7", 
    display: "augMaj7", 
    intervals: [0, 4, 8, 11], 
    inversion: 0,
    scaleDegreeMap: { 0: "1", 4: "3", 8: "#5", 11: "7" }  // Root position: 1-3-#5-7
  },
  { 
    type: "augmentedMajor7", 
    display: "augMaj7", 
    intervals: [0, 4, 7, 8], 
    inversion: 1,
    scaleDegreeMap: { 0: "3", 4: "#5", 7: "7", 8: "1" }  // First inversion: 3-#5-7-1
  },
  { 
    type: "augmentedMajor7", 
    display: "augMaj7", 
    intervals: [0, 3, 4, 8], 
    inversion: 2,
    scaleDegreeMap: { 0: "#5", 3: "7", 4: "1", 8: "3" }  // Second inversion: #5-7-1-3
  },
  { 
    type: "augmentedMajor7", 
    display: "augMaj7", 
    intervals: [0, 1, 5, 9], 
    inversion: 3,
    scaleDegreeMap: { 0: "7", 1: "1", 5: "3", 9: "#5" }  // Third inversion: 7-1-3-#5
  }
];

// All roots from 1 to 12
export const allRoots = Array.from({ length: 12 }, (_, i) => i + 1);

// Calculate chord notes from root and intervals
export function calculateChordNotes(
  rootNum: number,
  intervals: number[],
): number[] {
  return intervals.map((interval) => {
    let note = (rootNum + interval) % 12;
    if (note === 0) note = 12; // Convert 0 to 12 for consistency
    return note;
  });
}

// Convert a note string (e.g., "C4") to a numeric representation (1-12)
export function noteToNumeric(noteStr: string): number {
  // Extract the note name without octave
  const noteName = noteStr.replace(/[0-9]/g, "");
  return noteToNumber[noteName] || 0;
}

// Generate octave-specific note string
export function numericToNote(noteNum: number, octave: number): string {
  return `${numberToNote[noteNum]}${octave}`;
}

// Get root name for a given numeric root
export function getRootName(rootNum: number): string {
  return numberToNote[rootNum] || "";
}

// Generate chord name based on pattern and root
export function generateChordName(
  rootNum: number,
  pattern: ChordPattern,
): string {
  const rootName = getRootName(rootNum);

  if (pattern.inversion === 0) {
    return `${rootName}${pattern.display}`;
  } else {
    // For inversions, find the bass note
    const bassInterval = pattern.intervals[0];
    const bassNoteNum = (rootNum + bassInterval) % 12 || 12;
    
    // Use the getInversionDisplay function to get the inversion text
    const inversionText = getInversionDisplay(pattern.inversion);
    
    return `${rootName}${pattern.display}    ${inversionText}`;
  }
}

// Generate note strings with octave
export function generateNoteStrings(
  rootNum: number,
  pattern: ChordPattern,
): string[] {
  const baseOctave = 4;
  const intervals = pattern.intervals;

  // Calculate note numbers
  const noteNumbers = calculateChordNotes(rootNum, intervals);

  // Convert to note strings with proper octave adjustments
  const noteStrings: string[] = [];
  
  // Check if this is a 7th chord (or other 4-note chord)
  const is7thChord = noteNumbers.length > 3;

  // Handle octave adjustments based on inversion
  if (pattern.inversion === 0) {
    // Root position - standard case
    noteStrings.push(numericToNote(noteNumbers[0], baseOctave)); // Bottom note
    
    // Add middle notes
    for (let i = 1; i < noteNumbers.length - 1; i++) {
      const prevNote = noteNumbers[i - 1];
      const currNote = noteNumbers[i];
      // If current note is lower than previous note, put it in the next octave
      const octave = currNote > prevNote ? baseOctave : baseOctave + 1;
      noteStrings.push(numericToNote(currNote, octave));
    }
    
    // Add top note
    const lastIndex = noteNumbers.length - 1;
    const prevNote = noteNumbers[lastIndex - 1];
    const topNote = noteNumbers[lastIndex];
    noteStrings.push(
      numericToNote(
        topNote,
        topNote > prevNote ? baseOctave : baseOctave + 1,
      )
    );
  } else if (pattern.inversion === 1) {
    // First inversion
    noteStrings.push(numericToNote(noteNumbers[0], baseOctave)); // New bottom note
    
    // Add middle notes (if any)
    for (let i = 1; i < noteNumbers.length - 1; i++) {
      const prevNote = noteNumbers[i - 1];
      const currNote = noteNumbers[i];
      const octave = currNote > prevNote ? baseOctave : baseOctave + 1;
      noteStrings.push(numericToNote(currNote, octave));
    }
    
    // Add the root note (now at the top) in a higher octave
    noteStrings.push(numericToNote(noteNumbers[noteNumbers.length - 1], baseOctave + 1));
  } else if (pattern.inversion === 2) {
    // Second inversion
    noteStrings.push(numericToNote(noteNumbers[0], baseOctave)); // New bottom note
    
    // For all remaining notes, put them in the higher octave
    for (let i = 1; i < noteNumbers.length; i++) {
      noteStrings.push(numericToNote(noteNumbers[i], baseOctave + 1));
    }
  } else if (pattern.inversion === 3 && is7thChord) {
    // Third inversion (only for 7th chords)
    noteStrings.push(numericToNote(noteNumbers[0], baseOctave)); // New bottom note
    
    // All remaining notes go in higher octave
    for (let i = 1; i < noteNumbers.length; i++) {
      noteStrings.push(numericToNote(noteNumbers[i], baseOctave + 1));
    }
  }

  return noteStrings;
}

// Create a complete chord definition
export function createChordDefinition(
  rootNum: number,
  pattern: ChordPattern,
  id: number,
  difficulty: DifficultyLevel,
): ChordData {
  const name = generateChordName(rootNum, pattern);
  const notes = generateNoteStrings(rootNum, pattern);
  const noteNumbers = notes.map(noteToNumeric);
  
  // Add scale degrees mapping based on the pattern's scale degree map
  // This maps each note to its scale degree relative to the root
  const scaleDegrees: Record<number, string> = {};
  
  // Calculate the actual notes from the root and intervals
  const actualNotes = calculateChordNotes(rootNum, pattern.intervals);
  
  // Map each note to its scale degree
  actualNotes.forEach((noteNum, index) => {
    // The interval is used as a key in the scaleDegreeMap
    const interval = pattern.intervals[index];
    const scaleDegree = pattern.scaleDegreeMap[interval];
    
    // Use the position in the sequence (0, 1, 2, 3) as the key in scaleDegrees
    scaleDegrees[index] = scaleDegree;
  });

  return {
    id,
    name,
    notes,
    noteNumbers,
    difficulty,
    rootNote: rootNum,
    scaleDegrees,
    inversion: pattern.inversion
  };
}

// Generate all chords for a given difficulty level
export function getChordsForDifficulty(
  difficulty: DifficultyLevel,
): ChordData[] {
  const chords: ChordData[] = [];
  let id = 1;

  switch (difficulty) {
    case "level1":
      // Level 1: Basic major/minor chords with white keys (C, F, G, Am, Dm, Em)
      [1, 6, 8].forEach((rootNum) => {
        // C, F, G
        const pattern = chordPatterns.find(
          (p) => p.type === "major" && p.inversion === 0,
        );
        if (pattern) {
          chords.push(
            createChordDefinition(rootNum, pattern, id++, difficulty),
          );
        }
      });

      [10, 3, 5].forEach((rootNum) => {
        // Am, Dm, Em
        const pattern = chordPatterns.find(
          (p) => p.type === "minor" && p.inversion === 0,
        );
        if (pattern) {
          chords.push(
            createChordDefinition(rootNum, pattern, id++, difficulty),
          );
        }
      });
      break;

    case "level2":
      // Level 2: Major/minor chords with all white and black keys
      allRoots.forEach((rootNum) => {
        const majorPattern = chordPatterns.find(
          (p) => p.type === "major" && p.inversion === 0,
        );
        const minorPattern = chordPatterns.find(
          (p) => p.type === "minor" && p.inversion === 0,
        );

        if (majorPattern) {
          chords.push(
            createChordDefinition(rootNum, majorPattern, id++, difficulty),
          );
        }

        if (minorPattern) {
          chords.push(
            createChordDefinition(rootNum, minorPattern, id++, difficulty),
          );
        }
      });
      break;

    case "level3":
      // Level 3: Augmented, diminished and sus chords (white keys)
      [1, 3, 5, 6, 8, 10, 12].forEach((rootNum) => {
        // C, D, E, F, G, A, B
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
          chords.push(
            createChordDefinition(rootNum, augPattern, id++, difficulty),
          );
        }

        if (dimPattern) {
          chords.push(
            createChordDefinition(rootNum, dimPattern, id++, difficulty),
          );
        }

        if (sus2Pattern) {
          chords.push(
            createChordDefinition(rootNum, sus2Pattern, id++, difficulty),
          );
        }

        if (sus4Pattern) {
          chords.push(
            createChordDefinition(rootNum, sus4Pattern, id++, difficulty),
          );
        }
      });
      break;

    case "level4":
      // Level 4: Augmented and diminished chords (black keys) + sus chords
      allRoots
        .filter((rootNum) => ![1, 3, 5, 6, 8, 10].includes(rootNum))
        .forEach((rootNum) => {
          const augPattern = chordPatterns.find(
            (p) => p.type === "augmented" && p.inversion === 0,
          );
          const dimPattern = chordPatterns.find(
            (p) => p.type === "diminished" && p.inversion === 0,
          );

          if (augPattern) {
            chords.push(
              createChordDefinition(rootNum, augPattern, id++, difficulty),
            );
          }

          if (dimPattern) {
            chords.push(
              createChordDefinition(rootNum, dimPattern, id++, difficulty),
            );
          }
        });

      // Sus chords for C and D
      [1, 3].forEach((rootNum) => {
        // C, D
        const sus2Pattern = chordPatterns.find(
          (p) => p.type === "sus2" && p.inversion === 0,
        );
        const sus4Pattern = chordPatterns.find(
          (p) => p.type === "sus4" && p.inversion === 0,
        );

        if (sus2Pattern) {
          chords.push(
            createChordDefinition(rootNum, sus2Pattern, id++, difficulty),
          );
        }

        if (sus4Pattern) {
          chords.push(
            createChordDefinition(rootNum, sus4Pattern, id++, difficulty),
          );
        }
      });
      break;

    case "level5":
      // Level 5: First inversions
      [1, 8, 6, 3, 10, 5].forEach((rootNum) => {
        const isMajor = [1, 8, 6, 3].includes(rootNum);
        const pattern = chordPatterns.find(
          (p) => p.type === (isMajor ? "major" : "minor") && p.inversion === 1,
        );

        if (pattern) {
          chords.push(
            createChordDefinition(rootNum, pattern, id++, difficulty),
          );
        }
      });
      break;

    case "level6":
      // Level 6: Second inversions
      [1, 8, 6, 3, 10, 5].forEach((rootNum) => {
        const isMajor = [1, 8, 6, 3].includes(rootNum);
        const pattern = chordPatterns.find(
          (p) => p.type === (isMajor ? "major" : "minor") && p.inversion === 2,
        );

        if (pattern) {
          chords.push(
            createChordDefinition(rootNum, pattern, id++, difficulty),
          );
        }
      });
      break;

    case "level7":
      // Level 7: All non-7th chords and their inversions
      allRoots.forEach((rootNum) => {
        // Filter for non-7th chord patterns
        const triadPatterns = chordPatterns.filter((p) => 
          ["major", "minor", "diminished", "augmented", "sus2", "sus4"].includes(p.type)
        );

        triadPatterns.forEach((pattern) => {
          chords.push(
            createChordDefinition(rootNum, pattern, id++, difficulty),
          );
        });
      });
      break;
      
    case "level8":
      // Level 8: Basic 7th chords - dominant7, major7, minor7, and minorMajor7
      [1, 6, 8, 10, 3, 5].forEach((rootNum) => { // C, F, G, A, D, E
        // Find the relevant 7th chord patterns
        const dom7Pattern = chordPatterns.find((p) => p.type === "dominant7" && p.inversion === 0);
        const maj7Pattern = chordPatterns.find((p) => p.type === "major7" && p.inversion === 0);
        const min7Pattern = chordPatterns.find((p) => p.type === "minor7" && p.inversion === 0);
        const minMaj7Pattern = chordPatterns.find((p) => p.type === "minorMajor7" && p.inversion === 0);
        
        // Add each chord type with its inversions
        for (let inv = 0; inv <= 3; inv++) {
          const dom7Inv = chordPatterns.find((p) => p.type === "dominant7" && p.inversion === inv);
          const maj7Inv = chordPatterns.find((p) => p.type === "major7" && p.inversion === inv);
          const min7Inv = chordPatterns.find((p) => p.type === "minor7" && p.inversion === inv);
          const minMaj7Inv = chordPatterns.find((p) => p.type === "minorMajor7" && p.inversion === inv);
          
          if (dom7Inv) chords.push(createChordDefinition(rootNum, dom7Inv, id++, difficulty));
          if (maj7Inv) chords.push(createChordDefinition(rootNum, maj7Inv, id++, difficulty));
          if (min7Inv) chords.push(createChordDefinition(rootNum, min7Inv, id++, difficulty));
          if (minMaj7Inv) chords.push(createChordDefinition(rootNum, minMaj7Inv, id++, difficulty));
        }
      });
      break;
      
    case "level9":
      // Level 9: Advanced 7th chords - all augmented and diminished 7th chords
      [1, 6, 8, 10, 3, 5].forEach((rootNum) => { // C, F, G, A, D, E
        // Find the exotic 7th chord patterns with all inversions
        for (let inv = 0; inv <= 3; inv++) {
          const dim7Inv = chordPatterns.find((p) => p.type === "diminished7" && p.inversion === inv);
          const halfDim7Inv = chordPatterns.find((p) => p.type === "halfdiminished7" && p.inversion === inv);
          const dimMaj7Inv = chordPatterns.find((p) => p.type === "diminishedMajor7" && p.inversion === inv);
          const augMin7Inv = chordPatterns.find((p) => p.type === "augmentedMinor7" && p.inversion === inv);
          const augMaj7Inv = chordPatterns.find((p) => p.type === "augmentedMajor7" && p.inversion === inv);
          
          if (dim7Inv) chords.push(createChordDefinition(rootNum, dim7Inv, id++, difficulty));
          if (halfDim7Inv) chords.push(createChordDefinition(rootNum, halfDim7Inv, id++, difficulty));
          if (dimMaj7Inv) chords.push(createChordDefinition(rootNum, dimMaj7Inv, id++, difficulty));
          if (augMin7Inv) chords.push(createChordDefinition(rootNum, augMin7Inv, id++, difficulty));
          if (augMaj7Inv) chords.push(createChordDefinition(rootNum, augMaj7Inv, id++, difficulty));
        }
      });
      break;
  }

  return chords;
}

// Get all chords for all difficulty levels
export function getAllChords(): ChordData[] {
  const allChords: ChordData[] = [];
  difficultyLevels.forEach((level) => {
    allChords.push(...getChordsForDifficulty(level));
  });

  return allChords;
}

/**
 * Compare two chords to see if they match, enforcing correct inversion
 * Uses a mathematical approach with numeric note representation (1-12)
 * and considers scale degrees for better musical understanding
 *
 * @param userNotes Array of note strings (e.g. ["C4", "E4", "G4"])
 * @param targetNotes Array of note strings for the target chord
 * @param targetChord Optional ChordData object for more precise scale degree comparison
 * @returns boolean indicating whether the chords match
 */
export function checkChordMatch(
  userNotes: string[],
  targetNotes: string[],
  targetChord?: ChordData
): boolean {
  // Ensure we have the same number of notes
  if (userNotes.length !== targetNotes.length) {
    return false;
  }

  // Extract both note values and octaves
  const userNotesWithOctaves = userNotes.map((noteStr) => {
    const noteName = noteStr.replace(/[0-9]/g, "");
    const octave = parseInt(noteStr.match(/[0-9]+/)?.[0] || "4", 10);
    return {
      note: noteToNumber[noteName] || 0,
      octave,
    };
  });

  const targetNotesWithOctaves = targetNotes.map((noteStr) => {
    const noteName = noteStr.replace(/[0-9]/g, "");
    const octave = parseInt(noteStr.match(/[0-9]+/)?.[0] || "4", 10);
    return {
      note: noteToNumber[noteName] || 0,
      octave,
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

  // If we have chord data with scale degrees, we can perform more advanced comparison
  if (targetChord && targetChord.scaleDegrees) {
    // Advanced check: Verify the scale degrees match, which ensures the chord is
    // voiced correctly regardless of octave placement
    
    // Map each note in the user's chord to its position in the target chord
    const userChordPositions = userNumeric.map(userNote => {
      // Find this note's position in the target chord's noteNumbers
      return targetChord.noteNumbers.findIndex(targetNote => 
        targetNote === userNote
      );
    });
    
    // Verify each user chord position maps to the expected scale degree
    let scaleDegreesMatch = true;
    for (let i = 0; i < userChordPositions.length; i++) {
      const position = userChordPositions[i];
      if (position !== -1) {
        // Check if this note's position corresponds to the expected scale degree
        const expectedScaleDegree = targetChord.scaleDegrees[position];
        
        // If we can't find a scale degree for this position, it's an extra note
        if (!expectedScaleDegree) {
          scaleDegreesMatch = false;
          break;
        }
      } else {
        // Note not found in target chord
        scaleDegreesMatch = false;
        break;
      }
    }
    
    // At this point, we're just collecting extra data for future feedback
    // but the validation has already succeeded based on the notes and bass note
  }

  // The chord has the same notes and the correct bottom note, so it's valid
  return true;
}

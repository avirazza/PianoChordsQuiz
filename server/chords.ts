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
  // Mapping of interval positions to scale degrees
  // For example, in a major triad [0, 4, 7], the scaleDegrees would be { 0: "1", 4: "3", 7: "5" }
  scaleDegreeMap: Record<number, string>;
}

// Voicing describes the arrangement of notes in a chord
export interface ChordVoicing {
  inversion: number; // 0 = root position, 1 = first inversion, etc.
  sopranoScaleDegree: string; // The scale degree in the soprano (top) voice
  isOpen: boolean; // Whether the voicing is open (notes spread out) or closed (compact)
  scaleDegrees: string[]; // An array of scale degrees from bass to soprano
  name: string; // The display name for this voicing pattern
}

// Define all possible voicing patterns for triads
export const triadVoicings: ChordVoicing[] = [
  // Root position voicings
  {
    inversion: 0,
    sopranoScaleDegree: "5",
    isOpen: false,
    scaleDegrees: ["1", "3", "5"],
    name: "Root position (5 in soprano)",
  },
  {
    inversion: 0,
    sopranoScaleDegree: "3",
    isOpen: false,
    scaleDegrees: ["1", "5", "3"],
    name: "Root position (3 in soprano)",
  },
  {
    inversion: 0,
    sopranoScaleDegree: "1",
    isOpen: true,
    scaleDegrees: ["1", "5", "1"], // Doubled root
    name: "Root position (doubled root)",
  },

  // First inversion voicings
  {
    inversion: 1,
    sopranoScaleDegree: "1",
    isOpen: false,
    scaleDegrees: ["3", "5", "1"],
    name: "1st inv (1 in soprano)",
  },
  {
    inversion: 1,
    sopranoScaleDegree: "5",
    isOpen: false,
    scaleDegrees: ["3", "1", "5"],
    name: "1st inv (5 in soprano)",
  },
  {
    inversion: 1,
    sopranoScaleDegree: "3",
    isOpen: true,
    scaleDegrees: ["3", "1", "3"], // Doubled third
    name: "1st inv (doubled 3rd)",
  },

  // Second inversion voicings
  {
    inversion: 2,
    sopranoScaleDegree: "3",
    isOpen: false,
    scaleDegrees: ["5", "1", "3"],
    name: "2nd inv (3 in soprano)",
  },
  {
    inversion: 2,
    sopranoScaleDegree: "1",
    isOpen: false,
    scaleDegrees: ["5", "3", "1"],
    name: "2nd inv (1 in soprano)",
  },
  {
    inversion: 2,
    sopranoScaleDegree: "5",
    isOpen: true,
    scaleDegrees: ["5", "3", "5"], // Doubled fifth
    name: "2nd inv (doubled 5th)",
  },
];

// Define all possible voicing patterns for seventh chords
export const seventhChordVoicings: ChordVoicing[] = [
  // Root position voicings
  {
    inversion: 0,
    sopranoScaleDegree: "7",
    isOpen: false,
    scaleDegrees: ["1", "3", "5", "7"],
    name: "Root position closed (7 in soprano)",
  },
  {
    inversion: 0,
    sopranoScaleDegree: "7",
    isOpen: true,
    scaleDegrees: ["1", "5", "3", "7"],
    name: "Root position open (7 in soprano)",
  },
  {
    inversion: 0,
    sopranoScaleDegree: "5",
    isOpen: false,
    scaleDegrees: ["1", "7", "3", "5"],
    name: "Root position closed (5 in soprano)",
  },
  {
    inversion: 0,
    sopranoScaleDegree: "5",
    isOpen: true,
    scaleDegrees: ["1", "3", "7", "5"],
    name: "Root position open (5 in soprano)",
  },
  {
    inversion: 0,
    sopranoScaleDegree: "3",
    isOpen: false,
    scaleDegrees: ["1", "5", "7", "3"],
    name: "Root position closed (3 in soprano)",
  },
  {
    inversion: 0,
    sopranoScaleDegree: "3",
    isOpen: true,
    scaleDegrees: ["1", "7", "5", "3"],
    name: "Root position open (3 in soprano)",
  },

  // First inversion voicings
  {
    inversion: 1,
    sopranoScaleDegree: "1",
    isOpen: false,
    scaleDegrees: ["3", "5", "7", "1"],
    name: "1st inv closed (1 in soprano)",
  },
  {
    inversion: 1,
    sopranoScaleDegree: "1",
    isOpen: true,
    scaleDegrees: ["3", "7", "5", "1"],
    name: "1st inv open (1 in soprano)",
  },
  {
    inversion: 1,
    sopranoScaleDegree: "7",
    isOpen: false,
    scaleDegrees: ["3", "1", "5", "7"],
    name: "1st inv closed (7 in soprano)",
  },
  {
    inversion: 1,
    sopranoScaleDegree: "7",
    isOpen: true,
    scaleDegrees: ["3", "5", "1", "7"],
    name: "1st inv open (7 in soprano)",
  },
  {
    inversion: 1,
    sopranoScaleDegree: "5",
    isOpen: false,
    scaleDegrees: ["3", "7", "1", "5"],
    name: "1st inv closed (5 in soprano)",
  },
  {
    inversion: 1,
    sopranoScaleDegree: "5",
    isOpen: true,
    scaleDegrees: ["3", "1", "7", "5"],
    name: "1st inv open (5 in soprano)",
  },

  // Second inversion voicings
  {
    inversion: 2,
    sopranoScaleDegree: "3",
    isOpen: false,
    scaleDegrees: ["5", "7", "1", "3"],
    name: "2nd inv closed (3 in soprano)",
  },
  {
    inversion: 2,
    sopranoScaleDegree: "3",
    isOpen: true,
    scaleDegrees: ["5", "1", "7", "3"],
    name: "2nd inv open (3 in soprano)",
  },
  {
    inversion: 2,
    sopranoScaleDegree: "1",
    isOpen: false,
    scaleDegrees: ["5", "3", "7", "1"],
    name: "2nd inv closed (1 in soprano)",
  },
  {
    inversion: 2,
    sopranoScaleDegree: "1",
    isOpen: true,
    scaleDegrees: ["5", "7", "3", "1"],
    name: "2nd inv open (1 in soprano)",
  },
  {
    inversion: 2,
    sopranoScaleDegree: "7",
    isOpen: false,
    scaleDegrees: ["5", "1", "3", "7"],
    name: "2nd inv closed (7 in soprano)",
  },
  {
    inversion: 2,
    sopranoScaleDegree: "7",
    isOpen: true,
    scaleDegrees: ["5", "3", "1", "7"],
    name: "2nd inv open (7 in soprano)",
  },

  // Third inversion voicings
  {
    inversion: 3,
    sopranoScaleDegree: "5",
    isOpen: false,
    scaleDegrees: ["7", "1", "3", "5"],
    name: "3rd inv closed (5 in soprano)",
  },
  {
    inversion: 3,
    sopranoScaleDegree: "5",
    isOpen: true,
    scaleDegrees: ["7", "3", "1", "5"],
    name: "3rd inv open (5 in soprano)",
  },
  {
    inversion: 3,
    sopranoScaleDegree: "3",
    isOpen: false,
    scaleDegrees: ["7", "5", "1", "3"],
    name: "3rd inv closed (3 in soprano)",
  },
  {
    inversion: 3,
    sopranoScaleDegree: "3",
    isOpen: true,
    scaleDegrees: ["7", "1", "5", "3"],
    name: "3rd inv open (3 in soprano)",
  },
  {
    inversion: 3,
    sopranoScaleDegree: "1",
    isOpen: false,
    scaleDegrees: ["7", "3", "5", "1"],
    name: "3rd inv closed (1 in soprano)",
  },
  {
    inversion: 3,
    sopranoScaleDegree: "1",
    isOpen: true,
    scaleDegrees: ["7", "5", "3", "1"],
    name: "3rd inv open (1 in soprano)",
  },
];

// Helper function to get inversion display text
export function getInversionDisplay(inversion: number): string {
  // Convert inversion number to text for display
  switch (inversion) {
    case 0:
      return ""; // Root position
    case 1:
      return "1st inv"; // 3rd in bass
    case 2:
      return "2nd inv"; // 5th in bass
    case 3:
      return "3rd inv"; // 7th in bass (for 7th chords)
    case 4:
      return "4th inv";
    default:
      return `${inversion}th inv`;
  }
}

// Define root position chord patterns only
export const chordPatterns: ChordPattern[] = [
  // Major chords
  {
    type: "major",
    display: "",
    intervals: [0, 4, 7],
    scaleDegreeMap: { 0: "1", 4: "3", 7: "5" }, // Root position: 1-3-5
  },

  // Minor chords
  {
    type: "minor",
    display: "m",
    intervals: [0, 3, 7],
    scaleDegreeMap: { 0: "1", 3: "b3", 7: "5" }, // Root position: 1-b3-5
  },

  // Augmented chords
  {
    type: "augmented",
    display: "aug",
    intervals: [0, 4, 8],
    scaleDegreeMap: { 0: "1", 4: "3", 8: "#5" }, // Root position: 1-3-#5
  },

  // Diminished chords
  {
    type: "diminished",
    display: "dim",
    intervals: [0, 3, 6],
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5" }, // Root position: 1-b3-b5
  },

  // Sus2 chords
  {
    type: "sus2",
    display: "sus2",
    intervals: [0, 2, 7],
    scaleDegreeMap: { 0: "1", 2: "2", 7: "5" }, // Root position: 1-2-5
  },

  // Sus4 chords
  {
    type: "sus4",
    display: "sus4",
    intervals: [0, 5, 7],
    scaleDegreeMap: { 0: "1", 5: "4", 7: "5" }, // Root position: 1-4-5
  },

  // 7th chords (dominant 7th)
  {
    type: "dominant7",
    display: "7",
    intervals: [0, 4, 7, 10],
    scaleDegreeMap: { 0: "1", 4: "3", 7: "5", 10: "b7" }, // Root position: 1-3-5-b7
  },

  // Major 7th chords
  {
    type: "major7",
    display: "maj7",
    intervals: [0, 4, 7, 11],
    scaleDegreeMap: { 0: "1", 4: "3", 7: "5", 11: "7" }, // Root position: 1-3-5-7
  },

  // Minor 7th chords
  {
    type: "minor7",
    display: "m7",
    intervals: [0, 3, 7, 10],
    scaleDegreeMap: { 0: "1", 3: "b3", 7: "5", 10: "b7" }, // Root position: 1-b3-5-b7
  },

  // Diminished 7th chords
  {
    type: "diminished7",
    display: "dim7",
    intervals: [0, 3, 6, 9],
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5", 9: "bb7" }, // Root position: 1-b3-b5-bb7
  },

  // Half-diminished 7th chords (m7b5)
  {
    type: "halfdiminished7",
    display: "m7b5",
    intervals: [0, 3, 6, 10],
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5", 10: "b7" }, // Root position: 1-b3-b5-b7
  },

  // Minor with Major 7th chords (mMaj7)
  {
    type: "minorMajor7",
    display: "mMaj7",
    intervals: [0, 3, 7, 11],
    scaleDegreeMap: { 0: "1", 3: "b3", 7: "5", 11: "7" }, // Root position: 1-b3-5-7
  },

  // Diminished with Major 7th (dimMaj7)
  {
    type: "diminishedMajor7",
    display: "dimMaj7",
    intervals: [0, 3, 6, 11],
    scaleDegreeMap: { 0: "1", 3: "b3", 6: "b5", 11: "7" }, // Root position: 1-b3-b5-7
  },

  // Augmented with Minor 7th (aug7)
  {
    type: "augmentedMinor7",
    display: "aug7",
    intervals: [0, 4, 8, 10],
    scaleDegreeMap: { 0: "1", 4: "3", 8: "#5", 10: "b7" }, // Root position: 1-3-#5-b7
  },

  // Augmented with Major 7th (augMaj7)
  {
    type: "augmentedMajor7",
    display: "augMaj7",
    intervals: [0, 4, 8, 11],
    scaleDegreeMap: { 0: "1", 4: "3", 8: "#5", 11: "7" }, // Root position: 1-3-#5-7
  },
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

  // For root position chords, just show the root + chord type
  if (pattern.inversion === 0) {
    return `${rootName}${pattern.display}`;
  } else {
    // Use the getInversionDisplay function to get the inversion text (e.g., "1st inv")
    const inversionText = getInversionDisplay(pattern.inversion);

    // The chord name should show the root note as the main chord name plus the inversion text
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
      numericToNote(topNote, topNote > prevNote ? baseOctave : baseOctave + 1),
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
    noteStrings.push(
      numericToNote(noteNumbers[noteNumbers.length - 1], baseOctave + 1),
    );
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

// Create a complete chord definition with proper scale degree mapping
export function createChordDefinition(
  rootNum: number,
  pattern: ChordPattern,
  id: number,
  difficulty: DifficultyLevel,
): ChordData {
  const name = generateChordName(rootNum, pattern);
  const notes = generateNoteStrings(rootNum, pattern);
  const noteNumbers = notes.map(noteToNumeric);

  // This maps each note position to its scale degree relative to the root
  const scaleDegrees: Record<number, string> = {};

  // Calculate the actual notes from the root and intervals (before inversion)
  const baseNotes = calculateChordNotes(rootNum, pattern.intervals);

  // First map the scale degrees for the un-inverted chord (root position)
  const baseScaleDegrees: Record<number, string> = {};
  baseNotes.forEach((noteNum, index) => {
    const interval = pattern.intervals[index];
    const scaleDegree = pattern.scaleDegreeMap[interval];
    baseScaleDegrees[index] = scaleDegree;
  });

  // Now adjust for inversions - we need to remap the scale degrees based on the new bass note
  if (pattern.inversion === 0) {
    // Root position - scale degrees stay the same
    Object.assign(scaleDegrees, baseScaleDegrees);
  } else {
    // For inversions, we need to rotate the scale degrees
    // In an inversion, the order of notes changes, but their scale degrees don't
    const chordSize = baseNotes.length;

    // For each position in the inverted chord, map to the correct scale degree
    for (let i = 0; i < chordSize; i++) {
      // Calculate the position in the original chord
      // For a 1st inversion of a triad, the notes would be rearranged from [0,1,2] to [1,2,0]
      // So position 0 in the inverted chord maps to position 1 in the original chord
      const originalPosition = (i + pattern.inversion) % chordSize;
      scaleDegrees[i] = baseScaleDegrees[originalPosition];
    }
  }

  return {
    id,
    name,
    notes,
    noteNumbers,
    difficulty,
    rootNote: rootNum,
    scaleDegrees,
    inversion: pattern.inversion,
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
          [
            "major",
            "minor",
            "diminished",
            "augmented",
            "sus2",
            "sus4",
          ].includes(p.type),
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
      [1, 6, 8, 10, 3, 5].forEach((rootNum) => {
        // C, F, G, A, D, E
        // Find the relevant 7th chord patterns
        const dom7Pattern = chordPatterns.find(
          (p) => p.type === "dominant7" && p.inversion === 0,
        );
        const maj7Pattern = chordPatterns.find(
          (p) => p.type === "major7" && p.inversion === 0,
        );
        const min7Pattern = chordPatterns.find(
          (p) => p.type === "minor7" && p.inversion === 0,
        );
        const minMaj7Pattern = chordPatterns.find(
          (p) => p.type === "minorMajor7" && p.inversion === 0,
        );

        // Add each chord type with its inversions
        for (let inv = 0; inv <= 3; inv++) {
          const dom7Inv = chordPatterns.find(
            (p) => p.type === "dominant7" && p.inversion === inv,
          );
          const maj7Inv = chordPatterns.find(
            (p) => p.type === "major7" && p.inversion === inv,
          );
          const min7Inv = chordPatterns.find(
            (p) => p.type === "minor7" && p.inversion === inv,
          );
          const minMaj7Inv = chordPatterns.find(
            (p) => p.type === "minorMajor7" && p.inversion === inv,
          );

          if (dom7Inv)
            chords.push(
              createChordDefinition(rootNum, dom7Inv, id++, difficulty),
            );
          if (maj7Inv)
            chords.push(
              createChordDefinition(rootNum, maj7Inv, id++, difficulty),
            );
          if (min7Inv)
            chords.push(
              createChordDefinition(rootNum, min7Inv, id++, difficulty),
            );
          if (minMaj7Inv)
            chords.push(
              createChordDefinition(rootNum, minMaj7Inv, id++, difficulty),
            );
        }
      });
      break;

    case "level9":
      // Level 9: Advanced 7th chords - all augmented and diminished 7th chords
      [1, 6, 8, 10, 3, 5].forEach((rootNum) => {
        // C, F, G, A, D, E
        // Find the exotic 7th chord patterns with all inversions
        for (let inv = 0; inv <= 3; inv++) {
          const dim7Inv = chordPatterns.find(
            (p) => p.type === "diminished7" && p.inversion === inv,
          );
          const halfDim7Inv = chordPatterns.find(
            (p) => p.type === "halfdiminished7" && p.inversion === inv,
          );
          const dimMaj7Inv = chordPatterns.find(
            (p) => p.type === "diminishedMajor7" && p.inversion === inv,
          );
          const augMin7Inv = chordPatterns.find(
            (p) => p.type === "augmentedMinor7" && p.inversion === inv,
          );
          const augMaj7Inv = chordPatterns.find(
            (p) => p.type === "augmentedMajor7" && p.inversion === inv,
          );

          if (dim7Inv)
            chords.push(
              createChordDefinition(rootNum, dim7Inv, id++, difficulty),
            );
          if (halfDim7Inv)
            chords.push(
              createChordDefinition(rootNum, halfDim7Inv, id++, difficulty),
            );
          if (dimMaj7Inv)
            chords.push(
              createChordDefinition(rootNum, dimMaj7Inv, id++, difficulty),
            );
          if (augMin7Inv)
            chords.push(
              createChordDefinition(rootNum, augMin7Inv, id++, difficulty),
            );
          if (augMaj7Inv)
            chords.push(
              createChordDefinition(rootNum, augMaj7Inv, id++, difficulty),
            );
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
 * Helper function to convert a scale degree (like "1", "b3", "#5") to a semitone offset
 *
 * @param scaleDegree The scale degree (like "1", "b3", "#5", "b7")
 * @returns The semitone offset from the root
 */
export function scaleDegreeToSemitones(scaleDegree: string): number {
  // Parse the scale degree into a normalized form
  const degree = scaleDegree.replace(/[b#]/g, ""); // Remove flats/sharps to get the base degree
  const flatCount = (scaleDegree.match(/b/g) || []).length;
  const sharpCount = (scaleDegree.match(/#/g) || []).length;

  // Calculate the semitone offset based on the scale degree
  let semitones = 0;

  // Major scale intervals in semitones from the root
  switch (degree) {
    case "1":
      semitones = 0;
      break; // Root/Unison
    case "2":
      semitones = 2;
      break; // Major 2nd
    case "3":
      semitones = 4;
      break; // Major 3rd
    case "4":
      semitones = 5;
      break; // Perfect 4th
    case "5":
      semitones = 7;
      break; // Perfect 5th
    case "6":
      semitones = 9;
      break; // Major 6th
    case "7":
      semitones = 11;
      break; // Major 7th
    default:
      semitones = 0; // Default to root if unknown
  }

  // Apply flats and sharps
  semitones = semitones - flatCount + sharpCount;

  // Normalize to range 0-11
  while (semitones < 0) semitones += 12;
  while (semitones >= 12) semitones -= 12;

  return semitones;
}

/**
 * Helper function to convert a semitone offset to a numeric note value
 * given a root note
 *
 * @param semitones The semitone offset from the root (0-11)
 * @param rootNote The numeric root note (1-12, where 1=C)
 * @returns The numeric note value (1-12)
 */
export function semitonesToNote(semitones: number, rootNote: number): number {
  // Add semitones to the root note
  let note = rootNote + semitones;

  // Normalize to range 1-12
  while (note > 12) note -= 12;
  while (note < 1) note += 12;

  return note;
}

/**
 * Compare two chords to see if they match, using the scale degree approach
 * This accurately identifies chords regardless of inversion by checking:
 * 1. The set of notes (pitch classes) matches
 * 2. The correct inversion based on actual scale degrees (not just bass note)
 *
 * @param userNotes Array of note strings (e.g. ["C4", "E4", "G4"])
 * @param targetNotes Array of note strings for the target chord
 * @param targetChord Optional ChordData object for more precise scale degree comparison
 * @returns boolean indicating whether the chords match
 */
export function checkChordMatch(
  userNotes: string[],
  targetNotes: string[],
  targetChord?: ChordData,
): boolean {
  // If we don't have the target chord data with scale degrees, we can't do proper matching
  if (!targetChord || !targetChord.scaleDegrees) {
    // Fall back to simpler matching based just on the note values
    const userPitchClasses = userNotes.map(noteToNumeric).sort((a, b) => a - b);
    const targetPitchClasses = targetNotes
      .map(noteToNumeric)
      .sort((a, b) => a - b);

    // Check if the sets of pitch classes match, ignoring octaves and note order
    if (userPitchClasses.length !== targetPitchClasses.length) {
      return false;
    }

    for (let i = 0; i < userPitchClasses.length; i++) {
      if (userPitchClasses[i] !== targetPitchClasses[i]) {
        return false;
      }
    }
    return true;
  }

  // Advanced scale-degree-based matching
  const rootNote = targetChord.rootNote; // The numeric root note value (1-12)
  const chordScaleDegrees = targetChord.scaleDegrees; // Mapping of note positions to scale degrees

  // Extract user notes with octaves to arrange from lowest to highest
  const userNotesWithOctaves = userNotes.map((noteStr) => {
    const noteName = noteStr.replace(/[0-9]/g, ""); // Remove octave
    const octave = parseInt(noteStr.match(/[0-9]+/)?.[0] || "4", 10);
    const noteNum = noteToNumeric(noteName);
    return { note: noteNum, octave };
  });

  // Sort by octave (lowest to highest), then by note value within the same octave
  userNotesWithOctaves.sort((a, b) => {
    if (a.octave !== b.octave) return a.octave - b.octave;
    return a.note - b.note;
  });

  // Extract just the pitch classes (1-12) of the user's notes in order from bass to soprano
  const userPitchClasses = userNotesWithOctaves.map((n) => n.note);

  // Step 1: Make sure we have all the required notes for the chord (pitch class set match)
  // Convert the target chord's scale degrees to expected note values
  const expectedSemitones = Object.values(chordScaleDegrees).map(
    scaleDegreeToSemitones,
  );
  const expectedNotes = expectedSemitones.map((semitones) =>
    semitonesToNote(semitones, rootNote),
  );

  // Check if all expected notes are present in the user's chord (ignoring order)
  const userPitchClassSet = new Set(userPitchClasses);
  for (const expectedNote of expectedNotes) {
    if (!userPitchClassSet.has(expectedNote)) {
      return false; // Missing a required note
    }
  }

  // Make sure the user didn't play any extra notes
  if (userPitchClasses.length !== expectedNotes.length) {
    return false;
  }

  // Step 2: For inverted chords, check if the inversion matches based on scale degrees
  if (targetChord.inversion > 0) {
    // Get the scale degree that should be in the bass for this inversion
    // For a 1st inversion, the 3rd is in the bass; for 2nd inversion, the 5th is in the bass, etc.
    let bassScaleDegree = "";
    for (const [pos, degree] of Object.entries(chordScaleDegrees)) {
      if (parseInt(pos) === targetChord.inversion) {
        bassScaleDegree = degree;
        break;
      }
    }

    if (bassScaleDegree) {
      // Convert the expected bass scale degree to a note value
      const bassSemitones = scaleDegreeToSemitones(bassScaleDegree);
      const expectedBassNote = semitonesToNote(bassSemitones, rootNote);

      // Check if the user's bass note matches the expected bass note
      if (userPitchClasses[0] !== expectedBassNote) {
        return false; // Wrong bass note for this inversion
      }
    }
  } else {
    // For root position chords, the root note should be in the bass
    const rootScaleDegree = Object.entries(chordScaleDegrees).find(
      ([_, degree]) => degree === "1",
    )?.[0];

    if (rootScaleDegree) {
      // For root position, the root note should be in the bass
      if (userPitchClasses[0] !== rootNote) {
        return false; // Root note not in the bass for a root position chord
      }
    }
  }

  // If we reach here, the chord matches in terms of both pitch class content and inversion
  return true;
}

import { 
  type ChordData, 
  type DifficultyLevel,
  difficultyLevels
} from "@shared/schema";

// Note name to number mapping (1-12)
export const noteToNumber: Record<string, number> = {
  C: 1, "C#": 2, Db: 2,
  D: 3, "D#": 4, Eb: 4,
  E: 5, F: 6, "F#": 7,
  Gb: 7, G: 8, "G#": 9,
  Ab: 9, A: 10, "A#": 11,
  Bb: 11, B: 12,
};

// Number to note name mapping
export const numberToNote: Record<number, string> = {
  1: 'C', 2: 'C#', 3: 'D', 4: 'Eb', 5: 'E',
  6: 'F', 7: 'F#', 8: 'G', 9: 'Ab', 10: 'A',
  11: 'Bb', 12: 'B'
};

// Chord pattern definitions
export interface ChordPattern {
  type: string;
  display: string;
  intervals: number[];
  inversion: number;
  inversionDisplay?: string;
}

// Define all chord patterns
export const chordPatterns: ChordPattern[] = [
  // Major chords
  { type: 'major', display: '', intervals: [0, 4, 7], inversion: 0 },
  { type: 'major', display: '', intervals: [0, 3, 8], inversion: 1, inversionDisplay: '/3' },
  { type: 'major', display: '', intervals: [0, 5, 9], inversion: 2, inversionDisplay: '/5' },
  
  // Minor chords
  { type: 'minor', display: 'm', intervals: [0, 3, 7], inversion: 0 },
  { type: 'minor', display: 'm', intervals: [0, 4, 9], inversion: 1, inversionDisplay: 'm/b3' },
  { type: 'minor', display: 'm', intervals: [0, 5, 8], inversion: 2, inversionDisplay: 'm/5' },
  
  // Augmented chords
  { type: 'augmented', display: 'aug', intervals: [0, 4, 8], inversion: 0 },
  { type: 'augmented', display: 'aug', intervals: [0, 4, 8], inversion: 1, inversionDisplay: 'aug/3' },
  { type: 'augmented', display: 'aug', intervals: [0, 4, 8], inversion: 2, inversionDisplay: 'aug/#5' },
  
  // Diminished chords
  { type: 'diminished', display: 'dim', intervals: [0, 3, 6], inversion: 0 },
  { type: 'diminished', display: 'dim', intervals: [0, 3, 9], inversion: 1, inversionDisplay: 'dim/b3' },
  { type: 'diminished', display: 'dim', intervals: [0, 6, 9], inversion: 2, inversionDisplay: 'dim/b5' },
  
  // Sus2 chords
  { type: 'sus2', display: 'sus2', intervals: [0, 2, 7], inversion: 0 },
  { type: 'sus2', display: 'sus2', intervals: [0, 5, 10], inversion: 1, inversionDisplay: 'sus2/2' },
  { type: 'sus2', display: 'sus2', intervals: [0, 5, 7], inversion: 2, inversionDisplay: 'sus2/5' },
  
  // Sus4 chords
  { type: 'sus4', display: 'sus4', intervals: [0, 5, 7], inversion: 0 },
  { type: 'sus4', display: 'sus4', intervals: [0, 2, 7], inversion: 1, inversionDisplay: 'sus4/4' },
  { type: 'sus4', display: 'sus4', intervals: [0, 5, 10], inversion: 2, inversionDisplay: 'sus4/5' }
];

// All roots from 1 to 12
export const allRoots = Array.from({length: 12}, (_, i) => i + 1);

// Calculate chord notes from root and intervals
export function calculateChordNotes(rootNum: number, intervals: number[]): number[] {
  return intervals.map(interval => {
    let note = (rootNum + interval) % 12;
    if (note === 0) note = 12; // Convert 0 to 12 for consistency
    return note;
  });
}

// Convert a note string (e.g., "C4") to a numeric representation (1-12)
export function noteToNumeric(noteStr: string): number {
  // Extract the note name without octave
  const noteName = noteStr.replace(/[0-9]/g, '');
  return noteToNumber[noteName] || 0;
}

// Generate octave-specific note string
export function numericToNote(noteNum: number, octave: number): string {
  return `${numberToNote[noteNum]}${octave}`;
}

// Get root name for a given numeric root
export function getRootName(rootNum: number): string {
  return numberToNote[rootNum] || '';
}

// Generate chord name based on pattern and root
export function generateChordName(rootNum: number, pattern: ChordPattern): string {
  const rootName = getRootName(rootNum);
  
  if (pattern.inversion === 0) {
    return `${rootName}${pattern.display}`;
  } else {
    // For inversions, find the bass note
    const bassInterval = pattern.intervals[0];
    const bassNoteNum = (rootNum + bassInterval) % 12 || 12;
    const bassNoteName = numberToNote[bassNoteNum];
    
    return `${rootName}${pattern.display}/${bassNoteName}`;
  }
}

// Generate note strings with octave
export function generateNoteStrings(rootNum: number, pattern: ChordPattern): string[] {
  const baseOctave = 4;
  const intervals = pattern.intervals;
  
  // Calculate note numbers
  const noteNumbers = calculateChordNotes(rootNum, intervals);
  
  // Convert to note strings with proper octave adjustments
  const noteStrings: string[] = [];
  
  // Handle octave adjustments based on inversion
  if (pattern.inversion === 0) {
    // Root position - standard case
    noteStrings.push(numericToNote(noteNumbers[0], baseOctave));
    noteStrings.push(numericToNote(noteNumbers[1], noteNumbers[1] > noteNumbers[0] ? baseOctave : baseOctave + 1));
    noteStrings.push(numericToNote(noteNumbers[2], noteNumbers[2] > noteNumbers[1] ? baseOctave : baseOctave + 1));
  } else if (pattern.inversion === 1) {
    // First inversion
    noteStrings.push(numericToNote(noteNumbers[0], baseOctave));
    noteStrings.push(numericToNote(noteNumbers[1], noteNumbers[1] > noteNumbers[0] ? baseOctave : baseOctave + 1));
    noteStrings.push(numericToNote(noteNumbers[2], baseOctave + 1)); // Root always in higher octave
  } else {
    // Second inversion
    noteStrings.push(numericToNote(noteNumbers[0], baseOctave));
    noteStrings.push(numericToNote(noteNumbers[1], baseOctave + 1)); // Middle note in higher octave
    noteStrings.push(numericToNote(noteNumbers[2], baseOctave + 1)); // Top note in higher octave
  }
  
  return noteStrings;
}

// Create a complete chord definition
export function createChordDefinition(
  rootNum: number, 
  pattern: ChordPattern, 
  id: number,
  difficulty: DifficultyLevel
): ChordData {
  const name = generateChordName(rootNum, pattern);
  const notes = generateNoteStrings(rootNum, pattern);
  const noteNumbers = notes.map(noteToNumeric);
  
  return {
    id,
    name,
    notes,
    noteNumbers,
    difficulty
  };
}

// Generate all chords for a given difficulty level
export function getChordsForDifficulty(difficulty: DifficultyLevel): ChordData[] {
  const chords: ChordData[] = [];
  let id = 1;
  
  switch(difficulty) {
    case 'level1':
      // Level 1: Basic major/minor chords with white keys (C, F, G, Am, Dm, Em)
      [1, 6, 8].forEach(rootNum => { // C, F, G
        const pattern = chordPatterns.find(p => p.type === 'major' && p.inversion === 0);
        if (pattern) {
          chords.push(createChordDefinition(rootNum, pattern, id++, difficulty));
        }
      });
      
      [1, 6, 8].forEach(rootNum => { // Cm, Fm, Gm
        const pattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 0);
        if (pattern) {
          chords.push(createChordDefinition(rootNum, pattern, id++, difficulty));
        }
      });
      
      [10, 3, 5].forEach(rootNum => { // Am, Dm, Em
        const pattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 0);
        if (pattern) {
          chords.push(createChordDefinition(rootNum, pattern, id++, difficulty));
        }
      });
      break;
      
    case 'level2':
      // Level 2: Major/minor chords with all remaining white and black keys
      allRoots
        .filter(rootNum => ![1, 6, 8, 10, 3, 5].includes(rootNum))
        .forEach(rootNum => {
          const majorPattern = chordPatterns.find(p => p.type === 'major' && p.inversion === 0);
          const minorPattern = chordPatterns.find(p => p.type === 'minor' && p.inversion === 0);
          
          if (majorPattern) {
            chords.push(createChordDefinition(rootNum, majorPattern, id++, difficulty));
          }
          
          if (minorPattern) {
            chords.push(createChordDefinition(rootNum, minorPattern, id++, difficulty));
          }
        });
      break;
      
    case 'level3':
      // Level 3: Augmented and diminished chords (white keys)
      [1, 3, 5, 6, 8, 10].forEach(rootNum => { // C, D, E, F, G, A
        const augPattern = chordPatterns.find(p => p.type === 'augmented' && p.inversion === 0);
        const dimPattern = chordPatterns.find(p => p.type === 'diminished' && p.inversion === 0);
        
        if (augPattern) {
          chords.push(createChordDefinition(rootNum, augPattern, id++, difficulty));
        }
        
        if (dimPattern) {
          chords.push(createChordDefinition(rootNum, dimPattern, id++, difficulty));
        }
      });
      break;
      
    case 'level4':
      // Level 4: Augmented and diminished chords (black keys) + sus chords
      allRoots
        .filter(rootNum => ![1, 3, 5, 6, 8, 10].includes(rootNum))
        .forEach(rootNum => {
          const augPattern = chordPatterns.find(p => p.type === 'augmented' && p.inversion === 0);
          const dimPattern = chordPatterns.find(p => p.type === 'diminished' && p.inversion === 0);
          
          if (augPattern) {
            chords.push(createChordDefinition(rootNum, augPattern, id++, difficulty));
          }
          
          if (dimPattern) {
            chords.push(createChordDefinition(rootNum, dimPattern, id++, difficulty));
          }
        });
      
      // Sus chords for C and D
      [1, 3].forEach(rootNum => { // C, D
        const sus2Pattern = chordPatterns.find(p => p.type === 'sus2' && p.inversion === 0);
        const sus4Pattern = chordPatterns.find(p => p.type === 'sus4' && p.inversion === 0);
        
        if (sus2Pattern) {
          chords.push(createChordDefinition(rootNum, sus2Pattern, id++, difficulty));
        }
        
        if (sus4Pattern) {
          chords.push(createChordDefinition(rootNum, sus4Pattern, id++, difficulty));
        }
      });
      break;
      
    case 'level5':
      // Level 5: First inversions
      [1, 8, 6, 3, 10, 5].forEach(rootNum => {
        const isMajor = [1, 8, 6, 3].includes(rootNum);
        const pattern = chordPatterns.find(p => 
          p.type === (isMajor ? 'major' : 'minor') && 
          p.inversion === 1
        );
        
        if (pattern) {
          chords.push(createChordDefinition(rootNum, pattern, id++, difficulty));
        }
      });
      break;
      
    case 'level6':
      // Level 6: Second inversions
      [1, 8, 6, 3, 10, 5].forEach(rootNum => {
        const isMajor = [1, 8, 6, 3].includes(rootNum);
        const pattern = chordPatterns.find(p => 
          p.type === (isMajor ? 'major' : 'minor') && 
          p.inversion === 2
        );
        
        if (pattern) {
          chords.push(createChordDefinition(rootNum, pattern, id++, difficulty));
        }
      });
      break;
      
    case 'level7':
      // Level 7: ALL possible combinations
      allRoots.forEach(rootNum => {
        chordPatterns.forEach(pattern => {
          chords.push(createChordDefinition(rootNum, pattern, id++, difficulty));
        });
      });
      break;
  }
  
  return chords;
}

// Get all chords for all difficulty levels
export function getAllChords(): ChordData[] {
  const allChords: ChordData[] = [];
  difficultyLevels.forEach(level => {
    allChords.push(...getChordsForDifficulty(level));
  });
  
  return allChords;
}

/**
 * Compare two chords to see if they match, enforcing correct inversion
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
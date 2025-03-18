import { type ChordData, type DifficultyLevel } from "@shared/schema";

// Chord data structure
interface ChordDefinition {
  name: string;
  notes: string[];          // Traditional note representation ('C4', 'E4', etc.)
  noteNumbers: number[];    // Numeric representation (1=C, 2=C#, ..., 12=B)
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

// Chord definitions for each level, as specified
export const chordDefinitions: ChordDefinition[] = [
  // Level 1: Major and minor triads with simplified naming
  { name: 'C', notes: ['C4', 'E4', 'G4'], noteNumbers: [1, 5, 8], difficulty: 'level1' },
  { name: 'Cm', notes: ['C4', 'Eb4', 'G4'], noteNumbers: [1, 4, 8], difficulty: 'level1' },
  { name: 'F', notes: ['F4', 'A4', 'C5'], noteNumbers: [6, 10, 1], difficulty: 'level1' },
  { name: 'Fm', notes: ['F4', 'Ab4', 'C5'], noteNumbers: [6, 9, 1], difficulty: 'level1' },
  { name: 'G', notes: ['G4', 'B4', 'D5'], noteNumbers: [8, 12, 3], difficulty: 'level1' },
  { name: 'Gm', notes: ['G4', 'Bb4', 'D5'], noteNumbers: [8, 11, 3], difficulty: 'level1' },
  { name: 'Am', notes: ['A4', 'C5', 'E5'], noteNumbers: [10, 1, 5], difficulty: 'level1' },
  { name: 'Dm', notes: ['D4', 'F4', 'A4'], noteNumbers: [3, 6, 10], difficulty: 'level1' },
  { name: 'Em', notes: ['E4', 'G4', 'B4'], noteNumbers: [5, 8, 12], difficulty: 'level1' },
  
  // Level 2: Major and minor chords with all white and black keys
  { name: 'D', notes: ['D4', 'F#4', 'A4'], noteNumbers: [3, 7, 10], difficulty: 'level2' },
  { name: 'E', notes: ['E4', 'G#4', 'B4'], noteNumbers: [5, 9, 12], difficulty: 'level2' },
  { name: 'A', notes: ['A4', 'C#5', 'E5'], noteNumbers: [10, 2, 5], difficulty: 'level2' },
  { name: 'Bm', notes: ['B4', 'D5', 'F#5'], noteNumbers: [12, 3, 7], difficulty: 'level2' },
  { name: 'Eb', notes: ['Eb4', 'G4', 'Bb4'], noteNumbers: [4, 8, 11], difficulty: 'level2' },
  { name: 'Ab', notes: ['Ab4', 'C5', 'Eb5'], noteNumbers: [9, 1, 4], difficulty: 'level2' },
  { name: 'Bb', notes: ['Bb4', 'D5', 'F5'], noteNumbers: [11, 3, 6], difficulty: 'level2' },
  { name: 'C#', notes: ['C#4', 'F4', 'G#4'], noteNumbers: [2, 6, 9], difficulty: 'level2' },
  { name: 'F#', notes: ['F#4', 'A#4', 'C#5'], noteNumbers: [7, 11, 2], difficulty: 'level2' },
  
  // Level 3: Augmented and Diminished chords
  { name: 'Caug', notes: ['C4', 'E4', 'G#4'], noteNumbers: [1, 5, 9], difficulty: 'level3' },
  { name: 'Cdim', notes: ['C4', 'Eb4', 'Gb4'], noteNumbers: [1, 4, 7], difficulty: 'level3' },
  { name: 'Daug', notes: ['D4', 'F#4', 'A#4'], noteNumbers: [3, 7, 11], difficulty: 'level3' },
  { name: 'Ddim', notes: ['D4', 'F4', 'Ab4'], noteNumbers: [3, 6, 9], difficulty: 'level3' },
  { name: 'Eaug', notes: ['E4', 'G#4', 'C5'], noteNumbers: [5, 9, 1], difficulty: 'level3' },
  { name: 'Edim', notes: ['E4', 'G4', 'Bb4'], noteNumbers: [5, 8, 11], difficulty: 'level3' },
  { name: 'Faug', notes: ['F4', 'A4', 'C#5'], noteNumbers: [6, 10, 2], difficulty: 'level3' },
  { name: 'Fdim', notes: ['F4', 'Ab4', 'B4'], noteNumbers: [6, 9, 12], difficulty: 'level3' },
  { name: 'Gaug', notes: ['G4', 'B4', 'D#5'], noteNumbers: [8, 12, 4], difficulty: 'level3' },
  { name: 'Gdim', notes: ['G4', 'Bb4', 'Db5'], noteNumbers: [8, 11, 2], difficulty: 'level3' },
  { name: 'Aaug', notes: ['A4', 'C#5', 'F5'], noteNumbers: [10, 2, 6], difficulty: 'level3' },
  { name: 'Adim', notes: ['A4', 'C5', 'Eb5'], noteNumbers: [10, 1, 4], difficulty: 'level3' },
  
  // Level 4: Augmented, Diminished and Sus chords with black keys
  { name: 'C#aug', notes: ['C#4', 'F4', 'A4'], noteNumbers: [2, 6, 10], difficulty: 'level4' },
  { name: 'C#dim', notes: ['C#4', 'E4', 'G4'], noteNumbers: [2, 5, 8], difficulty: 'level4' },
  { name: 'Ebaug', notes: ['Eb4', 'G4', 'B4'], noteNumbers: [4, 8, 12], difficulty: 'level4' },
  { name: 'Ebdim', notes: ['Eb4', 'Gb4', 'A4'], noteNumbers: [4, 7, 10], difficulty: 'level4' },
  { name: 'F#aug', notes: ['F#4', 'A#4', 'D5'], noteNumbers: [7, 11, 3], difficulty: 'level4' },
  { name: 'F#dim', notes: ['F#4', 'A4', 'C5'], noteNumbers: [7, 10, 1], difficulty: 'level4' },
  { name: 'Abaug', notes: ['Ab4', 'C5', 'E5'], noteNumbers: [9, 1, 5], difficulty: 'level4' },
  { name: 'Abdim', notes: ['Ab4', 'B4', 'D5'], noteNumbers: [9, 12, 3], difficulty: 'level4' },
  { name: 'Bbaug', notes: ['Bb4', 'D5', 'F#5'], noteNumbers: [11, 3, 7], difficulty: 'level4' },
  { name: 'Bbdim', notes: ['Bb4', 'Db5', 'E5'], noteNumbers: [11, 2, 5], difficulty: 'level4' },
  { name: 'Csus2', notes: ['C4', 'D4', 'G4'], noteNumbers: [1, 3, 8], difficulty: 'level4' },
  { name: 'Csus4', notes: ['C4', 'F4', 'G4'], noteNumbers: [1, 6, 8], difficulty: 'level4' },
  { name: 'Dsus2', notes: ['D4', 'E4', 'A4'], noteNumbers: [3, 5, 10], difficulty: 'level4' },
  { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], noteNumbers: [3, 8, 10], difficulty: 'level4' },
  
  // Level 5: First inversions only
  { name: 'C/E', notes: ['E4', 'G4', 'C5'], noteNumbers: [5, 8, 1], difficulty: 'level5' },
  { name: 'G/B', notes: ['B4', 'D5', 'G5'], noteNumbers: [12, 3, 8], difficulty: 'level5' },
  { name: 'F/A', notes: ['A4', 'C5', 'F5'], noteNumbers: [10, 1, 6], difficulty: 'level5' },
  { name: 'D/F#', notes: ['F#4', 'A4', 'D5'], noteNumbers: [7, 10, 3], difficulty: 'level5' },
  { name: 'Am/C', notes: ['C4', 'E4', 'A4'], noteNumbers: [1, 5, 10], difficulty: 'level5' },
  { name: 'Em/G', notes: ['G4', 'B4', 'E5'], noteNumbers: [8, 12, 5], difficulty: 'level5' },
  { name: 'Dm/F', notes: ['F4', 'A4', 'D5'], noteNumbers: [6, 10, 3], difficulty: 'level5' },
  { name: 'Cm/Eb', notes: ['Eb4', 'G4', 'C5'], noteNumbers: [4, 8, 1], difficulty: 'level5' },
  { name: 'Gm/Bb', notes: ['Bb4', 'D5', 'G5'], noteNumbers: [11, 3, 8], difficulty: 'level5' },
  { name: 'Fm/Ab', notes: ['Ab4', 'C5', 'F5'], noteNumbers: [9, 1, 6], difficulty: 'level5' },
  
  // Level 6: Second inversions only
  { name: 'C/G', notes: ['G4', 'C5', 'E5'], noteNumbers: [8, 1, 5], difficulty: 'level6' },
  { name: 'G/D', notes: ['D4', 'G4', 'B4'], noteNumbers: [3, 8, 12], difficulty: 'level6' },
  { name: 'F/C', notes: ['C4', 'F4', 'A4'], noteNumbers: [1, 6, 10], difficulty: 'level6' },
  { name: 'D/A', notes: ['A4', 'D5', 'F#5'], noteNumbers: [10, 3, 7], difficulty: 'level6' },
  { name: 'Am/E', notes: ['E4', 'A4', 'C5'], noteNumbers: [5, 10, 1], difficulty: 'level6' },
  { name: 'Em/B', notes: ['B4', 'E5', 'G5'], noteNumbers: [12, 5, 8], difficulty: 'level6' },
  { name: 'Dm/A', notes: ['A4', 'D5', 'F5'], noteNumbers: [10, 3, 6], difficulty: 'level6' },
  { name: 'Cm/G', notes: ['G4', 'C5', 'Eb5'], noteNumbers: [8, 1, 4], difficulty: 'level6' },
  { name: 'Gm/D', notes: ['D4', 'G4', 'Bb4'], noteNumbers: [3, 8, 11], difficulty: 'level6' },
  { name: 'Fm/C', notes: ['C4', 'F4', 'Ab4'], noteNumbers: [1, 6, 9], difficulty: 'level6' },
  
  // Level 7: Comprehensive review of all chord types from previous levels
  // Major triads
  { name: 'C', notes: ['C4', 'E4', 'G4'], noteNumbers: [1, 5, 8], difficulty: 'level7' },
  { name: 'F', notes: ['F4', 'A4', 'C5'], noteNumbers: [6, 10, 1], difficulty: 'level7' },
  { name: 'G', notes: ['G4', 'B4', 'D5'], noteNumbers: [8, 12, 3], difficulty: 'level7' },
  // Minor triads
  { name: 'Cm', notes: ['C4', 'Eb4', 'G4'], noteNumbers: [1, 4, 8], difficulty: 'level7' },
  { name: 'Am', notes: ['A4', 'C5', 'E5'], noteNumbers: [10, 1, 5], difficulty: 'level7' },
  // Augmented and diminished
  { name: 'Caug', notes: ['C4', 'E4', 'G#4'], noteNumbers: [1, 5, 9], difficulty: 'level7' },
  { name: 'Ddim', notes: ['D4', 'F4', 'Ab4'], noteNumbers: [3, 6, 9], difficulty: 'level7' },
  // Sus chords
  { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], noteNumbers: [3, 8, 10], difficulty: 'level7' },
  { name: 'Csus2', notes: ['C4', 'D4', 'G4'], noteNumbers: [1, 3, 8], difficulty: 'level7' },
  // First Inversions
  { name: 'C/E', notes: ['E4', 'G4', 'C5'], noteNumbers: [5, 8, 1], difficulty: 'level7' },
  { name: 'Am/C', notes: ['C4', 'E4', 'A4'], noteNumbers: [1, 5, 10], difficulty: 'level7' },
  // Second Inversions
  { name: 'G/D', notes: ['D4', 'G4', 'B4'], noteNumbers: [3, 8, 12], difficulty: 'level7' },
  { name: 'F/C', notes: ['C4', 'F4', 'A4'], noteNumbers: [1, 6, 10], difficulty: 'level7' }
];

// Get chords by difficulty
export function getChordsByDifficulty(difficulty: DifficultyLevel): ChordDefinition[] {
  return chordDefinitions.filter(chord => chord.difficulty === difficulty);
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

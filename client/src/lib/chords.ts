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
  // Level 1: Major and minor triads using only white keys
  { name: 'C Major', notes: ['C4', 'E4', 'G4'], noteNumbers: [1, 5, 8], difficulty: 'level1' },
  { name: 'G Major', notes: ['G4', 'B4', 'D5'], noteNumbers: [8, 12, 3], difficulty: 'level1' },
  { name: 'F Major', notes: ['F4', 'A4', 'C5'], noteNumbers: [6, 10, 1], difficulty: 'level1' },
  { name: 'A Minor', notes: ['A4', 'C5', 'E5'], noteNumbers: [10, 1, 5], difficulty: 'level1' },
  { name: 'D Minor', notes: ['D4', 'F4', 'A4'], noteNumbers: [3, 6, 10], difficulty: 'level1' },
  { name: 'E Minor', notes: ['E4', 'G4', 'B4'], noteNumbers: [5, 8, 12], difficulty: 'level1' },
  
  // Level 2: Major and minor chords that root in white keys but may use black keys
  { name: 'D Major', notes: ['D4', 'F#4', 'A4'], noteNumbers: [3, 7, 10], difficulty: 'level2' },
  { name: 'E Major', notes: ['E4', 'G#4', 'B4'], noteNumbers: [5, 9, 12], difficulty: 'level2' },
  { name: 'A Major', notes: ['A4', 'C#5', 'E5'], noteNumbers: [10, 2, 5], difficulty: 'level2' },
  { name: 'B Minor', notes: ['B4', 'D5', 'F#5'], noteNumbers: [12, 3, 7], difficulty: 'level2' },
  { name: 'C Minor', notes: ['C4', 'Eb4', 'G4'], noteNumbers: [1, 4, 8], difficulty: 'level2' },
  { name: 'F Minor', notes: ['F4', 'Ab4', 'C5'], noteNumbers: [6, 9, 1], difficulty: 'level2' },
  { name: 'G Minor', notes: ['G4', 'Bb4', 'D5'], noteNumbers: [8, 11, 3], difficulty: 'level2' },
  
  // Level 3: Dim, Aug, Sus chords rooted in white keys
  { name: 'C Augmented', notes: ['C4', 'E4', 'G#4'], noteNumbers: [1, 5, 9], difficulty: 'level3' },
  { name: 'D Diminished', notes: ['D4', 'F4', 'Ab4'], noteNumbers: [3, 6, 9], difficulty: 'level3' },
  { name: 'E Diminished', notes: ['E4', 'G4', 'Bb4'], noteNumbers: [5, 8, 11], difficulty: 'level3' },
  { name: 'F Augmented', notes: ['F4', 'A4', 'C#5'], noteNumbers: [6, 10, 2], difficulty: 'level3' },
  { name: 'G Augmented', notes: ['G4', 'B4', 'D#5'], noteNumbers: [8, 12, 4], difficulty: 'level3' },
  { name: 'A Diminished', notes: ['A4', 'C5', 'Eb5'], noteNumbers: [10, 1, 4], difficulty: 'level3' },
  { name: 'Csus2', notes: ['C4', 'D4', 'G4'], noteNumbers: [1, 3, 8], difficulty: 'level3' },
  { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], noteNumbers: [3, 8, 10], difficulty: 'level3' },
  { name: 'Fsus2', notes: ['F4', 'G4', 'C5'], noteNumbers: [6, 8, 1], difficulty: 'level3' },
  { name: 'Gsus4', notes: ['G4', 'C5', 'D5'], noteNumbers: [8, 1, 3], difficulty: 'level3' },
  
  // Level 4: All 12 keys, using proper naming
  { name: 'C# Major', notes: ['C#4', 'F4', 'G#4'], noteNumbers: [2, 6, 9], difficulty: 'level4' },
  { name: 'Eb Major', notes: ['Eb4', 'G4', 'Bb4'], noteNumbers: [4, 8, 11], difficulty: 'level4' },
  { name: 'F# Major', notes: ['F#4', 'A#4', 'C#5'], noteNumbers: [7, 11, 2], difficulty: 'level4' },
  { name: 'Ab Major', notes: ['Ab4', 'C5', 'Eb5'], noteNumbers: [9, 1, 4], difficulty: 'level4' },
  { name: 'Bb Major', notes: ['Bb4', 'D5', 'F5'], noteNumbers: [11, 3, 6], difficulty: 'level4' },
  { name: 'C# Minor', notes: ['C#4', 'E4', 'G#4'], noteNumbers: [2, 5, 9], difficulty: 'level4' },
  { name: 'Eb Minor', notes: ['Eb4', 'Gb4', 'Bb4'], noteNumbers: [4, 7, 11], difficulty: 'level4' },
  { name: 'F# Minor', notes: ['F#4', 'A4', 'C#5'], noteNumbers: [7, 10, 2], difficulty: 'level4' },
  { name: 'G# Minor', notes: ['G#4', 'B4', 'D#5'], noteNumbers: [9, 12, 4], difficulty: 'level4' },
  { name: 'Bb Minor', notes: ['Bb4', 'Db5', 'F5'], noteNumbers: [11, 2, 6], difficulty: 'level4' },
  
  // Level 5: Inversions of triads (1st and 2nd inversions emphasized)
  // First inversions (using numeric patterns - 3rd, 5th, root)
  { name: 'C Major (1st inv)', notes: ['E4', 'G4', 'C5'], noteNumbers: [5, 8, 1], difficulty: 'level5' },
  { name: 'G Major (1st inv)', notes: ['B4', 'D5', 'G5'], noteNumbers: [12, 3, 8], difficulty: 'level5' },
  { name: 'F Major (1st inv)', notes: ['A4', 'C5', 'F5'], noteNumbers: [10, 1, 6], difficulty: 'level5' },
  { name: 'D Major (1st inv)', notes: ['F#4', 'A4', 'D5'], noteNumbers: [7, 10, 3], difficulty: 'level5' },
  { name: 'A Minor (1st inv)', notes: ['C4', 'E4', 'A4'], noteNumbers: [1, 5, 10], difficulty: 'level5' },
  
  // Second inversions (using numeric patterns - 5th, root, 3rd)
  { name: 'C Major (2nd inv)', notes: ['G4', 'C5', 'E5'], noteNumbers: [8, 1, 5], difficulty: 'level5' },
  { name: 'G Major (2nd inv)', notes: ['D4', 'G4', 'B4'], noteNumbers: [3, 8, 12], difficulty: 'level5' },
  { name: 'F Major (2nd inv)', notes: ['C4', 'F4', 'A4'], noteNumbers: [1, 6, 10], difficulty: 'level5' },
  { name: 'D Major (2nd inv)', notes: ['A4', 'D5', 'F#5'], noteNumbers: [10, 3, 7], difficulty: 'level5' },
  { name: 'A Minor (2nd inv)', notes: ['E4', 'A4', 'C5'], noteNumbers: [5, 10, 1], difficulty: 'level5' }
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

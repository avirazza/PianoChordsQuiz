import { type ChordData, type DifficultyLevel } from "@shared/schema";

// Chord data structure
interface ChordDefinition {
  name: string;
  notes: string[];
  difficulty: DifficultyLevel;
}

// Basic chords for each difficulty level
export const chordDefinitions: ChordDefinition[] = [
  // Beginner chords - Major and minor triads
  { name: 'C Major', notes: ['C4', 'E4', 'G4'], difficulty: 'beginner' },
  { name: 'G Major', notes: ['G4', 'B4', 'D5'], difficulty: 'beginner' },
  { name: 'F Major', notes: ['F4', 'A4', 'C5'], difficulty: 'beginner' },
  { name: 'A Minor', notes: ['A4', 'C5', 'E5'], difficulty: 'beginner' },
  { name: 'D Minor', notes: ['D4', 'F4', 'A4'], difficulty: 'beginner' },
  { name: 'E Minor', notes: ['E4', 'G4', 'B4'], difficulty: 'beginner' },
  
  // Intermediate chords - 7ths and suspended chords
  { name: 'C7', notes: ['C4', 'E4', 'G4', 'A#4'], difficulty: 'intermediate' },
  { name: 'G7', notes: ['G4', 'B4', 'D5', 'F5'], difficulty: 'intermediate' },
  { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], difficulty: 'intermediate' },
  { name: 'Fmaj7', notes: ['F4', 'A4', 'C5', 'E5'], difficulty: 'intermediate' },
  { name: 'Am7', notes: ['A4', 'C5', 'E5', 'G5'], difficulty: 'intermediate' },
  
  // Advanced chords - Augmented, diminished, and extended
  { name: 'Caug', notes: ['C4', 'E4', 'G#4'], difficulty: 'advanced' },
  { name: 'Edim', notes: ['E4', 'G4', 'A#4'], difficulty: 'advanced' },
  { name: 'Gmaj9', notes: ['G4', 'B4', 'D5', 'F#5', 'A5'], difficulty: 'advanced' },
  { name: 'D7b9', notes: ['D4', 'F#4', 'A4', 'C5', 'D#5'], difficulty: 'advanced' },
  { name: 'Bm7b5', notes: ['B4', 'D5', 'F5', 'A5'], difficulty: 'advanced' }
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

// Check if the selected notes match the chord
export function checkChordMatch(selectedNotes: string[], chordNotes: string[]): boolean {
  if (selectedNotes.length !== chordNotes.length) {
    return false;
  }
  
  const sortedSelected = [...selectedNotes].sort();
  const sortedChord = [...chordNotes].sort();
  
  return sortedSelected.every((note, index) => note === sortedChord[index]);
}

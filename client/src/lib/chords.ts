import { type ChordData, type DifficultyLevel } from "@shared/schema";

// Chord data structure
interface ChordDefinition {
  name: string;
  notes: string[];
  difficulty: DifficultyLevel;
}

// Chord definitions for each level, as specified
export const chordDefinitions: ChordDefinition[] = [
  // Level 1: Major and minor triads using only white keys
  { name: 'C Major', notes: ['C4', 'E4', 'G4'], difficulty: 'level1' },
  { name: 'G Major', notes: ['G4', 'B4', 'D5'], difficulty: 'level1' },
  { name: 'F Major', notes: ['F4', 'A4', 'C5'], difficulty: 'level1' },
  { name: 'A Minor', notes: ['A4', 'C5', 'E5'], difficulty: 'level1' },
  { name: 'D Minor', notes: ['D4', 'F4', 'A4'], difficulty: 'level1' },
  { name: 'E Minor', notes: ['E4', 'G4', 'B4'], difficulty: 'level1' },
  
  // Level 2: Major and minor chords that root in white keys but may use black keys
  { name: 'D Major', notes: ['D4', 'F#4', 'A4'], difficulty: 'level2' },
  { name: 'E Major', notes: ['E4', 'G#4', 'B4'], difficulty: 'level2' },
  { name: 'A Major', notes: ['A4', 'C#5', 'E5'], difficulty: 'level2' },
  { name: 'B Minor', notes: ['B4', 'D5', 'F#5'], difficulty: 'level2' },
  { name: 'C Minor', notes: ['C4', 'Eb4', 'G4'], difficulty: 'level2' },
  { name: 'F Minor', notes: ['F4', 'Ab4', 'C5'], difficulty: 'level2' },
  { name: 'G Minor', notes: ['G4', 'Bb4', 'D5'], difficulty: 'level2' },
  
  // Level 3: Dim, Aug, Sus chords rooted in white keys
  { name: 'C Augmented', notes: ['C4', 'E4', 'G#4'], difficulty: 'level3' },
  { name: 'D Diminished', notes: ['D4', 'F4', 'Ab4'], difficulty: 'level3' },
  { name: 'E Diminished', notes: ['E4', 'G4', 'Bb4'], difficulty: 'level3' },
  { name: 'F Augmented', notes: ['F4', 'A4', 'C#5'], difficulty: 'level3' },
  { name: 'G Augmented', notes: ['G4', 'B4', 'D#5'], difficulty: 'level3' },
  { name: 'A Diminished', notes: ['A4', 'C5', 'Eb5'], difficulty: 'level3' },
  { name: 'Csus2', notes: ['C4', 'D4', 'G4'], difficulty: 'level3' },
  { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], difficulty: 'level3' },
  { name: 'Fsus2', notes: ['F4', 'G4', 'C5'], difficulty: 'level3' },
  { name: 'Gsus4', notes: ['G4', 'C5', 'D5'], difficulty: 'level3' },
  
  // Level 4: All 12 keys, using proper naming
  { name: 'C# Major', notes: ['C#4', 'F4', 'G#4'], difficulty: 'level4' },
  { name: 'Eb Major', notes: ['Eb4', 'G4', 'Bb4'], difficulty: 'level4' },
  { name: 'F# Major', notes: ['F#4', 'A#4', 'C#5'], difficulty: 'level4' },
  { name: 'Ab Major', notes: ['Ab4', 'C5', 'Eb5'], difficulty: 'level4' },
  { name: 'Bb Major', notes: ['Bb4', 'D5', 'F5'], difficulty: 'level4' },
  { name: 'C# Minor', notes: ['C#4', 'E4', 'G#4'], difficulty: 'level4' },
  { name: 'Eb Minor', notes: ['Eb4', 'Gb4', 'Bb4'], difficulty: 'level4' },
  { name: 'F# Minor', notes: ['F#4', 'A4', 'C#5'], difficulty: 'level4' },
  { name: 'G# Minor', notes: ['G#4', 'B4', 'D#5'], difficulty: 'level4' },
  { name: 'Bb Minor', notes: ['Bb4', 'Db5', 'F5'], difficulty: 'level4' },
  
  // Level 5: Inversions of triads (1st and 2nd inversions emphasized)
  // First inversions
  { name: 'C Major (1st inv)', notes: ['E4', 'G4', 'C5'], difficulty: 'level5' },
  { name: 'G Major (1st inv)', notes: ['B4', 'D5', 'G5'], difficulty: 'level5' },
  { name: 'F Major (1st inv)', notes: ['A4', 'C5', 'F5'], difficulty: 'level5' },
  { name: 'D Major (1st inv)', notes: ['F#4', 'A4', 'D5'], difficulty: 'level5' },
  { name: 'A Minor (1st inv)', notes: ['C4', 'E4', 'A4'], difficulty: 'level5' },
  
  // Second inversions
  { name: 'C Major (2nd inv)', notes: ['G4', 'C5', 'E5'], difficulty: 'level5' },
  { name: 'G Major (2nd inv)', notes: ['D4', 'G4', 'B4'], difficulty: 'level5' },
  { name: 'F Major (2nd inv)', notes: ['C4', 'F4', 'A4'], difficulty: 'level5' },
  { name: 'D Major (2nd inv)', notes: ['A4', 'D5', 'F#5'], difficulty: 'level5' },
  { name: 'A Minor (2nd inv)', notes: ['E4', 'A4', 'C5'], difficulty: 'level5' }
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

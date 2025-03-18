import { 
  users, type User, type InsertUser,
  chords, type Chord, type InsertChord,
  gameSessions, type GameSession, type InsertGameSession,
  type ChordData, type DifficultyLevel
} from "@shared/schema";

// Storage interface for all game operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserHighScore(userId: number, score: number): Promise<void>;
  
  // Chord operations
  getAllChords(): Promise<ChordData[]>;
  getChordsByDifficulty(difficulty: DifficultyLevel): Promise<ChordData[]>;
  createChord(chord: InsertChord): Promise<Chord>;
  
  // Game session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getTopScores(limit?: number): Promise<GameSession[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chords: Map<number, Chord>;
  private gameSessions: Map<number, GameSession>;
  private userIdCounter: number;
  private chordIdCounter: number;
  private sessionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.chords = new Map();
    this.gameSessions = new Map();
    this.userIdCounter = 1;
    this.chordIdCounter = 1;
    this.sessionIdCounter = 1;
    
    // Initialize with default chords
    this.initializeChords();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, highScore: 0 };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserHighScore(userId: number, score: number): Promise<void> {
    const user = this.users.get(userId);
    if (user && score > (user.highScore || 0)) {
      user.highScore = score;
      this.users.set(userId, user);
    }
  }

  // Chord operations
  async getAllChords(): Promise<ChordData[]> {
    return Array.from(this.chords.values()).map(chord => {
      const notes = JSON.parse(chord.notes);
      // Generate noteNumbers based on note values (1-12 system)
      const noteNumbers = this.generateNoteNumbers(notes);
      
      return {
        id: chord.id,
        name: chord.name,
        notes: notes,
        noteNumbers: noteNumbers,
        difficulty: chord.difficulty as DifficultyLevel
      };
    });
  }

  async getChordsByDifficulty(difficulty: DifficultyLevel): Promise<ChordData[]> {
    return Array.from(this.chords.values())
      .filter(chord => chord.difficulty === difficulty)
      .map(chord => {
        const notes = JSON.parse(chord.notes);
        // Generate noteNumbers based on note values (1-12 system)
        const noteNumbers = this.generateNoteNumbers(notes);
        
        return {
          id: chord.id,
          name: chord.name,
          notes: notes,
          noteNumbers: noteNumbers,
          difficulty: chord.difficulty as DifficultyLevel
        };
      });
  }
  
  // Helper to convert note strings to numeric values (1-12)
  private generateNoteNumbers(notes: string[]): number[] {
    // Note name to number mapping (1-12)
    const noteToNumber: Record<string, number> = {
      'C': 1, 'C#': 2, 'Db': 2, 
      'D': 3, 'D#': 4, 'Eb': 4,
      'E': 5, 'F': 6, 'F#': 7, 
      'Gb': 7, 'G': 8, 'G#': 9,
      'Ab': 9, 'A': 10, 'A#': 11,
      'Bb': 11, 'B': 12
    };
    
    return notes.map(noteStr => {
      // Extract the note name without octave
      const noteName = noteStr.replace(/[0-9]/g, '');
      return noteToNumber[noteName] || 0;
    });
  }

  async createChord(insertChord: InsertChord): Promise<Chord> {
    const id = this.chordIdCounter++;
    const chord: Chord = { ...insertChord, id };
    this.chords.set(id, chord);
    return chord;
  }

  // Game session operations
  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.sessionIdCounter++;
    
    // Explicitly conform to the GameSession type by casting
    const session = {
      id,
      difficulty: insertSession.difficulty,
      userId: insertSession.userId === undefined ? null : insertSession.userId,
      score: insertSession.score ?? 0, // Use nullish coalescing to handle undefined
      completedAt: insertSession.completedAt ?? null
    } as GameSession;
    
    this.gameSessions.set(id, session);
    return session;
  }

  async getTopScores(limit: number = 10): Promise<GameSession[]> {
    return Array.from(this.gameSessions.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Initialize default chords for the game
  private initializeChords(): void {
    // Level 1: Major and minor triads with simplified naming
    const level1Chords = [
      { name: 'C', notes: ['C4', 'E4', 'G4'], difficulty: 'level1' },
      { name: 'Cm', notes: ['C4', 'Eb4', 'G4'], difficulty: 'level1' },
      { name: 'F', notes: ['F4', 'A4', 'C5'], difficulty: 'level1' },
      { name: 'Fm', notes: ['F4', 'Ab4', 'C5'], difficulty: 'level1' },
      { name: 'G', notes: ['G4', 'B4', 'D5'], difficulty: 'level1' },
      { name: 'Gm', notes: ['G4', 'Bb4', 'D5'], difficulty: 'level1' },
      { name: 'Am', notes: ['A4', 'C5', 'E5'], difficulty: 'level1' },
      { name: 'Dm', notes: ['D4', 'F4', 'A4'], difficulty: 'level1' },
      { name: 'Em', notes: ['E4', 'G4', 'B4'], difficulty: 'level1' }
    ];

    // Level 2: Major and minor chords with all white and black keys
    const level2Chords = [
      { name: 'D', notes: ['D4', 'F#4', 'A4'], difficulty: 'level2' },
      { name: 'E', notes: ['E4', 'G#4', 'B4'], difficulty: 'level2' },
      { name: 'A', notes: ['A4', 'C#5', 'E5'], difficulty: 'level2' },
      { name: 'Bm', notes: ['B4', 'D5', 'F#5'], difficulty: 'level2' },
      { name: 'Eb', notes: ['Eb4', 'G4', 'Bb4'], difficulty: 'level2' },
      { name: 'Ab', notes: ['Ab4', 'C5', 'Eb5'], difficulty: 'level2' },
      { name: 'Bb', notes: ['Bb4', 'D5', 'F5'], difficulty: 'level2' },
      { name: 'C#', notes: ['C#4', 'F4', 'G#4'], difficulty: 'level2' },
      { name: 'F#', notes: ['F#4', 'A#4', 'C#5'], difficulty: 'level2' }
    ];

    // Level 3: Augmented and Diminished chords
    const level3Chords = [
      { name: 'Caug', notes: ['C4', 'E4', 'G#4'], difficulty: 'level3' },
      { name: 'Cdim', notes: ['C4', 'Eb4', 'Gb4'], difficulty: 'level3' },
      { name: 'Daug', notes: ['D4', 'F#4', 'A#4'], difficulty: 'level3' },
      { name: 'Ddim', notes: ['D4', 'F4', 'Ab4'], difficulty: 'level3' },
      { name: 'Eaug', notes: ['E4', 'G#4', 'C5'], difficulty: 'level3' },
      { name: 'Edim', notes: ['E4', 'G4', 'Bb4'], difficulty: 'level3' },
      { name: 'Faug', notes: ['F4', 'A4', 'C#5'], difficulty: 'level3' },
      { name: 'Fdim', notes: ['F4', 'Ab4', 'B4'], difficulty: 'level3' },
      { name: 'Gaug', notes: ['G4', 'B4', 'D#5'], difficulty: 'level3' },
      { name: 'Gdim', notes: ['G4', 'Bb4', 'Db5'], difficulty: 'level3' },
      { name: 'Aaug', notes: ['A4', 'C#5', 'F5'], difficulty: 'level3' },
      { name: 'Adim', notes: ['A4', 'C5', 'Eb5'], difficulty: 'level3' }
    ];

    // Level 4: Augmented, Diminished and Sus chords with black keys
    const level4Chords = [
      { name: 'C#aug', notes: ['C#4', 'F4', 'A4'], difficulty: 'level4' },
      { name: 'C#dim', notes: ['C#4', 'E4', 'G4'], difficulty: 'level4' },
      { name: 'Ebaug', notes: ['Eb4', 'G4', 'B4'], difficulty: 'level4' },
      { name: 'Ebdim', notes: ['Eb4', 'Gb4', 'A4'], difficulty: 'level4' },
      { name: 'F#aug', notes: ['F#4', 'A#4', 'D5'], difficulty: 'level4' },
      { name: 'F#dim', notes: ['F#4', 'A4', 'C5'], difficulty: 'level4' },
      { name: 'Abaug', notes: ['Ab4', 'C5', 'E5'], difficulty: 'level4' },
      { name: 'Abdim', notes: ['Ab4', 'B4', 'D5'], difficulty: 'level4' },
      { name: 'Bbaug', notes: ['Bb4', 'D5', 'F#5'], difficulty: 'level4' },
      { name: 'Bbdim', notes: ['Bb4', 'Db5', 'E5'], difficulty: 'level4' },
      { name: 'Csus2', notes: ['C4', 'D4', 'G4'], difficulty: 'level4' },
      { name: 'Csus4', notes: ['C4', 'F4', 'G4'], difficulty: 'level4' },
      { name: 'Dsus2', notes: ['D4', 'E4', 'A4'], difficulty: 'level4' },
      { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], difficulty: 'level4' }
    ];

    // Level 5: First inversions only
    const level5Chords = [
      { name: 'C/E', notes: ['E4', 'G4', 'C5'], difficulty: 'level5' },
      { name: 'G/B', notes: ['B4', 'D5', 'G5'], difficulty: 'level5' },
      { name: 'F/A', notes: ['A4', 'C5', 'F5'], difficulty: 'level5' },
      { name: 'D/F#', notes: ['F#4', 'A4', 'D5'], difficulty: 'level5' },
      { name: 'Am/C', notes: ['C4', 'E4', 'A4'], difficulty: 'level5' },
      { name: 'Em/G', notes: ['G4', 'B4', 'E5'], difficulty: 'level5' },
      { name: 'Dm/F', notes: ['F4', 'A4', 'D5'], difficulty: 'level5' },
      { name: 'Cm/Eb', notes: ['Eb4', 'G4', 'C5'], difficulty: 'level5' },
      { name: 'Gm/Bb', notes: ['Bb4', 'D5', 'G5'], difficulty: 'level5' },
      { name: 'Fm/Ab', notes: ['Ab4', 'C5', 'F5'], difficulty: 'level5' }
    ];
    
    // Level 6: Second inversions only
    const level6Chords = [
      { name: 'C/G', notes: ['G4', 'C5', 'E5'], difficulty: 'level6' },
      { name: 'G/D', notes: ['D4', 'G4', 'B4'], difficulty: 'level6' },
      { name: 'F/C', notes: ['C4', 'F4', 'A4'], difficulty: 'level6' },
      { name: 'D/A', notes: ['A4', 'D5', 'F#5'], difficulty: 'level6' },
      { name: 'Am/E', notes: ['E4', 'A4', 'C5'], difficulty: 'level6' },
      { name: 'Em/B', notes: ['B4', 'E5', 'G5'], difficulty: 'level6' },
      { name: 'Dm/A', notes: ['A4', 'D5', 'F5'], difficulty: 'level6' },
      { name: 'Cm/G', notes: ['G4', 'C5', 'Eb5'], difficulty: 'level6' },
      { name: 'Gm/D', notes: ['D4', 'G4', 'Bb4'], difficulty: 'level6' },
      { name: 'Fm/C', notes: ['C4', 'F4', 'Ab4'], difficulty: 'level6' }
    ];
    
    // Level 7: Comprehensive review of all chord types from previous levels
    const level7Chords = [
      // Major triads
      { name: 'C', notes: ['C4', 'E4', 'G4'], difficulty: 'level7' },
      { name: 'F', notes: ['F4', 'A4', 'C5'], difficulty: 'level7' },
      { name: 'G', notes: ['G4', 'B4', 'D5'], difficulty: 'level7' },
      // Minor triads
      { name: 'Cm', notes: ['C4', 'Eb4', 'G4'], difficulty: 'level7' },
      { name: 'Am', notes: ['A4', 'C5', 'E5'], difficulty: 'level7' },
      // Augmented and diminished
      { name: 'Caug', notes: ['C4', 'E4', 'G#4'], difficulty: 'level7' },
      { name: 'Ddim', notes: ['D4', 'F4', 'Ab4'], difficulty: 'level7' },
      // Sus chords
      { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], difficulty: 'level7' },
      { name: 'Csus2', notes: ['C4', 'D4', 'G4'], difficulty: 'level7' },
      // First Inversions
      { name: 'C/E', notes: ['E4', 'G4', 'C5'], difficulty: 'level7' },
      { name: 'Am/C', notes: ['C4', 'E4', 'A4'], difficulty: 'level7' },
      // Second Inversions
      { name: 'G/D', notes: ['D4', 'G4', 'B4'], difficulty: 'level7' },
      { name: 'F/C', notes: ['C4', 'F4', 'A4'], difficulty: 'level7' }
    ];

    // Add all chords to storage
    [...level1Chords, ...level2Chords, ...level3Chords, ...level4Chords, ...level5Chords, ...level6Chords, ...level7Chords].forEach(chord => {
      this.createChord({
        name: chord.name,
        notes: JSON.stringify(chord.notes),
        difficulty: chord.difficulty
      });
    });
  }
}

// Export storage instance
export const storage = new MemStorage();

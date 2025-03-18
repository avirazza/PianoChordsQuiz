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
    return Array.from(this.chords.values()).map(chord => ({
      id: chord.id,
      name: chord.name,
      notes: JSON.parse(chord.notes),
      difficulty: chord.difficulty as DifficultyLevel
    }));
  }

  async getChordsByDifficulty(difficulty: DifficultyLevel): Promise<ChordData[]> {
    return Array.from(this.chords.values())
      .filter(chord => chord.difficulty === difficulty)
      .map(chord => ({
        id: chord.id,
        name: chord.name,
        notes: JSON.parse(chord.notes),
        difficulty: chord.difficulty as DifficultyLevel
      }));
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
    // Beginner chords
    const beginnerChords = [
      { name: 'C Major', notes: ['C4', 'E4', 'G4'], difficulty: 'beginner' },
      { name: 'G Major', notes: ['G4', 'B4', 'D5'], difficulty: 'beginner' },
      { name: 'F Major', notes: ['F4', 'A4', 'C5'], difficulty: 'beginner' },
      { name: 'A Minor', notes: ['A4', 'C5', 'E5'], difficulty: 'beginner' },
      { name: 'D Minor', notes: ['D4', 'F4', 'A4'], difficulty: 'beginner' },
      { name: 'E Minor', notes: ['E4', 'G4', 'B4'], difficulty: 'beginner' }
    ];

    // Intermediate chords
    const intermediateChords = [
      { name: 'C7', notes: ['C4', 'E4', 'G4', 'A#4'], difficulty: 'intermediate' },
      { name: 'G7', notes: ['G4', 'B4', 'D5', 'F5'], difficulty: 'intermediate' },
      { name: 'Dsus4', notes: ['D4', 'G4', 'A4'], difficulty: 'intermediate' },
      { name: 'Fmaj7', notes: ['F4', 'A4', 'C5', 'E5'], difficulty: 'intermediate' },
      { name: 'Am7', notes: ['A4', 'C5', 'E5', 'G5'], difficulty: 'intermediate' }
    ];

    // Advanced chords
    const advancedChords = [
      { name: 'Caug', notes: ['C4', 'E4', 'G#4'], difficulty: 'advanced' },
      { name: 'Edim', notes: ['E4', 'G4', 'A#4'], difficulty: 'advanced' },
      { name: 'Gmaj9', notes: ['G4', 'B4', 'D5', 'F#5', 'A5'], difficulty: 'advanced' },
      { name: 'D7b9', notes: ['D4', 'F#4', 'A4', 'C5', 'D#5'], difficulty: 'advanced' },
      { name: 'Bm7b5', notes: ['B4', 'D5', 'F5', 'A5'], difficulty: 'advanced' }
    ];

    // Add all chords to storage
    [...beginnerChords, ...intermediateChords, ...advancedChords].forEach(chord => {
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

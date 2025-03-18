import { 
  users, type User, type InsertUser,
  gameSessions, type GameSession, type InsertGameSession,
  type ChordData, type DifficultyLevel
} from "@shared/schema";

import { 
  getAllChords, 
  getChordsForDifficulty,
  checkChordMatch
} from "./chords";

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
  
  // Game session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getTopScores(limit?: number): Promise<GameSession[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameSessions: Map<number, GameSession>;
  private userIdCounter: number;
  private sessionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.gameSessions = new Map();
    this.userIdCounter = 1;
    this.sessionIdCounter = 1;
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

  // Chord operations - now using the chord generation logic directly
  async getAllChords(): Promise<ChordData[]> {
    return getAllChords();
  }

  async getChordsByDifficulty(difficulty: DifficultyLevel): Promise<ChordData[]> {
    return getChordsForDifficulty(difficulty);
  }

  // Game session operations
  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.sessionIdCounter++;
    
    const session = {
      id,
      difficulty: insertSession.difficulty,
      userId: insertSession.userId === undefined ? null : insertSession.userId,
      score: insertSession.score ?? 0,
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
}

// Export storage instance
export const storage = new MemStorage();

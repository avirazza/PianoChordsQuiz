import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for storing player information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  highScore: integer("high_score").default(0),
});

// GameSession table for tracking game activity
export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  score: integer("score").notNull().default(0),
  difficulty: text("difficulty").notNull(),
  completedAt: text("completed_at"), // ISO date string
});

// Schema for inserting new users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Schema for inserting new game sessions
export const insertGameSessionSchema = createInsertSchema(gameSessions).pick({
  userId: true,
  score: true,
  difficulty: true,
  completedAt: true,
});

// TypeScript types derived from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;

// Define types for chord difficulty levels
export const difficultyLevels = ["level1", "level2", "level3", "level4", "level5", "level6", "level7", "level8", "level9"] as const;
export type DifficultyLevel = typeof difficultyLevels[number];

// Define note type for client-server communication
export type Note = {
  note: string;
  octave: number;
};

// Define chord type with notes array for client-server communication
export type ChordData = {
  id: number;
  name: string;
  notes: string[];        // Note string representation for backward compatibility
  noteNumbers: number[];  // Numeric note representation (1=C, 2=C#, ..., 12=B)
  difficulty: DifficultyLevel;
  rootNote: number;       // The numeric root note (1=C, 2=C#, etc.)
  scaleDegrees: {         // Map of note positions in the chord to scale degrees
    [noteIndex: number]: string; // e.g., "1" (root), "3" (third), "5" (fifth), "7" (seventh)
  };
  inversion: number;      // 0=root position, 1=first inversion, 2=second inversion, etc.
};

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

// Chords table for storing chord definitions
export const chords = pgTable("chords", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  notes: text("notes").notNull(), // Stored as JSON string of notes
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
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

// Schema for inserting new chords
export const insertChordSchema = createInsertSchema(chords).pick({
  name: true,
  notes: true,
  difficulty: true,
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

export type InsertChord = z.infer<typeof insertChordSchema>;
export type Chord = typeof chords.$inferSelect;

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;

// Define types for chord difficulty levels
export const difficultyLevels = ["level1", "level2", "level3", "level4", "level5"] as const;
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
};

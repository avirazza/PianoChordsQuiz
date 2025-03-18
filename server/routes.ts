import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkChordMatch } from "./chords";
import { DifficultyLevel, difficultyLevels } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all chords
  app.get("/api/chords", async (req, res) => {
    try {
      const chords = await storage.getAllChords();
      res.json(chords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chords" });
    }
  });

  // Get chords by difficulty
  app.get("/api/chords/:difficulty", async (req, res) => {
    try {
      const difficultySchema = z.enum(difficultyLevels);
      const result = difficultySchema.safeParse(req.params.difficulty);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid difficulty level" });
      }
      
      const difficulty = result.data;
      const chords = await storage.getChordsByDifficulty(difficulty);
      res.json(chords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chords by difficulty" });
    }
  });

  // Submit game session and update high score
  app.post("/api/game-sessions", async (req, res) => {
    try {
      const sessionSchema = z.object({
        userId: z.number().optional(),
        score: z.number(),
        difficulty: z.enum(difficultyLevels),
        completedAt: z.string()
      });

      const result = sessionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid session data", 
          details: result.error.format() 
        });
      }
      
      const sessionData = result.data;
      const gameSession = await storage.createGameSession(sessionData);
      
      // Update high score if user is provided
      if (sessionData.userId) {
        await storage.updateUserHighScore(sessionData.userId, sessionData.score);
      }
      
      res.status(201).json(gameSession);
    } catch (error) {
      res.status(500).json({ error: "Failed to save game session" });
    }
  });

  // Get top scores
  app.get("/api/top-scores", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const topScores = await storage.getTopScores(limit);
      res.json(topScores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top scores" });
    }
  });
  
  // Check if a chord matches the target chord
  app.post("/api/verify-chord", async (req, res) => {
    try {
      const chordVerifySchema = z.object({
        userNotes: z.array(z.string()),
        targetNotes: z.array(z.string())
      });
      
      const result = chordVerifySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid chord data", 
          details: result.error.format() 
        });
      }
      
      const { userNotes, targetNotes } = result.data;
      const isMatch = checkChordMatch(userNotes, targetNotes);
      
      res.json({ isMatch });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify chord match" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

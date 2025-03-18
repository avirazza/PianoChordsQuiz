import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { type ChordData, type DifficultyLevel } from "@shared/schema";
import Piano from "@/components/Piano";
import ChordChallenge from "@/components/ChordChallenge";
import GameControls from "@/components/GameControls";
import Instructions from "@/components/Instructions";
import { usePiano } from "@/hooks/use-piano";
import * as Tone from "tone";

export default function Game() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [score, setScore] = useState(0);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Fetch chords based on selected difficulty
  const { data: chords, isLoading, isError } = useQuery({
    queryKey: ['/api/chords', difficulty],
    queryFn: () => fetch(`/api/chords/${difficulty}`).then(res => res.json()),
  });

  const {
    selectedNotes,
    playNote,
    clearSelectedNotes,
    toggleNoteSelection,
    playChord,
  } = usePiano();

  // Initialize Tone.js when the component mounts
  useEffect(() => {
    // Initialize Tone.js on first user interaction (required by browsers)
    const handleFirstInteraction = () => {
      if (Tone.context.state !== "running") {
        console.log("Starting Tone.js audio context...");
        Tone.start();
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("keydown", handleFirstInteraction);
      }
    };
    
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  // Set a random chord when difficulty changes or when chords load
  useEffect(() => {
    if (chords && chords.length > 0) {
      const randomIndex = Math.floor(Math.random() * chords.length);
      setCurrentChordIndex(randomIndex);
    }
  }, [chords, difficulty]);

  // Get current chord
  const currentChord: ChordData | undefined = chords && chords.length > 0 
    ? chords[currentChordIndex] 
    : undefined;

  // Generate a new random chord
  const generateNewChord = () => {
    if (chords && chords.length > 0) {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * chords.length);
      } while (newIndex === currentChordIndex && chords.length > 1);
      
      setCurrentChordIndex(newIndex);
      clearSelectedNotes();
      setShowFeedback(false);
    }
  };

  // Submit the user's answer
  const handleSubmit = () => {
    if (!currentChord) return;
    
    // Check if selected notes match chord notes
    const correctNotes = new Set(currentChord.notes);
    const userNotes = new Set(selectedNotes);
    
    let correct = false;
    
    if (correctNotes.size === userNotes.size) {
      correct = Array.from(correctNotes).every(note => userNotes.has(note));
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setFeedbackMessage("Correct! Well done!");
      setScore(prevScore => prevScore + 10);
      
      // Submit score to the backend
      apiRequest("POST", "/api/game-sessions", {
        score: score + 10,
        difficulty,
        completedAt: new Date().toISOString()
      });
      
      // Generate new chord after delay
      setTimeout(generateNewChord, 1500);
    } else {
      setFeedbackMessage("Not quite right. Try again!");
      
      // Clear feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  // Play the current chord
  const handlePlayChord = () => {
    if (currentChord) {
      playChord(currentChord.notes);
    }
  };

  return (
    <div className="bg-neutral-light min-h-screen font-inter text-neutral-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-primary mb-2">
            Piano Chord Identifier
          </h1>
          <p className="text-lg text-neutral-dark/80">
            Learn to identify piano chords through practice
          </p>
        </header>

        {/* Game Container */}
        <Card className="bg-white rounded-xl shadow-lg mb-8">
          <CardContent className="p-6">
            {/* Game Status */}
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center">
                  <span className="text-sm uppercase tracking-wider text-neutral-dark/70 mr-2">
                    Level:
                  </span>
                  {/* Difficulty Selector */}
                  <div className="relative inline-block">
                    <select
                      id="difficulty-selector"
                      className="appearance-none bg-neutral-light rounded px-3 py-1 pr-8 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-dark">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Display */}
              <div className="px-4 py-2 bg-primary text-white rounded-full font-poppins font-semibold shadow">
                <span className="mr-1">Score:</span>
                <span id="score-value" className="text-xl">{score}</span>
              </div>
            </div>

            {/* Challenge Card */}
            <ChordChallenge 
              currentChord={currentChord?.name} 
              isLoading={isLoading} 
            />

            {/* Feedback */}
            <div className="h-12 mb-4 flex items-center justify-center overflow-hidden">
              <div 
                className={`font-medium text-lg transition-all duration-300 transform ${
                  showFeedback ? 'scale-100' : 'scale-0'
                } ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
              >
                {feedbackMessage}
              </div>
            </div>

            {/* Piano Component */}
            <Piano 
              selectedNotes={selectedNotes}
              onNoteClick={({ note, octave }) => {
                playNote(note, octave);
                toggleNoteSelection(`${note}${octave}`);
              }} 
            />

            {/* Game Controls */}
            <GameControls 
              onPlayChord={handlePlayChord}
              onClear={clearSelectedNotes}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Instructions />
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { type ChordData, type DifficultyLevel } from "@shared/schema";
import Piano from "@/components/Piano";
import ChordChallenge from "@/components/ChordChallenge";
import GameControls from "@/components/GameControls";
import Instructions from "@/components/Instructions";
import { usePiano } from "@/hooks/use-piano";
import { checkChordMatch } from "@/lib/chords";
import * as Tone from "tone";

export default function Game() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("level1");
  const [score, setScore] = useState(0);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  
  // Keep track of recently used chord indices and types (to prevent repetitive chords)
  const [recentChordIndices, setRecentChordIndices] = useState<number[]>([]);
  const [recentChordTypes, setRecentChordTypes] = useState<string[]>([]);

  // Fetch chords based on selected difficulty
  const { data: chords, isLoading } = useQuery({
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
    
  // Generate a new random chord - avoid repeating recent chords
  const generateNewChord = useCallback(() => {
    if (!chords || chords.length === 0) return;
    
    // Determine cooldown length based on difficulty level
    // Level 1 has a cooldown of 6, all other levels have a cooldown of 10
    const cooldownLength = difficulty === 'level1' ? 6 : 10;
    
    // Create a list of valid chord indices (those not in recent history)
    const validChordIndices = [];
    const validChordTypes = new Map(); // Map to group indices by chord type
    
    for (let i = 0; i < chords.length; i++) {
      // Skip chords that were recently used (in cooldown)
      if (recentChordIndices.includes(i)) continue;
      
      // Extract chord type from the name
      const chordName = chords[i].name;
      let chordType = '';
      
      if (chordName.includes('aug')) chordType = 'augmented';
      else if (chordName.includes('dim')) chordType = 'diminished';
      else if (chordName.includes('sus')) chordType = 'suspended';
      else if (chordName.includes('m ')) chordType = 'minor';
      else chordType = 'major';
      
      // Add to our list of valid chords
      validChordIndices.push(i);
      
      // Group by chord type
      if (!validChordTypes.has(chordType)) {
        validChordTypes.set(chordType, []);
      }
      validChordTypes.get(chordType)?.push(i);
    }
    
    // Check if we have more than 2 of the same chord type in a row
    // If so, we need to filter out that chord type from our valid indices
    let filteredIndices = [...validChordIndices];
    
    if (recentChordTypes.length >= 2 && 
        recentChordTypes[0] === recentChordTypes[1]) {
      // We already have 2 of the same type in a row, must pick a different type
      filteredIndices = validChordIndices.filter(idx => {
        const chord = chords[idx];
        const name = chord.name;
        let type = '';
        
        if (name.includes('aug')) type = 'augmented';
        else if (name.includes('dim')) type = 'diminished';
        else if (name.includes('sus')) type = 'suspended';
        else if (name.includes('m ')) type = 'minor';
        else type = 'major';
        
        return type !== recentChordTypes[0];
      });
    }
    
    // If no valid chords remain after filtering (rare edge case),
    // fall back to the original valid indices
    if (filteredIndices.length === 0) {
      filteredIndices = validChordIndices;
      console.log("Warning: Had to use a third consecutive chord of the same type");
    }
    
    // Select a random chord from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredIndices.length);
    const newChordIndex = filteredIndices[randomIndex];
    
    // Update the recent chord indices (for cooldown tracking)
    setRecentChordIndices(prev => {
      return [newChordIndex, ...prev.slice(0, cooldownLength - 1)];
    });
    
    // Update the recent chord types (for max 2-in-a-row tracking)
    const newChord = chords[newChordIndex];
    if (newChord) {
      let chordType = '';
      const name = newChord.name;
      
      if (name.includes('aug')) chordType = 'augmented';
      else if (name.includes('dim')) chordType = 'diminished';
      else if (name.includes('sus')) chordType = 'suspended';
      else if (name.includes('m ')) chordType = 'minor';
      else chordType = 'major';
      
      setRecentChordTypes(prev => {
        return [chordType, ...prev.slice(0, 2)];
      });
    }
    
    setCurrentChordIndex(newChordIndex);
    clearSelectedNotes();
    setShowFeedback(false);
  }, [chords, difficulty, recentChordIndices, recentChordTypes, clearSelectedNotes]);

  // Function to handle playing the current chord
  const handlePlayChord = useCallback(() => {
    if (currentChord) {
      // Always play original reference chord
      playChord(currentChord.notes);
      
      // Provide visual feedback by highlighting the correct notes
      // This doesn't force the user to use the same octave
      clearSelectedNotes();
      
      // Briefly show the reference chord notes
      setTimeout(() => {
        // Clear the highlight after a short delay
        clearSelectedNotes();
      }, 1000);
    }
  }, [currentChord, playChord, clearSelectedNotes]);
  
  // Submit the user's answer
  const handleSubmit = useCallback(() => {
    if (!currentChord) return;
    
    // Use the checkChordMatch function from the chords library
    // This handles the mathematical approach to chord matching
    const correct = checkChordMatch(selectedNotes, currentChord.notes);
    
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
  }, [currentChord, selectedNotes, score, difficulty, generateNewChord]);

  // Initialize Tone.js and handle keyboard shortcuts 
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
    
    // Add keyboard shortcuts
    const handleKeydown = (event: KeyboardEvent) => {
      // Only handle keypresses if not in an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (event.key) {
        case 'Enter':
          // Submit answer with Enter key
          handleSubmit();
          break;
        case ' ': // Space key
          // Play chord with Space key
          event.preventDefault(); // Prevent page scrolling
          handlePlayChord();
          break;
        case 'Backspace':
          // Clear selected notes with Backspace key
          clearSelectedNotes();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleSubmit, handlePlayChord, clearSelectedNotes]);

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
                      <option value="level1">Level 1: Major/Minor Triads</option>
                      <option value="level2">Level 2: All Major/Minor Triads</option>
                      <option value="level3">Level 3: Aug/Dim/Sus (White Key)</option>
                      <option value="level4">Level 4: All 12 Keys (Maj/Min/Aug/Dim)</option>
                      <option value="level5">Level 5: First Inversions</option>
                      <option value="level6">Level 6: Second Inversions</option>
                      <option value="level7">Level 7: All Chords Review</option>
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
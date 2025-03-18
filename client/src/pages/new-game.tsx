import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, verifyChordMatch } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { type ChordData, type DifficultyLevel } from "@shared/schema";
import Piano from "@/components/Piano";
import ChordChallenge from "@/components/ChordChallenge";
import GameControls from "@/components/GameControls";
import Instructions from "@/components/Instructions";
import { usePiano } from "@/hooks/use-piano";
import * as Tone from "tone";
// Import note mapping utilities for feedback system
import { noteToNumeric, numericToNote } from "@/lib/chords";

// Helper function to convert scale degree to semitone offset
const scaleDegreeToSemitone = (scaleDegree: string): number => {
  // Parse the scale degree into a normalized form
  const degree = scaleDegree.replace(/[b#]/g, "");  // Remove flats/sharps
  const flatCount = (scaleDegree.match(/b/g) || []).length;
  const sharpCount = (scaleDegree.match(/#/g) || []).length;
  
  // Calculate semitone offset based on the scale degree
  let semitones = 0;
  switch(degree) {
    case "1": semitones = 0; break;  // Root/Unison
    case "2": semitones = 2; break;  // Major 2nd
    case "3": semitones = 4; break;  // Major 3rd
    case "4": semitones = 5; break;  // Perfect 4th
    case "5": semitones = 7; break;  // Perfect 5th
    case "6": semitones = 9; break;  // Major 6th
    case "7": semitones = 11; break; // Major 7th
    default: semitones = 0;          // Default to root if unknown
  }
  
  // Apply flats and sharps
  semitones = semitones - flatCount + sharpCount;
  
  // Normalize to range 0-11
  while (semitones < 0) semitones += 12;
  while (semitones >= 12) semitones -= 12;
  
  return semitones;
};

// Helper function to convert semitone offset to a note value
const getNoteFromSemitone = (semitones: number, rootNote: number): number => {
  // Calculate note by adding semitones to root note
  let note = rootNote + semitones;
  
  // Normalize to range 1-12
  while (note > 12) note -= 12;
  while (note < 1) note += 12;
  
  return note;
};

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
  const handleSubmit = useCallback(async () => {
    if (!currentChord) return;
    
    // Use the enhanced server-side API for chord matching
    // This handles the mathematical approach with scale degree tracking
    const result = await verifyChordMatch(
      selectedNotes,
      currentChord.notes,
      currentChord.id
    );
    
    const correct = result.isMatch;
    setIsCorrect(Boolean(correct));
    setShowFeedback(true);
    
    if (correct) {
      // Access the scale degrees if available in the response
      const scaleDegrees = result.targetChord?.scaleDegrees;
      let successMessage = "Correct! Well done!";
      
      // Display extra info about scale degrees if available
      if (scaleDegrees) {
        const rootDegree = Object.values(scaleDegrees).find(deg => deg === "1");
        if (rootDegree) {
          successMessage += ` You found the root note correctly!`;
        }
      }
      
      setFeedbackMessage(successMessage);
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
      // Provide more detailed feedback when answer is incorrect
      let feedbackMsg = "Not quite right. ";
      
      // Check if we have the target chord data for more detailed feedback
      if (result.targetChord) {
        // Get the target chord info
        const targetName = result.targetChord.name;
        const rootNote = result.targetChord.rootNote;
        const inversion = result.targetChord.inversion;
        const scaleDegrees = result.targetChord.scaleDegrees;
        
        // Extract user notes with octaves for correct analysis
        const userNotesWithOctaves = selectedNotes.map((noteStr) => {
          const noteName = noteStr.replace(/[0-9]/g, ""); // Remove octave
          const octave = parseInt(noteStr.match(/[0-9]+/)?.[0] || "4", 10);
          const noteNum = noteToNumeric(noteName);
          return { note: noteNum, octave };
        });
        
        // Sort by octave (lowest to highest)
        userNotesWithOctaves.sort((a, b) => {
          if (a.octave !== b.octave) return a.octave - b.octave;
          return a.note - b.note;
        });
        
        // Extract just the pitch classes of the user's notes in order from bass to soprano
        const userPitchClasses = userNotesWithOctaves.map(n => n.note);
        
        // Identify which scale degrees are present and which are missing
        if (scaleDegrees) {
          // Create a set of the expected notes based on scale degrees
          const expectedNotes = new Set(
            Object.values(scaleDegrees).map(degree => {
              // Convert scale degree to semitones, then to note number
              const semitones = scaleDegreeToSemitone(degree);
              return getNoteFromSemitone(semitones, rootNote);
            })
          );
          
          // Create a set of the user's notes
          const userNotes = new Set(userPitchClasses);
          
          // Find missing notes by set difference
          const missingNotes: number[] = [];
          Array.from(expectedNotes).forEach(note => {
            if (!userNotes.has(note)) {
              missingNotes.push(note);
            }
          });
          
          // Check if root note is missing
          const rootScaleDegreeValue = Object.entries(scaleDegrees)
            .find(([_, degree]) => degree === "1")?.[0];
          
          if (rootScaleDegreeValue && missingNotes.includes(rootNote)) {
            feedbackMsg += `You're missing the root note (${numericToNote(rootNote, 4)}) of the chord. `;
          } else if (missingNotes.length > 0) {
            feedbackMsg += `You're missing one or more notes of the chord. `;
          }
          
          // Check for wrong inversion
          if (inversion > 0) {
            // For inverted chords, check if the correct note is in the bass position
            const bassScaleDegree = Object.entries(scaleDegrees)
              .find(([position, _]) => parseInt(position) === inversion)?.[1];
              
            if (bassScaleDegree) {
              const bassSemitone = scaleDegreeToSemitone(bassScaleDegree);
              const expectedBassNote = getNoteFromSemitone(bassSemitone, rootNote);
              
              if (userPitchClasses.length > 0 && userPitchClasses[0] !== expectedBassNote) {
                const inversionText = inversion === 1 ? "1st" : 
                                     inversion === 2 ? "2nd" : 
                                     inversion === 3 ? "3rd" : `${inversion}th`;
                                
                const bassNoteStr = numericToNote(expectedBassNote, 4);
                feedbackMsg += `Check the bottom note - this is a ${targetName} in ${inversionText} inversion with ${bassNoteStr} in the bass.`;
              }
            }
          } else if (userPitchClasses.length > 0 && userPitchClasses[0] !== rootNote) {
            // For root position, root should be in the bass
            feedbackMsg += `In root position, ${numericToNote(rootNote, 4)} should be the bottom note.`;
          }
          
          // If no specific issues found but still incorrect
          if (feedbackMsg === "Not quite right. ") {
            feedbackMsg += `Try building the ${targetName} chord correctly.`;
          }
        } else {
          // No scale degree information available
          feedbackMsg += `Try building the ${targetName} chord from the root up.`;
        }
      } else {
        feedbackMsg += "Try again!";
      }
      

      
      setFeedbackMessage(feedbackMsg);
      
      // Clear feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000); // Slightly longer delay for more complex feedback
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
                      <option value="level7">Level 7: All Triads & Inversions</option>
                      <option value="level8">Level 8: Basic 7th Chords</option>
                      <option value="level9">Level 9: Advanced 7th Chords</option>
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
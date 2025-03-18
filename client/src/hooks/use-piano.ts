import { useState, useCallback } from "react";
import * as Tone from "tone";

export function usePiano() {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);

  // Initialize the Tone.js synth
  const initSynth = useCallback(() => {
    if (!synth) {
      const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
      newSynth.volume.value = -8; // Adjust volume level
      setSynth(newSynth);
      return newSynth;
    }
    return synth;
  }, [synth]);

  // Play a single note
  const playNote = useCallback((note: string, octave: number) => {
    const currentSynth = initSynth();
    const noteWithOctave = `${note}${octave}`;
    
    // Start the audio context if it's suspended
    if (Tone.context.state !== "running") {
      Tone.start();
    }
    
    // Play the note with a short duration
    currentSynth.triggerAttackRelease(noteWithOctave, "8n");
  }, [initSynth]);

  // Play a chord (multiple notes at once)
  const playChord = useCallback((notes: string[]) => {
    const currentSynth = initSynth();
    
    // Start the audio context if it's suspended
    if (Tone.context.state !== "running") {
      Tone.start();
    }
    
    // Play each note with a slight delay for arpeggio effect
    notes.forEach((note, index) => {
      setTimeout(() => {
        currentSynth.triggerAttackRelease(note, "4n");
      }, index * 60);
    });
  }, [initSynth]);

  // Toggle a note selection (add or remove)
  const toggleNoteSelection = useCallback((noteId: string) => {
    setSelectedNotes(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(n => n !== noteId);
      } else {
        return [...prev, noteId];
      }
    });
  }, []);

  // Clear all selected notes
  const clearSelectedNotes = useCallback(() => {
    setSelectedNotes([]);
  }, []);

  return {
    selectedNotes,
    playNote,
    playChord,
    toggleNoteSelection,
    clearSelectedNotes
  };
}

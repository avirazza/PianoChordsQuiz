import { useState, useCallback, useEffect } from "react";
import * as Tone from "tone";

export function usePiano() {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [midiEnabled, setMidiEnabled] = useState<boolean>(false);

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

  // Map MIDI note numbers to note names with octave
  const midiNoteToNoteName = useCallback((midiNote: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = noteNames[midiNote % 12];
    return `${noteName}${octave}`;
  }, []);

  // Handle MIDI note on message
  const onMIDIMessage = useCallback((event: WebMidi.MIDIMessageEvent) => {
    const currentSynth = initSynth();
    // Convert Uint8Array to regular array to fix iteration issues
    const data = Array.from(event.data);
    const command = data[0];
    const note = data[1];
    const velocity = data[2];
    
    // Note on with velocity > 0
    if (command === 144 && velocity > 0) {
      const noteName = midiNoteToNoteName(note);
      
      // Play the note and add it to selected notes
      currentSynth.triggerAttack(noteName);
      
      // Add note to selected notes if not already included
      setSelectedNotes(prev => {
        if (!prev.includes(noteName)) {
          return [...prev, noteName];
        }
        return prev;
      });
    } 
    // Note off or note on with 0 velocity
    else if (command === 128 || (command === 144 && velocity === 0)) {
      const noteName = midiNoteToNoteName(note);
      
      // Release the note but don't remove from selected notes
      // This lets the user build chords with MIDI keyboard
      currentSynth.triggerRelease(noteName);
    }
  }, [initSynth, midiNoteToNoteName]);

  // Set up MIDI access
  useEffect(() => {
    // Check if Web MIDI API is supported
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          setMidiAccess(access);
          setMidiEnabled(true);

          // Set up listeners for MIDI inputs
          const inputs = access.inputs.values();
          let input = inputs.next();
          while (!input.done) {
            // Type assertion to handle missing property in type definition
            (input.value as any).onmidimessage = onMIDIMessage;
            input = inputs.next();
          }

          // Listen for connection/disconnection of MIDI devices
          access.onstatechange = (event) => {
            const port = event.port;
            if (port.type === 'input') {
              if (port.state === 'connected') {
                // Type assertion to handle missing property in type definition
                (port as any).onmidimessage = onMIDIMessage;
              }
            }
          };
        })
        .catch((error) => {
          console.error("MIDI access denied or not supported in this browser:", error);
          setMidiEnabled(false);
        });
    } else {
      console.warn("Web MIDI API not supported in this browser");
      setMidiEnabled(false);
    }
    
    // Cleanup MIDI connections on unmount
    return () => {
      if (midiAccess) {
        const inputs = midiAccess.inputs.values();
        let input = inputs.next();
        while (!input.done) {
          // Type assertion to handle missing property in type definition
          (input.value as any).onmidimessage = null;
          input = inputs.next();
        }
      }
    };
  }, [onMIDIMessage]);

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
    clearSelectedNotes,
    midiEnabled
  };
}

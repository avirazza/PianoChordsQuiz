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
    // Convert Uint8Array to regular array to fix iteration issues
    const data = Array.from(event.data);
    const command = data[0];
    const note = data[1];
    const velocity = data[2];
    
    // Skip sustain pedal and other control messages (CC messages are typically on channel 176-191)
    if (command >= 176 && command <= 191) {
      return;
    }
    
    // Log MIDI message received but only for note-related messages
    console.log("MIDI data received:", data);
    console.log(`MIDI command: ${command}, note: ${note}, velocity: ${velocity}`);
    
    // Start audio context if suspended
    if (Tone.context.state !== "running") {
      console.log("Starting Tone.js context due to MIDI input");
      Tone.start();
    }
    
    const currentSynth = initSynth();
    
    // Note on with velocity > 0
    if (command === 144 && velocity > 0) {
      const noteName = midiNoteToNoteName(note);
      console.log(`MIDI note on: ${noteName} (from MIDI note ${note})`);
      
      // Play the note and add it to selected notes
      currentSynth.triggerAttack(noteName);
      
      // Add note to selected notes if not already included
      setSelectedNotes(prev => {
        if (!prev.includes(noteName)) {
          const newNotes = [...prev, noteName];
          console.log("Updated selected notes:", newNotes);
          return newNotes;
        }
        return prev;
      });
    } 
    // Note off or note on with 0 velocity
    else if (command === 128 || (command === 144 && velocity === 0)) {
      const noteName = midiNoteToNoteName(note);
      console.log(`MIDI note off: ${noteName} (from MIDI note ${note})`);
      
      // Release the note but don't remove from selected notes
      // This lets the user build chords with MIDI keyboard
      currentSynth.triggerRelease(noteName);
    } 
    // Ignore all other MIDI messages
    else if (command !== 128 && command !== 144) {
      console.log(`Ignoring MIDI command: ${command}`);
    }
  }, [initSynth, midiNoteToNoteName]);

  // Set up MIDI access
  useEffect(() => {
    // Check if Web MIDI API is supported
    if (navigator.requestMIDIAccess) {
      console.log("Web MIDI API is supported in this browser - attempting to connect...");
      navigator.requestMIDIAccess({ sysex: true })
        .then((access) => {
          console.log("MIDI Access granted:", access);
          console.log("Number of inputs:", access.inputs.size);
          
          // Check if any MIDI inputs are available
          if (access.inputs.size === 0) {
            console.log("No MIDI inputs detected, but API access is available");
            setMidiEnabled(false);
            return;
          }
          
          setMidiAccess(access);
          setMidiEnabled(true);

          // Log all available MIDI inputs
          const inputMap = access.inputs;
          console.log("Available MIDI Inputs:");
          inputMap.forEach((input, id) => {
            console.log(`- Input ID: ${id}, Name: ${input.name}, Manufacturer: ${input.manufacturer}, State: ${input.state}`);
          });

          // Set up listeners for MIDI inputs
          const inputs = access.inputs.values();
          let input = inputs.next();
          while (!input.done) {
            console.log(`Setting up MIDI listener for: ${input.value.name}`);
            // Type assertion to handle missing property in type definition
            (input.value as any).onmidimessage = onMIDIMessage;
            input = inputs.next();
          }

          // Listen for connection/disconnection of MIDI devices
          access.onstatechange = (event) => {
            const port = event.port;
            console.log(`MIDI port state change: ${port.name} (${port.type}) is now ${port.state}`);
            
            if (port.type === 'input') {
              if (port.state === 'connected') {
                console.log(`MIDI input connected: ${port.name}`);
                // Type assertion to handle missing property in type definition
                (port as any).onmidimessage = onMIDIMessage;
                setMidiEnabled(true);
              } else if (port.state === 'disconnected') {
                console.log(`MIDI input disconnected: ${port.name}`);
                // Check if we still have any connected inputs
                let hasConnectedInputs = false;
                const inputs = midiAccess?.inputs.values();
                if (inputs) {
                  let input = inputs.next();
                  while (!input.done) {
                    if (input.value.state === 'connected') {
                      hasConnectedInputs = true;
                      break;
                    }
                    input = inputs.next();
                  }
                }
                setMidiEnabled(hasConnectedInputs);
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
        console.log("Cleaning up MIDI connections");
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

  // Function to manually request MIDI access
  const requestMIDIAccess = useCallback(() => {
    console.log("Manually requesting MIDI access...");
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then((access) => {
          console.log("MIDI Access manually granted:", access);
          console.log("Number of inputs:", access.inputs.size);
          
          // Check if any MIDI inputs are available
          if (access.inputs.size === 0) {
            console.log("No MIDI inputs detected, but API access is available");
            setMidiEnabled(false);
            return;
          }
          
          setMidiAccess(access);
          setMidiEnabled(true);

          // Log all available MIDI inputs
          const inputMap = access.inputs;
          console.log("Available MIDI Inputs:");
          inputMap.forEach((input, id) => {
            console.log(`- Input ID: ${id}, Name: ${input.name}, Manufacturer: ${input.manufacturer}, State: ${input.state}`);
          });

          // Set up listeners for MIDI inputs
          const inputs = access.inputs.values();
          let input = inputs.next();
          while (!input.done) {
            console.log(`Setting up MIDI listener for: ${input.value.name}`);
            // Type assertion to handle missing property in type definition
            (input.value as any).onmidimessage = onMIDIMessage;
            input = inputs.next();
          }

          // Listen for connection/disconnection of MIDI devices
          access.onstatechange = (event) => {
            const port = event.port;
            console.log(`MIDI port state change: ${port.name} (${port.type}) is now ${port.state}`);
            
            if (port.type === 'input') {
              if (port.state === 'connected') {
                console.log(`MIDI input connected: ${port.name}`);
                // Type assertion to handle missing property in type definition
                (port as any).onmidimessage = onMIDIMessage;
                setMidiEnabled(true);
              } else if (port.state === 'disconnected') {
                console.log(`MIDI input disconnected: ${port.name}`);
                // Check if we still have any connected inputs
                let hasConnectedInputs = false;
                const inputs = midiAccess?.inputs.values();
                if (inputs) {
                  let input = inputs.next();
                  while (!input.done) {
                    if (input.value.state === 'connected') {
                      hasConnectedInputs = true;
                      break;
                    }
                    input = inputs.next();
                  }
                }
                setMidiEnabled(hasConnectedInputs);
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
  }, [onMIDIMessage]);

  return {
    selectedNotes,
    playNote,
    playChord,
    toggleNoteSelection,
    clearSelectedNotes,
    midiEnabled,
    requestMIDIAccess
  };
}

import React, { useEffect } from "react";

// Add this comment to suppress TypeScript warnings
// @ts-ignore

interface PianoProps {
  selectedNotes: string[];
  onNoteClick: (note: { note: string; octave: number }) => void;
}

interface KeyProps {
  note: string;
  octave: number;
  selected: boolean;
  onNoteClick: (note: { note: string; octave: number }) => void;
  isBlack?: boolean;
  keyWidth: number;
  keyGap?: number;
}

// Piano Key Component
const Key: React.FC<KeyProps> = ({ 
  note, 
  octave, 
  selected, 
  onNoteClick, 
  isBlack = false, 
  keyWidth,
  keyGap = 2 // Default gap of 2px
}) => {
  const keyType = isBlack ? "black-key" : "white-key";
  
  // CSS classes for key styling
  const baseClasses = isBlack
    ? "absolute bg-black border border-neutral-dark/60 rounded-b-md h-full cursor-pointer hover:bg-gray-800 active:bg-gray-700 z-10"
    : "relative bg-white border border-neutral-dark/30 rounded-b-md h-full mx-[1px] cursor-pointer hover:bg-blue-50 active:bg-blue-100";
  
  const selectedClasses = selected 
    ? isBlack ? "bg-primary/70 border-primary" : "bg-primary/20 border-primary" 
    : "";
  
  // Create style object for positioning
  const style: React.CSSProperties = {};
  
  if (isBlack) {
    // Position black keys precisely between white keys
    
    // Get the white keys in order
    const whiteKeysOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    // Get base note (without the #)
    const baseNote = note.charAt(0);
    
    // Find index of the base note in the white key order
    const baseNoteIndex = whiteKeysOrder.indexOf(baseNote);
    
    // Calculate the real position based on key width and gaps
    // Each octave is 7 keys with gaps between them
    const octaveOffset = (octave - 3) * 7 * (keyWidth + keyGap);
    
    // This is the left edge of the white key
    const whiteKeyPosition = octaveOffset + baseNoteIndex * (keyWidth + keyGap);
    
    // Width of black keys
    const blackWidth = keyWidth * 0.55; // Slightly narrower black keys
    
    // Position black keys based on note type
    let position;
    
    // Apply slight adjustments to each black key type for visual alignment
    if (note === 'C#') {
      // C# needs to be slightly right of center between C and D
      position = whiteKeyPosition + keyWidth - (blackWidth * 0.45);
    } else if (note === 'D#') {
      // D# needs to be slightly left of center between D and E
      position = whiteKeyPosition + keyWidth * 2 - (blackWidth * 0.55);
    } else if (note === 'F#') {
      // F# needs to be slightly right of center between F and G
      position = whiteKeyPosition + keyWidth - (blackWidth * 0.45);
    } else if (note === 'G#') {
      // G# needs to be slightly in center between G and A
      position = whiteKeyPosition + keyWidth * 2 - (blackWidth * 0.5);
    } else if (note === 'A#') {
      // A# needs to be slightly left of center between A and B
      position = whiteKeyPosition + keyWidth * 2 - (blackWidth * 0.55);
    }
    
    style.left = `${position}px`;
    style.width = `${blackWidth}px`;
    
  } else {
    // White keys have width + small gaps between them
    style.width = `${keyWidth}px`;
    style.marginRight = `${keyGap}px`;
  }
  
  return (
    <div
      className={`piano-key ${keyType} ${baseClasses} ${selectedClasses}`}
      style={style}
      onClick={() => onNoteClick({ note, octave })}
      data-note={`${note}${octave}`}
    >
      <span 
        className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs pointer-events-none ${
          isBlack ? "text-white" : "text-neutral-dark/80"
        }`}
      >
        {note}{octave}
      </span>
    </div>
  );
};

const Piano: React.FC<PianoProps> = ({ selectedNotes, onNoteClick }) => {
  // Define piano range (C3 to B5)
  const octaveRange = [3, 4, 5];
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes = ['C#', 'D#', 'F#', 'G#', 'A#'];
  
  // State for tracking MIDI devices
  const [midiStatus, setMidiStatus] = React.useState<{
    supported: boolean;
    connected: boolean;
    devices: string[];
    lastMessage: number;
  }>({
    supported: false,
    connected: false,
    devices: [],
    lastMessage: 0
  });
  
  // Generate white and black keys
  const whiteKeys: Array<{ note: string; octave: number }> = [];
  const blackKeys: Array<{ note: string; octave: number }> = [];
  
  octaveRange.forEach(octave => {
    whiteNotes.forEach(note => {
      whiteKeys.push({ note, octave });
    });
    
    blackNotes.forEach(note => {
      blackKeys.push({ note, octave });
    });
  });
  
  // Piano key sizing and spacing
  const keyWidth = 40; // Width in pixels for white keys
  const keyGap = 2;    // Gap between white keys (pixels)
  
  // Setup MIDI Input with type casting for TypeScript compatibility
  useEffect(() => {
    if ('requestMIDIAccess' in navigator) {
      setMidiStatus(prev => ({ ...prev, supported: true }));
      
      // Use 'any' type to bypass TypeScript type checking since MIDI interfaces are complex
      const nav = navigator as any;
      nav.requestMIDIAccess()
        .then((midiAccess: any) => {
          // Check connected devices
          const inputs = midiAccess.inputs.values();
          const connectedDevices: string[] = [];
          
          for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = handleMIDIMessage;
            if (input.value.name) {
              connectedDevices.push(input.value.name);
            }
          }
          
          // Update MIDI status
          setMidiStatus(prev => ({
            ...prev, 
            connected: connectedDevices.length > 0,
            devices: connectedDevices
          }));
          
          // Listen for MIDI connection/disconnection
          midiAccess.onstatechange = (e: any) => {
            if (e.port) {
              console.log('MIDI connection state change:', e.port.name, e.port.state);
              
              // Refresh the device list
              const updatedInputs = midiAccess.inputs.values();
              const updatedDevices: string[] = [];
              
              for (let input = updatedInputs.next(); input && !input.done; input = updatedInputs.next()) {
                if (input.value.state === 'connected' && input.value.name) {
                  updatedDevices.push(input.value.name);
                  input.value.onmidimessage = handleMIDIMessage;
                }
              }
              
              setMidiStatus(prev => ({
                ...prev,
                connected: updatedDevices.length > 0,
                devices: updatedDevices
              }));
            }
          };
          
          console.log('MIDI access granted, connect your MIDI keyboard');
        })
        .catch((err: Error) => {
          console.log('MIDI access denied:', err.message);
          setMidiStatus(prev => ({ 
            ...prev, 
            supported: true, 
            connected: false 
          }));
        });
    } else {
      console.log('Web MIDI API not supported in this browser');
      setMidiStatus(prev => ({ 
        ...prev, 
        supported: false, 
        connected: false 
      }));
    }
  }, []);
  
  // Handle MIDI messages with type safety
  const handleMIDIMessage = (message: any) => {
    // Check if data exists
    if (message.data) {
      const command = message.data[0];
      const note = message.data[1];
      const velocity = message.data[2];
      
      // Update last message timestamp for activity indicator
      setMidiStatus(prev => ({ ...prev, lastMessage: Date.now() }));
      
      // Note on (144) with velocity > 0
      if ((command === 144) && (velocity > 0)) {
        const noteName = midiNoteToName(note);
        if (noteName) {
          const [name, octave] = parseMIDINoteName(noteName);
          onNoteClick({ note: name, octave });
        }
      }
    }
  };
  
  // MIDI note number to note name
  const midiNoteToName = (midiNumber: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteName = noteNames[midiNumber % 12];
    return `${noteName}${octave}`;
  };
  
  // Parse MIDI note name to separate note and octave
  const parseMIDINoteName = (noteName: string): [string, number] => {
    const match = noteName.match(/([A-G]#?)(\d+)/);
    if (match) {
      return [match[1], parseInt(match[2])];
    }
    return ['C', 4]; // Default fallback
  };
  
  // MIDI status indicator with activity
  const isActive = Date.now() - midiStatus.lastMessage < 500; // Active if message in last 500ms
  
  return (
    <div className="relative overflow-x-auto py-4">
      <div className="piano-container flex justify-center min-w-max overflow-x-auto">
        <div id="piano" className="relative h-48 md:h-56 flex">
          {/* White keys */}
          <div className="white-keys flex">
            {whiteKeys.map((key) => (
              <Key
                key={`white-${key.note}${key.octave}`}
                note={key.note}
                octave={key.octave}
                selected={selectedNotes.includes(`${key.note}${key.octave}`)}
                onNoteClick={onNoteClick}
                keyWidth={keyWidth}
                keyGap={keyGap}
              />
            ))}
          </div>

          {/* Black keys */}
          <div className="black-keys absolute top-0 left-0 h-[65%]">
            {blackKeys.map((key) => (
              <Key
                key={`black-${key.note}${key.octave}`}
                note={key.note}
                octave={key.octave}
                selected={selectedNotes.includes(`${key.note}${key.octave}`)}
                onNoteClick={onNoteClick}
                isBlack
                keyWidth={keyWidth}
                keyGap={keyGap}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* MIDI Connection Status */}
      <div className="text-center mt-4 text-sm">
        <div className="flex items-center justify-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              !midiStatus.supported 
                ? 'bg-red-500' 
                : midiStatus.connected 
                  ? isActive 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-green-500'
                  : 'bg-yellow-500'
            }`}
          ></div>
          <div className="text-neutral-dark/70">
            {!midiStatus.supported ? (
              <div>
                <p className="text-red-500 font-semibold">MIDI not supported in this browser</p>
                <p className="text-xs mt-1">
                  To use MIDI, try Chrome or Edge browser with "chrome://flags/#enable-web-midi" enabled
                </p>
              </div>
            ) : midiStatus.connected ? (
              <p>MIDI connected: {midiStatus.devices.join(', ')} {isActive ? '(active)' : ''}</p>
            ) : (
              <div>
                <p>Connect a MIDI keyboard to use it with this app</p>
                <p className="text-xs mt-1">
                  If your keyboard is already connected but not detected, try reconnecting the USB cable
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piano;

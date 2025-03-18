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
}

// Piano Key Component
const Key: React.FC<KeyProps> = ({ 
  note, 
  octave, 
  selected, 
  onNoteClick, 
  isBlack = false, 
  keyWidth 
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
    // Black key positioning based on note name
    // We need to position precisely between white keys
    // Each white key has width of keyWidth
    
    // This calculates the actual index of the white key in the overall layout
    // For example: C3 is index 0, D3 is index 1, E3 is index 2, etc.
    const whiteKeyIndex = (octave - 3) * 7 + 
                          ['C', 'D', 'E', 'F', 'G', 'A', 'B'].indexOf(note.replace('#', ''));
                          
    // Calculate position for black keys
    let position = 0;
    const blackWidth = keyWidth * 0.65; // Width of black keys
    
    if (note === 'C#') {
      // Position between C and D
      position = whiteKeyIndex * keyWidth + keyWidth - (blackWidth / 2);
    } else if (note === 'D#') {
      // Position between D and E
      position = (whiteKeyIndex + 1) * keyWidth + keyWidth - (blackWidth / 2);
    } else if (note === 'F#') {
      // Position between F and G
      position = (whiteKeyIndex + 1) * keyWidth + keyWidth - (blackWidth / 2);
    } else if (note === 'G#') {
      // Position between G and A
      position = (whiteKeyIndex + 1) * keyWidth + keyWidth - (blackWidth / 2);
    } else if (note === 'A#') {
      // Position between A and B
      position = (whiteKeyIndex + 1) * keyWidth + keyWidth - (blackWidth / 2);
    }
    
    style.left = `${position}px`;
    style.width = `${blackWidth}px`;
    
  } else {
    // Set width for white keys
    style.width = `${keyWidth}px`;
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
  
  // Calculate key width based on available space
  const keyWidth = 40; // Width in pixels for responsive design
  
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
          <p className="text-neutral-dark/70">
            {!midiStatus.supported 
              ? 'MIDI not supported in this browser' 
              : midiStatus.connected 
                ? `MIDI connected: ${midiStatus.devices.join(', ')} ${isActive ? '(active)' : ''}`
                : 'Connect a MIDI keyboard to use it with this app'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Piano;

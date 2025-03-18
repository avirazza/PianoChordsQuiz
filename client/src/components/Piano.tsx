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
    // Black key positioning based on note name and octave
    const positionMap: Record<string, number> = {
      'C#': 0.7,  // Position between C and D
      'D#': 1.7,  // Position between D and E
      'F#': 3.7,  // Position between F and G
      'G#': 4.7,  // Position between G and A
      'A#': 5.7   // Position between A and B
    };
    
    // Calculate position with octave offset
    const position = positionMap[note];
    if (position !== undefined) {
      const octaveOffset = (octave - 3) * 7; // Starting from octave 3
      const absolutePosition = position + octaveOffset;
      
      style.left = `calc(${absolutePosition * keyWidth}px)`;
      style.width = `${keyWidth * 0.65}px`;
    }
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
      // Use 'any' type to bypass TypeScript type checking since MIDI interfaces are complex
      const nav = navigator as any;
      nav.requestMIDIAccess()
        .then((midiAccess: any) => {
          const inputs = midiAccess.inputs.values();
          for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = handleMIDIMessage;
          }
          
          midiAccess.onstatechange = (e: any) => {
            if (e.port) {
              console.log('MIDI connection state change:', e.port.name, e.port.state);
            }
          };
          
          console.log('MIDI access granted, connect your MIDI keyboard');
        })
        .catch((err: Error) => {
          console.log('MIDI access denied:', err.message);
        });
    } else {
      console.log('Web MIDI API not supported in this browser');
    }
  }, []);
  
  // Handle MIDI messages with type safety
  const handleMIDIMessage = (message: any) => {
    // Check if data exists
    if (message.data) {
      const command = message.data[0];
      const note = message.data[1];
      const velocity = message.data[2];
      
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
      <div className="text-center mt-4 text-sm text-neutral-dark/70">
        <p>MIDI keyboard support: Connect a MIDI keyboard to use it with this app</p>
      </div>
    </div>
  );
};

export default Piano;

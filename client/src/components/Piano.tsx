import React from "react";

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
}

// Piano Key Component
const Key: React.FC<KeyProps> = ({ note, octave, selected, onNoteClick, isBlack = false }) => {
  const keyType = isBlack ? "black-key" : "white-key";
  const baseClasses = isBlack
    ? "absolute bg-piano-black border border-neutral-dark/60 rounded-b-md w-6 md:w-8 h-full cursor-pointer hover:bg-gray-800 active:bg-gray-700"
    : "relative bg-piano-white border border-neutral-dark/30 rounded-b-md w-10 md:w-14 h-full mx-[1px] cursor-pointer hover:bg-blue-50 active:bg-blue-100";
  
  const selectedClasses = selected 
    ? isBlack ? "bg-primary/70 border-primary" : "bg-primary/20 border-primary" 
    : "";
  
  return (
    <div
      className={`piano-key ${keyType} ${baseClasses} ${selectedClasses}`}
      style={isBlack ? getBlackKeyPosition(note, octave) : undefined}
      onClick={() => onNoteClick({ note, octave })}
    >
      <span 
        className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs pointer-events-none ${
          isBlack ? "text-white" : "text-neutral-dark/80"
        }`}
      >
        {note}
      </span>
    </div>
  );
};

// Helper function to get black key positions
function getBlackKeyPosition(note: string, octave: number): React.CSSProperties {
  // Map of black key positions relative to white keys
  const positions: Record<string, number> = {
    'C#4': 0,
    'D#4': 1,
    'F#4': 3,
    'G#4': 4,
    'A#4': 5,
    'C#5': 7,
    'D#5': 8
  };
  
  const noteKey = `${note}${octave}`;
  const baseOffset = 5; // Base offset in pixels
  const keyWidth = 10; // Width of white key in pixels
  const keySpacing = 2; // Spacing between keys in pixels
  
  const index = positions[noteKey];
  if (index === undefined) return {};
  
  const left = `calc(${baseOffset + (keyWidth * index) + (keySpacing * index)}px + (0.5rem * ${index}))`;
  
  return { left };
}

const Piano: React.FC<PianoProps> = ({ selectedNotes, onNoteClick }) => {
  // Define white and black keys
  const whiteKeys = [
    { note: 'C', octave: 4 },
    { note: 'D', octave: 4 },
    { note: 'E', octave: 4 },
    { note: 'F', octave: 4 },
    { note: 'G', octave: 4 },
    { note: 'A', octave: 4 },
    { note: 'B', octave: 4 },
    { note: 'C', octave: 5 },
    { note: 'D', octave: 5 },
    { note: 'E', octave: 5 }
  ];

  const blackKeys = [
    { note: 'C#', octave: 4 },
    { note: 'D#', octave: 4 },
    { note: 'F#', octave: 4 },
    { note: 'G#', octave: 4 },
    { note: 'A#', octave: 4 },
    { note: 'C#', octave: 5 },
    { note: 'D#', octave: 5 }
  ];

  return (
    <div className="relative overflow-x-auto py-4">
      <div className="piano-container flex justify-center min-w-max">
        <div id="piano" className="relative h-48 md:h-56 flex">
          {/* White keys */}
          <div className="white-keys flex">
            {whiteKeys.map((key, index) => (
              <Key
                key={`white-${key.note}${key.octave}`}
                note={key.note}
                octave={key.octave}
                selected={selectedNotes.includes(`${key.note}${key.octave}`)}
                onNoteClick={onNoteClick}
              />
            ))}
          </div>

          {/* Black keys */}
          <div className="black-keys absolute top-0 left-0 h-[65%]">
            {blackKeys.map((key, index) => (
              <Key
                key={`black-${key.note}${key.octave}`}
                note={key.note}
                octave={key.octave}
                selected={selectedNotes.includes(`${key.note}${key.octave}`)}
                onNoteClick={onNoteClick}
                isBlack
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piano;

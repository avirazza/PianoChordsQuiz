import React from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Check } from "lucide-react";

interface GameControlsProps {
  onPlayChord: () => void;
  onClear: () => void;
  onSubmit: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onPlayChord, onClear, onSubmit }) => {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <Button 
        onClick={onPlayChord}
        className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center shadow-md transition"
      >
        <Play className="h-5 w-5 mr-2" />
        Play Chord
      </Button>
      
      <Button 
        onClick={onClear}
        variant="outline"
        className="px-5 py-2 bg-white hover:bg-gray-100 text-neutral-dark border border-neutral-dark/30 rounded-full flex items-center shadow-sm transition"
      >
        <RotateCcw className="h-5 w-5 mr-2" />
        Clear
      </Button>
      
      <Button 
        onClick={onSubmit}
        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center shadow-md transition"
      >
        <Check className="h-5 w-5 mr-2" />
        Submit
      </Button>
    </div>
  );
};

export default GameControls;

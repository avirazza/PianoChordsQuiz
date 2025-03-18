import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChordChallengeProps {
  currentChord?: string;
  isLoading: boolean;
}

const ChordChallenge: React.FC<ChordChallengeProps> = ({ currentChord, isLoading }) => {
  return (
    <div className="bg-neutral-light rounded-lg p-4 mb-6 text-center">
      <h2 className="text-lg font-medium mb-2">Identify this chord:</h2>
      
      {isLoading ? (
        <Skeleton className="h-10 w-32 mx-auto" />
      ) : (
        <div id="current-chord" className="text-3xl font-mono font-bold py-2">
          {currentChord || "Loading..."}
        </div>
      )}
      
      <div className="mt-2 text-sm text-neutral-dark/70">
        Click the piano keys to form the chord
      </div>
    </div>
  );
};

export default ChordChallenge;

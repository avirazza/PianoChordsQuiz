import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Instructions: React.FC = () => {
  return (
    <Card className="bg-white rounded-xl shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-poppins font-semibold mb-4">How to Play</h2>
        <div className="space-y-2 text-neutral-dark/90">
          <p><span className="font-medium">1.</span> A chord name will appear above the piano.</p>
          <p><span className="font-medium">2.</span> Click the piano keys to form that chord.</p>
          <p><span className="font-medium">3.</span> Click "Play Chord" to hear what the chord should sound like.</p>
          <p><span className="font-medium">4.</span> Click "Submit" when you think you've played the correct notes.</p>
          <p><span className="font-medium">5.</span> Earn points for correct chord identification!</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Difficulty Levels:</h3>
          <ul className="list-disc list-inside space-y-1 pl-2 text-neutral-dark/90">
            <li><span className="font-medium">Beginner:</span> Major and minor triads</li>
            <li><span className="font-medium">Intermediate:</span> Includes 7th and suspended chords</li>
            <li><span className="font-medium">Advanced:</span> Augmented, diminished and extended chords</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Instructions;

import React from 'react';
import { BrainCircuit, Map, GitBranch, Terminal } from 'lucide-react';

export const ConceptSummary = () => {
  return (
    <div className="mt-8 border-t-2 border-stone-800 pt-6">
      <div className="flex items-center gap-3 mb-4">
        <Terminal className="text-stone-800" size={24} />
        <h3 className="font-pirate-title text-2xl text-stone-900">The Code Behind the Compass</h3>
      </div>
      
      <p className="font-serif text-stone-700 italic mb-6 leading-relaxed">
        This book transforms the reader into a Central Processing Unit (CPU). 
        By physically flipping pages and tracking references, children build a mental model of how computers "think" 
        before they ever touch a keyboard.
      </p>
    </div>
  );
};
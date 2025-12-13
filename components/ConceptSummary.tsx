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

      <div className="grid grid-cols-3 gap-6">
        {/* Concept 1: Memory & Pointers */}
        <div className="bg-stone-50 p-3 rounded border border-stone-200">
          <div className="flex items-center gap-2 mb-2 text-blue-800">
            <Map size={18} />
            <span className="font-bold font-mono text-xs uppercase tracking-wider">Memory & Pointers</span>
          </div>
          <p className="text-[11px] leading-snug text-stone-600 font-sans">
            <strong>The Mechanic:</strong> Jumping from "Page 1, Ref 105" to "Page 2, Ref 299".
            <br/><br/>
            <strong>The Science:</strong> This simulates <em>Memory Addresses</em>. Just like a pirate follows a clue to a specific location, computer programs use "Pointers" to find data stored in memory.
          </p>
        </div>

        {/* Concept 2: Algorithms & Flow */}
        <div className="bg-stone-50 p-3 rounded border border-stone-200">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <GitBranch size={18} />
            <span className="font-bold font-mono text-xs uppercase tracking-wider">Control Flow</span>
          </div>
          <p className="text-[11px] leading-snug text-stone-600 font-sans">
            <strong>The Mechanic:</strong> "Go East until you hit a wall, then South."
            <br/><br/>
            <strong>The Science:</strong> This is a <em>Loop</em> and a <em>Conditional Statement</em> (While/If). The reader executes an algorithm step-by-step, learning that computers follow precise instructions, not vague suggestions.
          </p>
        </div>

        {/* Concept 3: Data Structures */}
        <div className="bg-stone-50 p-3 rounded border border-stone-200">
          <div className="flex items-center gap-2 mb-2 text-emerald-800">
            <BrainCircuit size={18} />
            <span className="font-bold font-mono text-xs uppercase tracking-wider">Data Structures</span>
          </div>
          <p className="text-[11px] leading-snug text-stone-600 font-sans">
            <strong>The Mechanic:</strong> Grid coordinates (A1, B2) or a list of Gems.
            <br/><br/>
            <strong>The Science:</strong> The Map is a <em>2D Array</em>. The Reference List is a <em>Key-Value Store</em> (Dictionary). Organizing data is half the battle in Computer Science.
          </p>
        </div>
      </div>
    </div>
  );
};
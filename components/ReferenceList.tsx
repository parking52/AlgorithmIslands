import React from 'react';
import { Reference } from '../types';

interface ReferenceListProps {
  references: Reference[];
  highlightedIds?: string[];
}

export const ReferenceList: React.FC<ReferenceListProps> = ({ references, highlightedIds = [] }) => {
  // Sort references by ID so it works like a dictionary
  const sortedRefs = [...references].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="w-full mt-2 bg-white/50 p-1.5 rounded border border-stone-200 relative h-full">
      <h3 className="font-pirate-title text-lg text-center mb-2 text-stone-900 border-b-2 border-double border-stone-300 pb-0.5">
        Captain's Log
      </h3>
      
      <div className="columns-2 gap-5 text-[11px] font-pirate-text">
        {sortedRefs.map((ref) => {
          const isHighlighted = highlightedIds.includes(ref.id);
          
          return (
            <div 
              key={ref.id}
              id={`ref-${ref.id}`}
              className={`
                break-inside-avoid mb-1.5 pl-1.5 pb-0.5 border-l-2
                ${isHighlighted 
                  ? 'border-red-500 bg-yellow-50/80 print:bg-transparent print:border-black' 
                  : 'border-stone-300'}
              `}
            >
              <div className="flex items-start gap-1.5">
                <span className="font-bold font-mono text-[11px] text-stone-900 pt-0.5 min-w-[4ch]">
                  {ref.id}
                </span>
                <div className="flex-grow leading-tight text-stone-800">
                  {ref.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Reference } from '../types';
import { Scroll, Key, MapPin, Trophy, Target, FileQuestion } from 'lucide-react';

interface ReferenceListProps {
  references: Reference[];
  highlightedIds?: string[];
}

const RefIcon = ({ type }: { type: Reference['type'] }) => {
  switch (type) {
    case 'TREASURE': return <Trophy className="text-black" size={14} />;
    case 'PUZZLE': return <Key className="text-black" size={14} />;
    case 'POINTER': return <MapPin className="text-black" size={14} />;
    case 'DECOY': return <FileQuestion className="text-gray-400" size={14} />;
    default: return <Target className="text-black" size={14} />;
  }
};

export const ReferenceList: React.FC<ReferenceListProps> = ({ references, highlightedIds = [] }) => {
  // Sort references by ID so it works like a dictionary
  const sortedRefs = [...references].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="w-full mt-4">
      <h3 className="font-pirate-title text-lg text-center mb-2 border-b border-black pb-1 text-black">
        Ship's Log & Clues
      </h3>
      
      <div className="columns-2 gap-4 text-xs">
        {sortedRefs.map((ref) => {
          const isHighlighted = highlightedIds.includes(ref.id);
          
          return (
            <div 
              key={ref.id}
              id={`ref-${ref.id}`}
              className={`
                break-inside-avoid mb-3 pb-2 border-b border-dashed border-gray-300
                ${isHighlighted ? 'bg-yellow-100 print:bg-transparent print:font-bold' : ''}
              `}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-bold font-mono text-sm bg-gray-100 px-1 border border-gray-400 rounded">
                  {ref.id}
                </span>
                <span className="flex-grow font-serif leading-tight">
                  {ref.content}
                </span>
                 <div className="opacity-50 scale-75 origin-top-right">
                    <RefIcon type={ref.type} />
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

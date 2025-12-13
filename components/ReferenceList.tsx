import React from 'react';
import { Reference } from '../types';
import { Key, MapPin, Trophy, FileQuestion, ScrollText, Coins } from 'lucide-react';

interface ReferenceListProps {
  references: Reference[];
  highlightedIds?: string[];
}

const RefIcon = ({ type }: { type: Reference['type'] }) => {
  switch (type) {
    case 'TREASURE': return <Trophy className="text-amber-700" size={13} />;
    case 'PUZZLE': return <Key className="text-stone-700" size={13} />;
    case 'POINTER': return <MapPin className="text-blue-800" size={13} />;
    case 'DECOY': return <FileQuestion className="text-gray-400" size={13} />;
    case 'COIN': return <Coins className="text-yellow-600" size={13} />;
    default: return <ScrollText className="text-stone-600" size={13} />;
  }
};

export const ReferenceList: React.FC<ReferenceListProps> = ({ references, highlightedIds = [] }) => {
  // Sort references by ID so it works like a dictionary
  const sortedRefs = [...references].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="w-full mt-2 bg-white/50 p-1.5 rounded border border-stone-200 relative h-full">
      <h3 className="font-pirate-title text-lg text-center mb-2 text-stone-900 border-b-2 border-double border-stone-300 pb-0.5">
        Captain's Log
      </h3>
      
      <div className="columns-2 gap-4 text-[10px] font-pirate-text">
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
                <span className="font-bold font-mono text-[10px] text-stone-500 pt-0.5 min-w-[3ch]">
                  {ref.id}
                </span>
                <div className="flex-grow leading-tight text-stone-800">
                  {ref.content}
                </div>
                 <div className="opacity-70 scale-90 pt-0.5 flex-shrink-0">
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
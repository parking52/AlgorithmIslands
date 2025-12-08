import React from 'react';
import { MapCell, TerrainType } from '../types';
import { Trees, Mountain, Anchor, Waves, X, Tent, Coins, Box, Flame } from 'lucide-react';

interface MapGridProps {
  grid: MapCell[][];
  title: string;
  activePath?: { x: number, y: number }[]; 
  highlightedRefs?: string[]; 
}

const TerrainIcon = ({ type, className }: { type: TerrainType; className?: string }) => {
  switch (type) {
    case TerrainType.TREE: return <Trees className={`text-green-800 ${className}`} size={20} />;
    case TerrainType.ROCK: return <Mountain className={`text-gray-700 ${className}`} size={20} />;
    case TerrainType.WATER: return <Waves className={`text-blue-500 ${className}`} size={20} />;
    case TerrainType.START: return <Anchor className={`text-red-800 ${className}`} size={20} />;
    case TerrainType.X_MARK: return <X className={`text-red-600 font-bold ${className}`} size={24} />;
    case TerrainType.HOUSE: return <Tent className={`text-amber-900 ${className}`} size={20} />;
    case TerrainType.COIN: return <Coins className={`text-yellow-600 ${className}`} size={18} />;
    case TerrainType.CHEST: return <Box className={`text-amber-800 ${className}`} size={18} />;
    case TerrainType.VOLCANO: return <Flame className={`text-orange-600 ${className}`} size={20} />;
    case TerrainType.SAND: return <div className="w-1 h-1 bg-amber-300 rounded-full opacity-50" />;
    default: return null;
  }
};

const getBgColor = (type: TerrainType) => {
  switch (type) {
    case TerrainType.WATER: return 'bg-blue-100';
    case TerrainType.SAND: return 'bg-amber-50';
    case TerrainType.TREE: return 'bg-green-100';
    case TerrainType.VOLCANO: return 'bg-red-100';
    case TerrainType.COIN: return 'bg-yellow-50';
    default: return 'bg-white';
  }
};

export const MapGrid: React.FC<MapGridProps> = ({ grid, title, activePath = [], highlightedRefs = [] }) => {
  const isPath = (x: number, y: number) => {
    return activePath.some(p => p.x === x && p.y === y);
  };

  return (
    <div className="flex flex-col items-center mb-6 w-full max-w-[160mm] mx-auto border-2 border-black p-1 rounded-sm bg-white shadow-none">
      <h3 className="text-lg font-pirate-title mb-1 text-black text-center w-full border-b border-black">{title}</h3>
      
      {/* Grid Container */}
      <div className="grid grid-cols-10 gap-0 border border-black bg-white select-none relative w-full aspect-square">
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => {
              const isHighlightedRef = cell.refId && highlightedRefs.includes(cell.refId);
              const isOnPath = isPath(colIndex, rowIndex);

              return (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    relative border-[0.5px] border-gray-300 print:border-gray-400
                    flex items-center justify-center
                    ${getBgColor(cell.terrain)}
                    ${isHighlightedRef ? 'ring-2 ring-red-500 z-10' : ''}
                  `}
                >
                  <TerrainIcon type={cell.terrain} />
                  
                  {/* Path Dot overlay (Only for screen validation) */}
                  {isOnPath && (
                     <div className="absolute w-2 h-2 bg-red-500 rounded-full opacity-60 no-print" />
                  )}

                  {/* Reference ID overlay if exists */}
                  {cell.refId && (
                    <span className={`
                      absolute bottom-0 right-0 text-[7px] px-0.5 leading-none
                      ${isHighlightedRef ? 'text-red-600 font-bold' : 'text-gray-500'}
                    `}>
                      {cell.refId}
                    </span>
                  )}
                  
                  {/* Coordinates or Label */}
                  {cell.label && (
                     <span className="absolute top-0 left-0 text-[6px] text-black font-bold p-0.5 leading-none bg-white/50">
                      {cell.label}
                     </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      {/* Coordinates Helper */}
      <div className="flex justify-between w-full px-1 text-[8px] font-mono text-gray-500">
        <span>(0,0)</span>
        <span>x →</span>
      </div>
    </div>
  );
};
import React from 'react';
import { MapCell, TerrainType } from '../types';
import { 
  Trees, Mountain, Anchor, Waves, X, Tent, Coins, Box, Flame, 
  Compass, Gem, Fish, Flower, Pyramid, Hexagon, Shell, Bird
} from 'lucide-react';

interface MapGridProps {
  grid: MapCell[][];
  title: string;
  activePath?: { x: number, y: number }[]; 
  highlightedRefs?: string[]; 
}

// Deterministic variant generator based on coordinates
const getVariant = (x: number, y: number, max: number) => {
  return ((x * 7) + (y * 13) + (x * y)) % max;
};

const TerrainIcon = ({ type, x, y, className, label }: { type: TerrainType; x: number; y: number; className?: string; label?: string }) => {
  const variant = getVariant(x, y, 3);
  
  switch (type) {
    case TerrainType.TREE: 
      // Variants: Standard Tree, Palm-ish (using Flower as shrub), Dense
      if (variant === 0) return <Trees className={`text-emerald-900 ${className}`} size={22} strokeWidth={2} />;
      if (variant === 1) return <Trees className={`text-teal-800 ${className} scale-90`} size={20} strokeWidth={2.5} />;
      return <Flower className={`text-green-700 ${className}`} size={18} strokeWidth={2.5} />; // Shrub
      
    case TerrainType.ROCK: 
      // Variants: Mountain, Boulder (Hexagon), Small Rocks (Bone/Scatter)
      if (variant === 0) return <Mountain className={`text-stone-700 ${className}`} size={22} strokeWidth={2} />;
      if (variant === 1) return <Hexagon className={`text-stone-600 ${className} rotate-12`} size={18} strokeWidth={2.5} />;
      return <Pyramid className={`text-stone-500 ${className}`} size={20} strokeWidth={2} />;
      
    case TerrainType.WATER: 
      // Variants: Waves, Fish, Ripple
      if (variant === 0) return <Waves className={`text-blue-800/60 ${className}`} size={22} strokeWidth={2} />;
      if (variant === 1) return <Fish className={`text-blue-600/50 ${className}`} size={18} strokeWidth={2} />;
      return <Waves className={`text-cyan-700/40 ${className} -scale-x-100`} size={20} strokeWidth={1.5} />;

    case TerrainType.SAND:
       // Decorative sand variants
       if (variant === 0) return <Shell className="text-amber-400/60 rotate-45" size={12} />;
       if (variant === 1) return <div className="w-1.5 h-1.5 bg-amber-400/40 rounded-full" />;
       return null; // Some sand is empty

    case TerrainType.SHELL:
      // The "Target" shell, disguised as a decorative shell (same visual style)
      return <Shell className={`text-amber-400/60 rotate-45 ${className}`} size={12} />;

    case TerrainType.START: return <Anchor className={`text-red-900 ${className}`} size={22} strokeWidth={2.5} />;
    case TerrainType.X_MARK: return <X className={`text-red-700 ${className}`} size={28} strokeWidth={3} />;
    case TerrainType.HOUSE: return <Tent className={`text-amber-900 ${className}`} size={22} strokeWidth={2} />;
    case TerrainType.COIN: return <Coins className={`text-yellow-600 ${className}`} size={20} strokeWidth={2} />;
    case TerrainType.CHEST: return <Box className={`text-amber-900 ${className}`} size={20} strokeWidth={2} />;
    case TerrainType.VOLCANO: return <Flame className={`text-orange-700 ${className}`} size={22} strokeWidth={2} />;
    case TerrainType.GEM: return <Gem className={`text-purple-600 ${className}`} size={20} strokeWidth={2} />;
    case TerrainType.PARROT: return <Bird className={`text-blue-600 ${className}`} size={22} strokeWidth={2} />;
    default: return null;
  }
};

const getCellStyles = (type: TerrainType, x: number, y: number) => {
  const variant = getVariant(x, y, 4);
  
  switch (type) {
    case TerrainType.WATER: return variant === 0 ? 'bg-blue-100/40' : 'bg-blue-50/50';
    case TerrainType.TREE: return variant === 0 ? 'bg-green-100/40' : 'bg-green-50/50';
    case TerrainType.VOLCANO: return 'bg-red-50/50';
    case TerrainType.GEM: return 'bg-purple-50/30';
    case TerrainType.ROCK: return variant === 0 ? 'bg-stone-100/50' : 'bg-transparent';
    default: return 'bg-transparent';
  }
};

export const MapGrid: React.FC<MapGridProps> = ({ grid, title, activePath = [], highlightedRefs = [] }) => {
  const isPath = (x: number, y: number) => {
    return activePath.some(p => p.x === x && p.y === y);
  };

  return (
    <div className="flex flex-col items-center mb-6 w-full max-w-[160mm] mx-auto relative">
      {/* Paper texture effect */}
      <div className="absolute inset-0 bg-amber-50 opacity-100 rounded-sm shadow-sm border border-stone-300 pointer-events-none" />
      
      <div className="z-10 w-full p-2">
        <div className="flex justify-between items-end border-b-2 border-stone-800 mb-2 pb-1">
          <h3 className="text-xl font-pirate-title text-stone-900 pl-2">{title}</h3>
          {/* Compass Rose */}
          <div className="relative w-8 h-8 mr-2">
             <Compass className="text-stone-800 absolute inset-0" size={32} strokeWidth={1.5} />
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold">N</div>
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold">S</div>
             <div className="absolute top-1/2 -right-1 -translate-y-1/2 text-[8px] font-bold">E</div>
             <div className="absolute top-1/2 -left-1 -translate-y-1/2 text-[8px] font-bold">W</div>
          </div>
        </div>
        
        {/* Grid Container */}
        <div className="grid grid-cols-10 gap-0 border-2 border-stone-800 bg-amber-50/50 select-none relative w-full aspect-square shadow-inner">
          {grid.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => {
                const isHighlightedRef = cell.refId && highlightedRefs.includes(cell.refId);
                const isOnPath = isPath(colIndex, rowIndex);

                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      relative border-[0.5px] border-stone-300/50 print:border-stone-400/30
                      flex items-center justify-center
                      ${getCellStyles(cell.terrain, colIndex, rowIndex)}
                      ${isHighlightedRef ? 'ring-2 ring-red-500 z-10 bg-yellow-100/50' : ''}
                    `}
                  >
                    <TerrainIcon type={cell.terrain} x={colIndex} y={rowIndex} label={cell.label} />
                    
                    {/* Path Dot overlay (Only for screen validation) */}
                    {isOnPath && (
                       <div className="absolute w-2 h-2 bg-red-500 rounded-full opacity-60 no-print" />
                    )}

                    {/* Reference ID overlay */}
                    {cell.refId && (
                      <span className={`
                        absolute bottom-0.5 right-0.5 text-[8px] px-0.5 leading-none font-mono
                        ${isHighlightedRef ? 'text-red-700 font-bold' : 'text-stone-500'}
                      `}>
                        {cell.refId}
                      </span>
                    )}
                    
                    {/* Label */}
                    {cell.label && (
                       <span className="absolute top-0 left-0 text-[6px] text-stone-900 font-bold p-0.5 leading-none bg-white/60 backdrop-blur-[1px] rounded-br-sm border-r border-b border-stone-200">
                        {cell.label}
                       </span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { PageData } from '../types';
import { MapGrid } from './MapGrid';
import { ReferenceList } from './ReferenceList';

interface BookPageProps {
  page: PageData;
  highlightedRefIds?: string[];
}

export const BookPage: React.FC<BookPageProps> = ({ page, highlightedRefIds = [] }) => {
  // Filter refs for this page
  const pageRefs = highlightedRefIds.filter(id => id.startsWith(page.pageNumber.toString()));

  return (
    <div className="
      w-[210mm] h-[297mm] mx-auto 
      bg-white 
      p-[15mm] 
      shadow-lg my-8 
      print:shadow-none print:my-0 print:border-none
      relative overflow-hidden
      flex flex-col
      page-break
    ">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
        <h2 className="font-pirate-title text-2xl">{page.title}</h2>
        <div className="font-mono text-xl font-bold">Page {page.pageNumber}</div>
      </div>

      {/* Map Section - Only if grid exists */}
      {page.grid && (
        <div className="flex-shrink-0">
          <MapGrid 
            grid={page.grid} 
            title="Map" 
            highlightedRefs={pageRefs}
          />
        </div>
      )}
      
      {/* Reference Section */}
      <div className="flex-grow overflow-hidden">
        <ReferenceList 
          references={page.references} 
          highlightedIds={pageRefs}
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-gray-400 font-mono">
        Algorithm Treasure Hunt • Page {page.pageNumber}
      </div>
    </div>
  );
};

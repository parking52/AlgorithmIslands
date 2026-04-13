import React from 'react';
import { useBook } from '../../contexts';
import { BookContent } from './BookContent';
import { HuntControls } from './HuntControls';
import { PreviewControls } from './PreviewControls';

export const BookViewer: React.FC = () => {
  const { isPreviewMode } = useBook();

  return (
    <>
      {/* =====================================================================================
          SCREEN LAYOUT
         ===================================================================================== */}
      <div className={`
        min-h-screen bg-gray-200 text-gray-800 font-sans
        print:hidden
        ${isPreviewMode ? 'block' : 'flex flex-col md:flex-row'}
      `}>

        {/* LEFT SIDEBAR: Controls (Hidden in Preview) */}
        {!isPreviewMode && <HuntControls />}

        {/* Floating Exit Preview Button */}
        {isPreviewMode && <PreviewControls />}

        {/* Content Viewer (Interactive with Scroll) */}
        <div className={`
          bg-gray-200 flex flex-col items-center
          ${isPreviewMode
             ? 'w-full p-8 h-auto overflow-visible'
             : 'flex-grow h-screen overflow-y-auto p-8'
          }
        `}>
          <BookContent idPrefix="page-screen" />
        </div>
      </div>

      {/* =====================================================================================
          PRINT CONTENT SOURCE (Hidden always, accessed via DOM by handleExportPDF)
         ===================================================================================== */}
      <div id="printable-content" className="hidden">
        <BookContent idPrefix="page-print" />
      </div>
    </>
  );
};
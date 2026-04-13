import React from 'react';
import { useBook } from '../../contexts';
import { FileDown, EyeOff } from 'lucide-react';

export const PreviewControls: React.FC = () => {
  const { handleExportPDF, setIsPreviewMode } = useBook();

  const exitPreview = () => {
    setIsPreviewMode(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={handleExportPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700"
      >
        <FileDown size={18} /> Export PDF
      </button>
      <button
        onClick={exitPreview}
        className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800"
      >
        <EyeOff size={18} /> Exit Preview
      </button>
    </div>
  );
};
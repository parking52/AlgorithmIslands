import React from 'react';
import { useBook, useHunt } from '../../contexts';
import { BookOpen, PlayCircle, Map, ArrowRight, FileDown, Eye } from 'lucide-react';

export const HuntControls: React.FC = () => {
  const { bookData, handleExportPDF, setIsPreviewMode } = useBook();
  const { activeHunt, currentStepIndex, startHuntSimulation, nextStep, prevStep } = useHunt();

  const togglePreview = () => {
    setIsPreviewMode(true);
  };

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-300 flex-shrink-0 h-screen overflow-y-auto sticky top-0 z-50 shadow-xl">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="font-bold text-black leading-tight text-lg">Editor Mode</h1>
            <p className="text-xs text-gray-500">v1.4 Pop-out Engine</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={handleExportPDF} className="col-span-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-bold shadow-sm text-sm">
            <FileDown size={18} /> Export PDF
          </button>
          <button onClick={togglePreview} className="col-span-2 bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 font-bold shadow-sm text-xs">
            <Eye size={18} /> Toggle Preview Mode
          </button>
        </div>

        <div className="text-xs text-gray-500 bg-white p-3 border rounded">
          <strong>How to Save as PDF:</strong>
          <p className="mt-1">
            Clicking "Export PDF" opens a clean print view.
            In the dialog that appears, select <strong>"Save as PDF"</strong> as the destination.
          </p>
        </div>
      </div>

      {/* Validator Panel */}
      <div className="p-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Test Scenarios</h2>
        <div className="space-y-3">
          {bookData.hunts.map((hunt) => {
            const isActive = activeHunt?.id === hunt.id;
            return (
              <div key={hunt.id} className={`border rounded-lg p-3 transition-colors ${isActive ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-gray-900">{hunt.name}</h3>
                </div>

                {!isActive ? (
                  <button
                    onClick={() => startHuntSimulation(hunt)}
                    className="w-full flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-700 py-1.5 rounded text-xs font-bold hover:bg-gray-50"
                  >
                    <PlayCircle size={14} /> Start Simulation
                  </button>
                ) : (
                  <div className="bg-white rounded border border-yellow-200 p-2 shadow-sm">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                      <span className="text-xs font-bold text-amber-800">Step {currentStepIndex + 1} / {hunt.solutionPath.length}</span>
                      <div className="flex gap-1">
                        <button onClick={prevStep} disabled={currentStepIndex <= 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><Map size={14} className="rotate-180" /></button>
                        <button onClick={nextStep} disabled={currentStepIndex >= hunt.solutionPath.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><Map size={14} /></button>
                      </div>
                    </div>

                    <div className="text-xs space-y-2">
                      <div className="flex gap-2 items-start">
                         <div className="min-w-[40px] font-mono font-bold bg-gray-800 text-white text-center rounded px-1 py-0.5">
                           {hunt.solutionPath[currentStepIndex].refId}
                         </div>
                         <div className="text-gray-700 leading-tight">
                           {hunt.solutionPath[currentStepIndex].description}
                         </div>
                      </div>

                      {currentStepIndex < hunt.solutionPath.length - 1 && (
                         <div className="flex justify-center text-gray-300 my-1">
                           <ArrowRight size={14} className="rotate-90" />
                         </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { STATIC_BOOK } from './data/staticBook';
import { TreasureHunt } from './types';
import { BookPage } from './components/BookPage';
import { Printer, BookOpen, PlayCircle, Map, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const bookData = STATIC_BOOK;
  
  // Simulation State
  const [activeHunt, setActiveHunt] = useState<TreasureHunt | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePrint = () => {
    // Attempt standard print
    window.print();
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const startHuntSimulation = (hunt: TreasureHunt) => {
    setActiveHunt(hunt);
    setCurrentStepIndex(0); 
  };

  const nextStep = () => {
    if (activeHunt && currentStepIndex < activeHunt.solutionPath.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      
      const step = activeHunt.solutionPath[nextIndex];
      const el = document.getElementById(`page-${step.expectedPage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  // Get all ref IDs up to current step for highlighting
  const activeRefIds = activeHunt && currentStepIndex >= 0
    ? activeHunt.solutionPath.slice(0, currentStepIndex + 1).map(step => step.refId)
    : [];

  return (
    <div className={`min-h-screen bg-gray-200 text-gray-800 font-sans print:bg-white flex flex-col md:flex-row ${isPreviewMode ? 'justify-center' : ''}`}>
      
      {/* LEFT SIDEBAR: Controls & Validator (Hidden on Print OR Preview Mode) */}
      {!isPreviewMode && (
        <div className="w-full md:w-80 bg-white border-r border-gray-300 flex-shrink-0 h-screen overflow-y-auto sticky top-0 no-print z-50 shadow-xl">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
             <div className="flex items-center gap-3 mb-6">
              <div className="bg-black p-2 rounded text-white">
                <BookOpen size={24} />
              </div>
              <div>
                <h1 className="font-bold text-black leading-tight text-lg">Editor Mode</h1>
                <p className="text-xs text-gray-500">v1.1 Static Build</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={handlePrint} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex flex-col items-center justify-center gap-1 font-bold shadow-sm text-xs">
                <Printer size={18} /> Print
              </button>
              <button onClick={togglePreview} className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-800 flex flex-col items-center justify-center gap-1 font-bold shadow-sm text-xs">
                <Eye size={18} /> Preview
              </button>
            </div>
            
            <div className="text-xs text-gray-500 bg-white p-3 border rounded">
              <strong>Printing Issue?</strong>
              <p className="mt-1">If the Print button does nothing, use <strong>Preview Mode</strong> and try your browser's print option (Ctrl+P / Cmd+P).</p>
            </div>
          </div>

          {/* Validator / Simulator Panel */}
          <div className="p-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Test Scenarios</h2>
            
            <div className="space-y-3">
              {bookData.hunts.map((hunt) => {
                const isActive = activeHunt?.id === hunt.id;
                return (
                  <div key={hunt.id} className={`border rounded-lg p-3 transition-colors ${isActive ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm text-gray-900">{hunt.name}</h3>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full border">{hunt.difficulty}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{hunt.description}</p>
                    
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
                        
                        {/* Step Description */}
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

                        {currentStepIndex === hunt.solutionPath.length - 1 && (
                          <div className="mt-2 flex items-center gap-1 text-green-700 text-xs font-bold bg-green-50 p-2 rounded justify-center border border-green-200">
                            <CheckCircle2 size={14} />
                            Hunt Completed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Exit Preview Button */}
      {isPreviewMode && (
        <button 
          onClick={togglePreview}
          className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 hover:bg-black no-print"
        >
          <EyeOff size={18} /> Exit Preview
        </button>
      )}

      {/* RIGHT CONTENT: Book Pages */}
      <div className={`flex-grow bg-gray-200 overflow-y-auto h-screen p-8 print:p-0 print:h-auto print:overflow-visible flex flex-col items-center ${isPreviewMode ? 'w-full' : ''}`}>
        
        {/* Intro Page */}
        <div className="w-[210mm] h-[297mm] mx-auto bg-white p-[20mm] shadow-lg print:shadow-none print:w-full page-break border border-gray-200 flex flex-col justify-center text-center">
            <h1 className="text-6xl font-pirate-title text-black mb-8 leading-tight">{bookData.title}</h1>
            <p className="text-2xl font-serif italic text-gray-600 mb-12">{bookData.intro}</p>
            
            <div className="max-w-md mx-auto text-left border-t-2 border-b-2 border-black py-8">
              <h2 className="font-bold text-xl mb-4 font-sans uppercase tracking-widest text-center">Table of Contents</h2>
              <div className="space-y-4">
                {bookData.hunts.map((h, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <span className="font-pirate-title text-lg">{h.name}</span>
                    <span className="border-b border-dotted border-gray-400 flex-grow mx-2"></span>
                    <span className="font-mono text-sm">Start: {h.startRefId}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto text-sm text-gray-400">First Edition • Printed by React</div>
        </div>

        {/* Dynamic Pages from Static Data */}
        {bookData.pages.map((page) => (
          <div id={`page-${page.pageNumber}`} key={page.pageNumber}>
            <BookPage 
              page={page} 
              highlightedRefIds={activeRefIds} 
            />
          </div>
        ))}
        
      </div>
    </div>
  );
}

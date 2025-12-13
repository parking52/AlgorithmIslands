import React, { useState } from 'react';
import { STATIC_BOOK } from './data/staticBook';
import { TreasureHunt } from './types';
import { BookPage } from './components/BookPage';
import { ConceptSummary } from './components/ConceptSummary';
import { BookOpen, PlayCircle, Map, ArrowRight, Eye, EyeOff, FileDown, Compass, BrainCircuit, Lightbulb } from 'lucide-react';

export default function App() {
  const bookData = STATIC_BOOK;
  
  // Simulation State
  const [activeHunt, setActiveHunt] = useState<TreasureHunt | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Helper to find page number for a ref
  const getPageForRef = (refId: string) => {
    const page = bookData.pages.find(p => p.references.some(r => r.id === refId));
    return page ? page.pageNumber : '?';
  };

  // --- NEW ROBUST PRINT HANDLER ---
  const handleExportPDF = () => {
    // 1. Get the hidden print content
    const printContent = document.getElementById('printable-content');
    if (!printContent) return;

    // 2. Open a clean window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export the PDF.');
      return;
    }

    // 3. Construct a clean HTML document for the book
    // We explicitly include the Tailwind CDN and fonts to ensure the new window looks identical.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${bookData.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+DW+Pica:ital@0;1&family=Lato:wght@400;700&display=swap');
            
            body { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
              margin: 0; 
              padding: 0;
              background: white;
            }

            .font-pirate-title { font-family: 'Cinzel Decorative', cursive; }
            .font-pirate-text { font-family: 'IM Fell DW Pica', serif; }
            
            /* Explicit Page Break Handling */
            .page-break { 
              page-break-after: always; 
              break-after: page;
              min-height: 100vh;
              width: 100%;
              display: block;
            }

            /* Hide URL headers/footers if browser allows (Chrome/Edge) */
            @page { 
              margin: 0; 
              size: auto; 
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            // Wait a moment for fonts and styles to load before triggering print
            setTimeout(() => {
              window.print();
              // Optional: window.close(); 
            }, 1000);
          </script>
        </body>
      </html>
    `;

    // 4. Write and trigger
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const startHuntSimulation = (hunt: TreasureHunt) => {
    setActiveHunt(hunt);
    setCurrentStepIndex(0); 
    
    // Automatically scroll to the starting page of the hunt
    if (hunt.solutionPath.length > 0) {
      const startPage = hunt.solutionPath[0].expectedPage;
      setTimeout(() => {
        const el = document.getElementById(`page-screen-${startPage}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const nextStep = () => {
    if (activeHunt && currentStepIndex < activeHunt.solutionPath.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      
      const step = activeHunt.solutionPath[nextIndex];
      // Only scroll in screen mode
      const el = document.getElementById(`page-screen-${step.expectedPage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (activeHunt && currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);

      const step = activeHunt.solutionPath[prevIndex];
      const el = document.getElementById(`page-screen-${step.expectedPage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Get all ref IDs up to current step for highlighting
  const activeRefIds = activeHunt && currentStepIndex >= 0
    ? activeHunt.solutionPath.slice(0, currentStepIndex + 1).map(step => step.refId)
    : [];

  // --- RENDER CONTENT HELPER ---
  const BookContent = ({ idPrefix }: { idPrefix: string }) => (
    <>
      {/* PAGE I: Intro / Title Page */}
      <div className="w-[210mm] h-[297mm] mx-auto bg-white p-[20mm] shadow-lg print:shadow-none print:w-full page-break border border-gray-200 flex flex-col justify-center items-center text-center mb-8 print:mb-0 print:border-none relative overflow-hidden flex-shrink-0">
          {/* Decorative Corner Borders */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-black" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-black" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-black" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-black" />

          <div className="mb-12 text-stone-800 scale-150">
             <Compass size={120} strokeWidth={1} />
          </div>

          <h1 className="text-6xl font-pirate-title text-black mb-8 leading-tight max-w-lg">{bookData.title}</h1>
          
          <div className="w-24 h-1 bg-stone-300 mb-8" />
          
          <p className="text-xl font-serif text-stone-700 mb-8 max-w-xl leading-relaxed">
            This book is not just a collection of puzzles; it is a computer science course disguised as a pirate adventure. 
            Each treasure hunt is carefully designed to teach a fundamental algorithm or programming concept with only paper and a pencil.
          </p>

          <div className="mt-20 text-center w-full px-12">
            <h2 className="font-pirate-title text-5xl text-stone-900 mb-6">How to Play</h2>
            <div className="text-3xl font-pirate-text text-stone-800 leading-snug mx-auto max-w-2xl">
              {bookData.intro}
            </div>
          </div>
          
          <div className="mt-auto text-sm text-gray-400 font-mono">First Edition • Printed by React</div>
      </div>

      {/* PAGE II: Merged Table of Contents & Curriculum */}
      <div className="w-[210mm] h-[297mm] mx-auto bg-white p-[15mm] shadow-lg print:shadow-none print:w-full page-break border border-gray-200 flex flex-col mb-8 print:mb-0 print:border-none flex-shrink-0">
          <div className="text-center border-b-2 border-stone-800 pb-4 mb-4">
            <h2 className="font-pirate-title text-4xl text-stone-900">Captain's Log & Curriculum</h2>
            <p className="text-stone-500 font-serif italic text-sm mt-1">Map your course, learn the code, find the gold.</p>
          </div>

          <div className="flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-800 text-stone-800">
                  <th className="py-2 px-2 font-pirate-title w-[45%]">Adventure</th>
                  <th className="py-2 px-2 font-mono font-bold text-center w-[15%]">Start</th>
                  <th className="py-2 px-2 font-bold font-mono w-[40%]">Pedagogical Goal</th>
                </tr>
              </thead>
              <tbody>
                {bookData.hunts.map((h, i) => (
                  <tr key={i} className="border-b border-stone-200">
                    <td className="py-3 px-2 align-top">
                      <div className="flex items-baseline gap-2">
                         <span className="font-bold font-mono text-stone-400 text-xs">#{i+1}</span>
                         <span className="font-bold text-stone-900 text-lg leading-tight">{h.name.split('. ')[1]}</span>
                      </div>
                      <div className="text-stone-500 font-serif italic text-sm mt-1 pl-6 leading-tight">
                        "{h.description}"
                      </div>
                    </td>
                    
                    <td className="py-3 px-2 align-top text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono font-bold text-lg text-stone-900 leading-none">
                          {h.startRefId}
                        </span>
                        <span className="text-[10px] text-stone-500 font-bold uppercase mt-1">
                          Page {getPageForRef(h.startRefId)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-2 align-top">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                           <BrainCircuit size={14} />
                           <span className="uppercase tracking-wide">{h.topic}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-stone-600 text-xs leading-snug">
                           <Lightbulb size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
                           {h.concept}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <ConceptSummary />

      </div>

      {/* Dynamic Pages (Maps) */}
      {bookData.pages.map((page) => (
        <div id={`${idPrefix}-${page.pageNumber}`} key={page.pageNumber} className="print:block print:w-full flex-shrink-0">
          <BookPage 
            page={page} 
            highlightedRefIds={activeRefIds} 
          />
        </div>
      ))}
    </>
  );

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
        {!isPreviewMode && (
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
        )}

        {/* Floating Exit Preview Button */}
        {isPreviewMode && (
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button 
              onClick={handleExportPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FileDown size={18} /> Export PDF
            </button>
            <button 
              onClick={togglePreview}
              className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800"
            >
              <EyeOff size={18} /> Exit Preview
            </button>
          </div>
        )}

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
}
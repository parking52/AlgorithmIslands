import React from 'react';
import { BookPage } from '../BookPage';
import { ConceptSummary } from '../ConceptSummary';
import { useBook, useHunt } from '../../contexts';
import { Compass, BrainCircuit, Lightbulb } from 'lucide-react';

interface BookContentProps {
  idPrefix: string;
}

export const BookContent: React.FC<BookContentProps> = ({ idPrefix }) => {
  const { bookData, getPageForRef } = useBook();
  const { activeRefIds } = useHunt();

  return (
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
};
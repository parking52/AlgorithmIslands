import React from 'react';
import { BookData, TreasureHunt } from '../../types';
import { getHuntMetrics, getHuntSolutionPath } from '../../domain/huntEngine';

const chunk = <T,>(items: T[], size: number): T[][] => {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
};

const HuntAnswer: React.FC<{ hunt: TreasureHunt }> = ({ hunt }) => {
  const path = getHuntSolutionPath(hunt);
  const metrics = getHuntMetrics(hunt);
  return (
    <article className="break-inside-avoid border-b border-stone-300 pb-4 mb-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-bold text-xl">{hunt.name}</h3>
        <span className="font-mono text-sm">{hunt.program.mechanic}</span>
      </div>
      <p className="font-pirate-text text-base mt-1">{hunt.concept}</p>
      <p className="font-mono text-xs mt-1">
        {metrics.steps} steps • {metrics.pageFlips} page flips • {metrics.uniquePages} pages
      </p>
      <ol className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        {path.map((step, index) => (
          <li key={step.sourceId ?? `${hunt.id}-${index}`} className="text-sm">
            <span className="font-mono font-bold">{index + 1}. {step.refId}</span>
            <span className="ml-2">{step.description}</span>
          </li>
        ))}
      </ol>
    </article>
  );
};

export const AnswerGuide: React.FC<{ book: BookData }> = ({ book }) => (
  <>
    {chunk(book.hunts, 4).map((hunts, pageIndex) => (
      <section className="book-sheet answer-sheet" key={pageIndex}>
        <div className="border-b-2 border-stone-800 pb-3 mb-6">
          <h2 className="font-pirate-title text-4xl">Cartographer’s Answer Guide</h2>
          <p className="font-pirate-text text-lg">
            Adult/editor edition • Program-derived paths, not child-facing clue text.
          </p>
        </div>
        {hunts.map(hunt => <HuntAnswer hunt={hunt} key={hunt.id} />)}
        <div className="book-footer">Answer Guide • {pageIndex + 1}</div>
      </section>
    ))}
  </>
);

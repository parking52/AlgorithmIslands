import React from 'react';
import { BookNight, TreasureHunt } from '../../types';

interface NightChapterPageProps {
  night: BookNight;
  hunts: TreasureHunt[];
}

export const NightChapterPage: React.FC<NightChapterPageProps> = ({ night, hunts }) => (
  <section className="book-sheet night-sheet">
    <div className="night-number">Night {night.number}</div>
    <h2 className="font-pirate-title text-5xl text-center mt-4 mb-2">{night.title}</h2>
    <p className="font-pirate-text text-center text-xl italic mb-8">
      Morrow’s trick: “{night.law}”
    </p>

    <div className="border-y-2 border-stone-800 py-8 my-4">
      <h3 className="font-pirate-title text-2xl mb-3">Tonight’s dream</h3>
      <p className="font-pirate-text text-xl leading-relaxed">{night.duskLetter}</p>
    </div>

    <div className="grid grid-cols-2 gap-8 mt-7">
      <div>
        <h3 className="font-pirate-title text-xl mb-3">Choose your voyage</h3>
        <ol className="space-y-3">
          {hunts.map(hunt => (
            <li key={hunt.id} className="border-l-4 border-stone-800 pl-3">
              <div className="font-bold text-lg">{hunt.name}</div>
              <div className="font-mono text-sm">Begin at Ref {hunt.startRefId}</div>
              <div className="font-pirate-text text-base">{hunt.description}</div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="font-pirate-title text-xl mb-3">Your mission</h3>
        <p className="font-pirate-text text-lg leading-relaxed">{night.dreamChallenge}</p>
        <div className="mt-6">
          <h4 className="font-bold uppercase tracking-wide text-sm mb-2">Pencil check</h4>
          <div className="space-y-3 font-pirate-text text-lg">
            <p>□ I found the starting reference.</p>
            <p>□ I marked each clue after using it.</p>
            <p>□ I can tell Morrow how I found the treasure.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-auto border-2 border-stone-800 p-5">
      <div className="flex items-center gap-5">
        <div className="sigil-box" aria-label={`Night sigil ${night.sigil}`}>{night.sigil}</div>
        <div>
          <h3 className="font-pirate-title text-xl">Dawn log</h3>
          <p className="font-pirate-text text-lg">{night.dawnQuestion}</p>
          <div className="answer-lines mt-3" />
        </div>
      </div>
    </div>

    <div className="book-footer">The Pirate Archipelalgo • Night {night.number}</div>
  </section>
);

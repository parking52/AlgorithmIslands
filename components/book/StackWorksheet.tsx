import React from 'react';

interface StackWorksheetProps {
  title: string;
  instructions: string;
  slots: number;
}

export const StackWorksheet: React.FC<StackWorksheetProps> = ({
  title,
  instructions,
  slots,
}) => (
  <section className="stack-worksheet">
    <div className="stack-story">
      <h3 className="font-pirate-title text-2xl mb-3">{title}</h3>
      <p className="font-pirate-text text-lg leading-relaxed">{instructions}</p>

      <div className="mt-5 grid grid-cols-2 gap-4 text-base">
        <div className="border-2 border-stone-800 p-3">
          <div className="font-bold">GOING DEEPER?</div>
          <p className="font-pirate-text">PUSH: write the promised way back in the next empty box.</p>
        </div>
        <div className="border-2 border-stone-800 p-3">
          <div className="font-bold">COMING HOME?</div>
          <p className="font-pirate-text">POP: cross out the highest filled box and follow its number.</p>
        </div>
      </div>
    </div>

    <div className="stack-tower" aria-label="Return-address stack">
      <div className="stack-top-arrow">← TOP</div>
      {Array.from({ length: slots }, (_, reverseIndex) => {
        const boxNumber = slots - reverseIndex;
        return (
          <div className="stack-slot" key={boxNumber}>
            <span>Box {boxNumber}</span>
          </div>
        );
      })}
      <div className="stack-bottom">BOTTOM</div>
    </div>
  </section>
);


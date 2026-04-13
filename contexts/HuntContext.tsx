import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TreasureHunt } from '../types';

interface HuntContextType {
  activeHunt: TreasureHunt | null;
  currentStepIndex: number;
  activeRefIds: string[];
  startHuntSimulation: (hunt: TreasureHunt) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const HuntContext = createContext<HuntContextType | undefined>(undefined);

export const useHunt = () => {
  const context = useContext(HuntContext);
  if (!context) {
    throw new Error('useHunt must be used within a HuntProvider');
  }
  return context;
};

interface HuntProviderProps {
  children: ReactNode;
}

export const HuntProvider: React.FC<HuntProviderProps> = ({ children }) => {
  const [activeHunt, setActiveHunt] = useState<TreasureHunt | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);

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

  const value: HuntContextType = {
    activeHunt,
    currentStepIndex,
    activeRefIds,
    startHuntSimulation,
    nextStep,
    prevStep,
  };

  return (
    <HuntContext.Provider value={value}>
      {children}
    </HuntContext.Provider>
  );
};
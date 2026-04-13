import React, { ReactNode } from 'react';
import { BookProvider } from './BookContext';
import { HuntProvider } from './HuntContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BookProvider>
      <HuntProvider>
        {children}
      </HuntProvider>
    </BookProvider>
  );
};
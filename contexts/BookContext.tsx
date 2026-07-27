import React, { createContext, useContext, useState, ReactNode } from 'react';
import { STATIC_BOOK } from '../data/staticBook';
import { BookData, ValidationResult } from '../types';
import { validateBookStructure } from '../utils/bookStructure';

interface BookContextType {
  bookData: BookData;
  isPreviewMode: boolean;
  setIsPreviewMode: (mode: boolean) => void;
  getPageForRef: (refId: string) => string;
  handleExportPDF: (edition?: 'child' | 'adult') => void;
  validateBook: () => ValidationResult;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const bookData = STATIC_BOOK;
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Helper to find page number for a ref
  const getPageForRef = (refId: string) => {
    const page = bookData.pages.find(p => p.references.some(r => r.id === refId));
    return page ? page.pageNumber.toString() : '?';
  };

  // PDF export functionality with validation
  const handleExportPDF = (edition: 'child' | 'adult' = 'child') => {
    // Run validation first
    const validation = validateBookStructure(bookData);
    if (!validation.isValid) {
      const errorMessages = validation.errors
        .filter(e => e.type === 'ERROR')
        .map(e => e.message)
        .join('\n');
      alert(`Cannot export PDF due to validation errors:\n\n${errorMessages}`);
      return;
    }

    // Show warnings if any
    const warnings = validation.errors.filter(e => e.type === 'WARNING');
    if (warnings.length > 0) {
      const warningMessages = warnings.map(e => e.message).join('\n');
      if (!confirm(`PDF export warnings:\n\n${warningMessages}\n\nContinue with export?`)) {
        return;
      }
    }

    document.documentElement.dataset.printEdition = edition;
    const clearEdition = () => {
      delete document.documentElement.dataset.printEdition;
      window.removeEventListener('afterprint', clearEdition);
    };
    window.addEventListener('afterprint', clearEdition);
    window.print();
  };

  const value: BookContextType = {
    bookData,
    isPreviewMode,
    setIsPreviewMode,
    getPageForRef,
    handleExportPDF,
    validateBook: () => validateBookStructure(bookData),
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { STATIC_BOOK } from '../data/staticBook';
import { BookData, TreasureHunt } from '../types';
import { validateBookStructure, ValidationResult } from '../utils/bookStructure';

interface BookContextType {
  bookData: BookData;
  isPreviewMode: boolean;
  setIsPreviewMode: (mode: boolean) => void;
  getPageForRef: (refId: string) => string;
  handleExportPDF: () => void;
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
  const handleExportPDF = () => {
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
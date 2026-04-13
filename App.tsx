import React from 'react';
import { AppProviders } from './contexts/AppProviders';
import { BookViewer } from './components/book/BookViewer';

export default function App() {
  return (
    <AppProviders>
      <BookViewer />
    </AppProviders>
  );
}
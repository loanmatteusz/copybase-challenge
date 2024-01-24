import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import App from './App.tsx';

import './index.css';
import { ErrorBoundary } from 'react-error-boundary';
import { Boundery } from './pages/error/Boundery.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <ErrorBoundary fallback={<Boundery />}>
        <App />
      </ErrorBoundary>
    </MantineProvider>
  </React.StrictMode>
);

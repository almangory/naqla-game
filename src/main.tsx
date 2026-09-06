import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Global error handlers to intercept and recover from chunk loading errors on mobile
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = String(event?.message || '');
    if (msg.includes('Loading chunk') || msg.includes('Failed to fetch dynamically imported module')) {
      console.warn('[Global] Intercepted chunk error, refreshing...');
      window.location.reload();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = String(event?.reason?.message || event?.reason || '');
    if (reason.includes('Loading chunk') || reason.includes('Failed to fetch dynamically imported module')) {
      console.warn('[Global] Intercepted chunk unhandled rejection, refreshing...');
      window.location.reload();
    }
  });
}

// Register Service Worker for PWA installability with update handling
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version ready.');
            }
          });
        }
      });
    }).catch((err) => {
      console.log('SW registration error:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

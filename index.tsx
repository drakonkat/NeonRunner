import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PostHogProvider } from 'posthog-js/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Configurazione PostHog tramite variabili d'ambiente.
// In un progetto Vite, le variabili devono iniziare con VITE_
const posthogKey = (import.meta as any).env?.VITE_POSTHOG_KEY;
const posthogHost = (import.meta as any).env?.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

const options = {
  api_host: posthogHost,
  // Manteniamo le impostazioni esistenti se necessarie
  defaults: '2025-05-24',
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PostHogProvider 
      apiKey={posthogKey} 
      options={options}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
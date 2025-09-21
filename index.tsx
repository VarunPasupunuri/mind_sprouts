
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Corrected import path for App component.
import App from './App';
// FIX: Corrected import path for constants.
import { LOGO_URL } from './constants';

// Set favicon
const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
if (favicon) {
  favicon.href = LOGO_URL;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

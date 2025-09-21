
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Set favicon
const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
if (favicon) {
  favicon.href = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cdefs%3E%3CradialGradient id='rad-grad' cx='30%25' cy='30%25' r='80%25'%3E%3Cstop offset='0%25' stop-color='%23a7f3d0' /%3E%3Cstop offset='100%25' stop-color='%23059669' /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='128' cy='128' r='128' fill='url(%23rad-grad)'/%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='14' d='M128,192 V80 M104,112 C104,96 112,88 128,80 M152,112 C152,96 144,88 128,80'/%3E%3C/svg%3E`;
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
import { Buffer } from 'buffer';
import process from 'process';

if (typeof global === 'undefined') {
  window.global = window;
}

window.Buffer = Buffer;
window.process = process;


import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
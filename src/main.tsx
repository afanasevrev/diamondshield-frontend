import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import process from 'process/browser';
import { App } from './app/App';
import './styles/globals.css';

if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

globalThis.Buffer = Buffer;
globalThis.process = process;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
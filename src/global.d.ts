declare global {
  var global: typeof globalThis;
}

import process from 'process';
import { Buffer } from 'buffer';

declare global {
  interface Window {
    process: typeof process;
    Buffer: typeof Buffer;
    global: Window;
  }
}

export {};
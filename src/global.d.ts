declare global {
  var global: typeof globalThis;
  var Buffer: typeof import('buffer').Buffer;
  var process: typeof import('process');
}

export {};
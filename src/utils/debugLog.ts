const DEBUG_ENABLED =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true';

// Change log spam on browser console, only debug mode outputs now.
export function debugLog(...values: unknown[]): void {
  if (DEBUG_ENABLED) {
    console.log(...values);
  }
}

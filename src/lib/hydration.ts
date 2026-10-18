'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Safe hydration hook using React's official useSyncExternalStore.
 * - During SSR: returns false
 * - During client hydration pass: returns false (exact match with server HTML)
 * - Immediately after hydration commits: returns true (clean React store transition, zero error)
 * - During subsequent client-side navigations (SPA): returns true on frame 0 (instant load)
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

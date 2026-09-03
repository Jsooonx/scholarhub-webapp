'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addShortlistApi, fetchShortlist, removeShortlistApi, signOutApi } from '@/lib/client-api';

interface ShortlistContextValue {
  authenticated: boolean;
  ready: boolean;
  email: string | null;
  slugs: Set<string>;
  isPending: boolean;
  refresh: () => Promise<void>;
  toggle: (slug: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const [isPending, setIsPending] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Read current path client-side only
  useEffect(() => {
    setCurrentPath(window.location.pathname + window.location.search);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchShortlist();
      setAuthenticated(result.authenticated);
      setEmail(result.email ?? null);
      setSlugs(new Set(result.slugs));
    } catch (error) {
      console.error('Failed to load shortlist slugs:', error);
      setAuthenticated(false);
      setEmail(null);
      setSlugs(new Set());
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (slug: string) => {
      if (!authenticated) {
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return;
      }

      setIsPending(true);
      const wasSaved = slugs.has(slug);
      const nextSlugs = new Set(slugs);
      if (wasSaved) {
        nextSlugs.delete(slug);
      } else {
        nextSlugs.add(slug);
      }
      setSlugs(nextSlugs);

      try {
        const result = wasSaved ? await removeShortlistApi(slug) : await addShortlistApi(slug);

        if (!result.ok) {
          setSlugs(slugs);
          if (result.status === 401) {
            setAuthenticated(false);
            router.push(`/login?next=${encodeURIComponent(currentPath)}`);
          }
        } else {
          router.refresh();
        }
      } catch {
        setSlugs(slugs);
      } finally {
        setIsPending(false);
      }
    },
    [authenticated, currentPath, router, slugs]
  );

  const signOut = useCallback(async () => {
    const result = await signOutApi();
    if (result.ok) {
      setAuthenticated(false);
      setEmail(null);
      setSlugs(new Set());
      router.refresh();
    }
  }, [router]);

  const value = useMemo<ShortlistContextValue>(
    () => ({
      authenticated,
      ready,
      email,
      slugs,
      isPending,
      refresh,
      toggle,
      signOut,
    }),
    [authenticated, email, isPending, ready, refresh, signOut, slugs, toggle]
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error('useShortlist must be used within ShortlistProvider.');
  }
  return context;
}

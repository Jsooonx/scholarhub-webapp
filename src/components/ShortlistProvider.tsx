'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { addShortlistApi, fetchShortlist, removeShortlistApi, signOutApi } from '@/lib/client-api';

interface ShortlistContextValue {
  authenticated: boolean;
  ready: boolean;
  email: string | null;
  slugs: Set<string>;
  isPending: boolean;
  pendingSlugs: Set<string>;
  isSlugPending: (slug: string) => boolean;
  refresh: () => Promise<void>;
  toggle: (slug: string) => Promise<void>;
  remove: (slug: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const [pendingSlugs, setPendingSlugs] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState('');

  // Keep current path updated on navigation
  useEffect(() => {
    setCurrentPath(window.location.pathname + window.location.search);
  }, [pathname]);

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

      setPendingSlugs((prev) => new Set(prev).add(slug));
      const wasSaved = slugs.has(slug);
      const nextSlugs = new Set(slugs);
      if (wasSaved) {
        nextSlugs.delete(slug);
      } else {
        nextSlugs.add(slug);
      }
      // Instant optimistic UI update (0ms perceived latency)
      setSlugs(nextSlugs);

      try {
        const result = wasSaved ? await removeShortlistApi(slug) : await addShortlistApi(slug);

        if (!result.ok) {
          // Revert optimistic update on failure
          setSlugs(slugs);
          if (result.status === 401) {
            setAuthenticated(false);
            router.push(`/login?next=${encodeURIComponent(currentPath)}`);
          }
        }
      } catch {
        // Revert optimistic update on network error
        setSlugs(slugs);
      } finally {
        setPendingSlugs((prev) => {
          const next = new Set(prev);
          next.delete(slug);
          return next;
        });
      }
    },
    [authenticated, currentPath, router, slugs]
  );

  const remove = useCallback(
    async (slug: string): Promise<boolean> => {
      if (!slug) return false;
      const wasSaved = slugs.has(slug);
      const nextSlugs = new Set(slugs);
      nextSlugs.delete(slug);
      // Optimistically remove from state (0ms latency)
      setSlugs(nextSlugs);
      setPendingSlugs((prev) => new Set(prev).add(slug));

      try {
        const result = await removeShortlistApi(slug);
        if (!result.ok) {
          if (wasSaved) {
            setSlugs((prev) => new Set(prev).add(slug));
          }
          return false;
        }
        return true;
      } catch {
        if (wasSaved) {
          setSlugs((prev) => new Set(prev).add(slug));
        }
        return false;
      } finally {
        setPendingSlugs((prev) => {
          const next = new Set(prev);
          next.delete(slug);
          return next;
        });
      }
    },
    [slugs]
  );

  const isSlugPending = useCallback(
    (slug: string) => pendingSlugs.has(slug),
    [pendingSlugs]
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

  const isPending = pendingSlugs.size > 0;

  const value = useMemo<ShortlistContextValue>(
    () => ({
      authenticated,
      ready,
      email,
      slugs,
      isPending,
      pendingSlugs,
      isSlugPending,
      refresh,
      toggle,
      remove,
      signOut,
    }),
    [authenticated, email, isPending, pendingSlugs, isSlugPending, ready, refresh, remove, signOut, slugs, toggle]
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

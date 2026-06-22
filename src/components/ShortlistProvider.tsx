'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { addToShortlist, getShortlistSlugs, removeFromShortlist } from '@/app/actions/shortlist';
import { signOutAction } from '@/app/actions/auth';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const [isPending, setIsPending] = useState(false);

  const currentPath = useMemo(() => {
    const query = searchParams.toString();
    return `${pathname}${query ? `?${query}` : ''}`;
  }, [pathname, searchParams]);

  const refresh = useCallback(async () => {
    try {
      // Client-side optimization: check if Supabase session cookies exist.
      // If not, the user is definitely a guest, so we can skip the server call.
      const hasAuthCookie = typeof document !== 'undefined' &&
        document.cookie.split(';').some((item) => item.trim().startsWith('sb-'));

      if (!hasAuthCookie) {
        setAuthenticated(false);
        setEmail(null);
        setSlugs(new Set());
        setReady(true);
        return;
      }

      const result = await getShortlistSlugs();
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

  const toggle = useCallback(async (slug: string) => {
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
      const result = wasSaved
        ? await removeFromShortlist(slug)
        : await addToShortlist(slug);

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
  }, [authenticated, currentPath, router, slugs]);

  const signOut = useCallback(async () => {
    const result = await signOutAction();
    if (result.ok) {
      setAuthenticated(false);
      setEmail(null);
      setSlugs(new Set());
      router.refresh();
    }
  }, [router]);

  const value = useMemo<ShortlistContextValue>(() => ({
    authenticated,
    ready,
    email,
    slugs,
    isPending,
    refresh,
    toggle,
    signOut,
  }), [authenticated, email, isPending, ready, refresh, signOut, slugs, toggle]);

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error('useShortlist must be used within ShortlistProvider.');
  }
  return context;
}

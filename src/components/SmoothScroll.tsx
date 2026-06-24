'use client';

import { ReactNode, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

const SCROLL_KEY = (path: string) => `__scroll_${path}`;

/**
 * Globally readable flag so other components (e.g. template.tsx)
 * can detect back/forward navigation and skip enter animations.
 */
let _isPopNavigation = false;
export function isPopNavigation() { return _isPopNavigation; }

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isPopRef = useRef(false);
  const prevPathRef = useRef(pathname);
  const currentPathRef = useRef(pathname);
  // Flag to prevent the "forward" scroll-to-0 from firing during a restore
  const restoringRef = useRef(false);
  const scrollMapRef = useRef<Record<string, number>>({});

  // Keep currentPathRef in sync with pathname React state
  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  // ── Lenis setup (runs once) ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disable browser's built-in scroll restoration so it doesn't fight us
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    // Mark the next pathname change as back/forward
    const handlePop = () => {
      isPopRef.current = true;
      _isPopNavigation = true;

      const prevPath = currentPathRef.current;
      const scrollY = window.scrollY;
      try {
        sessionStorage.setItem(SCROLL_KEY(prevPath), String(Math.round(scrollY)));
      } catch {}
    };
    window.addEventListener('popstate', handlePop, { capture: true });

    // Save scroll position immediately on click of any link before layout shrinks
    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      if (target && target.getAttribute('href')) {
        const currentPath = currentPathRef.current;
        const scrollY = window.scrollY;
        scrollMapRef.current[currentPath] = scrollY;
        try {
          sessionStorage.setItem(SCROLL_KEY(currentPath), String(Math.round(scrollY)));
        } catch {}
      }
    };
    window.addEventListener('click', handleClick, { capture: true });

    // Track scroll positions continuously
    const handleScroll = () => {
      if (restoringRef.current) return;
      const currentPath = currentPathRef.current;
      scrollMapRef.current[currentPath] = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('popstate', handlePop, { capture: true });
      window.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Robustly scroll to `target` Y after the page layout has settled.
  // Uses ResizeObserver + a continuous rAF loop to counteract Next.js async layout rendering.
  const scrollToAfterPaint = useCallback((target: number) => {
    if (typeof window === 'undefined') return;

    restoringRef.current = true;
    const doScroll = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { immediate: true });
      }
      window.scrollTo(0, target);
    };

    // Try scrolling immediately
    doScroll();

    let resizeObserver: ResizeObserver | null = null;
    let timeoutId: any = null;
    let rafId: number | null = null;

    const cleanup = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      restoringRef.current = false;
    };

    // Set a safety timeout to stop restoring after 1.5 seconds under any circumstance
    timeoutId = setTimeout(cleanup, 1500);

    // Keep checking and scrolling as the body size changes
    let lastHeight = document.body.scrollHeight;
    resizeObserver = new ResizeObserver(() => {
      const currentHeight = document.body.scrollHeight;
      if (currentHeight !== lastHeight) {
        lastHeight = currentHeight;
        doScroll();
      }

      // Check if we've successfully scrolled to the target
      const currentScroll = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
      const maxScroll = currentHeight - window.innerHeight;
      
      if (Math.abs(currentScroll - target) < 2 || (currentScroll >= maxScroll - 2 && maxScroll >= target - 10)) {
        cleanup();
      }
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Also run a few rAF passes to ensure we catch paint cycles
    const tick = (count: number) => {
      if (count > 15) return; // limit checks to 15 frames (~250ms)
      doScroll();
      
      const currentScroll = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
      if (Math.abs(currentScroll - target) < 2) {
        cleanup();
        return;
      }
      
      rafId = requestAnimationFrame(() => tick(count + 1));
    };
    rafId = requestAnimationFrame(() => tick(0));
  }, []);

  // ── Pathname change handler ──
  useEffect(() => {
    const lenis = lenisRef.current;
    const prevPath = prevPathRef.current;

    // Save scroll position of the page we're leaving
    if (prevPath !== pathname) {
      const savedScroll = scrollMapRef.current[prevPath] ?? (lenis ? lenis.scroll : window.scrollY);
      try {
        sessionStorage.setItem(SCROLL_KEY(prevPath), String(Math.round(savedScroll)));
      } catch { /* quota exceeded — ignore */ }

      // Seed the new pathname's scroll tracker with its current position
      scrollMapRef.current[pathname] = lenis ? lenis.scroll : window.scrollY;

      prevPathRef.current = pathname;
    }

    if (isPopRef.current) {
      // ── Back / Forward navigation ──
      isPopRef.current = false;

      const saved = (() => {
        try {
          const val = sessionStorage.getItem(SCROLL_KEY(pathname));
          return parseInt(val ?? '', 10);
        } catch { return NaN; }
      })();

      if (!isNaN(saved)) {
        scrollToAfterPaint(saved);
        return; // don't fall through to scroll-to-0
      }
    } else {
      // Normal forward navigation
      _isPopNavigation = false;
    }

    // ── Normal forward navigation: scroll to top ──
    if (!restoringRef.current) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, scrollToAfterPaint]);

  return <>{children}</>;
}

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
  // Flag to prevent the "forward" scroll-to-0 from firing during a restore
  const restoringRef = useRef(false);
  const scrollMapRef = useRef<Record<string, number>>({});

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

      // Save scroll position of the page we are leaving immediately
      const prevPath = prevPathRef.current;
      const scrollY = window.scrollY;
      try {
        sessionStorage.setItem(SCROLL_KEY(prevPath), String(Math.round(scrollY)));
      } catch {}
    };
    window.addEventListener('popstate', handlePop);

    // Save scroll position immediately on click of any link before layout shrinks
    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      if (target && target.getAttribute('href')) {
        const currentPath = window.location.pathname;
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
      const currentPath = window.location.pathname;
      scrollMapRef.current[currentPath] = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Robustly scroll to `target` Y after the page layout has settled.
  // Uses rAF chaining + a MutationObserver to wait for DOM stability.
  const scrollToAfterPaint = useCallback((target: number) => {
    restoringRef.current = true;

    const doScroll = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { immediate: true });
      }
      window.scrollTo(0, target);
    };

    // Strategy: wait 2 animation frames (guarantees one paint cycle),
    // then set scroll. Follow up with another rAF pair to correct any
    // layout shift from lazy-loaded images or deferred content.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        doScroll();

        // Second correction pass after content may have shifted
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            doScroll();
            restoringRef.current = false;
          });
        });
      });
    });
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
          return parseInt(sessionStorage.getItem(SCROLL_KEY(pathname)) ?? '', 10);
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

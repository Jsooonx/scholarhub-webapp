'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

const SCROLL_KEY = (path: string) => `__scroll_${path}`;

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  // Track whether the upcoming pathname change is a back/forward navigation
  const isPopRef = useRef(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

    // Mark the next pathname change as a pop (back/forward) navigation
    const handlePop = () => { isPopRef.current = true; };
    window.addEventListener('popstate', handlePop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('popstate', handlePop);
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;

    // Save the current scroll position before we change page
    const prevPath = prevPathRef.current;
    if (prevPath !== pathname) {
      // Store scroll Y of the page we're leaving
      const scrollY = lenis ? lenis.scroll : window.scrollY;
      try {
        sessionStorage.setItem(SCROLL_KEY(prevPath), String(Math.round(scrollY)));
      } catch {}
      prevPathRef.current = pathname;
    }

    if (isPopRef.current) {
      // Back/Forward: restore saved position
      isPopRef.current = false;
      const saved = (() => {
        try { return parseInt(sessionStorage.getItem(SCROLL_KEY(pathname)) ?? '', 10); }
        catch { return NaN; }
      })();

      if (!isNaN(saved) && saved > 0) {
        // Delay slightly so React has painted the page
        const timer = setTimeout(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(saved, { immediate: true });
          } else {
            window.scrollTo(0, saved);
          }
        }, 50);
        return () => clearTimeout(timer);
      }
      // No saved position — still go to top
    }

    // Normal forward navigation: scroll to top
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}

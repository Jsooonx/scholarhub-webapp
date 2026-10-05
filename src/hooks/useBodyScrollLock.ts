import { useEffect } from 'react';

let activeLocks = 0;
let originalBodyOverflow = '';
let originalBodyOverscroll = '';

/**
 * Reusable hook to lock scroll on `body`.
 * Prevents background scrolling without causing layout shifts or viewport flickering.
 *
 * @param isLocked Whether the body scroll should be locked.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    if (activeLocks === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalBodyOverscroll = document.body.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    }
    activeLocks++;

    // Prevent wheel events on anything outside actual scrollable containers
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow scrolling inside elements that have overflow-y-auto or overflow-x-auto
      const scrollable = target?.closest('.overflow-y-auto, .overflow-x-auto, textarea, select');
      if (scrollable) {
        return;
      }
      e.preventDefault();
    };

    // Prevent touchmove events on background on mobile/tablets
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest('.overflow-y-auto, .overflow-x-auto, textarea, select');
      if (scrollable) {
        return;
      }
      e.preventDefault();
    };

    // Prevent spacebar or arrow keys from scrolling the background
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        const target = e.target as HTMLElement | null;
        if (!target || !target.closest('.overflow-y-auto, .overflow-x-auto, textarea, select, input')) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);

      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.overscrollBehavior = originalBodyOverscroll;
      }
    };
  }, [isLocked]);
}

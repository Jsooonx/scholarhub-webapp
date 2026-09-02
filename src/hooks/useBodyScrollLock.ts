import { useEffect } from 'react';

/**
 * Reusable hook to lock scroll on `body` and `html` elements.
 * Ideal for modals, drawer slide-outs, and fullscreen overlays.
 *
 * @param isLocked Whether the body scroll should be locked.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // Prevent wheel events on anything outside the modal scroll container
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-lenis-prevent], .overflow-y-auto, .overflow-x-auto, input, textarea, select')) {
        return;
      }
      e.preventDefault();
    };

    // Prevent touchmove events on background on mobile/tablets
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-lenis-prevent], .overflow-y-auto, .overflow-x-auto, input, textarea, select')) {
        return;
      }
      e.preventDefault();
    };

    // Prevent spacebar or arrow keys from scrolling the background
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        const target = e.target as HTMLElement | null;
        if (!target || !target.closest('[data-lenis-prevent], .overflow-y-auto, .overflow-x-auto, input, textarea, select')) {
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
    };
  }, [isLocked]);
}

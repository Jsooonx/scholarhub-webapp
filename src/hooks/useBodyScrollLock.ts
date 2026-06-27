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

    // Save original styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Apply scroll lock
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Cleanup and unlock on unmount
    return () => {
      document.body.style.overflow = originalBodyOverflow || '';
      document.documentElement.style.overflow = originalHtmlOverflow || '';
    };
  }, [isLocked]);
}

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
    const originalBodyPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply scroll lock
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Pad the sticky navbar to prevent it from shifting
      const navbar = document.querySelector('.sticky.top-0') as HTMLElement;
      if (navbar) {
        navbar.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    // Cleanup and unlock on unmount
    return () => {
      document.body.style.overflow = originalBodyOverflow || '';
      document.documentElement.style.overflow = originalHtmlOverflow || '';
      document.body.style.paddingRight = originalBodyPaddingRight || '';
      
      const navbar = document.querySelector('.sticky.top-0') as HTMLElement;
      if (navbar) {
        navbar.style.paddingRight = '';
      }
    };
  }, [isLocked]);
}

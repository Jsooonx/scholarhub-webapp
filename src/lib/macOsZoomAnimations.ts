import type { Variants } from 'framer-motion';

/**
 * Custom spring physics curve resembling macOS app-open speed and settle dynamics.
 */
export const macOSZoomTransition = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 28,
  mass: 0.85,
};

/**
 * Backdrop overlay fade animation variants.
 */
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Modal macOS Zoom scale and opacity transition variants.
 * Starts from a tiny scaled-down point (0.05) and expands outward to full scale (1).
 */
export const modalZoomVariants: Variants = {
  initial: { opacity: 0, scale: 0.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.05 },
};

import { useState, useLayoutEffect, useEffect } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface Point {
  x: number;
  y: number;
}

/**
 * Custom hook to calculate a dynamic transform-origin for macOS App Open style zoom transitions.
 * Calculates the exact relative coordinate of the trigger button's center point
 * within the centered modal container. Supports any trigger position on screen.
 *
 * @param modalRef React RefObject pointing to the modal container.
 * @param buttonCenter Viewport center point { x, y } of the trigger button.
 */
export function useMacOsAppZoom(
  modalRef: React.RefObject<HTMLElement | null>,
  buttonCenter: Point | null
) {
  // Compute initial static estimate before mount to prevent frame 1 jumping from center
  const [transformOrigin, setTransformOrigin] = useState(() => {
    if (typeof window === 'undefined' || !buttonCenter) return '50% 50%';
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(1152, vw - 64);
    const h = vh * 0.9;
    const left = (vw - w) / 2;
    const top = (vh - h) / 2;
    return `${buttonCenter.x - left}px ${buttonCenter.y - top}px`;
  });

  // Calculate precise transform origin dynamically on mount/layout
  useIsoLayoutEffect(() => {
    if (modalRef.current && buttonCenter) {
      const layoutWidth = modalRef.current.offsetWidth;
      const layoutHeight = modalRef.current.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Centered layout calculations (ignores active CSS scale transform)
      const left = (vw - layoutWidth) / 2;
      const top = (vh - layoutHeight) / 2;

      const relativeX = buttonCenter.x - left;
      const relativeY = buttonCenter.y - top;

      setTransformOrigin(`${relativeX}px ${relativeY}px`);
    }
  }, [buttonCenter, modalRef]);

  return transformOrigin;
}

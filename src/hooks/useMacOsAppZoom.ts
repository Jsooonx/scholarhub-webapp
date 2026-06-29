import { useLayoutEffect, useEffect } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface Point {
  x: number;
  y: number;
}

/**
 * Custom hook to calculate a dynamic transform-origin for macOS App Open style zoom transitions.
 * Calculates the exact relative coordinate of the trigger button's center point
 * within the centered modal container and applies it directly to the DOM element style.
 * This avoids triggering a React state update/re-render during layout phase, preventing animation flicker.
 *
 * @param modalRef React RefObject pointing to the modal container.
 * @param buttonCenter Viewport center point { x, y } of the trigger button.
 */
export function useMacOsAppZoom(
  modalRef: React.RefObject<HTMLElement | null>,
  buttonCenter: Point | null
) {
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

      modalRef.current.style.transformOrigin = `${relativeX}px ${relativeY}px`;
    }
  }, [buttonCenter, modalRef]);
}

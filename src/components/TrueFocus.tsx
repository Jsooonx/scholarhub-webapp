'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './TrueFocus.css';

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = '#2563EB',
  glowColor = 'rgba(37, 99, 235, 0.3)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}: TrueFocusProps) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updateFocusRect = () => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();

    if (currentIndex === words.length) {
      // Find tight bounding box of all words combined
      let minLeft = Infinity;
      let maxRight = -Infinity;
      let minTop = Infinity;
      let maxBottom = -Infinity;

      wordRefs.current.forEach((wordRef) => {
        if (!wordRef) return;
        const rect = wordRef.getBoundingClientRect();
        if (rect.left < minLeft) minLeft = rect.left;
        if (rect.right > maxRight) maxRight = rect.right;
        if (rect.top < minTop) minTop = rect.top;
        if (rect.bottom > maxBottom) maxBottom = rect.bottom;
      });

      if (minLeft !== Infinity) {
        setFocusRect({
          x: minLeft - parentRect.left,
          y: minTop - parentRect.top,
          width: maxRight - minLeft,
          height: maxBottom - minTop
        });
      }
      return;
    }

    if (!wordRefs.current[currentIndex]) return;
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  };

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (prev + 1) % (words.length + 1));
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    updateFocusRect();
  }, [currentIndex, words.length]);

  useEffect(() => {
    window.addEventListener('resize', updateFocusRect);
    return () => window.removeEventListener('resize', updateFocusRect);
  }, [currentIndex]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0);
    }
  };

  return (
    <span className="focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex || currentIndex === words.length;
        return (
          <span
            key={index}
            ref={el => { wordRefs.current[index] = el; }}
            className={`focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              '--border-color': borderColor,
              '--glow-color': glowColor,
              transition: `filter ${animationDuration}s ease`
            } as any}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.span
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration
        }}
        style={{
          '--border-color': borderColor,
          '--glow-color': glowColor
        } as any}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.span>
    </span>
  );
};

export default TrueFocus;

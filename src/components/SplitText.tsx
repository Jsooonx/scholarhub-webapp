'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'initial' | 'inherit';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof document !== 'undefined' && document?.fonts?.status === 'loaded') {
      setFontsLoaded(true);
    } else if (typeof document !== 'undefined' && document?.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          setFontsLoaded(true);
        })
        .catch(() => {
          setFontsLoaded(true);
        });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      // Prevent re-animation if already completed
      if (animationCompletedRef.current) return;
      const el = ref.current;

      let targets: HTMLElement[] = [];
      if (splitType.includes('chars')) {
        targets = Array.from(el.querySelectorAll('.split-char'));
      } else if (splitType.includes('words')) {
        targets = Array.from(el.querySelectorAll('.split-word'));
      } else {
        targets = [el];
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        tween.kill();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const Tag = tag || 'p';

  const style = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal' as const,
    wordWrap: 'break-word' as const,
    willChange: 'transform, opacity'
  };

  const renderContent = () => {
    if (splitType === 'words' || splitType === 'words, chars' || splitType === 'chars') {
      const words = text.split(' ');
      return words.map((word, wordIdx) => {
        const isLastWord = wordIdx === words.length - 1;

        if (splitType === 'chars' || splitType === 'words, chars') {
          const chars = Array.from(word);
          return (
            <span key={wordIdx} className="split-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {chars.map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="split-char"
                  style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                >
                  {char}
                </span>
              ))}
              {!isLastWord && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
            </span>
          );
        }

        // Just words
        return (
          <span key={wordIdx} className="split-word" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
            {word}
            {!isLastWord && <span>&nbsp;</span>}
          </span>
        );
      });
    }

    return text;
  };

  return (
    <Tag ref={ref as any} style={style} className={`split-parent ${className}`}>
      {renderContent()}
    </Tag>
  );
}

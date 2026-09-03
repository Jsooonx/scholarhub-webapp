'use client';

import type { ElementType } from 'react';
import { useMemo } from 'react';
import { motion, type Variants, type TargetAndTransition } from 'framer-motion';

type SupportedTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | number[];
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: TargetAndTransition;
  to?: TargetAndTransition;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'initial' | 'inherit';
  tag?: SupportedTag;
  onLetterAnimationComplete?: () => void;
}

const motionComponents: Record<SupportedTag, ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

export default function SplitText({
  text,
  className = '',
  delay = 40,
  duration = 0.5,
  threshold = 0.1,
  textAlign = 'left',
  tag = 'p',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const words = useMemo(() => (text ? text.split(' ') : []), [text]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: Math.max(0.02, delay / 1000),
        delayChildren: 0.05,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: Math.max(0.3, duration),
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const isCentered = textAlign === 'center' || className.includes('text-center');
  const isRight = textAlign === 'right' || className.includes('text-right');
  const justify = isCentered ? 'center' : isRight ? 'flex-end' : 'flex-start';

  const Tag = motionComponents[tag] || motion.p;

  return (
    <Tag
      className={className}
      style={{
        textAlign,
        display: 'inline-flex',
        flexWrap: 'wrap',
        justifyContent: justify,
        rowGap: '0.15em',
        columnGap: '0.28em',
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      onAnimationComplete={onLetterAnimationComplete}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          style={{ display: 'inline-block' }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

'use client';

import { useState, useRef } from 'react';
import { Compass } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import type { Scholarship } from '@/lib/scholarships';
import ScholarshipCompareModal from './ScholarshipCompareModal';
import { Button } from '@/components/ui/button';

interface Props {
  currentScholarship: Scholarship;
  className?: string;
}

export default function CompareCTA({ currentScholarship, className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonCenter, setButtonCenter] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        variant="secondary"
        size="lg"
        className={`w-full ${className}`}
      >
        <Compass className="h-4 w-4" />
        Compare this scholarship
      </Button>

      <AnimatePresence>
        {isOpen && (
          <ScholarshipCompareModal
            currentScholarship={currentScholarship}
            buttonCenter={buttonCenter}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

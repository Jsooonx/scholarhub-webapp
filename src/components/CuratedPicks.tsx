'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Lightbulb, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { allScholarships, getScholarshipImage, providerGroup, providerMeta } from '@/lib/scholarships';
import { curatedPicks, CuratedPick } from '@/data/curated';
import { isPopNavigation } from '@/components/SmoothScroll';

const CARDS_PER_PAGE = 6;

interface CustomProp {
  direction: number;
  skipAnimation: boolean;
}

const pageVariants: Variants = {
  initial: ({ direction, skipAnimation }: CustomProp) => ({
    opacity: skipAnimation ? 1 : 0,
    x: skipAnimation ? 0 : (direction > 0 ? 100 : -100),
  }),
  animate: ({ skipAnimation }: CustomProp) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: skipAnimation ? 0 : 0.32,
    },
  }),
  exit: ({ direction, skipAnimation }: CustomProp) => ({
    opacity: skipAnimation ? 1 : 0,
    x: skipAnimation ? 0 : (direction > 0 ? -100 : 100),
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: skipAnimation ? 0 : 0.24,
    },
  }),
};

export default function CuratedPicks() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = right, -1 = left
  const [mounted, setMounted] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Resolve and filter the curated picks to Bachelor, Master, PhD only
  const resolvedPicks = useMemo(() => {
    return curatedPicks
      .map((pick) => {
        const scholarship = allScholarships.find((s) => s.slug === pick.slug);
        if (!scholarship) return null;

        // Check if it matches Bachelor, Master, or PhD
        const hasValidLevel = scholarship.degree_levels.some(level =>
          ['Bachelor', 'Master', 'PhD'].includes(level)
        );
        if (!hasValidLevel) return null;

        return {
          pick,
          scholarship,
        };
      })
      .filter((item): item is { pick: CuratedPick; scholarship: typeof allScholarships[0] } => item !== null);
  }, []);

  const totalPages = Math.ceil(resolvedPicks.length / CARDS_PER_PAGE);

  // Restore page from sessionStorage on mount (back navigation)
  useEffect(() => {
    if (isPopNavigation()) {
      setSkipAnimation(true);
    }
    try {
      const saved = sessionStorage.getItem('__curated_picks_page');
      if (saved !== null) {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n >= 0 && n < totalPages) setCurrentPage(n);
      }
    } catch {}
    setMounted(true);
  }, [totalPages]);

  // Persist page changes to sessionStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem('__curated_picks_page', String(currentPage));
    } catch {}
  }, [currentPage, mounted]);

  const currentPagePicks = useMemo(() => {
    const start = currentPage * CARDS_PER_PAGE;
    return resolvedPicks.slice(start, start + CARDS_PER_PAGE);
  }, [currentPage, resolvedPicks]);

  const handlePageChange = (newPage: number) => {
    setDirection(newPage > currentPage ? 1 : -1);
    setSkipAnimation(false);
    setCurrentPage(newPage);
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  if (resolvedPicks.length === 0) return null;

  return (
    <section className="py-16 border-t border-brand-border bg-brand-cream/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent bg-brand-accent/5 px-2.5 py-0.5 rounded-full border border-brand-accent/15">
                Exclusive Curation
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-brand-dark">
              Handpicked by ScholarHub
            </h2>
            <p className="text-xs text-brand-muted mt-2 max-w-xl">
              World's top-tier scholarships hand-curated with exclusive application insights and selection strategies.
            </p>
          </div>

          {/* Controls & Curator Signature */}
          <div className="flex items-center justify-between md:justify-end gap-6 mt-6 md:mt-0">
            {/* Curator Signature Badge */}
            <div className="flex items-center gap-3 p-2.5 bg-white border border-brand-border rounded-2xl shadow-sm max-w-fit">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-brand-cream border border-brand-border flex items-center justify-center p-1 flex-shrink-0">
                <Image
                  src="/images/logos/Scholarhub_logo.png"
                  alt="ScholarHub Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-brand-dark">ScholarHub Team</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-accent fill-brand-accent/10" />
                </div>
              </div>
            </div>

            {/* Slider Navigation Arrows */}
            {totalPages > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={!mounted || currentPage === 0}
                  className={`p-2.5 rounded-full border border-brand-border bg-white hover:bg-brand-cream text-brand-dark transition-all duration-200 cursor-pointer shadow-sm ${
                    !mounted || currentPage === 0 ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Previous Page"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={!mounted || currentPage === totalPages - 1}
                  className={`p-2.5 rounded-full border border-brand-border bg-white hover:bg-brand-cream text-brand-dark transition-all duration-200 cursor-pointer shadow-sm ${
                    !mounted || currentPage === totalPages - 1 ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  aria-label="Next Page"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Curated Grid with Smooth Slide Transition */}
        <div className="relative overflow-hidden min-h-[3640px] md:min-h-[1804px] lg:min-h-[1192px]">
          <AnimatePresence initial={false} custom={{ direction, skipAnimation }} mode="wait">
            <motion.div
              key={currentPage}
              custom={{ direction, skipAnimation }}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ backfaceVisibility: 'hidden', willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 absolute inset-x-0 top-0"
            >
              {currentPagePicks.map(({ pick, scholarship }) => {
                const group = providerGroup(scholarship.provider);
                const flag = providerMeta[group]?.flag ?? '🌍';
                const levelLabel = scholarship.degree_levels.filter(l => ['Bachelor', 'Master', 'PhD'].includes(l)).join(' / ');

                return (
                  <div 
                    key={scholarship.slug} 
                    className="flex flex-col h-[580px] bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Scholarship Thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-brand-border">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform transform-gpu"
                        style={{ backgroundImage: `url('${getScholarshipImage(scholarship)}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      
                      {/* Custom Highlight Tag Overlay */}
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-brand-accent text-white shadow-sm z-10">
                        <Sparkles className="h-3 w-3" />
                        {pick.badge}
                      </span>

                      {/* Level & Flag Overlay */}
                      <span className="absolute bottom-4 left-4 inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/95 backdrop-blur-sm text-brand-dark border border-brand-border shadow-sm z-10">
                        <span className="mr-1.5">{flag}</span>
                        {scholarship.country ?? 'International'} · {levelLabel}
                      </span>
                    </div>

                    {/* Card Info Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Scholarship Name */}
                      <Link href={`/scholarships/${scholarship.slug}`} className="cursor-pointer">
                        <h3 className="font-serif text-base font-bold text-brand-dark leading-snug group-hover:text-brand-accent transition-colors line-clamp-2 min-h-[2.5rem] mb-4">
                          {scholarship.name}
                        </h3>
                      </Link>

                      {/* Editor's Curated Reason (Speech Bubble Style) */}
                      <div className="bg-brand-cream/35 border border-brand-border/40 rounded-2xl p-4 relative mb-4 flex-grow flex flex-col justify-center">
                        <p className="text-[11px] text-brand-muted leading-relaxed italic">
                          "{pick.editorReason}"
                        </p>
                      </div>

                      {/* Insider Apply Tip Box */}
                      <div className="bg-brand-accent/[0.02] border border-brand-accent/10 rounded-xl p-3.5 flex items-start gap-2.5">
                        <div className="p-1 bg-brand-accent/10 rounded-lg text-brand-accent flex-shrink-0 mt-0.5">
                          <Lightbulb className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-brand-accent mb-0.5">Insider Apply Tip</span>
                          <p className="text-[11px] font-medium text-brand-dark/95 leading-relaxed">
                            {pick.insiderTip}
                          </p>
                        </div>
                      </div>

                      {/* Spacer to push button down but guarantee 16px gap */}
                      <div className="mt-auto h-4 flex-shrink-0" />

                      {/* Action Link */}
                      <Link 
                        href={`/scholarships/${scholarship.slug}`}
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-brand-dark border border-brand-dark text-white rounded-full font-bold text-xs transition-all duration-200 hover:bg-white hover:text-brand-dark cursor-pointer shadow-sm interactive-press"
                      >
                        View Application Guide
                      </Link>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Premium Dot Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  mounted && idx === currentPage ? 'bg-brand-dark w-5' : 'bg-brand-border hover:bg-brand-dark/30 w-2'
                }`}
                aria-label={`Go to page ${idx + 1}`}
                disabled={!mounted}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

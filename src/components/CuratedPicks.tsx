'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { allScholarships, getScholarshipImage, providerGroup, providerMeta } from '@/lib/scholarships';
import { curatedPicks, CuratedPick } from '@/data/curated';
import { isPopNavigation } from '@/components/SmoothScroll';
import { Button, LinkButton } from '@/components/ui/button';
import SaveScholarshipButton from '@/components/SaveScholarshipButton';
import { cn } from '@/lib/utils';

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
                <Button
                  onClick={handlePrev}
                  disabled={mounted ? currentPage === 0 : undefined}
                  variant="secondary"
                  size="icon-sm"
                  shape="circle"
                  className={mounted && currentPage === 0 ? 'opacity-30' : ''}
                  aria-label="Previous Page"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={mounted ? currentPage === totalPages - 1 : undefined}
                  variant="secondary"
                  size="icon-sm"
                  shape="circle"
                  className={mounted && currentPage === totalPages - 1 ? 'opacity-30' : ''}
                  aria-label="Next Page"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Curated Grid with Smooth Slide Transition */}
        <div className="relative overflow-hidden min-h-[3320px] md:min-h-[1800px] lg:min-h-[1190px]">
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
                    className="flex flex-col h-[520px] md:h-[570px] bg-white border border-brand-border/80 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 group hover:shadow-md hover:border-brand-accent/30"
                  >
                    {/* Scholarship Thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-brand-border/60 bg-brand-cream/20 flex-shrink-0">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform transform-gpu"
                        style={{ backgroundImage: `url('${getScholarshipImage(scholarship)}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                      {/* Top-Right Highlight Pill (Clean & Editorial) */}
                      {pick.badge && (
                        <span className="absolute top-3.5 right-3.5 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-brand-dark/90 backdrop-blur-md text-white border border-white/15 shadow-xs">
                          {pick.badge}
                        </span>
                      )}

                      {/* Bottom-Left Level & Flag Pill */}
                      <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/95 backdrop-blur-xs text-brand-dark border border-brand-border/80 shadow-xs z-10">
                        <span className="select-none">{flag}</span>
                        <span className="font-semibold text-brand-dark">{scholarship.country ?? 'International'}</span>
                        <span className="text-brand-border">·</span>
                        <span className="text-brand-muted">{levelLabel}</span>
                      </span>
                    </div>

                    {/* Card Info Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1 min-h-0">
                      {/* Provider & Funding Row */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted truncate">
                          {scholarship.provider}
                        </span>
                        {scholarship.funding_type && (
                          <span className={cn(
                            "text-[9px] px-2 py-0.5 rounded-full border flex-shrink-0 font-medium",
                            scholarship.funding_type.toLowerCase().includes('full')
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            {scholarship.funding_type}
                          </span>
                        )}
                      </div>

                      {/* Scholarship Name */}
                      <Link href={`/scholarships/${scholarship.slug}`} className="cursor-pointer group/title block mb-3 flex-shrink-0">
                        <h3 className="font-serif text-base md:text-lg font-bold text-brand-dark leading-snug transition-colors group-hover/title:text-brand-accent line-clamp-2">
                          {scholarship.name}
                        </h3>
                      </Link>

                      {/* Editorial Narrative Quote (Clean single flow) */}
                      <div className="relative pl-3 border-l-2 border-brand-border/90 mb-3 flex-shrink-0">
                        <p className="text-[11px] md:text-xs text-brand-muted leading-relaxed italic line-clamp-3">
                          "{pick.editorReason}"
                        </p>
                      </div>

                      {/* Insider Strategy / Tip Callout */}
                      <div className="bg-brand-bg/90 border border-brand-border/70 rounded-xl p-3 flex items-start gap-2.5 mb-3 flex-1 min-h-0 overflow-hidden">
                        <div className="p-1 bg-brand-accent/10 rounded-lg text-brand-accent flex-shrink-0 mt-0.5">
                          <Lightbulb className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-brand-accent mb-0.5">
                            Insider Tip
                          </span>
                          <p className="text-[11px] text-brand-dark/90 leading-relaxed line-clamp-3 font-medium">
                            {pick.insiderTip}
                          </p>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="mt-auto pt-3 border-t border-brand-border/60 flex items-center gap-2 flex-shrink-0">
                        <LinkButton
                          href={`/scholarships/${scholarship.slug}`}
                          variant="primary"
                          size="sm"
                          className="flex-1 justify-between font-semibold text-xs group/btn"
                        >
                          <span>View Application Guide</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                        </LinkButton>
                        <SaveScholarshipButton slug={scholarship.slug} />
                      </div>
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
              <Button
                key={idx}
                onClick={() => handlePageChange(idx)}
                variant={mounted && idx === currentPage ? 'primary' : 'secondary'}
                size="icon-xs"
                shape="circle"
                className={`!h-2 !min-h-2 !rounded-full !p-0 transition-all duration-300 ${
                  mounted && idx === currentPage ? '!w-5' : '!w-2'
                }`}
                aria-label={`Go to page ${idx + 1}`}
                disabled={mounted ? false : undefined}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

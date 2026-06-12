'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, ArrowRight, Globe, GraduationCap, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandMode = 'search' | 'menu' | null;

// Single spring drives both width + height. Because we animate real CSS
// size properties (never transform: scale), border-radius and box-shadow
// stay perfectly rounded at every frame — no corner distortion.
const MORPH_SPRING = { type: 'spring' as const, stiffness: 320, damping: 36, mass: 0.9 };

// SSR-safe layout effect
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const providers = [
  { name: 'DAAD', country: 'Germany', flag: '🇩🇪', slug: 'daad' },
  { name: 'MEXT', country: 'Japan', flag: '🇯🇵', slug: 'mext' },
  { name: 'Türkiye Burslari', country: 'Turkey', flag: '🇹🇷', slug: 'turkiye' },
  { name: 'Chevening', country: 'United Kingdom', flag: '🇬🇧', slug: 'chevening' },
  { name: 'Australia Awards', country: 'Australia', flag: '🇦🇺', slug: 'australia-awards' },
  { name: 'GKS', country: 'South Korea', flag: '🇰🇷', slug: 'gks' },
  { name: 'Singapore (NUS/NTU/A*STAR)', country: 'Singapore', flag: '🇸🇬', slug: 'singapore' },
  { name: 'Eiffel Scholarship', country: 'France', flag: '🇫🇷', slug: 'eiffel' },
  { name: 'Canada CRTAS', country: 'Canada', flag: '🇨🇦', slug: 'canada' },
];

// Compute the island's target width in px from viewport + state.
function computeWidth(isExpanded: boolean): number {
  if (typeof window === 'undefined') return 576;
  const vw = window.innerWidth;
  if (isExpanded) return Math.min(vw * 0.92, 768); // max-w-3xl
  const cap = vw >= 640 ? 576 : 384; // sm: max-w-xl, else max-w-sm
  return Math.min(vw * 0.9, cap);
}

// Quick content crossfade — no layout-affecting transforms.
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
const fadeTransition = { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const };

export default function Navbar() {
  const [expandMode, setExpandMode] = useState<ExpandMode>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProviderHovered, setIsProviderHovered] = useState(false);

  const [width, setWidth] = useState(() => computeWidth(false));
  const [height, setHeight] = useState<number | null>(null);

  const router = useRouter();
  const islandRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isExpanded = expandMode !== null;

  // Recompute target width whenever state or viewport changes.
  useIsoLayoutEffect(() => {
    const update = () => setWidth(computeWidth(isExpanded));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isExpanded]);

  // Measure content height and keep it in sync (handles state swaps,
  // dynamic content, and viewport reflow) so the island height animates
  // to a real pixel value — never a scale transform.
  const measure = useCallback(() => {
    if (contentRef.current) setHeight(contentRef.current.offsetHeight);
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    if (!contentRef.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [measure, expandMode]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setExpandMode(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setExpandMode(null);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Focus search field when entering search mode
  useEffect(() => {
    if (expandMode === 'search') {
      const t = setTimeout(() => searchInputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [expandMode]);

  const close = () => setExpandMode(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/scholarships?q=${encodeURIComponent(searchQuery.trim())}`);
      setExpandMode(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full pointer-events-none h-20 sm:h-24 flex items-start justify-center pt-3 sm:pt-4 overflow-visible">
      <motion.div
        ref={islandRef}
        data-lenis-prevent
        animate={{ width, ...(height != null ? { height } : {}) }}
        transition={MORPH_SPRING}
        style={{
          borderRadius: 28,
          overflow: isExpanded ? 'hidden' : 'visible',
        }}
        className="relative pointer-events-auto bg-black text-white shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      >
        {/* Measured content. Width is pinned to the target so its height is
            stable while the island's width animates and clips the reveal. */}
        <div ref={contentRef} style={{ width }} className="absolute top-0 left-0">
          <div className={isExpanded ? 'p-6 sm:p-8' : 'px-4 sm:px-6 py-2 sm:py-3'}>
            {/* ── HEADER ROW (persistent) ── */}
            <div className="flex items-center justify-between w-full">
              {/* Logo — constant size across states, so it never reflows */}
              <Link
                href="/"
                onClick={isExpanded ? close : undefined}
                className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold tracking-tight text-white hover:opacity-85 transition-opacity flex-shrink-0"
              >
                <img src="/images/logos/Scholarhub_logo.png" alt="ScholarHub Logo" className="h-6 w-6 sm:h-7 sm:w-7 rounded-md object-cover" />
                <span>Scholar<span className="text-brand-accent">Hub</span></span>
              </Link>

              {/* Center links — compact only */}
              <AnimatePresence initial={false}>
                {!isExpanded && (
                  <motion.div
                    key="center-links"
                    variants={fade}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={fadeTransition}
                    className="hidden sm:flex items-center space-x-6 mx-4"
                  >
                    <Link href="/scholarships" className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
                      Scholarships
                    </Link>

                    {/* Providers hover dropdown */}
                    <div
                      className="relative"
                      onMouseEnter={() => setIsProviderHovered(true)}
                      onMouseLeave={() => setIsProviderHovered(false)}
                    >
                      <button className="flex items-center text-xs font-semibold text-white/80 hover:text-white transition-colors focus:outline-none cursor-pointer">
                        Providers <ChevronDown className="ml-0.5 h-3 w-3" />
                      </button>
                      <AnimatePresence>
                        {isProviderHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl bg-black shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-2 z-50"
                            style={{ top: '100%' }}
                          >
                            <div
                              data-lenis-prevent
                              className="flex flex-col gap-1 max-h-44 overflow-y-auto navbar-dropdown-scroll"
                              style={{ overscrollBehavior: 'contain', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
                            >
                              {providers.map((p) => (
                                <Link key={p.slug} href={`/providers/${p.slug}`} className="block px-3 py-2 rounded-xl text-[11px] text-white/85 hover:text-white hover:bg-white/10 transition-colors">
                                  {p.flag} {p.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link href="/about" className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
                      About
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right controls — two stable slots; only the icons crossfade */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                {/* Slot A */}
                <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <AnimatePresence initial={false} mode="wait">
                    {!isExpanded && (
                      <motion.button
                        key="a-search"
                        variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                        onClick={() => setExpandMode('search')}
                        className="absolute inset-0 grid place-items-center hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer"
                        aria-label="Search"
                      >
                        <Search className="h-4 w-4" />
                      </motion.button>
                    )}
                    {expandMode === 'search' && (
                      <motion.button
                        key="a-menu"
                        variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                        onClick={() => setExpandMode('menu')}
                        className="absolute inset-0 grid place-items-center hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer"
                        aria-label="Open menu"
                      >
                        <Menu className="h-4 w-4" />
                      </motion.button>
                    )}
                    {expandMode === 'menu' && (
                      <motion.button
                        key="a-search2"
                        variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                        onClick={() => setExpandMode('search')}
                        className="absolute inset-0 grid place-items-center hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer"
                        aria-label="Search"
                      >
                        <Search className="h-4 w-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Slot B */}
                <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <AnimatePresence initial={false} mode="wait">
                    {!isExpanded ? (
                      <motion.button
                        key="b-menu"
                        variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                        onClick={() => setExpandMode('menu')}
                        className="absolute inset-0 grid place-items-center hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer"
                        aria-label="Open menu"
                      >
                        <Menu className="h-4 w-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        key="b-close"
                        variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                        onClick={close}
                        className="absolute inset-0 grid place-items-center hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── EXPANDED BODY ── */}
            <AnimatePresence initial={false} mode="wait">
              {expandMode === 'search' && (
                <motion.div
                  key="body-search"
                  variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                  onAnimationComplete={measure}
                  className="border-t border-white/15 mt-4 pt-5"
                >
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search scholarships, countries, fields of study..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-brand-accent/50 focus:bg-white/10 outline-none rounded-2xl py-3.5 px-5 pr-12 text-sm text-white placeholder-white/40 transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white cursor-pointer">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                  <p className="mt-3 text-[11px] text-white/35 text-center">
                    Press Enter to search ·{' '}
                    <button onClick={() => setExpandMode('menu')} className="underline underline-offset-2 hover:text-white/60 transition-colors cursor-pointer">
                      Browse all providers →
                    </button>
                  </p>
                </motion.div>
              )}

              {expandMode === 'menu' && (
                <motion.div
                  key="body-menu"
                  variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                  onAnimationComplete={measure}
                  className="border-t border-white/15 mt-4 pt-5 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {/* Providers */}
                  <div className="md:col-span-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3.5 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" /> Browse By Provider
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {providers.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/providers/${p.slug}`}
                          onClick={close}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group/item cursor-pointer"
                        >
                          <span className="text-xl leading-none">{p.flag}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white group-hover/item:text-brand-accent transition-colors truncate">{p.name}</p>
                            <p className="text-[9px] text-white/50 truncate">{p.country}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3.5 flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" /> Quick Navigation
                      </h5>
                      <div className="flex flex-col gap-2">
                        <Link href="/scholarships" onClick={close} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold cursor-pointer">
                          <span>Explore All Scholarships</span>
                          <ArrowRight className="h-3.5 w-3.5 text-white/50" />
                        </Link>
                        <Link href="/about" onClick={close} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold cursor-pointer">
                          <span>Guides &amp; Information</span>
                          <ArrowRight className="h-3.5 w-3.5 text-white/50" />
                        </Link>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3">
                      <Info className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <h6 className="text-[10px] font-bold uppercase tracking-wider text-white mb-1">ScholarHub Directory</h6>
                        <p className="text-[10px] text-white/60 leading-relaxed">
                          Currently listing over 56+ international scholarships from 9 countries. Use the search field above to find specific programs.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

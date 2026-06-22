'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Menu, X, ChevronDown, Search, ArrowRight, Globe, GraduationCap, Info, Bookmark, LogOut } from 'lucide-react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { allScholarships, providerMeta } from '@/lib/scholarships';
import { useShortlist } from '@/components/ShortlistProvider';

type ExpandMode = 'search' | 'menu' | null;

// One spring drives the container width. The inner content is w-full, so the
// flex header reflows every frame and its children SLIDE into place. We animate
// real CSS width (never transform: scale) so corners + shadow never distort.
const MORPH_SPRING = { type: 'spring' as const, stiffness: 320, damping: 36, mass: 0.9 };

// SSR-safe layout effect
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const providers = Object.entries(providerMeta).map(([slug, meta]) => ({
  name: meta.name,
  country: meta.country,
  flag: meta.flag,
  slug,
}));


const uniqueCountriesCount = new Set(allScholarships.map(s => s.country).filter(Boolean)).size;

// Target width in px from viewport + state (mirrors the old Tailwind caps).
function computeWidth(isExpanded: boolean): number {
  if (typeof window === 'undefined') return 880;
  const vw = window.innerWidth;
  if (isExpanded) return Math.min(vw - 24, 960);
  const cap = vw >= 640 ? 880 : 420;
  return Math.min(vw - 32, cap);
}

// Max island height - half the viewport. Keeps the expanded panel compact;
// any content beyond this scrolls internally.
function computeMaxHeight(): number {
  if (typeof window === 'undefined') return 9999;
  return window.innerHeight * 0.5;
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12, ease: [0.4, 0, 0.2, 1] as const } },
  // Exit instantly — prevents content from ghosting below the shrinking island
  exit: { opacity: 0, transition: { duration: 0 } },
};
const fadeTransition = { duration: 0.12, ease: [0.4, 0, 0.2, 1] as const };

export default function Navbar() {
  const [expandMode, setExpandMode] = useState<ExpandMode>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProviderHovered, setIsProviderHovered] = useState(false);
  const providerBtnRef = useRef<HTMLDivElement>(null);
  const providerButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const providerLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleProviderEnter = () => {
    if (providerLeaveTimer.current) {
      clearTimeout(providerLeaveTimer.current);
      providerLeaveTimer.current = null;
    }
    // Measure the button element itself for precise position
    const el = providerButtonRef.current ?? providerBtnRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 4, left: r.left });
    }
    setIsProviderHovered(true);
  };

  const handleProviderLeave = () => {
    providerLeaveTimer.current = setTimeout(() => {
      setIsProviderHovered(false);
    }, 100);
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      if (providerLeaveTimer.current) clearTimeout(providerLeaveTimer.current);
    };
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, ready, slugs, signOut } = useShortlist();
  const islandRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Height/width only spring when the user actively toggles the panel.
  // Mount, reload, navigation, and stray reflows always SNAP (no animation),
  // which removes the race condition that caused the expand-flash on navigation.
  const allowAnim = useRef(false);

  const isExpanded = expandMode !== null;

  // Toggle helpers - flag that the next size change is user-driven (animate).
  const openMode = (mode: ExpandMode) => { allowAnim.current = true; setExpandMode(mode); };
  const close = () => { allowAnim.current = true; setExpandMode(null); };

  // On route change: snap closed instantly with NO animation.
  useEffect(() => {
    allowAnim.current = false;
    setExpandMode(null);
    setSearchQuery('');
    width.set(computeWidth(false));
    if (contentRef.current) {
      height.set(Math.min(contentRef.current.offsetHeight, maxHeightRef.current));
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animated width + height. Both initialized to compact size so there is never
  // a 0→compact jump on first paint.
  const width = useMotionValue(computeWidth(false));
  const height = useMotionValue<number>(-1); // -1 = unmeasured sentinel
  const maxHeightRef = useRef(computeMaxHeight());
  const [scrollable, setScrollable] = useState(false);

  // Measure compact height synchronously before first paint.
  useIsoLayoutEffect(() => {
    if (contentRef.current && height.get() === -1) {
      height.set(contentRef.current.offsetHeight);
    }
  }, []);

  // Width: spring only when user-toggled, otherwise snap.
  useIsoLayoutEffect(() => {
    const target = computeWidth(isExpanded);
    if (allowAnim.current) {
      const controls = animate(width, target, MORPH_SPRING);
      return () => controls.stop();
    }
    width.set(target);
  }, [isExpanded, width]);

  // Height: track content size. Spring only when user-toggled; snap otherwise.
  useIsoLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const sync = () => {
      const natural = el.offsetHeight;
      const clamped = Math.min(natural, maxHeightRef.current);
      setScrollable(natural > maxHeightRef.current);
      if (allowAnim.current) {
        animate(height, clamped, MORPH_SPRING);
      } else {
        height.set(clamped);
      }
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  // Recompute width + max height on viewport resize.
  useEffect(() => {
    const onResize = () => {
      maxHeightRef.current = computeMaxHeight();
      width.set(computeWidth(isExpanded));
      if (contentRef.current) {
        const natural = contentRef.current.offsetHeight;
        const clamped = Math.min(natural, maxHeightRef.current);
        setScrollable(natural > maxHeightRef.current);
        height.set(clamped);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isExpanded, width, height]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/scholarships?q=${encodeURIComponent(searchQuery.trim())}`);
      close();
      setSearchQuery('');
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full pointer-events-none h-14 sm:h-16 flex items-start justify-center pt-2 sm:pt-3">
      <motion.div
        ref={islandRef}
        data-lenis-prevent
        style={{
          width,
          height,
          borderRadius: 28,
          // Collapsed: clip content so absolutley-positioned expanded menu
          // doesn't bleed through as ghost text/flags below the island.
          // Expanded: hidden (or auto if scrollable) to contain the panel.
          overflow: isExpanded ? (scrollable ? 'auto' : 'hidden') : 'hidden',
          overscrollBehavior: 'contain',
        }}
        className={`relative pointer-events-auto bg-black text-white shadow-[0_8px_40px_rgba(0,0,0,0.35)] ${
          isExpanded ? 'navbar-dropdown-scroll' : ''
        }`}
      >
        {/* Measured content is absolutely positioned so the container's animating
            height never constrains it - `contentRef` always reports the true
            natural height for the spring to chase. It's w-full so the header
            reflows continuously while `width` springs, making children slide. */}
        <motion.div ref={contentRef} style={{ width }} className="absolute top-0 left-0">
          <div className={isExpanded ? 'w-full p-6 sm:p-8' : 'w-full px-4 sm:px-6 py-2 sm:py-3'}>
          {/* ── HEADER ROW (persistent, slides into place) ── */}
          <div className="flex items-center justify-between w-full">
            {/* Logo - constant size, no reflow */}
            <Link
              href="/"
              onClick={isExpanded ? close : undefined}
              className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold tracking-tight text-white hover:opacity-85 transition-opacity flex-shrink-0"
            >
              <img src="/images/logos/Scholarhub_logo.png" alt="ScholarHub Logo" className="h-6 w-6 sm:h-7 sm:w-7 rounded-md object-cover" />
              <span>Scholar<span className="text-brand-accent">Hub</span></span>
            </Link>

            {/* Center links - compact only (instant, hidden behind the morph) */}
            {!isExpanded && (
              <div className="hidden sm:flex items-center space-x-4 md:space-x-6 mx-2 md:mx-4">
                <Link href="/scholarships" className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
                  Scholarships
                </Link>

                <div
                  ref={providerBtnRef}
                  className="relative"
                  onMouseEnter={handleProviderEnter}
                  onMouseLeave={handleProviderLeave}
                >
                  <button ref={providerButtonRef} className="flex items-center text-xs font-semibold text-white/80 hover:text-white transition-colors focus:outline-none cursor-pointer">
                    Providers <ChevronDown className="ml-0.5 h-3 w-3" />
                  </button>
                  {mounted && createPortal(
                    <div
                      className="fixed w-52 rounded-2xl bg-black shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-2 z-[9999]"
                      style={{
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        opacity: isProviderHovered ? 1 : 0,
                        pointerEvents: isProviderHovered ? 'auto' : 'none',
                        transform: `translateY(${isProviderHovered ? '0px' : '4px'})`,
                        transition: 'opacity 0.15s ease, transform 0.15s ease',
                      }}
                      onMouseEnter={handleProviderEnter}
                      onMouseLeave={handleProviderLeave}
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
                    </div>,
                    document.body
                  )}
                </div>

                <Link href="/about" className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
                  About
                </Link>
                {mounted && authenticated && (
                  <>
                    <Link href="/shortlist" className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
                      Shortlist
                    </Link>
                    <Link href="/profile" className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
                      Profile
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Right controls - slide with layout; icons swap instantly (no in/out) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              {ready && !authenticated && (
                <Link
                  href={`/login?next=${encodeURIComponent(pathname)}`}
                  className="hidden sm:inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black transition-opacity hover:opacity-85"
                >
                  Sign in
                </Link>
              )}

              {ready && authenticated && (
                <>
                  <Link
                    href="/shortlist"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-white/15"
                    title="View shortlist"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {slugs.size}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="hidden sm:grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </>
              )}

              {/* Slot A: search (compact/menu) ↔ menu (search) */}
              <button
                onClick={() => openMode(expandMode === 'search' ? 'menu' : 'search')}
                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer"
                aria-label={expandMode === 'search' ? 'Open menu' : 'Search'}
              >
                {expandMode === 'search' ? <Menu className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </button>

              {/* Slot B: menu (compact) ↔ close (expanded) */}
              <button
                onClick={() => (isExpanded ? close() : openMode('menu'))}
                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer"
                aria-label={isExpanded ? 'Close' : 'Open menu'}
              >
                {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* ── EXPANDED BODY ── */}
          {/* visibility:hidden collapses rendering immediately on close,
              preventing any ghost bleed while the height spring catches up. */}
          <div style={{ visibility: isExpanded ? 'visible' : 'hidden' }}>
          <AnimatePresence initial={false} mode="wait">
            {expandMode === 'search' && (
              <motion.div
                key="body-search"
                variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
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
                  <button onClick={() => openMode('menu')} className="underline underline-offset-2 hover:text-white/60 transition-colors cursor-pointer">
                    Browse all providers →
                  </button>
                </p>
              </motion.div>
            )}

            {expandMode === 'menu' && (
              <motion.div
                key="body-menu"
                variants={fade} initial="initial" animate="animate" exit="exit" transition={fadeTransition}
                className="border-t border-white/15 mt-4 pt-5 grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <div className="md:col-span-2">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3.5 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Browse By Country
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
                      {authenticated ? (
                        <>
                          <Link href="/shortlist" onClick={close} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold cursor-pointer">
                            <span>My Shortlist ({slugs.size})</span>
                            <ArrowRight className="h-3.5 w-3.5 text-white/50" />
                          </Link>
                          <Link href="/profile" onClick={close} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold cursor-pointer">
                            <span>Profile</span>
                            <ArrowRight className="h-3.5 w-3.5 text-white/50" />
                          </Link>
                          <button onClick={() => void signOut()} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left text-xs font-semibold cursor-pointer">
                            <span>Sign out</span>
                            <ArrowRight className="h-3.5 w-3.5 text-white/50" />
                          </button>
                        </>
                      ) : (
                        <Link href={`/login?next=${encodeURIComponent(pathname)}`} onClick={close} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold cursor-pointer">
                          <span>Sign in</span>
                          <ArrowRight className="h-3.5 w-3.5 text-white/50" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3">
                    <Info className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[10px] font-bold uppercase tracking-wider text-white mb-1">ScholarHub Directory</h6>
                      <p className="text-[10px] text-white/60 leading-relaxed">
                        Currently listing {allScholarships.length}+ international scholarships from {uniqueCountriesCount}+ countries. Use the search field above to find specific programs.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>{/* end visibility wrapper */}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

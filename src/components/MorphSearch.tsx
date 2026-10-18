'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  X,
  Compass,
  Bookmark,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { defaultFilter } from 'cmdk';
import { Badge } from '@/components/ui/badge';
import { providerMeta } from '@/lib/scholarships/providerMeta';
import { loadSearchItems, type SearchItem } from '@/lib/scholarships/searchIndex';
import { useShortlist } from '@/components/ShortlistProvider';
import { cn } from '@/lib/utils';

interface MorphSearchProps {
  className?: string;
}

type FilterTab = 'all' | 'fully-funded' | 'master' | 'bachelor' | 'phd';

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'fully-funded', label: 'Fully Funded' },
  { id: 'master', label: "Master's (S2)" },
  { id: 'bachelor', label: "Bachelor's (S1)" },
  { id: 'phd', label: 'PhD (S3)' },
];

const TOP_COUNTRIES = Object.entries(providerMeta).slice(0, 6).map(([slug, meta]) => ({
  slug,
  name: meta.name,
  country: meta.country,
  flag: meta.flag,
}));

export default function MorphSearch({ className }: MorphSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { slugs } = useShortlist();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scholarships, setScholarships] = useState<SearchItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Close search modal when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Pre-load full scholarships dataset on mount
  useEffect(() => {
    setMounted(true);
    loadSearchItems()
      .then((items) => setScholarships(items))
      .catch((err) => console.error('Failed to load search index:', err));
  }, []);

  const isMac = mounted && typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  // Global shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setSelectedIndex(0);
      setActiveTab('all');
    }
  }, [isOpen]);

  // Compute search matches with high-precision filtering
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    let items = scholarships;
    if (activeTab === 'fully-funded') {
      items = items.filter((s) => s.funding_type?.toLowerCase().includes('fully'));
    } else if (activeTab === 'master') {
      items = items.filter((s) => s.degree_levels?.some((d) => d.toLowerCase().includes('master')));
    } else if (activeTab === 'bachelor') {
      items = items.filter((s) => s.degree_levels?.some((d) => d.toLowerCase().includes('bachelor')));
    } else if (activeTab === 'phd') {
      items = items.filter((s) => s.degree_levels?.some((d) => d.toLowerCase().includes('phd') || d.toLowerCase().includes('doc')));
    }

    if (!q) {
      // Empty query: Show top 8 featured popular scholarships
      return items.slice(0, 8);
    }

    return items
      .map((item) => {
        const val = `${item.name} ${item.provider} ${item.country || ''} ${item.funding_type || ''} ${(item.degree_levels || []).join(' ')} ${item.slug}`.toLowerCase();
        if (val.includes(q)) return { item, score: 1 };
        if (q.length <= 2) return { item, score: 0 };
        const score = defaultFilter(val, q);
        return { item, score: score > 0.15 ? score : 0 };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  }, [scholarships, query, activeTab]);

  // Reset selection index when query or tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  // Auto-scroll selected element into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const selectedEl = listRef.current.querySelector('[data-selected="true"]');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen]);

  const navigateTo = useCallback(
    (href: string) => {
      setIsOpen(false);
      router.push(href);
    },
    [router]
  );

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = searchResults[selectedIndex];
      if (current) {
        navigateTo(`/scholarships/${current.slug}`);
      }
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* ── 1. COLLAPSED TRIGGER PILL (In Navbar) ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative hidden sm:flex items-center h-9 w-44 md:w-52 lg:w-64 pl-8.5 pr-2.5 rounded-full border border-brand-border/80 bg-white/80 hover:bg-white text-xs text-brand-muted hover:text-brand-dark transition-all shadow-2xs cursor-pointer group hover:border-brand-dark/20 active:scale-[0.98]"
          aria-label="Open search"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-muted group-hover:text-brand-accent transition-colors pointer-events-none" />
          <span className="truncate text-brand-muted/80 group-hover:text-brand-dark transition-colors">
            Search scholarships...
          </span>
          <kbd className="ml-auto flex items-center gap-0.5 rounded-md border border-brand-border bg-brand-cream/90 px-1.5 py-0.5 font-mono text-[10px] text-brand-muted font-medium group-hover:border-brand-dark/30 group-hover:text-brand-dark transition-colors shadow-2xs">
            {isMac ? '⌘K' : 'Ctrl K'}
          </kbd>
        </button>
      )}

      {/* Mobile Icon Trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="sm:hidden h-9 w-9 flex items-center justify-center rounded-full text-brand-dark hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
        </button>
      )}

      {/* ── 2. EXPANDED MORPHED SEARCH SURFACE & BACKDROP ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div key="morph-search-overlay">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm"
                style={{ willChange: 'opacity' }}
              />

              {/* Morphed Floating Surface */}
              <div className="fixed inset-x-0 top-3 sm:top-5 z-[101] flex justify-center px-3 sm:px-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.8 }}
                  className="w-full max-w-2xl bg-brand-bg/98 backdrop-blur-2xl border border-brand-border/90 rounded-2xl shadow-2xl shadow-brand-dark/20 overflow-hidden pointer-events-auto ring-1 ring-black/5 flex flex-col max-h-[85vh]"
                >
                {/* Search Input Bar */}
                <div className="relative flex items-center px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-brand-border/60">
                  <Search className="mr-2.5 sm:mr-3 h-4 w-4 text-brand-accent flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Search scholarships, countries..."
                    className="w-full bg-transparent text-sm font-medium text-brand-dark placeholder:text-brand-muted/70 outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mr-1 sm:mr-2 p-1 rounded-md text-brand-muted hover:text-brand-dark hover:bg-black/5 transition-colors cursor-pointer flex-shrink-0"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {/* Desktop ESC shortcut hint */}
                  <kbd
                    onClick={() => setIsOpen(false)}
                    className="hidden sm:inline-flex rounded border border-brand-border bg-brand-cream/80 px-1.5 py-0.5 font-mono text-[10px] text-brand-muted font-medium hover:border-brand-dark/30 hover:text-brand-dark transition-colors cursor-pointer shadow-2xs flex-shrink-0"
                  >
                    esc
                  </kbd>
                  {/* Mobile dedicated close button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="sm:hidden p-1 -mr-1 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-black/5 transition-colors cursor-pointer flex-shrink-0"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Filter Tabs Chips */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-brand-border/40 overflow-x-auto navbar-dropdown-scroll bg-brand-cream/30">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap',
                        activeTab === tab.id
                          ? 'bg-brand-dark text-white shadow-xs'
                          : 'text-brand-muted hover:text-brand-dark hover:bg-black/5'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Morphed Scrollable Results Panel */}
                <div
                  ref={listRef}
                  className="overflow-y-auto p-2 space-y-1 max-h-[360px] navbar-dropdown-scroll"
                >
                  {/* Results List */}
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center justify-between">
                        <span>
                          {query
                            ? `Matches (${searchResults.length})`
                            : activeTab === 'all'
                            ? 'Featured Programs'
                            : `Filtered Programs (${searchResults.length})`}
                        </span>
                        <span className="hidden sm:inline text-[9px] font-normal lowercase tracking-normal text-brand-muted/80">
                          use ↑↓ to select
                        </span>
                      </div>

                      {searchResults.map((s, idx) => {
                        const isSelected = idx === selectedIndex;
                        return (
                          <div
                            key={s.slug}
                            data-selected={isSelected ? 'true' : 'false'}
                            onClick={() => navigateTo(`/scholarships/${s.slug}`)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                              'group relative flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs transition-all duration-100',
                              isSelected
                                ? 'sm:bg-[#ECE8E0] sm:shadow-2xs text-brand-dark'
                                : 'text-brand-dark hover:bg-black/5 active:bg-black/5'
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  'truncate font-semibold transition-colors',
                                  isSelected ? 'sm:text-brand-accent text-brand-dark' : 'text-brand-dark'
                                )}
                              >
                                {s.name}
                              </p>
                              <p className="truncate text-[10px] text-brand-muted mt-0.5">
                                {s.provider} {s.country ? `· ${s.country}` : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {s.funding_type && (
                                <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-muted font-medium">
                                  {s.funding_type}
                                </span>
                              )}
                              {s.degree_levels?.[0] && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1.5 py-0 h-4 border-brand-border capitalize"
                                >
                                  {s.degree_levels[0]}
                                </Badge>
                              )}
                              {isSelected && (
                                <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-brand-accent ml-1 animate-in fade-in duration-150">
                                  <span className="text-[10px] font-medium text-brand-accent/90">Open</span>
                                  <kbd className="inline-flex items-center justify-center min-w-4 h-4.5 px-1 rounded border border-brand-accent/30 bg-white/90 font-mono text-[10px] text-brand-accent shadow-2xs font-bold leading-none">
                                    ↵
                                  </kbd>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-brand-muted">
                      No scholarships found for &ldquo;{query}&rdquo;. Try another country, degree, or provider.
                    </div>
                  )}

                  {/* Quick Shortcuts & Destinations (when query is empty) */}
                  {!query && (
                    <div className="pt-2 mt-2 border-t border-brand-border/40">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                        Quick Shortcuts
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => navigateTo('/match')}
                          className="flex items-center gap-2 p-2 rounded-xl border border-brand-border/50 bg-white/50 hover:bg-white hover:border-brand-accent/30 text-left transition-all cursor-pointer group"
                        >
                          <div className="h-6 w-6 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center flex-shrink-0">
                            <Compass className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-brand-dark group-hover:text-brand-accent truncate">
                              ScholarMatch Quiz
                            </p>
                            <p className="text-[9px] text-brand-muted">Tailored matches (30s)</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigateTo('/shortlist')}
                          className="flex items-center gap-2 p-2 rounded-xl border border-brand-border/50 bg-white/50 hover:bg-white hover:border-brand-accent/30 text-left transition-all cursor-pointer group"
                        >
                          <div className="h-6 w-6 rounded-lg bg-brand-dark/5 text-brand-dark flex items-center justify-center flex-shrink-0">
                            <Bookmark className="h-3.5 w-3.5 text-brand-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-brand-dark group-hover:text-brand-accent truncate">
                              Application Tracker
                            </p>
                            <p className="text-[9px] text-brand-muted">
                              {slugs.size > 0 ? `${slugs.size} saved items` : 'Manage deadlines'}
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* Top Destinations */}
                      <div className="px-2 py-1 mt-2 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                        Popular Destinations
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 p-1">
                        {TOP_COUNTRIES.map((c) => (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => navigateTo(`/providers/${c.slug}`)}
                            className="flex items-center gap-2 p-1.5 rounded-lg border border-brand-border/40 bg-white/40 hover:bg-white hover:border-brand-accent/30 text-left transition-all cursor-pointer group"
                          >
                            <span className="text-base">{c.flag}</span>
                            <span className="text-xs font-medium text-brand-dark group-hover:text-brand-accent truncate">
                              {c.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Keyboard Hints (Desktop only) */}
                <div className="hidden sm:flex items-center justify-between border-t border-brand-border/60 bg-brand-cream/50 px-4 py-2.5 text-[10px] text-brand-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-brand-border bg-white px-1 py-0.5 font-mono text-[9px] shadow-2xs">
                        ↑↓
                      </kbd>{' '}
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-brand-border bg-white px-1 py-0.5 font-mono text-[9px] shadow-2xs">
                        ↵
                      </kbd>{' '}
                      open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-brand-border bg-white px-1 py-0.5 font-mono text-[9px] shadow-2xs">
                        esc
                      </kbd>{' '}
                      collapse
                    </span>
                  </div>
                  <span className="font-semibold text-brand-dark/70">
                    Scholar<span className="text-brand-accent">Hub</span> Morph Search
                  </span>
                </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

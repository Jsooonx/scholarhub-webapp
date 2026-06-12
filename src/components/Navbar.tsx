'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, ArrowRight, Globe, GraduationCap, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExpandMode = 'search' | 'menu' | null;

export default function Navbar() {
  const [expandMode, setExpandMode] = useState<ExpandMode>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProviderHovered, setIsProviderHovered] = useState(false);
  const router = useRouter();
  const islandRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isExpanded = expandMode !== null;

  // Close island when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (islandRef.current && !islandRef.current.contains(event.target as Node)) {
        setExpandMode(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when entering search mode
  useEffect(() => {
    if (expandMode === 'search') {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [expandMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/scholarships?q=${encodeURIComponent(searchQuery.trim())}`);
      setExpandMode(null);
      setSearchQuery('');
    }
  };

  const close = () => setExpandMode(null);

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

  return (
    <div className="sticky top-0 z-50 w-full pointer-events-none h-20 sm:h-24 flex items-start justify-center pt-3 sm:pt-4 overflow-visible">
      <motion.div
        ref={islandRef}
        layout="size"
        style={{ borderRadius: 28 }}
        transition={{
          layout: { type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.45 },
        }}
        className={`relative pointer-events-auto bg-brand-dark/95 backdrop-blur-md border border-white/10 shadow-2xl text-white ${
          isExpanded
            ? 'w-[92vw] max-w-3xl p-6 sm:p-8 overflow-hidden'
            : 'w-[90vw] max-w-sm sm:max-w-xl px-4 sm:px-6 py-2 sm:py-3 overflow-visible'
        }`}
      >
        {/* ── COMPACT STATE ── */}
        {!isExpanded && (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex items-center justify-between w-full"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold tracking-tight text-white hover:opacity-85 transition-opacity flex-shrink-0">
              <img src="/images/logos/Scholarhub_logo.png" alt="ScholarHub Logo" className="h-6 w-6 rounded-md object-cover" />
              <span>Scholar<span className="text-brand-accent">Hub</span></span>
            </Link>

            {/* Desktop Center Links */}
            <div className="hidden sm:flex items-center space-x-6 mx-4">
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
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl bg-brand-dark border border-white/10 shadow-2xl p-2 z-50"
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
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              {/* Search trigger */}
              <button
                onClick={() => setExpandMode('search')}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              {/* Menu trigger */}
              <button
                onClick={() => setExpandMode('menu')}
                className="p-1.5 sm:p-2 bg-white/15 hover:bg-white/20 text-white rounded-full transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SEARCH MODE ── */}
        {expandMode === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex flex-col w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-5">
              <Link href="/" onClick={close} className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-bold tracking-tight text-white hover:opacity-85 transition-opacity">
                <img src="/images/logos/Scholarhub_logo.png" alt="ScholarHub Logo" className="h-7 w-7 rounded-md object-cover" />
                <span>Scholar<span className="text-brand-accent">Hub</span></span>
              </Link>
              <div className="flex items-center gap-2">
                {/* Switch to menu mode */}
                <button
                  onClick={() => setExpandMode('menu')}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <button onClick={close} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search bar */}
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

            {/* Quick hint */}
            <p className="mt-3 text-[11px] text-white/35 text-center">
              Press Enter to search · <button onClick={() => setExpandMode('menu')} className="underline underline-offset-2 hover:text-white/60 transition-colors cursor-pointer">Browse all providers →</button>
            </p>
          </motion.div>
        )}

        {/* ── MENU MODE ── */}
        {expandMode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.12 }}
            className="flex flex-col w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
              <Link href="/" onClick={close} className="flex items-center gap-2.5 font-serif text-xl sm:text-2xl font-bold tracking-tight text-white hover:opacity-85 transition-opacity">
                <img src="/images/logos/Scholarhub_logo.png" alt="ScholarHub Logo" className="h-7 w-7 rounded-md object-cover" />
                <span>Scholar<span className="text-brand-accent">Hub</span></span>
              </Link>
              <div className="flex items-center gap-2">
                {/* Switch to search mode */}
                <button
                  onClick={() => setExpandMode('search')}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button onClick={close} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/85 hover:text-white cursor-pointer" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Directory Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Providers (2 cols) */}
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

              {/* Quick Links (1 col) */}
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

                {/* Info box */}
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
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}

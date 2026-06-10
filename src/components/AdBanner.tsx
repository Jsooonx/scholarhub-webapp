'use client';

import Link from 'next/link';
import { allScholarships } from '@/lib/scholarships';

const providers = [
  { flag: '🇩🇪', name: 'DAAD', country: 'Germany', href: '/providers/daad' },
  { flag: '🇯🇵', name: 'MEXT', country: 'Japan', href: '/providers/mext' },
  { flag: '🇹🇷', name: 'Türkiye Burslari', country: 'Turkey', href: '/providers/turkiye' },
  { flag: '🇬🇧', name: 'Chevening', country: 'United Kingdom', href: '/providers/chevening' },
  { flag: '🇦🇺', name: 'Australia Awards', country: 'Australia', href: '/providers/australia-awards' },
  { flag: '🇰🇷', name: 'GKS Korea', country: 'South Korea', href: '/providers/gks' },
  { flag: '🇫🇷', name: 'Eiffel - France', country: 'France', href: '/providers/eiffel' },
  { flag: '🇸🇬', name: 'Singapore', country: 'Singapore', href: '/providers/singapore' },
  { flag: '🇨🇦', name: 'Canada CRTAS', country: 'Canada', href: '/providers/canada' },
];

export default function AdBanner() {
  const total = allScholarships.length;

  return (
    <section className="py-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-brand-dark overflow-hidden border border-brand-border/20 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Decorative backdrop gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-16 -mb-16" />

          {/* Left Text Content */}
          <div className="relative z-10 max-w-xl text-center lg:text-left flex-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 mb-4 uppercase tracking-widest">
              Don&apos;t miss out
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
              {total} Scholarships. One place.
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              From DAAD research grants to Chevening, Australia Awards, GKS Korea, MEXT, Eiffel France, Singapore (NUS/A*STAR), and Canada CRTAS - all curated, structured, and ready to browse.
            </p>
            <Link
              href="/scholarships"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-xs font-semibold rounded-full text-brand-dark bg-white hover:bg-white/90 transition-colors duration-200"
            >
              Browse all scholarships
            </Link>
          </div>

          {/* Right: Provider Flags - 3 columns */}
          <div className="relative z-10 flex-1 w-full max-w-md lg:max-w-none flex items-center justify-center lg:justify-end">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {providers.map((p) => (
                <Link
                  key={p.name}
                  href={p.href}
                  className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2.5 hover:bg-white/15 transition-colors min-w-0"
                >
                  <span className="text-xl flex-shrink-0" role="img" aria-label={p.country}>{p.flag}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-white/60 truncate">{p.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

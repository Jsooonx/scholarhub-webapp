'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { allScholarships, providerMeta } from '@/lib/scholarships';
import SplitText from '@/components/SplitText';
import BorderGlow from './BorderGlow/BorderGlow';
import { LinkButton } from '@/components/ui/button';

const providers = Object.entries(providerMeta).map(([slug, meta]) => ({
  flag: meta.flag,
  name: meta.name,
  country: meta.country,
  href: `/providers/${slug}`,
}));

export default function AdBanner() {
  const total = allScholarships.length;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BorderGlow
          edgeSensitivity={30}
          glowColor="243 54% 50%"
          backgroundColor="#111827"
          borderRadius={24}
          glowRadius={40}
          glowIntensity={1.0}
          coneSpread={25}
          animated={true}
          looping={true}
          colors={['#3730A3', '#831843', '#C27E3A']}
          className="w-full border border-brand-border/20"
        >
          <div className="w-full p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">

            {/* Decorative backdrop gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            {/* Left Text Content */}
            <div className="relative z-10 max-w-xl text-center lg:text-left flex-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 mb-4 uppercase tracking-widest">
                Don&apos;t miss out
              </span>
              <SplitText
                text={`${total} Scholarships. One place.`}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight"
                tag="h3"
                delay={30}
                duration={0.6}
                ease="power2.out"
                threshold={0.1}
              />
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                From Germany and Japan to the United Kingdom, France, Australia, South Korea, and more - 25 countries with curated scholarships, structured and ready to browse.
              </p>
              <LinkButton
                href="/scholarships"
                variant="secondary"
                size="lg"
                className="border-transparent shadow-none hover:border-transparent hover:bg-brand-cream"
              >
                Browse all scholarships
              </LinkButton>
            </div>

            {/* Right: Provider Flags - 3 columns, wheel-scrollable */}
            <div className="relative z-10 flex-1 w-full max-w-md lg:max-w-none flex items-center justify-center lg:justify-end">
              <div
                ref={scrollRef}
                data-lenis-prevent
                className="w-full overflow-y-auto pr-0.5"
                style={{
                  maxHeight: '11.5rem',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.2) transparent',
                }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {providers.map((p) => (
                    <Link
                      key={p.href}
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
        </BorderGlow>
      </div>
    </section>
  );
}

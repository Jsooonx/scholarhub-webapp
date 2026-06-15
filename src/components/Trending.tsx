'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { allScholarships, providerGroup, getScholarshipImage } from '@/lib/scholarships';

const flagMap: Record<string, string> = {
  daad: '🇩🇪', studienstiftung: '🇩🇪', mext: '🇯🇵', turkiye: '🇹🇷',
  chevening: '🇬🇧', 'gates-cambridge': '🇬🇧', clarendon: '🇬🇧', rhodes: '🇬🇧',
  netherlands: '🇳🇱', 'australia-awards': '🇦🇺', gks: '🇰🇷',
  eiffel: '🇫🇷', singapore: '🇸🇬', canada: '🇨🇦',
  astar: '🇸🇬', jasso: '🇯🇵', koica: '🇰🇷', cpra: '🇨🇦',
  fulbright: '🇺🇸', 'belgium-vlir': '🇧🇪', 'erasmus-mundus': '🇪🇺',
};

const PROVIDER_LABELS: Record<string, string> = {
  daad: 'DAAD - Germany',
  studienstiftung: 'Studienstiftung - Germany',
  mext: 'MEXT - Japan',
  turkiye: 'Türkiye Burslari',
  chevening: 'Chevening - UK',
  'gates-cambridge': 'Gates Cambridge - UK',
  clarendon: 'Clarendon Fund - Oxford',
  rhodes: 'Rhodes Scholarship',
  netherlands: 'Netherlands Scholarships',
  'australia-awards': 'Australia Awards',
  gks: 'GKS - South Korea',
  eiffel: 'Eiffel - France',
  singapore: 'Singapore (NUS/NTU/A*STAR)',
  fulbright: 'Fulbright / AMINEF - USA',
  'belgium-vlir': 'VLIR-UOS - Belgium',
  'erasmus-mundus': 'Erasmus Mundus - EU',
  astar: 'A*STAR - Singapore',
  jasso: 'JASSO - Japan',
  koica: 'KOICA - South Korea',
  cpra: 'Canada CPRA',
};

// All provider groups — add new ones here as providers are added
const ALL_PROVIDER_GROUPS = [
  // Page 1
  'daad', 'mext', 'turkiye',
  'chevening', 'australia-awards', 'gks',
  'eiffel', 'singapore', 'netherlands',
  // Page 2
  'studienstiftung', 'gates-cambridge', 'canada',
  'clarendon', 'rhodes', 'jasso',
  'koica', 'cpra',
  // Page 3 - new providers
  'fulbright', 'belgium-vlir', 'erasmus-mundus',
];

const byGroup = Object.fromEntries(
  ALL_PROVIDER_GROUPS.map((g) => [
    g,
    allScholarships.filter((s) => providerGroup(s.provider) === g),
  ])
);

// Mobile: fixed first 9 (matches page 1)
const MOBILE_GROUPS = ALL_PROVIDER_GROUPS.slice(0, 9);

// Desktop: paginated, 9 per page
const DESKTOP_PER_PAGE = 9;
const totalPages = Math.ceil(ALL_PROVIDER_GROUPS.length / DESKTOP_PER_PAGE);

function ProviderCard({ group }: { group: string }) {
  const list = byGroup[group] ?? [];
  const flag = flagMap[group] ?? '🌍';
  const label = PROVIDER_LABELS[group] ?? group;
  const featured = list[0];
  const rest = list.slice(1, 3);

  return (
    <div className="flex flex-col gap-4">
      {/* Provider header */}
      <div className="flex items-center gap-2">
        <span className="text-lg" role="img" aria-label={label}>{flag}</span>
        <Link
          href={`/providers/${group}`}
          className="text-xs font-bold uppercase tracking-wider text-brand-muted hover:text-brand-dark transition-colors"
        >
          {label}
        </Link>
      </div>

      {/* Featured card */}
      {featured ? (
        <Link href={`/scholarships/${featured.slug}`} className="group cursor-pointer">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-brand-border mb-3">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${getScholarshipImage(featured)}')` }}
            />
            <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-cream text-brand-dark border border-brand-border shadow-sm z-10">
              {featured.degree_levels[0] ?? 'Various'}
            </span>
          </div>
          <h3 className="font-serif text-base font-semibold text-brand-dark mb-1 group-hover:underline line-clamp-2">
            {featured.name}
          </h3>
          <p className="text-[11px] text-brand-muted">{featured.funding_type}</p>
        </Link>
      ) : (
        /* Empty state for providers with no scholarships yet */
        <div className="rounded-2xl aspect-[16/10] border border-dashed border-brand-border bg-brand-cream/40 flex items-center justify-center">
          <p className="text-[11px] text-brand-muted">Coming soon</p>
        </div>
      )}

      {/* Sub-list */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-3 pt-3 border-t border-brand-border">
          {rest.map((s) => (
            <Link key={s.slug} href={`/scholarships/${s.slug}`} className="flex gap-3 group cursor-pointer">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-cover bg-center border border-brand-border"
                style={{ backgroundImage: `url('${getScholarshipImage(s)}')` }}
              />
              <div className="flex flex-col justify-center min-w-0">
                <h4 className="text-[11px] font-semibold text-brand-dark line-clamp-2 leading-snug group-hover:underline">
                  {s.name}
                </h4>
                <p className="text-[9px] text-brand-muted mt-0.5">{s.degree_levels[0] ?? 'Various'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* View all CTA */}
      <Link
        href={`/providers/${group}`}
        className="text-xs font-medium text-brand-accent hover:underline"
      >
        View all {list.length} scholarships →
      </Link>
    </div>
  );
}

function ProviderGrid({ groups }: { groups: string[] }) {
  // Pad to 9 so the grid always stays consistent height
  const padded = [...groups];
  while (padded.length < DESKTOP_PER_PAGE) padded.push('__empty__' + padded.length);

  return (
    <div className="grid grid-cols-3 gap-8">
      {padded.map((g, i) => {
        const isReal = !g.startsWith('__empty__');
        const isMid = i % 3 === 1;
        return (
          <div
            key={g}
            className={isMid ? 'border-x border-brand-border px-8' : ''}
          >
            {isReal ? (
              <ProviderCard group={g} />
            ) : (
              /* invisible spacer so grid height stays stable */
              <div className="invisible">
                <ProviderCard group={groups[0]} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Trending() {
  const [page, setPage] = useState(0);

  const desktopGroups = ALL_PROVIDER_GROUPS.slice(
    page * DESKTOP_PER_PAGE,
    page * DESKTOP_PER_PAGE + DESKTOP_PER_PAGE,
  );

  return (
    <section className="py-12 border-t border-brand-border bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-dark">
            By provider
          </h2>

          {/* Desktop: pagination controls */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-brand-muted tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous page"
                className="p-1.5 rounded-full border border-brand-border text-brand-muted hover:text-brand-dark hover:bg-brand-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next page"
                className="p-1.5 rounded-full border border-brand-border text-brand-muted hover:text-brand-dark hover:bg-brand-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <Link
              href="/scholarships"
              className="text-xs font-medium text-brand-muted hover:text-brand-dark transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* Mobile: view all link only */}
          <Link
            href="/scholarships"
            className="md:hidden text-xs font-medium text-brand-muted hover:text-brand-dark transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* ── DESKTOP: paginated 3×3 grid with fade transition ── */}
        <div className="hidden md:block">
          <div
            key={page}
            className="animate-fade-in"
          >
            {/* Row 1 */}
            <ProviderGrid groups={desktopGroups} />
          </div>

          {/* Page dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === page
                      ? 'w-6 bg-brand-dark'
                      : 'w-1.5 bg-brand-border hover:bg-brand-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* View all providers link */}
          <div className="border-t border-brand-border mt-10 pt-6 flex justify-end">
            <Link
              href="/scholarships"
              className="text-xs font-medium text-brand-muted hover:text-brand-dark transition-colors"
            >
              View all {allScholarships.length} scholarships →
            </Link>
          </div>
        </div>

        {/* ── MOBILE: fixed first 9 providers, stacked ── */}
        <div className="md:hidden flex flex-col gap-10">
          {MOBILE_GROUPS.map((g, i) => (
            <div key={g}>
              <ProviderCard group={g} />
              {i < MOBILE_GROUPS.length - 1 && (
                <div className="border-t border-brand-border mt-10" />
              )}
            </div>
          ))}
          <div className="pt-2 flex justify-center">
            <Link
              href="/scholarships"
              className="inline-flex items-center justify-center px-6 py-2.5 border border-brand-border rounded-full text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
            >
              View all providers →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

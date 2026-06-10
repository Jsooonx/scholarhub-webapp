'use client';

import Link from 'next/link';
import { allScholarships, providerGroup } from '@/lib/scholarships';

const flagMap: Record<string, string> = {
  daad: '🇩🇪', mext: '🇯🇵', turkiye: '🇹🇷',
  chevening: '🇬🇧', 'australia-awards': '🇦🇺', gks: '🇰🇷',
  eiffel: '🇫🇷', singapore: '🇸🇬', canada: '🇨🇦',
};

const PROVIDER_IMAGES: Record<string, string> = {
  daad: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=700&q=80',
  mext: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=700&q=80',
  turkiye: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=700&q=80',
  chevening: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
  'australia-awards': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=700&q=80',
  gks: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?auto=format&fit=crop&w=700&q=80',
  eiffel: '/images/universities/france_paris.png',
  singapore: '/images/universities/singapore_nus.png',
  canada: '/images/universities/canada_toronto.png',
};

const PROVIDER_LABELS: Record<string, string> = {
  daad: 'DAAD - Germany',
  mext: 'MEXT - Japan',
  turkiye: 'Türkiye Burslari',
  chevening: 'Chevening - UK',
  'australia-awards': 'Australia Awards',
  gks: 'GKS - South Korea',
  eiffel: 'Eiffel - France',
  singapore: 'Singapore (NUS/NTU/A*STAR)',
  canada: 'Canada CRTAS',
};

// Build a featured list per provider: first 3 each for the 9 groups
const PROVIDER_GROUPS = ['daad', 'mext', 'turkiye', 'chevening', 'australia-awards', 'gks', 'eiffel', 'singapore', 'canada'];

const byGroup = Object.fromEntries(
  PROVIDER_GROUPS.map((g) => [
    g,
    allScholarships.filter((s) => providerGroup(s.provider) === g),
  ])
);

const topRow = ['daad', 'mext', 'turkiye'] as const;
const bottomRow = ['chevening', 'australia-awards', 'gks'] as const;
const thirdRow = ['eiffel', 'singapore', 'canada'] as const;

function ProviderCard({ group }: { group: string }) {
  const list = byGroup[group] ?? [];
  const flag = flagMap[group] ?? '🌍';
  const label = PROVIDER_LABELS[group] ?? group;
  const img = PROVIDER_IMAGES[group] ?? '';
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
      {featured && (
        <Link href={`/scholarships/${featured.slug}`} className="group cursor-pointer">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-brand-border mb-3">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${img}')` }}
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
      )}

      {/* List of rest */}
      <div className="flex flex-col gap-3 pt-3 border-t border-brand-border">
        {rest.map((s) => (
          <Link key={s.slug} href={`/scholarships/${s.slug}`} className="flex gap-3 group cursor-pointer">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-cover bg-center border border-brand-border"
              style={{ backgroundImage: `url('${img}')` }}
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

export default function Trending() {
  return (
    <section className="py-12 border-t border-brand-border bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-dark">
            By provider
          </h2>
          <Link href="/scholarships" className="text-xs font-medium text-brand-muted hover:text-brand-dark transition-colors">
            View all →
          </Link>
        </div>

        {/* Top row - 3 featured providers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {topRow.map((g, i) => (
            <div
              key={g}
              className={i === 1 ? 'md:border-x md:border-brand-border md:px-8' : ''}
            >
              <ProviderCard group={g} />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-brand-border mb-10" />

        {/* Middle row - 3 more providers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {bottomRow.map((g, i) => (
            <div
              key={g}
              className={i === 1 ? 'md:border-x md:border-brand-border md:px-8' : ''}
            >
              <ProviderCard group={g} />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-brand-border mb-10" />

        {/* Bottom row - 3 more providers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {thirdRow.map((g, i) => (
            <div
              key={g}
              className={i === 1 ? 'md:border-x md:border-brand-border md:px-8' : ''}
            >
              <ProviderCard group={g} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { allScholarships, providerGroup } from '@/lib/scholarships';

const flagMap: Record<string, string> = {
  daad: '🇩🇪', mext: '🇯🇵', turkiye: '🇹🇷',
  chevening: '🇬🇧', 'australia-awards': '🇦🇺', gks: '🇰🇷',
  eiffel: '🇫🇷', singapore: '🇸🇬', canada: '🇨🇦'
};

const CARD_IMAGES: Record<string, string> = {
  daad: '/images/universities/study_germany.jpg',
  mext: '/images/universities/study_japan.jpg',
  turkiye: '/images/universities/turkey_istanbul.jpg',
  chevening: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
  'australia-awards': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=700&q=80',
  gks: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?auto=format&fit=crop&w=700&q=80',
  eiffel: '/images/universities/france_paris.png',
  singapore: '/images/universities/singapore_nus.png',
  canada: '/images/universities/canada_toronto.png',
};

const FILTER_LINKS = [
  { name: 'Fully Funded', image: '/images/editorial/fully_funded.jpg', href: '/scholarships?funding=fully' },
  { name: 'Partial', image: '/images/editorial/partial.jpg', href: '/scholarships?funding=partial' },
  { name: 'Bachelor', image: '/images/editorial/bachelor.jpg', href: '/scholarships?level=bachelor' },
  { name: 'Master / PhD', image: '/images/editorial/master_phd.jpg', href: '/scholarships?level=master' },
  { name: 'STEM', image: '/images/editorial/stem.jpg', href: '/scholarships?q=stem' },
  { name: 'Arts', image: '/images/editorial/arts.jpg', href: '/scholarships?q=arts' },
];

// Pick the main (MEXT bachelor) and 4 side scholarships from real data
const mextGroup = allScholarships.filter((s) => providerGroup(s.provider) === 'mext');
const mainScholarship = mextGroup[0];

// Side: 2 DAAD + 1 MEXT + 1 Turkiye
const sideScholarships = [
  allScholarships.filter((s) => providerGroup(s.provider) === 'daad')[0],
  allScholarships.filter((s) => providerGroup(s.provider) === 'turkiye')[0],
  allScholarships.filter((s) => providerGroup(s.provider) === 'daad')[1],
  allScholarships.filter((s) => providerGroup(s.provider) === 'mext')[1] ?? mextGroup[0],
].filter(Boolean);

function cleanDescription(raw: string | null): string {
  if (!raw) return '';
  return raw
    .replace(/^halaman\s+\S+[\s\S]*?#+\s*/i, '')  // strip MEXT header noise
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200);
}

export default function EditorsPick() {
  if (!mainScholarship) return null;
  const mainGroup = providerGroup(mainScholarship.provider);

  return (
    <section className="py-12 border-t border-brand-border bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-dark mb-8">
          Editor&apos;s pick
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Main Featured */}
          <Link href={`/scholarships/${mainScholarship.slug}`} className="lg:col-span-5 flex flex-col group cursor-pointer">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-brand-border mb-4">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${CARD_IMAGES[mainGroup]}')` }}
              />
              <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-dark text-white shadow-sm z-10">
                {flagMap[mainGroup]} {mainScholarship.provider.split('/')[0].trim()}
              </span>
              <span className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-white shadow-sm z-10">
                {mainScholarship.funding_type}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-brand-muted mb-2 font-medium">
              <span>{mainScholarship.country ?? 'International'}</span>
              <span>•</span>
              <span>{mainScholarship.degree_levels[0] ?? 'Various'}</span>
            </div>

            <h3 className="font-serif text-2xl font-semibold text-brand-dark mb-3 leading-snug group-hover:underline">
              {mainScholarship.name}
            </h3>

            <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
              {cleanDescription(mainScholarship.description)}
            </p>
          </Link>

          {/* Middle: Side list */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:border-x lg:border-brand-border lg:px-6">
            {sideScholarships.map((s) => {
              const g = providerGroup(s.provider);
              return (
                <Link
                  key={s.slug}
                  href={`/scholarships/${s.slug}`}
                  className="flex gap-4 group cursor-pointer pb-6 border-b border-brand-border last:border-b-0 last:pb-0"
                >
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-cover bg-center border border-brand-border"
                    style={{ backgroundImage: `url('${CARD_IMAGES[g]}')` }}
                  />
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-brand-muted mb-1">
                      {flagMap[g]} {s.provider.split('/')[0].trim()} · {s.degree_levels[0] ?? 'Various'}
                    </span>
                    <h4 className="text-xs font-semibold text-brand-dark line-clamp-2 leading-snug group-hover:underline">
                      {s.name}
                    </h4>
                    <p className="text-[10px] text-brand-accent font-medium mt-1">{s.funding_type}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right: How it works + browse by type */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="bg-brand-cream border border-brand-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-brand-dark/5 rounded-lg border border-brand-border text-brand-dark">
                  <Bookmark className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark">How it works</span>
              </div>
              <h4 className="font-serif text-sm font-semibold text-brand-dark mb-2">
                Find your scholarship in 3 steps
              </h4>
              <ol className="space-y-2 text-[11px] text-brand-muted leading-relaxed">
                <li className="flex gap-2"><span className="font-bold text-brand-dark">1.</span> Browse by country, level, or funding type</li>
                <li className="flex gap-2"><span className="font-bold text-brand-dark">2.</span> Read full requirements and benefits</li>
                <li className="flex gap-2"><span className="font-bold text-brand-dark">3.</span> Apply directly on the official website</li>
              </ol>
            </div>

            <div>
              <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">Browse by type</h4>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_LINKS.map((type) => (
                  <Link
                    key={type.name}
                    href={type.href}
                    className="relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer border border-brand-border"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${type.image}')` }}
                    />
                    <div className="absolute inset-0 bg-black/55 group-hover:bg-black/60 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                      <span className="text-[10px] sm:text-xs font-semibold text-white tracking-wide uppercase">
                        {type.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

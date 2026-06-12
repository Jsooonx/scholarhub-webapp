'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { allScholarships, providerGroup, getScholarshipImage } from '@/lib/scholarships';

const flagMap: Record<string, string> = {
  daad: '🇩🇪', mext: '🇯🇵', turkiye: '🇹🇷',
  chevening: '🇬🇧', 'australia-awards': '🇦🇺', gks: '🇰🇷',
  eiffel: '🇫🇷', singapore: '🇸🇬', canada: '🇨🇦'
};

function cleanDescription(raw: string | null): string {
  if (!raw) return 'No description available.';
  return raw
    .replace(/^halaman\s+\S+[\s\S]*?#+\s*/i, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 220);
}

// Show latest - one per provider group, cycling through to ensure variety
const latest = (() => {
  const groups = ['daad', 'mext', 'turkiye', 'eiffel', 'singapore', 'canada'];
  return groups
    .map((g) => {
      const pool = allScholarships.filter((s) => providerGroup(s.provider) === g);
      return pool[0];
    })
    .filter(Boolean);
})();

export default function LatestPosts() {
  return (
    <section className="py-12 border-t border-brand-border bg-brand-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-dark mb-8">
          Latest additions
        </h2>

        <div className="flex flex-col gap-8">
          {latest.map((s, idx) => {
            const g = providerGroup(s.provider);
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Link
                  href={`/scholarships/${s.slug}`}
                  className="flex flex-col md:flex-row gap-6 md:items-center group cursor-pointer pb-8 border-b border-brand-border last:border-b-0 last:pb-0"
                >
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-brand-border">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url('${getScholarshipImage(s)}')` }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center flex-wrap gap-2 mb-2.5">
                      <span className="text-xs font-semibold text-brand-dark">{flagMap[g]} {s.provider.split('/')[0].trim()}</span>
                      <span className="text-[10px] text-brand-muted">•</span>
                      <span className="text-xs text-brand-muted">{s.country ?? 'International'}</span>
                      <span className="text-[10px] text-brand-muted">•</span>
                      <span className="text-xs font-semibold text-brand-accent">{s.funding_type}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark mb-2 leading-snug group-hover:underline">
                      {s.name}
                    </h3>

                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-3 mb-3">
                      {cleanDescription(s.description)}
                    </p>

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-cream border border-brand-border text-brand-dark max-w-fit">
                      {s.degree_levels[0] ?? 'Various levels'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/scholarships"
            className="inline-flex items-center justify-center px-6 py-3 border border-brand-border text-xs font-semibold rounded-full text-brand-dark hover:bg-brand-cream transition-colors duration-200"
          >
            Show all scholarships
          </Link>
        </div>

      </div>
    </section>
  );
}

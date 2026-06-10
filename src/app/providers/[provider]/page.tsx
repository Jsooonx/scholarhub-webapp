import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScholarshipCard from '@/components/ScholarshipCard';
import { getScholarshipsByProvider, providerMeta } from '@/lib/scholarships';

export async function generateStaticParams() {
  return ['daad', 'mext', 'turkiye', 'chevening', 'australia-awards', 'gks', 'singapore', 'eiffel', 'canada'].map((provider) => ({ provider }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ provider: string }>;
}): Promise<Metadata> {
  const { provider } = await params;
  const meta = providerMeta[provider];
  if (!meta) return { title: 'Not Found - ScholarHub' };
  return {
    title: `${meta.name} Scholarships - ScholarHub`,
    description: meta.description,
  };
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  const meta = providerMeta[provider];
  if (!meta) notFound();

  const scholarships = getScholarshipsByProvider(provider);

  // Group by degree level
  const byLevel: Record<string, typeof scholarships> = {};
  for (const s of scholarships) {
    const levels = s.degree_levels.length > 0 ? s.degree_levels : ['Other'];
    for (const l of levels) {
      if (!byLevel[l]) byLevel[l] = [];
      // avoid duplicates
      if (!byLevel[l].find((x) => x.slug === s.slug)) byLevel[l].push(s);
    }
  }

  const levelOrder = ['Bachelor', 'College of Technology', 'Master', 'PhD', 'Non-Degree', 'Other'];
  const sortedLevels = Object.keys(byLevel).sort(
    (a, b) => (levelOrder.indexOf(a) ?? 99) - (levelOrder.indexOf(b) ?? 99)
  );

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <nav className="text-xs text-brand-muted mb-4">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span className="mx-2">·</span>
              <Link href="/scholarships" className="hover:text-brand-dark transition-colors">Scholarships</Link>
              <span className="mx-2">·</span>
              <span className="text-brand-dark font-medium">{meta.name}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <span className="text-5xl" role="img" aria-label={meta.country}>{meta.flag}</span>
              <div>
                <h1 className="font-serif text-4xl font-bold text-brand-dark">{meta.name}</h1>
                <p className="text-sm text-brand-muted mt-1">{meta.country}</p>
              </div>
            </div>

            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed mb-6">
              {meta.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="rounded-xl border border-brand-border bg-brand-cream px-4 py-2.5 text-center">
                <p className="text-2xl font-bold text-brand-dark">{scholarships.length}</p>
                <p className="text-[10px] text-brand-muted uppercase tracking-wider">Scholarships</p>
              </div>
              <div className="rounded-xl border border-brand-border bg-brand-cream px-4 py-2.5 text-center">
                <p className="text-2xl font-bold text-brand-dark">{sortedLevels.length}</p>
                <p className="text-[10px] text-brand-muted uppercase tracking-wider">Levels</p>
              </div>
              <a
                href={meta.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-border rounded-full text-sm font-medium text-brand-dark hover:bg-brand-cream transition-colors self-center"
              >
                Official website ↗
              </a>
            </div>
          </div>
        </div>

        {/* Scholarships grouped by level */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {sortedLevels.map((level) => (
            <section key={level}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-serif text-2xl font-semibold text-brand-dark">{level}</h2>
                <span className="text-xs text-brand-muted border border-brand-border rounded-full px-2.5 py-0.5">
                  {byLevel[level].length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {byLevel[level].map((s) => (
                  <ScholarshipCard key={s.slug} scholarship={s} variant="grid" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScholarshipCard from '@/components/ScholarshipCard';
import RemoveShortlistButton from '@/components/RemoveShortlistButton';
import { getShortlistSlugs } from '@/app/actions/shortlist';
import { getScholarshipBySlug, BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'My Shortlist',
  description: 'Your saved scholarships on ScholarHub.',
  alternates: {
    canonical: `${BASE_URL}/shortlist`,
  },
};

export const dynamic = 'force-dynamic';

export default async function ShortlistPage() {
  const result = await getShortlistSlugs();

  if (!result.authenticated && !result.error) {
    redirect('/login?next=/shortlist');
  }

  const items = result.slugs.map((slug) => ({
    slug,
    scholarship: getScholarshipBySlug(slug),
  }));

  const available = items.filter((item) => item.scholarship);
  const unavailable = items.filter((item) => !item.scholarship);

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Navbar />

      <main className="flex-grow">
        <div className="border-b border-brand-border bg-brand-bg">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <nav className="mb-2 text-xs text-brand-muted">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span className="mx-2">·</span>
              <span className="font-medium text-brand-dark">Shortlist</span>
            </nav>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-serif text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">
                  My Shortlist
                </h1>
                <p className="mt-2 max-w-xl text-sm text-brand-muted">
                  Scholarships you saved while exploring ScholarHub.
                </p>
              </div>
              {result.email && (
                <p className="text-xs text-brand-muted">
                  Signed in as <span className="font-semibold text-brand-dark">{result.email}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {result.error && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {result.error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-3xl border border-brand-border bg-white px-6 py-16 text-center">
              <p className="font-serif text-2xl font-semibold text-brand-dark">No saved scholarships yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">
                Browse scholarships and tap the bookmark button to build your personal shortlist.
              </p>
              <Link
                href="/scholarships"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Browse scholarships
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {available.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-semibold text-brand-dark">Saved scholarships</h2>
                    <p className="text-xs text-brand-muted">{available.length} saved</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {available.map(({ slug, scholarship }) => (
                      <ScholarshipCard key={slug} scholarship={scholarship!} />
                    ))}
                  </div>
                </div>
              )}

              {unavailable.length > 0 && (
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-semibold text-brand-dark">Unavailable</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {unavailable.map(({ slug }) => (
                      <div key={slug} className="rounded-2xl border border-brand-border bg-white p-5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Saved item</p>
                        <h3 className="mt-2 font-serif text-lg font-semibold text-brand-dark">Unavailable scholarship</h3>
                        <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                          The saved slug <span className="font-mono text-brand-dark">{slug}</span> no longer matches the local scholarship database.
                        </p>
                        <div className="mt-4">
                          <RemoveShortlistButton slug={slug} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

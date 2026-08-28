'use client';

import { useSearchParams } from 'next/navigation';
import ScholarshipCard from '@/components/ScholarshipCard';
import ScholarshipsFilter from '@/components/ScholarshipsFilter';
import { filterScholarships } from '@/lib/scholarships';
import { LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

const RESULTS_PER_PAGE = 24;

export default function ScholarshipsClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? undefined;
  const provider = searchParams.get('provider') ?? undefined;
  const funding = searchParams.get('funding') ?? undefined;
  const level = searchParams.get('level') ?? undefined;
  const country = searchParams.get('country') ?? undefined;
  const view = searchParams.get('view') ?? 'grid';
  const pageParam = searchParams.get('page') ?? '1';

  const allResults = filterScholarships({
    query: q,
    provider,
    funding,
    level,
    country,
  });

  const requestedPage = Number.parseInt(pageParam, 10);
  const totalPages = Math.max(1, Math.ceil(allResults.length / RESULTS_PER_PAGE));
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const results = allResults.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);

  function viewUrl(v: string) {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('view', v);
    return `/scholarships?${sp.toString()}`;
  }

  function pageUrl(p: number) {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', String(p));
    return `/scholarships?${sp.toString()}`;
  }

  return (
    <>
      <div className="border-b border-brand-border bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-2 text-xs text-brand-muted">
            <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            <span className="mx-2">·</span>
            <span className="font-medium text-brand-dark">Scholarships</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">
            All Scholarships
          </h1>
          <p className="mt-2 max-w-xl text-sm text-brand-muted">
            Browse {allResults.length} curated international scholarships from top governments and universities.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ScholarshipsFilter total={allResults.length} />

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-brand-muted font-medium">
            Showing <span className="font-bold text-brand-dark">{allResults.length === 0 ? 0 : (currentPage - 1) * RESULTS_PER_PAGE + 1}–{Math.min(currentPage * RESULTS_PER_PAGE, allResults.length)}</span> of{' '}
            <span className="font-bold text-brand-dark">{allResults.length}</span> scholarships
          </p>

          <div className="flex items-center gap-1 rounded-full border border-brand-border bg-white p-1">
            <Link
              href={viewUrl('grid')}
              scroll={false}
              aria-label="Grid view"
              className={`rounded-full p-1.5 transition-colors ${
                view === 'grid' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Link>
            <Link
              href={viewUrl('list')}
              scroll={false}
              aria-label="List view"
              className={`rounded-full p-1.5 transition-colors ${
                view === 'list' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              <List className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-brand-border bg-white p-12 text-center">
            <p className="font-serif text-2xl font-bold text-brand-dark">No scholarships found</p>
            <p className="mt-2 text-sm text-brand-muted">
              Try adjusting your filters or search terms.
            </p>
            <Link
              href="/scholarships"
              className="mt-6 inline-flex rounded-full bg-brand-dark px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-cream hover:text-brand-dark transition-colors"
            >
              Clear all filters
            </Link>
          </div>
        ) : view === 'grid' ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((scholarship) => (
              <ScholarshipCard key={scholarship.slug} scholarship={scholarship} />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {results.map((scholarship) => (
              <ScholarshipCard key={scholarship.slug} scholarship={scholarship} variant="list" />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={pageUrl(currentPage - 1)}
                className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-dark hover:border-brand-dark transition-colors"
              >
                ← Previous
              </Link>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const hasGap = prev && p - prev > 1;
                  return (
                    <span key={p} className="flex items-center">
                      {hasGap && <span className="px-2 text-xs text-brand-muted">…</span>}
                      <Link
                        href={pageUrl(p)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                          p === currentPage
                            ? 'bg-brand-dark text-white'
                            : 'bg-white border border-brand-border text-brand-muted hover:border-brand-dark hover:text-brand-dark'
                        }`}
                      >
                        {p}
                      </Link>
                    </span>
                  );
                })}
            </div>

            {currentPage < totalPages && (
              <Link
                href={pageUrl(currentPage + 1)}
                className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-dark hover:border-brand-dark transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}

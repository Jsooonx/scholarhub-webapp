import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScholarshipCard from '@/components/ScholarshipCard';
import ScholarshipsFilter from '@/components/ScholarshipsFilter';
import { filterScholarships, BASE_URL } from '@/lib/scholarships';
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Scholarships',
  description: 'Browse and filter all scholarships from DAAD, MEXT, Türkiye Burslari and more.',
  alternates: {
    canonical: `${BASE_URL}/scholarships`,
  },
  openGraph: {
    title: 'All Scholarships',
    description: 'Browse and filter all scholarships from DAAD, MEXT, Türkiye Burslari and more.',
    url: `${BASE_URL}/scholarships`,
  },
};

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    provider?: string;
    funding?: string;
    level?: string;
    country?: string;
    view?: string;
    page?: string;
  }>;
}

export default async function ScholarshipsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = params.view ?? 'grid';
  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10));

  const allResults = filterScholarships({
    query: params.q,
    provider: params.provider,
    funding: params.funding,
    level: params.level,
    country: params.country,
  });

  const totalPages = Math.max(1, Math.ceil(allResults.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const results = allResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Build a URL with updated page param, keeping all other params
  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.provider) sp.set('provider', params.provider);
    if (params.funding) sp.set('funding', params.funding);
    if (params.level) sp.set('level', params.level);
    if (params.country) sp.set('country', params.country);
    if (params.view && params.view !== 'grid') sp.set('view', params.view);
    if (p > 1) sp.set('page', String(p));
    const qs = sp.toString();
    return `/scholarships${qs ? `?${qs}` : ''}`;
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': BASE_URL,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Scholarships',
        'item': `${BASE_URL}/scholarships`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <main className="flex-grow">
        {/* Page header */}
        <div className="border-b border-brand-border bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <nav className="text-xs text-brand-muted mb-2">
                  <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
                  <span className="mx-2">·</span>
                  <span className="text-brand-dark font-medium">Scholarships</span>
                </nav>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-brand-dark">
                  All Scholarships
                </h1>
                <p className="mt-2 text-sm text-brand-muted max-w-xl">
                  Curated scholarships from DAAD, MEXT, Türkiye Burslari and more - browse, filter, and find the one that fits you.
                </p>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 border border-brand-border rounded-full p-1 bg-white self-start sm:self-auto">
                <Link
                  href={pageUrl(1).replace(/view=[^&]*&?/, '').replace(/[?&]$/, '')}
                  scroll={false}
                  className={`p-2 rounded-full transition-colors ${view === 'grid' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:text-brand-dark'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Link>
                <Link
                  href={`${pageUrl(1)}${pageUrl(1).includes('?') ? '&' : '?'}view=list`}
                  scroll={false}
                  className={`p-2 rounded-full transition-colors ${view === 'list' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:text-brand-dark'}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar - sticky below navbar */}
        <div className="sticky top-16 sm:top-20 z-40 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Suspense>
              <ScholarshipsFilter total={allResults.length} />
            </Suspense>
          </div>
        </div>

        {/* Results grid/list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {allResults.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-brand-dark mb-2">No scholarships found</p>
              <p className="text-sm text-brand-muted mb-6">Try adjusting or clearing your filters.</p>
              <Link
                href="/scholarships"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-brand-border text-sm font-medium rounded-full text-brand-dark hover:bg-brand-cream transition-colors"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((s) => (
                    <ScholarshipCard key={s.slug} scholarship={s} variant="grid" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-w-4xl">
                  {results.map((s) => (
                    <ScholarshipCard key={s.slug} scholarship={s} variant="list" />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {/* Prev */}
                  {safePage > 1 ? (
                    <Link
                      href={pageUrl(safePage - 1)}
                      className="p-2 rounded-full border border-brand-border hover:bg-brand-cream transition-colors text-brand-dark"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="p-2 rounded-full border border-brand-border/40 text-brand-border cursor-not-allowed">
                      <ChevronLeft className="h-4 w-4" />
                    </span>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    // Show first, last, current ±1
                    const show =
                      p === 1 || p === totalPages || Math.abs(p - safePage) <= 1;
                    const showEllipsisBefore = p === safePage - 2 && safePage > 3;
                    const showEllipsisAfter = p === safePage + 2 && safePage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <span key={`ellipsis-${p}`} className="text-xs text-brand-muted px-1">
                          …
                        </span>
                      );
                    }
                    if (!show) return null;

                    return (
                      <Link
                        key={p}
                        href={pageUrl(p)}
                        className={`min-w-[36px] h-9 flex items-center justify-center rounded-full text-xs font-medium transition-colors border ${
                          p === safePage
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'border-brand-border hover:bg-brand-cream text-brand-dark'
                        }`}
                        aria-current={p === safePage ? 'page' : undefined}
                      >
                        {p}
                      </Link>
                    );
                  })}

                  {/* Next */}
                  {safePage < totalPages ? (
                    <Link
                      href={pageUrl(safePage + 1)}
                      className="p-2 rounded-full border border-brand-border hover:bg-brand-cream transition-colors text-brand-dark"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="p-2 rounded-full border border-brand-border/40 text-brand-border cursor-not-allowed">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <p className="text-center text-xs text-brand-muted mt-3">
                  Page {safePage} of {totalPages} · {allResults.length} scholarships
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

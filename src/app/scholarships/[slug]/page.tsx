import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/Footer';
import ScholarshipTrackDetailView from '@/components/ScholarshipTrackDetailView';
import { scholarshipTracks } from '@/data/tracks';
import { enrichmentData } from '@/data/enriched';
import {
  getScholarshipBySlug,
  getAllSlugs,
  allScholarships,
  providerGroup,
  cleanDescription,
  getDeadlineStatus,
  getMatchedUniversityLogos,
  providerMeta,
  BASE_URL,
  type Scholarship,
} from '@/lib/scholarships';

// ── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getScholarshipBySlug(slug);
  if (!s) return { title: 'Not Found' };
  const desc = cleanDescription(s.description)?.slice(0, 155) || `${s.provider} scholarship in ${s.country ?? 'various countries'}.`;
  return {
    title: s.name,
    description: desc,
    alternates: {
      canonical: `${BASE_URL}/scholarships/${slug}`,
    },
    openGraph: {
      title: s.name,
      description: desc,
      url: `${BASE_URL}/scholarships/${slug}`,
      type: 'website',
      siteName: 'ScholarHub',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.name,
      description: desc,
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function durationLabel(d: Scholarship['duration_months']) {
  if (!d.min && !d.max) return null;
  if (d.min === d.max) return `${d.min} ${d.min === 1 ? 'month' : 'months'}`;
  if (!d.min) return `Up to ${d.max} ${d.max === 1 ? 'month' : 'months'}`;
  if (!d.max) return `${d.min}+ months`;
  return `${d.min}-${d.max} months`;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getScholarshipBySlug(slug);
  if (!s) notFound();

  const group = providerGroup(s.provider);
  const dur = durationLabel(s.duration_months);
  const status = getDeadlineStatus(s);
  const partnerLogos = getMatchedUniversityLogos(s);
  const tracks = scholarshipTracks[s.slug];
  const enrichment = enrichmentData[s.slug] ?? null;

  // Related: same provider, excluding this one
  const related = allScholarships
    .filter((r) => providerGroup(r.provider) === group && r.slug !== slug)
    .slice(0, 4);

  // Structured Data (JSON-LD)
  const providerUrl = providerMeta[group]
    ? `${BASE_URL}/providers/${group}`
    : `${BASE_URL}/scholarships`;

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
      {
        '@type': 'ListItem',
        'position': 3,
        'name': s.provider,
        'item': providerUrl,
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': s.name,
        'item': `${BASE_URL}/scholarships/${slug}`,
      },
    ],
  };

  const scholarshipSchema = {
    '@context': 'https://schema.org',
    '@type': 'MonetaryGrant',
    'name': s.name,
    'description': cleanDescription(s.description) || `${s.name} provided by ${s.provider}.`,
    'funder': {
      '@type': 'EducationalOrganization',
      'name': s.provider,
      'url': s.official_url || undefined,
    },
    'amount': s.amounts && s.amounts.length > 0 ? s.amounts.join(', ') : undefined,
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarshipSchema) }}
      />

      <ScholarshipTrackDetailView
        scholarship={s}
        tracks={tracks}
        dur={dur}
        initialStatus={status}
        partnerLogos={partnerLogos}
        enrichment={enrichment}
        related={related}
      />

      <Footer />
    </div>
  );
}

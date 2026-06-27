import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/Footer';
import ScholarshipCard from '@/components/ScholarshipCard';
import ScholarshipTrackDetailView from '@/components/ScholarshipTrackDetailView';
import { scholarshipTracks } from '@/data/tracks';
import {
  getScholarshipBySlug,
  getAllSlugs,
  allScholarships,
  providerGroup,
  cleanDescription,
  getDeadlineStatus,
  getScholarshipLogo,
  getMatchedUniversityLogos,
  providerMeta,
  BASE_URL,
  type Scholarship,
} from '@/lib/scholarships';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Banknote,
  Users,
  BookOpen,
  Globe,
  Info,
  Calendar,
} from 'lucide-react';

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
  if (d.min === d.max) return `${d.min} months`;
  if (!d.min) return `Up to ${d.max} months`;
  if (!d.max) return `${d.min}+ months`;
  return `${d.min}-${d.max} months`;
}

const fundingColors: Record<string, string> = {
  'fully funded': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'partially funded': 'bg-amber-50 text-amber-700 border-amber-200',
};
function fundingClass(type: string) {
  return fundingColors[type.toLowerCase()] ?? 'bg-brand-cream text-brand-dark border-brand-border';
}

function BooleanBadge({ value, label }: { value: boolean | null; label: string }) {
  if (value === null) return (
    <div className="flex items-center gap-2 text-xs text-brand-muted">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-brand-muted/50" />
      <span>{label}: <span className="italic">not specified</span></span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-xs">
      {value
        ? <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
        : <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
      }
      <span className={value ? 'text-brand-dark' : 'text-brand-muted'}>{label}: <span className="font-medium">{value ? 'Required' : 'Not required'}</span></span>
    </div>
  );
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
  const flag = providerMeta[group]?.flag ?? '🌍';
  const dur = durationLabel(s.duration_months);
  const status = getDeadlineStatus(s);
  const partnerLogos = getMatchedUniversityLogos(s);
  const tracks = scholarshipTracks[s.slug];

  // Related: same provider, excluding this one
  const related = allScholarships
    .filter((r) => providerGroup(r.provider) === group && r.slug !== slug)
    .slice(0, 4);

  // Structured Data (JSON-LD)
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
        'item': `${BASE_URL}/providers/${group}`,
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
    '@type': 'Scholarship',
    'name': s.name,
    'description': cleanDescription(s.description) || `${s.name} provided by ${s.provider}.`,
    'provider': {
      '@type': 'EducationalOrganization',
      'name': s.provider,
      'url': s.official_url || undefined,
    },
    'financialAidType': 'Scholarship',
    'educationalCredentialAwarded': s.degree_levels.join(', '),
    'benefits': s.benefits.join(', '),
    'awardee': s.requirements.country_restrictions.length > 0 ? {
      '@type': 'AdministrativeArea',
      'name': s.requirements.country_restrictions.join(', '),
    } : undefined,
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


      <main className="flex-grow">
        {/* ── Hero band ─────────────────────────────────────────────────── */}
        <div className="border-b border-brand-border bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-brand-muted mb-6">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span>·</span>
              <Link href="/scholarships" className="hover:text-brand-dark transition-colors">Scholarships</Link>
              <span>·</span>
              <Link href={`/providers/${group}`} className="hover:text-brand-dark transition-colors">{s.provider}</Link>
              <span>·</span>
              <span className="text-brand-dark font-medium line-clamp-1">{s.name}</span>
            </nav>

            <ScholarshipTrackDetailView
              scholarship={s}
              tracks={tracks}
              dur={dur}
              initialStatus={status}
              partnerLogos={partnerLogos}
              related={related}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

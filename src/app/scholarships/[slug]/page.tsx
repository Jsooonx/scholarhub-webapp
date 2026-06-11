import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScholarshipCard from '@/components/ScholarshipCard';
import DeadlineStatus from '@/components/DeadlineStatus';
import {
  getScholarshipBySlug,
  getAllSlugs,
  allScholarships,
  providerGroup,
  cleanDescription,
  getDeadlineStatus,
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
  if (!s) return { title: 'Not Found - ScholarHub' };
  const desc = cleanDescription(s.description)?.slice(0, 155) || `${s.provider} scholarship in ${s.country ?? 'various countries'}.`;
  return {
    title: `${s.name} - ScholarHub`,
    description: desc,
    openGraph: {
      title: s.name,
      description: desc,
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

const flagMap: Record<string, string> = {
  daad: '🇩🇪', mext: '🇯🇵', turkiye: '🇹🇷',
  chevening: '🇬🇧', 'australia-awards': '🇦🇺', gks: '🇰🇷',
  eiffel: '🇫🇷', singapore: '🇸🇬', canada: '🇨🇦',
};

const providerLogos: Record<string, string> = {
  daad: '/images/logos/daad.svg',
  mext: '/images/logos/mext.svg',
  turkiye: '/images/logos/turkiye.png',
};

function durationLabel(d: Scholarship['duration_months']) {
  if (!d.min && !d.max) return null;
  if (d.min === d.max) return `${d.min} months`;
  if (!d.min) return `Up to ${d.max} months`;
  if (!d.max) return `${d.min}+ months`;
  return `${d.min}–${d.max} months`;
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
  const flag = flagMap[group] ?? '🌍';
  const dur = durationLabel(s.duration_months);
  const status = getDeadlineStatus(s);

  // Related: same provider, excluding this one
  const related = allScholarships
    .filter((r) => providerGroup(r.provider) === group && r.slug !== slug)
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

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

            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
              {/* Left: Title block */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 flex-shrink-0">
                    {providerLogos[group] ? (
                      <img src={providerLogos[group]} alt={s.provider} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl" role="img" aria-label={s.country ?? s.provider}>{flag}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">{s.provider}</span>
                  {s.country && (
                    <>
                      <span className="text-brand-border">·</span>
                      <span className="text-xs text-brand-muted">{s.country}</span>
                    </>
                  )}
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark leading-tight mb-4">
                  {s.name}
                </h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${fundingClass(s.funding_type)}`}>
                    {s.funding_type}
                  </span>
                  {s.degree_levels.map((l) => (
                    <span key={l} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-cream border border-brand-border text-brand-dark">
                      {l}
                    </span>
                  ))}
                  {dur && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-cream border border-brand-border text-brand-muted">
                      <Clock className="h-3 w-3" />
                      {dur}
                    </span>
                  )}
                  {/* Deadline status badge */}
                  <DeadlineStatus status={status} />
                </div>

                {s.description && (
                  <p className="text-sm text-brand-muted leading-relaxed max-w-2xl">
                    {cleanDescription(s.description)}
                  </p>
                )}
              </div>

              {/* Right: Quick apply card */}
              <div className="lg:w-72 flex-shrink-0">
                <div className="rounded-2xl border border-brand-border bg-brand-cream p-6 sticky top-24">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-4">Quick info</p>

                  <div className="space-y-3 mb-6">
                    {/* Deadline status - prominent */}
                    <div className="pb-3 border-b border-brand-border">
                      <p className="text-[10px] text-brand-muted mb-1.5 font-medium uppercase tracking-wider">Application status</p>
                      <DeadlineStatus status={status} size="sm" />
                      {status.type === 'rolling' && (
                        <p className="text-[10px] text-brand-muted mt-1.5 leading-snug">
                          DAAD deadlines vary per program. Check the official site for the current intake window.
                        </p>
                      )}
                      {status.type === 'check' && (
                        <p className="text-[10px] text-brand-muted mt-1.5 leading-snug">
                          No deadline found in our data. Verify on the official site.
                        </p>
                      )}
                    </div>
                    {s.country && (
                      <div className="flex items-center gap-2.5 text-xs text-brand-dark">
                        <MapPin className="h-4 w-4 text-brand-muted flex-shrink-0" />
                        <span>{s.country}</span>
                      </div>
                    )}
                    {s.degree_levels.length > 0 && (
                      <div className="flex items-center gap-2.5 text-xs text-brand-dark">
                        <GraduationCap className="h-4 w-4 text-brand-muted flex-shrink-0" />
                        <span>{s.degree_levels.join(', ')}</span>
                      </div>
                    )}
                    {dur && (
                      <div className="flex items-center gap-2.5 text-xs text-brand-dark">
                        <Clock className="h-4 w-4 text-brand-muted flex-shrink-0" />
                        <span>{dur}</span>
                      </div>
                    )}
                    {s.fields.length > 0 && s.fields[0].length < 60 && (
                      <div className="flex items-start gap-2.5 text-xs text-brand-dark">
                        <BookOpen className="h-4 w-4 text-brand-muted flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{s.fields.slice(0, 3).join(', ')}{s.fields.length > 3 ? '…' : ''}</span>
                      </div>
                    )}
                    {s.requirements.country_restrictions.length > 0 && (
                      <div className="flex items-start gap-2.5 text-xs text-brand-dark">
                        <Globe className="h-4 w-4 text-brand-muted flex-shrink-0 mt-0.5" />
                        <span>Open to: {s.requirements.country_restrictions.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {s.official_url ? (
                    <a
                      href={s.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-sm font-semibold rounded-full text-white bg-brand-dark hover:opacity-90 transition-opacity"
                    >
                      Apply on official site
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="text-xs text-brand-muted text-center italic">No official link available</p>
                  )}

                  <p className="text-[10px] text-brand-muted text-center mt-3">
                    Opens the provider's official website
                  </p>

                  {/* Disclaimer */}
                  <div className="mt-4 pt-4 border-t border-brand-border flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-brand-muted flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-brand-muted leading-relaxed">
                      Info sourced from official providers. Always verify deadlines, requirements, and eligibility directly before applying.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── Main content (2 cols) ──────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Benefits */}
              {s.benefits.length > 0 && (
                <section>
                  <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-brand-muted" />
                    What you get
                  </h2>
                  <ul className="space-y-2">
                    {s.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-brand-dark">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {s.amounts && s.amounts.length > 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <Banknote className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">
                        Monthly: {s.amounts.join(' / ')}
                      </span>
                    </div>
                  )}
                </section>
              )}

              {/* Requirements */}
              <section>
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-muted" />
                  Requirements
                </h2>
                <div className="rounded-2xl border border-brand-border bg-white p-6 space-y-3">
                  <BooleanBadge value={s.requirements.first_degree_required} label="First degree" />
                  <BooleanBadge value={s.requirements.professional_experience_required} label="Professional experience" />
                  {s.requirements.professional_experience_years && (
                    <p className="text-xs text-brand-muted pl-5">
                      Minimum {s.requirements.professional_experience_years} year(s) required
                    </p>
                  )}
                  {s.requirements.country_restrictions.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-brand-dark pt-1">
                      <Globe className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-brand-muted" />
                      <span>Country restriction: <span className="font-medium">{s.requirements.country_restrictions.join(', ')}</span></span>
                    </div>
                  )}
                  {/* Raw requirement items for MEXT */}
                  {s.requirements.raw_items && s.requirements.raw_items.length > 0 && (
                    <div className="pt-2 border-t border-brand-border mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-2">Detailed requirements</p>
                      <ul className="space-y-1.5">
                        {s.requirements.raw_items.map((item, i) => (
                          <li key={i} className="text-xs text-brand-dark flex items-start gap-2">
                            <span className="text-brand-muted flex-shrink-0 mt-0.5"> - </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* Target group */}
              {s.target_group && (
                <section>
                  <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-brand-muted" />
                    Who can apply
                  </h2>
                  <div className="rounded-2xl border border-brand-border bg-brand-cream p-6">
                    <p className="text-sm text-brand-dark leading-relaxed">{s.target_group}</p>
                  </div>
                </section>
              )}

              {/* Fields of study */}
              {s.fields.length > 0 && s.fields[0].length < 80 && (
                <section>
                  <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-brand-muted" />
                    Fields of study
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {s.fields.map((f, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-brand-border text-brand-dark">
                        {f}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Application window - all providers */}
              <section>
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-muted" />
                  Application window
                </h2>
                <div className="rounded-2xl border border-brand-border bg-white p-5 space-y-4">
                  {/* Status badge */}
                  <DeadlineStatus status={status} />

                  {/* Provider-specific context */}
                  {group === 'mext' && (
                    <div className="space-y-1">
                      {status.type !== 'check' && s.deadline && (
                        <p className="text-xs text-brand-dark">
                          <span className="font-medium">Deadline: </span>
                          {s.deadline.replace(/^\*\s*/, '')}
                        </p>
                      )}
                      {s.application_period && s.application_period.length > 0 && (
                        <p className="text-xs text-brand-dark">
                          <span className="font-medium">Registration period: </span>
                          {s.application_period[0].replace(/^\|\s*●\s*\|[^|]*\|\s*:\s*/, '').replace(/\s*\|.*$/, '').trim()}
                        </p>
                      )}
                    </div>
                  )}

                  {group === 'turkiye' && (
                    <div className="text-xs text-brand-dark space-y-1">
                      <p><span className="font-medium">General intake: </span>January 10 – February 20 (annual)</p>
                      <p><span className="font-medium">Results announced: </span>Early August</p>
                      <p><span className="font-medium">Start date: </span>September</p>
                      <p className="text-brand-muted pt-1">Research scholarships have additional quarterly cycles (Jan–Mar, Apr–Jun, Jul–Sep, Oct–Dec).</p>
                    </div>
                  )}

                  {group === 'daad' && (
                    <div className="text-xs text-brand-dark space-y-1">
                      <p>DAAD operates on a <span className="font-medium">rolling / annual intake</span> basis. Most programs open applications in October–November for the following academic year.</p>
                      <p className="text-brand-muted pt-1">Always check the official DAAD scholarship database for current deadlines specific to this program.</p>
                    </div>
                  )}

                  {group === 'eiffel' && (
                    <div className="text-xs text-brand-dark space-y-1">
                      <p><span className="font-medium">Annual cycle: </span>October – January</p>
                      <p><span className="font-medium">Results announced: </span>April</p>
                      <p className="text-brand-muted pt-1">Applications must be submitted by French higher education institutions on behalf of students.</p>
                    </div>
                  )}

                  {group === 'singapore' && (
                    <div className="text-xs text-brand-dark space-y-1">
                      <p><span className="font-medium">SINGA/AGS PhD: </span>Rolling - two intakes per year (January and August)</p>
                      <p><span className="font-medium">ASEAN UG (NUS/NTU): </span>Apply via undergraduate admissions (October–March)</p>
                    </div>
                  )}

                  {group === 'canada' && (
                    <div className="text-xs text-brand-dark space-y-1">
                      {s.provider.toLowerCase().includes('university of toronto') ? (
                        <>
                          <p><span className="font-medium">School nomination deadline: </span>October 10</p>
                          <p><span className="font-medium">U of T admissions deadline: </span>October 17 (via OUAC)</p>
                          <p><span className="font-medium">Student scholarship application: </span>November 7</p>
                          <p><span className="font-medium">Recipients notified: </span>Starting end of January</p>
                          <p className="text-brand-muted pt-1">Must be nominated by your current secondary school. Schools can only nominate one student per year.</p>
                        </>
                      ) : (
                        <>
                          <p><span className="font-medium">Agency deadline: </span>October 17 annually</p>
                          <p><span className="font-medium">Results announced: </span>April 30</p>
                          <p className="text-brand-muted pt-1">International students must apply through their Canadian institution. Institution deadlines are typically earlier than October 17.</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 pt-3 border-t border-brand-border">
                    <Info className="h-3.5 w-3.5 text-brand-muted flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-brand-muted leading-relaxed">
                      Dates are based on data sourced from official providers (2025–2026 cycle). Deadlines may shift between intake years. Always verify on the official website before applying.
                    </p>
                  </div>
                </div>
              </section>

              {/* Important dates (MEXT) */}
              {s.important_dates && s.important_dates.length > 0 && (
                <section>
                  <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand-muted" />
                    Important dates
                  </h2>
                  <div className="rounded-2xl border border-brand-border bg-white overflow-hidden">
                    {s.important_dates.map((d, i) => {
                      const clean = d.replace(/^●\s*\|\s*/, '').replace(/\s*\|/g, ' - ');
                      return (
                        <div key={i} className={`px-5 py-3 text-xs text-brand-dark ${i !== 0 ? 'border-t border-brand-border/60' : ''}`}>
                          {clean}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Application process (MEXT) */}
              {s.application_process && s.application_process.length > 0 && (
                <section>
                  <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4">
                    How to apply
                  </h2>
                  <ol className="space-y-3">
                    {s.application_process.slice(0, 10).map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-brand-dark">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-dark text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

            </div>

            {/* ── Sidebar (1 col) ──────────────────────────────────────── */}
            <div className="space-y-8">

              {/* Back to browse */}
              <Link
                href="/scholarships"
                className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-dark transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all scholarships
              </Link>

              {/* Provider info */}
              <div className="rounded-2xl border border-brand-border bg-brand-cream p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-3">Provider</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 flex-shrink-0">
                    {providerLogos[group] ? (
                      <img src={providerLogos[group]} alt={s.provider} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">{flag}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-dark">{s.provider}</p>
                    {s.country && <p className="text-xs text-brand-muted">{s.country}</p>}
                  </div>
                </div>
                <Link
                  href={`/providers/${group}`}
                  className="text-xs font-medium text-brand-accent hover:underline"
                >
                  View all {s.provider.split('/')[0].trim()} scholarships →
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-3">
                    More from {s.provider.split('/')[0].trim()}
                  </p>
                  <div className="space-y-2">
                    {related.map((r) => (
                      <ScholarshipCard key={r.slug} scholarship={r} variant="list" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

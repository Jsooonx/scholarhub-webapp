'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
import SaveScholarshipButton from '@/components/SaveScholarshipButton';
import CompareCTA from '@/components/CompareCTA';
import DeadlineStatus from '@/components/DeadlineStatus';
import InsiderGuide from '@/components/InsiderGuide';
import ScholarshipCard from '@/components/ScholarshipCard';
import { Button, LinkButton } from '@/components/ui/button';
import { type EnrichmentData } from '@/data/enriched';
import { getPersonallyCuratedMeta } from '@/data/curated';
import {
  type Scholarship,
  type DeadlineStatus as DStatus,
  providerGroup,
  getScholarshipLogo,
  providerMeta,
  cleanDescription,
} from '@/lib/scholarships';
import { type ScholarshipTracks } from '@/data/tracks';

interface Props {
  scholarship: Scholarship;
  tracks?: ScholarshipTracks;
  dur: string | null;
  initialStatus: DStatus;
  partnerLogos: Array<{ name: string; logo: string }>;
  enrichment?: EnrichmentData | null;
  related: Scholarship[];
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

export default function ScholarshipTrackDetailView({
  scholarship: s,
  tracks,
  dur,
  initialStatus,
  partnerLogos,
  enrichment,
  related,
}: Props) {
  const [activeTrack, setActiveTrack] = useState<'embassy' | 'university'>('embassy');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const group = providerGroup(s.provider);
  const flag = providerMeta[group]?.flag ?? '🌍';
  const curatedMeta = getPersonallyCuratedMeta(s.slug);

  // Sourced intake year cycle note
  const cycleNote = useMemo(() => {
    const allText = [
      ...(s.important_dates ?? []),
      ...(s.application_period ?? []),
      s.deadline ?? '',
      s.name ?? '',
    ].join(' ');
    if (allText.includes('2027') || allText.includes('2026')) return '2026/2027';
    if (allText.includes('2025')) return '2025/2026';
    return null;
  }, [s]);

  // Resolve track-specific details
  const currentTrackData = tracks ? tracks[activeTrack] : null;
  const deadlineText = currentTrackData ? currentTrackData.deadlines : s.deadline;
  const officialUrl = currentTrackData ? currentTrackData.url : s.official_url;

  const status: DStatus = currentTrackData 
    ? { 
        type: 'rolling', 
        label: `Deadline: ${currentTrackData.deadlines}`
      }
    : initialStatus;

  const steps = currentTrackData ? currentTrackData.process : s.application_process;

  const fundingColors: Record<string, string> = {
    'fully funded': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'partially funded': 'bg-amber-50 text-amber-700 border-amber-200',
  };
  function fundingClass(type: string) {
    return fundingColors[type.toLowerCase()] ?? 'bg-brand-cream text-brand-dark border-brand-border';
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Breadcrumb nav */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-brand-muted mb-6 min-w-0">
          <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
          <span>·</span>
          <Link href="/scholarships" className="hover:text-brand-dark transition-colors">Scholarships</Link>
          <span>·</span>
          <Link href={`/providers/${group}`} className="hover:text-brand-dark transition-colors truncate max-w-48">{s.provider}</Link>
          <span>·</span>
          <span className="text-brand-dark font-medium truncate">{s.name}</span>
        </nav>
        <Link
          href="/scholarships"
          className="sm:hidden inline-flex min-h-11 items-center gap-2 -ml-2 px-2 text-xs font-semibold text-brand-muted transition-colors active:text-brand-dark mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          All scholarships
        </Link>

        {/* ── Main Layout: Left Content & Right Sticky Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* ── Left Column: Scholarship Details & Track Content ── */}
          <div className="flex-1 min-w-0 space-y-10">
            
            {/* Header & Overview Block */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 flex-shrink-0">
                  {getScholarshipLogo(s) ? (
                    <img src={getScholarshipLogo(s)!} alt={s.provider} className="w-full h-full object-contain" />
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
                {curatedMeta && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-dark text-white shadow-xs">
                    {curatedMeta.badge}
                  </span>
                )}
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
                {mounted ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={status.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="inline-block"
                    >
                      <DeadlineStatus status={status} />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <DeadlineStatus status={status} />
                )}
              </div>

              {curatedMeta && (
                <div className="mb-5 rounded-2xl border border-brand-border bg-gradient-to-r from-brand-cream/90 via-white to-brand-cream/50 p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-dark text-white">
                        {curatedMeta.badge}
                      </span>
                      <span className="text-xs font-bold text-brand-dark">Deep Research & Verified Selection Experience</span>
                    </div>
                    {curatedMeta.verifiedCycle && (
                      <span className="text-[11px] font-medium text-brand-muted bg-brand-cream px-2.5 py-0.5 rounded-lg border border-brand-border/60">
                        {curatedMeta.verifiedCycle}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {curatedMeta.summary}
                  </p>
                </div>
              )}

              {s.description && (
                <p className="text-sm text-brand-muted leading-relaxed max-w-3xl font-serif italic border-l-2 border-brand-accent/30 pl-4 py-1">
                  {cleanDescription(s.description)}
                </p>
              )}

              {/* Insider's Guide */}
              {enrichment && (
                <div className="mt-8">
                  <InsiderGuide data={enrichment} />
                </div>
              )}

              {/* Partner Universities Section */}
              {partnerLogos.length > 0 && (
                <div className="mt-8">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-3">
                    {s.name.toLowerCase().includes('university') || s.name.toLowerCase().includes('universitas') || s.provider.toLowerCase().includes('university') || s.provider.toLowerCase().includes('universitas')
                      ? 'Host University'
                      : 'Popular Participating Universities'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {partnerLogos.map((univ) => (
                      <div key={univ.name} className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-brand-border shadow-[0_2px_4px_rgba(0,0,0,0.02)]" title={univ.name}>
                        <img src={univ.logo} alt={univ.name} className="h-8 w-auto object-contain max-w-[120px]" />
                        <span className="text-xs font-bold text-brand-dark">{univ.name.split(' (')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Track Switcher & Detail Breakdown ── */}
            <div className="border-t border-brand-border/70 pt-8">
              {/* Tab Switcher (Only visible for multi-track GKS / MEXT) */}
              {tracks && (
                <div className="flex justify-start sm:justify-center mb-10">
                  <div className="relative inline-flex rounded-full border border-brand-border bg-brand-cream p-1 shadow-sm">
                    <Button
                      onClick={() => setActiveTrack('embassy')}
                      variant="ghost"
                      size="sm"
                      shape="pill"
                      aria-pressed={activeTrack === 'embassy'}
                      className={`relative z-10 rounded-full px-5 text-xs font-bold ${
                        activeTrack === 'embassy' ? '!text-white' : '!text-brand-muted hover:!text-brand-dark'
                      }`}
                    >
                      {activeTrack === 'embassy' && (
                        <motion.div
                          layoutId="activeTrackTab"
                          className="absolute inset-0 z-[-1] rounded-full bg-brand-dark"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span>Embassy Track</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTrack('university')}
                      variant="ghost"
                      size="sm"
                      shape="pill"
                      aria-pressed={activeTrack === 'university'}
                      className={`relative z-10 rounded-full px-5 text-xs font-bold ${
                        activeTrack === 'university' ? '!text-white' : '!text-brand-muted hover:!text-brand-dark'
                      }`}
                    >
                      {activeTrack === 'university' && (
                        <motion.div
                          layoutId="activeTrackTab"
                          className="absolute inset-0 z-[-1] rounded-full bg-brand-dark"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span>University Track</span>
                    </Button>
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTrack}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-10"
                >
                  {/* Track Description */}
                  {currentTrackData && (
                    <section className="bg-brand-cream/35 border border-brand-border rounded-2xl p-6">
                      <h3 className="font-serif text-lg font-bold text-brand-dark mb-2">
                        About {currentTrackData.title}
                      </h3>
                      <p className="text-sm text-brand-muted leading-relaxed">
                        {currentTrackData.description}
                      </p>
                    </section>
                  )}

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
                          <span className="text-xs font-semibold text-emerald-700">{s.amounts.join(' · ')}</span>
                        </div>
                      )}
                    </section>
                  )}

                  {/* Requirements */}
                  <section>
                    <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand-muted" />
                      Requirements & Eligibility
                    </h2>
                    <div className="rounded-2xl border border-brand-border bg-white p-6 space-y-4">
                      {/* Boolean flags */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-brand-border">
                        <BooleanBadge value={s.requirements.first_degree_required} label="First degree / Bachelor" />
                        <BooleanBadge value={s.requirements.professional_experience_required} label="Professional experience" />
                      </div>

                      {s.requirements.professional_experience_years && (
                        <p className="text-xs text-brand-dark">
                          <span className="text-brand-muted">Required experience: </span>
                          {s.requirements.professional_experience_years} year{s.requirements.professional_experience_years > 1 ? 's' : ''}
                        </p>
                      )}

                      {/* Target countries */}
                      {s.requirements.country_restrictions.length > 0 && (
                        <div>
                          <p className="text-xs text-brand-muted mb-2">Eligible nationalities:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {s.requirements.country_restrictions.map((c, i) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-cream border border-brand-border text-brand-dark">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Target group */}
                  {s.target_group && (
                    <section>
                      <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-brand-muted" />
                        Who should apply
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

                  {/* Application window / Dates */}
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                      <h2 className="font-serif text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-brand-muted" />
                        Application window
                      </h2>
                      {cycleNote && (
                        <span className="text-[11px] font-medium text-brand-muted bg-brand-cream/80 border border-brand-border/70 px-2.5 py-0.5 rounded-full w-fit">
                          Based on {cycleNote} official intake
                        </span>
                      )}
                    </div>
                    <div className="rounded-2xl border border-brand-border bg-white p-5 space-y-4">
                      {mounted ? (
                        <div className="h-10 flex items-center relative overflow-hidden">
                          <AnimatePresence mode="popLayout">
                            <motion.div
                              key={status.label}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.18 }}
                              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                            >
                              <DeadlineStatus status={status} />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="h-10 flex items-center">
                          <DeadlineStatus status={status} />
                        </div>
                      )}

                      {currentTrackData ? (
                        <div className="text-xs text-brand-dark space-y-1">
                          <p><span className="font-medium">Estimated Intake Period: </span>{currentTrackData.deadlines}</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
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

                          {group === 'turkey' && (
                            <div className="text-xs text-brand-dark space-y-1 pt-1">
                              <p><span className="font-medium">General intake: </span>January 10 - February 20 (annual)</p>
                              <p><span className="font-medium">Results announced: </span>Early August</p>
                              <p><span className="font-medium">Start date: </span>September</p>
                            </div>
                          )}

                          {group === 'germany' && (
                            <div className="text-xs text-brand-dark space-y-1 pt-1">
                              <p>DAAD operates on an annual intake. Most program deadlines vary. Check the official site for current windows.</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-start gap-2 pt-3 border-t border-brand-border">
                        <Info className="h-3.5 w-3.5 text-brand-muted flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-brand-muted leading-relaxed">
                          {cycleNote
                            ? `Dates and application windows reflect official ${cycleNote} data from provider announcements. Deadlines may shift slightly between intake cycles; always verify with the official portal before applying.`
                            : 'Dates are based on data sourced from official providers. Deadlines may shift between intake years. Always verify on the official website before applying.'}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Important dates */}
                  {!currentTrackData && s.important_dates && s.important_dates.length > 0 && (
                    <section>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                        <h2 className="font-serif text-xl font-semibold text-brand-dark flex items-center gap-2">
                          <Clock className="h-5 w-5 text-brand-muted" />
                          Important dates
                        </h2>
                        {cycleNote && (
                          <span className="text-[11px] font-medium text-brand-muted bg-brand-cream/80 border border-brand-border/70 px-2.5 py-0.5 rounded-full w-fit">
                            Based on {cycleNote} official cycle
                          </span>
                        )}
                      </div>
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
                      <p className="text-[11px] text-brand-muted italic mt-2 ml-1">
                        * Timeline is derived from official {cycleNote ?? 'researched'} intake records. Subsequent application cycles generally follow a comparable annual schedule.
                      </p>
                    </section>
                  )}

                  {/* How to apply */}
                  {steps && steps.length > 0 && (
                    <section>
                      <h2 className="font-serif text-xl font-semibold text-brand-dark mb-4">
                        How to apply
                      </h2>
                      <ol className="space-y-4">
                        {steps.map((step, i) => (
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Column: Sticky Quick Info Sidebar ── */}
          <aside className="lg:w-80 flex-shrink-0 w-full lg:sticky lg:top-20 lg:self-start space-y-6">
            
            {/* Quick Info Card */}
            <div className="rounded-2xl border border-brand-border bg-brand-cream p-6 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-4">Quick info</p>

              <div className="space-y-3 mb-6">
                <div className="pb-3 border-b border-brand-border">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <p className="text-[10px] text-brand-muted font-medium uppercase tracking-wider">Application status</p>
                    {cycleNote && (
                      <span className="text-[9px] text-brand-muted font-medium bg-white/70 border border-brand-border/60 px-1.5 py-0.5 rounded">
                        {cycleNote}
                      </span>
                    )}
                  </div>
                  {mounted ? (
                    <div className="h-10 flex items-center relative overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={status.label}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.18 }}
                          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                        >
                          <DeadlineStatus status={status} size="sm" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="h-10 flex items-center">
                      <DeadlineStatus status={status} size="sm" />
                    </div>
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

              {officialUrl ? (
                <LinkButton
                  href={officialUrl}
                  external
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Apply on official site
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                </LinkButton>
              ) : (
                <p className="text-xs text-brand-muted text-center italic">No official link available</p>
              )}

              <div className="mt-3">
                <SaveScholarshipButton slug={s.slug} variant="wide" />
              </div>

              <div className="mt-2">
                <CompareCTA currentScholarship={s} />
              </div>

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

            {/* Provider info card in sidebar */}
            <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-3">Provider</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-xl border border-brand-border bg-brand-cream/50 flex items-center justify-center p-1.5 flex-shrink-0">
                  {getScholarshipLogo(s) ? (
                    <img src={getScholarshipLogo(s)!} alt={s.provider} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xl">{flag}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{s.provider}</p>
                  {s.country && <p className="text-xs text-brand-muted">{s.country}</p>}
                </div>
              </div>
              <Link
                href={`/providers/${group}`}
                className="text-xs font-medium text-brand-accent hover:underline inline-flex items-center gap-1"
              >
                View all {s.provider.split('/')[0].trim()} scholarships →
              </Link>
            </div>

            {/* Back link in sidebar */}
            <Link
              href="/scholarships"
              className="flex items-center gap-2 text-xs font-medium text-brand-muted hover:text-brand-dark transition-colors px-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all scholarships
            </Link>
          </aside>
        </div>

        {/* ── Bottom Section: Related Scholarships from same provider ── */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-brand-border/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-0.5">Explore More</p>
                <h2 className="font-serif text-2xl font-bold text-brand-dark">
                  More from {s.provider.split('/')[0].trim()}
                </h2>
              </div>
              <Link
                href={`/providers/${group}`}
                className="text-xs font-semibold text-brand-accent hover:underline inline-flex items-center gap-1"
              >
                View all {s.provider.split('/')[0].trim()} scholarships →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <ScholarshipCard key={r.slug} scholarship={r} variant="grid" />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

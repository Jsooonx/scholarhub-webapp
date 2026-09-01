'use client';

import { useState } from 'react';
import Link from 'next/link';
import { providerGroup, getDeadlineStatus, getScholarshipLogo, providerMeta, type Scholarship } from '@/lib/scholarships';
import DeadlineStatus from '@/components/DeadlineStatus';
import SaveScholarshipButton from '@/components/SaveScholarshipButton';
import { Clock, GraduationCap, MapPin, Check, X } from 'lucide-react';
import { matchDegree, matchField, matchExperience, matchFunding, matchRegion, type QuizAnswers } from '@/lib/matching';
import { Button } from '@/components/ui/button';

const fundingColors: Record<string, string> = {
  'fully funded': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'partially funded': 'bg-amber-50 text-amber-700 border-amber-200',
};

function fundingClass(type: string) {
  return fundingColors[type.toLowerCase()] ?? 'bg-brand-cream text-brand-dark border-brand-border';
}

function durationLabel(d: Scholarship['duration_months']) {
  if (!d.min && !d.max) return null;
  if (d.min === d.max) return `${d.min} months`;
  if (!d.min) return `Up to ${d.max} months`;
  if (!d.max) return `${d.min}+ months`;
  return `${d.min}-${d.max} months`;
}

interface Props {
  scholarship: Scholarship;
  variant?: 'grid' | 'list';
  quizAnswers?: QuizAnswers;
  className?: string;
}

function ChecklistItem({ label, matched, val }: { label: string; matched: boolean; val: string }) {
  return (
    <div className="flex items-center justify-between text-[10px] leading-relaxed">
      <span className="text-brand-muted font-medium">{label}</span>
      <div className="flex items-center gap-1 font-semibold">
        <span className="capitalize text-brand-dark/80 max-w-[70px] truncate" title={val}>
          {val === 'any' ? 'General' : val}
        </span>
        {matched ? (
          <Check className="h-3 w-3 text-emerald-600 flex-shrink-0" />
        ) : (
          <X className="h-3 w-3 text-amber-600 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

function MatchBadge({
  matchCount,
  quizAnswers,
  checkDegree,
  checkField,
  checkExperience,
  checkFunding,
  checkRegion,
}: {
  matchCount: number;
  quizAnswers: QuizAnswers;
  checkDegree: boolean;
  checkField: boolean;
  checkExperience: boolean;
  checkFunding: boolean;
  checkRegion: boolean;
}) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="relative flex-shrink-0">
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPopover(!showPopover);
        }}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        variant="ghost"
        size="xs"
        shape="pill"
        className={`h-auto min-h-0 cursor-help rounded-full px-2 py-0.5 text-[10px] font-semibold select-none ${
          matchCount === 5
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50'
            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/50'
        }`}
      >
        <span>{matchCount}/5 Matches</span>
      </Button>

      {showPopover && (
        <div className="absolute right-0 bottom-full mb-2 z-30 w-52 rounded-2xl border border-brand-border bg-white p-3.5 shadow-xl animate-fade-in text-left">
          <h4 className="text-[11px] font-bold text-brand-dark border-b border-brand-border/60 pb-1.5 mb-2 flex items-center justify-between">
            <span>Eligibility Checklist</span>
            <span className="text-[10px] text-brand-muted font-normal">{matchCount}/5 Met</span>
          </h4>
          <div className="space-y-1.5">
            <ChecklistItem label="Academic Level" matched={checkDegree} val={quizAnswers.degree} />
            <ChecklistItem label="Field of Study" matched={checkField} val={quizAnswers.field} />
            <ChecklistItem label="Work Experience" matched={checkExperience} val={quizAnswers.experience === 'yes' ? 'Required' : 'None'} />
            <ChecklistItem label="Funding Type" matched={checkFunding} val={quizAnswers.funding === 'fully' ? 'Fully' : 'Any'} />
            <ChecklistItem label="Destination Region" matched={checkRegion} val={quizAnswers.region} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScholarshipCard({ scholarship: s, variant = 'grid', quizAnswers, className = '' }: Props) {
  const group = providerGroup(s.provider);
  const flag = providerMeta[group]?.flag ?? '🌍';
  const logoUrl = getScholarshipLogo(s);
  const dur = durationLabel(s.duration_months);
  const status = getDeadlineStatus(s);

  const checkDegree = quizAnswers ? matchDegree(s, quizAnswers.degree) : false;
  const checkField = quizAnswers ? matchField(s, quizAnswers.field) : false;
  const checkExperience = quizAnswers ? matchExperience(s, quizAnswers.experience) : false;
  const checkFunding = quizAnswers ? matchFunding(s, quizAnswers.funding) : false;
  const checkRegion = quizAnswers ? matchRegion(s, quizAnswers.region) : false;

  const matchCount = quizAnswers
    ? [checkDegree, checkField, checkExperience, checkFunding, checkRegion].filter(Boolean).length
    : 0;

  const renderMatchBadge = () => {
    if (!quizAnswers) return null;
    return (
      <MatchBadge
        matchCount={matchCount}
        quizAnswers={quizAnswers}
        checkDegree={checkDegree}
        checkField={checkField}
        checkExperience={checkExperience}
        checkFunding={checkFunding}
        checkRegion={checkRegion}
      />
    );
  };

  if (variant === 'list') {
    return (
      <div className={`relative rounded-2xl border border-brand-border transition-all duration-200 hover:border-brand-dark/20 hover:bg-brand-cream/50 ${className}`}>
        <SaveScholarshipButton slug={s.slug} className="absolute right-3 top-3 z-10" />
        <Link
          href={`/scholarships/${s.slug}`}
          className="group flex flex-col gap-4 p-4 pr-14 sm:flex-row sm:items-start"
        >
          <div className="relative flex-shrink-0 w-12 h-12 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 text-xl">
            {logoUrl ? (
              <img src={logoUrl} alt={s.provider} className="w-full h-full object-contain" />
            ) : (
              flag
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                {s.provider}
              </span>
              {s.country && (
                <>
                  <span className="text-brand-border">·</span>
                  <span className="text-[10px] text-brand-muted">{s.country}</span>
                </>
              )}
            </div>

            <h3 className="font-serif text-base font-semibold text-brand-dark leading-snug group-hover:underline line-clamp-2 mb-2">
              {s.name}
            </h3>

            <div className="flex flex-wrap gap-2 items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${fundingClass(s.funding_type)}`}>
                {s.funding_type}
              </span>
              {s.degree_levels.slice(0, 2).map((level) => (
                <span key={level} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-cream border border-brand-border text-brand-dark">
                  {level}
                </span>
              ))}
              {dur && (
                <span className="flex items-center gap-1 text-[10px] text-brand-muted">
                  <Clock className="h-3 w-3" />
                  {dur}
                </span>
              )}
              <DeadlineStatus status={status} size="sm" />
              {renderMatchBadge()}
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center text-xs text-brand-muted group-hover:text-brand-dark transition-colors self-center flex-shrink-0">
            View →
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-brand-border bg-white transition-all duration-200 hover:border-brand-dark/20 hover:shadow-sm ${className}`}>
      <SaveScholarshipButton slug={s.slug} className="absolute right-3 top-4 z-10" />
      <Link
        href={`/scholarships/${s.slug}`}
        className="group flex flex-col"
      >
        <div className="h-1 w-full bg-gradient-to-r from-brand-accent/70 via-brand-accent/30 to-transparent" />

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-3 pr-10">
            <div className="relative w-10 h-10 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={s.provider} className="w-full h-full object-contain" />
              ) : (
                <span className="text-lg">{flag}</span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${fundingClass(s.funding_type)}`}>
                {s.funding_type}
              </span>
              {renderMatchBadge()}
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1">
            {s.provider}
          </p>

          <h3 className="font-serif text-sm font-semibold text-brand-dark leading-snug group-hover:underline line-clamp-3 mb-3 flex-1">
            {s.name}
          </h3>

          <div className="flex flex-col gap-1.5 pt-3 border-t border-brand-border/60">
            {s.country && (
              <span className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                {s.country}
              </span>
            )}
            {s.degree_levels.length > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                <GraduationCap className="h-3 w-3 flex-shrink-0" />
                {s.degree_levels.join(', ')}
              </span>
            )}
            {dur && (
              <span className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                <Clock className="h-3 w-3 flex-shrink-0" />
                {dur}
              </span>
            )}
            <div className="pt-0.5">
              <DeadlineStatus status={status} size="sm" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

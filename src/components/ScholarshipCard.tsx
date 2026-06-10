import Link from 'next/link';
import { providerGroup, getDeadlineStatus, type Scholarship } from '@/lib/scholarships';
import DeadlineStatus from '@/components/DeadlineStatus';
import { Clock, MapPin, GraduationCap } from 'lucide-react';

const providerFlags: Record<string, string> = {
  daad: '🇩🇪',
  mext: '🇯🇵',
  turkiye: '🇹🇷',
  chevening: '🇬🇧',
  'australia-awards': '🇦🇺',
  gks: '🇰🇷',
  eiffel: '🇫🇷',
  singapore: '🇸🇬',
  canada: '🇨🇦',
};

const providerLogos: Record<string, string> = {
  daad: '/images/logos/daad.svg',
  mext: '/images/logos/mext.svg',
  turkiye: '/images/logos/turkiye.png',
};

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
  return `${d.min}–${d.max} months`;
}

interface Props {
  scholarship: Scholarship;
  variant?: 'grid' | 'list';
}

export default function ScholarshipCard({ scholarship: s, variant = 'grid' }: Props) {
  const group = providerGroup(s.provider);
  const flag = providerFlags[group] ?? '🌍';
  const logoUrl = providerLogos[group];
  const dur = durationLabel(s.duration_months);
  const status = getDeadlineStatus(s);

  if (variant === 'list') {
    return (
      <Link
        href={`/scholarships/${s.slug}`}
        className="flex flex-col sm:flex-row gap-4 sm:items-start group p-4 rounded-2xl border border-brand-border hover:border-brand-dark/20 hover:bg-brand-cream/50 transition-all duration-200"
      >
        {/* Provider badge */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 text-xl">
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
            {s.degree_levels.slice(0, 2).map((l) => (
              <span key={l} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-cream border border-brand-border text-brand-dark">
                {l}
              </span>
            ))}
            {dur && (
              <span className="flex items-center gap-1 text-[10px] text-brand-muted">
                <Clock className="h-3 w-3" />
                {dur}
              </span>
            )}
            <DeadlineStatus status={status} size="sm" />
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center text-xs text-brand-muted group-hover:text-brand-dark transition-colors self-center flex-shrink-0">
          View →
        </span>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link
      href={`/scholarships/${s.slug}`}
      className="flex flex-col group rounded-2xl border border-brand-border hover:border-brand-dark/20 hover:shadow-sm bg-white transition-all duration-200 overflow-hidden"
    >
      {/* Top bar with provider color */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-accent/60 to-brand-accent/20" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={s.provider} className="w-full h-full object-contain" />
            ) : (
              <span className="text-lg">{flag}</span>
            )}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${fundingClass(s.funding_type)}`}>
            {s.funding_type}
          </span>
        </div>

        {/* Provider + country */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1">
          {s.provider}
        </p>

        {/* Name */}
        <h3 className="font-serif text-sm font-semibold text-brand-dark leading-snug group-hover:underline line-clamp-3 mb-3 flex-1">
          {s.name}
        </h3>

        {/* Meta row */}
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
          {/* Deadline badge */}
          <div className="pt-0.5">
            <DeadlineStatus status={status} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}

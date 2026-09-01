'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getDeadlineStatus, getScholarshipLogo, type Scholarship } from '@/lib/scholarships';
import DeadlineStatus from '@/components/DeadlineStatus';
import SaveScholarshipButton from '@/components/SaveScholarshipButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, ArrowUpRight, Clock, GraduationCap, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LinkButton } from '@/components/ui/button';

interface CountryGroup {
  countryKey: string;
  name: string;
  flag: string;
  description: string;
  scholarships: Scholarship[];
}

function getFundingBadgeStyle(funding: string) {
  const type = funding.toLowerCase();
  if (type.includes('full') || type.includes('fully funded')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold';
  }
  if (type.includes('part') || type.includes('partial')) {
    return 'bg-amber-50 text-amber-700 border-amber-200/80 font-semibold';
  }
  return 'bg-brand-cream/80 text-brand-dark border-brand-border/70 font-medium';
}

function durationLabel(d: Scholarship['duration_months']) {
  if (!d.min && !d.max) return null;
  if (d.min === d.max) return `${d.min} mos`;
  if (!d.min) return `Up to ${d.max} mos`;
  if (!d.max) return `${d.min}+ mos`;
  return `${d.min}-${d.max} mos`;
}

export default function CountryScholarshipCard({ group }: { group: CountryGroup }) {
  const { countryKey, name, flag, scholarships } = group;
  const displayScholarships = scholarships.slice(0, 4);
  const remainingCount = scholarships.length - displayScholarships.length;

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-border/80 bg-white shadow-xs transition-all duration-200 hover:border-brand-accent/40 hover:shadow-md">
      
      {/* Top Accent Gradient Header Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-accent via-brand-accent/40 to-transparent" />

      {/* ── Country Block Header ── */}
      <CardHeader className="p-5 pb-4 border-b border-brand-border/60 bg-brand-bg/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl leading-none flex-shrink-0 drop-shadow-2xs select-none">
              {flag}
            </span>
            <div className="min-w-0">
              <h2 className="font-serif text-lg font-bold text-brand-dark leading-tight group-hover:text-brand-accent transition-colors truncate">
                {name}
              </h2>
              <p className="text-xs text-brand-muted truncate">
                {scholarships.length} Available {scholarships.length === 1 ? 'Opportunity' : 'Opportunities'}
              </p>
            </div>
          </div>

          <LinkButton
            href={`/providers/${countryKey}`}
            variant="secondary"
            size="sm"
            className="flex-shrink-0"
          >
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
      </CardHeader>

      {/* ── Scholarship List Rows ── */}
      <CardContent className="p-0 flex-1 divide-y divide-brand-border/50">
        {displayScholarships.map((s) => {
          const logoUrl = getScholarshipLogo(s);
          const status = getDeadlineStatus(s);
          const dur = durationLabel(s.duration_months);

          return (
            <div
              key={s.slug}
              className="group/item relative flex items-start justify-between gap-3.5 p-4 hover:bg-brand-cream/30 transition-colors"
            >
              {/* Left Logo / Emblem Container (Prominent 44x44) */}
              <div className="relative flex-shrink-0 w-11 h-11 rounded-xl border border-brand-border/70 bg-white flex items-center justify-center p-1.5 shadow-2xs group-hover/item:border-brand-accent/40 transition-colors overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={s.provider}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xl select-none">{flag}</span>
                )}
              </div>

              {/* Center Content: Title, Tags, Meta */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted truncate">
                    {s.provider}
                  </span>
                  <span className="text-brand-border">·</span>
                  <Badge
                    variant="outline"
                    className={cn("text-[9px] px-1.5 py-0", getFundingBadgeStyle(s.funding_type))}
                  >
                    {s.funding_type}
                  </Badge>
                </div>

                <Link
                  href={`/scholarships/${s.slug}`}
                  className="font-serif text-sm font-bold text-brand-dark leading-snug hover:text-brand-accent hover:underline line-clamp-2 mb-2 block"
                >
                  {s.name}
                </Link>

                <div className="flex flex-wrap items-center gap-1.5">
                  {s.degree_levels.slice(0, 2).map((lvl) => (
                    <Badge
                      key={lvl}
                      variant="secondary"
                      className="text-[9px] font-medium bg-brand-cream border border-brand-border/60 text-brand-dark px-1.5 py-0"
                    >
                      <GraduationCap className="h-2.5 w-2.5 mr-1 text-brand-muted" />
                      {lvl}
                    </Badge>
                  ))}

                  {dur && (
                    <span className="flex items-center gap-1 text-[10px] text-brand-muted font-medium ml-1">
                      <Clock className="h-2.5 w-2.5 text-brand-muted" />
                      {dur}
                    </span>
                  )}

                  <div className="ml-auto flex items-center gap-2 pt-1 sm:pt-0">
                    <DeadlineStatus status={status} size="sm" />
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Bookmark & View */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
                <SaveScholarshipButton slug={s.slug} />
                <Link
                  href={`/scholarships/${s.slug}`}
                  aria-label={`View ${s.name}`}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-accent hover:bg-brand-accent/10 transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>

      {/* ── Footer ── */}
      {remainingCount > 0 && (
        <CardFooter className="p-3 px-5 border-t border-brand-border/60 bg-brand-bg/40 flex items-center justify-between text-xs">
          <span className="text-brand-muted font-medium">
            +{remainingCount} more in {name}
          </span>
          <Link
            href={`/providers/${countryKey}`}
            className="font-bold text-brand-accent hover:underline flex items-center gap-1"
          >
            View all {scholarships.length} programs <ArrowRight className="h-3 w-3" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

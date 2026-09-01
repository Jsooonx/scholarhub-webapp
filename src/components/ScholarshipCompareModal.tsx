'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Bookmark, ExternalLink, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMacOsAppZoom } from '@/hooks/useMacOsAppZoom';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { macOSZoomTransition, backdropVariants, modalZoomVariants } from '@/lib/macOsZoomAnimations';
import {
  allScholarships,
  providerGroup,
  providerMeta,
  getScholarshipLogo,
  type Scholarship,
} from '@/lib/scholarships';
import { useShortlist } from '@/components/ShortlistProvider';
import { Button, LinkButton } from '@/components/ui/button';

// ── Helpers ───────────────────────────────────────────────────────────────────

function durationLabel(d: Scholarship['duration_months']) {
  if (!d || (!d.min && !d.max)) return 'Not specified';
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

// ── Selector Component ─────────────────────────────────────────────────────────

function SlotSelector({
  onSelect,
  excludeSlugs,
}: {
  onSelect: (slug: string) => void;
  excludeSlugs: string[];
}) {
  const [search, setSearch] = useState('');
  const { slugs } = useShortlist();

  // Filter shortlist options
  const shortlistOptions = useMemo(() => {
    return allScholarships.filter(s => slugs.has(s.slug) && !excludeSlugs.includes(s.slug));
  }, [slugs, excludeSlugs]);

  // Filter search options
  const searchOptions = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return allScholarships.filter(s =>
      !excludeSlugs.includes(s.slug) &&
      (s.name.toLowerCase().includes(query) ||
        s.provider.toLowerCase().includes(query) ||
        (s.country && s.country.toLowerCase().includes(query)))
    ).slice(0, 5);
  }, [search, excludeSlugs]);

  return (
    <div className="flex flex-col h-full justify-center p-4 border border-dashed border-brand-border rounded-2xl bg-brand-bg/30 min-h-[250px] shadow-inner">
      <p className="text-xs font-serif font-bold text-brand-dark mb-3 text-center">Add Scholarship to Compare</p>
      
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-brand-muted" />
        <input
          type="text"
          placeholder="Search all..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark"
        />
      </div>

      {search.trim() ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Search Results</p>
          {searchOptions.length > 0 ? (
            <div className="space-y-1 max-h-[160px] overflow-y-auto">
              {searchOptions.map(s => {
                const group = providerGroup(s.provider);
                const flag = providerMeta[group]?.flag ?? '🌍';
                return (
                  <Button
                    key={s.slug}
                    type="button"
                    onClick={() => onSelect(s.slug)}
                    variant="secondary"
                    size="sm"
                    shape="control"
                    className="h-auto min-h-9 w-full justify-start rounded-xl bg-white p-2 text-left text-xs truncate"
                  >
                    <span>{flag}</span>
                    <span className="truncate flex-1 font-medium">{s.name}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-brand-muted italic text-center py-2">No scholarships found</p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">From Your Shortlist</p>
          {shortlistOptions.length > 0 ? (
            <div className="space-y-1 max-h-[160px] overflow-y-auto">
              {shortlistOptions.map(s => {
                const group = providerGroup(s.provider);
                const flag = providerMeta[group]?.flag ?? '🌍';
                return (
                  <Button
                    key={s.slug}
                    type="button"
                    onClick={() => onSelect(s.slug)}
                    variant="secondary"
                    size="sm"
                    shape="control"
                    className="h-auto min-h-9 w-full justify-start rounded-xl bg-white p-2 text-left text-xs truncate"
                  >
                    <span>{flag}</span>
                    <span className="truncate flex-1 font-medium">{s.name}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 border border-dashed border-brand-border/50 rounded-xl bg-white/55">
              <Bookmark className="h-5 w-5 text-brand-muted/40 mx-auto mb-1" />
              <p className="text-[9px] text-brand-muted leading-snug">Shortlist is empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Modal Component ───────────────────────────────────────────────────────

interface ModalProps {
  currentScholarship: Scholarship;
  buttonCenter: { x: number; y: number } | null;
  onClose: () => void;
}

export default function ScholarshipCompareModal({ currentScholarship, buttonCenter, onClose }: ModalProps) {
  const [slotBSlug, setSlotBSlug] = useState<string | null>(null);
  const [slotCSlug, setSlotCSlug] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Calculate transform origin dynamically using the shared hook
  useMacOsAppZoom(modalRef, buttonCenter);

  const initialOrigin = useMemo(() => {
    if (typeof window === 'undefined' || !buttonCenter) return '50% 50%';
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(1152, vw - 64);
    const h = vh * 0.9;
    const left = (vw - w) / 2;
    const top = (vh - h) / 2;
    return `${buttonCenter.x - left}px ${buttonCenter.y - top}px`;
  }, [buttonCenter]);

  // Lock body/html scroll when open
  useBodyScrollLock(true);

  // Esc key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Resolve scholarship objects
  const sA = currentScholarship;
  const sB = useMemo(() => slotBSlug ? allScholarships.find(s => s.slug === slotBSlug) : null, [slotBSlug]);
  const sC = useMemo(() => slotCSlug ? allScholarships.find(s => s.slug === slotCSlug) : null, [slotCSlug]);

  const excludeSlugs = useMemo(() => {
    return [sA.slug, slotBSlug, slotCSlug].filter(Boolean) as string[];
  }, [sA.slug, slotBSlug, slotCSlug]);

  const columns = [
    { key: 'a', scholarship: sA, isCurrent: true, onRemove: () => {} },
    { key: 'b', scholarship: sB, isCurrent: false, onRemove: () => setSlotBSlug(null) },
    { key: 'c', scholarship: sC, isCurrent: false, onRemove: () => setSlotCSlug(null) },
  ];

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div 
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <motion.div 
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transform-gpu will-change-[opacity,backdrop-filter]"
      />

      <motion.div
        ref={modalRef}
        variants={modalZoomVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={macOSZoomTransition}
        style={{ transformOrigin: initialOrigin }}
        className="relative bg-white rounded-3xl border border-brand-border w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border/60 px-4 py-4 sm:px-6 sm:py-4.5 bg-brand-cream/40">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-brand-dark" />
            <h2 className="font-serif text-lg font-bold text-brand-dark">Compare Scholarships</h2>
          </div>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="icon-sm"
            shape="circle"
            aria-label="Close comparison"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1 bg-brand-bg/10">
          <p className="mb-2 text-[10px] text-brand-muted sm:hidden">Geser tabel ke samping untuk membandingkan semua kolom.</p>
          <div className="overflow-x-auto border border-brand-border/60 rounded-2xl bg-white shadow-sm">
            <table className="w-full table-fixed min-w-[640px] sm:min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-brand-border/60 bg-brand-cream/20">
                  {/* Label Column Header */}
                  <th className="w-[132px] p-3 sm:w-[180px] sm:p-4 text-xs font-bold text-brand-muted uppercase tracking-wider sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Criteria
                  </th>
                  
                  {/* Scholarship Columns Header */}
                  {columns.map((col, idx) => (
                    <th key={col.key} className="p-5 align-top border-r border-brand-border/60 last:border-r-0 w-[240px]">
                      {col.scholarship ? (
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                                {col.scholarship.provider}
                              </span>
                              {col.isCurrent ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-dark text-white border border-brand-dark">
                                  Current
                                </span>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={col.onRemove}
                                  variant="ghost"
                                  size="icon-xs"
                                  shape="circle"
                                  title="Remove from comparison"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2.5 mb-3">
                              <div className="relative flex-shrink-0 w-9 h-9 rounded-xl border border-brand-border bg-white flex items-center justify-center p-1.5 text-lg">
                                {getScholarshipLogo(col.scholarship) ? (
                                  <img src={getScholarshipLogo(col.scholarship)!} alt={col.scholarship.provider} className="w-full h-full object-contain" />
                                ) : (
                                  providerMeta[providerGroup(col.scholarship.provider)]?.flag ?? '🌍'
                                )}
                              </div>
                              <h3 className="font-serif text-xs font-bold text-brand-dark line-clamp-2 leading-snug">
                                {col.scholarship.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <SlotSelector
                          onSelect={(slug) => {
                            if (col.key === 'b') setSlotBSlug(slug);
                            else setSlotCSlug(slug);
                          }}
                          excludeSlugs={excludeSlugs}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-brand-border/40">
                {/* 1. Country */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Country
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs text-brand-dark border-r border-brand-border/60 last:border-r-0 font-medium">
                      {col.scholarship ? (
                        <div className="flex items-center gap-1.5">
                          <span>{providerMeta[providerGroup(col.scholarship.provider)]?.flag ?? '🌍'}</span>
                          <span>{col.scholarship.country ?? 'Global / Various'}</span>
                        </div>
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 2. Degree Levels */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Degree Levels
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs text-brand-dark border-r border-brand-border/60 last:border-r-0">
                      {col.scholarship ? (
                        <div className="flex flex-wrap gap-1">
                          {col.scholarship.degree_levels.map((level) => (
                            <span key={level} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-cream border border-brand-border text-brand-dark">
                              {level}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 3. Funding Type */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Funding
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs text-brand-dark border-r border-brand-border/60 last:border-r-0">
                      {col.scholarship ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${fundingClass(col.scholarship.funding_type)}`}>
                          {col.scholarship.funding_type}
                        </span>
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 4. Duration */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Duration
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs text-brand-dark border-r border-brand-border/60 last:border-r-0 font-medium">
                      {col.scholarship ? (
                        durationLabel(col.scholarship.duration_months)
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 5. Work Experience */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Experience
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs text-brand-dark border-r border-brand-border/60 last:border-r-0">
                      {col.scholarship ? (
                        <div className="space-y-1">
                          <p className="font-semibold">
                            {col.scholarship.requirements.professional_experience_required ? 'Required' : 'No Experience Required'}
                          </p>
                          {col.scholarship.requirements.professional_experience_years && (
                            <p className="text-[10px] text-brand-muted">
                              Min. {col.scholarship.requirements.professional_experience_years} years
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6. Age & Target Group */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Target Group
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs text-brand-dark border-r border-brand-border/60 last:border-r-0">
                      {col.scholarship ? (
                        <p className="line-clamp-3 leading-relaxed" title={col.scholarship.target_group ?? 'Open to all nationalities'}>
                          {col.scholarship.target_group ?? 'Open to all nationalities'}
                        </p>
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 7. Deadline */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Deadline
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs text-brand-dark border-r border-brand-border/60 last:border-r-0 font-medium">
                      {col.scholarship ? (
                        <span className="text-brand-dark">
                          {col.scholarship.deadline ?? 'Verify on official site'}
                        </span>
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 8. Action Link */}
                <tr className="hover:bg-brand-bg/5 transition-colors">
                  <td className="p-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted sticky left-0 bg-brand-cream/70 border-r border-brand-border/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Link
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs border-r border-brand-border/60 last:border-r-0">
                      {col.scholarship ? (
                        col.scholarship.official_url ? (
                          <LinkButton
                            href={col.scholarship.official_url}
                            external
                            variant="primary"
                            size="sm"
                          >
                            <span>Official Site</span>
                            <ExternalLink className="h-3 w-3" />
                          </LinkButton>
                        ) : (
                          <span className="text-[10px] text-brand-muted italic">No link</span>
                        )
                      ) : (
                        <span className="text-brand-muted/40 italic">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

'use client';

import { 
  ExternalLink, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Lightbulb, 
  Zap, 
  Globe, 
  Check, 
  X 
} from 'lucide-react';
import type { EnrichmentData, SocialLink } from '@/data/enriched';
import { LinkButton } from '@/components/ui/button';

interface Props {
  data: EnrichmentData;
  className?: string;
}

export default function InsiderGuide({ data, className = '' }: Props) {
  const { tracks, trackSectionTitle, exams, socialLinks, strategyTips, differentiators } = data;

  if (!tracks && !exams && !socialLinks && !strategyTips && !differentiators) return null;

  const getPlatformDetails = (platform: SocialLink['platform']) => {
    switch (platform) {
      case 'instagram':
        return {
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          ),
          color: 'hover:text-[#E1306C] hover:border-[#E1306C]'
        };
      case 'youtube':
        return {
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          ),
          color: 'hover:text-[#FF0000] hover:border-[#FF0000]'
        };
      case 'telegram':
        return {
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.897 8.938c-.143.64-.52.798-1.058.496l-2.888-2.128-1.393 1.34c-.154.154-.284.284-.582.284l.207-2.936 5.344-4.828c.232-.206-.051-.32-.361-.114L8.71 13.914l-2.846-.889c-.619-.193-.631-.619.129-.916l11.12-4.285c.515-.187.965.12.749.937z"/>
            </svg>
          ),
          color: 'hover:text-[#0088cc] hover:border-[#0088cc]'
        };
      case 'tiktok':
        return {
          icon: (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.5-4.09-1.32-.23-.16-.45-.34-.65-.54-.03 2.93-.01 5.86-.02 8.79a7.357 7.357 0 0 1-2.45 5.31c-2.91 2.53-7.55 2.14-10-.78a7.371 7.371 0 0 1-1.35-6.2c.57-2.73 2.82-4.99 5.56-5.51.98-.18 1.98-.12 2.94.13v4.19c-.83-.24-1.74-.2-2.5.21-.99.53-1.65 1.65-1.49 2.77.1 1.5 1.45 2.75 2.96 2.65 1.53-.1 2.75-1.41 2.75-2.95V.02h-.01z"/>
            </svg>
          ),
          color: 'hover:text-black hover:border-black'
        };
      default:
        return { icon: <Globe className="w-3.5 h-3.5" />, color: 'hover:text-brand-accent hover:border-brand-accent' };
    }
  };

  return (
    <div className={`space-y-6 sm:space-y-8 mobile-safe-wrap ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-brand-border">
        <Lightbulb className="w-4.5 h-4.5 text-brand-dark" />
        <h2 className="text-sm font-serif font-bold text-brand-dark uppercase tracking-wider">Insider's Guide</h2>
      </div>

      {/* Track Comparison */}
      {tracks && tracks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-brand-muted" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">{trackSectionTitle || 'Track Comparison'}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tracks.map((track) => (
              <div key={track.name} className="min-w-0 bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex flex-col items-start gap-2 mb-3 sm:flex-row sm:justify-between">
                    <h4 className="min-w-0 text-sm font-bold text-brand-dark leading-snug">{track.name}</h4>
                    {track.acceptanceRate && (
                      <span className="max-w-full break-words rounded-xl border border-brand-border/60 bg-brand-cream px-2.5 py-1 text-left text-[10px] font-bold leading-snug text-brand-dark sm:max-w-[60%]">
                        {track.acceptanceRate}
                      </span>
                    )}
                  </div>
                  {track.quota && (
                    <p className="text-[11px] text-brand-muted mb-2 font-medium break-words">
                      Quota: <span className="text-brand-dark">{track.quota}</span>
                    </p>
                  )}
                  {track.bestFor && (
                    <p className="text-xs text-brand-accent mb-3.5 bg-brand-accent/5 rounded-xl px-3 py-2 leading-relaxed font-serif italic">
                      Best for: {track.bestFor}
                    </p>
                  )}
                  {track.pros.length > 0 && (
                    <div className="space-y-1.5 mb-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-semibold">Pros</p>
                      <ul className="space-y-1.5">
                        {track.pros.map((p, i) => (
                          <li key={i} className="text-xs text-brand-muted flex items-start gap-2 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-emerald-600 bg-emerald-50 rounded-full p-0.5 shrink-0 mt-0.5" />
                            <span className="min-w-0 break-words">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {track.cons.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 font-semibold">Cons</p>
                      <ul className="space-y-1.5">
                        {track.cons.map((c, i) => (
                          <li key={i} className="text-xs text-brand-muted flex items-start gap-2 leading-relaxed">
                            <X className="w-3.5 h-3.5 text-rose-500 bg-rose-50 rounded-full p-0.5 shrink-0 mt-0.5" />
                            <span className="min-w-0 break-words">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Details */}
      {exams && exams.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-brand-muted" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Written Exam Guide</h3>
          </div>
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.program} className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-brand-dark mb-3">{exam.program}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {exam.subjects.map((sub) => (
                      <div key={sub.name} className="bg-brand-cream/50 border border-brand-border/40 rounded-xl p-3 flex flex-col justify-between">
                        <p className="text-xs font-bold text-brand-dark mb-1">{sub.name}</p>
                        {sub.notes && <p className="text-[11px] text-brand-muted leading-relaxed">{sub.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                {exam.tips.length > 0 && (
                  <div className="space-y-2 pt-2.5 border-t border-brand-border/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted font-semibold">Preparation Tips</p>
                    <ul className="space-y-2">
                      {exam.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-brand-muted flex items-start gap-2 leading-relaxed">
                          <Lightbulb className="w-3.5 h-3.5 text-brand-dark shrink-0 mt-0.5" />
                          <span className="min-w-0 break-words">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exam.pastPapersUrl && (
                  <div className="pt-2">
                    <LinkButton href={exam.pastPapersUrl} external variant="primary" size="sm">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Question Bank & Answer Sheets</span>
                      <ExternalLink className="w-3 h-3" />
                    </LinkButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Tips */}
      {strategyTips && strategyTips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-brand-muted" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">General Strategy Tips</h3>
          </div>
          <div className="bg-brand-cream border border-brand-border rounded-2xl p-4 sm:p-5">
            <ul className="space-y-3">
              {strategyTips.map((tip, i) => (
                <li key={i} className="text-xs text-brand-muted flex items-start gap-2.5 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-dark text-white text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="min-w-0 break-words">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Community & Resources */}
      {socialLinks && socialLinks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-brand-muted" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Community & Resources</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {socialLinks.map((link) => {
              const { icon, color } = getPlatformDetails(link.platform);
              return (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                   className={`inline-flex max-w-full items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-dark transition-all shadow-sm hover:shadow ${color}`}>
                  <span className="shrink-0">{icon}</span>
                  <span className="min-w-0 break-words font-medium">{link.label}: {link.handle}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-brand-muted" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Differentiators */}
      {differentiators && differentiators.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-brand-muted" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">What Makes This Special</h3>
          </div>
          <div className="space-y-3">
            {differentiators.map((diff) => (
              <div key={diff.label} className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-sm">
                <h4 className="text-xs font-bold text-brand-dark mb-1.5">{diff.label}</h4>
                <p className="text-xs text-brand-muted leading-relaxed">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

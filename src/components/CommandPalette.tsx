'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Bookmark,
  GraduationCap,
  BookOpen,
  User,
} from 'lucide-react';
import { defaultFilter } from 'cmdk';

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { providerMeta } from '@/lib/scholarships/providerMeta';
import { loadSearchItems, type SearchItem } from '@/lib/scholarships/searchIndex';
import { useShortlist } from '@/components/ShortlistProvider';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOP_COUNTRIES = Object.entries(providerMeta).map(([slug, meta]) => ({
  slug,
  name: meta.name,
  country: meta.country,
  flag: meta.flag,
}));

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { authenticated, slugs } = useShortlist();
  const [scholarships, setScholarships] = useState<SearchItem[]>([]);
  const [search, setSearch] = useState('');

  // Pre-load compact search index on mount so it's instantly available
  useEffect(() => {
    loadSearchItems()
      .then((items) => {
        setScholarships(items);
      })
      .catch((err) => console.error('Failed to load search index:', err));
  }, []);

  // Reset search when dialog is closed
  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const navigateTo = useCallback(
    (path: string) => {
      onOpenChange(false);
      router.push(path);
    },
    [router, onOpenChange]
  );

  // High-precision filter with instant substring matching and fuzzy fallback
  const filterItems = useCallback(
    (value: string, searchStr: string, keywords?: string[]) => {
      const v = value.toLowerCase();
      const s = searchStr.trim().toLowerCase();
      if (!s) return 1;

      // 1. Direct substring match on primary item value
      if (v.includes(s)) return 1;

      // 2. Direct substring match on declared keywords
      if (keywords && keywords.some((k) => k?.toLowerCase().includes(s))) return 1;

      // 3. For short queries (<= 2 chars), don't do loose fuzzy to avoid spurious noise
      if (s.length <= 2) return 0;

      // 4. Fall back to cmdk fuzzy filter with confidence cutoff
      const score = defaultFilter(v, s);
      return score > 0.15 ? score : 0;
    },
    []
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      filter={filterItems}
      title="Global Command Palette"
      description="Quickly navigate, search scholarships, or explore destinations."
    >
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search scholarships, destinations, degrees, or actions..."
      />
      <CommandList>
        <CommandEmpty>No results found. Try searching by country, degree, or scholarship name.</CommandEmpty>

        {/* ── 1. QUICK ACTIONS / NAVIGATION ── */}
        <CommandGroup heading="Quick Navigation">
          <CommandItem
            value="scholarmatch quiz recommendation test match"
            keywords={['quiz', 'match', 'test', 'rekomendasi']}
            onSelect={() => navigateTo('/match')}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-accent/10 text-brand-accent">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium text-brand-dark">ScholarMatch Quiz</span>
            <span className="text-[10px] text-brand-muted">Find your match (30s)</span>
            <CommandShortcut>Quiz</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="application tracker shortlist saved bookmark applications"
            keywords={['tracker', 'shortlist', 'saved', 'aplikasi']}
            onSelect={() => navigateTo('/shortlist')}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-dark/5 text-brand-dark">
              <Bookmark className="h-3.5 w-3.5 text-brand-accent" />
            </div>
            <span className="font-medium text-brand-dark">Application Tracker &amp; Shortlist</span>
            {slugs.size > 0 && (
              <Badge className="h-4 px-1.5 text-[9px] bg-brand-accent text-white border-none font-semibold">
                {slugs.size} saved
              </Badge>
            )}
            <CommandShortcut>Tracker</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="browse all scholarships directory catalog list"
            keywords={['directory', 'scholarships', 'beasiswa', 'semua']}
            onSelect={() => navigateTo('/scholarships')}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-dark/5 text-brand-dark">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium text-brand-dark">Browse All Scholarships</span>
            <CommandShortcut>Directory</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="guides requirements documentation help tips"
            keywords={['guides', 'panduan', 'syarat', 'requirements']}
            onSelect={() => navigateTo('/about')}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-dark/5 text-brand-dark">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium text-brand-dark">Guides &amp; Requirements</span>
            <CommandShortcut>Help</CommandShortcut>
          </CommandItem>

          {authenticated && (
            <CommandItem
              value="profile account settings user"
              keywords={['profile', 'account', 'settings']}
              onSelect={() => navigateTo('/profile')}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-dark/5 text-brand-dark">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium text-brand-dark">Profile Settings</span>
              <CommandShortcut>Account</CommandShortcut>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        {/* ── 2. FILTER BY DEGREE LEVEL ── */}
        <CommandGroup heading="Degree Levels">
          <CommandItem
            value="bachelor bachelors s1 undergraduate degree scholarships"
            keywords={['bachelor', 'undergraduate', 's1']}
            onSelect={() => navigateTo('/scholarships?degree=bachelor')}
          >
            <span className="text-sm">🎓</span>
            <span className="font-medium text-brand-dark">Bachelor&apos;s Scholarships</span>
            <CommandShortcut>Undergrad</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="master masters s2 postgraduate graduate degree scholarships"
            keywords={['master', 'postgraduate', 's2']}
            onSelect={() => navigateTo('/scholarships?degree=master')}
          >
            <span className="text-sm">📜</span>
            <span className="font-medium text-brand-dark">Master&apos;s Scholarships</span>
            <CommandShortcut>Postgrad</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="phd doctorate doctoral s3 research fellowship scholarships"
            keywords={['phd', 'doctorate', 'doctoral', 's3']}
            onSelect={() => navigateTo('/scholarships?degree=phd')}
          >
            <span className="text-sm">🔬</span>
            <span className="font-medium text-brand-dark">PhD / Doctoral Fellowships</span>
            <CommandShortcut>Doctorate</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* ── 3. STUDY DESTINATIONS & PROVIDERS ── */}
        <CommandGroup heading="Study Destinations">
          {TOP_COUNTRIES.map((p) => (
            <CommandItem
              key={p.slug}
              value={`${p.name} ${p.country} ${p.slug} destination country`}
              keywords={[p.name, p.country, p.slug]}
              onSelect={() => navigateTo(`/providers/${p.slug}`)}
            >
              <span className="text-sm">{p.flag}</span>
              <span className="font-medium text-brand-dark">{p.name}</span>
              <span className="text-[10px] text-brand-muted">{p.country}</span>
              <CommandShortcut>Country</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* ── 4. LIVE SCHOLARSHIP RESULTS (ALL 245 ITEMS) ── */}
        {scholarships.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Scholarships">
              {scholarships.map((s) => {
                const searchKeywords = [
                  s.name,
                  s.provider,
                  s.country,
                  s.funding_type,
                  ...(s.degree_levels || []),
                ].filter(Boolean);

                return (
                  <CommandItem
                    key={s.slug}
                    value={`${s.name} ${s.provider} ${s.country} ${s.funding_type} ${(s.degree_levels || []).join(' ')} ${s.slug}`}
                    keywords={searchKeywords}
                    onSelect={() => navigateTo(`/scholarships/${s.slug}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-brand-dark group-hover/command-item:text-brand-accent group-data-[selected=true]/command-item:text-brand-accent group-aria-selected/command-item:text-brand-accent transition-colors">
                        {s.name}
                      </p>
                      <p className="truncate text-[10px] text-brand-muted">
                        {s.provider} {s.country ? `· ${s.country}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {s.funding_type && (
                        <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-muted font-medium">
                          {s.funding_type}
                        </span>
                      )}
                      {s.degree_levels?.[0] && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-brand-border capitalize">
                          {s.degree_levels[0]}
                        </Badge>
                      )}
                      <span className="hidden group-data-[selected=true]/command-item:inline-flex group-aria-selected/command-item:inline-flex items-center text-[10px] text-brand-accent font-semibold ml-1">
                        <kbd className="rounded border border-brand-accent/25 bg-brand-accent/10 px-1 py-0.5 font-mono text-[9px] text-brand-accent shadow-2xs">
                          ↵
                        </kbd>
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* ── PALETTE FOOTER WITH KEYBOARD HINTS ── */}
      <div className="flex items-center justify-between border-t border-brand-border/60 bg-brand-cream/50 px-4 py-2.5 text-[10px] text-brand-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-brand-border bg-white px-1 py-0.5 font-mono text-[9px] shadow-2xs">
              ↑↓
            </kbd>{' '}
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-brand-border bg-white px-1 py-0.5 font-mono text-[9px] shadow-2xs">
              ↵
            </kbd>{' '}
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-brand-border bg-white px-1 py-0.5 font-mono text-[9px] shadow-2xs">
              esc
            </kbd>{' '}
            close
          </span>
        </div>
        <span className="hidden sm:inline-block font-semibold text-brand-dark/70">
          Scholar<span className="text-brand-accent">Hub</span> Command
        </span>
      </div>
    </CommandDialog>
  );
}

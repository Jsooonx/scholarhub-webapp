'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';

import { allScholarships, providerMeta, providerGroup } from '@/lib/scholarships';

// Extract unique programs grouped by country, sorted by country then program
const uniquePrograms = Array.from(
  new Map(
    allScholarships.map(s => {
      // Normalize provider name for display
      const key = s.provider;
      return [key, { provider: s.provider, country: s.country, group: providerGroup(s.provider) }];
    })
  ).values()
).sort((a, b) => {
  const countryA = a.country ?? '';
  const countryB = b.country ?? '';
  if (countryA !== countryB) return countryA.localeCompare(countryB);
  return a.provider.localeCompare(b.provider);
});

// Build a map of country flags for program labels
const programFlagMap: Record<string, string> = {};
Object.values(providerMeta).forEach(meta => {
  if (meta.country) {
    programFlagMap[meta.country.toLowerCase()] = meta.flag;
  }
});

const PROVIDERS = [
  { value: 'all', label: 'All Programs' },
  ...uniquePrograms.map(p => ({
    value: p.provider,
    label: `${programFlagMap[p.country?.toLowerCase() ?? ''] ?? '🌍'} ${p.provider}`,
  })),
];

const FUNDING = [
  { value: 'all', label: 'All Funding' },
  { value: 'fully', label: 'Fully Funded' },
  { value: 'partial', label: 'Partially Funded' },
];

const LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'master', label: 'Master' },
  { value: 'phd', label: 'PhD' },
  { value: 'non-degree', label: 'Non-Degree / Short' },
];

const uniqueCountries = Array.from(new Set(
  allScholarships.map(s => s.country).filter(Boolean)
)).sort() as string[];

const countryFlagMap: Record<string, string> = {};
Object.values(providerMeta).forEach(meta => {
  if (meta.country) {
    countryFlagMap[meta.country.toLowerCase()] = meta.flag;
  }
});

const COUNTRIES = [
  { value: 'all', label: 'All Countries' },
  ...uniqueCountries.map(c => ({
    value: c.toLowerCase(),
    label: `${countryFlagMap[c.toLowerCase()] ?? '🌍'} ${c}`,
  }))
];

const DEBOUNCE_MS = 350;

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (val: string) => void;
  align?: 'left' | 'right';
  fullWidth?: boolean;
}

function CustomSelect({ value, options, onChange, align = 'left', fullWidth = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative text-left z-20 ${fullWidth ? 'block w-full' : 'inline-block'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-1.5 text-xs px-3 py-2 rounded-full border border-brand-border bg-white text-brand-dark hover:border-brand-dark/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-dark/20 cursor-pointer min-w-[125px] text-left ${fullWidth ? 'w-full min-h-11 px-4' : ''}`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-brand-muted" />
      </button>

      {isOpen && (
        <div 
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-60 rounded-2xl border border-brand-border bg-white shadow-lg py-1.5 z-50 focus:outline-none`}
        >
          <div
            data-lenis-prevent
            className="max-h-[280px] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E8E8E6 transparent' }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-brand-cream/80 flex items-center gap-2 ${
                  option.value === value ? 'bg-brand-cream/60 font-semibold text-brand-dark' : 'text-brand-dark/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScholarshipsFilter({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? 'all';
  const queryParam = searchParams.get('q') ?? '';

  // Local state for search input - updates URL after debounce
  const [searchValue, setSearchValue] = useState(queryParam);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync if URL changes externally (e.g. clear button)
  useEffect(() => {
    setSearchValue(queryParam);
  }, [queryParam]);

  const pushParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams('q', value);
    }, DEBOUNCE_MS);
  };

  const clearAll = () => {
    setSearchValue('');
    router.push(pathname, { scroll: false });
  };

  const hasFilters =
    queryParam ||
    get('provider') !== 'all' ||
    get('funding') !== 'all' ||
    get('level') !== 'all' ||
    get('country') !== 'all';

  const activeFilterCount = [
    get('provider'),
    get('funding'),
    get('level'),
    get('country'),
  ].filter((value) => value !== 'all').length;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted pointer-events-none" />
        <input
          type="search"
          placeholder="Search scholarships, fields, providers…"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20 placeholder:text-brand-muted/60"
        />
      </div>

      {/* Desktop filter row */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        <CustomSelect
          value={get('provider')}
          options={PROVIDERS}
          onChange={(val) => pushParams('provider', val)}
        />

        <CustomSelect
          value={get('funding')}
          options={FUNDING}
          onChange={(val) => pushParams('funding', val)}
        />

        <CustomSelect
          value={get('level')}
          options={LEVELS}
          onChange={(val) => pushParams('level', val)}
        />

        <CustomSelect
          value={get('country')}
          options={COUNTRIES}
          onChange={(val) => pushParams('country', val)}
          align="right"
        />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}

        <p className="ml-auto text-xs text-brand-muted hidden sm:block">
          <span className="font-semibold text-brand-dark">{total}</span> result{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Mobile keeps the persistent bar compact; the full controls open in a
          dedicated sheet rather than consuming most of the viewport. */}
      <div className="sm:hidden flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-border bg-white px-4 text-xs font-semibold text-brand-dark transition-colors active:scale-[0.98]"
        >
          <Filter className="h-4 w-4" />
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        <p className="text-xs text-brand-muted">
          <span className="font-semibold text-brand-dark">{total}</span> result{total !== 1 ? 's' : ''}
        </p>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden" role="dialog" aria-modal="true" aria-label="Filter scholarships">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-brand-dark/25 backdrop-blur-[1px]"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div data-lenis-prevent className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-3xl bg-brand-bg p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Refine results</p>
                <h2 className="font-serif text-2xl font-bold text-brand-dark">Filters</h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-brand-border bg-white text-brand-dark active:scale-95"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <CustomSelect value={get('provider')} options={PROVIDERS} onChange={(val) => pushParams('provider', val)} fullWidth />
              <CustomSelect value={get('funding')} options={FUNDING} onChange={(val) => pushParams('funding', val)} fullWidth />
              <CustomSelect value={get('level')} options={LEVELS} onChange={(val) => pushParams('level', val)} fullWidth />
              <CustomSelect value={get('country')} options={COUNTRIES} onChange={(val) => pushParams('country', val)} fullWidth />
            </div>
            <div className="mt-6 flex gap-3">
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => { clearAll(); setMobileFiltersOpen(false); }}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-600 active:scale-[0.98]"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-brand-dark px-4 text-xs font-bold text-white active:scale-[0.98]"
              >
                Show {total} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

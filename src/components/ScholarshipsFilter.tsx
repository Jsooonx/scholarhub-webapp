'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

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
}

function CustomSelect({ value, options, onChange, align = 'left' }: CustomSelectProps) {
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
    <div ref={containerRef} className="relative inline-block text-left z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 text-xs px-3 py-2 rounded-full border border-brand-border bg-white text-brand-dark hover:border-brand-dark/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-dark/20 cursor-pointer min-w-[125px] text-left"
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

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* Mobile result count */}
      <p className="text-xs text-brand-muted sm:hidden">
        <span className="font-semibold text-brand-dark">{total}</span> result{total !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

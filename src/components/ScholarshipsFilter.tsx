'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

import { allScholarships, providerMeta } from '@/lib/scholarships';

const PROVIDERS = [
  { value: 'all', label: 'All Providers' },
  ...Object.entries(providerMeta).map(([slug, meta]) => ({
    value: slug,
    label: `${meta.flag} ${meta.name}`,
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
        <select
          value={get('provider')}
          onChange={(e) => pushParams('provider', e.target.value)}
          className="text-xs px-3 py-2 rounded-full border border-brand-border bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark/20 cursor-pointer"
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          value={get('funding')}
          onChange={(e) => pushParams('funding', e.target.value)}
          className="text-xs px-3 py-2 rounded-full border border-brand-border bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark/20 cursor-pointer"
        >
          {FUNDING.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          value={get('level')}
          onChange={(e) => pushParams('level', e.target.value)}
          className="text-xs px-3 py-2 rounded-full border border-brand-border bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark/20 cursor-pointer"
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        <select
          value={get('country')}
          onChange={(e) => pushParams('country', e.target.value)}
          className="text-xs px-3 py-2 rounded-full border border-brand-border bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark/20 cursor-pointer"
        >
          {COUNTRIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

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

import data from '../../../data/scholarships.json';
import { Scholarship, FilterParams } from './types';
import { toSlug, providerGroup, getDeadlineStatus } from './helpers';

// ── Build the enriched list once ──────────────────────────────────────────

const rawList = (data as { scholarships: Omit<Scholarship, 'slug'>[] }).scholarships;

// Deduplicate slugs by appending an index if necessary
const seenSlugs = new Map<string, number>();

export const allScholarships: Scholarship[] = rawList.map((s) => {
  const base = toSlug(s.name);
  const count = seenSlugs.get(base) ?? 0;
  seenSlugs.set(base, count + 1);
  const slug = count === 0 ? base : `${base}-${count}`;
  return { ...s, slug } as Scholarship;
});


// ── Accessors ──────────────────────────────────────────────────────────────

export function getScholarshipBySlug(slug: string): Scholarship | undefined {
  return allScholarships.find((s) => s.slug === slug);
}

export function getScholarshipsByProvider(group: string): Scholarship[] {
  return allScholarships.filter((s) => providerGroup(s.provider) === group.toLowerCase());
}

export function getAllSlugs(): string[] {
  return allScholarships.map((s) => s.slug);
}

// ── Filter helpers used by /scholarships page ─────────────────────────────


export function filterScholarships(params: FilterParams): Scholarship[] {
  let list = allScholarships;

  if (params.query) {
    const q = params.query.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description ?? '').toLowerCase().includes(q) ||
        s.fields.some((f) => f.toLowerCase().includes(q))
    );
  }

  if (params.provider && params.provider !== 'all') {
    // Match by exact provider name (program-specific, e.g. "DAAD", "Chevening")
    list = list.filter((s) => s.provider === params.provider);
  }

  if (params.funding && params.funding !== 'all') {
    list = list.filter((s) =>
      s.funding_type.toLowerCase().includes(params.funding!.toLowerCase())
    );
  }

  if (params.level && params.level !== 'all') {
    list = list.filter((s) =>
      s.degree_levels.some((d) =>
        d.toLowerCase().includes(params.level!.toLowerCase())
      )
    );
  }

  if (params.country && params.country !== 'all') {
    list = list.filter(
      (s) => s.country?.toLowerCase() === params.country!.toLowerCase()
    );
  }

  return list;
}

// ── Deadline / status logic ───────────────────────────────────────────────


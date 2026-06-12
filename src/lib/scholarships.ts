import data from '../../data/scholarships.json';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Scholarship {
  name: string;
  provider: string;
  country: string | null;
  degree_levels: string[];
  fields: string[];
  funding_type: string;
  duration_months: { min: number | null; max: number | null };
  requirements: {
    first_degree_required: boolean | null;
    professional_experience_required: boolean | null;
    professional_experience_years: number | null;
    country_restrictions: string[];
    raw_items?: string[];
  };
  benefits: string[];
  target_group: string | null;
  official_url: string | null;
  description: string | null;
  confidence_score: number;
  source: string;
  // MEXT-specific optional fields
  program_type?: string;
  deadline?: string;
  amounts?: string[];
  application_period?: string[];
  application_process?: string[];
  selection_process?: string;
  important_dates?: string[];
  related_links?: { label: string; url: string }[];
  // Computed
  slug: string;
}

// ── Slug helpers ───────────────────────────────────────────────────────────

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // strip special chars
    .trim()
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .slice(0, 80);                  // cap length
}

/** Normalise provider string to a group slug */
export function providerGroup(provider: string): string {
  const p = provider.toLowerCase();
  if (p.includes('daad') || p.includes('dlr')) return 'daad';
  if (p.includes('mext') || p.includes('monbukagakusho')) return 'mext';
  if (p.includes('turkiye') || p.includes('ytb') || p.includes('burslari')) return 'turkiye';
  if (p.includes('chevening')) return 'chevening';
  if (p.includes('australia awards') || p.includes('dfat') || p.includes('lpdp')) return 'australia-awards';
  if (p.includes('niied') || p.includes('korean government') || p.includes('gks')) return 'gks';
  if (p.includes('a*star') || p.includes('astar') || p.includes('nus') || p.includes('ntu') || p.includes('singa') || p.includes('nanyang') || p.includes('national university of singapore')) return 'singapore';
  if (p.includes('eiffel') || p.includes('campus france') || p.includes('french ministry')) return 'eiffel';
  if (p.includes('paris-saclay') || p.includes('paris saclay') || p.includes('sciences po') || p.includes('ens de lyon') || p.includes('ens lyon')) return 'eiffel';
  if (p.includes('canada') || p.includes('cihr') || p.includes('nserc') || p.includes('sshrc') || p.includes('crtas') || p.includes('cgrs') || p.includes('university of toronto')) return 'canada';
  if (p.includes('eiffel')) return 'eiffel';
  if (p.includes('singa')) return 'singa';
  if (p.includes('vanier')) return 'vanier';
  // Fallback: slugify provider name
  return p.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

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

export interface FilterParams {
  query?: string;
  provider?: string;
  funding?: string;
  level?: string;
  country?: string;
}

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
    list = list.filter((s) => providerGroup(s.provider) === params.provider);
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

export type DeadlineStatus =
  | { type: 'open';    label: string; daysLeft: number; deadline: Date }
  | { type: 'closing'; label: string; daysLeft: number; deadline: Date }
  | { type: 'closed';  label: string; deadline: Date }
  | { type: 'rolling'; label: string }
  | { type: 'check';   label: string };

/**
 * Extracts the first parseable ISO-like date string from an array of
 * messy strings such as MEXT's important_dates format.
 */
function extractDate(strings: string[]): Date | null {
  const joined = strings.join(' ');

  // Try ISO-ish formats: "10 Mei 2026", "10 May 2026", "February 20, 2026"
  const MONTHS_ID: Record<string, number> = {
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
    juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
  };
  const MONTHS_EN: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };

  // Pattern: "10 Mei 2026" or "22 Januari 2026"
  const idMatch = joined.match(/(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})/);
  if (idMatch) {
    const day = parseInt(idMatch[1]);
    const rawMonth = idMatch[2].toLowerCase();
    const year = parseInt(idMatch[3]);
    const month = MONTHS_ID[rawMonth] ?? MONTHS_EN[rawMonth];
    if (month !== undefined) return new Date(year, month, day);
  }

  // Pattern: "February 20, 2026"
  const enMatch = joined.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(20\d{2})/);
  if (enMatch) {
    const rawMonth = enMatch[1].toLowerCase();
    const day = parseInt(enMatch[2]);
    const year = parseInt(enMatch[3]);
    const month = MONTHS_EN[rawMonth];
    if (month !== undefined) return new Date(year, month, day);
  }

  return null;
}

/**
 * Türkiye Burslari general application window: Jan 10 – Feb 20 annually.
 * Returns a synthetic deadline for the nearest upcoming or past cycle.
 */
function getTurkiyeDeadline(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const deadline = new Date(year, 1, 20); // Feb 20
  // If already past this year's deadline, point to next year
  if (now > deadline) return new Date(year + 1, 1, 20);
  return deadline;
}

/**
 * DAAD deadlines vary widely per program and intake - treated as rolling.
 * Some programs have known annual application windows (Oct–Nov typically).
 * We surface this as "Rolling intake - check official site".
 */
function getDaadStatus(): DeadlineStatus {
  return { type: 'rolling', label: 'Rolling intake' };
}

export function getDeadlineStatus(s: Scholarship): DeadlineStatus {
  const now = new Date();
  const group = providerGroup(s.provider);

  // ── MEXT, Eiffel, SINGA, Vanier: parse from important_dates or deadline field ──────────────────
  if (group === 'mext' || group === 'eiffel' || group === 'singa' || group === 'vanier') {
    const sources: string[] = [];
    if (s.important_dates) sources.push(...s.important_dates);
    if (s.deadline) sources.push(s.deadline);
    if (s.application_period) sources.push(...s.application_period);

    const deadline = extractDate(sources);
    if (deadline) {
      const diff = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
      const fmt = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (diff < 0)  return { type: 'closed',  label: `Closed · ${fmt}`, deadline };
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline };
    }
    // MEXT without parseable date
    return { type: 'check', label: 'Check official site' };
  }

  // ── Türkiye: known annual window Jan 10–Feb 20 ───────────────────────────
  if (group === 'turkiye') {
    const deadline = getTurkiyeDeadline();
    const openDate = new Date(deadline.getFullYear(), 0, 10); // Jan 10
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
    const fmt = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    if (now >= openDate && now <= deadline) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline };
    }
    if (now > deadline) {
      return { type: 'closed', label: `Closed · next cycle ~Jan ${deadline.getFullYear() + 1}`, deadline };
    }
    // Before Jan 10
    return { type: 'open', label: `Opens Jan 10 · closes ${fmt}`, daysLeft: diff, deadline };
  }

  // ── Chevening: annual window Aug–Oct ────────────────────────────────────────
  if (group === 'chevening') {
    const now2 = new Date();
    const year = now2.getFullYear();
    // Applications typically open 5 Aug, close 7 Oct
    const open = new Date(year, 7, 5);   // Aug 5
    const close = new Date(year, 9, 7);  // Oct 7
    const nextClose = new Date(year + 1, 9, 7);
    const diff = Math.ceil((close.getTime() - now2.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (now2 >= open && now2 <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
    }
    if (now2 > close) return { type: 'closed', label: `Closed · next cycle ~Aug ${year + 1}`, deadline: nextClose };
    return { type: 'open', label: `Opens 5 Aug · closes ${fmt}`, daysLeft: diff, deadline: close };
  }

  // ── Australia Awards: annual window closes ~30 April ─────────────────────
  if (group === 'australia-awards') {
    const now3 = new Date();
    const year3 = now3.getFullYear();
    const close = new Date(year3, 3, 30); // April 30
    const open = new Date(year3, 0, 1);   // Jan 1 approx
    const diff = Math.ceil((close.getTime() - now3.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (now3 >= open && now3 <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
    }
    if (now3 > close) return { type: 'closed', label: `Closed · next cycle ~Jan ${year3 + 1}`, deadline: new Date(year3 + 1, 3, 30) };
    return { type: 'open', label: `Opens Jan · closes ${fmt}`, daysLeft: diff, deadline: close };
  }

  // ── GKS Graduate: Feb–Mar; Undergraduate: Sep–Oct ────────────────────────
  if (group === 'gks') {
    const degLower = s.degree_levels.map(d => d.toLowerCase()).join(' ');
    const isGrad = degLower.includes('master') || degLower.includes('phd') || degLower.includes('doctoral');
    const now4 = new Date();
    const year4 = now4.getFullYear();
    // Graduate: results June, apps Feb–Mar
    // Undergraduate: results Dec, apps Sep–Oct
    if (isGrad) {
      const close = new Date(year4, 2, 31); // March 31
      const diff = Math.ceil((close.getTime() - now4.getTime()) / 86_400_000);
      const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (now4 >= new Date(year4, 1, 1) && now4 <= close) {
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
      }
      if (now4 > close) return { type: 'closed', label: `Closed · next cycle Feb ${year4 + 1}`, deadline: new Date(year4 + 1, 2, 31) };
      return { type: 'open', label: `Opens Feb · closes ${fmt}`, daysLeft: diff, deadline: close };
    } else {
      const close = new Date(year4, 9, 15); // Oct 15
      const diff = Math.ceil((close.getTime() - now4.getTime()) / 86_400_000);
      const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (now4 >= new Date(year4, 8, 1) && now4 <= close) {
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
      }
      if (now4 > close) return { type: 'closed', label: `Closed · next cycle Sep ${year4 + 1}`, deadline: new Date(year4 + 1, 9, 15) };
      return { type: 'open', label: `Opens Sep · closes ${fmt}`, daysLeft: diff, deadline: close };
    }
  }

  // ── Singapore SINGA/ASEAN: rolling two intakes ───────────────────────────
  if (group === 'singapore') {
    // SINGA: Jan intake (apply ~Sep) and Aug intake (apply ~Jan)
    // ASEAN UG: apply Oct–Mar, results mid-July
    const degLower = s.degree_levels.map(d => d.toLowerCase()).join(' ');
    if (degLower.includes('bachelor')) {
      // ASEAN UG: admissions Oct–Mar
      const now5 = new Date();
      const year5 = now5.getFullYear();
      const close = new Date(year5, 2, 31); // March 31
      const diff = Math.ceil((close.getTime() - now5.getTime()) / 86_400_000);
      const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (now5 >= new Date(year5, 9, 1) || now5 <= close) {
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: close };
      }
      return { type: 'closed', label: `Closed · next cycle ~Oct ${year5}`, deadline: new Date(year5, 9, 1) };
    }
    // SINGA PhD / AGS: rolling two intakes
    return { type: 'rolling', label: 'Two intakes - Jan & Aug' };
  }

  // ── Eiffel: Oct 1 – Jan 8 (core Eiffel); Paris-Saclay ~May; others rolling ────
  if (group === 'eiffel') {
    const now6 = new Date();
    const year6 = now6.getFullYear();

    // Paris-Saclay: ~May annually
    if (s.provider.toLowerCase().includes('paris-saclay') || s.provider.toLowerCase().includes('paris saclay')) {
      const close = new Date(year6, 4, 5); // May 5 approx
      const diff = Math.ceil((close.getTime() - now6.getTime()) / 86_400_000);
      const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (now6 <= close) {
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: close };
      }
      return { type: 'closed', label: `Closed · next cycle ~Jan ${year6 + 1}`, deadline: new Date(year6 + 1, 0, 1) };
    }

    // Sciences Po Boutmy / ENS Lyon Ampère: rolling admissions-based
    if (s.provider.toLowerCase().includes('sciences po') || s.provider.toLowerCase().includes('ens de lyon') || s.provider.toLowerCase().includes('ens lyon')) {
      return { type: 'rolling', label: 'Via admissions process' };
    }

    // Core Eiffel: Oct 1 – Jan 8
    const open = new Date(year6, 9, 1);   // Oct 1
    const close = new Date(year6, 0, 8) > now6
      ? new Date(year6, 0, 8)             // Jan 8 this year
      : new Date(year6 + 1, 0, 8);        // Jan 8 next year
    const diff = Math.ceil((close.getTime() - now6.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (now6 >= open || now6 <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
    }
    return { type: 'closed', label: `Closed · next cycle Oct ${year6}`, deadline: open };
  }

  // ── Canada CRTAS: agency deadline Oct 17; Pearson: Nov 7 ────────────────
  if (group === 'canada') {
    const now7 = new Date();
    const year7 = now7.getFullYear();

    // Lester B. Pearson: student application deadline Nov 7
    if (s.provider.toLowerCase().includes('university of toronto')) {
      const close = new Date(year7, 10, 7); // Nov 7
      const diff = Math.ceil((close.getTime() - now7.getTime()) / 86_400_000);
      const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (now7 <= close) {
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
      }
      return { type: 'closed', label: `Closed · next cycle ~Jul ${year7 + 1}`, deadline: new Date(year7 + 1, 6, 1) };
    }

    // CGRS-D and Impact+: agency deadline Oct 17
    const close = new Date(year7, 9, 17); // Oct 17
    const diff = Math.ceil((close.getTime() - now7.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (now7 <= close) {
      if (diff <= 30) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · agency deadline ${fmt}`, daysLeft: diff, deadline: close };
    }
    return { type: 'closed', label: `Closed · next cycle ~Oct ${year7 + 1}`, deadline: new Date(year7 + 1, 9, 17) };
  }

  // ── DAAD: rolling ────────────────────────────────────────────────────────
  return getDaadStatus();
}

// ── Description cleaner ───────────────────────────────────────────────────

/**
 * Strips MEXT-specific Bahasa Indonesia header noise and markdown artifacts
 * so descriptions render cleanly on any page.
 */
export function cleanDescription(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    // Remove "halaman atas > ..." style MEXT page headers
    .replace(/^halaman\s+\S+[\s\S]*?(?=\n#|\n[A-Z]|$)/i, '')
    // Strip leading markdown headings
    .replace(/^#+\s.+\n?/gm, '')
    // Collapse multiple newlines
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
}

// ── Provider meta ──────────────────────────────────────────────────────────

export const providerMeta: Record<
  string,
  { name: string; flag: string; country: string; description: string; website: string }
> = {
  daad: {
    name: 'DAAD',
    flag: '🇩🇪',
    country: 'Germany',
    description:
      'The German Academic Exchange Service (DAAD) is the world\'s largest funding organisation for the international exchange of students and researchers.',
    website: 'https://www.daad.de',
  },
  mext: {
    name: 'MEXT / Monbukagakusho',
    flag: '🇯🇵',
    country: 'Japan',
    description:
      'The Japanese Ministry of Education, Culture, Sports, Science and Technology offers scholarships to international students wishing to study in Japan.',
    website: 'https://www.mext.go.jp',
  },
  turkiye: {
    name: 'Türkiye Burslari',
    flag: '🇹🇷',
    country: 'Turkey',
    description:
      'Türkiye Burslari is the umbrella brand of the Turkish government scholarships offered to international students by the Presidency for Turks Abroad and Related Communities.',
    website: 'https://www.turkiyeburslari.gov.tr',
  },
  chevening: {
    name: 'Chevening',
    flag: '🇬🇧',
    country: 'United Kingdom',
    description:
      'Chevening is the UK Government\'s prestigious international scholarships programme, funded by the Foreign, Commonwealth and Development Office (FCDO), offering future leaders a fully funded one-year master\'s degree at a UK university.',
    website: 'https://www.chevening.org',
  },
  'australia-awards': {
    name: 'Australia Awards',
    flag: '🇦🇺',
    country: 'Australia',
    description:
      'Australia Awards are prestigious, transformational scholarships and short courses offered by the Australian Government to emerging leaders from developing countries for study, research and professional development in Australia.',
    website: 'https://www.australiaawardsindonesia.org',
  },
  gks: {
    name: 'Global Korea Scholarship (GKS)',
    flag: '🇰🇷',
    country: 'South Korea',
    description:
      'The Global Korea Scholarship (GKS), administered by NIIED under the Korean Ministry of Education, invites outstanding international students to pursue undergraduate and graduate degrees at Korean universities.',
    website: 'https://www.studyinkorea.go.kr',
  },
  singapore: {
    name: 'Singapore Scholarships (NUS / NTU / A*STAR)',
    flag: '🇸🇬',
    country: 'Singapore',
    description:
      'Singapore offers prestigious scholarships for undergraduate and postgraduate students, including the ASEAN Undergraduate Scholarship (NUS/NTU) and the Singapore International Graduate Award (SINGA) for PhD studies, administered by A*STAR and Singapore\'s top universities.',
    website: 'https://www.a-star.edu.sg/scholarships',
  },
  eiffel: {
    name: 'France Excellence Eiffel Scholarship',
    flag: '🇫🇷',
    country: 'France',
    description:
      'Established by the French Ministry for Europe and Foreign Affairs, the Eiffel Excellence Scholarship Programme helps French higher education institutions attract top international students for master\'s and PhD programmes, providing generous monthly allowances and travel coverage.',
    website: 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence',
  },
  canada: {
    name: 'Canada Research Training Awards (CRTAS)',
    flag: '🇨🇦',
    country: 'Canada',
    description:
      'The Canada Research Training Awards Suite (CRTAS), jointly administered by CIHR, NSERC, and SSHRC, is Canada\'s premier graduate research funding program. It replaced the Vanier CGS in 2025, providing $40,000/year doctoral scholarships. International students enrolled at Canadian institutions may apply.',
    website: 'https://nserc-crsng.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-doctoral-program',
  },
};

/**
 * Resolves a specific university or provider logo if available, falling back to group-level logos.
 */
export function getScholarshipLogo(s: Scholarship): string | null {
  const name = s.name.toLowerCase();
  const provider = s.provider.toLowerCase();

  const hasWord = (word: string) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(name) || regex.test(provider);
  };

  // 1. Specific University / Provider Logos
  if (name.includes('university of toronto') || provider.includes('university of toronto') || hasWord('uoft')) return '/images/logos/UofT.png';
  if (name.includes('mcgill') || provider.includes('mcgill')) return '/images/logos/McGill.png';
  if (name.includes('british columbia') || hasWord('ubc')) return '/images/logos/UBC.png';
  
  if (name.includes('national university of singapore') || provider.includes('national university of singapore') || hasWord('nus')) return '/images/logos/NUS.png';
  if (name.includes('nanyang') || provider.includes('nanyang') || hasWord('ntu')) return '/images/logos/NTU.png';
  if (name.includes('asean undergraduate') && !hasWord('nus') && !hasWord('ntu')) return '/images/logos/ASEAN_Undergraduate_Scholarship.png';

  if (name.includes('kyoto') || provider.includes('kyoto')) return '/images/logos/KyotoU.png';
  if (name.includes('tokyo') || provider.includes('tokyo') || hasWord('uoftokyo')) return '/images/logos/UofTokyo.png';

  if (name.includes('heidelberg') || provider.includes('heidelberg')) return '/images/logos/HeidelbergU.png';
  if (hasWord('lmu') || name.includes('ludwig-maximilians')) return '/images/logos/LMU.png';
  if (name.includes('technical university of munich') || hasWord('tum') || name.includes('münchen') || provider.includes('tum')) return '/images/logos/TUM.png';

  if (name.includes('paris-saclay') || provider.includes('paris-saclay') || hasWord('psl') || provider.includes('psl')) return '/images/logos/PSLU.png';
  if (name.includes('polytechnique de paris') || provider.includes('polytechnique de paris')) return '/images/logos/InstitutPolytechniqueDeParis.png';

  if (name.includes('middle east technical') || hasWord('metu') || provider.includes('metu')) return '/images/logos/METU.png';
  if (name.includes('istanbul technical') || (hasWord('itu') && s.country === 'Turkey')) return '/images/logos/ITU.png';

  // 2. Fallback to Group Logos
  const group = providerGroup(s.provider);
  if (group === 'daad') return '/images/logos/daad.svg';
  if (group === 'mext') return '/images/logos/mext.svg';
  if (group === 'turkiye') return '/images/logos/turkiye.png';

  return null;
}

/**
 * Resolves a specific university image if available, falling back to country/group default images.
 */
export function getScholarshipImage(s: Scholarship): string {
  const name = s.name.toLowerCase();
  const provider = s.provider.toLowerCase();

  const hasWord = (word: string) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(name) || regex.test(provider);
  };

  // 1. Specific University Images
  if (name.includes('university of toronto') || provider.includes('university of toronto') || hasWord('uoft')) return '/images/universities/CA_UofT.png';
  if (name.includes('mcgill') || provider.includes('mcgill')) return '/images/universities/CA_McGill.png';
  if (name.includes('british columbia') || hasWord('ubc')) return '/images/universities/CA_UBC.png';

  if (name.includes('national university of singapore') || provider.includes('national university of singapore') || hasWord('nus')) return '/images/universities/SG_NUS.png';
  if (name.includes('nanyang') || provider.includes('nanyang') || hasWord('ntu')) return '/images/universities/SG_NTU.png';

  if (name.includes('kyoto') || provider.includes('kyoto')) return '/images/universities/JP_KyotoU.png';
  if (name.includes('tokyo') || provider.includes('tokyo') || hasWord('uoftokyo')) return '/images/universities/JP_UofTokyo.png';

  if (name.includes('heidelberg') || provider.includes('heidelberg')) return '/images/universities/GE_HeidelbergU.png';
  if (hasWord('lmu') || name.includes('ludwig-maximilians')) return '/images/universities/GE_LMU.png';
  if (name.includes('technical university of munich') || hasWord('tum') || name.includes('münchen') || provider.includes('tum')) return '/images/universities/GE_TUM.png';

  if (name.includes('paris-saclay') || provider.includes('paris-saclay') || hasWord('psl') || provider.includes('psl')) return '/images/universities/FR_PSLU.png';
  if (name.includes('polytechnique de paris') || provider.includes('polytechnique de paris')) return '/images/universities/FR_InstitutPolytechniqueDeParis.png';

  if (name.includes('middle east technical') || hasWord('metu') || provider.includes('metu')) return '/images/universities/TU_METU.png';
  if (name.includes('istanbul technical') || (hasWord('itu') && s.country === 'Turkey')) return '/images/universities/TU_ITU.png';

  // 2. Fallback to Country/Group Images
  const group = providerGroup(s.provider);
  if (group === 'daad') return '/images/universities/GE_HeidelbergU.png';
  if (group === 'mext') return '/images/universities/JP_UofTokyo.png';
  if (group === 'turkiye') return '/images/universities/TU_METU.png';
  if (group === 'eiffel') return '/images/universities/FR_PSLU.png';
  if (group === 'singapore') return '/images/universities/SG_NUS.png';
  if (group === 'canada') return '/images/universities/CA_UofT.png';

  // Unsplash URLs for other groups
  if (group === 'chevening') return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80';
  if (group === 'australia-awards') return 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=700&q=80';
  if (group === 'gks') return 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?auto=format&fit=crop&w=700&q=80';

  return '/images/editorial/stem.jpg'; // ultimate fallback
}

export interface UniversityLogo {
  name: string;
  logo: string;
}

/**
 * Extracts and returns logos of universities matched in the scholarship title, provider, or description.
 */
export function getMatchedUniversityLogos(s: Scholarship): UniversityLogo[] {
  const text = `${s.name} ${s.provider} ${s.description ?? ''}`.toLowerCase();
  const list: UniversityLogo[] = [];

  const universities = [
    { name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png', keywords: ['nus', 'national university of singapore'] },
    { name: 'Nanyang Technological University (NTU)', logo: '/images/logos/NTU.png', keywords: ['ntu', 'nanyang'] },
    { name: 'University of Toronto', logo: '/images/logos/UofT.png', keywords: ['uoft', 'university of toronto', 'toronto'] },
    { name: 'McGill University', logo: '/images/logos/McGill.png', keywords: ['mcgill'] },
    { name: 'University of British Columbia (UBC)', logo: '/images/logos/UBC.png', keywords: ['ubc', 'british columbia'] },
    { name: 'Kyoto University', logo: '/images/logos/KyotoU.png', keywords: ['kyoto'] },
    { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png', keywords: ['tokyo', 'uoftokyo'] },
    { name: 'Heidelberg University', logo: '/images/logos/HeidelbergU.png', keywords: ['heidelberg'] },
    { name: 'LMU Munich', logo: '/images/logos/LMU.png', keywords: ['lmu', 'ludwig-maximilians'] },
    { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png', keywords: ['tum', 'munich', 'münchen'] },
    { name: 'Paris Sciences et Lettres University (PSL)', logo: '/images/logos/PSLU.png', keywords: ['psl', 'paris sciences', 'saclay'] },
    { name: 'Institut Polytechnique de Paris', logo: '/images/logos/InstitutPolytechniqueDeParis.png', keywords: ['polytechnique de paris', 'polytechnic institute of paris'] },
    { name: 'Middle East Technical University (METU)', logo: '/images/logos/METU.png', keywords: ['metu', 'middle east technical'] },
    { name: 'Istanbul Technical University (ITU)', logo: '/images/logos/ITU.png', keywords: ['itu', 'istanbul technical'] },
  ];

  universities.forEach((univ) => {
    const matched = univ.keywords.some((kw) => {
      if (kw === 'itu') {
        return s.country === 'Turkey' && (
          text.includes('itu ') || text.includes('itu/') || text.includes('itu,') || text.includes(' itu')
        );
      }
      if (['nus', 'ntu', 'lmu', 'ubc', 'tum', 'psl'].includes(kw)) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        return regex.test(text);
      }
      return text.includes(kw);
    });

    if (matched) {
      list.push({ name: univ.name, logo: univ.logo });
    }
  });

  return list;
}


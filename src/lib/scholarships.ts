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

/** Normalise provider string to a country-level group slug */
export function providerGroup(provider: string): string {
  const p = provider.toLowerCase();
  // Germany
  if (p.includes('daad') || p.includes('dlr') || p.includes('studienstiftung') || p.includes('german academic scholarship foundation')) return 'germany';
  // Japan
  if (p.includes('mext') || p.includes('monbukagakusho') || p.includes('jasso') || p.includes('japan student services') || p.includes('government of japan') || p.includes('adb') || p.includes('world bank')) return 'japan';
  // Turkey
  if (p.includes('turkiye') || p.includes('ytb') || p.includes('burslari')) return 'turkey';
  // United Kingdom
  if (p.includes('chevening') || p.includes('gates cambridge') || p.includes('clarendon') || p.includes('oxford university press') || p.includes('rhodes trust') || p.includes('rhodes house') || p.includes('commonwealth scholarship')) return 'united-kingdom';
  // Australia
  if (p.includes('australia awards') || p.includes('dfat') || p.includes('lpdp') || p.includes('university of melbourne') || p.includes('university of sydney') || p.includes('australian national university') || p.includes('monash university') || p.includes('university of queensland') || p.includes('unsw') || p.includes('flinders university') || p.includes('griffith university')) return 'australia';
  // South Korea
  if (p.includes('niied') || p.includes('korean government') || p.includes('gks') || p.includes('koica') || p.includes('korea international cooperation')) return 'south-korea';
  // Singapore
  if (p.includes('a*star') || p.includes('astar') || p.includes('nus') || p.includes('ntu') || p.includes('singa') || p.includes('nanyang') || p.includes('national university of singapore')) return 'singapore';
  // France
  if (p.includes('eiffel') || p.includes('campus france') || p.includes('french ministry') || p.includes('paris-saclay') || p.includes('paris saclay') || p.includes('sciences po') || p.includes('ens de lyon') || p.includes('ens lyon')) return 'france';
  // Canada (cpra must come before generic canada)
  if (p.includes('cpra') || p.includes('postdoctoral research award') || (p.includes('government of canada') && (p.includes('cihr') || p.includes('nserc') || p.includes('sshrc')))) return 'canada';
  if (p.includes('canada') || p.includes('cihr') || p.includes('nserc') || p.includes('sshrc') || p.includes('crtas') || p.includes('cgrs') || p.includes('university of toronto')) return 'canada';
  // United States
  if (p.includes('fulbright') || p.includes('aminef') || p.includes('knight-hennessy') || p.includes('stanford university')) return 'united-states';
  // Netherlands
  if (p.includes('nuffic') || p.includes('dutch ministry') || p.includes('justus') || p.includes('van effen') || p.includes('university of groningen') || p.includes('university of amsterdam') || p.includes('vrije universiteit amsterdam') || p.includes('vu amsterdam') || p.includes('leiden university') || p.includes('maastricht university') || p.includes('radboud university') || p.includes('tu delft') || p.includes('delft university')) return 'netherlands';
  // Belgium
  if (p.includes('vlir') || p.includes('vliruos') || p.includes('belgian government') || p.includes('icp connect') || p.includes('ares') || p.includes('académie de recherche') || p.includes('master mind') || p.includes('government of flanders') || p.includes('science@leuven') || p.includes('ku leuven') || p.includes('global minds') || p.includes('k.u. leuven')) return 'belgium';
  // EU
  if (p.includes('erasmus mundus') || p.includes('erasmus+') || p.includes('european commission')) return 'eu';
  // Sweden
  if (p.includes('swedish institute') || p.includes('svenska institutet') || p.includes('lund university') || p.includes('kth royal institute') || p.includes('chalmers university') || p.includes('uppsala university') || p.includes('stockholm university') || p.includes('university of gothenburg') || p.includes('karolinska institutet')) return 'sweden';
  // Italy
  if (p.includes('maeci') || p.includes('italian government') || p.includes('ministry of foreign affairs and international cooperation') || p.includes('invest your talent')) return 'italy';
  // China
  if (p.includes('china scholarship council') || (p.includes('csc') && p.includes('chinese')) || p.includes('mofcom') || (p.includes('ministry of commerce') && p.includes('china'))) return 'china';
  // Hungary
  if (p.includes('stipendium hungaricum') || p.includes('tempus public foundation') || (p.includes('hungarian') && p.includes('government'))) return 'hungary';
  // Taiwan
  if (p.includes('taiwan') || p.includes('teco') || p.includes('icdf') || p.includes('huayu') || p.includes('national tsing hua') || (p.includes('ministry of education') && p.includes('taiwan'))) return 'taiwan';
  // Switzerland
  if (p.includes('swiss government') || p.includes('sbfi') || p.includes('seri') || p.includes('swiss confederation') || p.includes('eth zurich') || p.includes('epfl') || p.includes('école polytechnique') || p.includes('university of geneva') || p.includes('unige')) return 'switzerland';
  // Austria
  if (p.includes('oead') || p.includes('austrian agency') || p.includes('österreich') || p.includes('austrian government') || p.includes('austrian academic') || p.includes('tu wien') || p.includes('vienna university of technology')) return 'austria';
  // Finland
  if (p.includes('nokia foundation') || p.includes('university of helsinki') || p.includes('helsingin yliopisto') || p.includes('aalto university') || p.includes('aalto-yliopisto') || p.includes('tampere university') || p.includes('tuni.fi') || p.includes('university of oulu') || p.includes('oulun yliopisto') || p.includes('hanken')) return 'finland';
  // New Zealand
  if (p.includes('manaaki') || p.includes('education new zealand') || p.includes('mfat') || p.includes('new zealand')) return 'new-zealand';
  // Ireland
  if (p.includes('government of ireland') || p.includes('hea') || p.includes('research ireland') || p.includes('irish research council') || p.includes('trinity college dublin') || p.includes('university college dublin') || p.includes('ucd global') || p.includes('teagasc') || p.includes('munster technological') || p.includes('maynooth university') || p.includes('royal college of surgeons in ireland') || p.includes('rcsi')) return 'ireland';
  // Poland
  if (p.includes('nawa') || p.includes('polish national agency') || p.includes('stefan banach') || p.includes('lukasiewicz') || p.includes('łukasiewicz') || p.includes('ignacy') || p.includes('jagiellonian') || p.includes('university of warsaw') || p.includes('warsaw university') || p.includes('national science centre') || p.includes('ncn ') || p.includes('ncn/')) return 'poland';
  // Spain
  if (p.includes('aecid') || p.includes('maec') || p.includes('ministerio de asuntos exteriores') || p.includes('fundación "la caixa"') || p.includes('fundacion "la caixa"') || p.includes('"la caixa"') || p.includes('la caixa') || p.includes('ie foundation') || p.includes('ie university') || p.includes('universidad de girona') || p.includes('banco santander')) return 'spain';
  // Denmark
  if ((p.includes('danish') && p.includes('ministry')) || p.includes('studyindenmark') || p.includes('denmark')) return 'denmark';
  // Norway
  if (p.includes('studyinnorway') || (p.includes('norway') && p.includes('universities')) || p.includes('bi norwegian')) return 'norway';
  // Hong Kong
  if (p.includes('hong kong phd') || p.includes('hkpf') || p.includes('research grants council') || p.includes('ugc.edu.hk') || p.includes('university of hong kong')) return 'hong-kong';
  // Malaysia
  if (p.includes('malaysia international') || p.includes('mohe') || (p.includes('malaysian government') && p.includes('scholarship'))) return 'malaysia';
  // Romania
  if (p.includes('study in romania') || p.includes('scholarships.studyinromania') || p.includes('arice') || p.includes('romanian ministry of foreign') || p.includes('romanian agency for investments') || p.includes('transilvania university') || p.includes('unitbv') || p.includes('west university of timisoara') || p.includes('west university of timișoara') || p.includes('uvt')) return 'romania';
  // Russia
  if (p.includes('open doors') || p.includes('global universities association') || p.includes('rossotrudnichestvo') || p.includes('russian government') || p.includes('government of russia') || p.includes('russian federation') || p.includes('saint petersburg state university') || p.includes('spbu') || p.includes('nust misis') || p.includes('bmstu') || p.includes('bauman moscow') || p.includes('mgimo') || p.includes('hse university') || p.includes('higher school of economics') || p.includes('skoltech') || p.includes('presidential scholarship') || p.includes('presidentskaya') || p.includes('russian ministry')) return 'russia';
  // Saudi Arabia
  if (p.includes('saudi ministry') || p.includes('saudi arabia') || p.includes('king saud') || p.includes('ksu ') || p.includes('king abdulaziz') || p.includes('kau ') || p.includes('king fahd') || p.includes('kfupm') || p.includes('umm al-qura') || p.includes('uqu ') || p.includes('islamic university of madinah') || p.includes('kaust') || p.includes('king abdullah university') || p.includes('studyinsaudi') || p.includes('study in saudi')) return 'saudi-arabia';
  // Qatar
  if (p.includes('qatar university') || p.includes('hamad bin khalifa') || p.includes('hbku') || p.includes('qatar foundation') || p.includes('education above all') || p.includes('doha institute') || p.includes('qatar government') || p.includes('qffd') || p.includes('qatarscholarships') || p.includes('qu ')) return 'qatar';
  // Fallback: slugify provider name
  return p.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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

  // ── Japan (MEXT, JASSO): parse from important_dates ────────────────────
  if (group === 'japan' || group === 'france' || group === 'singapore') {
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

  // ── Turkey: known annual window Jan 10–Feb 20 ───────────────────────────
  if (group === 'turkey') {
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

  // ── United Kingdom (Chevening): annual window Aug–Oct ────────────────────────
  if (group === 'united-kingdom') {
    const provider = s.provider.toLowerCase();
    if (!provider.includes('chevening')) {
      const sources: string[] = [];
      if (s.important_dates) sources.push(...s.important_dates);
      if (s.deadline) sources.push(s.deadline);
      if (s.application_period) sources.push(...s.application_period);

      const deadline = extractDate(sources);
      if (deadline) {
        const diff = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
        const fmt = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (diff < 0) return { type: 'closed', label: `Closed Â· ${fmt}`, deadline };
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline };
        return { type: 'open', label: `Open Â· closes ${fmt}`, daysLeft: diff, deadline };
      }

      return { type: 'check', label: 'Check official site' };
    }

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
  if (group === 'australia') {
    const provider = s.provider.toLowerCase();
    if (!provider.includes('australia awards') && !provider.includes('dfat') && !provider.includes('lpdp')) {
      const sources: string[] = [];
      if (s.important_dates) sources.push(...s.important_dates);
      if (s.deadline) sources.push(s.deadline);
      if (s.application_period) sources.push(...s.application_period);

      const deadline = extractDate(sources);
      if (deadline) {
        const diff = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
        const fmt = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (diff < 0) return { type: 'closed', label: `Closed · ${fmt}`, deadline };
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline };
      }

      return { type: 'check', label: 'Check official site' };
    }

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
  if (group === 'south-korea') {
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
  if (group === 'france') {
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
  // ── JASSO: rolling (applied through school, no fixed public deadline) ────
  if (group === 'japan') return { type: 'rolling', label: 'Via enrolled university' };

  // ── KOICA: annual, ~July deadline ────────────────────────────────────────
  if (group === 'south-korea') {
    const nowK = new Date();
    const yearK = nowK.getFullYear();
    const close = new Date(yearK, 6, 31); // July 31 approx
    const diff = Math.ceil((close.getTime() - nowK.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowK <= close) {
      if (diff <= 30) return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: close };
    }
    return { type: 'closed', label: `Closed · next cycle ~${yearK + 1}`, deadline: new Date(yearK + 1, 6, 31) };
  }

  // ── CPRA: agency deadlines Sep 11–Oct 17 ─────────────────────────────────
  if (group === 'canada') {
    const nowC = new Date();
    const yearC = nowC.getFullYear();
    const close = new Date(yearC, 9, 17); // Oct 17 (NSERC, latest deadline)
    const diff = Math.ceil((close.getTime() - nowC.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowC <= close) {
      if (diff <= 30) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · agency deadline ${fmt}`, daysLeft: diff, deadline: close };
    }
    return { type: 'closed', label: `Closed · next cycle ~Sep ${yearC + 1}`, deadline: new Date(yearC + 1, 8, 11) };
  }

  // ── A*STAR (astar group - AGS + AIF): rolling two intakes ────────────────
  if (group === 'singapore') return { type: 'rolling', label: 'Two intakes - Feb & Aug' };

  // ── Studienstiftung: nomination-based / special programme deadlines ──────
  if (group === 'germany') {
    const name = s.name.toLowerCase();
    const nowS = new Date();
    const yearS = nowS.getFullYear();
    if (name.includes('erp')) {
      const open = new Date(yearS, 6, 1);   // Jul 1
      const close = new Date(yearS, 8, 20); // Sep 20
      const diff = Math.ceil((close.getTime() - nowS.getTime()) / 86_400_000);
      const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (nowS >= open && nowS <= close) {
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
      }
      if (nowS > close) return { type: 'closed', label: `Closed · opens Jul ${yearS + 1}`, deadline: new Date(yearS + 1, 6, 1) };
      return { type: 'open', label: `Opens Jul 1 · closes ${fmt}`, daysLeft: diff, deadline: close };
    }
    if (name.includes('mccloy')) {
      const open = new Date(yearS, 7, 1);   // Aug 1
      const close = new Date(yearS, 10, 1); // Nov 1
      const diff = Math.ceil((close.getTime() - nowS.getTime()) / 86_400_000);
      const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (nowS >= open && nowS <= close) {
        if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
      }
      if (nowS > close) return { type: 'closed', label: `Closed · opens Aug ${yearS + 1}`, deadline: new Date(yearS + 1, 7, 1) };
      return { type: 'open', label: `Opens Aug 1 · closes ${fmt}`, daysLeft: diff, deadline: close };
    }
    if (name.includes('leo baeck')) {
      const close = new Date(yearS, 1, 1); // Feb 1
      const target = nowS <= close ? close : new Date(yearS + 1, 1, 1);
      const diff = Math.ceil((target.getTime() - nowS.getTime()) / 86_400_000);
      const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    return { type: 'rolling', label: 'Rolling calls · nomination-based' };
  }

  // ── Netherlands: varies by scholarship ───────────────────────────────────
  if (group === 'netherlands') {
    const name = s.name.toLowerCase();
    const nowNL = new Date();
    const yearNL = nowNL.getFullYear();
    if (name.includes('orange knowledge')) return { type: 'rolling', label: 'Rolling · check Nuffic portal' };
    if (name.includes('orange tulip')) return { type: 'rolling', label: 'Varies per university' };
    if (name.includes('holland scholarship')) {
      const open = new Date(yearNL, 10, 1); // Nov 1
      const close = new Date(yearNL + 1, 3, 1); // ~Apr 1
      const diff = Math.ceil((close.getTime() - nowNL.getTime()) / 86_400_000);
      if (nowNL >= open) {
        if (diff <= 14) return { type: 'closing', label: `Closing ~Apr`, daysLeft: diff, deadline: close };
        return { type: 'open', label: `Open · closes ~Apr`, daysLeft: diff, deadline: close };
      }
      return { type: 'open', label: `Opens Nov 1 · closes ~Apr`, daysLeft: diff, deadline: close };
    }
    const close = new Date(yearNL, 1, 1); // Feb 1
    const target = nowNL <= close ? close : new Date(yearNL + 1, 1, 1);
    const diff = Math.ceil((target.getTime() - nowNL.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (diff <= 14) return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: target };
    return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Gates Cambridge: Sep open, ~Dec close ────────────────────────────────
  if (group === 'united-kingdom') {
    const nowGC = new Date();
    const yearGC = nowGC.getFullYear();
    const open = new Date(yearGC, 8, 1);    // Sep 1
    const close = new Date(yearGC, 11, 15); // ~Dec 15
    const diff = Math.ceil((close.getTime() - nowGC.getTime()) / 86_400_000);
    if (nowGC >= open && nowGC <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ~Dec`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ~Dec`, daysLeft: diff, deadline: close };
    }
    if (nowGC > close) return { type: 'closed', label: `Closed · opens Sep ${yearGC + 1}`, deadline: new Date(yearGC + 1, 8, 1) };
    return { type: 'open', label: `Opens Sep · closes ~Dec`, daysLeft: diff, deadline: close };
  }

  // ── Clarendon: Oxford first deadline ~Dec ────────────────────────────────
  if (group === 'united-kingdom') {
    const nowCL = new Date();
    const yearCL = nowCL.getFullYear();
    const close = new Date(yearCL, 11, 1); // Dec 1
    const target = nowCL <= close ? close : new Date(yearCL + 1, 11, 1);
    const diff = Math.ceil((target.getTime() - nowCL.getTime()) / 86_400_000);
    if (diff <= 14) return { type: 'closing', label: `First deadline ~Dec`, daysLeft: diff, deadline: target };
    return { type: 'open', label: `Open · first deadline ~Dec`, daysLeft: diff, deadline: target };
  }

  // ── Rhodes: Jun–Oct, country-specific ────────────────────────────────────
  if (group === 'united-kingdom') {
    const nowRH = new Date();
    const yearRH = nowRH.getFullYear();
    const open = new Date(yearRH, 5, 1);  // Jun 1
    const close = new Date(yearRH, 9, 1); // ~Oct 1
    const diff = Math.ceil((close.getTime() - nowRH.getTime()) / 86_400_000);
    if (nowRH >= open && nowRH <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ~Oct`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ~Oct`, daysLeft: diff, deadline: close };
    }
    if (nowRH > close) return { type: 'closed', label: `Closed · opens Jun ${yearRH + 1}`, deadline: new Date(yearRH + 1, 5, 1) };
    return { type: 'open', label: `Opens Jun · closes ~Oct`, daysLeft: diff, deadline: close };
  }

  // ── Fulbright: deadline Feb 15 ───────────────────────────────────────────
  if (group === 'united-states') {
    const nowF = new Date();
    const yearF = nowF.getFullYear();
    const close = new Date(yearF, 1, 15); // Feb 15
    const target = nowF <= close ? close : new Date(yearF + 1, 1, 15);
    const diff = Math.ceil((target.getTime() - nowF.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (diff <= 0) return { type: 'closed', label: `Closed · next cycle ~Oct`, deadline: target };
    if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
    return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── VLIR-UOS Belgium: programme-specific, typically Jan-Apr ─────────────
  if (group === 'belgium') return { type: 'rolling', label: 'Varies per programme' };

  // ── Erasmus Mundus: Oct-Jan typically ────────────────────────────────────
  if (group === 'eu') {
    const nowEM = new Date();
    const yearEM = nowEM.getFullYear();
    const open = new Date(yearEM, 9, 1);   // Oct 1
    const close = new Date(yearEM, 0, 31) > nowEM
      ? new Date(yearEM, 0, 31)
      : new Date(yearEM + 1, 0, 31);
    const diff = Math.ceil((close.getTime() - nowEM.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowEM >= open || nowEM <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ~Jan`, daysLeft: diff, deadline: close };
    }
    return { type: 'closed', label: `Closed · opens Oct ${yearEM}`, deadline: open };
  }

  // ── China CSC: Dec–Apr annually ───────────────────────────────────────
  if (group === 'china') {
    const nowCN = new Date();
    const yearCN = nowCN.getFullYear();
    // Application window: December 1 – April 30
    const open = new Date(yearCN - 1, 11, 1); // Dec 1 previous year
    const close = new Date(yearCN, 3, 30);     // April 30 current year
    const diff = Math.ceil((close.getTime() - nowCN.getTime()) / 86_400_000);
    const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowCN >= open && nowCN <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: close };
      return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: close };
    }
    if (nowCN > close) return { type: 'closed', label: `Closed · opens Dec ${yearCN}`, deadline: new Date(yearCN, 11, 1) };
    return { type: 'open', label: `Opens Dec · closes ~Apr`, daysLeft: diff, deadline: close };
  }

  // ── Sweden SI: Feb 9–25 annually ─────────────────────────────────────────
  if (group === 'sweden') {
    const nowSE = new Date();
    const yearSE = nowSE.getFullYear();
    const open = new Date(yearSE, 1, 9);   // Feb 9
    const close = new Date(yearSE, 1, 25); // Feb 25
    const target = nowSE <= close ? close : new Date(yearSE + 1, 1, 25);
    const openTarget = nowSE <= close ? open : new Date(yearSE + 1, 1, 9);
    const diff = Math.ceil((target.getTime() - nowSE.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowSE >= open && nowSE <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    if (nowSE > close) return { type: 'closed', label: `Closed · opens Feb ${target.getFullYear()}`, deadline: openTarget };
    return { type: 'open', label: `Opens 9 Feb · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Italy MAECI: main deadline ~26 March ──────────────────────────────────
  if (group === 'italy') {
    const nowIT = new Date();
    const yearIT = nowIT.getFullYear();
    const close = new Date(yearIT, 2, 26); // March 26
    const target = nowIT <= close ? close : new Date(yearIT + 1, 2, 26);
    const diff = Math.ceil((target.getTime() - nowIT.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowIT <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    return { type: 'closed', label: `Closed · next cycle ~Mar ${target.getFullYear()}`, deadline: target };
  }

  // ── Hungary (Stipendium Hungaricum): annual deadline ~Jan 15 ────────────
  if (group === 'hungary') {
    const nowH = new Date();
    const yearH = nowH.getFullYear();
    const close = new Date(yearH, 0, 15); // Jan 15
    const target = nowH <= close ? close : new Date(yearH + 1, 0, 15);
    const diff = Math.ceil((target.getTime() - nowH.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
    return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Taiwan (MOE/ICDF/Huayu): annual deadline ~Mar 31 ─────────────────
  if (group === 'taiwan') {
    const nowTW = new Date();
    const yearTW = nowTW.getFullYear();
    const close = new Date(yearTW, 2, 31); // Mar 31
    const target = nowTW <= close ? close : new Date(yearTW + 1, 2, 31);
    const diff = Math.ceil((target.getTime() - nowTW.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowTW <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    return { type: 'closed', label: `Closed · opens Feb ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 1, 1) };
  }

  // ── Switzerland (Swiss Govt Excellence): Aug–Dec, varies by country ───
  if (group === 'switzerland') {
    return { type: 'rolling', label: 'Aug–Dec (varies by country)' };
  }

  // ── New Zealand (Manaaki): Feb–Mar annually ──────────────────────────
  if (group === 'new-zealand') {
    const nowNZ = new Date();
    const yearNZ = nowNZ.getFullYear();
    const open = new Date(yearNZ, 1, 1);   // Feb 1
    const close = new Date(yearNZ, 2, 31); // Mar 31
    const target = nowNZ <= close ? close : new Date(yearNZ + 1, 2, 31);
    const diff = Math.ceil((target.getTime() - nowNZ.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowNZ >= open && nowNZ <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    if (nowNZ > close) return { type: 'closed', label: `Closed · opens Feb ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 1, 1) };
    return { type: 'open', label: `Opens Feb · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Ireland GOI-IES: ~late Jan – mid Mar ──────────────────────────────
  if (group === 'ireland') {
    const nowIE = new Date();
    const yearIE = nowIE.getFullYear();
    const open = new Date(yearIE, 0, 25);  // Jan 25
    const close = new Date(yearIE, 2, 15); // Mar 15
    const target = nowIE <= close ? close : new Date(yearIE + 1, 2, 15);
    const diff = Math.ceil((target.getTime() - nowIE.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowIE >= open && nowIE <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    if (nowIE > close) return { type: 'closed', label: `Closed · opens Jan ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 0, 25) };
    return { type: 'open', label: `Opens Jan · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Denmark: varies by university ────────────────────────────────────
  if (group === 'denmark') return { type: 'rolling', label: 'Varies by university' };

  // ── Norway: tuition-free, no centralized scholarship deadline ────────
  if (group === 'norway') return { type: 'rolling', label: 'Tuition-free · rolling admissions' };

  // ── Hong Kong HKPFS: Sep 1 – Dec 1 ──────────────────────────────────
  if (group === 'hong-kong') {
    const nowHK = new Date();
    const yearHK = nowHK.getFullYear();
    const open = new Date(yearHK, 8, 1);   // Sep 1
    const close = new Date(yearHK, 11, 1); // Dec 1
    const target = nowHK <= close ? close : new Date(yearHK + 1, 11, 1);
    const diff = Math.ceil((target.getTime() - nowHK.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowHK >= open && nowHK <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    if (nowHK > close) return { type: 'closed', label: `Closed · opens Sep ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 8, 1) };
    return { type: 'open', label: `Opens Sep · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Malaysia MIS: ~Jun–Aug annually ─────────────────────────────────
  if (group === 'malaysia') {
    const nowMY = new Date();
    const yearMY = nowMY.getFullYear();
    const open = new Date(yearMY, 5, 1);   // Jun 1
    const close = new Date(yearMY, 7, 31); // Aug 31
    const target = nowMY <= close ? close : new Date(yearMY + 1, 7, 31);
    const diff = Math.ceil((target.getTime() - nowMY.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowMY >= open && nowMY <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    if (nowMY > close) return { type: 'closed', label: `Closed · opens Jun ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 5, 1) };
    return { type: 'open', label: `Opens Jun · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Poland NAWA Banach: ~March – 8 May annually ─────────────────────
  if (group === 'poland') {
    const nowPL = new Date();
    const yearPL = nowPL.getFullYear();
    const open = new Date(yearPL, 2, 1);   // Mar 1
    const close = new Date(yearPL, 4, 8);  // May 8 (NAWA Banach deadline)
    const target = nowPL <= close ? close : new Date(yearPL + 1, 4, 8);
    const diff = Math.ceil((target.getTime() - nowPL.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowPL >= open && nowPL <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    if (nowPL > close) return { type: 'closed', label: `Closed · opens Mar ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 2, 1) };
    return { type: 'open', label: `Opens Mar · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Spain: la Caixa INPhINIT (28 Jan) + AECID (3 Jun) + others rolling ──
  if (group === 'spain') return { type: 'rolling', label: 'Multiple cycles · check program' };

  // ── Romania: MFA (Mar 1) + ARICE + others ────────────────────────────
  if (group === 'romania') return { type: 'rolling', label: 'Multiple cycles · Dec – Mar' };

  // ── Russia: Open Doors Olympiad (Dec) + Government Quota (Dec/Jan) ────
  if (group === 'russia') return { type: 'rolling', label: 'Olympiad & Quota cycles · Sep – Jan' };

  // ── Saudi Arabia: MOE universities ~Mar–May; KAUST rolling ──────────
  if (group === 'saudi-arabia') {
    const nowSA = new Date();
    const yearSA = nowSA.getFullYear();
    const open = new Date(yearSA, 2, 1);   // Mar 1
    const close = new Date(yearSA, 4, 31); // May 31
    const target = nowSA <= close ? close : new Date(yearSA + 1, 4, 31);
    const diff = Math.ceil((target.getTime() - nowSA.getTime()) / 86_400_000);
    const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (nowSA >= open && nowSA <= close) {
      if (diff <= 14) return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
      return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    if (nowSA > close) return { type: 'closed', label: `Closed · opens Mar ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 2, 1) };
    return { type: 'open', label: `Opens Mar · closes ${fmt}`, daysLeft: diff, deadline: target };
  }

  // ── Qatar: QU ~Mar 25; HBKU ~Feb 1; others rolling ────────────────
  if (group === 'qatar') return { type: 'rolling', label: 'Varies · Jan–Mar (check university)' };

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
  germany: {
    name: 'Germany',
    flag: '🇩🇪',
    country: 'Germany',
    description: 'Germany offers numerous scholarships through DAAD, including EPOS and Leadership for Africa, plus Studienstiftung and university-specific programmes. Public universities charge no tuition for most programmes.',
    website: 'https://www.daad.de',
  },
  japan: {
    name: 'Japan',
    flag: '🇯🇵',
    country: 'Japan',
    description: 'Japan offers MEXT scholarships covering tuition, monthly stipend, and airfare, plus JASSO awards and Japan-funded global development scholarships such as ADB-Japan and JJ/WBGSP.',
    website: 'https://www.mext.go.jp',
  },
  turkey: {
    name: 'Turkey',
    flag: '🇹🇷',
    country: 'Turkey',
    description: 'Türkiye Burslari is the Turkish government\'s comprehensive scholarship programme offering tuition, monthly stipend, accommodation, health insurance, and flights for associate degree through PhD studies across 200+ Turkish universities.',
    website: 'https://www.turkiyeburslari.gov.tr',
  },
  'united-kingdom': {
    name: 'United Kingdom',
    flag: '🇬🇧',
    country: 'United Kingdom',
    description: 'The UK offers world-class scholarships including Chevening (government-funded Master\'s), Gates Cambridge, Clarendon Fund (Oxford), and the Rhodes Scholarship — among the most prestigious international scholarships globally.',
    website: 'https://www.chevening.org',
  },
  australia: {
    name: 'Australia',
    flag: '🇦🇺',
    country: 'Australia',
    description: 'Australia Awards are prestigious, transformational scholarships and short courses offered by the Australian Government to emerging leaders from developing countries for study, research and professional development in Australia.',
    website: 'https://www.australiaawardsindonesia.org',
  },
  'south-korea': {
    name: 'South Korea',
    flag: '🇰🇷',
    country: 'South Korea',
    description: 'South Korea offers the Global Korea Scholarship (GKS) for undergraduate and graduate degrees at Korean universities, plus KOICA scholarships for public sector professionals from developing countries.',
    website: 'https://www.studyinkorea.go.kr',
  },
  singapore: {
    name: 'Singapore',
    flag: '🇸🇬',
    country: 'Singapore',
    description: 'Singapore offers prestigious scholarships through NUS, NTU, and A*STAR, including the Singapore International Graduate Award (SINGA) for PhD studies and ASEAN Undergraduate Scholarships.',
    website: 'https://www.a-star.edu.sg/scholarships',
  },
  france: {
    name: 'France',
    flag: '🇫🇷',
    country: 'France',
    description: 'France offers the Eiffel Excellence Scholarship (government-funded), plus university-specific scholarships at Paris-Saclay, Sciences Po, and ENS Lyon for Master\'s and PhD studies.',
    website: 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence',
  },
  canada: {
    name: 'Canada',
    flag: '🇨🇦',
    country: 'Canada',
    description: 'Canada offers the CGRS-D and Impact+ research awards administered by CIHR/NSERC/SSHRC, the Lester B. Pearson Scholarship at University of Toronto, and the Canada Postdoctoral Research Award (CPRA) for postdoctoral researchers.',
    website: 'https://nserc-crsng.canada.ca',
  },
  'united-states': {
    name: 'United States',
    flag: '🇺🇸',
    country: 'United States',
    description: 'The US offers Fulbright/AMINEF awards for Indonesian citizens plus global university scholarships such as Stanford\'s Knight-Hennessy Scholars for full-time graduate study.',
    website: 'https://www.aminef.or.id',
  },
  netherlands: {
    name: 'Netherlands',
    flag: '🇳🇱',
    country: 'Netherlands',
    description: 'The Netherlands offers the NL Scholarship and university-specific excellence awards at TU Delft, Amsterdam, Groningen, Leiden, Maastricht, Radboud, and VU Amsterdam. Older OKP rounds have ended, so current applicants should check active alternatives.',
    website: 'https://www.studyinnl.org/finances/scholarships',
  },
  belgium: {
    name: 'Belgium',
    flag: '🇧🇪',
    country: 'Belgium',
    description: 'Belgium offers VLIR-UOS ICP Connect Scholarships for students from 29 developing countries including Indonesia, available at bachelor, initial master, and advanced master levels across Flemish universities.',
    website: 'https://www.vliruos.be/get-funded/study-scholarships',
  },
  eu: {
    name: 'European Union',
    flag: '🇪🇺',
    country: 'European Union',
    description: 'Erasmus Mundus Joint Master (EMJM) is a prestigious EU-funded scholarship for 1-2 year master\'s degrees jointly delivered by at least 3 universities in 3+ European countries. Full scholarships cover tuition, living allowance, travel, and insurance for 150+ programmes.',
    website: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters',
  },
  china: {
    name: 'China',
    flag: '🇨🇳',
    country: 'China',
    description: 'China offers the Chinese Government Scholarship (CGS) through CSC for bachelor to PhD studies at 274+ universities, plus Belt and Road and MOFCOM scholarships for partner countries.',
    website: 'http://studyinchina.csc.edu.cn/',
  },
  sweden: {
    name: 'Sweden',
    flag: '🇸🇪',
    country: 'Sweden',
    description: 'The Swedish Institute offers fully funded SISGP master\'s scholarships for professionals from 34 developing countries, plus the Pioneering Women in STEM scholarship for women in STEM fields.',
    website: 'https://si.se/en/apply/scholarships/',
  },
  italy: {
    name: 'Italy',
    flag: '🇮🇹',
    country: 'Italy',
    description: 'Italy offers MAECI government scholarships, Invest Your Talent in Italy (IYT), and Special Projects scholarships for foreign students at Italian universities, covering tuition and monthly allowances.',
    website: 'https://studyinitaly.esteri.it/',
  },
  hungary: {
    name: 'Hungary',
    flag: '🇭🇺',
    country: 'Hungary',
    description: 'Stipendium Hungaricum offers fully funded bachelor\'s, master\'s, and doctoral studies at Hungarian universities for citizens of 70+ partner countries including Indonesia, covering tuition, stipend, accommodation, and insurance.',
    website: 'https://stipendiumhungaricum.hu/',
  },
  taiwan: {
    name: 'Taiwan',
    flag: '🇹🇼',
    country: 'Taiwan',
    description: 'Taiwan offers MOE scholarships (tuition + stipend), TaiwanICDF (fully funded with housing), Huayu (language study), plus university-specific awards at NTU and NTHU for bachelor to PhD studies.',
    website: 'https://english.moe.gov.tw',
  },
  switzerland: {
    name: 'Switzerland',
    flag: '🇨🇭',
    country: 'Switzerland',
    description: 'Switzerland offers the Swiss Government Excellence Scholarships (CHF 2,450/month), ETH Zurich ESOP (CHF 12,000/semester), EPFL Excellence Fellowships, and the University of Geneva Excellence Master Fellowships for Master\'s and PhD studies at world-leading institutions.',
    website: 'https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships',
  },
  austria: {
    name: 'Austria',
    flag: '🇦🇹',
    country: 'Austria',
    description: 'Austria offers OeAD-managed scholarships (Ernst Mach Worldwide, Ernst Mach UAS, Follow-Up, and Franz Werfel) for Master\'s, PhD, and postdoc research stays, plus the Helmut Veith Stipend at TU Wien for Computer Science Master\'s students.',
    website: 'https://oead.at/en/to-austria/scholarships/',
  },
  finland: {
    name: 'Finland',
    flag: '🇫🇮',
    country: 'Finland',
    description: 'Finland offers fully funded international Master scholarships at the University of Helsinki, Aalto, Tampere, Oulu, and Hanken (Swan and Eduard Swan), plus the Nokia Foundation Scholarship (EUR 10,000/year) for ICT, CS, and STEM Master\'s and PhD students.',
    website: 'https://www.studyinfinland.fi/scholarships',
  },
  'new-zealand': {
    name: 'New Zealand',
    flag: '🇳🇿',
    country: 'New Zealand',
    description: 'Manaaki New Zealand Scholarships are fully funded for citizens of developing countries including Indonesia, covering tuition, living allowance, airfare, and insurance for undergraduate through PhD studies.',
    website: 'https://www.nzscholarships.govt.nz/',
  },
  ireland: {
    name: 'Ireland',
    flag: '🇮🇪',
    country: 'Ireland',
    description: 'Ireland offers GOI-IES (tuition + EUR 10,000 for one year), GOIPG (up to EUR 34,000/year for PhD), plus university scholarships at Trinity College Dublin and UCD.',
    website: 'https://hea.ie/',
  },
  denmark: {
    name: 'Denmark',
    flag: '🇩🇰',
    country: 'Denmark',
    description: 'Denmark offers government scholarships (tuition waivers + DKK 7,000/month living grant) administered by individual universities for non-EU/EEA Master\'s students.',
    website: 'https://studyindenmark.dk/study-options/scholarships',
  },
  norway: {
    name: 'Norway',
    flag: '🇳🇴',
    country: 'Norway',
    description: 'Norway offers tuition-free education at public universities for ALL international students. PhD positions are fully salaried. BI Norwegian Business School offers the Presidential Scholarship with full tuition + stipend.',
    website: 'https://www.studyinnorway.no/',
  },
  'hong-kong': {
    name: 'Hong Kong',
    flag: '🇭🇰',
    country: 'Hong Kong',
    description: 'Hong Kong offers the HKPFS (400 PhD fellowships at HK$28,400/month) and HKU Entrance Scholarships (full tuition + living allowance) at 8 world-class universities.',
    website: 'https://www.ugc.edu.hk/en/non-local-students/hong-kong-phd-fellowship-scheme.html',
  },
  malaysia: {
    name: 'Malaysia',
    flag: '🇲🇾',
    country: 'Malaysia',
    description: 'The Malaysia International Scholarship (MIS) covers tuition, MYR 1,500/month stipend, insurance, airfare, and thesis costs for Master\'s and PhD studies at Malaysian universities.',
    website: 'https://biasiswa.mohe.gov.my/INTER/index.php',
  },
  poland: {
    name: 'Poland',
    flag: '🇵🇱',
    country: 'Poland',
    description: 'Poland offers the NAWA Stefan Banach (fully funded Master\'s for 36 partner countries including Indonesia) and Ignacy Łukasiewicz programmes (STEM), plus university-specific scholarships at Jagiellonian (Kraków) and University of Warsaw.',
    website: 'https://nawa.gov.pl/en/',
  },
  spain: {
    name: 'Spain',
    flag: '🇪🇸',
    country: 'Spain',
    description: 'Spain offers MAEC-AECID scholarships for citizens of Spanish cooperation partner countries (incl. Indonesia for select programs), "la Caixa" INPhINIT and Junior Leader fellowships (€35,800/yr PhD, €106,700/yr postdoc), and the IE Foundation Fellows Program at IE University.',
    website: 'https://www.aecid.es/en/',
  },
  romania: {
    name: 'Romania',
    flag: '🇷🇴',
    country: 'Romania',
    description: 'Romania offers MFA scholarships (Non-EU citizens) covering tuition, monthly stipend, and a Romanian language preparatory year; the ARICE programme (40 seats/year, non-EU/EFTA only) with full funding; plus university-specific awards at Transilvania University of Brașov (TAS, 800 lei/month) and West University of Timișoara (WUT for EU Third Countries).',
    website: 'https://scholarships.studyinromania.gov.ro/',
  },
  russia: {
    name: 'Russia',
    flag: '🇷🇺',
    country: 'Russia',
    description: 'Russia offers the Open Doors Russian Scholarship Project (24+ leading universities, online Olympiad), the Russian Government Quota via Rossotrudnichestvo (15,000 seats/year, 180+ countries), the SPbU Open International Olympiad, federal university olympiads (BMSTU, NUST MISIS, MIPT, MIFI, Ural Federal), MGIMO state-funded places, and the HSE International Olympiad (incl. joint Skoltech Math of Machine Learning track).',
    website: 'https://education-in-russia.com/',
  },
  'saudi-arabia': {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    country: 'Saudi Arabia',
    description: 'Saudi Arabia offers fully funded government scholarships through 27 public universities including King Saud University (KSU), King Abdulaziz University (KAU), KFUPM, Umm Al-Qura, Islamic University of Madinah, and KAUST. Benefits include full tuition, housing, monthly stipend, health insurance, and annual flights under Saudi Vision 2030.',
    website: 'https://studyinsaudi.moe.gov.sa',
  },
  qatar: {
    name: 'Qatar',
    flag: '🇶🇦',
    country: 'Qatar',
    description: 'Qatar offers fully funded scholarships through Qatar University (QU), Hamad Bin Khalifa University (HBKU / Qatar Foundation), Doha Institute, and the Education Above All (EAA) programme, covering tuition, housing, monthly stipends, and flights for international students.',
    website: 'https://www.qu.edu.qa',
  },
};

function optimizeImagePath(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('/images/')) {
    const optPath = path.replace(/^\/images\//, '/images-optimized/');
    return optPath.replace(/\.(png|jpg|jpeg|webp)$/i, '.webp');
  }
  return path;
}

/**
 * Resolves a specific university or provider logo if available, falling back to group-level logos.
 */
function getScholarshipLogoRaw(s: Scholarship): string | null {
  const name = s.name.toLowerCase();
  const provider = s.provider.toLowerCase();

  const hasWord = (word: string) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(name) || regex.test(provider);
  };

  // 1. Program Logos (scholarship-specific)
  if (name.includes('commonwealth')) return '/images/programlogos/commonwealth.png';
  if (name.includes('adb-japan') || provider.includes('asian development bank')) return '/images/programlogos/adb-jsp.png';
  if (name.includes('joint japan/world bank') || provider.includes('world bank')) return '/images/programlogos/jjwbgsp.png';
  if (name.includes('chevening')) return '/images/programlogos/chevening.png';
  if (name.includes('clarendon')) return '/images/programlogos/clarendon.png';
  if (name.includes('gates cambridge')) return '/images/programlogos/gatescambridge.png';
  if (name.includes('rhodes')) return '/images/programlogos/rhodes.png';
  if (name.includes('erasmus mundus') || name.includes('emjm')) return '/images/programlogos/erasmus+.png';
  if (name.includes('eiffel')) return '/images/programlogos/franceexcellenceeiffel.png';
  if (name.includes('sciences po') || name.includes('émile boutmy')) return '/images/programlogos/sciencepo.png';
  if (name.includes('fulbright')) return '/images/programlogos/fulbright.png';
  if (name.includes('studienstiftung')) return '/images/programlogos/Studienstiftung.png';
  if (name.includes('australia awards') || name.includes('lpdp-australia')) return '/images/programlogos/australiaawards.png';
  if (name.includes('global korea') || name.includes('gks')) return '/images/programlogos/gks.png';
  if (name.includes('jasso') || name.includes('monbukagakusho honors')) return '/images/programlogos/jasso.png';
  if (name.includes('koica')) return '/images/programlogos/koica.png';
  if (name.includes('vlir') || name.includes('vliruos') || name.includes('icp connect')) return '/images/programlogos/vliruos.png';
  if (name.includes('ares')) return '/images/programlogos/ares.png';
  if (name.includes('master mind')) return '/images/logos/KULeuven.png';
  if (name.includes('science@leuven')) return '/images/logos/KULeuven.png';
  if (name.includes('global minds')) return '/images/logos/KULeuven.png';
  if (name.includes('knight-hennessy') || provider.includes('knight-hennessy') || provider.includes('stanford university')) return '/images/logos/Stanford.png';

  // ── Program Logos (scholarship-specific) — added 2026-06-18 ───────────
  // A*STAR (Singapore)
  if (name.includes('a*star') || name.includes('astar')) return '/images/programlogos/astar.png';
  // NL umbrella scholarships (Holland, OKP, OTS)
  if (name.includes('orange tulip') || name.includes('ots')) return '/images/programlogos/orange_tulip.png';
  if (name.includes('holland scholarship') || name.includes('orange knowledge') || name.includes('okp') || name.includes('nl scholarship')) return '/images/programlogos/nuffic.png';
  // China CSC umbrella (CGS, Belt and Road, MOFCOM)
  if (name.includes('mofcom')) return '/images/programlogos/mofcom_china.png';
  if (name.includes('china scholarship council') || name.includes('belt and road') || name.includes('cgs -') || name.includes('silk road')) return '/images/programlogos/csc_china.png';
  // Sweden Institute (SISGP, PWIS)
  if (name.includes('swedish institute') || name.includes('sisgp') || name.includes('pioneering women in stem') || name.includes('pwis')) return '/images/programlogos/si_sweden.png';
  // Italy MAECI umbrella
  if (name.includes('maeci') || name.includes('invest your talent') || name.includes('iyt')) return '/images/programlogos/maeci_italy.png';
  // Hungary Stipendium Hungaricum
  if (name.includes('stipendium hungaricum') || name.includes('tempus public foundation')) return '/images/programlogos/stipendium_hungaricum.png';
  // Taiwan MOE / ICDF / Huayu
  if (name.includes('taiwanicdf') || name.includes('icdf')) return '/images/programlogos/taiwan_icdf.png';
  if (name.includes('moe taiwan') || name.includes('huayu') || name.includes('mandarin language study')) return '/images/programlogos/moe_taiwan.png';
  // Swiss Government Excellence (SERI/SBFI)
  if (name.includes('swiss government excellence') || name.includes('swiss confederation') || (name.includes('seri') || name.includes('sbfi'))) return '/images/programlogos/swiss_seri.png';
  // New Zealand Manaaki
  if (name.includes('manaaki')) return '/images/programlogos/manaaki_nz.png';
  // Ireland (GOI-IES, GOIPG)
  if (name.includes('goi-ies') || name.includes('goipg') || name.includes('government of ireland')) return '/images/programlogos/irish_hea.png';
  // Trinity College Dublin
  if (name.includes('trinity college dublin') || provider.includes('trinity college dublin') || name.includes('tcd global') || name.includes('tcd rachel') || name.includes('ussher')) return '/images/logos/TCD.png';
  // UCD
  if (name.includes('university college dublin') || provider.includes('university college dublin') || name.includes('ucd global') || name.includes('ucd funded')) return '/images/logos/UCD.png';
  // Denmark Government Scholarship
  if (name.includes('danish government') || name.includes('danish ministry of higher education')) return '/images/programlogos/danish_govt.png';
  // Norway Tuition-Free
  if (name.includes('norway tuition') || name.includes('norwegian government')) return '/images/programlogos/norway_govt.png';
  // Hong Kong PhD Fellowship Scheme
  if (name.includes('hkpfs') || name.includes('hong kong phd fellowship') || name.includes('research grants council of hong kong')) return '/images/programlogos/hkpfs.png';
  // Malaysia International Scholarship (MIS)
  if (hasWord('mis') || name.includes('malaysia international scholarship') || name.includes('mohe malaysia')) return '/images/programlogos/mis_malaysia.png';

  // Qatar (program & university logos)
  if (name.includes('education above all') || name.includes('eaa qatar') || hasWord('eaa')) return '/images/programlogos/eaa_qatar.png';
  if (name.includes('qatar university') || hasWord('qu')) return '/images/logos/QU.png';
  if (name.includes('hamad bin khalifa') || hasWord('hbku')) return '/images/logos/HBKU.svg';
  if (name.includes('doha institute') || provider.includes('doha institute')) return '/images/logos/DohaInstitute.svg';

  // Saudi Arabia (program & university logos)
  if (name.includes('saudi ministry') || name.includes('study in saudi') || provider.includes('saudi ministry') || provider.includes('study in saudi')) return '/images/programlogos/saudi_moe.png';
  if (name.includes('king saud') || hasWord('ksu')) return '/images/logos/KSU.png';
  if (name.includes('king abdulaziz') || hasWord('kau')) return '/images/logos/KAU.png';
  if (name.includes('king fahd') || hasWord('kfupm') || name.includes('petroleum and minerals')) return '/images/logos/KFUPM.png';
  if (name.includes('king abdullah') || name.includes('kaust')) return '/images/logos/KAUST.png';
  if (name.includes('umm al-qura') || hasWord('uqu')) return '/images/logos/UQU.png';
  if (name.includes('islamic university of madinah') || name.includes('madinah')) return '/images/logos/IUMadinah.png';

  // Romania (program & university logos)
  if (name.includes('arice')) return '/images/programlogos/arice.png';
  if (name.includes('romanian government mfa') || name.includes('romanian ministry of foreign') || provider.includes('romanian ministry of foreign') || provider.includes('study in romania')) return '/images/programlogos/study_in_romania.png';
  if (name.includes('transilvania university') || provider.includes('transilvania university') || name.includes('tas -')) return '/images/logos/Transilvania.png';
  if (name.includes('west university of timi') || provider.includes('west university of timi') || hasWord('wut') || hasWord('uvt')) return '/images/logos/WUT.png';

  // Russia (program & university logos)
  if (name.includes('open doors') || name.includes('russian scholarship project')) return '/images/programlogos/open_doors.png';
  if (name.includes('rossotrudnichestvo') || name.includes('quota via rossotrudnichestvo') || provider.includes('rossotrudnichestvo')) return '/images/programlogos/rossotrudnichestvo.png';
  if (name.includes('moscow state university') || provider.includes('moscow state university') || hasWord('msu')) return '/images/logos/MSU.png';
  if (name.includes('saint petersburg state') || provider.includes('saint petersburg state') || hasWord('spbu')) return '/images/logos/SPbU.png';
  if (name.includes('higher school of economics') || name.includes('hse university') || provider.includes('higher school of economics') || hasWord('hse')) return '/images/logos/HSE.png';
  if (name.includes('bauman moscow') || provider.includes('bauman moscow') || hasWord('bmstu')) return '/images/logos/BMSTU.png';
  if (name.includes('mgimo') || provider.includes('mgimo') || name.includes('moscow state institute of international')) return '/images/logos/MGIMO.png';
  if (name.includes('nust misis') || provider.includes('nust misis') || hasWord('misis')) return '/images/logos/MISIS.png';

  if (name.includes('university of toronto') || provider.includes('university of toronto') || hasWord('uoft')) return '/images/logos/UofT.png';
  if (name.includes('mcgill') || provider.includes('mcgill')) return '/images/logos/McGill.png';
  if (name.includes('british columbia') || hasWord('ubc')) return '/images/logos/UBC.png';
  if (name.includes('mcmaster') || provider.includes('mcmaster')) return '/images/logos/McMaster.png';
  if (name.includes('waterloo') || provider.includes('waterloo')) return '/images/logos/Waterloo.png';
  
  if (name.includes('national university of singapore') || provider.includes('national university of singapore') || hasWord('nus')) return '/images/logos/NUS.png';
  if (name.includes('nanyang') || provider.includes('nanyang') || hasWord('ntu')) return '/images/logos/NTU.png';
  if (hasWord('smu') || name.includes('singapore management university')) return '/images/logos/SMU.png';
  if (hasWord('sutd') || name.includes('singapore university of technology and design')) return '/images/logos/SUTD.png';
  if (name.includes('asean undergraduate') && !hasWord('nus') && !hasWord('ntu')) return '/images/logos/ASEAN_Undergraduate_Scholarship.png';

  if (name.includes('kyoto') || provider.includes('kyoto')) return '/images/logos/KyotoU.png';
  if (name.includes('tokyo') || provider.includes('tokyo') || hasWord('uoftokyo')) return '/images/logos/UofTokyo.png';
  if (name.includes('osaka') || provider.includes('osaka')) return '/images/logos/Osaka.png';
  if (name.includes('tohoku') || provider.includes('tohoku')) return '/images/logos/Tohoku.png';
  if (name.includes('tokyo institute of technology') || name.includes('tokyo tech')) return '/images/logos/TokyoTech.png';

  if (name.includes('heidelberg') || provider.includes('heidelberg')) return '/images/logos/HeidelbergU.png';
  if (hasWord('lmu') || name.includes('ludwig-maximilians')) return '/images/logos/LMU.png';
  if (name.includes('technical university of munich') || hasWord('tum') || name.includes('münchen') || provider.includes('tum')) return '/images/logos/TUM.png';
  if (name.includes('freie universität berlin') || hasWord('fu berlin') || name.includes('freie universitat')) return '/images/logos/FUBerlin.png';
  if (hasWord('kit') || name.includes('karlsruhe institute of technology') || name.includes('karlsruher institut')) return '/images/logos/KIT.png';

  if (name.includes('paris-saclay') || provider.includes('paris-saclay')) return '/images/logos/ParisSaclay.png';
  if (hasWord('psl') || provider.includes('psl') || name.includes('paris sciences')) return '/images/logos/PSLU.png';
  if (name.includes('polytechnique de paris') || provider.includes('polytechnique de paris')) return '/images/logos/InstitutPolytechniqueDeParis.png';
  if (name.includes('sorbonne') || provider.includes('sorbonne')) return '/images/logos/Sorbonne.png';

  if (name.includes('middle east technical') || hasWord('metu') || provider.includes('metu')) return '/images/logos/METU.png';
  if (name.includes('istanbul technical') || (hasWord('itu') && s.country === 'Turkey')) return '/images/logos/ITU.png';
  if (name.includes('bogazici') || name.includes('boğaziçi')) return '/images/logos/Bogazici.png';
  if (name.includes('hacettepe')) return '/images/logos/Hacettepe.png';
  if (name.includes('koc university') || name.includes('koç')) return '/images/logos/Koc.png';

  if (name.includes('oxford') || provider.includes('oxford')) return '/images/logos/Oxford.png';
  if (name.includes('cambridge') || provider.includes('cambridge')) return '/images/logos/Cambridge.png';
  if (name.includes('imperial college') || provider.includes('imperial college')) return '/images/logos/ImperialCollegeLondon.png';
  if (name.includes('edinburgh') || provider.includes('edinburgh')) return '/images/logos/Edinburgh.png';
  if (hasWord('ucl') || name.includes('university college london')) return '/images/logos/UCL.png';

  if (name.includes('melbourne') || provider.includes('melbourne')) return '/images/logos/Melbourne.png';
  if (name.includes('sydney') || provider.includes('sydney')) return '/images/logos/Sydney.png';
  if (hasWord('anu') || name.includes('australian national university')) return '/images/logos/ANU.png';
  if (name.includes('monash') || provider.includes('monash')) return '/images/logos/Monash_AUS.png';
  if (name.includes('queensland') || provider.includes('queensland') || hasWord('uq')) return '/images/logos/UQ.png';
  if (hasWord('unsw') || name.includes('new south wales')) return '/images/logos/UNSW.png';
  if (name.includes('flinders') || provider.includes('flinders')) return '/images/logos/Flinders.png';
  if (name.includes('griffith') || provider.includes('griffith')) return '/images/logos/Griffith.png';

  if (hasWord('snu') || name.includes('seoul national')) return '/images/logos/SNU.png';
  if (hasWord('kaist') || name.includes('korea advanced institute of science')) return '/images/logos/KAIST.png';
  if (name.includes('yonsei') || provider.includes('yonsei')) return '/images/logos/Yonsei.png';
  if (name.includes('korea university')) return '/images/logos/KoreaU.png';
  if (hasWord('postech') || name.includes('pohang university')) return '/images/logos/POSTECH.png';

  // Netherlands Universities
  if (name.includes('tu delft') || provider.includes('tu delft') || provider.includes('delft university')) return '/images/logos/TUDelft.png';
  if (name.includes('vu fellowship') || name.includes('vrije universiteit amsterdam') || provider.includes('vrije universiteit amsterdam') || provider.includes('vu amsterdam')) return '/images/logos/VUAmsterdam.png';
  if (name.includes('university of amsterdam') || provider.includes('university of amsterdam') || hasWord('uva')) return '/images/logos/UniversityofAmsterdam.png';
  if (name.includes('leiden') || provider.includes('leiden')) return '/images/logos/LeidenU.png';
  if (name.includes('groningen') || provider.includes('groningen') || hasWord('rug')) return '/images/logos/Groningen.png';
  if (name.includes('maastricht') || provider.includes('maastricht')) return '/images/logos/Maastricht.png';
  if (name.includes('radboud') || provider.includes('radboud')) return '/images/logos/RadboudU.png';

  // South Korea (KOICA/GKS partners)
  if (name.includes('sungkyunkwan') || provider.includes('sungkyunkwan') || hasWord('skku')) return '/images/logos/SKKU.png';
  if (name.includes('handong') || provider.includes('handong')) return '/images/logos/Handong.png';

  // SEARCA partner universities
  if (name.includes('uplb') || name.includes('los baños') || name.includes('los banos') || provider.includes('uplb')) return '/images/logos/UPLB.png';
  if (name.includes('upm') || name.includes('putra malaysia') || provider.includes('upm')) return '/images/logos/UPM.png';
  if (name.includes('ugm') || name.includes('gadjah mada') || provider.includes('gadjah mada')) return '/images/logos/UGM.png';
  if (name.includes('incheon') || provider.includes('incheon')) return '/images/logos/Incheon.png';
  if (name.includes('kdi school') || provider.includes('kdi school') || hasWord('kdi')) return '/images/logos/KDI.png';
  if (name.includes('kyungpook') || provider.includes('kyungpook')) return '/images/logos/Kyungpook.png';
  if (name.includes('pukyong') || provider.includes('pukyong')) return '/images/logos/Pukyong.png';
  if (name.includes('university of seoul') || provider.includes('university of seoul')) return '/images/logos/Seoul.png';

  // Turkey & Others
  if (name.includes('ankara university') || provider.includes('ankara university')) return '/images/logos/AnkaraU.png';
  if (name.includes('bayram veli')) return '/images/logos/AnkaraHaciBayramVeliU.png';
  if (name.includes('music and fine arts')) return '/images/logos/AnkaraMusicandFineArtsU.png';
  if (name.includes('asian institute of technology') || hasWord('ait')) return '/images/logos/AIT.png';
  if (name.includes('ens de lyon') || name.includes('ens lyon') || provider.includes('lyon') && (name.includes('normale') || provider.includes('normale'))) return '/images/logos/ENSdeLyon.png';

  // Italy Universities
  if (name.includes('politecnico di milano') || provider.includes('politecnico di milano') || hasWord('polimi')) return '/images/logos/Polimi.png';
  if (name.includes('sapienza') || provider.includes('sapienza')) return '/images/logos/Sapienza.png';

  // China Universities
  if (name.includes('tsinghua') || provider.includes('tsinghua')) return '/images/logos/Tsinghua.png';
  if (name.includes('peking university') || provider.includes('peking university') || name.includes('peking') || provider.includes('peking')) return '/images/logos/Peking.png';
  if (name.includes('zhejiang') || provider.includes('zhejiang')) return '/images/logos/Zhejiang.png';

  // Hungary Universities
  if (name.includes('eötvös') || provider.includes('eötvös') || name.includes('elte') || provider.includes('elte')) return '/images/logos/ELTE.png';
  if (name.includes('semmelweis') || provider.includes('semmelweis')) return '/images/logos/Semmelweis.png';
  if (name.includes('szeged') || provider.includes('szeged') || hasWord('szte')) return '/images/logos/Szeged.png';
  if (name.includes('debrecen') || provider.includes('debrecen')) return '/images/logos/Debrecen.png';

  // Taiwan Universities
  if (name.includes('national taiwan university') || (hasWord('ntu') && s.country === 'Taiwan')) return '/images/logos/NTU_Taiwan.png';
  if (name.includes('tsing hua') || hasWord('nthu') || (name.includes('tsinghua') && s.country === 'Taiwan')) return '/images/logos/NTHU.png';
  if (name.includes('chiao tung') || hasWord('nycu') || name.includes('yang ming chiao tung')) return '/images/logos/NYCU.png';

  // Swiss Universities
  if (name.includes('eth zürich') || name.includes('eth zurich') || name.includes('eidgenössische technische hochschule') || hasWord('eth') || hasWord('ethz')) return '/images/logos/ETH.png';
  if (name.includes('epfl') || name.includes('école polytechnique fédérale de lausanne')) return '/images/logos/EPFL.png';
  if (name.includes('university of zurich') || name.includes('universität zürich') || name.includes('university of zürich') || hasWord('uzh')) return '/images/logos/UZH.png';

  // New Zealand Universities
  if (name.includes('university of auckland') || name.includes('auckland university')) return '/images/logos/Auckland.png';
  if (name.includes('university of otago') || name.includes('otago university')) return '/images/logos/Otago.png';
  if (name.includes('victoria university of wellington') || name.includes('victoria university wellington') || hasWord('vuw')) return '/images/logos/VUW.png';
  if (name.includes('massey') || provider.includes('massey')) return '/images/logos/Massey.png';

  // Ireland Universities
  if (name.includes('trinity college dublin') || name.includes('university of dublin') || hasWord('tcd')) return '/images/logos/TCD.png';
  if (name.includes('university college dublin') || hasWord('ucd')) return '/images/logos/UCD.png';
  if (name.includes('university college cork') || hasWord('ucc')) return '/images/logos/UCC.png';
  if (name.includes('munster technological') || hasWord('mtu')) return '/images/logos/MTU.png';
  if (name.includes('maynooth')) return '/images/logos/Maynooth.png';
  if (name.includes('royal college of surgeons') || hasWord('rcsi')) return '/images/logos/RCSI.png';
  if (name.includes('teagasc')) return '/images/logos/Teagasc.png';

  // Spain Universities
  if (name.includes('ie foundation') || provider.includes('ie foundation')) return '/images/logos/IE_Foundation.png';
  if (name.includes('ie university') || provider.includes('ie university') || hasWord('ie')) return '/images/logos/IE_University.png';
  if (name.includes('girona') || provider.includes('girona') || hasWord('udg')) return '/images/logos/UdG.png';

  // Poland Universities & Program Logos
  if (name.includes('warsaw university of technology') || name.includes('warsaw unitech') || provider.includes('warsaw university of technology') || provider.includes('warsaw unitech')) return '/images/logos/Warsaw_Unitech.png';
  if (name.includes('nawa') || provider.includes('nawa') || name.includes('banach') || name.includes('lukasiewicz') || name.includes('łukasiewicz')) return '/images/logos/NAWA.png';
  if (name.includes('national science centre') || provider.includes('national science centre') || hasWord('ncn')) return '/images/logos/NCN.png';
  if (name.includes('jagiellonian') || provider.includes('jagiellonian') || hasWord('ju')) return '/images/logos/JU.png';
  if (name.includes('warsaw') || provider.includes('warsaw') || hasWord('uw')) return '/images/logos/UW.png';

  // Denmark Universities
  if (name.includes('university of copenhagen') || name.includes('københavns universitet')) return '/images/logos/Copenhagen.png';
  if (name.includes('technical university of denmark') || (hasWord('dtu') && s.country === 'Denmark')) return '/images/logos/DTU_Denmark.png';
  if (name.includes('aarhus university') || name.includes('aarhus universitet')) return '/images/logos/Aarhus.png';

  // Norway Universities
  if (name.includes('university of oslo') || provider.includes('university of oslo') || hasWord('uio')) return '/images/logos/Oslo.png';
  if (name.includes('university of bergen') || provider.includes('university of bergen') || hasWord('uib')) return '/images/logos/Bergen.png';
  if (name.includes('norwegian university of science and technology') || hasWord('ntnu')) return '/images/logos/NTNU.png';

  // Hong Kong Universities
  if (name.includes('university of hong kong') || (hasWord('hku') && s.country === 'Hong Kong')) return '/images/logos/HKU.png';
  if (name.includes('chinese university of hong kong') || hasWord('cuhk')) return '/images/logos/CUHK.png';
  if (name.includes('hong kong university of science and technology') || hasWord('hkust')) return '/images/logos/HKUST.png';

  // Malaysia Universities
  if (name.includes('university of malaya') || provider.includes('university of malaya') || (hasWord('um') && s.country === 'Malaysia')) return '/images/logos/UM.png';
  if (name.includes('universiti kebangsaan malaysia') || hasWord('ukm')) return '/images/logos/UKM.png';

  // Sweden Universities
  if (name.includes('kth royal institute') || name.includes('kth') || provider.includes('kth')) return '/images/logos/KTH.png';
  if (name.includes('lund university') || name.includes('lunds universitet') || hasWord('lund')) return '/images/logos/LundU.png';
  if (name.includes('uppsala university') || name.includes('uppsala universitet') || hasWord('uppsala')) return '/images/logos/UppsalaU.png';
  if (name.includes('chalmers') || provider.includes('chalmers')) return '/images/logos/Chalmers.png';
  if (name.includes('stockholm university') || provider.includes('stockholm university')) return '/images/logos/StockholmU.png';
  if (name.includes('gothenburg') || provider.includes('gothenburg')) return '/images/logos/GothenburgU.png';
  if (name.includes('karolinska') || provider.includes('karolinska')) return '/images/logos/Karolinska.png';

  // Switzerland
  if (name.includes('university of geneva') || provider.includes('university of geneva') || provider.includes('unige')) return '/images/logos/UNIGE.png';
  // Austria
  if (name.includes('helmut veith') || name.includes('tu wien') || provider.includes('vienna university of technology')) return '/images/logos/TUWien.png';
  if (name.includes('university of vienna') || name.includes('universität wien') || name.includes('univie')) return '/images/logos/Vienna.png';
  if (name.includes('innsbruck') || name.includes('universität innsbruck')) return '/images/logos/Innsbruck.png';
  if (provider.includes('oead') || provider.includes('austrian agency')) return '/images/programlogos/OeAD.png';
  // Finland
  if (name.includes('university of helsinki') || provider.includes('university of helsinki') || provider.includes('helsingin yliopisto')) return '/images/logos/Helsinki.png';
  if (name.includes('aalto') || provider.includes('aalto-yliopisto')) return '/images/logos/Aalto.png';
  if (name.includes('tampere') || provider.includes('tuni.fi')) return '/images/logos/Tampere.png';
  if (name.includes('oulu') || provider.includes('oulun yliopisto')) return '/images/logos/Oulu.png';
  if (name.includes('hanken')) return '/images/logos/Hanken.png';
  if (provider.includes('nokia foundation')) return '/images/programlogos/NokiaFoundation.png';

  // 3. Fallback to Group Logos
  const group = providerGroup(s.provider);
  if (group === 'germany') return '/images/logos/daad.svg';
  if (group === 'japan') return '/images/logos/mext.svg';
  if (group === 'turkey') return '/images/logos/turkiye.png';
  if (group === 'united-states') return '/images/logos/Harvard.png';
  if (group === 'belgium') return '/images/programlogos/vliruos.png';
  if (group === 'eu') return '/images/logos/Bologna.png';
  // Group fallbacks added 2026-06-18 (previously returned null → flag-only card)
  if (group === 'netherlands') return '/images/programlogos/nuffic.png';
  if (group === 'china') return '/images/programlogos/csc_china.png';
  if (group === 'sweden') return '/images/programlogos/si_sweden.png';
  if (group === 'italy') return '/images/programlogos/maeci_italy.png';
  if (group === 'hungary') return '/images/programlogos/stipendium_hungaricum.png';
  if (group === 'taiwan') return '/images/programlogos/moe_taiwan.png';
  if (group === 'switzerland') return '/images/programlogos/swiss_seri.png';
  if (group === 'new-zealand') return '/images/programlogos/manaaki_nz.png';
  if (group === 'ireland') return '/images/programlogos/irish_hea.png';
  if (group === 'denmark') return '/images/programlogos/danish_govt.png';
  if (group === 'norway') return '/images/programlogos/norway_govt.png';
  if (group === 'hong-kong') return '/images/programlogos/hkpfs.png';
  if (group === 'malaysia') return '/images/programlogos/mis_malaysia.png';
  if (group === 'poland') return '/images/logos/NAWA.png';
  if (group === 'romania') return '/images/programlogos/study_in_romania.png';
  if (group === 'russia') return '/images/programlogos/rossotrudnichestvo.png';

  return null;
}

export function getScholarshipLogo(s: Scholarship): string | null {
  return optimizeImagePath(getScholarshipLogoRaw(s));
}

/**
 * Resolves a specific university image if available, falling back to country/group default images.
 */
function getScholarshipImageRaw(s: Scholarship): string {
  // ── Specific overrides for Home Page "By Provider" first 3 previews ────────
  const nameTrimmed = s.name.trim();

  // Germany
  if (nameTrimmed === "University Summer Courses offered in Germany for Foreign Students and Graduates (HSK)") return '/images/universities/GE_TUM.png';
  if (nameTrimmed === "Study scholarships for STEM disciplines") return '/images/universities/GE_LMU.png';
  if (nameTrimmed === "Study Scholarships - Postgraduate Studies in the Field of Architecture") return '/images/universities/GE_HeidelbergU.png';

  // Japan
  if (nameTrimmed === "MEXT Scholarship - Undergraduate (Gakubu) 2027") return '/images/universities/JP_UofTokyo.png';
  if (nameTrimmed === "MEXT Scholarship - College of Technology (KOSEN) 2027") return '/images/universities/JP_TokyoTech.png';
  if (nameTrimmed === "MEXT Scholarship - Research Students (Master/PhD) 2027") return '/images/universities/JP_KyotoU.png';

  // United Kingdom
  if (nameTrimmed === "Chevening Scholarship (Indonesia)") return '/images/universities/UK_Oxford.png';
  if (nameTrimmed === "Chevening ASEAN Scholarship") return '/images/universities/UK_Cambridge.png';
  if (nameTrimmed === "Chevening Fellowships") return '/images/universities/UK_ImperialCollegeLondon.png';

  // Australia
  if (nameTrimmed === "Australia Awards Scholarships - PhD & Masters (Indonesia)") return '/images/universities/AUS_Sydney.png';
  if (nameTrimmed === "Australia Awards Garuda Scholarships") return '/images/universities/AUS_ANU.png';
  if (nameTrimmed === "LPDP–Australia Awards Scholarships") return '/images/universities/AUS_Melbourne.png';

  // Singapore
  if (nameTrimmed === "Singapore International Graduate Award (SINGA)") return '/images/universities/SG_SUTD.png';
  if (nameTrimmed === "A*STAR Graduate Scholarship (AGS)") return '/images/universities/SG_NTU.png';
  if (nameTrimmed === "ASEAN Undergraduate Scholarship - NUS") return '/images/universities/SG_NUS.png';

  // Netherlands
  if (nameTrimmed === "Holland Scholarship (NL Scholarship)") return '/images/universities/NL_UniversityofAmsterdam.png';
  if (nameTrimmed === "Orange Knowledge Programme (OKP)") return '/images/universities/NL_TUDelft.png';
  if (nameTrimmed === "Orange Tulip Scholarship (OTS)") return '/images/universities/NL_VUAmsterdam.png';

  // Sweden
  if (nameTrimmed === "Swedish Institute Scholarship for Global Professionals (SISGP)") return '/images/universities/SWE_UppsalaU.png';
  if (nameTrimmed === "Pioneering Women in STEM (PWIS) – Swedish Institute") return '/images/universities/SWE_KTH.png';
  if (nameTrimmed === "Lund University Global Scholarship") return '/images/universities/SWE_LundU.png';

  // Switzerland
  if (nameTrimmed === "Swiss Government Excellence Research Scholarship (Postdoctoral)") return '/images/universities/CH_EPFL.png';
  if (nameTrimmed === "Swiss Government Excellence PhD Scholarship") return '/images/universities/CH_ETH.png';
  if (nameTrimmed === "Swiss Government Excellence Art Scholarship") return '/images/universities/CH_UNIGE.png';

  // Malaysia
  if (nameTrimmed === "Malaysia International Scholarship (MIS)") return '/images/universities/MY_UM.png';

  // New Zealand
  if (nameTrimmed === "Manaaki New Zealand Scholarship - Tertiary (Undergraduate & Postgraduate)") return '/images/universities/NZ_Auckland.png';
  if (nameTrimmed === "Manaaki New Zealand Scholarship - Vocational Short-Term Training") return '/images/universities/NZ_Otago.png';
  if (nameTrimmed === "Manaaki New Zealand Scholarship - English Language Training for Officials (NZELTO)") return '/images/universities/NZ_Massey.png';

  // Hong Kong
  if (nameTrimmed === "Hong Kong PhD Fellowship Scheme (HKPFS)") return '/images/universities/HK_CUHK.png';
  if (nameTrimmed === "HKU Entrance Scholarship for International Students") return '/images/universities/HK_HKU.png';

  // Hungary
  if (nameTrimmed === "Stipendium Hungaricum - Bachelor's / One-Tier Master's Scholarship") return '/images/universities/HU_ELTE.png';
  if (nameTrimmed === "Stipendium Hungaricum - Master's Scholarship") return '/images/universities/HU_Semmelweis.png';
  if (nameTrimmed === "Stipendium Hungaricum - Doctoral (PhD) Scholarship") return '/images/universities/HU_Debrecen.png';

  // Taiwan
  if (nameTrimmed === "MOE Taiwan Scholarship - Bachelor's Degree") return '/images/universities/TW_NTU.png';
  if (nameTrimmed === "MOE Taiwan Scholarship - Master's / PhD Degree") return '/images/universities/TW_NTHU.png';
  if (nameTrimmed === "TaiwanICDF Higher Education Scholarship") return '/images/universities/TW_NYCU.png';

  // Austria
  if (nameTrimmed === "Helmut Veith Stipend (TU Wien - Computer Science)") return '/images/universities/AT_TUWien.png';
  if (nameTrimmed === "OeAD Ernst Mach Grant - Worldwide") return '/images/universities/AT_Vienna.png';
  if (nameTrimmed === "OeAD Ernst Mach Grant - UAS Worldwide (Fachhochschulen)") return '/images/universities/AT_Innsbruck.png';

  // Ireland
  if (nameTrimmed === "Government of Ireland International Education Scholarship (GOI-IES)") return '/images/universities/IE_TCD.png';
  if (nameTrimmed === "Government of Ireland Postgraduate Scholarship (GOIPG)") return '/images/universities/IE_UCD.png';
  if (nameTrimmed === "Trinity College Dublin (TCD) Global Excellence Postgraduate Scholarship") return '/images/universities/IE_UCC.png';

  // Spain
  if (nameTrimmed === "MAEC-AECID Becas (Spanish Government Scholarships)") return '/images/universities/ES_UB.png';
  if (nameTrimmed === "\"la Caixa\" INPhINIT Doctoral Fellowships") return '/images/universities/ES_UAM.png';
  if (nameTrimmed === "\"la Caixa\" Junior Leader Postdoctoral Fellowships") return '/images/universities/ES_IE.png';
  if (nameTrimmed === "IE Foundation Fellows Program") return '/images/universities/ES_IE.png';
  if (nameTrimmed === "Universidad de Girona Banco Santander Scholarship") return '/images/universities/ES_UB.png';

  // Poland
  if (nameTrimmed === "NAWA Stefan Banach Scholarship Programme") return '/images/universities/PL_UW.png';
  if (nameTrimmed === "NAWA Ignacy Łukasiewicz Scholarship Programme") return '/images/universities/PL_WarsawUnitech.png';
  if (nameTrimmed === "Jagiellonian University International Scholarships (Rector's Scholarship)") return '/images/universities/PL_JU.png';

  // Romania
  if (nameTrimmed === "Romanian Government MFA Scholarship (Non-EU Citizens)") return '/images/universities/RO_Bucharest.png';
  if (nameTrimmed === "Romanian Government ARICE Scholarship") return '/images/universities/RO_UBB.png';
  if (nameTrimmed === "Transilvania Academica Scholarship (TAS) - Brașov") return '/images/universities/RO_Transilvania.png';
  if (nameTrimmed === "WUT Scholarship for EU Third Countries (West University of Timișoara)") return '/images/universities/RO_WUT.png';

  // Russia
  if (nameTrimmed === "Open Doors: Russian Scholarship Project") return '/images/universities/RU_HSE.png';
  if (nameTrimmed === "Russian Government Scholarship (Quota via Rossotrudnichestvo)") return '/images/universities/RU_MSU.png';
  if (nameTrimmed === "SPbU Open International Olympiad") return '/images/universities/RU_SPbU.png';
  if (nameTrimmed === "NUST MISIS, BMSTU & Federal University Olympiads") return '/images/universities/RU_BMSTU.png';
  if (nameTrimmed === "MGIMO State-Funded Places") return '/images/universities/RU_MGIMO.png';
  if (nameTrimmed === "HSE University International Olympiad") return '/images/universities/RU_HSE.png';
  if (nameTrimmed === "Russian Presidential Scholarship (Президентская стипендия)") return '/images/universities/RU_MSU.png';

  // Qatar overrides — 7 scholarships rotated across 3 unique preview images
  if (nameTrimmed === "Qatar University (QU) Graduate Scholarship - Master's") return '/images/universities/QA_QU.png';
  if (nameTrimmed === "Qatar University (QU) Graduate Scholarship - PhD & PharmD") return '/images/universities/QA_HBKU.png';
  if (nameTrimmed === "Qatar University (QU) Undergraduate International Scholarship") return '/images/universities/QA_DohaInstitute.png';
  if (nameTrimmed === "Hamad Bin Khalifa University (HBKU) Graduate Scholarship - Master's") return '/images/universities/QA_HBKU.png';
  if (nameTrimmed === "Hamad Bin Khalifa University (HBKU) Graduate Scholarship - PhD") return '/images/universities/QA_QU.png';
  if (nameTrimmed === "Doha Institute for Graduate Studies Scholarship") return '/images/universities/QA_DohaInstitute.png';
  if (nameTrimmed === "EAA Qatar Scholarship Programme (Education Above All)") return '/images/universities/QA_HBKU.png';

  // Saudi Arabia overrides — 11 scholarships rotated across 3 unique preview images
  if (nameTrimmed === "Saudi Government Scholarship - Bachelor's (Study in Saudi Arabia)") return '/images/universities/SA_KSU.png';
  if (nameTrimmed === "Saudi Government Scholarship - Master's (Study in Saudi Arabia)") return '/images/universities/SA_KAU.png';
  if (nameTrimmed === "Saudi Government Scholarship - PhD (Study in Saudi Arabia)") return '/images/universities/SA_KAUST.png';
  if (nameTrimmed === "King Saud University (KSU) International Scholarship - Bachelor's") return '/images/universities/SA_KSU.png';
  if (nameTrimmed === "King Saud University (KSU) International Scholarship - Master's") return '/images/universities/SA_KAU.png';
  if (nameTrimmed === "King Saud University (KSU) International Scholarship - PhD") return '/images/universities/SA_KAUST.png';
  if (nameTrimmed === "King Abdulaziz University (KAU) International Scholarship") return '/images/universities/SA_KAU.png';
  if (nameTrimmed === "King Fahd University of Petroleum & Minerals (KFUPM) International Scholarship") return '/images/universities/SA_KSU.png';
  if (nameTrimmed === "Umm Al-Qura University International Scholarship") return '/images/universities/SA_KAU.png';
  if (nameTrimmed === "Islamic University of Madinah International Scholarship") return '/images/universities/SA_KSU.png';
  if (nameTrimmed === "King Abdullah University of Science & Technology (KAUST) Fellowship") return '/images/universities/SA_KAUST.png';

  const name = s.name.toLowerCase();
  const provider = s.provider.toLowerCase();

  const hasWord = (word: string) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(name) || regex.test(provider);
  };

  // 1. Specific University Images
  if (name.includes('knight-hennessy') || provider.includes('stanford university')) return '/images/universities/US_Stanford.png';

  if (name.includes('university of toronto') || provider.includes('university of toronto') || hasWord('uoft')) return '/images/universities/CA_UofT.png';
  if (name.includes('mcgill') || provider.includes('mcgill')) return '/images/universities/CA_McGill.png';
  if (name.includes('british columbia') || hasWord('ubc')) return '/images/universities/CA_UBC.png';
  if (name.includes('mcmaster') || provider.includes('mcmaster')) return '/images/universities/CA_McMaster.png';
  if (name.includes('waterloo') || provider.includes('waterloo')) return '/images/universities/CA_Waterloo.png';

  // A*STAR and SINGA specific rotations to prevent matching generic NUS/NTU checks on provider
  if (name.includes('singa') || name.includes('singapore international graduate')) return '/images/universities/SG_SUTD.png';
  if (name.includes('astar') || name.includes('a*star')) return '/images/universities/astar_wide.png';

  if (name.includes('national university of singapore') || provider.includes('national university of singapore') || hasWord('nus')) return '/images/universities/SG_NUS.png';
  if (name.includes('nanyang') || provider.includes('nanyang') || hasWord('ntu')) return '/images/universities/SG_NTU.png';
  if (hasWord('smu') || name.includes('singapore management university')) return '/images/universities/SG_SMU.png';
  if (hasWord('sutd') || name.includes('singapore university of technology and design')) return '/images/universities/SG_SUTD.png';

  if (name.includes('kyoto') || provider.includes('kyoto')) return '/images/universities/JP_KyotoU.png';
  if (name.includes('tokyo') || provider.includes('tokyo') || hasWord('uoftokyo')) return '/images/universities/JP_UofTokyo.png';
  if (name.includes('osaka') || provider.includes('osaka')) return '/images/universities/JP_Osaka.png';
  if (name.includes('tohoku') || provider.includes('tohoku')) return '/images/universities/JP_Tohoku.png';
  if (name.includes('tokyo institute of technology') || name.includes('tokyo tech')) return '/images/universities/JP_TokyoTech.png';

  if (name.includes('heidelberg') || provider.includes('heidelberg')) return '/images/universities/GE_HeidelbergU.png';
  if (hasWord('lmu') || name.includes('ludwig-maximilians')) return '/images/universities/GE_LMU.png';
  if (name.includes('technical university of munich') || hasWord('tum') || name.includes('münchen') || provider.includes('tum')) return '/images/universities/GE_TUM.png';
  if (name.includes('freie universität berlin') || hasWord('fu berlin') || name.includes('freie universitat')) return '/images/universities/GE_FUBerlin.png';
  if (hasWord('kit') || name.includes('karlsruhe institute of technology') || name.includes('karlsruher institut')) return '/images/universities/GE_KIT.png';

  if (name.includes('paris-saclay') || provider.includes('paris-saclay')) return '/images/universities/FR_ParisSaclay.png';
  if (hasWord('psl') || provider.includes('psl') || name.includes('paris sciences')) return '/images/universities/FR_PSLU.png';
  if (name.includes('polytechnique de paris') || provider.includes('polytechnique de paris')) return '/images/universities/FR_InstitutPolytechniqueDeParis.png';
  if (name.includes('sorbonne') || provider.includes('sorbonne')) return '/images/universities/FR_Sorbonne.png';

  if (name.includes('middle east technical') || hasWord('metu') || provider.includes('metu')) return '/images/universities/TU_METU.png';
  if (name.includes('istanbul technical') || (hasWord('itu') && s.country === 'Turkey')) return '/images/universities/TU_ITU.png';
  if (name.includes('bogazici') || name.includes('boğaziçi')) return '/images/universities/TU_Bogazici.png';
  if (name.includes('hacettepe')) return '/images/universities/TU_Hacettepe.png';
  if (name.includes('koc university') || name.includes('koç')) return '/images/universities/TU_Koc.png';

  if (name.includes('oxford') || provider.includes('oxford')) return '/images/universities/UK_Oxford.png';
  if (name.includes('cambridge') || provider.includes('cambridge')) return '/images/universities/UK_Cambridge.png';
  if (name.includes('imperial college') || provider.includes('imperial college')) return '/images/universities/UK_ImperialCollegeLondon.png';
  if (name.includes('edinburgh') || provider.includes('edinburgh')) return '/images/universities/UK_Edinburgh.png';
  if (hasWord('ucl') || name.includes('university college london')) return '/images/universities/UK_UCL.png';

  if (name.includes('melbourne') || provider.includes('melbourne')) return '/images/universities/AUS_Melbourne.png';
  if (name.includes('sydney') || provider.includes('sydney')) return '/images/universities/AUS_Sydney.png';
  if (hasWord('anu') || name.includes('australian national university')) return '/images/universities/AUS_ANU.png';
  if (name.includes('monash') || provider.includes('monash')) return '/images/universities/AUS_Monash.png';
  if (name.includes('queensland') || provider.includes('queensland') || hasWord('uq')) return '/images/universities/AUS_UQ.png';
  if (hasWord('unsw') || name.includes('new south wales')) return '/images/universities/AUS_UNSW.png';
  if (name.includes('flinders') || provider.includes('flinders')) return '/images/universities/AUS_Flinders.png';
  if (name.includes('griffith') || provider.includes('griffith')) return '/images/universities/AUS_Griffith.png';

  if (hasWord('snu') || name.includes('seoul national')) return '/images/universities/KOR_SNU.png';
  if (hasWord('kaist') || name.includes('korea advanced institute of science')) return '/images/universities/KOR_KAIST.png';
  if (name.includes('yonsei') || provider.includes('yonsei')) return '/images/universities/KOR_Yonsei.png';
  if (name.includes('korea university')) return '/images/universities/KOR_KoreaU.png';
  if (hasWord('postech') || name.includes('pohang university')) return '/images/universities/KOR_POSTECH.png';

  // New specific background images
  if (name.includes('tu delft') || provider.includes('tu delft') || provider.includes('delft university')) return '/images/universities/NL_TUDelft.png';
  if (name.includes('university of amsterdam') || provider.includes('university of amsterdam') || hasWord('uva')) return '/images/universities/NL_UniversityofAmsterdam.png';

  // SEARCA partner universities
  if (name.includes('uplb') || name.includes('los baños') || name.includes('los banos') || provider.includes('uplb')) return '/images/universities/PH_UPLB.png';
  if (name.includes('upm') || name.includes('putra malaysia') || provider.includes('upm')) return '/images/universities/MY_UPM.png';
  if (name.includes('ugm') || name.includes('gadjah mada') || provider.includes('gadjah mada')) return '/images/universities/ID_UGM.png';
  // SEARCA scholarship itself — use UGM as representative
  if (name.includes('searca')) return '/images/universities/ID_UGM.png';

  // Italy Universities
  if (name.includes('politecnico di milano') || provider.includes('politecnico di milano') || hasWord('polimi')) return '/images/universities/ITA_Polimi.png';
  if (name.includes('sapienza') || provider.includes('sapienza')) return '/images/universities/ITA_Sapienza.png';

  // China Universities
  if (name.includes('tsinghua') || provider.includes('tsinghua')) return '/images/universities/CN_Tsinghua.png';
  if (name.includes('peking university') || provider.includes('peking university') || name.includes('peking') || provider.includes('peking')) return '/images/universities/CN_Peking.png';
  if (name.includes('zhejiang') || provider.includes('zhejiang')) return '/images/universities/CN_Zhejiang.png';

  // Hungary Universities
  if (name.includes('eötvös') || provider.includes('eötvös') || name.includes('elte') || provider.includes('elte')) return '/images/universities/HU_ELTE.png';
  if (name.includes('semmelweis') || provider.includes('semmelweis')) return '/images/universities/HU_Semmelweis.png';
  if (name.includes('debrecen') || provider.includes('debrecen')) return '/images/universities/HU_Debrecen.png';

  // Taiwan Universities
  if (name.includes('national taiwan university') || (hasWord('ntu') && s.country === 'Taiwan')) return '/images/universities/TW_NTU.png';
  if (name.includes('tsing hua') || hasWord('nthu') || (name.includes('tsinghua') && s.country === 'Taiwan')) return '/images/universities/TW_NTHU.png';
  if (name.includes('chiao tung') || hasWord('nycu') || name.includes('yang ming chiao tung')) return '/images/universities/TW_NYCU.png';

  // Swiss Universities
  if (name.includes('eth zürich') || name.includes('eth zurich') || name.includes('eidgenössische technische hochschule') || hasWord('eth') || hasWord('ethz')) return '/images/universities/CH_ETH.png';
  if (name.includes('epfl') || name.includes('école polytechnique fédérale de lausanne')) return '/images/universities/CH_EPFL.png';

  // New Zealand Universities
  if (name.includes('university of auckland') || name.includes('auckland university')) return '/images/universities/NZ_Auckland.png';
  if (name.includes('university of otago') || name.includes('otago university')) return '/images/universities/NZ_Otago.png';
  if (name.includes('massey') || provider.includes('massey')) return '/images/universities/NZ_Massey.png';

  // Ireland Universities
  if (name.includes('trinity college dublin') || name.includes('university of dublin') || hasWord('tcd')) return '/images/universities/IE_TCD.png';
  if (name.includes('university college dublin') || hasWord('ucd')) return '/images/universities/IE_UCD.png';
  if (name.includes('university college cork') || hasWord('ucc') || name.includes('cork')) return '/images/universities/IE_UCC.png';

  // Spain Universities
  if (name.includes('barcelona') || name.includes('girona') || hasWord('ub')) return '/images/universities/ES_UB.png';
  if (name.includes('autónoma de madrid') || name.includes('autonoma de madrid') || hasWord('uam')) return '/images/universities/ES_UAM.png';
  if (name.includes('ie university') || name.includes('ie foundation') || name.includes('ie business')) return '/images/universities/ES_IE.png';

  // Denmark Universities
  if (name.includes('university of copenhagen') || name.includes('københavns universitet')) return '/images/universities/DK_Copenhagen.png';
  if (name.includes('technical university of denmark') || (hasWord('dtu') && s.country === 'Denmark')) return '/images/universities/DK_DTU.png';

  // Norway Universities
  if (name.includes('university of oslo') || provider.includes('university of oslo') || hasWord('uio')) return '/images/universities/NO_Oslo.png';
  if (name.includes('norwegian university of science and technology') || hasWord('ntnu')) return '/images/universities/NO_NTNU.png';

  // Hong Kong Universities
  if (name.includes('university of hong kong') || (hasWord('hku') && s.country === 'Hong Kong')) return '/images/universities/HK_HKU.png';
  if (name.includes('chinese university of hong kong') || hasWord('cuhk')) return '/images/universities/HK_CUHK.png';

  // Malaysia Universities
  if (name.includes('university of malaya') || provider.includes('university of malaya') || (hasWord('um') && s.country === 'Malaysia')) return '/images/universities/MY_UM.png';
  if (name.includes('universiti kebangsaan malaysia') || hasWord('ukm')) return '/images/universities/MY_UKM.png';

  // Poland Universities
  if (name.includes('jagiellonian') || provider.includes('jagiellonian') || hasWord('ju')) return '/images/universities/PL_JU.png';
  if (name.includes('warsaw university of technology') || name.includes('warsaw unitech') || provider.includes('warsaw university of technology') || provider.includes('warsaw unitech')) return '/images/universities/PL_WarsawUnitech.png';
  if (name.includes('warsaw') || provider.includes('warsaw') || hasWord('uw')) return '/images/universities/PL_UW.png';

  // Sweden Universities
  if (name.includes('kth royal institute') || name.includes('kth') || provider.includes('kth')) return '/images/universities/SWE_KTH.png';
  if (name.includes('lund university') || name.includes('lunds universitet') || hasWord('lund')) return '/images/universities/SWE_LundU.png';
  if (name.includes('uppsala university') || name.includes('uppsala universitet') || hasWord('uppsala')) return '/images/universities/SWE_UppsalaU.png';
  if (name.includes('chalmers') || provider.includes('chalmers')) return '/images/universities/SWE_Chalmers.png';
  if (name.includes('stockholm university') || provider.includes('stockholm university')) return '/images/universities/SWE_StockholmU.png';
  if (name.includes('gothenburg') || provider.includes('gothenburg')) return '/images/universities/SWE_GothenburgU.png';
  if (name.includes('karolinska') || provider.includes('karolinska')) return '/images/universities/SWE_Karolinska.png';

  // Switzerland
  if (name.includes('university of geneva') || provider.includes('university of geneva') || provider.includes('unige')) return '/images/universities/CH_UNIGE.png';
  // Austria
  if (name.includes('helmut veith') || name.includes('tu wien') || provider.includes('vienna university of technology')) return '/images/universities/AT_TUWien.png';
  if (name.includes('university of vienna') || name.includes('universität wien') || name.includes('univie')) return '/images/universities/AT_Vienna.png';
  if (name.includes('innsbruck') || name.includes('universität innsbruck')) return '/images/universities/AT_Innsbruck.png';
  // Finland
  if (name.includes('university of helsinki') || provider.includes('university of helsinki') || provider.includes('helsingin yliopisto')) return '/images/universities/FI_Helsinki.png';
  if (name.includes('aalto') || provider.includes('aalto-yliopisto')) return '/images/universities/FI_Aalto.png';
  if (name.includes('tampere') || provider.includes('tuni.fi')) return '/images/universities/FI_Tampere.png';
  if (name.includes('oulu') || provider.includes('oulun yliopisto')) return '/images/universities/FI_Oulu.png';
  if (name.includes('hanken')) return '/images/universities/FI_Hanken.png';

  // Qatar
  if (name.includes('qatar university') || hasWord('qu')) return '/images/universities/QA_QU.png';
  if (name.includes('hamad bin khalifa') || hasWord('hbku')) return '/images/universities/QA_HBKU.png';
  if (name.includes('doha institute')) return '/images/universities/QA_DohaInstitute.png';

  // Saudi Arabia
  if (name.includes('king saud') || hasWord('ksu')) return '/images/universities/SA_KSU.png';
  if (name.includes('king abdulaziz') || hasWord('kau')) return '/images/universities/SA_KAU.png';
  if (name.includes('kaust') || name.includes('king abdullah')) return '/images/universities/SA_KAUST.png';
  if (name.includes('kfupm') || name.includes('king fahd') || name.includes('petroleum and minerals')) return '/images/universities/SA_KAUST.png';
  if (name.includes('umm al-qura') || hasWord('uqu')) return '/images/universities/SA_KSU.png';
  if (name.includes('islamic university of madinah') || name.includes('madinah')) return '/images/universities/SA_KAU.png';

  // 2. Fallback to Country/Group Images
  const group = providerGroup(s.provider);
  if (group === 'germany') return '/images/universities/GE_HeidelbergU.png';
  if (group === 'japan') return '/images/universities/JP_UofTokyo.png';
  if (group === 'turkey') return '/images/universities/TU_METU.png';
  if (group === 'france') return '/images/universities/FR_PSLU.png';
  if (group === 'singapore') return '/images/universities/SG_NUS.png';
  if (group === 'canada') return '/images/universities/CA_UofT.png';
  if (group === 'united-kingdom') return '/images/universities/UK_Oxford.png';
  if (group === 'netherlands') {
    // Rotate through different NL university images based on scholarship name
    if (name.includes('vu fellowship') || name.includes('vrije universiteit amsterdam') || provider.includes('vrije universiteit amsterdam') || provider.includes('vu amsterdam')) return '/images/universities/NL_VUAmsterdam.png';
    if (name.includes('groningen')) return '/images/universities/NL_TUDelft.png';
    if (name.includes('leiden')) return '/images/universities/NL_UniversityofAmsterdam.png';
    if (name.includes('maastricht')) return '/images/universities/NL_TUDelft.png';
    if (name.includes('radboud')) return '/images/universities/NL_UniversityofAmsterdam.png';
    if (name.includes('orange knowledge') || name.includes('okp')) return '/images/universities/nuffic_wide.png';
    if (name.includes('orange tulip') || name.includes('ots')) return '/images/universities/nuffic_wide.png';
    if (name.includes('holland') || name.includes('nl scholarship')) return '/images/universities/nuffic_wide.png';
    return '/images/universities/nuffic_wide.png';
  }
  if (group === 'australia') return '/images/universities/AUS_Sydney.png';
  if (group === 'south-korea') return '/images/universities/KOR_SNU.png';
  if (group === 'south-korea') return '/images/universities/KOR_Yonsei.png';
  // Fulbright - rotate between top US placement universities
  if (group === 'united-states') {
    const name = s.name.toLowerCase();
    if (name.includes('humphrey')) return '/images/universities/US_Columbia.png';
    if (name.includes('flta') || name.includes('teaching assistant')) return '/images/universities/US_Stanford.png';
    return '/images/universities/US_Harvard.png';
  }
  // Belgium - rotate between top Belgian universities
  if (group === 'belgium') {
    const name = s.name.toLowerCase();
    if (name.includes('science@leuven') || name.includes('global minds') || name.includes('doctoral')) return '/images/universities/BEL_KULeuven.png';
    if (name.includes('master mind')) return '/images/universities/BEL_GhentU.png';
    if (name.includes('ares')) return '/images/universities/BEL_VUB.png';
    if (name.includes('advanced') || name.includes('1 year')) return '/images/universities/BEL_VUB.png';
    if (name.includes('bachelor')) return '/images/universities/BEL_GhentU.png';
    return '/images/universities/BEL_KULeuven.png';
  }
  // Erasmus Mundus - use Bologna as iconic EU university
  if (group === 'eu') return '/images/universities/ITA_Bologna.png';
  if (group === 'italy') return '/images/universities/ITA_Polimi.png';
  if (group === 'sweden') {
    // Rotate Sweden images for scholarships without a specific university match
    if (name.includes('stem') || name.includes('women') || name.includes('pioneering')) return '/images/universities/SWE_KTH.png';
    return '/images/universities/si_sweden_wide.png';
  }
  if (group === 'china') return '/images/universities/CN_Tsinghua.png';
  if (group === 'hungary') {
    if (name.includes('doctoral') || name.includes('phd') || name.includes('debrecen')) return '/images/universities/HU_Debrecen.png';
    if (name.includes('master')) return '/images/universities/HU_Semmelweis.png';
    return '/images/universities/HU_ELTE.png';
  }
  if (group === 'taiwan') {
    if (name.includes('icdf') || name.includes('chiao tung') || name.includes('nycu')) {
      return '/images/universities/TW_NYCU.png';
    }
    if (name.includes('master') || name.includes('phd') || name.includes('graduate')) {
      return '/images/universities/TW_NTHU.png';
    }
    return '/images/universities/TW_NTU.png';
  }
  if (group === 'switzerland') {
    if (name.includes('research') || name.includes('postdoctoral')) {
      return '/images/universities/CH_EPFL.png';
    }
    return '/images/universities/CH_ETH.png';
  }
  if (group === 'new-zealand') {
    if (name.includes('postgraduate') || name.includes('phd') || name.includes('master') || name.includes('graduate')) {
      return '/images/universities/NZ_Otago.png';
    }
    if (name.includes('english') || name.includes('nzelto') || name.includes('massey')) {
      return '/images/universities/NZ_Massey.png';
    }
    return '/images/universities/NZ_Auckland.png';
  }
  if (group === 'ireland') {
    if (name.includes('postgraduate') || name.includes('research') || name.includes('phd') || name.includes('goipg')) {
      return '/images/universities/IE_UCD.png';
    }
    if (name.includes('cork') || name.includes('ucc')) {
      return '/images/universities/IE_UCC.png';
    }
    return '/images/universities/IE_TCD.png';
  }
  if (group === 'spain') {
    if (name.includes('inphinit') || name.includes('doctoral')) {
      return '/images/universities/ES_UAM.png';
    }
    if (name.includes('junior') || name.includes('leader') || name.includes('postdoctoral') || name.includes('ie ')) {
      return '/images/universities/ES_IE.png';
    }
    return '/images/universities/ES_UB.png';
  }
  if (group === 'denmark') {
    if (name.includes('technical') || name.includes('dtu') || name.includes('technology') || name.includes('science')) {
      return '/images/universities/DK_DTU.png';
    }
    return '/images/universities/DK_Copenhagen.png';
  }
  if (group === 'norway') {
    if (name.includes('technical') || name.includes('ntnu') || name.includes('technology') || name.includes('science')) {
      return '/images/universities/NO_NTNU.png';
    }
    return '/images/universities/NO_Oslo.png';
  }
  if (group === 'hong-kong') {
    if (name.includes('chinese') || name.includes('cuhk')) {
      return '/images/universities/HK_CUHK.png';
    }
    return '/images/universities/HK_HKU.png';
  }
  if (group === 'malaysia') {
    if (name.includes('kebangsaan') || name.includes('ukm')) {
      return '/images/universities/MY_UKM.png';
    }
    if (name.includes('putra') || name.includes('upm')) {
      return '/images/universities/MY_UPM.png';
    }
    return '/images/universities/mohe_malaysia_wide.png';
  }
  if (group === 'poland') {
    if (name.includes('lukasiewicz') || name.includes('łukasiewicz') || name.includes('unitech') || name.includes('technology')) {
      return '/images/universities/PL_WarsawUnitech.png';
    }
    if (name.includes('jagiellonian') || name.includes('ju') || name.includes('rectors')) {
      return '/images/universities/PL_JU.png';
    }
    return '/images/universities/PL_UW.png';
  }
  if (group === 'romania') {
    if (name.includes('transilvania') || name.includes('tas')) {
      return '/images/universities/RO_Transilvania.png';
    }
    if (name.includes('west university') || name.includes('wut') || name.includes('timisoara') || name.includes('timișoara') || name.includes('uvt')) {
      return '/images/universities/RO_Transilvania.png';
    }
    if (name.includes('arice')) {
      return '/images/universities/RO_UBB.png';
    }
    return '/images/universities/RO_Bucharest.png';
  }
  if (group === 'russia') {
    if (name.includes('doors') || name.includes('hse') || name.includes('economics')) {
      return '/images/universities/RU_HSE.png';
    }
    if (name.includes('bmstu') || name.includes('misis') || name.includes('technical') || name.includes('federal')) {
      return '/images/universities/RU_SPbU.png';
    }
    if (name.includes('saint petersburg') || name.includes('spbu') || name.includes('olympiad')) {
      return '/images/universities/RU_SPbU.png';
    }
    if (name.includes('mgimo')) {
      return '/images/universities/RU_MSU.png';
    }
    return '/images/universities/RU_MSU.png';
  }
  if (group === 'saudi-arabia') {
    if (name.includes('kaust') || name.includes('king abdullah')) {
      return '/images/logos/kaust.png';
    }
    return '/images/universities/SA_KSU.png';
  }
  if (group === 'qatar') {
    return '/images/universities/QA_HBKU.png';
  }

  return '/images/editorial/stem.jpg'; // ultimate fallback
}

export function getScholarshipImage(s: Scholarship): string {
  return optimizeImagePath(getScholarshipImageRaw(s)) ?? '/images-optimized/editorial/stem.webp';
}

export interface UniversityLogo {
  name: string;
  logo: string;
}

export function getMatchedUniversityLogos(s: Scholarship): UniversityLogo[] {
  const text = `${s.name} ${s.provider} ${s.description ?? ''}`.toLowerCase();
  const list: UniversityLogo[] = [];

  if (text.includes('knight-hennessy') || text.includes('stanford university')) {
    list.push(
      { name: 'Stanford University', logo: '/images/logos/Stanford.png' },
      { name: 'Stanford Graduate School of Business', logo: '/images/logos/StanfordGSB.png' },
      { name: 'Stanford Graduate School of Education', logo: '/images/logos/StanfordGSE.png' },
      { name: 'Stanford School of Engineering', logo: '/images/logos/StanfordEngineering.png' },
      { name: 'Stanford School of Humanities & Sciences', logo: '/images/logos/StanfordHumanitiesSciences.png' },
      { name: 'Stanford Law School', logo: '/images/logos/StanfordLaw.png' },
      { name: 'Stanford Medicine', logo: '/images/logos/StanfordMedicine.png' },
      { name: 'Stanford Doerr School of Sustainability', logo: '/images/logos/StanfordDoerrSustainability.png' }
    );
  }

  if (text.includes('adb-japan scholarship') || text.includes('asian development bank')) {
    list.push(
      { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png' },
      { name: 'Ritsumeikan University', logo: '/images/logos/Ritsumeikan.png' },
      { name: 'Institute of Science Tokyo', logo: '/images/logos/ScienceTokyo.png' },
      { name: 'Asian Institute of Technology (AIT)', logo: '/images/logos/AIT.png' },
      { name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png' }
    );
  }

  if (text.includes('joint japan/world bank') || text.includes('jj/wbgsp') || text.includes('world bank')) {
    list.push(
      { name: 'Brandeis University', logo: '/images/logos/Brandeis.png' },
      { name: 'Columbia University', logo: '/images/logos/ColumbiaU.png' },
      { name: 'Johns Hopkins University', logo: '/images/logos/JohnsHopkins.png' },
      { name: 'KIT Royal Tropical Institute', logo: '/images/logos/KITRoyalTropicalInstitute.png' },
      { name: 'Vrije Universiteit Amsterdam', logo: '/images/logos/VUAmsterdam.png' },
      { name: 'University of California, Berkeley', logo: '/images/logos/UCBerkeley.png' },
      { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png' },
      { name: 'University of Tsukuba', logo: '/images/logos/Tsukuba.png' },
      { name: 'Williams College', logo: '/images/logos/WilliamsCollege.png' },
      { name: 'Yale University', logo: '/images/logos/Yale.png' }
    );
  }

  const universities = [
    { name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png', keywords: ['nus', 'national university of singapore'] },
    { name: 'Nanyang Technological University (NTU)', logo: '/images/logos/NTU.png', keywords: ['ntu_sg', 'nanyang'] },
    { name: 'Singapore Management University (SMU)', logo: '/images/logos/SMU.png', keywords: ['smu', 'singapore management'] },
    { name: 'Singapore University of Technology and Design (SUTD)', logo: '/images/logos/SUTD.png', keywords: ['sutd', 'singapore university of technology and design'] },
    
    { name: 'University of Toronto', logo: '/images/logos/UofT.png', keywords: ['uoft', 'university of toronto', 'toronto'] },
    { name: 'McGill University', logo: '/images/logos/McGill.png', keywords: ['mcgill'] },
    { name: 'University of British Columbia (UBC)', logo: '/images/logos/UBC.png', keywords: ['ubc', 'british columbia'] },
    { name: 'McMaster University', logo: '/images/logos/McMaster.png', keywords: ['mcmaster'] },
    { name: 'University of Waterloo', logo: '/images/logos/Waterloo.png', keywords: ['waterloo'] },

    { name: 'Kyoto University', logo: '/images/logos/KyotoU.png', keywords: ['kyoto'] },
    { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png', keywords: ['tokyo', 'uoftokyo'] },
    { name: 'Osaka University', logo: '/images/logos/Osaka.png', keywords: ['osaka'] },
    { name: 'Tohoku University', logo: '/images/logos/Tohoku.png', keywords: ['tohoku'] },
    { name: 'Tokyo Institute of Technology', logo: '/images/logos/TokyoTech.png', keywords: ['tokyo institute of technology', 'tokyo tech'] },

    { name: 'Heidelberg University', logo: '/images/logos/HeidelbergU.png', keywords: ['heidelberg'] },
    { name: 'LMU Munich', logo: '/images/logos/LMU.png', keywords: ['lmu', 'ludwig-maximilians'] },
    { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png', keywords: ['tum', 'munich', 'münchen'] },
    { name: 'Freie Universität Berlin', logo: '/images/logos/FUBerlin.png', keywords: ['freie universität berlin', 'freie universitat berlin', 'fu berlin'] },
    { name: 'Karlsruhe Institute of Technology (KIT)', logo: '/images/logos/KIT.png', keywords: ['kit', 'karlsruhe institute'] },

    { name: 'Paris Sciences et Lettres University (PSL)', logo: '/images/logos/PSLU.png', keywords: ['psl', 'paris sciences', 'saclay'] },
    { name: 'Institut Polytechnique de Paris', logo: '/images/logos/InstitutPolytechniqueDeParis.png', keywords: ['polytechnique de paris', 'polytechnic institute of paris'] },
    { name: 'Sorbonne University', logo: '/images/logos/Sorbonne.png', keywords: ['sorbonne'] },
    { name: 'Université Paris-Saclay', logo: '/images/logos/ParisSaclay.png', keywords: ['paris-saclay', 'paris saclay'] },

    { name: 'Middle East Technical University (METU)', logo: '/images/logos/METU.png', keywords: ['metu', 'middle east technical'] },
    { name: 'Istanbul Technical University (ITU)', logo: '/images/logos/ITU.png', keywords: ['itu', 'istanbul technical'] },
    { name: 'Boğaziçi University', logo: '/images/logos/Bogazici.png', keywords: ['bogazici', 'boğaziçi'] },
    { name: 'Hacettepe University', logo: '/images/logos/Hacettepe.png', keywords: ['hacettepe'] },
    { name: 'Koç University', logo: '/images/logos/Koc.png', keywords: ['koc university', 'koç university'] },

    { name: 'University of Oxford', logo: '/images/logos/Oxford.png', keywords: ['oxford'] },
    { name: 'University of Cambridge', logo: '/images/logos/Cambridge.png', keywords: ['cambridge'] },
    { name: 'Imperial College London', logo: '/images/logos/ImperialCollegeLondon.png', keywords: ['imperial college', 'imperial college london'] },
    { name: 'University of Edinburgh', logo: '/images/logos/Edinburgh.png', keywords: ['edinburgh'] },
    { name: 'University College London (UCL)', logo: '/images/logos/UCL.png', keywords: ['ucl', 'university college london'] },

    { name: 'University of Melbourne', logo: '/images/logos/Melbourne.png', keywords: ['melbourne'] },
    { name: 'University of Sydney', logo: '/images/logos/Sydney.png', keywords: ['sydney'] },
    { name: 'Australian National University (ANU)', logo: '/images/logos/ANU.png', keywords: ['anu', 'australian national university'] },
    { name: 'Monash University', logo: '/images/logos/Monash_AUS.png', keywords: ['monash'] },
    { name: 'University of Queensland (UQ)', logo: '/images/logos/UQ.png', keywords: ['uq_aus', 'university of queensland'] },
    { name: 'UNSW Sydney', logo: '/images/logos/UNSW.png', keywords: ['unsw', 'new south wales'] },
    { name: 'Flinders University', logo: '/images/logos/Flinders.png', keywords: ['flinders'] },
    { name: 'Griffith University', logo: '/images/logos/Griffith.png', keywords: ['griffith'] },

    { name: 'Seoul National University (SNU)', logo: '/images/logos/SNU.png', keywords: ['snu', 'seoul national university'] },
    { name: 'KAIST', logo: '/images/logos/KAIST.png', keywords: ['kaist', 'korea advanced institute of science'] },
    { name: 'Yonsei University', logo: '/images/logos/Yonsei.png', keywords: ['yonsei'] },
    { name: 'Korea University', logo: '/images/logos/KoreaU.png', keywords: ['korea university'] },
    { name: 'Pohang University of Science and Technology (POSTECH)', logo: '/images/logos/POSTECH.png', keywords: ['postech', 'pohang university'] },

    // Netherlands Universities
    { name: 'TU Delft', logo: '/images/logos/TUDelft.png', keywords: ['tu delft', 'delft university'] },
    { name: 'Vrije Universiteit Amsterdam', logo: '/images/logos/VUAmsterdam.png', keywords: ['vrije universiteit amsterdam', 'vu amsterdam', 'vu fellowship'] },
    { name: 'University of Amsterdam', logo: '/images/logos/UniversityofAmsterdam.png', keywords: ['amsterdam', 'uva'] },
    { name: 'Leiden University', logo: '/images/logos/LeidenU.png', keywords: ['leiden'] },
    { name: 'University of Groningen', logo: '/images/logos/Groningen.png', keywords: ['groningen', 'rug'] },
    { name: 'Maastricht University', logo: '/images/logos/Maastricht.png', keywords: ['maastricht'] },
    { name: 'Radboud University', logo: '/images/logos/RadboudU.png', keywords: ['radboud'] },

    // South Korea (KOICA/GKS partners)
    { name: 'Sungkyunkwan University (SKKU)', logo: '/images/logos/SKKU.png', keywords: ['sungkyunkwan', 'skku'] },
    { name: 'KDI School of Public Policy and Management', logo: '/images/logos/KDI.png', keywords: ['kdi school', 'kdi'] },
    { name: 'Handong Global University', logo: '/images/logos/Handong.png', keywords: ['handong'] },
    { name: 'Incheon National University', logo: '/images/logos/Incheon.png', keywords: ['incheon'] },
    { name: 'Kyungpook National University', logo: '/images/logos/Kyungpook.png', keywords: ['kyungpook'] },
    { name: 'Pukyong National University', logo: '/images/logos/Pukyong.png', keywords: ['pukyong'] },
    { name: 'University of Seoul', logo: '/images/logos/Seoul.png', keywords: ['university of seoul'] },

    // Turkey & Others
    { name: 'Asian Institute of Technology (AIT)', logo: '/images/logos/AIT.png', keywords: ['ait', 'asian institute of technology'] },
    { name: 'Ankara University', logo: '/images/logos/AnkaraU.png', keywords: ['ankara university'] },
    { name: 'Ankara Hacı Bayram Veli University', logo: '/images/logos/AnkaraHaciBayramVeliU.png', keywords: ['bayram veli'] },
    { name: 'Ankara Music and Fine Arts University', logo: '/images/logos/AnkaraMusicandFineArtsU.png', keywords: ['music and fine arts'] },
    { name: 'ENS de Lyon', logo: '/images/logos/ENSdeLyon.png', keywords: ['ens de lyon', 'ens lyon'] },

    // SEARCA partner universities (Philippines, Malaysia, Indonesia)
    { name: 'University of the Philippines Los Baños (UPLB)', logo: '/images/logos/UPLB.png', keywords: ['uplb', 'los baños', 'los banos', 'university of the philippines los'] },
    { name: 'Universiti Putra Malaysia (UPM)', logo: '/images/logos/UPM.png', keywords: ['upm', 'universiti putra malaysia', 'putra malaysia'] },
    { name: 'Universitas Gadjah Mada (UGM)', logo: '/images/logos/UGM.png', keywords: ['ugm', 'gadjah mada', 'universitas gadjah'] },

    // Italy Universities
    { name: 'Politecnico di Milano', logo: '/images/logos/Polimi.png', keywords: ['polimi', 'politecnico di milano'] },
    { name: 'Sapienza Università di Roma', logo: '/images/logos/Sapienza.png', keywords: ['sapienza', 'sapienza università di roma', 'sapienza university of rome'] },
    
    // China Universities
    { name: 'Tsinghua University', logo: '/images/logos/Tsinghua.png', keywords: ['tsinghua'] },
    { name: 'Peking University', logo: '/images/logos/Peking.png', keywords: ['peking'] },
    { name: 'Zhejiang University', logo: '/images/logos/Zhejiang.png', keywords: ['zhejiang'] },

    // Hungary Universities
    { name: 'Eötvös Loránd University (ELTE)', logo: '/images/logos/ELTE.png', keywords: ['elte', 'eötvös', 'eotvos'] },
    { name: 'Semmelweis University', logo: '/images/logos/Semmelweis.png', keywords: ['semmelweis'] },
    { name: 'University of Szeged', logo: '/images/logos/Szeged.png', keywords: ['szeged'] },
    { name: 'University of Debrecen', logo: '/images/logos/Debrecen.png', keywords: ['debrecen'] },

    // Sweden Universities
    { name: 'KTH Royal Institute of Technology', logo: '/images/logos/KTH.png', keywords: ['kth', 'royal institute of technology'] },
    { name: 'Lund University', logo: '/images/logos/LundU.png', keywords: ['lund', 'lunds universitet'] },
    { name: 'Uppsala University', logo: '/images/logos/UppsalaU.png', keywords: ['uppsala', 'uppsala universitet'] },
    { name: 'Chalmers University of Technology', logo: '/images/logos/Chalmers.png', keywords: ['chalmers'] },
    { name: 'Stockholm University', logo: '/images/logos/StockholmU.png', keywords: ['stockholm university'] },
    { name: 'University of Gothenburg', logo: '/images/logos/GothenburgU.png', keywords: ['gothenburg'] },
    { name: 'Karolinska Institutet', logo: '/images/logos/Karolinska.png', keywords: ['karolinska'] },

    // Taiwan Universities
    { name: 'National Taiwan University (NTU)', logo: '/images/logos/NTU_Taiwan.png', keywords: ['ntu_tw', 'national taiwan university'] },
    { name: 'National Tsing Hua University (NTHU)', logo: '/images/logos/NTHU.png', keywords: ['nthu', 'national tsing hua university', 'tsing hua'] },
    { name: 'National Yang Ming Chiao Tung University (NYCU)', logo: '/images/logos/NYCU.png', keywords: ['nycu', 'national yang ming chiao tung university', 'chiao tung'] },

    // Swiss Universities
    { name: 'ETH Zurich', logo: '/images/logos/ETH.png', keywords: ['eth', 'eth zurich', 'eth zürich', 'eidgenössische technische hochschule'] },
    { name: 'EPFL', logo: '/images/logos/EPFL.png', keywords: ['epfl', 'école polytechnique fédérale de lausanne', 'polytechnique federale de lausanne'] },
    { name: 'University of Zurich', logo: '/images/logos/UZH.png', keywords: ['uzh', 'university of zurich', 'university of zürich', 'universität zürich'] },
    { name: 'University of Geneva', logo: '/images/logos/UNIGE.png', keywords: ['university of geneva', 'unige', 'université de genève'] },

    // Austrian Universities
    { name: 'TU Wien', logo: '/images/logos/TUWien.png', keywords: ['tu wien', 'vienna university of technology', 'technische universität wien'] },
    { name: 'University of Vienna', logo: '/images/logos/Vienna.png', keywords: ['university of vienna', 'universität wien', 'univie'] },
    { name: 'University of Innsbruck', logo: '/images/logos/Innsbruck.png', keywords: ['innsbruck', 'universität innsbruck'] },

    // Finnish Universities
    { name: 'University of Helsinki', logo: '/images/logos/Helsinki.png', keywords: ['university of helsinki', 'helsingin yliopisto'] },
    { name: 'Aalto University', logo: '/images/logos/Aalto.png', keywords: ['aalto', 'aalto-yliopisto', 'aalto university'] },
    { name: 'Tampere University', logo: '/images/logos/Tampere.png', keywords: ['tampere', 'tampere university'] },
    { name: 'University of Oulu', logo: '/images/logos/Oulu.png', keywords: ['oulu', 'university of oulu', 'oulun yliopisto'] },
    { name: 'Hanken School of Economics', logo: '/images/logos/Hanken.png', keywords: ['hanken', 'hanken school of economics'] },

    // New Zealand Universities
    { name: 'University of Auckland', logo: '/images/logos/Auckland.png', keywords: ['auckland', 'university of auckland'] },
    { name: 'University of Otago', logo: '/images/logos/Otago.png', keywords: ['otago', 'university of otago'] },
    { name: 'Victoria University of Wellington', logo: '/images/logos/VUW.png', keywords: ['vuw', 'victoria university of wellington', 'victoria university wellington'] },
    { name: 'Massey University', logo: '/images/logos/Massey.png', keywords: ['massey'] },

    // Ireland Universities
    { name: 'Trinity College Dublin', logo: '/images/logos/TCD.png', keywords: ['tcd', 'trinity college dublin', 'university of dublin'] },
    { name: 'University College Dublin (UCD)', logo: '/images/logos/UCD.png', keywords: ['ucd', 'university college dublin'] },
    { name: 'University College Cork (UCC)', logo: '/images/logos/UCC.png', keywords: ['ucc', 'university college cork'] },
    { name: 'Munster Technological University (MTU)', logo: '/images/logos/MTU.png', keywords: ['mtu', 'munster technological'] },
    { name: 'Maynooth University', logo: '/images/logos/Maynooth.png', keywords: ['maynooth'] },
    { name: 'Royal College of Surgeons in Ireland (RCSI)', logo: '/images/logos/RCSI.png', keywords: ['rcsi', 'royal college of surgeons'] },

    // Spain Universities
    { name: 'IE University', logo: '/images/logos/IE_University.png', keywords: ['ie university', 'ie business', 'ie'] },
    { name: 'Universidad de Girona (UdG)', logo: '/images/logos/UdG.png', keywords: ['girona', 'udg'] },

    // Poland Universities
    { name: 'University of Warsaw (UW)', logo: '/images/logos/UW.png', keywords: ['warsaw_uw', 'uw'] },
    { name: 'Warsaw University of Technology', logo: '/images/logos/Warsaw_Unitech.png', keywords: ['warsaw_unitech', 'warsaw university of technology', 'warsaw unitech'] },
    { name: 'Jagiellonian University (JU)', logo: '/images/logos/JU.png', keywords: ['jagiellonian', 'ju'] },

    // Denmark Universities
    { name: 'University of Copenhagen', logo: '/images/logos/Copenhagen.png', keywords: ['copenhagen', 'københavns universitet'] },
    { name: 'Technical University of Denmark (DTU)', logo: '/images/logos/DTU_Denmark.png', keywords: ['dtu_dk', 'technical university of denmark'] },
    { name: 'Aarhus University', logo: '/images/logos/Aarhus.png', keywords: ['aarhus'] },

    // Norway Universities
    { name: 'University of Oslo', logo: '/images/logos/Oslo.png', keywords: ['uio', 'university of oslo', 'oslo universitet'] },
    { name: 'University of Bergen', logo: '/images/logos/Bergen.png', keywords: ['uib', 'university of bergen', 'bergen universitet'] },
    { name: 'NTNU', logo: '/images/logos/NTNU.png', keywords: ['ntnu', 'norwegian university of science and technology', 'norges teknisk-naturvitenskapelige'] },

    // Hong Kong Universities
    { name: 'University of Hong Kong (HKU)', logo: '/images/logos/HKU.png', keywords: ['hku', 'university of hong kong'] },
    { name: 'The Chinese University of Hong Kong (CUHK)', logo: '/images/logos/CUHK.png', keywords: ['cuhk', 'chinese university of hong kong'] },
    { name: 'Hong Kong University of Science and Technology (HKUST)', logo: '/images/logos/HKUST.png', keywords: ['hkust', 'hong kong university of science and technology'] },

    // Malaysia Universities
    { name: 'University of Malaya (UM)', logo: '/images/logos/UM.png', keywords: ['um_my', 'university of malaya'] },
    { name: 'Universiti Putra Malaysia (UPM)', logo: '/images/logos/UPM.png', keywords: ['upm', 'universiti putra malaysia', 'putra malaysia'] },
    { name: 'Universiti Kebangsaan Malaysia (UKM)', logo: '/images/logos/UKM.png', keywords: ['ukm', 'universiti kebangsaan malaysia'] },

    // Norway Universities
    { name: 'BI Norwegian Business School', logo: '/images/logos/BI_Norwegian.png', keywords: ['bi norwegian', 'bi norwegian business school', 'bi business school'] },

    // France Universities
    { name: 'Sciences Po Paris', logo: '/images/logos/SciencesPo.png', keywords: ['sciences po', 'sciences po paris', 'émile boutmy', 'emile boutmy'] },

    // Belgium Universities
    { name: 'KU Leuven', logo: '/images/logos/KULeuven.png', keywords: ['ku leuven', 'k.u. leuven', 'katholieke universiteit leuven', 'science@leuven', 'global minds'] },
    { name: 'Ghent University', logo: '/images/logos/GhentU.png', keywords: ['ghent', 'gent university', 'universiteit gent'] },
    { name: 'Vrije Universiteit Brussel (VUB)', logo: '/images/logos/VUB.png', keywords: ['vub', 'vrije universiteit brussel'] },
    { name: 'Université catholique de Louvain (UCLouvain)', logo: '/images/logos/Bologna.png', keywords: ['uclouvain', 'louvain', 'catholique de louvain'] },
    { name: 'University of Antwerp', logo: '/images/logos/Bologna.png', keywords: ['antwerp', 'universiteit antwerpen'] },
    { name: 'Hasselt University', logo: '/images/logos/Bologna.png', keywords: ['hasselt', 'universiteit hasselt'] },

    // Romania Universities
    { name: 'University of Bucharest', logo: '/images/logos/Bucharest.png', keywords: ['unibuc', 'university of bucharest', 'bucharest university'] },
    { name: 'Babeș-Bolyai University', logo: '/images/logos/UBB.png', keywords: ['ubb', 'babes-bolyai', 'babeș-bolyai', 'babes bolyai'] },
    { name: 'Transilvania University of Brașov', logo: '/images/logos/Transilvania.png', keywords: ['transilvania university', 'transilvania academica', 'brasov', 'brașov', 'unitbv'] },
    { name: 'West University of Timișoara', logo: '/images/logos/WUT.png', keywords: ['west university of timi', 'timisoara', 'timișoara', 'wut', 'uvt'] },

    // Russia Universities
    { name: 'Lomonosov Moscow State University', logo: '/images/logos/MSU.png', keywords: ['moscow state university', 'lomonosov', 'msu'] },
    { name: 'Saint Petersburg State University', logo: '/images/logos/SPbU.png', keywords: ['saint petersburg state', 'spbu', 'spbsu'] },
    { name: 'HSE University', logo: '/images/logos/HSE.png', keywords: ['hse', 'higher school of economics'] },
    { name: 'Bauman Moscow State Technical University', logo: '/images/logos/BMSTU.png', keywords: ['bauman moscow', 'bmstu', 'bauman state'] },
    { name: 'Moscow State Institute of International Relations (MGIMO)', logo: '/images/logos/MGIMO.png', keywords: ['mgimo'] },
    { name: 'NUST MISIS', logo: '/images/logos/MISIS.png', keywords: ['nust misis', 'misis'] },

    // Qatar Universities
    { name: 'Qatar University (QU)', logo: '/images/logos/QU.png', keywords: ['qatar university', 'qu'] },
    { name: 'Hamad Bin Khalifa University (HBKU)', logo: '/images/logos/HBKU.svg', keywords: ['hamad bin khalifa', 'hbku'] },
    { name: 'Doha Institute for Graduate Studies', logo: '/images/logos/DohaInstitute.svg', keywords: ['doha institute'] },

    // Saudi Arabia Universities
    { name: 'King Saud University (KSU)', logo: '/images/logos/KSU.png', keywords: ['king saud', 'ksu'] },
    { name: 'King Abdulaziz University (KAU)', logo: '/images/logos/KAU.png', keywords: ['king abdulaziz', 'kau'] },
    { name: 'King Fahd University of Petroleum & Minerals (KFUPM)', logo: '/images/logos/KFUPM.png', keywords: ['king fahd', 'kfupm', 'petroleum and minerals'] },
    { name: 'KAUST', logo: '/images/logos/KAUST.png', keywords: ['kaust', 'king abdullah'] },
    { name: 'Umm Al-Qura University', logo: '/images/logos/UQU.png', keywords: ['umm al-qura', 'uqu'] },
    { name: 'Islamic University of Madinah', logo: '/images/logos/IUMadinah.png', keywords: ['islamic university of madinah', 'madinah'] },
  ];

  universities.forEach((univ) => {
    const matched = univ.keywords.some((kw) => {
      if (kw === 'itu') {
        return s.country === 'Turkey' && (
          text.includes('itu ') || text.includes('itu/') || text.includes('itu,') || text.includes(' itu')
        );
      }
      if (kw === 'ntu_sg') {
        const regex = new RegExp(`\\bntu\\b`, 'i');
        return s.country === 'Singapore' && regex.test(text);
      }
      if (kw === 'ntu_tw') {
        const regex = new RegExp(`\\bntu\\b`, 'i');
        return s.country === 'Taiwan' && regex.test(text);
      }
      if (kw === 'dtu_dk') {
        const regex = new RegExp(`\\bdtu\\b`, 'i');
        return s.country === 'Denmark' && regex.test(text);
      }
      if (kw === 'um_my') {
        const regex = new RegExp(`\\bum\\b`, 'i');
        return s.country === 'Malaysia' && regex.test(text);
      }
      if (kw === 'uq_aus') {
        const regex = new RegExp(`\\buq\\b`, 'i');
        return s.country === 'Australia' && regex.test(text);
      }
      if (kw === 'warsaw_uw') {
        const regex = new RegExp(`\\buniversity of warsaw\\b|\\bwarsaw university\\b`, 'i');
        if (regex.test(text)) return true;
        if (text.includes('warsaw') && !text.includes('technology') && !text.includes('unitech')) return true;
        return false;
      }
      if (kw === 'warsaw_unitech') {
        const regex = new RegExp(`\\bwarsaw university of technology\\b|\\bwarsaw unitech\\b`, 'i');
        return regex.test(text);
      }
      if (['nus', 'lmu', 'ubc', 'tum', 'psl', 'anu', 'unsw', 'snu', 'kaist', 'postech', 'kit', 'smu', 'sutd', 'ucl', 'skku', 'kdi', 'ait', 'uva', 'rug', 'polimi', 'kth', 'nthu', 'nycu', 'eth', 'epfl', 'uzh', 'vuw', 'tcd', 'ucd', 'ucc', 'copenhagen', 'aarhus', 'uio', 'uib', 'ntnu', 'hku', 'cuhk', 'hkust', 'ukm', 'debrecen', 'massey', 'mtu', 'maynooth', 'rcsi', 'ie', 'udg', 'uw', 'ju', 'ncn', 'nawa', 'unibuc', 'ubb', 'unitbv', 'wut', 'uvt', 'msu', 'spbu', 'spbsu', 'hse', 'bmstu', 'mgimo', 'misis'].includes(kw)) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        return regex.test(text);
      }
      return text.includes(kw);
    });

    if (matched) {
      list.push({ name: univ.name, logo: univ.logo });
    }
  });

  // 2. Only show group fallback logos for umbrella/national scholarships
  // that do NOT mention specific partner institutions in their description.
  // If the scholarship text already names specific partner unis (e.g. "UPLB, UPM, UGM"),
  // return empty so the section doesn't show misleading logos.
  if (list.length === 0) {
    const country = s.country ? s.country.toLowerCase() : '';
    const group = providerGroup(s.provider);

    if (group === 'germany') {
      list.push(
        { name: 'Heidelberg University', logo: '/images/logos/HeidelbergU.png' },
        { name: 'LMU Munich', logo: '/images/logos/LMU.png' },
        { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png' },
        { name: 'Freie Universität Berlin', logo: '/images/logos/FUBerlin.png' },
        { name: 'Karlsruhe Institute of Technology (KIT)', logo: '/images/logos/KIT.png' }
      );
    } else if (group === 'japan') {
      list.push(
        { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png' },
        { name: 'Kyoto University', logo: '/images/logos/KyotoU.png' },
        { name: 'Osaka University', logo: '/images/logos/Osaka.png' },
        { name: 'Tohoku University', logo: '/images/logos/Tohoku.png' },
        { name: 'Tokyo Institute of Technology', logo: '/images/logos/TokyoTech.png' }
      );
    } else if (group === 'turkey') {
      list.push(
        { name: 'Istanbul Technical University (ITU)', logo: '/images/logos/ITU.png' },
        { name: 'Middle East Technical University (METU)', logo: '/images/logos/METU.png' },
        { name: 'Boğaziçi University', logo: '/images/logos/Bogazici.png' },
        { name: 'Hacettepe University', logo: '/images/logos/Hacettepe.png' },
        { name: 'Koç University', logo: '/images/logos/Koc.png' }
      );
    } else if (group === 'canada') {
      list.push(
        { name: 'University of Toronto', logo: '/images/logos/UofT.png' },
        { name: 'McGill University', logo: '/images/logos/McGill.png' },
        { name: 'University of British Columbia (UBC)', logo: '/images/logos/UBC.png' },
        { name: 'McMaster University', logo: '/images/logos/McMaster.png' },
        { name: 'University of Waterloo', logo: '/images/logos/Waterloo.png' }
      );
    } else if (group === 'france') {
      list.push(
        { name: 'Institut Polytechnique de Paris', logo: '/images/logos/InstitutPolytechniqueDeParis.png' },
        { name: 'Paris Sciences et Lettres University (PSL)', logo: '/images/logos/PSLU.png' },
        { name: 'Sorbonne University', logo: '/images/logos/Sorbonne.png' },
        { name: 'Université Paris-Saclay', logo: '/images/logos/ParisSaclay.png' }
      );
    } else if (group === 'singapore') {
      list.push(
        { name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png' },
        { name: 'Nanyang Technological University (NTU)', logo: '/images/logos/NTU.png' },
        { name: 'Singapore Management University (SMU)', logo: '/images/logos/SMU.png' },
        { name: 'Singapore University of Technology and Design (SUTD)', logo: '/images/logos/SUTD.png' }
      );
    } else if (group === 'united-kingdom') {
      list.push(
        { name: 'University of Oxford', logo: '/images/logos/Oxford.png' },
        { name: 'University of Cambridge', logo: '/images/logos/Cambridge.png' },
        { name: 'Imperial College London', logo: '/images/logos/ImperialCollegeLondon.png' },
        { name: 'University of Edinburgh', logo: '/images/logos/Edinburgh.png' },
        { name: 'University College London (UCL)', logo: '/images/logos/UCL.png' }
      );
    } else if (group === 'australia') {
      list.push(
        { name: 'University of Melbourne', logo: '/images/logos/Melbourne.png' },
        { name: 'University of Sydney', logo: '/images/logos/Sydney.png' },
        { name: 'Australian National University (ANU)', logo: '/images/logos/ANU.png' },
        { name: 'Monash University', logo: '/images/logos/Monash_AUS.png' },
        { name: 'University of Queensland (UQ)', logo: '/images/logos/UQ.png' },
        { name: 'UNSW Sydney', logo: '/images/logos/UNSW.png' },
        { name: 'Flinders University', logo: '/images/logos/Flinders.png' },
        { name: 'Griffith University', logo: '/images/logos/Griffith.png' }
      );
    } else if (country === 'south korea' || group === 'south-korea') {
      list.push(
        { name: 'Seoul National University (SNU)', logo: '/images/logos/SNU.png' },
        { name: 'KAIST', logo: '/images/logos/KAIST.png' },
        { name: 'Yonsei University', logo: '/images/logos/Yonsei.png' },
        { name: 'Korea University', logo: '/images/logos/KoreaU.png' },
        { name: 'Pohang University of Science and Technology (POSTECH)', logo: '/images/logos/POSTECH.png' }
      );
    } else if (group === 'netherlands') {
      list.push(
        { name: 'TU Delft', logo: '/images/logos/TUDelft.png' },
        { name: 'University of Amsterdam', logo: '/images/logos/UniversityofAmsterdam.png' },
        { name: 'Leiden University', logo: '/images/logos/LeidenU.png' },
        { name: 'University of Groningen', logo: '/images/logos/Groningen.png' },
        { name: 'Maastricht University', logo: '/images/logos/Maastricht.png' }
      );
    } else if (group === 'united-states') {
      list.push(
        { name: 'Harvard University', logo: '/images/logos/Harvard.png' },
        { name: 'Columbia University', logo: '/images/logos/ColumbiaU.png' },
        { name: 'Stanford University', logo: '/images/logos/Stanford.png' }
      );
    } else if (group === 'belgium') {
      list.push(
        { name: 'KU Leuven', logo: '/images/logos/KULeuven.png' },
        { name: 'Ghent University', logo: '/images/logos/GhentU.png' },
        { name: 'Vrije Universiteit Brussel (VUB)', logo: '/images/logos/VUB.png' }
      );
    } else if (group === 'eu') {
      list.push(
        { name: 'University of Bologna', logo: '/images/logos/Bologna.png' },
        { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png' },
        { name: 'KU Leuven', logo: '/images/logos/KULeuven.png' }
      );
    } else if (group === 'italy') {
      list.push(
        { name: 'Politecnico di Milano', logo: '/images/logos/Polimi.png' },
        { name: 'Sapienza Università di Roma', logo: '/images/logos/Sapienza.png' },
        { name: 'University of Bologna', logo: '/images/logos/Bologna.png' }
      );
    } else if (group === 'sweden') {
      list.push(
        { name: 'Lund University', logo: '/images/logos/LundU.png' },
        { name: 'KTH Royal Institute of Technology', logo: '/images/logos/KTH.png' },
        { name: 'Uppsala University', logo: '/images/logos/UppsalaU.png' },
        { name: 'Chalmers University of Technology', logo: '/images/logos/Chalmers.png' },
        { name: 'Stockholm University', logo: '/images/logos/StockholmU.png' },
        { name: 'University of Gothenburg', logo: '/images/logos/GothenburgU.png' },
        { name: 'Karolinska Institutet', logo: '/images/logos/Karolinska.png' }
      );
    } else if (group === 'china') {
      list.push(
        { name: 'Tsinghua University', logo: '/images/logos/Tsinghua.png' },
        { name: 'Peking University', logo: '/images/logos/Peking.png' },
        { name: 'Zhejiang University', logo: '/images/logos/Zhejiang.png' }
      );
    } else if (country === 'hungary' || group === 'hungary') {
      list.push(
        { name: 'Eötvös Loránd University (ELTE)', logo: '/images/logos/ELTE.png' },
        { name: 'Semmelweis University', logo: '/images/logos/Semmelweis.png' },
        { name: 'University of Szeged', logo: '/images/logos/Szeged.png' },
        { name: 'University of Debrecen', logo: '/images/logos/Debrecen.png' }
      );
    } else if (group === 'taiwan') {
      list.push(
        { name: 'National Taiwan University (NTU)', logo: '/images/logos/NTU_Taiwan.png' },
        { name: 'National Tsing Hua University (NTHU)', logo: '/images/logos/NTHU.png' },
        { name: 'National Yang Ming Chiao Tung University (NYCU)', logo: '/images/logos/NYCU.png' }
      );
    } else if (group === 'switzerland') {
      list.push(
        { name: 'ETH Zurich', logo: '/images/logos/ETH.png' },
        { name: 'EPFL', logo: '/images/logos/EPFL.png' },
        { name: 'University of Zurich', logo: '/images/logos/UZH.png' },
        { name: 'University of Geneva', logo: '/images/logos/UNIGE.png' }
      );
    } else if (group === 'austria') {
      list.push(
        { name: 'TU Wien', logo: '/images/logos/TUWien.png' },
        { name: 'University of Vienna', logo: '/images/logos/Vienna.png' },
        { name: 'University of Innsbruck', logo: '/images/logos/Innsbruck.png' }
      );
    } else if (group === 'finland') {
      list.push(
        { name: 'University of Helsinki', logo: '/images/logos/Helsinki.png' },
        { name: 'Aalto University', logo: '/images/logos/Aalto.png' },
        { name: 'Tampere University', logo: '/images/logos/Tampere.png' },
        { name: 'University of Oulu', logo: '/images/logos/Oulu.png' },
        { name: 'Hanken School of Economics', logo: '/images/logos/Hanken.png' }
      );
    } else if (group === 'new-zealand') {
      list.push(
        { name: 'University of Auckland', logo: '/images/logos/Auckland.png' },
        { name: 'University of Otago', logo: '/images/logos/Otago.png' },
        { name: 'Victoria University of Wellington', logo: '/images/logos/VUW.png' },
        { name: 'Massey University', logo: '/images/logos/Massey.png' }
      );
    } else if (group === 'ireland') {
      list.push(
        { name: 'Trinity College Dublin', logo: '/images/logos/TCD.png' },
        { name: 'University College Dublin (UCD)', logo: '/images/logos/UCD.png' },
        { name: 'University College Cork (UCC)', logo: '/images/logos/UCC.png' },
        { name: 'Munster Technological University (MTU)', logo: '/images/logos/MTU.png' },
        { name: 'Maynooth University', logo: '/images/logos/Maynooth.png' },
        { name: 'Royal College of Surgeons in Ireland (RCSI)', logo: '/images/logos/RCSI.png' }
      );
    } else if (group === 'denmark') {
      list.push(
        { name: 'University of Copenhagen', logo: '/images/logos/Copenhagen.png' },
        { name: 'Technical University of Denmark (DTU)', logo: '/images/logos/DTU_Denmark.png' },
        { name: 'Aarhus University', logo: '/images/logos/Aarhus.png' }
      );
    } else if (group === 'norway') {
      list.push(
        { name: 'University of Oslo', logo: '/images/logos/Oslo.png' },
        { name: 'University of Bergen', logo: '/images/logos/Bergen.png' },
        { name: 'NTNU', logo: '/images/logos/NTNU.png' }
      );
    } else if (group === 'hong-kong') {
      list.push(
        { name: 'University of Hong Kong (HKU)', logo: '/images/logos/HKU.png' },
        { name: 'Hong Kong University of Science and Technology (HKUST)', logo: '/images/logos/HKUST.png' },
        { name: 'The Chinese University of Hong Kong (CUHK)', logo: '/images/logos/CUHK.png' }
      );
    } else if (group === 'malaysia') {
      list.push(
        { name: 'University of Malaya (UM)', logo: '/images/logos/UM.png' },
        { name: 'Universiti Putra Malaysia (UPM)', logo: '/images/logos/UPM.png' },
        { name: 'Universiti Kebangsaan Malaysia (UKM)', logo: '/images/logos/UKM.png' }
      );
    } else if (group === 'spain') {
      list.push(
        { name: 'IE University', logo: '/images/logos/IE_University.png' },
        { name: 'Universidad de Girona (UdG)', logo: '/images/logos/UdG.png' }
      );
    } else if (group === 'poland') {
      list.push(
        { name: 'University of Warsaw (UW)', logo: '/images/logos/UW.png' },
        { name: 'Warsaw University of Technology', logo: '/images/logos/Warsaw_Unitech.png' },
        { name: 'Jagiellonian University (JU)', logo: '/images/logos/JU.png' }
      );
    } else if (group === 'romania') {
      list.push(
        { name: 'University of Bucharest', logo: '/images/logos/Bucharest.png' },
        { name: 'Babeș-Bolyai University', logo: '/images/logos/UBB.png' },
        { name: 'Transilvania University of Brașov', logo: '/images/logos/Transilvania.png' },
        { name: 'West University of Timișoara', logo: '/images/logos/WUT.png' }
      );
    } else if (group === 'russia') {
      list.push(
        { name: 'Lomonosov Moscow State University', logo: '/images/logos/MSU.png' },
        { name: 'Saint Petersburg State University', logo: '/images/logos/SPbU.png' },
        { name: 'HSE University', logo: '/images/logos/HSE.png' },
        { name: 'Bauman Moscow State Technical University', logo: '/images/logos/BMSTU.png' },
        { name: 'MGIMO University', logo: '/images/logos/MGIMO.png' },
        { name: 'NUST MISIS', logo: '/images/logos/MISIS.png' }
      );
    } else if (group === 'saudi-arabia') {
      list.push(
        { name: 'King Saud University (KSU)', logo: '/images/logos/KSU.png' },
        { name: 'King Abdulaziz University (KAU)', logo: '/images/logos/KAU.png' },
        { name: 'King Fahd University of Petroleum & Minerals (KFUPM)', logo: '/images/logos/KFUPM.png' },
        { name: 'KAUST', logo: '/images/logos/KAUST.png' },
        { name: 'Umm Al-Qura University', logo: '/images/logos/UQU.png' },
        { name: 'Islamic University of Madinah', logo: '/images/logos/IUMadinah.png' }
      );
    } else if (group === 'qatar') {
      list.push(
        { name: 'Qatar University (QU)', logo: '/images/logos/QU.png' },
        { name: 'Hamad Bin Khalifa University (HBKU)', logo: '/images/logos/HBKU.png' },
        { name: 'Doha Institute for Graduate Studies', logo: '/images/logos/DohaInstitute.png' }
      );
    }
  }

  return Array.from(new Map(list.map((item) => [item.logo, item])).values()).map(item => ({
    ...item,
    logo: optimizeImagePath(item.logo) ?? item.logo
  }));
}


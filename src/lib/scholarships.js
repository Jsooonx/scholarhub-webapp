"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerMeta = exports.allScholarships = void 0;
exports.toSlug = toSlug;
exports.providerGroup = providerGroup;
exports.getScholarshipBySlug = getScholarshipBySlug;
exports.getScholarshipsByProvider = getScholarshipsByProvider;
exports.getAllSlugs = getAllSlugs;
exports.filterScholarships = filterScholarships;
exports.getDeadlineStatus = getDeadlineStatus;
exports.cleanDescription = cleanDescription;
exports.getScholarshipLogo = getScholarshipLogo;
exports.getScholarshipImage = getScholarshipImage;
exports.getMatchedUniversityLogos = getMatchedUniversityLogos;
const scholarships_json_1 = __importDefault(require("../../data/scholarships.json"));
// ── Slug helpers ───────────────────────────────────────────────────────────
function toSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // strip special chars
        .trim()
        .replace(/\s+/g, '-') // spaces → hyphens
        .replace(/-+/g, '-') // collapse multiple hyphens
        .slice(0, 80); // cap length
}
/** Normalise provider string to a group slug */
function providerGroup(provider) {
    const p = provider.toLowerCase();
    if (p.includes('daad') || p.includes('dlr'))
        return 'daad';
    if (p.includes('mext') || p.includes('monbukagakusho'))
        return 'mext';
    if (p.includes('turkiye') || p.includes('ytb') || p.includes('burslari'))
        return 'turkiye';
    if (p.includes('chevening'))
        return 'chevening';
    if (p.includes('australia awards') || p.includes('dfat') || p.includes('lpdp'))
        return 'australia-awards';
    if (p.includes('niied') || p.includes('korean government') || p.includes('gks'))
        return 'gks';
    if (p.includes('a*star') || p.includes('astar') || p.includes('nus') || p.includes('ntu') || p.includes('singa') || p.includes('nanyang') || p.includes('national university of singapore'))
        return 'singapore';
    if (p.includes('eiffel') || p.includes('campus france') || p.includes('french ministry'))
        return 'eiffel';
    if (p.includes('paris-saclay') || p.includes('paris saclay') || p.includes('sciences po') || p.includes('ens de lyon') || p.includes('ens lyon'))
        return 'eiffel';
    // cpra must come BEFORE canada — provider string contains 'cihr'/'nserc'/'sshrc' which also match canada
    if (p.includes('cpra') || p.includes('postdoctoral research award') || (p.includes('government of canada') && (p.includes('cihr') || p.includes('nserc') || p.includes('sshrc'))))
        return 'cpra';
    if (p.includes('canada') || p.includes('cihr') || p.includes('nserc') || p.includes('sshrc') || p.includes('crtas') || p.includes('cgrs') || p.includes('university of toronto'))
        return 'canada';
    if (p.includes('jasso') || p.includes('japan student services'))
        return 'jasso';
    if (p.includes('koica') || p.includes('korea international cooperation'))
        return 'koica';
    if (p.includes('studienstiftung') || p.includes('german academic scholarship foundation'))
        return 'studienstiftung';
    if (p.includes('nuffic') || p.includes('dutch ministry') || p.includes('justus') || p.includes('van effen') || p.includes('university of groningen') || p.includes('university of amsterdam') || p.includes('leiden university') || p.includes('maastricht university') || p.includes('radboud university') || p.includes('tu delft') || p.includes('delft university'))
        return 'netherlands';
    if (p.includes('gates cambridge'))
        return 'gates-cambridge';
    if (p.includes('clarendon') || p.includes('oxford university press'))
        return 'clarendon';
    if (p.includes('rhodes trust') || p.includes('rhodes house'))
        return 'rhodes';
    if (p.includes('fulbright') || p.includes('aminef'))
        return 'fulbright';
    if (p.includes('vlir') || p.includes('vliruos') || p.includes('belgian government') || p.includes('icp connect'))
        return 'belgium-vlir';
    if (p.includes('erasmus mundus') || p.includes('erasmus+') || p.includes('european commission'))
        return 'erasmus-mundus';
    if (p.includes('swedish institute') || p.includes('svenska institutet'))
        return 'sweden';
    if (p.includes('maeci') || p.includes('italian government') || p.includes('ministry of foreign affairs and international cooperation') || p.includes('invest your talent'))
        return 'italy';
    if (p.includes('china scholarship council') || p.includes('csc') && p.includes('chinese') || p.includes('mofcom') || p.includes('ministry of commerce') && p.includes('china'))
        return 'china-csc';
    if (p.includes('stipendium hungaricum') || p.includes('tempus public foundation') || (p.includes('hungarian') && p.includes('government')))
        return 'hungary';
    if (p.includes('taiwan') || p.includes('teco') || p.includes('icdf') || p.includes('huayu') || p.includes('ministry of education') && p.includes('taiwan'))
        return 'taiwan';
    if (p.includes('swiss government') || p.includes('sbfi') || p.includes('seri') || p.includes('swiss confederation'))
        return 'switzerland';
    if (p.includes('manaaki') || p.includes('education new zealand') || p.includes('mfat') || p.includes('new zealand'))
        return 'new-zealand';
    if (p.includes('eiffel'))
        return 'eiffel';
    if (p.includes('singa'))
        return 'singa';
    if (p.includes('vanier'))
        return 'vanier';
    // Fallback: slugify provider name
    return p.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
// ── Build the enriched list once ──────────────────────────────────────────
const rawList = scholarships_json_1.default.scholarships;
// Deduplicate slugs by appending an index if necessary
const seenSlugs = new Map();
exports.allScholarships = rawList.map((s) => {
    const base = toSlug(s.name);
    const count = seenSlugs.get(base) ?? 0;
    seenSlugs.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count}`;
    return { ...s, slug };
});
// ── Accessors ──────────────────────────────────────────────────────────────
function getScholarshipBySlug(slug) {
    return exports.allScholarships.find((s) => s.slug === slug);
}
function getScholarshipsByProvider(group) {
    return exports.allScholarships.filter((s) => providerGroup(s.provider) === group.toLowerCase());
}
function getAllSlugs() {
    return exports.allScholarships.map((s) => s.slug);
}
function filterScholarships(params) {
    let list = exports.allScholarships;
    if (params.query) {
        const q = params.query.toLowerCase();
        list = list.filter((s) => s.name.toLowerCase().includes(q) ||
            (s.description ?? '').toLowerCase().includes(q) ||
            s.fields.some((f) => f.toLowerCase().includes(q)));
    }
    if (params.provider && params.provider !== 'all') {
        list = list.filter((s) => providerGroup(s.provider) === params.provider);
    }
    if (params.funding && params.funding !== 'all') {
        list = list.filter((s) => s.funding_type.toLowerCase().includes(params.funding.toLowerCase()));
    }
    if (params.level && params.level !== 'all') {
        list = list.filter((s) => s.degree_levels.some((d) => d.toLowerCase().includes(params.level.toLowerCase())));
    }
    if (params.country && params.country !== 'all') {
        list = list.filter((s) => s.country?.toLowerCase() === params.country.toLowerCase());
    }
    return list;
}
/**
 * Extracts the first parseable ISO-like date string from an array of
 * messy strings such as MEXT's important_dates format.
 */
function extractDate(strings) {
    const joined = strings.join(' ');
    // Try ISO-ish formats: "10 Mei 2026", "10 May 2026", "February 20, 2026"
    const MONTHS_ID = {
        januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
        juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
    };
    const MONTHS_EN = {
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
        if (month !== undefined)
            return new Date(year, month, day);
    }
    // Pattern: "February 20, 2026"
    const enMatch = joined.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(20\d{2})/);
    if (enMatch) {
        const rawMonth = enMatch[1].toLowerCase();
        const day = parseInt(enMatch[2]);
        const year = parseInt(enMatch[3]);
        const month = MONTHS_EN[rawMonth];
        if (month !== undefined)
            return new Date(year, month, day);
    }
    return null;
}
/**
 * Türkiye Burslari general application window: Jan 10 – Feb 20 annually.
 * Returns a synthetic deadline for the nearest upcoming or past cycle.
 */
function getTurkiyeDeadline() {
    const now = new Date();
    const year = now.getFullYear();
    const deadline = new Date(year, 1, 20); // Feb 20
    // If already past this year's deadline, point to next year
    if (now > deadline)
        return new Date(year + 1, 1, 20);
    return deadline;
}
/**
 * DAAD deadlines vary widely per program and intake - treated as rolling.
 * Some programs have known annual application windows (Oct–Nov typically).
 * We surface this as "Rolling intake - check official site".
 */
function getDaadStatus() {
    return { type: 'rolling', label: 'Rolling intake' };
}
function getDeadlineStatus(s) {
    const now = new Date();
    const group = providerGroup(s.provider);
    // ── MEXT, Eiffel, SINGA, Vanier: parse from important_dates or deadline field ──────────────────
    if (group === 'mext' || group === 'eiffel' || group === 'singa' || group === 'vanier') {
        const sources = [];
        if (s.important_dates)
            sources.push(...s.important_dates);
        if (s.deadline)
            sources.push(s.deadline);
        if (s.application_period)
            sources.push(...s.application_period);
        const deadline = extractDate(sources);
        if (deadline) {
            const diff = Math.ceil((deadline.getTime() - now.getTime()) / 86400000);
            const fmt = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (diff < 0)
                return { type: 'closed', label: `Closed · ${fmt}`, deadline };
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline };
            return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline };
        }
        // MEXT without parseable date
        return { type: 'check', label: 'Check official site' };
    }
    // ── Türkiye: known annual window Jan 10–Feb 20 ───────────────────────────
    if (group === 'turkiye') {
        const deadline = getTurkiyeDeadline();
        const openDate = new Date(deadline.getFullYear(), 0, 10); // Jan 10
        const diff = Math.ceil((deadline.getTime() - now.getTime()) / 86400000);
        const fmt = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (now >= openDate && now <= deadline) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline };
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
        const open = new Date(year, 7, 5); // Aug 5
        const close = new Date(year, 9, 7); // Oct 7
        const nextClose = new Date(year + 1, 9, 7);
        const diff = Math.ceil((close.getTime() - now2.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (now2 >= open && now2 <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
        }
        if (now2 > close)
            return { type: 'closed', label: `Closed · next cycle ~Aug ${year + 1}`, deadline: nextClose };
        return { type: 'open', label: `Opens 5 Aug · closes ${fmt}`, daysLeft: diff, deadline: close };
    }
    // ── Australia Awards: annual window closes ~30 April ─────────────────────
    if (group === 'australia-awards') {
        const now3 = new Date();
        const year3 = now3.getFullYear();
        const close = new Date(year3, 3, 30); // April 30
        const open = new Date(year3, 0, 1); // Jan 1 approx
        const diff = Math.ceil((close.getTime() - now3.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (now3 >= open && now3 <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
        }
        if (now3 > close)
            return { type: 'closed', label: `Closed · next cycle ~Jan ${year3 + 1}`, deadline: new Date(year3 + 1, 3, 30) };
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
            const diff = Math.ceil((close.getTime() - now4.getTime()) / 86400000);
            const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (now4 >= new Date(year4, 1, 1) && now4 <= close) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
                return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
            }
            if (now4 > close)
                return { type: 'closed', label: `Closed · next cycle Feb ${year4 + 1}`, deadline: new Date(year4 + 1, 2, 31) };
            return { type: 'open', label: `Opens Feb · closes ${fmt}`, daysLeft: diff, deadline: close };
        }
        else {
            const close = new Date(year4, 9, 15); // Oct 15
            const diff = Math.ceil((close.getTime() - now4.getTime()) / 86400000);
            const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (now4 >= new Date(year4, 8, 1) && now4 <= close) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
                return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
            }
            if (now4 > close)
                return { type: 'closed', label: `Closed · next cycle Sep ${year4 + 1}`, deadline: new Date(year4 + 1, 9, 15) };
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
            const diff = Math.ceil((close.getTime() - now5.getTime()) / 86400000);
            const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (now5 >= new Date(year5, 9, 1) || now5 <= close) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
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
            const diff = Math.ceil((close.getTime() - now6.getTime()) / 86400000);
            const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (now6 <= close) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
                return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: close };
            }
            return { type: 'closed', label: `Closed · next cycle ~Jan ${year6 + 1}`, deadline: new Date(year6 + 1, 0, 1) };
        }
        // Sciences Po Boutmy / ENS Lyon Ampère: rolling admissions-based
        if (s.provider.toLowerCase().includes('sciences po') || s.provider.toLowerCase().includes('ens de lyon') || s.provider.toLowerCase().includes('ens lyon')) {
            return { type: 'rolling', label: 'Via admissions process' };
        }
        // Core Eiffel: Oct 1 – Jan 8
        const open = new Date(year6, 9, 1); // Oct 1
        const close = new Date(year6, 0, 8) > now6
            ? new Date(year6, 0, 8) // Jan 8 this year
            : new Date(year6 + 1, 0, 8); // Jan 8 next year
        const diff = Math.ceil((close.getTime() - now6.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (now6 >= open || now6 <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
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
            const diff = Math.ceil((close.getTime() - now7.getTime()) / 86400000);
            const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (now7 <= close) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
                return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
            }
            return { type: 'closed', label: `Closed · next cycle ~Jul ${year7 + 1}`, deadline: new Date(year7 + 1, 6, 1) };
        }
        // CGRS-D and Impact+: agency deadline Oct 17
        const close = new Date(year7, 9, 17); // Oct 17
        const diff = Math.ceil((close.getTime() - now7.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (now7 <= close) {
            if (diff <= 30)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · agency deadline ${fmt}`, daysLeft: diff, deadline: close };
        }
        return { type: 'closed', label: `Closed · next cycle ~Oct ${year7 + 1}`, deadline: new Date(year7 + 1, 9, 17) };
    }
    // ── DAAD: rolling ────────────────────────────────────────────────────────
    // ── JASSO: rolling (applied through school, no fixed public deadline) ────
    if (group === 'jasso')
        return { type: 'rolling', label: 'Via enrolled university' };
    // ── KOICA: annual, ~July deadline ────────────────────────────────────────
    if (group === 'koica') {
        const nowK = new Date();
        const yearK = nowK.getFullYear();
        const close = new Date(yearK, 6, 31); // July 31 approx
        const diff = Math.ceil((close.getTime() - nowK.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowK <= close) {
            if (diff <= 30)
                return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: close };
        }
        return { type: 'closed', label: `Closed · next cycle ~${yearK + 1}`, deadline: new Date(yearK + 1, 6, 31) };
    }
    // ── CPRA: agency deadlines Sep 11–Oct 17 ─────────────────────────────────
    if (group === 'cpra') {
        const nowC = new Date();
        const yearC = nowC.getFullYear();
        const close = new Date(yearC, 9, 17); // Oct 17 (NSERC, latest deadline)
        const diff = Math.ceil((close.getTime() - nowC.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowC <= close) {
            if (diff <= 30)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · agency deadline ${fmt}`, daysLeft: diff, deadline: close };
        }
        return { type: 'closed', label: `Closed · next cycle ~Sep ${yearC + 1}`, deadline: new Date(yearC + 1, 8, 11) };
    }
    // ── A*STAR (astar group - AGS + AIF): rolling two intakes ────────────────
    if (group === 'astar')
        return { type: 'rolling', label: 'Two intakes - Feb & Aug' };
    // ── Studienstiftung: nomination-based / special programme deadlines ──────
    if (group === 'studienstiftung') {
        const name = s.name.toLowerCase();
        const nowS = new Date();
        const yearS = nowS.getFullYear();
        if (name.includes('erp')) {
            const open = new Date(yearS, 6, 1); // Jul 1
            const close = new Date(yearS, 8, 20); // Sep 20
            const diff = Math.ceil((close.getTime() - nowS.getTime()) / 86400000);
            const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (nowS >= open && nowS <= close) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
                return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
            }
            if (nowS > close)
                return { type: 'closed', label: `Closed · opens Jul ${yearS + 1}`, deadline: new Date(yearS + 1, 6, 1) };
            return { type: 'open', label: `Opens Jul 1 · closes ${fmt}`, daysLeft: diff, deadline: close };
        }
        if (name.includes('mccloy')) {
            const open = new Date(yearS, 7, 1); // Aug 1
            const close = new Date(yearS, 10, 1); // Nov 1
            const diff = Math.ceil((close.getTime() - nowS.getTime()) / 86400000);
            const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (nowS >= open && nowS <= close) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: close };
                return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: close };
            }
            if (nowS > close)
                return { type: 'closed', label: `Closed · opens Aug ${yearS + 1}`, deadline: new Date(yearS + 1, 7, 1) };
            return { type: 'open', label: `Opens Aug 1 · closes ${fmt}`, daysLeft: diff, deadline: close };
        }
        if (name.includes('leo baeck')) {
            const close = new Date(yearS, 1, 1); // Feb 1
            const target = nowS <= close ? close : new Date(yearS + 1, 1, 1);
            const diff = Math.ceil((target.getTime() - nowS.getTime()) / 86400000);
            const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
            return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
        }
        return { type: 'rolling', label: 'Rolling calls · nomination-based' };
    }
    // ── Netherlands: varies by scholarship ───────────────────────────────────
    if (group === 'netherlands') {
        const name = s.name.toLowerCase();
        const nowNL = new Date();
        const yearNL = nowNL.getFullYear();
        if (name.includes('orange knowledge'))
            return { type: 'rolling', label: 'Rolling · check Nuffic portal' };
        if (name.includes('orange tulip'))
            return { type: 'rolling', label: 'Varies per university' };
        if (name.includes('holland scholarship')) {
            const open = new Date(yearNL, 10, 1); // Nov 1
            const close = new Date(yearNL + 1, 3, 1); // ~Apr 1
            const diff = Math.ceil((close.getTime() - nowNL.getTime()) / 86400000);
            if (nowNL >= open) {
                if (diff <= 14)
                    return { type: 'closing', label: `Closing ~Apr`, daysLeft: diff, deadline: close };
                return { type: 'open', label: `Open · closes ~Apr`, daysLeft: diff, deadline: close };
            }
            return { type: 'open', label: `Opens Nov 1 · closes ~Apr`, daysLeft: diff, deadline: close };
        }
        const close = new Date(yearNL, 1, 1); // Feb 1
        const target = nowNL <= close ? close : new Date(yearNL + 1, 1, 1);
        const diff = Math.ceil((target.getTime() - nowNL.getTime()) / 86400000);
        const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (diff <= 14)
            return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: target };
        return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: target };
    }
    // ── Gates Cambridge: Sep open, ~Dec close ────────────────────────────────
    if (group === 'gates-cambridge') {
        const nowGC = new Date();
        const yearGC = nowGC.getFullYear();
        const open = new Date(yearGC, 8, 1); // Sep 1
        const close = new Date(yearGC, 11, 15); // ~Dec 15
        const diff = Math.ceil((close.getTime() - nowGC.getTime()) / 86400000);
        if (nowGC >= open && nowGC <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ~Dec`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · closes ~Dec`, daysLeft: diff, deadline: close };
        }
        if (nowGC > close)
            return { type: 'closed', label: `Closed · opens Sep ${yearGC + 1}`, deadline: new Date(yearGC + 1, 8, 1) };
        return { type: 'open', label: `Opens Sep · closes ~Dec`, daysLeft: diff, deadline: close };
    }
    // ── Clarendon: Oxford first deadline ~Dec ────────────────────────────────
    if (group === 'clarendon') {
        const nowCL = new Date();
        const yearCL = nowCL.getFullYear();
        const close = new Date(yearCL, 11, 1); // Dec 1
        const target = nowCL <= close ? close : new Date(yearCL + 1, 11, 1);
        const diff = Math.ceil((target.getTime() - nowCL.getTime()) / 86400000);
        if (diff <= 14)
            return { type: 'closing', label: `First deadline ~Dec`, daysLeft: diff, deadline: target };
        return { type: 'open', label: `Open · first deadline ~Dec`, daysLeft: diff, deadline: target };
    }
    // ── Rhodes: Jun–Oct, country-specific ────────────────────────────────────
    if (group === 'rhodes') {
        const nowRH = new Date();
        const yearRH = nowRH.getFullYear();
        const open = new Date(yearRH, 5, 1); // Jun 1
        const close = new Date(yearRH, 9, 1); // ~Oct 1
        const diff = Math.ceil((close.getTime() - nowRH.getTime()) / 86400000);
        if (nowRH >= open && nowRH <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ~Oct`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · closes ~Oct`, daysLeft: diff, deadline: close };
        }
        if (nowRH > close)
            return { type: 'closed', label: `Closed · opens Jun ${yearRH + 1}`, deadline: new Date(yearRH + 1, 5, 1) };
        return { type: 'open', label: `Opens Jun · closes ~Oct`, daysLeft: diff, deadline: close };
    }
    // ── Fulbright: deadline Feb 15 ───────────────────────────────────────────
    if (group === 'fulbright') {
        const nowF = new Date();
        const yearF = nowF.getFullYear();
        const close = new Date(yearF, 1, 15); // Feb 15
        const target = nowF <= close ? close : new Date(yearF + 1, 1, 15);
        const diff = Math.ceil((target.getTime() - nowF.getTime()) / 86400000);
        const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (diff <= 0)
            return { type: 'closed', label: `Closed · next cycle ~Oct`, deadline: target };
        if (diff <= 14)
            return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    // ── VLIR-UOS Belgium: programme-specific, typically Jan-Apr ─────────────
    if (group === 'belgium-vlir')
        return { type: 'rolling', label: 'Varies per programme' };
    // ── Erasmus Mundus: Oct-Jan typically ────────────────────────────────────
    if (group === 'erasmus-mundus') {
        const nowEM = new Date();
        const yearEM = nowEM.getFullYear();
        const open = new Date(yearEM, 9, 1); // Oct 1
        const close = new Date(yearEM, 0, 31) > nowEM
            ? new Date(yearEM, 0, 31)
            : new Date(yearEM + 1, 0, 31);
        const diff = Math.ceil((close.getTime() - nowEM.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowEM >= open || nowEM <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · closes ~Jan`, daysLeft: diff, deadline: close };
        }
        return { type: 'closed', label: `Closed · opens Oct ${yearEM}`, deadline: open };
    }
    // ── China CSC: Dec–Apr annually ───────────────────────────────────────
    if (group === 'china-csc') {
        const nowCN = new Date();
        const yearCN = nowCN.getFullYear();
        // Application window: December 1 – April 30
        const open = new Date(yearCN - 1, 11, 1); // Dec 1 previous year
        const close = new Date(yearCN, 3, 30); // April 30 current year
        const diff = Math.ceil((close.getTime() - nowCN.getTime()) / 86400000);
        const fmt = close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowCN >= open && nowCN <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ~${fmt}`, daysLeft: diff, deadline: close };
            return { type: 'open', label: `Open · closes ~${fmt}`, daysLeft: diff, deadline: close };
        }
        if (nowCN > close)
            return { type: 'closed', label: `Closed · opens Dec ${yearCN}`, deadline: new Date(yearCN, 11, 1) };
        return { type: 'open', label: `Opens Dec · closes ~Apr`, daysLeft: diff, deadline: close };
    }
    // ── Sweden SI: Feb 9–25 annually ─────────────────────────────────────────
    if (group === 'sweden') {
        const nowSE = new Date();
        const yearSE = nowSE.getFullYear();
        const open = new Date(yearSE, 1, 9); // Feb 9
        const close = new Date(yearSE, 1, 25); // Feb 25
        const target = nowSE <= close ? close : new Date(yearSE + 1, 1, 25);
        const openTarget = nowSE <= close ? open : new Date(yearSE + 1, 1, 9);
        const diff = Math.ceil((target.getTime() - nowSE.getTime()) / 86400000);
        const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowSE >= open && nowSE <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
            return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
        }
        if (nowSE > close)
            return { type: 'closed', label: `Closed · opens Feb ${target.getFullYear()}`, deadline: openTarget };
        return { type: 'open', label: `Opens 9 Feb · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    // ── Italy MAECI: main deadline ~26 March ──────────────────────────────────
    if (group === 'italy') {
        const nowIT = new Date();
        const yearIT = nowIT.getFullYear();
        const close = new Date(yearIT, 2, 26); // March 26
        const target = nowIT <= close ? close : new Date(yearIT + 1, 2, 26);
        const diff = Math.ceil((target.getTime() - nowIT.getTime()) / 86400000);
        const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowIT <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
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
        const diff = Math.ceil((target.getTime() - nowH.getTime()) / 86400000);
        const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (diff <= 14)
            return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
        return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    // ── Taiwan (MOE/ICDF/Huayu): annual deadline ~Mar 31 ─────────────────
    if (group === 'taiwan') {
        const nowTW = new Date();
        const yearTW = nowTW.getFullYear();
        const close = new Date(yearTW, 2, 31); // Mar 31
        const target = nowTW <= close ? close : new Date(yearTW + 1, 2, 31);
        const diff = Math.ceil((target.getTime() - nowTW.getTime()) / 86400000);
        const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowTW <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
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
        const open = new Date(yearNZ, 1, 1); // Feb 1
        const close = new Date(yearNZ, 2, 31); // Mar 31
        const target = nowNZ <= close ? close : new Date(yearNZ + 1, 2, 31);
        const diff = Math.ceil((target.getTime() - nowNZ.getTime()) / 86400000);
        const fmt = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (nowNZ >= open && nowNZ <= close) {
            if (diff <= 14)
                return { type: 'closing', label: `Closing ${fmt}`, daysLeft: diff, deadline: target };
            return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
        }
        if (nowNZ > close)
            return { type: 'closed', label: `Closed · opens Feb ${target.getFullYear()}`, deadline: new Date(target.getFullYear(), 1, 1) };
        return { type: 'open', label: `Opens Feb · closes ${fmt}`, daysLeft: diff, deadline: target };
    }
    return getDaadStatus();
}
// ── Description cleaner ───────────────────────────────────────────────────
/**
 * Strips MEXT-specific Bahasa Indonesia header noise and markdown artifacts
 * so descriptions render cleanly on any page.
 */
function cleanDescription(raw) {
    if (!raw)
        return '';
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
exports.providerMeta = {
    daad: {
        name: 'DAAD',
        flag: '🇩🇪',
        country: 'Germany',
        description: 'The German Academic Exchange Service (DAAD) is the world\'s largest funding organisation for the international exchange of students and researchers.',
        website: 'https://www.daad.de',
    },
    mext: {
        name: 'MEXT / Monbukagakusho',
        flag: '🇯🇵',
        country: 'Japan',
        description: 'The Japanese Ministry of Education, Culture, Sports, Science and Technology offers scholarships to international students wishing to study in Japan.',
        website: 'https://www.mext.go.jp',
    },
    turkiye: {
        name: 'Türkiye Burslari',
        flag: '🇹🇷',
        country: 'Turkey',
        description: 'Türkiye Burslari is the umbrella brand of the Turkish government scholarships offered to international students by the Presidency for Turks Abroad and Related Communities.',
        website: 'https://www.turkiyeburslari.gov.tr',
    },
    chevening: {
        name: 'Chevening',
        flag: '🇬🇧',
        country: 'United Kingdom',
        description: 'Chevening is the UK Government\'s prestigious international scholarships programme, funded by the Foreign, Commonwealth and Development Office (FCDO), offering future leaders a fully funded one-year master\'s degree at a UK university.',
        website: 'https://www.chevening.org',
    },
    'australia-awards': {
        name: 'Australia Awards',
        flag: '🇦🇺',
        country: 'Australia',
        description: 'Australia Awards are prestigious, transformational scholarships and short courses offered by the Australian Government to emerging leaders from developing countries for study, research and professional development in Australia.',
        website: 'https://www.australiaawardsindonesia.org',
    },
    gks: {
        name: 'Global Korea Scholarship (GKS)',
        flag: '🇰🇷',
        country: 'South Korea',
        description: 'The Global Korea Scholarship (GKS), administered by NIIED under the Korean Ministry of Education, invites outstanding international students to pursue undergraduate and graduate degrees at Korean universities.',
        website: 'https://www.studyinkorea.go.kr',
    },
    singapore: {
        name: 'Singapore Scholarships (NUS / NTU / A*STAR)',
        flag: '🇸🇬',
        country: 'Singapore',
        description: 'Singapore offers prestigious scholarships for undergraduate and postgraduate students, including the ASEAN Undergraduate Scholarship (NUS/NTU) and the Singapore International Graduate Award (SINGA) for PhD studies, administered by A*STAR and Singapore\'s top universities.',
        website: 'https://www.a-star.edu.sg/scholarships',
    },
    eiffel: {
        name: 'France Excellence Eiffel Scholarship',
        flag: '🇫🇷',
        country: 'France',
        description: 'Established by the French Ministry for Europe and Foreign Affairs, the Eiffel Excellence Scholarship Programme helps French higher education institutions attract top international students for master\'s and PhD programmes, providing generous monthly allowances and travel coverage.',
        website: 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence',
    },
    canada: {
        name: 'Canada Research Training Awards (CRTAS)',
        flag: '🇨🇦',
        country: 'Canada',
        description: 'The Canada Research Training Awards Suite (CRTAS), jointly administered by CIHR, NSERC, and SSHRC, is Canada\'s premier graduate research funding program. It replaced the Vanier CGS in 2025, providing $40,000/year doctoral scholarships. International students enrolled at Canadian institutions may apply.',
        website: 'https://nserc-crsng.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-doctoral-program',
    },
    jasso: {
        name: 'JASSO - Japan Student Services Organization',
        flag: '🇯🇵',
        country: 'Japan',
        description: 'JASSO (Japan Student Services Organization) provides two scholarship programs for international students in Japan: the Monbukagakusho Honors Scholarship (¥48,000/month) for privately-financed students with financial need, and the Student Exchange Support Program (¥80,000/month) for short-term exchange students under university agreements.',
        website: 'https://www.jasso.or.jp/en/ryugaku/scholarship_j/index.html',
    },
    koica: {
        name: 'KOICA Scholarship Program',
        flag: '🇰🇷',
        country: 'South Korea',
        description: "KOICA (Korea International Cooperation Agency) offers fully funded master's and doctoral scholarships to public sector professionals from developing countries. Programs span 15 specialised tracks at leading Korean universities including Yonsei, KDI School, and the University of Seoul, covering fields from AI and digital health to public policy and fisheries.",
        website: 'https://www.koica.go.kr',
    },
    cpra: {
        name: 'Canada Postdoctoral Research Award (CPRA)',
        flag: '🇨🇦',
        country: 'Canada',
        description: 'The Canada Postdoctoral Research Award (CPRA) replaced the discontinued Banting Postdoctoral Fellowship, providing CAD $70,000/year for 2 years to outstanding postdoctoral researchers. Administered jointly by CIHR, NSERC, and SSHRC, up to 20% of awards are available to international applicants enrolled or conducting postdocs at Canadian institutions.',
        website: 'https://www.nserc-crsng.gc.ca/Students-Etudiants/PD-NP/cpra-bprc_eng.asp',
    },
    studienstiftung: {
        name: 'Studienstiftung des deutschen Volkes',
        flag: '🇩🇪',
        country: 'Germany',
        description: "Germany's oldest, largest, and most prestigious scholarship foundation, supporting ~13,300 students and doctoral candidates annually across all disciplines at German universities. Admission is by nomination only. Also offers special programmes including the ERP Fellowship (USA) and McCloy Scholarship (Harvard Kennedy School).",
        website: 'https://www.studienstiftung.de/en',
    },
    netherlands: {
        name: 'Netherlands Scholarships',
        flag: '🇳🇱',
        country: 'Netherlands',
        description: 'The Netherlands offers a range of scholarships for international students, from the government-backed Holland Scholarship (€5,000) and Orange Knowledge Programme (fully funded, for professionals) to university-specific excellence awards at TU Delft (€30,000/year), University of Amsterdam, Groningen, Leiden, Maastricht, and Radboud University.',
        website: 'https://www.studyinholland.nl/scholarships',
    },
    'gates-cambridge': {
        name: 'Gates Cambridge Scholarship',
        flag: '🇬🇧',
        country: 'United Kingdom',
        description: 'Established in 2000 with a US$210m donation from the Gates Foundation, the Gates Cambridge Scholarship offers ~80 fully funded postgraduate scholarships per year to outstanding non-UK citizens studying at the University of Cambridge. Covers full tuition, maintenance (£22,050/year), airfare, and visa costs.',
        website: 'https://www.gatescambridge.org',
    },
    clarendon: {
        name: 'Clarendon Fund - University of Oxford',
        flag: '🇬🇧',
        country: 'United Kingdom',
        description: "One of Oxford's most prestigious graduate scholarship programmes, the Clarendon Fund awards 200+ fully funded scholarships annually to outstanding students of any nationality for postgraduate study at Oxford. No separate application - all Oxford graduate applicants are automatically considered.",
        website: 'https://www.ox.ac.uk/clarendon',
    },
    rhodes: {
        name: 'Rhodes Scholarship',
        flag: '🇬🇧',
        country: 'United Kingdom',
        description: "Established in 1903, the Rhodes Scholarship is one of the world's oldest and most prestigious international scholarships, funding postgraduate study at the University of Oxford. Open to exceptional young graduates from approximately 60 countries who demonstrate outstanding intellect, character, leadership, and commitment to service.",
        website: 'https://www.rhodeshouse.ox.ac.uk/scholarships/',
    },
    fulbright: {
        name: 'Fulbright / AMINEF',
        flag: '🇺🇸',
        country: 'United States',
        description: 'The Fulbright Program, administered in Indonesia by AMINEF (American Indonesian Exchange Foundation), is the US government\'s flagship international exchange program. It offers fully funded scholarships and fellowships for Indonesian citizens to study, research, or teach in the United States, including the Master\'s Degree Scholarship, PhD Scholarship, Hubert H. Humphrey Fellowship for mid-career professionals, and the FLTA teaching assistantship program.',
        website: 'https://www.aminef.or.id',
    },
    'belgium-vlir': {
        name: 'VLIR-UOS Belgium (ICP Connect)',
        flag: '🇧🇪',
        country: 'Belgium',
        description: 'VLIR-UOS (Flemish Interuniversity Council - University Development Cooperation) offers fully funded ICP Connect Scholarships for students from 29 eligible developing countries including Indonesia to pursue accredited international programmes at Flemish universities and universities of applied sciences. Available at bachelor (3 years), initial master (2 years), and advanced master (1 year) levels across development-related fields.',
        website: 'https://www.vliruos.be/get-funded/study-scholarships',
    },
    'erasmus-mundus': {
        name: 'Erasmus Mundus Joint Master (EMJM)',
        flag: '🇪🇺',
        country: 'Belgium',
        description: 'The Erasmus Mundus Joint Master (EMJM) is a prestigious EU-funded scholarship for a 1-2 year master\'s degree jointly delivered by at least 3 universities in at least 3 European countries. Open to students of any nationality worldwide including Indonesia. With 150+ programmes across all disciplines, full scholarships cover tuition, living allowance, travel, and insurance. Search programmes at eacea.ec.europa.eu.',
        website: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters',
    },
    'china-csc': {
        name: 'China Scholarship Council (CSC)',
        flag: '🇨🇳',
        country: 'China',
        description: 'The China Scholarship Council (CSC) administers the Chinese Government Scholarship (CGS) programme, offering fully-funded undergraduate, master\'s, and doctoral scholarships at 274+ Chinese universities. Indonesia has a bilateral programme with China. Programmes include the CGS Bilateral Program (via embassy), CGS Chinese University Program (direct to university), Belt and Road / Silk Road Scholarship (for BRI partner countries), and the MOFCOM Scholarship for developing country students.',
        website: 'http://studyinchina.csc.edu.cn/',
    },
    sweden: {
        name: 'Swedish Institute (SI) Scholarships',
        flag: '🇸🇪',
        country: 'Sweden',
        description: 'The Swedish Institute (SI) is a Swedish government agency that offers fully-funded scholarships for master\'s studies at Swedish universities. The flagship SISGP programme is open to professionals from 34 developing countries including Indonesia, covering full tuition, SEK 12,000/month, and a travel grant. The Pioneering Women in STEM (PWIS) scholarship exclusively supports women from 10 countries in STEM fields.',
        website: 'https://si.se/en/apply/scholarships/',
    },
    italy: {
        name: 'Italian Government Scholarships (MAECI)',
        flag: '🇮🇹',
        country: 'Italy',
        description: 'The Italian Ministry of Foreign Affairs and International Cooperation (MAECI) offers fully-funded scholarships for foreign students to study at Italian universities. Programmes include the general Italian Government Scholarship (open to many countries), Invest Your Talent in Italy (IYT) for 18 partner countries including Indonesia, and Special Projects scholarships for bilateral partnerships. Apply via the Study in Italy portal.',
        website: 'https://studyinitaly.esteri.it/',
    },
    hungary: {
        name: 'Stipendium Hungaricum',
        flag: '🇭🇺',
        country: 'Hungary',
        description: 'The Stipendium Hungaricum Scholarship Programme, established by the Hungarian Government, offers fully funded scholarships for bachelor\'s, master\'s, and doctoral studies at Hungarian universities. Over 600 study programmes in English and other languages are available. Covers full tuition, monthly stipend, accommodation support, and medical insurance. Open to citizens of 70+ partner countries including Indonesia.',
        website: 'https://stipendiumhungaricum.hu/',
    },
    taiwan: {
        name: 'Taiwan Scholarships (MOE / ICDF)',
        flag: '🇹🇼',
        country: 'Taiwan',
        description: 'Taiwan offers three main scholarship programmes: the MOE Taiwan Scholarship (tuition up to NTD 40K/semester + NTD 15–20K/month stipend for bachelor\'s to PhD), the TaiwanICDF Scholarship (fully funded master\'s and PhD with housing and airfare at 32 designated programmes), and the Huayu Enrichment Scholarship (NTD 25K/month for Mandarin language study). Over 150 Taiwan universities participate. Applied through local TECO offices.',
        website: 'https://english.moe.gov.tw',
    },
    switzerland: {
        name: 'Swiss Government Excellence Scholarships',
        flag: '🇨🇭',
        country: 'Switzerland',
        description: 'The Swiss Government Excellence Scholarships, administered by SERI/SBFI, offer CHF 2,450/month for research stays (6–12 months), full PhD studies (up to 36 months), and art master\'s degrees (12–21 months) at Swiss universities and research institutes. Open to applicants from 180+ countries. Requires securing an academic supervisor at a Swiss institution. Applications submitted through Swiss embassies.',
        website: 'https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships',
    },
    'new-zealand': {
        name: 'Manaaki New Zealand Scholarships',
        flag: '🇳🇿',
        country: 'New Zealand',
        description: 'Manaaki New Zealand Scholarships (formerly NZAS), funded by MFAT, are fully funded scholarships for citizens of eligible developing countries including Indonesia. They cover tuition, living allowance, airfare, insurance, and settling-in costs for undergraduate, master\'s, and PhD studies at New Zealand universities. Also available: vocational short-term training and English language training for officials (NZELTO).',
        website: 'https://www.nzscholarships.govt.nz/',
    },
};
/**
 * Resolves a specific university or provider logo if available, falling back to group-level logos.
 */
function getScholarshipLogo(s) {
    const name = s.name.toLowerCase();
    const provider = s.provider.toLowerCase();
    const hasWord = (word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(name) || regex.test(provider);
    };
    // 1. Specific University / Provider Logos
    if (name.includes('university of toronto') || provider.includes('university of toronto') || hasWord('uoft'))
        return '/images/logos/UofT.png';
    if (name.includes('mcgill') || provider.includes('mcgill'))
        return '/images/logos/McGill.png';
    if (name.includes('british columbia') || hasWord('ubc'))
        return '/images/logos/UBC.png';
    if (name.includes('mcmaster') || provider.includes('mcmaster'))
        return '/images/logos/McMaster.png';
    if (name.includes('waterloo') || provider.includes('waterloo'))
        return '/images/logos/Waterloo.png';
    if (name.includes('national university of singapore') || provider.includes('national university of singapore') || hasWord('nus'))
        return '/images/logos/NUS.png';
    if (name.includes('nanyang') || provider.includes('nanyang') || hasWord('ntu'))
        return '/images/logos/NTU.png';
    if (hasWord('smu') || name.includes('singapore management university'))
        return '/images/logos/SMU.png';
    if (hasWord('sutd') || name.includes('singapore university of technology and design'))
        return '/images/logos/SUTD.png';
    if (name.includes('asean undergraduate') && !hasWord('nus') && !hasWord('ntu'))
        return '/images/logos/ASEAN_Undergraduate_Scholarship.png';
    if (name.includes('kyoto') || provider.includes('kyoto'))
        return '/images/logos/KyotoU.png';
    if (name.includes('tokyo') || provider.includes('tokyo') || hasWord('uoftokyo'))
        return '/images/logos/UofTokyo.png';
    if (name.includes('osaka') || provider.includes('osaka'))
        return '/images/logos/Osaka.png';
    if (name.includes('tohoku') || provider.includes('tohoku'))
        return '/images/logos/Tohoku.png';
    if (name.includes('tokyo institute of technology') || name.includes('tokyo tech'))
        return '/images/logos/TokyoTech.png';
    if (name.includes('heidelberg') || provider.includes('heidelberg'))
        return '/images/logos/HeidelbergU.png';
    if (hasWord('lmu') || name.includes('ludwig-maximilians'))
        return '/images/logos/LMU.png';
    if (name.includes('technical university of munich') || hasWord('tum') || name.includes('münchen') || provider.includes('tum'))
        return '/images/logos/TUM.png';
    if (name.includes('freie universität berlin') || hasWord('fu berlin') || name.includes('freie universitat'))
        return '/images/logos/FUBerlin.png';
    if (hasWord('kit') || name.includes('karlsruhe institute of technology') || name.includes('karlsruher institut'))
        return '/images/logos/KIT.png';
    if (name.includes('paris-saclay') || provider.includes('paris-saclay'))
        return '/images/logos/ParisSaclay.png';
    if (hasWord('psl') || provider.includes('psl') || name.includes('paris sciences'))
        return '/images/logos/PSLU.png';
    if (name.includes('polytechnique de paris') || provider.includes('polytechnique de paris'))
        return '/images/logos/InstitutPolytechniqueDeParis.png';
    if (name.includes('sorbonne') || provider.includes('sorbonne'))
        return '/images/logos/Sorbonne.png';
    if (name.includes('middle east technical') || hasWord('metu') || provider.includes('metu'))
        return '/images/logos/METU.png';
    if (name.includes('istanbul technical') || (hasWord('itu') && s.country === 'Turkey'))
        return '/images/logos/ITU.png';
    if (name.includes('bogazici') || name.includes('boğaziçi'))
        return '/images/logos/Bogazici.png';
    if (name.includes('hacettepe'))
        return '/images/logos/Hacettepe.png';
    if (name.includes('koc university') || name.includes('koç'))
        return '/images/logos/Koc.png';
    if (name.includes('oxford') || provider.includes('oxford'))
        return '/images/logos/Oxford.png';
    if (name.includes('cambridge') || provider.includes('cambridge'))
        return '/images/logos/Cambridge.png';
    if (name.includes('imperial college') || provider.includes('imperial college'))
        return '/images/logos/ImperialCollegeLondon.png';
    if (name.includes('edinburgh') || provider.includes('edinburgh'))
        return '/images/logos/Edinburgh.png';
    if (hasWord('ucl') || name.includes('university college london'))
        return '/images/logos/UCL.png';
    if (name.includes('melbourne') || provider.includes('melbourne'))
        return '/images/logos/Melbourne.png';
    if (name.includes('sydney') || provider.includes('sydney'))
        return '/images/logos/Sydney.png';
    if (hasWord('anu') || name.includes('australian national university'))
        return '/images/logos/ANU.png';
    if (name.includes('monash') || provider.includes('monash'))
        return '/images/logos/Monash_AUS.png';
    if (hasWord('unsw') || name.includes('new south wales'))
        return '/images/logos/UNSW.png';
    if (hasWord('snu') || name.includes('seoul national'))
        return '/images/logos/SNU.png';
    if (hasWord('kaist') || name.includes('korea advanced institute of science'))
        return '/images/logos/KAIST.png';
    if (name.includes('yonsei') || provider.includes('yonsei'))
        return '/images/logos/Yonsei.png';
    if (name.includes('korea university'))
        return '/images/logos/KoreaU.png';
    if (hasWord('postech') || name.includes('pohang university'))
        return '/images/logos/POSTECH.png';
    // Netherlands Universities
    if (name.includes('tu delft') || provider.includes('tu delft') || provider.includes('delft university'))
        return '/images/logos/TUDelft.png';
    if (name.includes('university of amsterdam') || provider.includes('university of amsterdam') || hasWord('uva'))
        return '/images/logos/UniversityofAmsterdam.png';
    if (name.includes('leiden') || provider.includes('leiden'))
        return '/images/logos/LeidenU.png';
    if (name.includes('groningen') || provider.includes('groningen') || hasWord('rug'))
        return '/images/logos/Groningen.png';
    if (name.includes('maastricht') || provider.includes('maastricht'))
        return '/images/logos/Maastritcht.png';
    if (name.includes('radboud') || provider.includes('radboud'))
        return '/images/logos/RadboundU.png';
    // South Korea (KOICA/GKS partners)
    if (name.includes('sungkyunkwan') || provider.includes('sungkyunkwan') || hasWord('skku'))
        return '/images/logos/SKKU.png';
    if (name.includes('handong') || provider.includes('handong'))
        return '/images/logos/Handong.png';
    // SEARCA partner universities
    if (name.includes('uplb') || name.includes('los baños') || name.includes('los banos') || provider.includes('uplb'))
        return '/images/logos/UPLB.png';
    if (name.includes('upm') || name.includes('putra malaysia') || provider.includes('upm'))
        return '/images/logos/UPM.png';
    if (name.includes('ugm') || name.includes('gadjah mada') || provider.includes('gadjah mada'))
        return '/images/logos/UGM.png';
    if (name.includes('incheon') || provider.includes('incheon'))
        return '/images/logos/Incheon.png';
    if (name.includes('kdi school') || provider.includes('kdi school') || hasWord('kdi'))
        return '/images/logos/KDI.png';
    if (name.includes('kyungpook') || provider.includes('kyungpook'))
        return '/images/logos/Kyungpook.png';
    if (name.includes('pukyong') || provider.includes('pukyong'))
        return '/images/logos/Pukyong.png';
    if (name.includes('university of seoul') || provider.includes('university of seoul'))
        return '/images/logos/Seoul.png';
    // Turkey & Others
    if (name.includes('ankara university') || provider.includes('ankara university'))
        return '/images/logos/AnkaraU.png';
    if (name.includes('bayram veli'))
        return '/images/logos/AnkaraHaciBayramVeliU.png';
    if (name.includes('music and fine arts'))
        return '/images/logos/AnkaraMusicandFineArtsU.png';
    if (name.includes('asian institute of technology') || hasWord('ait'))
        return '/images/logos/AIT.png';
    if (name.includes('ens de lyon') || name.includes('ens lyon') || provider.includes('lyon') && (name.includes('normale') || provider.includes('normale')))
        return '/images/logos/ENSdeLyon.png';
    // Italy Universities
    if (name.includes('politecnico di milano') || provider.includes('politecnico di milano') || hasWord('polimi'))
        return '/images/logos/Polimi.png';
    if (name.includes('sapienza') || provider.includes('sapienza'))
        return '/images/logos/Sapienza.png';
    // China Universities
    if (name.includes('tsinghua') || provider.includes('tsinghua'))
        return '/images/logos/Tsinghua.png';
    if (name.includes('peking university') || provider.includes('peking university') || name.includes('peking') || provider.includes('peking'))
        return '/images/logos/Peking.png';
    if (name.includes('zhejiang') || provider.includes('zhejiang'))
        return '/images/logos/Zhejiang.png';
    // Sweden Universities
    if (name.includes('kth royal institute') || name.includes('kth') || provider.includes('kth'))
        return '/images/logos/KTH.png';
    if (name.includes('lund university') || name.includes('lunds universitet') || hasWord('lund'))
        return '/images/logos/LundU.png';
    if (name.includes('uppsala university') || name.includes('uppsala universitet') || hasWord('uppsala'))
        return '/images/logos/UppsalaU.png';
    // 2. Fallback to Group Logos
    const group = providerGroup(s.provider);
    if (group === 'daad')
        return '/images/logos/daad.svg';
    if (group === 'mext')
        return '/images/logos/mext.svg';
    if (group === 'turkiye')
        return '/images/logos/turkiye.png';
    if (group === 'fulbright')
        return '/images/logos/Harvard.png';
    if (group === 'belgium-vlir')
        return '/images/logos/KULeuven.png';
    if (group === 'erasmus-mundus')
        return '/images/logos/Bologna.png';
    return null;
}
/**
 * Resolves a specific university image if available, falling back to country/group default images.
 */
function getScholarshipImage(s) {
    const name = s.name.toLowerCase();
    const provider = s.provider.toLowerCase();
    const hasWord = (word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(name) || regex.test(provider);
    };
    // 1. Specific University Images
    if (name.includes('university of toronto') || provider.includes('university of toronto') || hasWord('uoft'))
        return '/images/universities/CA_UofT.png';
    if (name.includes('mcgill') || provider.includes('mcgill'))
        return '/images/universities/CA_McGill.png';
    if (name.includes('british columbia') || hasWord('ubc'))
        return '/images/universities/CA_UBC.png';
    if (name.includes('mcmaster') || provider.includes('mcmaster'))
        return '/images/universities/CA_McMaster.png';
    if (name.includes('waterloo') || provider.includes('waterloo'))
        return '/images/universities/CA_Waterloo.png';
    if (name.includes('national university of singapore') || provider.includes('national university of singapore') || hasWord('nus'))
        return '/images/universities/SG_NUS.png';
    if (name.includes('nanyang') || provider.includes('nanyang') || hasWord('ntu'))
        return '/images/universities/SG_NTU.png';
    if (hasWord('smu') || name.includes('singapore management university'))
        return '/images/universities/SG_SMU.png';
    if (hasWord('sutd') || name.includes('singapore university of technology and design'))
        return '/images/universities/SG_SUTD.png';
    if (name.includes('kyoto') || provider.includes('kyoto'))
        return '/images/universities/JP_KyotoU.png';
    if (name.includes('tokyo') || provider.includes('tokyo') || hasWord('uoftokyo'))
        return '/images/universities/JP_UofTokyo.png';
    if (name.includes('osaka') || provider.includes('osaka'))
        return '/images/universities/JP_Osaka.png';
    if (name.includes('tohoku') || provider.includes('tohoku'))
        return '/images/universities/JP_Tohoku.png';
    if (name.includes('tokyo institute of technology') || name.includes('tokyo tech'))
        return '/images/universities/JP_TokyoTech.png';
    if (name.includes('heidelberg') || provider.includes('heidelberg'))
        return '/images/universities/GE_HeidelbergU.png';
    if (hasWord('lmu') || name.includes('ludwig-maximilians'))
        return '/images/universities/GE_LMU.png';
    if (name.includes('technical university of munich') || hasWord('tum') || name.includes('münchen') || provider.includes('tum'))
        return '/images/universities/GE_TUM.png';
    if (name.includes('freie universität berlin') || hasWord('fu berlin') || name.includes('freie universitat'))
        return '/images/universities/GE_FUBerlin.png';
    if (hasWord('kit') || name.includes('karlsruhe institute of technology') || name.includes('karlsruher institut'))
        return '/images/universities/GE_KIT.png';
    if (name.includes('paris-saclay') || provider.includes('paris-saclay'))
        return '/images/universities/FR_ParisSaclay.png';
    if (hasWord('psl') || provider.includes('psl') || name.includes('paris sciences'))
        return '/images/universities/FR_PSLU.png';
    if (name.includes('polytechnique de paris') || provider.includes('polytechnique de paris'))
        return '/images/universities/FR_InstitutPolytechniqueDeParis.png';
    if (name.includes('sorbonne') || provider.includes('sorbonne'))
        return '/images/universities/FR_Sorbonne.png';
    if (name.includes('middle east technical') || hasWord('metu') || provider.includes('metu'))
        return '/images/universities/TU_METU.png';
    if (name.includes('istanbul technical') || (hasWord('itu') && s.country === 'Turkey'))
        return '/images/universities/TU_ITU.png';
    if (name.includes('bogazici') || name.includes('boğaziçi'))
        return '/images/universities/TU_Bogazici.png';
    if (name.includes('hacettepe'))
        return '/images/universities/TU_Hacettepe.png';
    if (name.includes('koc university') || name.includes('koç'))
        return '/images/universities/TU_Koc.png';
    if (name.includes('oxford') || provider.includes('oxford'))
        return '/images/universities/UK_Oxford.png';
    if (name.includes('cambridge') || provider.includes('cambridge'))
        return '/images/universities/UK_Cambridge.png';
    if (name.includes('imperial college') || provider.includes('imperial college'))
        return '/images/universities/UK_ImperialCollegeLondon.png';
    if (name.includes('edinburgh') || provider.includes('edinburgh'))
        return '/images/universities/UK_Edinburgh.png';
    if (hasWord('ucl') || name.includes('university college london'))
        return '/images/universities/UK_UCL.png';
    if (name.includes('melbourne') || provider.includes('melbourne'))
        return '/images/universities/AUS_Melbourne.png';
    if (name.includes('sydney') || provider.includes('sydney'))
        return '/images/universities/AUS_Sydney.png';
    if (hasWord('anu') || name.includes('australian national university'))
        return '/images/universities/AUS_ANU.png';
    if (name.includes('monash') || provider.includes('monash'))
        return '/images/universities/AUS_Monash.png';
    if (hasWord('unsw') || name.includes('new south wales'))
        return '/images/universities/AUS_UNSW.png';
    if (hasWord('snu') || name.includes('seoul national'))
        return '/images/universities/KOR_SNU.png';
    if (hasWord('kaist') || name.includes('korea advanced institute of science'))
        return '/images/universities/KOR_KAIST.png';
    if (name.includes('yonsei') || provider.includes('yonsei'))
        return '/images/universities/KOR_Yonsei.png';
    if (name.includes('korea university'))
        return '/images/universities/KOR_KoreaU.png';
    if (hasWord('postech') || name.includes('pohang university'))
        return '/images/universities/KOR_POSTECH.png';
    // New specific background images
    if (name.includes('tu delft') || provider.includes('tu delft') || provider.includes('delft university'))
        return '/images/universities/NL_TUDelft.png';
    if (name.includes('university of amsterdam') || provider.includes('university of amsterdam') || hasWord('uva'))
        return '/images/universities/NL_UniversityofAmsterdam.png';
    // SEARCA partner universities
    if (name.includes('uplb') || name.includes('los baños') || name.includes('los banos') || provider.includes('uplb'))
        return '/images/universities/PH_UPLB.png';
    if (name.includes('upm') || name.includes('putra malaysia') || provider.includes('upm'))
        return '/images/universities/MY_UPM.png';
    if (name.includes('ugm') || name.includes('gadjah mada') || provider.includes('gadjah mada'))
        return '/images/universities/ID_UGM.png';
    // SEARCA scholarship itself — use UGM as representative
    if (name.includes('searca'))
        return '/images/universities/ID_UGM.png';
    // Italy Universities
    if (name.includes('politecnico di milano') || provider.includes('politecnico di milano') || hasWord('polimi'))
        return '/images/universities/ITA_Polimi.png';
    if (name.includes('sapienza') || provider.includes('sapienza'))
        return '/images/universities/ITA_Sapienza.png';
    // China Universities
    if (name.includes('tsinghua') || provider.includes('tsinghua'))
        return '/images/universities/CN_Tsinghua.png';
    if (name.includes('peking university') || provider.includes('peking university') || name.includes('peking') || provider.includes('peking'))
        return '/images/universities/CN_Peking.png';
    if (name.includes('zhejiang') || provider.includes('zhejiang'))
        return '/images/universities/CN_Zhejiang.png';
    // Sweden Universities
    if (name.includes('kth royal institute') || name.includes('kth') || provider.includes('kth'))
        return '/images/universities/SWE_KTH.png';
    if (name.includes('lund university') || name.includes('lunds universitet') || hasWord('lund'))
        return '/images/universities/SWE_LundU.png';
    if (name.includes('uppsala university') || name.includes('uppsala universitet') || hasWord('uppsala'))
        return '/images/universities/SWE_UppsalaU.png';
    // 2. Fallback to Country/Group Images
    const group = providerGroup(s.provider);
    if (group === 'daad')
        return '/images/universities/GE_HeidelbergU.png';
    if (group === 'studienstiftung')
        return '/images/universities/GE_LMU.png';
    if (group === 'mext')
        return '/images/universities/JP_UofTokyo.png';
    if (group === 'jasso')
        return '/images/universities/JP_UofTokyo.png';
    if (group === 'turkiye')
        return '/images/universities/TU_METU.png';
    if (group === 'eiffel')
        return '/images/universities/FR_PSLU.png';
    if (group === 'singapore')
        return '/images/universities/SG_NUS.png';
    if (group === 'astar')
        return '/images/universities/SG_NUS.png';
    if (group === 'canada')
        return '/images/universities/CA_UofT.png';
    if (group === 'cpra')
        return '/images/universities/CA_UofT.png';
    if (group === 'chevening')
        return '/images/universities/UK_Oxford.png';
    if (group === 'gates-cambridge')
        return '/images/universities/UK_Cambridge.png';
    if (group === 'clarendon')
        return '/images/universities/UK_Oxford.png';
    if (group === 'rhodes')
        return '/images/universities/UK_Oxford.png';
    if (group === 'netherlands') {
        // Rotate through different NL university images based on scholarship name
        if (name.includes('groningen'))
            return '/images/universities/NL_TUDelft.png';
        if (name.includes('leiden'))
            return '/images/universities/NL_UniversityofAmsterdam.png';
        if (name.includes('maastricht'))
            return '/images/universities/NL_TUDelft.png';
        if (name.includes('radboud'))
            return '/images/universities/NL_UniversityofAmsterdam.png';
        if (name.includes('orange knowledge') || name.includes('okp'))
            return '/images/universities/NL_UniversityofAmsterdam.png';
        if (name.includes('orange tulip') || name.includes('ots'))
            return '/images/universities/NL_TUDelft.png';
        if (name.includes('holland') || name.includes('nl scholarship'))
            return '/images/universities/NL_UniversityofAmsterdam.png';
        return '/images/universities/NL_TUDelft.png';
    }
    if (group === 'australia-awards')
        return '/images/universities/AUS_Sydney.png';
    if (group === 'gks')
        return '/images/universities/KOR_SNU.png';
    if (group === 'koica')
        return '/images/universities/KOR_Yonsei.png';
    // Fulbright - rotate between top US placement universities
    if (group === 'fulbright') {
        const name = s.name.toLowerCase();
        if (name.includes('humphrey'))
            return '/images/universities/US_Columbia.png';
        if (name.includes('flta') || name.includes('teaching assistant'))
            return '/images/universities/US_Stanford.png';
        return '/images/universities/US_Harvard.png';
    }
    // Belgium VLIR - rotate between top Flemish universities
    if (group === 'belgium-vlir') {
        const name = s.name.toLowerCase();
        if (name.includes('advanced') || name.includes('1 year'))
            return '/images/universities/BEL_VUB.png';
        if (name.includes('bachelor'))
            return '/images/universities/BEL_GhentU.png';
        return '/images/universities/BEL_KULeuven.png';
    }
    // Erasmus Mundus - use Bologna as iconic EU university
    if (group === 'erasmus-mundus')
        return '/images/universities/ITA_Bologna.png';
    if (group === 'italy')
        return '/images/universities/ITA_Polimi.png';
    if (group === 'sweden')
        return '/images/universities/SWE_LundU.png';
    if (group === 'china-csc')
        return '/images/universities/CN_Tsinghua.png';
    if (group === 'hungary')
        return '/images/editorial/stem.jpg';
    if (group === 'taiwan')
        return '/images/editorial/stem.jpg';
    if (group === 'switzerland')
        return '/images/editorial/stem.jpg';
    if (group === 'new-zealand')
        return '/images/editorial/stem.jpg';
    return '/images/editorial/stem.jpg'; // ultimate fallback
}
function getMatchedUniversityLogos(s) {
    const text = `${s.name} ${s.provider} ${s.description ?? ''}`.toLowerCase();
    const list = [];
    const universities = [
        { name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png', keywords: ['nus', 'national university of singapore'] },
        { name: 'Nanyang Technological University (NTU)', logo: '/images/logos/NTU.png', keywords: ['ntu', 'nanyang'] },
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
        { name: 'UNSW Sydney', logo: '/images/logos/UNSW.png', keywords: ['unsw', 'new south wales'] },
        { name: 'Seoul National University (SNU)', logo: '/images/logos/SNU.png', keywords: ['snu', 'seoul national university'] },
        { name: 'KAIST', logo: '/images/logos/KAIST.png', keywords: ['kaist', 'korea advanced institute of science'] },
        { name: 'Yonsei University', logo: '/images/logos/Yonsei.png', keywords: ['yonsei'] },
        { name: 'Korea University', logo: '/images/logos/KoreaU.png', keywords: ['korea university'] },
        { name: 'Pohang University of Science and Technology (POSTECH)', logo: '/images/logos/POSTECH.png', keywords: ['postech', 'pohang university'] },
        // Netherlands Universities
        { name: 'TU Delft', logo: '/images/logos/TUDelft.png', keywords: ['tu delft', 'delft university'] },
        { name: 'University of Amsterdam', logo: '/images/logos/UniversityofAmsterdam.png', keywords: ['amsterdam', 'uva'] },
        { name: 'Leiden University', logo: '/images/logos/LeidenU.png', keywords: ['leiden'] },
        { name: 'University of Groningen', logo: '/images/logos/Groningen.png', keywords: ['groningen', 'rug'] },
        { name: 'Maastricht University', logo: '/images/logos/Maastritcht.png', keywords: ['maastricht'] },
        { name: 'Radboud University', logo: '/images/logos/RadboundU.png', keywords: ['radboud'] },
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
        // Sweden Universities
        { name: 'KTH Royal Institute of Technology', logo: '/images/logos/KTH.png', keywords: ['kth', 'royal institute of technology'] },
        { name: 'Lund University', logo: '/images/logos/LundU.png', keywords: ['lund', 'lunds universitet'] },
        { name: 'Uppsala University', logo: '/images/logos/UppsalaU.png', keywords: ['uppsala', 'uppsala universitet'] },
    ];
    universities.forEach((univ) => {
        const matched = univ.keywords.some((kw) => {
            if (kw === 'itu') {
                return s.country === 'Turkey' && (text.includes('itu ') || text.includes('itu/') || text.includes('itu,') || text.includes(' itu'));
            }
            if (['nus', 'ntu', 'lmu', 'ubc', 'tum', 'psl', 'anu', 'unsw', 'snu', 'kaist', 'postech', 'kit', 'smu', 'sutd', 'ucl', 'skku', 'kdi', 'ait', 'uva', 'rug', 'polimi', 'kth'].includes(kw)) {
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
        if (country === 'germany' || group === 'daad') {
            list.push({ name: 'Heidelberg University', logo: '/images/logos/HeidelbergU.png' }, { name: 'LMU Munich', logo: '/images/logos/LMU.png' }, { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png' }, { name: 'Freie Universität Berlin', logo: '/images/logos/FUBerlin.png' }, { name: 'Karlsruhe Institute of Technology (KIT)', logo: '/images/logos/KIT.png' });
        }
        else if (country === 'japan' || group === 'mext') {
            list.push({ name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png' }, { name: 'Kyoto University', logo: '/images/logos/KyotoU.png' }, { name: 'Osaka University', logo: '/images/logos/Osaka.png' }, { name: 'Tohoku University', logo: '/images/logos/Tohoku.png' }, { name: 'Tokyo Institute of Technology', logo: '/images/logos/TokyoTech.png' });
        }
        else if (country === 'turkey' || group === 'turkiye') {
            list.push({ name: 'Istanbul Technical University (ITU)', logo: '/images/logos/ITU.png' }, { name: 'Middle East Technical University (METU)', logo: '/images/logos/METU.png' }, { name: 'Boğaziçi University', logo: '/images/logos/Bogazici.png' }, { name: 'Hacettepe University', logo: '/images/logos/Hacettepe.png' }, { name: 'Koç University', logo: '/images/logos/Koc.png' });
        }
        else if (country === 'canada' || group === 'canada') {
            list.push({ name: 'University of Toronto', logo: '/images/logos/UofT.png' }, { name: 'McGill University', logo: '/images/logos/McGill.png' }, { name: 'University of British Columbia (UBC)', logo: '/images/logos/UBC.png' }, { name: 'McMaster University', logo: '/images/logos/McMaster.png' }, { name: 'University of Waterloo', logo: '/images/logos/Waterloo.png' });
        }
        else if (country === 'france' || group === 'eiffel') {
            list.push({ name: 'Institut Polytechnique de Paris', logo: '/images/logos/InstitutPolytechniqueDeParis.png' }, { name: 'Paris Sciences et Lettres University (PSL)', logo: '/images/logos/PSLU.png' }, { name: 'Sorbonne University', logo: '/images/logos/Sorbonne.png' }, { name: 'Université Paris-Saclay', logo: '/images/logos/ParisSaclay.png' });
        }
        else if (country === 'singapore' || group === 'singapore') {
            list.push({ name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png' }, { name: 'Nanyang Technological University (NTU)', logo: '/images/logos/NTU.png' }, { name: 'Singapore Management University (SMU)', logo: '/images/logos/SMU.png' }, { name: 'Singapore University of Technology and Design (SUTD)', logo: '/images/logos/SUTD.png' });
        }
        else if (country === 'united kingdom' || group === 'chevening') {
            list.push({ name: 'University of Oxford', logo: '/images/logos/Oxford.png' }, { name: 'University of Cambridge', logo: '/images/logos/Cambridge.png' }, { name: 'Imperial College London', logo: '/images/logos/ImperialCollegeLondon.png' }, { name: 'University of Edinburgh', logo: '/images/logos/Edinburgh.png' }, { name: 'University College London (UCL)', logo: '/images/logos/UCL.png' });
        }
        else if (country === 'australia' || group === 'australia-awards') {
            list.push({ name: 'University of Melbourne', logo: '/images/logos/Melbourne.png' }, { name: 'University of Sydney', logo: '/images/logos/Sydney.png' }, { name: 'Australian National University (ANU)', logo: '/images/logos/ANU.png' }, { name: 'Monash University', logo: '/images/logos/Monash_AUS.png' }, { name: 'UNSW Sydney', logo: '/images/logos/UNSW.png' });
        }
        else if (country === 'south korea' || country === 'korea' || group === 'gks') {
            list.push({ name: 'Seoul National University (SNU)', logo: '/images/logos/SNU.png' }, { name: 'KAIST', logo: '/images/logos/KAIST.png' }, { name: 'Yonsei University', logo: '/images/logos/Yonsei.png' }, { name: 'Korea University', logo: '/images/logos/KoreaU.png' }, { name: 'Pohang University of Science and Technology (POSTECH)', logo: '/images/logos/POSTECH.png' });
        }
        else if (country === 'netherlands' || group === 'netherlands') {
            list.push({ name: 'TU Delft', logo: '/images/logos/TUDelft.png' }, { name: 'University of Amsterdam', logo: '/images/logos/UniversityofAmsterdam.png' }, { name: 'Leiden University', logo: '/images/logos/LeidenU.png' }, { name: 'University of Groningen', logo: '/images/logos/Groningen.png' }, { name: 'Maastricht University', logo: '/images/logos/Maastritcht.png' });
        }
        else if (group === 'gates-cambridge') {
            list.push({ name: 'University of Cambridge', logo: '/images/logos/Cambridge.png' });
        }
        else if (group === 'clarendon' || group === 'rhodes') {
            list.push({ name: 'University of Oxford', logo: '/images/logos/Oxford.png' });
        }
        else if (group === 'studienstiftung') {
            list.push({ name: 'Heidelberg University', logo: '/images/logos/HeidelbergU.png' }, { name: 'LMU Munich', logo: '/images/logos/LMU.png' }, { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png' }, { name: 'Freie Universität Berlin', logo: '/images/logos/FUBerlin.png' }, { name: 'Karlsruhe Institute of Technology (KIT)', logo: '/images/logos/KIT.png' });
        }
        else if (group === 'fulbright') {
            list.push({ name: 'Harvard University', logo: '/images/logos/Harvard.png' }, { name: 'Columbia University', logo: '/images/logos/ColumbiaU.png' }, { name: 'Stanford University', logo: '/images/logos/Stanford.png' });
        }
        else if (group === 'belgium-vlir') {
            list.push({ name: 'KU Leuven', logo: '/images/logos/KULeuven.png' }, { name: 'Ghent University', logo: '/images/logos/GhentU.png' }, { name: 'Vrije Universiteit Brussel (VUB)', logo: '/images/logos/VUB.png' });
        }
        else if (group === 'erasmus-mundus') {
            list.push({ name: 'University of Bologna', logo: '/images/logos/Bologna.png' }, { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png' }, { name: 'KU Leuven', logo: '/images/logos/KULeuven.png' });
        }
        else if (country === 'italy' || group === 'italy') {
            list.push({ name: 'Politecnico di Milano', logo: '/images/logos/Polimi.png' }, { name: 'Sapienza Università di Roma', logo: '/images/logos/Sapienza.png' }, { name: 'University of Bologna', logo: '/images/logos/Bologna.png' });
        }
        else if (country === 'sweden' || group === 'sweden') {
            list.push({ name: 'Lund University', logo: '/images/logos/LundU.png' }, { name: 'KTH Royal Institute of Technology', logo: '/images/logos/KTH.png' }, { name: 'Uppsala University', logo: '/images/logos/UppsalaU.png' });
        }
        else if (country === 'china' || group === 'china-csc') {
            list.push({ name: 'Tsinghua University', logo: '/images/logos/Tsinghua.png' }, { name: 'Peking University', logo: '/images/logos/Peking.png' }, { name: 'Zhejiang University', logo: '/images/logos/Zhejiang.png' });
        }
        else if (group === 'hungary') {
            list.push({ name: 'Stipendium Hungaricum', logo: '/images/logos/daad.svg' });
        }
        else if (group === 'taiwan') {
            list.push({ name: 'Ministry of Education Taiwan', logo: '/images/logos/mext.svg' });
        }
        else if (group === 'switzerland') {
            list.push({ name: 'Swiss Government Excellence', logo: '/images/logos/daad.svg' });
        }
        else if (group === 'new-zealand') {
            list.push({ name: 'Manaaki New Zealand', logo: '/images/logos/daad.svg' });
        }
    }
    return list;
}

// Auto-generated. Source: scripts/reextract.js
// Each country's scholarship array lives in its own file.
const path = require('path');
const fs = require('fs');
const daad = require('./daad');
const mext = require('./mext');
const turkiye = require('./turkiye');
const chevening = require('./chevening');
const australiaAwards = require('./australiaAwards');
const australiaUniversityScholarships = require('./australiaUniversityScholarships');
const gks = require('./gks');
const singapore = require('./singapore');
const eiffel = require('./eiffel');
const canada = require('./canada');
const astarNew = require('./astarNew');
const jasso = require('./jasso');
const koica = require('./koica');
const cpra = require('./cpra');
const studienstiftung = require('./studienstiftung');
const netherlands = require('./netherlands');
const gatesCambridge = require('./gatesCambridge');
const clarendon = require('./clarendon');
const rhodes = require('./rhodes');
const fulbright = require('./fulbright');
const belgiumVlir = require('./belgiumVlir');
const belgiumOther = require('./belgiumOther');
const erasmusMundus = require('./erasmusMundus');
const chinaCsc = require('./chinaCsc');
const sweden = require('./sweden');
const italy = require('./italy');
const hungary = require('./hungary');
const taiwan = require('./taiwan');
const switzerland = require('./switzerland');
const austria = require('./austria');
const finland = require('./finland');
const newZealand = require('./newZealand');
const ireland = require('./ireland');
const denmark = require('./denmark');
const poland = require('./poland');
const spain = require('./spain');
const norway = require('./norway');
const hongKong = require('./hongKong');
const malaysia = require('./malaysia');
const commonwealth = require('./commonwealth');
const knightHennessy = require('./knightHennessy');
const japanGlobal = require('./japanGlobal');
const daadLeadership = require('./daadLeadership');
const romaniaMfa = require('./romaniaMfa');
const romaniaUni = require('./romaniaUni');
const russia = require('./russia');
const saudiMoe = require('./saudiMoe');
const qatar = require('./qatar');

const COUNTRY_PROGRAMS = {
  germany: { arrays: [daad, studienstiftung, daadLeadership], programs: ['DAAD', 'Studienstiftung', 'Leadership for Africa'] },
  japan: { arrays: [mext, jasso, japanGlobal], programs: ['MEXT', 'JASSO', 'ADB-Japan', 'JJ/WBGSP'] },
  turkey: { arrays: [turkiye], programs: ['Türkiye Burslari'] },
  'united-kingdom': { arrays: [chevening, gatesCambridge, clarendon, rhodes, commonwealth], programs: ['Chevening', 'Gates Cambridge', 'Clarendon', 'Rhodes', 'Commonwealth'] },
  'australia': { arrays: [australiaAwards, australiaUniversityScholarships], programs: ['Australia Awards', 'Melbourne', 'Sydney', 'ANU', 'Monash', 'UQ', 'UNSW', 'Flinders', 'Griffith'] },
  'south-korea': { arrays: [gks, koica], programs: ['GKS', 'KOICA'] },
  singapore: { arrays: [singapore, astarNew], programs: ['SINGA', 'NUS', 'NTU', 'A*STAR'] },
  france: { arrays: [eiffel], programs: ['Eiffel', 'Paris-Saclay', 'Sciences Po', 'ENS Lyon'] },
  canada: { arrays: [canada, cpra], programs: ['CGRS-D', 'Impact+', 'Pearson', 'CPRA'] },
  'united-states': { arrays: [fulbright, knightHennessy], programs: ['Fulbright', 'Humphrey', 'FLTA', 'Knight-Hennessy'] },
  netherlands: { arrays: [netherlands], programs: ['Holland Scholarship', 'OKP', 'OTS', 'TU Delft', 'Groningen', 'UvA', 'Leiden', 'Maastricht', 'Radboud', 'VUFP'] },
  belgium: { arrays: [belgiumVlir, belgiumOther], programs: ['VLIR-UOS', 'ARES', 'Master Mind', 'Science@Leuven', 'Global Minds'] },
  eu: { arrays: [erasmusMundus], programs: ['Erasmus Mundus'] },
  china: { arrays: [chinaCsc], programs: ['CGS Bilateral', 'CGS University', 'Belt & Road', 'MOFCOM'] },
  sweden: { arrays: [sweden], programs: ['SISGP', 'PWIS', 'Lund', 'KTH', 'Chalmers', 'Uppsala', 'Stockholm', 'Gothenburg', 'Karolinska'] },
  italy: { arrays: [italy], programs: ['MAECI', 'IYT', 'MAECI Special Projects'] },
  hungary: { arrays: [hungary], programs: ['Stipendium Hungaricum'] },
  taiwan: { arrays: [taiwan], programs: ['MOE', 'ICDF', 'Huayu', 'NTU', 'NTHU'] },
  switzerland: { arrays: [switzerland], programs: ['Swiss Govt Excellence', 'ETH ESOP', 'EPFL Excellence', 'UNIGE Excellence'] },
  austria: { arrays: [austria], programs: ['Helmut Veith Stipend', 'Ernst Mach Worldwide', 'Ernst Mach UAS', 'Ernst Mach Follow-Up', 'Franz Werfel'] },
  finland: { arrays: [finland], programs: ['Helsinki Intl Master', 'Aalto Tuition Waiver', 'Tampere Intl', 'Oulu Intl Master', 'Hanken Premium', 'Nokia Foundation'] },
  'new-zealand': { arrays: [newZealand], programs: ['Manaaki NZ'] },
  ireland: { arrays: [ireland], programs: ['GOI-IES', 'GOIPG', 'TCD', 'UCD', 'Teagasc', 'MTU', 'Maynooth ARDÚ', 'Maynooth Hume', 'UCD Funded PhD', 'Trinity UG', 'RCSI', 'TCD Ussher'] },
  poland: { arrays: [poland], programs: ['NAWA Banach', 'NAWA Łukasiewicz', 'Jagiellonian', 'Warsaw', 'NCN PRELUDIUM'] },
  spain: { arrays: [spain], programs: ['MAEC-AECID', 'la Caixa INPhINIT', 'la Caixa Junior Leader', 'IE Foundation', 'UdG Santander'] },
  denmark: { arrays: [denmark], programs: ['Danish Govt', 'UCPH', 'Aarhus', 'DTU', 'CBS', 'SDU', 'AAU', 'RUC'] },
  norway: { arrays: [norway], programs: ['Tuition-Free', 'BI Presidential'] },
  'hong-kong': { arrays: [hongKong], programs: ['HKPFS', 'HKU Entrance', 'HKUST', 'CUHK', 'CityU', 'PolyU'] },
  malaysia: { arrays: [malaysia], programs: ['MIS', 'UM', 'USM', 'UPM', 'UTM', 'Monash Malaysia', 'Nottingham Malaysia', 'Curtin Malaysia', "Taylor's"] },
  romania: { arrays: [romaniaMfa, romaniaUni], programs: ['MFA Non-EU', 'ARICE', 'Transilvania TAS', 'WUT Timișoara'] },
  russia: { arrays: [russia], programs: ['Open Doors', 'Rossotrudnichestvo Quota', 'SPbU Olympiad', 'MISIS/BMSTU/Federal Olympiads', 'MGIMO State-Funded', 'HSE Olympiad', 'Presidential Scholarship'] },
  'saudi-arabia': { arrays: [saudiMoe], programs: ['MOE Govt Scholarship', 'KSU', 'KAU', 'KFUPM', 'UQU', 'Islamic University Madinah', 'KAUST'] },
  qatar: { arrays: [qatar], programs: ['QU Graduate', 'QU Undergraduate', 'HBKU Master', 'HBKU PhD', 'Doha Institute', 'EAA Qatar'] },
};

// ── Assemble & write ─────────────────────────────────────────────────────────

// Degree level alias normalization (added 2026-06-18)
const DEGREE_ALIASES = {
  'College of Technology': 'Vocational',
  'Vocational / Diploma': 'Vocational',
  'Postdoc': 'Postdoctoral',
  'Professional Degree': 'Master',
};
function normalizeDegreeLevels(levels) {
  if (!Array.isArray(levels)) return levels;
  return Array.from(new Set(levels.map((d) => DEGREE_ALIASES[d] || d)));
}

// Provider string standardizations (added 2026-06-18)
const PROVIDER_RENAMES = [
  { from: /^Singapore A\*STAR(\s|$|\/)/, to: 'A*STAR / Singapore' },
];
function normalizeProvider(p) {
  if (typeof p !== 'string') return p;
  let out = p;
  for (const rule of PROVIDER_RENAMES) {
    out = out.replace(rule.from, rule.to);
  }
  if (out.includes('Education New Zealand')) {
    out = 'Education New Zealand / MFAT';
  }
  return out;
}

const scholarships = [...daad, ...mext, ...turkiye, ...chevening, ...australiaAwards, ...australiaUniversityScholarships, ...gks, ...singapore, ...eiffel, ...canada, ...astarNew, ...jasso, ...koica, ...cpra, ...studienstiftung, ...netherlands, ...gatesCambridge, ...clarendon, ...rhodes, ...fulbright, ...belgiumVlir, ...belgiumOther, ...erasmusMundus, ...chinaCsc, ...sweden, ...italy, ...hungary, ...taiwan, ...switzerland, ...austria, ...finland, ...newZealand, ...ireland, ...poland, ...spain, ...denmark, ...norway, ...hongKong, ...malaysia, ...commonwealth, ...knightHennessy, ...japanGlobal, ...daadLeadership, ...romaniaMfa, ...romaniaUni, ...russia, ...saudiMoe, ...qatar].map((s) => ({
  ...s,
  provider: normalizeProvider(s.provider),
  degree_levels: normalizeDegreeLevels(s.degree_levels),
  confidence_score: s.confidence_score ?? 0.95,
  source_file: s.source_file ?? null,
  amounts: s.amounts ?? [],
  application_period: s.application_period ?? [],
  application_process: s.application_process ?? [],
  important_dates: s.important_dates ?? [],
  deadline: s.deadline ?? null,
  program_type: s.program_type ?? null,
  requirements: {
    first_degree_required: s.requirements.first_degree_required ?? null,
    professional_experience_required: s.requirements.professional_experience_required ?? null,
    professional_experience_years: s.requirements.professional_experience_years ?? null,
    country_restrictions: s.requirements.country_restrictions ?? [],
    raw_items: s.requirements.raw_items ?? [],
  },
}));

const countryKeys = Object.keys(COUNTRY_PROGRAMS);

const output = {
  provider_groups: countryKeys.map(k => k.toUpperCase().replace(/-/g, '_')),
  provider_summaries: countryKeys.map(k => ({
    provider_group: k.toUpperCase().replace(/-/g, '_'),
    programs: COUNTRY_PROGRAMS[k].programs,
    scholarship_count: COUNTRY_PROGRAMS[k].arrays.reduce((sum, arr) => sum + arr.length, 0),
  })),
  scholarship_count: scholarships.length,
  scholarships,
};

const outPath = path.join(__dirname, '..', 'scholarships.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

// Log per-country counts
countryKeys.forEach(k => {
  const count = COUNTRY_PROGRAMS[k].arrays.reduce((sum, arr) => sum + arr.length, 0);
  const programs = COUNTRY_PROGRAMS[k].programs.join(', ');
  console.log(`  ${k}: ${count} [${programs}]`);
});
console.log(`\n✓ Written ${scholarships.length} scholarships to ${outPath}`);
console.log(`  Countries: ${countryKeys.length}`);


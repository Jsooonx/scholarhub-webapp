import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Romanian MFA + ARICE Shared Data ─────────────────────────────────────────────

const romaniaTrackComparison: TrackInfo[] = [
  {
    name: 'Romanian MFA Scholarship (MFA Route)',
    acceptanceRate: '500 awards/year globally for non-EU (highly competitive)',
    quota: 'Limited per sending country; Indonesia eligible',
    pros: [
      'Apply online via the Study in Romania portal - straightforward workflow',
      'All non-EU students eligible, no separate interview at the embassy stage',
      'Choose 2 Romanian public universities in order of preference (locked after submit)',
      'All education-related documents (only) need apostille during registration',
      '1-year Romanian language preparatory year provided free for non-speakers',
    ],
    cons: [
      'Stipend is very small: ~925 Lei/month (~€185 or ~$200). Enough for one month only if you get free dorm.',
      'Dorm availability varies by university - free, partial, or paid depending on each campus',
      'Romanian language is mandatory - no bypass even for English-taught programs',
      'Application is locked after submit - cannot add or change anything',
      'Results delayed historically (mid-July but can slip) - check your portal account, not just email',
    ],
    bestFor: 'Indonesians who want a fully-funded European degree and can self-fund living costs (stipend is symbolic)',
  },
  {
    name: 'Romanian ARICE Scholarship (ARICE Route)',
    acceptanceRate: 'Only 40 seats worldwide (extremely competitive)',
    quota: '40 awards globally per year',
    pros: [
      'Send application by EMAIL (not portal) with 3 specific annexes (1, 2, 3) all signed',
      'Priority fields: economics/business admin, agricultural sciences, technical sciences, oil & gas',
      'Selection is strictly merit-based - academic transcripts + strong letters of recommendation',
      'Coordinated with the Indonesian Embassy in Bucharest for documentation',
      'Same benefits as MFA: tuition + dorm + medical + transport + monthly stipend',
    ],
    cons: [
      'Only 40 seats worldwide - highly selective',
      'Recommendation letter MUST be from specific entities: ARICE economic rep in your country, embassy/consulate in Romania, or ARICE-backed economic entities (not any professor)',
      'Different deadline from MFA: usually May-June (vs MFA Feb-March)',
      'Email-based application - incomplete or late submissions automatically disqualified',
      'Same low stipend (~925 Lei/month) and dorm lottery',
    ],
    bestFor: 'Top-performing students in priority fields (economics, business, agriculture, engineering) with strong academic records and existing professional connections',
  },
];

const romaniaSocialLinks: SocialLink[] = [
  { label: 'KBRI Bucharest (Indonesian Embassy)', platform: 'instagram', handle: '@indonesiainbucharest', url: 'https://www.instagram.com/indonesiainbucharest/' },
  { label: 'PPI Romania (Indonesian Student Association)', platform: 'instagram', handle: '@ppi.rumania', url: 'https://www.instagram.com/ppi.rumania/' },
  { label: 'PPI Romania (Facebook)', platform: 'website', handle: 'PPI Romania', url: 'https://www.facebook.com/ppirromania/' },
  { label: 'Romanian Embassy in Jakarta', platform: 'instagram', handle: '@romaniainindonesia', url: 'https://www.instagram.com/romaniainindonesia/' },
  { label: 'Romanian Embassy Jakarta (Official Site)', platform: 'website', handle: 'jakarta.mae.ro', url: 'https://jakarta.mae.ro/en' },
  { label: 'Study in Romania Portal (MFA Application)', platform: 'website', handle: 'scholarships.studyinromania.gov.ro', url: 'https://scholarships.studyinromania.gov.ro' },
  { label: 'ARICE Official Site', platform: 'website', handle: 'arice.gov.ro', url: 'https://arice.gov.ro' },
];

const romaniaMfaStrategyTips: string[] = [
  'Indonesian applicants MUST go through the Study in Romania portal (scholarships.studyinromania.gov.ro) - not directly to a Romanian university',
  'Choose only 2 Romanian public universities in order of preference. Application is locked after submit - research both before submitting',
  'Apostille is ONLY required for education documents (diplomas, transcripts). Birth cert, passport, photos do NOT need apostille',
  'Mandatory 1-year Romanian language preparatory year for everyone (even for English-taught programs). No bypass.',
  'Plan to self-fund living costs. The ~925 Lei/month stipend (~€185 or ~$200) only covers basic needs if you get free dorm. Without dorm, you need €300-500/month from your own pocket.',
  'Dorm status varies by university - some give free dorm, some partial subsidy, some nothing. Check the specific university housing office before you apply.',
  'Choose cities wisely: Iași (€300-400/month) is most affordable, Bucharest (€500-700) is most expensive. Pick a program in a city you can afford.',
  'PhD applicants: contact a potential Romanian supervisor BEFORE March deadline. MFA provides zero help finding one. Securing their agreement in principle is your responsibility.',
  'Check your portal account for results, not just email. Results traditionally come mid-July but have been delayed in past cycles.',
];

const romaniaAriceStrategyTips: string[] = [
  'Apply via EMAIL to burse2026@arice.gov.ro (not via portal). Subject line: "ARICE Scholarship Application 2026 - [Your Full Name]"',
  'All 3 specific annexes MUST be filled, signed, and scanned as PDFs: Annex 1 (ARICE form), Annex 2 (Ministry of Education form), Annex 3 (self-declaration)',
  'Recommendation letter MUST come from specific entities: ARICE economic rep in your country, embassy/consulate in Romania, or ARICE-backed economic entities. NOT just any professor.',
  'Application window: 11 May - 12 June 2026 (different from MFA which is Feb-March). Incomplete or late submissions are automatically disqualified.',
  'Priority fields: economics/business admin, agricultural sciences, technical sciences, oil & gas. Other fields only if seats remain after priority placement.',
  'Selection is strictly merit-based - academic transcripts and strong recommendations. No interviews at this stage.',
  'ARICE has only 40 seats worldwide for all non-EU countries combined - including Indonesia. Highly competitive.',
  'All documents must be in PDF. Translations accepted in Romanian, English, or French only.',
  'Documents from Hague Convention countries need apostille. Non-Hague countries need superlegalization via Romanian embassy.',
];

const romaniaDifferentiators: { label: string; description: string }[] = [
  {
    label: 'Real Stipend: 925 Lei/Month (~€185 or ~$200)',
    description: 'The actual amount awardees receive is 925 Lei per month. Enough for basic needs ONLY if you get a free dorm. Without dorm, you need to self-fund €300-500/month from personal savings.',
  },
  {
    label: 'Dormitory Varies Per University (Not Guaranteed Free)',
    description: 'Each Romanian university decides its own dorm policy: some give free dorm, some partial subsidy, some nothing (you pay private rent €150-300/month). Check housing office before applying.',
  },
  {
    label: 'Apostille Only for Education Documents',
    description: 'Apostille is required ONLY for diplomas, transcripts, and birth certificate at the REGISTRATION phase. Passport copies, photos, and ID cards do NOT need apostille.',
  },
  {
    label: 'Mandatory Romanian Language Year',
    description: 'Even for English-taught programs, all non-Romanian speakers must complete 1-year preparatory language course before starting their degree. No bypass, no exemption (except B1 certificate or 4+ years in Romanian school).',
  },
  {
    label: '2-University Choice Limit',
    description: 'You can only choose 2 Romanian public universities in order of preference. Application is LOCKED after submit - cannot add or change anything later.',
  },
  {
    label: 'Two Separate Timelines (MFA vs ARICE)',
    description: 'MFA opens mid-February, deadline end of March, results mid-July. ARICE opens May, deadline mid-June, results September. Do not confuse them.',
  },
  {
    label: 'PhD Needs Supervisor in Advance',
    description: 'For PhD: must contact a Romanian doctoral school professor willing to sponsor you BEFORE the deadline. Both MFA and ARICE provide zero help finding supervisors.',
  },
  {
    label: 'All Stipends Stop in Summer (Bachelor/Master)',
    description: 'Bachelor and Master stipends stop during summer vacation (July-September). Only PhD and residency awardees receive year-round stipends.',
  },
  {
    label: 'Travel Costs NOT Covered',
    description: 'International flight to Romania AND domestic transport from arrival point to your university are NOT covered by the scholarship.',
  },
  {
    label: '30-Day Post-Graduation Coverage',
    description: 'All scholarship benefits continue for 30 days after graduation for programs lasting at least one year.',
  },
];


export const romaniaEnrichment: Record<string, EnrichmentData> = {
  // ── Romanian MFA Scholarship ──
  'romanian-government-mfa-scholarship-non-eu-citizens': {
    slug: 'romanian-government-mfa-scholarship-non-eu-citizens',
    tracks: romaniaTrackComparison,
    socialLinks: romaniaSocialLinks,
    strategyTips: romaniaMfaStrategyTips,
    differentiators: romaniaDifferentiators,
  },

  // ── Romanian ARICE Scholarship ──
  'romanian-government-arice-scholarship': {
    slug: 'romanian-government-arice-scholarship',
    tracks: romaniaTrackComparison,
    socialLinks: romaniaSocialLinks,
    strategyTips: romaniaAriceStrategyTips,
    differentiators: romaniaDifferentiators,
  },

};

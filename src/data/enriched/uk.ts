import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── UK Chevening Scholarship Shared Data ─────────────────────────────────────────────

const cheveningSocialLinks: SocialLink[] = [
  { label: 'Official Website (Indonesia)', platform: 'website', handle: 'chevening.org/indonesia', url: 'https://www.chevening.org/scholarship/indonesia/' },
  { label: 'Application Portal', platform: 'website', handle: 'chevening.org/apply', url: 'https://www.chevening.org/apply/' },
  { label: 'British Embassy Jakarta (Instagram)', platform: 'instagram', handle: '@ukindonesia', url: 'https://www.instagram.com/ukindonesia/' },
  { label: 'PPI United Kingdom (PPI UK)', platform: 'instagram', handle: '@ppiunitedkingdom', url: 'https://www.instagram.com/ppiunitedkingdom/' },
  { label: 'PPI UK Official Site', platform: 'website', handle: 'ppiuk.org', url: 'https://ppiuk.org/' },
];

const cheveningTrackComparison: TrackInfo[] = [
  {
    name: 'Standard 1-Year Master Pathway',
    quota: 'Around 50 - 70 awardees per year for Indonesia',
    pros: [
      'Fully funded: covers tuition fees (no cap for general, £22,000 cap for MBA), travel, and visa costs',
      'Provides a monthly living allowance (stipend) tailored for London or outside London',
      'No global English language test score required by Chevening itself (removed in 2020)',
      'Highly flexible work experience requirements: accepts voluntary work, internships, and freelance',
    ],
    cons: [
      'Extremely high competition: requires outstanding leadership and networking essays',
      'Wajib return to Indonesia for at least 2 years immediately after graduation (cannot work in the UK)',
      'Must secure at least one unconditional university offer (LoA) by mid-July',
      'Tuition fee for MBA courses is capped at £22,000 (awardees must fund any difference above this amount)',
    ],
    bestFor: 'Professionals, NGO leaders, entrepreneurs, and future change-makers with at least 2 years of work experience looking for a prestigious 1-year Master degree in the UK',
  },
];

const cheveningStrategyTips: string[] = [
  'Calculate your work experience hours precisely. You must have at least 2,800 hours. The system rejects applications automatically if the calculation is even slightly under.',
  'Your 4 essays (Leadership, Networking, Studying in the UK, Career Plan) are the ultimate filter. Ensure they form a cohesive story and link together logically.',
  'When writing about leadership and networking, use the STAR method (Situation, Task, Action, Result) and focus on your personal actions using "I" instead of "we".',
  'Choose your 3 university courses carefully. They must be similar in content and align with your career goals. You cannot change your course choices after submission.',
  'Start applying to your 3 chosen UK universities early. Getting an unconditional offer (LoA) can take months, and you must have one by mid-July.',
  'The selection interview at the British Embassy Jakarta is conducted in English. It is a panel format focusing on verifying your essays. Prepare mock interviews with alumni.',
];

const cheveningDifferentiators = [
  {
    label: '2,800-Hour Work Experience Gate',
    description: 'Applicants must have completed at least 2,800 hours of work experience (equivalent to ~2 years full-time) including part-time, internships, or volunteering.',
  },
  {
    label: 'No Global English Test Requirement',
    description: 'Chevening does not require proof of English proficiency for the scholarship itself, though candidates must still satisfy their chosen UK university requirements.',
  },
  {
    label: 'Four Fenced Essays Screening',
    description: 'Written selection is based entirely on four 500-word essays evaluating Leadership, Networking, UK Study Motivation, and a 10-year Career Plan.',
  },
];

// ── Gates Cambridge Shared Data ────────────────────────────────────────────────────

const gatesSocialLinks: SocialLink[] = [
  { label: 'Official Website (Gates Cambridge)', platform: 'website', handle: 'gatescambridge.org', url: 'https://www.gatescambridge.org/' },
  { label: 'Gates Cambridge (Instagram)', platform: 'instagram', handle: '@gatescambridge', url: 'https://www.instagram.com/gatescambridge/' },
  { label: 'PPI United Kingdom (Instagram)', platform: 'instagram', handle: '@ppiunitedkingdom', url: 'https://www.instagram.com/ppiunitedkingdom/' },
];

const gatesTrackComparison: TrackInfo[] = [
  {
    name: 'Gates Cambridge Scholarship',
    quota: 'Around 80 scholarships awarded globally each year',
    pros: [
      'Full cost of studying at Cambridge: covers university composition fee, maintenance allowance (~£20,000/year)',
      'Provides airfare, inbound visa costs, and NHS health surcharge covered in full',
      'Generous family/child allowance for scholars with dependent children',
      'Access to a highly prestigious global network of scholars and leaders',
    ],
    cons: [
      'Extremely competitive worldwide selection',
      'Requires departmental nomination from the University of Cambridge first',
      'Does not fund undergraduate, MBA, or part-time degrees (except specific PhD pilots)',
    ],
    bestFor: 'Outstanding international postgraduate students showing deep commitment to improving the lives of others',
  },
];

const gatesStrategyTips: string[] = [
  'Focus heavily on the 500-word Gates essay explaining your commitment to improving the lives of others. Emphasize social impact rather than repeating academic achievements.',
  'Choose your third referee strategically. They must write the Gates reference evaluating your leadership, character, and alignment with the scholarship\'s goals.',
  'Apply early! Your course application to Cambridge serves as the scholarship application, and you must meet the specific departmental funding deadlines (December/January).',
  'Prepare for a highly structured 20-25 minute panel interview. Practice explaining complex research projects to academics who are outside your specific discipline.',
];

const gatesDifferentiators = [
  {
    label: 'Gates Foundation Network',
    description: 'Fully funded by the Bill & Melinda Gates Foundation, offering unparalleled leadership development programs and global alumni connections.',
  },
  {
    label: 'Scholars with Families Support',
    description: 'One of the few top-tier awards offering comprehensive family allowances, funding up to £10,120 for the first child and £4,320 for the second.',
  },
];

// ── Clarendon Fund Shared Data ──────────────────────────────────────────────────────

const clarendonSocialLinks: SocialLink[] = [
  { label: 'Official Website (Clarendon)', platform: 'website', handle: 'ox.ac.uk/clarendon', url: 'https://www.ox.ac.uk/clarendon' },
  { label: 'Clarendon Oxford (Instagram)', platform: 'instagram', handle: '@clarendonoxford', url: 'https://www.instagram.com/clarendonoxford/' },
  { label: 'PPI United Kingdom (Instagram)', platform: 'instagram', handle: '@ppiunitedkingdom', url: 'https://www.instagram.com/ppiunitedkingdom/' },
];

const clarendonTrackComparison: TrackInfo[] = [
  {
    name: 'Clarendon Fund Scholarship',
    quota: 'Around 150-160 new scholarships awarded annually',
    pros: [
      'Covers full tuition and college fees at the University of Oxford',
      'Generous annual grant for living expenses (~£18,622/year for full-time students)',
      'No separate scholarship application form or fee is required',
      'Includes automatic membership in the exclusive Clarendon Scholar Association',
    ],
    cons: [
      'Extremely competitive: awarded strictly based on academic excellence and research potential',
      'Only available for graduate studies (Master\'s or DPhil/PhD) at Oxford',
    ],
    bestFor: 'Top-tier graduate applicants with outstanding academic records accepted at the University of Oxford',
  },
];

const clarendonStrategyTips: string[] = [
  'Apply for your graduate course at Oxford before the December or January deadline. Late applications are completely excluded from scholarship consideration.',
  'Ensure your research proposal and academic statement are of exceptional quality, as selection is based entirely on academic records and research potential.',
  'Secure strong academic references who can speak in detail about your research capabilities and intellectual independence.',
];

const clarendonDifferentiators = [
  {
    label: 'Automatic Consideration',
    description: 'Every applicant who submits their Oxford graduate course application before the January deadline is automatically evaluated for Clarendon.',
  },
  {
    label: 'Clarendon Scholar Association',
    description: 'Includes lifetime membership to a vibrant, scholar-led community organizing academic symposia, social events, and networking initiatives.',
  },
];

// ── Rhodes Scholarship Shared Data ──────────────────────────────────────────────────

const rhodesSocialLinks: SocialLink[] = [
  { label: 'Official Website (Rhodes Trust)', platform: 'website', handle: 'rhodeshouse.ox.ac.uk', url: 'https://www.rhodeshouse.ox.ac.uk/' },
  { label: 'Rhodes Trust (Instagram)', platform: 'instagram', handle: '@rhodes_trust', url: 'https://www.instagram.com/rhodes_trust/' },
  { label: 'PPI United Kingdom (Instagram)', platform: 'instagram', handle: '@ppiunitedkingdom', url: 'https://www.instagram.com/ppiunitedkingdom/' },
];

const rhodesTrackComparison: TrackInfo[] = [
  {
    name: 'Rhodes Scholarship',
    quota: 'Very limited quota per constituency (usually 1-2 per country/constituency)',
    pros: [
      'Covers all university and college fees at Oxford, plus a generous stipend (~£19,000/year)',
      'Covers student visa fees, NHS health surcharge, and two economy-class flights (to and from Oxford)',
      'Access to Rhodes House and an elite lifelong global network of alumni',
    ],
    cons: [
      'One of the most competitive scholarships in the world; requires outstanding character and leadership',
      'Requires a highly intensive multi-stage selection process and final panel interview',
    ],
    bestFor: 'Exceptional young leaders showing outstanding academic achievement, character, and commitment to service',
  },
];

const rhodesStrategyTips: string[] = [
  'Start early and draft your personal statement carefully. It must reflect your values, life path, and commitment to standing up for the world.',
  'Secure 5 to 6 referees who can speak comprehensively about your academic ability, leadership, character, and extra-curricular achievements.',
  'Prepare extensively for the rigorous final panel interview, which tests your ethical reasoning, leadership vision, and critical thinking on global issues.',
];

const rhodesDifferentiators = [
  {
    label: 'Oldest Global Postgraduate Award',
    description: 'First awarded in 1902, the Rhodes Scholarship stands as the most famous global fellowship, with alumni including world leaders and scientists.',
  },
  {
    label: 'Rhodes House Community',
    description: 'Scholars gain access to dedicated leadership retreats, forums, and workspace amenities at the historic Rhodes House in Oxford.',
  },
];


export const ukEnrichment: Record<string, EnrichmentData> = {
  // ── UK Chevening Scholarship ──
  'chevening-scholarship-indonesia': {
    slug: 'chevening-scholarship-indonesia',
    tracks: cheveningTrackComparison,
    trackSectionTitle: 'Scholarship Pathway',
    socialLinks: cheveningSocialLinks,
    strategyTips: cheveningStrategyTips,
    differentiators: cheveningDifferentiators,
  },

  // ── Gates Cambridge Scholarship ──
  'gates-cambridge-scholarship': {
    slug: 'gates-cambridge-scholarship',
    tracks: gatesTrackComparison,
    trackSectionTitle: 'Scholarship Pathway',
    socialLinks: gatesSocialLinks,
    strategyTips: gatesStrategyTips,
    differentiators: gatesDifferentiators,
  },

  // ── Clarendon Fund Scholarship ──
  'clarendon-fund-scholarship-university-of-oxford': {
    slug: 'clarendon-fund-scholarship-university-of-oxford',
    tracks: clarendonTrackComparison,
    trackSectionTitle: 'Scholarship Pathway',
    socialLinks: clarendonSocialLinks,
    strategyTips: clarendonStrategyTips,
    differentiators: clarendonDifferentiators,
  },

  // ── Rhodes Scholarship ──
  'rhodes-scholarship-university-of-oxford': {
    slug: 'rhodes-scholarship-university-of-oxford',
    tracks: rhodesTrackComparison,
    trackSectionTitle: 'Scholarship Pathway',
    socialLinks: rhodesSocialLinks,
    strategyTips: rhodesStrategyTips,
    differentiators: rhodesDifferentiators,
  },
};

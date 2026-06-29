import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Chinese Government Scholarship (CGS) Shared Data ─────────────────────────────────

const cgsSocialLinks: SocialLink[] = [
  { label: 'Official Website (CSC)', platform: 'website', handle: 'campuschina.org', url: 'https://www.campuschina.org' },
  { label: 'Application Portal (CSC System)', platform: 'website', handle: 'studyinchina.csc.edu.cn', url: 'https://studyinchina.csc.edu.cn/' },
  { label: 'Chinese Embassy in Jakarta', platform: 'website', handle: 'id.china-embassy.gov.cn', url: 'http://id.china-embassy.gov.cn/eng/' },
  { label: 'PPI Tiongkok (PPIT)', platform: 'instagram', handle: '@ppitiongkok', url: 'https://www.instagram.com/ppitiongkok/' },
  { label: 'PPIT Official Site', platform: 'website', handle: 'ppitiongkok.org', url: 'https://ppitiongkok.org/' },
];

const cgsTrackComparison: TrackInfo[] = [
  {
    name: 'Bilateral Program (Type A)',
    quota: 'Allocated per country via Chinese Embassy',
    pros: [
      'Agency Number for Indonesian applicants is 3602 (direct to Chinese Embassy Jakarta)',
      'Available for all degrees: Bachelor\'s (S1), Master\'s (S2), and Doctoral (S3)',
      '100% tuition waiver, comprehensive medical insurance, and free on-campus dormitory accommodation',
      'If Chinese language proficiency is low, a fully-funded 1-year Mandarin prep course is provided',
    ],
    cons: [
      'Does NOT cover international airfare: awardees must pay for their own flights to and from China',
      'Obtaining a Pre-Admission Letter from your target Chinese university is highly recommended to secure placement',
      'Age limits are strict: Bachelors under 25, Masters under 35, PhD under 40',
    ],
    bestFor: 'Outstanding students of all degree levels looking for full tuition and housing coverage in China, willing to self-fund their travel costs',
  },
];

const cgsStrategyTips: string[] = [
  'Input the correct Agency Number: 3602 for the Bilateral Program (Type A) via the Chinese Embassy in Jakarta. Entering a wrong number will lead to automatic disqualification.',
  'Getting a Pre-Admission Letter from your target Chinese university beforehand is highly recommended. It guarantees you will be placed in that university; without it, you may get placed randomly or rejected.',
  'For Chinese-taught programs: you must submit HSK certificates (minimum HSK 3 for Bachelors, HSK 4 for Masters/PhD). If your level is low but you are accepted, you must take a 1-year preparatory Chinese course.',
  'For English-taught programs: submit IELTS/TOEFL scores according to your target university\'s specific requirements. No HSK is required.',
  'Be prepared to buy your own flights: CGS Bilateral Program does not cover international airfare to/from China.',
  'The selection interview by the Embassy panel (3-5 members) lasts 15-30 minutes. Be ready to explain your Study Plan/Research Proposal in detail in English or Chinese.',
];

const cgsDifferentiators = [
  {
    label: 'Pre-Admission Letter Priority',
    description: 'While technically optional, securing a Pre-Admission Letter from your target Chinese university beforehand is critical to guarantee your placement.',
  },
  {
    label: 'No Flight Coverage (Bilateral)',
    description: 'Unlike MEXT or AAS, CGS Bilateral Program (Type A) does not cover international airfare. Awardees must fund their own flights to/from China.',
  },
  {
    label: '1-Year Preparatory Mandarin Course',
    description: 'Admitted students with low HSK scores for Chinese-taught programs receive 1 year of fully-funded Mandarin preparation before starting their main major.',
  },
];


export const chinaEnrichment: Record<string, EnrichmentData> = {
  // ── Chinese Government Scholarship ──
  'chinese-government-scholarship-cgs-bilateral-program': {
    slug: 'chinese-government-scholarship-cgs-bilateral-program',
    tracks: cgsTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: cgsSocialLinks,
    strategyTips: cgsStrategyTips,
    differentiators: cgsDifferentiators,
  },

};

import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── GKS Enrichment ─────────────────────────────────────────────────────────────────

const gksTrackComparison: TrackInfo[] = [
  {
    name: 'Embassy Track',
    acceptanceRate: '~2% (for Indonesian quota)',
    quota: '~3-4 seats per year for Indonesia',
    pros: [
      'Choose up to 3 universities with the same field of study',
      'Ideal for targeting SKY universities (Seoul National, Korea, Yonsei)',
      'Structured process guided by the Korean Embassy in Jakarta',
    ],
    cons: [
      'Extremely competitive - acceptance rate only ~2%',
      'Must compete with all Indonesian applicants for limited seats',
      'Longer and more rigorous selection process',
    ],
    bestFor: 'Applicants with very strong academic profiles targeting top SKY universities',
  },
  {
    name: 'University Track',
    acceptanceRate: '~6% (3x higher than Embassy Track)',
    quota: 'Varies per university (regional quota available)',
    pros: [
      'Acceptance rate 3x higher (~6% vs ~2%)',
      'University Track R&D: for STEM Master/PhD - 25 universities, no Korean language test required',
      'University Track Global Network: Humanities/Social Sciences Master - taught in English, no Korean language year required',
      'Regional quota: universities outside Seoul (Busan, Daegu, Gwangju) are easier to get into',
    ],
    cons: [
      'Can only apply to 1 university',
      'Must research universities independently - no centralized guide',
      'SKY universities (Seoul, Korea, Yonsei) remain highly competitive even on this track',
    ],
    bestFor: 'Applicants flexible with university choice seeking higher acceptance odds, especially for non-SKY universities',
  },
];

const gksSocialLinks: SocialLink[] = [
  { label: 'Beasiswa Korea (scholarship community)', platform: 'instagram', handle: '@beasiswakorea', url: 'https://www.instagram.com/beasiswakorea/' },
  { label: 'GKS Scholarship Info', platform: 'instagram', handle: '@gks.scholarship', url: 'https://www.instagram.com/gks.scholarship/' },
  { label: 'Study in Korea (Official)', platform: 'website', handle: 'studyinkorea.go.kr', url: 'https://www.studyinkorea.go.kr' },
  { label: 'NIIED (National Institute for International Education)', platform: 'website', handle: 'niied.go.kr', url: 'https://www.niied.go.kr' },
];

const gksStrategyTips: string[] = [
  'Choose the right track for your profile: Embassy for targeting SKY, University for higher odds at non-SKY',
  'Your personal statement must demonstrate IMPACT - judges look for future leaders, not just high achievers',
  'Prepare documents well in advance. Rushing overnight leads to incomplete applications',
  'For University Track R&D (STEM Master/PhD): no Korean required. Focus on your research proposal.',
  'For University Track Global Network (Humanities/Social Sciences Master): taught in English, no mandatory Korean language year',
  'If choosing Embassy Track, use a 3-choice strategy: 1 safety + 1 realistic + 1 dream - same field of study for all',
];

const gksDifferentiators: { label: string; description: string }[] = [
  {
    label: '1 Year Intensive Korean Language Training',
    description: 'All GKS recipients (except Global Network) receive 1 full year of Korean language training. Target: TOPIK Level 3 for Bachelor, TOPIK 3-4 for Master/PhD.',
  },
  {
    label: 'Two Specialization Tracks for Graduate',
    description: 'R&D Track (STEM, 25 universities, no Korean test) and Global Network Track (Humanities, English-taught, no language year). Choose based on your needs.',
  },
  {
    label: 'Round-Trip Airfare & Settlement Allowance',
    description: 'One-time economy class round-trip ticket (arrival and after graduation). Plus KRW 200,000 settlement allowance on arrival and KRW 100,000 completion allowance.',
  },
  {
    label: 'Per-Semester Research Support',
    description: 'Master/PhD: research allowance of KRW 210,000-240,000 per semester to support your research and publications.',
  },
];


export const koreaEnrichment: Record<string, EnrichmentData> = {
  // ── GKS Undergraduate ──
  'gks-undergraduate-scholarship-global-korea-scholarship-bachelors': {
    slug: 'gks-undergraduate-scholarship-global-korea-scholarship-bachelors',
    tracks: gksTrackComparison,
    socialLinks: gksSocialLinks,
    strategyTips: [
      ...gksStrategyTips,
      'For Bachelor: maximize your report card grades (minimum 80%). GPA is the first filter.',
      'Embassy Track for Bachelor: no written exam - selection is purely based on documents + interview',
      'Choose a major aligned with your vision for contributing to Indonesia - this is what judges look for',
    ],
    differentiators: gksDifferentiators,
  },

  // ── GKS Graduate ──
  'gks-graduate-scholarship-global-korea-scholarship-masters-phd': {
    slug: 'gks-graduate-scholarship-global-korea-scholarship-masters-phd',
    tracks: gksTrackComparison,
    socialLinks: gksSocialLinks,
    strategyTips: [
      ...gksStrategyTips,
      'For Master/PhD: choose your specialization track wisely - R&D for STEM without Korean, Global Network for Humanities in English',
      'Your research proposal must be solid - this is the most discussed topic during interviews',
      'If you complete a GKS Master, you can also apply for a GKS PhD afterward - many awardees follow this path',
    ],
    differentiators: gksDifferentiators,
  },

};

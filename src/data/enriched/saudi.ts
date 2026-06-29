import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Saudi Government Scholarship (Study in Saudi) Shared Data ────────────────────────

const saudiSocialLinks: SocialLink[] = [
  { label: 'Official Website (Study in Saudi)', platform: 'website', handle: 'studyinsaudi.moe.gov.sa', url: 'https://studyinsaudi.moe.gov.sa' },
  { label: 'PPMI Arab Saudi (Instagram)', platform: 'instagram', handle: '@ppmisaudi', url: 'https://www.instagram.com/ppmisaudi/' },
  { label: 'PPMI Arab Saudi (Official Site)', platform: 'website', handle: 'ppmi.or.id', url: 'https://ppmi.or.id/' },
];

const saudiTrackComparison: TrackInfo[] = [
  {
    name: 'Unified Study in Saudi Program',
    quota: 'Highly competitive with generous benefits',
    pros: [
      '100% tuition waiver, free dormitory housing, and comprehensive free medical care',
      'Provides a free annual return flight ticket to home country (unlike CGS and Russia Quota)',
      'No application fees - entirely free to apply through the unified government portal',
      'Provides a settling-in allowance (2 months\' stipend) and graduation shipping allowance (3 months\' stipend)',
    ],
    cons: [
      'Strict age limits: Bachelors 17-25 years, Masters max 30 years, PhD max 35 years',
      'Strict mahram requirement for female students (must be accompanied by a male guardian residing in KSA)',
      'For Islamic studies/Arabic courses, classes are taught entirely in Arabic (requires passing a language prep course if not fluent)',
      'All uploaded documents must be translated into Arabic or English by a certified translator',
    ],
    bestFor: 'Muslim and non-Muslim students (depending on university location) of eligible age seeking full tuition, flight, and housing coverage in public Saudi universities',
  },
];

const saudiStrategyTips: string[] = [
  'Apply through the official Study in Saudi portal (studyinsaudi.moe.gov.sa). Choose your 3 public universities strategically based on your major and eligibility.',
  'Adhere strictly to the age limits: 17-25 for S1/Bachelors, max 30 for S2/Masters, and max 35 for S3/PhD. Applications exceeding these limits are filtered out automatically.',
  'Female applicants must ensure they satisfy the mahram requirement. A male guardian (mahram) must either be a scholarship recipient in KSA, have an Iqama (residency), or work under a Saudi employer.',
  'Translate all documents (transcripts, birth certificate, medical health check, SKCK/police clearance) into Arabic or English using a certified official translator.',
  'Follow PPMI Arab Saudi (@ppmisaudi) on social media. They release highly detailed, step-by-step PDF guidebooks every year detailing exact portal questions and documentation requirements.',
  'If you choose Islamic Studies or Sharia, be prepared for an Arabic-language selection interview (Muqobalah). If you choose science/engineering, the interview will be in English.',
];

const saudiDifferentiators = [
  {
    label: 'Annual Return Flight Ticket',
    description: 'Unlike many other state scholarships, Saudi Government covers a free economy-class return flight ticket to Indonesia every single academic year.',
  },
  {
    label: 'Unified Portal Placement',
    description: 'Applicants apply once on the central Study in Saudi portal and can select up to 3 public universities, with the Ministry managing the final admissions routing.',
  },
  {
    label: 'Strict Mahram Regulation',
    description: 'Under Saudi educational guidelines, female international students are required to have a male guardian (mahram) legally residing in Saudi Arabia.',
  },
];


export const saudiEnrichment: Record<string, EnrichmentData> = {
  // ── Saudi Government Scholarship (Bachelor's) ──
  'saudi-government-scholarship-bachelors-study-in-saudi-arabia': {
    slug: 'saudi-government-scholarship-bachelors-study-in-saudi-arabia',
    tracks: saudiTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: saudiSocialLinks,
    strategyTips: saudiStrategyTips,
    differentiators: saudiDifferentiators,
  },

  // ── Saudi Government Scholarship (Master's) ──
  'saudi-government-scholarship-masters-study-in-saudi-arabia': {
    slug: 'saudi-government-scholarship-masters-study-in-saudi-arabia',
    tracks: saudiTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: saudiSocialLinks,
    strategyTips: saudiStrategyTips,
    differentiators: saudiDifferentiators,
  },

  // ── Saudi Government Scholarship (PhD) ──
  'saudi-government-scholarship-phd-study-in-saudi-arabia': {
    slug: 'saudi-government-scholarship-phd-study-in-saudi-arabia',
    tracks: saudiTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: saudiSocialLinks,
    strategyTips: saudiStrategyTips,
    differentiators: saudiDifferentiators,
  },
};

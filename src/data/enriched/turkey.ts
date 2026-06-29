import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Turkey Government Scholarship Shared Data ───────────────────────────────────────

const turkeyTrackComparison: TrackInfo[] = [
  {
    name: 'Stage 1: Document & Expert Evaluation',
    acceptanceRate: 'Highly competitive (150,000+ global applicants)',
    quota: '70 - 100 awardees per year for Indonesia',
    pros: [
      '100% free online application via TBBS portal',
      'Choose up to 12 study programs & universities in one application',
      'No English certificate required if choosing Turkish-taught programs',
    ],
    cons: [
      'Extremely high global competition makes screening highly selective',
      'Strict age limits: Bachelors max 21, Masters max 30, PhD max 35',
      'Subjective evaluation heavily weighs Letter of Intent and reference letters',
    ],
    bestFor: 'Applicants with strong academic records and active community/social involvement',
  },
  {
    name: 'Stage 2: Quantitative Academic Test',
    acceptanceRate: 'Shortlisted candidates only',
    quota: 'Determines interview qualification',
    pros: [
      'Only required for STEM (Engineering, Science) and Health Sciences',
      'Basic quantitative subjects (Mathematics, Geometry, Logic)',
    ],
    cons: [
      'Held at the interview venue right before the oral interview starts',
      'Short time limit to complete 30 questions',
    ],
    bestFor: 'STEM and Medical applicants with solid high school math and logical reasoning skills',
  },
  {
    name: 'Stage 3: Panel Interview (Final Selection)',
    acceptanceRate: 'Roughly 10-15% of interviewed candidates',
    quota: 'Final seat allocation per country',
    pros: [
      'Direct interaction with YTB committee and Turkish university professors',
      'Opportunity for S2/S3 candidates to defend their research plans directly',
    ],
    cons: [
      'Conducted strictly in English or Turkish (no translator provided)',
      'STEM/Medical candidates may be asked to solve math/science problems on a board',
    ],
    bestFor: 'Candidates with excellent communication skills and clear future goals',
  },
];

const turkeySocialLinks: SocialLink[] = [
  { label: 'Official Website', platform: 'website', handle: 'turkiyeburslari.gov.tr', url: 'https://www.turkiyeburslari.gov.tr' },
  { label: 'Application Portal (TBBS)', platform: 'website', handle: 'tbbs.turkiyeburslari.gov.tr', url: 'https://tbbs.turkiyeburslari.gov.tr/' },
  { label: 'PPI Turki (Indonesian Students)', platform: 'instagram', handle: '@ppiturki', url: 'https://www.instagram.com/ppiturki/' },
  { label: 'Kobi Education (Turkey Prep)', platform: 'instagram', handle: '@kobieducation', url: 'https://www.instagram.com/kobieducation/' },
];

const turkeyStrategyTips: string[] = [
  'Do not choose only top-tier universities in Istanbul/Ankara for all 12 choices. Mix in regional universities to boost placement odds.',
  'Your Letter of Intent (LoI) is extremely critical since there is no separate university application. Match your profile to university choices.',
  'For S1 and STEM applicants: refresh basic math, geometry, and algebra concepts as you may be asked to solve problems during the interview.',
  'Obtain recommendation letters from professors or figures with high academic or professional titles, as YTB values these highly.',
  'Turkish language prep year (TÖMER) is 100% mandatory for all awardees, even if your chosen study program is fully in English.',
  'Undergraduate stipend is 4,500 TRY/month, Masters is 6,500 TRY/month, and PhD is 9,000 TRY/month. Academically outstanding students can receive merit stipends up to 2x higher.',
  'The scholarship covers free KYK state dorms. If you choose to live outside, you must fund your own housing; YTB does not give rent allowance.',
  'stipends continue year-round (12 months), unlike some programs that pause during summer vacation.',
];

const turkeyDifferentiators: { label: string; description: string }[] = [
  {
    label: 'Mandatory 1-Year Turkish Prep (TÖMER)',
    description: 'All scholarship holders must complete a 1-year Turkish language preparatory year, even if their course of study is taught entirely in English.',
  },
  {
    label: 'University & Dorm Placement Included',
    description: 'YTB handles both university admissions and state-run dormitory (KYK) assignments directly. No separate university applications are required.',
  },
  {
    label: 'Academically Tiered Merit Scholarships',
    description: 'Outstanding students with top-tier test scores (SAT/GRE) or publications can qualify for Merit Scholarships providing up to 2x the standard monthly stipend.',
  },
  {
    label: '12 University Choice Placements',
    description: 'Applicants choose up to 12 public universities. Placements are determined centrally by YTB and are final.',
  },
  {
    label: 'Full Year Stipend Coverage',
    description: 'Monthly allowances are paid consistently for all 12 months of the year, including the summer holidays (July-September).',
  },
];


export const turkeyEnrichment: Record<string, EnrichmentData> = {
  // ── Turkey Government Scholarship ──────────────────────────────────────────────────
  'trkiye-burslari-bachelors-scholarship-program': {
    slug: 'trkiye-burslari-bachelors-scholarship-program',
    tracks: turkeyTrackComparison,
    trackSectionTitle: 'Key Selection Stages',
    socialLinks: turkeySocialLinks,
    strategyTips: turkeyStrategyTips,
    differentiators: turkeyDifferentiators,
  },

  // ── Turkey Government Scholarship (Master's) ──
  'trkiye-burslari-graduate-scholarship-program-masters': {
    slug: 'trkiye-burslari-graduate-scholarship-program-masters',
    tracks: turkeyTrackComparison,
    trackSectionTitle: 'Key Selection Stages',
    socialLinks: turkeySocialLinks,
    strategyTips: turkeyStrategyTips,
    differentiators: turkeyDifferentiators,
  },

  // ── Turkey Government Scholarship (PhD) ──
  'trkiye-burslari-graduate-scholarship-program-phd': {
    slug: 'trkiye-burslari-graduate-scholarship-program-phd',
    tracks: turkeyTrackComparison,
    trackSectionTitle: 'Key Selection Stages',
    socialLinks: turkeySocialLinks,
    strategyTips: turkeyStrategyTips,
    differentiators: turkeyDifferentiators,
  },

};

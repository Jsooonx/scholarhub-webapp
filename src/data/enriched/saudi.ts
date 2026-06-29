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

// ── KAUST Fellowship Shared Data ───────────────────────────────────────────────────

const kaustSocialLinks: SocialLink[] = [
  { label: 'Official Website (KAUST)', platform: 'website', handle: 'kaust.edu.sa', url: 'https://www.kaust.edu.sa/en' },
  { label: 'Admissions Portal', platform: 'website', handle: 'admissions.kaust.edu.sa', url: 'https://admissions.kaust.edu.sa/' },
  { label: 'KAUST Official (Instagram)', platform: 'instagram', handle: '@kaustofficial', url: 'https://www.instagram.com/kaustofficial/' },
  { label: 'PPMI Arab Saudi (Instagram)', platform: 'instagram', handle: '@ppmisaudi', url: 'https://www.instagram.com/ppmisaudi/' },
];

const kaustTrackComparison: TrackInfo[] = [
  {
    name: 'KAUST MS/PhD Fellowship',
    quota: 'Awarded automatically to all admitted graduate students',
    pros: [
      'Full tuition waiver and free on-campus townhouse/apartments housing (fully furnished, utilitas gratis)',
      'Highly competitive monthly stipend: ~$20,000/year for MS, and $25,000–$30,000/year for PhD (tax-free)',
      'Premium medical and dental insurance coverage with zero co-pay',
      'Covers relocation allowance, visa fees, and annual return flights to home country',
    ],
    cons: [
      'Limited strictly to STEM (Science, Technology, Engineering, Mathematics) majors only',
      'Rigorous academic requirements and highly competitive global selection',
      'Requires candidate matching with a faculty advisor (Professor) for admission',
    ],
    bestFor: 'Outstanding STEM students seeking world-class research facilities and top-tier financial coverage',
  },
];

const kaustStrategyTips: string[] = [
  'Identify and contact a potential advisor (Professor) early. Send a professional email with your CV and a well-structured research proposal that aligns with their lab\'s active projects.',
  'Verify your academic transcripts and convert your GPA to the standard US scale (4.0) if possible. High GPA and previous research publications strongly boost your profile.',
  'Prepare for a two-stage interview: a highly technical interview with the faculty member/professor, followed by a soft-skills/cultural fit interview with the KAUST Admissions Office.',
  'Submit a strong Quantitative GRE score (minimum 85th percentile recommended) if applying to competitive computer science, electrical, or physical engineering programs.',
  'Obtain a minimum score of TOEFL iBT 81 or IELTS 6.5. This is a strict English language requirement for KAUST admissions.',
];

const kaustDifferentiators = [
  {
    label: 'Highest Tax-Free Stipend',
    description: 'KAUST Fellowship offers one of the most generous tax-free graduate stipends worldwide ($20,000–$30,000 USD/year) alongside free residential townhouse housing.',
  },
  {
    label: 'Resort-Style Red Sea Campus',
    description: 'Located in Thuwal along the coast of the Red Sea, the private self-contained campus offers advanced laboratory facilities, sports centers, and recreational marinas.',
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

  // ── KAUST Fellowship ──
  'king-abdullah-university-of-science-technology-kaust-fellowship': {
    slug: 'king-abdullah-university-of-science-technology-kaust-fellowship',
    tracks: kaustTrackComparison,
    trackSectionTitle: 'Fellowship Pathway',
    socialLinks: kaustSocialLinks,
    strategyTips: kaustStrategyTips,
    differentiators: kaustDifferentiators,
  },
};

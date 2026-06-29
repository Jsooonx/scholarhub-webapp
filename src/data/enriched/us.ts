import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── US Fulbright Scholarship Shared Data ─────────────────────────────────────────────

const fulbrightSocialLinks: SocialLink[] = [
  { label: 'Official Website (AMINEF)', platform: 'website', handle: 'aminef.or.id', url: 'https://www.aminef.or.id' },
  { label: 'AMINEF Indonesia (Instagram)', platform: 'instagram', handle: '@aminef.indonesia', url: 'https://www.instagram.com/aminef.indonesia/' },
  { label: 'PERMIAS Nasional (US Students)', platform: 'instagram', handle: '@permias.nasional', url: 'https://www.instagram.com/permias.nasional/' },
  { label: 'PERMIAS Official Site', platform: 'website', handle: 'permias.org', url: 'https://www.permias.org/' },
  { label: 'IIE Fulbright US Placement Support', platform: 'website', handle: 'foreign.fulbrightonline.org', url: 'https://foreign.fulbrightonline.org/' },
];

const fulbrightTrackComparison: TrackInfo[] = [
  {
    name: 'Fulbright Master\'s Degree Scholarship',
    quota: 'Highly popular with competitive selection',
    pros: [
      'Allows initial application with paper-based TOEFL ITP (minimum 550) - no expensive IELTS needed upfront',
      'No university offer (LoA) needed: AMINEF & IIE handle all university applications on your behalf',
      'Fully funded: tuition fees, monthly living allowance, international airfare, and visa sponsorship',
      'AMINEF covers all costs for post-selection tests (TOEFL iBT, GRE/GMAT vouchers)',
    ],
    cons: [
      'Requires a minimum GPA of 3.0 / 4.0',
      'Strict two-year home residency requirement (Visa J-1 rule): must return and stay in Indonesia for 2 years post-study',
      'Course length is capped at a maximum of 2 years (standard US Master duration)',
    ],
    bestFor: 'S1 graduates or professionals in Indonesia with a GPA of 3.0+ who want full placement support and a fully-funded Master degree in the US',
  },
  {
    name: 'Fulbright Doctoral (PhD) Scholarship',
    quota: 'Limited seats for academic researchers',
    pros: [
      'Allows initial application with TOEFL ITP (minimum 575) instead of IELTS/TOEFL iBT',
      'AMINEF & IIE manage all US university admissions, securing tuition waivers and sponsorships',
      '3 full years of funding for doctoral research in the US',
      'Fully paid test vouchers for TOEFL iBT, GRE, or GMAT for shortlisted candidates',
    ],
    cons: [
      'Very high academic standards (outstanding research proposal and Master academic transcripts)',
      'Requires a minimum GPA of 3.0 / 4.0 from your Master degree',
      'Strict J-1 visa rule: must return to Indonesia immediately and live there for at least 2 years',
    ],
    bestFor: 'Lecturers, researchers, and PhD candidates in Indonesia who want to access world-class research facilities in the United States',
  },
];

const fulbrightStrategyTips: string[] = [
  'You can apply using a TOEFL ITP score (minimum 550 for Masters, 575 for PhD). This is a huge money-saver since you do not need TOEFL iBT or IELTS for the initial application.',
  'Your essays (Study Objective and Personal Statement) are the primary screening materials. Ensure your Study Objective explains your research/study goals in the US clearly, and your Personal Statement tells your authentic life story.',
  'You do NOT need to apply to US universities beforehand. AMINEF and the Institute of International Education (IIE) in the US handle all university submissions for you after you are selected.',
  'If you are selected as a finalist (Principal Candidate), AMINEF will fully fund and organize your official TOEFL iBT, GRE, or GMAT test vouchers.',
  'Prepare for the 4-panel interview (AMINEF staff, alumni, and academic experts). Be ready to explain why your study MUST be done in the US, and how it will contribute to Indonesia.',
  'Fulbright uses J-1 Exchange Visitor visas, which carry a strict "two-year home country residency" rule. You must return to Indonesia and reside there for at least 2 years before you can change status to work/immigrate in the US.',
];

const fulbrightDifferentiators = [
  {
    label: 'Initial TOEFL ITP Allowed',
    description: 'Fulbright is one of the few top-tier scholarships that accepts the low-cost paper-based TOEFL ITP for initial screening, saving applicants test fees.',
  },
  {
    label: 'Done-For-You Placement (IIE)',
    description: 'Awardees do not need to apply to US universities themselves. AMINEF and IIE submit applications and negotiate funding with 4-5 US universities on your behalf.',
  },
  {
    label: 'Two-Year Visa J-1 Home Rule',
    description: 'Under US J-1 visa regulations, awardees are legally obligated to return to Indonesia and live/work there for 2 years before being eligible for US work/immigrant visas.',
  },
];


export const usEnrichment: Record<string, EnrichmentData> = {
  // ── Fulbright Master's Degree Scholarship ──
  'fulbright-masters-degree-scholarship': {
    slug: 'fulbright-masters-degree-scholarship',
    tracks: fulbrightTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: fulbrightSocialLinks,
    strategyTips: fulbrightStrategyTips,
    differentiators: fulbrightDifferentiators,
  },

  // ── Fulbright Doctoral (PhD) Scholarship ──
  'fulbright-doctoral-degree-phd-scholarship': {
    slug: 'fulbright-doctoral-degree-phd-scholarship',
    tracks: fulbrightTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: fulbrightSocialLinks,
    strategyTips: fulbrightStrategyTips,
    differentiators: fulbrightDifferentiators,
  },

};

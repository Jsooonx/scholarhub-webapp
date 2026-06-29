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

};

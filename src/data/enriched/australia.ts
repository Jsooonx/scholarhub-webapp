import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Australia Awards Scholarships (AAS) Shared Data ─────────────────────────────────

const aasSocialLinks: SocialLink[] = [
  { label: 'Official Website (Indonesia)', platform: 'website', handle: 'australiaawardsindonesia.org', url: 'https://www.australiaawardsindonesia.org' },
  { label: 'Official Portal (OASIS)', platform: 'website', handle: 'oasis.dfat.gov.au', url: 'https://oasis.dfat.gov.au/' },
  { label: 'Australia Awards Indonesia (Instagram)', platform: 'instagram', handle: '@australiaawardsinindonesia', url: 'https://www.instagram.com/australiaawardsinindonesia/' },
  { label: 'PPI Australia (PPIA)', platform: 'instagram', handle: '@ppiaustralia', url: 'https://www.instagram.com/ppiaustralia/' },
  { label: 'PPI Australia (Official Site)', platform: 'website', handle: 'ppiaustralia.org', url: 'https://ppiaustralia.org/' },
];

const aasTrackComparison: TrackInfo[] = [
  {
    name: 'Equity Target Groups (ETG)',
    quota: 'Priority allocation for geographical & social equity',
    pros: [
      'Extremely flexible English requirements: apply with IELTS 4.5 (Masters) or 6.0 (PhD)',
      'Lower academic requirements (minimum GPA of 2.75 / 4.0)',
      'Strongly targeted for individuals with disabilities, women from target areas, and residents of 15 equity provinces',
      'Receive full Pre-Departure Training (PDT) and intensive English (EAP) preparation for up to 9 months with full stipend',
    ],
    cons: [
      'Must provide formal proof of residency/belonging to the targeted equity groups or provinces',
      'Requires long-term commitment to PDT in Indonesia before departure (up to 9 months if English needs improvement)',
    ],
    bestFor: 'Outstanding candidates from targeted equity provinces, women from target areas, and applicants with disabilities who need strong language/academic prep support',
  },
  {
    name: 'Government of Indonesia (GoI) Category',
    quota: 'Dedicated allocation for civil servants',
    pros: [
      'Moderate English requirements: apply with IELTS 6.0 (Masters/PhD)',
      'GPA requirement of 2.75 / 4.0',
      'Strong institutional support and nomination from local/national government ministries',
      'Includes fully-funded Pre-Departure Training (PDT) with monthly stipend in Indonesia',
    ],
    cons: [
      'Must obtain official endorsement and nomination letters from the sponsoring government agency',
      'Limited to active civil servants (PNS/ASN) in public sector roles',
    ],
    bestFor: 'Active civil servants (PNS) who want to acquire advanced public policy, governance, or technical degrees to drive development in their respective ministries/regions',
  },
  {
    name: 'Non-Targeted (NT) Category / General Public',
    quota: 'Open competition',
    pros: [
      'Open to all Indonesian citizens working in the private sector, NGOs, startups, or fresh graduates',
      'No institutional nomination letters required from the government',
      'Includes standard Pre-Departure Training (PDT) in Indonesia with living allowance before departure',
    ],
    cons: [
      'Highest entry requirements: minimum GPA 2.90 and minimum IELTS 6.0 (Masters) or 6.5 (PhD)',
      'Highly competitive due to the massive volume of private sector and general public applicants',
    ],
    bestFor: 'Professionals in the private sector, NGO leaders, entrepreneurs, and academics seeking to drive societal/economic change in Indonesia',
  },
];

const aasStrategyTips: string[] = [
  'Focus heavily on the "Development Impact" essays. Explain a specific developmental problem in Indonesia and connect it directly to your chosen course of study and future return plans.',
  'Standard English requirements (IELTS 6.0 for Masters, 6.5 for PhD) are lower for Targeted/Equity groups (down to IELTS 4.5 for S2 ETG). Use this to apply early even if your English is still developing.',
  'The selection interview by the Joint Selection Team (JST) is conducted by 1 Australian academic and 1 Indonesian academic. Prepare to articulate your goals and proposed study clearly in spoken English.',
  'For PhD applicants: you must present your research proposal for 10 minutes at the start of the interview. Ensure your slides are clear, academic, and highlight development relevance.',
  'Successful applicants undergo mandatory Pre-Departure Training (PDT) in Indonesia (at IALF Bali, Jakarta, or Surabaya). You receive a monthly stipend during training, and accommodation/travel are fully paid.',
  'AAS requires returning to Indonesia immediately upon completing your study. You are barred from applying for another Australian visa (except tourist/short business) for 2 years after return.',
];

const aasDifferentiators = [
  {
    label: 'Mandatory Pre-Departure Training (PDT)',
    description: 'Awardees receive 1 to 9 months of fully-funded academic English and adaptation training in Indonesia with a monthly stipend before departure.',
  },
  {
    label: 'Joint Selection Team (JST) Panel',
    description: 'Wawancara is conducted in English by a balanced panel consisting of one Australian expert and one Indonesian expert to assess development alignment.',
  },
  {
    label: '2-Year Immediate Return Rule',
    description: 'To ensure development impact, awardees must return to Indonesia immediately and are restricted from working or living in Australia for 2 years post-graduation.',
  },
];


export const australiaEnrichment: Record<string, EnrichmentData> = {
  // ── Australia Awards Scholarships (AAS) ──
  'australia-awards-scholarships-phd-masters-indonesia': {
    slug: 'australia-awards-scholarships-phd-masters-indonesia',
    tracks: aasTrackComparison,
    trackSectionTitle: 'Applicant Categories',
    socialLinks: aasSocialLinks,
    strategyTips: aasStrategyTips,
    differentiators: aasDifferentiators,
  },

};

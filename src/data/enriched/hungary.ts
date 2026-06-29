import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Stipendium Hungaricum Shared Data ──────────────────────────────────────────────

const stipendiumTrackComparison: TrackInfo[] = [
  {
    name: 'Stage 1: Sending Partner Nomination',
    acceptanceRate: 'Varies by partner (~5-10 awardees/year for Indonesia)',
    quota: 'Limited Indonesian quota via Kemendiktisaintek',
    pros: [
      'Direct bilateral nomination through Kemendiktisaintek - no separate embassy application',
      'Allowed to choose 2 study programs out of 800+ offered across Hungary',
      'Many programs taught in English, no Hungarian language required upfront',
      'Most programs do not require IELTS/TOEFL if previous degree was in English',
    ],
    cons: [
      'Must be selected by Kemendiktisaintek first before applying to Tempus Public Foundation',
      'Competitive nomination process depends on Indonesian quota allocation each year',
      'No public breakdown of the sending partner shortlist criteria',
    ],
    bestFor: 'Indonesian applicants who want a fully funded European degree with relatively low language barrier',
  },
  {
    name: 'Stage 2: University Entrance Exam',
    acceptanceRate: 'Must score at least 56/100 to remain eligible',
    quota: 'University allocates seats per program (varies)',
    pros: [
      'Direct interview with university faculty - chance to demonstrate motivation',
      'Some programs accept without IELTS/TOEFL if medium of instruction was English',
      'Online exam format (most cases) - no need to travel to Hungary for the exam',
    ],
    cons: [
      '56/100 minimum pass mark is strict - below this threshold = disqualified',
      'Engineering programs may have additional physics/math subject tests',
      'Interview performance and program-fit matter as much as academics',
    ],
    bestFor: 'Candidates who can articulate their motivation well in an interview setting',
  },
];

const stipendiumSocialLinks: SocialLink[] = [
  { label: 'Tempus Public Foundation (Official)', platform: 'website', handle: 'stipendiumhungaricum.hu', url: 'https://stipendiumhungaricum.hu' },
  { label: 'Online Application Portal (DreamApply)', platform: 'website', handle: 'apply.stipendiumhungaricum.hu', url: 'https://apply.stipendiumhungaricum.hu/' },
  { label: 'Stipendium Hungaricum Indonesia Page', platform: 'website', handle: 'stipendiumhungaricum.hu/country/indonesia', url: 'https://stipendiumhungaricum.hu/country/indonesia/' },
  { label: 'Indonesian Sending Partner (Kemendiktisaintek)', platform: 'website', handle: 'kemdiktisaintek.go.id', url: 'https://kemdiktisaintek.go.id/announcement/article/tawaran-beasiswa-stipendium-hungaricum-scholarship-programme-tahun-2026' },
  { label: 'Eligible Programs (Excel Sheet)', platform: 'website', handle: 'Program List', url: 'https://stipendiumhungaricum.hu/wp-content/uploads/2025/10/eligible-study-programmes-full-degree.xlsx' },
];

const stipendiumStrategyTips: string[] = [
  'Indonesian applicants MUST be nominated by Kemendiktisaintek (sending partner) before applying - contact them early, this is the most critical step',
  'Choose only 2 study programs (not more) - use the study finder to match your profile carefully',
  'Score at least 56/100 on the university entrance exam - below this threshold you are disqualified entirely',
  'For Engineering programs: prepare for additional subject tests in physics and mathematics',
  'If your previous degree was taught in English, request a Medium of Instruction letter from your university - this can exempt you from IELTS/TOEFL',
  'Master level stipend stays at HUF 43,700 throughout - it does NOT increase like PhD does. Plan your budget accordingly',
  'Stipend of HUF 43,700 (~$120/month) is tight. Most awardees report supplementing with part-time work or personal savings. Hungary is affordable but plan wisely',
  'Bachelor applicants: focus on strong school records and motivation letter. Master: focus on academic consistency and research fit. PhD: must find a supervisor willing to support your application',
];

const stipendiumDifferentiators: { label: string; description: string }[] = [
  {
    label: 'Direct University Exam (No Embassy Written Test)',
    description: 'Unlike MEXT or GKS, Stipendium has no centralized embassy written exam. Each Hungarian university conducts its own entrance exam/interview directly with shortlisted candidates.',
  },
  {
    label: 'Indonesian Sending Partner (Kemendiktisaintek) Required',
    description: 'Indonesian applicants must first be nominated by Kemendiktisaintek (the Indonesian sending partner) before they can apply to Tempus Public Foundation. This is a critical pre-screening step that many candidates miss.',
  },
  {
    label: '56/100 Minimum Exam Pass Mark',
    description: 'University entrance exam scores must reach at least 56 out of 100 points to remain eligible for final selection. Below this, the application is automatically disqualified regardless of other merits.',
  },
  {
    label: '2 Program Choice Limit',
    description: 'Applicants can only choose 2 study programs (out of 800+). Strategic selection matters - choose programs that are strong fits, not reach schools.',
  },
  {
    label: 'Stipend Stays Flat for Master (Does Not Increase)',
    description: 'Unlike PhD which has 2 phases (HUF 140K then HUF 180K), Master level stays at HUF 43,700 throughout the entire program. Bachelor is also HUF 43,700.',
  },
  {
    label: 'Alumni Network Access',
    description: 'After completing the scholarship, recipients join the Stipendium Hungaricum Alumni Network for ongoing professional development and global networking opportunities.',
  },
];


export const hungaryEnrichment: Record<string, EnrichmentData> = {
  // ── Stipendium Hungaricum ──────────────────────────────────────────────────────────
  'stipendium-hungaricum-bachelors-one-tier-masters-scholarship': {
    slug: 'stipendium-hungaricum-bachelors-one-tier-masters-scholarship',
    tracks: stipendiumTrackComparison,
    trackSectionTitle: 'Key Selection Stages',
    socialLinks: stipendiumSocialLinks,
    strategyTips: stipendiumStrategyTips,
    differentiators: stipendiumDifferentiators,
  },

  // ── Stipendium Master's ──
  'stipendium-hungaricum-masters-scholarship': {
    slug: 'stipendium-hungaricum-masters-scholarship',
    tracks: stipendiumTrackComparison,
    trackSectionTitle: 'Key Selection Stages',
    socialLinks: stipendiumSocialLinks,
    strategyTips: stipendiumStrategyTips,
    differentiators: stipendiumDifferentiators,
  },

  // ── Stipendium Doctoral (PhD) ──
  'stipendium-hungaricum-doctoral-phd-scholarship': {
    slug: 'stipendium-hungaricum-doctoral-phd-scholarship',
    tracks: stipendiumTrackComparison,
    trackSectionTitle: 'Key Selection Stages',
    socialLinks: stipendiumSocialLinks,
    strategyTips: [
      ...stipendiumStrategyTips,
      'For PhD: contact a potential supervisor at your chosen Hungarian university BEFORE applying - many doctoral schools require a Statement of Supervisor by 15 March',
      'PhD stipend has 2 phases: HUF 140,000/month for first 2 years, HUF 180,000/month for the next 2 years - significantly higher than Master level',
      'Doctoral programs are 4 years - plan supervisor relationship and funding continuity carefully',
    ],
    differentiators: stipendiumDifferentiators,
  },

};

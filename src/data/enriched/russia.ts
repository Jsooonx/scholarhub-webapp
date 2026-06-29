import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Russian Government Scholarship (Quota) Shared Data ────────────────────────────────

const russiaQuotaSocialLinks: SocialLink[] = [
  { label: 'Official Website (Education in Russia)', platform: 'website', handle: 'education-in-russia.com', url: 'https://education-in-russia.com' },
  { label: 'Rumah Rusia Jakarta (Instagram)', platform: 'instagram', handle: '@russianhouse_jakarta', url: 'https://www.instagram.com/russianhouse_jakarta/' },
  { label: 'Rumah Rusia Jakarta (Telegram)', platform: 'telegram', handle: '@rusdomindo', url: 'https://t.me/rusdomindo' },
  { label: 'PERMIRA Rusia (Indonesian Students)', platform: 'instagram', handle: '@ppirusia', url: 'https://www.instagram.com/ppirusia/' },
  { label: 'PERMIRA Official Site', platform: 'website', handle: 'ppirusia.org', url: 'https://ppirusia.org/' },
];

const russiaQuotaTrackComparison: TrackInfo[] = [
  {
    name: 'Russian Government Quota Program',
    quota: 'Around 160 - 250 spots annually for Indonesian students',
    pros: [
      'Absolutely no age limit for any degree level - very unique compared to MEXT/GKS',
      'No IELTS/TOEFL certificates required for Russian-taught programs',
      '100% free tuition for the entire duration + 1-year preparatory Russian language course (Podfak)',
      'Highly subsidized on-campus dormitory accommodation',
    ],
    cons: [
      'Does NOT cover international airfare: awardees must pay for flights to and from Russia',
      'All documents (transcripts, paspor, MCU, akta lahir) must be translated into Russian by a sworn translator',
      'Does NOT cover medical insurance (~5,000 - 10,000 RUB/year) which is legally mandatory',
      'Monthly living stipend is basic (approx. 2,000 - 4,000 RUB/month), requiring additional personal funds',
    ],
    bestFor: 'High school graduates (S1), S1 graduates (S2), and S2 graduates (S3) of any age willing to learn Russian and self-fund their travel/insurance costs',
  },
];

const russiaQuotaStrategyTips: string[] = [
  'Prepare your translation budget early. All documents uploaded (academic transcript, ijazah, passport, health check) MUST be translated into Russian by a certified sworn translator.',
  'Make sure your high school average grade is at least 85/100 (for S1) or your GPA is at least 3.5/4.0 (for S2/S3) as PKR Jakarta uses these minimum thresholds to shortlist candidates.',
  'Choose your 6 target universities strategically. You can select a maximum of 2 universities in Moscow and a maximum of 2 in St. Petersburg; the remaining 2 must be in other Russian regions.',
  'Your medical check-up (MCU) certificate must explicitly state that you are free from HIV/AIDS, Tuberculosis (TBC), and Hepatitis B/C, signed and stamped by a doctor.',
  'Prepare for the local interview in Jakarta (online/offline). Be ready to explain your motivation to study in Russia, your adaptation plan for extreme winter, and your career goals.',
  'Since the monthly stipend is very basic (2,000 - 4,000 RUB), make sure to prepare personal savings for extra monthly living expenses and mandatory annual health insurance.',
];

const russiaQuotaDifferentiators = [
  {
    label: 'No Age Limits',
    description: 'Unlike almost all other government scholarships, there is absolutely no age restriction for S1, S2, or S3 applicants.',
  },
  {
    label: 'Mandatory Sworn Russian Translation',
    description: 'Every single document submitted must be professionally translated into Russian by a certified sworn translator to pass administrative screening.',
  },
  {
    label: '1-Year Free Preparatory Podfak',
    description: 'Admitted students spend their first year learning academic Russian and basic subjects for free at their host university preparatory department.',
  },
];

// ── Open Doors Russian Scholarship Shared Data ───────────────────────────────────────

const openDoorsSocialLinks: SocialLink[] = [
  { label: 'Official Website (Olympiad)', platform: 'website', handle: 'od.globaluni.ru/en', url: 'https://od.globaluni.ru/en/' },
  { label: 'Olympiad Application Portal', platform: 'website', handle: 'od.globaluni.ru/register', url: 'https://od.globaluni.ru/en/register.php' },
  { label: 'PERMIRA Rusia (Indonesian Students)', platform: 'instagram', handle: '@ppirusia', url: 'https://www.instagram.com/ppirusia/' },
  { label: 'PERMIRA Official Site', platform: 'website', handle: 'ppirusia.org', url: 'https://ppirusia.org/' },
  { label: 'Global Universities Association Russia', platform: 'website', handle: 'globaluni.ru', url: 'http://globaluni.ru/' },
];

const openDoorsTrackComparison: TrackInfo[] = [
  {
    name: 'Master\'s Scholarship Track',
    quota: 'Competitive online Olympiad format',
    pros: [
      'Allows initial application and testing in English or Russian - no language test certificates (IELTS/TOEFL) required',
      'Free tuition at any of the 24 leading Russian universities',
      'Evaluation is entirely online: Round 1 (Portfolio) and Round 2 (Proctored Online Exam)',
      'Free or highly subsidized student dormitory accommodation',
    ],
    cons: [
      'Does NOT cover international airfare to and from Russia',
      'Very low monthly living stipend (average 2,000 - 5,000 RUB/month, top-ups vary by university)',
      'Exam tasks in Round 2 are extremely difficult, testing advanced logic, math, and analytical skills',
    ],
    bestFor: 'Academically driven S1 graduates or final-year students with high GPA, research interests, or competition certificates looking for free S2 tuition in Russia',
  },
  {
    name: 'Doctoral (PhD) Scholarship Track',
    quota: 'Highly competitive research allocation',
    pros: [
      'Initial application and interviews can be done in English or Russian with no mandatory language certificate',
      'Access to top-tier laboratories and research supervisors across 24 leading Russian universities',
      'Includes a fully-funded 1-year preparatory Russian language course if required',
    ],
    cons: [
      'Three-stage selection: requires passing Portfolio (Round 1), Online Exam (Round 2), and Wawancara (Round 3)',
      'Requires securing and matching with a doctoral supervisor during the final interview stage',
      'Living stipend is basic; candidates must be prepared to self-fund extra living costs or seek top-ups',
    ],
    bestFor: 'Master\'s graduates, researchers, or lecturers in Indonesia who want to pursue fully-funded doctoral research in Russia and excel in online exams and supervisor interviews',
  },
];

const openDoorsStrategyTips: string[] = [
  'Upload a comprehensive portfolio in Round 1. Every patent, scientific publication, academic award, conference certificate, and work experience adds quantitative points to your profile.',
  'Your Motivation Letter is key. Clearly outline your academic goals, research achievements, rationale for choosing Russia, and how your topic fits the targeted university.',
  'Prepare thoroughly for the Round 2 Online Exam. It is proctored strictly via webcam/screen share. Practice using past Olympiad exam papers available on the official website.',
  'No IELTS or TOEFL is required to register. However, you must be fully fluent in your chosen language of instruction (English or Russian) for the exams and interviews.',
  'For PhD applicants: Round 3 consists of a 30-minute online interview. Be ready to defend your research proposal, explain your methodology, and answer core theoretical questions in your field.',
  'Be ready to fund your own flights. Open Doors does not cover international airfare, and the monthly stipend is basic, so plan your personal finances beforehand.',
];

const openDoorsDifferentiators = [
  {
    label: 'Online Olympiad Competition',
    description: 'Unlike standard application reviews, selection is structured as a competitive online Olympiad consisting of portfolio evaluation and proctored subject exams.',
  },
  {
    label: 'No Mandatory IELTS/TOEFL',
    description: 'Applicants are not required to submit official language certificates, provided they demonstrate fluency during the online exams and interviews.',
  },
  {
    label: 'PhD Supervisor Matching Round',
    description: 'Final-stage PhD selection relies on a dedicated interview round where candidates present their research proposals to match with university supervisors.',
  },
];


export const russiaEnrichment: Record<string, EnrichmentData> = {
  // ── Open Doors Russian Scholarship Project ──
  'open-doors-russian-scholarship-project': {
    slug: 'open-doors-russian-scholarship-project',
    tracks: openDoorsTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: openDoorsSocialLinks,
    strategyTips: openDoorsStrategyTips,
    differentiators: openDoorsDifferentiators,
  },

  // ── Russian Government Scholarship (Quota) ──
  'russian-government-scholarship-quota-via-rossotrudnichestvo': {
    slug: 'russian-government-scholarship-quota-via-rossotrudnichestvo',
    tracks: russiaQuotaTrackComparison,
    trackSectionTitle: 'Scholarship Pathway',
    socialLinks: russiaQuotaSocialLinks,
    strategyTips: russiaQuotaStrategyTips,
    differentiators: russiaQuotaDifferentiators,
  },

};

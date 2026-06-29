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

  // ── KAIST Undergraduate Scholarship ──
  'kaist-international-student-scholarship-undergraduate': {
    slug: 'kaist-international-student-scholarship-undergraduate',
    trackSectionTitle: 'Application Window Tracks',
    tracks: [
      {
        name: 'Early Track',
        acceptanceRate: '~5-10% (highly selective)',
        quota: 'Varies by applicant quality',
        pros: [
          'Earliest notification (January), giving ample preparation time for visa and logistics',
          'Allows you to apply to other universities as a backup later in the cycle',
        ],
        cons: [
          'Competes with the absolute top-tier applicants with completed standardized test portfolios',
        ],
        bestFor: 'Students who completed high school early or already have official SAT/ACT/AP results ready by October',
      },
      {
        name: 'Regular Track',
        acceptanceRate: '~10-15%',
        quota: 'Main intake track (largest volume of admittances)',
        pros: [
          'Largest cohort size, providing the highest probability of acceptance for standard profiles',
          'Perfectly aligned with international high school graduation timelines',
        ],
        cons: [
          'Extremely high volume of applications globally',
        ],
        bestFor: 'General international applicants seeking the primary admission pool',
      },
      {
        name: 'Late Track',
        acceptanceRate: '<5% (extremely competitive)',
        quota: 'Residual seat capacity only',
        pros: [
          'Last-chance application window closing in April',
        ],
        cons: [
          'Very few remaining seats and scholarship allocations',
          'Requires highly accelerated visa processing upon acceptance',
        ],
        bestFor: 'Late applicants who missed the earlier cycles or had delayed academic transcripts',
      },
    ],
    socialLinks: [
      { label: 'KAIST Undergraduate Admissions', platform: 'website', handle: 'admission.kaist.ac.kr/intl-undergraduate', url: 'https://admission.kaist.ac.kr/intl-undergraduate/' },
      { label: 'KAIST Official Instagram', platform: 'instagram', handle: '@kaist_official', url: 'https://www.instagram.com/kaist_official/' },
      { label: 'PPI Korea (Student Association)', platform: 'instagram', handle: '@ppi_korea', url: 'https://www.instagram.com/ppi_korea/' },
    ],
    exams: [
      {
        program: 'Admissions Interview (Select Candidates)',
        subjects: [
          { name: 'Mathematics & Science Logic', notes: 'Conceptual evaluation covering calculus, basic physics, chemistry, or biology' },
          { name: 'English Expression', notes: 'Evaluation of your capacity to discuss complex logical and academic ideas in English' },
          { name: 'STEM Motivation', notes: 'Explaining your interest in technology development and your career aspirations' }
        ],
        tips: [
          'An interview invitation is sent only to shortlisted candidates; it is highly predictive of final admission.',
          'Review high school STEM concepts. Be prepared to explain how to solve a problem verbally rather than writing it down.',
          'State clearly why KAIST\'s collaborative research environment fits your engineering aspirations.'
        ],
      }
    ],
    strategyTips: [
      'Focus heavily on math and natural science grades in your report cards (SMA/Kurikulum Merdeka). High marks in physics, chemistry, and calculus are the primary filters.',
      'Submit standardized test results (SAT/ACT/AP/IB/GCE A-Levels). While optional, they are crucial for validating Kurikulum Merdeka transcripts against international standards.',
      'Choose a STEM high school teacher who knows your research projects or Olympiad preparations to write your recommendation letter.',
      'Unlike GKS, KAIST does NOT cover international airfare or offer a settlement allowance. Prepare personal funding for flights and initial arrival costs.',
      'All undergraduate courses at KAIST are taught 100% in English. High English proficiency is essential; submit IELTS or TOEFL iBT to stand out.'
    ],
    differentiators: [
      {
        label: 'Zero Mandatory Korean Language Year',
        description: 'While GKS requires a mandatory 1-year Korean language course, KAIST lets you start your English-medium academic classes directly from day one.',
      },
      {
        label: 'Main Campus in Daejeon (Science Town)',
        description: 'Study at Korea\'s technological heart. Daejeon is home to Daedeok Innopolis, offering abundant industry collaboration and research internships.',
      },
      {
        label: 'Tuition Retention Barrier',
        description: 'You must maintain a GPA of 3.0 or higher out of 4.3 (equivalent to a B grade) to keep your full tuition waiver for all 8 semesters.'
      }
    ],
  },

  // ── KAIST Graduate Fellowship ──
  'kaist-graduate-fellowship-masters-phd': {
    slug: 'kaist-graduate-fellowship-masters-phd',
    trackSectionTitle: 'Intake Tracks',
    tracks: [
      {
        name: 'Spring Semester Intake',
        acceptanceRate: '~10-15%',
        quota: 'Varies by department',
        pros: [
          'Academic year begins in March',
          'Excellent for students completing bachelor\'s degrees in the summer',
        ],
        cons: [
          'Fewer university-funded fellowship slots compared to Fall',
        ],
        bestFor: 'Applicants ready to enter labs early in the calendar year',
      },
      {
        name: 'Fall Semester Intake',
        acceptanceRate: '~15-20%',
        quota: 'Primary intake (largest number of admitted students)',
        pros: [
          'Academic year begins in September',
          'Maximum number of department fellowship slots and laboratory openings',
        ],
        cons: [
          'Longer waiting period between applying and arriving in Korea',
        ],
        bestFor: 'Mainstream international graduates seeking top laboratory vacancies',
      },
    ],
    socialLinks: [
      { label: 'KAIST Graduate Admissions', platform: 'website', handle: 'admission.kaist.ac.kr/intl-graduate', url: 'https://admission.kaist.ac.kr/intl-graduate/' },
      { label: 'KAIST Official Instagram', platform: 'instagram', handle: '@kaist_official', url: 'https://www.instagram.com/kaist_official/' },
      { label: 'PPI KAIST (Student Association)', platform: 'instagram', handle: '@ppikaist', url: 'https://www.instagram.com/ppikaist/' },
    ],
    exams: [
      {
        program: 'Departmental Academic Interview',
        subjects: [
          { name: 'Research Proposal Presentation', notes: 'Explaining your research goals, methodology, and relevance to the professor\'s lab' },
          { name: 'Technical & Academic Background', notes: 'Evaluation of your bachelor\'s or master\'s thesis, coding projects, or laboratory techniques' },
          { name: 'English Communication', notes: 'Oral evaluation of your professional English fluency in a scientific context' }
        ],
        tips: [
          'Read the most recent publications of the lab you are applying to. Understand the professor\'s active research projects.',
          'Be prepared for highly technical, specialized questions regarding your prior thesis work or research methodology.',
          'Prepare a concise, clear slide deck summarizing your accomplishments and research goals.'
        ],
      }
    ],
    strategyTips: [
      'Email potential faculty advisors (Professors) before submitting your application. A positive response or pre-acceptance email from a lab supervisor is the single most critical factor for graduate admission.',
      'When emailing professors, write a tailored cover letter in the email body, attach your academic CV and research proposal, and clearly explain why you want to join their specific research group.',
      'KAIST has strict English language filters. You MUST submit an official TOEFL iBT (minimum 83), IELTS (minimum 6.5), TOEIC (minimum 720), or TEPS (minimum 326) certificate. TOEFL ITP is NOT accepted.',
      'The KAIST Graduate Fellowship is awarded automatically with admission. No separate application is required.',
      'Combine the base fellowship (KRW 350,000–400,000/month) with Research Assistantship (RA) stipends funded by your lab. Most STEM advisors pay additional RA stipends, bringing the monthly allowance to KRW 1,000,000 or more.'
    ],
    differentiators: [
      {
        label: 'Automatic Fellowship Award',
        description: 'All admitted international graduate students are automatically considered and awarded the KAIST Graduate Fellowship (no separate application needed).',
      },
      {
        label: 'Research Assistantship (RA) Stipends',
        description: 'Enables scholars to receive additional financial support through active research projects in advisor laboratories, covering living and research costs.'
      },
      {
        label: 'Low Tuition Retention Barrier',
        description: 'Unlike undergraduate students who must maintain a GPA of 3.0/4.3, graduate fellows only need to maintain a cumulative GPA of 2.0/4.3 to retain their funding.'
      }
    ],
  },
};

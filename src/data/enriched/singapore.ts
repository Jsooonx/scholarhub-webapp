import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Singapore Undergraduate Scholarships Shared Data ────────────────────────────────

const singaporeSocialLinks: SocialLink[] = [
  { label: 'KBRI Singapore (Indonesian Embassy)', platform: 'instagram', handle: '@indonesiainsg', url: 'https://www.instagram.com/indonesiainsg/' },
  { label: 'PPI Singapura (PINTS)', platform: 'instagram', handle: '@pintusingapura', url: 'https://www.instagram.com/pintusingapura/' },
  { label: 'PINTS Official Website', platform: 'website', handle: 'pintusingapura.org', url: 'https://pintusingapura.org/' },
  { label: 'NUS Undergraduate Admissions', platform: 'website', handle: 'nus.edu.sg/oam', url: 'https://www.nus.edu.sg/oam' },
  { label: 'NTU Undergraduate Admissions', platform: 'website', handle: 'ntu.edu.sg/admissions', url: 'https://www.ntu.edu.sg/admissions/undergraduate' },
  { label: 'Singapore Ministry of Education (MOE) Tuition Grant', platform: 'website', handle: 'tgonline.moe.gov.sg', url: 'https://tgonline.moe.gov.sg/' },
];

const nusTrackComparison: TrackInfo[] = [
  {
    name: 'ASEAN Undergraduate Scholarship (AUS)',
    quota: 'Allocated per country based on merit',
    pros: [
      'Open to all courses of study (except Medicine, Dentistry, Law, and Music)',
      'Short service bond: only the 3-year MOE Tuition Grant obligation (no additional scholarship bond)',
      'No separate application: automatic consideration upon applying for NUS admission',
      'Provides S$5,800 annual stipend, S$3,000 annual accommodation allowance, and S$1,750 computer allowance',
    ],
    cons: [
      'Very high academic requirements (outstanding high school Rapor + SAT/ACT/AP scores recommended)',
      'Does not cover travel costs (no flights) or settling-in allowances',
      'S$3,000/year accommodation allowance may not fully cover 100% of premium on-campus single-room rates (some top-up needed)',
    ],
    bestFor: 'Outstanding students applying to non-STEM fields (Business, Humanities, Social Sciences) or those who prefer a shorter 3-year post-graduation bond in Singapore',
  },
  {
    name: 'Science & Technology (S&T) Undergraduate Scholarship',
    quota: 'Highly limited (STEM only)',
    pros: [
      'Full coverage of subsidized tuition fees + S$6,000 annual living allowance',
      'Includes airfare: one-way flight to Singapore upon admission, and return flight upon graduation',
      'One-time S$200 settling-in allowance + S$1,750 computer allowance',
      'Guaranteed accommodation allowance or placement in on-campus student housing',
    ],
    cons: [
      'Strictly restricted to designated STEM fields (Computing, Engineering, and Science)',
      '6-Year Service Bond: double the length of the standard MOE Tuition Grant bond',
      'Requires two guarantors (sureties) to sign the scholarship contract',
      'Failure to complete the bond or course results in huge financial penalties (liquidated damages)',
    ],
    bestFor: 'Top-tier STEM applicants (Engineering, Computer Science) who are fully committed to living and working in Singapore for a minimum of 6 years after graduation',
  },
];

const ntuTrackComparison: TrackInfo[] = [
  {
    name: 'ASEAN Undergraduate Scholarship (AUS)',
    quota: 'Allocated per country based on merit',
    pros: [
      'Open to all courses of study (except Renaissance Engineering Programme)',
      'Short service bond: only the 3-year MOE Tuition Grant obligation (no additional scholarship bond)',
      'Provides S$5,800 annual stipend, S$3,000 annual accommodation allowance, and S$1,750 computer allowance',
    ],
    cons: [
      'Requires a minimum CGPA of 3.5/5.0 to maintain the scholarship each semester',
      'Does not cover travel costs (no flights) or settling-in allowances',
      'Highly competitive: requires top high school Rapor (typically 8.5/85+ average) and English test scores',
    ],
    bestFor: 'All-round high achievers applying for non-STEM or general science courses at NTU who prefer a shorter 3-year bond',
  },
  {
    name: 'Science & Technology (S&T) Undergraduate Scholarship',
    quota: 'Highly limited (STEM only)',
    pros: [
      'Full coverage of subsidized tuition fees + S$6,000 annual living allowance',
      'Includes airfare: flight to Singapore upon admission, and return flight upon graduation',
      'One-time S$200 settling-in allowance + S$1,750 computer allowance',
      'Guaranteed accommodation allowance or placement in on-campus student housing',
    ],
    cons: [
      'Strictly restricted to Science, Computing, and Engineering majors',
      '6-Year Service Bond: requires working in a Singapore-registered company for 6 years after graduation',
      'Requires two guarantors (sureties) to sign the bond contract',
    ],
    bestFor: 'Determined Engineering and Science majors who want full flight/settling-in coverage and plan to build a long-term professional career in Singapore',
  },
  {
    name: 'Nanyang Scholarship',
    quota: "NTU's premier undergraduate award",
    pros: [
      'Highest-tier financial benefits: full tuition coverage + S$6,500 annual living allowance',
      'S$9,200 annual accommodation allowance + S$1,500 computer allowance',
      'S$2,000 one-time travel grant for overseas study trips / exchange programs',
      'No additional bond: only the standard 3-year MOE Tuition Grant service obligation',
    ],
    cons: [
      'Extremely competitive: requires top academic credentials (outstanding Rapor, standardized test scores) and strong leadership records',
      'Must maintain a minimum CGPA of 3.5/5.0 each semester',
      'Wajib write a dedicated personal essay during the admission application',
    ],
    bestFor: 'Exceptional candidates with stellar academic and leadership portfolios who want the highest possible financial support with only a 3-year bond',
  },
];

const nusStrategyTips: string[] = [
  'NUS UEE (University Entrance Exam) has been DISCONTINUED. Admission for Indonesian SMA relies on your high school Rapor + English test (IELTS/TOEFL) + optional standardized tests.',
  'Standardized tests (SAT, ACT, AP) are technically optional for Indonesian national curriculum applicants, but in practice, submitting a high score (SAT 1450+ or 3+ AP tests with score 4/5) is crucial to compete against IB/A-Level graduates.',
  'Make sure your Rapor copies are clearly stamped by the school and signed by the principal/teacher. Double check that you input both Pengetahuan (Written) and Keterampilan (Practical) scores if your school has them.',
  'Since consideration for the ASEAN and S&T scholarships is automatic, ensure your admission application profile is absolutely flawless. The personal statements/essays in the admission form serve as your scholarship screening.',
  'If you are shortlisted for the interview, you will receive an email invitation between January and July. Check your email (including spam folder) regularly.',
  'The NUS interview is a panel format (usually 2-3 interviewers). Be prepared to explain: why Singapore, why NUS, why your chosen major, and how you will contribute to the NUS residential/hall community as a scholar.',
  'Be ready for the "tough" question: "If you get accepted into both NUS and NTU with a scholarship, which one will you choose?" Answer professionally focusing on specific curriculum differences without being biased.',
];

const ntuStrategyTips: string[] = [
  'You MUST check the scholarship checkbox on the NTU online application portal and write the dedicated scholarship essay. It is NOT 100% automatic like NUS - missing this step disqualifies you.',
  'Indonesian SMA applicants must have an average Rapor score of at least 8.5/85 in core subjects. Focus your application on subjects relevant to your chosen major (e.g. high Math/Physics for Engineering).',
  'For NTU, submitting SAT (1350+) or at least 3 AP test scores (4 or 5) is highly recommended to boost your academic profile if you are from the Indonesian national curriculum.',
  'NTU selection process often includes a Group Discussion (GD) round before the individual panel interview. You will be put in a virtual room with 5-8 other applicants. They test your team-player ability: do not dominate the conversation, listen actively, and build constructively on others\' points.',
  'The individual panel interview (15-20 mins) focuses heavily on authenticity. Avoid generic rehearsed answers. Be ready to discuss your essay, your leadership lessons, and how you deal with failure.',
  'Be clear on the bond difference: Nanyang and ASEAN scholarships have no additional bond (only the standard 3-year MOE Tuition Grant bond). S&T has a strict 6-year bond. Ensure you are ready for a 6-year commitment if you accept S&T.',
];

const nusDifferentiators = [
  {
    label: 'Automatic Scholarship Screening',
    description: 'No separate application or essay required for the ASEAN or S&T scholarships. All eligible applicants are screened based on their admission file.',
  },
  {
    label: '3-Year vs 6-Year Bond Commitment',
    description: 'ASEAN Scholarship has only the standard 3-year MOE Tuition Grant bond. Science & Technology Scholarship adds another 3 years, totaling a 6-year bond.',
  },
  {
    label: 'No Entrance Examination (UEE)',
    description: 'Admission is evaluated entirely on high school records and English proficiency, making external standardized tests (SAT/AP) extremely helpful.',
  },
];

const ntuDifferentiators = [
  {
    label: 'Required Scholarship Essay & Checkbox',
    description: 'Unlike NUS, you must actively apply for scholarships on the NTU portal and write a dedicated personal essay during the admission cycle.',
  },
  {
    label: 'Two-Stage Selection (Group + Individual)',
    description: 'NTU often screens candidates using a group discussion challenge to evaluate collaboration skills, followed by an individual panel interview.',
  },
  {
    label: 'Nanyang Scholarship (Zero Extra Bond)',
    description: "NTU's premier Nanyang Scholarship offers the highest financial coverage (including study travel grants) with only the standard 3-year MOE Tuition Grant bond.",
  },
];


export const singaporeEnrichment: Record<string, EnrichmentData> = {
  // ── NUS ASEAN Undergraduate Scholarship ──
  'asean-undergraduate-scholarship-nus': {
    slug: 'asean-undergraduate-scholarship-nus',
    tracks: nusTrackComparison,
    trackSectionTitle: 'Scholarship Options',
    socialLinks: singaporeSocialLinks,
    strategyTips: nusStrategyTips,
    differentiators: nusDifferentiators,
  },

  // ── NTU ASEAN Undergraduate Scholarship ──
  'asean-undergraduate-scholarship-ntu': {
    slug: 'asean-undergraduate-scholarship-ntu',
    tracks: ntuTrackComparison,
    trackSectionTitle: 'Scholarship Options',
    socialLinks: singaporeSocialLinks,
    strategyTips: ntuStrategyTips,
    differentiators: ntuDifferentiators,
  },

};

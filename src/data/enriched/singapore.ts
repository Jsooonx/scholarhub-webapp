import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

// ── Singapore Undergraduate Scholarships Shared Data ────────────────────────────────

const nusSocialLinks: SocialLink[] = [
  { label: 'KBRI Singapore (Indonesian Embassy)', platform: 'instagram', handle: '@indonesiainsg', url: 'https://www.instagram.com/indonesiainsg/' },
  { label: 'PINUS (Pelajar Indonesia NUS)', platform: 'instagram', handle: '@pinusonline', url: 'https://www.instagram.com/pinusonline/' },
  { label: 'PINUS Official Website', platform: 'website', handle: 'pinusonline.org', url: 'https://pinusonline.org/' },
  { label: 'PPI Singapura (PPIS)', platform: 'instagram', handle: '@ppisingapura', url: 'https://www.instagram.com/ppisingapura/' },
  { label: 'PPI Singapura Official Website', platform: 'website', handle: 'ppisingapura.com', url: 'https://www.ppisingapura.com' },
  { label: 'NUS Undergraduate Admissions', platform: 'website', handle: 'nus.edu.sg/oam', url: 'https://www.nus.edu.sg/oam' },
  { label: 'Singapore MOE Tuition Grant Portal', platform: 'website', handle: 'tgonline.moe.gov.sg', url: 'https://tgonline.moe.gov.sg/' },
];

const ntuSocialLinks: SocialLink[] = [
  { label: 'KBRI Singapore (Indonesian Embassy)', platform: 'instagram', handle: '@indonesiainsg', url: 'https://www.instagram.com/indonesiainsg/' },
  { label: 'PINTU (Pelajar Indonesia NTU)', platform: 'instagram', handle: '@pintugram', url: 'https://www.instagram.com/pintugram/' },
  { label: 'PINTU Official Website', platform: 'website', handle: 'pintusingapura.org', url: 'https://pintusingapura.org/' },
  { label: 'PPI Singapura (PPIS)', platform: 'instagram', handle: '@ppisingapura', url: 'https://www.instagram.com/ppisingapura/' },
  { label: 'PPI Singapura Official Website', platform: 'website', handle: 'ppisingapura.com', url: 'https://www.ppisingapura.com' },
  { label: 'NTU Undergraduate Admissions', platform: 'website', handle: 'ntu.edu.sg/admissions', url: 'https://www.ntu.edu.sg/admissions/undergraduate' },
  { label: 'Singapore MOE Tuition Grant Portal', platform: 'website', handle: 'tgonline.moe.gov.sg', url: 'https://tgonline.moe.gov.sg/' },
];

const nusTrackComparison: TrackInfo[] = [
  {
    name: 'ASEAN Undergraduate Scholarship (AUS)',
    quota: 'Merit-based allocation per ASEAN country',
    pros: [
      'Open to all courses of study (limited availability for Dentistry, Law, and Medicine)',
      'Manageable service bond: Only the standard 3-year MOE Tuition Grant obligation (no additional sponsor bond)',
      '100% automatic screening: No separate scholarship application form or extra essay required',
      'Provides S$5,800 annual living allowance, S$3,000 annual accommodation allowance, and S$1,750 one-time computer grant',
    ],
    cons: [
      'Extremely high competition: Indonesian SMA applicants almost always need OSN medals or SAT 1500+ / 3+ AP 5s to compete against IB/A-Level cohorts',
      'Does not cover airfare: Return flights between Indonesia and Singapore must be self-funded',
      'S$3,000 accommodation allowance leaves a financial gap if residing in NUS Residential Colleges (UTown, Tembusu, RC4) which cost S$4,500–S$5,500/year with mandatory meal plans',
    ],
    bestFor: 'Top-ranking Indonesian students across all majors who want a prestigious, fully funded NUS education with only a 3-year career commitment in Singapore',
  },
  {
    name: 'Science & Technology (S&T) Undergraduate Scholarship',
    quota: 'Highly restricted (Asian citizens, STEM only)',
    pros: [
      'Full coverage of subsidised tuition fees + S$6,000 annual living allowance',
      'Includes airfare: Inward flight to Singapore at the start and return flight upon graduation',
      'One-time S$200 settling-in allowance + S$1,750 computer allowance',
      'Guaranteed accommodation placement in on-campus student housing',
    ],
    cons: [
      'Strictly restricted to Computing, Engineering, and Science disciplines',
      'Heavy 6-Year Service Bond: 3 years MOE Tuition Grant + 3 years additional S&T sponsor bond working in Singapore',
      'Requires two guarantors (sureties) to sign the bond contract with severe liquidated damages for default',
    ],
    bestFor: 'Determined STEM applicants (Computer Science, Electrical/Mechanical Engineering) fully committed to launching a 6-year professional career in Singapore',
  },
];

const ntuTrackComparison: TrackInfo[] = [
  {
    name: 'ASEAN Undergraduate Scholarship (AUS)',
    quota: 'Merit-based allocation per ASEAN country',
    pros: [
      'Covers all undergraduate degree programs (except Renaissance Engineering Programme)',
      'Standard 3-year MOE Tuition Grant bond (no additional scholarship work bond)',
      'Provides S$5,800 annual stipend, S$3,000 annual accommodation allowance, and S$1,750 computer allowance',
      'Can be paired with standard NTU on-campus non-AC halls (S$350–S$420/month) with zero out-of-pocket shortfall',
    ],
    cons: [
      'NOT automatic: Requires a separate online scholarship application, 300-word personal essay, and teacher referee appraisal within 7–14 days',
      'No airfare allowance: Flights to/from Singapore are self-funded',
      'Must maintain a minimum CGPA of 3.50/5.00 each semester',
    ],
    bestFor: 'All-round high achievers across non-STEM or general engineering programs seeking full funding with a manageable 3-year Singapore bond',
  },
  {
    name: 'Nanyang Scholarship (Premier Award)',
    quota: "NTU's highest undergraduate honor",
    pros: [
      'Highest financial coverage: Full subsidised tuition + S$6,500 annual living allowance',
      'Generous S$9,200 annual accommodation allowance (100% covers even single AC suites) + S$1,750 computer grant',
      'S$2,000 one-off overseas study trip / exchange travel grant',
      'Zero extra bond: Only the standard 3-year MOE Tuition Grant service obligation',
    ],
    cons: [
      'Pinnacle competitiveness: Awarded only to the absolute top fraction of applicants with exceptional leadership records',
      'Rigorous multi-stage interview including Group Discussion (GD) and faculty panel assessment',
      'Strict academic standing: CGPA minimum 3.50/5.00 to retain benefits',
    ],
    bestFor: 'Exceptional applicants with stellar academic profiles, high standardized scores, and national/international leadership distinctions',
  },
  {
    name: 'Science & Technology (S&T) Undergraduate Scholarship',
    quota: 'Highly restricted (STEM disciplines only)',
    pros: [
      'Full coverage of subsidised tuition fees + S$6,000 annual living allowance',
      'Covers inward airfare to Singapore and return airfare upon graduation',
      'One-time S$200 settling-in grant + S$1,750 computer allowance',
      'Guaranteed accommodation allowance for on-campus student housing',
    ],
    cons: [
      'Strictly restricted to Science, Computing, and Engineering majors',
      '6-Year Work Bond: 3 years MOE + 3 years S&T bond working in a Singapore-registered entity',
      'Requires two sureties (guarantors) with heavy liquidated damages for early departure',
    ],
    bestFor: 'STEM candidates seeking flight coverage who are 100% committed to living and working in Singapore for at least 6 years after graduation',
  },
];

const nusStrategyTips: string[] = [
  'UEE IS PERMANENTLY DISCONTINUED: Indonesian applicants are no longer evaluated through the physical University Entrance Examination in Jakarta/Surabaya. Admission is 100% credential-based relying on your high school Rapor (Semesters 1–5), English proficiency, and extracurricular record.',
  'THE "UNWRITTEN FORMULA" FOR INDONESIAN SMA (K-13 / KURIKULUM MERDEKA): While NUS marks SAT/AP tests as officially "optional" for Indonesian SMA, historical awardees confirm that Rapor alone (even 92–95+) rarely beats IB (42–45) and Cambridge A-Level (3–4 A*s) applicants. Winning candidates almost always present either: (A) National OSN/KSN Medals (Emas/Perak) or Pelatnas, OR (B) SAT 1480–1550+ (Math 780–800), OR (C) 3–4 AP Exams with score 5 (Calculus BC, Physics C, Chemistry, Micro/Macroeconomics).',
  'CRITICAL DEADLINE DIFFERENCE: The Indonesian qualification admissions window opens in mid-December and CLOSES IN MID-FEBRUARY (~17 Feb). Do NOT wait until the March international deadline, or your application will not be considered for this cohort!',
  'YOUR ADMISSION ESSAYS ARE YOUR SCHOLARSHIP SCREENING: Since NUS does not have a separate scholarship application form, the admissions committee shortlists candidates directly from your 5 short admission answer prompts and activity achievements. Make sure your answers highlight tangible impact, intellectual curiosity, and community leadership.',
  'PREPARE FOR THE "RESIDENTIAL HALL" QUESTION: In the 15–20 minute faculty panel interview (March–June), interviewers consistently ask: "How will you contribute to residential life at NUS?" Research specific NUS Halls (Eusoff, Kent Ridge, Sheares) or Residential Colleges (UTown) and mention specific sports, cultural events, or community projects you plan to lead.',
  'HANDLING TRICKY INTERVIEW PROMPTS: If asked: "If accepted by both NUS and NTU with a scholarship, which one will you choose?", answer diplomatically and professionally. Emphasize NUS\'s specific interdisciplinary flexibility (e.g. NUS College, double majors, or specific research labs) without criticizing NTU.',
  'HOUSING GAP REALITY: The S$3,000 annual accommodation allowance covers standard PGPR or non-AC hall double rooms (~S$1,400–S$1,600/sem). If you choose a Residential College (UTown, Tembusu, RC4), accommodation plus mandatory meal plans totals S$4,500–S$5,500/year, requiring a top-up from your living allowance or personal funds.',
];

const ntuStrategyTips: string[] = [
  'DEADLINE WARNING (EARLY CLOSURE): NTU admissions for Indonesian High School (Ijazah SMA) closes early on 20 JANUARY (opens 15 October). Applications submitted after 20 January are disqualified for the upcoming academic year.',
  'CRITICAL STEP: NTU SCHOLARSHIP IS NOT AUTOMATIC: Unlike NUS, admission to NTU does NOT automatically enter you into scholarship selection. You MUST click the "Apply for Scholarship" link in the NTU applicant portal, submit a dedicated 250–300 word Personal Essay, and register an academic referee.',
  'TEACHER REFEREE APPRAISAL TIGHT DEADLINE: Your high school teacher must submit an online confidential appraisal via a dedicated NTU portal within 7–14 days. Notify your teacher (preferably Math, Science, or English teacher/Wali Kelas) in advance with your NTU Application Number and Date of Birth so the invitation does not get buried in their spam folder.',
  'SURVIVING THE NTU GROUP DISCUSSION (GD): NTU frequently conducts a virtual Group Discussion (GD) round with 5–8 international candidates before the individual interview. Evaluators look for collaborative leadership: (1) Do NOT monopolize speaking time, (2) Actively listen and acknowledge others by name ("Building on Kevin\'s point on sustainable energy..."), (3) Help bridge opposing views toward an actionable synthesis.',
  'AUTHENTICITY IN THE INDIVIDUAL INTERVIEW: In the 15–20 minute individual panel interview, professors will probe your 300-word essay and ask about your greatest personal failure and resilience. Avoid cliché, rehearsed answers. Show genuine self-awareness, intellectual grit, and how you recovered from real setbacks.',
  'BE MINDFUL OF BOND COMMITMENTS: Both ASEAN and Nanyang scholarships require only the standard 3-year MOE Tuition Grant bond in a Singapore-registered company. Science & Technology (S&T), while providing flight tickets, enforces a STRICT 6-YEAR BOND with two guarantors and severe liquidated damages if broken.',
];

const nusDifferentiators = [
  {
    label: '100% Automatic Screening',
    description: 'No separate application form or extra scholarship essay needed. All eligible ASEAN candidates are evaluated directly from their NUS admission dossier.',
  },
  {
    label: 'Standard 3-Year MOE Bond',
    description: 'Carries only the standard 3-year MOE Tuition Grant work bond in a Singapore-registered entity, with zero additional scholarship servitude.',
  },
  {
    label: 'Discontinued UEE (Credential-Driven)',
    description: 'Written entrance exams are obsolete; selection is driven by Rapor SMA consistency, verified English scores, and competitive SAT/AP/OSN achievements.',
  },
];

const ntuDifferentiators = [
  {
    label: 'Mandatory Scholarship Portal & Essay',
    description: 'Requires an active scholarship filing on the portal, including a 250–300 word personal essay and a confidential teacher appraisal submitted within 7–14 days.',
  },
  {
    label: 'Two-Stage Selection (GD + Panel)',
    description: 'Evaluates candidates through a collaborative Group Discussion (GD) session testing team empathy followed by an authentic faculty panel interview.',
  },
  {
    label: 'Nanyang Scholarship Opportunity',
    description: "NTU's premier Nanyang award provides the region's highest living (S$6,500) and housing allowances (S$9,200) plus travel grants with only a 3-year MOE bond.",
  },
];

const gksSocialLinks: SocialLink[] = [
  { label: 'The Association of Banks in Singapore (ABS)', platform: 'website', handle: 'abs.org.sg', url: 'https://www.abs.org.sg/dr-goh-keng-swee-scholarship' },
  { label: 'NUS GKS Scholarship Office', platform: 'website', handle: 'nus.edu.sg/oam', url: 'https://www.nus.edu.sg/oam/scholarships/scholarships-for-freshmen-(international-students)/the-association-of-banks-in-singapore---goh-keng-swee-scholarship' },
  { label: 'KBRI Singapore (Indonesian Embassy)', platform: 'instagram', handle: '@indonesiainsg', url: 'https://www.instagram.com/indonesiainsg/' },
  { label: 'PINUS (Pelajar Indonesia NUS)', platform: 'instagram', handle: '@pinusonline', url: 'https://www.instagram.com/pinusonline/' },
  { label: 'PINUS Official Website', platform: 'website', handle: 'pinusonline.org', url: 'https://pinusonline.org/' },
  { label: 'PPI Singapura (PPIS)', platform: 'instagram', handle: '@ppisingapura', url: 'https://www.instagram.com/ppisingapura/' },
  { label: 'PPI Singapura Official Website', platform: 'website', handle: 'ppisingapura.com', url: 'https://www.ppisingapura.com' },
];

const gksTrackComparison: TrackInfo[] = [
  {
    name: 'Dr Goh Keng Swee (GKS) Scholarship',
    quota: 'Strictly 3–4 awards annually across 15 Asia Pacific economies',
    pros: [
      'Singapore\'s premier private-sector award: Full tuition + S$6,500 annual living allowance',
      'Full accommodation allowance pegged to on-campus hostel rates + S$200 settling-in + computer grant',
      'Return airfare covered: Inward flight from Indonesia to Singapore and return passage upon graduation',
      'Uniquely flexible 3-year bond: Can be served in Singapore OR at an approved Singapore-based company in Indonesia (e.g. DBS Indonesia, OCBC NISP, UOB, Grab, Shopee)',
      'Open to almost all majors (Computing, Engineering, Business, Data Science, Humanities, Sciences)',
    ],
    cons: [
      'Pinnacle selectivity: Only 3 to 4 recipients selected each year from all 15 Asia Pacific economies combined',
      'Requires registration of interest directly on the NUS undergraduate application by mid-February',
      'Multi-stage executive evaluation including psychometric assessment and high-level banking panel interview',
    ],
    bestFor: 'Exceptional student leaders and innovators with national/international distinctions who want Singapore\'s most prestigious award with the option to serve their bond in Indonesia',
  },
  {
    name: 'NUS ASEAN Undergraduate Scholarship (AUS)',
    quota: 'Country merit allocation (larger cohort)',
    pros: [
      'Automatic consideration through standard NUS application (no extra nomination needed)',
      'Manageable 3-year MOE Tuition Grant bond in Singapore',
      'Full tuition + S$5,800 living allowance + S$3,000 accommodation + S$1,750 computer grant',
    ],
    cons: [
      'No airfare allowance: Flights to and from Singapore are self-funded',
      'S$3,000 hostel allowance leaves a financial gap for Residential Colleges (UTown/RC4/Tembusu)',
      'Bond must be served physically in Singapore (cannot be transferred to home country)',
    ],
    bestFor: 'High academic achievers seeking a fully funded NUS degree who do not mind self-funding flights and working in Singapore for 3 years',
  },
  {
    name: 'NUS Science & Technology (S&T) Scholarship',
    quota: 'Designated STEM programs only',
    pros: [
      'Full tuition + S$6,000 annual living allowance + accommodation placement',
      'Covers return airfare and settling-in allowance',
    ],
    cons: [
      'Restricted strictly to Computing, Engineering, and Science disciplines',
      'Heavy 6-year bond: 3 years MOE + 3 years S&T sponsor bond with severe liquidated damages',
      'Requires two guarantors (sureties) to sign the contract',
    ],
    bestFor: 'STEM specialists fully committed to a 6-year career in Singapore who want guaranteed flights and housing support',
  },
];

const gksStrategyTips: string[] = [
  'SINGLE-UNIVERSITY TRANSITION (EXCLUSIVE TO NUS): From 2026 onward, the Dr Goh Keng Swee Scholarship is no longer split between NTU/SMU/SUTD or applied via an external ABS website. It is administered EXCLUSIVELY through NUS admissions. You must indicate your interest directly in the scholarship section of your NUS online application before mid-February (~17–23 Feb).',
  'THE REALITY OF THE 3–4 QUOTA: The most crucial fact for Indonesian applicants is that only 3 to 4 candidates are awarded per year across 15 Asia-Pacific economies combined (Indonesia, China, India, Japan, Korea, Hong Kong, and all ASEAN nations). From Indonesia, typically only 0 to 1 applicant wins each year. Winning requires more than perfect school grades — you need demonstrable leadership impact, visionary character, and exceptional maturity.',
  'NOT A BANKING-RESTRICTED SCHOLARSHIP: Many Indonesian applicants mistakenly assume GKS is only for Finance or Economics majors because it is funded by the Association of Banks in Singapore (ABS). In truth, GKS scholars are accepted across Computer Science, Data Science, Engineering, Business, and Humanities. You do NOT have to work in a bank after graduation.',
  'THE GOLDEN BOND CLAUSE (SERVE IN INDONESIA): While standard Singapore scholarships force you to live in Singapore for your 3-year bond, GKS uniquely allows you to fulfill your 3-year commitment at an approved Singapore-based company in Indonesia! Top approved employers in Jakarta include Bank DBS Indonesia, Bank OCBC NISP, UOB Indonesia, Grab Indonesia, Sea Group / Shopee, or Temasek/GIC affiliate firms.',
  'INTERVIEW WITH SENIOR BANKING EXECUTIVES: The interview panel (May–June) is composed of senior banking leaders from ABS and NUS academic leadership. Key questions delve into: (1) Your authentic life narrative and ethical principles, (2) How your chosen degree can contribute to regional socioeconomic progress, (3) Concrete examples of leadership where you took personal responsibility during a crisis.',
  'LEVERAGE STANDARDIZED SCORES & OLYMPIADS: Because competition spans top students from Beijing, Tokyo, Seoul, and New Delhi, Indonesian national curriculum (SMA) applicants are strongly advised to submit SAT (1520–1560+) or 3–4 AP Exams (score 5) alongside Semesters 1–5 Rapor with average 93–96+.',
];

const gksDifferentiators = [
  {
    label: 'Ultra-Exclusive (3–4 Quota)',
    description: 'Singapore\'s most selective undergraduate award, granted to just 3 to 4 exceptional student leaders across 15 Asia Pacific economies each year.',
  },
  {
    label: 'Home Country Bond Flexibility',
    description: 'Uniquely permits fulfilling the mandatory 3-year work bond at approved Singapore-based companies in Indonesia (e.g. DBS, OCBC, Grab, Shopee) or in Singapore.',
  },
  {
    label: 'Full Airfare & Premium Coverage',
    description: 'Unlike standard ASEAN scholarships, covers return flights between Indonesia and Singapore, full hostel accommodation, living stipends, and settling-in grants.',
  },
];

export const singaporeEnrichment: Record<string, EnrichmentData> = {
  // ── NUS ASEAN Undergraduate Scholarship ──
  'asean-undergraduate-scholarship-nus': {
    slug: 'asean-undergraduate-scholarship-nus',
    tracks: nusTrackComparison,
    trackSectionTitle: 'Scholarship Options',
    socialLinks: nusSocialLinks,
    strategyTips: nusStrategyTips,
    differentiators: nusDifferentiators,
  },

  // ── NTU ASEAN Undergraduate Scholarship ──
  'asean-undergraduate-scholarship-ntu': {
    slug: 'asean-undergraduate-scholarship-ntu',
    tracks: ntuTrackComparison,
    trackSectionTitle: 'Scholarship Options',
    socialLinks: ntuSocialLinks,
    strategyTips: ntuStrategyTips,
    differentiators: ntuDifferentiators,
  },

  // ── Dr Goh Keng Swee (GKS) Scholarship ──
  'dr-goh-keng-swee-gks-scholarship': {
    slug: 'dr-goh-keng-swee-gks-scholarship',
    tracks: gksTrackComparison,
    trackSectionTitle: 'Scholarship Options',
    socialLinks: gksSocialLinks,
    strategyTips: gksStrategyTips,
    differentiators: gksDifferentiators,
  },
};

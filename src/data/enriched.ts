// ── Enrichment Data ───────────────────────────────────────────────────────────────
// Deep-dive insider information per scholarship: exam details, track comparisons,
// community resources, strategy tips, and key differentiators.
// Rendered inside <InsiderGuide /> on the scholarship detail page.

export interface TrackInfo {
  name: string;
  acceptanceRate?: string;
  quota?: string;
  pros: string[];
  cons: string[];
  bestFor?: string;
}

export interface ExamDetail {
  program: string;
  subjects: { name: string; notes?: string }[];
  tips: string[];
  pastPapersUrl?: string;
}

export interface SocialLink {
  label: string;
  platform: 'instagram' | 'website' | 'youtube' | 'tiktok' | 'telegram';
  handle: string;
  url: string;
}

export interface EnrichmentData {
  slug: string;
  tracks?: TrackInfo[];
  trackSectionTitle?: string;
  exams?: ExamDetail[];
  socialLinks?: SocialLink[];
  communityNotes?: string;
  strategyTips?: string[];
  differentiators?: { label: string; description: string }[];
}

// ── MEXT Enrichment ────────────────────────────────────────────────────────────────

const mextTrackComparison: TrackInfo[] = [
  {
    name: 'Embassy Track',
    acceptanceRate: '~10-15% (Primary Screening)',
    quota: 'Varies by program (open to all Indonesian applicants)',
    pros: [
      'No Letter of Acceptance (LoA) needed upfront. Apply first, find a university after passing primary screening',
      'Choose up to 3 universities for Gakubu, or 1 field of study for Research',
      'Written exams held in 5 major cities: Jakarta, Surabaya, Medan, Denpasar, Makassar',
      'Structured process guided by the Embassy of Japan - ideal for first-time applicants',
    ],
    cons: [
      'Intense competition - you compete against all Indonesian applicants for limited seats',
      'Written exam is mandatory (cannot be skipped)',
      'Longer timeline: April to February for Gakubu; April to March for Research',
    ],
    bestFor: 'Applicants without existing professor connections in Japan who want flexibility in choosing a university',
  },
  {
    name: 'University Recommendation',
    acceptanceRate: '~15-25% (varies by university)',
    quota: 'Depends on each university`s allocation',
    pros: [
      'Can bypass the written exam - selection based on documents + professor recommendation',
      'Faster process - the university registers you with MEXT',
      'Higher chances if you already have a research relationship with a Japanese professor',
    ],
    cons: [
      'Must already have a Letter of Acceptance from a Japanese university before applying',
      'You can only apply to the one university recommending you',
      'Not all universities offer this route - requires per-campus research',
    ],
    bestFor: 'Research students (Master/PhD) who already have professor contacts in Japan or prior exchange experience',
  },
];

const mextGakubuExams: ExamDetail[] = [
  {
    program: 'IPA-A (Science & Engineering)',
    subjects: [
      { name: 'Mathematics', notes: 'Covers calculus, trigonometry, algebra, geometry - equivalent to Grade 12 science track' },
      { name: 'English', notes: 'Reading comprehension, grammar, vocabulary - generally easier than TOEFL' },
      { name: 'Japanese', notes: 'Mandatory for all applicants. Basic to intermediate level. Less weight than Math & English' },
      { name: 'Physics', notes: 'Mechanics, thermodynamics, waves, electricity & magnetism' },
      { name: 'Chemistry', notes: 'Atomic structure, stoichiometry, thermochemistry, equilibrium' },
    ],
    tips: [
      'No penalty for wrong answers - fill in every question, never leave blanks',
      'Prioritize Mathematics and English - these carry the most weight',
      'Study past exam papers at studyinjapan.go.jp - question patterns rarely change drastically',
    ],
    pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
  },
  {
    program: 'IPA-B (Biology & Health Sciences)',
    subjects: [
      { name: 'Mathematics', notes: 'Covers calculus, trigonometry, algebra, geometry' },
      { name: 'English', notes: 'Reading comprehension, grammar, vocabulary' },
      { name: 'Japanese', notes: 'Mandatory for all applicants' },
      { name: 'Chemistry', notes: 'Atomic structure, stoichiometry, thermochemistry, equilibrium' },
      { name: 'Biology', notes: 'Cells, genetics, evolution, ecology, physiology' },
    ],
    tips: [
      'No penalty for wrong answers - fill in everything',
      'Mathematics and English carry the most weight',
    ],
    pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
  },
  {
    program: 'IPA-C (Medicine & Dentistry)',
    subjects: [
      { name: 'Mathematics', notes: 'Covers calculus, trigonometry, algebra, geometry' },
      { name: 'English', notes: 'Reading comprehension, grammar, vocabulary' },
      { name: 'Japanese', notes: 'Mandatory for all applicants' },
      { name: 'Chemistry', notes: 'Atomic structure, stoichiometry, thermochemistry, equilibrium' },
      { name: 'Biology', notes: 'Cells, genetics, evolution, ecology, physiology' },
    ],
    tips: [
      'Medicine in Japan is extremely competitive - aim for the highest possible scores',
      'JLPT N3 or above is a significant bonus for medical fields',
    ],
    pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
  },
  {
    program: 'IPS-A (Social Sciences & Humanities)',
    subjects: [
      { name: 'Mathematics', notes: 'Lighter than Science track - focuses on basic math, statistics, logic' },
      { name: 'English', notes: 'Reading comprehension, grammar, vocabulary - heavily weighted' },
      { name: 'Japanese', notes: 'Mandatory. Japanese score carries more weight for Social Sciences' },
      { name: 'Integrated Social Studies', notes: 'History, geography, economics, politics - equivalent to social studies exams' },
    ],
    tips: [
      'For Social Sciences, English and Japanese are the decisive subjects',
      'IPS applicants with JLPT N3 or EJU 240+ can apply even with report card grades below 85',
    ],
    pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
  },
  {
    program: 'IPS-B (Economics & Business)',
    subjects: [
      { name: 'Mathematics', notes: 'Basic math, statistics, logic - more applied to economics' },
      { name: 'English', notes: 'Reading comprehension, grammar, vocabulary' },
      { name: 'Japanese', notes: 'Mandatory' },
      { name: 'Integrated Social Studies', notes: 'Economics, basic accounting, economic geography' },
    ],
    tips: [
      'Focus on Mathematics and English - economics in Japan heavily uses quantitative models',
    ],
    pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
  },
];

const mextResearchExams: ExamDetail[] = [
  {
    program: 'Research Student (Master/PhD)',
    subjects: [
      { name: 'English', notes: 'TOEFL ITP equivalent level. Reading + grammar + vocabulary' },
      { name: 'Japanese', notes: 'Basic to intermediate. For Japanese-medium programs, this score matters more' },
    ],
    tips: [
      'No subject-specific exams - only languages! Focus 100% on English + Japanese',
      'IELTS 5.5 or TOEFL ITP 543 can replace the English exam (check current year requirements)',
      'Have a professor LoA before the exam? You can bypass the written test entirely via University Recommendation',
      'Your research proposal will be discussed during the interview - not in the written exam',
    ],
    pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
  },
];

const mextSocialLinks: SocialLink[] = [
  { label: 'PPI Jepang (Indonesian Student Association)', platform: 'instagram', handle: '@ppi.jepang', url: 'https://www.instagram.com/ppi.jepang/' },
  { label: 'Embassy of Japan in Jakarta', platform: 'website', handle: 'id.emb-japan.go.jp', url: 'https://www.id.emb-japan.go.jp/itpr_id/sch_gakubu.html' },
  { label: 'MEXT Online Registration', platform: 'website', handle: 'beasiswamext.com', url: 'https://daftar.beasiswamext.com/' },
  { label: 'Official Past Exam Papers', platform: 'website', handle: 'studyinjapan.go.jp', url: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html' },
  { label: '@lailaintanps (MEXT awardee & content creator)', platform: 'instagram', handle: '@lailaintanps', url: 'https://www.instagram.com/lailaintanps/' },
];

const mextStrategyTips: string[] = [
  'Choose your track wisely - Embassy Track for first-timers, University Recommendation for those with professor connections',
  'Fill in every answer on the written exam - no penalty for wrong answers. Never leave blanks!',
  'Maximize your English score - it carries the most weight across all programs',
  'Prepare documents well in advance. The embassy does not accept files via ride-hailing couriers - use official document delivery services',
  'Write the program code on the top right of your envelope (e.g., "Gakubu 2027_[exam number]") - code errors can cause your application to be rejected',
  'For Research Students: secure a Letter of Acceptance from a Japanese professor to bypass the written exam',
];

const mextDifferentiators: { label: string; description: string }[] = [
  {
    label: 'No Bond / Service Obligation',
    description: 'After graduation, you are free - no obligation to return to Indonesia. You can work in Japan or continue studies.',
  },
  {
    label: '1 Year Free Language Training',
    description: 'All MEXT recipients (except Japanese Studies & Teacher Training) receive 1 year of intensive Japanese language training at their host university before starting their degree.',
  },
  {
    label: 'Choose Any National University',
    description: 'You can enroll at any Japanese national university, including University of Tokyo, Kyoto University, Osaka University, and more.',
  },
  {
    label: 'IELTS Alternatives: STEP, EJU, TOEFL ITP',
    description: 'No IELTS? Use STEP 85+, TOEFL ITP 543, or EJU scores. For Arabic/Sharia programs, English testing may be waived entirely.',
  },
];

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

// ── Romanian MFA + ARICE Shared Data ─────────────────────────────────────────────

const romaniaTrackComparison: TrackInfo[] = [
  {
    name: 'Romanian MFA Scholarship (MFA Route)',
    acceptanceRate: '500 awards/year globally for non-EU (highly competitive)',
    quota: 'Limited per sending country; Indonesia eligible',
    pros: [
      'Apply online via the Study in Romania portal - straightforward workflow',
      'All non-EU students eligible, no separate interview at the embassy stage',
      'Choose 2 Romanian public universities in order of preference (locked after submit)',
      'All education-related documents (only) need apostille during registration',
      '1-year Romanian language preparatory year provided free for non-speakers',
    ],
    cons: [
      'Stipend is very small: ~925 Lei/month (~€185 or ~$200). Enough for one month only if you get free dorm.',
      'Dorm availability varies by university - free, partial, or paid depending on each campus',
      'Romanian language is mandatory - no bypass even for English-taught programs',
      'Application is locked after submit - cannot add or change anything',
      'Results delayed historically (mid-July but can slip) - check your portal account, not just email',
    ],
    bestFor: 'Indonesians who want a fully-funded European degree and can self-fund living costs (stipend is symbolic)',
  },
  {
    name: 'Romanian ARICE Scholarship (ARICE Route)',
    acceptanceRate: 'Only 40 seats worldwide (extremely competitive)',
    quota: '40 awards globally per year',
    pros: [
      'Send application by EMAIL (not portal) with 3 specific annexes (1, 2, 3) all signed',
      'Priority fields: economics/business admin, agricultural sciences, technical sciences, oil & gas',
      'Selection is strictly merit-based - academic transcripts + strong letters of recommendation',
      'Coordinated with the Indonesian Embassy in Bucharest for documentation',
      'Same benefits as MFA: tuition + dorm + medical + transport + monthly stipend',
    ],
    cons: [
      'Only 40 seats worldwide - highly selective',
      'Recommendation letter MUST be from specific entities: ARICE economic rep in your country, embassy/consulate in Romania, or ARICE-backed economic entities (not any professor)',
      'Different deadline from MFA: usually May-June (vs MFA Feb-March)',
      'Email-based application - incomplete or late submissions automatically disqualified',
      'Same low stipend (~925 Lei/month) and dorm lottery',
    ],
    bestFor: 'Top-performing students in priority fields (economics, business, agriculture, engineering) with strong academic records and existing professional connections',
  },
];

const romaniaSocialLinks: SocialLink[] = [
  { label: 'KBRI Bucharest (Indonesian Embassy)', platform: 'instagram', handle: '@indonesiainbucharest', url: 'https://www.instagram.com/indonesiainbucharest/' },
  { label: 'PPI Romania (Indonesian Student Association)', platform: 'instagram', handle: '@ppi.rumania', url: 'https://www.instagram.com/ppi.rumania/' },
  { label: 'PPI Romania (Facebook)', platform: 'website', handle: 'PPI Romania', url: 'https://www.facebook.com/ppirromania/' },
  { label: 'Romanian Embassy in Jakarta', platform: 'instagram', handle: '@romaniainindonesia', url: 'https://www.instagram.com/romaniainindonesia/' },
  { label: 'Romanian Embassy Jakarta (Official Site)', platform: 'website', handle: 'jakarta.mae.ro', url: 'https://jakarta.mae.ro/en' },
  { label: 'Study in Romania Portal (MFA Application)', platform: 'website', handle: 'scholarships.studyinromania.gov.ro', url: 'https://scholarships.studyinromania.gov.ro' },
  { label: 'ARICE Official Site', platform: 'website', handle: 'arice.gov.ro', url: 'https://arice.gov.ro' },
];

const romaniaMfaStrategyTips: string[] = [
  'Indonesian applicants MUST go through the Study in Romania portal (scholarships.studyinromania.gov.ro) - not directly to a Romanian university',
  'Choose only 2 Romanian public universities in order of preference. Application is locked after submit - research both before submitting',
  'Apostille is ONLY required for education documents (diplomas, transcripts). Birth cert, passport, photos do NOT need apostille',
  'Mandatory 1-year Romanian language preparatory year for everyone (even for English-taught programs). No bypass.',
  'Plan to self-fund living costs. The ~925 Lei/month stipend (~€185 or ~$200) only covers basic needs if you get free dorm. Without dorm, you need €300-500/month from your own pocket.',
  'Dorm status varies by university - some give free dorm, some partial subsidy, some nothing. Check the specific university housing office before you apply.',
  'Choose cities wisely: Iași (€300-400/month) is most affordable, Bucharest (€500-700) is most expensive. Pick a program in a city you can afford.',
  'PhD applicants: contact a potential Romanian supervisor BEFORE March deadline. MFA provides zero help finding one. Securing their agreement in principle is your responsibility.',
  'Check your portal account for results, not just email. Results traditionally come mid-July but have been delayed in past cycles.',
];

const romaniaAriceStrategyTips: string[] = [
  'Apply via EMAIL to burse2026@arice.gov.ro (not via portal). Subject line: "ARICE Scholarship Application 2026 - [Your Full Name]"',
  'All 3 specific annexes MUST be filled, signed, and scanned as PDFs: Annex 1 (ARICE form), Annex 2 (Ministry of Education form), Annex 3 (self-declaration)',
  'Recommendation letter MUST come from specific entities: ARICE economic rep in your country, embassy/consulate in Romania, or ARICE-backed economic entities. NOT just any professor.',
  'Application window: 11 May - 12 June 2026 (different from MFA which is Feb-March). Incomplete or late submissions are automatically disqualified.',
  'Priority fields: economics/business admin, agricultural sciences, technical sciences, oil & gas. Other fields only if seats remain after priority placement.',
  'Selection is strictly merit-based - academic transcripts and strong recommendations. No interviews at this stage.',
  'ARICE has only 40 seats worldwide for all non-EU countries combined - including Indonesia. Highly competitive.',
  'All documents must be in PDF. Translations accepted in Romanian, English, or French only.',
  'Documents from Hague Convention countries need apostille. Non-Hague countries need superlegalization via Romanian embassy.',
];

const romaniaDifferentiators: { label: string; description: string }[] = [
  {
    label: 'Real Stipend: 925 Lei/Month (~€185 or ~$200)',
    description: 'The actual amount awardees receive is 925 Lei per month. Enough for basic needs ONLY if you get a free dorm. Without dorm, you need to self-fund €300-500/month from personal savings.',
  },
  {
    label: 'Dormitory Varies Per University (Not Guaranteed Free)',
    description: 'Each Romanian university decides its own dorm policy: some give free dorm, some partial subsidy, some nothing (you pay private rent €150-300/month). Check housing office before applying.',
  },
  {
    label: 'Apostille Only for Education Documents',
    description: 'Apostille is required ONLY for diplomas, transcripts, and birth certificate at the REGISTRATION phase. Passport copies, photos, and ID cards do NOT need apostille.',
  },
  {
    label: 'Mandatory Romanian Language Year',
    description: 'Even for English-taught programs, all non-Romanian speakers must complete 1-year preparatory language course before starting their degree. No bypass, no exemption (except B1 certificate or 4+ years in Romanian school).',
  },
  {
    label: '2-University Choice Limit',
    description: 'You can only choose 2 Romanian public universities in order of preference. Application is LOCKED after submit - cannot add or change anything later.',
  },
  {
    label: 'Two Separate Timelines (MFA vs ARICE)',
    description: 'MFA opens mid-February, deadline end of March, results mid-July. ARICE opens May, deadline mid-June, results September. Do not confuse them.',
  },
  {
    label: 'PhD Needs Supervisor in Advance',
    description: 'For PhD: must contact a Romanian doctoral school professor willing to sponsor you BEFORE the deadline. Both MFA and ARICE provide zero help finding supervisors.',
  },
  {
    label: 'All Stipends Stop in Summer (Bachelor/Master)',
    description: 'Bachelor and Master stipends stop during summer vacation (July-September). Only PhD and residency awardees receive year-round stipends.',
  },
  {
    label: 'Travel Costs NOT Covered',
    description: 'International flight to Romania AND domestic transport from arrival point to your university are NOT covered by the scholarship.',
  },
  {
    label: '30-Day Post-Graduation Coverage',
    description: 'All scholarship benefits continue for 30 days after graduation for programs lasting at least one year.',
  },
];

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

// ── Chinese Government Scholarship (CGS) Shared Data ─────────────────────────────────

const cgsSocialLinks: SocialLink[] = [
  { label: 'Official Website (CSC)', platform: 'website', handle: 'campuschina.org', url: 'https://www.campuschina.org' },
  { label: 'Application Portal (CSC System)', platform: 'website', handle: 'studyinchina.csc.edu.cn', url: 'https://studyinchina.csc.edu.cn/' },
  { label: 'Chinese Embassy in Jakarta', platform: 'website', handle: 'id.china-embassy.gov.cn', url: 'http://id.china-embassy.gov.cn/eng/' },
  { label: 'PPI Tiongkok (PPIT)', platform: 'instagram', handle: '@ppitiongkok', url: 'https://www.instagram.com/ppitiongkok/' },
  { label: 'PPIT Official Site', platform: 'website', handle: 'ppitiongkok.org', url: 'https://ppitiongkok.org/' },
];

const cgsTrackComparison: TrackInfo[] = [
  {
    name: 'Bilateral Program (Type A)',
    quota: 'Allocated per country via Chinese Embassy',
    pros: [
      'Agency Number for Indonesian applicants is 3602 (direct to Chinese Embassy Jakarta)',
      'Available for all degrees: Bachelor\'s (S1), Master\'s (S2), and Doctoral (S3)',
      '100% tuition waiver, comprehensive medical insurance, and free on-campus dormitory accommodation',
      'If Chinese language proficiency is low, a fully-funded 1-year Mandarin prep course is provided',
    ],
    cons: [
      'Does NOT cover international airfare: awardees must pay for their own flights to and from China',
      'Obtaining a Pre-Admission Letter from your target Chinese university is highly recommended to secure placement',
      'Age limits are strict: Bachelors under 25, Masters under 35, PhD under 40',
    ],
    bestFor: 'Outstanding students of all degree levels looking for full tuition and housing coverage in China, willing to self-fund their travel costs',
  },
];

const cgsStrategyTips: string[] = [
  'Input the correct Agency Number: 3602 for the Bilateral Program (Type A) via the Chinese Embassy in Jakarta. Entering a wrong number will lead to automatic disqualification.',
  'Getting a Pre-Admission Letter from your target Chinese university beforehand is highly recommended. It guarantees you will be placed in that university; without it, you may get placed randomly or rejected.',
  'For Chinese-taught programs: you must submit HSK certificates (minimum HSK 3 for Bachelors, HSK 4 for Masters/PhD). If your level is low but you are accepted, you must take a 1-year preparatory Chinese course.',
  'For English-taught programs: submit IELTS/TOEFL scores according to your target university\'s specific requirements. No HSK is required.',
  'Be prepared to buy your own flights: CGS Bilateral Program does not cover international airfare to/from China.',
  'The selection interview by the Embassy panel (3-5 members) lasts 15-30 minutes. Be ready to explain your Study Plan/Research Proposal in detail in English or Chinese.',
];

const cgsDifferentiators = [
  {
    label: 'Pre-Admission Letter Priority',
    description: 'While technically optional, securing a Pre-Admission Letter from your target Chinese university beforehand is critical to guarantee your placement.',
  },
  {
    label: 'No Flight Coverage (Bilateral)',
    description: 'Unlike MEXT or AAS, CGS Bilateral Program (Type A) does not cover international airfare. Awardees must fund their own flights to/from China.',
  },
  {
    label: '1-Year Preparatory Mandarin Course',
    description: 'Admitted students with low HSK scores for Chinese-taught programs receive 1 year of fully-funded Mandarin preparation before starting their main major.',
  },
];

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

// ── All Enrichment Data ────────────────────────────────────────────────────────────

export const enrichmentData: Record<string, EnrichmentData> = {
  // ── MEXT Undergraduate (Gakubu) ──
  'mext-scholarship-undergraduate-gakubu-2027': {
    slug: 'mext-scholarship-undergraduate-gakubu-2027',
    tracks: mextTrackComparison,
    exams: mextGakubuExams,
    socialLinks: mextSocialLinks,
    strategyTips: mextStrategyTips,
    differentiators: mextDifferentiators,
  },

  // ── MEXT College of Technology (KOSEN) ──
  'mext-scholarship-college-of-technology-kosen-2027': {
    slug: 'mext-scholarship-college-of-technology-kosen-2027',
    tracks: mextTrackComparison,
    exams: [
      {
        program: 'KOSEN (Physics Track)',
        subjects: [
          { name: 'Mathematics', notes: 'Basic calculus, trigonometry, algebra' },
          { name: 'Physics', notes: 'Mechanics, electricity, waves, thermodynamics' },
          { name: 'English', notes: 'Reading comprehension, grammar' },
          { name: 'Japanese', notes: 'Mandatory' },
        ],
        tips: [
          'Physics and Mathematics are the deciding factors - prioritize both',
          'No penalty for wrong answers - fill in everything',
        ],
        pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
      },
      {
        program: 'KOSEN (Chemistry Track)',
        subjects: [
          { name: 'Mathematics', notes: 'Basic calculus, trigonometry, algebra' },
          { name: 'Chemistry', notes: 'Atomic structure, stoichiometry, chemical reactions' },
          { name: 'English', notes: 'Reading comprehension, grammar' },
          { name: 'Japanese', notes: 'Mandatory' },
        ],
        tips: [
          'Chemistry and Mathematics are the deciding factors',
          'No penalty for wrong answers - fill in everything',
        ],
        pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
      },
    ],
    socialLinks: mextSocialLinks,
    strategyTips: [
      ...mextStrategyTips,
      'KOSEN is for science-track high school graduates - minimum 80 in Mathematics and English on your report card',
    ],
    differentiators: mextDifferentiators,
  },

  // ── MEXT Research Students (Master/PhD) ──
  'mext-scholarship-research-students-masterphd-2027': {
    slug: 'mext-scholarship-research-students-masterphd-2027',
    tracks: mextTrackComparison,
    exams: mextResearchExams,
    socialLinks: mextSocialLinks,
    strategyTips: [
      ...mextStrategyTips,
      'For Research: secure a Letter of Acceptance from a Japanese professor BEFORE the exam - this is a game-changer',
      'Your research proposal is your main weapon - the interview will ask about your proposal, not formulas to memorize',
      'IELTS 5.5 or TOEFL ITP 543 can replace the English exam (check current year requirements)',
    ],
    differentiators: mextDifferentiators,
  },

  // ── MEXT Japanese Studies ──
  'mext-scholarship-japanese-studies-non-degree-2026': {
    slug: 'mext-scholarship-japanese-studies-non-degree-2026',
    tracks: mextTrackComparison,
    socialLinks: mextSocialLinks,
    differentiators: [
      {
        label: 'Non-Degree 1-Year Program',
        description: 'Focuses on deepening Japanese language and culture. Ideal for Bachelor students in their 3rd semester or higher majoring in Japanese Language/Literature.',
      },
      {
        label: 'University Recommendation Required',
        description: 'Unlike other MEXT programs, Japanese Studies requires a recommendation from your home university - documents are submitted collectively by the institution.',
      },
    ],
  },

  // ── MEXT Specialized Training College (Senshu) ──
  'mext-scholarship-specialized-training-college-senshu-2027': {
    slug: 'mext-scholarship-specialized-training-college-senshu-2027',
    tracks: mextTrackComparison,
    exams: [
      {
        program: 'Senshu (All Tracks)',
        subjects: [
          { name: 'Mathematics', notes: 'Basic math - lighter than Gakubu' },
          { name: 'English', notes: 'Reading comprehension, grammar' },
          { name: 'Japanese', notes: 'Mandatory - Japanese score matters more for vocational tracks' },
        ],
        tips: [
          'Focus on Japanese - for vocational programs, language skills matter more than pure academics',
          'Senshu is ideal for those who want to work in Japan immediately after graduating (3-year diploma)',
        ],
        pastPapersUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
      },
    ],
    socialLinks: mextSocialLinks,
    differentiators: mextDifferentiators,
  },

  // ── MEXT Teacher Training ──
  'mext-scholarship-teacher-training-non-degree-2026': {
    slug: 'mext-scholarship-teacher-training-non-degree-2026',
    tracks: mextTrackComparison,
    socialLinks: mextSocialLinks,
    differentiators: [
      {
        label: 'For Active Teachers Only',
        description: 'An 18-month non-degree program for active K-12 teachers with minimum 5 years of teaching experience.',
      },
      {
        label: '6 Months Language + 12 Months Teacher Training',
        description: 'Unlike other MEXT programs with a full year of language training, Teacher Training is shorter because it focuses directly on teaching methodology.',
      },
    ],
  },

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

  // ── Romanian MFA Scholarship ──
  'romanian-government-mfa-scholarship-non-eu-citizens': {
    slug: 'romanian-government-mfa-scholarship-non-eu-citizens',
    tracks: romaniaTrackComparison,
    socialLinks: romaniaSocialLinks,
    strategyTips: romaniaMfaStrategyTips,
    differentiators: romaniaDifferentiators,
  },

  // ── Romanian ARICE Scholarship ──
  'romanian-government-arice-scholarship': {
    slug: 'romanian-government-arice-scholarship',
    tracks: romaniaTrackComparison,
    socialLinks: romaniaSocialLinks,
    strategyTips: romaniaAriceStrategyTips,
    differentiators: romaniaDifferentiators,
  },

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

  // ── Australia Awards Scholarships (AAS) ──
  'australia-awards-scholarships-phd-masters-indonesia': {
    slug: 'australia-awards-scholarships-phd-masters-indonesia',
    tracks: aasTrackComparison,
    trackSectionTitle: 'Applicant Categories',
    socialLinks: aasSocialLinks,
    strategyTips: aasStrategyTips,
    differentiators: aasDifferentiators,
  },

  // ── UK Chevening Scholarship ──
  'chevening-scholarship-indonesia': {
    slug: 'chevening-scholarship-indonesia',
    tracks: cheveningTrackComparison,
    trackSectionTitle: 'Scholarship Pathway',
    socialLinks: cheveningSocialLinks,
    strategyTips: cheveningStrategyTips,
    differentiators: cheveningDifferentiators,
  },

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

  // ── Chinese Government Scholarship ──
  'chinese-government-scholarship-cgs-bilateral-program': {
    slug: 'chinese-government-scholarship-cgs-bilateral-program',
    tracks: cgsTrackComparison,
    trackSectionTitle: 'Scholarship Track',
    socialLinks: cgsSocialLinks,
    strategyTips: cgsStrategyTips,
    differentiators: cgsDifferentiators,
  },

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
};

import { TrackInfo, ExamDetail, SocialLink, EnrichmentData } from '../enriched';

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
      'IPS applicants with JLPT N3 or EJU 240+ can apply even with report card grades below 84',
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
      { name: 'English', notes: 'Academic English: advanced reading comprehension, grammar, and vocabulary' },
      { name: 'Japanese', notes: 'Basic to advanced. Mandatory to sit for all applicants, even for English-track degree candidates' },
    ],
    tips: [
      'No subject-specific written exams - only English and Japanese languages are tested!',
      'CRITICAL: TOEFL ITP, Prediction tests, and Duolingo are STRICTLY NOT ACCEPTED by the Embassy of Japan. You must submit TOEFL iBT 72+, IELTS 5.5+, TOEIC L&R 785+, TOEIC S&W 310+, or JLPT N2+.',
      'Japanese language exam score: While not the sole determinant for English programs, sitting for the exam is mandatory (attendance required even if score is minimal).',
      'Your Field of Study and Research Plan (3-5 pages) is your most vital asset - the interview panel probes methodology and feasibility heavily.',
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
  'Choose your track wisely: Embassy Track (E-to-E) for open multi-campus options; University Track (U-to-U) if you have strong direct professor ties.',
  'Fill in every answer on the written exam: There is no negative marking or penalty for wrong answers. Never leave blanks!',
  'The 2-University Rule for LoA: After passing Primary Screening, you may only contact a maximum of 2 Japanese universities/professors concurrently. Shotgun mass-emailing is strictly prohibited and can cause immediate disqualification.',
  'Strict Physical Submission: Berkas fisik wajib dikirim via pos/kurir resmi (POS/JNE/TIKI/SiCepat). Ojol / kurir instan / antar langsung ke gerbang Kedubes Jakarta DITOLAK.',
  'Envelope Labeling: Tulis kode program dan nomor registrasi di pojok kanan atas amplop (contoh: "RESEARCH 2027_[Nomor Ujian]" atau "GAKUBU 2027_[Nomor Ujian]").',
  '5 Exam Cities in Indonesia: Ujian tulis serentak di 5 kota (Jakarta, Surabaya, Medan, Denpasar, Makassar). Pilih kota ujian saat registrasi online pertama kali karena tidak dapat diubah.',
];

const mextDifferentiators: { label: string; description: string }[] = [
  {
    label: 'No Bond / Service Obligation',
    description: 'After graduation, you are completely free - no obligation to return to Indonesia. You can work in Japan or continue studies globally.',
  },
  {
    label: '1 Year Free Language Training',
    description: 'All degree-track MEXT recipients receive 1 year (or 6 months for research) of intensive Japanese language training at their host institution before starting academic degrees.',
  },
  {
    label: 'Choose Any National University',
    description: 'You can enroll at prestigious Japanese national universities (e.g. University of Tokyo, Kyoto University, Osaka University, Tokyo Tech / Institute of Science Tokyo).',
  },
  {
    label: 'Strict Language Test Standards',
    description: 'Embassy of Japan accepts official TOEFL iBT (min 72), IELTS (min 5.5), TOEIC L&R (min 785) / S&W (min 310), or JLPT (min N2). Note: TOEFL ITP is strictly not accepted.',
  },
];


export const japanEnrichment: Record<string, EnrichmentData> = {
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
      'Research Proposal Architecture: Prepare a 3–5 page proposal clearly identifying research questions, methodology, and why it requires Japanese academic laboratory facilities.',
      'Language Test Reality: Ensure your score is from official tests (TOEFL iBT, IELTS, TOEIC L&R/S&W, or JLPT). TOEFL ITP or prediction tests lead to instant document rejection.',
      'LoA Outreach Timing: Contact professors only AFTER you hold the Primary Screening Certificate from the Embassy. Never solicit LoAs beforehand if applying via Embassy Track.',
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

};

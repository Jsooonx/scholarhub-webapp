export interface CuratedPick {
  slug: string;
  badge: string;
  editorReason: string;
  insiderTip: string;
}

export interface PersonallyCuratedMeta {
  badge: string;
  summary: string;
  verifiedCycle?: string;
}

export const personallyCuratedMap: Record<string, PersonallyCuratedMeta> = {
  'romanian-government-mfa-scholarship-non-eu-citizens': {
    badge: 'Personally Curated',
    summary: 'Thoroughly researched and verified from direct applicant experience, official Study in Romania portal workflow, real living cost breakdowns, and document requirements.',
    verifiedCycle: 'Based on 2026/2027 Cycle',
  },
  'romanian-government-arice-scholarship': {
    badge: 'Personally Curated',
    summary: 'Thoroughly researched and verified from direct applicant experience, official KBRI Bucharest recommendation pathway, ARICE annex forms, and quota data.',
    verifiedCycle: 'Based on 2026/2027 Cycle',
  },
  'mext-scholarship-research-students-masterphd-2027': {
    badge: 'Personally Curated',
    summary: 'Thoroughly researched and verified from official Embassy of Japan in Jakarta guidelines, strict TOEFL iBT / IELTS requirements (TOEFL ITP disqualified), the 2-university LoA limit rule, and postal courier requirements.',
    verifiedCycle: 'Based on 2026/2027 Cycle',
  },
  'mext-scholarship-undergraduate-gakubu-2027': {
    badge: 'Personally Curated',
    summary: 'Thoroughly researched and verified from official Embassy of Japan in Jakarta criteria, including the 84 report card threshold, IPS JLPT N3 exception pathway, and 5 national exam test cities.',
    verifiedCycle: 'Based on 2026/2027 Cycle',
  },
  'asean-undergraduate-scholarship-nus': {
    badge: 'Personally Curated',
    summary: 'Thoroughly researched and verified for Indonesian high school (Kurikulum Merdeka / K-13) applicants. Covers the discontinuation of UEE, realistic SAT/AP/OSN benchmarks, 100% automatic screening workflow, S$3,000 accommodation allowance budgeting, and the mandatory 3-year MOE Tuition Grant work bond.',
    verifiedCycle: 'Based on 2026/2027 Cycle',
  },
  'asean-undergraduate-scholarship-ntu': {
    badge: 'Personally Curated',
    summary: 'Thoroughly researched and verified for Indonesian applicants. Unpacks the critical 20 January early deadline, the separate online scholarship portal requirement, the 300-word essay and teacher appraisal workflow, Group Discussion (GD) selection tactics, and MOE Tuition Grant bond conditions.',
    verifiedCycle: 'Based on 2026/2027 Cycle',
  },
  'dr-goh-keng-swee-gks-scholarship': {
    badge: 'Personally Curated',
    summary: 'Singapore\'s pinnacle private-sector undergraduate scholarship administered by the Association of Banks in Singapore (ABS) exclusively via NUS. Features an ultra-exclusive quota of only 3–4 recipients across all 15 Asia Pacific economies, return airfare coverage, and a unique 3-year work bond that can be fulfilled at approved Singapore-based firms in Indonesia.',
    verifiedCycle: 'Based on 2026/2027 Cycle',
  },
};

export function isPersonallyCurated(slug: string): boolean {
  return Boolean(personallyCuratedMap[slug]);
}

export function getPersonallyCuratedMeta(slug: string): PersonallyCuratedMeta | null {
  return personallyCuratedMap[slug] || null;
}

export const curatedPicks: CuratedPick[] = [

  // ── ROMANIA GOVERNMENT (MFA vs ARICE Dual Route) ──────────────────────────

  // 1. Romanian Government MFA Scholarship (MFA Route - Non-EU Citizens)
  {
    slug: 'romanian-government-mfa-scholarship-non-eu-citizens',
    badge: 'MFA Portal · 500 Quota',
    editorReason: 'Romania\'s flagship diplomatic track offering ~500 global seats across all fields (except Medicine). Administered via the Study in Romania portal, it covers full tuition, dorms, and a 1-year Romanian language preparatory year.',
    insiderTip: 'Selection is 100% document-based with zero interview stages. Ensure diplomas have Hague Apostille verification. You can only choose 2 public universities (locked once submitted), with deadline strictly on March 31.'
  },

  // 2. Romanian Government ARICE Scholarship (ARICE Route)
  {
    slug: 'romanian-government-arice-scholarship',
    badge: 'ARICE Email · 40 Quota',
    editorReason: 'Administered by the Agency for Investments and Foreign Trade, this ultra-selective scheme awards only 40 seats worldwide, prioritizing Economics & Business, Agriculture, Engineering, and Oil & Gas.',
    insiderTip: 'Khusus WNI: Wajib pantau IG @indonesiainbucharest. Kirim berkas lengkap ke KBRI Bucharest via email untuk terbitkan Surekom + Nota Verbal—pihak KBRI yang akan submit langsung ke ARICE!'
  },

  // ── UNDERGRADUATE (Bachelor / S1) ─────────────────────────────────────────

  // 3. MEXT Undergraduate - Gakubu (Japan)
  {
    slug: 'mext-scholarship-undergraduate-gakubu-2027',
    badge: 'Fully Funded S1',
    editorReason: 'The MEXT Gakubu scholarship is a highly competitive, fully funded pathway that benchmarks applicants through a rigorous written examination rather than just school grades. It includes 1 year of intensive Japanese language and university preparatory training.',
    insiderTip: 'MEXT applications are split into Embassy and University tracks. For undergraduate applicants, written exams are the ultimate filter, whereas research applicants can strategically bypass these tests via direct professor nomination. Click to explore both tracks.'
  },

  // 4. ASEAN Undergraduate Scholarship - NUS (Singapore)
  {
    slug: 'asean-undergraduate-scholarship-nus',
    badge: 'Automatic Selection · 3-Yr Bond',
    editorReason: 'A world-class undergraduate award at Asia\'s top university. It covers 100% of subsidised tuition plus annual living (S$5,800), accommodation (S$3,000), and computer allowances (S$1,750), with automatic screening during NUS admission.',
    insiderTip: 'UEE has been discontinued. For Indonesian SMA (Kurikulum Merdeka/K-13) applicants, Rapor alone is rarely enough to beat IB/A-Level competitors — historical awardees hold OSN medals or SAT 1500+ / 3+ APs (score 5). Note: requires a mandatory 3-year MOE Tuition Grant work bond in Singapore and flights are self-funded.'
  },

  // 5. ASEAN Undergraduate Scholarship - NTU (Singapore)
  {
    slug: 'asean-undergraduate-scholarship-ntu',
    badge: 'Top Tier SG · Essay Required',
    editorReason: 'NTU\'s flagship regional scholarship covering full subsidised tuition and providing annual living and accommodation allowances. Requires an active scholarship application submission via the applicant portal.',
    insiderTip: 'CRITICAL: Unlike NUS, NTU is NOT 100% automatic! You MUST submit a separate scholarship application in the NTU portal, write a 250–300 word personal essay, and ensure your teacher submits the online referee appraisal within 7–14 days. Indonesian SMA deadline closes early on 20 January.'
  },

  // 6. Dr Goh Keng Swee (GKS) Scholarship - NUS / ABS (Singapore)
  {
    slug: 'dr-goh-keng-swee-gks-scholarship',
    badge: 'Top Elite · Airfare Included',
    editorReason: 'Singapore\'s most prestigious private-sector undergraduate scholarship, funded by the Association of Banks in Singapore (ABS) and tenable exclusively at NUS from 2026. Covers full tuition, living (S$6,500/yr), hostel, computer, and return airfare.',
    insiderTip: 'Only 3–4 scholarships are awarded annually across 15 Asia-Pacific economies! You do not need to study banking (open to computing, engineering, business, sciences). The 3-year service bond is uniquely flexible: work in Singapore OR at an approved Singapore-based company in Indonesia (e.g. DBS Indonesia, OCBC NISP, Grab, Shopee). Apply via NUS admissions by mid-February.'
  },

  // 7. GKS Undergraduate Scholarship (South Korea)
  {
    slug: 'gks-undergraduate-scholarship-global-korea-scholarship-bachelors',
    badge: 'No IELTS Required',
    editorReason: 'South Korea\'s ultimate fully funded scheme, unique for its dual-track system that allows applicants to strategically choose between multi-university options or localized regional quotas.',
    insiderTip: 'Success in GKS depends entirely on choosing the right gateway. You must strategically weigh the multi-choice Embassy Track against the direct, single-choice University Track which offers dedicated regional quotas. Click to unlock our full breakdown of both pathways.'
  },

  // 7. KAIST Undergraduate Scholarship (South Korea)
  {
    slug: 'kaist-international-student-scholarship-undergraduate',
    badge: 'English-Taught STEM',
    editorReason: 'A world-class technical university in South Korea, offering full tuition waivers and living allowances for S1 students with classes conducted entirely in English.',
    insiderTip: 'High school grades in math and science are highly valued. Submitting standardized test scores (SAT/ACT/AP/IB) will greatly enhance your competitiveness.'
  },

  // 8. Türkiye Bursları Bachelor's Scholarship (Turkey)
  {
    slug: 'trkiye-burslari-bachelors-scholarship-program',
    badge: 'Free Turkish Course',
    editorReason: 'The Türkiye Bursları Bachelor\'s program offers high school graduates a fully funded pathway to study S1 in Turkey, including university placement, housing, and monthly stipends.',
    insiderTip: 'Turkish universities value academic consistency. Make sure your high school graduation scores are excellent, and prepare well for basic academic logic and math questions that might be asked in the interview.'
  },

  // 9. Stipendium Hungaricum Bachelor's Scholarship (Hungary)
  {
    slug: 'stipendium-hungaricum-bachelors-one-tier-masters-scholarship',
    badge: 'No Application Fee',
    editorReason: 'Provides tuition-free undergraduate study in Hungary across diverse fields of study, offering Indonesian high school graduates a chance to study in the heart of Europe.',
    insiderTip: 'Apply for courses that align with your high school academic track. Since the selection is highly competitive, make sure your recommendation letters highlight your academic drive.'
  },

  // 10. Saudi Government Bachelor's Scholarship (Saudi Arabia)
  {
    slug: 'saudi-government-scholarship-bachelors-study-in-saudi-arabia',
    badge: 'No Application Fee',
    editorReason: 'Fully funded S1 degree programs in Saudi Arabia, covering tuition, accommodation, return flights, and medical care for international students.',
    insiderTip: 'Prepare all required documents (translated into English or Arabic) and verify them. Focus on academic transcripts as the admission committee values high GPA consistency.'
  },

  // ── MASTER (S2) ────────────────────────────────────────────────────────────

  // MEXT Research Students (Master / PhD) - Japan
  {
    slug: 'mext-scholarship-research-students-masterphd-2027',
    badge: 'No Bond · Top Stipend',
    editorReason: 'The premier Japanese government scholarship for Master\'s and PhD studies. It offers 100% tuition coverage, a generous monthly stipend (¥143,000–¥145,000), return airfare, and zero return-service obligation, allowing graduates to launch careers in Japan or globally.',
    insiderTip: 'Indonesian applicants must note: Kedubes Jepang strictly rejects TOEFL ITP (only TOEFL iBT 72+, IELTS 5.5+, TOEIC 785+, or JLPT N2 accepted). After passing Primary Screening, you can only contact max 2 universities concurrently for LoAs. Click to explore Embassy vs University tracks.'
  },

  // 11. KAUST Fellowship (Saudi Arabia) — Master / PhD
  {
    slug: 'king-abdullah-university-of-science-technology-kaust-fellowship',
    badge: 'Highest Stipend',
    editorReason: 'King Abdullah University of Science and Technology (KAUST) offers a fully funded fellowship with an incredibly high annual stipend ($30,000 - $35,000 USD, tax-free), free furnished housing, full health cover, and annual flights.',
    insiderTip: 'Since the scholarship is bond-free and extremely generous, selection panels focus heavily on your research background. Align your research statement directly with a KAUST faculty member\'s active projects before applying.'
  },

  // 12. Chevening Scholarship (UK)
  {
    slug: 'chevening-scholarship-indonesia',
    badge: 'Prestigious Network',
    editorReason: 'Funded by the UK Government (FCDO), Chevening offers fully funded 1-year Master\'s degrees at world-class UK universities for future leaders and influencers.',
    insiderTip: 'Chevening values strong networking and leadership potential. Craft four cohesive essays (Leadership, Networking, Study in UK, Career Plan) that link together with clear, real-life examples.'
  },

  // 13. Fulbright Master's Scholarship (US)
  {
    slug: 'fulbright-masters-degree-scholarship',
    badge: 'No TOEFL iBT Needed',
    editorReason: 'Administered by AMINEF for graduate studies in the United States. Offers comprehensive support through visa processing, university placements, and arrival logistics.',
    insiderTip: 'Fulbright accepts paper-based TOEFL ITP scores for the initial application stage, meaning you do not need to take expensive IELTS or TOEFL iBT tests beforehand.'
  },

  // 14. Saudi Government Master's Scholarship (Saudi Arabia)
  {
    slug: 'saudi-government-scholarship-masters-study-in-saudi-arabia',
    badge: 'High Living Stipend',
    editorReason: 'Offers full-ride funding for graduate studies at top-ranked universities in Saudi Arabia, including world-class research institutes like KAUST.',
    insiderTip: 'KAUST offers state-of-the-art laboratory facilities and abundant research funding. The scholarship package provides one of the highest monthly stipends globally.'
  },

  // 15. Türkiye Bursları Master's Scholarship (Turkey)
  {
    slug: 'trkiye-burslari-graduate-scholarship-program-masters',
    badge: 'Free Turkish Course',
    editorReason: 'The Master\'s track of Türkiye Bursları is a comprehensive package covering tuition, accommodation, health insurance, return flights, and a full preparatory year of Turkish language studies.',
    insiderTip: 'The online application form is highly detailed. Pay extra attention to the Letter of Intent section. Clearly describe why Turkey is your ideal academic destination.'
  },

  // 16. Chinese Government Scholarship Bilateral (China)
  {
    slug: 'chinese-government-scholarship-cgs-bilateral-program',
    badge: 'Fully Funded',
    editorReason: 'The Chinese Government Scholarship Bilateral Program funds international students at top Chinese universities through direct nomination by the Chinese Embassy in Jakarta.',
    insiderTip: 'Securing a Pre-admission Letter from your target Chinese university beforehand guarantees your placement and significantly boosts your final selection prospects.'
  },

  // 17. Stipendium Hungaricum Master's Scholarship (Hungary)
  {
    slug: 'stipendium-hungaricum-masters-scholarship',
    badge: 'No Application Fee',
    editorReason: 'Funded by the Hungarian Government, Stipendium Hungaricum offers thousands of English-taught degree courses at central European universities with tuition waivers, accommodation support, and medical insurance.',
    insiderTip: 'Since this program requires home-country endorsement, Indonesian applicants must carefully monitor the local Ministry of Education portal for preliminary document screening cycles.'
  },

  // 18. Open Doors Russian Scholarship (Russia)
  {
    slug: 'open-doors-russian-scholarship-project',
    badge: 'Online Olympiad',
    editorReason: 'Provides tuition-free graduate study at 24 leading Russian universities through an fully-online subject Olympiad competition without any application fees.',
    insiderTip: 'The portfolio evaluation phase (Stage 1) carries high weight. Upload all scientific publications, conference certificates, and academic awards to maximize your portfolio score.'
  },

  // ── PhD (S3) ───────────────────────────────────────────────────────────────

  // 19. Rhodes Scholarship (UK)
  {
    slug: 'rhodes-scholarship-university-of-oxford',
    badge: 'Oldest Global Award',
    editorReason: 'The oldest and arguably most famous international scholarship, supporting exceptional postgraduate students at the University of Oxford with a focus on character, leadership, and service.',
    insiderTip: 'Rhodes selection is extremely intense, focusing heavily on character and leadership. Your personal statement should tell a compelling story of your values, driving purpose, and how you plan to stand up for the world.'
  },

  // 20. Gates Cambridge Scholarship (UK)
  {
    slug: 'gates-cambridge-scholarship',
    badge: 'Gates Foundation',
    editorReason: 'One of the most prestigious postgraduate awards globally, providing full funding at the University of Cambridge for students showing exceptional academic ability and leadership potential.',
    insiderTip: 'Gates Cambridge requires a dedicated reference letter evaluating your fit for the scholarship. Choose a referee who can explicitly speak about your commitment to improving the lives of others, not just your academic marks.'
  },

  // 21. Clarendon Fund (UK)
  {
    slug: 'clarendon-fund-scholarship-university-of-oxford',
    badge: 'Oxford Premier',
    editorReason: 'Oxford\'s flagship graduate scholarship scheme, offering full tuition waivers and generous living cost grants for outstanding graduate applicants from all over the world.',
    insiderTip: 'There is no separate application form for Clarendon. All graduate applicants to the University of Oxford who apply before the December/January deadline are automatically considered.'
  },

  // 22. Australia Awards Scholarships (Australia)
  {
    slug: 'australia-awards-scholarships-phd-masters-indonesia',
    badge: 'High Acceptance Rate',
    editorReason: 'Australia Awards Scholarships (AAS) provide full tuition, return airfare, and living expenses for Master\'s and PhD studies in Australia, with a large country allocation for Indonesia.',
    insiderTip: "Focus your essays heavily on the 'Development Impact' section. Explicitly connect your study program to priority development sectors in your home country."
  },

  // 23. Fulbright PhD Scholarship (US)
  {
    slug: 'fulbright-doctoral-degree-phd-scholarship',
    badge: '3 Years Funding',
    editorReason: 'The Fulbright PhD Scholarship provides 3 years of fully-funded doctoral study in the United States, offering candidates access to world-renowned research faculty.',
    insiderTip: 'Clearly outline how your doctoral research will contribute to academic development and capacity building in Indonesia upon your return. A strong academic letter of recommendation is crucial.'
  },

  // 24. GKS Graduate Scholarship (South Korea)
  {
    slug: 'gks-graduate-scholarship-global-korea-scholarship-masters-phd',
    badge: 'Fully Funded',
    editorReason: 'The Global Korea Scholarship (GKS) covers full tuition, flights, and living costs in South Korea, including a mandatory 1-year intensive Korean language program at the start of your journey.',
    insiderTip: 'Applying via the Embassy Track allows you to choose up to three universities, significantly increasing your chances of getting accepted compared to the single-choice University Track.'
  },

  // 25. MEXT Research Students (Japan)
  {
    slug: 'mext-scholarship-research-students-masterphd-2027',
    badge: 'No IELTS Required',
    editorReason: 'A premier research pathway offering complete academic freedom in Japan with zero return bonds. Candidates can choose between the nationwide Embassy route or securing a direct nomination from a Japanese host institution.',
    insiderTip: 'MEXT applications are split into Embassy and University tracks. For undergraduate applicants, written exams are the ultimate filter, whereas research applicants can strategically bypass these tests via direct professor nomination. Click to explore both tracks.'
  },

  // 26. KAIST Graduate Fellowship (South Korea)
  {
    slug: 'kaist-graduate-fellowship-masters-phd',
    badge: 'Extra Lab Stipend',
    editorReason: 'Awarded automatically upon admission, covering full tuition, living stipends, and health insurance, with extra laboratory stipends frequently provided by advisors.',
    insiderTip: 'Contacting and matching with a potential faculty advisor (Professor) before submitting your application is highly critical for graduate admission.'
  },

  // 27. Saudi Government PhD Scholarship (Saudi Arabia)
  {
    slug: 'saudi-government-scholarship-phd-study-in-saudi-arabia',
    badge: 'Full Research Cover',
    editorReason: 'Top-tier research funding for PhD candidates in Saudi Arabia, with access to leading faculty and high-tech lab equipment.',
    insiderTip: 'For technical and scientific fields, apply to research-heavy universities like KAUST. Emphasize your previous publications and research projects in your statement of purpose.'
  },

  // 28. Türkiye Bursları PhD Scholarship (Turkey)
  {
    slug: 'trkiye-burslari-graduate-scholarship-program-phd',
    badge: 'Research Grant Option',
    editorReason: 'The PhD track of Türkiye Bursları provides comprehensive funding for doctoral candidates, with extensive academic resources and connections across state universities.',
    insiderTip: 'Make sure you have a highly detailed research proposal. Contacting a supervisor at your target Turkish university beforehand and attaching a letter of support will strongly boost your candidacy.'
  },

  // 29. Stipendium Hungaricum PhD Scholarship (Hungary)
  {
    slug: 'stipendium-hungaricum-doctoral-phd-scholarship',
    badge: 'High PhD Allowance',
    editorReason: 'Full-ride doctoral funding for 4 years in Hungary, with higher monthly stipends than undergraduate levels, tuition coverage, and medical insurance.',
    insiderTip: 'You must secure a supervisor from a Hungarian doctoral school before applying. Having a detailed research proposal and an acceptance email from a Hungarian professor is mandatory.'
  },

  // 30. Russian Government Quota (Russia)
  {
    slug: 'russian-government-scholarship-quota-via-rossotrudnichestvo',
    badge: 'Fully Funded',
    editorReason: 'Provides fully funded education for S1, S2, and S3 degrees at over 1,700 Russian universities, including a free 1-year Russian language preparatory course.',
    insiderTip: 'Applications are submitted through the official portal. Having a clean academic transcript and translated documents is vital as Rossotrudnichestvo evaluates candidates carefully.'
  }
];

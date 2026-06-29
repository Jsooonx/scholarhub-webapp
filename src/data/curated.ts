export interface CuratedPick {
  slug: string;
  badge: string;
  editorReason: string;
  insiderTip: string;
}

export const curatedPicks: CuratedPick[] = [

  // ── UNDERGRADUATE (Bachelor / S1) ─────────────────────────────────────────

  // 1. MEXT Undergraduate - Gakubu (Japan)
  {
    slug: 'mext-scholarship-undergraduate-gakubu-2027',
    badge: 'Fully Funded S1',
    editorReason: 'The MEXT Gakubu scholarship is a highly competitive, fully funded pathway that benchmarks applicants through a rigorous written examination rather than just school grades. It includes 1 year of intensive Japanese language and university preparatory training.',
    insiderTip: 'MEXT applications are split into Embassy and University tracks. For undergraduate applicants, written exams are the ultimate filter, whereas research applicants can strategically bypass these tests via direct professor nomination. Click to explore both tracks.'
  },

  // 2. ASEAN Undergraduate Scholarship - NUS (Singapore)
  {
    slug: 'asean-undergraduate-scholarship-nus',
    badge: 'Automatic Selection',
    editorReason: 'A highly prestigious, bond-free undergraduate scholarship offered by the National University of Singapore (NUS) for outstanding students from ASEAN member countries.',
    insiderTip: 'There is no separate application form. Selection is made automatically during the NUS admissions process, so make sure your high school grades and Olympiad achievements are stellar.'
  },

  // 3. ASEAN Undergraduate Scholarship - NTU (Singapore)
  {
    slug: 'asean-undergraduate-scholarship-ntu',
    badge: 'Automatic Selection',
    editorReason: 'Offered by Nanyang Technological University (NTU), this bond-free scholarship covers full tuition and provides allowance for outstanding ASEAN students.',
    insiderTip: 'Like NUS, there is no separate application form. Admission to NTU automatically screens you for this scholarship, so aim for top grades and outstanding Co-Curricular Activities (CCA).'
  },

  // 4. GKS Undergraduate Scholarship (South Korea)
  {
    slug: 'gks-undergraduate-scholarship-global-korea-scholarship-bachelors',
    badge: 'No IELTS Required',
    editorReason: 'South Korea\'s ultimate fully funded scheme, unique for its dual-track system that allows applicants to strategically choose between multi-university options or localized regional quotas.',
    insiderTip: 'Success in GKS depends entirely on choosing the right gateway. You must strategically weigh the multi-choice Embassy Track against the direct, single-choice University Track which offers dedicated regional quotas. Click to unlock our full breakdown of both pathways.'
  },

  // 5. KAIST Undergraduate Scholarship (South Korea)
  {
    slug: 'kaist-international-student-scholarship-undergraduate',
    badge: 'English-Taught STEM',
    editorReason: 'A world-class technical university in South Korea, offering full tuition waivers and living allowances for S1 students with classes conducted entirely in English.',
    insiderTip: 'High school grades in math and science are highly valued. Submitting standardized test scores (SAT/ACT/AP/IB) will greatly enhance your competitiveness.'
  },

  // 6. Türkiye Bursları Bachelor's Scholarship (Turkey)
  {
    slug: 'trkiye-burslari-bachelors-scholarship-program',
    badge: 'Free Turkish Course',
    editorReason: 'The Türkiye Bursları Bachelor\'s program offers high school graduates a fully funded pathway to study S1 in Turkey, including university placement, housing, and monthly stipends.',
    insiderTip: 'Turkish universities value academic consistency. Make sure your high school graduation scores are excellent, and prepare well for basic academic logic and math questions that might be asked in the interview.'
  },

  // 7. Stipendium Hungaricum Bachelor's Scholarship (Hungary)
  {
    slug: 'stipendium-hungaricum-bachelors-one-tier-masters-scholarship',
    badge: 'No Application Fee',
    editorReason: 'Provides tuition-free undergraduate study in Hungary across diverse fields of study, offering Indonesian high school graduates a chance to study in the heart of Europe.',
    insiderTip: 'Apply for courses that align with your high school academic track. Since the selection is highly competitive, make sure your recommendation letters highlight your academic drive.'
  },

  // 8. Saudi Government Bachelor's Scholarship (Saudi Arabia)
  {
    slug: 'saudi-government-scholarship-bachelors-study-in-saudi-arabia',
    badge: 'No Application Fee',
    editorReason: 'Fully funded S1 degree programs in Saudi Arabia, covering tuition, accommodation, return flights, and medical care for international students.',
    insiderTip: 'Prepare all required documents (translated into English or Arabic) and verify them. Focus on academic transcripts as the admission committee values high GPA consistency.'
  },

  // ── MASTER (S2) ────────────────────────────────────────────────────────────

  // 9. KAUST Fellowship (Saudi Arabia) — Master / PhD
  {
    slug: 'king-abdullah-university-of-science-technology-kaust-fellowship',
    badge: 'Highest Stipend',
    editorReason: 'King Abdullah University of Science and Technology (KAUST) offers a fully funded fellowship with an incredibly high annual stipend ($30,000 - $35,000 USD, tax-free), free furnished housing, full health cover, and annual flights.',
    insiderTip: 'Since the scholarship is bond-free and extremely generous, selection panels focus heavily on your research background. Align your research statement directly with a KAUST faculty member\'s active projects before applying.'
  },

  // 10. Chevening Scholarship (UK)
  {
    slug: 'chevening-scholarship-indonesia',
    badge: 'Prestigious Network',
    editorReason: 'Funded by the UK Government (FCDO), Chevening offers fully funded 1-year Master\'s degrees at world-class UK universities for future leaders and influencers.',
    insiderTip: 'Chevening values strong networking and leadership potential. Craft four cohesive essays (Leadership, Networking, Study in UK, Career Plan) that link together with clear, real-life examples.'
  },

  // 11. Fulbright Master's Scholarship (US)
  {
    slug: 'fulbright-masters-degree-scholarship',
    badge: 'No TOEFL iBT Needed',
    editorReason: 'Administered by AMINEF for graduate studies in the United States. Offers comprehensive support through visa processing, university placements, and arrival logistics.',
    insiderTip: 'Fulbright accepts paper-based TOEFL ITP scores for the initial application stage, meaning you do not need to take expensive IELTS or TOEFL iBT tests beforehand.'
  },

  // 12. Saudi Government Master's Scholarship (Saudi Arabia)
  {
    slug: 'saudi-government-scholarship-masters-study-in-saudi-arabia',
    badge: 'High Living Stipend',
    editorReason: 'Offers full-ride funding for graduate studies at top-ranked universities in Saudi Arabia, including world-class research institutes like KAUST.',
    insiderTip: 'KAUST offers state-of-the-art laboratory facilities and abundant research funding. The scholarship package provides one of the highest monthly stipends globally.'
  },

  // 13. Türkiye Bursları Master's Scholarship (Turkey)
  {
    slug: 'trkiye-burslari-graduate-scholarship-program-masters',
    badge: 'Free Turkish Course',
    editorReason: 'The Master\'s track of Türkiye Bursları is a comprehensive package covering tuition, accommodation, health insurance, return flights, and a full preparatory year of Turkish language studies.',
    insiderTip: 'The online application form is highly detailed. Pay extra attention to the Letter of Intent section. Clearly describe why Turkey is your ideal academic destination.'
  },

  // 14. Chinese Government Scholarship Bilateral (China)
  {
    slug: 'chinese-government-scholarship-cgs-bilateral-program',
    badge: 'Fully Funded',
    editorReason: 'The Chinese Government Scholarship Bilateral Program funds international students at top Chinese universities through direct nomination by the Chinese Embassy in Jakarta.',
    insiderTip: 'Securing a Pre-admission Letter from your target Chinese university beforehand guarantees your placement and significantly boosts your final selection prospects.'
  },

  // 15. Stipendium Hungaricum Master's Scholarship (Hungary)
  {
    slug: 'stipendium-hungaricum-masters-scholarship',
    badge: 'No Application Fee',
    editorReason: 'Funded by the Hungarian Government, Stipendium Hungaricum offers thousands of English-taught degree courses at central European universities with tuition waivers, accommodation support, and medical insurance.',
    insiderTip: 'Since this program requires home-country endorsement, Indonesian applicants must carefully monitor the local Ministry of Education portal for preliminary document screening cycles.'
  },

  // 16. Open Doors Russian Scholarship (Russia)
  {
    slug: 'open-doors-russian-scholarship-project',
    badge: 'Online Olympiad',
    editorReason: 'Provides tuition-free graduate study at 24 leading Russian universities through an fully-online subject Olympiad competition without any application fees.',
    insiderTip: 'The portfolio evaluation phase (Stage 1) carries high weight. Upload all scientific publications, conference certificates, and academic awards to maximize your portfolio score.'
  },

  // ── PhD (S3) ───────────────────────────────────────────────────────────────

  // 17. Rhodes Scholarship (UK)
  {
    slug: 'rhodes-scholarship-university-of-oxford',
    badge: 'Oldest Global Award',
    editorReason: 'The oldest and arguably most famous international scholarship, supporting exceptional postgraduate students at the University of Oxford with a focus on character, leadership, and service.',
    insiderTip: 'Rhodes selection is extremely intense, focusing heavily on character and leadership. Your personal statement should tell a compelling story of your values, driving purpose, and how you plan to stand up for the world.'
  },

  // 18. Gates Cambridge Scholarship (UK)
  {
    slug: 'gates-cambridge-scholarship',
    badge: 'Gates Foundation',
    editorReason: 'One of the most prestigious postgraduate awards globally, providing full funding at the University of Cambridge for students showing exceptional academic ability and leadership potential.',
    insiderTip: 'Gates Cambridge requires a dedicated reference letter evaluating your fit for the scholarship. Choose a referee who can explicitly speak about your commitment to improving the lives of others, not just your academic marks.'
  },

  // 19. Clarendon Fund (UK)
  {
    slug: 'clarendon-fund-scholarship-university-of-oxford',
    badge: 'Oxford Premier',
    editorReason: 'Oxford\'s flagship graduate scholarship scheme, offering full tuition waivers and generous living cost grants for outstanding graduate applicants from all over the world.',
    insiderTip: 'There is no separate application form for Clarendon. All graduate applicants to the University of Oxford who apply before the December/January deadline are automatically considered.'
  },

  // 20. Australia Awards Scholarships (Australia)
  {
    slug: 'australia-awards-scholarships-phd-masters-indonesia',
    badge: 'High Acceptance Rate',
    editorReason: 'Australia Awards Scholarships (AAS) provide full tuition, return airfare, and living expenses for Master\'s and PhD studies in Australia, with a large country allocation for Indonesia.',
    insiderTip: "Focus your essays heavily on the 'Development Impact' section. Explicitly connect your study program to priority development sectors in your home country."
  },

  // 21. Fulbright PhD Scholarship (US)
  {
    slug: 'fulbright-doctoral-degree-phd-scholarship',
    badge: '3 Years Funding',
    editorReason: 'The Fulbright PhD Scholarship provides 3 years of fully-funded doctoral study in the United States, offering candidates access to world-renowned research faculty.',
    insiderTip: 'Clearly outline how your doctoral research will contribute to academic development and capacity building in Indonesia upon your return. A strong academic letter of recommendation is crucial.'
  },

  // 22. GKS Graduate Scholarship (South Korea)
  {
    slug: 'gks-graduate-scholarship-global-korea-scholarship-masters-phd',
    badge: 'Fully Funded',
    editorReason: 'The Global Korea Scholarship (GKS) covers full tuition, flights, and living costs in South Korea, including a mandatory 1-year intensive Korean language program at the start of your journey.',
    insiderTip: 'Applying via the Embassy Track allows you to choose up to three universities, significantly increasing your chances of getting accepted compared to the single-choice University Track.'
  },

  // 23. MEXT Research Students (Japan)
  {
    slug: 'mext-scholarship-research-students-masterphd-2027',
    badge: 'No IELTS Required',
    editorReason: 'A premier research pathway offering complete academic freedom in Japan with zero return bonds. Candidates can choose between the nationwide Embassy route or securing a direct nomination from a Japanese host institution.',
    insiderTip: 'MEXT applications are split into Embassy and University tracks. For undergraduate applicants, written exams are the ultimate filter, whereas research applicants can strategically bypass these tests via direct professor nomination. Click to explore both tracks.'
  },

  // 24. KAIST Graduate Fellowship (South Korea)
  {
    slug: 'kaist-graduate-fellowship-masters-phd',
    badge: 'Extra Lab Stipend',
    editorReason: 'Awarded automatically upon admission, covering full tuition, living stipends, and health insurance, with extra laboratory stipends frequently provided by advisors.',
    insiderTip: 'Contacting and matching with a potential faculty advisor (Professor) before submitting your application is highly critical for graduate admission.'
  },

  // 25. Saudi Government PhD Scholarship (Saudi Arabia)
  {
    slug: 'saudi-government-scholarship-phd-study-in-saudi-arabia',
    badge: 'Full Research Cover',
    editorReason: 'Top-tier research funding for PhD candidates in Saudi Arabia, with access to leading faculty and high-tech lab equipment.',
    insiderTip: 'For technical and scientific fields, apply to research-heavy universities like KAUST. Emphasize your previous publications and research projects in your statement of purpose.'
  },

  // 26. Türkiye Bursları PhD Scholarship (Turkey)
  {
    slug: 'trkiye-burslari-graduate-scholarship-program-phd',
    badge: 'Research Grant Option',
    editorReason: 'The PhD track of Türkiye Bursları provides comprehensive funding for doctoral candidates, with extensive academic resources and connections across state universities.',
    insiderTip: 'Make sure you have a highly detailed research proposal. Contacting a supervisor at your target Turkish university beforehand and attaching a letter of support will strongly boost your candidacy.'
  },

  // 27. Stipendium Hungaricum PhD Scholarship (Hungary)
  {
    slug: 'stipendium-hungaricum-doctoral-phd-scholarship',
    badge: 'High PhD Allowance',
    editorReason: 'Full-ride doctoral funding for 4 years in Hungary, with higher monthly stipends than undergraduate levels, tuition coverage, and medical insurance.',
    insiderTip: 'You must secure a supervisor from a Hungarian doctoral school before applying. Having a detailed research proposal and an acceptance email from a Hungarian professor is mandatory.'
  },

  // 28. Romanian Government ARICE Scholarship (Romania)
  {
    slug: 'romanian-government-arice-scholarship',
    badge: '40 Seats Annually',
    editorReason: 'Administered by the Romanian Agency for Investments and Foreign Trade (ARICE), this highly competitive program awards full-ride scholarships across diverse fields of study.',
    insiderTip: 'Due to the limited worldwide quota of 40 seats, your Motivation Letter should clearly outline how your chosen field of study will strengthen economic ties between your home country and Romania.'
  },

  // 29. Romanian Government MFA Scholarship (Romania)
  {
    slug: 'romanian-government-mfa-scholarship-non-eu-citizens',
    badge: 'No Interview',
    editorReason: 'The Romanian Government MFA Scholarship is an excellent gateway to Eastern Europe for students who want a fully-funded path without going through stressful interview panels.',
    insiderTip: 'Selection is strictly document-based. Ensure all your academic transcripts and degrees are apostilled under the Hague Convention to achieve maximum evaluation scores.'
  },

  // 30. Russian Government Quota (Russia)
  {
    slug: 'russian-government-scholarship-quota-via-rossotrudnichestvo',
    badge: 'Fully Funded',
    editorReason: 'Provides fully funded education for S1, S2, and S3 degrees at over 1,700 Russian universities, including a free 1-year Russian language preparatory course.',
    insiderTip: 'Applications are submitted through the official portal. Having a clean academic transcript and translated documents is vital as Rossotrudnichestvo evaluates candidates carefully.'
  }
];

export interface CuratedPick {
  slug: string;
  badge: string;
  editorReason: string;
  insiderTip: string;
}

export const curatedPicks: CuratedPick[] = [
  // Japan (MEXT)
  {
    slug: 'mext-scholarship-undergraduate-gakubu-2027',
    badge: 'Fully Funded S1',
    editorReason: 'The MEXT Gakubu scholarship is a highly competitive, fully funded academic pathway that benchmarks applicants through a centralized, rigorous written examination rather than just school grades. It includes 1 year of intensive Japanese language and university preparatory culture training.',
    insiderTip: 'MEXT applications are strictly split into Embassy and University recommendations. For undergraduate tracks, written exams are the ultimate filter, while research applicants can strategically bypass these tests by securing a direct professor nomination. Click to explore both tracks in our detailed guide.'
  },
  {
    slug: 'mext-scholarship-research-students-masterphd-2027',
    badge: 'No IELTS Required',
    editorReason: 'A premier research pathway offering complete academic freedom in Japan with zero return bonds. Candidates can choose between the nationwide Embassy route or securing a direct nomination from a Japanese host institution.',
    insiderTip: 'MEXT applications are strictly split into Embassy and University recommendations. For undergraduate tracks, written exams are the ultimate filter, while research applicants can strategically bypass these tests by securing a direct professor nomination. Click to explore both tracks in our detailed guide.'
  },

  // South Korea (GKS)
  {
    slug: 'gks-undergraduate-scholarship-global-korea-scholarship-bachelors',
    badge: 'No IELTS Required',
    editorReason: 'South Korea\'s ultimate fully funded scheme, unique for its dual-track system that allows applicants to strategically choose between multi-university options or localized regional quotas.',
    insiderTip: 'Success in GKS depends entirely on choosing the right gateway. You must strategically weigh the multi-choice Embassy Track against the direct, single-choice University Track which offers dedicated regional quotas. Click to unlock our full breakdown of both pathways.'
  },
  {
    slug: 'gks-graduate-scholarship-global-korea-scholarship-masters-phd',
    badge: 'Fully Funded',
    editorReason: 'The Global Korea Scholarship (GKS) covers full tuition, flights, and living costs in South Korea, including a mandatory 1-year intensive Korean language program at the start of your journey.',
    insiderTip: 'Applying via the Embassy Track allows you to choose up to three universities, significantly increasing your chances of getting accepted compared to the single-choice University Track.'
  },

  // Hungary (Stipendium Hungaricum)
  {
    slug: 'stipendium-hungaricum-bachelors-one-tier-masters-scholarship',
    badge: 'No Application Fee',
    editorReason: 'Provides tuition-free undergraduate study in Hungary across diverse fields of study, offering Indonesian high school graduates a chance to study in the heart of Europe.',
    insiderTip: 'Apply for courses that align with your high school academic track. Since the selection is highly competitive, make sure your recommendation letters highlight your academic drive.'
  },
  {
    slug: 'stipendium-hungaricum-masters-scholarship',
    badge: 'No Application Fee',
    editorReason: 'Funded by the Hungarian Government, Stipendium Hungaricum offers thousands of English-taught degree courses at central European universities with tuition waivers, accommodation support, and medical insurance.',
    insiderTip: 'Since this program requires home-country endorsement, Indonesian applicants must carefully monitor the local Ministry of Education portal for preliminary document screening cycles.'
  },
  {
    slug: 'stipendium-hungaricum-doctoral-phd-scholarship',
    badge: 'High PhD Allowance',
    editorReason: 'Full-ride doctoral funding for 4 years in Hungary, with higher monthly stipends than undergraduate levels, tuition coverage, and medical insurance.',
    insiderTip: 'You must secure a supervisor from a Hungarian doctoral school before applying. Having a detailed research proposal and an acceptance email from a Hungarian professor is mandatory.'
  },

  // Romania
  {
    slug: 'romanian-government-mfa-scholarship-non-eu-citizens',
    badge: 'No Interview',
    editorReason: 'The Romanian Government MFA Scholarship is an excellent gateway to Eastern Europe for students who want a fully-funded path without going through stressful interview panels.',
    insiderTip: 'Selection is strictly document-based. Ensure all your academic transcripts and degrees are apostilled under the Hague Convention to achieve maximum evaluation scores.'
  },
  {
    slug: 'romanian-government-arice-scholarship',
    badge: '40 Seats Annually',
    editorReason: 'Administered by the Romanian Agency for Investments and Foreign Trade (ARICE), this highly competitive program awards full-ride scholarships across diverse fields of study.',
    insiderTip: 'Due to the limited worldwide quota of 40 seats, your Motivation Letter should clearly outline how your chosen field of study will strengthen economic ties between your home country and Romania.'
  },

  // Turkey (Türkiye Bursları)
  {
    slug: 'trkiye-burslari-bachelors-scholarship-program',
    badge: 'Free Turkish Course',
    editorReason: 'The Türkiye Bursları Bachelor\'s program offers high school graduates a fully funded pathway to study S1 in Turkey, including university placement, housing, and monthly stipends.',
    insiderTip: 'Turkish universities value academic consistency. Make sure your high school graduation scores are excellent, and prepare well for basic academic logic and math questions that might be asked in the interview.'
  },
  {
    slug: 'trkiye-burslari-graduate-scholarship-program-masters',
    badge: 'Free Turkish Course',
    editorReason: 'The Master\'s track of Türkiye Bursları is a comprehensive package covering tuition, accommodation, health insurance, return flights, and a full preparatory year of Turkish language studies.',
    insiderTip: 'The online application form is highly detailed. Pay extra attention to the Letter of Intent section—clearly describe why Turkey is your ideal academic destination.'
  },
  {
    slug: 'trkiye-burslari-graduate-scholarship-program-phd',
    badge: 'Research Grant Option',
    editorReason: 'The PhD track of Türkiye Bursları provides comprehensive funding for doctoral candidates, with extensive academic resources and connections across state universities.',
    insiderTip: 'Make sure you have a highly detailed research proposal. Contacting a supervisor at your target Turkish university beforehand and attaching a letter of support will strongly boost your candidacy.'
  },

  // Singapore (ASEAN)
  {
    slug: 'asean-undergraduate-scholarship-nus',
    badge: 'Automatic Selection',
    editorReason: 'A highly prestigious, bond-free undergraduate scholarship offered by the National University of Singapore (NUS) for outstanding students from ASEAN member countries.',
    insiderTip: 'There is no separate application form. Selection is made automatically during the NUS admissions process, so make sure your high school grades and Olympiad achievements are stellar.'
  },
  {
    slug: 'asean-undergraduate-scholarship-ntu',
    badge: 'Automatic Selection',
    editorReason: 'Offered by Nanyang Technological University (NTU), this bond-free scholarship covers full tuition and provides allowance for outstanding ASEAN students.',
    insiderTip: 'Like NUS, there is no separate application form. Admission to NTU automatically screens you for this scholarship, so aim for top grades and outstanding Co-Curricular Activities (CCA).'
  },

  // Australia (AAS)
  {
    slug: 'australia-awards-scholarships-phd-masters-indonesia',
    badge: 'High Acceptance Rate',
    editorReason: 'Australia Awards Scholarships (AAS) provide full tuition, return airfare, and living expenses for Master\'s and PhD studies in Australia, with a large country allocation for Indonesia.',
    insiderTip: "Focus your essays heavily on the 'Development Impact' section. Explicitly connect your study program to priority development sectors in your home country."
  },

  // United Kingdom (Chevening)
  {
    slug: 'chevening-scholarship-indonesia',
    badge: 'Prestigious Network',
    editorReason: 'Funded by the UK Government (FCDO), Chevening offers fully funded 1-year Master\'s degrees at world-class UK universities for future leaders and influencers.',
    insiderTip: 'Chevening values strong networking and leadership potential. Craft four cohesive essays (Leadership, Networking, Study in UK, Career Plan) that link together with clear, real-life examples.'
  },

  // United States (Fulbright)
  {
    slug: 'fulbright-masters-degree-scholarship',
    badge: 'No TOEFL iBT Needed',
    editorReason: 'Administered by AMINEF for graduate studies in the United States. Offers comprehensive support through visa processing, university placements, and arrival logistics.',
    insiderTip: 'Fulbright accepts paper-based TOEFL ITP scores for the initial application stage, meaning you do not need to take expensive IELTS or TOEFL iBT tests beforehand.'
  },
  {
    slug: 'fulbright-doctoral-degree-phd-scholarship',
    badge: '3 Years Funding',
    editorReason: 'The Fulbright PhD Scholarship provides 3 years of fully-funded doctoral study in the United States, offering candidates access to world-renowned research faculty.',
    insiderTip: 'Clearly outline how your doctoral research will contribute to academic development and capacity building in Indonesia upon your return. A strong academic letter of recommendation is crucial.'
  },

  // China (CGS)
  {
    slug: 'chinese-government-scholarship-cgs-bilateral-program',
    badge: 'Fully Funded',
    editorReason: 'The Chinese Government Scholarship Bilateral Program funds international students at top Chinese universities through direct nomination by the Chinese Embassy in Jakarta.',
    insiderTip: 'Securing a Pre-admission Letter from your target Chinese university beforehand guarantees your placement and significantly boosts your final selection prospects.'
  },

  // Russia (Open Doors)
  {
    slug: 'open-doors-russian-scholarship-project',
    badge: 'Online Olympiad',
    editorReason: 'Provides tuition-free graduate study at 24 leading Russian universities through an fully-online subject Olympiad competition without any application fees.',
    insiderTip: 'The portfolio evaluation phase (Stage 1) carries high weight. Upload all scientific publications, conference certificates, and academic awards to maximize your portfolio score.'
  },

  // Saudi Arabia
  {
    slug: 'saudi-government-scholarship-bachelors-study-in-saudi-arabia',
    badge: 'No Application Fee',
    editorReason: 'Fully funded S1 degree programs in Saudi Arabia, covering tuition, accommodation, return flights, and medical care for international students.',
    insiderTip: 'Prepare all required documents (translated into English or Arabic) and verify them. Focus on academic transcripts as the admission committee values high GPA consistency.'
  },
  {
    slug: 'saudi-government-scholarship-masters-study-in-saudi-arabia',
    badge: 'High Living Stipend',
    editorReason: 'Offers full-ride funding for graduate studies at top-ranked universities in Saudi Arabia, including world-class research institutes like KAUST.',
    insiderTip: 'KAUST offers state-of-the-art laboratory facilities and abundant research funding. The scholarship package provides one of the highest monthly stipends globally.'
  },
  {
    slug: 'saudi-government-scholarship-phd-study-in-saudi-arabia',
    badge: 'Full Research Cover',
    editorReason: 'Top-tier research funding for PhD candidates in Saudi Arabia, with access to leading faculty and high-tech lab equipment.',
    insiderTip: 'For technical and scientific fields, apply to research-heavy universities like KAUST. Emphasize your previous publications and research projects in your statement of purpose.'
  }
];

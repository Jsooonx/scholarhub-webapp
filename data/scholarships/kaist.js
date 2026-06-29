const KAIST_BENEFITS_UNDERGRAD = [
  'Full tuition fee coverage for 8 semesters (provided a GPA of 3.0+ out of 4.3 is maintained)',
  'Monthly living allowance: KRW 350,000/month',
  'National health insurance premium coverage',
];

const KAIST_BENEFITS_GRADUATE = [
  'Full tuition fee coverage for the entire program (4 semesters for Master\'s, 8 semesters for PhD)',
  'Monthly living allowance: KRW 350,000/month (Master\'s) or KRW 400,000/month (PhD)',
  'National health insurance premium coverage',
  'Extra stipend from research assistantships (advisor dependent, often raising total income to 1,000,000+ KRW/month)',
];

const kaist = [
  {
    name: 'KAIST International Student Scholarship (Undergraduate)',
    provider: 'KAIST / Korea Advanced Institute of Science and Technology',
    country: 'South Korea',
    degree_levels: ['Bachelor'],
    program_type: 'University degree scholarship',
    fields: [
      'Physics', 'Mathematical Sciences', 'Chemistry', 'Biological Sciences',
      'Civil and Environmental Engineering', 'Mechanical Engineering', 'Aerospace Engineering',
      'Electrical Engineering', 'Computer Science', 'Chemical and Biomolecular Engineering',
      'Materials Science and Engineering', 'Nuclear and Quantum Engineering',
      'Industrial Design', 'Industrial and Systems Engineering', 'Bio and Brain Engineering'
    ],
    funding_type: 'Fully Funded',
    duration_months: { min: 48, max: 48 },
    deadline: 'Early Track: October, Regular Track: January, Late Track: April annually',
    application_period: ['September – April (varies by track)'],
    important_dates: [
      'Early Track: Apply Sept–Oct, results in January',
      'Regular Track: Apply Nov–Jan, results in March',
      'Late Track: Apply March–April, results in June',
      'Studies begin: following March (Spring) or September (Fall)'
    ],
    requirements: {
      first_degree_required: false,
      professional_experience_required: null,
      professional_experience_years: null,
      country_restrictions: [],
      raw_items: [
        'Must hold non-Korean citizenship (and parents must also hold non-Korean citizenship)',
        'Must have graduated or be expected to graduate from high school before matriculation',
        'Must submit standardized test scores (SAT, ACT, AP, IB, GCE A-Level, etc.) or high school profile',
        'Must submit one recommendation letter from a high school teacher (submitted directly by referee)',
        'Must maintain a GPA of 3.0 or higher out of 4.3 at KAIST to retain the scholarship'
      ],
    },
    benefits: [...KAIST_BENEFITS_UNDERGRAD],
    amounts: ['KRW 350,000/month'],
    target_group: 'Outstanding international high school graduates seeking a bachelor\'s degree in STEM, natural sciences, or industrial design at KAIST.',
    official_url: 'https://admission.kaist.ac.kr/intl-undergraduate/',
    description: 'KAIST\'s primary scholarship for international undergraduate students, covering full tuition for 8 semesters, providing a monthly living stipend, and covering health insurance. Selection is based on academic achievements, extracurricular activities, and future potential.',
    application_process: [
      'Check the admission guide and prepare documents at admission.kaist.ac.kr',
      'Fill out the online application form and pay the application fee',
      'Upload required documents (transcripts, standardized test scores, passport copy, English test results)',
      'Register your recommender\'s email so they can submit the recommendation letter directly',
      'Check application status and complete document submission before the track deadline',
      'Participate in an online interview if requested by the admissions committee'
    ],
    source: 'kaist_intl_undergrad.md',
    source_file: 'data/raw/kaist/kaist_intl_undergrad.md',
  },
  {
    name: 'KAIST Graduate Fellowship (Master\'s & PhD)',
    provider: 'KAIST / Korea Advanced Institute of Science and Technology',
    country: 'South Korea',
    degree_levels: ['Master', 'PhD'],
    program_type: 'University postgraduate fellowship',
    fields: [
      'Physics', 'Mathematical Sciences', 'Chemistry', 'Biological Sciences',
      'Civil and Environmental Engineering', 'Mechanical Engineering', 'Aerospace Engineering',
      'Electrical Engineering', 'Computer Science', 'Chemical and Biomolecular Engineering',
      'Materials Science and Engineering', 'Nuclear and Quantum Engineering',
      'Bio and Brain Engineering', 'Industrial and Systems Engineering',
      'Business and Technology Management', 'Green Transportation', 'Culture Technology'
    ],
    funding_type: 'Fully Funded',
    duration_months: { min: 24, max: 48 },
    deadline: 'Spring Intake: September, Fall Intake: April annually',
    application_period: ['July – August (Spring), December – January (Fall)'],
    important_dates: [
      'Spring Semester Intake: Applications open July–August, results in November',
      'Fall Semester Intake: Applications open Dec–Jan, results in June',
      'Studies begin: March (Spring) or September (Fall)'
    ],
    requirements: {
      first_degree_required: true,
      professional_experience_required: null,
      professional_experience_years: null,
      country_restrictions: [],
      raw_items: [
        'Must hold non-Korean citizenship (and parents must also hold non-Korean citizenship)',
        'Must hold a recognized Bachelor\'s degree (for Master\'s) or Master\'s degree (for PhD)',
        'Must meet English proficiency requirements: TOEFL iBT 83, IELTS 6.5, TOEIC 720, or TEPS 326 (taken within 2 years)',
        'Must secure matching with a faculty advisor (strongly recommended to email professors before applying)',
        'Must maintain a GPA of 2.0 or higher out of 4.3 at KAIST to retain the fellowship'
      ],
    },
    benefits: [...KAIST_BENEFITS_GRADUATE],
    amounts: ['KRW 350,000/month', 'KRW 400,000/month'],
    target_group: 'Top-tier international graduate students seeking research-focused Master\'s or PhD degrees in STEM, engineering, or technology management at KAIST.',
    official_url: 'https://admission.kaist.ac.kr/intl-graduate/',
    description: 'The KAIST Graduate Fellowship is awarded automatically to admitted international graduate students. It covers full tuition fees, provides a monthly living stipend, and covers health insurance. Scholars often receive additional stipends by working as research assistants in their advisor\'s laboratory.',
    application_process: [
      'Identify potential advisors (Professors) in your field of study at KAIST and contact them with your CV',
      'Check the official admissions guide and deadline at admission.kaist.ac.kr/intl-graduate/',
      'Fill out the online graduate application form and pay the application fee',
      'Upload transcripts, graduation certificates, English proficiency reports, and your study/research plan',
      'Register your referees\' email addresses so they can submit recommendation letters directly',
      'Submit all documents and wait for the academic department evaluation and interview invitation'
    ],
    source: 'kaist_intl_graduate.md',
    source_file: 'data/raw/kaist/kaist_intl_graduate.md',
  }
];

module.exports = kaist;

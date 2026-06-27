const daadLeadership = [
  {
    name: 'DAAD Leadership for Africa',
    provider: 'DAAD / German Federal Foreign Office',
    country: 'Germany',
    degree_levels: ['Master'],
    program_type: 'Master scholarship in Germany for selected African graduates and refugees',
    fields: ['All disciplines except fields excluded by the annual call'],
    funding_type: 'Fully Funded',
    duration_months: { min: 12, max: 24 },
    deadline: 'Varies by annual regional call',
    application_period: ['Check DAAD Leadership for Africa calls for current target countries and deadlines'],
    important_dates: [
      'Target countries are announced for each annual call',
      'Recent calls have covered East Africa and West/Central Africa',
      'Applicants apply through the DAAD portal during the relevant call window',
    ],
    requirements: {
      first_degree_required: true,
      professional_experience_required: null,
      professional_experience_years: null,
      country_restrictions: ['Selected Sub-Saharan African countries and eligible refugees in those host countries'],
      raw_items: [
        'Completed Bachelor\'s degree',
        'Highly qualified refugee with recognised refugee status in an eligible host country, or highly qualified graduate from an eligible target country',
        'Must meet the requirements in the current DAAD call for applications',
        'Must qualify for Master\'s study in Germany',
        'Fields and exclusions depend on the annual call',
      ],
    },
    benefits: [
      'Monthly DAAD scholarship payment',
      'Payments toward health, accident, and personal liability insurance',
      'Travel allowance unless covered by another source',
      'Study allowance',
      'Preparatory German language course may be included where applicable',
      'Additional family or rent support may be available under DAAD rules',
    ],
    amounts: ['DAAD Master scholarship rate; check current call for exact amount'],
    target_group: 'Highly qualified refugees and graduates from selected Sub-Saharan African countries who want to pursue a Master\'s degree in Germany.',
    official_url: 'https://www.daad.de/en/the-daad/intersecting-dimensions-topics/sustainable-development/funding-programmes/funding-programmes-for-students-a-z/leadership-for-africa/',
    description: 'DAAD Leadership for Africa supports Master\'s study in Germany for selected African graduates and refugees, strengthening future leadership and academic capacity across target regions announced in each annual call.',
    application_process: [
      'Check the current DAAD Leadership for Africa regional call and target countries',
      'Confirm whether applying as a refugee applicant or national graduate applicant',
      'Prepare academic documents, motivation, references, and proof of eligibility required by the call',
      'Submit through the DAAD portal before the call deadline',
    ],
    source: 'leadership-for-africa.md',
    source_file: 'data/raw/daad/leadership-for-africa.md',
  },
];

module.exports = daadLeadership;

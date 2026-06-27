export interface TrackDetail {
  title: string;
  description: string;
  requirements: string[];
  process: string[];
  deadlines: string;
  url: string;
}

export interface ScholarshipTracks {
  embassy: TrackDetail;
  university: TrackDetail;
}

export const scholarshipTracks: Record<string, ScholarshipTracks> = {
  // GKS Graduate
  'gks-graduate-scholarship-global-korea-scholarship-masters-phd': {
    embassy: {
      title: 'Embassy Track',
      description: 'Apply through the Korean Embassy in Jakarta. This track allows you to choose up to three different Korean universities of your choice (with at least one Type B university recommended for safety). It is the most flexible track for applicants undecided on a single institution.',
      requirements: [
        'Must be an Indonesian citizen (both applicant and parents). Dual citizenship is not permitted.',
        'Must hold a Bachelor\'s degree (for Master\'s applicants) or a Master\'s degree (for PhD applicants) by the designated NIIED deadline.',
        'Cumulative GPA (CGPA) must be above 2.64/4.00, or a percentile score of 80% or above on your previous transcripts.',
        'Must be under 40 years of age (typically born after September 1 of the application year).',
        'Must be in good physical and mental health.'
      ],
      process: [
        'Step 1: Check the GKS application announcement on the Embassy of the Republic of Korea in Indonesia website (typically opens in February).',
        'Step 2: Download NIIED application forms. Prepare one set of original, apostilled/consular-verified academic documents and three sets of photocopies.',
        'Step 3: Ship or deliver your physical application package to the Korean Embassy in Jakarta before the deadline.',
        'Step 4: Pass the Embassy document screening and attend the physical/online interview panel (1st Round).',
        'Step 5: Successful candidates are nominated by the Embassy to NIIED (2nd Round).',
        'Step 6: Candidates who pass NIIED screening have their dossiers reviewed by their 3 chosen universities (3rd Round). At least one university must offer admission.',
        'Step 7: NIIED announces the final list of successful scholars in late June.'
      ],
      deadlines: 'Mid-February to early March annually.',
      url: 'https://overseas.mofa.go.kr/id-id/index.do'
    },
    university: {
      title: 'University Track',
      description: 'Apply directly to the admissions office of your single chosen Korean university. Ideal for candidates who have already secured a research supervisor, or are applying for specialized R&D, Science and Engineering, or regional programs.',
      requirements: [
        'Must be an Indonesian citizen (both applicant and parents). Dual citizenship is not permitted.',
        'Must hold a Bachelor\'s degree (for Master\'s) or a Master\'s degree (for PhD) by the designated NIIED deadline.',
        'Cumulative GPA (CGPA) must be above 2.64/4.00, or a percentile score of 80% or above.',
        'Must be under 40 years of age.',
        'Applicants must apply to ONLY ONE university. Submitting applications to multiple universities or dual-applying through the Embassy Track will result in automatic disqualification.'
      ],
      process: [
        'Step 1: Research designated Korean universities and choose your target department and prospective supervisor.',
        'Step 2: Check target university admission schedules, as university track deadlines and additional requirements vary by institution (typically opens in February).',
        'Step 3: Compile NIIED application forms and required university-specific documents. Ship them directly to the university\'s international admissions office.',
        'Step 4: Pass the university\'s internal document review and professor interviews (1st Round).',
        'Step 5: Selected candidates are nominated by the university directly to NIIED for final verification (2nd Round).',
        'Step 6: NIIED reviews candidates\' eligibility and issues final approvals.',
        'Step 7: NIIED announces the final list of successful scholars in late June.'
      ],
      deadlines: 'February to late March annually (varies by university).',
      url: 'https://studyinkorea.go.kr'
    }
  },

  // GKS Undergraduate
  'gks-undergraduate-scholarship-global-korea-scholarship-bachelors': {
    embassy: {
      title: 'Embassy Track',
      description: 'Apply through the Korean Embassy in Jakarta. High school graduates can select up to three different Korean universities for a full 4-year S1 degree program, making it a flexible, balanced option.',
      requirements: [
        'Must be an Indonesian citizen (both applicant and parents).',
        'Must be a high school graduate (or hold an equivalent qualification) by the NIIED deadline.',
        'Cumulative GPA (CGPA) of high school transcripts must be above 80% or rank in the top 20% of your graduating class.',
        'Must be under 25 years of age (typically born after March 1 of the application year).',
        'Must be in good physical and mental health.'
      ],
      process: [
        'Step 1: Access GKS Undergraduate guidelines on the Korean Embassy in Indonesia website (typically opens in September).',
        'Step 2: Fill out NIIED forms and compile your transcripts, diplomas, self-introduction, study plan, and one recommendation letter.',
        'Step 3: Ship or hand-deliver 1 original set and 3 copies of your physical application to the Korean Embassy in Jakarta.',
        'Step 4: Pass Embassy document screening and attend the interview round (1st Round).',
        'Step 5: Selected candidates are recommended by the Embassy to NIIED (2nd Round).',
        'Step 6: Candidates who pass NIIED undergo evaluation by their 3 selected universities (3rd Round).',
        'Step 7: NIIED announces the final list of successful scholars in mid-December.'
      ],
      deadlines: 'September to October annually.',
      url: 'https://overseas.mofa.go.kr/id-id/index.do'
    },
    university: {
      title: 'University Track',
      description: 'Apply directly to one specific designated Korean university. This track includes regional university engineering/science programs and associate degree programs, which often have dedicated, larger country quotas.',
      requirements: [
        'Must be an Indonesian citizen (both applicant and parents).',
        'Must be a high school graduate (or hold an equivalent qualification) by the NIIED deadline.',
        'Cumulative GPA (CGPA) of high school transcripts must be above 80% or rank in the top 20% of your graduating class.',
        'Must be under 25 years of age.',
        'Only one university selection is allowed. Dual-application leads to disqualification.'
      ],
      process: [
        'Step 1: Check designated university lists and program guides on the Study in Korea portal in September.',
        'Step 2: Complete NIIED application forms and ship all certified files directly to your target university\'s admissions office.',
        'Step 3: Pass university document screening and admissions interview (1st Round).',
        'Step 4: Selected candidates are nominated by the university directly to NIIED (2nd Round).',
        'Step 5: NIIED reviews candidate credentials and grants final approval.',
        'Step 6: NIIED announces the final list of successful scholars in mid-December.'
      ],
      deadlines: 'September to late October (varies by university).',
      url: 'https://studyinkorea.go.kr'
    }
  },

  // MEXT Research Students
  'mext-scholarship-research-students-masterphd-2027': {
    embassy: {
      title: 'Embassy Recommendation (G-to-G)',
      description: 'Apply through the Embassy of Japan in Jakarta. This is the most popular track for Indonesians. It features a standardized national screening process consisting of documents, written exams, and embassy interviews.',
      requirements: [
        'Must be an Indonesian citizen under 35 years of age on April 1 of the departure year (born on or after April 2, 1992).',
        'Must hold a D4, S1, or S2 degree with a minimum final cumulative GPA of 3.20/4.00.',
        'Must hold a valid international language certificate: TOEFL iBT 72+, IELTS 5.5+, TOEIC 785+ or JLPT N2+.',
        'Must submit a detailed, academic Research Proposal in the same field as your previous studies.',
        'Must be willing to learn Japanese and adapt to Japanese culture.'
      ],
      process: [
        'Step 1: Register online on the Embassy of Japan\'s registration portal (opens in April).',
        'Step 2: Compile application forms, transcripts, recommendation letters, and your detailed Research Plan.',
        'Step 3: Submit the physical application package to the Embassy of Japan in Jakarta before the deadline.',
        'Step 4: Pass document screening. Attend written exams (English & Japanese) and the interview panel in Jakarta (Primary Screening).',
        'Step 5: Obtain your Primary Screening Certificate. Contact prospective supervisors at Japanese universities to secure a Letter of Acceptance (LoA).',
        'Step 6: Submit your LoA to the Embassy. The files are sent to MEXT Tokyo for Secondary Screening.',
        'Step 7: MEXT Tokyo releases final placement decisions by March (the following year).'
      ],
      deadlines: '1 April – 22 April annually.',
      url: 'https://www.id.emb-japan.go.jp/itpr_id/sch_rs.html'
    },
    university: {
      title: 'University Recommendation (U-to-U)',
      description: 'Apply directly to a Japanese university that holds a MEXT nomination allocation quota. This track is highly decentralized and allows you to bypass the national written exam and interviews at the Japanese Embassy.',
      requirements: [
        'Must be an Indonesian citizen under 35 years of age on April 1 of the departure year.',
        'Must hold an outstanding academic record that meets the specific target university\'s GPA requirement (often equivalent to 2.30/3.00 on the MEXT scale).',
        'Must secure a prospective supervisor at your target Japanese university who formally agrees to sponsor and recommend you.',
        'Must meet the target university\'s specific English (e.g. IELTS 6.0+) or Japanese (e.g. JLPT N2+) language requirements.'
      ],
      process: [
        'Step 1: Locate Japanese universities and find professors matching your academic research interest.',
        'Step 2: Contact the professor via email, attaching your CV, academic transcripts, and your detailed Research Proposal to ask for supervision consent.',
        'Step 3: Once supervisor consent is secured, submit the MEXT application dossier directly to the university\'s international student division (typically between October and January).',
        'Step 4: Pass the university\'s internal evaluation and interview panels (Primary Screening).',
        'Step 5: The university nominates successful applicants to MEXT in Tokyo for final approval (Secondary Screening).',
        'Step 6: MEXT Tokyo confirms funding and university placement.',
        'Step 7: Final results are released in June/July.'
      ],
      deadlines: 'October to January annually (varies by university).',
      url: 'https://www.mext.go.jp'
    }
  },

  // MEXT Undergraduate
  'mext-scholarship-undergraduate-gakubu-2027': {
    embassy: {
      title: 'Embassy Recommendation (G-to-G)',
      description: 'Apply through the Embassy of Japan in Jakarta. High school graduates undergo challenging national written exams in major Indonesian cities (Jakarta, Surabaya, Medan, etc.) before final selection. The entire process from application to departure takes approximately 1 full year. Ensure all documents are translated into English or Japanese by an official translator.',
      requirements: [
        'Must be an Indonesian citizen.',
        'Must be a high school graduate (or hold an equivalent qualification) by the departure date.',
        'Must have a minimum average score of 84/100 on your high school transcript/final exams.',
        'Must be willing to learn Japanese and undergo 1 year of preparatory foundation studies in Japan.'
      ],
      process: [
        'Step 1: Check the Gakubu scholarship announcement on the Japanese Embassy website in early April.',
        'Step 2: Register online and submit your high school transcripts, graduation certificate, and recommendation letter to the Japanese Embassy.',
        'Step 3: Attend written examinations covering Mathematics, English, and Chemistry, Physics, or Japanese depending on your chosen major.',
        'Step 4: Shortlisted candidates attend the interview round at the Japanese Embassy.',
        'Step 5: Pass the Primary Screening. The Embassy then nominates successful candidates to MEXT in Tokyo for the final round.',
        'Step 6: MEXT Tokyo conducts the Secondary Screening to officially approve the scholarship winners.',
        'Step 7: Final results and university preparatory school placements are officially announced between January and February.'
      ],
      deadlines: 'April to May annually.',
      url: 'https://www.id.emb-japan.go.jp/itpr_id/sch_ug.html'
    },
    university: {
      title: 'University Recommendation (U-to-U)',
      description: 'Direct university recommendation for S1 is extremely rare and typically limited to specific collaborative agreements between Japanese universities and designated foreign high schools or international schools. Timeline varies significantly depending on the host university agreement. Deadlines are typically much earlier than the embassy track.',
      requirements: [
        'Must be an Indonesian citizen.',
        'Must be nominated by a partner high school that holds a direct nomination agreement with a Japanese university.',
        'Must demonstrate outstanding high school academic scores and meet university language criteria.'
      ],
      process: [
        'Step 1: Consult with your high school counselor to check if the school has direct nomination quotas with Japanese universities.',
        'Step 2: Submit application files directly to the target Japanese university\'s international office.',
        'Step 3: Attend university entrance interviews or placement tests.',
        'Step 4: The university nominates successful students directly to MEXT for final funding approval.'
      ],
      deadlines: 'Varies by institution agreement.',
      url: 'https://www.mext.go.jp'
    }
  }
};

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
      description: 'Apply through the Embassy of Japan in Jakarta. This is the flagship and most popular track for Indonesians seeking Master\'s or PhD degrees in Japan. It features a standardized national screening process consisting of documents, written exams in 5 cities, and embassy interviews.',
      requirements: [
        'Must be an Indonesian citizen under 35 years of age on April 1 of the departure year (born on or after April 2, 1992).',
        'Must hold a D4, S1, or S2 degree with a minimum final cumulative GPA of 3.20/4.00.',
        'Must hold an official international language certificate: TOEFL iBT min. 72, IELTS min. 5.5, TOEIC L&R min. 785, TOEIC S&W min. 310, or JLPT min. N2. (CRITICAL: TOEFL ITP, prediction tests, and Duolingo are STRICTLY DISQUALIFIED by the Embassy).',
        'Must apply for an academic field of study in the same or closely related discipline as previous degree.',
        'Must submit a rigorous, academic Field of Study and Research Plan (3–5 pages) with clear methodology and rationale for conducting research in Japan.',
        'Must be in good physical and mental health.'
      ],
      process: [
        'Step 1: Register online on the Embassy of Japan registration portal (daftar.beasiswamext.com) and select 1 of 5 exam cities (Jakarta, Surabaya, Medan, Denpasar, Makassar).',
        'Step 2: Compile application forms, Field of Study and Research Plan, official transcripts, graduation certificates, and recommendation letters.',
        'Step 3: Ship the physical application package to the Embassy of Japan in Jakarta via registered postal courier (POS/JNE/TIKI/SiCepat) with code "RESEARCH 2027_[No. Ujian]" on the top-right envelope corner. Hand-delivery at Embassy gates and motorcycle couriers (ojol) are strictly refused.',
        'Step 4: Pass document screening. Attend written exams (English & Japanese) in your chosen test city and the interview panel in Jakarta (Primary Screening). Sitting for both exams is mandatory.',
        'Step 5: Obtain your Primary Screening Certificate. Contact prospective supervisors at Japanese universities to secure a Letter of Acceptance (LoA). STRICT 2-UNIVERSITY RULE: You may only contact a maximum of TWO universities/professors simultaneously. Shotgun mass-emailing is strictly prohibited by MEXT.',
        'Step 6: Submit your LoA(s) and placement preference form to the Embassy by late September. Dossiers are transmitted to MEXT Tokyo for Secondary Screening.',
        'Step 7: MEXT Tokyo releases final placement approvals between February and March.'
      ],
      deadlines: '1 April – 22 April annually.',
      url: 'https://www.id.emb-japan.go.jp/itpr_id/sch_rs.html'
    },
    university: {
      title: 'University Recommendation (U-to-U)',
      description: 'Apply directly to a Japanese university holding a MEXT nomination quota (Daigaku Suisen). This track is highly decentralized and allows candidates to bypass the national written examination and embassy interview rounds in Indonesia.',
      requirements: [
        'Must be an Indonesian citizen under 35 years of age on April 1 of the departure year.',
        'Must hold an outstanding academic record meeting the specific target university\'s GPA threshold (typically equivalent to 2.30/3.00 on the MEXT scale).',
        'Must secure a prospective supervisor at your target Japanese university who formally agrees to sponsor and nominate you for their internal MEXT quota.',
        'Must meet the target university\'s specific English (e.g. IELTS 6.5+ or TOEFL iBT 80+) or Japanese (e.g. JLPT N2/N1) language benchmarks.'
      ],
      process: [
        'Step 1: Research Japanese universities and identify laboratories and professors matching your exact research focus.',
        'Step 2: Contact prospective professors between September and November with your CV, academic transcripts, and detailed Research Proposal requesting supervision.',
        'Step 3: Once professor sponsorship is secured, submit the university\'s formal MEXT application dossier (typically between October and January).',
        'Step 4: Pass the graduate school\'s internal document screening and oral defense / video interview panel (Primary Screening).',
        'Step 5: The university officially nominates successful applicants to MEXT in Tokyo for final funding confirmation (Secondary Screening).',
        'Step 6: MEXT Tokyo confirms national funding and scholarship placement.',
        'Step 7: Final results are officially released in June/July for October intake.'
      ],
      deadlines: 'October to January annually (varies by university).',
      url: 'https://www.mext.go.jp'
    }
  },

  // MEXT Undergraduate
  'mext-scholarship-undergraduate-gakubu-2027': {
    embassy: {
      title: 'Embassy Recommendation (G-to-G)',
      description: 'Apply through the Embassy of Japan in Jakarta. High school graduates undergo challenging national written exams in 5 major Indonesian cities (Jakarta, Surabaya, Medan, Denpasar, Makassar) before final selection. Includes 1 full year of intensive Japanese language and foundation studies in Japan before starting university.',
      requirements: [
        'Must be an Indonesian citizen under 25 years of age on April 1 of the departure year (born on or after April 2, 2002).',
        'Must be a high school graduate (SMA/SMK or equivalent) by the departure date.',
        'Minimum average grade of 84 in Mathematics and English (Grade 11 Semesters 1 & 2 / Semester 4 & 5). For IPA tracks: Chemistry + Physics or Biology also evaluated.',
        'IPS exception: Applicants with average grades below 84 may apply if holding JLPT min. N3, J-Test D-E (500 pts), NAT-Test Level 3, or EJU Japanese min. 240 pts. (No language waiver for IPA).',
        'Must be willing to learn Japanese and undergo 1 year of preparatory foundation studies in Japan.'
      ],
      process: [
        'Step 1: Check the Gakubu announcement on the Japanese Embassy website in early April and register online at daftar.beasiswamext.com.',
        'Step 2: Select 1 of 5 examination cities (Jakarta, Surabaya, Medan, Denpasar, Makassar).',
        'Step 3: Send physical documents via registered postal courier (POS/JNE/TIKI/SiCepat) with code "GAKUBU 2027_[No. Ujian]" on the top-right envelope corner.',
        'Step 4: Attend written examinations covering Mathematics, English, Japanese, and Sciences (Physics/Chemistry/Biology) or Social Studies depending on track.',
        'Step 5: Shortlisted candidates attend the interview round at the Japanese Embassy in Jakarta.',
        'Step 6: Candidates passing Primary Screening are nominated to MEXT Tokyo for Secondary Screening.',
        'Step 7: Final results and university preparatory school placements are officially announced in February.'
      ],
      deadlines: '1 April – 19 April annually.',
      url: 'https://www.id.emb-japan.go.jp/itpr_id/sch_gakubu.html'
    },
    university: {
      title: 'University Recommendation (U-to-U)',
      description: 'Direct university recommendation for S1 is extremely rare and typically limited to specific collaborative agreements between Japanese universities and designated foreign partner high schools or international schools.',
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
  },

  // MEXT College of Technology (KOSEN)
  'mext-scholarship-college-of-technology-kosen-2027': {
    embassy: {
      title: 'Embassy Recommendation (KOSEN D3)',
      description: 'Apply through the Embassy of Japan in Jakarta for a 4-year engineering and technology scholarship (1 year Japanese language + 3 years specialized associate degree) at National Institutes of Technology (KOSEN). Graduates have a direct pathway to transfer into the 3rd year of Japanese National Universities for a full Bachelor\'s degree.',
      requirements: [
        'Must be an Indonesian citizen under 25 years of age on April 1 of departure year (born on or after April 2, 2002).',
        'Senior high school graduate (SMA/SMK IPA/science track or equivalent).',
        'Minimum grade of 80 in Mathematics and English on report cards (Grade 11 Semesters 1 & 2).',
        'STRICT REQUIREMENT: Cannot apply if either subject grade is below 80 (no language certificate waiver allowed for KOSEN).',
        'Good physical and mental health.'
      ],
      process: [
        'Step 1: Register online at daftar.beasiswamext.com and select examination city (Jakarta, Surabaya, Medan, Denpasar, Makassar).',
        'Step 2: Ship physical documents via registered postal courier (POS/JNE/TIKI/SiCepat) with code "KOSEN 2027_[No. Ujian]" on the envelope.',
        'Step 3: Attend written exams in designated test city (Mathematics, Physics or Chemistry, English, Japanese).',
        'Step 4: Shortlisted candidates attend the interview panel at the Embassy of Japan in Jakarta.',
        'Step 5: Pass Primary Screening; Embassy nominates candidates to MEXT Tokyo for Secondary Screening.',
        'Step 6: Final results announced in February; departure to Japan in early April.'
      ],
      deadlines: '20 April – 10 May annually.',
      url: 'https://www.id.emb-japan.go.jp/itpr_id/sch_kosen.html'
    },
    university: {
      title: 'Institutional Route',
      description: 'Special institutional exchange or technical partnership pathways between designated Indonesian vocational polytechnics and Japanese KOSEN institutes.',
      requirements: [
        'Must be nominated by a partnering Indonesian vocational institution.',
        'Must have strong foundational mathematics and physics/chemistry scores.'
      ],
      process: [
        'Step 1: Contact home institution international relations division for active KOSEN bilateral agreements.',
        'Step 2: Complete institutional screening and document verification.',
        'Step 3: Interview with KOSEN representatives.'
      ],
      deadlines: 'Varies by institutional partner.',
      url: 'https://www.kosen-k.go.jp/english/'
    }
  },

  // MEXT Specialized Training College (SENSHU)
  'mext-scholarship-specialized-training-college-senshu-2027': {
    embassy: {
      title: 'Embassy Recommendation (SENSHU D2)',
      description: 'Apply through the Embassy of Japan in Jakarta for a 3-year vocational diploma program (1 year Japanese + 2 years vocational training) at Japanese Specialized Training Colleges (Senshu Gakko). Focuses on practical industry-ready skills such as Animation, Manga, Game Development, Culinary, Hotel Management, Fashion, Design, and Business.',
      requirements: [
        'Must be an Indonesian citizen under 25 years of age on April 1 of departure year (born on or after April 2, 2002).',
        'Senior high school graduate (SMA/SMK all tracks).',
        'Minimum grade of 80 in Mathematics and English on report cards (Grade 11 Semesters 1 & 2).',
        'Exception: If grade is below 80, applicants may still apply if holding JLPT min. N4, J-Test D-E (350 pts), NAT-Test Level 4, or EJU Japanese min. 240 pts.',
        'Passion for practical craft, vocational specialization, or working in Japan.'
      ],
      process: [
        'Step 1: Register online at daftar.beasiswamext.com and select examination city (Jakarta, Surabaya, Medan, Denpasar, Makassar).',
        'Step 2: Ship physical application files via registered postal courier with code "SENSHU 2027_[No. Ujian]" on the envelope.',
        'Step 3: Attend written exams in designated test city (Mathematics, English, Japanese).',
        'Step 4: Shortlisted candidates attend the interview panel at the Embassy of Japan in Jakarta.',
        'Step 5: Pass Primary Screening; Embassy nominates candidates to MEXT Tokyo for Secondary Screening.',
        'Step 6: Final results announced in February; departure to Japan in early April.'
      ],
      deadlines: '20 April – 10 May annually.',
      url: 'https://www.id.emb-japan.go.jp/itpr_id/sch_senshu.html'
    },
    university: {
      title: 'Direct Vocational Pathway',
      description: 'Direct institutional recommendation for specialized vocational tracks through designated Japanese educational consortia.',
      requirements: [
        'Must be nominated by a partnering educational foundation.',
        'Must demonstrate demonstrated talent/portfolio in chosen vocational discipline.'
      ],
      process: [
        'Step 1: Submit creative portfolio and academic records.',
        'Step 2: Practical skills evaluation and Japanese interview.',
        'Step 3: Direct nomination to MEXT Tokyo.'
      ],
      deadlines: 'Varies by vocational consortium.',
      url: 'https://www.mext.go.jp'
    }
  }
};

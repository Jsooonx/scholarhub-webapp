# Scholarship Research & Enrichment Guide

This document outlines the step-by-step methodology, data collection standards, and implementation flow used to enrich the scholarship database in ScholarHub. It serves as a handoff and reference guide for future AI agents to immediately understand the research context and continue the enrichment work.

---

## 1. Context & Objectives

ScholarHub is a premium web application designed to help international students (with a primary focus on Indonesian applicants) discover, compare, and apply for prestigious global scholarships. 

To deliver value beyond basic details (e.g., GPA or deadline), the app features an **Insider Guide** (rendered via `InsiderGuide.tsx` on the scholarship detail page). This guide displays deep-dive, country-specific advice compiled from real-world student experiences, embassy announcements, and official guides. 

Future agents should prioritize enriching the scholarships listed in the **Curated Picks** section (`src/data/curated.ts`), as these are historically the most popular and beneficial programs for Indonesian students.

---

## 2. Research Methodology: Step-by-Step Flow

When tasked with researching a new scholarship, follow this rigorous flow to gather authentic, high-value data points:

### Step 1: Identify Key Categories/Tracks
Many scholarships are not uniform; they have different channels or sub-options.
*   **Government Tracks:** (e.g., GKS/MEXT Embassy vs. University Track, Romania MFA vs. ARICE).
*   **University Options:** (e.g., Singapore ASEAN Undergraduate vs. Science & Technology vs. Nanyang Scholarship).
*   **Applicant Categories:** (e.g., Australia Awards Targeted/PNS vs. Non-Targeted/Public vs. Equity Target Groups).

### Step 2: Research Academic & English Admission Filters
Determine the exact academic requirements specifically for applicants coming from the Indonesian National Curriculum (SMA / Kurikulum Merdeka) or local universities:
*   **Entrance Exams:** Check if entrance exams are discontinued (e.g., NUS UEE) or optional/by-invitation (e.g., NTU EE).
*   **Standardized Tests:** Note if SAT, ACT, or AP tests are highly recommended to bolster Kurikulum Merdeka transcripts against international diplomas.
*   **English Entry Hurdles:** Identify minimum IELTS/TOEFL/Duolingo scores and if cheaper alternatives like TOEFL ITP are accepted for initial screening (e.g., Fulbright).

### Step 3: Extract Financial and Bond Realities
Dig into the nitty-gritty of scholarship obligations and benefits:
*   **The MOE Tuition Grant (Singapore):** Understand the difference between the standard 3-year government service bond and custom scholarship-specific bonds (e.g., the 6-year S&T bond).
*   **Exclusions:** Explicitly verify if international airfare is covered (e.g., CGS Bilateral Program does NOT cover flights, whereas MEXT/AAS/Fulbright do).
*   **Housing Stipulations:** Note if state-run dorm placement is guaranteed (e.g., Turkey KYK) or if off-campus housing requires personal funding.

### Step 4: Map the Selection & Interview Experience
Collect qualitative details about the selection stages:
*   **Timeline:** Typical months for shortlisting and final announcements.
*   **Interview Panels:** Number of interviewers, their backgrounds (e.g., Australia/Indonesia Joint Selection Team), and length.
*   **Interview Formats:** Note if there are group discussions/collaboration tests (e.g., NTU) or proposal presentation rounds (e.g., AAS/MEXT PhD).
*   **Common/Trap Questions:** Identify typical behavioral or career questions and the expected strategy to handle them (e.g., answering the cross-university choice question, or handling the return-to-home-country commitment).

### Step 5: Gather Official and Community Resources
Locate active community channels to help students consult peers or alumni:
*   **Embassies:** Official local embassies (e.g., KBRI Tokyo, KBRI Bucharest, British Embassy Jakarta).
*   **Student Associations:** Local Indonesian student associations (e.g., PPI Tiongkok, PPI Singapura/PINTS, PPI Australia, PPIA).
*   **Official Portals:** Online systems used to register and submit documents (e.g., OASIS for AAS, TBBS for Turkey, CSC for China).

---

## 3. Data Model & Architecture

All research data is stored statically in [enriched.ts](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/data/enriched.ts). 

### Key Interfaces
```typescript
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
```

### Implementation Rules
1.  **Shared Constants:** Group similar scholarships (e.g., S1/S2/S3 of the same provider) by defining shared constants for `SocialLink[]`, `TrackInfo[]`, `strategyTips`, and `differentiators` in [enriched.ts](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/data/enriched.ts) to prevent code duplication.
2.  **Mapping Key:** Ensure the key mapped inside `enrichmentData: Record<string, EnrichmentData>` matches the exact scholarship `slug` generated from the raw database.

---

## 4. Current Status & Next Steps

### Completed Enrichments
The following curated scholarships have been fully researched and enriched:
*   **Japan (MEXT):** Undergraduate (Gakubu) & Graduate (Research)
*   **South Korea (GKS):** Undergraduate & Graduate
*   **Hungary (Stipendium Hungaricum):** Bachelor's, Master's, & PhD
*   **Romania:** MFA & ARICE
*   **Turkey (YTB):** Bachelor's, Master's, & PhD
*   **Singapore:** NUS & NTU ASEAN Undergraduate
*   **Australia (AAS):** PhD & Master's
*   **United Kingdom (Chevening):** Master's
*   **United States (Fulbright):** Master's & PhD
*   **China (CGS):** Bilateral Program
*   **Russia (Open Doors):** Master's & PhD
*   **Russia (Government Quota):** Bachelor's, Master's, & PhD
*   **Saudi Arabia (Study in Saudi):** Bachelor's, Master's, & PhD

### Missing Enrichments (Future Backlog)
All curated picks in `src/data/curated.ts` have been fully enriched. No pending backlog items remain.

---

## 5. Development Guidelines for Future Agents

*   **No Mandatory Push Rule:** 
    > [!IMPORTANT]
    > Never perform a `git push` or merge to remote unless explicitly commanded by the user. Keep changes local.
*   **Verify Build Health:** 
    Always run `npm run build` after editing `enriched.ts` to ensure all TypeScript typings and Next.js static generation params compile correctly.
*   **Hydration Mismatch Awareness:** 
    If modifying components like `CuratedPicks.tsx`, avoid conditional structural DOM changes based on the `mounted` state. Keep the outer elements static, and only change attributes (like `disabled`) or styles once mounted to satisfy Next.js SSR requirements.

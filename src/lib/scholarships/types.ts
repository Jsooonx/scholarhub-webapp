// Types for Scholarships

export interface Scholarship {
  name: string;
  provider: string;
  country: string | null;
  degree_levels: string[];
  fields: string[];
  funding_type: string;
  duration_months: { min: number | null; max: number | null };
  requirements: {
    first_degree_required: boolean | null;
    professional_experience_required: boolean | null;
    professional_experience_years: number | null;
    country_restrictions: string[];
    raw_items?: string[];
  };
  benefits: string[];
  target_group: string | null;
  official_url: string | null;
  description: string | null;
  confidence_score: number;
  source: string;
  // MEXT-specific optional fields
  program_type?: string;
  deadline?: string;
  amounts?: string[];
  application_period?: string[];
  application_process?: string[];
  selection_process?: string;
  important_dates?: string[];
  related_links?: { label: string; url: string }[];
  // Computed
  slug: string;
}

export interface FilterParams {
  query?: string;
  provider?: string;
  funding?: string;
  level?: string;
  country?: string;
}


export type DeadlineStatus =
  | { type: 'open';    label: string; daysLeft: number; deadline: Date }
  | { type: 'closing'; label: string; daysLeft: number; deadline: Date }
  | { type: 'closed';  label: string; deadline: Date }
  | { type: 'rolling'; label: string }
  | { type: 'check';   label: string };

export interface UniversityLogo {
  name: string;
  logo: string;
}


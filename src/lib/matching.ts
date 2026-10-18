import { allScholarships, type Scholarship, providerGroup } from '@/lib/scholarships';

export interface QuizAnswers {
  degree: 'bachelor' | 'master' | 'phd' | 'non-degree';
  field: 'stem' | 'business' | 'arts' | 'social' | 'medicine' | 'any';
  experience: 'yes' | 'no';
  funding: 'fully' | 'any';
  region: 'any' | 'asia' | 'europe' | 'americas' | 'oceania';
}

export const REGION_COUNTRIES: Record<string, string[]> = {
  asia: ['japan', 'south-korea', 'turkey', 'china', 'singapore', 'taiwan', 'hong-kong', 'malaysia', 'saudi-arabia', 'qatar'],
  europe: ['germany', 'united-kingdom', 'france', 'netherlands', 'belgium', 'sweden', 'italy', 'hungary', 'switzerland', 'austria', 'finland', 'ireland', 'poland', 'spain', 'denmark', 'norway', 'romania', 'russia'],
  americas: ['united-states', 'canada'],
  oceania: ['australia', 'new-zealand']
};

export const FIELD_KEYWORDS: Record<string, string[]> = {
  stem: ['science', 'tech', 'engineering', 'math', 'computer', 'it', 'physics', 'chemistry', 'biology', 'data', 'stem'],
  business: ['business', 'management', 'economics', 'mba', 'finance', 'accounting', 'marketing'],
  arts: ['art', 'music', 'design', 'architecture', 'drama', 'theater', 'creative'],
  social: ['social', 'law', 'politics', 'international', 'sociology', 'history', 'language', 'philosophy', 'humanities', 'literature'],
  medicine: ['medicine', 'medical', 'nursing', 'health', 'pharmacy', 'clinical', 'dental', 'veterinary']
};

export const matchDegree = (s: Scholarship, degree: string) => {
  const levels = s.degree_levels.map(l => l.toLowerCase());
  if (degree === 'bachelor') return levels.some(l => l.includes('bachelor') || l.includes('undergraduate'));
  if (degree === 'master') return levels.some(l => l.includes('master') || l.includes('postgraduate'));
  if (degree === 'phd') return levels.some(l => l.includes('phd') || l.includes('doctoral') || l.includes('postdoctoral'));
  if (degree === 'non-degree') return levels.some(l => l.includes('non-degree') || l.includes('short') || l.includes('diploma') || l.includes('certificate'));
  return true;
};

export const matchField = (s: Scholarship, field: string) => {
  if (field === 'any') return true;
  const sFields = s.fields.map(f => f.toLowerCase());
  const keywords = FIELD_KEYWORDS[field] || [];
  return sFields.some(sf => 
    sf.includes('all') || 
    sf.includes('various') || 
    sf.includes('any') ||
    keywords.some(kw => sf.includes(kw))
  );
};

export const matchExperience = (s: Scholarship, experience: string) => {
  if (experience === 'yes') return true;
  return !s.requirements.professional_experience_required;
};

export const matchFunding = (s: Scholarship, funding: string) => {
  if (funding === 'any') return true;
  return s.funding_type.toLowerCase().includes('fully');
};

export const matchRegion = (s: Scholarship, region: string) => {
  if (region === 'any') return true;
  const country = s.country ? s.country.toLowerCase() : '';
  const pGroup = providerGroup(s.provider).toLowerCase();
  const countries = REGION_COUNTRIES[region] || [];
  return countries.some(c => country.includes(c) || pGroup.includes(c));
};

export function filterScholarships(answers: QuizAnswers): { matches: Scholarship[]; isFuzzy: boolean; fuzzyLevels: string[] } {
  // 1. Exact match
  let matches = allScholarships.filter(s => 
    matchDegree(s, answers.degree) &&
    matchField(s, answers.field) &&
    matchExperience(s, answers.experience) &&
    matchFunding(s, answers.funding) &&
    matchRegion(s, answers.region)
  );

  if (matches.length > 0) {
    return { matches, isFuzzy: false, fuzzyLevels: [] };
  }

  // 2. Fallback: Drop Region
  let fuzzyLevels: string[] = ['Region'];
  matches = allScholarships.filter(s => 
    matchDegree(s, answers.degree) &&
    matchField(s, answers.field) &&
    matchExperience(s, answers.experience) &&
    matchFunding(s, answers.funding)
  );

  if (matches.length > 0) {
    return { matches, isFuzzy: true, fuzzyLevels };
  }

  // 3. Fallback: Drop Funding (allow partial)
  fuzzyLevels.push('Funding');
  matches = allScholarships.filter(s => 
    matchDegree(s, answers.degree) &&
    matchField(s, answers.field) &&
    matchExperience(s, answers.experience)
  );

  if (matches.length > 0) {
    return { matches, isFuzzy: true, fuzzyLevels };
  }

  // 4. Fallback: Drop Experience
  fuzzyLevels.push('Work Experience');
  matches = allScholarships.filter(s => 
    matchDegree(s, answers.degree) &&
    matchField(s, answers.field)
  );

  return { matches, isFuzzy: true, fuzzyLevels };
}

export const DEGREE_LABELS: Record<QuizAnswers['degree'], string> = {
  bachelor: 'Bachelor',
  master: 'Master',
  phd: 'PhD',
  'non-degree': 'Short Course',
};

export const FIELD_LABELS: Record<QuizAnswers['field'], string> = {
  stem: 'STEM',
  business: 'Business',
  arts: 'Arts',
  social: 'Social',
  medicine: 'Medicine',
  any: 'General',
};

export const EXPERIENCE_LABELS: Record<QuizAnswers['experience'], string> = {
  yes: '2+ Yrs',
  no: 'None / Fresh',
};

export const FUNDING_LABELS: Record<QuizAnswers['funding'], string> = {
  fully: 'Strictly Fully',
  any: 'Open to All',
};

export const REGION_LABELS: Record<QuizAnswers['region'], string> = {
  any: 'Any Region',
  asia: 'Asia',
  europe: 'Europe',
  americas: 'Americas',
  oceania: 'Oceania',
};

export function formatDegree(degree?: string | null): string {
  if (!degree) return '';
  const key = degree.toLowerCase() as QuizAnswers['degree'];
  return DEGREE_LABELS[key] || degree.charAt(0).toUpperCase() + degree.slice(1);
}

export function formatField(field?: string | null): string {
  if (!field) return '';
  const key = field.toLowerCase() as QuizAnswers['field'];
  return FIELD_LABELS[key] || (field.toLowerCase() === 'stem' ? 'STEM' : field.charAt(0).toUpperCase() + field.slice(1));
}

export function formatExperience(exp?: string | null): string {
  if (!exp) return '';
  const key = exp.toLowerCase() as QuizAnswers['experience'];
  return EXPERIENCE_LABELS[key] || exp;
}

export function formatFunding(funding?: string | null): string {
  if (!funding) return '';
  const key = funding.toLowerCase() as QuizAnswers['funding'];
  return FUNDING_LABELS[key] || funding;
}

export function formatRegion(region?: string | null): string {
  if (!region) return '';
  const key = region.toLowerCase() as QuizAnswers['region'];
  return REGION_LABELS[key] || (region.charAt(0).toUpperCase() + region.slice(1));
}

// ── Enrichment Data ───────────────────────────────────────────────────────────────
// Deep-dive insider information per scholarship: exam details, track comparisons,
// community resources, strategy tips, and key differentiators.
// Rendered inside <InsiderGuide /> on the scholarship detail page.

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

export interface SpecialNotice {
  title: string;
  badge?: string;
  items: string[];
  note?: string;
  actionButton?: {
    label: string;
    url: string;
  };
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
  specialNotice?: SpecialNotice;
}

import { japanEnrichment } from './enriched/japan';
import { koreaEnrichment } from './enriched/korea';
import { hungaryEnrichment } from './enriched/hungary';
import { romaniaEnrichment } from './enriched/romania';
import { turkeyEnrichment } from './enriched/turkey';
import { saudiEnrichment } from './enriched/saudi';
import { russiaEnrichment } from './enriched/russia';
import { chinaEnrichment } from './enriched/china';
import { usEnrichment } from './enriched/us';
import { ukEnrichment } from './enriched/uk';
import { australiaEnrichment } from './enriched/australia';
import { singaporeEnrichment } from './enriched/singapore';

export const enrichmentData: Record<string, EnrichmentData> = {
  ...japanEnrichment,
  ...koreaEnrichment,
  ...hungaryEnrichment,
  ...romaniaEnrichment,
  ...turkeyEnrichment,
  ...saudiEnrichment,
  ...russiaEnrichment,
  ...chinaEnrichment,
  ...usEnrichment,
  ...ukEnrichment,
  ...australiaEnrichment,
  ...singaporeEnrichment,
};

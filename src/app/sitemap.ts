import type { MetadataRoute } from 'next';
import { allScholarships } from '@/lib/scholarships';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scholarhub.jsooonx.my.id';

const PROVIDERS = [
  'daad',
  'mext',
  'turkiye',
  'chevening',
  'australia-awards',
  'gks',
  'singapore',
  'eiffel',
  'canada',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const statics: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/scholarships`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Provider pages
  const providerPages: MetadataRoute.Sitemap = PROVIDERS.map((slug) => ({
    url: `${BASE_URL}/providers/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Individual scholarship pages
  const scholarshipPages: MetadataRoute.Sitemap = allScholarships.map((s) => ({
    url: `${BASE_URL}/scholarships/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...statics, ...providerPages, ...scholarshipPages];
}

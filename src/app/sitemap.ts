import type { MetadataRoute } from 'next';
import { allScholarships, providerMeta } from '@/lib/scholarships';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scholarhub.jsooonx.my.id';

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
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Provider pages — dynamically derived from providerMeta so it stays in sync
  const providerPages: MetadataRoute.Sitemap = Object.keys(providerMeta).map((slug) => ({
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

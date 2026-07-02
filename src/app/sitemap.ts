import type { MetadataRoute } from 'next';
import { allScholarships, providerMeta, BASE_URL } from '@/lib/scholarships';

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a stable date so Google doesn't think the sitemap changes on every request.
  // Update this whenever you make significant content changes.
  const lastBuildDate = new Date('2026-07-02T00:00:00Z');

  // Static pages
  const statics: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: lastBuildDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/scholarships`,
      lastModified: lastBuildDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: lastBuildDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: lastBuildDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: lastBuildDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Provider pages — dynamically derived from providerMeta so it stays in sync
  const providerPages: MetadataRoute.Sitemap = Object.keys(providerMeta).map((slug) => ({
    url: `${BASE_URL}/providers/${slug}`,
    lastModified: lastBuildDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Individual scholarship pages
  const scholarshipPages: MetadataRoute.Sitemap = allScholarships.map((s) => ({
    url: `${BASE_URL}/scholarships/${s.slug}`,
    lastModified: lastBuildDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...statics, ...providerPages, ...scholarshipPages];
}

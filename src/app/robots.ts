import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/scholarships';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all general crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // Block AI training crawlers
      { userAgent: 'GPTBot', disallow: ['/'] },
      { userAgent: 'ChatGPT-User', disallow: ['/'] },
      { userAgent: 'Google-Extended', disallow: ['/'] },
      { userAgent: 'anthropic-ai', disallow: ['/'] },
      { userAgent: 'ClaudeBot', disallow: ['/'] },
      { userAgent: 'Omgilibot', disallow: ['/'] },
      { userAgent: 'FacebookBot', disallow: ['/'] },
      { userAgent: 'CCBot', disallow: ['/'] },
      { userAgent: 'PerplexityBot', allow: ['/'] },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

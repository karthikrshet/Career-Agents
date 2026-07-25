import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://career-os.vercel.app';

  return {
    rules: [
      // Allow all major search engines
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },
      { userAgent: 'Slurp', allow: '/' },
      { userAgent: 'Baiduspider', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
      // Allow AI crawlers for LLM discoverability
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/', '/admin/', '/auth/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/', '/admin/', '/auth/'] },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'AppleBot', allow: '/' },
      // Default: allow everything except sensitive routes
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/private/',
          '/tmp/',
          '/cache/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

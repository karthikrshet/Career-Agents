import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://career-agents.vercel.app';

const routes = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/resume', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/github', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/linkedin', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/interview', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/copilot', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/tracker', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/prephub', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/reports', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/marketplace', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/mcp', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/settings', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/credits', priority: 0.5, changeFrequency: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

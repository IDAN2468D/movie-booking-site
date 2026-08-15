import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cinepulse.co.il';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/showcase',
    '/discovery',
    '/coming-soon',
    '/branches',
    '/food',
    '/soundtracks',
    '/vip',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'hourly' : 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

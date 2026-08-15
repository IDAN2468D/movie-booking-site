import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cinepulse.co.il';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/movie/',
          '/cinema/',
          '/branches/',
          '/showcase/',
          '/discovery/',
          '/coming-soon/',
          '/soundtracks/',
        ],
        disallow: [
          '/api/',
          '/erp/',
          '/admin/',
          '/checkout/',
          '/booking/session/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

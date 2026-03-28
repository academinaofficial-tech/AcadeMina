import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/api/',
        '/cart/',
        '/checkout/',
        '/mypage/',
        '/onboarding/',
        '/order-complete/',
      ],
    },
    sitemap: 'https://www.academina.com/sitemap.xml',
  };
}
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/'],
      },
      {
        // Block AI crawlers/scrapers
        userAgent: [
          'GPTBot', 
          'CCBot', 
          'Google-Extended', 
          'anthropic-ai', 
          'Claude-Web',
          'FacebookBot'
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://nhuthangluu.id.vn/sitemap.xml',
  }
}

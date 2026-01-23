import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hhcc.online'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/dashboard/',
                    '/results/',
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}

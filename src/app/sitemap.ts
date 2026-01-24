import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hhcc.online'

    // 静态页面
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/tests`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // 动态生成测试页面
    try {
        const tests = await prisma.test.findMany({
            where: { isPublished: true },
            select: { id: true, createdAt: true }
        })

        const testPages: MetadataRoute.Sitemap = tests.map((test) => ({
            url: `${siteUrl}/tests/${test.id}`,
            lastModified: test.createdAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        return [...staticPages, ...testPages]
    } catch (error) {
        // 如果数据库查询失败，只返回静态页面
        console.error('Sitemap generation error:', error)
        return staticPages
    }
}

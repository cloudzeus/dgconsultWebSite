import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dgconsult.gr';
    let sectors: any[] = [];
    let caseStudies: any[] = [];

    if (process.env.DB_URL && (process.env.DB_URL.startsWith("mysql") || process.env.DB_URL.startsWith("postgresql"))) {
        try {
            sectors = await prisma.sector.findMany({
                where: { isActive: true },
                select: { slug: true, updatedAt: true }
            });

            caseStudies = await prisma.caseStudy.findMany({
                where: { isPublished: true },
                select: { slug: true, updatedAt: true }
            });
        } catch (error) {
            console.error("Sitemap generation error:", error);
        }
    }

    const sectorUrls = sectors.map((sector) => ({
        url: `${baseUrl}/sectors/${sector.slug}`,
        lastModified: sector.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const caseStudyUrls = caseStudies.map((study) => ({
        url: `${baseUrl}/case-studies/${study.slug}`,
        lastModified: study.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...sectorUrls,
        ...caseStudyUrls,
    ];
}

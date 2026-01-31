import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CaseStudyClient from "./CaseStudyClient";
import { Metadata } from "next";

export async function generateStaticParams() {
    if (!process.env.DB_URL) return [];

    try {
        const studies = await prisma.caseStudy.findMany({
            where: { isPublished: true },
            select: { slug: true }
        });
        return studies.map((study) => ({
            slug: study.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for case studies:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const study = await prisma.caseStudy.findUnique({ where: { slug } });

    if (!study) {
        return { title: 'Case Study Not Found' };
    }

    return {
        title: (study as any).metaTitle || `${study.title} | DGCONSULT`,
        description: (study as any).metaDescription || study.description,
        openGraph: {
            title: (study as any).metaTitle || study.title,
            description: (study as any).metaDescription || study.description,
            images: study.featuredImage ? [study.featuredImage] : [],
        },
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const hasDb = !!process.env.DB_URL && (process.env.DB_URL.startsWith("mysql") || process.env.DB_URL.startsWith("postgresql"));
    if (!hasDb) notFound();

    // Fetch directly from DB
    let study = null;
    try {
        study = await prisma.caseStudy.findUnique({
            where: { slug }
        });
    } catch (e) {
        console.error("Prisma lookup error on case study page:", e);
        notFound();
    }

    if (!study) {
        notFound();
    }

    // Adapt DB model to Client Interface
    // Note: technologies in DB is string (comma separated), Client expects array
    const clientStudy = {
        ...study,
        image: study.featuredImage || "",
        technologies: study.technologies ? study.technologies.split(',').map(t => t.trim()) : [],
        category: study.category || "",
        // Ensure content fields are present
        results: study.results || undefined,
        challenge: study.challenge || undefined,
        solution: study.solution || undefined,
        clientName: study.clientName || undefined,
        industry: study.industry || undefined,
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: study.title,
        description: study.description,
        image: study.featuredImage ? [study.featuredImage] : [],
        datePublished: study.createdAt,
        dateModified: study.updatedAt,
        author: {
            '@type': 'Organization',
            name: 'DGCONSULT'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CaseStudyClient study={clientStudy} />
        </>
    );
}

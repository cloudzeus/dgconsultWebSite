import { prisma, isDbConfigured } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
    if (!isDbConfigured()) return [];

    try {
        const sectors = await prisma.sector.findMany({
            where: { isActive: true },
            select: { slug: true },
        });
        return sectors.map((sector) => ({
            slug: sector.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for sectors:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const hasDb = isDbConfigured();

    let sector = null;
    if (hasDb) {
        try {
            sector = await prisma.sector.findUnique({
                where: { slug },
            });
        } catch (e) {
            console.error("Prisma metadata fetch error in sector page:", e);
        }
    }

    if (!sector) {
        return { title: 'Sector Not Found' };
    }

    return {
        title: (sector as any).metaTitle || `${sector.title} | DGCONSULT`,
        description: (sector as any).metaDescription || sector.description,
        openGraph: {
            title: (sector as any).metaTitle || sector.title,
            description: (sector as any).metaDescription || sector.description,
            images: sector.featuredImage ? [sector.featuredImage] : [],
        },
    };
}

import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import SectorClient from "./SectorClient";

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const hasDb = isDbConfigured();
    if (!hasDb) notFound();

    // Parallel fetch
    let sector = null;
    let settings = null;

    try {
        const [sectorData, settingsData] = await Promise.all([
            prisma.sector.findUnique({ where: { slug } }),
            (prisma as any).globalSettings.findFirst()
        ]);
        sector = sectorData;
        settings = settingsData;
    } catch (e) {
        console.error("Prisma lookup error on sector page:", e);
        notFound();
    }

    if (!sector || !sector.isActive) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: sector.title,
        description: sector.description,
        provider: {
            '@type': 'Organization',
            name: 'DGCONSULT',
            url: 'https://dgconsult.gr'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorClient sector={sector} settings={settings} />
        </>
    );
}

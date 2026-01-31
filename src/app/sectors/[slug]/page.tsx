import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
    const sectors = await prisma.sector.findMany({
        where: { isActive: true },
        select: { slug: true },
    });
    return sectors.map((sector) => ({
        slug: sector.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const sector = await prisma.sector.findUnique({
        where: { slug },
    });

    if (!sector) {
        return { title: 'Sector Not Found' };
    }

    return {
        title: `${sector.title} | DGCONSULT`,
        description: sector.description,
    };
}

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const sector = await prisma.sector.findUnique({
        where: { slug },
    });

    if (!sector || !sector.isActive) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 mb-12">
                <Link
                    href="/#sectors"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#D32F2F] mb-6 transition-colors"
                >
                    ← Back to Sectors
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{sector.title}</h1>

                {sector.featuredImage && (
                    <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-2xl overflow-hidden">
                        <Image
                            src={sector.featuredImage}
                            alt={sector.title}
                            layout="fill"
                            objectFit="cover"
                            className="hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                )}
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto prose prose-lg prose-red">
                    {/* 
               If content is markdown, we would use a markdown renderer here.
               For now, assuming it could be HTML or plain text. 
               If you need markdown support, we should install 'react-markdown'.
            */}
                    <div dangerouslySetInnerHTML={{ __html: sector.content || sector.description }} />
                </div>
            </section>
        </main>
    );
}

import { caseStudies } from "@/lib/data";
import { notFound } from "next/navigation";
import CaseStudyClient from "./CaseStudyClient";

export function generateStaticParams() {
    return caseStudies.map((study) => ({
        slug: study.slug,
    }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = caseStudies.find((s) => s.slug === slug);

    if (!study) {
        notFound();
    }

    return <CaseStudyClient study={study} />;
}

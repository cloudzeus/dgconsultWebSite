import { prisma } from "@/lib/db";
import { SortableCaseStudyList } from "./SortableCaseStudyList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
    const session = await auth();
    if (!session) {
        redirect("/admin/login");
    }

    const caseStudies = await prisma.caseStudy.findMany({
        orderBy: {
            sortOrder: "asc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
            </div>

            <SortableCaseStudyList initialItems={caseStudies} />
        </div>
    );
}

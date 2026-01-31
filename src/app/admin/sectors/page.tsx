import { prisma } from "@/lib/db";
import { SortableSectorList } from "./SortableSectorList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
    const session = await auth();
    if (!session) {
        redirect("/admin/login");
    }

    const sectors = await prisma.sector.findMany({
        orderBy: {
            sortOrder: "asc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Application Areas / Sectors</h1>
            </div>

            <SortableSectorList initialItems={sectors} />
        </div>
    );
}

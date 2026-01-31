import { prisma, isDbConfigured } from "@/lib/db";
import { Sector } from "@prisma/client";
import { SortableSectorList } from "./SortableSectorList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
    const session = await auth();
    if (!session) {
        redirect("/admin/login");
    }

    let sectors: Sector[] = [];
    const dbConfigured = isDbConfigured();

    console.log('[Admin Sectors] DB Configured:', dbConfigured);
    console.log('[Admin Sectors] DB_URL exists:', !!process.env.DB_URL);

    if (dbConfigured) {
        try {
            sectors = await prisma.sector.findMany({
                orderBy: {
                    sortOrder: "asc",
                },
            });
            console.log('[Admin Sectors] Loaded sectors:', sectors.length);
        } catch (error) {
            console.error('[Admin Sectors] Error loading sectors:', error);
        }
    } else {
        console.warn('[Admin Sectors] Database not configured, showing empty list');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Application Areas / Sectors</h1>
            </div>

            <SortableSectorList initialItems={sectors} />
        </div>
    );
}

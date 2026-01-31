"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const sectorSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    featuredImage: z.string().optional(),
    content: z.string().optional(),
});

export async function createSector(prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedData = sectorSchema.parse({
            ...rawData,
            isActive: rawData.isActive === "on",
            isFeatured: rawData.isFeatured === "on",
        });

        const maxOrder = await prisma.sector.aggregate({
            _max: {
                sortOrder: true,
            },
        });

        const newOrder = (maxOrder._max.sortOrder || 0) + 1;

        await prisma.sector.create({
            data: {
                ...validatedData,
                content: validatedData.content || "",
                sortOrder: newOrder,
            },
        });

        revalidatePath("/admin/sectors");
        return { success: true };
    } catch (error) {
        console.error("Create sector error:", error);
        return { success: false, error: "Failed to create sector" };
    }
}

export async function updateSector(id: string, prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedData = sectorSchema.parse({
            ...rawData,
            isActive: rawData.isActive === "on",
            isFeatured: rawData.isFeatured === "on",
        });

        // Don't overwrite content if it's not provided/handled in this specific form submission differently, 
        // but here we assume the form sends everything.

        await prisma.sector.update({
            where: { id },
            data: {
                ...validatedData,
            },
        });

        revalidatePath("/admin/sectors");
        return { success: true };
    } catch (error) {
        console.error("Update sector error:", error);
        return { success: false, error: "Failed to update sector" };
    }
}

export async function deleteSector(id: string) {
    try {
        await prisma.sector.delete({
            where: { id },
        });
        revalidatePath("/admin/sectors");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete sector" };
    }
}

export async function updateSectorsOrder(items: { id: string; sortOrder: number }[]) {
    try {
        for (const item of items) {
            await prisma.sector.update({
                where: { id: item.id },
                data: { sortOrder: item.sortOrder },
            });
        }
        revalidatePath("/admin/sectors");
        return { success: true };
    } catch (error) {
        console.error("Reorder error:", error);
        return { success: false, error: "Failed to reorder sectors" };
    }
}

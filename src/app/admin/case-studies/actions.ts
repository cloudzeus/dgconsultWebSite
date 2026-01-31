"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const caseStudySchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    clientName: z.string().optional(),
    industry: z.string().optional(),
    technologies: z.string().optional(),
    challenge: z.string().optional(),
    solution: z.string().optional(),
    results: z.string().optional(),
    category: z.string().optional(),
    isPublished: z.boolean().default(false),
    featuredImage: z.string().optional(),
    logo: z.string().optional(),
    images: z.string().optional(), // JSON string
});

export async function createCaseStudy(prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedData = caseStudySchema.parse({
            ...rawData,
            isPublished: rawData.isPublished === "on",
        });

        const maxOrder = await prisma.caseStudy.aggregate({
            _max: {
                sortOrder: true,
            },
        });

        const newOrder = (maxOrder._max.sortOrder || 0) + 1;

        await prisma.caseStudy.create({
            data: {
                ...validatedData,
                content: "", // Content will be handled separately if needed
                sortOrder: newOrder,
                images: validatedData.images || "[]",
            },
        });

        revalidatePath("/admin/case-studies");
        return { success: true };
    } catch (error) {
        console.error("Create case study error:", error);
        return { success: false, error: "Failed to create case study" };
    }
}

export async function updateCaseStudy(id: string, prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedData = caseStudySchema.parse({
            ...rawData,
            isPublished: rawData.isPublished === "on",
        });

        await prisma.caseStudy.update({
            where: { id },
            data: {
                ...validatedData,
                images: validatedData.images || "[]",
            },
        });

        revalidatePath("/admin/case-studies");
        return { success: true };
    } catch (error) {
        console.error("Update case study error:", error);
        return { success: false, error: "Failed to update case study" };
    }
}

export async function deleteCaseStudy(id: string) {
    try {
        await prisma.caseStudy.delete({
            where: { id },
        });
        revalidatePath("/admin/case-studies");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete case study" };
    }
}

export async function updateCaseStudiesOrder(items: { id: string; sortOrder: number }[]) {
    try {
        for (const item of items) {
            await prisma.caseStudy.update({
                where: { id: item.id },
                data: { sortOrder: item.sortOrder },
            });
        }
        revalidatePath("/admin/case-studies");
        return { success: true };
    } catch (error) {
        console.error("Reorder error:", error);
        return { success: false, error: "Failed to reorder case studies" };
    }
}

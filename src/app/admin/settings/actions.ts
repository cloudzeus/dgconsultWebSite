"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
});

export async function getSettings() {
    // Try to find the first record, if not create one
    const settings = await prisma.globalSettings.findFirst();
    if (!settings) {
        return await prisma.globalSettings.create({
            data: {},
        });
    }
    return settings;
}

export async function updateSettings(prevState: { success: boolean; message?: string; error?: string }, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedData = settingsSchema.parse(rawData);

        // Update the first record found, or create if somehow missing (handled by getSettings usually, but here specific update logic)
        const existing = await prisma.globalSettings.findFirst();

        if (existing) {
            await prisma.globalSettings.update({
                where: { id: existing.id },
                data: validatedData,
            });
        } else {
            await prisma.globalSettings.create({
                data: validatedData,
            });
        }

        revalidatePath("/", "layout"); // Revalidate everything as footer/header might change
        return { success: true, message: "Settings updated successfully" };
    } catch (error) {
        console.error("Update settings error:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

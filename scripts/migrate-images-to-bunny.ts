
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import dotenv from "dotenv";

// Load environment variables manually since this is a script
dotenv.config();

const prisma = new PrismaClient();

const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const STORAGE_API_HOST = process.env.BUNNY_STORAGE_API_HOST || "storage.bunnycdn.com";
const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME!;

if (!ACCESS_KEY || !STORAGE_ZONE || !CDN_HOSTNAME) {
    console.error("Missing BunnyCDN credentials in .env");
    process.exit(1);
}

// Map of local filenames to uploaded URLs to avoid re-uploading duplicate references
const uploadedCache: Record<string, string> = {};

async function uploadBuffer(buffer: Buffer, filename: string, folder: string): Promise<string> {
    const optimizedBuffer = await sharp(buffer)
        .resize(1920, 1080, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 6 })
        .toBuffer();

    const uniqueFilename = `${Date.now()}-${filename.replace(/\.[^/.]+$/, "")}.webp`;
    const uploadPath = `${folder}/${uniqueFilename}`;
    const url = `https://${STORAGE_API_HOST}/${STORAGE_ZONE}/${uploadPath}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            AccessKey: ACCESS_KEY,
            "Content-Type": "application/octet-stream",
        },
        body: optimizedBuffer as any,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload to BunnyCDN: ${response.statusText}`);
    }

    return `https://${CDN_HOSTNAME}/${uploadPath}`;
}

async function processLocalImage(localPath: string, folder: string): Promise<string | null> {
    if (!localPath.startsWith("/")) {
        // It might be an external URL already or invalid
        if (localPath.startsWith("http")) return localPath;
        // Make it absolute relative to public if it starts with /images
        localPath = path.join(process.cwd(), "public", localPath);
    } else {
        localPath = path.join(process.cwd(), "public", localPath);
    }

    try {
        const fileBuffer = await fs.readFile(localPath);
        const filename = path.basename(localPath);

        console.log(`Uploading ${filename}...`);
        const url = await uploadBuffer(fileBuffer, filename, folder);
        console.log(`Uploaded to ${url}`);
        return url;
    } catch (error) {
        console.error(`Error reading/uploading ${localPath}:`, error);
        return null;
    }
}

async function main() {
    console.log("Starting migration of local images to BunnyCDN...");

    // 1. Migrate Sectors
    const sectors = await prisma.sector.findMany();
    for (const sector of sectors) {
        if (sector.featuredImage && !sector.featuredImage.startsWith("http")) {
            // It's a local path
            const newUrl = await processLocalImage(sector.featuredImage, "sectors");
            if (newUrl) {
                await prisma.sector.update({
                    where: { id: sector.id },
                    data: { featuredImage: newUrl }
                });
                console.log(`Updated Sector [${sector.title}] image.`);
            }
        }
    }

    // 2. Migrate Case Studies
    const cases = await prisma.caseStudy.findMany();
    for (const c of cases) {
        if (c.featuredImage && !c.featuredImage.startsWith("http")) {
            const newUrl = await processLocalImage(c.featuredImage, "case-studies");
            if (newUrl) {
                await prisma.caseStudy.update({
                    where: { id: c.id },
                    data: { featuredImage: newUrl }
                });
                console.log(`Updated CaseStudy [${c.title}] featured image.`);
            }
        }

        // Images array
        if (c.images) {
            // Logic for array if defined/used, but based on current seed only featuredImage is used primarily. 
            // If there were any seeded images array we'd handle it here.
        }
    }

    console.log("Migration complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import sharp from "sharp";

const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const STORAGE_API_HOST = process.env.BUNNY_STORAGE_API_HOST || "storage.bunnycdn.com";
const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME!;

export async function uploadImage(file: File, folder: string = "case-studies"): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Optimize image
    const optimizedBuffer = await sharp(buffer)
        .resize(1920, 1080, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 6 })
        .toBuffer();

    const filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;
    const path = `${folder}/${filename}`;

    const url = `https://${STORAGE_API_HOST}/${STORAGE_ZONE}/${path}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            AccessKey: ACCESS_KEY,
            "Content-Type": "application/octet-stream",
        },
        body: optimizedBuffer as any,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload image to BunnyCDN: ${response.statusText}`);
    }

    return `https://${CDN_HOSTNAME}/${path}`;
}

export async function deleteImage(url: string) {
    try {
        const path = url.replace(`https://${CDN_HOSTNAME}/`, "");
        const deleteUrl = `https://${STORAGE_API_HOST}/${STORAGE_ZONE}/${path}`;

        await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
                AccessKey: ACCESS_KEY,
            },
        });
    } catch (error) {
        console.error("Error deleting image:", error);
    }
}

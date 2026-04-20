import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, getStorageUrl } from "@/lib/supabase";
import sharp from "sharp";

// Prevent static pre-rendering — this route needs runtime env vars
export const dynamic = "force-dynamic";

// Watermark: CLONICA text + logo overlay, bottom-right corner, semi-transparent
async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const w = metadata.width || 800;
    const h = metadata.height || 800;

    // Scale watermark relative to image size
    const wmWidth = Math.max(Math.round(w * 0.25), 120); // 25% of image width, min 120px
    const fontSize = Math.max(Math.round(wmWidth * 0.18), 14);
    const logoSize = Math.max(Math.round(wmWidth * 0.22), 18);
    const wmHeight = Math.round(fontSize * 2.5);

    // Create SVG watermark with logo circle + text
    // NOTE: No url(#id) references — direct colors only (Next.js SSR compat)
    const svgWatermark = Buffer.from(`
      <svg width="${wmWidth}" height="${wmHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background pill -->
        <rect x="0" y="0" width="${wmWidth}" height="${wmHeight}" rx="${wmHeight / 2}" fill="rgba(0,0,0,0.35)"/>
        <!-- Logo circle with C -->
        <circle cx="${wmHeight / 2}" cy="${wmHeight / 2}" r="${logoSize / 2}" fill="none" stroke="rgba(196,164,105,0.8)" stroke-width="1.5"/>
        <text x="${wmHeight / 2}" y="${wmHeight / 2 + fontSize * 0.15}" text-anchor="middle" dominant-baseline="middle"
              font-family="Georgia, serif" font-size="${logoSize * 0.6}" fill="rgba(196,164,105,0.85)" font-weight="bold">C</text>
        <!-- CLONICA text -->
        <text x="${wmHeight + 4}" y="${wmHeight / 2 + fontSize * 0.15}" dominant-baseline="middle"
              font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="rgba(255,255,255,0.75)"
              letter-spacing="${fontSize * 0.2}">CLONICA</text>
      </svg>
    `);

    // Composite watermark on bottom-right
    return await image
      .composite([
        {
          input: svgWatermark,
          gravity: "southeast",
          blend: "over",
        },
      ])
      .toBuffer();
  } catch (err) {
    // If watermark fails, return original image
    console.error("Watermark error:", err);
    return imageBuffer;
  }
}

// POST /api/admin/upload — upload image(s) to Supabase Storage with automatic watermark
export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "products/misc";
    const skipWatermark = formData.get("skipWatermark") === "true";

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      let buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      const videoExts = [".mp4", ".mov", ".webm", ".avi", ".mkv"];
      const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
      const isImage = file.type.startsWith("image/") || imageExts.includes(ext);
      const isVideo = file.type.startsWith("video/") || videoExts.includes(ext);

      // Apply watermark to images (not videos, not SVGs)
      if (isImage && !skipWatermark && !file.type.includes("svg")) {
        buffer = await addWatermark(buffer);
      }

      const safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "-");

      // Videos go to a separate path prefix
      const storagePath = isVideo
        ? `videos/${folder}/${safeName}`
        : `${folder}/${safeName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
          upsert: true, // overwrite if exists
        });

      if (error) {
        console.error(`Upload error for ${safeName}:`, error.message);
        errors.push(`${safeName}: ${error.message}`);
        continue; // skip failed file, continue with others
      }

      uploaded.push(getStorageUrl(storagePath));
    }

    if (!uploaded.length) {
      return NextResponse.json(
        { error: "All uploads failed", details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploaded,
      ...(errors.length ? { partialErrors: errors } : {}),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

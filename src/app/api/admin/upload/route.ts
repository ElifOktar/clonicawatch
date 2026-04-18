import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, getStorageUrl } from "@/lib/supabase";

// POST /api/admin/upload — upload image(s) to Supabase Storage
export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "products/misc";

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "-");
      const storagePath = `${folder}/${safeName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true, // overwrite if exists
        });

      if (error) {
        console.error(`Upload error for ${safeName}:`, error.message);
        continue; // skip failed file, continue with others
      }

      uploaded.push(getStorageUrl(storagePath));
    }

    if (!uploaded.length) {
      return NextResponse.json({ error: "All uploads failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, urls: uploaded });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// POST /api/admin/upload — upload image(s)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "products/misc";

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/images", folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const uploaded: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "-");
      const filePath = path.join(uploadDir, safeName);
      await fs.writeFile(filePath, buffer);
      uploaded.push(`/images/${folder}/${safeName}`);
    }

    return NextResponse.json({ success: true, urls: uploaded });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

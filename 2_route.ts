import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "content/products/_sample.json");
const PHOTO_DIR = path.join(process.cwd(), "public/images/products");

type Product = {
  id: string;
  sku: string;
  main_image: string;
  gallery_images: string[];
  [k: string]: any;
};

async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeProducts(products: Product[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

function extFrom(filename: string): string {
  const m = filename.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/);
  return m ? m[0] : ".jpg";
}

function skuFromFilename(filename: string): string | null {
  // Match CLN-XXX-NNNN pattern in filename
  const m = filename.toUpperCase().match(/CLN-[A-Z]+-\d{4}/);
  return m ? m[0] : null;
}

/**
 * POST /api/admin/photos
 * Bulk photo upload. Filenames must start with SKU (e.g. CLN-RLX-0001.jpg).
 * For each file, saves to /public/images/products/{SKU}.ext and updates the
 * matching product's main_image + gallery_images.
 *
 * Returns { matched, unmatched, updated, total }.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    if (!files.length) {
      return NextResponse.json({ error: "Hic fotograf secilmedi" }, { status: 400 });
    }

    await fs.mkdir(PHOTO_DIR, { recursive: true });

    const products = await readProducts();
    const productsBySku = new Map(products.map((p) => [p.sku, p]));

    const matched: { sku: string; filename: string; url: string }[] = [];
    const unmatched: { filename: string; reason: string }[] = [];

    for (const file of files) {
      const sku = skuFromFilename(file.name);
      if (!sku) {
        unmatched.push({ filename: file.name, reason: "Dosya adinda SKU yok (CLN-XXX-NNNN)" });
        continue;
      }
      const product = productsBySku.get(sku);
      if (!product) {
        unmatched.push({ filename: file.name, reason: `SKU ${sku} urun listesinde yok` });
        continue;
      }
      const ext = extFrom(file.name);
      const safeName = `${sku}${ext}`;
      const destPath = path.join(PHOTO_DIR, safeName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(destPath, buffer);
      const publicUrl = `/images/products/${safeName}`;

      // Update product
      product.main_image = publicUrl;
      product.gallery_images = [publicUrl];

      matched.push({ sku, filename: file.name, url: publicUrl });
    }

    await writeProducts(products);

    return NextResponse.json({
      success: true,
      total: files.length,
      matched,
      unmatched,
      updated: matched.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * GET /api/admin/photos
 * Returns all products with photo status (has real image vs. placeholder).
 */
export async function GET() {
  try {
    const products = await readProducts();
    const rows = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      model_name: p.model_name,
      brand: p.brand,
      main_image: p.main_image,
      has_photo: !p.main_image.endsWith("placeholder-watch.svg"),
      expected_filename: `${p.sku}.jpg`,
    }));
    const withPhoto = rows.filter((r) => r.has_photo).length;
    return NextResponse.json({
      products: rows,
      total: rows.length,
      with_photo: withPhoto,
      without_photo: rows.length - withPhoto,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

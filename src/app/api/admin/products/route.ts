import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Product } from "@/types/product";

const DATA_PATH = path.join(process.cwd(), "content/products/_sample.json");

async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf-8");
}

// GET /api/admin/products — list all
export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json({ products, total: products.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/products — create new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = await readProducts();

    // Auto-generate id and slug if missing
    if (!body.id) {
      const prefix = body.brand?.substring(0, 3).toLowerCase() || "prd";
      body.id = `${prefix}-${Date.now()}`;
    }
    if (!body.slug) {
      body.slug = `${body.brand}-${body.collection}-${body.reference || body.id}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (!body.created_at) body.created_at = new Date().toISOString();
    if (!body.sku) body.sku = `CLN-${body.id.substring(0, 8).toUpperCase()}`;

    products.push(body as Product);
    await writeProducts(products);

    return NextResponse.json({ success: true, product: body });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/products — bulk delete
export async function DELETE(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }
    let products = await readProducts();
    products = products.filter((p) => !ids.includes(p.id));
    await writeProducts(products);
    return NextResponse.json({ success: true, remaining: products.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/admin/products — bulk update (for import)
export async function PUT(req: NextRequest) {
  try {
    const { products: newProducts, mode } = await req.json();
    if (!Array.isArray(newProducts)) {
      return NextResponse.json({ error: "products array required" }, { status: 400 });
    }

    if (mode === "replace") {
      // Replace all products
      await writeProducts(newProducts);
      return NextResponse.json({ success: true, total: newProducts.length });
    }

    // Default: merge (add new, update existing by id)
    const existing = await readProducts();
    const existingMap = new Map(existing.map((p) => [p.id, p]));

    for (const p of newProducts) {
      existingMap.set(p.id, p);
    }

    const merged = Array.from(existingMap.values());
    await writeProducts(merged);
    return NextResponse.json({ success: true, total: merged.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

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

// GET /api/admin/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const products = await readProducts();
    const product = products.find((p) => p.id === params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/admin/products/[id] — update single product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const products = await readProducts();
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    products[idx] = { ...products[idx], ...body, id: params.id };
    await writeProducts(products);
    return NextResponse.json({ success: true, product: products[idx] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let products = await readProducts();
    const before = products.length;
    products = products.filter((p) => p.id !== params.id);
    if (products.length === before) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await writeProducts(products);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import type { Product } from "@/types/product";

// GET /api/admin/products — list all
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data ?? [], total: data?.length ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/products — create new product
export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

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

    const { data, error } = await supabase
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/products — bulk delete
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { ids } = await req.json();

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/admin/products — bulk update (for import)
export async function PUT(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { products: newProducts, mode } = await req.json();

    if (!Array.isArray(newProducts)) {
      return NextResponse.json({ error: "products array required" }, { status: 400 });
    }

    if (mode === "replace") {
      // Delete all existing, then insert new
      await supabase.from("products").delete().neq("id", "");
      const { error } = await supabase.from("products").insert(newProducts);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, total: newProducts.length });
    }

    // Default: upsert (add new, update existing by id)
    const { error } = await supabase
      .from("products")
      .upsert(newProducts, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, total: newProducts.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

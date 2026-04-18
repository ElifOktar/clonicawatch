import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/products — public read-only endpoint
// Used by client components (cart, wishlist) to fetch product data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids"); // comma-separated IDs

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // If specific IDs requested, filter
    if (ids) {
      const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
      query = query.in("id", idList);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data ?? [], total: data?.length ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

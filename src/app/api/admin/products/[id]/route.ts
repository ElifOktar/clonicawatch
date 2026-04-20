import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase";

/** Revalidate all public pages that show product data */
function revalidateProductPages() {
  revalidatePath("/", "page");
  revalidatePath("/ladies", "page");
  revalidatePath("/new-arrivals", "page");
  revalidatePath("/on-sale", "page");
  revalidatePath("/brand/[brand]", "page");
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/category/[category]", "page");
}

// Prevent static pre-rendering — this route needs runtime env vars
export const dynamic = "force-dynamic";

// GET /api/admin/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: data });
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
    const supabase = getAdminClient();
    const body = await req.json();

    // Remove id from body to prevent conflicts
    delete body.id;

    const { data, error } = await supabase
      .from("products")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidateProductPages();
    return NextResponse.json({ success: true, product: data });
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
    const supabase = getAdminClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateProductPages();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

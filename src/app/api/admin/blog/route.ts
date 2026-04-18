import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "content/blog/posts.json");

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  author: string;
  readingTime: string;
  content: string;
}

async function readPosts(): Promise<BlogPost[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writePosts(posts: BlogPost[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(posts, null, 2), "utf-8");
}

// GET /api/admin/blog
export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json({ posts, total: posts.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/blog — create new post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const posts = await readPosts();

    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (!body.date) body.date = new Date().toISOString().split("T")[0];
    if (!body.author) body.author = "Clonicawatch Editorial";
    if (!body.cover) body.cover = "/images/placeholder-watch.svg";

    posts.push(body);
    await writePosts(posts);
    return NextResponse.json({ success: true, post: body });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/admin/blog — update post by slug
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, ...updates } = body;
    const posts = await readPosts();
    const idx = posts.findIndex((p) => p.slug === slug);
    if (idx === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    posts[idx] = { ...posts[idx], ...updates };
    await writePosts(posts);
    return NextResponse.json({ success: true, post: posts[idx] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/blog
export async function DELETE(req: NextRequest) {
  try {
    const { slug } = await req.json();
    let posts = await readPosts();
    posts = posts.filter((p) => p.slug !== slug);
    await writePosts(posts);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

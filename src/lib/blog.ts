import posts from "../../content/blog/posts.json";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  author: string;
  readingTime: string;
  content: string;
};

export function getAllPosts(): BlogPost[] {
  return [...(posts as BlogPost[])].sort((a, b) => (a.date < b.date ? 1 : -1));
}
export function getPostBySlug(slug: string): BlogPost | undefined {
  return (posts as BlogPost[]).find((p) => p.slug === slug);
}

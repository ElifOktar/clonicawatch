import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <p className="chip-gold inline-block mb-6">404</p>
      <h1 className="h-serif text-5xl mb-4">Page Not Found</h1>
      <p className="text-ink-muted mb-8">The page you're looking for doesn't exist — or has moved.</p>
      <Link href="/" className="btn-gold">Return Home</Link>
    </div>
  );
}

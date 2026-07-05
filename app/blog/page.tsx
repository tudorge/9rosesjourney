import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BlogSubscribeForm from "./BlogSubscribeForm";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Astrology reflections, timing notes, and writing from Larisa at 9 Roses Journey.",
};

type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string | null;
};

function formatPostDate(value: string | null) {
  if (!value) {
    return "Recently published";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently published";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  const publishedPosts = (posts ?? []) as BlogPostSummary[];

  return (
    <main className="site-main blog-page">
      <section className="page-hero">
        <p className="eyebrow">Blog</p>

        <h1>Astrology notes and reflections from Larisa.</h1>

        <p className="hero-copy">
          Writings on astrology, timing, inner seasons, place, movement, and the
          quiet patterns that shape a life.
        </p>

        <div className="hero-actions">
          <Link href="#subscribe" className="primary-button">
            Subscribe to Larisa&apos;s Notes
          </Link>

          <Link href="/schedule" className="secondary-button">
            Schedule a Reading
          </Link>
        </div>
      </section>

      <section className="content-panel admin-list-panel">
        <div className="admin-list-heading">
          <p className="eyebrow">Latest Writing</p>

          <h2>Recent reflections</h2>

          <p>
            Read Larisa’s latest astrology notes, seasonal reflections, and
            thoughts on the symbolic patterns moving through everyday life.
          </p>
        </div>

        <div className="admin-request-list">
          {error && (
            <p className="form-message error-message">
              The blog could not be loaded right now.
            </p>
          )}

          {!error && publishedPosts.length === 0 && (
            <article className="status-card">
              <p className="status-label">Coming Soon</p>

              <h2>Blog posts will appear here.</h2>

              <p>
                Larisa’s writing will be shared here once the first posts are
                published.
              </p>
            </article>
          )}

          {publishedPosts.map((post) => (
            <article className="status-card admin-request-card" key={post.id}>
              <div>
                <p className="status-label">
                  {formatPostDate(post.published_at)}
                </p>

                <h2>{post.title}</h2>
              </div>

              {post.excerpt && <p>{post.excerpt}</p>}

              <Link href={`/blog/${post.slug}`} className="text-link">
                Read reflection
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="subscribe" className="content-panel">
        <div>
          <p className="eyebrow">Subscribe</p>

          <h2>Receive Larisa’s astrology notes by email.</h2>

          <p>
            Subscribe for new reflections, reading updates, and occasional notes
            from 9 Roses Journey.
          </p>
        </div>

        <BlogSubscribeForm />
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<Pick<BlogPost, "title" | "excerpt">>();

  if (!post) {
    return {
      title: "Blog Post",
    };
  }

  return {
    title: post.title,
    description:
      post.excerpt ||
      "Astrology reflection from Larisa at 9 Roses Journey.",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, content, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<BlogPost>();

  if (error) {
    console.error("Blog post lookup error:", error);
  }

  if (!post) {
    notFound();
  }

  const paragraphs = renderContent(post.content);

  return (
    <main className="site-main blog-post-page">
      <section className="page-hero">
        <p className="eyebrow">{formatPostDate(post.published_at)}</p>

        <h1>{post.title}</h1>

        {post.excerpt && <p className="hero-copy">{post.excerpt}</p>}

        <div className="hero-actions">
          <Link href="/blog" className="secondary-button">
            Back to Blog
          </Link>

          <Link href="/schedule" className="primary-button">
            Schedule a Reading
          </Link>
        </div>
      </section>

      <article className="content-panel legal-content">
        <div>
          {paragraphs.length === 0 ? (
            <p>This reflection is being prepared.</p>
          ) : (
            paragraphs.map((paragraph, index) => (
              <p key={`${post.slug}-${index}`}>{paragraph}</p>
            ))
          )}
        </div>
      </article>
    </main>
  );
}
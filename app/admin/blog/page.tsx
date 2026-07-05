import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog Admin",
  description: "Create and manage blog posts for 9 Roses Journey.",
};

type AdminProfile = {
  role: string | null;
};

type BlogPostAdminSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function formatStatus(status: string) {
  switch (status) {
    case "draft":
      return "Draft";
    case "published":
      return "Published";
    default:
      return status.replaceAll("_", " ");
  }
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function getAdminContext() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/blog");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<AdminProfile>();

  if (profileError) {
    console.error("Admin profile lookup error:", profileError);
  }

  return {
    supabase,
    isAdmin: profile?.role === "admin",
  };
}

export default async function AdminBlogPage() {
  const { supabase, isAdmin } = await getAdminContext();

  if (!isAdmin) {
    return (
      <main className="site-main">
        <section className="page-hero">
          <p className="eyebrow">Admin</p>

          <h1>You do not have access to this page.</h1>

          <p className="hero-copy">
            This area is only available to Larisa’s admin account.
          </p>

          <div className="hero-actions">
            <Link href="/" className="secondary-button">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, status, published_at, created_at, updated_at")
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as BlogPostAdminSummary[];

  return (
    <main className="site-main">
      <section className="page-hero">
        <p className="eyebrow">Admin</p>

        <h1>Blog posts</h1>

        <p className="hero-copy">
          Create, edit, publish, and manage Larisa’s astrology reflections and
          updates.
        </p>

        <div className="hero-actions">
          <Link href="/admin/blog/new" className="primary-button">
            New Blog Post
          </Link>

          <Link href="/admin/reading-requests" className="secondary-button">
            Reading Requests
          </Link>
        </div>
      </section>

      <section className="content-panel admin-list-panel">
        <div className="admin-list-heading">
          <p className="eyebrow">Blog Admin</p>

          <h2>All posts</h2>

          <p>
            Drafts stay hidden from the public blog. Published posts appear on
            the public Blog page.
          </p>
        </div>

        <div className="admin-request-list">
          {error && (
            <p className="form-message error-message">
              Could not load blog posts.
            </p>
          )}

          {!error && posts.length === 0 && (
            <article className="status-card">
              <p className="status-label">No Posts Yet</p>

              <h2>Create Larisa’s first blog post.</h2>

              <p>
                Blog posts can be saved as drafts first, then published when
                they are ready.
              </p>

              <Link href="/admin/blog/new" className="text-link">
                Create first post
              </Link>
            </article>
          )}

          {posts.map((post) => (
            <article className="status-card admin-request-card" key={post.id}>
              <div className="admin-request-card-top">
                <div>
                  <p className="status-label">
                    Updated {formatDateTime(post.updated_at)}
                  </p>

                  <h2>{post.title}</h2>
                </div>

                <span className="status-pill">
                  {formatStatus(post.status)}
                </span>
              </div>

              <dl className="request-summary-list admin-request-meta">
                <div>
                  <dt>Slug</dt>
                  <dd>{post.slug}</dd>
                </div>

                <div>
                  <dt>Published</dt>
                  <dd>{formatDateTime(post.published_at)}</dd>
                </div>

                {post.excerpt && (
                  <div className="admin-request-wide">
                    <dt>Excerpt</dt>
                    <dd>{post.excerpt}</dd>
                  </div>
                )}
              </dl>

              <div className="hero-actions status-actions">
                <Link href={`/admin/blog/${post.id}`} className="primary-button">
                  Edit Post
                </Link>

                {post.status === "published" && (
                  <Link href={`/blog/${post.slug}`} className="secondary-button">
                    View Public Post
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
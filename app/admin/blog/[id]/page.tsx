import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  description: "Edit and publish a blog post for 9 Roses Journey.",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type AdminProfile = {
  role: string | null;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

async function getAdminContext(nextPath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${nextPath}`);
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

async function requireAdminForAction(nextPath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${nextPath}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<AdminProfile>();

  if (profileError) {
    console.error("Admin profile lookup error:", profileError);
  }

  if (profile?.role !== "admin") {
    throw new Error("Only admins can update blog posts.");
  }

  return {
    supabase,
  };
}

async function updateBlogPost(formData: FormData) {
  "use server";

  const postId = cleanText(formData.get("postId"));
  const title = cleanText(formData.get("title"));
  const suppliedSlug = cleanText(formData.get("slug"));
  const excerpt = cleanText(formData.get("excerpt"));
  const content = cleanText(formData.get("content"));
  const status =
    cleanText(formData.get("status")) === "published" ? "published" : "draft";

  const editPath = `/admin/blog/${postId}`;

  if (!postId) {
    redirect("/admin/blog?error=missing_post");
  }

  if (!title) {
    redirect(`${editPath}?error=missing_title`);
  }

  const slug = suppliedSlug ? slugify(suppliedSlug) : slugify(title);

  if (!slug) {
    redirect(`${editPath}?error=missing_slug`);
  }

  const { supabase } = await requireAdminForAction(editPath);

  const { data: existingPost, error: lookupError } = await supabase
    .from("blog_posts")
    .select("id, slug")
    .eq("id", postId)
    .maybeSingle<{ id: string; slug: string }>();

  if (lookupError || !existingPost) {
    console.error("Blog post lookup error:", lookupError);
    redirect("/admin/blog?error=post_not_found");
  }

  const oldSlug = existingPost.slug;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt,
      content,
      status,
    })
    .eq("id", postId);

  if (error) {
    console.error("Update blog post error:", error);

    if (error.code === "23505") {
      redirect(`${editPath}?error=slug_taken`);
    }

    redirect(`${editPath}?error=update_failed`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath(editPath);
  revalidatePath(`/blog/${oldSlug}`);
  revalidatePath(`/blog/${slug}`);

  redirect(`${editPath}?updated=saved`);
}

export default async function EditBlogPostPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const updated = getSearchParam(resolvedSearchParams, "updated");
  const error = getSearchParam(resolvedSearchParams, "error");

  const { supabase, isAdmin } = await getAdminContext(`/admin/blog/${id}`);

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

  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, status, published_at, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle<BlogPost>();

  if (postError) {
    console.error("Blog post detail lookup error:", postError);
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="site-main">
      <section className="page-hero admin-review-hero">
        <p className="eyebrow">Blog Admin</p>

        <h1>Edit blog post</h1>

        <p className="hero-copy">
          Update the post content, save it as a draft, or publish it to the
          public Blog page.
        </p>

        <div className="hero-actions">
          <Link href="/admin/blog" className="secondary-button">
            Back to Blog Admin
          </Link>

          {post.status === "published" && (
            <Link href={`/blog/${post.slug}`} className="primary-button">
              View Public Post
            </Link>
          )}
        </div>
      </section>

      <section className="content-panel admin-detail-panel">
        <div className="admin-detail-heading">
          <p className="eyebrow">Post Details</p>

          <h2>{post.title}</h2>
        </div>

        <dl className="request-summary-list admin-summary-grid">
          <div>
            <dt>Status</dt>
            <dd>
              <span className="status-pill">{formatStatus(post.status)}</span>
            </dd>
          </div>

          <div>
            <dt>Published</dt>
            <dd>{formatDateTime(post.published_at)}</dd>
          </div>

          <div>
            <dt>Updated</dt>
            <dd>{formatDateTime(post.updated_at)}</dd>
          </div>
        </dl>

        <form className="request-form" action={updateBlogPost}>
          <input type="hidden" name="postId" value={post.id} />

          {updated === "saved" && (
            <p className="form-message success-message">
              Blog post saved successfully.
            </p>
          )}

          {error === "missing_title" && (
            <p className="form-message error-message">
              Please enter a title before saving.
            </p>
          )}

          {error === "missing_slug" && (
            <p className="form-message error-message">
              Please enter a valid slug before saving.
            </p>
          )}

          {error === "slug_taken" && (
            <p className="form-message error-message">
              That slug is already being used by another blog post.
            </p>
          )}

          {error === "update_failed" && (
            <p className="form-message error-message">
              The blog post could not be saved. Please try again.
            </p>
          )}

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={post.title}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={post.slug}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post.excerpt}
              placeholder="A short summary shown on the Blog page."
            />
          </div>

          <div className="form-field">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={16}
              defaultValue={post.content}
              placeholder="Write the blog post here. Separate paragraphs with a blank line."
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={post.status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="admin-action-row">
            <button className="primary-button" type="submit">
              Save Changes
            </button>

            <Link href="/admin/blog" className="secondary-button">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
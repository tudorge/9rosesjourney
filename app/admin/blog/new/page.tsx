import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New Blog Post",
  description: "Create a new blog post for 9 Roses Journey.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type AdminProfile = {
  role: string | null;
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
    user,
    isAdmin: profile?.role === "admin",
  };
}

async function requireAdminForAction() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/blog/new");
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
    throw new Error("Only admins can create blog posts.");
  }

  return {
    supabase,
    user,
  };
}

async function createBlogPost(formData: FormData) {
  "use server";

  const title = cleanText(formData.get("title"));
  const suppliedSlug = cleanText(formData.get("slug"));
  const excerpt = cleanText(formData.get("excerpt"));
  const content = cleanText(formData.get("content"));
  const status = cleanText(formData.get("status")) === "published" ? "published" : "draft";

  if (!title) {
    redirect("/admin/blog/new?error=missing_title");
  }

  const slug = suppliedSlug ? slugify(suppliedSlug) : slugify(title);

  if (!slug) {
    redirect("/admin/blog/new?error=missing_slug");
  }

  const { supabase, user } = await requireAdminForAction();
  const now = new Date().toISOString();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt,
      content,
      status,
      author_id: user.id,
      published_at: status === "published" ? now : null,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !post) {
    console.error("Create blog post error:", error);

    if (error?.code === "23505") {
      redirect("/admin/blog/new?error=slug_taken");
    }

    redirect("/admin/blog/new?error=create_failed");
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");

  redirect("/admin/blog?updated=created");
}

export default async function NewBlogPostPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const error = getSearchParam(resolvedSearchParams, "error");

  const { isAdmin } = await getAdminContext("/admin/blog/new");

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

  return (
    <main className="site-main">
      <section className="page-hero admin-review-hero">
        <p className="eyebrow">Blog Admin</p>

        <h1>New blog post</h1>

        <p className="hero-copy">
          Create a draft first, or publish the post when it is ready to appear
          on the public Blog page.
        </p>

        <div className="hero-actions">
          <Link href="/admin/blog" className="secondary-button">
            Back to Blog Admin
          </Link>
        </div>
      </section>

      <section className="content-panel admin-detail-panel">
        <div className="admin-detail-heading">
          <p className="eyebrow">Post Details</p>

          <h2>Write Larisa’s reflection.</h2>
        </div>

        <form className="request-form" action={createBlogPost}>
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

          {error === "create_failed" && (
            <p className="form-message error-message">
              The blog post could not be created. Please try again.
            </p>
          )}

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="The title of the reflection"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                placeholder="leave blank to generate from title"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              placeholder="A short summary shown on the Blog page."
            />
          </div>

          <div className="form-field">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={14}
              placeholder="Write the blog post here. Separate paragraphs with a blank line."
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="admin-action-row">
            <button className="primary-button" type="submit">
              Save Blog Post
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
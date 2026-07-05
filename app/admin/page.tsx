import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage 9 Roses Journey reading requests and blog posts.",
};

type AdminProfile = {
  role: string | null;
};

async function getAdminContext() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
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
    isAdmin: profile?.role === "admin",
  };
}

export default async function AdminPage() {
  const { isAdmin } = await getAdminContext();

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
      <section className="page-hero">
        <p className="eyebrow">Admin</p>

        <h1>Manage 9 Roses Journey.</h1>

        <p className="hero-copy">
          Review reading requests, manage scheduling approvals, and publish
          Larisa’s blog posts from one place.
        </p>
      </section>

      <section className="intro-grid" aria-label="Admin sections">
        <Link
          href="/admin/reading-requests"
          className="intro-card"
          aria-label="Open reading requests"
        >
          <p className="card-kicker">Clients</p>

          <h2>Reading Requests</h2>

          <p>
            Review submitted reading requests, approve scheduling access, ask
            for more information, or close requests.
          </p>
        </Link>

        <Link
          href="/admin/blog"
          className="intro-card"
          aria-label="Open blog admin"
        >
          <p className="card-kicker">Writing</p>

          <h2>Blog Posts</h2>

          <p>
            Create drafts, edit reflections, and publish posts to the public
            Blog page.
          </p>
        </Link>

        <Link
          href="/blog"
          className="intro-card"
          aria-label="View public blog"
        >
          <p className="card-kicker">Public Site</p>

          <h2>View the Blog</h2>

          <p>
            Open the public Blog page to review what visitors can currently
            read.
          </p>
        </Link>
      </section>
    </main>
  );
}
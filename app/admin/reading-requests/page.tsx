import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reading Requests",
  description: "Review submitted astrology reading requests.",
};

type AdminReadingRequest = {
  id: string;
  name: string;
  email: string;
  reading_type: string;
  status: string;
  created_at: string;
  preferred_times: string | null;
  question_or_focus: string;
};

type AdminProfile = {
  role: string | null;
};

const statusPriority: Record<string, number> = {
  pending_review: 0,
  needs_more_info: 1,
  approved_for_scheduling: 2,
  reschedule_requested: 3,
  scheduled: 4,
  scheduling_paused: 5,
  declined: 8,
  completed: 9,
  canceled_by_client: 10,
  canceled_by_larisa: 10,
};

function formatStatus(status: string) {
  switch (status) {
    case "pending_review":
      return "Pending review";
    case "needs_more_info":
      return "Needs more info";
    case "approved_for_scheduling":
      return "Approved for scheduling";
    case "scheduled":
      return "Scheduled";
    case "reschedule_requested":
      return "Reschedule requested";
    case "canceled_by_client":
      return "Canceled by client";
    case "canceled_by_larisa":
      return "Canceled by Larisa";
    case "scheduling_paused":
      return "Scheduling paused";
    case "declined":
      return "Declined";
    case "completed":
      return "Completed";
    default:
      return status.replaceAll("_", " ");
  }
}

function formatReadingType(readingType: string) {
  switch (readingType) {
    case "personal_astrology_guidance":
      return "Personal Astrology Guidance";
    case "birth_chart_reading":
      return "Birth Chart Reading";
    case "astrocartography_reading":
      return "Astrocartography / Relocation Astrology Reading";
    case "not_sure":
      return "Not sure yet";
    default:
      return readingType.replaceAll("_", " ");
  }
}

function formatDateTime(dateValue: string) {
  const date = new Date(dateValue);

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
    redirect("/login?next=/admin/reading-requests");
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

export default async function AdminReadingRequestsPage() {
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
    .from("reading_requests")
    .select(
      "id, name, email, reading_type, status, created_at, preferred_times, question_or_focus"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const requests = ((data ?? []) as AdminReadingRequest[]).sort((a, b) => {
    const priorityA = statusPriority[a.status] ?? 20;
    const priorityB = statusPriority[b.status] ?? 20;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  return (
    <main className="site-main">
      <section className="page-hero">
        <p className="eyebrow">Admin</p>

        <h1>Reading requests</h1>

        <p className="hero-copy">
          Review submitted requests, open the client’s details, and decide the
          next step.
        </p>
      </section>

      <section className="content-panel admin-list-panel">
        <div className="admin-list-heading">
          <p className="eyebrow">Request Queue</p>

          <h2>Submitted reading requests</h2>

          <p>
            New and active requests are shown first. Completed, declined, and
            canceled requests remain visible for reference.
          </p>
        </div>

        <div className="admin-request-list">
          {error && (
            <p className="form-message error-message">
              Could not load reading requests.
            </p>
          )}

          {!error && requests.length === 0 && (
            <p className="form-note">
              No reading requests have been submitted yet.
            </p>
          )}

          {requests.map((request) => (
            <article className="status-card admin-request-card" key={request.id}>
              <div className="admin-request-card-top">
                <div>
                  <p className="status-label">
                    {formatReadingType(request.reading_type)}
                  </p>

                  <h2>{request.name}</h2>
                </div>

                <span className="status-pill">
                  {formatStatus(request.status)}
                </span>
              </div>

              <dl className="request-summary-list admin-request-meta">
                <div>
                  <dt>Email</dt>
                  <dd>{request.email}</dd>
                </div>

                <div>
                  <dt>Submitted</dt>
                  <dd>{formatDateTime(request.created_at)}</dd>
                </div>

                <div className="admin-request-wide">
                  <dt>Focus</dt>
                  <dd>{request.question_or_focus}</dd>
                </div>

                {request.preferred_times && (
                  <div className="admin-request-wide">
                    <dt>Preferred times</dt>
                    <dd>{request.preferred_times}</dd>
                  </div>
                )}
              </dl>

              <Link
                href={`/admin/reading-requests/${request.id}`}
                className="text-link"
              >
                Review request
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
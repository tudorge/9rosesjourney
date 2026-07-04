import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Review Reading Request",
  description: "Review and update a submitted astrology reading request.",
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

type ReadingRequest = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  phone: string | null;
  reading_type: string;
  birth_date: string | null;
  birth_time: string | null;
  birth_time_unknown: boolean;
  birth_place: string | null;
  current_location: string | null;
  timezone: string | null;
  preferred_times: string | null;
  question_or_focus: string;
  additional_notes: string | null;
  status: string;
  admin_notes: string | null;
  approved_at: string | null;
  approved_by: string | null;
  scheduled_at: string | null;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
  reschedule_cutoff_hours: number;
  max_self_reschedules: number;
  self_reschedule_count: number;
  canceled_at: string | null;
  declined_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

type SchedulingAccess = {
  id: string;
  status: string;
  locked_reason: string | null;
  approved_at: string;
  booking_count: number;
  cancel_count: number;
  reschedule_count: number;
  link_generation_count: number;
};

type ApprovalEmailRequest = {
  id: string;
  email: string;
  name: string;
  reading_type: string;
};

function cleanOptionalText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();
  return cleaned || null;
}

function getRequiredFormText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required form value: ${key}`);
  }

  return value.trim();
}

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

function escapeHtml(value: string | null | undefined) {
  return (value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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
    case "active":
      return "Active";
    case "locked":
      return "Locked";
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

function formatPlainDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

function displayText(value: string | null | undefined) {
  return value?.trim() ? value : "—";
}

function canApproveRequest(status: string) {
  return ![
    "approved_for_scheduling",
    "scheduled",
    "completed",
    "canceled_by_client",
    "canceled_by_larisa",
  ].includes(status);
}

async function sendApprovalEmail(request: ApprovalEmailRequest) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("Skipping approval email: missing BREVO_API_KEY.");
    return;
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL || "larisa@9rosesjourney.com";
  const senderName = process.env.BREVO_SENDER_NAME || "9 Roses Journey";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://9rosesjourney.com";
  const scheduleUrl = `${siteUrl}/schedule`;

  const readingTypeLabel = formatReadingType(request.reading_type);

  const htmlContent = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #271720; line-height: 1.6;">
      <h1 style="color: #702840; margin-bottom: 12px;">Your reading request was approved</h1>

      <p>Hello ${escapeHtml(request.name)},</p>

      <p>
        Larisa has reviewed your request for <strong>${escapeHtml(
          readingTypeLabel
        )}</strong>, and scheduling is now open.
      </p>

      <p>
        You can choose your appointment time here:
      </p>

      <p>
        <a href="${escapeHtml(scheduleUrl)}" style="color: #702840; font-weight: bold;">
          Schedule your reading
        </a>
      </p>

      <p>
        Please sign in with the same email address you used when submitting your request:
        <strong>${escapeHtml(request.email)}</strong>.
      </p>

      <p>
        With warmth,<br />
        9 Roses Journey
      </p>
    </div>
  `;

  const textContent = `
Hello ${request.name},

Larisa has reviewed your request for ${readingTypeLabel}, and scheduling is now open.

Choose your appointment time here:
${scheduleUrl}

Please sign in with the same email address you used when submitting your request:
${request.email}

With warmth,
9 Roses Journey
  `.trim();

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: request.email,
          name: request.name,
        },
      ],
      replyTo: {
        email: senderEmail,
        name: senderName,
      },
      subject: "Your 9 Roses Journey reading request was approved",
      htmlContent,
      textContent,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();

    console.error("Approval email error:", {
      status: response.status,
      response: responseText,
    });
  }
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
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

async function requireAdminForAction() {
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

  if (profile?.role !== "admin") {
    throw new Error("Only admins can update reading requests.");
  }

  return {
    supabase,
    user,
  };
}

async function updateRequestDecision(formData: FormData) {
  "use server";

  const requestId = getRequiredFormText(formData, "requestId");
  const decision = getRequiredFormText(formData, "decision");
  const adminNotes = cleanOptionalText(formData.get("adminNotes"));
  const detailPath = `/admin/reading-requests/${requestId}`;
  const now = new Date().toISOString();

  const { supabase, user } = await requireAdminForAction();

  const { data: request, error: requestLookupError } = await supabase
    .from("reading_requests")
    .select("id, user_id, email, name, reading_type, status")
    .eq("id", requestId)
    .maybeSingle<{
      id: string;
      user_id: string;
      email: string;
      name: string;
      reading_type: string;
      status: string;
    }>();

  if (requestLookupError || !request) {
    console.error("Request lookup error:", requestLookupError);
    redirect("/admin/reading-requests?error=request_not_found");
  }

  if (decision === "approve") {
    if (!canApproveRequest(request.status)) {
      redirect(`${detailPath}?updated=already_approved`);
    }

    const { error: updateError } = await supabase
      .from("reading_requests")
      .update({
        status: "approved_for_scheduling",
        admin_notes: adminNotes,
        approved_at: now,
        approved_by: user.id,
        declined_at: null,
        canceled_at: null,
        updated_at: now,
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Approve request update error:", updateError);
      redirect(`${detailPath}?error=approve_failed`);
    }

    const { data: existingAccess, error: accessLookupError } = await supabase
      .from("scheduling_access")
      .select("id")
      .eq("reading_request_id", requestId)
      .maybeSingle<{ id: string }>();

    if (accessLookupError) {
      console.error("Scheduling access lookup error:", accessLookupError);
      redirect(`${detailPath}?error=scheduling_access_failed`);
    }

    let schedulingAccessId = existingAccess?.id ?? null;

    if (existingAccess) {
      const { error: accessUpdateError } = await supabase
        .from("scheduling_access")
        .update({
          status: "active",
          locked_reason: null,
          approved_at: now,
          updated_at: now,
        })
        .eq("id", existingAccess.id);

      if (accessUpdateError) {
        console.error("Scheduling access update error:", accessUpdateError);
        redirect(`${detailPath}?error=scheduling_access_failed`);
      }
    } else {
      const { data: newAccess, error: accessInsertError } = await supabase
        .from("scheduling_access")
        .insert({
          reading_request_id: requestId,
          user_id: request.user_id,
          status: "active",
          approved_at: now,
        })
        .select("id")
        .single<{ id: string }>();

      if (accessInsertError || !newAccess) {
        console.error("Scheduling access insert error:", accessInsertError);
        redirect(`${detailPath}?error=scheduling_access_failed`);
      }

      schedulingAccessId = newAccess.id;
    }

    const { error: eventError } = await supabase
      .from("scheduling_access_events")
      .insert({
        scheduling_access_id: schedulingAccessId,
        reading_request_id: requestId,
        user_id: request.user_id,
        event_type: "request_approved_for_scheduling",
        event_details: {
          admin_user_id: user.id,
          previous_status: request.status,
        },
      });

    if (eventError) {
      console.error("Scheduling access event insert error:", eventError);
    }

    await sendApprovalEmail({
      id: request.id,
      email: request.email,
      name: request.name,
      reading_type: request.reading_type,
    });

    revalidatePath("/admin/reading-requests");
    revalidatePath(detailPath);
    revalidatePath("/schedule");

    redirect(`${detailPath}?updated=approved`);
  }

  if (decision === "needs_more_info") {
    const { error: updateError } = await supabase
      .from("reading_requests")
      .update({
        status: "needs_more_info",
        admin_notes: adminNotes,
        updated_at: now,
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Needs more info update error:", updateError);
      redirect(`${detailPath}?error=needs_more_info_failed`);
    }

    const { error: eventError } = await supabase
      .from("scheduling_access_events")
      .insert({
        reading_request_id: requestId,
        user_id: request.user_id,
        event_type: "request_marked_needs_more_info",
        event_details: {
          admin_user_id: user.id,
          previous_status: request.status,
        },
      });

    if (eventError) {
      console.error("Scheduling access event insert error:", eventError);
    }

    revalidatePath("/admin/reading-requests");
    revalidatePath(detailPath);
    revalidatePath("/schedule");

    redirect(`${detailPath}?updated=needs_more_info`);
  }

  if (decision === "decline") {
    const { error: updateError } = await supabase
      .from("reading_requests")
      .update({
        status: "declined",
        admin_notes: adminNotes,
        declined_at: now,
        updated_at: now,
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Decline request update error:", updateError);
      redirect(`${detailPath}?error=decline_failed`);
    }

    const { data: existingAccess, error: accessLookupError } = await supabase
      .from("scheduling_access")
      .select("id")
      .eq("reading_request_id", requestId)
      .maybeSingle<{ id: string }>();

    if (accessLookupError) {
      console.error("Scheduling access lookup error:", accessLookupError);
    }

    if (existingAccess) {
      const { error: accessUpdateError } = await supabase
        .from("scheduling_access")
        .update({
          status: "locked",
          locked_reason: "request_declined",
          updated_at: now,
        })
        .eq("id", existingAccess.id);

      if (accessUpdateError) {
        console.error("Scheduling access lock error:", accessUpdateError);
      }
    }

    const { error: eventError } = await supabase
      .from("scheduling_access_events")
      .insert({
        scheduling_access_id: existingAccess?.id ?? null,
        reading_request_id: requestId,
        user_id: request.user_id,
        event_type: "request_declined",
        event_details: {
          admin_user_id: user.id,
          previous_status: request.status,
        },
      });

    if (eventError) {
      console.error("Scheduling access event insert error:", eventError);
    }

    revalidatePath("/admin/reading-requests");
    revalidatePath(detailPath);
    revalidatePath("/schedule");

    redirect(`${detailPath}?updated=declined`);
  }

  redirect(`${detailPath}?error=invalid_decision`);
}

export default async function AdminReadingRequestDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const updated = getSearchParam(resolvedSearchParams, "updated");
  const error = getSearchParam(resolvedSearchParams, "error");

  const { supabase, isAdmin } = await getAdminContext(
    `/admin/reading-requests/${id}`
  );

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

  const { data: request, error: requestError } = await supabase
    .from("reading_requests")
    .select(
      `
      id,
      user_id,
      email,
      name,
      phone,
      reading_type,
      birth_date,
      birth_time,
      birth_time_unknown,
      birth_place,
      current_location,
      timezone,
      preferred_times,
      question_or_focus,
      additional_notes,
      status,
      admin_notes,
      approved_at,
      approved_by,
      scheduled_at,
      scheduled_start_time,
      scheduled_end_time,
      reschedule_cutoff_hours,
      max_self_reschedules,
      self_reschedule_count,
      canceled_at,
      declined_at,
      completed_at,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle<ReadingRequest>();

  if (requestError) {
    console.error("Reading request detail lookup error:", requestError);
  }

  if (!request) {
    notFound();
  }

  const approveDisabled = !canApproveRequest(request.status);

  const { data: schedulingAccess, error: schedulingAccessError } =
    await supabase
      .from("scheduling_access")
      .select(
        `
        id,
        status,
        locked_reason,
        approved_at,
        booking_count,
        cancel_count,
        reschedule_count,
        link_generation_count
      `
      )
      .eq("reading_request_id", id)
      .maybeSingle<SchedulingAccess>();

  if (schedulingAccessError) {
    console.error("Scheduling access detail lookup error:", schedulingAccessError);
  }

  return (
    <main className="site-main">
      <section className="page-hero admin-review-hero">
        <p className="eyebrow">Review Request</p>

        <h1>{request.name}</h1>

        <p className="hero-copy">
          Review the client’s details and choose the next step for this reading
          request.
        </p>

        <div className="hero-actions">
          <Link href="/admin/reading-requests" className="secondary-button">
            Back to Requests
          </Link>
        </div>
      </section>

      <div className="admin-review-layout">
        <section className="content-panel admin-detail-panel">
          <div className="admin-detail-heading">
            <p className="eyebrow">Request Summary</p>

            <h2>{formatReadingType(request.reading_type)}</h2>
          </div>

          <dl className="request-summary-list admin-summary-grid">
            <DetailItem label="Status">
              <span className="status-pill">{formatStatus(request.status)}</span>
            </DetailItem>

            <DetailItem label="Submitted">
              {formatDateTime(request.created_at)}
            </DetailItem>

            <DetailItem label="Updated">
              {formatDateTime(request.updated_at)}
            </DetailItem>

            <DetailItem label="Email">{request.email}</DetailItem>

            <DetailItem label="Phone">{displayText(request.phone)}</DetailItem>

            <DetailItem label="Scheduling access">
              {schedulingAccess ? (
                <span className="status-pill">
                  {formatStatus(schedulingAccess.status)}
                </span>
              ) : (
                "Not created yet"
              )}
            </DetailItem>
          </dl>

          <div className="admin-detail-grid">
            <div className="status-card admin-detail-card">
              <p className="status-label">Birth Details</p>

              <dl className="request-summary-list">
                <DetailItem label="Birth date">
                  {formatPlainDate(request.birth_date)}
                </DetailItem>

                <DetailItem label="Birth time">
                  {request.birth_time_unknown
                    ? "Unknown"
                    : displayText(request.birth_time)}
                </DetailItem>

                <DetailItem label="Birth place">
                  {displayText(request.birth_place)}
                </DetailItem>

                <DetailItem label="Current location">
                  {displayText(request.current_location)}
                </DetailItem>

                <DetailItem label="Timezone">
                  {displayText(request.timezone)}
                </DetailItem>
              </dl>
            </div>

            <div className="status-card admin-detail-card">
              <p className="status-label">Client Notes</p>

              <dl className="request-summary-list">
                <DetailItem label="Preferred days or times">
                  {displayText(request.preferred_times)}
                </DetailItem>

                <DetailItem label="Main question or focus">
                  {request.question_or_focus}
                </DetailItem>

                <DetailItem label="Additional notes">
                  {displayText(request.additional_notes)}
                </DetailItem>
              </dl>
            </div>
          </div>

          {schedulingAccess && (
            <div className="admin-access-note">
              <p>
                Scheduling access is {formatStatus(schedulingAccess.status)}.
                Bookings: {schedulingAccess.booking_count}. Cancellations:{" "}
                {schedulingAccess.cancel_count}. Reschedules:{" "}
                {schedulingAccess.reschedule_count}. Link generations:{" "}
                {schedulingAccess.link_generation_count}.
              </p>

              {schedulingAccess.locked_reason && (
                <p>Locked reason: {schedulingAccess.locked_reason}</p>
              )}
            </div>
          )}
        </section>

        <section className="content-panel admin-decision-panel">
          <div>
            <p className="eyebrow">Admin Decision</p>

            <h2>Choose the next step.</h2>

            <p>
              Add a private note if useful, then approve the request, ask for
              more information, or close it.
            </p>
          </div>

          <form
            className="request-form admin-decision-form"
            action={updateRequestDecision}
          >
            <input type="hidden" name="requestId" value={request.id} />

            {updated === "approved" && (
              <p className="form-message success-message">
                Request approved. Scheduling access is now active for this
                client, and the client has been notified by email.
              </p>
            )}

            {updated === "already_approved" && (
              <p className="form-message success-message">
                This request is already approved for scheduling.
              </p>
            )}

            {updated === "needs_more_info" && (
              <p className="form-message success-message">
                Request marked as needing more information.
              </p>
            )}

            {updated === "declined" && (
              <p className="form-message success-message">
                Request declined and closed.
              </p>
            )}

            {error && (
              <p className="form-message error-message">
                The update could not be completed. Please try again.
              </p>
            )}

            <div className="form-field">
              <label htmlFor="adminNotes">Admin notes</label>
              <textarea
                id="adminNotes"
                name="adminNotes"
                rows={5}
                defaultValue={request.admin_notes ?? ""}
                placeholder="Optional private notes for this request."
              />
            </div>

            <div className="admin-action-row">
              <button
                className="primary-button"
                type="submit"
                name="decision"
                value="approve"
                disabled={approveDisabled}
              >
                {approveDisabled
                  ? "Approved for Scheduling"
                  : "Approve for Scheduling"}
              </button>

              <button
                className="secondary-button"
                type="submit"
                name="decision"
                value="needs_more_info"
              >
                Needs More Info
              </button>

              <button
                className="secondary-button danger-button"
                type="submit"
                name="decision"
                value="decline"
              >
                Decline Request
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
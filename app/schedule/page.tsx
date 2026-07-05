import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ReadingRequestForm from "./ReadingRequestForm";
import SchedulingPicker from "./SchedulingPicker";

export const metadata: Metadata = {
  title: "Schedule a Reading",
  description:
    "Sign in and submit a private astrology reading request for Larisa to review.",
};

type ReadingRequest = {
  id: string;
  status: string;
  reading_type: string;
  created_at: string;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
};

function formatStatus(status: string) {
  switch (status) {
    case "pending_review":
      return "Received";
    case "needs_more_info":
      return "More information needed";
    case "approved_for_scheduling":
      return "Ready to schedule";
    case "scheduled":
      return "Scheduled";
    case "reschedule_requested":
      return "Reschedule requested";
    case "canceled_by_client":
      return "Canceled";
    case "canceled_by_larisa":
      return "Canceled";
    case "scheduling_paused":
      return "Scheduling paused";
    case "declined":
      return "Not accepted";
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

function formatSubmittedDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatScheduledDateTime(startValue: string | null, endValue: string | null) {
  if (!startValue || !endValue) {
    return "Your appointment details will be sent by email.";
  }

  const start = new Date(startValue);
  const end = new Date(endValue);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Your appointment details will be sent by email.";
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Bucharest",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Bucharest",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateFormatter.format(start)}, ${timeFormatter.format(
    start
  )} – ${timeFormatter.format(end)} Europe/Bucharest.`;
}

function getStatusHero(request: ReadingRequest) {
  switch (request.status) {
    case "pending_review":
      return {
        eyebrow: "Request Received",
        title: "Your reading request has been received.",
        copy: "You do not need to do anything else right now.",
      };

    case "needs_more_info":
      return {
        eyebrow: "More Information Needed",
        title: "Larisa needs a little more information.",
        copy: "Please watch your inbox for a message from Larisa.",
      };

    case "approved_for_scheduling":
      return {
        eyebrow: "Ready to Schedule",
        title: "Your reading request has been approved.",
        copy: "Choose one of Larisa’s available appointment times below.",
      };

    case "scheduled":
      return {
        eyebrow: "Reading Scheduled",
        title: "Your reading is scheduled.",
        copy: "Your calendar invitation includes the appointment details and Google Meet link.",
      };

    case "reschedule_requested":
      return {
        eyebrow: "Reschedule Requested",
        title: "Your reschedule request is on file.",
        copy: "Please watch your inbox for the next update.",
      };

    case "scheduling_paused":
      return {
        eyebrow: "Scheduling Paused",
        title: "Scheduling is temporarily paused.",
        copy: "Please watch your inbox for an update from Larisa.",
      };

    case "declined":
      return {
        eyebrow: "Request Closed",
        title: "This request was not accepted for scheduling.",
        copy: "If you believe this needs another look, you can contact Larisa directly.",
      };

    case "completed":
      return {
        eyebrow: "Reading Completed",
        title: "Your reading has been completed.",
        copy: "Thank you for trusting Larisa with your reading.",
      };

    default:
      return {
        eyebrow: "Request Status",
        title: "Your reading request is on file.",
        copy: "Please watch your inbox for updates from Larisa.",
      };
  }
}

function RequestStatusPanel({ request }: { request: ReadingRequest }) {
  if (request.status === "pending_review") {
    return (
      <div className="status-card">
        <p className="status-label">What happens next</p>
        <h2>Watch your inbox.</h2>

        <p>
          A private link to Larisa&apos;s schedule will be sent to you once your
          request is approved.
        </p>

        <div className="hero-actions status-actions">
          <Link href="/readings" className="secondary-button">
            Back to Readings
          </Link>
        </div>
      </div>
    );
  }

  if (request.status === "needs_more_info") {
    return (
      <div className="status-card">
        <p className="status-label">What happens next</p>
        <h2>Larisa needs a little more information.</h2>

        <p>
          Please watch for a message from Larisa. Once the missing detail is
          resolved, she can continue reviewing your request.
        </p>
      </div>
    );
  }

  if (request.status === "approved_for_scheduling") {
    return (
      <div className="status-card scheduling-card scheduling-card-wide">
        <div className="scheduling-card-heading">
          <p className="status-label">Appointment Times</p>

          <h2>Choose your appointment time.</h2>

          <p>
            Select one available time below. A Google Calendar invitation with
            the Google Meet link will be sent after scheduling.
          </p>
        </div>

        <SchedulingPicker />
      </div>
    );
  }

  if (request.status === "scheduled") {
    return (
      <div className="status-card">
        <p className="status-label">Scheduled</p>
        <h2>Your reading is scheduled.</h2>

        <p>
          {formatScheduledDateTime(
            request.scheduled_start_time,
            request.scheduled_end_time
          )}
        </p>

        <p>
          Please check your calendar invitation for the Google Meet link and
          appointment details.
        </p>
      </div>
    );
  }

  if (request.status === "declined") {
    return (
      <div className="status-card">
        <p className="status-label">Request closed</p>
        <h2>This request was not accepted for scheduling.</h2>

        <p>
          If you believe this needs another look, you can contact Larisa
          directly.
        </p>
      </div>
    );
  }

  return (
    <div className="status-card">
      <p className="status-label">Current status</p>
      <h2>{formatStatus(request.status)}</h2>

      <p>
        Your request is on file. Please watch for updates from Larisa about the
        next step.
      </p>
    </div>
  );
}

export default async function SchedulePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="site-main schedule-page">
        <section className="page-hero">
          <p className="eyebrow">Schedule a Reading</p>

          <h1>Sign in to begin your reading request.</h1>

          <p className="hero-copy">
            First, sign in with your email or a trusted account. Then you can
            submit your reading request for Larisa to review.
          </p>

          <div className="hero-actions">
            <Link href="/login?next=/schedule" className="primary-button">
              Sign In to Continue
            </Link>

            <Link href="/readings" className="secondary-button">
              Explore Readings
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const { data: request } = await supabase
    .from("reading_requests")
    .select(
      "id, status, reading_type, created_at, scheduled_start_time, scheduled_end_time"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<ReadingRequest>();

  const canSubmitNewRequest =
    !request ||
    request.status === "declined" ||
    request.status === "completed" ||
    request.status === "canceled_by_client" ||
    request.status === "canceled_by_larisa";

  if (request && !canSubmitNewRequest) {
    const statusHero = getStatusHero(request);

    return (
      <main className="site-main schedule-page schedule-status-page">
        <section className="page-hero schedule-status-hero">
          <p className="eyebrow">{statusHero.eyebrow}</p>

          <h1>{statusHero.title}</h1>

          <p className="hero-copy">{statusHero.copy}</p>
        </section>

        <section
          className={`content-panel schedule-status-panel ${
            request.status === "approved_for_scheduling"
              ? "schedule-status-panel-approved"
              : ""
          }`}
        >
          <div className="request-summary-card">
            <p className="eyebrow">Your Request</p>

            <h2>{formatReadingType(request.reading_type)}</h2>

            <dl className="request-summary-list">
              <div>
                <dt>Status</dt>
                <dd>
                  <span className="status-pill">
                    {formatStatus(request.status)}
                  </span>
                </dd>
              </div>

              <div>
                <dt>Submitted</dt>
                <dd>{formatSubmittedDate(request.created_at)}</dd>
              </div>

              <div>
                <dt>Signed in as</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
          </div>

          <RequestStatusPanel request={request} />
        </section>
      </main>
    );
  }

  return (
    <main className="site-main schedule-page">
      <section className="page-hero">
        <p className="eyebrow">Request a Reading Appointment</p>

        <h1>Submit your reading request for Larisa to review.</h1>

        <p className="hero-copy">
          Share your birth details, preferred timing, and the question or life
          area you would like to explore. Once your request is approved,
          you&apos;ll receive private scheduling access.
        </p>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Reading Request</p>
          <h2>Tell Larisa what you would like to explore.</h2>
          <p>
            This is not an automatic booking. Larisa personally reviews each
            request before opening scheduling.
          </p>
        </div>

        <ReadingRequestForm />
      </section>
    </main>
  );
}
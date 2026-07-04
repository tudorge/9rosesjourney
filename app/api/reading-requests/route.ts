import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalText(value: unknown) {
  const cleaned = cleanText(value);
  return cleaned || null;
}

function escapeHtml(value: string | null | undefined) {
  return (value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatOptional(value: string | null | undefined) {
  return value ? escapeHtml(value) : "Not provided";
}

function formatReadingType(value: string) {
  const labels: Record<string, string> = {
    personal_astrology_guidance: "Personal Astrology Guidance",
    birth_chart_reading: "Birth Chart Reading",
    astrocartography_reading: "Astrocartography Reading",
  };

  return labels[value] || value.replaceAll("_", " ");
}

function getNotificationRecipients() {
  const raw =
    process.env.READING_REQUEST_NOTIFICATION_EMAILS ||
    "larisa@9rosesjourney.com,9rosesjourney@gmail.com";

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
    .map((email) => ({ email }));
}

async function sendReadingRequestNotification({
  requestId,
  email,
  name,
  phone,
  readingType,
  birthDate,
  birthTime,
  birthTimeUnknown,
  birthPlace,
  currentLocation,
  timezone,
  preferredTimes,
  questionOrFocus,
  additionalNotes,
}: {
  requestId: string | number;
  email: string;
  name: string;
  phone: string | null;
  readingType: string;
  birthDate: string | null;
  birthTime: string | null;
  birthTimeUnknown: boolean;
  birthPlace: string | null;
  currentLocation: string | null;
  timezone: string | null;
  preferredTimes: string | null;
  questionOrFocus: string;
  additionalNotes: string | null;
}) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("Skipping reading request notification: missing BREVO_API_KEY.");
    return;
  }

  const recipients = getNotificationRecipients();

  if (recipients.length === 0) {
    console.warn(
      "Skipping reading request notification: no notification recipients configured."
    );
    return;
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL || "larisa@9rosesjourney.com";
  const senderName = process.env.BREVO_SENDER_NAME || "9 Roses Journey";

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://9rosesjourney.com"}/admin/reading-requests/${requestId}`;

  const birthTimeDisplay = birthTimeUnknown
    ? "Unknown"
    : birthTime || "Not provided";

  const htmlContent = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #271720; line-height: 1.6;">
      <h1 style="color: #702840; margin-bottom: 12px;">New reading request</h1>

      <p>A new reading request has been submitted on 9 Roses Journey.</p>

      <p>
        <a href="${escapeHtml(adminUrl)}" style="color: #702840; font-weight: bold;">
          Review this request in the admin area
        </a>
      </p>

      <hr style="border: 0; border-top: 1px solid #ead8cf; margin: 24px 0;" />

      <h2 style="color: #702840; font-size: 18px;">Client details</h2>

      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${formatOptional(phone)}</p>
      <p><strong>Reading type:</strong> ${escapeHtml(formatReadingType(readingType))}</p>

      <h2 style="color: #702840; font-size: 18px; margin-top: 24px;">Birth information</h2>

      <p><strong>Birth date:</strong> ${formatOptional(birthDate)}</p>
      <p><strong>Birth time:</strong> ${escapeHtml(birthTimeDisplay)}</p>
      <p><strong>Birth place:</strong> ${formatOptional(birthPlace)}</p>
      <p><strong>Current location:</strong> ${formatOptional(currentLocation)}</p>
      <p><strong>Timezone:</strong> ${formatOptional(timezone)}</p>

      <h2 style="color: #702840; font-size: 18px; margin-top: 24px;">Scheduling preference</h2>

      <p>${formatOptional(preferredTimes)}</p>

      <h2 style="color: #702840; font-size: 18px; margin-top: 24px;">Main focus</h2>

      <p>${escapeHtml(questionOrFocus)}</p>

      <h2 style="color: #702840; font-size: 18px; margin-top: 24px;">Additional notes</h2>

      <p>${formatOptional(additionalNotes)}</p>
    </div>
  `;

  const textContent = `
New reading request

Review this request:
${adminUrl}

Client details
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Reading type: ${formatReadingType(readingType)}

Birth information
Birth date: ${birthDate || "Not provided"}
Birth time: ${birthTimeDisplay}
Birth place: ${birthPlace || "Not provided"}
Current location: ${currentLocation || "Not provided"}
Timezone: ${timezone || "Not provided"}

Scheduling preference
${preferredTimes || "Not provided"}

Main focus
${questionOrFocus}

Additional notes
${additionalNotes || "Not provided"}
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
      to: recipients,
      replyTo: {
        email,
        name,
      },
      subject: `New reading request from ${name}`,
      htmlContent,
      textContent,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();

    console.error("Reading request notification email error:", {
      status: response.status,
      response: responseText,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to submit a reading request." },
        { status: 401 }
      );
    }

    const name = cleanText(body.name);
    const phone = cleanOptionalText(body.phone);
    const readingType =
      cleanText(body.readingType) || "personal_astrology_guidance";
    const birthDate = cleanOptionalText(body.birthDate);
    const birthTime = cleanOptionalText(body.birthTime);
    const birthTimeUnknown = Boolean(body.birthTimeUnknown);
    const birthPlace = cleanOptionalText(body.birthPlace);
    const currentLocation = cleanOptionalText(body.currentLocation);
    const timezone = cleanOptionalText(body.timezone);
    const preferredTimes = cleanOptionalText(body.preferredTimes);
    const questionOrFocus = cleanText(body.questionOrFocus);
    const additionalNotes = cleanOptionalText(body.additionalNotes);
    const newsletterOptIn = Boolean(body.newsletterOptIn);

    if (!name) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!questionOrFocus) {
      return NextResponse.json(
        { error: "Please share the main focus for your reading." },
        { status: 400 }
      );
    }

    if (!birthDate) {
      return NextResponse.json(
        { error: "Please enter your birth date." },
        { status: 400 }
      );
    }

    if (!birthTimeUnknown && !birthTime) {
      return NextResponse.json(
        {
          error:
            "Please enter your birth time, or check that you do not know it.",
        },
        { status: 400 }
      );
    }

    if (!birthPlace) {
      return NextResponse.json(
        { error: "Please enter your birth place." },
        { status: 400 }
      );
    }

    const email = user.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Your signed-in account does not have an email address." },
        { status: 400 }
      );
    }

    const { data: existingRequest, error: existingRequestError } =
      await supabase
        .from("reading_requests")
        .select("id, status")
        .eq("user_id", user.id)
        .in("status", [
          "pending_review",
          "needs_more_info",
          "approved_for_scheduling",
          "scheduled",
          "reschedule_requested",
          "scheduling_paused",
        ])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (existingRequestError) {
      console.error("Reading request lookup error:", existingRequestError);

      return NextResponse.json(
        { error: "Could not check your existing reading requests." },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            "You already have an active reading request. Please check your request status.",
        },
        { status: 409 }
      );
    }

    const { data: insertedRequest, error: insertError } = await supabase
      .from("reading_requests")
      .insert({
        user_id: user.id,
        email,
        name,
        phone,
        reading_type: readingType,
        birth_date: birthDate,
        birth_time: birthTimeUnknown ? null : birthTime,
        birth_time_unknown: birthTimeUnknown,
        birth_place: birthPlace,
        current_location: currentLocation,
        timezone,
        preferred_times: preferredTimes,
        question_or_focus: questionOrFocus,
        additional_notes: additionalNotes,
        status: "pending_review",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Reading request insert error:", insertError);

      return NextResponse.json(
        { error: "Could not submit your reading request." },
        { status: 500 }
      );
    }

    if (newsletterOptIn) {
      const firstName = name.split(" ")[0] || name;

      const { error: newsletterError } = await supabase
        .from("newsletter_signups")
        .insert({
          email,
          first_name: firstName,
          source: "reading_request",
        });

      if (newsletterError && newsletterError.code !== "23505") {
        console.error("Newsletter opt-in error:", newsletterError);
      }
    }

    await sendReadingRequestNotification({
      requestId: insertedRequest.id,
      email,
      name,
      phone,
      readingType,
      birthDate,
      birthTime: birthTimeUnknown ? null : birthTime,
      birthTimeUnknown,
      birthPlace,
      currentLocation,
      timezone,
      preferredTimes,
      questionOrFocus,
      additionalNotes,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reading request route error:", error);

    return NextResponse.json(
      { error: "Invalid reading request." },
      { status: 400 }
    );
  }
}
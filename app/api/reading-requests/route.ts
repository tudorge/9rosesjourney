import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalText(value: unknown) {
  const cleaned = cleanText(value);
  return cleaned || null;
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

    const { error: insertError } = await supabase
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
      });

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reading request route error:", error);

    return NextResponse.json(
      { error: "Invalid reading request." },
      { status: 400 }
    );
  }
}
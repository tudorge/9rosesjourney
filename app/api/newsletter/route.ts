import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedSources = new Set(["join_page", "blog_subscribe"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";

    const requestedSource =
      typeof body.source === "string" ? body.source.trim() : "";

    const source = allowedSources.has(requestedSource)
      ? requestedSource
      : "join_page";

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("newsletter_signups").insert({
      email,
      first_name: firstName || null,
      source,
    });

    if (!error) {
      return NextResponse.json({ success: true });
    }

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This email is already signed up.", duplicate: true },
        { status: 409 }
      );
    }

    console.error("Newsletter signup error:", error);

    return NextResponse.json(
      { error: "Could not complete signup." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Newsletter route error:", error);

    return NextResponse.json(
      { error: "Invalid signup request." },
      { status: 400 }
    );
  }
}
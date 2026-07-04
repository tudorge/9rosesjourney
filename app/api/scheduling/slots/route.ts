import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCalendarBusyTimes } from "@/lib/google/calendar";
import {
  BOOKING_WINDOW_DAYS,
  BUFFER_MINUTES,
  MAX_READINGS_PER_DAY,
  MINIMUM_NOTICE_HOURS,
  READING_DURATION_MINUTES,
  SCHEDULING_TIMEZONE,
  buildAvailableSlots,
  getSchedulingLookupWindow,
} from "@/lib/scheduling/availability";
import type { ScheduledReadingBlock } from "@/lib/scheduling/availability";

type ActiveRequest = {
  id: string;
  user_id: string;
  status: string;
};

type SchedulingAccess = {
  id: string;
  status: string;
  link_generation_count: number;
  max_link_generations: number;
};

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to view scheduling options." },
        { status: 401 }
      );
    }

    const { data: request, error: requestError } = await supabase
      .from("reading_requests")
      .select("id, user_id, status")
      .eq("user_id", user.id)
      .eq("status", "approved_for_scheduling")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<ActiveRequest>();

    if (requestError) {
      console.error("Scheduling request lookup error:", requestError);

      return NextResponse.json(
        { error: "Could not check your reading request." },
        { status: 500 }
      );
    }

    if (!request) {
      return NextResponse.json(
        { error: "Scheduling is not available for this account yet." },
        { status: 403 }
      );
    }

    const { data: access, error: accessError } = await supabase
      .from("scheduling_access")
      .select("id, status, link_generation_count, max_link_generations")
      .eq("reading_request_id", request.id)
      .eq("user_id", user.id)
      .maybeSingle<SchedulingAccess>();

    if (accessError) {
      console.error("Scheduling access lookup error:", accessError);

      return NextResponse.json(
        { error: "Could not check your scheduling access." },
        { status: 500 }
      );
    }

    if (!access || access.status !== "active") {
      return NextResponse.json(
        { error: "Scheduling access is not active for this request." },
        { status: 403 }
      );
    }

    const { calendarBusyStart, calendarBusyEnd, now, slotSearchEnd } =
      getSchedulingLookupWindow();

    const busyBlocks = await getCalendarBusyTimes({
      timeMin: calendarBusyStart.toISOString(),
      timeMax: calendarBusyEnd.toISOString(),
    });

    const { data: scheduledReadings, error: scheduledReadingsError } =
      await supabase
        .from("reading_requests")
        .select("scheduled_start_time, scheduled_end_time")
        .eq("status", "scheduled")
        .not("scheduled_start_time", "is", null)
        .gte("scheduled_start_time", now.toISOString())
        .lte("scheduled_start_time", slotSearchEnd.toISOString())
        .returns<ScheduledReadingBlock[]>();

    if (scheduledReadingsError) {
      console.error("Scheduled readings lookup error:", scheduledReadingsError);

      return NextResponse.json(
        { error: "Could not check existing scheduled readings." },
        { status: 500 }
      );
    }

    const slots = buildAvailableSlots({
      busyBlocks,
      scheduledReadings: scheduledReadings ?? [],
    });

    return NextResponse.json(
      {
        success: true,
        timezone: SCHEDULING_TIMEZONE,
        readingDurationMinutes: READING_DURATION_MINUTES,
        bufferMinutes: BUFFER_MINUTES,
        minimumNoticeHours: MINIMUM_NOTICE_HOURS,
        bookingWindowDays: BOOKING_WINDOW_DAYS,
        maxReadingsPerDay: MAX_READINGS_PER_DAY,
        slots,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Scheduling slots error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not load scheduling slots.",
      },
      { status: 500 }
    );
  }
}
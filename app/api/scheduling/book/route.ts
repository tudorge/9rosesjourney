import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createReadingCalendarEvent,
  getCalendarBusyTimes,
} from "@/lib/google/calendar";
import {
  SCHEDULING_TIMEZONE,
  buildAvailableSlots,
  getSchedulingLookupWindow,
} from "@/lib/scheduling/availability";
import type { ScheduledReadingBlock } from "@/lib/scheduling/availability";

type ReadingRequest = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  reading_type: string;
  status: string;
};

type SchedulingAccess = {
  id: string;
  status: string;
  booking_count: number;
};

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

function isValidDate(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const start = body.start;
    const end = body.end;

    if (!isValidDate(start) || !isValidDate(end)) {
      return NextResponse.json(
        { error: "Please choose a valid appointment time." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to schedule your reading." },
        { status: 401 }
      );
    }

    const { data: readingRequest, error: readingRequestError } = await supabase
      .from("reading_requests")
      .select("id, user_id, email, name, reading_type, status")
      .eq("user_id", user.id)
      .eq("status", "approved_for_scheduling")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<ReadingRequest>();

    if (readingRequestError) {
      console.error("Book request lookup error:", readingRequestError);

      return NextResponse.json(
        { error: "Could not check your reading request." },
        { status: 500 }
      );
    }

    if (!readingRequest) {
      return NextResponse.json(
        { error: "Scheduling is not available for this account yet." },
        { status: 403 }
      );
    }

    const { data: schedulingAccess, error: schedulingAccessError } =
      await supabase
        .from("scheduling_access")
        .select("id, status, booking_count")
        .eq("reading_request_id", readingRequest.id)
        .eq("user_id", user.id)
        .maybeSingle<SchedulingAccess>();

    if (schedulingAccessError) {
      console.error("Book scheduling access lookup error:", schedulingAccessError);

      return NextResponse.json(
        { error: "Could not check your scheduling access." },
        { status: 500 }
      );
    }

    if (!schedulingAccess || schedulingAccess.status !== "active") {
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
      console.error("Book scheduled readings lookup error:", scheduledReadingsError);

      return NextResponse.json(
        { error: "Could not check existing scheduled readings." },
        { status: 500 }
      );
    }

    const availableSlots = buildAvailableSlots({
      busyBlocks,
      scheduledReadings: scheduledReadings ?? [],
    });

    const selectedSlot = availableSlots.find(
      (slot) => slot.start === start && slot.end === end
    );

    if (!selectedSlot) {
      return NextResponse.json(
        {
          error:
            "That time is no longer available. Please choose another appointment time.",
        },
        { status: 409 }
      );
    }

    const calendarEvent = await createReadingCalendarEvent({
      requestId: readingRequest.id,
      clientName: readingRequest.name,
      clientEmail: readingRequest.email,
      readingTypeLabel: formatReadingType(readingRequest.reading_type),
      start,
      end,
      timeZone: SCHEDULING_TIMEZONE,
    });

    const nowIso = new Date().toISOString();

    const { error: updateRequestError } = await supabase
      .from("reading_requests")
      .update({
        status: "scheduled",
        scheduled_at: nowIso,
        scheduled_start_time: start,
        scheduled_end_time: end,
        updated_at: nowIso,
      })
      .eq("id", readingRequest.id);

    if (updateRequestError) {
      console.error("Book request update error:", updateRequestError);

      return NextResponse.json(
        {
          error:
            "The calendar event was created, but the request could not be updated. Please contact Larisa.",
        },
        { status: 500 }
      );
    }

    const { error: bookingInsertError } = await supabase
      .from("calendar_bookings")
      .insert({
        reading_request_id: readingRequest.id,
        user_id: user.id,
        google_event_id: calendarEvent.id,
        google_event_link: calendarEvent.htmlLink,
        google_meet_link: calendarEvent.meetLink,
        scheduled_start_time: start,
        scheduled_end_time: end,
        status: "scheduled",
      });

    if (bookingInsertError) {
      console.error("Calendar booking insert error:", bookingInsertError);
    }

    const { error: updateAccessError } = await supabase
      .from("scheduling_access")
      .update({
        booking_count: schedulingAccess.booking_count + 1,
        last_accessed_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", schedulingAccess.id);

    if (updateAccessError) {
      console.error("Book scheduling access update error:", updateAccessError);
    }

    const { error: eventInsertError } = await supabase
      .from("scheduling_access_events")
      .insert({
        scheduling_access_id: schedulingAccess.id,
        reading_request_id: readingRequest.id,
        user_id: user.id,
        event_type: "reading_scheduled",
        event_details: {
          google_event_id: calendarEvent.id,
          google_event_link: calendarEvent.htmlLink,
          google_meet_link: calendarEvent.meetLink,
          scheduled_start_time: start,
          scheduled_end_time: end,
          timezone: SCHEDULING_TIMEZONE,
        },
      });

    if (eventInsertError) {
      console.error("Book event log insert error:", eventInsertError);
    }

    return NextResponse.json({
      success: true,
      scheduledStartTime: start,
      scheduledEndTime: end,
      dateLabel: selectedSlot.dateLabel,
      timeLabel: selectedSlot.timeLabel,
      weekdayLabel: selectedSlot.weekdayLabel,
      googleEventId: calendarEvent.id,
      googleEventLink: calendarEvent.htmlLink,
      googleMeetLink: calendarEvent.meetLink,
    });
  } catch (error) {
    console.error("Scheduling book error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not schedule your reading.",
      },
      { status: 500 }
    );
  }
}
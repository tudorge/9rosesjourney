export type BusyBlock = {
  start: string;
  end: string;
};

export type ScheduledReadingBlock = {
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
};

export type CalendarSlot = {
  start: string;
  end: string;
  dateLabel: string;
  timeLabel: string;
  weekdayLabel: string;
};

export const SCHEDULING_TIMEZONE = "Europe/Bucharest";
export const READING_DURATION_MINUTES = 120;
export const BUFFER_MINUTES = 120;
export const MINIMUM_NOTICE_HOURS = 48;
export const BOOKING_WINDOW_DAYS = 30;
export const MAX_READINGS_PER_DAY = 2;
export const SLOT_SPACING_MINUTES = 30;

const AVAILABLE_DAYS = new Set([1, 2, 3, 4, 5]);

const WORKDAY_START_HOUR = 10;
const WORKDAY_START_MINUTE = 0;
const WORKDAY_END_HOUR = 18;
const WORKDAY_END_MINUTE = 0;

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function roundUpToNextSlot(date: Date) {
  const copy = new Date(date);
  copy.setSeconds(0, 0);

  const minutes = copy.getMinutes();
  const remainder = minutes % SLOT_SPACING_MINUTES;

  if (remainder !== 0) {
    copy.setMinutes(minutes + (SLOT_SPACING_MINUTES - remainder));
  }

  return copy;
}

function getZonedParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULING_TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  function getPart(type: Intl.DateTimeFormatPartTypes) {
    return parts.find((part) => part.type === type)?.value ?? "";
  }

  const weekdayText = getPart("weekday");
  const weekday =
    weekdayText === "Mon"
      ? 1
      : weekdayText === "Tue"
        ? 2
        : weekdayText === "Wed"
          ? 3
          : weekdayText === "Thu"
            ? 4
            : weekdayText === "Fri"
              ? 5
              : weekdayText === "Sat"
                ? 6
                : 0;

  return {
    weekday,
    year: Number(getPart("year")),
    month: Number(getPart("month")),
    day: Number(getPart("day")),
    hour: Number(getPart("hour")),
    minute: Number(getPart("minute")),
  };
}

function getLocalMinutes(date: Date) {
  const parts = getZonedParts(date);
  return parts.hour * 60 + parts.minute;
}

function getLocalDayKey(date: Date) {
  const parts = getZonedParts(date);

  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(
    parts.day
  ).padStart(2, "0")}`;
}

function isSameLocalDay(first: Date, second: Date) {
  return getLocalDayKey(first) === getLocalDayKey(second);
}

function isWithinWorkingHours(start: Date, end: Date) {
  const startParts = getZonedParts(start);

  if (!AVAILABLE_DAYS.has(startParts.weekday)) {
    return false;
  }

  if (!isSameLocalDay(start, end)) {
    return false;
  }

  const startMinutes = getLocalMinutes(start);
  const endMinutes = getLocalMinutes(end);

  const workStartMinutes = WORKDAY_START_HOUR * 60 + WORKDAY_START_MINUTE;
  const workEndMinutes = WORKDAY_END_HOUR * 60 + WORKDAY_END_MINUTE;

  return startMinutes >= workStartMinutes && endMinutes <= workEndMinutes;
}

function rangesOverlap(
  firstStart: Date,
  firstEnd: Date,
  secondStart: Date,
  secondEnd: Date
) {
  return firstStart < secondEnd && secondStart < firstEnd;
}

function hasBusyConflict(start: Date, end: Date, busyBlocks: BusyBlock[]) {
  const protectedStart = addMinutes(start, -BUFFER_MINUTES);
  const protectedEnd = addMinutes(end, BUFFER_MINUTES);

  return busyBlocks.some((busy) => {
    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);

    return rangesOverlap(protectedStart, protectedEnd, busyStart, busyEnd);
  });
}

function countScheduledReadingsByLocalDay(
  scheduledReadings: ScheduledReadingBlock[]
) {
  const counts = new Map<string, number>();

  for (const reading of scheduledReadings) {
    if (!reading.scheduled_start_time) {
      continue;
    }

    const dayKey = getLocalDayKey(new Date(reading.scheduled_start_time));
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1);
  }

  return counts;
}

function formatSlot(start: Date, end: Date): CalendarSlot {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULING_TIMEZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULING_TIMEZONE,
    weekday: "long",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULING_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    dateLabel: dateFormatter.format(start),
    weekdayLabel: weekdayFormatter.format(start),
    timeLabel: `${timeFormatter.format(start)} – ${timeFormatter.format(end)}`,
  };
}

export function getSchedulingLookupWindow() {
  const now = new Date();

  return {
    now,
    slotSearchStart: roundUpToNextSlot(
      addMinutes(now, MINIMUM_NOTICE_HOURS * 60)
    ),
    slotSearchEnd: addDays(now, BOOKING_WINDOW_DAYS),
    calendarBusyStart: addMinutes(
      now,
      MINIMUM_NOTICE_HOURS * 60 - BUFFER_MINUTES
    ),
    calendarBusyEnd: addMinutes(
      addDays(now, BOOKING_WINDOW_DAYS),
      READING_DURATION_MINUTES + BUFFER_MINUTES
    ),
  };
}

export function buildAvailableSlots({
  busyBlocks,
  scheduledReadings,
}: {
  busyBlocks: BusyBlock[];
  scheduledReadings: ScheduledReadingBlock[];
}) {
  const { slotSearchStart, slotSearchEnd } = getSchedulingLookupWindow();
  const scheduledCountsByDay =
    countScheduledReadingsByLocalDay(scheduledReadings);

  const slots: CalendarSlot[] = [];
  let cursor = slotSearchStart;

  while (cursor <= slotSearchEnd) {
    const slotStart = new Date(cursor);
    const slotEnd = addMinutes(slotStart, READING_DURATION_MINUTES);
    const dayKey = getLocalDayKey(slotStart);
    const scheduledReadingsThatDay = scheduledCountsByDay.get(dayKey) ?? 0;

    if (
      scheduledReadingsThatDay < MAX_READINGS_PER_DAY &&
      isWithinWorkingHours(slotStart, slotEnd) &&
      !hasBusyConflict(slotStart, slotEnd, busyBlocks)
    ) {
      slots.push(formatSlot(slotStart, slotEnd));
    }

    cursor = addMinutes(cursor, SLOT_SPACING_MINUTES);
  }

  return slots;
}
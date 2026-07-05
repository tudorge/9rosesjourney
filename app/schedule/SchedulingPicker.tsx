"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Slot = {
  start: string;
  end: string;
  dateLabel: string;
  timeLabel: string;
  weekdayLabel: string;
};

type SlotsResponse = {
  success?: boolean;
  timezone?: string;
  readingDurationMinutes?: number;
  bufferMinutes?: number;
  slots?: Slot[];
  error?: string;
};

type BookResponse = {
  success?: boolean;
  dateLabel?: string;
  timeLabel?: string;
  weekdayLabel?: string;
  googleMeetLink?: string | null;
  error?: string;
};

type LoadState = "loading" | "ready" | "error";
type BookState = "idle" | "booking" | "booked" | "error";

function groupSlotsByDate(slots: Slot[]) {
  const groups = new Map<string, Slot[]>();

  for (const slot of slots) {
    const key = `${slot.weekdayLabel}, ${slot.dateLabel}`;
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  }

  return Array.from(groups.entries()).map(([label, groupSlots]) => ({
    label,
    slots: groupSlots,
  }));
}

export default function SchedulingPicker() {
  const router = useRouter();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [timezone, setTimezone] = useState("");
  const [readingDurationMinutes, setReadingDurationMinutes] = useState(75);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [bookState, setBookState] = useState<BookState>("idle");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [message, setMessage] = useState("");

  const groupedSlots = useMemo(() => groupSlotsByDate(slots), [slots]);
  const visibleGroups = groupedSlots.slice(0, 10);

  useEffect(() => {
    let ignore = false;

    async function loadSlots() {
      setLoadState("loading");
      setMessage("");

      try {
        const response = await fetch("/api/scheduling/slots", {
          cache: "no-store",
        });

        const result = (await response.json()) as SlotsResponse;

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Could not load available times.");
        }

        if (!ignore) {
          setSlots(result.slots ?? []);
          setTimezone(result.timezone ?? "");
          setReadingDurationMinutes(result.readingDurationMinutes ?? 75);
          setLoadState("ready");
        }
      } catch (error) {
        if (!ignore) {
          setLoadState("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not load available times."
          );
        }
      }
    }

    loadSlots();

    return () => {
      ignore = true;
    };
  }, []);

  async function bookSlot(slot: Slot) {
    setSelectedSlot(slot);
    setBookState("booking");
    setMessage("");

    try {
      const response = await fetch("/api/scheduling/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: slot.start,
          end: slot.end,
        }),
      });

      const result = (await response.json()) as BookResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Could not schedule that appointment time."
        );
      }

      setBookState("booked");
      setMessage(
        `Your reading is scheduled for ${result.weekdayLabel}, ${result.dateLabel}, ${result.timeLabel}.`
      );

      router.refresh();
    } catch (error) {
      setBookState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not schedule that appointment time."
      );
    }
  }

  if (loadState === "loading") {
    return (
      <div className="scheduling-picker">
        <p className="form-note">Loading available appointment times...</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="scheduling-picker">
        <p className="form-message error-message">{message}</p>
      </div>
    );
  }

  return (
    <div className="scheduling-picker">
      <div className="scheduling-picker-intro">
        <p className="status-label">Choose a time</p>

        <p className="form-note">
          Times are shown in Larisa&apos;s calendar timezone
          {timezone ? `: ${timezone}` : ""}. Each reading is{" "}
          {readingDurationMinutes} minutes, with private preparation time around
          appointments.
        </p>
      </div>

      <div className="scheduling-message-area" aria-live="polite">
        {bookState === "booked" && (
          <p className="form-message success-message">{message}</p>
        )}

        {bookState === "error" && (
          <p className="form-message error-message">{message}</p>
        )}
      </div>

      {slots.length === 0 && (
        <p className="form-note">
          No appointment times are currently available. Please check back later
          or contact Larisa directly.
        </p>
      )}

      {visibleGroups.length > 0 && (
        <div className="slot-day-list" aria-label="Available appointment days">
          {visibleGroups.map((group) => (
            <div className="slot-day-card" key={group.label}>
              <h3>{group.label}</h3>

              <div className="slot-button-grid">
                {group.slots.map((slot) => {
                  const isSelected =
                    selectedSlot?.start === slot.start &&
                    selectedSlot?.end === slot.end;

                  return (
                    <button
                      className="slot-button"
                      type="button"
                      key={`${slot.start}-${slot.end}`}
                      onClick={() => bookSlot(slot)}
                      disabled={
                        bookState === "booking" || bookState === "booked"
                      }
                      aria-label={`Schedule for ${group.label}, ${slot.timeLabel}`}
                    >
                      {bookState === "booking" && isSelected
                        ? "Scheduling..."
                        : slot.timeLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {groupedSlots.length > 10 && (
        <p className="form-note">
          Showing the first 10 available days. More openings can be loaded later
          if needed.
        </p>
      )}
    </div>
  );
}

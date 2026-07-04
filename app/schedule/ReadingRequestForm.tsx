"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ReadingRequestForm() {
  const router = useRouter();

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("submitting");
    setErrorMessage("");

    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      readingType: String(formData.get("readingType") || ""),
      birthDate: String(formData.get("birthDate") || ""),
      birthTime: String(formData.get("birthTime") || ""),
      birthTimeUnknown,
      birthPlace: String(formData.get("birthPlace") || ""),
      currentLocation: String(formData.get("currentLocation") || ""),
      timezone: String(formData.get("timezone") || ""),
      preferredTimes: String(formData.get("preferredTimes") || ""),
      questionOrFocus: String(formData.get("questionOrFocus") || ""),
      additionalNotes: String(formData.get("additionalNotes") || ""),
      newsletterOptIn: formData.get("newsletterOptIn") === "on",
    };

    try {
      const response = await fetch("/api/reading-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitState("error");
        setErrorMessage(
          typeof result.error === "string"
            ? result.error
            : "Could not submit your request."
        );
        return;
      }

      setSubmitState("success");
      router.refresh();
    } catch (error) {
      console.error("Reading request submit error:", error);
      setSubmitState("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Optional"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="readingType">Reading type</label>
        <select id="readingType" name="readingType" required>
          <option value="personal_astrology_guidance">
            Personal Astrology Guidance
          </option>
          <option value="birth_chart_reading">Birth Chart Reading</option>
          <option value="astrocartography_reading">
            Astrocartography / Relocation Astrology Reading
          </option>
          <option value="not_sure">I am not sure yet</option>
        </select>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="birthDate">Birth date</label>
          <input id="birthDate" name="birthDate" type="date" required />
        </div>

        <div className="form-field">
          <label htmlFor="birthTime">Birth time</label>
          <input
            id="birthTime"
            name="birthTime"
            type="time"
            disabled={birthTimeUnknown}
            required={!birthTimeUnknown}
          />
        </div>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={birthTimeUnknown}
          onChange={(event) => setBirthTimeUnknown(event.target.checked)}
        />
        <span>I do not know my exact birth time.</span>
      </label>

      <div className="form-field">
        <label htmlFor="birthPlace">Birth place</label>
        <input
          id="birthPlace"
          name="birthPlace"
          type="text"
          placeholder="City, state/region, country"
          autoComplete="off"
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="currentLocation">Current location</label>
          <input
            id="currentLocation"
            name="currentLocation"
            type="text"
            placeholder="Optional"
            autoComplete="address-level2"
          />
        </div>

        <div className="form-field">
          <label htmlFor="timezone">Timezone</label>
          <input
            id="timezone"
            name="timezone"
            type="text"
            placeholder="Example: Central Time, Eastern Time, EET"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="preferredTimes">Preferred days or times</label>
        <textarea
          id="preferredTimes"
          name="preferredTimes"
          placeholder="Share a few days or time windows that usually work for you."
          rows={4}
        />
      </div>

      <div className="form-field">
        <label htmlFor="questionOrFocus">Main question or focus</label>
        <textarea
          id="questionOrFocus"
          name="questionOrFocus"
          placeholder="What would you like the reading to focus on?"
          rows={5}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="additionalNotes">Additional notes</label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          placeholder="Anything else Larisa should know before reviewing your request?"
          rows={4}
        />
      </div>

      <label className="checkbox-field">
        <input id="newsletterOptIn" name="newsletterOptIn" type="checkbox" />
        <span>
          I would also like to receive occasional astrology notes and reading
          updates.
        </span>
      </label>

      <p className="form-note">
        Submitting this form does not confirm an appointment. Larisa will review
        your request first. If approved, you will be able to choose a time from
        her available appointments.
      </p>

      <button
        className="primary-button"
        type="submit"
        disabled={submitState === "submitting" || submitState === "success"}
      >
        {submitState === "submitting"
          ? "Submitting request..."
          : submitState === "success"
            ? "Request submitted"
            : "Submit Reading Request"}
      </button>

      {submitState === "success" && (
        <p className="form-message success-message">
          Thank you. Your request has been received and is ready for Larisa to
          review.
        </p>
      )}

      {submitState === "error" && (
        <p className="form-message error-message">{errorMessage}</p>
      )}
    </form>
  );
}
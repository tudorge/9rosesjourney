"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "duplicate" | "error";

export default function JoinForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFirstName = firstName.trim();

    if (!trimmedEmail) {
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: trimmedFirstName,
        }),
      });

      if (response.ok) {
        setSubmitState("success");
        setEmail("");
        setFirstName("");
        return;
      }

      if (response.status === 409) {
        setSubmitState("duplicate");
        return;
      }

      setSubmitState("error");
    } catch (error) {
      console.error("Newsletter signup request failed:", error);
      setSubmitState("error");
    }
  }

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Your first name"
          autoComplete="given-name"
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <button
        className="primary-button"
        type="submit"
        disabled={submitState === "submitting"}
      >
        {submitState === "submitting" ? "Joining..." : "Join the List"}
      </button>

      <p className="form-note">
        No spam. Just thoughtful updates, reading announcements, and occasional
        astrology reflections.
      </p>

      {submitState === "success" && (
        <p className="form-message success-message">
          You&apos;re on the list. Thank you for joining.
        </p>
      )}

      {submitState === "duplicate" && (
        <p className="form-message success-message">
          Looks like you&apos;re already signed up.
        </p>
      )}

      {submitState === "error" && (
        <p className="form-message error-message">
          Something went wrong. Please check your email and try again.
        </p>
      )}
    </form>
  );
}
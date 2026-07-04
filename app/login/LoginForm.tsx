"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SubmitState =
  | "idle"
  | "sending_email"
  | "email_sent"
  | "social_redirecting"
  | "error";

type SocialProvider = "google";

type SocialProviderConfig = {
  provider: SocialProvider;
  label: string;
  icon: ReactNode;
};

function GoogleIcon() {
  return (
    <svg
      className="login-provider-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.74-.07-1.45-.19-2.14H12v4.05h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.44Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.11H3.07v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.91a6.01 6.01 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59C7.2 7.73 9.4 5.98 12 5.98Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="login-provider-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#1877F2"
        d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.25c-1.24 0-1.63.77-1.63 1.56v1.9h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="login-provider-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M4.5 6.5h15A2.5 2.5 0 0 1 22 9v6.5A2.5 2.5 0 0 1 19.5 18h-15A2.5 2.5 0 0 1 2 15.5V9a2.5 2.5 0 0 1 2.5-2.5Zm.16 2 6.52 4.56c.5.35 1.14.35 1.64 0l6.52-4.56H4.66Zm15.34 2-6.03 4.22a3.45 3.45 0 0 1-3.94 0L4 10.5v5c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5v-5Z"
      />
    </svg>
  );
}

const socialProviders: SocialProviderConfig[] = [
  {
    provider: "google",
    label: "Continue with Google",
    icon: <GoogleIcon />,
  },
];

function getSafeNextPath(value: string | null) {
  if (!value) {
    return "/schedule";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/schedule";
  }

  return value;
}

export default function LoginForm() {
  const searchParams = useSearchParams();

  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams]
  );

  const loginError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function getRedirectTo() {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      nextPath
    )}`;
  }

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setSubmitState("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    setSubmitState("sending_email");
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: getRedirectTo(),
      },
    });

    if (error) {
      console.error("Email sign-in error:", error);
      setSubmitState("error");
      setErrorMessage(
        "We could not send the sign-in email. Please check the address and try again."
      );
      return;
    }

    setSubmitState("email_sent");
  }

  async function handleSocialLogin(provider: SocialProvider) {
    setSubmitState("social_redirecting");
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectTo(),
      },
    });

    if (error) {
      console.error(`${provider} sign-in error:`, error);
      setSubmitState("error");
      setErrorMessage(
        "We could not start that sign-in option. Please try email sign-in instead."
      );
    }
  }

  return (
    <div className="join-form">
      <div>
        <p className="form-note">
          Use a sign-in option below. After you are signed in, you will be able
          to complete Larisa&apos;s reading request form.
        </p>

        {loginError && (
          <p className="form-message error-message">
            The sign-in link could not be completed. Please try again.
          </p>
        )}
      </div>

      <form className="join-form" onSubmit={handleEmailLogin}>
        <div className="form-field">
          <label htmlFor="loginEmail">Email address</label>
          <input
            id="loginEmail"
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
          className="primary-button login-provider-button"
          type="submit"
          disabled={
            submitState === "sending_email" ||
            submitState === "social_redirecting"
          }
        >
          <EmailIcon />
          <span>
            {submitState === "sending_email"
              ? "Sending sign-in link..."
              : "Continue with Email"}
          </span>
        </button>

        {submitState === "email_sent" && (
          <p className="form-message success-message">
            Check your inbox. We sent you a secure sign-in link.
          </p>
        )}
      </form>

      <div className="login-provider-grid">
        {socialProviders.map((item) => (
          <button
            key={item.provider}
            className="secondary-button login-provider-button"
            type="button"
            onClick={() => handleSocialLogin(item.provider)}
            disabled={
              submitState === "sending_email" ||
              submitState === "social_redirecting"
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button
          className="secondary-button login-provider-button login-provider-coming-soon"
          type="button"
          disabled
          aria-disabled="true"
          title="Facebook login is coming soon."
        >
          <FacebookIcon />
          <span>Continue with Facebook</span>
          <span className="coming-soon-pill">Coming soon</span>
        </button>
      </div>

      <p className="form-note">
        Your appointment is not scheduled automatically. After sign-in, you can
        submit your request for Larisa to review.
      </p>

      <p className="form-note">
        By continuing, you agree to the{" "}
        <a href="/terms">Terms of Service</a> and acknowledge the{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      {submitState === "error" && (
        <p className="form-message error-message">{errorMessage}</p>
      )}
    </div>
  );
}
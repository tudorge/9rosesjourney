import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to 9 Roses Journey to request a private astrology reading with Larisa.",
};

export default function LoginPage() {
  return (
    <main className="site-main">
      <section className="page-hero">
        <p className="eyebrow">Reading Requests</p>

        <h1>Sign in to begin your reading request.</h1>

        <p className="hero-copy">
          Sign in with your email or a trusted account so Larisa can securely
          receive your request, review your information, and open scheduling if
          the reading is a good fit.
        </p>

        <div className="hero-actions">
          <Link href="/readings" className="secondary-button">
            Back to Readings
          </Link>
        </div>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Secure Access</p>
          <h2>Use email, Google, Apple, or Facebook.</h2>
        </div>

        <Suspense
          fallback={
            <p className="form-note">Preparing the sign-in options...</p>
          }
        >
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
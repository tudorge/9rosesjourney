import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion",
  description:
    "Instructions for requesting deletion of information associated with 9 Roses Journey.",
};

export default function DataDeletionPage() {
  return (
    <main className="site-main">
      <section className="page-hero">
        <p className="eyebrow">Data Deletion</p>

        <h1>Data Deletion Instructions</h1>

        <p className="hero-copy">
          You may request deletion of personal information associated with your
          9 Roses Journey account or reading request.
        </p>
      </section>

      <section className="content-panel legal-content">
        <div>
          <p className="form-note">Last updated: July 2026</p>

          <h2>How to request deletion</h2>
          <p>
            To request deletion of your information, email Larisa at{" "}
            <a href="mailto:larisa@9rosesjourney.com">
              larisa@9rosesjourney.com
            </a>{" "}
            with the subject line{" "}
            <strong>Data Deletion Request</strong>.
          </p>

          <h2>What to include</h2>
          <p>
            Please include the email address you used on 9 Roses Journey and,
            if applicable, whether you signed in using email, Google, or
            Facebook. This helps us identify the correct account or request.
          </p>

          <h2>Facebook login users</h2>
          <p>
            If you used Facebook to sign in, you may request deletion of
            information connected to your Facebook login by emailing the request
            above. You may also remove 9 Roses Journey from your Facebook app
            and website settings.
          </p>

          <h2>What may be deleted</h2>
          <p>
            We may delete or anonymize account-related information, reading
            request details, and other personal information submitted through
            this website, unless retention is necessary for legitimate business,
            security, legal, payment, dispute-resolution, or recordkeeping
            reasons.
          </p>

          <h2>Processing time</h2>
          <p>
            We will review deletion requests and respond as reasonably soon as
            possible. Some requests may require identity verification before
            information can be deleted.
          </p>

          <h2>Questions</h2>
          <p>
            For questions about privacy or data deletion, contact Larisa at{" "}
            <a href="mailto:larisa@9rosesjourney.com">
              larisa@9rosesjourney.com
            </a>
            .
          </p>

          <div className="hero-actions">
            <Link href="/" className="secondary-button">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
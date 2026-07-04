import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for using 9 Roses Journey and requesting private astrology readings.",
};

export default function TermsPage() {
  return (
    <main className="site-main">
      <section className="page-hero">
        <p className="eyebrow">Terms of Service</p>

        <h1>Terms of Service</h1>

        <p className="hero-copy">
          These terms explain how this website and 9 Roses Journey reading
          request services may be used.
        </p>
      </section>

      <section className="content-panel legal-content">
        <div>
          <p className="form-note">Last updated: July 2026</p>

          <h2>Overview</h2>
          <p>
            9 Roses Journey provides private astrology reading request,
            scheduling, and related communication services. By using this
            website, submitting a reading request, or signing in with email,
            Google, or Facebook, you agree to these Terms of Service.
          </p>

          <h2>Astrology readings</h2>
          <p>
            Astrology readings are offered for personal reflection, spiritual
            insight, timing awareness, and self-exploration. They are not a
            substitute for professional medical, legal, financial,
            psychological, or other licensed professional advice.
          </p>

          <h2>Reading requests</h2>
          <p>
            Submitting a reading request does not guarantee that a reading will
            be accepted, scheduled, or completed. Larisa may review each request
            before opening scheduling access.
          </p>

          <h2>Scheduling</h2>
          <p>
            If your request is approved, you may be invited to select an
            available appointment time. Appointment details may be sent by email
            or calendar invitation and may include an online meeting link.
          </p>

          <h2>Payments</h2>
          <p>
            If payment is required for a reading, payment must be completed
            according to the instructions provided at the time of booking.
            Payment processing may be handled by a third-party payment provider.
          </p>

          <h2>Cancellations and rescheduling</h2>
          <p>
            Cancellation, refund, and rescheduling terms may vary depending on
            the reading type, payment status, and timing of the request. Please
            contact Larisa as early as possible if you need to change an
            appointment.
          </p>

          <h2>User responsibilities</h2>
          <p>
            You agree to provide accurate information, use the website lawfully,
            avoid submitting abusive or harmful content, and respect Larisa’s
            time, privacy, and professional boundaries.
          </p>

          <h2>Account access</h2>
          <p>
            The website may allow sign-in through email, Google, or Facebook.
            You are responsible for maintaining access to the email or account
            you use to sign in.
          </p>

          <h2>Privacy</h2>
          <p>
            Your use of this website is also governed by our{" "}
            <Link href="/privacy">Privacy Policy</Link>, which explains how
            information submitted through the site may be collected, used, and
            protected.
          </p>

          <h2>Availability</h2>
          <p>
            We try to keep the website available and reliable, but we do not
            guarantee uninterrupted access. The site may be changed, paused, or
            unavailable from time to time.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, 9 Roses Journey is not
            responsible for indirect, incidental, or consequential damages
            related to use of the website, reading requests, scheduling, or
            astrology services.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            These terms may be updated from time to time. Continued use of the
            website after updates means you accept the revised terms.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, contact Larisa at{" "}
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
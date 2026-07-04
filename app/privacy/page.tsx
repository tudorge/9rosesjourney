import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for 9 Roses Journey and private astrology reading requests with Larisa.",
};

export default function PrivacyPage() {
  return (
    <main className="site-main">
      <section className="page-hero">
        <p className="eyebrow">Privacy Policy</p>

        <h1>Privacy Policy</h1>

        <p className="hero-copy">
          This Privacy Policy explains how 9 Roses Journey collects, uses, and
          protects information submitted through this website.
        </p>
      </section>

      <section className="content-panel legal-content">
        <div>
          <p className="form-note">Last updated: July 2026</p>

          <h2>Overview</h2>
          <p>
            9 Roses Journey provides private astrology reading request and
            scheduling services. When you use this website, we may collect
            information needed to respond to your request, communicate with you,
            and manage appointments.
          </p>

          <h2>Information we collect</h2>
          <p>
            We may collect information you provide directly, including your
            name, email address, reading preferences, birth date, birth time,
            birth location, questions or topics you choose to share, and any
            other details submitted through the reading request form.
          </p>

          <p>
            When you sign in using email, Google, or Facebook, we may receive
            basic account information from that provider, such as your email
            address and account identifier, so we can securely connect your
            request to your account.
          </p>

          <h2>How we use your information</h2>
          <p>
            We use your information to review reading requests, communicate with
            you, manage scheduling, send appointment information, prevent misuse,
            and improve the reliability of the website.
          </p>

          <h2>Scheduling and communications</h2>
          <p>
            If your request is approved for scheduling, appointment information
            may be used to create calendar invitations and online meeting links.
            You may also receive email messages related to your request,
            appointment, or follow-up communication.
          </p>

          <h2>Service providers</h2>
          <p>
            This website may use trusted service providers for hosting,
            authentication, database storage, email delivery, scheduling,
            analytics, calendar invitations, online meetings, and payment
            processing. These providers only receive information needed to
            perform their services.
          </p>

          <h2>Payments</h2>
          <p>
            If paid booking or payment processing is enabled, payment details
            are processed by a third-party payment provider. 9 Roses Journey
            does not intentionally store full credit card numbers on this
            website.
          </p>

          <h2>Cookies and authentication</h2>
          <p>
            The website may use cookies or similar technologies to keep you
            signed in, protect the request process, and support secure site
            functionality.
          </p>

          <h2>How we share information</h2>
          <p>
            We do not sell your personal information. We may share information
            only with service providers who help operate the website, when
            required by law, or when necessary to protect the website, Larisa,
            or other users.
          </p>

          <h2>Data retention</h2>
          <p>
            We keep submitted information for as long as needed to provide
            services, maintain appointment records, comply with legal
            obligations, resolve disputes, and protect the website from abuse.
          </p>

          <h2>Your choices</h2>
          <p>
            You may request access, correction, or deletion of information you
            submitted through this website by contacting 9 Roses Journey.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy questions or requests, contact Larisa at{" "}
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
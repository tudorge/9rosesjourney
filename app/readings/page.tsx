import Link from "next/link";

export default function ReadingsPage() {
  return (
    <main className="site-main readings-page">
      <section className="page-hero">
        <p className="eyebrow">Astrology Readings</p>

        <h1>Schedule a personal astrology reading with Larisa.</h1>

        <p className="hero-copy">
          A one-on-one astrology reading for clarity, timing, reflection, and
          deeper understanding of the patterns shaping your current journey.
        </p>

        <div className="hero-actions">
          <Link href="/join" className="primary-button">
            Get Notified When Booking Opens
          </Link>

          <Link href="/about" className="secondary-button">
            Learn About the Approach
          </Link>
        </div>
      </section>

      <section className="intro-grid" aria-label="Astrology reading details">
        <article className="intro-card">
          <p className="card-kicker">Personal session</p>
          <h2>Astrology Reading</h2>
          <p>
            A 60-minute personal reading focused on your birth chart, current
            timing, life themes, questions, and areas where you are seeking
            greater clarity.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Prepared in advance</p>
          <h2>Birth Details</h2>
          <p>
            When booking, you will be asked for your date of birth, time of
            birth if known, place of birth, and the main question or life area
            you would like the reading to focus on.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Online booking</p>
          <h2>Paid Scheduling</h2>
          <p>
            Booking will open soon through a secure scheduling and payment flow.
            Readings will be paid ahead of time when the appointment is
            scheduled.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Booking Status</p>
          <h2>The reading calendar is being prepared.</h2>
        </div>

        <p>
          Once scheduling is active, visitors will be able to choose an available
          time, submit their birth details, and pay for the session at the time
          of booking. Rescheduling will be available up to 24 hours before the
          appointment.
        </p>
      </section>
    </main>
  );
}
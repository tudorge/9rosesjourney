import Link from "next/link";

export default function ReadingsPage() {
  return (
    <main className="site-main readings-page">
      <section className="page-hero">
        <p className="eyebrow">Readings</p>

        <h1>Astrology readings for clarity, timing, and reflection.</h1>

        <p className="hero-copy">
          Each reading is designed to help you understand the patterns shaping
          your life, relationships, choices, and timing. More booking options
          will be added soon, but this page gives visitors a clear sense of what
          will be offered.
        </p>

        <div className="hero-actions">
          <Link href="/join" className="primary-button">
            Join the List
          </Link>

          <Link href="/about" className="secondary-button">
            Learn About the Approach
          </Link>
        </div>
      </section>

      <section className="intro-grid" aria-label="Reading options">
        <article className="intro-card">
          <p className="card-kicker">Personal foundation</p>
          <h2>Natal Chart Reading</h2>
          <p>
            A reflective look at core themes, strengths, inner patterns, and
            life direction through the birth chart.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Connection patterns</p>
          <h2>Relationship Themes</h2>
          <p>
            A reading focused on emotional dynamics, compatibility themes,
            repeated patterns, and lessons between people.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Cycles and timing</p>
          <h2>Timing & Transits</h2>
          <p>
            A reading centered on current or upcoming astrological timing,
            transitions, opportunities, and areas that may need patience.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Coming Next</p>
          <h2>Booking and pricing will be added soon.</h2>
        </div>

        <p>
          The first version of this site is focused on presenting the work
          clearly. Scheduling, checkout, and detailed reading packages can be
          added after the public pages feel polished and trustworthy.
        </p>
      </section>
    </main>
  );
}
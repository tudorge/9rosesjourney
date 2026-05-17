export default function ReadingsPage() {
  return (
    <main className="site-main">
      <section className="hero-section">
        <p className="eyebrow">Readings</p>

        <h1>Astrology readings for clarity, timing, and reflection.</h1>

        <p className="hero-copy">
          Reading options will be added here soon. This page will eventually
          include descriptions, pricing, checkout, and scheduling.
        </p>
      </section>

      <section className="intro-grid">
        <article className="intro-card">
          <h2>Natal Chart Reading</h2>
          <p>
            A personal look at core themes, strengths, patterns, and life
            direction through the birth chart.
          </p>
        </article>

        <article className="intro-card">
          <h2>Relationship Themes</h2>
          <p>
            A reflective reading focused on connection, compatibility, emotional
            patterns, and lessons between people.
          </p>
        </article>

        <article className="intro-card">
          <h2>Timing & Transits</h2>
          <p>
            A reading focused on current or upcoming astrological timing,
            transitions, opportunities, and challenges.
          </p>
        </article>
      </section>
    </main>
  );
}
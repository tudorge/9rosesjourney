import Link from "next/link";

export default function Home() {
  return (
    <main className="site-main home-page">
      <section className="hero-section">
        <p className="eyebrow">Astrology • Reflection • Personal Guidance</p>

        <h1>Find meaning in the patterns guiding your journey.</h1>

        <p className="hero-copy">
          9 Roses Journey is a home for astrology readings, spiritual insight,
          and thoughtful guidance for people seeking clarity, timing, and deeper
          self-understanding.
        </p>

        <div className="hero-actions">
          <Link href="/readings" className="primary-button">
            Explore Readings
          </Link>

          <Link href="/join" className="secondary-button">
            Join the List
          </Link>
        </div>
      </section>

      <section className="intro-grid" aria-label="Site features">
        <article className="intro-card">
          <h2>Astrology Readings</h2>
          <p>
            Personal readings will be available here soon, including options for
            natal chart insight, relationship themes, timing, and life direction.
          </p>
        </article>

        <article className="intro-card">
          <h2>Book a Session</h2>
          <p>
            Scheduling will be added later so visitors can choose available times
            for live or personalized readings.
          </p>
        </article>

        <article className="intro-card">
          <h2>Reflections & Releases</h2>
          <p>
            Future content can be prepared ahead of time and released on a
            programmed schedule for moon phases, transits, and special dates.
          </p>
        </article>
      </section>
    </main>
  );
}
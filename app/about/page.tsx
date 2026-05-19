import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="site-main about-page">
      <section className="page-hero">
        <p className="eyebrow">About</p>

        <h1>A quiet space for astrology-centered guidance.</h1>

        <p className="hero-copy">
          9 Roses Journey is being created as a warm, reflective home for
          astrology readings, personal insight, and meaningful guidance through
          life&apos;s changing seasons.
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

      <section className="intro-grid" aria-label="About 9 Roses Journey">
        <article className="intro-card">
          <p className="card-kicker">Purpose</p>
          <h2>Finding language for the patterns</h2>
          <p>
            This site is designed to help visitors find insight, perspective,
            and clearer language for the emotional, spiritual, and practical
            patterns moving through their lives.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Approach</p>
          <h2>Grounded, warm, and reflective</h2>
          <p>
            The tone stays intuitive and meaningful without becoming gimmicky.
            Astrology is treated as a tool for reflection, timing, and deeper
            self-understanding.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Direction</p>
          <h2>Built one step at a time</h2>
          <p>
            Readings, intake forms, scheduling, newsletters, and timed content
            releases will be added gradually as the site grows into a fuller
            home for the work.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">The Spirit</p>
          <h2>Soft, thoughtful, and intentionally personal.</h2>
        </div>

        <p>
          9 Roses Journey is meant to feel peaceful, beautiful, and trustworthy:
          a place where visitors can slow down, reflect, and explore guidance
          without pressure or noise. The design should feel mystical enough to
          be special, but clear enough to feel grounded.
        </p>
      </section>
    </main>
  );
}
import Link from "next/link";

export default function JoinPage() {
  return (
    <main className="site-main join-page">
      <section className="page-hero">
        <p className="eyebrow">Join the List</p>

        <h1>Receive thoughtful astrology notes and reading updates.</h1>

        <p className="hero-copy">
          Join the 9 Roses Journey list for future reading announcements,
          seasonal reflections, astrology notes, and updates as new offerings
          become available.
        </p>

        <div className="hero-actions">
          <Link href="/readings" className="primary-button">
            Explore Readings
          </Link>

          <Link href="/about" className="secondary-button">
            Learn About the Approach
          </Link>
        </div>
      </section>

      <section className="intro-grid" aria-label="What to expect">
        <article className="intro-card">
          <p className="card-kicker">Updates</p>
          <h2>Reading announcements</h2>
          <p>
            Be notified when reading options, booking details, and future
            astrology services become available.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Reflections</p>
          <h2>Seasonal astrology notes</h2>
          <p>
            Future emails may include moon phase reflections, transit themes,
            seasonal timing, and gentle prompts for self-reflection.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Tone</p>
          <h2>Quiet, thoughtful, intentional</h2>
          <p>
            The list should feel like a calm note arriving at the right moment,
            not another noisy stream of promotion.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Coming Soon</p>
          <h2>The signup form will be connected next.</h2>
        </div>

        <p>
          This page is ready for the public presentation layer. The next
          functional step will be connecting an email list provider or simple
          signup form so visitors can actually join the list.
        </p>
      </section>
    </main>
  );
}
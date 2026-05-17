export default function JoinPage() {
  return (
    <main className="site-main">
      <section className="hero-section">
        <p className="eyebrow">Newsletter</p>

        <h1>Join the Journey</h1>

        <p className="hero-copy">
          Sign up for updates, astrology reflections, future reading
          announcements, and seasonal notes from 9 Roses Journey.
        </p>
      </section>

      <section className="intro-grid">
        <article className="intro-card">
          <h2>Newsletter Coming Soon</h2>
          <p>
            The signup form will be added here later once we connect the site to
            an email list provider.
          </p>
        </article>

        <article className="intro-card">
          <h2>Reflections</h2>
          <p>
            Future emails may include astrology reflections, moon phase notes,
            transit themes, and updates on available readings.
          </p>
        </article>

        <article className="intro-card">
          <h2>No Spam</h2>
          <p>
            This should feel thoughtful and intentional, not like another noisy
            mailing list.
          </p>
        </article>
      </section>
    </main>
  );
}
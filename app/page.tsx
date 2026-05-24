import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="site-main home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Astrology • Reflection • Personal Guidance</p>

          <h1>Find meaning in the patterns guiding your journey.</h1>

          <p className="hero-copy">
            9rosesjourney offers personal astrology readings for people
            seeking clarity, timing, and deeper self-understanding.
          </p>

          <div className="hero-actions">
            <Link href="/readings" className="primary-button">
              Work with me
            </Link>

            <Link href="/join" className="secondary-button">
              Join the List
            </Link>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <Image
            src="/branding/cosmic-roses-hero.png"
            alt=""
            width={720}
            height={720}
            priority
            className="hero-art-image"
          />
        </div>
      </section>

      <section className="guide-section" aria-label="Astrology guidance by Larisa">
        <div className="guide-portrait-frame">
          <Image
            src="/images/larisa.jpg"
            alt="Larisa, astrology guide for 9 Roses Journey"
            width={320}
            height={430}
            className="guide-portrait"
          />
        </div>

        <div className="guide-section-content">
          <p className="eyebrow">Guided by Larisa</p>

          <h2>Personal astrology guidance for reflection, timing, and clarity.</h2>

          <p>
            Astrology readings to help you reflect on where you are, understand
            the timing around you, and move forward with greater clarity.
          </p>
        </div>
      </section>

      <section className="intro-grid" aria-label="Site features">
        <article className="intro-card">
          <h2>Astrology Readings</h2>
          <p>
            A personal session focused on your birth chart, current timing, life
            themes, questions, and the patterns shaping your journey.
          </p>
        </article>

        <article className="intro-card">
          <h2>Work with me</h2>
          <p>
            Booking will open soon through a secure scheduling and payment flow,
            with readings paid ahead of time when the appointment is scheduled.
          </p>
        </article>

        <article className="intro-card">
          <h2>Reflections & Updates</h2>
          <p>
            Join the list for astrology reflections, moon phase notes, future
            reading announcements, and seasonal guidance.
          </p>
        </article>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Astrology Guidance & Personal Readings",
  description:
    "Request a personal astrology reading with Larisa, including birth chart guidance, timing insight, astrocartography, and relocation astrology.",
};

export default function ReadingsPage() {
  return (
    <main className="site-main readings-page">
      <section className="page-hero">
        <p className="eyebrow">Personal Astrology Guidance</p>

        <h1>Request a personal astrology reading with Larisa.</h1>

        <p className="hero-copy">
          A one-on-one astrology reading for clarity, timing, reflection, birth
          chart insight, and deeper understanding of the patterns shaping your
          current journey.
        </p>

        <div className="hero-actions">
          <Link href="/schedule" className="primary-button">
            Schedule a Reading
          </Link>

          <Link href="/astrocartography" className="secondary-button">
            Explore Astrocartography
          </Link>
        </div>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Beginning the Process</p>
          <h2>Your reading begins with what you are ready to understand.</h2>
        </div>

        <p>
          When you submit your request, Larisa receives your birth details and
          the question or life area you would like to explore. She reviews each
          request personally so the reading can be prepared with care before
          scheduling is opened.
        </p>

        <div className="hero-actions">
          <Link href="/schedule" className="primary-button">
            Start Your Request
          </Link>

          <Link href="/about" className="secondary-button">
            Learn About Larisa
          </Link>
        </div>
      </section>

      <section className="intro-grid" aria-label="Astrology reading options">
        <article className="intro-card">
          <p className="card-kicker">Personal session</p>
          <h2>Birth Chart Reading</h2>
          <p>
            A private reading focused on your natal chart, current timing, life
            themes, questions, and areas where you are seeking greater clarity.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Astrology of place</p>
          <h2>Astrocartography Reading</h2>
          <p>
            A relocation astrology session focused on your astrocartography map,
            relocation chart, travel, moving, career direction, relationship
            themes, and places that may better support your path.
          </p>

          <Link href="/astrocartography" className="text-link">
            Learn more about astrocartography
          </Link>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Prepared in advance</p>
          <h2>Birth Details</h2>
          <p>
            You will be asked for your date of birth, time of birth if known,
            place of birth, and the main question or life area you would like
            the reading to focus on.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Reading Focus</p>
          <h2>Choose the question you want to explore.</h2>
        </div>

        <p>
          Your reading can focus on personal direction, relationships, timing,
          career growth, emotional clarity, relocation astrology, or a specific
          life decision. Larisa prepares for each session using your birth
          details and the main question you bring to the reading.
        </p>
      </section>

      <section className="intro-grid" aria-label="Reading themes">
        <article className="intro-card">
          <h2>Clarity & Timing</h2>
          <p>
            Reflect on the timing around your current life chapter and the
            larger patterns shaping your choices, challenges, and opportunities.
          </p>
        </article>

        <article className="intro-card">
          <h2>Moving & Travel</h2>
          <p>
            Explore relocation astrology and astrocartography for questions
            about where to live, where to travel, and which places may support
            growth, healing, love, or a stronger sense of home.
          </p>
        </article>

        <article className="intro-card">
          <h2>Relationships & Direction</h2>
          <p>
            Look at relationship themes, personal growth, career direction,
            emotional needs, and the patterns that may be asking for more
            awareness.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Instagram</p>
          <h2>Follow Larisa on Instagram.</h2>
        </div>

        <p>
          For astrology reflections, updates, and new reading availability,
          follow Larisa at 9rosesjourney.
        </p>

        <div className="hero-actions">
          <a
            href="https://www.instagram.com/9rosesjourney/"
            className="primary-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow Larisa on Instagram
          </a>

          <Link href="/schedule" className="secondary-button">
            Schedule a Reading
          </Link>
        </div>
      </section>
    </main>
  );
}
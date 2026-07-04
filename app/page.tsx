import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Astrology Guidance, Birth Chart Readings & Relocation Astrology",
  description:
    "Private astrology guidance with Larisa, including birth chart readings, astrocartography, and relocation astrology for clarity, timing, travel, moving, and life direction.",
};

export default function Home() {
  return (
    <main className="site-main home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">
            Astrology • Birth Chart Readings • Relocation Astrology
          </p>

          <h1>Find meaning in the patterns guiding your journey.</h1>

          <p className="hero-copy">
            9 Roses Journey offers personal astrology guidance with Larisa,
            including birth chart readings, timing insight, and relocation
            astrology for people seeking clarity, direction, and deeper
            self-understanding.
          </p>

          <div className="hero-actions">
            <Link href="/schedule" className="primary-button">
              Schedule a Reading
            </Link>

            <Link href="/astrocartography" className="secondary-button">
              Explore Astrocartography
            </Link>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <Image
            src="/images/9roses-logo-emblem-v2.png"
            alt=""
            width={720}
            height={720}
            priority
            className="hero-art-image"
          />
        </div>
      </section>

      <section
        className="guide-section"
        aria-label="Astrology guidance by Larisa"
      >
        <div className="guide-portrait-frame">
          <Image
            src="/images/Larisa portret2.png"
            alt="Larisa, astrology guide for birth chart and relocation astrology readings"
            width={320}
            height={430}
            className="guide-portrait"
          />
        </div>

        <div className="guide-section-content">
          <p className="eyebrow">Guided by Larisa</p>

          <h2>
            Personal astrology guidance for reflection, timing, and clarity.
          </h2>

          <p>
            Astrology readings to help you reflect on where you are, understand
            the timing around you, and move forward with greater clarity. Larisa
            also offers relocation astrology and astrocartography insight for
            questions about travel, moving, belonging, career direction, and
            places that may support your next chapter.
          </p>
        </div>

        <div className="guide-certification-frame">
          <Image
            src="/images/relocation-astrologer-certification.jpg"
            alt="Certified Relocation Astrologer certification badge"
            width={260}
            height={260}
            className="guide-certification"
          />
        </div>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Astrocartography & Relocation Astrology</p>
          <h2>Explore how your birth chart connects with place.</h2>
        </div>

        <p>
          Astrocartography, also called locational astrology or relocation
          astrology, maps your natal chart across the world. It can help you
          reflect on where to live, where to travel, where career growth may be
          supported, and which places may feel more aligned with love,
          confidence, healing, or feeling at home.
        </p>

        <div className="hero-actions">
          <Link href="/astrocartography" className="primary-button">
            Learn About Astrocartography
          </Link>

          <Link href="/schedule" className="primary-button">
            Schedule a Reading
          </Link>
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
          <h2>Relocation Astrology</h2>
          <p>
            Explore your astrocartography map and relocation chart for insight
            into moving, travel, career direction, relationships, emotional
            security, and places that may feel more supportive.
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

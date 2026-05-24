import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="site-main about-page about-page-wide">
      <section className="about-feature-single" aria-label="About Larisa">
        <div className="about-feature-intro">
          <p className="eyebrow">About Larisa</p>

          <h1>A life shaped by travel, intuition, and the call of the stars.</h1>

          <p>
            Larisa&apos;s work blends astrology, astrocartography, travel, and
            lived experience into guidance for people searching for clarity,
            belonging, and a deeper connection to place.
          </p>
        </div>

        <div className="about-large-image-wrap">
          <Image
            src="/images/Larisa-plaja.jpg"
            alt="Larisa standing by the sea"
            width={1400}
            height={1000}
            className="about-large-image"
            priority
          />
        </div>

        <div className="about-story-text">
          <p className="about-opening-line">
            My soul has always been tethered to the stars and the call of the
            horizon.
          </p>

          <p>
            As an explorer, I spent years traversing the globe in search of the
            place where my spirit truly belonged. During that time, I gathered
            profound travel experiences that now serve my astrocartography work
            — long before I even knew that was the path they were preparing me
            for.
          </p>

          <p>
            My compass led me to Southeast Asia. In the vibrant night markets,
            hidden sanctuaries, and beautiful remote beaches, I found a place
            that felt profoundly like home. That deep cross-cultural connection
            opened a new chapter in my life. I stepped into the kitchen,
            channeling my love for the region into a career as an Asian fusion
            chef. For years, my restaurant became a beautiful, sensory
            expression of my travels.
          </p>

          <p>
            But some chapters close so new ones can begin. My Sagittarius Moon
            — always seeking freedom, truth, expression, and new horizons —
            called me back to my first love. After fully closing the kitchen
            doors, I entered my truest era. I am now immersed in astrology and
            astrocartography.
          </p>

          <p>
            Today, I travel the world not only as an explorer of places, but as
            an explorer of the cosmos and human connection. I use my
            understanding of world cultures, personal transformation, and the
            wisdom of the sky to help others find their own place of belonging.
          </p>

          <p>
            By mapping the sky in harmony with the Earth, I guide travelers
            toward the coordinates where their soul can awaken, expand, and feel
            at home.
          </p>
        </div>
      </section>

      <section className="intro-grid" aria-label="About 9 Roses Journey">
        <article className="intro-card">
          <p className="card-kicker">Astrocartography</p>
          <h2>Finding meaning through place</h2>
          <p>
            Astrocartography connects astrology with geography, helping reveal
            the places that may support growth, clarity, belonging, love,
            purpose, or transformation.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Travel</p>
          <h2>Guidance shaped by real experience</h2>
          <p>
            Larisa&apos;s work is shaped not only by charts, but by years of
            travel, cultural immersion, and firsthand experience with the way
            different places can change how life feels.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Purpose</p>
          <h2>Helping others find belonging</h2>
          <p>
            9 Roses Journey is here for people seeking deeper insight into where
            they are, where they are going, and where their spirit may feel most
            alive.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">The Spirit</p>
          <h2>Mapping the sky in harmony with the Earth.</h2>
        </div>

        <p>
          The heart of this work is personal, reflective, and deeply connected
          to the lived experience of travel. The goal is not just to point to a
          place on a map, but to help each person understand why certain places
          may call to them — and what those places may awaken.
        </p>
      </section>
    </main>
  );
}
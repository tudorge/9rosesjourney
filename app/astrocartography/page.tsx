import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Astrocartography & Relocation Astrology | 9 Roses Journey",
  description:
    "Explore your astrocartography map and relocation chart with Larisa to understand places that may support love, career growth, travel, healing, and feeling at home.",
};

export default function AstrocartographyPage() {
  return (
    <main className="site-main readings-page">
      <section className="page-hero">
        <p className="eyebrow">Astrocartography • Relocation Astrology</p>

        <h1>Discover the places that may support your next chapter.</h1>

        <p className="hero-copy">
          An astrocartography and relocation astrology reading explores how your
          birth chart connects with place, helping you reflect on where to live,
          travel, work, heal, love, and feel more at home.
        </p>

        <div className="hero-actions">
          <Link href="/readings" className="primary-button">
            Schedule a Reading
          </Link>

          <Link href="/about" className="secondary-button">
            Learn About Larisa
          </Link>
        </div>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Astrology of Place</p>
          <h2>Your birth chart is connected to time — and place.</h2>
        </div>

        <p>
          Astrocartography, also known as locational astrology or relocation
          astrology, maps your natal chart across the world. It can help you
          understand how different cities, countries, and travel destinations may
          activate themes already present in your birth chart.
        </p>

        <p>
          This kind of reading can be especially helpful when you are thinking
          about moving, planning meaningful travel, exploring career growth,
          seeking relationship insight, or wondering why certain places feel
          easier, heavier, exciting, healing, or deeply familiar.
        </p>
      </section>

      <section className="intro-grid" aria-label="Astrocartography reading themes">
        <article className="intro-card">
          <p className="card-kicker">Moving & belonging</p>
          <h2>Where should I move?</h2>
          <p>
            Explore places that may support emotional security, grounding,
            healing, visibility, confidence, or a stronger sense of home through
            your relocation chart and astrocartography map.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Career & direction</p>
          <h2>Career growth and visibility</h2>
          <p>
            Your Sun, Jupiter, Mars, Saturn, and MC lines can reveal themes
            around leadership, opportunity, discipline, drive, responsibility,
            recognition, and long-term professional growth.
          </p>
        </article>

        <article className="intro-card">
          <p className="card-kicker">Love & relationships</p>
          <h2>Relationship insight by place</h2>
          <p>
            Venus, Moon, DC, and other relationship-focused lines can help you
            reflect on connection, romance, emotional openness, attraction,
            partnership patterns, and the places where love may feel different.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Map Interpretation</p>
          <h2>What the planetary lines can show.</h2>
        </div>

        <p>
          In an astrocartography reading, Larisa may look at your Sun, Moon,
          Venus, Jupiter, Mars, Saturn, Chiron, AC, DC, MC, and IC lines. These
          placements can describe different experiences of confidence, love,
          career opportunity, emotional safety, healing, ambition, pressure, and
          belonging.
        </p>

        <p>
          The reading may also include relocation charts, local space lines,
          paran lines, intersecting astrocartography lines, and remote
          activation, depending on your question and the places you are
          considering.
        </p>
      </section>

      <section className="intro-grid" aria-label="Planetary line meanings">
        <article className="intro-card">
          <h2>Sun, Moon & Venus Lines</h2>
          <p>
            Sun lines can emphasize confidence, leadership, and visibility. Moon
            lines may speak to emotions, security, family, healing, and feeling
            at home. Venus lines often bring attention to love, beauty,
            attraction, relationships, and ease.
          </p>
        </article>

        <article className="intro-card">
          <h2>Jupiter, Mars & Saturn Lines</h2>
          <p>
            Jupiter lines may point toward growth, opportunity, confidence, and
            abundance. Mars lines can bring energy, passion, action, and drive.
            Saturn lines often ask for discipline, responsibility, grounding,
            patience, and serious work.
          </p>
        </article>

        <article className="intro-card">
          <h2>AC, DC, MC & IC Lines</h2>
          <p>
            AC lines can shape identity and how you enter the world. DC lines
            highlight partnership and relationship themes. MC lines relate to
            public life and career direction. IC lines connect with home, roots,
            family, privacy, and inner security.
          </p>
        </article>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Common Questions</p>
          <h2>Astrocartography FAQ</h2>
        </div>

        <div>
          <h3>What is astrocartography?</h3>
          <p>
            Astrocartography is a form of astrology that maps your birth chart
            across the world, showing places where different planetary themes may
            become more active in your life.
          </p>

          <h3>How is relocation astrology different from a birth chart reading?</h3>
          <p>
            A birth chart reading focuses on your natal chart as a whole.
            Relocation astrology looks at how that same chart may express itself
            differently in specific places.
          </p>

          <h3>Can astrocartography help me decide where to move?</h3>
          <p>
            It can offer symbolic insight into places that may support certain
            life themes, such as career growth, relationships, healing, emotional
            security, or visibility. It does not replace practical research, but
            it can add a meaningful layer to the decision.
          </p>

          <h3>Can this help with travel planning or digital nomad life?</h3>
          <p>
            Yes. Astrocartography can be useful when comparing travel
            destinations, temporary stays, remote work locations, retreats, or
            places you feel drawn to without fully knowing why.
          </p>
        </div>
      </section>

      <section className="content-panel">
        <div>
          <p className="eyebrow">Schedule a Reading</p>
          <h2>Explore your map with Larisa.</h2>
        </div>

        <p>
          If you are considering a move, planning travel, exploring a major life
          transition, or wondering which places may better support your path, an
          astrocartography reading can help you reflect with more clarity.
        </p>

        <div className="hero-actions">
          <Link href="/readings" className="primary-button">
            Schedule a Reading
          </Link>

          <Link href="/join" className="secondary-button">
            Join the List
          </Link>
        </div>
      </section>
    </main>
  );
}
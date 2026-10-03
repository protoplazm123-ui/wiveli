"use client";

import WiveliAbout from "./components/WiveliAbout";

import HomeAccount from "./components/HomeAccount";

import WiveliUnifiedHero from "./components/WiveliUnifiedHero";

const experiences = [
  {
    title: "Wish Note",
    tag: "365 DAYS · 365 WISHES",
    text: "A year of little wishes, one day at a time.",
    symbol: "♡",
    href: "/experiences/wish-note",
  },
  {
    title: "Our Story",
    tag: "YOUR STORY · YOUR MOMENTS",
    text: "Turn your favorite memories into an interactive story.",
    symbol: "♥",
    href: "/experiences/our-story",
  },
  {
    title: "Open When...",
    tag: "A LITTLE BOOK OF CARE",
    text: "A handmade journal of notes, memories, and surprises for their everyday moments.",
    symbol: "✉",
    href: "/experiences/open-when",
  },
  {
    title: "Love Coupons",
    tag: "LITTLE PROMISES · BIG MEMORIES",
    text: "Create personal coupons for dates, surprises and special moments.",
    symbol: "✦",
    href: "/experiences/love-coupons",
  },
  {
  
    title: "The Gift",
    tag: "ANSWER · UNLOCK · REVEAL",
    text: "Answer personal questions and unlock photos, letters, videos and real surprises.",
    symbol: "✦",
    href: "/experiences/the-gift/personalize",
  },
  {
  title: "Unique Gift",
  tag: "WIVELI BESPOKE · MADE JUST FOR THEM",
  text: "Your wish. Our creation. Let our team create a completely unique experience for someone special.",
  symbol: "✦",
  href: "/experiences/unique-gift",
  premium: true,
},
];

export default function Home() {
  return (
    <main>

      {/* ================= HEADER ================= */}

      <header className="header">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <nav>
          <a href="#gifts">Gifts</a>
          <a href="#how">How It Works</a>
          <a href="#ideas">Ideas</a>
          <a href="#about">About</a>
        </nav>

       <div className="headerActions">
  <HomeAccount />

  <a className="primary small" href="#ideas">
    Create a Gift →
  </a>
</div>
      </header>
      <style jsx>{`
        @media (max-width: 600px) {
          .header { height: auto; min-height: 76px; flex-wrap: wrap; gap: 12px; padding-top: 12px; padding-bottom: 12px; }
          .headerActions { display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end; gap: 10px; max-width: 100%; }
          .headerActions .primary.small { font-size: 10px; padding: 12px; white-space: nowrap; }
        }
      `}</style>


      {/* ================= HERO ================= */}

      <WiveliUnifiedHero />

      {/* ================= EXPERIENCES ================= */}

      <section className="experiences" id="ideas">

        <div className="experienceHeading">

          <p className="eyebrow">
            WIVELI EXPERIENCES
          </p>

          <h2>
            PICK A FEELING.
            <br />
            MAKE IT YOURS.
          </h2>

          <p className="experienceIntro">
            Start with an experience,
            personalize it with your story,
            and turn it into a gift made
            for one person only.
          </p>

        </div>


        <div className="experienceGrid">

          {experiences.map((experience, index) => (

            <article
  className={`experienceCard ${
    experience.premium ? "experienceCardPremium" : ""
  }`}
  key={experience.title}
>
  {experience.premium && (
    <div className="premiumBadge">
      ✦ WIVELI BESPOKE
    </div>
  )}

              <div className="experienceVisual">

                <span className="experienceNumber">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="experienceIcon">
                  {experience.symbol}
                </span>

              </div>


              <div className="experienceContent">

                <p>
                  {experience.tag}
                </p>

                <h3>
                  {experience.title}
                </h3>

                <span>
                  {experience.text}
                </span>

                <a
                  className="experienceExplore"
                  href={experience.href}
                >
                  Explore →
                </a>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <WiveliAbout />

      {/* ================= FOOTER ================= */}

      <footer>

        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <p>
          Wish + loVE + LIfe
        </p>

        <p>
          © 2026 WIVELI
        </p>

      </footer>

    </main>
  );
}


"use client";

import WiveliHero from "./components/WiveliHero";

const categories = [
  {
    title: "For Someone Special",
    text: "Love notes, stories, memories and more",
    symbol: "♡",
  },
  {
    title: "Birthday",
    text: "Make their day unforgettable",
    symbol: "✦",
  },
  {
    title: "For Two",
    text: "Shared games, questions and memories",
    symbol: "∞",
  },
  {
    title: "For Friends",
    text: "Fun ideas for your favorite people",
    symbol: "☺",
  },
  {
    title: "Just Because",
    text: "Turn an ordinary day into something special",
    symbol: "♥",
  },
  {
    title: "Memories",
    text: "Photo stories, quizzes and timelines",
    symbol: "◌",
  },
];

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
    title: "Memory Box",
    tag: "KEEP THE GOOD STUFF",
    text: "Collect photos, messages and favorite moments in one little place.",
    symbol: "□",
    href: "/experiences/memory-box",
  },
  {
    title: "The Gift",
    tag: "ANSWER · UNLOCK · REVEAL",
    text: "Answer personal questions and unlock photos, letters, videos and real surprises.",
    symbol: "✦",
    href: "/experiences/the-gift/personalize",
  },
];

export default function Home() {
  return (
    <main>
      {/* HEADER */}
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
          <button className="login">Log in</button>

          <a className="primary small" href="#ideas">
            Create a Gift →
          </a>
        </div>
      </header>

      {/* NEW HERO */}
      <WiveliHero />

      {/* CATEGORIES */}
      <section className="categories" id="gifts">
        <div className="sectionTop">
          <div>
            <p className="eyebrow">FIND THE PERFECT WAY</p>

            <h2>What will you create?</h2>
          </div>

          <a href="#ideas">See all experiences →</a>
        </div>

        <div className="categoryGrid">
          {categories.map((category) => (
            <article
              className="categoryCard"
              key={category.title}
            >
              <span className="categorySymbol">
                {category.symbol}
              </span>

              <div>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
              </div>

              <span className="arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      {/* EXPERIENCES */}
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
              className="experienceCard"
              key={experience.title}
            >
              <div className="experienceVisual">
                <span className="experienceNumber">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="experienceIcon">
                  {experience.symbol}
                </span>
              </div>

              <div className="experienceContent">
                <p>{experience.tag}</p>

                <h3>{experience.title}</h3>

                <span>{experience.text}</span>

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

      {/* ABOUT */}
      <section className="meaning" id="about">
        <div className="meaningCopy">
          <p className="eyebrow">
            A MORE MEANINGFUL WAY
          </p>

          <h2>
            MORE THAN
            <br />
            A GIFT.
            <br />
            <span>A FEELING.</span>
          </h2>

          <p>
            WIVELI helps you turn your thoughts,
            memories and emotions into interactive
            digital experiences — made for the people
            who matter most.
          </p>

          <a className="primary" href="#ideas">
            Create Your Gift →
          </a>
        </div>

        <div className="phone">
          <div className="phoneTop" />

          <p className="phoneMini">
            FOR SOMEONE SPECIAL
          </p>

          <div className="phoneHeart">♥</div>

          <h3>
            A little world
            <br />
            made for you.
          </h3>

          <button>OPEN YOUR GIFT</button>
        </div>

        <div className="features">
          <div>
            <span>01</span>
            <h3>Personal & Unique</h3>
            <p>
              Every gift is made around your story.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Quick & Easy</h3>
            <p>
              Create something meaningful without
              designing from scratch.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Perfect for Any Occasion</h3>
            <p>
              Birthdays, anniversaries, friendship
              or no reason at all.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <p>Wish + loVE + LIfe</p>
        <p>© 2026 WIVELI</p>
      </footer>
    </main>
  );
}

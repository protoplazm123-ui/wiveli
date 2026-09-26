"use client";

import WiveliHero from "./components/WiveliHero";

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
          <button className="login">Log in</button>

          <a className="primary small" href="#ideas">
            Create a Gift →
          </a>
        </div>
      </header>


      {/* ================= HERO ================= */}

      <WiveliHero />


      {/* ================= FLOATING EXPERIENCES ================= */}

      <section className="wiveliCreateSection" id="gifts">

        {/* background glow */}

        <div className="wiveliCreateGlow wiveliCreateGlowOne" />
        <div className="wiveliCreateGlow wiveliCreateGlowTwo" />


        {/* LEFT TITLE */}

        <div className="wiveliCreateHeading">

          <p>FIND THE PERFECT WAY</p>

          <h2>
            What will
            <br />
            you create?
          </h2>

          <a href="#ideas">
            See all experiences <span>→</span>
          </a>

        </div>


        {/* FLOATING CARDS */}

        <div className="wiveliFloatingExperiences">


          {/* SOMEONE SPECIAL */}

          <a
            href="#ideas"
            className="wiveliExperienceFloat wiveliFloatSpecial"
          >
            <div className="wiveliExperienceIcon">
              ♡
            </div>

            <div className="wiveliExperienceContent">
              <h3>For Someone Special</h3>

              <p>
                Love notes, stories,
                <br />
                memories and more
              </p>
            </div>

            <span className="wiveliCardArrow">
              ↗
            </span>
          </a>


          {/* BIRTHDAY */}

          <a
            href="#ideas"
            className="wiveliExperienceFloat wiveliFloatBirthday"
          >
            <div className="wiveliExperienceIcon">
              ✦
            </div>

            <div className="wiveliExperienceContent">
              <h3>Birthday</h3>

              <p>
                Make their day
                <br />
                unforgettable
              </p>
            </div>

            <span className="wiveliCardArrow">
              ↗
            </span>
          </a>


          {/* FOR TWO */}

          <a
            href="#ideas"
            className="wiveliExperienceFloat wiveliFloatTwo"
          >
            <div className="wiveliExperienceIcon">
              ∞
            </div>

            <div className="wiveliExperienceContent">
              <h3>For Two</h3>

              <p>
                Shared games, questions
                <br />
                and memories
              </p>
            </div>

            <span className="wiveliCardArrow">
              ↗
            </span>
          </a>


          {/* FRIENDS */}

          <a
            href="#ideas"
            className="wiveliExperienceFloat wiveliFloatFriends"
          >
            <div className="wiveliExperienceIcon">
              ☺
            </div>

            <div className="wiveliExperienceContent">
              <h3>For Friends</h3>

              <p>
                Fun ideas for your
                <br />
                favorite people
              </p>
            </div>

            <span className="wiveliCardArrow">
              ↗
            </span>
          </a>


          {/* JUST BECAUSE */}

          <a
            href="#ideas"
            className="wiveliExperienceFloat wiveliFloatBecause"
          >
            <div className="wiveliExperienceIcon">
              ✧
            </div>

            <div className="wiveliExperienceContent">
              <h3>Just Because</h3>

              <p>
                Turn an ordinary day
                <br />
                into something special
              </p>
            </div>

            <span className="wiveliCardArrow">
              ↗
            </span>
          </a>


          {/* MEMORIES */}

          <a
            href="#ideas"
            className="wiveliExperienceFloat wiveliFloatMemories"
          >
            <div className="wiveliExperienceIcon">
              ◌
            </div>

            <div className="wiveliExperienceContent">
              <h3>Memories</h3>

              <p>
                Photo stories, quizzes
                <br />
                and timelines
              </p>
            </div>

            <span className="wiveliCardArrow">
              ↗
            </span>
          </a>

        </div>

      </section>


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

          <a
            className="primary"
            href="#ideas"
          >
            Create Your Gift →
          </a>

        </div>


        {/* PHONE */}

        <div className="phone">

          <div className="phoneTop" />

          <p className="phoneMini">
            FOR SOMEONE SPECIAL
          </p>

          <div className="phoneHeart">
            ♥
          </div>

          <h3>
            A little world
            <br />
            made for you.
          </h3>

          <button>
            OPEN YOUR GIFT
          </button>

        </div>


        {/* FEATURES */}

        <div className="features">

          <div>
            <span>01</span>

            <h3>
              Personal & Unique
            </h3>

            <p>
              Every gift is made around your story.
            </p>
          </div>


          <div>
            <span>02</span>

            <h3>
              Quick & Easy
            </h3>

            <p>
              Create something meaningful without
              designing from scratch.
            </p>
          </div>


          <div>
            <span>03</span>

            <h3>
              Perfect for Any Occasion
            </h3>

            <p>
              Birthdays, anniversaries, friendship
              or no reason at all.
            </p>
          </div>

        </div>

      </section>


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

"use client";

import { useEffect, useRef, useState } from "react";

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

const heroCards = [
  { title: "Wish Note", symbol: "♡" },
  { title: "Our Story", symbol: "♥" },
  { title: "Open When...", symbol: "✉" },
  { title: "Love Coupons", symbol: "✦" },
  { title: "Memory Box", symbol: "□" },
  { title: "The Gift", symbol: "✧" },
];

function Boy({ stopped }) {
  return (
    <div className={`wiveliPerson ${stopped ? "stopped" : "walking"}`}>
      <svg viewBox="0 0 240 520" aria-hidden="true">
        <g className="head">
          <circle cx="120" cy="78" r="49" fill="#F1C3AA" />

          <path
            d="M73 78C68 39 91 17 121 19C155 20 174 45 166 82C151 65 135 57 115 57C98 57 84 65 73 78Z"
            fill="#25202B"
          />

          <circle cx="136" cy="78" r="3.5" fill="#27222A" />

          <path
            d="M141 94C149 98 155 97 160 93"
            stroke="#A86C62"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        <g className="body">
          <path
            d="M76 143Q120 119 164 143L170 301H68Z"
            fill="#F3EFF6"
          />

          <path
            d="M82 148Q120 169 158 148"
            fill="none"
            stroke="#D9D0E4"
            strokeWidth="6"
          />

          <path
            d="M70 294H169L176 418H128L119 326L108 418H60Z"
            fill="#292A37"
          />
        </g>

        <g className="armBack">
          <path
            d="M81 157Q54 204 58 263"
            stroke="#F3EFF6"
            strokeWidth="30"
            strokeLinecap="round"
            fill="none"
          />

          <circle cx="58" cy="265" r="13" fill="#F1C3AA" />
        </g>

        <g className="armFront">
          <path
            d="M159 158Q178 202 190 250"
            stroke="#F3EFF6"
            strokeWidth="30"
            strokeLinecap="round"
            fill="none"
          />

          <circle cx="191" cy="254" r="13" fill="#F1C3AA" />
        </g>

        <g className="legLeft">
          <path
            d="M91 405L77 480"
            stroke="#292A37"
            strokeWidth="37"
            strokeLinecap="round"
          />

          <path
            d="M55 482H101"
            stroke="#F6F4F4"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </g>

        <g className="legRight">
          <path
            d="M145 405L158 480"
            stroke="#292A37"
            strokeWidth="37"
            strokeLinecap="round"
          />

          <path
            d="M138 482H183"
            stroke="#F6F4F4"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

function Girl({ stopped }) {
  return (
    <div className={`wiveliPerson ${stopped ? "stopped" : "walking"}`}>
      <svg viewBox="0 0 240 520" aria-hidden="true">
        <g className="head">
          <circle cx="120" cy="79" r="48" fill="#F1C5B1" />

          <circle cx="161" cy="48" r="29" fill="#563735" />

          <path
            d="M74 80C72 41 95 18 129 21C158 24 174 46 169 79C151 64 136 57 117 57C99 57 86 65 74 80Z"
            fill="#563735"
          />

          <circle cx="101" cy="79" r="3.5" fill="#27222A" />

          <path
            d="M79 94C87 99 94 99 101 94"
            stroke="#A86C68"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        <g className="body">
          <path
            d="M76 143Q120 120 164 143L170 300H68Z"
            fill="#F5EFF7"
          />

          <path
            d="M70 294H169L178 418H128L119 326L108 418H59Z"
            fill="#C8B8D2"
          />
        </g>

        <g className="armBack">
          <path
            d="M81 157Q57 207 53 260"
            stroke="#F5EFF7"
            strokeWidth="30"
            strokeLinecap="round"
            fill="none"
          />

          <circle cx="53" cy="263" r="13" fill="#F1C5B1" />
        </g>

        <g className="armFront">
          <path
            d="M159 158Q142 207 105 245"
            stroke="#F5EFF7"
            strokeWidth="30"
            strokeLinecap="round"
            fill="none"
          />

          <circle cx="101" cy="249" r="13" fill="#F1C5B1" />
        </g>

        <g className="legLeft">
          <path
            d="M91 405L77 480"
            stroke="#C8B8D2"
            strokeWidth="37"
            strokeLinecap="round"
          />

          <path
            d="M55 482H101"
            stroke="#F6F4F4"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </g>

        <g className="legRight">
          <path
            d="M145 405L158 480"
            stroke="#C8B8D2"
            strokeWidth="37"
            strokeLinecap="round"
          />

          <path
            d="M138 482H183"
            stroke="#F6F4F4"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

function WalkingHero() {
  const heroRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = null;

    const update = () => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const total = heroRef.current.offsetHeight - window.innerHeight;

      const value = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(total, 1))
      );

      setProgress(value);
    };

    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", update);

    return () => {
      if (frame) cancelAnimationFrame(frame);

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  const walk = Math.min(progress / 0.72, 1);
  const stopped = walk > 0.96;

  const gift =
    Math.max(0, Math.min(1, (progress - 0.69) / 0.16));

  const finish =
    Math.max(0, Math.min(1, (progress - 0.82) / 0.15));

  return (
    <section ref={heroRef} className="walkingHero">
      <div className="walkingHeroSticky">
        <div className="heroTiny">
          DIGITAL GIFTS · REAL FEELINGS
        </div>

        <div className="bigHeroWords">
          <span>MAKE IT</span>
          <span>PERSONAL.</span>
        </div>

        <div
          className="heroCardsRow"
          style={{
            transform: `translateX(calc(-50% + ${
              progress * -35
            }px))`,
          }}
        >
          {heroCards.map((card, index) => (
            <a
              key={card.title}
              className="heroGlassCard"
              href={experiences[index].href}
            >
              <small>
                {String(index + 1).padStart(2, "0")}
              </small>

              <span className="glassSymbol">
                {card.symbol}
              </span>

              <strong>{card.title}</strong>
            </a>
          ))}
        </div>

        <div className="charactersStage">
          <div
            className="boyPosition"
            style={{
              transform: `translateX(${walk * 31}vw)`,
            }}
          >
            <Boy stopped={stopped} />
          </div>

          <div
            className="girlPosition"
            style={{
              transform: `translateX(${walk * -31}vw)`,
            }}
          >
            <Girl stopped={stopped} />
          </div>

          <div
            className="meetingGift"
            style={{
              opacity: gift,
              transform: `
                translate(-50%, ${35 - gift * 35}px)
                scale(${0.55 + gift * 0.45})
              `,
            }}
          >
            <span>♡</span>

            <i className="ribbonVertical" />
            <i className="ribbonHorizontal" />
          </div>
        </div>

        <div
          className="heroFinish"
          style={{
            opacity: finish,
            transform: `translate(-50%, ${
              18 - finish * 18
            }px)`,
          }}
        >
          <p>
            TURN A FEELING INTO SOMETHING
            <br />
            THEY CAN ACTUALLY EXPERIENCE.
          </p>

          <a href="#ideas">
            EXPLORE THE GIFTS →
          </a>
        </div>

        <div
          className="scrollMessage"
          style={{
            opacity: 1 - Math.min(progress * 4, 1),
          }}
        >
          SCROLL TO BRING THEM TOGETHER ↓
        </div>
      </div>

      <style jsx global>{`
        .walkingHero {
          position: relative;
          height: 230vh;
          background: #8f7de0;
        }

        .walkingHeroSticky {
          position: sticky;
          top: 0;
          height: 100vh;
          min-height: 680px;
          overflow: hidden;
          background: #8f7de0;
          color: #fff;
          isolation: isolate;
        }

        .heroTiny {
          position: absolute;
          z-index: 30;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.25em;
          white-space: nowrap;
          opacity: 0.72;
        }

        .bigHeroWords {
          position: absolute;
          z-index: 1;
          top: 7%;
          left: 50%;
          width: 96%;
          transform: translateX(-50%);
          text-align: center;
          color: #dcd7ff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(105px, 13vw, 220px);
          font-weight: 700;
          line-height: 0.68;
          letter-spacing: -0.075em;
          pointer-events: none;
          user-select: none;
        }

        .bigHeroWords span {
          display: block;
        }

        .heroCardsRow {
          position: absolute;
          z-index: 3;
          top: 44%;
          left: 50%;
          display: flex;
          gap: 10px;
          transition: transform 0.12s linear;
        }

        .heroGlassCard {
          width: clamp(130px, 14vw, 220px);
          height: clamp(190px, 19vw, 280px);
          flex: 0 0 auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 24px;
          color: #fff;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.23),
            rgba(190, 205, 255, 0.1)
          );
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          text-decoration: none;
        }

        .heroGlassCard small {
          font-size: 8px;
          letter-spacing: 0.13em;
          opacity: 0.7;
        }

        .glassSymbol {
          display: grid;
          place-items: center;
          height: 90px;
          color: #ffd5f1;
          font-family: Georgia, serif;
          font-size: clamp(42px, 5vw, 75px);
        }

        .heroGlassCard strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(14px, 1.5vw, 23px);
          font-weight: 400;
        }

        .charactersStage {
          position: absolute;
          z-index: 10;
          inset: 0;
          pointer-events: none;
        }

        .boyPosition,
        .girlPosition {
          position: absolute;
          bottom: 0;
          will-change: transform;
        }

        .boyPosition {
          left: 2%;
        }

        .girlPosition {
          right: 2%;
        }

        .wiveliPerson {
          width: clamp(170px, 20vw, 315px);
          transform-origin: center bottom;
        }

        .wiveliPerson svg {
          display: block;
          width: 100%;
          overflow: visible;
        }

        .wiveliPerson.walking {
          animation: bodyBounce 0.46s ease-in-out infinite;
        }

        .wiveliPerson .legLeft,
        .wiveliPerson .legRight,
        .wiveliPerson .armFront,
        .wiveliPerson .armBack {
          transform-box: fill-box;
        }

        .wiveliPerson.walking .legLeft {
          transform-origin: top center;
          animation: legOne 0.46s ease-in-out infinite;
        }

        .wiveliPerson.walking .legRight {
          transform-origin: top center;
          animation: legTwo 0.46s ease-in-out infinite;
        }

        .wiveliPerson.walking .armFront {
          transform-origin: top center;
          animation: armOne 0.46s ease-in-out infinite;
        }

        .wiveliPerson.walking .armBack {
          transform-origin: top center;
          animation: armTwo 0.46s ease-in-out infinite;
        }

        .wiveliPerson.stopped .armFront {
          transform-origin: top center;
          transform: rotate(-25deg);
          transition: transform 0.55s ease;
        }

        .girlPosition .wiveliPerson.stopped .armFront {
          transform: rotate(24deg);
        }

        @keyframes bodyBounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes legOne {
          0%,
          100% {
            transform: rotate(13deg);
          }

          50% {
            transform: rotate(-13deg);
          }
        }

        @keyframes legTwo {
          0%,
          100% {
            transform: rotate(-13deg);
          }

          50% {
            transform: rotate(13deg);
          }
        }

        @keyframes armOne {
          0%,
          100% {
            transform: rotate(-9deg);
          }

          50% {
            transform: rotate(9deg);
          }
        }

        @keyframes armTwo {
          0%,
          100% {
            transform: rotate(9deg);
          }

          50% {
            transform: rotate(-9deg);
          }
        }

        .meetingGift {
          position: absolute;
          z-index: 20;
          left: 50%;
          bottom: 32%;
          width: clamp(68px, 7vw, 110px);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 17px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.7),
            rgba(255, 188, 231, 0.62),
            rgba(182, 216, 255, 0.65)
          );
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          will-change: transform, opacity;
        }

        .meetingGift span {
          position: relative;
          z-index: 4;
          color: #fff;
          font-family: Georgia, serif;
          font-size: 34px;
        }

        .ribbonVertical,
        .ribbonHorizontal {
          position: absolute;
          display: block;
          background: rgba(255, 255, 255, 0.55);
        }

        .ribbonVertical {
          top: 0;
          left: 43%;
          width: 14%;
          height: 100%;
        }

        .ribbonHorizontal {
          top: 43%;
          left: 0;
          width: 100%;
          height: 14%;
        }

        .heroFinish {
          position: absolute;
          z-index: 40;
          left: 50%;
          bottom: 5%;
          width: min(90%, 500px);
          text-align: center;
          transition: opacity 0.15s linear;
        }

        .heroFinish p {
          margin: 0 0 15px;
          font-size: 8px;
          font-weight: 800;
          line-height: 1.6;
          letter-spacing: 0.18em;
        }

        .heroFinish a {
          display: inline-flex;
          min-height: 48px;
          padding: 0 25px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          color: #fff;
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          text-decoration: none;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .scrollMessage {
          position: absolute;
          z-index: 30;
          left: 28px;
          bottom: 25px;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        @media (max-width: 900px) {
          .bigHeroWords {
            top: 10%;
            font-size: clamp(80px, 16vw, 140px);
          }

          .heroCardsRow {
            width: max-content;
          }

          .heroGlassCard {
            width: 145px;
            height: 210px;
          }

          .boyPosition {
            left: -7%;
          }

          .girlPosition {
            right: -7%;
          }
        }

        @media (max-width: 600px) {
          .walkingHero {
            height: 190vh;
          }

          .walkingHeroSticky {
            min-height: 650px;
          }

          .heroTiny {
            top: 18px;
            font-size: 6px;
          }

          .bigHeroWords {
            top: 9%;
            font-size: clamp(58px, 19vw, 88px);
            line-height: 0.74;
          }

          .heroCardsRow {
            top: 41%;
            gap: 7px;
            opacity: 0.78;
          }

          .heroGlassCard {
            width: 92px;
            height: 145px;
            padding: 10px;
            border-radius: 16px;
          }

          .heroGlassCard:first-child,
          .heroGlassCard:last-child {
            display: none;
          }

          .glassSymbol {
            height: 50px;
            font-size: 33px;
          }

          .heroGlassCard strong {
            font-size: 10px;
          }

          .wiveliPerson {
            width: clamp(130px, 41vw, 175px);
          }

          .boyPosition {
            left: -17%;
          }

          .girlPosition {
            right: -17%;
          }

          .meetingGift {
            bottom: 31%;
          }

          .scrollMessage {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wiveliPerson,
          .wiveliPerson *,
          .heroCardsRow {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default function Home() {
  return (
    <main>
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

      <WalkingHero />

      <section className="categories" id="gifts">
        <div className="sectionTop">
          <div>
            <p className="eyebrow">
              FIND THE PERFECT WAY
            </p>

            <h2>What will you create?</h2>
          </div>

          <a href="#ideas">
            See all experiences →
          </a>
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

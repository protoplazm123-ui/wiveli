"use client";

import { useMemo, useState } from "react";

const memories = [
  {
    id: 1,
    date: "SEPTEMBER 18, 2023",
    eyebrow: "WHERE IT ALL BEGAN",
    title: "The day we met",
    text: "Some days look ordinary at first. Then somehow they become the beginning of everything.",
    symbol: "♡",
    position: { left: "16%", top: "64%" },
  },
  {
    id: 2,
    date: "DECEMBER 02, 2023",
    eyebrow: "OUR FIRST ADVENTURE",
    title: "A day I still remember",
    text: "One of those moments I wish I could put in my pocket and keep forever.",
    symbol: "✦",
    position: { left: "34%", top: "37%" },
  },
  {
    id: 3,
    date: "APRIL 21, 2024",
    eyebrow: "SOMEWHERE SPECIAL",
    title: "Our place",
    text: "It was never really about the place. It became special because we were there together.",
    symbol: "♥",
    position: { left: "54%", top: "59%" },
  },
  {
    id: 4,
    date: "AUGUST 14, 2025",
    eyebrow: "ONE OF MY FAVORITES",
    title: "Just us",
    text: "Nothing extraordinary had to happen. Being there with you was already enough.",
    symbol: "∞",
    position: { left: "73%", top: "32%" },
  },
  {
    id: 5,
    date: "RIGHT NOW",
    eyebrow: "AND HERE WE ARE",
    title: "Still writing our story",
    text: "We made it all the way here. And somehow this still feels like only the beginning.",
    symbol: "♡",
    position: { left: "88%", top: "57%" },
  },
];

export default function OurStory() {
  const [started, setStarted] = useState(false);
  const [activeMemory, setActiveMemory] = useState(null);

  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => ({
        id: index,
        left: `${(index * 37 + 11) % 100}%`,
        top: `${(index * 61 + 7) % 100}%`,
        size: 1 + ((index * 13) % 3),
        delay: `${((index * 17) % 40) / 10}s`,
        opacity: 0.2 + (((index * 19) % 60) / 100),
      })),
    []
  );

  return (
    <main className={`ourStoryExperience ${started ? "journeyStarted" : ""}`}>
      <div className="storySpaceBackground" aria-hidden="true">
        {stars.map((star) => (
          <i
            key={star.id}
            className="storySpaceStar"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              opacity: star.opacity,
            }}
          />
        ))}

        <div className="storyNebula storyNebulaOne" />
        <div className="storyNebula storyNebulaTwo" />
        <div className="storyNebula storyNebulaThree" />
      </div>

      {!started ? (
        <section className="storyOpening">
          <header className="storyExperienceHeader">
            <a className="storyExperienceLogo" href="/">
              WI<span>♥</span>ELI
            </a>

            <span>OUR STORY</span>
          </header>

          <div className="storyOpeningContent">
            <p className="storyOpeningFor">A LITTLE JOURNEY FOR YOU ♡</p>

            <div className="storyOpeningCard">
              <div className="storyOpeningGlow" />

              <div className="storyOpeningPhoto">
                <span>YOUR PHOTO</span>
              </div>

              <p className="storyOpeningTiny">OUR STORY · 2023 — FOREVER</p>

              <h1>
                LET'S REMEMBER
                <br />
                <em>OUR STORY.</em>
              </h1>

              <p className="storyOpeningMessage">
                Let&apos;s remember our wonderful journey together —
                the little moments, the unforgettable ones, and
                everything that brought us here.
              </p>

              <button
                type="button"
                className="storyBeginButton"
                onClick={() => setStarted(true)}
              >
                BEGIN OUR JOURNEY <span>→</span>
              </button>
            </div>

            <p className="storyOpeningFrom">MADE WITH LOVE · JUST FOR YOU</p>
          </div>
        </section>
      ) : (
        <section className="storyUniverse">
          <header className="storyUniverseHeader">
            <button
              type="button"
              onClick={() => {
                setStarted(false);
                setActiveMemory(null);
              }}
            >
              ← CLOSE
            </button>

            <div className="storyExperienceLogo">
              WI<span>♥</span>ELI
            </div>

            <span>OUR STORY</span>
          </header>

          <div className="storyJourneyIntro">
            <p>THIS IS WHERE OUR STORY BEGAN</p>

            <h1>
              EVERY STAR
              <br />
              <em>HOLDS A MEMORY.</em>
            </h1>

            <span>Follow our journey →</span>
          </div>

          <div className="storyJourney">
            <svg
              className="storyJourneyLine"
              viewBox="0 0 1600 620"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M60 420 C220 500 300 150 520 235 C700 305 720 500 910 365 C1080 245 1110 125 1280 205 C1400 260 1460 380 1560 345"
                fill="none"
                stroke="rgba(210,174,255,.17)"
                strokeWidth="1.5"
                strokeDasharray="4 12"
              />

              <path
                className="storyJourneyLineGlow"
                d="M60 420 C220 500 300 150 520 235 C700 305 720 500 910 365 C1080 245 1110 125 1280 205 C1400 260 1460 380 1560 345"
                fill="none"
                stroke="rgba(207,163,255,.45)"
                strokeWidth="1"
              />
            </svg>

            {memories.map((memory, index) => (
              <div
                className="memoryStarInteractionLayer"
                key={memory.id}
                style={{
                  left: memory.position.left,
                  top: memory.position.top,
                }}
              >
                <button
                  type="button"
                  className="memoryStarButton"
                  onClick={() => setActiveMemory(memory)}
                  aria-label={`Open memory: ${memory.title}`}
                >
                  <span className="memoryStarHalo" />
                  <span className="memoryStarCore">{memory.symbol}</span>
                  <span className="memoryStarPulse" />
                </button>

                <div className="memoryStarLabel">
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{memory.eyebrow}</strong>
                  <span>{memory.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="storyFuture">
            <div className="storyFutureOrbit storyFutureOrbitOne" />
            <div className="storyFutureOrbit storyFutureOrbitTwo" />

            <div className="storyFutureGlow" />

            <p>AND HERE WE ARE ♡</p>

            <h2>
              THE REST IS
              <br />
              <em>STILL UNWRITTEN.</em>
            </h2>

            <span>
              There&apos;s still so much of our universe left to discover.
            </span>

            <div className="storyFutureInfinity">∞</div>
          </div>

          <p className="storyUniverseHint">
            CLICK A STAR TO OPEN A MEMORY
          </p>
        </section>
      )}

      {activeMemory && (
        <div
          className="storyMemoryOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveMemory(null);
            }
          }}
        >
          <article className="storyMemoryModal">
            <button
              type="button"
              className="storyMemoryClose"
              onClick={() => setActiveMemory(null)}
              aria-label="Close memory"
            >
              ×
            </button>

            <div className="storyMemoryVisual">
              <div className="storyMemoryVisualGlow" />
              <span>YOUR MEMORY</span>
            </div>

            <div className="storyMemoryContent">
              <p>{activeMemory.eyebrow}</p>

              <span className="storyMemoryDate">
                {activeMemory.date}
              </span>

              <h2>{activeMemory.title}</h2>

              <div className="storyMemoryDivider">
                <span>{activeMemory.symbol}</span>
              </div>

              <blockquote>
                “{activeMemory.text}”
              </blockquote>

              <button
                type="button"
                onClick={() => setActiveMemory(null)}
              >
                CONTINUE OUR JOURNEY →
              </button>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

const memories = [
  {
    number: "01",
    label: "THE BEGINNING",
    date: "SEPTEMBER 26 · 2024",
    title: (
      <>
        THE DAY
        <br />
        IT ALL BEGAN.
      </>
    ),
    text:
      "I still remember this moment like it was yesterday. I didn't know yet how many beautiful memories would come after it.",
    note: "My favorite beginning. ♡",
  },
  {
    number: "02",
    label: "OUR FIRST ADVENTURE",
    date: "NOVEMBER 08 · 2024",
    title: (
      <>
        OUR FIRST
        <br />
        ADVENTURE.
      </>
    ),
    text:
      "Somewhere along the way, an ordinary day became one of those memories I knew I would want to keep forever.",
    note: "I'd go there with you all over again. ♡",
  },
];

const flightStars = [
  ["12%", "18%", "2px", "0s"],
  ["24%", "34%", "3px", ".3s"],
  ["38%", "12%", "2px", ".7s"],
  ["62%", "20%", "2px", ".2s"],
  ["78%", "14%", "3px", ".9s"],
  ["89%", "32%", "2px", ".5s"],
  ["15%", "62%", "3px", ".8s"],
  ["31%", "76%", "2px", ".1s"],
  ["46%", "58%", "2px", ".6s"],
  ["68%", "72%", "3px", ".4s"],
  ["82%", "63%", "2px", "1s"],
  ["92%", "79%", "2px", ".2s"],
  ["7%", "43%", "2px", ".5s"],
  ["55%", "87%", "2px", ".8s"],
  ["72%", "45%", "2px", ".15s"],
  ["35%", "91%", "3px", ".65s"],
  ["96%", "51%", "2px", ".35s"],
  ["51%", "31%", "2px", ".95s"],
  ["19%", "88%", "2px", ".45s"],
  ["84%", "91%", "3px", ".75s"],
];

const futureStars = Array.from({ length: 90 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  size: `${1 + (index % 4)}px`,
  delay: `${(index % 12) * 0.12}s`,
}));

export default function OurStoryGift() {
  const [opened, setOpened] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);

  const [flightStage, setFlightStage] = useState("idle");

  const [currentMemory, setCurrentMemory] = useState(0);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryLeaving, setMemoryLeaving] = useState(false);

  const [travellingBetweenMemories, setTravellingBetweenMemories] =
    useState(false);

  const [futureOpen, setFutureOpen] = useState(false);
  const [collageOpen, setCollageOpen] = useState(false);

  const memory = memories[currentMemory];

  const beginJourney = () => {
    setJourneyStarted(true);
    setFlightStage("launch");
  };

const openMemory = () => {
  setMemoryLeaving(false);
  setMemoryOpen(true);
};
  const continueJourney = () => {
    const hasNextMemory = currentMemory < memories.length - 1;

    if (hasNextMemory) {
      setMemoryLeaving(true);

      setTimeout(() => {
        setMemoryOpen(false);
        setMemoryLeaving(false);

        setCurrentMemory((previous) => previous + 1);

        setTravellingBetweenMemories(true);
        setFlightStage("launch");
      }, 1100);

      return;
    }

    /* LAST MEMORY → FUTURE */

    setMemoryLeaving(true);

    setTimeout(() => {
      setMemoryOpen(false);
      setMemoryLeaving(false);
      setFutureOpen(true);
    }, 1100);
  };

  const openCollage = () => {
    setCollageOpen(true);
  };

  useEffect(() => {
    if (flightStage !== "launch") return;

    const flyingTimer = setTimeout(() => {
      setFlightStage("flying");
    }, 1400);

    const arrivalTimer = setTimeout(() => {
      setFlightStage("arrival");
    }, 6500);

    const landedTimer = setTimeout(() => {
      setFlightStage("landed");
      setTravellingBetweenMemories(false);
    }, 9000);

    return () => {
      clearTimeout(flyingTimer);
      clearTimeout(arrivalTimer);
      clearTimeout(landedTimer);
    };
  }, [flightStage]);

  return (
    <main
      className={[
        "ourStoryGift",
        opened ? "isOpened" : "",
        journeyStarted ? "journeyStarted" : "",
        memoryOpen ? "memoryIsOpen" : "",
        memoryLeaving ? "memoryIsLeaving" : "",
        travellingBetweenMemories ? "betweenMemories" : "",
        futureOpen ? "futureIsOpen" : "",
        collageOpen ? "collageIsOpen" : "",
        `flight-${flightStage}`,
      ].join(" ")}
    >
      {/* =====================================================
          OPENING VIDEO
          ===================================================== */}

      <div className="ourStoryOpeningVideo" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="auto">
          <source
            src="/assets/our-story/334401%20(1).mp4"
            type="video/mp4"
          />
        </video>

        <div className="ourStoryOpeningShade" />
      </div>

      {/* =====================================================
          OPENING SPACE
          ===================================================== */}

      <div className="ourStorySpace" aria-hidden="true">
        <div className="ourStoryStars starsOne" />
        <div className="ourStoryStars starsTwo" />
        <div className="ourStoryStars starsThree" />

        <div className="ourStoryGlow glowOne" />
        <div className="ourStoryGlow glowTwo" />

        <span className="ourStoryStar starA">✦</span>
        <span className="ourStoryStar starB">✦</span>
        <span className="ourStoryStar starC">✦</span>
      </div>

      {/* =====================================================
          ENVELOPE + LETTER
          ===================================================== */}

      <section className="ourStoryIntro">
        <p className="ourStoryLabel">
          SOMETHING WAS LEFT HERE FOR YOU
        </p>

        <div className="ourStoryEnvelopeScene">
          <div className="ourStoryLetter">
            <p className="letterSmall">FOR YOU ♡</p>

            <h1>
              Let&apos;s remember
              <br />
              our beautiful journey
              <br />
              together.
            </h1>

            <div className="letterLine" />

            <p className="letterText">
              I want to take you through some of the moments
              that became the most important to me — the little
              memories, the feelings, and all the things about
              you I never want to forget.
            </p>

            <p className="letterEnding">
              There&apos;s a whole universe
              <br />
              I want to show you.
            </p>

            <button
              type="button"
              className="beginJourney"
              onClick={beginJourney}
            >
              BEGIN OUR JOURNEY
              <span>→</span>
            </button>
          </div>

          <button
            type="button"
            className="ourStoryEnvelope"
            onClick={() => setOpened(true)}
            aria-label="Open your letter"
          >
            <div className="envelopeBack" />
            <div className="envelopeInside" />

            <div className="envelopeFront">
              <div className="envelopeFrontLeft" />
              <div className="envelopeFrontRight" />
              <div className="envelopeFrontBottom" />
            </div>

            <div className="envelopeFlap">
              <div className="envelopeFlapInner" />
            </div>

            <div className="envelopeSeal">
              <span>♡</span>
            </div>

            <div className="envelopeName">
              <span>FOR YOU</span>
              <strong>♡</strong>
            </div>
          </button>
        </div>

        <button
          type="button"
          className="tapToOpen"
          onClick={() => setOpened(true)}
        >
          {opened ? "YOUR LETTER ♡" : "TAP TO OPEN"}
        </button>

        <p className="ourStoryMade">
          OUR STORY · MADE WITH WIVELI
        </p>
      </section>

      {/* =====================================================
          JOURNEY UNIVERSE
          ===================================================== */}

      <section className="journeyUniverse">
        <video
          className="journeyVideo journeyCalmVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="/assets/our-story/334401%20(1).mp4"
            type="video/mp4"
          />
        </video>

        <video
          className="journeyVideo journeyFlightVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="/assets/our-story/15340202_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>

        <div className="journeyVideoOverlay" />
        <div className="journeyLight" />

        {/* FLIGHT STARS */}

        <div className="flightStars" aria-hidden="true">
          {flightStars.map(([left, top, size, delay], index) => (
            <span
              key={`${currentMemory}-${index}`}
              style={{
                "--star-left": left,
                "--star-top": top,
                "--star-size": size,
                "--star-delay": delay,
              }}
            />
          ))}
        </div>

        {/* DESTINATION STAR */}

        <div className="destinationStar" aria-hidden="true">
          <div className="destinationHalo haloOuter" />
          <div className="destinationHalo haloMiddle" />
          <div className="destinationHalo haloInner" />
          <div className="destinationStarCore">✦</div>
        </div>

        {/* FLIGHT MESSAGE */}

        <div className="flightMessage">
          <p>
            {currentMemory === 0
              ? "OUR JOURNEY BEGINS"
              : "THE JOURNEY CONTINUES"}
          </p>

          <span>
            {currentMemory === 0
              ? "FOLLOW THE LIGHT"
              : `DESTINATION ${memory.number}`}
          </span>
        </div>

        {/* ===================================================
            CURRENT DESTINATION
            =================================================== */}

        <div
          className="journeyBeginning"
          key={`destination-${currentMemory}`}
        >
          <p>
            {currentMemory === 0
              ? "OUR STORY"
              : `MEMORY ${memory.number}`}
          </p>

          <h2>
            {currentMemory === 0 ? (
              <>
                EVERY UNIVERSE
                <br />
                HAS A BEGINNING.
              </>
            ) : (
              <>
                ANOTHER STAR
                <br />
                IN OUR STORY.
              </>
            )}
          </h2>
<span>
  {currentMemory === 0
    ? "Let's go back to ours."
    : "You found another memory."}
</span>

<button
  type="button"
  aria-label={`Open memory ${memory.number}`}
  onClick={openMemory}
  style={{
    width: "110px",
    height: "110px",
    minWidth: "110px",
    minHeight: "110px",

    margin: "18px auto 10px",
    padding: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    position: "relative",
    zIndex: 999999,

    border: "none",
    outline: "none",
    background: "transparent",

    color: "#ffffff",
    fontSize: "64px",
    lineHeight: 1,

    cursor: "pointer",
    pointerEvents: "auto",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",

    filter:
      "drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 24px rgba(220,190,255,.95)) drop-shadow(0 0 55px rgba(190,140,255,.75))",
  }}
>
  ✦
</button>

<small>
  {memory.number} · {memory.label}
</small>         
        </div>
{/* ===================================================
    INTERACTIVE MEMORY STAR
    Separate layer so nothing can block the click
    =================================================== */}

     {/* ===================================================
            CURRENT MEMORY
            =================================================== */}

        <section
          className="storyMemory"
          key={`memory-${currentMemory}`}
        >
          <div
            className="storyMemoryGlow"
            aria-hidden="true"
          />

          <div className="storyMemoryCard">
            <div className="storyMemoryNumber">
              <span>MEMORY</span>
              <strong>{memory.number}</strong>
            </div>

            <div className="storyMemoryPhoto">
              <div className="storyMemoryPhotoPlaceholder">
                <span>♡</span>
                <small>YOUR PHOTO</small>
              </div>

              <div className="storyMemoryPhotoShine" />
            </div>

            <div className="storyMemoryContent">
              <p className="storyMemoryDate">
                {memory.date}
              </p>

              <h2>{memory.title}</h2>

              <p className="storyMemoryText">
                {memory.text}
              </p>

              <p className="storyMemoryHandwriting">
                {memory.note}
              </p>

              <button
                type="button"
                className="storyMemoryContinue"
                onClick={continueJourney}
              >
                {currentMemory < memories.length - 1
                  ? "CONTINUE THE JOURNEY"
                  : "SEE WHAT'S AHEAD"}

                <span>→</span>
              </button>
            </div>
          </div>

          <p className="storyMemoryOrbitText">
            {currentMemory === 0
              ? "ONE LITTLE MOMENT · ONE WHOLE UNIVERSE"
              : "ANOTHER MEMORY · ANOTHER STAR"}
          </p>
        </section>

        {/* ===================================================
            SMALL FUTURE INDICATOR
            =================================================== */}

        <div className="journeyFuture" aria-hidden="true">
          <span>✦</span>
          <span>·</span>
          <span>✦</span>
          <span>·</span>
          <span>✦</span>
        </div>

        {/* ===================================================
            FUTURE UNIVERSE
            =================================================== */}

        <section className="ourStoryFutureScene">
          <div className="futureUniverse" aria-hidden="true">
            {futureStars.map((star, index) => (
              <span
                key={index}
                style={{
                  "--future-x": star.left,
                  "--future-y": star.top,
                  "--future-size": star.size,
                  "--future-delay": star.delay,
                }}
              />
            ))}
          </div>

          <div className="futureUniverseGlow" />

          <div className="futureMessage">
            <p>THIS ISN&apos;T THE END.</p>

            <h2>
              AND THERE&apos;S STILL
              <br />
              SO MUCH MORE
              <br />
              TO DISCOVER.
            </h2>

            <span>
              Every little light is a memory
              <br />
              we haven&apos;t made yet.
            </span>

            <button
              type="button"
              className="futureContinue"
              onClick={openCollage}
            >
              LOOK BACK AT OUR JOURNEY
              <strong>→</strong>
            </button>
          </div>

          <p className="futureInfinity">∞</p>
        </section>

        {/* ===================================================
            JOURNEY COLLAGE
            =================================================== */}

        <section className="journeyCollage">
          <div className="collageSpace" aria-hidden="true">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>

          <div className="collageHeading">
            <p>OUR JOURNEY SO FAR</p>

            <h2>
              LOOK AT ALL
              <br />
              WE&apos;VE FOUND.
            </h2>

            <span>
              A little universe made from us.
            </span>
          </div>

          <div className="memoryCollage">
            {memories.map((item, index) => (
              <article
                className={`collageMemory collageMemory${index + 1}`}
                key={item.number}
              >
                <div className="collagePhoto">
                  <span>♡</span>

                  <small>
                    MEMORY {item.number}
                  </small>
                </div>

                <div className="collageCaption">
                  <strong>{item.label}</strong>
                  <span>{item.date}</span>
                </div>
              </article>
            ))}

            <div className="collageCenter">
              <span>OUR STORY</span>
              <strong>∞</strong>
            </div>
          </div>

          {/* FINAL ACTIONS */}

          <div className="collageActions">
            <button
              type="button"
              className="collageSave"
            >
              <span>SAVE OUR STORY</span>
              <strong>↓</strong>
            </button>

            <button
              type="button"
              className="collageWatch"
            >
              <span>WATCH OUR JOURNEY</span>
              <strong>▶</strong>
            </button>
          </div>

          <p className="collageEnding">
            LET&apos;S KEEP EXPLORING TOGETHER ∞
          </p>

          <p className="collageBrand">
            OUR STORY · MADE WITH WIVELI
          </p>
        </section>
      </section>
    </main>
  );
}

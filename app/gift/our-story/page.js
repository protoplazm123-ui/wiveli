"use client";

import { useEffect, useState } from "react";

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

export default function OurStoryGift() {
  const [opened, setOpened] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [flightStage, setFlightStage] = useState("idle");

  const beginJourney = () => {
    setJourneyStarted(true);
    setFlightStage("launch");
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
        `flight-${flightStage}`,
      ].join(" ")}
    >
      {/* MOVING SPACE BEHIND THE ENVELOPE */}

      <div className="ourStoryOpeningVideo" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="/assets/our-story/334401%20(1).mp4"
            type="video/mp4"
          />
        </video>

        <div className="ourStoryOpeningShade" />
      </div>

      {/* OPENING SPACE DETAILS */}

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

      {/* ENVELOPE + LETTER */}

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

      {/* JOURNEY */}

      <section className="journeyUniverse">

        {/* CALM SPACE */}

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

        {/* BRIGHT FLIGHT */}

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

        {/* SMALL FLYING STARS */}

        <div className="flightStars" aria-hidden="true">
          {flightStars.map(([left, top, size, delay], index) => (
            <span
              key={index}
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
          <p>OUR JOURNEY BEGINS</p>
          <span>FOLLOW THE LIGHT</span>
        </div>

        {/* FIRST MEMORY */}

        <div className="journeyBeginning">
          <p>OUR STORY</p>

          <h2>
            EVERY UNIVERSE
            <br />
            HAS A BEGINNING.
          </h2>

          <span>Let&apos;s go back to ours.</span>

          <button
            type="button"
            className="journeyFirstStar"
            aria-label="Open the first memory"
          >
            ✦
          </button>

          <small>01 · THE BEGINNING</small>
        </div>

        {/* DISTANT FUTURE */}

        <div className="journeyFuture" aria-hidden="true">
          <span>✦</span>
          <span>·</span>
          <span>✦</span>
          <span>·</span>
          <span>✦</span>
        </div>
      </section>
    </main>
  );
}

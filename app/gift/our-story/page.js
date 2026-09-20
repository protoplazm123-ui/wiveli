"use client";

import { useState } from "react";

export default function OurStoryGift() {
  const [opened, setOpened] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);

  return (
    <main
      className={`ourStoryGift ${opened ? "isOpened" : ""} ${
        journeyStarted ? "journeyStarted" : ""
      }`}
    >
      {/* =========================================
          OPENING SPACE
          ========================================= */}

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

      {/* =========================================
          ENVELOPE + LETTER
          ========================================= */}

      <section className="ourStoryIntro">
        <p className="ourStoryLabel">
          SOMETHING WAS LEFT HERE FOR YOU
        </p>

        <div className="ourStoryEnvelopeScene">
          {/* LETTER */}

          <div className="ourStoryLetter">
            <p className="letterSmall">
              FOR YOU ♡
            </p>

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
              onClick={() => setJourneyStarted(true)}
            >
              BEGIN OUR JOURNEY
              <span>→</span>
            </button>
          </div>

          {/* ENVELOPE */}

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

      {/* =========================================
          JOURNEY UNIVERSE
          ========================================= */}

      <section className="journeyUniverse">
        {/* LIGHT TRANSITION */}

        <div className="journeyLight" />

        {/* DEPTH STARS */}

        <div className="journeyDepthStars journeyDepthOne" />
        <div className="journeyDepthStars journeyDepthTwo" />
        <div className="journeyDepthStars journeyDepthThree" />

        {/* DISTANT GALAXY */}

        <div className="journeyGalaxy">
          <div className="journeyGalaxyCore" />
        </div>

        {/* PATH */}

        <div className="journeyPath">
          <span className="journeyPathLine" />

          <span className="journeyPlanet planetOne">
            <i />
          </span>

          <span className="journeyPlanet planetTwo">
            <i />
          </span>

          <span className="journeyPlanet planetThree">
            <i />
          </span>
        </div>

        {/* FIRST DESTINATION */}

        <div className="journeyBeginning">
          <p>
            OUR STORY
          </p>

          <h2>
            EVERY UNIVERSE
            <br />
            HAS A BEGINNING.
          </h2>

          <span>
            Let&apos;s go back to ours.
          </span>

          <button
            type="button"
            className="journeyFirstStar"
            aria-label="Open the first memory"
          >
            ✦
          </button>

          <small>
            01 · THE BEGINNING
          </small>
        </div>

        {/* FUTURE */}

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

"use client";

import { useState } from "react";

export default function OurStoryGift() {
  const [opened, setOpened] = useState(false);

  return (
    <main className={`ourStoryGift ${opened ? "isOpened" : ""}`}>
      {/* SPACE */}
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

      {/* INTRO */}
      <section className="ourStoryIntro">
        <p className="ourStoryLabel">
          SOMETHING WAS LEFT HERE FOR YOU
        </p>

        <div className="ourStoryEnvelopeScene">
          {/* LETTER */}
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
              onClick={() => {
                alert("Next: our journey begins ✦");
              }}
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
    </main>
  );
}

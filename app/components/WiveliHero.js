"use client";

import { useEffect, useRef, useState } from "react";

const gifts = [
  { number: "01", icon: "♡", title: "Wish Note" },
  { number: "02", icon: "▣", title: "Our Story" },
  { number: "03", icon: "✉", title: "Open When..." },
  { number: "04", icon: "♧", title: "Love Coupons" },
  { number: "05", icon: "▧", title: "Memory Box" },
  { number: "06", icon: "✦", title: "The Gift" },
];

function Boy({ progress }) {
  const walking = progress < 0.82;

  return (
    <div
      className={`heroPerson heroBoy ${
        walking ? "isWalking" : "isStopped"
      }`}
      style={{
        "--walk-progress": progress,
      }}
    >
      <svg
        viewBox="0 0 220 500"
        aria-hidden="true"
      >
        <g className="personHead">
          <circle
            cx="110"
            cy="77"
            r="48"
            fill="#f2c6ad"
          />

          <path
            d="M64 78C60 35 88 15 119 20c34 5 52 32 44 64-13-17-29-25-48-26-20-1-35 7-51 20Z"
            fill="#29232d"
          />

          <circle cx="127" cy="76" r="3.5" fill="#25221f" />
          <path
            d="M132 91c8 4 14 3 20-1"
            stroke="#9f675d"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g className="boyBody">
          <path
            d="M70 140Q110 118 150 140L168 292H54Z"
            fill="#f1edf2"
          />

          <path
            d="M75 147Q110 171 145 147"
            stroke="#d7d0df"
            strokeWidth="6"
            fill="none"
          />

          <path
            d="M59 283H161L172 414H119L108 320 99 414H45Z"
            fill="#292b38"
          />
        </g>

        <g className="boyArmBack">
          <path
            d="M72 155Q39 205 55 266"
            stroke="#eeeaf0"
            strokeWidth="30"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g className="boyArmFront">
          <path
            d="M146 158Q167 208 184 238"
            stroke="#eeeaf0"
            strokeWidth="30"
            fill="none"
            strokeLinecap="round"
          />

          <circle
            cx="185"
            cy="244"
            r="13"
            fill="#f2c6ad"
          />
        </g>

        <g className="boyLegLeft">
          <path
            d="M80 400L66 472"
            stroke="#292b38"
            strokeWidth="35"
            strokeLinecap="round"
          />

          <path
            d="M45 472h55"
            stroke="#f3f1ee"
            strokeWidth="21"
            strokeLinecap="round"
          />
        </g>

        <g className="boyLegRight">
          <path
            d="M133 400L148 472"
            stroke="#292b38"
            strokeWidth="35"
            strokeLinecap="round"
          />

          <path
            d="M128 472h55"
            stroke="#f3f1ee"
            strokeWidth="21"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

function Girl({ progress }) {
  const walking = progress < 0.82;

  return (
    <div
      className={`heroPerson heroGirl ${
        walking ? "isWalking" : "isStopped"
      }`}
      style={{
        "--walk-progress": progress,
      }}
    >
      <svg
        viewBox="0 0 220 500"
        aria-hidden="true"
      >
        <g className="personHead">
          <circle
            cx="110"
            cy="78"
            r="47"
            fill="#f3c7b2"
          />

          <circle
            cx="141"
            cy="41"
            r="29"
            fill="#5a3734"
          />

          <path
            d="M66 78c0-39 25-62 59-58 29 4 45 27 42 57-18-16-34-22-52-21-18 0-33 8-49 22Z"
            fill="#5a3734"
          />

          <circle cx="92" cy="77" r="3.5" fill="#25221f" />

          <path
            d="M70 92c8 6 15 6 22 1"
            stroke="#a96867"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g className="girlBody">
          <path
            d="M69 141Q110 119 151 141L164 290H57Z"
            fill="#f3edf4"
          />

          <path
            d="M61 282H159L174 415H122L110 320 98 415H46Z"
            fill="#c5b9c9"
          />
        </g>

        <g className="girlArmBack">
          <path
            d="M75 157Q53 206 47 253"
            stroke="#f1eaf2"
            strokeWidth="29"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g className="girlArmFront">
          <path
            d="M145 158Q124 208 91 240"
            stroke="#f1eaf2"
            strokeWidth="29"
            fill="none"
            strokeLinecap="round"
          />

          <circle
            cx="87"
            cy="244"
            r="13"
            fill="#f3c7b2"
          />
        </g>

        <g className="girlLegLeft">
          <path
            d="M82 400L68 472"
            stroke="#c5b9c9"
            strokeWidth="35"
            strokeLinecap="round"
          />

          <path
            d="M47 472h54"
            stroke="#f3f1ee"
            strokeWidth="21"
            strokeLinecap="round"
          />
        </g>

        <g className="girlLegRight">
          <path
            d="M135 400L149 472"
            stroke="#c5b9c9"
            strokeWidth="35"
            strokeLinecap="round"
          />

          <path
            d="M129 472h54"
            stroke="#f3f1ee"
            strokeWidth="21"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

export default function WiveliHero() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;

    const update = () => {
      if (!sectionRef.current) return;

      const rect =
        sectionRef.current.getBoundingClientRect();

      const distance =
        sectionRef.current.offsetHeight -
        window.innerHeight;

      const current =
        Math.min(
          1,
          Math.max(
            0,
            -rect.top / Math.max(distance, 1)
          )
        );

      setProgress(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);

      frame =
        requestAnimationFrame(update);
    };

    update();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "resize",
        update
      );
    };
  }, []);

  const walkProgress =
    Math.min(progress / 0.72, 1);

  const giftProgress =
    Math.min(
      Math.max(
        (progress - 0.68) / 0.22,
        0
      ),
      1
    );

  return (
    <section
      ref={sectionRef}
      className="walkHero"
    >
      <div className="walkHeroSticky">

        <div className="walkHeroLabel">
          DIGITAL GIFTS · REAL FEELINGS
        </div>

        <div className="walkHeroTitle">
          <span>
            MAKE IT
          </span>

          <span>
            PERSONAL.
          </span>
        </div>

        <div className="walkCards">
          {gifts.map((gift) => (
            <div
              className="walkGlassCard"
              key={gift.number}
            >
              <small>
                {gift.number}
              </small>

              <div className="walkCardIcon">
                {gift.icon}
              </div>

              <strong>
                {gift.title}
              </strong>
            </div>
          ))}
        </div>

        <div className="walkStage">

          <div
            className="boyTrack"
            style={{
              "--p": walkProgress,
            }}
          >
            <Boy
              progress={walkProgress}
            />
          </div>

          <div
            className="girlTrack"
            style={{
              "--p": walkProgress,
            }}
          >
            <Girl
              progress={walkProgress}
            />
          </div>

          <div
            className="heroGift"
            style={{
              "--gift": giftProgress,
            }}
          >
            <div className="giftRibbonVertical" />
            <div className="giftRibbonHorizontal" />

            <span>
              ♡
            </span>
          </div>
        </div>

        <div
          className="walkHeroBottom"
          style={{
            opacity:
              progress > 0.78
                ? 1
                : 0,
          }}
        >
          <p>
            TURN A FEELING INTO SOMETHING
            THEY CAN ACTUALLY EXPERIENCE.
          </p>

          <a href="#ideas">
            EXPLORE ALL GIFTS →
          </a>
        </div>

        <div className="scrollHint">
          SCROLL TO BRING THEM TOGETHER ↓
        </div>
      </div>
    </section>
  );
}

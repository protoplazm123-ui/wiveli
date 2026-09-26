"use client";

import { useMemo, useState } from "react";

const gift = {
  recipient: "Sophie",
  sender: "Alex",

  openingLetter:
    "I wanted to remind you of some of the best moments I remember with you. The little things, the places, and the days I never want to forget. So I put some of them here — just for us.",

  theme: "stars",

  finalMessage:
    "There are still so many places to see, things to do, and moments waiting for us. The rest is ours to write.",

  memories: [
    {
      id: 1,
      title: "How We Met",
      date: "18 SEP 2023",
      place: "Kyiv, Ukraine",
      text: "Some days look ordinary at first. Then somehow they become the beginning of everything.",
      symbol: "♡",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 2,
      title: "Our First Adventure",
      date: "02 DEC 2023",
      place: "Lviv, Ukraine",
      text: "One of those days I would happily live all over again.",
      symbol: "✦",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 3,
      title: "Our Place",
      date: "21 APR 2024",
      place: "Somewhere special",
      text: "It was never really about the place. It became special because we were there together.",
      symbol: "♥",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 4,
      title: "Just Us",
      date: "14 AUG 2025",
      place: "Home",
      text: "Nothing extraordinary had to happen. Being there with you was already enough.",
      symbol: "∞",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 5,
      title: "Here We Are",
      date: "RIGHT NOW",
      place: "Together",
      text: "We made it all the way here. And somehow this still feels like only the beginning.",
      symbol: "♡",
      photo: null,
      video: null,
      voice: null,
    },
  ],
};

export default function OurStoryGift() {
  const [stage, setStage] = useState("card");
  const [activeMemory, setActiveMemory] = useState(null);
  const [visited, setVisited] = useState([]);
  const [futureOpen, setFutureOpen] = useState(false);

  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => ({
        id: index,
        left: `${(index * 37 + 11) % 100}%`,
        top: `${(index * 61 + 7) % 100}%`,
        size: 1 + ((index * 13) % 3),
        delay: `${((index * 17) % 50) / 10}s`,
        opacity: 0.18 + (((index * 19) % 65) / 100),
      })),
    []
  );

  const openMemory = (memory) => {
    setActiveMemory(memory);

    setVisited((current) =>
      current.includes(memory.id)
        ? current
        : [...current, memory.id]
    );
  };

  const closeMemory = () => {
    setActiveMemory(null);
  };

  return (
    <main className={`osgPage osgTheme-${gift.theme}`}>
      <div className="osgBackground" aria-hidden="true">
        {stars.map((star) => (
          <i
            key={star.id}
            className="osgBackgroundStar"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDelay: star.delay,
            }}
          />
        ))}

        <div className="osgNebula osgNebulaOne" />
        <div className="osgNebula osgNebulaTwo" />
      </div>

      {stage === "card" && (
        <section className="osgOpening">
          <div className="osgOpeningTop">
            <div className="osgLogo">
              WI<span>♥</span>ELI
            </div>

            <span>OUR STORY</span>
          </div>

          <div className="osgOpeningCenter">
            <p className="osgTiny">
              SOMETHING WAS MADE FOR YOU ♡
            </p>

            <div className="osgClosedCard">
              <div className="osgClosedCardGlow" />

              <div className="osgEnvelopeMark">♡</div>

              <p>FOR</p>

              <h1>{gift.recipient}</h1>

              <span>
                A LITTLE COLLECTION OF MOMENTS I NEVER WANT TO
                FORGET.
              </span>

              <button
                type="button"
                onClick={() => setStage("letter")}
              >
                OPEN ♡
              </button>
            </div>

            <small>FROM {gift.sender.toUpperCase()}</small>
          </div>
        </section>
      )}

      {stage === "letter" && (
        <section className="osgOpening">
          <div className="osgOpeningTop">
            <div className="osgLogo">
              WI<span>♥</span>ELI
            </div>

            <span>OUR STORY</span>
          </div>

          <div className="osgLetterWrap">
            <article className="osgLetter">
              <p>FOR {gift.recipient.toUpperCase()} ♡</p>

              <div className="osgLetterPhoto">
                <span>OUR PHOTO</span>
              </div>

              <h1>
                LET&apos;S REMEMBER
                <br />
                <em>OUR STORY.</em>
              </h1>

              <blockquote>
                “{gift.openingLetter}”
              </blockquote>

              <span>
                WITH LOVE · {gift.sender.toUpperCase()}
              </span>

              <button
                type="button"
                onClick={() => setStage("journey")}
              >
                BEGIN OUR JOURNEY <b>→</b>
              </button>
            </article>
          </div>
        </section>
      )}

      {stage === "journey" && (
        <section className="osgJourneyScreen">
          <header className="osgJourneyHeader">
            <div className="osgLogo">
              WI<span>♥</span>ELI
            </div>

            <p>
              {visited.length} / {gift.memories.length} MEMORIES
            </p>

            <span>OUR STORY</span>
          </header>

          <div className="osgJourneyIntro">
            <p>THIS IS WHERE OUR STORY BEGAN</p>

            <h1>
              EVERY STAR
              <br />
              <em>HOLDS A MEMORY.</em>
            </h1>

            <span>
              Follow the path. Tap a star to remember.
            </span>
          </div>

          <div className="osgWorld">
            <svg
              className="osgPath"
              viewBox="0 0 1800 700"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M100 490 C260 590 360 220 570 285 C760 345 790 565 1000 405 C1170 275 1240 185 1400 260 C1510 310 1580 440 1700 390"
                fill="none"
                stroke="rgba(216,181,255,.16)"
                strokeWidth="1.5"
                strokeDasharray="5 12"
              />

              <path
                d="M100 490 C260 590 360 220 570 285 C760 345 790 565 1000 405 C1170 275 1240 185 1400 260 C1510 310 1580 440 1700 390"
                fill="none"
                stroke="rgba(205,158,255,.42)"
                strokeWidth="1"
                className="osgPathGlow"
              />
            </svg>

            {gift.memories.map((memory, index) => {
              const positions = [
                { left: "13%", top: "69%" },
                { left: "31%", top: "39%" },
                { left: "50%", top: "63%" },
                { left: "69%", top: "34%" },
                { left: "86%", top: "58%" },
              ];

              const position =
                positions[index] || {
                  left: `${15 + index * 15}%`,
                  top: `${index % 2 ? 40 : 65}%`,
                };

              const wasVisited = visited.includes(memory.id);

              return (
                <div
                  key={memory.id}
                  className={`osgMemoryPoint ${
                    wasVisited ? "visited" : ""
                  }`}
                  style={position}
                >
                  <button
                    type="button"
                    className="osgStarButton"
                    onClick={() => openMemory(memory)}
                  >
                    <i />
                    <strong>{memory.symbol}</strong>
                    <b />
                  </button>

                  <div className="osgStarMeta">
                    <small>
                      {String(index + 1).padStart(2, "0")}
                    </small>

                    <h3>{memory.title}</h3>

                    <p>{memory.date}</p>

                    <span>{memory.place}</span>
                  </div>
                </div>
              );
            })}

            <div className="osgFuturePoint">
              <div className="osgFutureRings">
                <i />
                <i />
                <i />
              </div>

              <p>AND HERE WE ARE ♡</p>

              <h2>
                THE REST IS
                <br />
                <em>OURS TO WRITE.</em>
              </h2>

              <span>
                {gift.memories.length} memories behind us.
                <br />
                A whole universe ahead.
              </span>

              <button
                type="button"
                onClick={() => setFutureOpen(true)}
              >
                ∞
              </button>
            </div>
          </div>

          <div className="osgJourneyHint">
            DRAG TO EXPLORE · TAP A MEMORY TO OPEN
          </div>
        </section>
      )}

      {activeMemory && (
        <div
          className="osgMemoryOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeMemory();
            }
          }}
        >
          <article className="osgMemoryModal">
            <button
              type="button"
              className="osgClose"
              onClick={closeMemory}
            >
              ×
            </button>

            <div className="osgMemoryMedia">
              {activeMemory.video ? (
                <video
                  src={activeMemory.video}
                  controls
                  playsInline
                />
              ) : activeMemory.photo ? (
                <img
                  src={activeMemory.photo}
                  alt={activeMemory.title}
                />
              ) : (
                <div className="osgMemoryPlaceholder">
                  <span>YOUR MEMORY</span>
                  <strong>{activeMemory.symbol}</strong>
                </div>
              )}
            </div>

            <div className="osgMemoryBody">
              <p>MEMORY</p>

              <div className="osgMemoryLocation">
                <span>{activeMemory.date}</span>
                <i />
                <span>{activeMemory.place}</span>
              </div>

              <h2>{activeMemory.title}</h2>

              <blockquote>
                “{activeMemory.text}”
              </blockquote>

              {activeMemory.voice && (
                <div className="osgVoice">
                  <button type="button">▶</button>

                  <div>
                    <span>A VOICE MEMORY ♡</span>
                    <i />
                  </div>

                  <small>0:34</small>
                </div>
              )}

              <button
                type="button"
                className="osgContinue"
                onClick={closeMemory}
              >
                CONTINUE OUR JOURNEY →
              </button>
            </div>
          </article>
        </div>
      )}

      {futureOpen && (
        <div
          className="osgFutureOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setFutureOpen(false);
            }
          }}
        >
          <div className="osgFutureMessage">
            <button
              type="button"
              onClick={() => setFutureOpen(false)}
              className="osgClose"
            >
              ×
            </button>

            <p>FOR EVERYTHING STILL AHEAD ♡</p>

            <h2>
              SOMEDAY,
              <br />
              <em>THIS WILL BE A MEMORY TOO.</em>
            </h2>

            <blockquote>
              “{gift.finalMessage}”
            </blockquote>

            <span>∞</span>

            <small>
              THE REST IS OURS TO WRITE.
            </small>
          </div>
        </div>
      )}
    </main>
  );
}

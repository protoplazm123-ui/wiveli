"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const fallbackGift = {
  recipient: "Sophie",
  sender: "Alex",

  openingLetter:
    "I wanted to remind you of some of the best moments I remember with you. The little things, the places, and the days I never want to forget. So I put some of them here — just for us.",

  openingPhoto: null,

  theme: "stars",
  customColor: "#5d347f",
  customBackground: null,

  finalMessage:
    "There are still so many places to see, things to do, and moments waiting for us. The rest is ours to write.",

  memories: [
    {
      id: 1,
      title: "How We Met",
      date: "2023-09-18",
      place: "Kyiv, Ukraine",
      text: "Some days look ordinary at first. Then somehow they become the beginning of everything.",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 2,
      title: "Our First Adventure",
      date: "2023-12-02",
      place: "Lviv, Ukraine",
      text: "One of those days I would happily live all over again.",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 3,
      title: "Our Place",
      date: "2024-04-21",
      place: "Somewhere special",
      text: "It was never really about the place. It became special because we were there together.",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 4,
      title: "Just Us",
      date: "2025-08-14",
      place: "Home",
      text: "Nothing extraordinary had to happen. Being there with you was already enough.",
      photo: null,
      video: null,
      voice: null,
    },
  ],
};

function formatDate(value) {
  if (!value) return "A MOMENT IN TIME";

  const parsed = new Date(`${value}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value.toUpperCase();
  }

  return parsed
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

export default function OurStoryGift() {
  const [gift, setGift] = useState(fallbackGift);
  const [loaded, setLoaded] = useState(false);

  const [stage, setStage] = useState("card");
  const [activeMemory, setActiveMemory] =
    useState(null);
  const [visited, setVisited] = useState([]);
  const [futureOpen, setFutureOpen] =
    useState(false);

  const journeyRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "wiveli-our-story-v1"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          Array.isArray(parsed.memories) &&
          parsed.memories.length
        ) {
          setGift({
            ...fallbackGift,
            ...parsed,
          });
        }
      }
    } catch (error) {
      console.error(
        "Could not load Our Story:",
        error
      );
    }

    setLoaded(true);
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, index) => ({
        id: index,
        left: `${(index * 37 + 11) % 100}%`,
        top: `${(index * 61 + 7) % 100}%`,
        size: 1 + ((index * 13) % 3),
        delay: `${((index * 17) % 50) / 10}s`,
        opacity:
          0.18 +
          (((index * 19) % 65) / 100),
      })),
    []
  );

  const themeStyle =
    gift.theme === "color"
      ? {
          "--story-custom-color":
            gift.customColor || "#5d347f",
        }
      : gift.theme === "custom" &&
          gift.customBackground
        ? {
            "--story-custom-bg": `url(${gift.customBackground})`,
          }
        : undefined;

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

  const goToNextMemory = () => {
    if (!activeMemory) return;

    const currentIndex =
      gift.memories.findIndex(
        (memory) =>
          memory.id === activeMemory.id
      );

    const nextIndex = currentIndex + 1;

    setActiveMemory(null);

    setTimeout(() => {
      const container = journeyRef.current;

      if (!container) return;

      if (nextIndex < gift.memories.length) {
        const nextPoint =
          container.querySelector(
            `[data-memory-index="${nextIndex}"]`
          );

        if (nextPoint) {
          const target =
            nextPoint.offsetLeft -
            window.innerWidth / 2 +
            nextPoint.offsetWidth / 2;

          container.scrollTo({
            left: Math.max(0, target),
            behavior: "smooth",
          });
        }
      } else {
        container.scrollTo({
          left: container.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 180);
  };

  if (!loaded) {
    return (
      <main className="osgPage">
        <div className="osgLoading">♡</div>
      </main>
    );
  }

  return (
    <main
      className={`osgPage osgTheme-${gift.theme}`}
      style={themeStyle}
    >
      <div
        className="osgBackground"
        aria-hidden="true"
      >
        {gift.theme === "stars" &&
          stars.map((star) => (
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

        {gift.theme === "clouds" && (
          <>
            <i className="osgCloud osgCloud1" />
            <i className="osgCloud osgCloud2" />
            <i className="osgCloud osgCloud3" />
            <i className="osgCloud osgCloud4" />
          </>
        )}

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

              <div className="osgEnvelopeMark">
                ♡
              </div>

              <p>FOR</p>

              <h1>{gift.recipient}</h1>

              <span>
                A LITTLE COLLECTION OF MOMENTS
                I NEVER WANT TO FORGET.
              </span>

              <button
                type="button"
                onClick={() =>
                  setStage("letter")
                }
              >
                OPEN ♡
              </button>
            </div>

            <small>
              FROM {gift.sender.toUpperCase()}
            </small>
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
              <p>
                FOR {gift.recipient.toUpperCase()} ♡
              </p>

              {gift.openingPhoto ? (
                <div
                  className="osgLetterPhoto osgLetterPhotoReal"
                  style={{
                    backgroundImage: `url(${gift.openingPhoto})`,
                  }}
                />
              ) : (
                <div className="osgLetterPhoto">
                  <span>OUR PHOTO</span>
                </div>
              )}

              <h1>
                LET&apos;S REMEMBER
                <br />
                <em>OUR STORY.</em>
              </h1>

              <blockquote>
                “{gift.openingLetter}”
              </blockquote>

              <span>
                WITH LOVE ·{" "}
                {gift.sender.toUpperCase()}
              </span>

              <button
                type="button"
                onClick={() =>
                  setStage("journey")
                }
              >
                BEGIN OUR JOURNEY <b>→</b>
              </button>
            </article>
          </div>
        </section>
      )}

      {stage === "journey" && (
        <section
          ref={journeyRef}
          className="osgJourneyScreen"
        >
          <header className="osgJourneyHeader">
            <div className="osgLogo">
              WI<span>♥</span>ELI
            </div>

            <p>
              {visited.length} /{" "}
              {gift.memories.length} MEMORIES
            </p>

            <span>OUR STORY</span>
          </header>

          <div className="osgJourneyIntro">
            <span>
              Follow the path. Tap a memory.
            </span>
          </div>

          <div
            className="osgWorld"
            style={
              gift.theme === "custom" &&
              gift.customBackground
                ? {
                    backgroundImage: `linear-gradient(90deg,rgba(7,5,10,.22),rgba(7,5,10,.15)),url(${gift.customBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <svg
              className="osgPath"
              viewBox="0 0 1800 700"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M100 490 C260 590 360 220 570 285 C760 345 790 565 1000 405 C1170 275 1240 185 1400 260 C1510 310 1580 440 1700 390"
                fill="none"
                stroke="rgba(216,181,255,.2)"
                strokeWidth="2"
                strokeDasharray="5 12"
              />

              <path
                d="M100 490 C260 590 360 220 570 285 C760 345 790 565 1000 405 C1170 275 1240 185 1400 260 C1510 310 1580 440 1700 390"
                fill="none"
                className="osgPathGlow"
              />
            </svg>

            {gift.memories.map(
              (memory, index) => {
                const positions = [
                  {
                    left: "13%",
                    top: "69%",
                  },
                  {
                    left: "31%",
                    top: "39%",
                  },
                  {
                    left: "50%",
                    top: "63%",
                  },
                  {
                    left: "69%",
                    top: "34%",
                  },
                  {
                    left: "86%",
                    top: "58%",
                  },
                ];

                const position =
                  positions[index] || {
                    left: `${
                      12 +
                      (index /
                        Math.max(
                          1,
                          gift.memories.length
                        )) *
                        75
                    }%`,
                    top:
                      index % 2
                        ? "38%"
                        : "65%",
                  };

                const wasVisited =
                  visited.includes(memory.id);

                return (
                  <div
                    key={memory.id}
                    data-memory-index={index}
                    className={`osgMemoryPoint ${
                      wasVisited
                        ? "visited"
                        : ""
                    }`}
                    style={position}
                  >
                    <button
                      type="button"
                      className="osgStarButton"
                      onClick={() =>
                        openMemory(memory)
                      }
                    >
                      <i />

                      <strong>
                        {gift.theme ===
                        "clouds"
                          ? "☁"
                          : gift.theme ===
                              "custom"
                            ? "●"
                            : "✦"}
                      </strong>

                      <b />
                    </button>

                    <div className="osgStarMeta">
                      <small>
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </small>

                      <h3>
                        {memory.title}
                      </h3>

                      <p>
                        {formatDate(
                          memory.date
                        )}
                      </p>

                      <span>
                        {memory.place}
                      </span>
                    </div>
                  </div>
                );
              }
            )}

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
                {gift.memories.length} memories
                behind us.
                <br />
                A whole world ahead.
              </span>

              <button
                type="button"
                onClick={() =>
                  setFutureOpen(true)
                }
              >
                ∞
              </button>
            </div>
          </div>

          <div className="osgJourneyHint">
            SCROLL TO EXPLORE · TAP A MEMORY
          </div>
        </section>
      )}

      {activeMemory && (
        <div
          className="osgMemoryOverlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
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
                  <span>OUR MEMORY</span>
                  <strong>♡</strong>
                </div>
              )}
            </div>

            <div className="osgMemoryBody">
              <p>MEMORY</p>

              <div className="osgMemoryLocation">
                <span>
                  {formatDate(
                    activeMemory.date
                  )}
                </span>

                <i />

                <span>
                  {activeMemory.place}
                </span>
              </div>

              <h2>
                {activeMemory.title}
              </h2>

              <blockquote>
                “{activeMemory.text}”
              </blockquote>

              {activeMemory.voice && (
                <audio
                  className="osgRealAudio"
                  src={activeMemory.voice}
                  controls
                />
              )}

              <button
                type="button"
                className="osgContinue"
                onClick={goToNextMemory}
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
            if (
              event.target ===
              event.currentTarget
            ) {
              setFutureOpen(false);
            }
          }}
        >
          <div className="osgFutureMessage">
            <button
              type="button"
              onClick={() =>
                setFutureOpen(false)
              }
              className="osgClose"
            >
              ×
            </button>

            <p>
              FOR EVERYTHING STILL AHEAD ♡
            </p>

            <h2>
              SOMEDAY,
              <br />
              <em>
                THIS WILL BE A MEMORY TOO.
              </em>
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

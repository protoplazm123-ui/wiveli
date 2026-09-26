"use client";

import { useEffect, useMemo, useState } from "react";

const FALLBACK = {
  recipient: "Sophie",
  moments: [
    {
      id: 1,
      title: "YOU MISS ME",
      message:
        "If you're here because you miss me, remember that somewhere I'm probably missing you too. ♡",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 2,
      title: "YOU CAN'T SLEEP",
      message:
        "Close your eyes for a second. Imagine I'm right there next to you.",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 3,
      title: "YOU'RE OVERTHINKING",
      message:
        "Not everything needs to be figured out tonight. Tomorrow can carry some of it.",
      photo: null,
      video: null,
      voice: null,
    },
    {
      id: 4,
      title: "YOU NEED A HUG",
      message:
        "This isn't quite the real thing, but consider this one saved for you. ♡",
      photo: null,
      video: null,
      voice: null,
    },
  ],
};

export default function OpenWhenGift() {
  const [gift, setGift] = useState(FALLBACK);
  const [stage, setStage] = useState("intro");
  const [activeId, setActiveId] = useState(null);
  const [revealed, setRevealed] = useState([]);
  const [contentStep, setContentStep] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wiveli-open-when-v2");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed?.moments?.length) {
          setGift({
            ...FALLBACK,
            ...parsed,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const active = useMemo(
    () =>
      gift.moments.find((moment) => moment.id === activeId) ||
      null,
    [gift, activeId]
  );

  const pieces = useMemo(() => {
    if (!active) return [];

    const result = [];

    if (active.photo) {
      result.push({
        type: "photo",
        value: active.photo,
      });
    }

    if (active.message) {
      result.push({
        type: "message",
        value: active.message,
      });
    }

    if (active.voice) {
      result.push({
        type: "voice",
        value: active.voice,
      });
    }

    if (active.video) {
      result.push({
        type: "video",
        value: active.video,
      });
    }

    return result;
  }, [active]);

  const openMoment = (moment) => {
    setActiveId(moment.id);
    setContentStep(0);

    setRevealed((current) =>
      current.includes(moment.id)
        ? current
        : [...current, moment.id]
    );
  };

  const closeMoment = () => {
    setActiveId(null);
    setContentStep(0);
  };

  const nextPiece = () => {
    if (contentStep < pieces.length - 1) {
      setContentStep((current) => current + 1);
    } else {
      closeMoment();
    }
  };

  const previousPiece = () => {
    if (contentStep > 0) {
      setContentStep((current) => current - 1);
    }
  };

  const currentPiece = pieces[contentStep];

  return (
    <main className="owgPage">
      {stage === "intro" && (
        <section className="owgIntro">
          <div className="owgIntroStars" />

          <div className="owgIntroContent">
            <span className="owgTiny">SOMETHING FOR YOU ♡</span>

            <div className="owgIntroOrb">
              <div className="owgOrbRing owgOrbRing1" />
              <div className="owgOrbRing owgOrbRing2" />

              <span>♡</span>
            </div>

            <p>FOR {gift.recipient?.toUpperCase()}</p>

            <h1>
              FOR THE MOMENTS
              <br />
              <em>YOU NEED ME.</em>
            </h1>

            <p className="owgIntroText">
              I can&apos;t always be right there.
              <br />
              So I left a few little pieces of me here for you.
            </p>

            <button
              type="button"
              onClick={() => setStage("world")}
            >
              ENTER ♡
            </button>
          </div>
        </section>
      )}

      {stage === "world" && !active && (
        <section className="owgWorld">
          <header className="owgWorldHeader">
            <div>
              <span>OPEN WHEN</span>

              <h1>
                What do you
                <br />
                <em>need right now?</em>
              </h1>
            </div>

            <div className="owgProgress">
              <strong>
                {revealed.length}/{gift.moments.length}
              </strong>

              <span>MOMENTS OPENED</span>
            </div>
          </header>

          <div className="owgConstellation">
            <div className="owgLine owgLine1" />
            <div className="owgLine owgLine2" />
            <div className="owgLine owgLine3" />

            {gift.moments.map((moment, index) => {
              const isRevealed = revealed.includes(moment.id);

              return (
                <button
                  type="button"
                  key={moment.id}
                  className={`owgMoment owgMoment${
                    (index % 7) + 1
                  } ${isRevealed ? "isOpened" : ""}`}
                  onClick={() => openMoment(moment)}
                >
                  <div className="owgMomentGlow" />

                  <small>
                    {String(index + 1).padStart(2, "0")}
                  </small>

                  <span>OPEN WHEN</span>

                  <strong>{moment.title}</strong>

                  <i>{isRevealed ? "♡" : "＋"}</i>

                  <b>
                    {isRevealed
                      ? "OPEN AGAIN"
                      : "OPEN THIS MOMENT"}
                  </b>
                </button>
              );
            })}
          </div>

          <div className="owgWorldFooter">
            <span>
              Choose the moment that feels right.
            </span>

            <i>♡</i>

            <span>
              Come back whenever you need it.
            </span>
          </div>
        </section>
      )}

      {stage === "world" && active && (
        <section className="owgExperience">
          <div className="owgExperienceBg" />

          <header className="owgExperienceHeader">
            <button type="button" onClick={closeMoment}>
              ← ALL MOMENTS
            </button>

            <span>
              {String(contentStep + 1).padStart(2, "0")}
              {" / "}
              {String(Math.max(pieces.length, 1)).padStart(
                2,
                "0"
              )}
            </span>
          </header>

          <div className="owgExperienceTitle">
            <span>OPEN WHEN...</span>
            <h1>{active.title}</h1>
          </div>

          <div
            className={`owgReveal owgReveal-${
              currentPiece?.type || "empty"
            }`}
            key={`${active.id}-${contentStep}`}
          >
            {currentPiece?.type === "photo" && (
              <div className="owgPhotoReveal">
                <div className="owgPhoto">
                  <img src={currentPiece.value} alt="" />
                  <p>ONE OF MY FAVORITES ♡</p>
                </div>

                <span>KEEP THIS ONE CLOSE.</span>
              </div>
            )}

            {currentPiece?.type === "message" && (
              <div className="owgMessageReveal">
                <span>A LITTLE NOTE FOR YOU</span>

                <p>{currentPiece.value}</p>

                <i>♡</i>
              </div>
            )}

            {currentPiece?.type === "voice" && (
              <div className="owgVoiceReveal">
                <div className="owgVoiceHeart">♡</div>

                <span>PRESS PLAY</span>

                <h2>
                  A little piece
                  <br />
                  of my voice.
                </h2>

                <audio
                  controls
                  src={currentPiece.value}
                />

                <p>A LITTLE MESSAGE FROM ME ♡</p>
              </div>
            )}

            {currentPiece?.type === "video" && (
              <div className="owgVideoReveal">
                <video
                  controls
                  playsInline
                  src={currentPiece.value}
                />

                <p>JUST FOR YOU ♡</p>
              </div>
            )}

            {!currentPiece && (
              <div className="owgEmptyReveal">
                <span>♡</span>

                <p>
                  This little moment is waiting for something
                  special.
                </p>
              </div>
            )}
          </div>

          <div className="owgExperienceNav">
            <button
              type="button"
              disabled={contentStep === 0}
              onClick={previousPiece}
            >
              ←
            </button>

            <div className="owgDots">
              {pieces.map((piece, index) => (
                <span
                  key={`${piece.type}-${index}`}
                  className={
                    index === contentStep ? "active" : ""
                  }
                />
              ))}
            </div>

            <button type="button" onClick={nextPiece}>
              {contentStep === pieces.length - 1
                ? "♡"
                : "→"}
            </button>
          </div>

          {pieces.length > 1 && (
            <span className="owgTapHint">
              TAP THROUGH THE LITTLE THINGS THEY LEFT FOR YOU
            </span>
          )}
        </section>
      )}
    </main>
  );
}

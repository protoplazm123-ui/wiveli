"use client";

import { useMemo, useState } from "react";

const STARTERS = [
  "YOU MISS ME",
  "YOU CAN'T SLEEP",
  "YOU'RE OVERTHINKING",
  "YOU NEED A HUG",
];

const IDEAS = [
  "YOU MISS ME",
  "YOU HAD A BAD DAY",
  "YOU CAN'T SLEEP",
  "YOU NEED COURAGE",
  "YOU FEEL ALONE",
  "YOU NEED TO SMILE",
];

function newMoment(title) {
  return {
    id: Date.now() + Math.random(),
    title,
    message: "",
    photo: null,
    video: null,
    voice: null,
  };
}

function readFile(file, callback) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

export default function OpenWhenEditor() {
  const [recipient, setRecipient] = useState("Sophie");

  const [moments, setMoments] = useState(
    STARTERS.map((title, index) => ({
      id: index + 1,
      title,
      message:
        index === 0
          ? "If you're here because you miss me, remember that somewhere I'm probably missing you too. ♡"
          : "",
      photo: null,
      video: null,
      voice: null,
    }))
  );

  const [activeId, setActiveId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const active = useMemo(
    () =>
      moments.find((moment) => moment.id === activeId) ||
      null,
    [moments, activeId]
  );

  const update = (field, value) => {
    setMoments((current) =>
      current.map((moment) =>
        moment.id === activeId
          ? { ...moment, [field]: value }
          : moment
      )
    );
  };

  const addMoment = (title) => {
    const moment = newMoment(title);

    setMoments((current) => [...current, moment]);
    setActiveId(moment.id);
    setAdding(false);
    setCustomTitle("");
  };

  const removeMoment = () => {
    setMoments((current) =>
      current.filter((moment) => moment.id !== activeId)
    );

    setActiveId(null);
  };

  const saveGift = () => {
    const gift = {
      recipient,
      moments,
    };

    try {
      localStorage.setItem(
        "wiveli-open-when-v2",
        JSON.stringify(gift)
      );
    } catch (error) {
      console.error(error);
    }

    window.location.href = "/gift/open-when";
  };

  return (
    <main className="owxPage">
      <header className="owxHeader">
        <a href="/" className="owxLogo">
          WI<span>♥</span>ELI
        </a>

        <p>OPEN WHEN</p>

        <button type="button" onClick={saveGift}>
          PREVIEW AS THEM →
        </button>
      </header>

      {!active && (
        <section className="owxUniverse">
          <div className="owxIntro">
            <p>CREATE THEIR LITTLE UNIVERSE</p>

            <h1>
              OPEN WHEN
              <br />
              <em>THEY NEED YOU.</em>
            </h1>

            <label>
              FOR
              <input
                value={recipient}
                onChange={(event) =>
                  setRecipient(event.target.value)
                }
              />
            </label>

            <span>
              Each moment can hold a message, photo,
              video or your voice.
            </span>
          </div>

          <div className="owxOrbit owxOrbitOne" />
          <div className="owxOrbit owxOrbitTwo" />

          <div className="owxMomentField">
            {moments.map((moment, index) => (
              <button
                type="button"
                key={moment.id}
                className={`owxBubble owxBubble${
                  (index % 7) + 1
                }`}
                onClick={() => setActiveId(moment.id)}
              >
                <small>
                  {String(index + 1).padStart(2, "0")}
                </small>

                <span>OPEN WHEN</span>

                <strong>{moment.title}</strong>

                <i>
                  {moment.message ||
                  moment.photo ||
                  moment.video ||
                  moment.voice
                    ? "♡"
                    : "＋"}
                </i>
              </button>
            ))}

            <button
              type="button"
              className="owxAddBubble"
              onClick={() => setAdding(true)}
            >
              <span>＋</span>
              ADD A MOMENT
            </button>
          </div>

          <div className="owxHint">
            TAP A MOMENT TO CREATE WHAT THEY&apos;LL FIND
          </div>
        </section>
      )}

      {active && (
        <section className="owxScene">
          <button
            type="button"
            className="owxBack"
            onClick={() => setActiveId(null)}
          >
            ← ALL MOMENTS
          </button>

          <div className="owxSceneTitle">
            <p>OPEN WHEN...</p>

            <input
              value={active.title}
              onChange={(event) =>
                update(
                  "title",
                  event.target.value.toUpperCase()
                )
              }
            />

            <span>
              Build the little moment they&apos;ll discover.
            </span>
          </div>

          <div className="owxDesk">
            <div className="owxPhotoPiece">
              {active.photo ? (
                <img src={active.photo} alt="" />
              ) : (
                <label>
                  <strong>＋</strong>
                  <span>ADD A PHOTO</span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      readFile(
                        event.target.files?.[0],
                        (value) => update("photo", value)
                      )
                    }
                  />
                </label>
              )}

              <small>ONE OF MY FAVORITES ♡</small>
            </div>

            <div className="owxNotePiece">
              <span>A LITTLE NOTE FOR YOU</span>

              <textarea
                value={active.message}
                onChange={(event) =>
                  update("message", event.target.value)
                }
                placeholder="If you're reading this..."
              />

              <i>♡</i>
            </div>

            <label className="owxVoicePiece">
              <span className="owxPlay">
                {active.voice ? "▶" : "＋"}
              </span>

              <div>
                <small>
                  {active.voice
                    ? "VOICE MESSAGE ADDED"
                    : "ADD YOUR VOICE"}
                </small>

                <strong>
                  A LITTLE MESSAGE FROM ME ♡
                </strong>
              </div>

              <input
                type="file"
                accept="audio/*"
                onChange={(event) =>
                  readFile(
                    event.target.files?.[0],
                    (value) => update("voice", value)
                  )
                }
              />
            </label>

            <label className="owxVideoPiece">
              {active.video ? (
                <>
                  <video
                    src={active.video}
                    muted
                    playsInline
                  />

                  <span>VIDEO ADDED ✓</span>
                </>
              ) : (
                <>
                  <strong>▶</strong>
                  <span>ADD A VIDEO</span>
                </>
              )}

              <input
                type="file"
                accept="video/*"
                onChange={(event) =>
                  readFile(
                    event.target.files?.[0],
                    (value) => update("video", value)
                  )
                }
              />
            </label>

            <div className="owxSceneHeart">♡</div>
          </div>

          <div className="owxSceneActions">
            <button
              type="button"
              className="owxDelete"
              onClick={removeMoment}
            >
              DELETE MOMENT
            </button>

            <button
              type="button"
              className="owxDone"
              onClick={() => setActiveId(null)}
            >
              DONE ♡
            </button>
          </div>
        </section>
      )}

      {adding && (
        <div
          className="owxPickerOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAdding(false);
            }
          }}
        >
          <div className="owxPicker">
            <button
              type="button"
              className="owxPickerClose"
              onClick={() => setAdding(false)}
            >
              ×
            </button>

            <p>ADD A MOMENT</p>

            <h2>
              OPEN WHEN
              <br />
              <em>WHAT HAPPENS?</em>
            </h2>

            <div className="owxIdeas">
              {IDEAS.map((idea) => (
                <button
                  type="button"
                  key={idea}
                  onClick={() => addMoment(idea)}
                >
                  {idea}
                </button>
              ))}
            </div>

            <div className="owxOwn">
              <span>OR WRITE YOUR OWN</span>

              <div>
                <input
                  value={customTitle}
                  onChange={(event) =>
                    setCustomTitle(
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="WHEN..."
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      customTitle.trim()
                    ) {
                      addMoment(customTitle.trim());
                    }
                  }}
                />

                <button
                  type="button"
                  disabled={!customTitle.trim()}
                  onClick={() =>
                    addMoment(customTitle.trim())
                  }
                >
                  ADD →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

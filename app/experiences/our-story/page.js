"use client";

import { useState } from "react";

const themes = [
  {
    id: "stars",
    icon: "✦",
    name: "Starry Universe",
    text: "Memories become stars in your universe.",
  },
  {
    id: "clouds",
    icon: "☁",
    name: "Cloud Journey",
    text: "Travel through your memories in the sky.",
  },
  {
    id: "color",
    icon: "♡",
    name: "Color Story",
    text: "A clean journey built around your favorite color.",
  },
  {
    id: "custom",
    icon: "∞",
    name: "Your World",
    text: "Upload your own background and build a path on it.",
  },
];

const initialMemories = [
  {
    id: 1,
    title: "How We Met",
    date: "2024-02-14",
    place: "Kyiv",
    text: "The moment everything started.",
    media: [],
    voice: null,
  },
];

export default function OurStoryEditor() {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("Sophie");
  const [sender, setSender] = useState("Alex");

  const [letter, setLetter] = useState(
    "I wanted to remind you of some of the best moments I remember with you. The little things, the places, and the days I never want to forget."
  );

  const [theme, setTheme] = useState("stars");
  const [customColor, setCustomColor] = useState("#5d347f");
  const [customBackground, setCustomBackground] = useState(null);

  const [memories, setMemories] = useState(initialMemories);

  const [finalMessage, setFinalMessage] = useState(
    "There are still so many moments waiting for us. The rest is ours to write."
  );

  const addMemory = () => {
    setMemories((current) => [
      ...current,
      {
        id: Date.now(),
        title: "",
        date: "",
        place: "",
        text: "",
        media: [],
        voice: null,
      },
    ]);
  };

  const updateMemory = (id, field, value) => {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id ? { ...memory, [field]: value } : memory
      )
    );
  };

  const removeMemory = (id) => {
    setMemories((current) =>
      current.filter((memory) => memory.id !== id)
    );
  };

  const handleMedia = (id, files) => {
    const selected = Array.from(files);

    setMemories((current) =>
      current.map((memory) =>
        memory.id === id
          ? {
              ...memory,
              media: selected.map((file) => ({
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file),
              })),
            }
          : memory
      )
    );
  };

  const handleVoice = (id, file) => {
    if (!file) return;

    setMemories((current) =>
      current.map((memory) =>
        memory.id === id
          ? {
              ...memory,
              voice: {
                name: file.name,
                url: URL.createObjectURL(file),
              },
            }
          : memory
      )
    );
  };

  const handleBackground = (file) => {
    if (!file) return;
    setCustomBackground(URL.createObjectURL(file));
  };

  return (
    <main className="osePage">
      <header className="oseHeader">
        <a href="/" className="oseLogo">
          WI<span>♥</span>ELI
        </a>

        <div className="oseProgress">
          <span>{String(step).padStart(2, "0")}</span>
          <div>
            <i style={{ width: `${(step / 5) * 100}%` }} />
          </div>
          <span>05</span>
        </div>

        <a href="/#ideas">← EXIT</a>
      </header>

      {step === 1 && (
        <section className="oseStep">
          <div className="oseIntro">
            <p>OUR STORY · 01</p>
            <h1>
              START WITH
              <br />
              <em>A LETTER.</em>
            </h1>

            <span>
              Before the journey begins, give them something personal
              to open.
            </span>
          </div>

          <div className="oseEditorGrid">
            <div className="oseForm">
              <label>
                FOR
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Their name"
                />
              </label>

              <label>
                FROM
                <input
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Your name"
                />
              </label>

              <label>
                YOUR OPENING LETTER
                <textarea
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  rows={8}
                />
              </label>

              <label className="oseUpload">
                <span>＋ ADD OPENING PHOTO</span>
                <small>Optional · JPG, PNG</small>
                <input type="file" accept="image/*" />
              </label>
            </div>

            <div className="oseLetterPreview">
              <p>FOR {recipient.toUpperCase()} ♡</p>

              <div className="osePreviewPhoto">
                YOUR PHOTO
              </div>

              <h2>
                LET&apos;S REMEMBER
                <br />
                <em>OUR STORY.</em>
              </h2>

              <blockquote>“{letter}”</blockquote>

              <span>FROM {sender.toUpperCase()}</span>

              <button type="button">
                BEGIN OUR JOURNEY →
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="oseStep oseMemoriesStep">
          <div className="oseIntro">
            <p>OUR STORY · 02</p>

            <h1>
              BUILD YOUR
              <br />
              <em>MEMORIES.</em>
            </h1>

            <span>
              Every memory will become a stop in your journey.
            </span>
          </div>

          <div className="oseMemoryList">
            {memories.map((memory, index) => (
              <article className="oseMemoryEditor" key={memory.id}>
                <div className="oseMemoryNumber">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {memories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMemory(memory.id)}
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                <div className="oseMemoryFields">
                  <input
                    value={memory.title}
                    onChange={(e) =>
                      updateMemory(
                        memory.id,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Memory title"
                  />

                  <div className="oseMemoryMeta">
                    <label>
                      DATE
                      <input
                        type="date"
                        value={memory.date}
                        onChange={(e) =>
                          updateMemory(
                            memory.id,
                            "date",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      PLACE
                      <input
                        value={memory.place}
                        onChange={(e) =>
                          updateMemory(
                            memory.id,
                            "place",
                            e.target.value
                          )
                        }
                        placeholder="Paris, France"
                      />
                    </label>
                  </div>

                  <textarea
                    value={memory.text}
                    onChange={(e) =>
                      updateMemory(
                        memory.id,
                        "text",
                        e.target.value
                      )
                    }
                    placeholder="Tell them what you remember about this moment..."
                    rows={5}
                  />

                  <div className="oseMediaRow">
                    <label className="oseMiniUpload">
                      <strong>▣</strong>
                      <span>PHOTO / VIDEO</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) =>
                          handleMedia(
                            memory.id,
                            e.target.files
                          )
                        }
                      />
                    </label>

                    <label className="oseMiniUpload">
                      <strong>◉</strong>
                      <span>VOICE MEMORY</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          handleVoice(
                            memory.id,
                            e.target.files?.[0]
                          )
                        }
                      />
                    </label>
                  </div>

                  {(memory.media.length > 0 ||
                    memory.voice) && (
                    <div className="oseAttached">
                      {memory.media.map((item) => (
                        <span key={item.url}>
                          {item.type.startsWith("video/")
                            ? "VIDEO"
                            : "PHOTO"}{" "}
                          ✓
                        </span>
                      ))}

                      {memory.voice && (
                        <span>VOICE ✓</span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}

            <button
              type="button"
              className="oseAddMemory"
              onClick={addMemory}
            >
              <span>＋</span>
              ADD ANOTHER MEMORY
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="oseStep">
          <div className="oseIntro">
            <p>OUR STORY · 03</p>

            <h1>
              CHOOSE YOUR
              <br />
              <em>WORLD.</em>
            </h1>

            <span>
              Your memories stay the same. You choose how the journey
              feels.
            </span>
          </div>

          <div className="oseThemes">
            {themes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`oseTheme ${
                  theme === item.id ? "selected" : ""
                }`}
                onClick={() => setTheme(item.id)}
              >
                <div className={`oseThemeVisual ${item.id}`}>
                  <span>{item.icon}</span>
                </div>

                <div>
                  <strong>{item.name}</strong>
                  <p>{item.text}</p>
                </div>

                <i>
                  {theme === item.id ? "SELECTED" : "SELECT"}
                </i>
              </button>
            ))}
          </div>

          {theme === "color" && (
            <div className="oseThemeOptions">
              <label>
                YOUR COLOR
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) =>
                    setCustomColor(e.target.value)
                  }
                />
              </label>
            </div>
          )}

          {theme === "custom" && (
            <div className="oseThemeOptions">
              <label className="oseUpload">
                <span>＋ UPLOAD YOUR WORLD</span>
                <small>
                  Map, photo, illustration or background
                </small>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleBackground(e.target.files?.[0])
                  }
                />
              </label>

              {customBackground && (
                <div
                  className="oseCustomPreview"
                  style={{
                    backgroundImage: `url(${customBackground})`,
                  }}
                >
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>

                  <p>DRAG YOUR MEMORIES ONTO YOUR WORLD</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {step === 4 && (
        <section className="oseStep">
          <div className="oseIntro">
            <p>OUR STORY · 04</p>

            <h1>
              HOW SHOULD IT
              <br />
              <em>END?</em>
            </h1>

            <span>
              The memories end here. Your story doesn&apos;t.
            </span>
          </div>

          <div className="oseFinalEditor">
            <div>
              <p>THE FINAL MOMENT</p>

              <h2>
                THE REST IS
                <br />
                <em>OURS TO WRITE.</em>
              </h2>

              <textarea
                rows={7}
                value={finalMessage}
                onChange={(e) =>
                  setFinalMessage(e.target.value)
                }
              />

              <span>
                This appears after they reach the end of your journey.
              </span>
            </div>

            <div className={`oseEndingPreview ${theme}`}>
              <div className="osePastPath">
                {memories.slice(-4).map((memory) => (
                  <i key={memory.id}>✦</i>
                ))}
              </div>

              <div className="oseFutureSpace">
                <span>·</span>
                <span>✦</span>
                <span>·</span>
                <span>✦</span>
                <span>·</span>
              </div>

              <p>AND HERE WE ARE ♡</p>

              <h3>
                {memories.length} MEMORIES BEHIND US.
                <br />
                A WHOLE WORLD AHEAD.
              </h3>

              <blockquote>“{finalMessage}”</blockquote>

              <strong>∞</strong>
            </div>
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="oseStep oseReady">
          <p>OUR STORY · READY</p>

          <h1>
            YOUR STORY
            <br />
            <em>IS READY. ♡</em>
          </h1>

          <span>
            {memories.length} memories ·{" "}
            {themes.find((item) => item.id === theme)?.name}
          </span>

          <div className={`oseReadyWorld ${theme}`}>
            <p>FOR {recipient.toUpperCase()}</p>

            <h2>
              LET&apos;S REMEMBER
              <br />
              OUR STORY.
            </h2>

            <div>
              {memories.map((memory, index) => (
                <i key={memory.id}>
                  {theme === "clouds" ? "☁" : "✦"}
                  <small>{index + 1}</small>
                </i>
              ))}
            </div>

            <strong>∞</strong>
          </div>

          <p className="oseReadyHint">
            Recipient experience preview
          </p>
        </section>
      )}

      <nav className="oseBottomNav">
        <button
          type="button"
          disabled={step === 1}
          onClick={() =>
            setStep((current) => Math.max(1, current - 1))
          }
        >
          ← BACK
        </button>

        <span>
          {step === 1 && "OPENING LETTER"}
          {step === 2 && "YOUR MEMORIES"}
          {step === 3 && "YOUR WORLD"}
          {step === 4 && "THE FUTURE"}
          {step === 5 && "PREVIEW"}
        </span>

        {step < 5 ? (
          <button
            type="button"
            className="oseContinue"
            onClick={() =>
              setStep((current) => Math.min(5, current + 1))
            }
          >
            CONTINUE →
          </button>
        ) : (
          <button type="button" className="oseContinue">
            CREATE OUR STORY ♡
          </button>
        )}
      </nav>
    </main>
  );
}

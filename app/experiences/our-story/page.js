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
    text: "Upload your own background and build your own path.",
  },
];

const defaultLetter =
  "I wanted to remind you of some of the best moments I remember with you. The little things, the places, and the days I never want to forget. So I put some of them here — just for us.";

function createMemory(id = Date.now()) {
  return {
    id,
    title: "",
    date: "",
    place: "",
    text: "",
    photo: null,
    video: null,
    voice: null,
  };
}

function readAsDataURL(file, callback) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    callback(reader.result);
  };

  reader.readAsDataURL(file);
}

export default function OurStoryEditor() {
  const [step, setStep] = useState(1);

  const [recipient, setRecipient] = useState("Sophie");
  const [sender, setSender] = useState("Alex");
  const [letter, setLetter] = useState(defaultLetter);
  const [openingPhoto, setOpeningPhoto] = useState(null);

  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "How We Met",
      date: "2024-02-14",
      place: "Kyiv, Ukraine",
      text: "The moment everything started.",
      photo: null,
      video: null,
      voice: null,
    },
  ]);

  const [theme, setTheme] = useState("stars");
  const [customColor, setCustomColor] = useState("#5d347f");
  const [customBackground, setCustomBackground] = useState(null);

  const [finalMessage, setFinalMessage] = useState(
    "There are still so many places to see, things to do, and moments waiting for us. The rest is ours to write."
  );

  const addMemory = () => {
    setMemories((current) => [
      ...current,
      createMemory(Date.now()),
    ]);
  };

  const updateMemory = (id, field, value) => {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id
          ? { ...memory, [field]: value }
          : memory
      )
    );
  };

  const removeMemory = (id) => {
    setMemories((current) =>
      current.filter((memory) => memory.id !== id)
    );
  };

  const moveMemory = (index, direction) => {
    const target = index + direction;

    if (target < 0 || target >= memories.length) return;

    const next = [...memories];
    const [item] = next.splice(index, 1);

    next.splice(target, 0, item);

    setMemories(next);
  };

  const handleMemoryMedia = (id, files) => {
    const list = Array.from(files || []);

    list.forEach((file) => {
      if (file.type.startsWith("image/")) {
        readAsDataURL(file, (value) => {
          updateMemory(id, "photo", value);
        });
      }

      if (file.type.startsWith("video/")) {
        /*
          Video is previewed in this browser session.
          Large videos should later go to cloud storage.
        */
        updateMemory(
          id,
          "video",
          URL.createObjectURL(file)
        );
      }
    });
  };

  const handleVoice = (id, file) => {
    if (!file) return;

    updateMemory(
      id,
      "voice",
      URL.createObjectURL(file)
    );
  };

  const saveStory = () => {
    const story = {
      version: 1,
      recipient: recipient.trim() || "You",
      sender: sender.trim() || "Someone special",
      openingLetter: letter.trim() || defaultLetter,
      openingPhoto,
      theme,
      customColor,
      customBackground,
      finalMessage,
      memories: memories.map((memory) => ({
        ...memory,
        title: memory.title.trim() || "A Memory",
        place: memory.place.trim() || "Somewhere special",
        text:
          memory.text.trim() ||
          "A moment worth remembering.",
      })),
    };

    try {
      localStorage.setItem(
        "wiveli-our-story-v1",
        JSON.stringify(story)
      );
    } catch (error) {
      console.error("Could not save Our Story:", error);
    }

    window.location.href = "/gift/our-story";
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
            <i
              style={{
                width: `${(step / 5) * 100}%`,
              }}
            />
          </div>

          <span>05</span>
        </div>

        <a href="/">← EXIT</a>
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
              Before the journey begins, give them something
              personal to open.
            </span>
          </div>

          <div className="oseEditorGrid">
            <div className="oseForm">
              <label>
                FOR
                <input
                  value={recipient}
                  onChange={(e) =>
                    setRecipient(e.target.value)
                  }
                  placeholder="Their name"
                />
              </label>

              <label>
                FROM
                <input
                  value={sender}
                  onChange={(e) =>
                    setSender(e.target.value)
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                YOUR OPENING LETTER
                <textarea
                  value={letter}
                  onChange={(e) =>
                    setLetter(e.target.value)
                  }
                  rows={8}
                />
              </label>

              <label className="oseUpload">
                <span>
                  {openingPhoto
                    ? "✓ OPENING PHOTO ADDED"
                    : "＋ ADD OPENING PHOTO"}
                </span>

                <small>JPG / PNG</small>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    readAsDataURL(
                      e.target.files?.[0],
                      setOpeningPhoto
                    )
                  }
                />
              </label>
            </div>

            <div className="oseLetterPreview">
              <p>
                FOR {recipient.toUpperCase()} ♡
              </p>

              {openingPhoto ? (
                <div
                  className="osePreviewPhoto osePreviewPhotoReal"
                  style={{
                    backgroundImage: `url(${openingPhoto})`,
                  }}
                />
              ) : (
                <div className="osePreviewPhoto">
                  YOUR PHOTO
                </div>
              )}

              <h2>
                LET&apos;S REMEMBER
                <br />
                <em>OUR STORY.</em>
              </h2>

              <blockquote>“{letter}”</blockquote>

              <span>
                FROM {sender.toUpperCase()}
              </span>

              <button type="button">
                BEGIN OUR JOURNEY →
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="oseStep">
          <div className="oseIntro">
            <p>OUR STORY · 02</p>

            <h1>
              BUILD YOUR
              <br />
              <em>MEMORIES.</em>
            </h1>

            <span>
              Every memory becomes a stop in your journey.
            </span>
          </div>

          <div className="oseMemoryList">
            {memories.map((memory, index) => (
              <article
                className="oseMemoryEditor"
                key={memory.id}
              >
                <div className="oseMemoryNumber">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="oseMemoryMove">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveMemory(index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index === memories.length - 1
                      }
                      onClick={() =>
                        moveMemory(index, 1)
                      }
                    >
                      ↓
                    </button>
                  </div>

                  {memories.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeMemory(memory.id)
                      }
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
                    placeholder="What do you remember about this moment?"
                    rows={5}
                  />

                  <div className="oseMediaRow">
                    <label className="oseMiniUpload">
                      <strong>▣</strong>
                      <span>
                        {memory.photo || memory.video
                          ? "MEDIA ✓"
                          : "PHOTO / VIDEO"}
                      </span>

                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) =>
                          handleMemoryMedia(
                            memory.id,
                            e.target.files
                          )
                        }
                      />
                    </label>

                    <label className="oseMiniUpload">
                      <strong>◉</strong>
                      <span>
                        {memory.voice
                          ? "VOICE ✓"
                          : "VOICE MEMORY"}
                      </span>

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
              Same memories. A completely different journey.
            </span>
          </div>

          <div className="oseThemes">
            {themes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`oseTheme ${
                  theme === item.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => setTheme(item.id)}
              >
                <div
                  className={`oseThemeVisual ${item.id}`}
                >
                  <span>{item.icon}</span>
                </div>

                <div>
                  <strong>{item.name}</strong>
                  <p>{item.text}</p>
                </div>

                <i>
                  {theme === item.id
                    ? "SELECTED"
                    : "SELECT"}
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
                <span>
                  {customBackground
                    ? "✓ YOUR WORLD ADDED"
                    : "＋ UPLOAD YOUR WORLD"}
                </span>

                <small>
                  Map, photo or illustration
                </small>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    readAsDataURL(
                      e.target.files?.[0],
                      setCustomBackground
                    )
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

                  <p>
                    YOUR MEMORIES BECOME POINTS
                    ON THIS WORLD
                  </p>
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
              ONE LAST
              <br />
              <em>THING.</em>
            </h1>

            <span>
              The memories end. Your story doesn&apos;t.
            </span>
          </div>

          <div className="oseFinalEditor">
            <div>
              <p>A NOTE FOR OUR FUTURE</p>

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
                They&apos;ll see this after the last memory.
              </span>
            </div>

            <div
              className={`oseEndingPreview ${theme}`}
              style={
                theme === "color"
                  ? {
                      background: `radial-gradient(circle at 50% 40%, ${customColor}88, transparent 58%), #09070d`,
                    }
                  : theme === "custom" &&
                    customBackground
                  ? {
                      backgroundImage: `linear-gradient(rgba(8,6,12,.4),rgba(8,6,12,.75)),url(${customBackground})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div className="osePastPath">
                {memories
                  .slice(-4)
                  .map((memory) => (
                    <i key={memory.id}>
                      {theme === "clouds"
                        ? "☁"
                        : "✦"}
                    </i>
                  ))}
              </div>

              <p>AND HERE WE ARE ♡</p>

              <h3>
                {memories.length} MEMORIES BEHIND US.
                <br />
                A WHOLE WORLD AHEAD.
              </h3>

              <blockquote>
                “{finalMessage}”
              </blockquote>

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
            {
              themes.find(
                (item) => item.id === theme
              )?.name
            }
          </span>

          <div
            className={`oseReadyWorld ${theme}`}
            style={
              theme === "color"
                ? {
                    background: `radial-gradient(circle, ${customColor}aa, #09070d 70%)`,
                  }
                : theme === "custom" &&
                  customBackground
                ? {
                    backgroundImage: `linear-gradient(rgba(8,6,12,.35),rgba(8,6,12,.65)),url(${customBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <p>
              FOR {recipient.toUpperCase()}
            </p>

            <h2>
              LET&apos;S REMEMBER
              <br />
              OUR STORY.
            </h2>

            <div>
              {memories.map((memory, index) => (
                <i key={memory.id}>
                  {theme === "clouds"
                    ? "☁"
                    : "✦"}

                  <small>{index + 1}</small>
                </i>
              ))}
            </div>

            <strong>∞</strong>
          </div>
        </section>
      )}

      <nav className="oseBottomNav">
        <button
          type="button"
          disabled={step === 1}
          onClick={() =>
            setStep((current) =>
              Math.max(1, current - 1)
            )
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
              setStep((current) =>
                Math.min(5, current + 1)
              )
            }
          >
            CONTINUE →
          </button>
        ) : (
          <button
            type="button"
            className="oseContinue"
            onClick={saveStory}
          >
            CREATE OUR STORY ♡
          </button>
        )}
      </nav>
    </main>
  );
}

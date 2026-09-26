"use client";

import { useMemo, useState } from "react";

const IDEAS = [
  {
    id: "miss",
    category: "LOVE",
    title: "YOU MISS ME",
    symbol: "♡",
    text: "A little piece of you for when the distance feels bigger.",
  },
  {
    id: "sleep",
    category: "COMFORT",
    title: "YOU CAN'T SLEEP",
    symbol: "☾",
    text: "Something soft for the nights when their mind won't slow down.",
  },
  {
    id: "reset",
    category: "COMFORT",
    title: "YOU NEED A RESET",
    symbol: "↺",
    text: "A small pause to help them breathe and begin again.",
  },
  {
    id: "smile",
    category: "FUN",
    title: "YOU NEED TO SMILE",
    symbol: "☺",
    text: "A tiny dose of you for a day that needs something lighter.",
  },
  {
    id: "love",
    category: "LOVE",
    title: "YOU NEED TO FEEL LOVED",
    symbol: "♥",
    text: "Remind them exactly how much they mean to you.",
  },
  {
    id: "overthinking",
    category: "COMFORT",
    title: "YOU'RE OVERTHINKING",
    symbol: "∞",
    text: "A little grounding when their thoughts get too loud.",
  },
  {
    id: "proud",
    category: "MOTIVATION",
    title: "YOU DOUBT YOURSELF",
    symbol: "✦",
    text: "Give them your voice when they forget what they're capable of.",
  },
  {
    id: "alone",
    category: "COMFORT",
    title: "YOU FEEL ALONE",
    symbol: "◌",
    text: "Something to make the distance between you feel smaller.",
  },
  {
    id: "good",
    category: "LOVE",
    title: "SOMETHING GOOD HAPPENED",
    symbol: "☆",
    text: "A little celebration waiting for their happiest days.",
  },
  {
    id: "courage",
    category: "MOTIVATION",
    title: "YOU NEED COURAGE",
    symbol: "↑",
    text: "A reminder that you're already cheering for them.",
  },
  {
    id: "bored",
    category: "FUN",
    title: "YOU'RE BORED",
    symbol: "→",
    text: "A tiny surprise, challenge or plan to change the mood.",
  },
  {
    id: "bad-day",
    category: "COMFORT",
    title: "YOU HAD A BAD DAY",
    symbol: "♡",
    text: "A safe little corner for the days that simply weren't kind.",
  },
];

const FILTERS = ["ALL", "LOVE", "COMFORT", "FUN", "MOTIVATION"];

const createMoment = (idea) => ({
  id: `${idea.id}-${Date.now()}`,
  title: idea.title,
  message: "",
  photo: null,
  voice: null,
  video: null,
});

function readFile(file, done) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => done(reader.result);
  reader.readAsDataURL(file);
}

export default function OpenWhenPage() {
  const [filter, setFilter] = useState("ALL");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [moments, setMoments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const filtered = useMemo(
    () =>
      filter === "ALL"
        ? IDEAS
        : IDEAS.filter((idea) => idea.category === filter),
    [filter]
  );

  const editing = moments.find((item) => item.id === editingId);

  const alreadyAdded = (idea) =>
    moments.some((moment) => moment.title === idea.title);

  const addIdea = (idea) => {
    const existing = moments.find(
      (moment) => moment.title === idea.title
    );

    if (existing) {
      setEditingId(existing.id);
      setSelectedIdea(null);
      return;
    }

    const moment = createMoment(idea);
    setMoments((current) => [...current, moment]);
    setSelectedIdea(null);
    setEditingId(moment.id);
  };

  const addCustom = () => {
    if (!customTitle.trim()) return;

    const moment = createMoment({
      id: "custom",
      title: customTitle.trim().toUpperCase(),
    });

    setMoments((current) => [...current, moment]);
    setCustomTitle("");
    setCustomOpen(false);
    setEditingId(moment.id);
  };

  const updateMoment = (field, value) => {
    setMoments((current) =>
      current.map((moment) =>
        moment.id === editingId
          ? { ...moment, [field]: value }
          : moment
      )
    );
  };

  const deleteMoment = () => {
    setMoments((current) =>
      current.filter((moment) => moment.id !== editingId)
    );
    setEditingId(null);
  };

  const preview = () => {
    try {
      localStorage.setItem(
        "wiveli-open-when-v2",
        JSON.stringify({
          recipient: "Someone special",
          moments,
        })
      );
    } catch (error) {
      console.error(error);
    }

    window.location.href = "/gift/open-when";
  };

  return (
    <main className="owcPage">
      <header className="owcHeader">
        <a href="/" className="owcLogo">
          WI<span>♥</span>ELI
        </a>

        <span>OPEN WHEN</span>

        <button
          type="button"
          onClick={preview}
          disabled={!moments.length}
        >
          PREVIEW AS THEM →
        </button>
      </header>

      <section className="owcHero">
        <div className="owcHeroCopy">
          <span>MAKE IT PERSONAL</span>

          <h1>
            Open when
            <br />
            <em>they need you.</em>
          </h1>

          <p>
            Create little moments they can come back to —
            whenever they need comfort, courage, love, or just
            a little bit of you.
          </p>
        </div>

        <div className="owcGiftStatus">
          <span>YOUR GIFT</span>

          <strong>
            {String(moments.length).padStart(2, "0")}
          </strong>

          <p>
            {moments.length === 1 ? "MOMENT" : "MOMENTS"} ADDED
          </p>

          {moments.length > 0 && (
            <div className="owcMiniMoments">
              {moments.slice(0, 5).map((moment, index) => (
                <button
                  type="button"
                  key={moment.id}
                  onClick={() => setEditingId(moment.id)}
                  title={moment.title}
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}

              {moments.length > 5 && (
                <i>+{moments.length - 5}</i>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="owcDiscover">
        <div className="owcDiscoverTop">
          <div>
            <span>CHOOSE A MOMENT</span>
            <h2>What might they need?</h2>
          </div>

          <button
            type="button"
            className="owcCustomTop"
            onClick={() => setCustomOpen(true)}
          >
            + CREATE YOUR OWN
          </button>
        </div>

        <div className="owcFilters">
          {FILTERS.map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="owcGrid">
          {filtered.map((idea, index) => {
            const added = alreadyAdded(idea);

            return (
              <button
                type="button"
                key={idea.id}
                className={`owcCard ${added ? "isAdded" : ""}`}
                onClick={() => setSelectedIdea(idea)}
              >
                <div className="owcCardTop">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <i>{idea.symbol}</i>
                </div>

                <div className="owcCardBody">
                  <small>OPEN WHEN</small>
                  <h3>{idea.title}</h3>
                  <p>{idea.text}</p>
                </div>

                <div className="owcCardBottom">
                  <span>{idea.category}</span>

                  <strong>
                    {added ? "ADDED ✓" : "EXPLORE →"}
                  </strong>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            className="owcCard owcCustomCard"
            onClick={() => setCustomOpen(true)}
          >
            <div>
              <span>＋</span>
              <small>YOUR MOMENT</small>
              <h3>Something only you two understand.</h3>
            </div>

            <strong>CREATE YOUR OWN →</strong>
          </button>
        </div>
      </section>

      {moments.length > 0 && (
        <div className="owcDock">
          <div>
            <span>YOUR GIFT</span>

            <strong>
              {moments.length}{" "}
              {moments.length === 1 ? "MOMENT" : "MOMENTS"}
            </strong>
          </div>

          <div className="owcDockItems">
            {moments.slice(0, 4).map((moment) => (
              <button
                type="button"
                key={moment.id}
                onClick={() => setEditingId(moment.id)}
              >
                {moment.title}
              </button>
            ))}

            {moments.length > 4 && (
              <span>+{moments.length - 4}</span>
            )}
          </div>

          <button
            type="button"
            className="owcPreviewButton"
            onClick={preview}
          >
            PREVIEW GIFT →
          </button>
        </div>
      )}

      {selectedIdea && (
        <div
          className="owcOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedIdea(null);
            }
          }}
        >
          <div className="owcIdeaPanel">
            <button
              type="button"
              className="owcClose"
              onClick={() => setSelectedIdea(null)}
            >
              ×
            </button>

            <div className="owcIdeaNumber">
              {selectedIdea.symbol}
            </div>

            <span>OPEN WHEN...</span>

            <h2>{selectedIdea.title}</h2>

            <p>{selectedIdea.text}</p>

            <div className="owcCanHold">
              <span>THIS MOMENT CAN HOLD</span>

              <div>
                <i>♡ MESSAGE</i>
                <i>▣ PHOTO</i>
                <i>◉ VOICE</i>
                <i>▶ VIDEO</i>
              </div>
            </div>

            <button
              type="button"
              className="owcCreateMoment"
              onClick={() => addIdea(selectedIdea)}
            >
              {alreadyAdded(selectedIdea)
                ? "EDIT THIS MOMENT →"
                : "CREATE THIS MOMENT →"}
            </button>
          </div>
        </div>
      )}

      {customOpen && (
        <div className="owcOverlay">
          <div className="owcCustomPanel">
            <button
              type="button"
              className="owcClose"
              onClick={() => setCustomOpen(false)}
            >
              ×
            </button>

            <span>YOUR OWN MOMENT</span>
            <h2>OPEN WHEN...</h2>

            <input
              autoFocus
              value={customTitle}
              placeholder="YOU..."
              onChange={(event) =>
                setCustomTitle(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") addCustom();
              }}
            />

            <button
              type="button"
              disabled={!customTitle.trim()}
              onClick={addCustom}
            >
              CREATE MOMENT →
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="owcOverlay">
          <div className="owcEditor">
            <button
              type="button"
              className="owcClose"
              onClick={() => setEditingId(null)}
            >
              ×
            </button>

            <div className="owcEditorHead">
              <span>YOUR MOMENT</span>
              <small>OPEN WHEN...</small>

              <input
                value={editing.title}
                onChange={(event) =>
                  updateMoment(
                    "title",
                    event.target.value.toUpperCase()
                  )
                }
              />
            </div>

            <div className="owcEditorGrid">
              <div className="owcMessageEditor">
                <span>MESSAGE</span>

                <textarea
                  value={editing.message}
                  placeholder="If you're opening this..."
                  onChange={(event) =>
                    updateMoment("message", event.target.value)
                  }
                />

                <i>♡</i>
              </div>

              <label className="owcMediaEditor">
                {editing.photo ? (
                  <img src={editing.photo} alt="" />
                ) : (
                  <>
                    <b>＋</b>
                    <span>ADD PHOTO</span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    readFile(
                      event.target.files?.[0],
                      (value) => updateMoment("photo", value)
                    )
                  }
                />
              </label>

              <label className="owcSmallMedia">
                <b>{editing.voice ? "✓" : "◉"}</b>
                <span>
                  {editing.voice
                    ? "VOICE ADDED"
                    : "ADD YOUR VOICE"}
                </span>

                <input
                  type="file"
                  accept="audio/*"
                  onChange={(event) =>
                    readFile(
                      event.target.files?.[0],
                      (value) => updateMoment("voice", value)
                    )
                  }
                />
              </label>

              <label className="owcSmallMedia">
                <b>{editing.video ? "✓" : "▶"}</b>
                <span>
                  {editing.video
                    ? "VIDEO ADDED"
                    : "ADD A VIDEO"}
                </span>

                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) =>
                    readFile(
                      event.target.files?.[0],
                      (value) => updateMoment("video", value)
                    )
                  }
                />
              </label>
            </div>

            <div className="owcEditorActions">
              <button
                type="button"
                onClick={deleteMoment}
              >
                DELETE
              </button>

              <button
                type="button"
                onClick={() => setEditingId(null)}
              >
                SAVE MOMENT ♡
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

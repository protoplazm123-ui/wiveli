"use client";

import { useState } from "react";

const defaultCategories = [
  "Dream Together",
  "Food & Places",
  "Our Time",
  "Little Things",
  "Adventures",
  "Something Special",
];

const wishOptions = [12, 24, 52, 100, 365];

export default function WishNotePersonalize() {
  const [recipient, setRecipient] = useState("Sophie");
  const [sender, setSender] = useState("Alex");

  const [message, setMessage] = useState(
    "I made this little place for your wishes, dreams and all the things we still have to do together."
  );

  const [wishCount, setWishCount] = useState(24);
  const [customWishCount, setCustomWishCount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [categories, setCategories] = useState(
    defaultCategories
  );

  const finalWishCount =
    isCustom && customWishCount
      ? Math.max(1, Number(customWishCount))
      : wishCount;

  const selectWishCount = (count) => {
    setWishCount(count);
    setIsCustom(false);
    setCustomWishCount("");
  };

  const updateCategory = (index, value) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  return (
    <main className="personalizePage">
      <header className="personalizeHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <div className="personalizeHeaderCenter">
          WISH NOTE / PERSONALIZE
        </div>

        <a
          className="personalizeExit"
          href="/experiences/wish-note"
        >
          Save & Exit
        </a>
      </header>

      <section className="personalizeLayout">
        <div className="personalizeEditor">
          <div className="editorIntro">
            <p className="eyebrow">
              MAKE IT THEIRS
            </p>

            <h1>
              PERSONALIZE
              <br />
              <span>WISH NOTE.</span>
            </h1>

            <p>
              Create a little world for their
              wishes, dreams and all the moments
              you still have ahead of you.
            </p>
          </div>

          {/* 01 — NAMES */}

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>01</span>

              <div>
                <h2>Who is it for?</h2>

                <p>
                  Add the names that will appear
                  inside the gift.
                </p>
              </div>
            </div>

            <label className="editorField">
              <span>RECIPIENT'S NAME</span>

              <input
                type="text"
                value={recipient}
                maxLength={30}
                onChange={(event) =>
                  setRecipient(event.target.value)
                }
                placeholder="Their name"
              />
            </label>

            <label className="editorField">
              <span>YOUR NAME</span>

              <input
                type="text"
                value={sender}
                maxLength={30}
                onChange={(event) =>
                  setSender(event.target.value)
                }
                placeholder="Your name"
              />
            </label>
          </div>

          {/* 02 — MESSAGE */}

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>02</span>

              <div>
                <h2>Your message</h2>

                <p>
                  Write the first thing they will
                  read when they open their gift.
                </p>
              </div>
            </div>

            <label className="editorField">
              <span>PERSONAL MESSAGE</span>

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                maxLength={280}
                rows={6}
                placeholder="Write something personal..."
              />

              <small>
                {message.length}/280
              </small>
            </label>
          </div>

          {/* 03 — WISH COUNT */}

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>03</span>

              <div>
                <h2>How many wishes?</h2>

                <p>
                  Choose how many wishes they can
                  make inside their Wish Note.
                </p>
              </div>
            </div>

            <div className="wishCountGrid">
              {wishOptions.map((count) => (
                <button
                  type="button"
                  key={count}
                  className={
                    !isCustom &&
                    wishCount === count
                      ? "wishCountOption active"
                      : "wishCountOption"
                  }
                  onClick={() =>
                    selectWishCount(count)
                  }
                >
                  <strong>{count}</strong>
                  <span>WISHES</span>
                </button>
              ))}

              <button
                type="button"
                className={
                  isCustom
                    ? "wishCountOption active"
                    : "wishCountOption"
                }
                onClick={() =>
                  setIsCustom(true)
                }
              >
                <strong>+</strong>
                <span>CUSTOM</span>
              </button>
            </div>

            {isCustom && (
              <label className="editorField customWishField">
                <span>NUMBER OF WISHES</span>

                <input
                  type="number"
                  min="1"
                  max="999"
                  value={customWishCount}
                  onChange={(event) =>
                    setCustomWishCount(
                      event.target.value
                    )
                  }
                  placeholder="Enter a number"
                />
              </label>
            )}
          </div>

          {/* 04 — CATEGORIES */}

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>04</span>

              <div>
                <h2>Wish categories</h2>

                <p>
                  We've prepared six categories.
                  Keep them as they are or make
                  the names more personal.
                </p>
              </div>
            </div>

            <div className="categoryEditor">
              {categories.map(
                (category, index) => (
                  <label
                    className="categoryEditorRow"
                    key={index}
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <input
                      type="text"
                      value={category}
                      maxLength={35}
                      onChange={(event) =>
                        updateCategory(
                          index,
                          event.target.value
                        )
                      }
                    />
                  </label>
                )
              )}
            </div>

            <button
              type="button"
              className="resetCategories"
              onClick={() =>
                setCategories([
                  ...defaultCategories,
                ])
              }
            >
              Reset to WIVELI categories
            </button>
          </div>

          {/* CONTINUE */}

          <div className="editorContinue">
            <div>
              <p>
                THE BASICS ARE READY ♡
              </p>

              <span>
                Next we'll choose how the gift
                looks and prepare the surprise
                for delivery.
              </span>
            </div>

            <a
              className="primary"
              href="/experiences/wish-note/design"
            >
              Continue →
            </a>
          </div>
        </div>

        {/* LIVE PREVIEW */}

        <aside className="personalizePreview">
          <div className="previewSticky">
            <div className="previewLabel">
              <span>LIVE PREVIEW</span>
              <span>●</span>
            </div>

            <div className="giftPhone">
              <div className="giftPhoneTop"></div>

              <div className="giftScreen">
                <p className="giftBrand">
                  WISH NOTE ♡
                </p>

                <div className="giftHeart">
                  ♥
                </div>

                <p className="giftFor">
                  A LITTLE WORLD MADE FOR
                </p>

                <h2>
                  {recipient ||
                    "Someone Special"}
                </h2>

                <p className="giftMessage">
                  {message ||
                    "Your personal message will appear here."}
                </p>

                <div className="giftDivider"></div>

                <div className="giftYear">
                  <strong>365</strong>

                  <div>
                    <span>DAYS OF</span>
                    <span>HAPPINESS ♡</span>
                  </div>
                </div>

                <p className="giftWishCount">
                  {finalWishCount || "—"} wishes
                  waiting for you
                </p>

                <div className="giftCategoryPreview">
                  {categories.map(
                    (category, index) => (
                      <div key={index}>
                        <span>
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <p>
                          {category ||
                            `Category ${
                              index + 1
                            }`}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <p className="giftFrom">
                  made with ♡ by{" "}
                  {sender || "you"}
                </p>
              </div>
            </div>

            <p className="previewHint">
              This is what they'll see when they
              open their gift.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
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

const categorySymbols = ["♡", "✦", "♥", "☺", "∞", "✉"];
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

  const [categories, setCategories] = useState(defaultCategories);

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
    <main className="wnPersonalizePage">
      {/* BACKGROUND */}
      <div className="wnPersonalizeGlow wnPersonalizeGlowOne" />
      <div className="wnPersonalizeGlow wnPersonalizeGlowTwo" />

      {/* HEADER */}
      <header className="wnPersonalizeHeader">
        <a className="wnPersonalizeLogo" href="/">
          WI<span>♥</span>ELI
        </a>

        <div className="wnPersonalizeHeaderCenter">
          WISH NOTE / PERSONALIZE
        </div>

        <a
          className="wnPersonalizeExit"
          href="/experiences/wish-note"
        >
          Save & Exit
        </a>
      </header>

      {/* PAGE INTRO */}
      <section className="wnPersonalizeIntro">
        <p>MAKE IT THEIRS ♡</p>

        <h1>
          MAKE IT
          <br />
          <span>PERSONAL.</span>
        </h1>

        <div className="wnPersonalizeIntroText">
          Turn Wish Note into something that feels like it
          was made for one person only.
        </div>
      </section>

      {/* PROGRESS */}
      <div className="wnPersonalizeProgress">
        <div>
          <span>01</span>
          <strong>FOR WHO</strong>
        </div>

        <div>
          <span>02</span>
          <strong>MESSAGE</strong>
        </div>

        <div>
          <span>03</span>
          <strong>WISHES</strong>
        </div>

        <div>
          <span>04</span>
          <strong>CATEGORIES</strong>
        </div>
      </div>

      {/* MAIN EDITOR */}
      <section className="wnPersonalizeLayout">
        <div className="wnPersonalizeEditor">

          {/* 01 */}
          <section className="wnEditorSection">
            <div className="wnEditorSectionHead">
              <span className="wnEditorNumber">01</span>

              <div>
                <p className="wnEditorEyebrow">
                  START WITH THEM
                </p>

                <h2>
                  Who is it
                  <br />
                  <span>for?</span>
                </h2>

                <p className="wnEditorDescription">
                  Add the names that will appear inside
                  their Wish Note.
                </p>
              </div>
            </div>

            <div className="wnEditorFieldsTwo">
              <label className="wnEditorField">
                <span>RECIPIENT&apos;S NAME</span>

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

              <label className="wnEditorField">
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
          </section>

          {/* 02 */}
          <section className="wnEditorSection">
            <div className="wnEditorSectionHead">
              <span className="wnEditorNumber">02</span>

              <div>
                <p className="wnEditorEyebrow">
                  SAY SOMETHING REAL
                </p>

                <h2>
                  Your
                  <br />
                  <span>message.</span>
                </h2>

                <p className="wnEditorDescription">
                  The first words they&apos;ll see when
                  they open their gift.
                </p>
              </div>
            </div>

            <label className="wnEditorField wnMessageField">
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

              <small>{message.length}/280</small>
            </label>
          </section>

          {/* 03 */}
          <section className="wnEditorSection">
            <div className="wnEditorSectionHead">
              <span className="wnEditorNumber">03</span>

              <div>
                <p className="wnEditorEyebrow">
                  THEIR LITTLE WORLD
                </p>

                <h2>
                  How many
                  <br />
                  <span>wishes?</span>
                </h2>

                <p className="wnEditorDescription">
                  Choose how many wishes their personal
                  space can hold.
                </p>
              </div>
            </div>

            <div className="wnWishCountGrid">
              {wishOptions.map((count) => (
                <button
                  type="button"
                  key={count}
                  className={
                    !isCustom && wishCount === count
                      ? "wnWishCountOption active"
                      : "wnWishCountOption"
                  }
                  onClick={() => selectWishCount(count)}
                >
                  <strong>{count}</strong>
                  <span>WISHES</span>
                  <i>♡</i>
                </button>
              ))}

              <button
                type="button"
                className={
                  isCustom
                    ? "wnWishCountOption active"
                    : "wnWishCountOption"
                }
                onClick={() => setIsCustom(true)}
              >
                <strong>+</strong>
                <span>CUSTOM</span>
                <i>✦</i>
              </button>
            </div>

            {isCustom && (
              <label className="wnEditorField wnCustomWishField">
                <span>NUMBER OF WISHES</span>

                <input
                  type="number"
                  min="1"
                  max="999"
                  value={customWishCount}
                  onChange={(event) =>
                    setCustomWishCount(event.target.value)
                  }
                  placeholder="Enter a number"
                />
              </label>
            )}
          </section>

          {/* 04 */}
          <section className="wnEditorSection wnCategoriesSection">
            <div className="wnEditorSectionHead">
              <span className="wnEditorNumber">04</span>

              <div>
                <p className="wnEditorEyebrow">
                  MAKE IT YOURS
                </p>

                <h2>
                  Wish
                  <br />
                  <span>categories.</span>
                </h2>

                <p className="wnEditorDescription">
                  Keep our six categories or rename them
                  to make the gift even more personal.
                </p>
              </div>
            </div>

            <div className="wnCategoryEditor">
              {categories.map((category, index) => (
                <label
                  className="wnCategoryRow"
                  key={index}
                >
                  <span className="wnCategoryNumber">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="wnCategorySymbol">
                    {categorySymbols[index]}
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

                  <span className="wnCategoryEdit">
                    EDIT
                  </span>
                </label>
              ))}
            </div>

            <button
              type="button"
              className="wnResetCategories"
              onClick={() =>
                setCategories([...defaultCategories])
              }
            >
              ↻ Reset to WIVELI categories
            </button>
          </section>

          {/* CONTINUE */}
          <section className="wnEditorContinue">
            <div>
              <p>THE BASICS ARE READY ♡</p>

              <h2>
                Now let&apos;s make
                <br />
                it beautiful.
              </h2>

              <span>
                Next you&apos;ll choose the visual style
                and prepare the surprise.
              </span>
            </div>

            <a
              className="wnContinueButton"
              href="/experiences/wish-note/design"
            >
              Continue
              <span>→</span>
            </a>
          </section>
        </div>

        {/* LIVE PREVIEW */}
        <aside className="wnPreviewColumn">
          <div className="wnPreviewSticky">
            <div className="wnPreviewHeader">
              <div>
                <span className="wnLiveDot" />
                LIVE PREVIEW
              </div>

              <span>WISH NOTE ♡</span>
            </div>

            <div className="wnGiftDevice">
              <div className="wnGiftScreen">
                <div className="wnGiftTop">
                  <span>WISH NOTE</span>
                  <span>♡</span>
                </div>

                <div className="wnGiftHero">
                  <div className="wnGiftHeart">
                    ♡
                  </div>

                  <p>A LITTLE WORLD MADE FOR</p>

                  <h2>
                    {recipient || "Someone Special"}
                  </h2>

                  <p className="wnGiftMessage">
                    {message ||
                      "Your personal message will appear here."}
                  </p>
                </div>

                <div className="wnGiftCount">
                  <strong>
                    {finalWishCount || "—"}
                  </strong>

                  <div>
                    <span>WISHES</span>
                    <span>WAITING FOR YOU</span>
                  </div>
                </div>

                <div className="wnGiftCategories">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <i>
                        {categorySymbols[index]}
                      </i>

                      <p>
                        {category ||
                          `Category ${index + 1}`}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="wnGiftFooter">
                  <span>
                    MADE WITH ♡ BY{" "}
                    {sender || "YOU"}
                  </span>

                  <span>
                    WIVELI
                  </span>
                </div>
              </div>
            </div>

            <p className="wnPreviewHint">
              Everything you change updates here instantly.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

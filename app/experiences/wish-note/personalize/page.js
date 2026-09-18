"use client";

import { useState } from "react";

export default function WishNotePersonalize() {
  const [recipient, setRecipient] = useState("Sophie");
  const [sender, setSender] = useState("Alex");
  const [message, setMessage] = useState(
    "I made this little place for all the things we still have to do together."
  );
  const [startDate, setStartDate] = useState("2026-09-26");

  const [categories, setCategories] = useState([
    "Dream Together",
    "Food Dreams",
    "Our Time",
    "Honest Talk",
  ]);

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
            <p className="eyebrow">MAKE IT THEIRS</p>

            <h1>
              PERSONALIZE
              <br />
              <span>WISH NOTE.</span>
            </h1>

            <p>
              Start with the little details. You can change everything
              later before creating the final gift.
            </p>
          </div>

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>01</span>

              <div>
                <h2>Who is it for?</h2>
                <p>Add the names that will appear inside the gift.</p>
              </div>
            </div>

            <label className="editorField">
              <span>RECIPIENT'S NAME</span>

              <input
                type="text"
                value={recipient}
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
                onChange={(event) =>
                  setSender(event.target.value)
                }
                placeholder="Your name"
              />
            </label>
          </div>

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>02</span>

              <div>
                <h2>Your message</h2>
                <p>
                  Write the first thing they will read when they open
                  their gift.
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
                maxLength={240}
                rows={6}
                placeholder="Write something personal..."
              />

              <small>{message.length}/240</small>
            </label>
          </div>

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>03</span>

              <div>
                <h2>When does it begin?</h2>
                <p>
                  Wish Note will run for one year from this date.
                </p>
              </div>
            </div>

            <label className="editorField">
              <span>START DATE</span>

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
              />
            </label>
          </div>

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>04</span>

              <div>
                <h2>Wish categories</h2>
                <p>
                  Give each type of wish a name that feels natural to
                  the two of you.
                </p>
              </div>
            </div>

            <div className="categoryEditor">
              {categories.map((category, index) => (
                <label
                  className="categoryEditorRow"
                  key={index}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <input
                    type="text"
                    value={category}
                    maxLength={35}
                    onChange={(event) =>
                      updateCategory(index, event.target.value)
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="editorContinue">
            <div>
              <p>LOOKING GOOD?</p>
              <span>
                Next we'll add photos, colors and the final details.
              </span>
            </div>

            <button className="primary">
              Continue →
            </button>
          </div>
        </div>

        <aside className="personalizePreview">
          <div className="previewSticky">
            <div className="previewLabel">
              <span>LIVE PREVIEW</span>
              <span>●</span>
            </div>

            <div className="giftPhone">
              <div className="giftPhoneTop"></div>

              <div className="giftScreen">
                <p className="giftBrand">WISH NOTE ♡</p>

                <div className="giftHeart">♥</div>

                <p className="giftFor">
                  A LITTLE SOMETHING FOR
                </p>

                <h2>
                  {recipient || "Someone Special"}
                </h2>

                <p className="giftMessage">
                  {message ||
                    "Your personal message will appear here."}
                </p>

                <div className="giftDivider"></div>

                <p className="giftDays">
                  365 DAYS · 365 WISHES
                </p>

                <div className="giftCategoryPreview">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p>
                        {category || `Category ${index + 1}`}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="giftFrom">
                  made with ♡ by {sender || "you"}
                </p>
              </div>
            </div>

            <p className="previewHint">
              Changes appear here instantly.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

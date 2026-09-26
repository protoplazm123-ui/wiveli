"use client";

import { useState } from "react";
import CuteCalendar from "../../components/CuteCalendar";

const categories = [
  {
    id: "dream",
    name: "Dream Together",
    icon: "♡",
    description: "Something you dream of doing together",
  },
  {
    id: "food",
    name: "Food & Places",
    icon: "✦",
    description: "A restaurant, trip or place to discover",
  },
  {
    id: "time",
    name: "Our Time",
    icon: "♥",
    description: "A date or little moment together",
  },
  {
    id: "little",
    name: "Little Things",
    icon: "☺",
    description: "Something simple that would make you happy",
  },
  {
    id: "adventures",
    name: "Adventures",
    icon: "∞",
    description: "Something exciting you've always wanted to try",
  },
  {
    id: "special",
    name: "Something Special",
    icon: "✉",
    description: "Anything that doesn't fit anywhere else",
  },
];

export default function WishNoteGift() {
  const [step, setStep] = useState("card");

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [wishText, setWishText] = useState("");
  const [wishDate, setWishDate] = useState("");
  const [wishTime, setWishTime] = useState("");
  const [wishPlace, setWishPlace] = useState("");

  const formatDate = (date) => {
    if (!date) return "Any day";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  };

  const resetWish = () => {
    setSelectedCategory(null);
    setWishText("");
    setWishDate("");
    setWishTime("");
    setWishPlace("");
    setStep("card");
  };

  return (
    <main className="wishExperience">

      {/* BACKGROUND */}

      <div className="wishExperienceGlow wishExperienceGlowOne" />
      <div className="wishExperienceGlow wishExperienceGlowTwo" />

      {/* TOP */}

      <header className="wishExperienceHeader">
        <div>
          WISH NOTE <span>♡</span>
        </div>

        <p>MADE WITH WIVELI</p>
      </header>


      {/* =====================================================
          OPENING CARD
          ===================================================== */}

      <section
        className={
          step === "card"
            ? "wishOpeningCard"
            : "wishOpeningCard wishOpeningCardBlurred"
        }
      >

        <div className="wishOpeningPhoto">

          <div className="wishOpeningPhotoPlaceholder">
            <span>YOUR MEMORY</span>
          </div>

          <div className="wishOpeningPhotoShade" />

        </div>


        <div className="wishOpeningContent">

          <div className="wishOpeningTop">
            <span>365 DAYS OF HAPPINESS</span>
            <span>MADE FOR SOPHIE ♡</span>
          </div>


          <div className="wishOpeningMain">

            <p>A LITTLE SOMETHING FOR YOU</p>

            <h1>
              MAKE
              <br />
              A WISH<span>.</span>
            </h1>

            <p className="wishOpeningMessage">
              Your wishes, our plans,
              <br />
              and memories waiting to happen.
            </p>

          </div>


          <div className="wishOpeningBottom">

            <div>
              <small>FROM</small>
              <strong>Alex ♡</strong>
            </div>

            <button
              type="button"
              onClick={() => setStep("category")}
            >
              MAKE A WISH
              <span>♡</span>
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          MODAL BACKDROP
          ===================================================== */}

      {step !== "card" && (
        <div className="wishModalLayer">

          {/* ===============================================
              CATEGORY
              =============================================== */}

          {step === "category" && (
            <div className="wishGlassModal wishCategoryModal">

              <button
                className="wishModalClose"
                type="button"
                onClick={() => setStep("card")}
              >
                ×
              </button>

              <div className="wishModalHeading">
                <p>MAKE A WISH ♡</p>

                <h2>
                  WHAT ARE YOU
                  <br />
                  WISHING FOR?
                </h2>

                <span>
                  Choose the feeling that fits your wish.
                </span>
              </div>


              <div className="wishModalCategories">

                {categories.map((category, index) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setStep("wish");
                    }}
                  >

                    <div className="wishModalCategoryTop">
                      <small>
                        {String(index + 1).padStart(2, "0")}
                      </small>

                      <i>{category.icon}</i>
                    </div>

                    <div>
                      <strong>{category.name}</strong>
                      <span>{category.description}</span>
                    </div>

                    <b>↗</b>

                  </button>
                ))}

              </div>

            </div>
          )}


          {/* ===============================================
              WISH TEXT
              =============================================== */}

          {step === "wish" && selectedCategory && (
            <div className="wishGlassModal wishWriteModal">

              <button
                className="wishModalBack"
                type="button"
                onClick={() => setStep("category")}
              >
                ←
              </button>

              <button
                className="wishModalClose"
                type="button"
                onClick={() => setStep("card")}
              >
                ×
              </button>


              <div className="wishSelectedCategory">
                <span>{selectedCategory.icon}</span>
                {selectedCategory.name}
              </div>


              <div className="wishModalHeading">

                <p>YOUR WISH</p>

                <h2>
                  TELL ME
                  <br />
                  EVERYTHING<span>.</span>
                </h2>

                <span>
                  What would make you smile?
                </span>

              </div>


              <label className="wishMainInput">

                <span>WHAT DO YOU WISH FOR?</span>

                <textarea
                  rows={4}
                  maxLength={180}
                  value={wishText}
                  onChange={(event) =>
                    setWishText(event.target.value)
                  }
                  placeholder="I wish we could..."
                  autoFocus
                />

                <small>{wishText.length}/180</small>

              </label>


              <button
                type="button"
                className="wishContinueButton"
                disabled={!wishText.trim()}
                onClick={() => setStep("date")}
              >
                CHOOSE WHEN
                <span>→</span>
              </button>

            </div>
          )}


          {/* ===============================================
              CALENDAR / TIME / PLACE
              =============================================== */}

          {step === "date" && (
            <div className="wishGlassModal wishDateModal">

              <button
                className="wishModalBack"
                type="button"
                onClick={() => setStep("wish")}
              >
                ←
              </button>

              <button
                className="wishModalClose"
                type="button"
                onClick={() => setStep("card")}
              >
                ×
              </button>


              <div className="wishModalHeading">

                <p>WHEN SHOULD IT HAPPEN?</p>

                <h2>
                  PICK YOUR
                  <br />
                  PERFECT DAY<span>.</span>
                </h2>

              </div>


              <div className="wishCalendarGlass">

                <CuteCalendar
                  value={wishDate}
                  onChange={setWishDate}
                  onClose={() => {}}
                />

              </div>


              <div className="wishDateDetails">

                <label>

                  <span>TIME</span>

                  <input
                    type="time"
                    value={wishTime}
                    onChange={(event) =>
                      setWishTime(event.target.value)
                    }
                  />

                </label>


                <label>

                  <span>PLACE</span>

                  <input
                    type="text"
                    maxLength={80}
                    value={wishPlace}
                    onChange={(event) =>
                      setWishPlace(event.target.value)
                    }
                    placeholder="Somewhere special..."
                  />

                </label>

              </div>


              <button
                type="button"
                className="wishContinueButton"
                disabled={!wishDate}
                onClick={() => setStep("review")}
              >
                REVIEW MY WISH
                <span>→</span>
              </button>

            </div>
          )}


          {/* ===============================================
              REVIEW
              =============================================== */}

          {step === "review" && (
            <div className="wishGlassModal wishReviewModal">

              <button
                className="wishModalClose"
                type="button"
                onClick={() => setStep("card")}
              >
                ×
              </button>


              <div className="wishReviewHeart">
                ♡
              </div>


              <div className="wishModalHeading">

                <p>ONE LAST LOOK</p>

                <h2>
                  YOUR
                  <br />
                  WISH<span>.</span>
                </h2>

                <span>
                  Make sure everything feels right.
                </span>

              </div>


              <div className="wishReviewCard">

                <div className="wishReviewCategory">
                  <span>{selectedCategory?.icon}</span>

                  <p>
                    {selectedCategory?.name}
                  </p>
                </div>


                <h3>{wishText}</h3>


                <div className="wishReviewDetails">

                  <div>
                    <small>DATE</small>
                    <strong>
                      {formatDate(wishDate)}
                    </strong>
                  </div>


                  <div>
                    <small>TIME</small>
                    <strong>
                      {wishTime || "Any time"}
                    </strong>
                  </div>


                  <div>
                    <small>PLACE</small>
                    <strong>
                      {wishPlace || "Anywhere"}
                    </strong>
                  </div>

                </div>

              </div>


              <div className="wishReviewActions">

                <button
                  type="button"
                  className="wishEditButton"
                  onClick={() => setStep("wish")}
                >
                  ← EDIT
                </button>


                <button
                  type="button"
                  className="wishSendButton"
                  onClick={() => setStep("success")}
                >
                  SEND MY WISH
                  <span>♡</span>
                </button>

              </div>

            </div>
          )}


          {/* ===============================================
              SUCCESS
              =============================================== */}

          {step === "success" && (
            <div className="wishGlassModal wishSuccessModal">

              <div className="wishSuccessSymbol">
                ♥
              </div>

              <p>WISH SENT</p>

              <h2>
                YOUR WISH
                <br />
                IS ON ITS WAY<span>.</span>
              </h2>

              <div className="wishSuccessLine" />

              <p className="wishSuccessText">
                Someone special now knows
                <br />
                exactly what you're wishing for.
              </p>

              <small>
                Maybe it will come true
                sooner than you think ♡
              </small>


              <button
                type="button"
                onClick={resetWish}
              >
                DONE
              </button>

            </div>
          )}

        </div>
      )}

    </main>
  );
}

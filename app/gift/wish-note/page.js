"use client";

import { useMemo, useState } from "react";

const categories = [
  { id: "dream", name: "Dream Together", icon: "♡" },
  { id: "food", name: "Food & Places", icon: "✦" },
  { id: "time", name: "Our Time", icon: "♥" },
  { id: "little", name: "Little Things", icon: "☺" },
  { id: "adventures", name: "Adventures", icon: "∞" },
  { id: "special", name: "Something Special", icon: "✉" },
];

export default function WishNoteGift() {
  const totalWishes = 24;

  const [activeView, setActiveView] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [wishText, setWishText] = useState("");
  const [wishDate, setWishDate] = useState("");
  const [wishPlace, setWishPlace] = useState("");
  const [wishNote, setWishNote] = useState("");

  const [wishes, setWishes] = useState([
    {
      id: 1,
      category: "time",
      text: "Sunset picnic together",
      date: "2026-10-14",
      place: "Our favorite spot",
      note: "",
      completed: false,
    },
    {
      id: 2,
      category: "food",
      text: "Italian dinner night",
      date: "2026-11-02",
      place: "",
      note: "The place with the tiny tables ♡",
      completed: false,
    },
  ]);

  const remainingWishes = Math.max(totalWishes - wishes.length, 0);

  const sortedWishes = useMemo(() => {
    return [...wishes].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [wishes]);

  const categoryCount = (categoryId) =>
    wishes.filter((wish) => wish.category === categoryId).length;

  const getCategory = (categoryId) =>
    categories.find((category) => category.id === categoryId);

  const openCategory = (category) => {
    if (remainingWishes <= 0) return;

    setSelectedCategory(category);
    setWishText("");
    setWishDate("");
    setWishPlace("");
    setWishNote("");
    setActiveView("create");
  };

  const sealWish = () => {
    if (!selectedCategory || !wishText.trim() || !wishDate) return;

    const newWish = {
      id: Date.now(),
      category: selectedCategory.id,
      text: wishText.trim(),
      date: wishDate,
      place: wishPlace.trim(),
      note: wishNote.trim(),
      completed: false,
    };

    setWishes((current) => [...current, newWish]);

    setWishText("");
    setWishDate("");
    setWishPlace("");
    setWishNote("");
    setSelectedCategory(null);
    setActiveView("wishes");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  };

  return (
    <main className="giftSpace">
      <header className="giftSpaceHeader">
        <div className="giftSpaceLogo">
          WISH NOTE <span>♡</span>
        </div>

        <button
          className="giftSpaceMade"
          type="button"
          onClick={() => setActiveView("home")}
        >
          made with WIVELI
        </button>
      </header>

      {activeView === "home" && (
        <>
          <section className="giftWelcome">
            <p className="giftEyebrow">
              365 DAYS OF HAPPINESS ♡
            </p>

            <h1>
              YOUR LITTLE
              <br />
              WORLD OF
              <br />
              <span>WISHES.</span>
            </h1>

            <p className="giftWelcomeText">
              Sophie, this little place was made for your wishes,
              dreams and all the things still waiting for us.
            </p>

            <div className="giftCounter">
              <strong>{remainingWishes}</strong>

              <div>
                <span>WISHES</span>
                <span>WAITING FOR YOU</span>
              </div>
            </div>

            <p className="giftFrom">
              made with ♡ by Alex
            </p>
          </section>

          <section className="giftCategories">
            <div className="giftSectionHeading">
              <div>
                <p>MAKE A WISH</p>
                <h2>
                  WHAT ARE YOU
                  <br />
                  WISHING FOR?
                </h2>
              </div>

              <span>
                Choose a category and make it yours.
              </span>
            </div>

            <div className="giftCategoryGrid">
              {categories.map((category, index) => (
                <button
                  className="giftCategoryCard"
                  type="button"
                  key={category.id}
                  onClick={() => openCategory(category)}
                >
                  <div className="giftCategoryTop">
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <i>{category.icon}</i>
                  </div>

                  <div>
                    <h3>{category.name}</h3>

                    <p>
                      {categoryCount(category.id)}{" "}
                      {categoryCount(category.id) === 1
                        ? "wish"
                        : "wishes"}
                    </p>
                  </div>

                  <span className="giftCategoryArrow">↗</span>
                </button>
              ))}
            </div>
          </section>

          <section className="giftQuickActions">
            <button
              type="button"
              onClick={() => setActiveView("wishes")}
            >
              <span>OUR WISHES</span>
              <strong>
                See everything we're looking forward to →
              </strong>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("memories")}
            >
              <span>MEMORIES</span>
              <strong>
                The wishes that became real ♡
              </strong>
            </button>
          </section>
        </>
      )}

      {activeView === "create" && selectedCategory && (
        <section className="makeWishView">
          <button
            className="giftBack"
            type="button"
            onClick={() => setActiveView("home")}
          >
            ← Back to Wish Note
          </button>

          <div className="makeWishCard">
            <div className="makeWishCategory">
              <span>{selectedCategory.icon}</span>
              <p>{selectedCategory.name}</p>
            </div>

            <p className="giftEyebrow">
              MAKE A LITTLE PROMISE
            </p>

            <h1>
              WRITE YOUR
              <br />
              <span>WISH.</span>
            </h1>

            <label className="giftField">
              <span>WHAT DO YOU WISH FOR?</span>

              <textarea
                rows={5}
                maxLength={180}
                value={wishText}
                onChange={(event) =>
                  setWishText(event.target.value)
                }
                placeholder="I wish we could..."
              />

              <small>{wishText.length}/180</small>
            </label>

            <label className="giftField">
              <span>WHEN WOULD YOU LOVE TO DO IT?</span>

              <input
                type="date"
                value={wishDate}
                onChange={(event) =>
                  setWishDate(event.target.value)
                }
              />
            </label>

            <label className="giftField">
              <span>PLACE — OPTIONAL</span>

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

            <label className="giftField">
              <span>A LITTLE NOTE — OPTIONAL</span>

              <textarea
                rows={3}
                maxLength={140}
                value={wishNote}
                onChange={(event) =>
                  setWishNote(event.target.value)
                }
                placeholder="Something only the two of you understand..."
              />

              <small>{wishNote.length}/140</small>
            </label>

            <button
              className="sealWishButton"
              type="button"
              disabled={!wishText.trim() || !wishDate}
              onClick={sealWish}
            >
              <span>♥</span>
              Seal Wish ♡
            </button>

            <p className="sealHint">
              Your wish will be added to Our Wishes.
            </p>
          </div>
        </section>
      )}

      {activeView === "wishes" && (
        <section className="ourWishesView">
          <button
            className="giftBack"
            type="button"
            onClick={() => setActiveView("home")}
          >
            ← Back to Wish Note
          </button>

          <div className="ourWishesHeading">
            <p className="giftEyebrow">
              THINGS TO LOOK FORWARD TO
            </p>

            <h1>
              OUR
              <br />
              <span>WISHES.</span>
            </h1>

            <p>
              Little plans, big dreams and everything in between.
            </p>
          </div>

          <div className="wishTimeline">
            {sortedWishes.length === 0 ? (
              <div className="emptyWishes">
                <span>♡</span>
                <h2>No wishes yet.</h2>
                <p>
                  Your little world is waiting for its first one.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveView("home")}
                >
                  Make a Wish →
                </button>
              </div>
            ) : (
              sortedWishes.map((wish) => {
                const category = getCategory(wish.category);

                return (
                  <article
                    className="wishTimelineCard"
                    key={wish.id}
                  >
                    <div className="wishTimelineDate">
                      <span>{formatDate(wish.date)}</span>
                      <i>{category?.icon || "♡"}</i>
                    </div>

                    <p className="wishTimelineCategory">
                      {category?.name}
                    </p>

                    <h2>{wish.text}</h2>

                    {wish.place && (
                      <p className="wishPlace">
                        ⌖ {wish.place}
                      </p>
                    )}

                    {wish.note && (
                      <p className="wishPersonalNote">
                        “{wish.note}”
                      </p>
                    )}

                    <div className="wishStatus">
                      <span></span>
                      WAITING TO HAPPEN
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeView === "memories" && (
        <section className="giftMemoriesView">
          <button
            className="giftBack"
            type="button"
            onClick={() => setActiveView("home")}
          >
            ← Back to Wish Note
          </button>

          <div className="memoriesEmpty">
            <span>♡</span>

            <p className="giftEyebrow">
              WISHES THAT BECAME REAL
            </p>

            <h1>
              OUR
              <br />
              <span>MEMORIES.</span>
            </h1>

            <p>
              When a wish comes true, its story will live here.
            </p>

            <div className="memoryEmptyPhoto">
              YOUR FUTURE MEMORY
            </div>

            <small>
              photos · little notes · dates · moments
            </small>
          </div>
        </section>
      )}

      <footer className="giftSpaceFooter">
        <span>WISH + LOVE + LIFE</span>
        <p>made with WIVELI ♡</p>
      </footer>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import CuteCalendar from "../../components/CuteCalendar";

const STORAGE_KEY = "wiveli-wish-note-v1";

const categories = [
  { id: "dream", name: "Dream Together", icon: "♡", description: "Something you dream of doing together" },
  { id: "food", name: "Food & Places", icon: "✦", description: "A restaurant, trip or place to discover" },
  { id: "time", name: "Our Time", icon: "♥", description: "A date or little moment together" },
  { id: "little", name: "Little Things", icon: "☺", description: "Something simple that would make you happy" },
  { id: "adventures", name: "Adventures", icon: "∞", description: "Something exciting you've always wanted to try" },
  { id: "special", name: "Something Special", icon: "✉", description: "Anything that doesn't fit anywhere else" },
];

const pad = (number) => String(number).padStart(2, "0");

const toDateValue = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default function WishNoteGift() {
  const [loaded, setLoaded] = useState(false);

  const [step, setStep] = useState("card");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [wishText, setWishText] = useState("");
  const [wishDate, setWishDate] = useState("");
  const [wishTime, setWishTime] = useState("");
  const [wishPlace, setWishPlace] = useState("");

  const [wishes, setWishes] = useState([]);
  const [openedWish, setOpenedWish] = useState(null);

  const [memoryNote, setMemoryNote] = useState("");
  const [memoryFiles, setMemoryFiles] = useState([]);

  const [calendarDate, setCalendarDate] = useState(new Date());

  /* LOAD */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.wishes)) {
          setWishes(parsed.wishes);
        }
      }
    } catch (error) {
      console.error("Could not load Wish Note:", error);
    }

    setLoaded(true);
  }, []);

  /* SAVE */

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        wishes,
        updatedAt: new Date().toISOString(),
      })
    );
  }, [wishes, loaded]);

  const formatDate = (date) => {
    if (!date) return "Any day";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setWishText("");
    setWishDate("");
    setWishTime("");
    setWishPlace("");
  };

  const saveWish = () => {
    const newWish = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: selectedCategory,
      text: wishText.trim(),
      date: wishDate,
      time: wishTime,
      place: wishPlace.trim(),
      createdAt: new Date().toISOString(),
      memory: null,
    };

    setWishes((current) => [...current, newWish]);
    setOpenedWish(newWish);

    resetForm();
    setStep("success");
  };

  const openWish = (wish) => {
    setOpenedWish(wish);
    setMemoryNote(wish.memory?.note || "");
    setMemoryFiles([]);
    setStep("wish-detail");
  };

  const saveMemory = () => {
    if (!openedWish) return;

    const fileInfo = memoryFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    const memory = {
      note: memoryNote.trim(),
      files: fileInfo,
      createdAt: new Date().toISOString(),
    };

    setWishes((current) =>
      current.map((wish) =>
        wish.id === openedWish.id
          ? { ...wish, memory }
          : wish
      )
    );

    setOpenedWish((current) => ({
      ...current,
      memory,
    }));

    setStep("memory-saved");
  };

  /* CALENDAR */

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const calendarDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const mondayIndex = (first.getDay() + 6) % 7;

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(year, month, index - mondayIndex + 1);

      return {
        date,
        value: toDateValue(date),
        number: date.getDate(),
        currentMonth: date.getMonth() === month,
      };
    });
  }, [year, month]);

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(calendarDate);

  const changeCalendarMonth = (amount) => {
    setCalendarDate(new Date(year, month + amount, 1));
  };

  const wishesByDate = useMemo(() => {
    const map = {};

    wishes.forEach((wish) => {
      if (!wish.date) return;

      if (!map[wish.date]) {
        map[wish.date] = [];
      }

      map[wish.date].push(wish);
    });

    return map;
  }, [wishes]);

  const memoryCount = wishes.filter((wish) => wish.memory).length;

  return (
    <main className="wishExperience">
      <div className="wishExperienceGlow wishExperienceGlowOne" />
      <div className="wishExperienceGlow wishExperienceGlowTwo" />

      <header className="wishExperienceHeader">
        <div>
          WISH NOTE <span>♡</span>
        </div>

        <p>MADE WITH WIVELI</p>
      </header>

      {/* HOME */}

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
            <p>
              {wishes.length
                ? "YOUR LITTLE WORLD TOGETHER"
                : "A LITTLE SOMETHING FOR YOU"}
            </p>

            <h1>
              {wishes.length ? (
                <>
                  OUR
                  <br />
                  WISHES<span>.</span>
                </>
              ) : (
                <>
                  MAKE
                  <br />
                  A WISH<span>.</span>
                </>
              )}
            </h1>

            <p className="wishOpeningMessage">
              {wishes.length
                ? `${wishes.length} ${
                    wishes.length === 1 ? "wish is" : "wishes are"
                  } waiting to become memories.`
                : "Your wishes, our plans, and memories waiting to happen."}
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
              MAKE A WISH <span>♡</span>
            </button>
          </div>
        </div>
      </section>

      {/* AFTER FIRST WISH */}

      {wishes.length > 0 && step === "card" && (
        <div className="wishLifeLauncher">
          <button
            type="button"
            onClick={() => setStep("calendar")}
          >
            <span>♡</span>

            <div>
              <small>OUR CALENDAR</small>
              <strong>
                {wishes.length} {wishes.length === 1 ? "wish" : "wishes"}
              </strong>
            </div>

            <b>→</b>
          </button>

          <button
            type="button"
            onClick={() => setStep("book")}
          >
            <span>✦</span>

            <div>
              <small>OUR WISH BOOK</small>
              <strong>{memoryCount} memories</strong>
            </div>

            <b>→</b>
          </button>
        </div>
      )}

      {/* MODALS */}

      {step !== "card" && (
        <div className="wishModalLayer">

          {/* CATEGORY */}

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

                <span>Choose the feeling that fits your wish.</span>
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

          {/* WRITE */}

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

                <span>What would make you smile?</span>
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
                CHOOSE WHEN <span>→</span>
              </button>
            </div>
          )}

          {/* DATE */}

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
                REVIEW MY WISH <span>→</span>
              </button>
            </div>
          )}

          {/* REVIEW */}

          {step === "review" && (
            <div className="wishGlassModal wishReviewModal">
              <button
                className="wishModalClose"
                type="button"
                onClick={() => setStep("card")}
              >
                ×
              </button>

              <div className="wishReviewHeart">♡</div>

              <div className="wishModalHeading">
                <p>ONE LAST LOOK</p>

                <h2>
                  YOUR
                  <br />
                  WISH<span>.</span>
                </h2>

                <span>Make sure everything feels right.</span>
              </div>

              <div className="wishReviewCard">
                <div className="wishReviewCategory">
                  <span>{selectedCategory?.icon}</span>
                  <p>{selectedCategory?.name}</p>
                </div>

                <h3>{wishText}</h3>

                <div className="wishReviewDetails">
                  <div>
                    <small>DATE</small>
                    <strong>{formatDate(wishDate)}</strong>
                  </div>

                  <div>
                    <small>TIME</small>
                    <strong>{wishTime || "Any time"}</strong>
                  </div>

                  <div>
                    <small>PLACE</small>
                    <strong>{wishPlace || "Anywhere"}</strong>
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
                  onClick={saveWish}
                >
                  SEND MY WISH <span>♡</span>
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}

          {step === "success" && (
            <div className="wishGlassModal wishSuccessModal">
              <div className="wishSuccessSymbol">♥</div>

              <p>WISH SAVED</p>

              <h2>
                YOUR WISH
                <br />
                IS ON ITS WAY<span>.</span>
              </h2>

              <div className="wishSuccessLine" />

              <p className="wishSuccessText">
                Your wish now has a place
                <br />
                in your shared calendar.
              </p>

              <button
                type="button"
                onClick={() => setStep("calendar")}
              >
                OPEN OUR CALENDAR
              </button>

              <button
                type="button"
                className="wishSuccessSecondary"
                onClick={() => setStep("card")}
              >
                BACK TO GIFT
              </button>
            </div>
          )}

          {/* CALENDAR */}

          {step === "calendar" && (
            <div className="wishGlassModal wishLifeCalendarModal">
              <button
                className="wishModalClose"
                type="button"
                onClick={() => setStep("card")}
              >
                ×
              </button>

              <div className="wishModalHeading">
                <p>OUR CALENDAR ♡</p>

                <h2>
                  WISHES BECOME
                  <br />
                  MOMENTS<span>.</span>
                </h2>

                <span>
                  Tap a marked day to open the wish.
                </span>
              </div>

              <div className="wishLifeCalendar">
                <div className="wishLifeCalendarTop">
                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(-1)}
                  >
                    ‹
                  </button>

                  <h3>{monthName}</h3>

                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(1)}
                  >
                    ›
                  </button>
                </div>

                <div className="wishLifeWeek">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    )
                  )}
                </div>

                <div className="wishLifeDays">
                  {calendarDays.map((day) => {
                    const dayWishes =
                      wishesByDate[day.value] || [];

                    return (
                      <button
                        type="button"
                        key={day.date.toISOString()}
                        className={[
                          "wishLifeDay",
                          !day.currentMonth ? "outside" : "",
                          dayWishes.length ? "hasWish" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => {
                          if (dayWishes.length) {
                            openWish(dayWishes[0]);
                          }
                        }}
                      >
                        <small>{day.number}</small>

                        {dayWishes.length > 0 && (
                          <div className="wishLifeDayIcons">
                            {dayWishes.slice(0, 3).map((wish) => (
                              <span key={wish.id}>
                                {wish.category?.icon || "♡"}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="wishCalendarLegend">
                {categories.map((category) => (
                  <span key={category.id}>
                    <i>{category.icon}</i>
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* WISH DETAIL */}

          {step === "wish-detail" && openedWish && (
            <div className="wishGlassModal wishMemoryModal">
              <button
                className="wishModalBack"
                type="button"
                onClick={() => setStep("calendar")}
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

              <div className="wishMemoryCategory">
                <span>{openedWish.category?.icon}</span>
                {openedWish.category?.name}
              </div>

              <p className="wishMemoryDate">
                {formatDate(openedWish.date)}
              </p>

              <h2 className="wishMemoryWish">
                “{openedWish.text}”
              </h2>

              <div className="wishMemoryMeta">
                <div>
                  <small>TIME</small>
                  <strong>{openedWish.time || "Any time"}</strong>
                </div>

                <div>
                  <small>PLACE</small>
                  <strong>{openedWish.place || "Anywhere"}</strong>
                </div>
              </div>

              {openedWish.memory ? (
                <div className="wishExistingMemory">
                  <p>THIS BECAME A MEMORY ♡</p>

                  <blockquote>
                    {openedWish.memory.note ||
                      "A little moment worth remembering."}
                  </blockquote>

                  {!!openedWish.memory.files?.length && (
                    <span>
                      {openedWish.memory.files.length} media{" "}
                      {openedWish.memory.files.length === 1
                        ? "file"
                        : "files"}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep("memory")}
                  >
                    EDIT MEMORY
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="wishContinueButton"
                  onClick={() => setStep("memory")}
                >
                  ADD A MEMORY <span>♡</span>
                </button>
              )}
            </div>
          )}

          {/* ADD MEMORY */}

          {step === "memory" && openedWish && (
            <div className="wishGlassModal wishAddMemoryModal">
              <button
                className="wishModalBack"
                type="button"
                onClick={() => setStep("wish-detail")}
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
                <p>ADD A MEMORY ♡</p>

                <h2>
                  KEEP THIS
                  <br />
                  MOMENT<span>.</span>
                </h2>

                <span>
                  Add something that will bring you back here.
                </span>
              </div>

              <label className="wishMemoryUpload">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={(event) =>
                    setMemoryFiles(
                      Array.from(event.target.files || [])
                    )
                  }
                />

                <span>＋</span>
                <strong>PHOTO · VIDEO · VOICE</strong>
                <small>
                  {memoryFiles.length
                    ? `${memoryFiles.length} selected`
                    : "Choose memories from this day"}
                </small>
              </label>

              <label className="wishMainInput">
                <span>YOUR NOTE</span>

                <textarea
                  rows={4}
                  maxLength={300}
                  value={memoryNote}
                  onChange={(event) =>
                    setMemoryNote(event.target.value)
                  }
                  placeholder="What made this day special?"
                />

                <small>{memoryNote.length}/300</small>
              </label>

              <button
                type="button"
                className="wishContinueButton"
                onClick={saveMemory}
              >
                SAVE THIS MEMORY <span>♡</span>
              </button>

              <p className="wishMemoryStorageNotice">
                Media upload is in preview mode — file names are saved
                locally until cloud storage is connected.
              </p>
            </div>
          )}

          {/* MEMORY SAVED */}

          {step === "memory-saved" && (
            <div className="wishGlassModal wishSuccessModal">
              <div className="wishSuccessSymbol">✦</div>

              <p>MEMORY SAVED</p>

              <h2>
                ONE WISH
                <br />
                BECAME A MEMORY<span>.</span>
              </h2>

              <div className="wishSuccessLine" />

              <p className="wishSuccessText">
                This moment is now part
                <br />
                of your Wish Book.
              </p>

              <button
                type="button"
                onClick={() => setStep("book")}
              >
                OPEN OUR WISH BOOK
              </button>
            </div>
          )}

          {/* WISH BOOK */}

          {step === "book" && (
            <div className="wishGlassModal wishBookModal">
              <button
                className="wishModalClose"
                type="button"
                onClick={() => setStep("card")}
              >
                ×
              </button>

              <div className="wishModalHeading">
                <p>OUR WISH BOOK ♡</p>

                <h2>
                  OUR LITTLE
                  <br />
                  STORY<span>.</span>
                </h2>

                <span>
                  Wishes that turned into something real.
                </span>
              </div>

              <div className="wishBookStats">
                <div>
                  <strong>{wishes.length}</strong>
                  <span>WISHES</span>
                </div>

                <div>
                  <strong>{memoryCount}</strong>
                  <span>MEMORIES</span>
                </div>
              </div>

              <div className="wishBookList">
                {wishes
                  .filter((wish) => wish.memory)
                  .sort(
                    (a, b) =>
                      new Date(a.date) - new Date(b.date)
                  )
                  .map((wish, index) => (
                    <button
                      type="button"
                      key={wish.id}
                      onClick={() => openWish(wish)}
                    >
                      <small>
                        {String(index + 1).padStart(2, "0")}
                      </small>

                      <span>{wish.category?.icon}</span>

                      <div>
                        <strong>{wish.text}</strong>
                        <p>{formatDate(wish.date)}</p>
                      </div>

                      <b>↗</b>
                    </button>
                  ))}

                {memoryCount === 0 && (
                  <div className="wishBookEmpty">
                    <span>♡</span>
                    <strong>Your story starts here.</strong>
                    <p>
                      When a wish comes true, add a memory to
                      keep it forever.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

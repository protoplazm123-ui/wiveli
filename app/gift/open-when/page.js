"use client";

import { useEffect, useMemo, useState } from "react";

const FALLBACK = {
  recipient: "Masha",
  sender: "Alex",
  theme: {
    id: "cosmic",
    accent: "#8c63c7",
    customBackground: null,
  },
  moments: [
    {
      id: "miss-me",
      title: "YOU MISS ME",
      message:
        "If you're opening this, I wish I could be right there with you. Keep this little piece of me close until I am. ♡",
      photo: null,
      voice: null,
      video: null,
      place: "",
      date: "",
      time: "",
      interaction: {
        enabled: false,
      },
    },
    {
      id: "movie",
      title: "YOU MISS OUR MOVIE NIGHTS",
      message:
        "Remember this night? I still think about how simple and perfect it felt.",
      photo: null,
      voice: null,
      video: null,
      place: "Our cinema",
      date: "September 27",
      time: "19:30",
      interaction: {
        enabled: true,
        type: "movie",
        question: "WOULD YOU GO TO THE MOVIES WITH ME AGAIN?",
        text: "One more movie night. Just us.",
        button: "YES, LET'S DO IT ♡",
        response: "Masha wants to go to the movies with you again ♡",
      },
    },
  ],
};

const POSITIONS = [
  { x: 67, y: 20, r: -8 },
  { x: 80, y: 37, r: 7 },
  { x: 65, y: 54, r: -4 },
  { x: 84, y: 67, r: 9 },
  { x: 72, y: 78, r: -7 },
  { x: 91, y: 50, r: 4 },
  { x: 55, y: 68, r: 6 },
  { x: 88, y: 23, r: -5 },
];

export default function OpenWhenGiftPage() {
  const [gift, setGift] = useState(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  const [opened, setOpened] = useState([]);
  const [responses, setResponses] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [focused, setFocused] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [responseSent, setResponseSent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wiveli-open-when-v2");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (parsed?.moments?.length) {
          setGift({
            ...FALLBACK,
            ...parsed,
            theme: {
              ...FALLBACK.theme,
              ...(parsed.theme || {}),
            },
          });
        }
      }

      const openedStored = localStorage.getItem(
        "wiveli-open-when-opened-v1"
      );

      if (openedStored) {
        setOpened(JSON.parse(openedStored));
      }

      const responsesStored = localStorage.getItem(
        "wiveli-open-when-responses-v1"
      );

      if (responsesStored) {
        setResponses(JSON.parse(responsesStored));
      }
    } catch (error) {
      console.error(error);
    }

    setLoaded(true);
  }, []);

  const selected = useMemo(
    () =>
      gift.moments.find(
        (moment) => String(moment.id) === String(selectedId)
      ),
    [gift, selectedId]
  );

  const theme = gift.theme?.id || "cosmic";
  const accent = gift.theme?.accent || "#8c63c7";

  const isOpened = (id) =>
    opened.map(String).includes(String(id));

  const hasResponded = (id) =>
    responses.some(
      (item) => String(item.momentId) === String(id)
    );

  const saveEvent = (event) => {
    try {
      const current = JSON.parse(
        localStorage.getItem("wiveli-open-when-events-v1") || "[]"
      );

      localStorage.setItem(
        "wiveli-open-when-events-v1",
        JSON.stringify([...current, event])
      );
    } catch (error) {
      console.error(error);
    }
  };

  const chooseMoment = (moment) => {
    setSelectedId(moment.id);
    setShowExtras(false);
    setFlipped(false);
    setResponseSent(hasResponded(moment.id));

    requestAnimationFrame(() => {
      setFocused(true);
    });
  };

  const markOpened = (moment) => {
    if (isOpened(moment.id)) return;

    const next = [...opened, moment.id];

    setOpened(next);

    try {
      localStorage.setItem(
        "wiveli-open-when-opened-v1",
        JSON.stringify(next)
      );
    } catch (error) {
      console.error(error);
    }

    saveEvent({
      id: `opened-${moment.id}-${Date.now()}`,
      type: "OPENED",
      momentId: moment.id,
      momentTitle: moment.title,
      recipient: gift.recipient,
      sender: gift.sender,
      message: `${gift.recipient} opened "${moment.title}" ♡`,
      createdAt: new Date().toISOString(),
    });
  };

  const flipCard = () => {
    if (!selected) return;

    if (!flipped) {
      setFlipped(true);
      markOpened(selected);
    } else {
      setFlipped(false);
    }
  };

  const sendResponse = () => {
    if (!selected?.interaction?.enabled) return;
    if (hasResponded(selected.id) || responseSent) return;

    const response = {
      id: `response-${selected.id}-${Date.now()}`,
      momentId: selected.id,
      momentTitle: selected.title,
      recipient: gift.recipient,
      sender: gift.sender,
      message:
        selected.interaction.response ||
        `${gift.recipient} wants to do this with you ♡`,
      createdAt: new Date().toISOString(),
    };

    const next = [...responses, response];

    setResponses(next);
    setResponseSent(true);

    localStorage.setItem(
      "wiveli-open-when-responses-v1",
      JSON.stringify(next)
    );

    saveEvent({
      ...response,
      type: "RESPONSE",
    });
  };

  const returnCard = () => {
    setShowExtras(false);
    setFlipped(false);

    setTimeout(() => {
      setFocused(false);

      setTimeout(() => {
        setSelectedId(null);
      }, 400);
    }, 100);
  };

  const allOpened =
    gift.moments.length > 0 &&
    gift.moments.every((moment) => isOpened(moment.id));

  const customBackground = gift.theme?.customBackground;
  const customIsVideo =
    typeof customBackground === "string" &&
    customBackground.startsWith("data:video");

  if (!loaded) {
    return <main className="owrPage" />;
  }

  return (
    <main
      className={`owrPage owrTheme-${theme} ${
        focused ? "owrHasFocus" : ""
      }`}
      style={{ "--owr-accent": accent }}
    >
      {/* COSMIC */}

      {theme === "cosmic" && (
        <video
          className="owrBackground"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="/assets/open-when/OPEN.mp4"
            type="video/mp4"
          />
        </video>
      )}

      {/* CUSTOM BACKGROUND */}

      {theme === "custom" && customBackground && (
        <>
          {customIsVideo ? (
            <video
              className="owrBackground"
              src={customBackground}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div
              className="owrBackground owrCustomImage"
              style={{
                backgroundImage: `url("${customBackground}")`,
              }}
            />
          )}
        </>
      )}

      {/* CSS WORLDS */}

      {theme !== "cosmic" &&
        !(theme === "custom" && customBackground) && (
          <div className="owrGeneratedWorld">
            <div className="owrWorldOrb owrOrbOne" />
            <div className="owrWorldOrb owrOrbTwo" />
            <div className="owrWorldOrb owrOrbThree" />

            {theme === "romantic" && (
              <div className="owrRomanticHearts">
                <i>♡</i>
                <i>♡</i>
                <i>♡</i>
                <i>♡</i>
                <i>♡</i>
              </div>
            )}

            {theme === "tech" && (
              <div className="owrTechGrid">
                <span>OPEN / WHEN</span>
                <span>01 — MEMORY SYSTEM</span>
              </div>
            )}

            {theme === "dreamy" && (
              <div className="owrClouds">
                <i />
                <i />
                <i />
              </div>
            )}

            {theme === "custom" && (
              <div className="owrCustomSymbol">∞</div>
            )}
          </div>
        )}

      <div className="owrShade" />
      <div className="owrStars" />

      <header className="owrHeader">
        <a href="/" className="owrLogo">
          WI<span>♥</span>ELI
        </a>

        <span>
          {theme === "romantic"
            ? "MADE WITH LOVE"
            : theme === "tech"
            ? "PERSONAL MEMORY SYSTEM"
            : theme === "dreamy"
            ? "A LITTLE WORLD FOR YOU"
            : theme === "custom"
            ? "MADE JUST FOR YOU"
            : "A LITTLE SOMETHING FOR YOU"}
        </span>
      </header>

      <div className="owrHint">
        <span>FROM {gift.sender || "SOMEONE SPECIAL"}</span>
        <p>
          {theme === "romantic"
            ? "For every moment you need a little bit of me."
            : theme === "tech"
            ? "Select a moment."
            : theme === "dreamy"
            ? "Choose whatever your heart needs."
            : "Choose the moment you need."}
        </p>
      </div>

      <section className="owrUniverse">
        <div className="owrBurstPoint">
          <i />
          <i />
          <i />
        </div>

        {gift.moments.map((moment, index) => {
          const position =
            POSITIONS[index % POSITIONS.length];

          const openedMoment = isOpened(moment.id);

          return (
            <button
              type="button"
              key={moment.id}
              className={`owrFloatingCard ${
                openedMoment ? "isOpened" : ""
              }`}
              style={{
                "--owr-x": `${position.x}%`,
                "--owr-y": `${position.y}%`,
                "--owr-r": `${position.r}deg`,
                "--owr-delay": `${index * -0.7}s`,
              }}
              onClick={() => chooseMoment(moment)}
            >
              {openedMoment ? (
                <div className="owrMemoryCard">
                  {moment.photo ? (
                    <img src={moment.photo} alt="" />
                  ) : (
                    <div className="owrMemoryFallback">
                      <span>♡</span>
                    </div>
                  )}

                  <div>
                    <small>OPENED ♡</small>
                    <strong>{moment.title}</strong>
                  </div>
                </div>
              ) : (
                <div className="owrClosedCard">
                  <div className="owrCardStar">
                    {theme === "tech" ? "◇" : "✦"}
                  </div>

                  <small>OPEN WHEN</small>
                  <strong>{moment.title}</strong>
                  <span>TAP TO OPEN</span>
                </div>
              )}
            </button>
          );
        })}
      </section>

      {allOpened && !focused && (
        <div className="owrAllOpened">
          <span>YOU'VE OPENED THEM ALL.</span>
          <p>
            But they're still here whenever you need them. ♡
          </p>
        </div>
      )}

      {selected && (
        <section
          className={`owrFocusLayer ${
            focused ? "isVisible" : ""
          }`}
        >
          <button
            type="button"
            className="owrBack"
            onClick={returnCard}
          >
            ← BACK TO MY MOMENTS
          </button>

          <div className="owrFocusGlow" />

          <div className="owrFocusArea">
            <button
              type="button"
              className={`owrBigCard ${
                flipped ? "isFlipped" : ""
              }`}
              onClick={flipCard}
            >
              <div className="owrBigCardInner">
                <div className="owrBigFront">
                  <span className="owrFrontNumber">
                    {String(
                      gift.moments.findIndex(
                        (item) =>
                          String(item.id) ===
                          String(selected.id)
                      ) + 1
                    ).padStart(2, "0")}
                  </span>

                  <span className="owrFrontStar">
                    {theme === "tech" ? "◇" : "✦"}
                  </span>

                  <div>
                    <small>OPEN WHEN</small>
                    <h1>{selected.title}</h1>
                  </div>

                  <span className="owrTap">
                    TAP TO TURN OVER
                  </span>
                </div>

                <div className="owrBigBack">
                  <span className="owrBackLabel">
                    JUST FOR YOU ♡
                  </span>

                  <p>
                    {selected.message ||
                      "There is something I wanted you to remember when you opened this."}
                  </p>

                  {(selected.date ||
                    selected.time ||
                    selected.place) && (
                    <div className="owrMeta">
                      {selected.date && (
                        <div>
                          <span>DATE</span>
                          <strong>{selected.date}</strong>
                        </div>
                      )}

                      {selected.time && (
                        <div>
                          <span>TIME</span>
                          <strong>{selected.time}</strong>
                        </div>
                      )}

                      {selected.place && (
                        <div>
                          <span>PLACE</span>
                          <strong>{selected.place}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="owrBackHeart">♡</span>
                </div>
              </div>
            </button>

            {flipped && (
              <div className="owrAfterCard">
                {(selected.photo ||
                  selected.voice ||
                  selected.video) && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowExtras((value) => !value)
                    }
                  >
                    {showExtras
                      ? "CLOSE EXTRAS ↑"
                      : "THERE'S MORE ♡"}
                  </button>
                )}

                <button
                  type="button"
                  className="owrKeepButton"
                  onClick={returnCard}
                >
                  KEEP THIS ONE CLOSE ♡
                </button>
              </div>
            )}

            {flipped && selected.interaction?.enabled && (
              <div className="owrInteraction">
                <span>♡ A LITTLE QUESTION</span>

                <h2>
                  {selected.interaction.question ||
                    "WOULD YOU DO THIS WITH ME?"}
                </h2>

                <p>
                  {selected.interaction.text ||
                    "Maybe this deserves another memory."}
                </p>

                {!responseSent ? (
                  <button
                    type="button"
                    onClick={sendResponse}
                  >
                    {selected.interaction.button ||
                      `TELL ${gift.sender?.toUpperCase()} ♡`}
                  </button>
                ) : (
                  <div className="owrSent">
                    <strong>
                      SENT TO {gift.sender?.toUpperCase()} ♡
                    </strong>
                    <small>
                      They'll know you want this too.
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>

          {flipped && showExtras && (
            <aside className="owrExtras">
              <div className="owrExtrasTitle">
                <span>ONE MORE THING ♡</span>
                <p>A few little pieces left for you.</p>
              </div>

              {selected.photo && (
                <div className="owrPhoto">
                  <img src={selected.photo} alt="" />
                </div>
              )}

              {selected.voice && (
                <div className="owrAudio">
                  <span>◉ A LITTLE MESSAGE FROM ME</span>
                  <audio src={selected.voice} controls />
                </div>
              )}

              {selected.video && (
                <div className="owrVideo">
                  <video
                    src={selected.video}
                    controls
                    playsInline
                  />
                </div>
              )}
            </aside>
          )}
        </section>
      )}
    </main>
  );
}

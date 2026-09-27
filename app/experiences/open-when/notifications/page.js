"use client";

import { useEffect, useMemo, useState } from "react";

export default function OpenWhenNotificationsPage() {
  const [events, setEvents] = useState([]);
  const [gift, setGift] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [loaded, setLoaded] = useState(false);

  const loadData = () => {
    try {
      const storedGift = JSON.parse(
        localStorage.getItem("wiveli-open-when-v2") || "null"
      );

      const storedEvents = JSON.parse(
        localStorage.getItem("wiveli-open-when-events-v1") || "[]"
      );

      setGift(storedGift);

      setEvents(
        [...storedEvents].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error(error);
    }

    setLoaded(true);
  };

  useEffect(() => {
    loadData();

    const refresh = () => loadData();

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const visibleEvents = useMemo(() => {
    if (filter === "ALL") return events;

    return events.filter((event) => event.type === filter);
  }, [events, filter]);

  const openedCount = events.filter(
    (event) => event.type === "OPENED"
  ).length;

  const responseCount = events.filter(
    (event) => event.type === "RESPONSE"
  ).length;

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const clearEvents = () => {
    if (
      !window.confirm(
        "Clear all Open When activity for this prototype?"
      )
    ) {
      return;
    }

    localStorage.removeItem("wiveli-open-when-events-v1");
    setEvents([]);
  };

  if (!loaded) {
    return <main className="ownPage" />;
  }

  return (
    <main className="ownPage">
      <div className="ownGlow ownGlowOne" />
      <div className="ownGlow ownGlowTwo" />

      <header className="ownHeader">
        <a href="/" className="ownLogo">
          WI<span>♥</span>ELI
        </a>

        <span>OPEN WHEN / ACTIVITY</span>

        <a
          href="/experiences/open-when"
          className="ownBack"
        >
          EDIT GIFT →
        </a>
      </header>

      <section className="ownHero">
        <div>
          <span className="ownEyebrow">
            YOUR GIFT IS ALIVE ♡
          </span>

          <h1>
            Little moments,
            <br />
            <em>coming back to you.</em>
          </h1>

          <p>
            See when{" "}
            <strong>
              {gift?.recipient || "your person"}
            </strong>{" "}
            opens something you made for them — and when
            they want to turn a memory into another one.
          </p>
        </div>

        <div className="ownStats">
          <div>
            <span>OPENED</span>
            <strong>{openedCount}</strong>
          </div>

          <div>
            <span>RESPONSES</span>
            <strong>{responseCount}</strong>
          </div>

          <div>
            <span>TOTAL ACTIVITY</span>
            <strong>{events.length}</strong>
          </div>
        </div>
      </section>

      <section className="ownActivity">
        <div className="ownActivityTop">
          <div>
            <span>LIVE ACTIVITY</span>
            <h2>What's happened so far?</h2>
          </div>

          <div className="ownFilters">
            {["ALL", "OPENED", "RESPONSE"].map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  className={
                    filter === item ? "active" : ""
                  }
                  onClick={() => setFilter(item)}
                >
                  {item === "ALL"
                    ? "ALL"
                    : item === "OPENED"
                    ? "OPENED"
                    : "RESPONSES"}
                </button>
              )
            )}
          </div>
        </div>

        {visibleEvents.length === 0 ? (
          <div className="ownEmpty">
            <div className="ownEmptySymbol">♡</div>

            <span>NOTHING HERE YET</span>

            <h3>
              Their first little moment
              <br />
              is still waiting.
            </h3>

            <p>
              When they open an Open When card, you'll see
              it here.
            </p>

            <a href="/gift/open-when">
              OPEN RECIPIENT VIEW →
            </a>
          </div>
        ) : (
          <div className="ownTimeline">
            {visibleEvents.map((event, index) => {
              const response =
                event.type === "RESPONSE";

              return (
                <article
                  className={`ownEvent ${
                    response ? "isResponse" : "isOpened"
                  }`}
                  key={event.id || `${event.type}-${index}`}
                >
                  <div className="ownEventLine">
                    <div className="ownEventIcon">
                      {response ? "♡" : "✦"}
                    </div>
                  </div>

                  <div className="ownEventContent">
                    <div className="ownEventMeta">
                      <span>
                        {response
                          ? "THEY RESPONDED"
                          : "MOMENT OPENED"}
                      </span>

                      <time>
                        {formatDate(event.createdAt)}
                      </time>
                    </div>

                    <h3>
                      {event.message ||
                        (response
                          ? `${
                              gift?.recipient || "They"
                            } sent you something ♡`
                          : `${
                              gift?.recipient || "They"
                            } opened a moment ♡`)}
                    </h3>

                    {event.momentTitle && (
                      <div className="ownMomentName">
                        <span>OPEN WHEN</span>
                        <strong>
                          {event.momentTitle}
                        </strong>
                      </div>
                    )}

                    {response && (
                      <div className="ownResponseBadge">
                        <span>♡</span>

                        <div>
                          <strong>
                            THEY WANT THIS TOO
                          </strong>
                          <small>
                            Maybe it's time to make another
                            memory.
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {events.length > 0 && (
          <div className="ownFooterActions">
            <button
              type="button"
              onClick={loadData}
            >
              ↻ REFRESH ACTIVITY
            </button>

            <button
              type="button"
              onClick={clearEvents}
            >
              CLEAR TEST ACTIVITY
            </button>
          </div>
        )}
      </section>

      <div className="ownTestDock">
        <div>
          <span>PROTOTYPE MODE</span>
          <p>
            Open the recipient view, open a card, then return
            here.
          </p>
        </div>

        <a href="/gift/open-when">
          VIEW AS {gift?.recipient?.toUpperCase() || "RECIPIENT"} →
        </a>
      </div>
    </main>
  );
}

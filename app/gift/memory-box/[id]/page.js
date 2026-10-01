"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./memory-box.css";

const DEMO_GIFT = {
  senderName: "Alex",
  recipientName: "Sophie",

  memories: [
    {
      id: "memory-1",
      title: "Our first little trip",
      date: "14 MAY 2026",
      place: "Kyiv",
      text: "I remember this day so clearly. Nothing was planned perfectly, but somehow that made it even better.",
      media: "",
      gift: "One coffee together ♡",
    },
    {
      id: "memory-2",
      title: "That evening",
      date: "02 JUNE 2026",
      place: "Home",
      text: "One of those completely ordinary evenings that somehow became one of my favourite memories.",
      media: "",
      gift: "Movie night ♡",
    },
    {
      id: "memory-3",
      title: "Our place",
      date: "21 JULY 2026",
      place: "Somewhere special",
      text: "This place will always remind me of us.",
      media: "",
      gift: "Let's go back ♡",
    },
    {
      id: "memory-4",
      title: "Just us",
      date: "08 AUGUST 2026",
      place: "Together",
      text: "I wanted to keep this one somewhere safer than my camera roll.",
      media: "",
      gift: "A little surprise ♡",
    },
  ],
};

export default function MemoryBoxGift() {
  const { id } = useParams();

  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);

  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [repeatOpen, setRepeatOpen] = useState(false);

  useEffect(() => {
    async function loadGift() {
      if (id === "demo") {
        setGift(DEMO_GIFT);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/gifts/${id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (
          response.ok &&
          data.giftType === "memory-box"
        ) {
          setGift(data.giftData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadGift();
  }, [id]);

  if (loading) {
    return (
      <main className="mbLoading">
        <div>♡</div>
        <span>OPENING YOUR MEMORY BOX</span>
      </main>
    );
  }

  if (!gift) {
    return (
      <main className="mbLoading">
        <div>♡</div>
        <span>MEMORY BOX NOT FOUND</span>
      </main>
    );
  }

  return (
    <main className="memoryBoxPage">

      <header className="mbHeader">
        <div className="mbLogo">
          WI♡ELI
        </div>

        <div className="mbPrivate">
          A PRIVATE GIFT
        </div>
      </header>

      {!started ? (
        <section className="introScreen">

          <div className="introCopy">
            <span className="tiny">
              FROM {gift.senderName.toUpperCase()}
            </span>

            <h1>
              our little
              <br />
              <em>memory box.</em>
            </h1>

            <p>
              I kept some of our favourite
              moments here, just for you.
            </p>

            <button
              className="mainButton"
              onClick={() => setStarted(true)}
            >
              <span>TAKE AN ENVELOPE</span>
              <b>♡</b>
            </button>
          </div>

          <div className="boxArea">

            <div className="floatingText one">
              OUR MEMORIES ♡
            </div>

            <div className="floatingText two">
              FOR US
            </div>

            <div className="memoryBox">

              <div className="envelopesPreview">

                <div className="miniEnvelope e1">
                  <span>♡</span>
                </div>

                <div className="miniEnvelope e2">
                  <span>♡</span>
                </div>

                <div className="miniEnvelope e3">
                  <span>♡</span>
                </div>

              </div>

              <div className="boxBack" />

              <div className="boxFront">
                <small>
                  ALL OUR BEST
                </small>

                <strong>
                  MOMENTS
                  <br />
                  TOGETHER
                </strong>

                <span>♡</span>
              </div>

            </div>

          </div>

          <div className="recipient">
            MADE ESPECIALLY FOR{" "}
            <strong>
              {gift.recipientName.toUpperCase()}
            </strong>
          </div>

        </section>
      ) : (
        <section className="envelopeScreen">

          <div className="envelopeTitle">
            <span className="tiny">
              YOUR MEMORIES
            </span>

            <h1>
              choose an
              <br />
              <em>envelope ♡</em>
            </h1>

            <p>
              Every envelope holds
              one moment from us.
            </p>
          </div>

          <div className="envelopePile">

            {gift.memories.map((memory, index) => (
              <button
                key={memory.id}
                className={`bigEnvelope envelope${index + 1}`}
                onClick={() => setSelected(memory)}
              >
                <div className="flap" />

                <div className="seal">
                  ♡
                </div>

                <div className="envelopeInfo">
                  <span>
                    MEMORY
                  </span>

                  <strong>
                    {String(index + 1).padStart(2, "0")}
                  </strong>
                </div>

                <small>
                  OPEN ME
                </small>
              </button>
            ))}

          </div>

          <button
            className="backButton"
            onClick={() => setStarted(false)}
          >
            ← BACK TO THE BOX
          </button>

        </section>
      )}

      {selected && (
        <div
          className="memoryOverlay"
          onClick={() => setSelected(null)}
        >

          <article
            className="memoryWindow"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modalClose"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <div className="memoryPhoto">

              {selected.media ? (
                <img
                  src={selected.media}
                  alt=""
                />
              ) : (
                <div className="photoPlaceholder">
                  ♡
                </div>
              )}

              <span>
                keep this forever
              </span>

            </div>

            <div className="memoryStory">

              <span className="tiny">
                A MEMORY FROM US
              </span>

              <h2>
                {selected.title}
              </h2>

              <div className="memoryMeta">

                <div>
                  <small>WHEN</small>
                  <strong>
                    {selected.date}
                  </strong>
                </div>

                <div>
                  <small>WHERE</small>
                  <strong>
                    {selected.place}
                  </strong>
                </div>

              </div>

              <p>
                {selected.text}
              </p>

              {selected.gift && (
                <div className="littleGift">
                  <span>♡</span>

                  <div>
                    <small>
                      A LITTLE SOMETHING
                    </small>

                    <strong>
                      {selected.gift}
                    </strong>
                  </div>
                </div>
              )}

              <button
                className="repeatButton"
                onClick={() => setRepeatOpen(true)}
              >
                I WANT TO LIVE THIS AGAIN ♡
              </button>

            </div>

          </article>

        </div>
      )}

      {repeatOpen && (
        <div className="memoryOverlay">

          <article className="repeatWindow">

            <button
              className="modalClose"
              onClick={() => setRepeatOpen(false)}
            >
              ×
            </button>

            <span className="tiny">
              ONE MORE TIME ♡
            </span>

            <h2>
              let's make it
              <br />
              happen again.
            </h2>

            <div className="repeatFields">

              <label>
                DATE
                <input type="date" />
              </label>

              <label>
                TIME
                <input type="time" />
              </label>

              <label className="full">
                PLACE
                <input
                  type="text"
                  placeholder="Where should we meet?"
                />
              </label>

            </div>

            <button className="sendRequest">
              SEND TO {gift.senderName.toUpperCase()} ♡
            </button>

          </article>

        </div>
      )}

    </main>
  );
}

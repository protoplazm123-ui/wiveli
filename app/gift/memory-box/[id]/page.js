"use client";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "next/navigation";

export default function MemoryBoxGift() {
  const { id } = useParams();

  const [gift, setGift] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [opened, setOpened] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const [seen, setSeen] =
    useState([]);

  const [finalOpen, setFinalOpen] =
    useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            `/api/gifts/${id}`
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.giftType ===
            "memory-box"
        ) {
          setGift(data.giftData);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function openMemory(memory) {
    setSelected(memory);

    setSeen((current) =>
      current.includes(memory.id)
        ? current
        : [...current, memory.id]
    );
  }

  if (loading) {
    return (
      <main className="center">
        Opening your Memory Box ♡
      </main>
    );
  }

  if (!gift) {
    return (
      <main className="center">
        This Memory Box
        couldn&apos;t be found.
      </main>
    );
  }

  if (!opened) {
    return (
      <main className="opening">
        <p>A LITTLE SOMETHING FOR</p>

        <h1>
          {gift.recipientName}
          <br />
          <em>♡</em>
        </h1>

        <div className="box">
          <span>MEMORY BOX</span>
          <strong>
            the good
            <br />
            stuff.
          </strong>
          <i>♡</i>
        </div>

        <p className="from">
          made by {gift.senderName}
        </p>

        <button
          onClick={() =>
            setOpened(true)
          }
        >
          OPEN THE BOX →
        </button>

        <style jsx>{styles}</style>
      </main>
    );
  }

  return (
    <main className="inside">
      <header>
        <span>WI♡ELI</span>

        <small>
          {seen.length} /{" "}
          {gift.memories.length} OPENED
        </small>
      </header>

      <section className="intro">
        <p>OUR MEMORY BOX ♡</p>

        <h1>
          LITTLE THINGS
          <br />
          <em>WORTH KEEPING.</em>
        </h1>
      </section>

      <section className="memories">
        {gift.memories.map(
          (memory, index) => (
            <button
              className={`memory ${
                seen.includes(
                  memory.id
                )
                  ? "seen"
                  : ""
              }`}
              key={memory.id}
              onClick={() =>
                openMemory(memory)
              }
              style={{
                transform: `rotate(${
                  index % 2
                    ? 1.5
                    : -1.5
                }deg)`,
              }}
            >
              <small>
                {memory.type}
              </small>

              <div className="photo">
                {memory.type ===
                  "PHOTO" &&
                memory.media ? (
                  <img
                    src={memory.media}
                    alt=""
                  />
                ) : (
                  <span>
                    {memory.type ===
                    "VIDEO"
                      ? "▶"
                      : memory.type ===
                        "VOICE NOTE"
                      ? "♪"
                      : "♡"}
                  </span>
                )}
              </div>

              <strong>
                {memory.title}
              </strong>

              <span>
                {String(
                  index + 1
                ).padStart(2, "0")}
              </span>
            </button>
          )
        )}
      </section>

      {seen.length ===
        gift.memories.length &&
        gift.finalMessage && (
          <section className="final">
            <p>AT THE BOTTOM OF THE BOX</p>

            <button
              onClick={() =>
                setFinalOpen(true)
              }
            >
              <span>ONE MORE THING ♡</span>
              <strong>
                OPEN THE ENVELOPE →
              </strong>
            </button>
          </section>
        )}

      {selected && (
        <div
          className="modal"
          onClick={() =>
            setSelected(null)
          }
        >
          <article
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <p>
              {selected.type}
            </p>

            {selected.media &&
              selected.type ===
                "PHOTO" && (
                <img
                  src={
                    selected.media
                  }
                  alt=""
                />
              )}

            {selected.media &&
              selected.type ===
                "VIDEO" && (
                <video
                  src={
                    selected.media
                  }
                  controls
                />
              )}

            {selected.media &&
              selected.type ===
                "VOICE NOTE" && (
                <audio
                  src={
                    selected.media
                  }
                  controls
                />
              )}

            <h2>
              {selected.title}
            </h2>

            <div className="story">
              {selected.text}
            </div>
          </article>
        </div>
      )}

      {finalOpen && (
        <div
          className="modal"
          onClick={() =>
            setFinalOpen(false)
          }
        >
          <article
            className="letter"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="close"
              onClick={() =>
                setFinalOpen(false)
              }
            >
              ×
            </button>

            <p>ONE MORE THING ♡</p>

            <h2>
              FOR{" "}
              {gift.recipientName}.
            </h2>

            <div className="story">
              {gift.finalMessage}
            </div>

            <small>
              LOVE, {gift.senderName}
            </small>
          </article>
        </div>
      )}

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .center,
  .opening,
  .inside {
    min-height: 100svh;
    background: #f5f0e6;
    color: #25221f;
  }

  .center {
    display: grid;
    place-items: center;
    font-family: Georgia, serif;
  }

  .opening {
    padding: 10vh 20px 70px;
    text-align: center;
  }

  .opening > p,
  .intro p,
  .final > p {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .2em;
  }

  .opening h1,
  .intro h1 {
    margin: 18px 0 45px;
    font-family: Georgia, serif;
    font-size: clamp(60px, 10vw, 120px);
    line-height: .8;
    letter-spacing: -.06em;
  }

  h1 em {
    color: #d9b4b7;
    font-weight: 400;
  }

  .box {
    width: min(390px, 85vw);
    aspect-ratio: 1.35;
    margin: auto;
    padding: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 2px solid #25221f;
    border-radius: 12px;
    background: #d9b4b7;
    box-shadow: 0 30px 70px #25221f22;
    transform: rotate(-2deg);
  }

  .box span {
    font-size: 8px;
    letter-spacing: .2em;
  }

  .box strong {
    margin: 18px 0;
    font-family: Georgia, serif;
    font-size: 45px;
    line-height: .8;
    font-style: italic;
  }

  .box i {
    font-family: Georgia, serif;
    font-size: 25px;
  }

  .from {
    margin-top: 30px;
    font-family: Georgia, serif;
    font-style: italic;
  }

  .opening button {
    margin-top: 15px;
    padding: 18px 28px;
    border: 0;
    border-radius: 100px;
    background: #25221f;
    color: #f5f0e6;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .14em;
  }

  header {
    height: 70px;
    padding: 0 5vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #25221f22;
  }

  header span {
    font-family: Georgia, serif;
    font-size: 21px;
    font-weight: 700;
  }

  header small {
    font-size: 7px;
    letter-spacing: .16em;
  }

  .intro {
    padding: 70px 5vw 45px;
  }

  .intro h1 {
    margin-bottom: 0;
  }

  .memories {
    width: min(1050px, calc(100% - 30px));
    margin: auto;
    padding-bottom: 70px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }

  .memory {
    padding: 16px 16px 22px;
    border: 1px solid #25221f33;
    background: #fffaf0;
    color: #25221f;
    text-align: left;
    box-shadow: 0 16px 35px #25221f12;
    cursor: pointer;
    transition: .25s ease;
  }

  .memory:hover {
    transform: translateY(-8px) rotate(0deg) !important;
  }

  .memory.seen {
    opacity: .65;
  }

  .memory small {
    font-size: 7px;
    letter-spacing: .15em;
  }

  .photo {
    aspect-ratio: 1;
    margin: 13px 0 18px;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: #ddd0b8;
    font-family: Georgia, serif;
    font-size: 45px;
  }

  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .memory strong {
    display: block;
    font-family: Georgia, serif;
    font-size: 22px;
    font-style: italic;
  }

  .memory > span {
    display: block;
    margin-top: 12px;
    font-size: 8px;
  }

  .final {
    padding: 70px 20px 100px;
    text-align: center;
    background: #9daa8d;
  }

  .final button {
    width: min(600px, 100%);
    min-height: 220px;
    margin-top: 25px;
    padding: 40px;
    border: 1px solid #25221f;
    background: #f5f0e6;
    color: #25221f;
    cursor: pointer;
    transform: rotate(-1deg);
  }

  .final button span,
  .final button strong {
    display: block;
  }

  .final button span {
    font-family: Georgia, serif;
    font-size: 35px;
    font-style: italic;
  }

  .final button strong {
    margin-top: 35px;
    font-size: 8px;
    letter-spacing: .17em;
  }

  .modal {
    position: fixed;
    inset: 0;
    z-index: 100;
    padding: 20px;
    display: grid;
    place-items: center;
    background: #25221fcc;
    backdrop-filter: blur(10px);
  }

  .modal article {
    position: relative;
    width: min(600px, 100%);
    max-height: calc(100svh - 40px);
    overflow: auto;
    padding: 35px;
    border-radius: 20px;
    background: #f5f0e6;
  }

  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 38px;
    height: 38px;
    border: 1px solid #25221f44;
    border-radius: 50%;
    background: transparent;
    font-size: 22px;
  }

  article > p {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .18em;
  }

  article img,
  article video {
    width: 100%;
    max-height: 50vh;
    margin: 20px 0;
    object-fit: cover;
    border-radius: 10px;
  }

  article audio {
    width: 100%;
    margin: 25px 0;
  }

  article h2 {
    margin: 25px 0 15px;
    font-family: Georgia, serif;
    font-size: clamp(38px, 7vw, 65px);
    line-height: .9;
    font-style: italic;
  }

  .story {
    white-space: pre-wrap;
    font-family: Georgia, serif;
    font-size: 16px;
    line-height: 1.65;
  }

  .letter {
    background: #ddd0b8 !important;
  }

  .letter small {
    display: block;
    margin-top: 35px;
    font-size: 8px;
    letter-spacing: .18em;
  }

  @media (max-width: 750px) {
    .memories {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .intro h1 {
      font-size: 55px;
    }
  }

  @media (max-width: 480px) {
    .memories {
      grid-template-columns: 1fr 1fr;
    }

    .memory {
      padding: 10px 10px 16px;
    }

    .memory strong {
      font-size: 16px;
    }

    .modal article {
      padding: 28px 20px;
    }
  }
`;

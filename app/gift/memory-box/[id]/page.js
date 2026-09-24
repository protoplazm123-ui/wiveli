"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const DEMO_GIFT = {
  senderName: "Alex",
  recipientName: "Sophie",

  memories: [
    {
      id: "demo-1",
      type: "PHOTO",
      title: "That perfect day",
      text:
        "I still think about this day all the time. " +
        "Nothing special was planned — somehow that made it perfect.",
      media: "",
    },
    {
      id: "demo-2",
      type: "MESSAGE",
      title: "Something you said",
      text:
        "You probably don't even remember saying it, " +
        "but I do. Some little things just stay with you.",
      media: "",
    },
    {
      id: "demo-3",
      type: "VIDEO",
      title: "Press play",
      text:
        "One of those tiny moments I never wanted to lose.",
      media: "",
    },
    {
      id: "demo-4",
      type: "VOICE NOTE",
      title: "Listen to this",
      text:
        "Sometimes hearing your voice is enough to bring the whole memory back.",
      media: "",
    },
    {
      id: "demo-5",
      type: "PLACE",
      title: "Our place",
      text:
        "It was just a place until it became part of our story.",
      media: "",
    },
    {
      id: "demo-6",
      type: "LITTLE THING",
      title: "Don't forget this",
      text:
        "The smallest memories somehow end up meaning the most.",
      media: "",
    },
  ],

  finalMessage:
    "I don't know how many memories we'll collect from here, " +
    "but I hope this box keeps getting bigger. Thank you for all the " +
    "ordinary little moments that somehow became my favorite ones. ♡",
};

function symbolFor(type) {
  if (type === "VIDEO") return "▶";
  if (type === "VOICE NOTE") return "♪";
  if (type === "PLACE") return "⌖";
  if (type === "MESSAGE") return "✦";
  if (type === "LITTLE THING") return "♥";

  return "♡";
}

export default function MemoryBoxGift() {
  const { id } = useParams();

  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);

  const [opened, setOpened] = useState(false);

  const [selected, setSelected] =
    useState(null);

  const [seen, setSeen] =
    useState([]);

  const [finalOpen, setFinalOpen] =
    useState(false);

  useEffect(() => {
    async function loadGift() {
      if (id === "demo") {
        setGift(DEMO_GIFT);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/gifts/${id}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (
          response.ok &&
          data.giftType === "memory-box"
        ) {
          setGift(data.giftData);
        }
      } catch (error) {
        console.error(
          "Could not load Memory Box:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadGift();
  }, [id]);

  function openMemory(memory) {
    setSelected(memory);

    setSeen((current) => {
      if (current.includes(memory.id)) {
        return current;
      }

      return [
        ...current,
        memory.id,
      ];
    });
  }

  if (loading) {
    return (
      <main className="loading">
        <span>♡</span>
        <p>OPENING YOUR MEMORY BOX</p>

        <style jsx>{styles}</style>
      </main>
    );
  }

  if (!gift) {
    return (
      <main className="loading">
        <span>♡</span>
        <p>
          THIS MEMORY BOX COULDN&apos;T
          BE FOUND
        </p>

        <style jsx>{styles}</style>
      </main>
    );
  }

  const allSeen =
    gift.memories.length > 0 &&
    seen.length ===
      gift.memories.length;

  if (!opened) {
    return (
      <main className="opening">
        <header className="openingHeader">
          <span>WI♡ELI</span>

          <small>
            A PRIVATE GIFT
          </small>
        </header>

        <section className="openingContent">
          <div className="openingCopy">
            <p className="eyebrow">
              A LITTLE SOMETHING FOR
            </p>

            <h1>
              {gift.recipientName}
              <em>♡</em>
            </h1>

            <p className="introText">
              Some things are too good
              to leave scattered across
              old messages and camera rolls.
            </p>
          </div>

          <div className="boxScene">
            <div className="floatingNote noteOne">
              <span>REMEMBER</span>
              <b>THIS? ♡</b>
            </div>

            <div className="floatingPhoto photoOne">
              <div>♡</div>
              <p>one for the box</p>
            </div>

            <div className="floatingPhoto photoTwo">
              <div>✦</div>
              <p>keep this forever</p>
            </div>

            <div className="giftBox">
              <div className="boxLid">
                <div className="ribbonVertical" />
                <div className="ribbonHorizontal" />
              </div>

              <div className="boxBody">
                <div className="boxLabel">
                  <small>
                    MEMORY BOX
                  </small>

                  <strong>
                    the good
                    <br />
                    stuff.
                  </strong>

                  <span>♡</span>
                </div>
              </div>
            </div>
          </div>

          <div className="openingBottom">
            <p>
              MADE WITH LOVE BY{" "}
              <strong>
                {gift.senderName}
              </strong>
            </p>

            <button
              type="button"
              onClick={() =>
                setOpened(true)
              }
            >
              <span>
                OPEN THE BOX
              </span>

              <b>→</b>
            </button>
          </div>
        </section>

        <style jsx>{styles}</style>
      </main>
    );
  }

  return (
    <main className="inside">
      <header className="topbar">
        <span className="logo">
          WI♡ELI
        </span>

        <div className="progress">
          <span>
            {seen.length} OF{" "}
            {gift.memories.length}
          </span>

          <div>
            <i
              style={{
                width:
                  gift.memories.length
                    ? `${
                        (seen.length /
                          gift.memories
                            .length) *
                        100
                      }%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </header>

      <section className="insideHero">
        <p className="eyebrow">
          {gift.recipientName.toUpperCase()}
          &apos;S MEMORY BOX
        </p>

        <h1>
          LITTLE THINGS
          <br />
          <em>WORTH KEEPING.</em>
        </h1>

        <p>
          Tap anything in the box.
          Every piece holds a memory ♡
        </p>
      </section>

      <section className="table">
        <div className="tableLabel">
          <span>
            INSIDE THE BOX
          </span>

          <small>
            {seen.length === 0
              ? "START ANYWHERE"
              : allSeen
              ? "YOU FOUND THEM ALL ♡"
              : `${gift.memories.length - seen.length} LEFT TO DISCOVER`}
          </small>
        </div>

        <div className="memoryGrid">
          {gift.memories.map(
            (memory, index) => {
              const wasSeen =
                seen.includes(
                  memory.id
                );

              return (
                <button
                  type="button"
                  key={memory.id}
                  className={`memoryCard card${index % 6} ${
                    wasSeen
                      ? "seen"
                      : ""
                  }`}
                  onClick={() =>
                    openMemory(memory)
                  }
                >
                  <div className="tape" />

                  <div className="cardTop">
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <small>
                      {memory.type}
                    </small>
                  </div>

                  <div className="visual">
                    {memory.media &&
                    memory.type ===
                      "PHOTO" ? (
                      <img
                        src={
                          memory.media
                        }
                        alt=""
                      />
                    ) : (
                      <span>
                        {symbolFor(
                          memory.type
                        )}
                      </span>
                    )}
                  </div>

                  <h2>
                    {memory.title}
                  </h2>

                  <div className="cardBottom">
                    <span>
                      OPEN MEMORY
                    </span>

                    <b>↗</b>
                  </div>

                  {wasSeen && (
                    <div className="openedStamp">
                      OPENED
                    </div>
                  )}
                </button>
              );
            }
          )}
        </div>
      </section>

      <section
        className={`bottomEnvelope ${
          allSeen
            ? "unlocked"
            : ""
        }`}
      >
        <div className="envelopeCopy">
          <p className="eyebrow">
            AT THE BOTTOM OF THE BOX
          </p>

          <h2>
            ONE MORE
            <br />
            <em>THING ♡</em>
          </h2>

          <p>
            {allSeen
              ? "There's one last thing waiting for you."
              : `Open all ${gift.memories.length} memories to unlock the final envelope.`}
          </p>
        </div>

        <button
          type="button"
          className="envelope"
          disabled={
            !allSeen ||
            !gift.finalMessage
          }
          onClick={() =>
            setFinalOpen(true)
          }
        >
          <div className="envelopeFlap" />

          <div className="envelopeHeart">
            ♥
          </div>

          <span>
            {allSeen
              ? "OPEN ME"
              : "LOCKED"}
          </span>
        </button>
      </section>

      <footer>
        <span>WI♡ELI</span>

        <p>
          Wish + loVE + LIfe
        </p>

        <small>
          MADE FOR{" "}
          {gift.recipientName.toUpperCase()}
          {" "}♡
        </small>
      </footer>

      {selected && (
        <div
          className="modal"
          onClick={() =>
            setSelected(null)
          }
        >
          <article
            className="memoryModal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <div className="modalNumber">
              MEMORY{" "}
              {String(
                gift.memories.findIndex(
                  (item) =>
                    item.id ===
                    selected.id
                ) + 1
              ).padStart(2, "0")}
            </div>

            {selected.media &&
              selected.type ===
                "PHOTO" && (
                <div className="modalMedia">
                  <img
                    src={
                      selected.media
                    }
                    alt=""
                  />
                </div>
              )}

            {selected.media &&
              selected.type ===
                "VIDEO" && (
                <div className="modalMedia">
                  <video
                    src={
                      selected.media
                    }
                    controls
                  />
                </div>
              )}

            {selected.media &&
              selected.type ===
                "VOICE NOTE" && (
                <div className="audioBox">
                  <span>♪</span>

                  <audio
                    src={
                      selected.media
                    }
                    controls
                  />
                </div>
              )}

            {!selected.media && (
              <div className="modalSymbol">
                {symbolFor(
                  selected.type
                )}
              </div>
            )}

            <p className="modalType">
              {selected.type}
            </p>

            <h2>
              {selected.title}
            </h2>

            <div className="story">
              {selected.text}
            </div>

            <button
              type="button"
              className="keepButton"
              onClick={() =>
                setSelected(null)
              }
            >
              KEEP THIS MEMORY ♡
            </button>
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
            className="finalLetter"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="close"
              onClick={() =>
                setFinalOpen(false)
              }
            >
              ×
            </button>

            <div className="letterHeart">
              ♡
            </div>

            <p className="modalType">
              ONE MORE THING
            </p>

            <h2>
              FOR{" "}
              {gift.recipientName}.
            </h2>

            <div className="story">
              {gift.finalMessage}
            </div>

            <div className="signature">
              LOVE,
              <br />
              <strong>
                {gift.senderName} ♡
              </strong>
            </div>
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

  button {
    font: inherit;
  }

  .loading {
    min-height: 100svh;

    display: grid;
    place-items: center;
    align-content: center;
    gap: 20px;

    background: #f5f0e6;
    color: #25221f;
  }

  .loading span {
    font-family: Georgia, serif;
    font-size: 50px;
  }

  .loading p {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .2em;
  }

  .opening,
  .inside {
    min-height: 100svh;

    background: #f5f0e6;
    color: #25221f;
  }

  .opening {
    overflow: hidden;
  }

  .openingHeader,
  .topbar {
    height: 72px;
    padding: 0 5vw;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom:
      1px solid rgba(37,34,31,.15);
  }

  .openingHeader > span,
  .logo {
    font-family: Georgia, serif;
    font-size: 22px;
    font-weight: 700;
  }

  .openingHeader small {
    font-size: 7px;
    font-weight: 800;
    letter-spacing: .2em;
  }

  .openingContent {
    min-height:
      calc(100svh - 72px);

    padding: 55px 5vw 45px;

    display: grid;
    grid-template-columns:
      minmax(280px,.85fr)
      minmax(420px,1.15fr);

    grid-template-rows:
      1fr auto;

    gap: 30px 5vw;
    align-items: center;
  }

  .eyebrow {
    margin: 0 0 14px;

    font-size: 8px;
    font-weight: 800;
    letter-spacing: .2em;
  }

  .openingCopy h1 {
    margin: 0;

    font-family: Georgia, serif;

    font-size:
      clamp(
        70px,
        9vw,
        135px
      );

    line-height: .78;
    letter-spacing: -.07em;
  }

  .openingCopy h1 em {
    display: block;

    margin-top: 18px;

    color: #d9b4b7;

    font-size: .65em;
    font-weight: 400;
  }

  .introText {
    max-width: 430px;

    margin: 28px 0 0;

    font-family: Georgia, serif;
    font-size: 16px;
    line-height: 1.6;
  }

  .boxScene {
    position: relative;

    min-height: 520px;

    display: grid;
    place-items: center;

    perspective: 1000px;
  }

  .giftBox {
    position: relative;

    width:
      min(
        440px,
        75%
      );

    z-index: 3;

    filter:
      drop-shadow(
        0 35px 35px
        rgba(37,34,31,.18)
      );

    animation:
      boxFloat
      5s ease-in-out
      infinite;
  }

  .boxLid {
    position: relative;

    width: 108%;
    height: 72px;

    margin-left: -4%;

    border:
      1px solid #25221f;

    border-radius:
      8px 8px 3px 3px;

    background: #d9b4b7;

    z-index: 2;

    transform:
      translateY(5px);
  }

  .boxBody {
    aspect-ratio: 1.35;

    padding: 28px;

    border:
      1px solid #25221f;

    border-radius:
      4px 4px 10px 10px;

    background: #d9b4b7;
  }

  .ribbonVertical {
    position: absolute;

    width: 58px;

    top: 0;
    bottom: 0;
    left: 50%;

    transform:
      translateX(-50%);

    background: #9daa8d;
  }

  .ribbonHorizontal {
    position: absolute;

    height: 20px;

    left: 0;
    right: 0;
    top: 50%;

    transform:
      translateY(-50%);

    background: #9daa8d;
  }

  .boxLabel {
    height: 100%;

    padding: 28px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    border:
      1px solid #25221f;

    background: #f5f0e6;

    text-align: center;
  }

  .boxLabel small {
    font-size: 7px;
    font-weight: 800;
    letter-spacing: .2em;
  }

  .boxLabel strong {
    margin: 18px 0;

    font-family: Georgia, serif;

    font-size:
      clamp(
        38px,
        5vw,
        60px
      );

    font-weight: 400;
    font-style: italic;

    line-height: .8;
  }

  .boxLabel span {
    font-family: Georgia, serif;
    font-size: 25px;
  }

  .floatingPhoto,
  .floatingNote {
    position: absolute;

    z-index: 1;

    background: #fffaf0;

    border:
      1px solid
      rgba(37,34,31,.7);

    box-shadow:
      0 15px 30px
      rgba(37,34,31,.12);
  }

  .floatingPhoto {
    width: 150px;

    padding:
      10px 10px 20px;
  }

  .floatingPhoto div {
    aspect-ratio: 1;

    display: grid;
    place-items: center;

    background: #ddd0b8;

    font-family: Georgia, serif;
    font-size: 35px;
  }

  .floatingPhoto p {
    margin:
      12px 3px 0;

    font-family: Georgia, serif;
    font-size: 11px;
    font-style: italic;
  }

  .photoOne {
    left: 2%;
    bottom: 10%;

    transform:
      rotate(-12deg);

    animation:
      floatOne
      6s ease-in-out
      infinite;
  }

  .photoTwo {
    right: 0;
    top: 4%;

    transform:
      rotate(10deg);

    animation:
      floatTwo
      6.5s ease-in-out
      infinite;
  }

  .floatingNote {
    right: 4%;
    bottom: 5%;

    width: 155px;
    min-height: 105px;

    padding: 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background: #9daa8d;

    transform:
      rotate(6deg);
  }

  .floatingNote span {
    font-size: 7px;
    letter-spacing: .16em;
  }

  .floatingNote b {
    font-family: Georgia, serif;
    font-size: 18px;
  }

  .openingBottom {
    grid-column: 1 / -1;

    padding-top: 25px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-top:
      1px solid
      rgba(37,34,31,.18);
  }

  .openingBottom p {
    margin: 0;

    font-size: 8px;
    letter-spacing: .15em;
  }

  .openingBottom button {
    width:
      min(
        330px,
        100%
      );

    height: 60px;

    padding: 0 23px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border: none;
    border-radius: 100px;

    background: #25221f;
    color: #f5f0e6;

    font-size: 8px;
    font-weight: 800;
    letter-spacing: .15em;

    cursor: pointer;
  }

  .openingBottom button b {
    font-size: 20px;
  }

  .progress {
    width: 180px;
  }

  .progress > span {
    display: block;

    margin-bottom: 7px;

    text-align: right;

    font-size: 7px;
    font-weight: 800;
    letter-spacing: .15em;
  }

  .progress > div {
    height: 2px;

    background:
      rgba(37,34,31,.15);

    overflow: hidden;
  }

  .progress i {
    display: block;

    height: 100%;

    background: #25221f;

    transition:
      width .4s ease;
  }

  .insideHero {
    padding:
      80px 5vw
      65px;
  }

  .insideHero h1 {
    margin:
      12px 0 25px;

    font-family: Georgia, serif;

    font-size:
      clamp(
        60px,
        9vw,
        130px
      );

    line-height: .76;

    letter-spacing:
      -.065em;
  }

  .insideHero h1 em {
    color: #9daa8d;
    font-weight: 400;
  }

  .insideHero > p:last-child {
    font-family: Georgia, serif;
    font-size: 16px;
  }

  .table {
    padding:
      40px 5vw
      100px;

    background: #ddd0b8;
  }

  .tableLabel {
    padding-bottom: 25px;

    display: flex;
    justify-content: space-between;

    border-bottom:
      1px solid
      rgba(37,34,31,.35);
  }

  .tableLabel span,
  .tableLabel small {
    font-size: 7px;
    font-weight: 800;
    letter-spacing: .18em;
  }

  .memoryGrid {
    max-width: 1150px;

    margin:
      50px auto 0;

    display: grid;

    grid-template-columns:
      repeat(
        3,
        minmax(0,1fr)
      );

    gap: 32px;
  }

  .memoryCard {
    position: relative;

    min-height: 440px;

    padding:
      20px 20px
      24px;

    border:
      1px solid
      rgba(37,34,31,.65);

    background: #fffaf0;
    color: #25221f;

    text-align: left;

    box-shadow:
      0 18px 35px
      rgba(37,34,31,.12);

    cursor: pointer;

    transition:
      transform .3s ease,
      box-shadow .3s ease,
      opacity .3s ease;
  }

  .card0,
  .card3 {
    transform:
      rotate(-2deg);
  }

  .card1,
  .card5 {
    transform:
      rotate(1.5deg);
  }

  .card2,
  .card4 {
    transform:
      rotate(-.7deg);
  }

  .memoryCard:hover {
    transform:
      translateY(-10px)
      rotate(0);

    box-shadow:
      0 28px 45px
      rgba(37,34,31,.18);
  }

  .memoryCard.seen {
    opacity: .72;
  }

  .tape {
    position: absolute;

    width: 75px;
    height: 22px;

    top: -11px;
    left: 50%;

    transform:
      translateX(-50%)
      rotate(-2deg);

    background:
      rgba(245,240,230,.78);
  }

  .cardTop {
    display: flex;
    justify-content: space-between;

    font-size: 7px;
    letter-spacing: .14em;
  }

  .visual {
    aspect-ratio: 1;

    margin:
      18px 0 22px;

    display: grid;
    place-items: center;

    overflow: hidden;

    background: #d9b4b7;
  }

  .card1 .visual,
  .card4 .visual {
    background: #9daa8d;
  }

  .card2 .visual,
  .card5 .visual {
    background: #f5f0e6;

    border:
      1px solid
      rgba(37,34,31,.18);
  }

  .visual span {
    font-family: Georgia, serif;
    font-size: 52px;
  }

  .visual img {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  .memoryCard h2 {
    margin:
      0 0 28px;

    font-family: Georgia, serif;

    font-size:
      clamp(
        25px,
        3vw,
        36px
      );

    line-height: .95;
    font-weight: 400;
    font-style: italic;
  }

  .cardBottom {
    position: absolute;

    left: 20px;
    right: 20px;
    bottom: 20px;

    padding-top: 14px;

    display: flex;
    justify-content: space-between;

    border-top:
      1px solid
      rgba(37,34,31,.25);

    font-size: 7px;
    font-weight: 800;
    letter-spacing: .13em;
  }

  .openedStamp {
    position: absolute;

    right: 15px;
    top: 48px;

    padding: 7px 10px;

    border:
      2px solid #7c2635;

    color: #7c2635;

    font-size: 8px;
    font-weight: 900;
    letter-spacing: .12em;

    transform:
      rotate(8deg);
  }

  .bottomEnvelope {
    min-height: 620px;

    padding:
      90px 7vw;

    display: grid;

    grid-template-columns:
      1fr 1fr;

    gap: 8vw;
    align-items: center;

    background: #d9b4b7;
  }

  .bottomEnvelope h2 {
    margin:
      12px 0 25px;

    font-family: Georgia, serif;

    font-size:
      clamp(
        55px,
        8vw,
        110px
      );

    line-height: .78;
    letter-spacing: -.06em;
  }

  .bottomEnvelope h2 em {
    font-weight: 400;
  }

  .bottomEnvelope
  .envelopeCopy
  > p:last-child {
    max-width: 420px;

    font-family: Georgia, serif;
    line-height: 1.6;
  }

  .envelope {
    position: relative;

    width:
      min(
        500px,
        100%
      );

    aspect-ratio: 1.55;

    margin: auto;

    overflow: hidden;

    border:
      1px solid #25221f;

    background: #f5f0e6;
    color: #25221f;

    cursor: pointer;

    box-shadow:
      0 30px 60px
      rgba(37,34,31,.15);

    transition:
      transform .3s ease;
  }

  .envelope:not(:disabled):hover {
    transform:
      rotate(-2deg)
      scale(1.02);
  }

  .envelope:disabled {
    opacity: .48;
    cursor: not-allowed;
  }

  .envelopeFlap {
    position: absolute;

    width: 75%;
    aspect-ratio: 1;

    left: 50%;
    top: -58%;

    transform:
      translateX(-50%)
      rotate(45deg);

    border:
      1px solid #25221f;

    background: #ddd0b8;
  }

  .envelopeHeart {
    position: absolute;

    width: 58px;
    height: 58px;

    left: 50%;
    top: 50%;

    transform:
      translate(-50%,-50%);

    display: grid;
    place-items: center;

    border-radius: 50%;

    background: #7c2635;
    color: #f5f0e6;

    font-size: 20px;

    z-index: 3;
  }

  .envelope > span {
    position: absolute;

    bottom: 25px;
    left: 0;
    right: 0;

    font-size: 7px;
    font-weight: 800;
    letter-spacing: .2em;
  }

  footer {
    min-height: 100px;

    padding: 30px 5vw;

    display: grid;
    grid-template-columns:
      1fr auto 1fr;

    align-items: center;

    background: #25221f;
    color: #f5f0e6;
  }

  footer > span {
    font-family: Georgia, serif;
    font-size: 22px;
    font-weight: 700;
  }

  footer p,
  footer small {
    font-size: 7px;
    letter-spacing: .15em;
  }

  footer small {
    justify-self: end;
  }

  .modal {
    position: fixed;

    inset: 0;

    z-index: 1000;

    padding: 20px;

    display: grid;
    place-items: center;

    background:
      rgba(37,34,31,.76);

    backdrop-filter:
      blur(15px);

    animation:
      modalIn .25s ease;
  }

  .memoryModal,
  .finalLetter {
    position: relative;

    width:
      min(
        620px,
        100%
      );

    max-height:
      calc(
        100svh - 40px
      );

    overflow-y: auto;

    padding: 45px;

    border-radius: 4px;

    background: #f5f0e6;
    color: #25221f;

    box-shadow:
      0 35px 90px
      rgba(0,0,0,.25);

    animation:
      cardIn .35s ease;
  }

  .close {
    position: absolute;

    right: 17px;
    top: 17px;

    width: 40px;
    height: 40px;

    border:
      1px solid
      rgba(37,34,31,.25);

    border-radius: 50%;

    background: transparent;
    color: #25221f;

    font-size: 22px;

    cursor: pointer;
  }

  .modalNumber,
  .modalType {
    font-size: 7px;
    font-weight: 800;
    letter-spacing: .18em;
  }

  .modalSymbol {
    height: 240px;

    margin:
      30px 0;

    display: grid;
    place-items: center;

    background: #d9b4b7;

    font-family: Georgia, serif;
    font-size: 70px;
  }

  .modalMedia {
    margin:
      30px 0;

    overflow: hidden;
  }

  .modalMedia img,
  .modalMedia video {
    width: 100%;
    max-height: 50vh;

    display: block;

    object-fit: cover;
  }

  .audioBox {
    margin:
      30px 0;

    padding: 35px;

    display: grid;
    gap: 20px;

    place-items: center;

    background: #9daa8d;
  }

  .audioBox > span {
    font-family: Georgia, serif;
    font-size: 55px;
  }

  .audioBox audio {
    width: 100%;
  }

  .memoryModal h2,
  .finalLetter h2 {
    margin:
      12px 0 25px;

    font-family: Georgia, serif;

    font-size:
      clamp(
        45px,
        7vw,
        75px
      );

    line-height: .85;

    font-weight: 400;
    font-style: italic;
  }

  .story {
    white-space: pre-wrap;

    font-family: Georgia, serif;

    font-size: 16px;
    line-height: 1.7;
  }

  .keepButton {
    width: 100%;
    height: 56px;

    margin-top: 35px;

    border: none;
    border-radius: 100px;

    background: #25221f;
    color: #f5f0e6;

    font-size: 8px;
    font-weight: 800;
    letter-spacing: .14em;

    cursor: pointer;
  }

  .finalLetter {
    padding:
      65px 55px;

    background: #ddd0b8;
  }

  .letterHeart {
    width: 60px;
    height: 60px;

    margin-bottom: 40px;

    display: grid;
    place-items: center;

    border:
      1px solid #25221f;

    border-radius: 50%;

    font-family: Georgia, serif;
    font-size: 25px;
  }

  .signature {
    margin-top: 50px;

    font-size: 8px;
    letter-spacing: .15em;
  }

  .signature strong {
    display: inline-block;

    margin-top: 8px;

    font-family: Georgia, serif;
    font-size: 25px;
    font-weight: 400;
    font-style: italic;

    letter-spacing: 0;
  }

  @keyframes boxFloat {
    0%,100% {
      transform:
        translateY(0)
        rotate(-1deg);
    }

    50% {
      transform:
        translateY(-12px)
        rotate(1deg);
    }
  }

  @keyframes floatOne {
    0%,100% {
      transform:
        translateY(0)
        rotate(-12deg);
    }

    50% {
      transform:
        translateY(-12px)
        rotate(-9deg);
    }
  }

  @keyframes floatTwo {
    0%,100% {
      transform:
        translateY(0)
        rotate(10deg);
    }

    50% {
      transform:
        translateY(10px)
        rotate(7deg);
    }
  }

  @keyframes modalIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes cardIn {
    from {
      opacity: 0;

      transform:
        translateY(25px)
        scale(.97);
    }

    to {
      opacity: 1;

      transform:
        translateY(0)
        scale(1);
    }
  }

  @media (max-width: 850px) {
    .openingContent {
      grid-template-columns: 1fr;

      padding-top: 40px;
    }

    .openingCopy {
      text-align: center;
    }

    .openingCopy h1 {
      font-size: 70px;
    }

    .introText {
      margin-left: auto;
      margin-right: auto;
    }

    .boxScene {
      min-height: 460px;
    }

    .openingBottom {
      flex-direction: column;
      gap: 20px;
    }

    .openingBottom button {
      width: 100%;
    }

    .memoryGrid {
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }

    .bottomEnvelope {
      grid-template-columns: 1fr;

      text-align: center;
    }

    .bottomEnvelope
    .envelopeCopy
    > p:last-child {
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (max-width: 520px) {
    .openingHeader,
    .topbar {
      padding:
        0 18px;
    }

    .openingContent {
      padding:
        38px 18px
        35px;
    }

    .openingCopy h1 {
      font-size: 57px;
    }

    .boxScene {
      min-height: 390px;
    }

    .giftBox {
      width: 76%;
    }

    .floatingPhoto {
      width: 105px;
    }

    .floatingPhoto div {
      font-size: 26px;
    }

    .floatingPhoto p {
      font-size: 8px;
    }

    .floatingNote {
      width: 105px;
      min-height: 80px;
      padding: 13px;
    }

    .floatingNote b {
      font-size: 12px;
    }

    .boxBody {
      padding: 16px;
    }

    .boxLabel {
      padding: 16px;
    }

    .boxLabel strong {
      font-size: 35px;
    }

    .insideHero {
      padding:
        55px 18px
        45px;
    }

    .insideHero h1 {
      font-size: 52px;
    }

    .progress {
      width: 120px;
    }

    .table {
      padding:
        30px 12px
        70px;
    }

    .memoryGrid {
      margin-top: 35px;

      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );

      gap: 10px;
    }

    .memoryCard {
      min-height: 290px;

      padding:
        10px 10px
        16px;
    }

    .visual {
      margin:
        12px 0 15px;
    }

    .visual span {
      font-size: 35px;
    }

    .memoryCard h2 {
      font-size: 17px;
    }

    .cardBottom {
      left: 10px;
      right: 10px;
      bottom: 12px;

      font-size: 5px;
    }

    .openedStamp {
      right: 8px;
      top: 34px;

      font-size: 6px;
    }

    .bottomEnvelope {
      min-height: 560px;

      padding:
        65px 18px;
    }

    .bottomEnvelope h2 {
      font-size: 55px;
    }

    .memoryModal,
    .finalLetter {
      padding:
        55px 22px
        30px;
    }

    .modalSymbol {
      height: 190px;
    }

    footer {
      grid-template-columns:
        1fr 1fr;
    }

    footer p {
      display: none;
    }
  }

  @media (
    prefers-reduced-motion:
    reduce
  ) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

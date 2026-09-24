"use client";

import { useState } from "react";

const TYPES = [
  "PHOTO",
  "MESSAGE",
  "VIDEO",
  "VOICE NOTE",
  "PLACE",
  "LITTLE THING",
];

export default function MemoryBoxBuilder() {
  const [senderName, setSenderName] =
    useState("");

  const [
    recipientName,
    setRecipientName,
  ] = useState("");

  const [memories, setMemories] =
    useState([]);

  const [type, setType] =
    useState("PHOTO");

  const [title, setTitle] =
    useState("");

  const [text, setText] =
    useState("");

  const [media, setMedia] =
    useState("");

  const [
    finalMessage,
    setFinalMessage,
  ] = useState("");

  const [creating, setCreating] =
    useState(false);

  const [giftLink, setGiftLink] =
    useState("");

  function addMemory() {
    if (!title.trim()) return;

    setMemories((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        type,
        title: title.trim(),
        text: text.trim(),
        media: media.trim(),
      },
    ]);

    setTitle("");
    setText("");
    setMedia("");
  }

  function removeMemory(id) {
    setMemories((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  async function createGift() {
    if (
      !senderName.trim() ||
      !recipientName.trim() ||
      memories.length === 0
    ) {
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(
        "/api/gifts",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            giftType: "memory-box",

            giftData: {
              senderName:
                senderName.trim(),

              recipientName:
                recipientName.trim(),

              memories,

              finalMessage:
                finalMessage.trim(),

              createdAt:
                new Date().toISOString(),
            },
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.id) {
        throw new Error();
      }

      setGiftLink(
        `${window.location.origin}/gift/memory-box/${data.id}`
      );
    } catch {
      alert(
        "We couldn't create your Memory Box ♡"
      );
    } finally {
      setCreating(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(
      giftLink
    );

    alert("Private link copied ♡");
  }

  if (giftLink) {
    return (
      <main className="page ready">
        <p className="eyebrow">
          YOUR MEMORY BOX IS READY
        </p>

        <h1>
          MADE WITH
          <br />
          <em>MEMORIES ♡</em>
        </h1>

        <p>
          Your private gift for{" "}
          {recipientName} is ready.
        </p>

        <div className="link">
          {giftLink}
        </div>

        <button onClick={copyLink}>
          COPY PRIVATE LINK
        </button>

        <a href={giftLink}>
          PREVIEW GIFT →
        </a>

        <style jsx>{styles}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <header>
        <a href="/">WI♡ELI</a>

        <span>MEMORY BOX</span>
      </header>

      <section className="hero">
        <p className="eyebrow">
          BUILD THEIR LITTLE WORLD
        </p>

        <h1>
          MEMORY
          <br />
          <em>BOX.</em>
        </h1>

        <p>
          Fill the box with moments
          you never want them to lose.
        </p>
      </section>

      <section className="builder">
        <div className="card">
          <p className="eyebrow">
            01 · WHO IS IT FOR?
          </p>

          <input
            placeholder="Your name"
            value={senderName}
            onChange={(e) =>
              setSenderName(
                e.target.value
              )
            }
          />

          <input
            placeholder="Recipient's name"
            value={recipientName}
            onChange={(e) =>
              setRecipientName(
                e.target.value
              )
            }
          />
        </div>

        <div className="card">
          <p className="eyebrow">
            02 · ADD A MEMORY
          </p>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            {TYPES.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            placeholder="Memory title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Write something about this moment..."
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
          />

          <input
            placeholder="Photo / video / audio URL (optional)"
            value={media}
            onChange={(e) =>
              setMedia(e.target.value)
            }
          />

          <button
            className="dark"
            onClick={addMemory}
          >
            + ADD TO THE BOX
          </button>
        </div>

        {memories.length > 0 && (
          <div className="card">
            <p className="eyebrow">
              INSIDE YOUR BOX
            </p>

            <div className="memoryList">
              {memories.map(
                (memory, index) => (
                  <div
                    className="memory"
                    key={memory.id}
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div>
                      <small>
                        {memory.type}
                      </small>

                      <strong>
                        {memory.title}
                      </strong>
                    </div>

                    <button
                      onClick={() =>
                        removeMemory(
                          memory.id
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="card">
          <p className="eyebrow">
            03 · ONE MORE THING ♡
          </p>

          <textarea
            placeholder="A final message they'll discover at the bottom of the box..."
            value={finalMessage}
            onChange={(e) =>
              setFinalMessage(
                e.target.value
              )
            }
          />
        </div>

        <button
          className="create"
          disabled={
            creating ||
            !senderName ||
            !recipientName ||
            memories.length === 0
          }
          onClick={createGift}
        >
          {creating
            ? "CREATING..."
            : "CREATE MEMORY BOX →"}
        </button>
      </section>

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .page {
    min-height: 100svh;
    padding-bottom: 100px;
    background: #f5f0e6;
    color: #25221f;
  }

  header {
    height: 74px;
    padding: 0 5vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #25221f22;
    font-size: 9px;
    letter-spacing: .18em;
  }

  header a {
    color: inherit;
    text-decoration: none;
    font-family: Georgia, serif;
    font-size: 22px;
    font-weight: 700;
  }

  .hero {
    padding: 70px 5vw 50px;
  }

  .eyebrow {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .18em;
  }

  h1 {
    margin: 15px 0 25px;
    font-family: Georgia, serif;
    font-size: clamp(65px, 10vw, 130px);
    line-height: .78;
    letter-spacing: -.065em;
  }

  h1 em {
    color: #9daa8d;
    font-weight: 400;
  }

  .hero > p:last-child,
  .ready > p {
    font-family: Georgia, serif;
    font-size: 17px;
  }

  .builder {
    width: min(760px, calc(100% - 30px));
    margin: auto;
    display: grid;
    gap: 15px;
  }

  .card {
    padding: 28px;
    border: 1px solid #25221f33;
    border-radius: 22px;
    background: #ddd0b855;
  }

  input,
  textarea,
  select {
    width: 100%;
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #25221f33;
    border-radius: 12px;
    background: #f5f0e6;
    color: #25221f;
    font: inherit;
  }

  textarea {
    min-height: 110px;
    resize: vertical;
  }

  button,
  .ready a {
    cursor: pointer;
    border: none;
    text-decoration: none;
  }

  .dark,
  .create,
  .ready button,
  .ready a {
    min-height: 54px;
    padding: 0 22px;
    border-radius: 100px;
    background: #25221f;
    color: #f5f0e6;
    font-weight: 800;
    font-size: 9px;
    letter-spacing: .13em;
  }

  .dark {
    width: 100%;
    margin-top: 14px;
  }

  .create {
    width: 100%;
    min-height: 64px;
  }

  .create:disabled {
    opacity: .35;
  }

  .memory {
    padding: 14px 0;
    display: grid;
    grid-template-columns: 35px 1fr 35px;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #25221f22;
  }

  .memory small,
  .memory strong {
    display: block;
  }

  .memory small {
    margin-bottom: 4px;
    font-size: 7px;
    letter-spacing: .14em;
  }

  .memory button {
    background: transparent;
    font-size: 24px;
  }

  .ready {
    padding: 15vh 7vw;
    text-align: center;
  }

  .ready h1 {
    font-size: clamp(55px, 9vw, 110px);
  }

  .link {
    width: min(700px, 100%);
    margin: 35px auto 15px;
    padding: 20px;
    border-radius: 15px;
    background: #ddd0b8;
    overflow-wrap: anywhere;
    font-family: Georgia, serif;
  }

  .ready button,
  .ready a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
  }

  @media (max-width: 600px) {
    .hero {
      padding-top: 50px;
    }

    h1 {
      font-size: 62px;
    }

    .card {
      padding: 20px;
    }

    .ready {
      padding-top: 10vh;
    }
  }
`;

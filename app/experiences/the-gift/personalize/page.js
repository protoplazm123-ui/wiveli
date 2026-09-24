"use client";

import { useState } from "react";

const EMPTY_STEP = {
  question: "",
  answer: "",
  hint: "",
  rewardType: "LETTER",
  rewardTitle: "",
  rewardText: "",
  rewardUrl: "",
};

export default function TheGiftBuilder() {
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const [introMessage, setIntroMessage] = useState(
    "I made something for you. But you'll have to earn it first ♡"
  );

  const [steps, setSteps] = useState([
    {
      question: "Where did we have our first real date?",
      answer: "",
      hint: "Think about where we stayed way too long ♡",
      rewardType: "LETTER",
      rewardTitle: "You got it ♡",
      rewardText:
        "I still remember that day more clearly than you probably realize.",
      rewardUrl: "",
    },
  ]);

  const [finalMessage, setFinalMessage] = useState(
    "That's everything... for now ♡"
  );

  const [creating, setCreating] = useState(false);
  const [giftLink, setGiftLink] = useState("");

  function updateStep(index, field, value) {
    setSteps((current) =>
      current.map((step, i) =>
        i === index
          ? { ...step, [field]: value }
          : step
      )
    );
  }

  function addStep() {
    setSteps((current) => [
      ...current,
      { ...EMPTY_STEP },
    ]);
  }

  function removeStep(index) {
    setSteps((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  async function createGift() {
    const validSteps = steps.filter(
      (step) =>
        step.question.trim() &&
        step.answer.trim() &&
        step.rewardTitle.trim()
    );

    if (
      !senderName.trim() ||
      !recipientName.trim() ||
      !validSteps.length
    ) {
      alert("Add names and at least one complete gift ♡");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/gifts", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          giftType: "the-gift",

          giftData: {
            senderName: senderName.trim(),
            recipientName: recipientName.trim(),
            introMessage: introMessage.trim(),

            steps: validSteps.map((step) => ({
              ...step,
              id: crypto.randomUUID(),
            })),

            finalMessage: finalMessage.trim(),
            createdAt: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        throw new Error();
      }

      setGiftLink(
        `${window.location.origin}/gift/the-gift/${data.id}`
      );
    } catch {
      alert("We couldn't create your gift ♡");
    } finally {
      setCreating(false);
    }
  }

  if (giftLink) {
    return (
      <main style={page}>
        <p>YOUR GIFT IS READY ♡</p>

        <h1 style={title}>
          MADE JUST
          <br />
          FOR THEM.
        </h1>

        <div style={linkBox}>
          {giftLink}
        </div>

        <button
          style={button}
          onClick={() =>
            navigator.clipboard.writeText(giftLink)
          }
        >
          COPY PRIVATE LINK
        </button>

        <a href={giftLink} style={preview}>
          PREVIEW GIFT →
        </a>
      </main>
    );
  }

  return (
    <main style={page}>
      <p>WI♡ELI · THE GIFT</p>

      <h1 style={title}>
        MAKE THEM
        <br />
        UNLOCK IT.
      </h1>

      <section style={card}>
        <input
          style={input}
          placeholder="Your name"
          value={senderName}
          onChange={(e) =>
            setSenderName(e.target.value)
          }
        />

        <input
          style={input}
          placeholder="Recipient's name"
          value={recipientName}
          onChange={(e) =>
            setRecipientName(e.target.value)
          }
        />

        <textarea
          style={textarea}
          value={introMessage}
          onChange={(e) =>
            setIntroMessage(e.target.value)
          }
        />
      </section>

      {steps.map((step, index) => (
        <section style={card} key={index}>
          <p>
            GIFT {String(index + 1).padStart(2, "0")}
          </p>

          <input
            style={input}
            placeholder="Question"
            value={step.question}
            onChange={(e) =>
              updateStep(
                index,
                "question",
                e.target.value
              )
            }
          />

          <input
            style={input}
            placeholder="Correct answer"
            value={step.answer}
            onChange={(e) =>
              updateStep(
                index,
                "answer",
                e.target.value
              )
            }
          />

          <input
            style={input}
            placeholder="Hint"
            value={step.hint}
            onChange={(e) =>
              updateStep(
                index,
                "hint",
                e.target.value
              )
            }
          />

          <p style={mini}>WHAT DO THEY UNLOCK?</p>

          <select
            style={input}
            value={step.rewardType}
            onChange={(e) =>
              updateStep(
                index,
                "rewardType",
                e.target.value
              )
            }
          >
            <option>LETTER</option>
            <option>PHOTO</option>
            <option>VIDEO</option>
            <option>VOICE</option>
            <option>LINK</option>
            <option>TICKET / RESERVATION</option>
          </select>

          <input
            style={input}
            placeholder="Gift title"
            value={step.rewardTitle}
            onChange={(e) =>
              updateStep(
                index,
                "rewardTitle",
                e.target.value
              )
            }
          />

          <textarea
            style={textarea}
            placeholder="Personal message..."
            value={step.rewardText}
            onChange={(e) =>
              updateStep(
                index,
                "rewardText",
                e.target.value
              )
            }
          />

          {step.rewardType !== "LETTER" && (
            <input
              style={input}
              placeholder="Photo / video / audio / gift link"
              value={step.rewardUrl}
              onChange={(e) =>
                updateStep(
                  index,
                  "rewardUrl",
                  e.target.value
                )
              }
            />
          )}

          {steps.length > 1 && (
            <button
              style={remove}
              onClick={() => removeStep(index)}
            >
              REMOVE
            </button>
          )}
        </section>
      ))}

      <button style={add} onClick={addStep}>
        + ADD ANOTHER GIFT
      </button>

      <section style={card}>
        <p>FINAL MESSAGE</p>

        <textarea
          style={textarea}
          value={finalMessage}
          onChange={(e) =>
            setFinalMessage(e.target.value)
          }
        />
      </section>

      <button
        style={button}
        disabled={creating}
        onClick={createGift}
      >
        {creating
          ? "CREATING..."
          : "CREATE THE GIFT →"}
      </button>
    </main>
  );
}

const page = {
  minHeight: "100vh",
  padding: "60px 6vw 100px",
  background: "#f5f0e6",
  color: "#25221f",
};

const title = {
  fontFamily: "Georgia, serif",
  fontSize: "clamp(55px, 9vw, 110px)",
  lineHeight: ".82",
  margin: "20px 0 50px",
};

const card = {
  maxWidth: 760,
  padding: 25,
  marginBottom: 16,
  background: "#ddd0b855",
  border: "1px solid #25221f44",
  borderRadius: 18,
};

const input = {
  width: "100%",
  padding: 15,
  margin: "6px 0",
  border: "1px solid #25221f44",
  borderRadius: 10,
  background: "#fffaf0",
  color: "#25221f",
};

const textarea = {
  ...input,
  minHeight: 100,
  resize: "vertical",
};

const button = {
  padding: "18px 28px",
  marginTop: 20,
  border: 0,
  borderRadius: 100,
  background: "#25221f",
  color: "#f5f0e6",
  fontWeight: 800,
  cursor: "pointer",
};

const add = {
  ...button,
  margin: "10px 0 25px",
  background: "#9daa8d",
  color: "#25221f",
};

const remove = {
  marginTop: 15,
  border: 0,
  background: "transparent",
  textDecoration: "underline",
  cursor: "pointer",
};

const mini = {
  marginTop: 25,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".15em",
};

const linkBox = {
  maxWidth: 700,
  padding: 20,
  marginBottom: 10,
  borderRadius: 12,
  background: "#ddd0b8",
  overflowWrap: "anywhere",
};

const preview = {
  display: "block",
  marginTop: 25,
  color: "#25221f",
};

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const DEMO = {
  senderName: "Alex",
  recipientName: "Sophie",

  introMessage:
    "I made something for you. But you'll have to earn it first ♡",

  finalMessage:
    "That's everything... for now. I love making memories with you ♡",

  steps: [
    {
      id: "1",
      question: "Where did we have our first real date?",
      answer: "cinema",
      hint: "There was popcorn involved 👀",
      rewardType: "VOICE",
      rewardTitle: "For you ♡",
      rewardText:
        "A little voice note I wanted you to keep.",
      rewardUrl: "",
    },

    {
      id: "2",
      question: "What's my favorite thing about us?",
      answer: "everything",
      hint: "The answer is annoyingly obvious ♡",
      rewardType: "PHOTO",
      rewardTitle: "Remember this?",
      rewardText:
        "Still one of my favorite days with you.",
      rewardUrl: "",
    },

    {
      id: "3",
      question: "Where are we going Friday night?",
      answer: "dinner",
      hint: "Dress nice ♡",
      rewardType: "TICKET / RESERVATION",
      rewardTitle: "Dinner is on me ♡",
      rewardText:
        "Friday · 8:00 PM. I already made the reservation.",
      rewardUrl: "https://example.com",
    },
  ],
};

export default function TheGift() {
  const { id } = useParams();

  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);

  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);

  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);

  const [hint, setHint] = useState(false);

  const [unlocked, setUnlocked] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function load() {
      if (id === "demo") {
        setGift(DEMO);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/gifts/${id}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (
          response.ok &&
          data.giftType === "the-gift"
        ) {
          setGift(data.giftData);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function checkAnswer() {
    const correct =
      answer.trim().toLowerCase() ===
      gift.steps[current].answer
        .trim()
        .toLowerCase();

    if (correct) {
      setWrong(false);
      setUnlocked(true);
    } else {
      setWrong(true);
    }
  }

  function nextGift() {
    if (current + 1 >= gift.steps.length) {
      setFinished(true);
      return;
    }

    setCurrent(current + 1);

    setAnswer("");
    setWrong(false);
    setHint(false);
    setUnlocked(false);
    setFlipped(false);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  if (loading) {
    return <main style={center}>Opening your gift ♡</main>;
  }

  if (!gift) {
    return <main style={center}>Gift not found.</main>;
  }

  if (!started) {
    return (
      <main style={center}>
        <p>A LITTLE SOMETHING FOR</p>

        <h1 style={heroTitle}>
          {gift.recipientName}
          <br />
          ♡
        </h1>

        <p style={message}>
          {gift.introMessage}
        </p>

        <button
          style={mainButton}
          onClick={() => setStarted(true)}
        >
          OPEN MY GIFT →
        </button>
      </main>
    );
  }

  if (finished) {
    return (
      <main style={center}>
        <p>YOU FOUND EVERYTHING ♡</p>

        <h1 style={heroTitle}>
          ALL
          <br />
          YOURS.
        </h1>

        <p style={message}>
          {gift.finalMessage}
        </p>

        <small>
          LOVE, {gift.senderName.toUpperCase()} ♡
        </small>
      </main>
    );
  }

  const step = gift.steps[current];

  if (unlocked) {
    return (
      <main style={giftPage}>
        <header style={header}>
          <strong>WI♡ELI</strong>

          <span>
            GIFT {current + 1} / {gift.steps.length}
          </span>
        </header>

        <section style={reveal}>
          <p>YOU GOT IT ♡</p>

          <h1 style={revealTitle}>
            SOMETHING
            <br />
            IS WAITING.
          </h1>

          <div
            style={{
              ...flipScene,
              transform: flipped
                ? "rotateY(180deg)"
                : "rotateY(0deg)",
            }}
            onClick={() => setFlipped(!flipped)}
          >
            <div style={front}>
              <span>FOR {gift.recipientName.toUpperCase()}</span>

              <strong>♡</strong>

              <p>
                TAP TO TURN
                <br />
                THE CARD
              </p>
            </div>

            <div style={back}>
              <small>{step.rewardType}</small>

              <h2>{step.rewardTitle}</h2>

              {step.rewardType === "PHOTO" &&
                step.rewardUrl && (
                  <img
                    src={step.rewardUrl}
                    alt=""
                    style={media}
                  />
                )}

              {step.rewardType === "VIDEO" &&
                step.rewardUrl && (
                  <video
                    src={step.rewardUrl}
                    controls
                    style={media}
                  />
                )}

              {step.rewardType === "VOICE" &&
                step.rewardUrl && (
                  <audio
                    src={step.rewardUrl}
                    controls
                    style={{ width: "100%" }}
                  />
                )}

              <p style={giftText}>
                {step.rewardText}
              </p>

              {(step.rewardType === "LINK" ||
                step.rewardType ===
                  "TICKET / RESERVATION") &&
                step.rewardUrl && (
                  <a
                    href={step.rewardUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={giftLink}
                  >
                    OPEN YOUR GIFT →
                  </a>
                )}
            </div>
          </div>

          {flipped && (
            <button
              style={mainButton}
              onClick={nextGift}
            >
              {current + 1 === gift.steps.length
                ? "FINISH MY GIFT ♡"
                : "NEXT GIFT →"}
            </button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main style={questionPage}>
      <header style={header}>
        <strong>WI♡ELI</strong>

        <span>
          GIFT {current + 1} / {gift.steps.length}
        </span>
      </header>

      <section style={questionBox}>
        <p>UNLOCK YOUR NEXT GIFT</p>

        <h1 style={questionTitle}>
          {step.question}
        </h1>

        <input
          style={answerInput}
          placeholder="Type your answer..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setWrong(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              checkAnswer();
            }
          }}
        />

        {wrong && (
          <p style={wrongText}>
            Not quite... try again ♡
          </p>
        )}

        <button
          style={mainButton}
          onClick={checkAnswer}
        >
          UNLOCK MY GIFT →
        </button>

        {!hint ? (
          <button
            style={hintButton}
            onClick={() => setHint(true)}
          >
            I DON'T KNOW — GIVE ME A HINT
          </button>
        ) : (
          <div style={hintBox}>
            <small>A LITTLE HINT ♡</small>

            <p>{step.hint}</p>
          </div>
        )}
      </section>
    </main>
  );
}

const center = {
  minHeight: "100svh",
  padding: 30,
  display: "grid",
  placeItems: "center",
  alignContent: "center",
  gap: 20,
  textAlign: "center",
  background: "#f5f0e6",
  color: "#25221f",
};

const heroTitle = {
  margin: 0,
  fontFamily: "Georgia, serif",
  fontSize: "clamp(75px, 14vw, 160px)",
  lineHeight: ".78",
};

const message = {
  maxWidth: 500,
  fontFamily: "Georgia, serif",
  fontSize: 18,
  lineHeight: 1.6,
};

const mainButton = {
  padding: "18px 30px",
  marginTop: 15,
  border: 0,
  borderRadius: 100,
  background: "#25221f",
  color: "#f5f0e6",
  fontWeight: 800,
  cursor: "pointer",
};

const questionPage = {
  minHeight: "100svh",
  background: "#d9b4b7",
  color: "#25221f",
};

const giftPage = {
  minHeight: "100svh",
  background: "#9daa8d",
  color: "#25221f",
};

const header = {
  height: 70,
  padding: "0 5vw",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #25221f33",
};

const questionBox = {
  width: "min(700px, calc(100% - 30px))",
  margin: "10vh auto",
  padding: "clamp(25px, 6vw, 60px)",
  background: "#f5f0e6",
  borderRadius: 20,
};

const questionTitle = {
  margin: "25px 0 40px",
  fontFamily: "Georgia, serif",
  fontSize: "clamp(40px, 7vw, 70px)",
  lineHeight: ".95",
};

const answerInput = {
  width: "100%",
  padding: 18,
  border: "1px solid #25221f",
  borderRadius: 12,
  background: "transparent",
  fontSize: 17,
};

const wrongText = {
  color: "#7c2635",
  fontFamily: "Georgia, serif",
};

const hintButton = {
  display: "block",
  marginTop: 25,
  border: 0,
  background: "transparent",
  textDecoration: "underline",
  cursor: "pointer",
};

const hintBox = {
  marginTop: 25,
  padding: 20,
  background: "#ddd0b8",
  borderRadius: 12,
  fontFamily: "Georgia, serif",
};

const reveal = {
  padding: "60px 20px 100px",
  textAlign: "center",
};

const revealTitle = {
  margin: "15px 0 45px",
  fontFamily: "Georgia, serif",
  fontSize: "clamp(50px, 9vw, 100px)",
  lineHeight: ".8",
};

const flipScene = {
  position: "relative",
  width: "min(480px, 90vw)",
  height: 560,
  margin: "auto",
  transformStyle: "preserve-3d",
  transition: "transform .7s ease",
  cursor: "pointer",
};

const front = {
  position: "absolute",
  inset: 0,
  padding: 45,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "#d9b4b7",
  border: "1px solid #25221f",
  backfaceVisibility: "hidden",
};

const back = {
  position: "absolute",
  inset: 0,
  padding: 40,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: "#f5f0e6",
  border: "1px solid #25221f",
  transform: "rotateY(180deg)",
  backfaceVisibility: "hidden",
};

const media = {
  width: "100%",
  maxHeight: 260,
  margin: "20px 0",
  objectFit: "cover",
};

const giftText = {
  fontFamily: "Georgia, serif",
  fontSize: 17,
  lineHeight: 1.6,
};

const giftLink = {
  display: "inline-block",
  marginTop: 20,
  padding: 15,
  background: "#25221f",
  color: "#f5f0e6",
  textDecoration: "none",
  borderRadius: 100,
};

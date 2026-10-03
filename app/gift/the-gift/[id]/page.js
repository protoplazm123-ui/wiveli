"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { giftTheme } from "../../../lib/the-gift-theme";

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
  const [error,setError]=useState("");
  const [checking,setChecking]=useState(false);
  const checkingRef=useRef(false);
  const [reward,setReward]=useState(null);
  const [refresh,setRefresh]=useState(0);
  const tokenRef=useRef("");
  const palette=giftTheme(gift?.theme);
  const center={...baseCenter,background:palette.background,color:palette.ink};
  const mainButton={...baseMainButton,background:palette.accent,color:palette.background};
  const questionPage={...baseQuestionPage,background:palette.background,color:palette.ink};
  const giftPage={...baseGiftPage,background:palette.background,color:palette.ink};
  const questionBox={...baseQuestionBox,background:palette.paper};
  const front={...baseFront,background:palette.soft,color:palette.ink,borderColor:palette.accent};
  const back={...baseBack,background:palette.paper,color:palette.ink,borderColor:palette.accent};
  const giftLink={...baseGiftLink,background:palette.accent,color:palette.background};
  const answerInput={...baseAnswerInput,color:palette.ink,borderColor:palette.accent};
  const hintBox={...baseHintBox,background:palette.soft};
  const hintButton={...baseHintButton,color:palette.ink};
  const wrongText={...baseWrongText,color:palette.accent};
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
    let live=true;const controller=new AbortController();
    async function load() {
      setLoading(true);setError("");
      tokenRef.current=new URLSearchParams(window.location.search).get('claim')||'';
      if (id === "demo") {
        setGift(DEMO);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/gifts/${encodeURIComponent(id)}/the-gift`,
          { cache: "no-store",signal:controller.signal,headers:tokenRef.current?{"x-wiveli-gift-token":tokenRef.current}:{} }
        );

        const data = await response.json();

        if(!response.ok)throw Error(data.error||"Could not load gift.");
        if(live)setGift(data.gift);
      } catch(e) {if(live&&e.name!=="AbortError")setError(e.message);
      } finally {
        if(live)setLoading(false);
      }
    }

    load();return()=>{live=false;controller.abort();};
  }, [id,refresh]);

  async function checkAnswer() {
    if(checkingRef.current||!answer.trim())return;
    checkingRef.current=true;setChecking(true);setError("");
    try {
      let result;
      if(id==="demo") {
        const step=gift.steps[current];result={correct:answer.trim().toLowerCase()===step.answer.trim().toLowerCase(),reward:step};
      } else {
        const response=await fetch(`/api/gifts/${encodeURIComponent(id)}/the-gift`,{method:"POST",headers:{"Content-Type":"application/json",...(tokenRef.current?{"x-wiveli-gift-token":tokenRef.current}:{})},body:JSON.stringify({stepId:gift.steps[current].id,answer})});
        result=await response.json();if(!response.ok)throw Error(result.error||"Could not unlock gift. Please try again.");
      }
      setWrong(!result.correct);
      if(result.correct){setReward(result.reward);setUnlocked(true);}
    }catch(e){setError(e.message);}finally{checkingRef.current=false;setChecking(false);}
  }

  function nextGift() {
    if (current + 1 >= gift.steps.length) {
      setFinished(true);
      return;
    }

    setCurrent(current + 1);setReward(null);setError("");

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
    return <main style={center}><p role="alert">{error||"Gift not found."}</p><button style={mainButton} onClick={()=>setRefresh(v=>v+1)}>TRY AGAIN</button></main>;
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

  const step = unlocked && reward ? reward : gift.steps[current];

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

          >
            <button type="button" style={{...front,width:"100%",textAlign:"center",cursor:"pointer"}} onClick={()=>setFlipped(true)} disabled={flipped} tabIndex={flipped?-1:0} aria-hidden={flipped}>
              <span>FOR {gift.recipientName.toUpperCase()}</span>

              <strong>♡</strong>

              <p>
                TAP TO TURN
                <br />
                THE CARD
              </p>
            </button>

            <div style={back} aria-hidden={!flipped}>
              {flipped && <>
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

              {step.rewardType === "SURPRISE" && step.rewardUrl && (step.mimeType?.startsWith('image/') ? <img src={step.rewardUrl} alt="Your surprise" style={media} /> : <a href={step.rewardUrl} target="_blank" rel="noopener noreferrer" style={giftLink}>OPEN YOUR SURPRISE ↗</a>)}
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
              </>}
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

        {error && <p role="alert">{error}</p>}
        {wrong && (
          <p style={wrongText}>
            Not quite... try again ♡
          </p>
        )}

        <button
          style={mainButton}
          onClick={checkAnswer} disabled={checking||!answer.trim()}
        >
          {checking?"OPENING…":"UNLOCK MY GIFT →"}
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

const baseCenter = {
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

const baseMainButton = {
  padding: "18px 30px",
  marginTop: 15,
  border: 0,
  borderRadius: 100,
  background: "#25221f",
  color: "#f5f0e6",
  fontWeight: 800,
  cursor: "pointer",
};

const baseQuestionPage = {
  minHeight: "100svh",
  background: "#d9b4b7",
  color: "#25221f",
};

const baseGiftPage = {
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

const baseQuestionBox = {
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

const baseAnswerInput = {
  width: "100%",
  padding: 18,
  border: "1px solid #25221f",
  borderRadius: 12,
  background: "transparent",
  fontSize: 17,
};

const baseWrongText = {
  color: "#7c2635",
  fontFamily: "Georgia, serif",
};

const baseHintButton = {
  display: "block",
  marginTop: 25,
  border: 0,
  background: "transparent",
  textDecoration: "underline",
  cursor: "pointer",
};

const baseHintBox = {
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

const baseFront = {
  position: "absolute",
  inset: 0,
  padding: 45,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "#d9b4b7",
  border: "1px solid #25221f",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const baseBack = {
  position: "absolute",
  inset: 0,
  padding: 40,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  background: "#f5f0e6",
  border: "1px solid #25221f",
  transform: "rotateY(180deg)",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
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

const baseGiftLink = {
  display: "inline-block",
  marginTop: 20,
  padding: 15,
  background: "#25221f",
  color: "#f5f0e6",
  textDecoration: "none",
  borderRadius: 100,
};


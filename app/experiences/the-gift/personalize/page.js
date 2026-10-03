"use client";

import { useRef, useState } from "react";

import CouponAttachmentUpload from "../../../components/CouponAttachmentUpload";
import TelegramGiftDelivery from "../../../components/TelegramGiftDelivery";
import { GIFT_THEMES } from "../../../lib/the-gift-theme";
const FILE_KINDS = {PHOTO:"photo",VIDEO:"video",VOICE:"voice",SURPRISE:"gift"};
const EMPTY_STEP = {
  attachment: null,
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
  const [theme,setTheme]=useState("romantic");
  const [uploadBusy,setUploadBusy]=useState(false);
  const [error,setError]=useState("");
  const [giftId,setGiftId]=useState("");
  const creatingRef=useRef(false);

  const [introMessage, setIntroMessage] = useState(
    "I made something for you. But you'll have to earn it first ♡"
  );

  const [steps, setSteps] = useState([]);

  const [draft, setDraft] = useState({ ...EMPTY_STEP });
  const [modal, setModal] = useState(null);

  const [finalMessage, setFinalMessage] = useState(
    "That's everything... for now ♡"
  );

  const [creating, setCreating] = useState(false);
  const [giftLink, setGiftLink] = useState("");

  function openPersonalize() {
    setDraft({ ...EMPTY_STEP });
    setModal("personalize");
  }

  function updateDraft(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveGift() {
    if(uploadBusy)return;
    if(steps.length>=50){setError("You can add up to 50 gifts.");return;}
    if(["PHOTO","VIDEO","VOICE"].includes(draft.rewardType)&&!draft.attachment){setError("Upload the file first.");return;}
    if(draft.rewardType==="LINK") {
      try {const url=new URL(draft.rewardUrl);if(!["http:","https:"].includes(url.protocol))throw Error();}
      catch {setError("Add a valid https:// link.");return;}
    }
    if(draft.rewardType==="LETTER"&&!draft.rewardText.trim()){setError("Write your letter first.");return;}
    if(draft.rewardType==="SURPRISE"&&!draft.attachment&&!draft.rewardText.trim()){setError("Add a file or message for the surprise.");return;}
    setError("");
    if (
      !draft.question.trim() ||
      !draft.answer.trim() ||
      !draft.rewardTitle.trim()
    ) {
      alert("Add a question, answer and gift title ♡");
      return;
    }

    setSteps((current) => [
      ...current,
      {
        ...draft,
        id: crypto.randomUUID(),
      },
    ]);

    setDraft({ ...EMPTY_STEP });
    setModal(null);
  }

  function removeGift(id) {
    setSteps((current) =>
      current.filter((step) => step.id !== id)
    );
  }

  function openStyle() {
    if(!senderName.trim()||!recipientName.trim()||!steps.length){setError("Add both names and at least one gift.");return;}
    setError("");setModal("style");
  }

  async function createGift() {
    if(creatingRef.current||uploadBusy)return;
    if (!senderName.trim() || !recipientName.trim() || !steps.length) {
      alert("Add names and at least one gift ♡");
      return;
    }

    creatingRef.current=true;setError("");
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
            theme,
            introMessage: introMessage.trim(),
            steps,
            finalMessage: finalMessage.trim(),
            createdAt: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        throw new Error(data.error || "Could not create gift.");
      }

      setGiftId(data.id);
      setGiftLink(data.giftUrl || `${window.location.origin}/gift/the-gift/${data.id}?claim=${encodeURIComponent(data.claimToken)}`);

      setModal("ready");
    } catch (error) {
      setError(error.message || "We couldn't create your gift ♡");
    } finally {
      creatingRef.current=false;setCreating(false);
    }
  }


  return (
    <main className="giftBuilder">
      {error && <p className="flowError" role="alert">{error}</p>}
      <header className="giftHeader">
        <a href="/" className="giftLogo">
          WI<span>♥</span>ELI
        </a>

        <a href="/#ideas" className="backLink">
          ← ALL EXPERIENCES
        </a>
      </header>

      <section className="builderStage">
        <div className="builderLeft">
          <p className="builderEyebrow">
            WI♡ELI · THE GIFT
          </p>

          <h1>
            MAKE THEM
            <br />
            <em>UNLOCK IT.</em>
          </h1>

          <p className="builderDescription">
            A gift made from questions only they should know.
            Every right answer unlocks something from you.
          </p>

          <div className="peopleFields">
            <label>
              <span>FROM</span>

              <input
                placeholder="Your name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </label>

            <label>
              <span>TO</span>

              <input
                placeholder="Their name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </label>
          </div>

          {!steps.length ? (
            <button
              className="mainButton"
              onClick={openPersonalize}
            >
              PERSONALIZE →
            </button>
          ) : (
            <div className="builderActions">
              <button
                className="addButton"
                onClick={openPersonalize}
              >
                + ADD ANOTHER
              </button>

              <button
                className="mainButton"
                onClick={openStyle}
              >
                CHOOSE STYLE →
              </button>
            </div>
          )}
        </div>

        <div className="builderRight">
          <div className="giftObject">
            <div className="giftTag">
              <span>THE GIFT</span>
              <small>
                {recipientName
                  ? `FOR ${recipientName.toUpperCase()}`
                  : "FOR SOMEONE SPECIAL"}
              </small>
            </div>

            <div className="giftLock">♡</div>

            <div className="giftCount">
              <strong>{steps.length}</strong>

              <span>
                {steps.length === 1
                  ? "GIFT INSIDE"
                  : "GIFTS INSIDE"}
              </span>
            </div>
          </div>

          {!!steps.length && (
            <div className="addedGifts">
              {steps.map((step, index) => (
                <div className="addedGift" key={step.id}>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <strong>{step.rewardTitle}</strong>
                    <small>{step.rewardType}</small>
                  </div>

                  <button
                    onClick={() => removeGift(step.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {modal === "personalize" && (
        <div className="modalOverlay">
          <div className="builderModal">
            <button
              className="modalClose"
              disabled={uploadBusy || creating} onClick={() => {setError("");setModal(null);}}
            >
              ×
            </button>

            <p className="modalEyebrow">
              GIFT {String(steps.length + 1).padStart(2, "0")}
            </p>

            <h2>
              WHAT SHOULD
              <br />
              THEY UNLOCK?
            </h2>

            <div className="modalGrid">
              <div className="modalColumn">
                <label>
                  <span>QUESTION</span>

                  <input
                    placeholder="Where did we have our first date?"
                    value={draft.question}
                    onChange={(e) =>
                      updateDraft("question", e.target.value)
                    }
                  />
                </label>

                <label>
                  <span>CORRECT ANSWER</span>

                  <input
                    placeholder="The answer only they should know"
                    value={draft.answer}
                    onChange={(e) =>
                      updateDraft("answer", e.target.value)
                    }
                  />
                </label>

                <label>
                  <span>HINT</span>

                  <input
                    placeholder="Give them a little help ♡"
                    value={draft.hint}
                    onChange={(e) =>
                      updateDraft("hint", e.target.value)
                    }
                  />
                </label>
              </div>

              <div className="modalColumn">
                <span className="fieldTitle">
                  THEY UNLOCK
                </span>

                <div className="rewardTypes">
                  {[
                    "LETTER",
                    "PHOTO",
                    "VIDEO",
                    "VOICE",
                    "LINK",
                    "SURPRISE",
                  ].map((type) => (
                    <button
                      key={type}
                      disabled={uploadBusy}
                      className={
                        draft.rewardType === type
                          ? "rewardType active"
                          : "rewardType"
                      }
                      onClick={() =>
                        setDraft(current=>({...current,rewardType:type,attachment:null,rewardUrl:""}))
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <label>
                  <span>GIFT TITLE</span>

                  <input
                    placeholder="You got it ♡"
                    value={draft.rewardTitle}
                    onChange={(e) =>
                      updateDraft(
                        "rewardTitle",
                        e.target.value
                      )
                    }
                  />
                </label>

                <label>
                  <span>YOUR MESSAGE</span>

                  <textarea
                    placeholder="Write something for them..."
                    value={draft.rewardText}
                    onChange={(e) =>
                      updateDraft(
                        "rewardText",
                        e.target.value
                      )
                    }
                  />
                </label>

                {FILE_KINDS[draft.rewardType] && <CouponAttachmentUpload key={draft.rewardType}
                  kind={FILE_KINDS[draft.rewardType]} attachment={draft.attachment}
                  onChange={file=>updateDraft("attachment",file)} onBusy={setUploadBusy}
                  saveHint="File uploaded. Press Add this gift to keep it." photoHint="Choose a photo from your device." />}
                {draft.rewardType === "LINK" && <label><span>GIFT LINK</span><input type="url" placeholder="https://…" value={draft.rewardUrl} onChange={e=>updateDraft("rewardUrl",e.target.value)} /></label>}

              </div>
            </div>

            <div className="modalActions">
              <button
                className="modalCancel"
                disabled={uploadBusy || creating} onClick={() => {setError("");setModal(null);}}
              >
                CANCEL
              </button>

              <button
                className="mainButton"
                disabled={uploadBusy} onClick={saveGift}
              >
                ADD THIS GIFT ♡
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "style" && (
        <div className="modalOverlay"><div className="builderModal">
          <button className="modalClose" disabled={creating} onClick={()=>setModal(null)} aria-label="Close">×</button>
          <p className="modalEyebrow">02 · MAKE IT YOURS</p><h2>CHOOSE THEIR<br /><em>LITTLE WORLD.</em></h2>
          <div className="styleGrid">{Object.entries(GIFT_THEMES).map(([id,palette])=>(
            <button type="button" key={id} className={`styleChoice ${theme===id?'chosen':''}`} aria-pressed={theme===id} disabled={creating} onClick={()=>setTheme(id)} style={{background:palette.background,color:palette.ink,borderColor:theme===id?palette.accent:undefined}}>
              <span style={{background:palette.paper,color:palette.accent}}>♡</span><strong>{palette.name}</strong>{theme===id&&<small>SELECTED ✓</small>}
            </button>))}</div>
          <p>{steps.length} {steps.length===1?'gift':'gifts'} for {recipientName}. Your recipient will answer the questions when they open it.</p>
          <label className="contactField"><span>INTRO MESSAGE</span><textarea value={introMessage} maxLength={2000} disabled={creating} onChange={e=>setIntroMessage(e.target.value)} /></label>
          <label className="contactField"><span>FINAL MESSAGE</span><textarea value={finalMessage} maxLength={2000} disabled={creating} onChange={e=>setFinalMessage(e.target.value)} /></label>
          <div className="modalActions"><button className="modalCancel" disabled={creating} onClick={()=>setModal(null)}>← EDIT GIFTS</button><button className="mainButton" disabled={creating} onClick={createGift}>{creating?'CREATING…':'CREATE GIFT →'}</button></div>
        </div></div>
      )}

      {modal === "ready" && (
        <div className="modalOverlay">
          <div className="readyModal">
            <button
              className="modalClose"
              disabled={uploadBusy || creating} onClick={() => {setError("");setModal(null);}}
            >
              ×
            </button>

            <div className="readyHeart">♡</div>

            <p className="modalEyebrow">
              YOUR GIFT IS READY
            </p>

            <h2>
              MADE JUST
              <br />
              FOR {recipientName.toUpperCase()}.
            </h2>

            <label className="contactField"><span>PRIVATE GIFT LINK</span><input value={giftLink} readOnly onFocus={e=>e.target.select()} /></label>

            <button
              className="mainButton"
              onClick={() =>
                navigator.clipboard.writeText(giftLink).catch(()=>setError("Select and copy the private link manually."))
              }
            >
              COPY PRIVATE LINK
            </button>

            <a className="openGift" href={giftLink} target="_blank" rel="noopener noreferrer">
              VIEW AS RECIPIENT ↗
            </a>
            <div className="deliveryWrap"><TelegramGiftDelivery giftId={giftId} giftType="the-gift" senderName={senderName} recipientName={recipientName} onBack={()=>window.location.assign('/account')} /></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .flowError { position:fixed; z-index:500; bottom:12px; left:5%; width:90%; padding:14px; background:#fff4ef; color:#742e40; border:1px solid #bd8c97; border-radius:12px; font:14px/1.5 Arial,sans-serif; }
        .styleGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
        .styleChoice { border:2px solid #cabac8; border-radius:16px; padding:20px 12px; cursor:pointer; min-height:150px; }
        .styleChoice span { display:grid;place-items:center; height:64px;border-radius:10px;margin-bottom:14px;font-size:32px; }
        .styleChoice strong,.styleChoice small { display:block; margin-top:8px; }
        .styleChoice small { font-size:9px; }
        .deliveryWrap { margin-top:36px;text-align:left;border-top:1px solid #ddc6ce;padding-top:28px; }
        button:disabled { opacity:.5;cursor:wait; }
        button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible { outline:2px solid #9667b1;outline-offset:3px; }
        @media(max-width:600px){.styleGrid{grid-template-columns:repeat(2,minmax(0,1fr));}.builderActions{flex-wrap:wrap;}.readyModal{padding:28px 22px;}}

        :global(html),
        :global(body) {
          margin: 0;
          overflow: auto;
        }

        :global(*) {
          box-sizing: border-box;
        }

        .giftBuilder {
          --cream: #f7f0e8;
          --paper: #fffaf5;
          --pink: #ead3d2;
          --rose: #c78f91;
          --wine: #692f3c;
          --ink: #292322;

          width: 100%;
          height: 100svh;
          overflow: auto;
          background:
            radial-gradient(
              circle at 80% 25%,
              rgba(199, 143, 145, 0.18),
              transparent 30%
            ),
            var(--cream);
          color: var(--ink);
          font-family: Arial, sans-serif;
        }

        .giftHeader {
          height: 82px;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(41, 35, 34, 0.12);
        }

        .giftLogo {
          color: var(--ink);
          text-decoration: none;
          font-family: Georgia, serif;
          font-weight: 700;
          font-size: 23px;
          letter-spacing: 0.08em;
        }

        .giftLogo span {
          color: var(--wine);
        }

        .backLink {
          color: var(--ink);
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .builderStage {
          min-height: calc(100svh - 82px);
          padding: 5vh 6vw;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 7vw;
          align-items: center;
        }

        .builderLeft {
          max-width: 590px;
        }

        .builderEyebrow,
        .modalEyebrow {
          margin: 0 0 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: var(--wine);
        }

        .builderLeft h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(54px, 6.2vw, 100px);
          line-height: 0.84;
          letter-spacing: -0.055em;
          font-weight: 400;
        }

        .builderLeft h1 em {
          color: var(--wine);
          font-weight: 400;
        }

        .builderDescription {
          max-width: 480px;
          margin: 28px 0;
          font-family: Georgia, serif;
          font-size: 17px;
          line-height: 1.5;
          color: #655a57;
        }

        .peopleFields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        label span,
        .fieldTitle {
          display: block;
          margin-bottom: 7px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        input,
        textarea {
          width: 100%;
          outline: none;
          border: 1px solid rgba(41, 35, 34, 0.18);
          background: rgba(255, 250, 245, 0.7);
          padding: 14px 15px;
          border-radius: 10px;
          color: var(--ink);
        }

        textarea {
          min-height: 88px;
          resize: none;
        }

        .contactField {
          display: block;
          margin-top: 13px;
        }

        .mainButton,
        .addButton {
          border: 0;
          cursor: pointer;
          padding: 16px 25px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .mainButton {
          margin-top: 20px;
          background: var(--wine);
          color: white;
        }

        .addButton {
          margin-top: 20px;
          background: var(--pink);
          color: var(--wine);
        }

        .builderActions {
          display: flex;
          gap: 10px;
        }

        .builderRight {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 520px;
        }

        .giftObject {
          position: relative;
          width: min(390px, 32vw);
          aspect-ratio: 1 / 0.78;
          background: var(--pink);
          border: 1px solid rgba(105, 47, 60, 0.18);
          box-shadow: 0 35px 80px rgba(80, 49, 50, 0.14);
          transform: rotate(-3deg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .giftObject:before {
          content: "";
          position: absolute;
          width: 55px;
          height: 100%;
          background: rgba(255,255,255,.28);
        }

        .giftObject:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 55px;
          background: rgba(255,255,255,.28);
        }

        .giftTag {
          position: absolute;
          top: 22px;
          left: 24px;
          z-index: 2;
          display: flex;
          flex-direction: column;
        }

        .giftTag span {
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .giftTag small {
          margin-top: 4px;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .giftLock {
          z-index: 3;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--wine);
          color: white;
          font-family: Georgia, serif;
          font-size: 31px;
        }

        .giftCount {
          position: absolute;
          right: -42px;
          bottom: -25px;
          z-index: 4;
          width: 115px;
          height: 115px;
          border-radius: 50%;
          background: var(--paper);
          border: 1px solid rgba(41,35,34,.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 30px rgba(0,0,0,.08);
        }

        .giftCount strong {
          font-family: Georgia, serif;
          font-size: 34px;
          color: var(--wine);
        }

        .giftCount span {
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .addedGifts {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 220px;
        }

        .addedGift {
          margin-top: 6px;
          padding: 9px 10px;
          background: rgba(255,250,245,.9);
          border: 1px solid rgba(41,35,34,.1);
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .addedGift > span {
          font-family: Georgia, serif;
          color: var(--wine);
        }

        .addedGift div {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .addedGift strong {
          font-size: 10px;
        }

        .addedGift small {
          font-size: 7px;
          letter-spacing: .1em;
          margin-top: 2px;
        }

        .addedGift button {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          padding: 30px;
          background: rgba(39, 27, 29, 0.55);
          backdrop-filter: blur(9px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .builderModal,
        .previewModal,
        .readyModal {
          position: relative;
          width: min(900px, 94vw);
          max-height: 90svh;
          overflow: auto;
          background: var(--paper);
          border-radius: 22px;
          padding: 42px;
          box-shadow: 0 35px 100px rgba(0,0,0,.22);
        }

        .builderModal h2,
        .previewModal h2,
        .readyModal h2 {
          margin: 0 0 27px;
          font-family: Georgia, serif;
          font-size: clamp(36px, 5vw, 65px);
          line-height: .9;
          font-weight: 400;
        }

        .modalClose {
          position: absolute;
          right: 20px;
          top: 18px;
          border: 0;
          background: transparent;
          font-size: 28px;
          cursor: pointer;
        }

        .modalGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 35px;
        }

        .modalColumn label {
          display: block;
          margin-bottom: 13px;
        }

        .rewardTypes {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 17px;
        }

        .rewardType {
          padding: 11px 6px;
          border-radius: 8px;
          border: 1px solid rgba(41,35,34,.15);
          background: transparent;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .rewardType.active {
          background: var(--wine);
          color: white;
        }

        .modalActions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
        }

        .modalCancel {
          margin-top: 20px;
          padding: 14px;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        .previewModal,
        .readyModal {
          max-width: 690px;
          text-align: center;
        }

        .previewProgress {
          margin: 10px 0 30px;
          font-family: Georgia, serif;
          font-size: 19px;
          color: var(--wine);
        }

        .previewProgress span {
          margin: 0 7px;
          opacity: .4;
        }

        .previewHint {
          color: #81716e;
          font-family: Georgia, serif;
          font-style: italic;
        }

        .fakeAnswer {
          max-width: 430px;
          margin: 24px auto 5px;
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid var(--ink);
          color: #9c8c88;
          font-size: 10px;
          letter-spacing: .1em;
        }

        .unlockedHeart,
        .readyHeart {
          margin: 0 auto 20px;
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: var(--pink);
          display: grid;
          place-items: center;
          color: var(--wine);
          font-size: 31px;
        }

        .rewardMessage {
          max-width: 500px;
          margin: 0 auto 20px;
          font-family: Georgia, serif;
          font-size: 17px;
          line-height: 1.55;
        }

        .previewFinish textarea {
          display: block;
          max-width: 480px;
          margin: 20px auto 0;
        }

        .giftLink {
          padding: 15px;
          margin: 22px 0 0;
          background: var(--cream);
          border-radius: 9px;
          overflow-wrap: anywhere;
          font-size: 12px;
        }

        .openGift {
          display: block;
          margin-top: 19px;
          color: var(--wine);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .12em;
          text-decoration: none;
        }

        @media (max-width: 800px) {
          .giftHeader {
            height: 65px;
          }

          .builderStage {
            min-height: calc(100svh - 65px);
            padding: 25px;
            grid-template-columns: 1fr;
          }

          .builderRight {
            display: none;
          }

          .builderLeft h1 {
            font-size: 52px;
          }

          .builderDescription {
            margin: 18px 0;
          }

          .modalGrid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .builderModal {
            padding: 28px 22px;
          }

          .builderModal h2 {
            font-size: 36px;
          }

          .modalOverlay {
            padding: 12px;
          }
        }
      `}</style>
    </main>
  );
}


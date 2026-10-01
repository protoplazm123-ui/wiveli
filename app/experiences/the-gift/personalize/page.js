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
  const [recipientContact, setRecipientContact] = useState("");

  const [introMessage, setIntroMessage] = useState(
    "I made something for you. But you'll have to earn it first ♡"
  );

  const [steps, setSteps] = useState([]);

  const [draft, setDraft] = useState({ ...EMPTY_STEP });
  const [modal, setModal] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewUnlocked, setPreviewUnlocked] = useState(false);

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

  function openPreview() {
    if (!steps.length) {
      alert("Add at least one gift first ♡");
      return;
    }

    setPreviewIndex(0);
    setPreviewUnlocked(false);
    setModal("preview");
  }

  async function createGift() {
    if (!senderName.trim() || !recipientName.trim() || !steps.length) {
      alert("Add names and at least one gift ♡");
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
            recipientContact: recipientContact.trim(),
            introMessage: introMessage.trim(),
            steps,
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

      setModal("ready");
    } catch {
      alert("We couldn't create your gift ♡");
    } finally {
      setCreating(false);
    }
  }

  const previewStep = steps[previewIndex];

  return (
    <main className="giftBuilder">
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

          <label className="contactField">
            <span>THEIR CONTACT</span>

            <input
              placeholder="@telegram or email"
              value={recipientContact}
              onChange={(e) =>
                setRecipientContact(e.target.value)
              }
            />
          </label>

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
                onClick={openPreview}
              >
                PREVIEW →
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
              onClick={() => setModal(null)}
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
                      className={
                        draft.rewardType === type
                          ? "rewardType active"
                          : "rewardType"
                      }
                      onClick={() =>
                        updateDraft("rewardType", type)
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

                {draft.rewardType !== "LETTER" && (
                  <label>
                    <span>
                      PHOTO / VIDEO / AUDIO / LINK
                    </span>

                    <input
                      placeholder="Paste link for now..."
                      value={draft.rewardUrl}
                      onChange={(e) =>
                        updateDraft(
                          "rewardUrl",
                          e.target.value
                        )
                      }
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="modalActions">
              <button
                className="modalCancel"
                onClick={() => setModal(null)}
              >
                CANCEL
              </button>

              <button
                className="mainButton"
                onClick={saveGift}
              >
                ADD THIS GIFT ♡
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "preview" && previewStep && (
        <div className="modalOverlay">
          <div className="previewModal">
            <button
              className="modalClose"
              onClick={() => setModal(null)}
            >
              ×
            </button>

            <p className="modalEyebrow">
              PREVIEW · {recipientName || "YOUR PERSON"}
            </p>

            {!previewUnlocked ? (
              <>
                <div className="previewProgress">
                  {String(previewIndex + 1).padStart(2, "0")}
                  <span>/</span>
                  {String(steps.length).padStart(2, "0")}
                </div>

                <h2>{previewStep.question}</h2>

                {previewStep.hint && (
                  <p className="previewHint">
                    HINT · {previewStep.hint}
                  </p>
                )}

                <div className="fakeAnswer">
                  TYPE YOUR ANSWER...
                </div>

                <button
                  className="mainButton"
                  onClick={() => setPreviewUnlocked(true)}
                >
                  UNLOCK →
                </button>
              </>
            ) : (
              <>
                <div className="unlockedHeart">♡</div>

                <p className="modalEyebrow">
                  {previewStep.rewardType} UNLOCKED
                </p>

                <h2>{previewStep.rewardTitle}</h2>

                <p className="rewardMessage">
                  {previewStep.rewardText}
                </p>

                {previewIndex < steps.length - 1 ? (
                  <button
                    className="mainButton"
                    onClick={() => {
                      setPreviewIndex((i) => i + 1);
                      setPreviewUnlocked(false);
                    }}
                  >
                    NEXT GIFT →
                  </button>
                ) : (
                  <div className="previewFinish">
                    <textarea
                      value={finalMessage}
                      onChange={(e) =>
                        setFinalMessage(e.target.value)
                      }
                    />

                    <button
                      className="mainButton"
                      disabled={creating}
                      onClick={createGift}
                    >
                      {creating
                        ? "CREATING..."
                        : "SEND GIFT →"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {modal === "ready" && (
        <div className="modalOverlay">
          <div className="readyModal">
            <button
              className="modalClose"
              onClick={() => setModal(null)}
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

            <div className="giftLink">
              {giftLink}
            </div>

            <button
              className="mainButton"
              onClick={() =>
                navigator.clipboard.writeText(giftLink)
              }
            >
              COPY PRIVATE LINK
            </button>

            <a className="openGift" href={giftLink}>
              OPEN GIFT →
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(html),
        :global(body) {
          margin: 0;
          overflow: hidden;
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
          overflow: hidden;
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
          height: calc(100svh - 82px);
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
          overflow: hidden;
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
            height: calc(100svh - 65px);
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

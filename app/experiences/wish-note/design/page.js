"use client";

import { useState } from "react";
import { useWishDraft } from "../../../lib/use-wish-draft";
import CouponAttachmentUpload from "../../../components/CouponAttachmentUpload";
import WishNoteMedia from "../../../components/WishNoteMedia";

const styles = [
  {
    id: "soft",
    name: "Soft Pink",
    description: "Warm, romantic & playful",
    symbol: "♡",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple & timeless",
    symbol: "○",
  },
  {
    id: "film",
    name: "Retro Film",
    description: "Nostalgic, warm & personal",
    symbol: "✦",
  },
  {
    id: "dark",
    name: "Dark Romance",
    description: "Deep, intimate & cinematic",
    symbol: "♥",
  },
];

export default function WishNoteDesign() {
  const {draft,change,error}=useWishDraft();
  const [uploadStates,setUploadStates]=useState({});
  const uploadBusy=Object.values(uploadStates).some(Boolean);
  const selectedStyle=draft.style,caption=draft.caption;
  const setSelectedStyle=v=>change('style',v),setCaption=v=>change('caption',v);
  const activeStyle=styles.find(style=>style.id===selectedStyle)||styles[0];

  return (
    <main className={`designPage design-${selectedStyle}`}>
      <header className="personalizeHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <div className="personalizeHeaderCenter">
          WISH NOTE / DESIGN
        </div>

        <a
          className="personalizeExit"
          href="/experiences/wish-note"
        >
          Save & Exit
        </a>
      </header>

      <section className="designLayout">
        <div className="designEditor">

          <div className="editorIntro">
            <p className="eyebrow">MAKE IT FEEL LIKE THEM</p>

            <h1>
              CHOOSE THE
              <br />
              <span>FEELING.</span>
            </h1>

            <p>
              Pick a visual style and add a favorite memory.
              This becomes part of the surprise they see before
              entering their Wish Note.
            </p>
          </div>

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>01</span>

              <div>
                <h2>Choose a style</h2>
                <p>
                  The content stays yours. This changes the mood
                  and visual language of the gift.
                </p>
              </div>
            </div>

            <div className="designStyleGrid">
              {styles.map((style) => (
                <button
                  type="button"
                  key={style.id}
                  className={
                    selectedStyle === style.id
                      ? `designStyleCard ${style.id} active`
                      : `designStyleCard ${style.id}`
                  }
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="designStyleVisual">
                    <span>{style.symbol}</span>
                  </div>

                  <div className="designStyleInfo">
                    <strong>{style.name}</strong>
                    <span>{style.description}</span>
                  </div>

                  <i>
                    {selectedStyle === style.id ? "✓" : ""}
                  </i>
                </button>
              ))}
            </div>
          </div>

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>02</span>

              <div>
                <h2>Add a favorite photo</h2>
                <p>
                  Choose one memory for the opening card.
                  You can add more memories later.
                </p>
              </div>
            </div>

            {error && <p role="alert">{error}</p>}
            {['photo','video','voice','gift'].map(kind=><div key={kind} style={{marginBottom:24}}><h3>{kind==='gift'?'Certificate or ticket':kind.toUpperCase()}</h3><CouponAttachmentUpload kind={kind} attachment={draft.attachments[kind]} onBusy={value=>setUploadStates(previous=>({...previous,[kind]:value}))} saveHint="Saved in your Wish Note draft." onChange={file=>change('attachments',previous=>{const next={...previous};if(file)next[kind]=file;else delete next[kind];return next;})}/></div>)}

          </div>

          <div className="editorSection">
            <div className="editorSectionTitle">
              <span>03</span>

              <div>
                <h2>Add a little caption</h2>
                <p>
                  Optional — something only the two of you
                  will understand works best.
                </p>
              </div>
            </div>

            <label className="editorField">
              <span>PHOTO CAPTION</span>

              <input
                type="text"
                value={caption}
                maxLength={70}
                onChange={(event) =>
                  setCaption(event.target.value)
                }
                placeholder="Write a little caption..."
              />

              <small>{caption.length}/70</small>
            </label>
          </div>

          <div className="editorContinue">
            <div>
              <p>YOUR GIFT HAS A LOOK ♡</p>

              <span>
                Next we'll choose who receives it and when
                the surprise should arrive.
              </span>
            </div>

            <a
              className="primary"
              href="/experiences/wish-note/preview" onClick={event=>{if(uploadBusy)event.preventDefault();}}
            >
              Continue to Delivery →
            </a>
          </div>
        </div>

        <aside className="designPreview">
          <div className="previewSticky">

            <div className="previewLabel">
              <span>OPENING CARD PREVIEW</span>
              <span>●</span>
            </div>

            <div className={`designGiftCard ${selectedStyle}`}>
              <p className="designGiftBrand">
                WISH NOTE ♡
              </p>

              <div className="designGiftHeart">
                {activeStyle.symbol}
              </div>

              <p className="designGiftSmall">
                365 DAYS OF HAPPINESS
              </p>

              <h2>
                A LITTLE
                <br />
                SOMETHING
                <br />
                FOR YOU.
              </h2>

              <div className="designGiftPhoto">
                {draft.attachments.photo ? <WishNoteMedia preview={{photo:draft.attachments.photo}}/> : <span>YOUR MEMORY</span>}

              </div>

              <p className="designGiftCaption">
                {caption || "your little caption ♡"}
              </p>

              <button type="button">
                OPEN YOUR GIFT →
              </button>
            </div>

            <p className="previewHint">
              This is the card they'll see before entering
              their private Wish Note.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}


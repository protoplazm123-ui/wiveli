"use client";

import { useState } from "react";
import { useWishDraft } from "../../../lib/use-wish-draft";
import WishNoteMedia from "../../../components/WishNoteMedia";

export default function WishNotePreview() {
  const {draft}=useWishDraft();
  const [device, setDevice] = useState("mobile");

  return (
    <main className="wnPreviewPage">

      <header className="personalizeHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <div className="personalizeHeaderCenter">
          WISH NOTE / PREVIEW
        </div>

        <a
          className="personalizeExit"
          href="/experiences/wish-note"
        >
          Save & Exit
        </a>
      </header>


      <section className="wnPreviewIntro">
        <p>YOUR GIFT IS READY ♡</p>

        <h1>
          SEE IT LIKE
          <br />
          THEY WILL.
        </h1>

        <span>
          Take one last look at the experience before you send it.
        </span>
      </section>


      <section className="wnPreviewWorkspace">

        {/* DETAILS */}

        <aside className="wnPreviewDetails">

          <div className="wnPreviewDetailsHeader">
            <p>GIFT DETAILS</p>
            <span>Everything in one place.</span>
          </div>

          <div className="wnPreviewDetail">
            <small>FOR</small>
            <strong>{draft.recipientName} ♡</strong>
            <a href="/experiences/wish-note/personalize">EDIT</a>
          </div>

          <div className="wnPreviewDetail">
            <small>FROM</small>
            <strong>{draft.senderName}</strong>
            <a href="/experiences/wish-note/personalize">EDIT</a>
          </div>

          <div className="wnPreviewDetail">
            <small>WISHES</small>
            <strong>{draft.isCustom ? draft.customWishCount : draft.wishCount} wishes</strong>
            <a href="/experiences/wish-note/personalize">EDIT</a>
          </div>

          <div className="wnPreviewDetail">
            <small>STYLE</small>
            <strong>{{soft:"Soft Pink",minimal:"Minimal",film:"Retro Film",dark:"Dark Romance"}[draft.style]}</strong>
            <a href="/experiences/wish-note/design">EDIT</a>
          </div>

          <div className="wnPreviewMessage">
            <small>MESSAGE</small>

            <p>
              “{draft.message}”
            </p>
          </div>

        </aside>


        {/* LIVE PREVIEW */}

        <div className="wnPreviewStage">

          <div className="wnPreviewStageTop">

            <div>
              <p>LIVE PREVIEW</p>
              <span>Try it exactly like they will.</span>
            </div>

            <div className="wnPreviewDeviceSwitch">

              <button
                className={device === "desktop" ? "active" : ""}
                onClick={() => setDevice("desktop")}
              >
                DESKTOP
              </button>

              <button
                className={device === "mobile" ? "active" : ""}
                onClick={() => setDevice("mobile")}
              >
                MOBILE
              </button>

            </div>

          </div>


          <div className={`wnPreviewDevice ${device}`}>

            <div className="wnPreviewScreen">

              <div className="wnPreviewStars" />

              <div className="wnPreviewScreenTop">
                <span>365 DAYS OF HAPPINESS</span>
                <span>MADE FOR {draft.recipientName} ♡</span>
              </div>


              <WishNoteMedia preview={draft.attachments}/>
              <div className="wnPreviewScreenCenter">

                <small>A LITTLE SOMETHING FOR YOU</small>

                <h2>
                  MAKE
                  <br />
                  A WISH<span>.</span>
                </h2>

                <p>
                  {draft.message}
                </p>

              </div>


              <div className="wnPreviewScreenBottom">

                <div>
                  <small>FROM</small>
                  <strong>{draft.senderName} ♡</strong>
                </div>

                <a href="/gift/wish-note?preview=1" target="_blank" rel="noopener noreferrer">
                  MAKE A WISH <span>♡</span>
                </a>

              </div>

            </div>

          </div>


          <p className="wnPreviewHint">
            ♡ This opens a preview. Create your gift on the next step to save and send it.
          </p>

        </div>

      </section>


      <footer className="wnPreviewFooter">

        <a
          href="/experiences/wish-note/design"
          className="wnPreviewBack"
        >
          ← BACK TO DESIGN
        </a>

        <div>
          <small>EVERYTHING LOOKS GOOD?</small>

          <a
            href="/experiences/wish-note/delivery"
            className="wnPreviewContinue"
          >
            CONTINUE <span>→</span>
          </a>
        </div>

      </footer>

    </main>
  );
}


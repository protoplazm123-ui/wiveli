"use client";

import { useState } from "react";

export default function WishNotePreview() {
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
            <strong>Sophie ♡</strong>
            <a href="/experiences/wish-note/personalize">EDIT</a>
          </div>

          <div className="wnPreviewDetail">
            <small>FROM</small>
            <strong>Alex</strong>
            <a href="/experiences/wish-note/personalize">EDIT</a>
          </div>

          <div className="wnPreviewDetail">
            <small>WISHES</small>
            <strong>24 wishes</strong>
            <a href="/experiences/wish-note/personalize">EDIT</a>
          </div>

          <div className="wnPreviewDetail">
            <small>STYLE</small>
            <strong>Soft Pink</strong>
            <a href="/experiences/wish-note/design">EDIT</a>
          </div>

          <div className="wnPreviewMessage">
            <small>MESSAGE</small>

            <p>
              “Your wishes, our plans, and memories waiting to happen.”
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
                <span>MADE FOR SOPHIE ♡</span>
              </div>


              <div className="wnPreviewScreenCenter">

                <small>A LITTLE SOMETHING FOR YOU</small>

                <h2>
                  MAKE
                  <br />
                  A WISH<span>.</span>
                </h2>

                <p>
                  Your wishes, our plans,
                  <br />
                  and memories waiting to happen.
                </p>

              </div>


              <div className="wnPreviewScreenBottom">

                <div>
                  <small>FROM</small>
                  <strong>Alex ♡</strong>
                </div>

                <a href="/gift/wish-note">
                  MAKE A WISH <span>♡</span>
                </a>

              </div>

            </div>

          </div>


          <p className="wnPreviewHint">
            ♡ Clicking the button opens the real recipient experience
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

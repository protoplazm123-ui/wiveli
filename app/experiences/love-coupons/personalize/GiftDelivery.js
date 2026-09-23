"use client";

import { useState } from "react";
import SendForMe from "./SendForMe";
import SendMyself from "./SendMyself";

export default function GiftDelivery({
  recipientName = "them",
  onSendForMe,
  onSendMyself,
}) {
  const [choice, setChoice] = useState(null);
  const [showSendForMe, setShowSendForMe] = useState(false);
 
if (showSendForMe) {
  return (
    <SendForMe
      recipientName={recipientName}
      onBack={() => setShowSendForMe(false)}
      onContinue={(details) => {
        if (onSendForMe) {
          onSendForMe(details);
        }
      }}
    />
  );
}
const [showSendMyself, setShowSendMyself] = useState(false);

if (showSendMyself) {
  return (
    <SendMyself
      recipientName={recipientName}
      onBack={() => setShowSendMyself(false)}
      onPreview={() => {
        window.location.href = "/gift/love-coupons";
      }}
    />
  );
}
  return (
    <main className="delivery">
      <header>
        <span className="logo">WI♡ELI</span>
        <span className="tiny">YOUR GIFT IS READY ♡</span>
      </header>

      <section className="hero">
        <div className="heart">♡</div>

        <p className="eyebrow">
          ONE LAST LITTLE THING
        </p>

        <h1>
          HOW SHOULD WE
          <br />
          <em>SEND IT?</em>
        </h1>

        <p className="description">
          Your gift for {recipientName} is ready.
          <br />
          Choose how you'd like it to arrive.
        </p>
      </section>

      <section className="options">
        <button
          type="button"
          className={`option recommended ${
            choice === "wiveli" ? "selected" : ""
          }`}
          onClick={() => setChoice("wiveli")}
        >
          <div className="recommendedBadge">
            RECOMMENDED ♡
          </div>

          <div className="number">01</div>

          <div className="icon">
            <span>♡</span>
            <i>→</i>
            <span>✉</span>
          </div>

          <p className="optionEyebrow">
            LET WIVELI DO IT
          </p>

          <h2>
            SEND IT
            <br />
            <em>FOR ME.</em>
          </h2>

          <p className="optionText">
            We'll send them a sweet little message
            with their private gift.
          </p>

          <div className="messagePreview">
            <small>THEY'LL RECEIVE</small>

            <p>
              Someone special sent you a little
              something ♡
            </p>

            <span>
              A WIVELI gift is waiting for you.
              Open it whenever you're ready →
            </span>
          </div>

          <div className="selectLine">
            <span>CHOOSE THIS</span>
            <b>→</b>
          </div>
        </button>

        <button
          type="button"
          className={`option ${
            choice === "myself" ? "selected" : ""
          }`}
          onClick={() => setChoice("myself")}
        >
          <div className="number">02</div>

          <div className="icon">
            <span>♡</span>
            <i>→</i>
            <span>↗</span>
          </div>

          <p className="optionEyebrow">
            KEEP THE MOMENT YOURS
          </p>

          <h2>
            I'LL SEND IT
            <br />
            <em>MYSELF.</em>
          </h2>

          <p className="optionText">
            Get your gift link and share it however
            feels right — text, DM, WhatsApp and more.
          </p>

          <div className="ways">
            <span>TEXT</span>
            <span>DM</span>
            <span>WHATSAPP</span>
            <span>TELEGRAM</span>
          </div>

          <div className="selectLine">
            <span>CHOOSE THIS</span>
            <b>→</b>
          </div>
        </button>
      </section>

      <section className="continueArea">
        <p>
          {choice === "wiveli"
            ? "We'll ask where to send it next ♡"
            : choice === "myself"
            ? "Your share link will appear next ♡"
            : "Choose how you want your gift to arrive ♡"}
        </p>

        <button
          type="button"
          className="continue"
          disabled={!choice}
          onClick={() => {
            if (choice === "wiveli") {
  setShowSendForMe(true);
}

           if (choice === "myself") {
  setShowSendMyself(true);
}
          }}
        >
          CONTINUE
          <span>→</span>
        </button>

        <small>
          WIVELI will never contact your recipient
          without you choosing to send the gift.
        </small>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .delivery {
          min-height: 100svh;
          background:
            radial-gradient(
              circle at 50% 0%,
              #f9dfda 0%,
              transparent 35%
            ),
            #efc6c3;
          color: #4e0914;
        }

        header {
          height: 76px;
          padding: 0 5vw;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid rgba(78, 9, 20, 0.16);
        }

        .logo {
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .tiny {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .hero {
          padding: 75px 20px 60px;
          text-align: center;
        }

        .heart {
          width: 48px;
          height: 48px;

          margin: 0 auto 28px;

          display: grid;
          place-items: center;

          border: 1px solid rgba(78, 9, 20, 0.25);
          border-radius: 50%;

          font-family: Georgia, serif;
          font-size: 23px;
        }

        .eyebrow,
        .optionEyebrow {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .eyebrow {
          margin: 0 0 18px;
        }

        .hero h1 {
          margin: 0;

          font-family: Georgia, serif;
          font-size: clamp(58px, 8vw, 110px);
          line-height: 0.78;
          letter-spacing: -0.065em;
        }

        .hero h1 em,
        .option h2 em {
          font-weight: 400;
        }

        .description {
          margin: 30px 0 0;

          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.6;
        }

        .options {
          width: min(1050px, calc(100% - 40px));
          margin: 0 auto;

          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .option {
          min-height: 570px;
          position: relative;

          padding: 38px;

          border: 1px solid rgba(78, 9, 20, 0.3);
          border-radius: 26px;

          background: rgba(255, 235, 230, 0.48);
          color: #4e0914;

          text-align: left;
          cursor: pointer;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .option:hover {
          transform: translateY(-5px);

          box-shadow:
            0 24px 55px rgba(65, 4, 14, 0.12);
        }

        .option.selected {
          background: #f7d8d3;
          outline: 3px solid #550a16;
          outline-offset: 3px;
        }

        .recommended {
          background: #560a16;
          color: #f4cfcb;
        }

        .recommended.selected {
          background: #560a16;
          outline-color: #f4cfcb;
        }

        .recommendedBadge {
          position: absolute;
          right: 25px;
          top: 24px;

          padding: 8px 12px;

          border: 1px solid rgba(244, 207, 203, 0.35);
          border-radius: 100px;

          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .number {
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .icon {
          height: 85px;
          margin: 55px 0 25px;

          display: flex;
          align-items: center;
          gap: 14px;

          font-family: Georgia, serif;
        }

        .icon span {
          width: 62px;
          height: 62px;

          display: grid;
          place-items: center;

          border: 1px solid currentColor;
          border-radius: 50%;

          font-size: 25px;
        }

        .icon i {
          font-size: 20px;
          font-style: normal;
        }

        .optionEyebrow {
          margin: 0 0 14px;
        }

        .option h2 {
          margin: 0;

          font-family: Georgia, serif;
          font-size: clamp(43px, 5vw, 65px);
          line-height: 0.82;
          letter-spacing: -0.055em;
        }

        .optionText {
          max-width: 390px;

          margin: 23px 0;

          font-family: Georgia, serif;
          font-size: 13px;
          line-height: 1.55;
        }

        .messagePreview {
          margin-top: 25px;
          padding: 19px;

          border: 1px solid rgba(244, 207, 203, 0.22);
          border-radius: 15px;

          background: rgba(255, 255, 255, 0.06);
        }

        .messagePreview small {
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.17em;
          opacity: 0.7;
        }

        .messagePreview p {
          margin: 12px 0 5px;

          font-family: Georgia, serif;
          font-size: 14px;
          font-style: italic;
        }

        .messagePreview span {
          font-size: 9px;
          line-height: 1.5;
          opacity: 0.7;
        }

        .ways {
          margin-top: 33px;

          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .ways span {
          padding: 8px 11px;

          border: 1px solid rgba(78, 9, 20, 0.25);
          border-radius: 100px;

          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .selectLine {
          position: absolute;
          left: 38px;
          right: 38px;
          bottom: 31px;

          padding-top: 18px;

          display: flex;
          justify-content: space-between;

          border-top: 1px solid currentColor;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.16em;

          opacity: 0.75;
        }

        .selectLine b {
          font-size: 17px;
        }

        .continueArea {
          padding: 65px 20px 90px;
          text-align: center;
        }

        .continueArea p {
          margin: 0 0 20px;

          font-family: Georgia, serif;
          font-size: 14px;
          font-style: italic;
        }

        .continue {
          width: min(340px, 100%);
          height: 58px;

          margin: 0 auto;

          padding: 0 24px;

          border: none;
          border-radius: 100px;

          background: #520914;
          color: #f4cfcb;

          display: flex;
          align-items: center;
          justify-content: space-between;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.13em;

          cursor: pointer;
        }

        .continue:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .continue span {
          font-size: 19px;
        }

        .continueArea small {
          display: block;

          max-width: 460px;
          margin: 18px auto 0;

          font-size: 7px;
          line-height: 1.5;
          opacity: 0.55;
        }

        @media (max-width: 760px) {
          .hero {
            padding: 55px 18px 45px;
          }

          .hero h1 {
            font-size: 56px;
          }

          .options {
            width: calc(100% - 24px);
            grid-template-columns: 1fr;
          }

          .option {
            min-height: 535px;
            padding: 28px;
          }

          .selectLine {
            left: 28px;
            right: 28px;
          }
        }

        @media (max-width: 450px) {
          header {
            padding: 0 18px;
          }

          .tiny {
            font-size: 6px;
          }

          .hero h1 {
            font-size: 49px;
          }

          .option h2 {
            font-size: 47px;
          }

          .recommendedBadge {
            right: 18px;
          }
        }
      `}</style>
    </main>
  );
}

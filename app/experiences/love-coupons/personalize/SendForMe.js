"use client";

import { useState } from "react";

export default function SendForMe({
  recipientName = "them",
  onBack,
  onContinue,
}) {
  const [method, setMethod] = useState("sms");
  const [recipientContact, setRecipientContact] = useState("");

  const isEmail = method === "email";

  function handleContinue() {
    if (!recipientContact.trim()) {
      return;
    }

    if (onContinue) {
      onContinue({
        method,
        recipientContact: recipientContact.trim(),
      });
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <button
          type="button"
          className="back"
          onClick={onBack}
        >
          ← BACK
        </button>

        <span className="logo">WI♡ELI</span>

        <span className="step">
          DELIVERY
        </span>
      </header>

      <section className="hero">
        <div className="heart">
          ♡
        </div>

        <p className="eyebrow">
          WE'LL TAKE IT FROM HERE
        </p>

        <h1>
          WHERE SHOULD
          <br />
          <em>WE SEND IT?</em>
        </h1>

        <p className="description">
          Tell us where to deliver{" "}
          {recipientName}'s little
          surprise.
        </p>
      </section>

      <section className="deliveryCard">
        <div className="cardTop">
          <div>
            <p className="smallLabel">
              DELIVERY METHOD
            </p>

            <h2>
              Choose how it
              <br />
              should arrive ♡
            </h2>
          </div>

          <span className="number">
            01
          </span>
        </div>

        <div className="methods">
          <button
            type="button"
            className={
              method === "sms"
                ? "method active"
                : "method"
            }
            onClick={() =>
              setMethod("sms")
            }
          >
            <div className="methodIcon">
              ♡
            </div>

            <div>
              <strong>SMS</strong>
              <span>
                Send it straight to
                their phone
              </span>
            </div>

            <b>
              {method === "sms"
                ? "✓"
                : ""}
            </b>
          </button>

          <button
            type="button"
            className={
              method === "email"
                ? "method active"
                : "method"
            }
            onClick={() =>
              setMethod("email")
            }
          >
            <div className="methodIcon">
              ✉
            </div>

            <div>
              <strong>EMAIL</strong>
              <span>
                A little surprise in
                their inbox
              </span>
            </div>

            <b>
              {method === "email"
                ? "✓"
                : ""}
            </b>
          </button>
        </div>

        <div className="contactBlock">
          <p className="smallLabel">
            {isEmail
              ? "RECIPIENT'S EMAIL"
              : "RECIPIENT'S PHONE NUMBER"}
          </p>

          <input
            type={
              isEmail
                ? "email"
                : "tel"
            }
            value={recipientContact}
            onChange={(event) =>
              setRecipientContact(
                event.target.value
              )
            }
            placeholder={
              isEmail
                ? "sophie@example.com"
                : "+1 234 567 8900"
            }
          />

          <p className="privacy">
            We'll only use this to
            deliver this gift ♡
          </p>
        </div>
      </section>

      <section className="preview">
        <div className="previewHeader">
          <div>
            <p className="smallLabel">
              MESSAGE PREVIEW
            </p>

            <h2>
              WHAT THEY'LL
              <br />
              <em>RECEIVE.</em>
            </h2>
          </div>

          <span>
            {isEmail
              ? "EMAIL"
              : "SMS"}
          </span>
        </div>

        <div className="message">
          <div className="messageLogo">
            WI♡ELI
          </div>

          <div className="messageBody">
            <p>
              Someone special sent
              you a little something
              ♡
            </p>

            <span>
              A WIVELI gift is
              waiting for you.
              Open it whenever
              you're ready.
            </span>

            <div className="fakeLink">
              OPEN YOUR GIFT →
            </div>
          </div>
        </div>

        <p className="previewNote">
          Your private gift link
          will be added automatically
          when real delivery is
          connected.
        </p>
      </section>

      <section className="bottom">
        <div>
          <p>
            Ready to send a little
            happiness?
          </p>

          <span>
            You can review everything
            before the real message is
            sent.
          </span>
        </div>

        <button
          type="button"
          className="continue"
          disabled={
            !recipientContact.trim()
          }
          onClick={
            handleContinue
          }
        >
          CONTINUE
          <b>→</b>
        </button>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100svh;
          padding-bottom: 80px;

          background:
            radial-gradient(
              circle at 50% 0%,
              #f9dfda 0%,
              transparent 35%
            ),
            #efc6c3;

          color: #4e0914;
        }

        .topbar {
          height: 76px;
          padding: 0 5vw;

          display: grid;
          grid-template-columns:
            1fr auto 1fr;
          align-items: center;

          border-bottom:
            1px solid
            rgba(
              78,
              9,
              20,
              0.16
            );
        }

        .back {
          justify-self: start;

          padding: 0;
          border: none;
          background: transparent;

          color: #4e0914;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.17em;

          cursor: pointer;
        }

        .logo {
          font-family:
            Georgia,
            serif;

          font-size: 22px;
          font-weight: 700;
        }

        .step {
          justify-self: end;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .hero {
          padding:
            70px 20px
            55px;

          text-align: center;
        }

        .heart {
          width: 48px;
          height: 48px;

          margin:
            0 auto 27px;

          display: grid;
          place-items: center;

          border:
            1px solid
            rgba(
              78,
              9,
              20,
              0.25
            );

          border-radius: 50%;

          font-family:
            Georgia,
            serif;

          font-size: 23px;
        }

        .eyebrow,
        .smallLabel {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.19em;
        }

        .eyebrow {
          margin:
            0 0 17px;
        }

        .hero h1 {
          margin: 0;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              58px,
              8vw,
              105px
            );

          line-height: 0.8;
          letter-spacing:
            -0.06em;
        }

        .hero h1 em,
        .preview h2 em {
          font-weight: 400;
        }

        .description {
          margin:
            27px 0 0;

          font-family:
            Georgia,
            serif;

          font-size: 15px;
          line-height: 1.55;
        }

        .deliveryCard,
        .preview,
        .bottom {
          width:
            min(
              900px,
              calc(
                100% - 40px
              )
            );

          margin-left: auto;
          margin-right: auto;
        }

        .deliveryCard {
          padding: 35px;

          border:
            1px solid
            rgba(
              78,
              9,
              20,
              0.27
            );

          border-radius: 26px;

          background:
            rgba(
              255,
              237,
              232,
              0.5
            );
        }

        .cardTop {
          display: flex;
          justify-content:
            space-between;
          gap: 30px;

          margin-bottom: 30px;
        }

        .smallLabel {
          margin:
            0 0 10px;
        }

        .cardTop h2 {
          margin: 0;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              31px,
              4vw,
              45px
            );

          line-height: 0.95;
          letter-spacing:
            -0.035em;
        }

        .number {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border:
            1px solid
            rgba(
              78,
              9,
              20,
              0.25
            );

          border-radius: 50%;

          font-family:
            Georgia,
            serif;

          font-size: 11px;
        }

        .methods {
          display: grid;
          grid-template-columns:
            1fr 1fr;

          gap: 12px;
        }

        .method {
          min-height: 105px;

          padding: 17px;

          display: grid;
          grid-template-columns:
            48px 1fr
            25px;

          align-items: center;
          gap: 13px;

          border:
            1px solid
            rgba(
              78,
              9,
              20,
              0.23
            );

          border-radius: 16px;

          background:
            rgba(
              255,
              246,
              242,
              0.45
            );

          color: #4e0914;

          text-align: left;
          cursor: pointer;
        }

        .method.active {
          background: #570a16;
          color: #f6d2ce;

          border-color:
            #570a16;
        }

        .methodIcon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border:
            1px solid
            currentColor;

          border-radius: 50%;

          font-family:
            Georgia,
            serif;

          font-size: 18px;
        }

        .method strong {
          display: block;

          margin-bottom: 5px;

          font-size: 9px;
          letter-spacing:
            0.13em;
        }

        .method span {
          display: block;

          font-family:
            Georgia,
            serif;

          font-size: 11px;
          line-height: 1.4;

          opacity: 0.72;
        }

        .method b {
          font-size: 15px;
        }

        .contactBlock {
          margin-top: 25px;
          padding-top: 25px;

          border-top:
            1px solid
            rgba(
              78,
              9,
              20,
              0.14
            );
        }

        .contactBlock input {
          width: 100%;
          height: 60px;

          padding:
            0 18px;

          border:
            1px solid
            rgba(
              78,
              9,
              20,
              0.25
            );

          border-radius: 14px;

          outline: none;

          background:
            rgba(
              255,
              247,
              243,
              0.7
            );

          color: #4e0914;

          font-family:
            Georgia,
            serif;

          font-size: 16px;
        }

        .contactBlock input:focus {
          border-color:
            #570a16;
        }

        .privacy {
          margin:
            9px 0 0;

          font-size: 8px;
          opacity: 0.55;
        }

        .preview {
          margin-top: 20px;
          padding: 35px;

          border-radius: 26px;

          background: #570a16;
          color: #f6d2ce;
        }

        .previewHeader {
          display: flex;
          justify-content:
            space-between;
          align-items:
            flex-start;
          gap: 20px;
        }

        .preview h2 {
          margin: 0;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              37px,
              5vw,
              58px
            );

          line-height: 0.84;
          letter-spacing:
            -0.05em;
        }

        .previewHeader > span {
          padding:
            8px 12px;

          border:
            1px solid
            rgba(
              246,
              210,
              206,
              0.35
            );

          border-radius:
            100px;

          font-size: 7px;
          font-weight: 800;
          letter-spacing:
            0.15em;
        }

        .message {
          max-width: 530px;

          margin:
            35px auto 0;

          overflow: hidden;

          border-radius: 22px;

          background: #f6d5d0;
          color: #4e0914;

          box-shadow:
            0 25px 60px
            rgba(
              30,
              0,
              5,
              0.25
            );
        }

        .messageLogo {
          padding: 18px 22px;

          border-bottom:
            1px solid
            rgba(
              78,
              9,
              20,
              0.15
            );

          font-family:
            Georgia,
            serif;

          font-size: 15px;
          font-weight: 700;
        }

        .messageBody {
          padding:
            30px 25px;
        }

        .messageBody p {
          margin:
            0 0 12px;

          font-family:
            Georgia,
            serif;

          font-size: 24px;
          line-height: 1.05;
          font-style: italic;
        }

        .messageBody > span {
          display: block;

          font-family:
            Georgia,
            serif;

          font-size: 12px;
          line-height: 1.5;
        }

        .fakeLink {
          margin-top: 25px;
          padding:
            14px 17px;

          border-radius:
            100px;

          background: #570a16;
          color: #f6d2ce;

          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.13em;

          text-align: center;
        }

        .previewNote {
          margin:
            20px 0 0;

          text-align: center;

          font-size: 7px;
          line-height: 1.5;

          opacity: 0.55;
        }

        .bottom {
          margin-top: 20px;

          padding:
            22px 26px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 30px;

          border:
            1px solid
            rgba(
              78,
              9,
              20,
              0.22
            );

          border-radius: 20px;

          background:
            rgba(
              255,
              237,
              232,
              0.45
            );
        }

        .bottom p {
          margin:
            0 0 5px;

          font-family:
            Georgia,
            serif;

          font-size: 15px;
          font-style: italic;
        }

        .bottom > div > span {
          font-size: 8px;
          opacity: 0.6;
        }

        .continue {
          width: 230px;
          height: 55px;

          padding:
            0 20px;

          flex: 0 0 auto;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          border: none;
          border-radius:
            100px;

          background: #570a16;
          color: #f6d2ce;

          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.14em;

          cursor: pointer;
        }

        .continue b {
          font-size: 18px;
        }

        .continue:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (
          max-width: 700px
        ) {
          .topbar {
            padding:
              0 17px;
          }

          .hero {
            padding:
              52px 17px
              42px;
          }

          .hero h1 {
            font-size: 52px;
          }

          .deliveryCard,
          .preview,
          .bottom {
            width:
              calc(
                100% - 24px
              );
          }

          .deliveryCard,
          .preview {
            padding: 24px;
          }

          .methods {
            grid-template-columns:
              1fr;
          }

          .preview h2 {
            font-size: 40px;
          }

          .bottom {
            flex-direction:
              column;

            align-items:
              stretch;
          }

          .continue {
            width: 100%;
          }
        }

        @media (
          max-width: 430px
        ) {
          .step {
            display: none;
          }

          .topbar {
            grid-template-columns:
              1fr auto 1fr;
          }

          .hero h1 {
            font-size: 46px;
          }

          .cardTop h2 {
            font-size: 30px;
          }

          .messageBody p {
            font-size: 21px;
          }
        }
      `}</style>
    </main>
  );
}

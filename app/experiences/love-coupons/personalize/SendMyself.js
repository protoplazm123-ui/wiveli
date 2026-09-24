"use client";

import { useEffect, useState } from "react";

import {
  loadLoveCouponsGift,
} from "../storage";

export default function SendMyself({
  recipientName = "them",
  onBack,
}) {
  const [privateLink, setPrivateLink] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    const gift =
      loadLoveCouponsGift();

    if (!gift?.serverId) {
      return;
    }

    const link =
      `${window.location.origin}` +
      `/gift/love-coupons/` +
      `${gift.serverId}`;

    setPrivateLink(link);
  }, []);

  async function copyLink() {
    if (!privateLink) return;

    try {
      await navigator.clipboard.writeText(
        privateLink
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch (error) {
      console.error(
        "Could not copy link:",
        error
      );

      alert(
        "We couldn't copy the link automatically. Please copy it manually ♡"
      );
    }
  }

  async function shareGift() {
    if (!privateLink) return;

    const shareText =
      `I made a little something for you ♡\n` +
      `Open it when you have a minute.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "A WIVELI gift for you ♡",
          text: shareText,
          url: privateLink,
        });

        return;
      } catch (error) {
        if (
          error?.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "Share failed:",
          error
        );
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${shareText}\n${privateLink}`
      );

      alert(
        "Gift message and private link copied ♡"
      );
    } catch (error) {
      console.error(
        "Could not share gift:",
        error
      );
    }
  }

  function previewGift() {
    if (!privateLink) return;

    window.location.href =
      privateLink;
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

        <span className="logo">
          WI♡ELI
        </span>

        <span className="step">
          SHARE
        </span>
      </header>

      <section className="hero">
        <div className="heart">
          ♡
        </div>

        <p className="eyebrow">
          KEEP THE MOMENT YOURS
        </p>

        <h1>
          SEND IT
          <br />
          <em>YOUR WAY.</em>
        </h1>

        <p className="description">
          Your private gift link for{" "}
          {recipientName} is ready.
          <br />
          You choose when and where
          to send it.
        </p>
      </section>

      <section className="linkCard">
        <div className="cardTop">
          <div>
            <p className="smallLabel">
              YOUR PRIVATE GIFT LINK
            </p>

            <h2>
              Made just for
              <br />
              {recipientName} ♡
            </h2>
          </div>

          <span className="number">
            01
          </span>
        </div>

        <div className="linkBox">
          <div className="linkText">
            <small>
              PRIVATE LINK
            </small>

            <span>
              {privateLink ||
                "Creating your private link…"}
            </span>
          </div>

          <button
            type="button"
            disabled={!privateLink}
            onClick={copyLink}
          >
            {copied
              ? "COPIED ✓"
              : "COPY PRIVATE LINK"}
          </button>
        </div>

        <div className="readyNotice">
          <span>♡</span>

          <p>
            This link is unique to
            {recipientName}&apos;s gift.
            Anyone with the link can open
            the experience, so share it
            only with the person you made
            it for.
          </p>
        </div>

        <button
          type="button"
          className="shareButton"
          disabled={!privateLink}
          onClick={shareGift}
        >
          <span>
            SHARE GIFT
          </span>

          <b>↗</b>
        </button>
      </section>

      <section className="shareCard">
        <p className="smallLabel">
          SEND IT ANYWHERE
        </p>

        <h2>
          YOUR GIFT.
          <br />
          <em>YOUR MOMENT.</em>
        </h2>

        <p className="shareText">
          Send the private link however
          feels right — the experience
          stays the same wherever you
          share it.
        </p>

        <div className="ways">
          <div>
            <span>01</span>
            <strong>TEXT</strong>
          </div>

          <div>
            <span>02</span>
            <strong>iMESSAGE</strong>
          </div>

          <div>
            <span>03</span>
            <strong>WHATSAPP</strong>
          </div>

          <div>
            <span>04</span>
            <strong>DM</strong>
          </div>

          <div>
            <span>05</span>
            <strong>TELEGRAM</strong>
          </div>
        </div>
      </section>

      <section className="messageCard">
        <div>
          <p className="smallLabel">
            NEED SOMETHING TO SAY?
          </p>

          <h2>
            A LITTLE
            <br />
            <em>MESSAGE ♡</em>
          </h2>
        </div>

        <div className="message">
          <p>
            I made a little something
            for you ♡
          </p>

          <span>
            Open it when you have
            a minute.
          </span>

          <div className="realLink">
            {privateLink
              ? "YOUR WIVELI GIFT →"
              : "CREATING YOUR LINK…"}
          </div>
        </div>
      </section>

      <section className="bottom">
        <div>
          <p>
            Want to see what{" "}
            {recipientName} will see?
          </p>

          <span>
            Open the real recipient
            experience before you send it.
          </span>
        </div>

        <button
          type="button"
          disabled={!privateLink}
          onClick={previewGift}
        >
          PREVIEW GIFT
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

          border: none;
          padding: 0;

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
        .shareCard h2 em,
        .messageCard h2 em {
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

        .linkCard,
        .shareCard,
        .messageCard,
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

        .linkCard {
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

          flex: 0 0 auto;

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

          font-size: 11px;
        }

        .linkBox {
          min-height: 82px;

          padding:
            13px
            13px
            13px
            20px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;

          border-radius: 16px;

          background: #570a16;
          color: #f6d2ce;
        }

        .linkText {
          min-width: 0;
        }

        .linkBox small {
          display: block;

          margin-bottom: 7px;

          font-size: 6px;
          font-weight: 800;

          letter-spacing:
            0.17em;

          opacity: 0.6;
        }

        .linkBox span {
          display: block;

          max-width: 540px;

          overflow: hidden;

          text-overflow:
            ellipsis;

          white-space: nowrap;

          font-family:
            Georgia,
            serif;

          font-size: 14px;
        }

        .linkBox button {
          min-width: 165px;
          height: 48px;

          padding:
            0 20px;

          flex: 0 0 auto;

          border:
            1px solid
            rgba(
              246,
              210,
              206,
              0.3
            );

          border-radius: 100px;

          background: #f5d1cc;
          color: #570a16;

          font-size: 7px;
          font-weight: 800;

          letter-spacing:
            0.12em;

          cursor: pointer;
        }

        .linkBox button:disabled {
          opacity: 0.45;

          cursor:
            not-allowed;
        }

        .readyNotice {
          margin-top: 15px;

          padding:
            14px 16px;

          display: flex;

          align-items:
            center;

          gap: 10px;

          border:
            1px dashed
            rgba(
              78,
              9,
              20,
              0.22
            );

          border-radius: 13px;
        }

        .readyNotice span {
          flex: 0 0 auto;

          font-family:
            Georgia,
            serif;

          font-size: 18px;
        }

        .readyNotice p {
          margin: 0;

          font-size: 8px;
          line-height: 1.5;

          opacity: 0.65;
        }

        .shareButton {
          width: 100%;
          height: 57px;

          margin-top: 14px;

          padding:
            0 22px;

          border: none;

          border-radius: 100px;

          background: #570a16;
          color: #f6d2ce;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          font-size: 8px;
          font-weight: 800;

          letter-spacing:
            0.14em;

          cursor: pointer;
        }

        .shareButton b {
          font-size: 18px;
        }

        .shareButton:disabled {
          opacity: 0.4;

          cursor:
            not-allowed;
        }

        .shareCard {
          margin-top: 20px;

          padding: 38px;

          border-radius: 26px;

          background: #570a16;
          color: #f6d2ce;
        }

        .shareCard h2,
        .messageCard h2 {
          margin: 0;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              42px,
              6vw,
              65px
            );

          line-height: 0.83;

          letter-spacing:
            -0.055em;
        }

        .shareText {
          max-width: 430px;

          margin:
            22px 0 30px;

          font-family:
            Georgia,
            serif;

          font-size: 13px;
          line-height: 1.5;
        }

        .ways {
          display: grid;

          grid-template-columns:
            repeat(
              5,
              1fr
            );

          gap: 8px;
        }

        .ways div {
          min-height: 95px;

          padding: 13px;

          display: flex;

          flex-direction:
            column;

          justify-content:
            space-between;

          border:
            1px solid
            rgba(
              246,
              210,
              206,
              0.25
            );

          border-radius: 13px;
        }

        .ways span {
          font-family:
            Georgia,
            serif;

          font-size: 10px;

          opacity: 0.6;
        }

        .ways strong {
          font-size: 7px;

          letter-spacing:
            0.11em;
        }

        .messageCard {
          margin-top: 20px;

          padding: 38px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 40px;

          align-items: center;

          border:
            1px solid
            rgba(
              78,
              9,
              20,
              0.25
            );

          border-radius: 26px;

          background:
            rgba(
              255,
              237,
              232,
              0.45
            );
        }

        .message {
          padding: 26px;

          border-radius: 19px;

          background: #f8dad5;

          box-shadow:
            0 18px 45px
            rgba(
              65,
              4,
              14,
              0.1
            );
        }

        .message p {
          margin:
            0 0 8px;

          font-family:
            Georgia,
            serif;

          font-size: 20px;

          line-height: 1.1;

          font-style: italic;
        }

        .message > span {
          font-family:
            Georgia,
            serif;

          font-size: 11px;
        }

        .realLink {
          margin-top: 22px;

          padding: 13px;

          border-radius: 100px;

          background: #570a16;
          color: #f6d2ce;

          text-align: center;

          font-size: 7px;
          font-weight: 800;

          letter-spacing:
            0.13em;
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

        .bottom span {
          font-size: 8px;

          opacity: 0.6;
        }

        .bottom button {
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

          border-radius: 100px;

          background: #570a16;
          color: #f6d2ce;

          font-size: 8px;
          font-weight: 800;

          letter-spacing:
            0.14em;

          cursor: pointer;
        }

        .bottom button b {
          font-size: 18px;
        }

        .bottom button:disabled {
          opacity: 0.4;

          cursor:
            not-allowed;
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

          .linkCard,
          .shareCard,
          .messageCard,
          .bottom {
            width:
              calc(
                100% - 24px
              );
          }

          .linkCard,
          .shareCard,
          .messageCard {
            padding: 24px;
          }

          .linkBox {
            align-items:
              stretch;

            flex-direction:
              column;
          }

          .linkBox span {
            white-space: normal;

            overflow-wrap:
              anywhere;
          }

          .linkBox button {
            width: 100%;
          }

          .ways {
            grid-template-columns:
              repeat(
                2,
                1fr
              );
          }

          .messageCard {
            grid-template-columns:
              1fr;
          }

          .bottom {
            flex-direction:
              column;

            align-items:
              stretch;
          }

          .bottom button {
            width: 100%;
          }
        }

        @media (
          max-width: 430px
        ) {
          .step {
            display: none;
          }

          .hero h1 {
            font-size: 46px;
          }

          .shareCard h2,
          .messageCard h2 {
            font-size: 42px;
          }
        }
      `}</style>
    </main>
  );
}

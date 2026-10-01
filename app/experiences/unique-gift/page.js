"use client";

import { useState } from "react";

export default function UniqueGiftPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="page">
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header>
        <a href="/" className="logo">
          WI<span>♥</span>ELI
        </a>

        <a href="/#ideas" className="back">
          ← ALL EXPERIENCES
        </a>
      </header>

      <div className="stage">
        {/* LEFT */}
        <section className="hero">
          <div className="badge">✦ WIVELI BESPOKE</div>

          <p className="eyebrow">A GIFT THAT EXISTS ONLY ONCE</p>

          <h1>
            YOUR WISH.
            <br />
            <em>OUR CREATION.</em>
          </h1>

          <p className="lead">
            Tell us about someone special — their story,
            their dreams and the moments that matter.
          </p>

          <p className="description">
            Together with the WIVELI team, create a completely
            individual gift designed for one person and one person only.
            From the first idea to the final surprise, we turn your
            vision into an unforgettable experience.
          </p>

          <div className="actions">
            <a
              className="primary"
              href="/experiences/unique-gift/request"
            >
              FILL OUT A REQUEST
              <span>→</span>
            </a>

            <button
              className="secondary"
              onClick={() => setContactOpen(true)}
            >
              CONTACT WIVELI TEAM
              <span>↗</span>
            </button>
          </div>

          <p className="note">
            No idea has to be fully formed. Tell us what you feel —
            we’ll help with the rest.
          </p>
        </section>

        {/* RIGHT */}
        <aside className="bespokeCard">
          <div className="cardTop">
            <span>06</span>
            <span>WIVELI BESPOKE</span>
          </div>

          <div className="starWrap">
            <div className="star">✦</div>
            <div className="starGlow" />
          </div>

          <div className="cardCopy">
            <p>MADE JUST FOR THEM</p>

            <h2>
              Made for
              <br />
              one person.
            </h2>
          </div>

          <div className="steps">
            <div>
              <span>01</span>
              <p>Tell us about them</p>
            </div>

            <div>
              <span>02</span>
              <p>Share your vision</p>
            </div>

            <div>
              <span>03</span>
              <p>We create it together</p>
            </div>
          </div>
        </aside>
      </div>

      {/* CONTACT MODAL */}
      {contactOpen && (
        <div
          className="overlay"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="contactModal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setContactOpen(false)}
            >
              ×
            </button>

            <p className="modalEyebrow">WIVELI CONCIERGE</p>

            <h2>
              Let’s create
              <br />
              something special.
            </h2>

            <p className="modalText">
              Choose where you’d like to talk with the WIVELI team.
            </p>

            <div className="channels">
              <a
                href="https://t.me/WIVELI_bot"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Telegram</strong>
                <span>OPEN CHAT →</span>
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <strong>WhatsApp</strong>
                <span>COMING NEXT</span>
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <strong>Instagram</strong>
                <span>COMING NEXT</span>
              </a>

              <a href="mailto:hello@wiveli.com">
                <strong>Email</strong>
                <span>WRITE TO US →</span>
              </a>
            </div>

            <p className="modalBottom">
              Or fill out the request and we’ll contact you.
            </p>

            <a
              className="requestLink"
              href="/experiences/unique-gift/request"
            >
              FILL OUT A REQUEST →
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html),
        :global(body) {
          margin: 0;
          background: #0d0b0a;
        }

        .page {
          --gold: #dfb55e;
          --cream: #fff6e5;

          min-height: 100svh;
          height: 100svh;
          overflow: hidden;
          position: relative;

          background:
            radial-gradient(
              circle at 77% 42%,
              rgba(196, 137, 39, 0.15),
              transparent 30%
            ),
            radial-gradient(
              circle at 17% 85%,
              rgba(112, 42, 58, 0.13),
              transparent 35%
            ),
            #0d0b0a;

          color: var(--cream);
          font-family: Arial, sans-serif;
        }

        header {
          height: 74px;
          padding: 0 5vw;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid rgba(223, 181, 94, 0.14);

          position: relative;
          z-index: 10;
        }

        .logo {
          color: #fff8e8;
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .logo span {
          color: var(--gold);
        }

        .back {
          color: rgba(255, 248, 232, 0.65);
          text-decoration: none;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        /* MAIN LAYOUT */

        .stage {
          height: calc(100svh - 74px);

          width: min(1380px, 90vw);
          margin: 0 auto;

          display: grid;
          grid-template-columns:
            minmax(0, 1.45fr)
            minmax(300px, 0.55fr);

          gap: clamp(50px, 7vw, 120px);

          align-items: center;
        }

        /* LEFT */

        .hero {
          min-width: 0;
          max-width: 780px;
        }

        .badge {
          display: inline-flex;
          align-items: center;

          padding: 8px 15px;
          margin-bottom: clamp(18px, 2.2vh, 28px);

          border: 1px solid rgba(223, 181, 94, 0.4);
          border-radius: 100px;

          background: rgba(223, 181, 94, 0.05);

          color: #e9c46e;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.18em;

          box-shadow: 0 0 30px rgba(223, 181, 94, 0.06);
        }

        .eyebrow {
          margin: 0 0 13px;

          color: #cba85d;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.2em;
        }

        h1 {
          margin: 0;

          font-family: Georgia, serif;

          font-size: clamp(56px, 6.2vw, 104px);
          line-height: 0.83;
          letter-spacing: -0.055em;

          font-weight: 400;
        }

        h1 em {
          color: var(--gold);
          font-weight: 400;
        }

        .lead {
          max-width: 570px;

          margin: clamp(18px, 2.7vh, 28px) 0 0;

          font-family: Georgia, serif;
          font-size: clamp(15px, 1.2vw, 18px);
          line-height: 1.45;

          color: #eee2cc;
        }

        .description {
          max-width: 570px;

          margin: 12px 0 0;

          color: rgba(255, 248, 232, 0.46);

          font-size: 11px;
          line-height: 1.65;
        }

        .actions {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-top: clamp(20px, 2.8vh, 28px);
        }

        .primary,
        .secondary {
          height: 48px;

          padding: 0 20px;

          border-radius: 100px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 28px;

          cursor: pointer;
          text-decoration: none;

          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;

          white-space: nowrap;
        }

        .primary {
          min-width: 210px;

          border: 1px solid #e0b45b;

          background: #d9ad54;
          color: #17110a;

          box-shadow:
            0 0 30px rgba(221, 181, 94, 0.16);
        }

        .secondary {
          min-width: 225px;

          border: 1px solid rgba(226, 183, 91, 0.35);

          background: transparent;
          color: #e6c16f;
        }

        .primary:hover,
        .secondary:hover {
          transform: translateY(-2px);
        }

        .note {
          margin: 14px 0 0;

          color: rgba(255, 248, 232, 0.3);

          font-family: Georgia, serif;
          font-size: 10px;
          font-style: italic;
        }

        /* RIGHT CARD */

        .bespokeCard {
          width: 100%;
          max-width: 380px;
          height: min(570px, 68vh);
          min-height: 450px;

          justify-self: end;

          position: relative;

          padding: 28px;

          border: 1px solid rgba(226, 183, 91, 0.28);

          background:
            radial-gradient(
              circle at 50% 34%,
              rgba(230, 184, 88, 0.13),
              transparent 31%
            ),
            rgba(27, 21, 15, 0.55);

          box-shadow:
            0 0 90px rgba(177, 123, 32, 0.08),
            inset 0 0 70px rgba(255, 215, 128, 0.02);

          backdrop-filter: blur(14px);

          display: flex;
          flex-direction: column;
        }

        .cardTop {
          display: flex;
          justify-content: space-between;

          color: #cfa95c;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .starWrap {
          position: relative;

          flex: 1;

          display: grid;
          place-items: center;

          min-height: 100px;
        }

        .star {
          position: relative;
          z-index: 2;

          color: #f4ce7b;

          font-size: clamp(52px, 4vw, 70px);

          text-shadow:
            0 0 16px rgba(255, 214, 122, 0.9),
            0 0 45px rgba(255, 194, 65, 0.5);
        }

        .starGlow {
          width: 100px;
          height: 100px;

          position: absolute;

          border-radius: 50%;

          background: rgba(226, 177, 77, 0.16);

          filter: blur(35px);
        }

        .cardCopy > p {
          margin: 0 0 8px;

          color: #cba85d;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .cardCopy h2 {
          margin: 0;

          font-family: Georgia, serif;

          font-size: clamp(32px, 3vw, 43px);
          line-height: 0.93;

          font-weight: 400;
        }

        .steps {
          margin-top: 25px;

          border-top: 1px solid rgba(226, 183, 91, 0.17);
        }

        .steps > div {
          min-height: 38px;

          display: grid;
          grid-template-columns: 35px 1fr;
          align-items: center;

          border-bottom: 1px solid rgba(226, 183, 91, 0.09);
        }

        .steps span {
          color: #cba85d;

          font-size: 7px;
          font-weight: 900;
        }

        .steps p {
          margin: 0;

          color: rgba(255, 248, 232, 0.62);

          font-family: Georgia, serif;
          font-size: 11px;
        }

        /* BACKGROUND */

        .glow {
          position: absolute;

          border-radius: 50%;

          filter: blur(100px);

          pointer-events: none;
        }

        .glowOne {
          width: 420px;
          height: 420px;

          right: 8%;
          top: 20%;

          background: rgba(199, 142, 43, 0.08);
        }

        .glowTwo {
          width: 350px;
          height: 350px;

          left: 10%;
          bottom: -20%;

          background: rgba(116, 46, 61, 0.13);
        }

        /* MODAL */

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 100;

          display: grid;
          place-items: center;

          padding: 20px;

          background: rgba(5, 4, 3, 0.84);

          backdrop-filter: blur(14px);
        }

        .contactModal {
          position: relative;

          width: min(520px, 100%);

          padding: 40px;

          border: 1px solid rgba(226, 183, 91, 0.3);

          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(220, 175, 81, 0.12),
              transparent 30%
            ),
            #17120d;

          box-shadow:
            0 35px 100px rgba(0, 0, 0, 0.55);
        }

        .close {
          position: absolute;

          top: 14px;
          right: 17px;

          border: 0;

          background: transparent;

          color: #d4b36d;

          cursor: pointer;

          font-size: 26px;
        }

        .modalEyebrow {
          margin: 0 0 12px;

          color: #d4ad5d;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .contactModal h2 {
          margin: 0;

          font-family: Georgia, serif;

          font-size: 44px;
          line-height: 0.94;

          font-weight: 400;
        }

        .modalText {
          margin: 16px 0 23px;

          color: rgba(255, 248, 232, 0.48);

          font-size: 12px;
        }

        .channels {
          display: grid;
          grid-template-columns: 1fr 1fr;

          gap: 8px;
        }

        .channels a {
          min-height: 72px;

          padding: 15px;

          border: 1px solid rgba(226, 183, 91, 0.18);

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          color: #f7ead0;

          text-decoration: none;

          transition: 0.2s ease;
        }

        .channels a:hover {
          border-color: rgba(226, 183, 91, 0.6);

          background: rgba(226, 183, 91, 0.06);
        }

        .channels strong {
          font-family: Georgia, serif;

          font-size: 17px;
          font-weight: 400;
        }

        .channels span {
          color: #c9a252;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .modalBottom {
          margin: 22px 0 8px;

          color: rgba(255, 248, 232, 0.4);

          font-size: 10px;
        }

        .requestLink {
          color: #dfb55e;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;

          text-decoration: none;
        }

        /* SMALLER LAPTOP */

        @media (max-height: 760px) and (min-width: 901px) {
          .stage {
            gap: 55px;
          }

          h1 {
            font-size: clamp(54px, 5.5vw, 82px);
          }

          .badge {
            margin-bottom: 15px;
          }

          .lead {
            margin-top: 18px;
          }

          .description {
            line-height: 1.5;
          }

          .actions {
            margin-top: 18px;
          }

          .bespokeCard {
            height: 520px;
          }
        }

        /* MOBILE */

        @media (max-width: 900px) {
          :global(html),
          :global(body) {
            overflow: auto;
          }

          .page {
            height: auto;
            min-height: 100svh;

            overflow: visible;

            padding-bottom: 40px;
          }

          header {
            height: 64px;
            padding: 0 24px;
          }

          .stage {
            height: auto;

            width: 100%;

            padding: 45px 24px;

            display: block;
          }

          .hero {
            max-width: none;
          }

          h1 {
            font-size: clamp(51px, 14vw, 78px);
          }

          .actions {
            flex-direction: column;
            align-items: stretch;
          }

          .primary,
          .secondary {
            width: 100%;
          }

          .bespokeCard {
            width: 100%;
            max-width: none;
            height: 470px;
            min-height: 0;

            margin-top: 45px;
          }

          .channels {
            grid-template-columns: 1fr;
          }

          .contactModal {
            padding: 34px 24px;
          }

          .contactModal h2 {
            font-size: 38px;
          }
        }
      `}</style>
    </main>
  );
}

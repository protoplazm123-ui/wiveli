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

      <section className="hero">
        <div className="badge">✦ WIVELI BESPOKE</div>

        <p className="eyebrow">A GIFT THAT EXISTS ONLY ONCE</p>

        <h1>
          YOUR WISH.
          <br />
          <em>OUR CREATION.</em>
        </h1>

        <p className="lead">
          Tell us about someone special. Their story, their dreams,
          the moments that matter — and the feeling you want them
          to remember.
        </p>

        <p className="description">
          Together with the WIVELI team, create a completely
          individual gift designed for one person and one person only.
          From the first idea to the final surprise, we help turn your
          vision into an unforgettable experience.
        </p>

        <div className="actions">
          <a className="primary" href="/experiences/unique-gift/request">
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

      <aside className="bespokeCard">
        <span className="number">06</span>

        <div className="star">✦</div>

        <p>WIVELI BESPOKE</p>

        <h2>
          Made for
          <br />
          one person.
        </h2>

        <div className="line" />

        <div className="steps">
          <span>01</span>
          <p>Tell us about them</p>

          <span>02</span>
          <p>Share your vision</p>

          <span>03</span>
          <p>We create it together</p>
        </div>
      </aside>

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
          overflow: hidden;
        }

        .page {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 72% 40%,
              rgba(174, 122, 39, 0.16),
              transparent 28%
            ),
            radial-gradient(
              circle at 30% 90%,
              rgba(110, 47, 60, 0.18),
              transparent 35%
            ),
            #0d0b0a;
          color: #f8f0df;
          font-family: Arial, sans-serif;
        }

        header {
          height: 82px;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(238, 196, 105, 0.13);
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
          color: #e1b65e;
        }

        .back {
          color: rgba(255, 248, 232, 0.7);
          text-decoration: none;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .hero {
          position: absolute;
          left: 7vw;
          top: 50%;
          transform: translateY(-45%);
          width: min(720px, 50vw);
          z-index: 2;
        }

        .badge {
          display: inline-block;
          margin-bottom: 28px;
          padding: 9px 15px;
          border: 1px solid rgba(226, 183, 91, 0.42);
          border-radius: 100px;
          color: #e7bf6b;
          background: rgba(226, 183, 91, 0.06);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.18em;
          box-shadow: 0 0 25px rgba(226, 183, 91, 0.08);
        }

        .eyebrow {
          margin: 0 0 17px;
          color: #cba85d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.2em;
        }

        h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(60px, 6.3vw, 108px);
          line-height: 0.82;
          letter-spacing: -0.055em;
          font-weight: 400;
        }

        h1 em {
          color: #ddb55e;
          font-weight: 400;
        }

        .lead {
          max-width: 590px;
          margin: 30px 0 0;
          font-family: Georgia, serif;
          font-size: 18px;
          line-height: 1.45;
          color: #eee2cc;
        }

        .description {
          max-width: 590px;
          margin: 16px 0 0;
          color: rgba(255, 248, 232, 0.48);
          font-size: 12px;
          line-height: 1.7;
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .primary,
        .secondary {
          min-width: 205px;
          height: 52px;
          padding: 0 22px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          text-decoration: none;
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .primary {
          border: 1px solid #e0b45b;
          background: #d7aa50;
          color: #17110a;
          box-shadow: 0 0 35px rgba(221, 181, 94, 0.18);
        }

        .secondary {
          border: 1px solid rgba(226, 183, 91, 0.35);
          background: transparent;
          color: #e6c16f;
        }

        .note {
          margin: 17px 0 0;
          color: rgba(255, 248, 232, 0.32);
          font-family: Georgia, serif;
          font-size: 11px;
          font-style: italic;
        }

        .bespokeCard {
          position: absolute;
          right: 7vw;
          top: 50%;
          transform: translateY(-45%);
          width: min(390px, 30vw);
          min-height: 540px;
          padding: 34px;
          border: 1px solid rgba(226, 183, 91, 0.27);
          background:
            radial-gradient(
              circle at 50% 32%,
              rgba(230, 184, 88, 0.14),
              transparent 30%
            ),
            rgba(30, 23, 15, 0.62);
          box-shadow:
            0 0 80px rgba(177, 123, 32, 0.08),
            inset 0 0 70px rgba(255, 215, 128, 0.025);
          backdrop-filter: blur(14px);
        }

        .number {
          color: #cfa95c;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .star {
          margin: 72px 0 50px;
          text-align: center;
          color: #f0ca78;
          font-size: 65px;
          text-shadow:
            0 0 18px rgba(255, 214, 122, 0.8),
            0 0 60px rgba(255, 194, 65, 0.4);
        }

        .bespokeCard > p {
          margin: 0 0 8px;
          color: #cba85d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
        }

        .bespokeCard h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 40px;
          line-height: 0.95;
          font-weight: 400;
        }

        .line {
          height: 1px;
          margin: 30px 0 20px;
          background: rgba(226, 183, 91, 0.17);
        }

        .steps {
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 10px 12px;
          align-items: center;
        }

        .steps span {
          color: #cba85d;
          font-size: 8px;
          font-weight: 900;
        }

        .steps p {
          margin: 0;
          color: rgba(255, 248, 232, 0.62);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .glowOne {
          width: 400px;
          height: 400px;
          right: 9%;
          top: 25%;
          background: rgba(199, 142, 43, 0.08);
        }

        .glowTwo {
          width: 330px;
          height: 330px;
          left: 20%;
          bottom: -15%;
          background: rgba(116, 46, 61, 0.13);
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(5, 4, 3, 0.82);
          backdrop-filter: blur(14px);
        }

        .contactModal {
          position: relative;
          width: min(520px, 100%);
          padding: 42px;
          border: 1px solid rgba(226, 183, 91, 0.3);
          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(220, 175, 81, 0.12),
              transparent 30%
            ),
            #17120d;
          box-shadow: 0 35px 100px rgba(0, 0, 0, 0.5);
        }

        .close {
          position: absolute;
          top: 16px;
          right: 18px;
          border: 0;
          background: transparent;
          color: #d4b36d;
          cursor: pointer;
          font-size: 26px;
        }

        .modalEyebrow {
          margin: 0 0 13px;
          color: #d4ad5d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .contactModal h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 45px;
          line-height: 0.94;
          font-weight: 400;
        }

        .modalText {
          margin: 17px 0 24px;
          color: rgba(255, 248, 232, 0.48);
          font-size: 12px;
        }

        .channels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .channels a {
          min-height: 74px;
          padding: 16px;
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
          margin: 23px 0 8px;
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

        @media (max-width: 900px) {
          :global(html),
          :global(body) {
            overflow: auto;
          }

          .page {
            min-height: 100svh;
            padding-bottom: 50px;
          }

          .hero {
            position: relative;
            left: auto;
            top: auto;
            transform: none;
            width: auto;
            padding: 55px 25px 30px;
          }

          h1 {
            font-size: clamp(52px, 15vw, 80px);
          }

          .actions {
            flex-direction: column;
          }

          .bespokeCard {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            width: auto;
            min-height: 430px;
            margin: 0 25px;
          }
        }
      `}</style>
    </main>
  );
}

"use client";

export default function SendMyself({
  recipientName = "them",
  onBack,
  onPreview,
}) {
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
          We'll create a private link
          for {recipientName}'s gift.
          <br />
          You choose when and where to send it.
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
          <div>
            <small>
              PRIVATE LINK
            </small>

            <span>
              wiveli.com/gift/••••••••
            </span>
          </div>

          <button
            type="button"
            disabled
          >
            COPY LINK
          </button>
        </div>

        <div className="comingSoon">
          <span>♡</span>

          <p>
            Your real private link will
            be generated when cloud gift
            storage is connected.
          </p>
        </div>
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
          Once your private link is ready,
          you can send it however feels right.
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

          <div className="fakeLink">
            YOUR WIVELI LINK →
          </div>
        </div>
      </section>

      <section className="bottom">
        <div>
          <p>
            Want to see what
            {recipientName} will see?
          </p>

          <span>
            Preview the recipient experience
            on this device.
          </span>
        </div>

        <button
          type="button"
          onClick={onPreview}
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
          grid-template-columns: 1fr auto 1fr;
          align-items: center;

          border-bottom:
            1px solid rgba(78, 9, 20, 0.16);
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
          font-family: Georgia, serif;
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
          padding: 70px 20px 55px;
          text-align: center;
        }

        .heart {
          width: 48px;
          height: 48px;

          margin: 0 auto 27px;

          display: grid;
          place-items: center;

          border: 1px solid rgba(78, 9, 20, 0.25);
          border-radius: 50%;

          font-family: Georgia, serif;
          font-size: 23px;
        }

        .eyebrow,
        .smallLabel {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.19em;
        }

        .eyebrow {
          margin: 0 0 17px;
        }

        .hero h1 {
          margin: 0;

          font-family: Georgia, serif;

          font-size:
            clamp(
              58px,
              8vw,
              105px
            );

          line-height: 0.8;
          letter-spacing: -0.06em;
        }

        .hero h1 em,
        .shareCard h2 em,
        .messageCard h2 em {
          font-weight: 400;
        }

        .description {
          margin: 27px 0 0;

          font-family: Georgia, serif;
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
              calc(100% - 40px)
            );

          margin-left: auto;
          margin-right: auto;
        }

        .linkCard {
          padding: 35px;

          border: 1px solid rgba(78, 9, 20, 0.27);
          border-radius: 26px;

          background: rgba(255, 237, 232, 0.5);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 30px;

          margin-bottom: 30px;
        }

        .smallLabel {
          margin: 0 0 10px;
        }

        .cardTop h2 {
          margin: 0;

          font-family: Georgia, serif;

          font-size:
            clamp(
              31px,
              4vw,
              45px
            );

          line-height: 0.95;
          letter-spacing: -0.035em;
        }

        .number {
          width: 42px;
          height: 42px;

          flex: 0 0 auto;

          display: grid;
          place-items: center;

          border: 1px solid rgba(78, 9, 20, 0.25);
          border-radius: 50%;

          font-family: Georgia, serif;
          font-size: 11px;
        }

        .linkBox {
          min-height: 82px;
          padding: 13px 13px 13px 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          border-radius: 16px;

          background: #570a16;
          color: #f6d2ce;
        }

        .linkBox small {
          display: block;

          margin-bottom: 7px;

          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.17em;

          opacity: 0.6;
        }

        .linkBox span {
          font-family: Georgia, serif;
          font-size: 15px;
        }

        .linkBox button {
          height: 48px;
          padding: 0 20px;

          flex: 0 0 auto;

          border: 1px solid rgba(246, 210, 206, 0.3);
          border-radius: 100px;

          background: #f5d1cc;
          color: #570a16;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .linkBox button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .comingSoon {
          margin-top: 15px;
          padding: 14px 16px;

          display: flex;
          align-items: center;
          gap: 10px;

          border: 1px dashed rgba(78, 9, 20, 0.22);
          border-radius: 13px;
        }

        .comingSoon span {
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .comingSoon p {
          margin: 0;

          font-size: 8px;
          line-height: 1.5;

          opacity: 0.65;
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

          font-family: Georgia, serif;

          font-size:
            clamp(
              42px,
              6vw,
              65px
            );

          line-height: 0.83;
          letter-spacing: -0.055em;
        }

        .shareText {
          max-width: 430px;

          margin: 22px 0 30px;

          font-family: Georgia, serif;
          font-size: 13px;
          line-height: 1.5;
        }

        .ways {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .ways div {
          min-height: 95px;
          padding: 13px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          border: 1px solid rgba(246, 210, 206, 0.25);
          border-radius: 13px;
        }

        .ways span {
          font-family: Georgia, serif;
          font-size: 10px;
          opacity: 0.6;
        }

        .ways strong {
          font-size: 7px;
          letter-spacing: 0.11em;
        }

        .messageCard {
          margin-top: 20px;
          padding: 38px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;

          border: 1px solid rgba(78, 9, 20, 0.25);
          border-radius: 26px;

          background: rgba(255, 237, 232, 0.45);
        }

        .message {
          padding: 26px;

          border-radius: 19px;

          background: #f8dad5;

          box-shadow:
            0 18px 45px rgba(65, 4, 14, 0.1);
        }

        .message p {
          margin: 0 0 8px;

          font-family: Georgia, serif;
          font-size: 20px;
          line-height: 1.1;
          font-style: italic;
        }

        .message > span {
          font-family: Georgia, serif;
          font-size: 11px;
        }

        .fakeLink {
          margin-top: 22px;
          padding: 13px;

          border-radius: 100px;

          background: #570a16;
          color: #f6d2ce;

          text-align: center;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .bottom {
          margin-top: 20px;
          padding: 22px 26px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;

          border: 1px solid rgba(78, 9, 20, 0.22);
          border-radius: 20px;

          background: rgba(255, 237, 232, 0.45);
        }

        .bottom p {
          margin: 0 0 5px;

          font-family: Georgia, serif;
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
          padding: 0 20px;

          flex: 0 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border: none;
          border-radius: 100px;

          background: #570a16;
          color: #f6d2ce;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.14em;

          cursor: pointer;
        }

        .bottom button b {
          font-size: 18px;
        }

        @media (max-width: 700px) {
          .topbar {
            padding: 0 17px;
          }

          .hero {
            padding: 52px 17px 42px;
          }

          .hero h1 {
            font-size: 52px;
          }

          .linkCard,
          .shareCard,
          .messageCard,
          .bottom {
            width: calc(100% - 24px);
          }

          .linkCard,
          .shareCard,
          .messageCard {
            padding: 24px;
          }

          .linkBox {
            align-items: stretch;
            flex-direction: column;
          }

          .linkBox button {
            width: 100%;
          }

          .ways {
            grid-template-columns: repeat(2, 1fr);
          }

          .messageCard {
            grid-template-columns: 1fr;
          }

          .bottom {
            flex-direction: column;
            align-items: stretch;
          }

          .bottom button {
            width: 100%;
          }
        }

        @media (max-width: 430px) {
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

"use client";

export default function RedemptionResult({
  coupon,
  redemption,
  senderName,
  onBack,
}) {
  if (!coupon || !redemption) return null;

  return (
    <main className="page">
      <div className="decor heartOne">♡</div>
      <div className="decor heartTwo">♥</div>
      <div className="decor star">✦</div>

      <header>
        <span className="logo">WI♡ELI</span>
        <span className="headerText">LOVE COUPONS</span>
      </header>

      <section className="content">
        <div className="successIcon">
          <span>♥</span>
        </div>

        <p className="eyebrow">COUPON REDEEMED</p>

        <h1>
          IT'S
          <br />
          <em>OFFICIAL.</em>
        </h1>

        <p className="intro">
          This little promise has officially
          <br />
          been claimed ♡
        </p>

        <div className="ticket">
          <div className="ticketMain">
            <div className="ticketTop">
              <span>WI♡ELI</span>
              <span>LOVE COUPON</span>
            </div>

            <div className="ticketHeart">♡</div>

            <h2>{coupon.title}</h2>

            <p>{coupon.subtitle}</p>

            <div className="redeemedStamp">
              REDEEMED
            </div>

            <div className="ticketBottom">
              <span>A LITTLE PROMISE</span>
              <span>WITH LOVE ♡</span>
            </div>
          </div>

          <div className="stub">
            <small>CODE</small>

            <div className="verticalCode">
              {redemption.code}
            </div>

            <span>♥</span>
          </div>
        </div>

        <div className="codeCard">
          <small>YOUR REDEMPTION CODE</small>

          <strong>{redemption.code}</strong>

          <p>
            Keep this code — it belongs to this
            coupon only.
          </p>
        </div>

        <div className="notification">
          <div className="notificationHeart">
            ♡
          </div>

          <div>
            <small>NEXT STEP</small>

            <strong>
              Tell {senderName || "your person"} ♡
            </strong>

            <p>
              Automatic notifications will be
              connected later.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="back"
          onClick={onBack}
        >
          BACK TO MY COUPONS
          <span>→</span>
        </button>

        <p className="footerNote">
          ONE PROMISE USED · MANY MORE MEMORIES TO MAKE
        </p>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 10%,
              #f8dfdb 0%,
              #efc7c4 48%,
              #dfaead 100%
            );
          color: #520914;
        }

        header {
          height: 76px;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom:
            1px solid rgba(82, 9, 20, 0.14);
          position: relative;
          z-index: 2;
        }

        .logo {
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .headerText {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .content {
          width: min(650px, calc(100% - 32px));
          margin: 0 auto;
          padding: 65px 0 80px;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .successIcon {
          width: 54px;
          height: 54px;
          margin: 0 auto 27px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #570a16;
          color: #f2c8c5;
          box-shadow:
            0 15px 35px
            rgba(75, 6, 16, 0.18);
        }

        .successIcon span {
          font-size: 18px;
        }

        .eyebrow {
          margin: 0 0 18px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.23em;
        }

        h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(68px, 10vw, 105px);
          line-height: 0.76;
          letter-spacing: -0.07em;
        }

        h1 em {
          font-weight: 400;
        }

        .intro {
          margin: 28px 0 38px;
          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.55;
        }

        .ticket {
          width: 100%;
          min-height: 265px;
          display: grid;
          grid-template-columns: 1fr 95px;
          background: #f6d4d0;
          border: 1px solid #65101c;
          color: #570a16;
          text-align: left;
          box-shadow:
            0 25px 55px
            rgba(70, 7, 16, 0.15);
          transform: rotate(-1deg);
        }

        .ticketMain {
          position: relative;
          padding: 29px 30px;
          overflow: hidden;
        }

        .ticketTop {
          display: flex;
          justify-content: space-between;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .ticketHeart {
          position: absolute;
          right: 29px;
          top: 58px;
          font-family: Georgia, serif;
          font-size: 37px;
        }

        .ticket h2 {
          max-width: 78%;
          margin: 51px 0 8px;
          font-family: Georgia, serif;
          font-size: clamp(32px, 6vw, 47px);
          font-style: italic;
          line-height: 0.88;
          letter-spacing: -0.045em;
        }

        .ticketMain > p {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .redeemedStamp {
          position: absolute;
          right: 20px;
          bottom: 43px;
          padding: 7px 13px;
          border: 2px solid #68111d;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          transform: rotate(-8deg);
          opacity: 0.78;
        }

        .ticketBottom {
          position: absolute;
          left: 30px;
          right: 30px;
          bottom: 21px;
          display: flex;
          justify-content: space-between;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .stub {
          border-left: 1px dashed #68111d;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          padding: 22px 0;
          position: relative;
        }

        .stub::before,
        .stub::after {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          left: -10px;
          background: #edc4c1;
        }

        .stub::before {
          top: -10px;
        }

        .stub::after {
          bottom: -10px;
        }

        .stub small {
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.17em;
        }

        .verticalCode {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-family: Georgia, serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .stub > span {
          font-size: 21px;
        }

        .codeCard {
          margin-top: 28px;
          padding: 26px 20px;
          border:
            1px solid rgba(82, 9, 20, 0.2);
          background:
            rgba(255, 240, 237, 0.38);
          backdrop-filter: blur(10px);
        }

        .codeCard small {
          display: block;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.19em;
        }

        .codeCard strong {
          display: block;
          margin-top: 8px;
          font-family: Georgia, serif;
          font-size: 37px;
          letter-spacing: 0.03em;
        }

        .codeCard p {
          margin: 8px 0 0;
          font-family: Georgia, serif;
          font-size: 11px;
          opacity: 0.7;
        }

        .notification {
          margin: 16px 0 25px;
          padding: 19px 22px;
          border:
            1px solid rgba(82, 9, 20, 0.16);
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
        }

        .notificationHeart {
          flex: 0 0 auto;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #570a16;
          color: #f2c8c5;
          font-family: Georgia, serif;
          font-size: 19px;
        }

        .notification small {
          display: block;
          margin-bottom: 4px;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .notification strong {
          display: block;
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .notification p {
          margin: 3px 0 0;
          font-size: 9px;
          opacity: 0.65;
        }

        .back {
          width: min(370px, 100%);
          height: 58px;
          border: none;
          border-radius: 100px;
          background: #570a16;
          color: #f4cfcb;
          padding: 0 24px;
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.12em;
          cursor: pointer;
        }

        .back span {
          font-size: 18px;
        }

        .footerNote {
          margin: 28px 0 0;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.18em;
          opacity: 0.55;
        }

        .decor {
          position: absolute;
          pointer-events: none;
          color: rgba(82, 9, 20, 0.1);
          font-family: Georgia, serif;
        }

        .heartOne {
          left: 5%;
          top: 22%;
          font-size: 100px;
          transform: rotate(-15deg);
        }

        .heartTwo {
          right: 7%;
          top: 38%;
          font-size: 55px;
          transform: rotate(14deg);
        }

        .star {
          right: 13%;
          bottom: 9%;
          font-size: 65px;
        }

        @media (max-width: 600px) {
          header {
            padding: 0 19px;
          }

          .content {
            padding-top: 50px;
          }

          h1 {
            font-size: 67px;
          }

          .ticket {
            min-height: 235px;
            grid-template-columns: 1fr 66px;
          }

          .ticketMain {
            padding: 23px 19px;
          }

          .ticket h2 {
            margin-top: 45px;
            font-size: 34px;
          }

          .ticketHeart {
            right: 18px;
          }

          .ticketBottom {
            left: 19px;
            right: 19px;
          }

          .ticketBottom span:last-child {
            display: none;
          }

          .redeemedStamp {
            right: 13px;
            bottom: 42px;
            font-size: 8px;
          }

          .codeCard strong {
            font-size: 31px;
          }

          .decor {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

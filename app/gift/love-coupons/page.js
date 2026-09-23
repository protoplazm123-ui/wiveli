"use client";
import TicketPrinter from "./TicketPrinter";
import { couponIdeas } from "../../experiences/love-coupons/coupons";
import { useEffect, useState } from "react";
import { loadLoveCouponsGift } from "../../experiences/love-coupons/storage";

export default function LoveCouponsGift() {
  const [gift, setGift] = useState(null);
  const [ready, setReady] = useState(false);
const [screen, setScreen] = useState("intro");
  useEffect(() => {
    setGift(loadLoveCouponsGift());
    setReady(true);
  }, []);
const selectedCoupons = couponIdeas.filter((coupon) =>
  gift.couponIds.includes(coupon.id)
);

if (screen === "printer") {
  return (
    <TicketPrinter
      coupons={selectedCoupons}
      senderName={gift.senderName}
      recipientName={gift.recipientName}
      onFinished={() => setScreen("collection")}
    />
  );
}

if (screen === "collection") {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f3cbc8",
        color: "#4d0711",
        fontFamily: "Georgia, serif",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: "18px" }}>WI♡ELI</div>
        <h1 style={{ fontSize: "52px", marginBottom: "10px" }}>
          Your Love Coupons ♡
        </h1>
        <p>{selectedCoupons.length} coupons are waiting for you.</p>
      </div>
    </main>
  );
}
  if (!ready) {
    return null;
  }

  if (!gift) {
    return (
      <main className="empty">
        <span>WI♡ELI</span>
        <h1>This gift isn't here yet ♡</h1>

        <style jsx>{`
          .empty {
            min-height: 100vh;
            display: grid;
            place-content: center;
            text-align: center;
            background: #f3cbc8;
            color: #4c0710;
            font-family: Georgia, serif;
          }

          .empty span {
            font-size: 18px;
            letter-spacing: 0.15em;
          }

          .empty h1 {
            font-size: 42px;
            font-weight: 400;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="gift">
      <div className="grain" />

      <header>
        <span className="logo">WI♡ELI</span>
        <span className="tiny">LOVE COUPONS</span>
      </header>

      <section className="intro">
        <div className="heart">♡</div>

        <p className="eyebrow">
          A LITTLE SOMETHING FROM
        </p>

        <h1>
          {gift.senderName}
          <br />
          <em>for {gift.recipientName}</em>
        </h1>

        <p className="message">
          Someone thought about you today.
          <br />
          There's a little gift waiting inside.
        </p>

       <button
  type="button"
  onClick={() => setScreen("printer")}
>
  OPEN YOUR GIFT
  <span>→</span>
</button>

        <div className="mini">
          <span>♡</span>
          MADE WITH LOVE
        </div>
      </section>

      <div className="floating one">♡</div>
      <div className="floating two">♥</div>
      <div className="floating three">♡</div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .gift {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 20%,
              #7b1c29 0%,
              #4d0711 42%,
              #30040b 100%
            );
          color: #f7d8d3;
        }

        .grain {
          position: absolute;
          inset: 0;
          opacity: 0.13;
          pointer-events: none;
          background-image:
            repeating-radial-gradient(
              circle at 20% 30%,
              rgba(255,255,255,.3) 0 1px,
              transparent 1px 4px
            );
          mix-blend-mode: soft-light;
        }

        header {
          position: relative;
          z-index: 2;
          height: 76px;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom:
            1px solid rgba(247, 216, 211, 0.14);
        }

        .logo {
          font-family: Georgia, serif;
          font-weight: 700;
          font-size: 21px;
          letter-spacing: 0.06em;
        }

        .tiny {
          font-size: 9px;
          letter-spacing: 0.2em;
        }

        .intro {
          min-height: calc(100svh - 76px);
          padding: 50px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .heart {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(247, 216, 211, 0.35);
          border-radius: 50%;
          margin-bottom: 34px;
          font-size: 24px;
        }

        .eyebrow {
          margin: 0 0 16px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
        }

        h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(54px, 8vw, 104px);
          line-height: 0.9;
          letter-spacing: -0.055em;
          font-weight: 700;
        }

        h1 em {
          font-weight: 400;
        }

        .message {
          margin: 31px 0 34px;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(247, 216, 211, 0.8);
        }

        button {
          width: min(310px, 85vw);
          height: 58px;
          border: none;
          border-radius: 100px;
          padding: 0 23px;
          background: #f6d5d0;
          color: #4d0711;
          font-weight: 800;
          letter-spacing: 0.07em;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          box-shadow:
            0 18px 50px rgba(15, 0, 3, 0.25);
        }

        button span {
          font-size: 20px;
        }

        .mini {
          margin-top: 55px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-size: 7px;
          letter-spacing: 0.2em;
          opacity: 0.65;
        }

        .mini span {
          font-size: 13px;
        }

        .floating {
          position: absolute;
          font-family: Georgia, serif;
          color: rgba(247, 216, 211, 0.13);
          pointer-events: none;
        }

        .one {
          left: 8%;
          top: 27%;
          font-size: 80px;
          transform: rotate(-15deg);
        }

        .two {
          right: 9%;
          bottom: 17%;
          font-size: 55px;
          transform: rotate(12deg);
        }

        .three {
          right: 17%;
          top: 20%;
          font-size: 30px;
        }

        @media (max-width: 600px) {
          header {
            padding: 0 20px;
          }

          h1 {
            font-size: 58px;
          }

          .floating.one {
            left: -15px;
          }

          .floating.two {
            right: -8px;
          }
        }
      `}</style>
    </main>
  );
}

"use client";

import { useState } from "react";

export default function LoveCouponTicket({
  number = "01",
  title = "BREAKFAST IN BED",
  description = "Wake up happier.",
  message = "",
  selected = false,
  onSelect,
  onEdit,
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="couponWrap">
      <div
        className="couponScene"
        onClick={() => setFlipped((v) => !v)}
      >
        <div className={`coupon3d ${flipped ? "flipped" : ""}`}>
          
          {/* FRONT */}
          <article className="couponFace couponFront">
            <div className="couponBody">
              <div className="couponTop">
                <strong>WI♡ELI</strong>
                <i />
                <span>LOVE COUPON ✦</span>
              </div>

              <div className="couponInner">
                <small>A LITTLE PROMISE FOR YOU</small>
                <h3>{title}</h3>
                <p>{description}</p>

                {message && (
                  <div className="couponMessage">
                    “{message}”
                  </div>
                )}
              </div>

              <span className="flipHint">CLICK TO FLIP ↻</span>
            </div>

            <CouponStub number={number} />
          </article>

          {/* BACK */}
          <article className="couponFace couponBack">
            <div className="couponBody backBody">
              <div className="couponTop">
                <strong>WI♡ELI</strong>
                <i />
                <span>MADE WITH LOVE ✦</span>
              </div>

              <div className="backContent">
                <small>LOVE COUPON · {number}</small>

                <div className="bigHeart">♡</div>

                <h3>{title}</h3>
                <p>{description}</p>

                {message && (
                  <div className="backMessage">{message}</div>
                )}

                <span className="flipHint">
                  CLICK TO TURN OVER ↻
                </span>
              </div>
            </div>

            <CouponStub number={number} />
          </article>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="couponControls">
        <button
          type="button"
          className={selected ? "selected" : ""}
          onClick={onSelect}
        >
          {selected ? "✓ SELECTED" : "+ ADD COUPON"}
        </button>

        <button type="button" onClick={onEdit}>
          EDIT ♡
        </button>
      </div>

      <style jsx>{`
        .couponWrap {
          width: 100%;
        }

        .couponScene {
          width: 100%;
          aspect-ratio: 2.55 / 1;
          perspective: 1400px;
          cursor: pointer;
          transition:
            transform 0.3s ease,
            filter 0.3s ease;
        }

        .couponScene:hover {
          transform: translateY(-7px) rotate(-0.6deg);
          filter: drop-shadow(
            0 18px 20px rgba(91, 9, 24, 0.16)
          );
        }

        .coupon3d {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.65s
            cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .coupon3d.flipped {
          transform: rotateY(180deg);
        }

        .couponFace {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 21%;
          overflow: hidden;
          border-radius: 14px;
          color: #68101e;
          background:
            radial-gradient(
              circle at 30% 15%,
              rgba(255,255,255,.5),
              transparent 32%
            ),
            linear-gradient(135deg, #f8ded9, #efc5c2);

          box-shadow:
            inset 0 0 0 2px #741020,
            inset 0 0 0 7px #f4d2ce,
            inset 0 0 0 8px rgba(116,16,32,.55);

          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .couponFace::before,
        .couponFace::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 24px;
          height: 24px;
          margin-top: -12px;
          border-radius: 50%;
          background: #f2cfca;
          z-index: 10;
        }

        .couponFace::before {
          left: -12px;
        }

        .couponFace::after {
          right: -12px;
        }

        .couponBack {
          transform: rotateY(180deg);
        }

        .couponBody {
          position: relative;
          min-width: 0;
          padding: 19px 21px;
        }

        .couponTop {
          height: 22px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .couponTop strong {
          font-family: Georgia, serif;
          font-size: 17px;
          white-space: nowrap;
        }

        .couponTop i {
          flex: 1;
          height: 1px;
          background: rgba(104,16,30,.5);
        }

        .couponTop span {
          font-family: Arial, sans-serif;
          font-size: 6px;
          font-weight: 700;
          letter-spacing: .16em;
          white-space: nowrap;
        }

        .couponInner {
          position: absolute;
          left: 21px;
          right: 21px;
          top: 51px;
          bottom: 20px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          padding: 15px 18px;

          border: 1px dashed rgba(104,16,30,.52);
          border-radius: 11px;
        }

        .couponInner small,
        .backContent small {
          font-family: Arial, sans-serif;
          font-size: 5px;
          font-weight: 700;
          letter-spacing: .2em;
        }

        .couponInner h3,
        .backContent h3 {
          margin: 6px 0 4px;
          font-family: Georgia, serif;
          font-size: clamp(17px, 2.1vw, 27px);
          line-height: .95;
          font-weight: 500;
          text-transform: uppercase;
        }

        .couponInner p,
        .backContent p {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 9px;
          font-style: italic;
        }

        .couponMessage {
          margin-top: 8px;
          font-family: Georgia, serif;
          font-size: 8px;
          opacity: .75;
        }

        .flipHint {
          position: absolute;
          left: 50%;
          bottom: 6px;
          transform: translateX(-50%);
          white-space: nowrap;

          font-family: Arial, sans-serif;
          font-size: 5px;
          font-weight: 700;
          letter-spacing: .14em;
          opacity: .42;
        }

        .couponStub {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;

          border-left: 1px dashed #741020;
        }

        .couponStub::before,
        .couponStub::after {
          content: "";
          position: absolute;
          left: -8px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #f2cfca;
        }

        .couponStub::before {
          top: -8px;
        }

        .couponStub::after {
          bottom: -8px;
        }

        .stubSpark {
          font-size: 10px;
        }

        .stubHeart {
          font-size: 26px;
          line-height: 1;
        }

        .stubNumber {
          font-family: Georgia, serif;
          font-size: 10px;
        }

        .barcode {
          width: 32px;
          height: 39px;

          background: repeating-linear-gradient(
            90deg,
            #68101e 0 1px,
            transparent 1px 3px,
            #68101e 3px 5px,
            transparent 5px 7px
          );
        }

        .stubLogo {
          font-family: Arial, sans-serif;
          font-size: 5px;
          font-weight: 700;
          letter-spacing: .18em;
        }

        .backBody {
          position: relative;
        }

        .backContent {
          position: absolute;
          inset: 48px 25px 18px;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          text-align: center;
          border: 1px dashed rgba(104,16,30,.5);
          border-radius: 11px;
        }

        .bigHeart {
          margin: 2px 0;
          font-size: 22px;
        }

        .backMessage {
          margin-top: 7px;
          max-width: 85%;
          font-size: 8px;
          font-style: italic;
        }

        .couponControls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 9px;
        }

        .couponControls button {
          height: 36px;
          border: 1px solid #741020;
          border-radius: 100px;
          background: transparent;
          color: #741020;

          cursor: pointer;

          font-family: Arial, sans-serif;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: .11em;

          transition: .2s ease;
        }

        .couponControls button:hover,
        .couponControls button.selected {
          color: #f9ddd8;
          background: #741020;
        }

        @media (max-width: 600px) {
          .couponScene {
            aspect-ratio: 2.05 / 1;
          }

          .couponFace {
            grid-template-columns: 1fr 23%;
          }

          .couponBody {
            padding: 13px 15px;
          }

          .couponTop strong {
            font-size: 12px;
          }

          .couponTop span {
            font-size: 4px;
          }

          .couponInner {
            left: 15px;
            right: 15px;
            top: 40px;
            bottom: 14px;
            padding: 10px 12px;
          }

          .couponInner h3,
          .backContent h3 {
            font-size: 15px;
          }

          .couponInner p,
          .backContent p {
            font-size: 7px;
          }

          .backContent {
            inset: 39px 17px 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .coupon3d,
          .couponScene {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function CouponStub({ number }) {
  return (
    <aside className="couponStub">
      <span className="stubSpark">✦</span>
      <span className="stubHeart">♡</span>

      <span className="stubNumber">
        No. {number}
      </span>

      <div className="barcode" />

      <span className="stubLogo">
        WI♡ELI
      </span>
    </aside>
  );
}

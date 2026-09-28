"use client";

import { useState } from "react";

export default function LoveCouponTicket({
  number = "01",
  title = "BREAKFAST IN BED",
  description = "Wake up happier.",
  message = "",
  onEdit,
  selected = false,
  onSelect,
  compact = false,
}) {
  const [flipped, setFlipped] = useState(false);

  const flip = () => setFlipped((v) => !v);

  return (
    <div
      className={`lcTicketScene ${compact ? "isCompact" : ""}`}
      onClick={flip}
    >
      <div className={`lcTicket ${flipped ? "isFlipped" : ""}`}>

        {/* ================= FRONT ================= */}
        <div className="lcFace lcFront">

          <TicketShape />

          <div className="lcMain">
            <div className="lcTop">
              <span className="lcLogo">WI♡ELI</span>
              <span className="lcRule" />
              <span className="lcType">LOVE COUPON ✦</span>
            </div>

            <div className="lcContent">
              <span className="lcTiny">A LITTLE PROMISE FOR YOU</span>

              <h3>{title}</h3>

              <p>{description}</p>

              {message && (
                <div className="lcMessage">
                  “{message}”
                </div>
              )}
            </div>

            <div className="lcActions" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={onEdit}>
                <b>✎</b>
                <span>EDIT</span>
              </button>

              <button type="button" onClick={onEdit}>
                <b>▧</b>
                <span>PHOTO</span>
              </button>

              <button type="button" onClick={onEdit}>
                <b>▷</b>
                <span>VIDEO</span>
              </button>

              <button type="button" onClick={onEdit}>
                <b>♬</b>
                <span>VOICE</span>
              </button>

              <button type="button" onClick={onEdit}>
                <b>♡</b>
                <span>GIFT</span>
              </button>
            </div>
          </div>

          <TicketStub number={number} />

        </div>


        {/* ================= BACK ================= */}
        <div className="lcFace lcBack">

          <TicketShape />

          <div className="lcMain lcBackMain">

            <div className="lcTop">
              <span className="lcLogo">WI♡ELI</span>
              <span className="lcRule" />
              <span className="lcType">
                MADE FOR SOMEONE SPECIAL ✦
              </span>
            </div>

            <div className="lcBackContent">
              <span className="lcTiny">
                LOVE COUPON · {number}
              </span>

              <h3>{title}</h3>

              <div className="lcHeart">♡</div>

              <p>{description}</p>

              {message && (
                <div className="lcBackMessage">
                  {message}
                </div>
              )}

              <span className="lcFlipHint">
                TAP TO TURN OVER ↻
              </span>
            </div>

          </div>

          <TicketStub number={number} back />

        </div>
      </div>

      {onSelect && (
        <button
          type="button"
          className={`lcSelect ${selected ? "selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {selected ? "✓ SELECTED" : "+ ADD COUPON"}
        </button>
      )}

      <style jsx>{`
        .lcTicketScene {
          width: 100%;
          max-width: 760px;
          aspect-ratio: 2.65 / 1;
          perspective: 1600px;
          position: relative;
          cursor: pointer;
          transition: transform .28s ease, filter .28s ease;
        }

        .lcTicketScene:hover {
          transform: translateY(-8px) rotate(-0.7deg);
          filter: drop-shadow(0 18px 22px rgba(92, 15, 27, .16));
        }

        .lcTicket {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform .7s cubic-bezier(.2,.8,.2,1);
        }

        .lcTicket.isFlipped {
          transform: rotateY(180deg);
        }

        .lcFace {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 19%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          color: #72111f;
          border-radius: 18px;
          overflow: hidden;
          isolation: isolate;
        }

        .lcFront {
          background:
            radial-gradient(circle at 25% 20%, rgba(255,255,255,.55), transparent 35%),
            linear-gradient(135deg,#f8d9d5,#f3c9c6);
        }

        .lcBack {
          transform: rotateY(180deg);
          background:
            radial-gradient(circle at 70% 25%, rgba(255,255,255,.5), transparent 35%),
            linear-gradient(135deg,#f7d7d3,#efc3c0);
        }

        .lcFace:before {
          content: "";
          position: absolute;
          inset: 7px;
          border: 2px solid #7b1422;
          border-radius: 14px;
          pointer-events: none;
          z-index: 5;
        }

        .lcFace:after {
          content: "";
          position: absolute;
          inset: 13px;
          border: 1px solid rgba(123,20,34,.65);
          border-radius: 10px;
          pointer-events: none;
          z-index: 5;
        }

        .lcShape {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .lcNotch {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3c8c5;
          z-index: 10;
        }

        .lcNotch.left {
          left: -16px;
          top: calc(50% - 16px);
        }

        .lcNotch.right {
          right: -16px;
          top: calc(50% - 16px);
        }

        .lcMain {
          min-width: 0;
          padding: 25px 27px 18px;
          position: relative;
        }

        .lcTop {
          display: flex;
          align-items: center;
          gap: 14px;
          height: 25px;
        }

        .lcLogo {
          font-family: Georgia, serif;
          font-size: 22px;
          white-space: nowrap;
        }

        .lcRule {
          height: 1px;
          flex: 1;
          background: rgba(114,17,31,.55);
        }

        .lcType {
          font-family: Arial, sans-serif;
          font-size: 8px;
          letter-spacing: .2em;
          font-weight: 800;
          white-space: nowrap;
        }

        .lcContent {
          height: calc(100% - 64px);
          margin-top: 13px;
          border: 1px dashed rgba(114,17,31,.55);
          border-radius: 14px;
          padding: 20px 24px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .lcTiny {
          font-family: Arial, sans-serif;
          font-size: 7px;
          letter-spacing: .22em;
          font-weight: 800;
        }

        .lcContent h3,
        .lcBackContent h3 {
          font-family: Georgia, serif;
          font-size: clamp(20px, 3vw, 36px);
          line-height: .95;
          margin: 8px 0 5px;
          text-transform: uppercase;
        }

        .lcContent p,
        .lcBackContent p {
          font-family: Georgia, serif;
          font-size: 12px;
          font-style: italic;
          margin: 0;
        }

        .lcMessage {
          font-family: Georgia, serif;
          margin-top: 12px;
          font-size: 11px;
        }

        .lcActions {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 18px;
          display: flex;
          gap: 5px;
        }

        .lcActions button {
          appearance: none;
          border: 1px solid rgba(114,17,31,.25);
          background: rgba(255,255,255,.22);
          color: #72111f;
          height: 34px;
          flex: 1;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: .2s ease;
        }

        .lcActions button:hover {
          background: #72111f;
          color: #f8d9d5;
          transform: translateY(-2px);
        }

        .lcActions b {
          font-size: 12px;
        }

        .lcActions span {
          font-family: Arial, sans-serif;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: .12em;
        }

        .lcStub {
          position: relative;
          border-left: 2px dashed #72111f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 18px 10px;
        }

        .lcStubHeart {
          font-size: 35px;
          line-height: 1;
        }

        .lcStubNo {
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .lcBarcode {
          width: 42px;
          height: 55px;
          background: repeating-linear-gradient(
            90deg,
            #72111f 0 2px,
            transparent 2px 4px,
            #72111f 4px 5px,
            transparent 5px 8px
          );
        }

        .lcStubBrand {
          font-family: Arial, sans-serif;
          font-size: 7px;
          letter-spacing: .18em;
          font-weight: 800;
        }

        .lcBackContent {
          height: calc(100% - 38px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 14px 35px;
        }

        .lcHeart {
          font-family: Georgia, serif;
          font-size: 25px;
          margin: 4px 0;
        }

        .lcBackMessage {
          margin-top: 8px;
          max-width: 80%;
          font-family: Georgia, serif;
          font-size: 11px;
          font-style: italic;
        }

        .lcFlipHint {
          margin-top: 12px;
          font-family: Arial, sans-serif;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: .18em;
          opacity: .55;
        }

        .lcSelect {
          position: absolute;
          z-index: 20;
          right: 25%;
          bottom: -16px;
          border: 0;
          border-radius: 999px;
          padding: 11px 18px;
          background: #72111f;
          color: #fff0eb;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .12em;
          cursor: pointer;
        }

        .lcSelect.selected {
          background: #9d1b30;
        }

        @media (max-width: 650px) {
          .lcTicketScene {
            aspect-ratio: 2.05 / 1;
          }

          .lcFace {
            grid-template-columns: 1fr 22%;
          }

          .lcMain {
            padding: 15px 16px 11px;
          }

          .lcLogo {
            font-size: 14px;
          }

          .lcType {
            font-size: 5px;
          }

          .lcContent {
            margin-top: 7px;
            padding: 10px 12px 39px;
          }

          .lcContent h3,
          .lcBackContent h3 {
            font-size: 17px;
          }

          .lcContent p,
          .lcBackContent p {
            font-size: 8px;
          }

          .lcTiny {
            font-size: 5px;
          }

          .lcActions {
            left: 16px;
            right: 16px;
            bottom: 10px;
            gap: 2px;
          }

          .lcActions button {
            height: 26px;
            padding: 0;
          }

          .lcActions span {
            display: none;
          }

          .lcStubHeart {
            font-size: 23px;
          }

          .lcStubNo {
            font-size: 12px;
          }

          .lcBarcode {
            width: 28px;
            height: 37px;
          }

          .lcStubBrand {
            font-size: 5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lcTicket,
          .lcTicketScene {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function TicketShape() {
  return (
    <div className="lcShape" aria-hidden="true">
      <i className="lcNotch left" />
      <i className="lcNotch right" />
    </div>
  );
}

function TicketStub({ number }) {
  return (
    <aside className="lcStub">
      <div className="lcStubHeart">♡</div>
      <div className="lcStubNo">No. {number}</div>
      <div className="lcBarcode" />
      <div className="lcStubBrand">WI♡ELI</div>
    </aside>
  );
}

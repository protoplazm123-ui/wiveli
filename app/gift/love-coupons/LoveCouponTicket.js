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
  compact = false,
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`loveTicketWrap ${compact ? "compact" : ""}`}>
      <div
        className="loveTicketScene"
        onClick={() => setFlipped((value) => !value)}
      >
        <div className={`loveTicket3d ${flipped ? "flipped" : ""}`}>
          {/* FRONT */}
          <article className="loveTicketFace loveTicketFront">
            <div className="loveTicketMain">
              <div className="ticketTop">
                <strong>WI♡ELI</strong>

                <span className="topLine" />

                <span className="topLabel">
                  LOVE COUPON ✦
                </span>
              </div>

              <div className="ticketContent">
                <small>
                  A LITTLE PROMISE FOR YOU
                </small>

                <h3>{title}</h3>

                <p>{description}</p>

                {message && (
                  <div className="ticketMessage">
                    “{message}”
                  </div>
                )}
              </div>

              <span className="flipHint">
                CLICK TO FLIP ↻
              </span>
            </div>

            <TicketStub number={number} />
          </article>

          {/* BACK */}
          <article className="loveTicketFace loveTicketBack">
            <div className="loveTicketMain">
              <div className="ticketTop">
                <strong>WI♡ELI</strong>

                <span className="topLine" />

                <span className="topLabel">
                  MADE WITH LOVE ✦
                </span>
              </div>

              <div className="backContent">
                <small>
                  LOVE COUPON · {number}
                </small>

                <span className="backHeart">
                  ♡
                </span>

                <h3>{title}</h3>

                <p>{description}</p>

                {message && (
                  <div className="backMessage">
                    {message}
                  </div>
                )}

                <span className="backHint">
                  CLICK TO TURN OVER ↻
                </span>
              </div>
            </div>

            <TicketStub number={number} />
          </article>
        </div>
      </div>

      {!compact && (onSelect || onEdit) && (
        <div className="ticketActions">
          {onSelect && (
            <button
              type="button"
              className={selected ? "selected" : ""}
              onClick={onSelect}
            >
              {selected
                ? "✓ SELECTED"
                : "+ ADD COUPON"}
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
            >
              EDIT ♡
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .loveTicketWrap {
          width: 100%;
          min-width: 0;
        }

        .loveTicketScene {
          width: 100%;
          aspect-ratio: 2.5 / 1;

          position: relative;

          perspective: 1500px;

          cursor: pointer;

          transition:
            transform 0.28s ease,
            filter 0.28s ease;
        }

        .loveTicketScene:hover {
          transform:
            translateY(-6px)
            rotate(-0.5deg);

          filter:
            drop-shadow(
              0 17px 18px
              rgba(87, 7, 20, 0.16)
            );
        }

        .loveTicket3d {
          position: relative;

          width: 100%;
          height: 100%;

          transform-style: preserve-3d;

          transition:
            transform 0.65s
            cubic-bezier(
              0.2,
              0.8,
              0.2,
              1
            );
        }

        .loveTicket3d.flipped {
          transform: rotateY(180deg);
        }

        .loveTicketFace {
          position: absolute;
          inset: 0;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            20%;

          overflow: hidden;

          border-radius: 15px;

          color: #68101e;

          background:
            radial-gradient(
              circle at 22% 10%,
              rgba(255, 255, 255, 0.5),
              transparent 32%
            ),
            radial-gradient(
              circle at 78% 85%,
              rgba(181, 77, 90, 0.08),
              transparent 38%
            ),
            #f5d2ce;

          box-shadow:
            inset 0 0 0 2px #741020,
            inset 0 0 0 7px #f5d2ce,
            inset 0 0 0 8px
              rgba(116, 16, 32, 0.65),
            0 8px 20px
              rgba(94, 13, 28, 0.08);

          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /*
          SIDE CUT-OUTS
        */

        .loveTicketFace::before,
        .loveTicketFace::after {
          content: "";

          position: absolute;

          top: 50%;

          width: 26px;
          height: 26px;

          margin-top: -13px;

          border-radius: 50%;

          background: #f2cfca;

          z-index: 20;
        }

        .loveTicketFace::before {
          left: -13px;
        }

        .loveTicketFace::after {
          right: -13px;
        }

        .loveTicketBack {
          transform: rotateY(180deg);
        }

        /*
          MAIN TICKET
        */

        .loveTicketMain {
          position: relative;

          min-width: 0;

          padding:
            20px
            22px;
        }

        .ticketTop {
          height: 23px;

          display: flex;

          align-items: center;

          gap: 11px;
        }

        .ticketTop strong {
          flex: 0 0 auto;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;

          line-height: 1;

          font-weight: 600;

          letter-spacing: -0.03em;

          white-space: nowrap;
        }

        .topLine {
          flex: 1;

          height: 1px;

          background:
            rgba(
              104,
              16,
              30,
              0.5
            );
        }

        .topLabel {
          flex: 0 0 auto;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.17em;

          white-space: nowrap;
        }

        /*
          FRONT CONTENT
        */

        .ticketContent {
          position: absolute;

          left: 22px;
          right: 22px;

          top: 54px;
          bottom: 20px;

          display: flex;

          flex-direction: column;

          justify-content: center;

          padding:
            14px
            18px;

          border:
            1px dashed
            rgba(
              104,
              16,
              30,
              0.5
            );

          border-radius: 11px;
        }

        .ticketContent small,
        .backContent small {
          display: block;

          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.2em;

          line-height: 1.2;
        }

        .ticketContent h3,
        .backContent h3 {
          margin:
            7px
            0
            4px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              17px,
              2.15vw,
              28px
            );

          line-height: 0.94;

          font-weight: 500;

          letter-spacing: -0.035em;

          text-transform: uppercase;
        }

        .ticketContent p,
        .backContent p {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 9px;

          line-height: 1.25;

          font-style: italic;
        }

        .ticketMessage {
          margin-top: 8px;

          max-width: 90%;

          font-family:
            Georgia,
            serif;

          font-size: 8px;

          line-height: 1.3;

          opacity: 0.75;
        }

        .flipHint {
          position: absolute;

          z-index: 5;

          left: 50%;
          bottom: 6px;

          transform:
            translateX(-50%);

          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.13em;

          white-space: nowrap;

          opacity: 0.38;
        }

        /*
          STUB
        */

        .ticketStub {
          position: relative;

          min-width: 0;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          gap: 7px;

          padding:
            17px
            8px;

          border-left:
            1px dashed
            #741020;
        }

        /*
          PERFORATION HOLES
        */

        .ticketStub::before,
        .ticketStub::after {
          content: "";

          position: absolute;

          left: -8px;

          width: 15px;
          height: 15px;

          border-radius: 50%;

          background: #f2cfca;

          z-index: 10;
        }

        .ticketStub::before {
          top: -8px;
        }

        .ticketStub::after {
          bottom: -8px;
        }

        .stubStar {
          font-size: 9px;
        }

        .stubHeart {
          font-family:
            Georgia,
            serif;

          font-size: 27px;

          line-height: 0.9;
        }

        .stubNumber {
          font-family:
            Georgia,
            serif;

          font-size: 10px;

          white-space: nowrap;
        }

        /*
          CSS BARCODE
        */

        .barcode {
          width: 34px;
          height: 40px;

          background:
            repeating-linear-gradient(
              90deg,
              #68101e 0px,
              #68101e 1px,

              transparent 1px,
              transparent 3px,

              #68101e 3px,
              #68101e 5px,

              transparent 5px,
              transparent 7px,

              #68101e 7px,
              #68101e 8px,

              transparent 8px,
              transparent 10px
            );
        }

        .stubLogo {
          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.17em;
        }

        /*
          BACK
        */

        .backContent {
          position: absolute;

          left: 24px;
          right: 24px;

          top: 52px;
          bottom: 19px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          padding:
            10px
            20px;

          border:
            1px dashed
            rgba(
              104,
              16,
              30,
              0.5
            );

          border-radius: 11px;
        }

        .backHeart {
          display: block;

          margin:
            3px
            0
            -1px;

          font-family:
            Georgia,
            serif;

          font-size: 22px;
        }

        .backMessage {
          max-width: 85%;

          margin-top: 7px;

          font-family:
            Georgia,
            serif;

          font-size: 8px;

          line-height: 1.3;

          font-style: italic;

          opacity: 0.8;
        }

        .backHint {
          position: absolute;

          bottom: 5px;

          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.13em;

          opacity: 0.38;
        }

        /*
          ADD / EDIT
        */

        .ticketActions {
          display: grid;

          grid-template-columns:
            1fr
            1fr;

          gap: 7px;

          margin-top: 9px;
        }

        .ticketActions button {
          height: 36px;

          padding:
            0
            12px;

          border:
            1px solid
            #741020;

          border-radius: 100px;

          color: #741020;

          background: transparent;

          cursor: pointer;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.11em;

          transition:
            color 0.18s ease,
            background 0.18s ease,
            transform 0.18s ease;
        }

        .ticketActions button:hover {
          transform:
            translateY(-1px);

          color: #f9ddd8;

          background: #741020;
        }

        .ticketActions button.selected {
          color: #f9ddd8;

          background: #741020;
        }

        /*
          COMPACT VERSION
          FOR PRINTER LATER
        */

        .compact
          .loveTicketScene {
          pointer-events: none;
        }

        .compact
          .flipHint {
          display: none;
        }

        /*
          MOBILE
        */

        @media (max-width: 600px) {
          .loveTicketScene {
            aspect-ratio:
              2.05 / 1;
          }

          .loveTicketFace {
            grid-template-columns:
              minmax(0, 1fr)
              23%;
          }

          .loveTicketMain {
            padding:
              13px
              15px;
          }

          .ticketTop {
            gap: 7px;
          }

          .ticketTop strong {
            font-size: 12px;
          }

          .topLabel {
            font-size: 4px;
          }

          .ticketContent {
            left: 15px;
            right: 15px;

            top: 40px;
            bottom: 14px;

            padding:
              9px
              11px;
          }

          .ticketContent small,
          .backContent small {
            font-size: 4px;
          }

          .ticketContent h3,
          .backContent h3 {
            margin:
              4px
              0
              2px;

            font-size: 15px;
          }

          .ticketContent p,
          .backContent p {
            font-size: 7px;
          }

          .ticketMessage,
          .backMessage {
            margin-top: 4px;

            font-size: 6px;
          }

          .backContent {
            left: 16px;
            right: 16px;

            top: 39px;
            bottom: 13px;

            padding:
              7px
              10px;
          }

          .backHeart {
            font-size: 16px;
          }

          .stubHeart {
            font-size: 21px;
          }

          .stubNumber {
            font-size: 8px;
          }

          .barcode {
            width: 27px;
            height: 31px;
          }

          .stubLogo {
            font-size: 4px;
          }

          .flipHint,
          .backHint {
            display: none;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .loveTicket3d,
          .loveTicketScene {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function TicketStub({ number }) {
  return (
    <aside className="ticketStub">
      <span className="stubStar">
        ✦
      </span>

      <span className="stubHeart">
        ♡
      </span>

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

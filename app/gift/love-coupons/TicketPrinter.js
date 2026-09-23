"use client";

import { useEffect, useState } from "react";

export default function TicketPrinter({
  coupons = [],
  senderName = "",
  recipientName = "",
  onFinished,
}) {
  const [printed, setPrinted] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentCoupon =
    coupons[Math.min(printed, coupons.length - 1)];

  useEffect(() => {
    if (!started || finished || coupons.length === 0) return;

    if (printed >= coupons.length) {
      const doneTimer = setTimeout(() => {
        setFinished(true);
      }, 850);

      return () => clearTimeout(doneTimer);
    }

    const timer = setTimeout(() => {
      setPrinted((value) => value + 1);
    }, 430);

    return () => clearTimeout(timer);
  }, [started, printed, finished, coupons.length]);

  function finishPrinting() {
    if (onFinished) {
      onFinished();
    }
  }

  return (
    <section className="printerScene">
      <div className="ambient ambientOne">♡</div>
      <div className="ambient ambientTwo">✦</div>
      <div className="ambient ambientThree">♥</div>

      <div className="sceneCopy">
        <p>WIVELI · LOVE COUPONS</p>

        {!started ? (
          <>
            <h1>
              SOMETHING
              <br />
              <em>JUST FOR YOU.</em>
            </h1>

            <span>
              {senderName} made a little collection
              <br />
              especially for {recipientName}.
            </span>
          </>
        ) : !finished ? (
          <>
            <h1>
              PRINTING
              <br />
              <em>YOUR LOVE.</em>
            </h1>

            <span>
              Your little promises are coming out
              <br />
              one by one ♡
            </span>
          </>
        ) : (
          <>
            <h1>
              ALL
              <br />
              <em>YOURS.</em>
            </h1>

            <span>
              {coupons.length} little reasons to
              <br />
              make a memory together.
            </span>
          </>
        )}
      </div>

      <div className={`machine ${started ? "working" : ""}`}>
        <div className="machineTop">
          <div className="machineLogo">
            <span>WI♡ELI</span>
            <small>LOVE COUPON MACHINE</small>
          </div>

          <div className="machineLight">
            <i />
            {finished
              ? "READY"
              : started
              ? "PRINTING"
              : "WAITING"}
          </div>
        </div>

        <div className="machineFace">
          <div className="decorHeart leftHeart">
            ♡
          </div>

          <div className="decorHeart rightHeart">
            ♡
          </div>

          <div className="machineMessage">
            <small>MADE WITH LOVE FOR</small>
            <strong>
              {recipientName || "YOU"}
            </strong>
          </div>

          <div className="slotFrame">
            <div className="slot" />

            {started &&
              !finished &&
              currentCoupon && (
                <div
                  className="printingTicket"
                  key={printed}
                >
                  <div className="ticketBody">
                    <small>
                      WIVELI · LOVE COUPON
                    </small>

                    <strong>
                      {currentCoupon.title}
                    </strong>

                    <p>
                      {currentCoupon.subtitle}
                    </p>

                    <span>♡</span>
                  </div>

                  <div className="ticketStub">
                    <small>NO.</small>

                    <b>
                      {String(
                        Math.min(
                          printed + 1,
                          coupons.length
                        )
                      ).padStart(2, "0")}
                    </b>

                    <div className="barcode">
                      ||| || ||| ||
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div className="machineBottom">
            <div className="counter">
              <small>COUPONS</small>

              <strong>
                {String(
                  Math.min(
                    printed,
                    coupons.length
                  )
                ).padStart(2, "0")}
                <span>
                  /{String(coupons.length).padStart(
                    2,
                    "0"
                  )}
                </span>
              </strong>
            </div>

            {!started ? (
              <button
                type="button"
                onClick={() => setStarted(true)}
              >
                <span>♥</span>
                PRINT MY COUPONS
              </button>
            ) : finished ? (
              <button
                type="button"
                onClick={finishPrinting}
              >
                SEE MY COUPONS →
              </button>
            ) : (
              <div className="printingStatus">
                <i />
                <span>PRINTING...</span>
              </div>
            )}
          </div>
        </div>

        <div className="machineFeet">
          <i />
          <i />
        </div>
      </div>

      {started && !finished && (
        <div className="paperBits">
          <i className="bit1">♡</i>
          <i className="bit2">♥</i>
          <i className="bit3">✦</i>
          <i className="bit4">♡</i>
          <i className="bit5">♥</i>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .printerScene {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 20%,
              #f7deda 0%,
              #edc4c2 47%,
              #dba9aa 100%
            );
          color: #4b0710;
          display: grid;
          grid-template-columns:
            minmax(280px, 0.8fr)
            minmax(430px, 1.2fr);
          align-items: center;
          gap: 6vw;
          padding: 70px 8vw;
        }

        .sceneCopy {
          position: relative;
          z-index: 3;
        }

        .sceneCopy > p {
          margin: 0 0 20px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .sceneCopy h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(
            55px,
            6.5vw,
            100px
          );
          line-height: 0.78;
          letter-spacing: -0.065em;
        }

        .sceneCopy h1 em {
          font-weight: 400;
        }

        .sceneCopy > span {
          display: block;
          margin-top: 30px;
          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.6;
        }

        .machine {
          width: min(100%, 590px);
          justify-self: center;
          position: relative;
          z-index: 4;
          filter:
            drop-shadow(
              0 35px 35px
              rgba(71, 5, 14, 0.22)
            );
        }

        .machineTop {
          min-height: 78px;
          border-radius: 28px 28px 8px 8px;
          background: #5b0915;
          color: #f6d4cf;
          padding: 20px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom:
            1px solid rgba(255,255,255,.13);
        }

        .machineLogo {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .machineLogo span {
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 700;
        }

        .machineLogo small {
          font-size: 6px;
          letter-spacing: 0.2em;
          opacity: 0.7;
        }

        .machineLight {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 7px;
          letter-spacing: 0.15em;
        }

        .machineLight i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f4b9b7;
          box-shadow:
            0 0 14px #f4b9b7;
        }

        .working .machineLight i {
          animation: blink 0.6s infinite;
        }

        .machineFace {
          position: relative;
          min-height: 480px;
          border-radius: 8px 8px 24px 24px;
          padding: 43px 45px 32px;
          background:
            linear-gradient(
              145deg,
              #69101c,
              #4b0711
            );
          border:
            1px solid rgba(44, 0, 6, 0.35);
          box-shadow:
            inset 0 1px 0
              rgba(255,255,255,.13),
            inset 0 -20px 35px
              rgba(30,0,5,.18);
        }

        .machineMessage {
          text-align: center;
          color: #f5d1cd;
        }

        .machineMessage small {
          display: block;
          font-size: 7px;
          letter-spacing: 0.22em;
        }

        .machineMessage strong {
          display: block;
          margin-top: 6px;
          font-family: Georgia, serif;
          font-size: 31px;
          font-style: italic;
          font-weight: 400;
        }

        .decorHeart {
          position: absolute;
          color: rgba(247,213,208,.15);
          font-family: Georgia, serif;
          font-size: 48px;
        }

        .leftHeart {
          left: 22px;
          top: 33px;
          transform: rotate(-15deg);
        }

        .rightHeart {
          right: 22px;
          top: 39px;
          transform: rotate(13deg);
        }

        .slotFrame {
          position: relative;
          height: 220px;
          margin-top: 31px;
          overflow: visible;
        }

        .slot {
          position: absolute;
          z-index: 5;
          left: 5%;
          top: 0;
          width: 90%;
          height: 24px;
          border-radius: 30px;
          background: #210207;
          border:
            5px solid #35040b;
          box-shadow:
            inset 0 5px 7px
              rgba(0,0,0,.8),
            0 2px 0
              rgba(255,255,255,.08);
        }

        .printingTicket {
          position: absolute;
          z-index: 4;
          left: 50%;
          top: 10px;
          width: 88%;
          height: 170px;
          transform:
            translateX(-50%)
            translateY(-125px);
          background: #f2c7c4;
          color: #520a14;
          border: 1px solid #5b0b16;
          display: grid;
          grid-template-columns: 1fr 78px;
          animation:
            printTicket 0.42s
            cubic-bezier(.18,.75,.25,1)
            forwards;
          box-shadow:
            0 15px 25px
            rgba(25,0,4,.22);
        }

        .printingTicket::before,
        .printingTicket::after {
          content: "";
          position: absolute;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #530a15;
          right: 70px;
        }

        .printingTicket::before {
          top: -8px;
        }

        .printingTicket::after {
          bottom: -8px;
        }

        .ticketBody {
          padding: 26px 23px;
          position: relative;
        }

        .ticketBody small {
          font-size: 6px;
          letter-spacing: 0.17em;
        }

        .ticketBody strong {
          display: block;
          margin-top: 12px;
          max-width: 270px;
          font-family: Georgia, serif;
          font-size: clamp(
            20px,
            2.3vw,
            31px
          );
          font-style: italic;
          line-height: 0.9;
        }

        .ticketBody p {
          margin: 10px 0 0;
          font-family: Georgia, serif;
          font-size: 9px;
          text-transform: uppercase;
        }

        .ticketBody > span {
          position: absolute;
          right: 16px;
          bottom: 10px;
          font-size: 25px;
        }

        .ticketStub {
          border-left:
            1px dashed #690f1b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .ticketStub small {
          font-size: 6px;
        }

        .ticketStub b {
          font-family: Georgia, serif;
          font-size: 22px;
        }

        .barcode {
          font-size: 8px;
          letter-spacing: -1px;
        }

        .machineBottom {
          position: absolute;
          left: 45px;
          right: 45px;
          bottom: 32px;
          min-height: 78px;
          border-top:
            1px solid rgba(247,213,208,.18);
          padding-top: 21px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #f5d1cd;
        }

        .counter small {
          display: block;
          font-size: 6px;
          letter-spacing: 0.18em;
        }

        .counter strong {
          font-family: Georgia, serif;
          font-size: 27px;
        }

        .counter strong span {
          opacity: 0.45;
          font-size: 13px;
        }

        .machineBottom button {
          border: none;
          min-width: 190px;
          height: 47px;
          border-radius: 100px;
          background: #f2c7c4;
          color: #4d0711;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.1em;
          cursor: pointer;
          padding: 0 20px;
          transition:
            transform .2s ease;
        }

        .machineBottom button:hover {
          transform: scale(1.03);
        }

        .machineBottom button span {
          margin-right: 7px;
        }

        .printingStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .printingStatus i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f2c7c4;
          animation: blink .5s infinite;
        }

        .machineFeet {
          display: flex;
          justify-content: space-between;
          padding: 0 55px;
        }

        .machineFeet i {
          width: 45px;
          height: 12px;
          background: #34040b;
          border-radius: 0 0 10px 10px;
        }

        .ambient {
          position: absolute;
          font-family: Georgia, serif;
          color: rgba(81,7,16,.13);
          pointer-events: none;
        }

        .ambientOne {
          font-size: 100px;
          left: 4%;
          bottom: 5%;
          transform: rotate(-15deg);
        }

        .ambientTwo {
          font-size: 70px;
          right: 3%;
          top: 8%;
          transform: rotate(15deg);
        }

        .ambientThree {
          font-size: 36px;
          left: 46%;
          top: 8%;
        }

        .paperBits i {
          position: absolute;
          z-index: 5;
          color: #6a101c;
          font-style: normal;
          animation:
            floatBit 2s ease-in-out
            infinite alternate;
        }

        .bit1 {
          right: 11%;
          top: 22%;
        }

        .bit2 {
          right: 6%;
          top: 42%;
          animation-delay: .3s !important;
        }

        .bit3 {
          right: 15%;
          bottom: 13%;
          animation-delay: .5s !important;
        }

        .bit4 {
          left: 48%;
          bottom: 8%;
          animation-delay: .8s !important;
        }

        .bit5 {
          left: 46%;
          top: 18%;
          animation-delay: 1s !important;
        }

        @keyframes printTicket {
          0% {
            transform:
              translateX(-50%)
              translateY(-125px);
          }

          75% {
            transform:
              translateX(-50%)
              translateY(50px);
          }

          100% {
            transform:
              translateX(-50%)
              translateY(42px)
              rotate(-1deg);
          }
        }

        @keyframes blink {
          50% {
            opacity: .25;
          }
        }

        @keyframes floatBit {
          from {
            transform:
              translateY(0)
              rotate(-8deg);
          }

          to {
            transform:
              translateY(-18px)
              rotate(12deg);
          }
        }

        @media (max-width: 900px) {
          .printerScene {
            grid-template-columns: 1fr;
            gap: 45px;
            padding:
              55px 20px 70px;
          }

          .sceneCopy {
            text-align: center;
          }

          .sceneCopy h1 {
            font-size: 62px;
          }

          .machine {
            max-width: 540px;
          }
        }

        @media (max-width: 520px) {
          .sceneCopy h1 {
            font-size: 50px;
          }

          .machineFace {
            min-height: 430px;
            padding:
              35px 20px 25px;
          }

          .machineMessage strong {
            font-size: 25px;
          }

          .slotFrame {
            height: 205px;
          }

          .printingTicket {
            width: 94%;
            grid-template-columns:
              1fr 65px;
          }

          .ticketBody {
            padding:
              25px 15px;
          }

          .machineBottom {
            left: 20px;
            right: 20px;
            bottom: 25px;
          }

          .machineBottom button {
            min-width: 155px;
            padding: 0 12px;
          }

          .decorHeart {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

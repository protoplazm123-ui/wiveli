"use client";

import { useState } from "react";

export default function CouponCollection({
  coupons = [],
  gift,
  onRedeem,
}) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const redemptions = gift?.redemptions || [];

  const redeemedIds = new Set(
    redemptions.map((item) => item.couponId)
  );

  function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const todayKey = getTodayKey();

  const usedToday = redemptions.filter(
    (item) => item.dayKey === todayKey
  ).length;

  const unlimited = gift?.dailyLimit === "unlimited";

  const dailyLimit = unlimited
    ? null
    : Number(gift?.dailyLimit || 3);

  const leftToday = unlimited
    ? null
    : Math.max(0, dailyLimit - usedToday);

  return (
    <main className="collection">
      <header>
        <span className="logo">WI♡ELI</span>

        <div className="headerRight">
          <span>LOVE COUPONS</span>
          <i>♡</i>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">
          MADE FOR{" "}
          {gift?.recipientName?.toUpperCase() || "YOU"}
        </p>

        <h1>
          YOUR LOVE
          <br />
          <em>COUPONS.</em>
        </h1>

        <p className="description">
          Pick the one you want today.
          <br />
          Every little ticket is a promise ♡
        </p>

        <div className="availability">
          <div className="availabilityHeart">♥</div>

          <div>
            <small>
              {unlimited
                ? "AVAILABLE TODAY"
                : usedToday > 0
                ? `${usedToday} USED TODAY`
                : "AVAILABLE TODAY"}
            </small>

            <strong>
              {unlimited
                ? "UNLIMITED"
                : leftToday === 0
                ? "COME BACK TOMORROW ♡"
                : `${leftToday} ${
                    leftToday === 1 ? "COUPON" : "COUPONS"
                  } LEFT`}
            </strong>
          </div>
        </div>
      </section>

      <section className="ticketsSection">
        <div className="sectionTop">
          <span>
            {String(coupons.length).padStart(2, "0")} LITTLE PROMISES
          </span>

          <span>{redemptions.length} REDEEMED</span>
        </div>

        <div className="tickets">
          {coupons.map((coupon, index) => {
            const isRedeemed = redeemedIds.has(coupon.id);

            return (
              <button
                type="button"
                className={`ticket ${
                  coupon.special ? "special" : ""
                } ${isRedeemed ? "redeemed" : ""}`}
                key={coupon.id}
                disabled={isRedeemed}
                onClick={() => {
                  if (!isRedeemed) {
                    setSelectedCoupon(coupon);
                  }
                }}
              >
                <span className="ticketInnerFrame" />

                <div className="ticketMain">
                  <div className="ticketMeta">
                    <span>WI♡ELI</span>

                    <span>
                      {isRedeemed
                        ? "PROMISE KEPT"
                        : "LOVE COUPON"}
                    </span>
                  </div>

                  <div className="ticketHeart">♡</div>

                  <h2>{coupon.title}</h2>

                  <p>{coupon.subtitle}</p>

                  {isRedeemed && (
                    <div className="redeemedStamp">
                      REDEEMED
                    </div>
                  )}

                  <div className="ticketBottom">
                    <span>
                      FOR{" "}
                      {gift?.recipientName?.toUpperCase() || "YOU"}
                    </span>

                    <span>
                      {isRedeemed
                        ? "USED WITH LOVE ♡"
                        : "WITH LOVE ♡"}
                    </span>
                  </div>
                </div>

                <div className="ticketStub">
                  <small>{isRedeemed ? "USED" : "NO."}</small>

                  <strong>
                    {String(index + 1).padStart(2, "0")}
                  </strong>

                  <div className="barcode">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  <span>{isRedeemed ? "♥" : "♡"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer>
        <span>
          MADE WITH LOVE BY{" "}
          {gift?.senderName?.toUpperCase()}
        </span>

        <span>WI♡ELI</span>
      </footer>

      {selectedCoupon && (
        <div
          className="modalBackdrop"
          onClick={() => setSelectedCoupon(null)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close"
              onClick={() => setSelectedCoupon(null)}
              aria-label="Close"
            >
              ×
            </button>

            <p className="modalEyebrow">
              ONE LITTLE PROMISE
            </p>

            <div className="bigTicket">
              <span className="bigTicketFrame" />

              <div className="bigTicketMain">
                <span className="bigLogo">
                  WI♡ELI · LOVE COUPON
                </span>

                <div className="bigHeart">♡</div>

                <h2>{selectedCoupon.title}</h2>

                <p>{selectedCoupon.subtitle}</p>

                <div className="bigTicketFor">
                  <span>
                    FOR{" "}
                    {gift?.recipientName?.toUpperCase()}
                  </span>

                  <span>
                    FROM{" "}
                    {gift?.senderName?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bigStub">
                <small>LOVE</small>

                <div className="verticalBarcode">
                  ||| || ||| | ||
                </div>

                <span>♡</span>
              </div>
            </div>

            {leftToday === 0 && !unlimited ? (
              <>
                <p className="question">
                  You've used all your coupons for today ♡
                </p>

                <button
                  type="button"
                  className="locked"
                  onClick={() => setSelectedCoupon(null)}
                >
                  COME BACK TOMORROW
                </button>
              </>
            ) : (
              <>
                <p className="question">
                  Want to use this one today?
                </p>

                <button
                  type="button"
                  className="redeemButton"
                  onClick={() => {
                    if (onRedeem) {
                      onRedeem(selectedCoupon);
                    }
                  }}
                >
                  USE THIS COUPON
                  <span>♥</span>
                </button>

                <button
                  type="button"
                  className="notYet"
                  onClick={() => setSelectedCoupon(null)}
                >
                  NOT YET
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .collection {
          min-height: 100svh;

          background:
            radial-gradient(
              circle at 50% 0%,
              #f8e4df 0%,
              #efcbc7 43%,
              #e3b6b4 100%
            );

          color: #500914;
        }

        header {
          height: 76px;
          padding: 0 5vw;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid rgba(80, 9, 20, 0.15);
        }

        .logo {
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 18px;

          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .headerRight i {
          font-family: Georgia, serif;
          font-size: 19px;
          font-style: normal;
        }

        .hero {
          min-height: 510px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 65px 20px;
        }

        .eyebrow {
          margin: 0 0 20px;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.23em;
        }

        .hero h1 {
          margin: 0;

          font-family: Georgia, serif;

          font-size: clamp(65px, 9vw, 125px);

          line-height: 0.77;
          letter-spacing: -0.07em;
        }

        .hero h1 em {
          font-weight: 400;
        }

        .description {
          margin: 30px 0 0;

          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.6;
        }

        .availability {
          margin-top: 35px;

          min-width: 245px;

          padding: 15px 22px;

          border:
            1px solid rgba(80, 9, 20, 0.22);

          border-radius: 100px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;

          background:
            rgba(255, 240, 236, 0.35);

          backdrop-filter: blur(8px);
        }

        .availabilityHeart {
          width: 33px;
          height: 33px;

          border-radius: 50%;

          display: grid;
          place-items: center;

          background: #5b0a16;
          color: #f4cfcb;
        }

        .availability small,
        .availability strong {
          display: block;
          text-align: left;
        }

        .availability small {
          font-size: 6px;
          letter-spacing: 0.16em;
          margin-bottom: 3px;
        }

        .availability strong {
          font-family: Georgia, serif;
          font-size: 15px;
        }

        .ticketsSection {
          width:
            min(
              1180px,
              calc(100% - 40px)
            );

          margin: 0 auto;

          padding: 0 0 100px;
        }

        .sectionTop {
          padding: 20px 2px;

          display: flex;
          justify-content: space-between;

          border-top:
            1px solid rgba(80, 9, 20, 0.2);

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .tickets {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 20px;
        }

        /*
          REAL CUT-OUT TICKET
        */

        .ticket {
          --stub-width: 92px;
          --notch-size: 11px;

          position: relative;

          min-height: 220px;

          padding: 0;

          border:
            1px solid #67111d;

          border-radius: 15px;

          background: #f3cfcb;
          color: #570c17;

          display: grid;

          grid-template-columns:
            1fr var(--stub-width);

          text-align: left;

          cursor: pointer;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            opacity 0.25s ease,
            filter 0.25s ease;

          box-shadow:
            0 13px 25px
            rgba(78, 8, 18, 0.08);

          /*
            Two real transparent holes:
            one from the top,
            one from the bottom,
            exactly on the tear line.
          */

          -webkit-mask-image:
            radial-gradient(
              circle var(--notch-size)
                at calc(100% - var(--stub-width)) 0,
              transparent 0 calc(var(--notch-size) - 1px),
              #000 var(--notch-size)
            ),
            radial-gradient(
              circle var(--notch-size)
                at calc(100% - var(--stub-width)) 100%,
              transparent 0 calc(var(--notch-size) - 1px),
              #000 var(--notch-size)
            );

          -webkit-mask-size:
            100% 51%,
            100% 51%;

          -webkit-mask-position:
            top left,
            bottom left;

          -webkit-mask-repeat:
            no-repeat,
            no-repeat;

          mask-image:
            radial-gradient(
              circle var(--notch-size)
                at calc(100% - var(--stub-width)) 0,
              transparent 0 calc(var(--notch-size) - 1px),
              #000 var(--notch-size)
            ),
            radial-gradient(
              circle var(--notch-size)
                at calc(100% - var(--stub-width)) 100%,
              transparent 0 calc(var(--notch-size) - 1px),
              #000 var(--notch-size)
            );

          mask-size:
            100% 51%,
            100% 51%;

          mask-position:
            top left,
            bottom left;

          mask-repeat:
            no-repeat,
            no-repeat;
        }

        .ticket:hover:not(:disabled) {
          transform:
            translateY(-5px)
            rotate(-0.4deg);

          box-shadow:
            0 20px 35px
            rgba(78, 8, 18, 0.16);
        }

        .ticket:disabled {
          cursor: default;
        }

        /*
          DOUBLE VINTAGE BORDER
        */

        .ticketInnerFrame {
          position: absolute;

          z-index: 3;

          inset: 6px;

          border:
            1px solid rgba(103, 17, 29, 0.28);

          border-radius: 10px;

          pointer-events: none;
        }

        .ticketMain {
          padding:
            26px 28px 24px;

          position: relative;
        }

        .ticketMeta {
          display: flex;
          justify-content: space-between;

          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .ticketHeart {
          position: absolute;

          right: 25px;
          top: 57px;

          font-family: Georgia, serif;
          font-size: 32px;
        }

        .ticket h2 {
          max-width: 75%;

          margin: 37px 0 7px;

          font-family: Georgia, serif;
          font-style: italic;

          font-size:
            clamp(
              25px,
              3vw,
              39px
            );

          line-height: 0.9;
          letter-spacing: -0.04em;
        }

        .ticket p {
          margin: 0;

          font-family: Georgia, serif;
          font-size: 12px;
        }

        .ticketBottom {
          position: absolute;

          left: 28px;
          right: 28px;
          bottom: 21px;

          display: flex;
          justify-content: space-between;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        /*
          TEAR-OFF STUB
        */

        .ticketStub {
          border-left:
            1px dashed #68111d;

          position: relative;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          gap: 8px;
        }

        .ticketStub small {
          font-size: 6px;
          letter-spacing: 0.15em;
        }

        .ticketStub strong {
          font-family: Georgia, serif;
          font-size: 26px;
        }

        .ticketStub > span {
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .barcode {
          height: 30px;

          display: flex;
          align-items: stretch;

          gap: 2px;
        }

        .barcode i {
          display: block;

          width: 2px;

          background: #5b0a16;
        }

        .barcode i:nth-child(2),
        .barcode i:nth-child(5),
        .barcode i:nth-child(8) {
          width: 4px;
        }

        /*
          SPECIAL COUPON
        */

        .special {
          background: #5a0a16;
          color: #f2cbc7;

          border-color: #39030a;
        }

        .special .ticketInnerFrame {
          border-color:
            rgba(242, 203, 199, 0.25);
        }

        .special .ticketStub {
          border-color: #e2aaa8;
        }

        .special .barcode i {
          background: #f2cbc7;
        }

        /*
          REDEEMED
        */

        .redeemed {
          opacity: 0.58;

          filter:
            saturate(0.55)
            contrast(0.9);

          transform: none;
        }

        .redeemedStamp {
          position: absolute;

          z-index: 6;

          right: 24px;
          top: 88px;

          padding: 8px 14px;

          border:
            3px solid currentColor;

          border-radius: 4px;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 0.13em;

          transform:
            rotate(-9deg);

          opacity: 0.8;
        }

        footer {
          min-height: 100px;

          padding: 0 5vw;

          border-top:
            1px solid rgba(80, 9, 20, 0.17);

          display: flex;
          justify-content: space-between;
          align-items: center;

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.17em;
        }

        /*
          MODAL
        */

        .modalBackdrop {
          position: fixed;
          inset: 0;

          z-index: 100;

          padding: 25px;

          display: grid;
          place-items: center;

          background:
            rgba(45, 2, 9, 0.72);

          backdrop-filter:
            blur(14px);
        }

        .modal {
          position: relative;

          width:
            min(
              680px,
              100%
            );

          padding:
            55px 45px 40px;

          background: #f0c7c4;
          color: #510a15;

          border-radius: 25px;

          box-shadow:
            0 35px 100px
            rgba(28, 0, 5, 0.38);

          text-align: center;

          animation:
            appear
            0.35s
            ease
            both;
        }

        .close {
          position: absolute;

          right: 18px;
          top: 15px;

          width: 38px;
          height: 38px;

          border:
            1px solid rgba(81, 10, 21, 0.22);

          border-radius: 50%;

          background: transparent;
          color: #510a15;

          font-size: 25px;

          cursor: pointer;
        }

        .modalEyebrow {
          margin: 0 0 23px;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        /*
          BIG TICKET
          Same real cut-out shape.
        */

        .bigTicket {
          --big-stub-width: 95px;
          --big-notch-size: 13px;

          min-height: 270px;

          position: relative;

          display: grid;

          grid-template-columns:
            1fr var(--big-stub-width);

          border:
            1px solid #63101c;

          border-radius: 17px;

          background: #f6d8d4;

          text-align: left;

          box-shadow:
            0 20px 40px
            rgba(69, 7, 16, 0.12);

          transform:
            rotate(-1deg);

          -webkit-mask-image:
            radial-gradient(
              circle var(--big-notch-size)
                at calc(100% - var(--big-stub-width)) 0,
              transparent 0 calc(var(--big-notch-size) - 1px),
              #000 var(--big-notch-size)
            ),
            radial-gradient(
              circle var(--big-notch-size)
                at calc(100% - var(--big-stub-width)) 100%,
              transparent 0 calc(var(--big-notch-size) - 1px),
              #000 var(--big-notch-size)
            );

          -webkit-mask-size:
            100% 51%,
            100% 51%;

          -webkit-mask-position:
            top left,
            bottom left;

          -webkit-mask-repeat:
            no-repeat,
            no-repeat;

          mask-image:
            radial-gradient(
              circle var(--big-notch-size)
                at calc(100% - var(--big-stub-width)) 0,
              transparent 0 calc(var(--big-notch-size) - 1px),
              #000 var(--big-notch-size)
            ),
            radial-gradient(
              circle var(--big-notch-size)
                at calc(100% - var(--big-stub-width)) 100%,
              transparent 0 calc(var(--big-notch-size) - 1px),
              #000 var(--big-notch-size)
            );

          mask-size:
            100% 51%,
            100% 51%;

          mask-position:
            top left,
            bottom left;

          mask-repeat:
            no-repeat,
            no-repeat;
        }

        .bigTicketFrame {
          position: absolute;

          z-index: 4;

          inset: 7px;

          border:
            1px solid rgba(99, 16, 28, 0.28);

          border-radius: 11px;

          pointer-events: none;
        }

        .bigTicketMain {
          position: relative;

          padding: 30px;
        }

        .bigLogo {
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .bigHeart {
          position: absolute;

          right: 30px;
          top: 30px;

          font-family: Georgia, serif;
          font-size: 38px;
        }

        .bigTicket h2 {
          max-width: 80%;

          margin:
            58px 0 10px;

          font-family: Georgia, serif;
          font-style: italic;

          font-size:
            clamp(
              31px,
              5vw,
              48px
            );

          line-height: 0.88;
          letter-spacing: -0.045em;
        }

        .bigTicket p {
          margin: 0;

          font-family: Georgia, serif;
          font-size: 13px;
        }

        .bigTicketFor {
          position: absolute;

          left: 30px;
          right: 30px;
          bottom: 24px;

          display: flex;
          justify-content: space-between;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .bigStub {
          position: relative;

          border-left:
            1px dashed #64101c;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;

          padding: 25px 0;
        }

        .bigStub small {
          font-size: 7px;
          letter-spacing: 0.15em;
        }

        .bigStub > span {
          font-size: 28px;
        }

        .verticalBarcode {
          writing-mode: vertical-rl;

          font-size: 12px;

          letter-spacing: -2px;
        }

        .question {
          margin:
            30px 0 18px;

          font-family: Georgia, serif;
          font-size: 17px;
          font-style: italic;
        }

        .redeemButton,
        .locked {
          width:
            min(
              360px,
              100%
            );

          height: 57px;

          border: none;
          border-radius: 100px;

          background: #570a16;
          color: #f5d3cf;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;

          cursor: pointer;
        }

        .redeemButton span {
          margin-left: 12px;
        }

        .locked {
          opacity: 0.65;
        }

        .notYet {
          display: block;

          margin:
            17px auto 0;

          border: none;

          background: none;
          color: #570a16;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.14em;

          cursor: pointer;
        }

        @keyframes appear {
          from {
            opacity: 0;

            transform:
              translateY(25px)
              scale(0.96);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        @media (max-width: 760px) {
          .hero {
            min-height: 460px;
          }

          .hero h1 {
            font-size: 67px;
          }

          .tickets {
            grid-template-columns: 1fr;
          }

          .ticket {
            min-height: 205px;
          }

          .modal {
            padding:
              52px 18px 30px;
          }

          .bigTicket {
            --big-stub-width: 65px;

            grid-template-columns:
              1fr var(--big-stub-width);

            min-height: 245px;
          }

          .bigTicketMain {
            padding: 22px;
          }

          .bigTicket h2 {
            margin-top: 53px;
            font-size: 34px;
          }

          .bigTicketFor {
            left: 22px;
            right: 22px;
          }
        }

        @media (max-width: 450px) {
          header {
            padding: 0 18px;
          }

          .headerRight span {
            display: none;
          }

          .hero h1 {
            font-size: 58px;
          }

          .ticketsSection {
            width:
              calc(
                100% - 24px
              );
          }

          .ticket {
            --stub-width: 70px;
            --notch-size: 9px;

            grid-template-columns:
              1fr var(--stub-width);

            border-radius: 13px;
          }

          .ticketMain {
            padding:
              23px 18px;
          }

          .ticket h2 {
            max-width: 80%;
            font-size: 28px;
          }

          .ticketBottom {
            left: 18px;
            right: 18px;
          }

          .ticketInnerFrame {
            inset: 5px;
          }

          .redeemedStamp {
            right: 14px;
            top: 88px;
            font-size: 9px;
          }

          .bigTicket {
            --big-stub-width: 55px;
            --big-notch-size: 10px;

            grid-template-columns:
              1fr var(--big-stub-width);
          }

          .bigTicketFor span:last-child {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

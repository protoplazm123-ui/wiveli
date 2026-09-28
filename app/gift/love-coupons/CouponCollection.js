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
<div className="couponExtras">
  <p className="extrasLabel">
    SOMETHING EXTRA FOR YOU ♡
  </p>

  <div className="extrasButtons">
    <button
      type="button"
      className={
        selectedCoupon.photoUrl
          ? "extraButton active"
          : "extraButton"
      }
      disabled={!selectedCoupon.photoUrl}
      onClick={() => {
        if (selectedCoupon.photoUrl) {
          window.open(
            selectedCoupon.photoUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }
      }}
    >
      <span>◇</span>
      PHOTO
    </button>

    <button
      type="button"
      className={
        selectedCoupon.videoUrl
          ? "extraButton active"
          : "extraButton"
      }
      disabled={!selectedCoupon.videoUrl}
      onClick={() => {
        if (selectedCoupon.videoUrl) {
          window.open(
            selectedCoupon.videoUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }
      }}
    >
      <span>▷</span>
      VIDEO
    </button>

    <button
      type="button"
      className={
        selectedCoupon.voiceUrl
          ? "extraButton active"
          : "extraButton"
      }
      disabled={!selectedCoupon.voiceUrl}
      onClick={() => {
        if (selectedCoupon.voiceUrl) {
          window.open(
            selectedCoupon.voiceUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }
      }}
    >
      <span>♪</span>
      VOICE
    </button>

    <button
      type="button"
      className={
        selectedCoupon.giftUrl
          ? "extraButton active"
          : "extraButton"
      }
      disabled={!selectedCoupon.giftUrl}
      onClick={() => {
        if (selectedCoupon.giftUrl) {
          window.open(
            selectedCoupon.giftUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }
      }}
    >
      <span>♡</span>
      GIFT
    </button>
  </div>

  {selectedCoupon.message && (
    <div className="couponMessage">
      <small>A NOTE FOR YOU</small>

      <p>
        “{selectedCoupon.message}”
      </p>
    </div>
  )}
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
  height: 100svh;
  min-height: 0;
  overflow: hidden;

  display: grid;
  grid-template-rows: 48px 180px minmax(0, 1fr);

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
  height: 48px;
  padding: 0 4vw;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom:
    1px solid rgba(80, 9, 20, 0.15);
}

.logo {
  font-family: Georgia, serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.headerRight {
  gap: 12px;
  font-size: 6px;
}

.headerRight i {
  font-size: 15px;
}

.hero {
  min-height: 0;
  height: 180px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 13px 20px 10px;
}

.eyebrow {
  margin: 0 0 7px;

  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.23em;
}

.hero h1 {
  margin: 0;

  font-family: Georgia, serif;

  font-size: clamp(38px, 4.4vw, 60px);

  line-height: 0.77;
  letter-spacing: -0.07em;
}

.hero h1 em {
  font-weight: 400;
}

.description {
  margin: 8px 0 0;

  font-family: Georgia, serif;
  font-size: 9px;
  line-height: 1.25;
}

.availability {
  margin-top: 9px;

  min-width: 180px;

  padding: 6px 12px;

  border:
    1px solid rgba(80, 9, 20, 0.22);

  border-radius: 100px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  background:
    rgba(255, 240, 236, 0.35);

  backdrop-filter: blur(8px);
}

.availabilityHeart {
  width: 24px;
  height: 24px;

  border-radius: 50%;

  display: grid;
  place-items: center;

  background: #5b0a16;
  color: #f4cfcb;

  font-size: 10px;
}

.availability small {
  font-size: 5px;
  margin-bottom: 1px;
}

.availability strong {
  font-family: Georgia, serif;
  font-size: 10px;
}

.ticketsSection {
  width: min(1280px, calc(100% - 42px));
  height: 100%;
  min-height: 0;

  margin: 0 auto;

  padding: 0 0 12px;

  display: flex;
  flex-direction: column;
}

.sectionTop {
  flex: 0 0 auto;

  padding: 7px 2px;

  display: flex;
  justify-content: space-between;

  border-top:
    1px solid rgba(80, 9, 20, 0.2);

  font-size: 5px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.tickets {
  flex: 1;
  min-height: 0;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  grid-template-rows:
    repeat(2, minmax(0, 1fr));

  gap: 9px;
}

.ticket {
  --stub-width: 52px;
  --notch-size: 7px;

  position: relative;

  width: 100%;
  height: 100%;
  min-height: 0;

  padding: 0;

  border: 1px solid #67111d;
  border-radius: 10px;

  background: #f3cfcb;
  color: #570c17;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr) var(--stub-width);

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  box-shadow:
    0 7px 16px rgba(78, 8, 18, 0.07);

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

  -webkit-mask-size: 100% 51%, 100% 51%;
  -webkit-mask-position: top left, bottom left;
  -webkit-mask-repeat: no-repeat;

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

  mask-size: 100% 51%, 100% 51%;
  mask-position: top left, bottom left;
  mask-repeat: no-repeat;
}

.ticket:hover:not(:disabled) {
  transform: translateY(-3px);

  box-shadow:
    0 12px 22px rgba(78, 8, 18, 0.13);
}

.ticketInnerFrame {
  position: absolute;

  z-index: 3;

  inset: 4px;

  border:
    1px solid rgba(103, 17, 29, 0.28);

  border-radius: 7px;

  pointer-events: none;
}

.ticketMain {
  position: relative;

  min-width: 0;

  padding: 12px 13px 10px;
}

.ticketMeta {
  display: flex;
  justify-content: space-between;

  gap: 5px;

  font-size: 4px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.ticketHeart {
  position: absolute;

  right: 12px;
  top: 31px;

  font-family: Georgia, serif;
  font-size: 18px;
}

.ticket h2 {
  max-width: 77%;

  margin: 18px 0 3px;

  font-family: Georgia, serif;
  font-style: italic;

  font-size: clamp(14px, 1.35vw, 21px);

  line-height: 0.9;
  letter-spacing: -0.04em;
}

.ticket p {
  margin: 0;

  font-family: Georgia, serif;

  font-size: 7px;
  line-height: 1.15;
}

.ticketBottom {
  position: absolute;

  left: 13px;
  right: 13px;
  bottom: 9px;

  display: flex;
  justify-content: space-between;

  gap: 5px;

  font-size: 4px;
  font-weight: 700;
  letter-spacing: 0.09em;
}

.ticketStub {
  border-left:
    1px dashed #68111d;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 4px;
}

.ticketStub small {
  font-size: 4px;
  letter-spacing: 0.12em;
}

.ticketStub strong {
  font-family: Georgia, serif;
  font-size: 15px;
}

.ticketStub > span {
  font-family: Georgia, serif;
  font-size: 12px;
}

.barcode {
  height: 18px;

  display: flex;
  align-items: stretch;

  gap: 1px;
}

.barcode i {
  display: block;

  width: 1px;

  background: #5b0a16;
}

.barcode i:nth-child(2),
.barcode i:nth-child(5),
.barcode i:nth-child(8) {
  width: 2px;
}

.redeemedStamp {
  right: 10px;
  top: 45px;

  padding: 3px 6px;

  border-width: 2px;

  font-size: 5px;
}

footer {
  display: none;
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
.couponExtras {
  margin-top: 20px;
}

.extrasLabel {
  margin: 0 0 10px;

  font-family: Arial, sans-serif;
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.extrasButtons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.extraButton {
  min-height: 48px;

  border:
    1px solid rgba(87, 10, 22, 0.18);

  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 4px;

  background:
    rgba(255, 240, 236, 0.25);

  color:
    rgba(87, 10, 22, 0.3);

  font-family: Arial, sans-serif;
  font-size: 5px;
  font-weight: 800;
  letter-spacing: 0.12em;

  cursor: default;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.extraButton span {
  font-family: Georgia, serif;
  font-size: 15px;
}

.extraButton.active {
  border-color: #570a16;

  background: #570a16;
  color: #f5d3cf;

  cursor: pointer;

  box-shadow:
    0 6px 15px
    rgba(87, 10, 22, 0.16);
}

.extraButton.active:hover {
  transform: translateY(-2px);

  box-shadow:
    0 9px 18px
    rgba(87, 10, 22, 0.22);
}

.couponMessage {
  margin-top: 10px;
  padding: 12px 16px;

  border:
    1px solid rgba(87, 10, 22, 0.18);

  border-radius: 10px;

  background:
    rgba(255, 240, 236, 0.28);

  text-align: left;
}

.couponMessage small {
  display: block;

  margin-bottom: 5px;

  font-family: Arial, sans-serif;
  font-size: 5px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.couponMessage p {
  margin: 0;

  font-family: Georgia, serif;
  font-size: 12px;
  font-style: italic;
  line-height: 1.35;
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

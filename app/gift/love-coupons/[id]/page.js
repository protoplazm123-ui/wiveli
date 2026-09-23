"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CouponCollection from "../CouponCollection";
import TicketPrinter from "../TicketPrinter";
import RedemptionResult from "../RedemptionResult";

import { couponIdeas } from "../../../experiences/love-coupons/coupons";

import {
  saveLoveCouponsGift,
  redeemLoveCoupon,
} from "../../../experiences/love-coupons/storage";

export default function PrivateLoveCouponsGift() {
  const params = useParams();
  const id = params?.id;

  const [gift, setGift] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const [screen, setScreen] = useState("intro");
  const [redeemedCoupon, setRedeemedCoupon] = useState(null);
  const [redemption, setRedemption] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function loadGift() {
      try {
        const response = await fetch(
          `/api/gifts/${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Gift not found");
        }

        const data = await response.json();

        if (
          !data.success ||
          data.giftType !== "love-coupons" ||
          !data.giftData
        ) {
          throw new Error("Invalid gift");
        }

        const loadedGift = {
          ...data.giftData,
          serverId: data.id,
        };

        setGift(loadedGift);

        // Temporary local copy so the existing redemption
        // prototype continues to work on this device.
        saveLoveCouponsGift(loadedGift);
      } catch (loadError) {
        console.error(loadError);
        setError(true);
      } finally {
        setReady(true);
      }
    }

    loadGift();
  }, [id]);

  if (!ready) {
    return (
      <main className="status">
        <span>WI♡ELI</span>
        <h1>Opening your gift… ♡</h1>

        <style jsx>{`
          .status {
            min-height: 100svh;
            display: grid;
            place-content: center;
            text-align: center;
            padding: 24px;
            background: #f3cbc8;
            color: #4c0710;
            font-family: Georgia, serif;
          }

          span {
            font-size: 16px;
            letter-spacing: 0.15em;
          }

          h1 {
            margin: 18px 0 0;
            font-size: clamp(36px, 7vw, 64px);
            font-weight: 400;
          }
        `}</style>
      </main>
    );
  }

  if (error || !gift) {
    return (
      <main className="status">
        <span>WI♡ELI</span>
        <h1>This gift couldn't be found ♡</h1>
        <p>Please check the private link and try again.</p>

        <style jsx>{`
          .status {
            min-height: 100svh;
            display: grid;
            place-content: center;
            text-align: center;
            padding: 24px;
            background: #f3cbc8;
            color: #4c0710;
            font-family: Georgia, serif;
          }

          span {
            font-size: 16px;
            letter-spacing: 0.15em;
          }

          h1 {
            margin: 18px 0 10px;
            font-size: clamp(36px, 7vw, 64px);
            font-weight: 400;
          }

          p {
            margin: 0;
            font-family: Arial, sans-serif;
            font-size: 14px;
          }
        `}</style>
      </main>
    );
  }

  const readyMadeCoupons = couponIdeas.filter((coupon) =>
    gift.couponIds?.includes(coupon.id)
  );

  const customCoupons = gift.customCoupons || [];

  const selectedCoupons = [
    ...readyMadeCoupons,
    ...customCoupons,
  ];

  function handleRedeem(coupon) {
    const result = redeemLoveCoupon(coupon.id);

    if (result.ok) {
      setGift(result.gift);
      setRedeemedCoupon(coupon);
      setRedemption(result.redemption);
      setScreen("redeemed");
      return;
    }

    if (result.reason === "already-redeemed") {
      setRedeemedCoupon(coupon);
      setRedemption(result.redemption);
      setScreen("redeemed");
      return;
    }

    if (result.reason === "daily-limit") {
      alert(
        "You've used all of your Love Coupons for today ♡"
      );
      return;
    }

    alert("Something went wrong. Please try again ♡");
  }

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

  if (screen === "redeemed") {
    return (
      <RedemptionResult
        coupon={redeemedCoupon}
        redemption={redemption}
        senderName={gift.senderName}
        onBack={() => setScreen("collection")}
      />
    );
  }

  if (screen === "collection") {
    return (
      <CouponCollection
        coupons={selectedCoupons}
        gift={gift}
        onRedeem={handleRedeem}
      />
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
              rgba(255, 255, 255, 0.3) 0 1px,
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
          border:
            1px solid rgba(247, 216, 211, 0.35);
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

          .one {
            left: -15px;
          }

          .two {
            right: -8px;
          }
        }
      `}</style>
    </main>
  );
}

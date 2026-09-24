"use client";

import { useState } from "react";

export default function RedemptionResult({
  coupon,
  redemption,
  senderName,
  onBack,
}) {
  const [shareStatus, setShareStatus] = useState("");

  if (!coupon || !redemption) return null;

  async function handleTellSender() {
    const message =
      `I just redeemed "${coupon.title}" on WIVELI ♡\n` +
      `Redemption code: ${redemption.code}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "WIVELI Love Coupon",
          text: message,
        });

        setShareStatus("READY TO SEND ♡");
        return;
      }

      await navigator.clipboard.writeText(message);
      setShareStatus("MESSAGE COPIED ✓");
    } catch (error) {
      if (error?.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(message);
          setShareStatus("MESSAGE COPIED ✓");
        } catch {
          setShareStatus("COPY THE CODE ABOVE ♡");
        }
      }
    }
  }

  return (
    <main className="page">
      <div className="decor decorHeart">♡</div>
      <div className="decor decorStar">✦</div>
      <div className="decor decorTinyHeart">♥</div>

      <header>
        <span className="logo">WI♡ELI</span>

        <div className="headerRight">
          <span>LOVE COUPONS</span>
          <i>♡</i>
        </div>
      </header>

      <section className="content">
        <div className="successSeal">
          <span>♥</span>
        </div>

        <p className="eyebrow">
          COUPON REDEEMED
        </p>

        <h1>
          IT&apos;S
          <br />
          <em>OFFICIAL.</em>
        </h1>

        <p className="intro">
          One little promise has officially
          <br />
          become yours ♡
        </p>

        <div className="ticket">
          <span className="ticketInnerFrame" />

          <div className="ticketMain">
            <div className="ticketTop">
              <span>WI♡ELI</span>
              <span>LOVE COUPON</span>
            </div>

            <div className="ticketHeart">
              ♡
            </div>

            <h2>{coupon.title}</h2>

            <p>{coupon.subtitle}</p>

            <div className="redeemedStamp">
              REDEEMED
            </div>

            <div className="ticketBottom">
              <span>A LITTLE PROMISE</span>
              <span>CLAIMED WITH LOVE ♡</span>
            </div>
          </div>

          <div className="stub">
            <small>USED</small>

            <strong>♥</strong>

            <div className="miniBarcode">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <span>♡</span>
          </div>
        </div>

        <div className="codeCard">
          <div className="codeLabel">
            <span>YOUR REDEMPTION CODE</span>
            <i>♡</i>
          </div>

          <strong>{redemption.code}</strong>

          <p>
            Keep this code with your coupon.
            It belongs to this promise only.
          </p>
        </div>

        <div className="nextStep">
          <div className="nextStepIcon">
            ♡
          </div>

          <div className="nextStepCopy">
            <small>NEXT STEP</small>

            <strong>
              Tell {senderName || "your person"} ♡
            </strong>

            <p>
              Share the good news — this promise
              has officially been claimed.
            </p>
          </div>

          <button
            type="button"
            className="tellButton"
            onClick={handleTellSender}
          >
            TELL{" "}
            {senderName
              ? senderName.toUpperCase()
              : "THEM"}{" "}
            ♡
          </button>
        </div>

        {shareStatus && (
          <p className="shareStatus">
            {shareStatus}
          </p>
        )}

        <button
          type="button"
          className="back"
          onClick={onBack}
        >
          <span>BACK TO MY COUPONS</span>
          <i>→</i>
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
              circle at 50% 8%,
              #f9e4df 0%,
              #f0ccc8 45%,
              #e2b5b3 100%
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
            1px solid
            rgba(82, 9, 20, 0.14);

          position: relative;
          z-index: 5;
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
          font-weight: 800;

          letter-spacing: 0.2em;
        }

        .headerRight i {
          font-family: Georgia, serif;

          font-size: 19px;
          font-style: normal;
        }

        .content {
          width:
            min(
              680px,
              calc(100% - 32px)
            );

          margin: 0 auto;

          padding:
            64px 0 85px;

          position: relative;
          z-index: 2;

          text-align: center;
        }

        .successSeal {
          width: 56px;
          height: 56px;

          margin:
            0 auto 26px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #570a16;
          color: #f3cfcb;

          box-shadow:
            0 15px 35px
            rgba(75, 6, 16, 0.18);

          animation:
            sealAppear
            0.55s
            cubic-bezier(
              0.2,
              0.8,
              0.2,
              1
            )
            both;
        }

        .successSeal span {
          font-size: 18px;
        }

        .eyebrow {
          margin:
            0 0 18px;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.23em;

          animation:
            rise
            0.55s
            0.1s
            ease
            both;
        }

        h1 {
          margin: 0;

          font-family: Georgia, serif;

          font-size:
            clamp(
              68px,
              10vw,
              108px
            );

          line-height: 0.76;

          letter-spacing: -0.07em;

          animation:
            rise
            0.65s
            0.16s
            ease
            both;
        }

        h1 em {
          font-weight: 400;
        }

        .intro {
          margin:
            29px 0 42px;

          font-family: Georgia, serif;

          font-size: 15px;
          line-height: 1.55;

          animation:
            rise
            0.6s
            0.24s
            ease
            both;
        }

        /*
          SAME PHYSICAL TICKET SHAPE
          AS THE COLLECTION
        */

        .ticket {
          --stub-width: 95px;
          --notch-size: 13px;

          width: 100%;

          min-height: 270px;

          position: relative;

          display: grid;

          grid-template-columns:
            1fr var(--stub-width);

          border:
            1px solid #65101c;

          border-radius: 17px;

          background: #f6d4d0;
          color: #570a16;

          text-align: left;

          box-shadow:
            0 25px 55px
            rgba(70, 7, 16, 0.15);

          transform:
            rotate(-1deg);

          animation:
            ticketArrive
            0.75s
            0.32s
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;

          -webkit-mask-image:
            radial-gradient(
              circle var(--notch-size)
                at calc(
                  100% -
                  var(--stub-width)
                )
                0,
              transparent
                0
                calc(
                  var(--notch-size) -
                  1px
                ),
              #000
                var(--notch-size)
            ),
            radial-gradient(
              circle var(--notch-size)
                at calc(
                  100% -
                  var(--stub-width)
                )
                100%,
              transparent
                0
                calc(
                  var(--notch-size) -
                  1px
                ),
              #000
                var(--notch-size)
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
                at calc(
                  100% -
                  var(--stub-width)
                )
                0,
              transparent
                0
                calc(
                  var(--notch-size) -
                  1px
                ),
              #000
                var(--notch-size)
            ),
            radial-gradient(
              circle var(--notch-size)
                at calc(
                  100% -
                  var(--stub-width)
                )
                100%,
              transparent
                0
                calc(
                  var(--notch-size) -
                  1px
                ),
              #000
                var(--notch-size)
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

        .ticketInnerFrame {
          position: absolute;

          z-index: 3;

          inset: 7px;

          border:
            1px solid
            rgba(
              101,
              16,
              28,
              0.26
            );

          border-radius: 11px;

          pointer-events: none;
        }

        .ticketMain {
          position: relative;

          padding:
            30px 31px;
        }

        .ticketTop {
          display: flex;

          justify-content:
            space-between;

          font-size: 6px;
          font-weight: 800;

          letter-spacing: 0.16em;
        }

        .ticketHeart {
          position: absolute;

          right: 30px;
          top: 60px;

          font-family: Georgia, serif;

          font-size: 38px;
        }

        .ticket h2 {
          max-width: 77%;

          margin:
            53px 0 8px;

          font-family: Georgia, serif;

          font-size:
            clamp(
              32px,
              6vw,
              48px
            );

          font-style: italic;

          line-height: 0.88;

          letter-spacing: -0.045em;
        }

        .ticketMain > p {
          margin: 0;

          font-family: Georgia, serif;

          font-size: 12px;
        }

        /*
          THE STAMP LANDS
          AFTER THE TICKET ARRIVES
        */

        .redeemedStamp {
          position: absolute;

          z-index: 6;

          right: 22px;
          bottom: 47px;

          padding:
            8px 14px;

          border:
            3px solid
            #68111d;

          border-radius: 4px;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 0.13em;

          transform:
            rotate(-9deg);

          opacity: 0;

          animation:
            stampIn
            0.5s
            0.95s
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            forwards;
        }

        .ticketBottom {
          position: absolute;

          left: 31px;
          right: 31px;
          bottom: 22px;

          display: flex;

          justify-content:
            space-between;

          font-size: 6px;
          font-weight: 800;

          letter-spacing: 0.12em;
        }

        .stub {
          position: relative;

          border-left:
            1px dashed #68111d;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content:
            space-around;

          padding:
            23px 0;
        }

        .stub small {
          font-size: 6px;
          font-weight: 800;

          letter-spacing: 0.17em;
        }

        .stub strong {
          font-family: Georgia, serif;

          font-size: 24px;

          font-weight: 400;
        }

        .stub > span {
          font-family: Georgia, serif;

          font-size: 21px;
        }

        .miniBarcode {
          height: 42px;

          display: flex;
          align-items: stretch;

          gap: 2px;
        }

        .miniBarcode i {
          display: block;

          width: 2px;

          background: #570a16;
        }

        .miniBarcode
          i:nth-child(2),
        .miniBarcode
          i:nth-child(5) {
          width: 4px;
        }

        /*
          REDEMPTION CODE
        */

        .codeCard {
          margin-top: 30px;

          padding:
            29px 24px 27px;

          position: relative;

          border:
            1px solid
            rgba(
              82,
              9,
              20,
              0.2
            );

          border-radius: 18px;

          background:
            rgba(
              255,
              240,
              237,
              0.38
            );

          backdrop-filter:
            blur(10px);

          animation:
            rise
            0.6s
            1.05s
            ease
            both;
        }

        .codeLabel {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          font-size: 7px;
          font-weight: 800;

          letter-spacing: 0.19em;
        }

        .codeLabel i {
          font-family: Georgia, serif;

          font-size: 15px;
          font-style: normal;
        }

        .codeCard strong {
          display: block;

          margin-top: 10px;

          font-family: Georgia, serif;

          font-size:
            clamp(
              32px,
              6vw,
              42px
            );

          letter-spacing: 0.035em;
        }

        .codeCard p {
          margin:
            9px 0 0;

          font-family: Georgia, serif;

          font-size: 11px;

          line-height: 1.45;

          opacity: 0.68;
        }

        /*
          TELL THE SENDER
        */

        .nextStep {
          margin-top: 16px;

          padding:
            20px 20px;

          border:
            1px solid
            rgba(
              82,
              9,
              20,
              0.16
            );

          border-radius: 18px;

          display: grid;

          grid-template-columns:
            44px 1fr auto;

          align-items: center;

          gap: 15px;

          text-align: left;

          background:
            rgba(
              255,
              237,
              234,
              0.2
            );

          animation:
            rise
            0.6s
            1.16s
            ease
            both;
        }

        .nextStepIcon {
          width: 44px;
          height: 44px;

          border-radius: 50%;

          display: grid;
          place-items: center;

          background: #570a16;
          color: #f2c8c5;

          font-family: Georgia, serif;

          font-size: 20px;
        }

        .nextStepCopy small {
          display: block;

          margin-bottom: 4px;

          font-size: 6px;
          font-weight: 800;

          letter-spacing: 0.16em;
        }

        .nextStepCopy strong {
          display: block;

          font-family: Georgia, serif;

          font-size: 16px;
        }

        .nextStepCopy p {
          max-width: 270px;

          margin:
            4px 0 0;

          font-size: 9px;

          line-height: 1.4;

          opacity: 0.65;
        }

        .tellButton {
          min-width: 142px;

          min-height: 46px;

          padding:
            0 17px;

          border:
            1px solid #570a16;

          border-radius: 100px;

          background: transparent;

          color: #570a16;

          font-size: 7px;
          font-weight: 800;

          letter-spacing: 0.12em;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .tellButton:hover {
          background: #570a16;

          color: #f4cfcb;

          transform:
            translateY(-2px);
        }

        .shareStatus {
          margin:
            12px 0 0;

          font-size: 7px;
          font-weight: 800;

          letter-spacing: 0.15em;

          animation:
            rise
            0.3s
            ease
            both;
        }

        /*
          BACK
        */

        .back {
          width:
            min(
              370px,
              100%
            );

          height: 58px;

          margin-top: 27px;

          border: none;

          border-radius: 100px;

          background: #570a16;

          color: #f4cfcb;

          padding:
            0 25px;

          display: inline-flex;

          justify-content:
            space-between;

          align-items: center;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.12em;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

          animation:
            rise
            0.6s
            1.27s
            ease
            both;
        }

        .back:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 14px 30px
            rgba(
              82,
              9,
              20,
              0.16
            );
        }

        .back i {
          font-size: 18px;

          font-style: normal;
        }

        .footerNote {
          margin:
            29px 0 0;

          font-size: 6px;
          font-weight: 800;

          letter-spacing: 0.18em;

          opacity: 0.52;

          animation:
            rise
            0.6s
            1.34s
            ease
            both;
        }

        /*
          BACKGROUND DETAILS
        */

        .decor {
          position: absolute;

          pointer-events: none;

          color:
            rgba(
              82,
              9,
              20,
              0.075
            );

          font-family: Georgia, serif;

          user-select: none;
        }

        .decorHeart {
          left: 5%;
          top: 24%;

          font-size: 120px;

          transform:
            rotate(-14deg);

          animation:
            floatOne
            8s
            ease-in-out
            infinite;
        }

        .decorTinyHeart {
          right: 7%;
          top: 42%;

          font-size: 54px;

          transform:
            rotate(13deg);

          animation:
            floatTwo
            7s
            ease-in-out
            infinite;
        }

        .decorStar {
          right: 12%;
          bottom: 10%;

          font-size: 70px;

          animation:
            floatOne
            9s
            ease-in-out
            infinite
            reverse;
        }

        /*
          ANIMATIONS
        */

        @keyframes sealAppear {
          from {
            opacity: 0;

            transform:
              scale(0.6)
              rotate(-15deg);
          }

          to {
            opacity: 1;

            transform:
              scale(1)
              rotate(0);
          }
        }

        @keyframes rise {
          from {
            opacity: 0;

            transform:
              translateY(18px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        @keyframes ticketArrive {
          from {
            opacity: 0;

            transform:
              translateY(45px)
              rotate(-4deg)
              scale(0.94);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              rotate(-1deg)
              scale(1);
          }
        }

        @keyframes stampIn {
          0% {
            opacity: 0;

            transform:
              rotate(-9deg)
              scale(1.8);
          }

          70% {
            opacity: 0.85;

            transform:
              rotate(-9deg)
              scale(0.92);
          }

          100% {
            opacity: 0.78;

            transform:
              rotate(-9deg)
              scale(1);
          }
        }

        @keyframes floatOne {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(-14deg);
          }

          50% {
            transform:
              translateY(-12px)
              rotate(-10deg);
          }
        }

        @keyframes floatTwo {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(13deg);
          }

          50% {
            transform:
              translateY(10px)
              rotate(17deg);
          }
        }

        /*
          TABLET / MOBILE
        */

        @media (max-width: 700px) {
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
            --stub-width: 68px;
            --notch-size: 10px;

            min-height: 240px;

            grid-template-columns:
              1fr var(--stub-width);
          }

          .ticketMain {
            padding:
              23px 20px;
          }

          .ticket h2 {
            margin-top: 47px;

            font-size: 34px;
          }

          .ticketHeart {
            right: 19px;
            top: 55px;

            font-size: 31px;
          }

          .ticketBottom {
            left: 20px;
            right: 20px;
          }

          .ticketBottom
            span:last-child {
            display: none;
          }

          .redeemedStamp {
            right: 14px;
            bottom: 44px;

            font-size: 8px;

            padding:
              6px 9px;
          }

          .nextStep {
            grid-template-columns:
              44px 1fr;

            padding:
              18px;
          }

          .tellButton {
            grid-column:
              1 / -1;

            width: 100%;
          }

          .decor {
            display: none;
          }
        }

        @media (max-width: 430px) {
          .headerRight span {
            display: none;
          }

          .content {
            width:
              calc(
                100% - 24px
              );
          }

          .successSeal {
            width: 50px;
            height: 50px;
          }

          h1 {
            font-size: 60px;
          }

          .intro {
            font-size: 14px;
          }

          .ticket {
            --stub-width: 58px;
            --notch-size: 9px;

            min-height: 225px;
          }

          .ticketMain {
            padding:
              21px 17px;
          }

          .ticketTop {
            font-size: 5px;
          }

          .ticketHeart {
            right: 15px;

            font-size: 28px;
          }

          .ticket h2 {
            max-width: 79%;

            margin-top: 45px;

            font-size: 30px;
          }

          .ticketMain > p {
            font-size: 11px;
          }

          .ticketBottom {
            left: 17px;
            right: 17px;

            font-size: 5px;
          }

          .redeemedStamp {
            right: 11px;

            border-width: 2px;

            font-size: 7px;
          }

          .stub strong {
            font-size: 19px;
          }

          .miniBarcode {
            height: 35px;
          }

          .codeCard {
            padding:
              25px 15px;
          }

          .codeCard strong {
            font-size: 30px;

            overflow-wrap: anywhere;
          }

          .nextStepCopy strong {
            font-size: 15px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

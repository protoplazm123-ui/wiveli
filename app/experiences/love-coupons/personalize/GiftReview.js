"use client";

export default function GiftReview({
  senderName,
  recipientName,
  coupons = [],
  dailyLimit,
  contactType,
  contact,
  onBack,
  onCreate,
}) {
  return (
    <main className="review">
      <header>
        <span className="logo">WI♡ELI</span>
        <span className="tiny">FINAL CHECK</span>
      </header>

      <section className="hero">
        <p className="eyebrow">ONE LAST LOOK ♡</p>

        <h1>
          READY TO
          <br />
          <em>MAKE THEIR DAY?</em>
        </h1>

        <p className="description">
          Check everything before your Love Coupons
          are wrapped up and ready to send.
        </p>
      </section>

      <section className="reviewGrid">
        <div className="mainCard">
          <div className="cardNumber">01</div>

          <p className="label">THIS GIFT IS FROM</p>

          <h2>{senderName}</h2>

          <div className="heartLine">
            <span />
            <b>♡</b>
            <span />
          </div>

          <p className="label">AND IT'S FOR</p>

          <h2>{recipientName}</h2>

          <p className="loveNote">
            A little collection of promises,
            made especially for them.
          </p>
        </div>

        <div className="details">
          <div className="detailCard">
            <div>
              <small>COUPONS</small>
              <strong>{coupons.length}</strong>
            </div>

            <span>little promises ♡</span>
          </div>

          <div className="detailCard">
            <div>
              <small>DAILY LIMIT</small>

              <strong>
                {dailyLimit === "unlimited"
                  ? "∞"
                  : dailyLimit}
              </strong>
            </div>

            <span>
              {dailyLimit === "unlimited"
                ? "use anytime"
                : Number(dailyLimit) === 1
                ? "coupon per day"
                : "coupons per day"}
            </span>
          </div>

          <div className="contactCard">
            <small>REDEMPTION CONTACT</small>

            <div className="contactRow">
              <span className="contactIcon">♡</span>

              <div>
                <strong>{contactType}</strong>
                <p>{contact}</p>
              </div>
            </div>

            <p className="contactNote">
              Automatic redemption notifications
              will be connected later.
            </p>
          </div>
        </div>
      </section>

      <section className="couponSection">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">02 · INSIDE THE GIFT</p>

            <h2>
              THEIR LITTLE
              <br />
              <em>PROMISES.</em>
            </h2>
          </div>

          <span>{coupons.length} TOTAL</span>
        </div>

        <div className="couponList">
          {coupons.map((coupon, index) => (
            <div
              className={`ticket ${
                coupon.special ? "special" : ""
              }`}
              key={coupon.id}
            >
              <div className="ticketMain">
                <small>WI♡ELI · LOVE COUPON</small>

                <h3>{coupon.title}</h3>

                <p>{coupon.subtitle}</p>

                {coupon.custom && (
                  <span className="customBadge">
                    MADE BY YOU ♡
                  </span>
                )}
              </div>

              <div className="stub">
                <small>NO.</small>

                <strong>
                  {String(index + 1).padStart(2, "0")}
                </strong>

                <div className="barcode">
                  ||| || ||| |
                </div>

                <span>♡</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="finish">
        <p>EVERYTHING LOOK GOOD?</p>

        <h2>
          THEN LET'S MAKE IT
          <br />
          <em>OFFICIAL.</em>
        </h2>

        <div className="actions">
          <button
            type="button"
            className="back"
            onClick={onBack}
          >
            ← BACK TO EDIT
          </button>

          <button
            type="button"
            className="create"
            onClick={onCreate}
          >
            CREATE MY GIFT
            <span>♥</span>
          </button>
        </div>

        <small className="prototypeNote">
          Your gift is currently saved on this device
          for the WIVELI prototype.
        </small>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .review {
          min-height: 100svh;
          background:
            radial-gradient(
              circle at 50% 0%,
              #f9dfda 0%,
              transparent 35%
            ),
            #efc6c3;
          color: #4e0914;
        }

        header {
          height: 76px;
          padding: 0 5vw;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid rgba(78, 9, 20, 0.16);
        }

        .logo {
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .tiny {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .hero {
          padding: 90px 5vw 80px;
          text-align: center;
        }

        .eyebrow {
          margin: 0 0 18px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .hero h1 {
          margin: 0;

          font-family: Georgia, serif;
          font-size: clamp(64px, 9vw, 125px);
          line-height: 0.77;
          letter-spacing: -0.07em;
        }

        .hero h1 em,
        .sectionHeading h2 em,
        .finish h2 em {
          font-weight: 400;
        }

        .description {
          max-width: 470px;
          margin: 32px auto 0;

          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.6;
        }

        .reviewGrid {
          width: min(1100px, calc(100% - 40px));
          margin: 0 auto;

          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 18px;
        }

        .mainCard {
          min-height: 440px;
          padding: 48px;

          position: relative;

          display: flex;
          flex-direction: column;
          justify-content: center;

          border: 1px solid #65101c;
          border-radius: 24px;

          background: #f5d4d0;
          text-align: center;

          box-shadow:
            0 20px 50px rgba(70, 6, 16, 0.08);
        }

        .cardNumber {
          position: absolute;
          left: 25px;
          top: 22px;

          font-family: Georgia, serif;
          font-size: 13px;
        }

        .label {
          margin: 0 0 8px;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .mainCard h2 {
          margin: 0;

          font-family: Georgia, serif;
          font-size: clamp(43px, 6vw, 70px);
          line-height: 0.95;
          letter-spacing: -0.05em;
        }

        .heartLine {
          margin: 27px auto;

          width: min(280px, 90%);

          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 13px;
        }

        .heartLine span {
          height: 1px;
          background: rgba(78, 9, 20, 0.25);
        }

        .heartLine b {
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 400;
        }

        .loveNote {
          margin: 32px auto 0;
          max-width: 300px;

          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
          line-height: 1.5;
        }

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .detailCard,
        .contactCard {
          border:
            1px solid rgba(78, 9, 20, 0.25);

          border-radius: 24px;

          background:
            rgba(255, 234, 229, 0.5);
        }

        .detailCard {
          min-height: 180px;
          padding: 25px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .detailCard small,
        .contactCard > small {
          display: block;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .detailCard strong {
          display: block;
          margin-top: 12px;

          font-family: Georgia, serif;
          font-size: 57px;
          line-height: 0.9;
        }

        .detailCard > span {
          font-family: Georgia, serif;
          font-size: 12px;
          font-style: italic;
        }

        .contactCard {
          grid-column: 1 / -1;
          min-height: 240px;
          padding: 28px;

          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .contactRow {
          margin-top: 28px;

          display: flex;
          align-items: center;
          gap: 15px;
        }

        .contactIcon {
          width: 46px;
          height: 46px;

          flex: 0 0 auto;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #550a16;
          color: #f3cbc7;

          font-family: Georgia, serif;
          font-size: 20px;
        }

        .contactRow strong {
          display: block;

          font-family: Georgia, serif;
          font-size: 20px;
        }

        .contactRow p {
          margin: 3px 0 0;
          font-size: 12px;
        }

        .contactNote {
          margin: 24px 0 0;

          padding-top: 17px;

          border-top:
            1px solid rgba(78, 9, 20, 0.15);

          font-size: 9px;
          line-height: 1.5;
          opacity: 0.65;
        }

        .couponSection {
          width: min(1100px, calc(100% - 40px));
          margin: 110px auto 0;
        }

        .sectionHeading {
          margin-bottom: 35px;

          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          border-bottom:
            1px solid rgba(78, 9, 20, 0.2);

          padding-bottom: 27px;
        }

        .sectionHeading h2 {
          margin: 0;

          font-family: Georgia, serif;
          font-size: clamp(48px, 7vw, 85px);
          line-height: 0.8;
          letter-spacing: -0.06em;
        }

        .sectionHeading > span {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .couponList {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .ticket {
          min-height: 205px;

          display: grid;
          grid-template-columns: 1fr 80px;

          border: 1px solid #64101b;

          background: #f5d2ce;
          color: #530a15;

          overflow: hidden;

          box-shadow:
            0 13px 30px rgba(69, 6, 15, 0.07);
        }

        .ticketMain {
          position: relative;
          padding: 25px;
        }

        .ticketMain > small {
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .ticket h3 {
          max-width: 85%;

          margin: 43px 0 7px;

          font-family: Georgia, serif;
          font-size: 31px;
          font-style: italic;
          line-height: 0.9;
          letter-spacing: -0.035em;
        }

        .ticket p {
          margin: 0;

          font-family: Georgia, serif;
          font-size: 11px;
        }

        .customBadge {
          position: absolute;
          left: 25px;
          bottom: 18px;

          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .stub {
          position: relative;

          border-left: 1px dashed currentColor;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .stub::before,
        .stub::after {
          content: "";

          position: absolute;
          left: -8px;

          width: 15px;
          height: 15px;

          border-radius: 50%;

          background: #edc4c1;
        }

        .stub::before {
          top: -8px;
        }

        .stub::after {
          bottom: -8px;
        }

        .stub small {
          font-size: 6px;
          letter-spacing: 0.15em;
        }

        .stub strong {
          font-family: Georgia, serif;
          font-size: 23px;
        }

        .barcode {
          font-size: 8px;
          letter-spacing: -1px;
        }

        .stub > span {
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .ticket.special {
          background: #560a16;
          color: #f2cbc7;
        }

        .special .stub::before,
        .special .stub::after {
          background: #e6b8b5;
        }

        .finish {
          margin-top: 110px;
          padding: 100px 20px 90px;

          background:
            radial-gradient(
              circle at 50% 30%,
              #721522,
              #4a0711 58%,
              #31040a
            );

          color: #f4cfcb;
          text-align: center;
        }

        .finish > p {
          margin: 0 0 20px;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .finish h2 {
          margin: 0;

          font-family: Georgia, serif;
          font-size: clamp(55px, 8vw, 105px);
          line-height: 0.8;
          letter-spacing: -0.065em;
        }

        .actions {
          width: min(620px, 100%);
          margin: 45px auto 0;

          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          gap: 12px;
        }

        .actions button {
          height: 60px;

          border-radius: 100px;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.12em;

          cursor: pointer;
        }

        .back {
          border:
            1px solid rgba(244, 207, 203, 0.35);

          background: transparent;
          color: #f4cfcb;
        }

        .create {
          padding: 0 24px;

          border: none;

          background: #f3cbc7;
          color: #4d0711;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .create span {
          font-size: 17px;
        }

        .prototypeNote {
          display: block;

          margin: 25px auto 0;

          font-size: 7px;
          letter-spacing: 0.08em;

          opacity: 0.55;
        }

        @media (max-width: 760px) {
          .hero {
            padding:
              65px 20px 55px;
          }

          .hero h1 {
            font-size: 62px;
          }

          .reviewGrid {
            width:
              calc(100% - 24px);

            grid-template-columns: 1fr;
          }

          .mainCard {
            min-height: 390px;
            padding: 35px 20px;
          }

          .details {
            grid-template-columns: 1fr 1fr;
          }

          .couponSection {
            width:
              calc(100% - 24px);

            margin-top: 80px;
          }

          .couponList {
            grid-template-columns: 1fr;
          }

          .sectionHeading {
            align-items: flex-start;
          }

          .sectionHeading h2 {
            font-size: 52px;
          }

          .ticket {
            min-height: 190px;
          }

          .actions {
            grid-template-columns: 1fr;
          }

          .create {
            order: -1;
          }
        }

        @media (max-width: 450px) {
          header {
            padding: 0 18px;
          }

          .hero h1 {
            font-size: 53px;
          }

          .details {
            grid-template-columns: 1fr;
          }

          .contactCard {
            grid-column: auto;
          }

          .detailCard {
            min-height: 145px;
          }

          .sectionHeading h2 {
            font-size: 45px;
          }

          .sectionHeading > span {
            display: none;
          }

          .ticket {
            grid-template-columns: 1fr 65px;
          }

          .ticketMain {
            padding: 20px;
          }

          .ticket h3 {
            font-size: 27px;
          }

          .customBadge {
            left: 20px;
          }

          .finish {
            padding:
              80px 15px 70px;
          }

          .finish h2 {
            font-size: 53px;
          }
        }
      `}</style>
    </main>
  );
}

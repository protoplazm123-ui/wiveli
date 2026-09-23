"use client";

import { useMemo, useState } from "react";
import { couponIdeas, couponCategories } from "../coupons";
import {
  createLoveCouponsGift,
  saveLoveCouponsGift,
} from "../storage";
import GiftReview from "./GiftReview";

export default function LoveCouponsPersonalize() {
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const [couponCount, setCouponCount] = useState(12);
  const [selected, setSelected] = useState([]);
  const [customCoupons, setCustomCoupons] = useState([]);

  const [category, setCategory] = useState("all");

  const [contactType, setContactType] = useState("WhatsApp");
  const [contact, setContact] = useState("");

  const [dailyLimit, setDailyLimit] = useState(3);

  const [showCustom, setShowCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");

  const [showReview, setShowReview] = useState(false);

  const totalSelected =
    selected.length + customCoupons.length;

  const remaining =
    couponCount - totalSelected;

  const filteredCoupons = useMemo(() => {
    if (category === "all") {
      return couponIdeas;
    }

    return couponIdeas.filter(
      (coupon) => coupon.category === category
    );
  }, [category]);

  const reviewCoupons = [
    ...couponIdeas.filter((coupon) =>
      selected.includes(coupon.id)
    ),
    ...customCoupons,
  ];

  function toggleCoupon(id) {
    if (selected.includes(id)) {
      setSelected((current) =>
        current.filter(
          (couponId) => couponId !== id
        )
      );

      return;
    }

    if (totalSelected >= couponCount) {
      return;
    }

    setSelected((current) => [
      ...current,
      id,
    ]);
  }

  function changeCouponCount(value) {
    const nextCount = Number(value);

    setCouponCount(nextCount);

    const customToKeep =
      customCoupons.slice(
        0,
        nextCount
      );

    const spacesLeft =
      nextCount -
      customToKeep.length;

    setCustomCoupons(
      customToKeep
    );

    setSelected((current) =>
      current.slice(
        0,
        Math.max(
          0,
          spacesLeft
        )
      )
    );
  }

  function addCustomCoupon() {
    const title =
      customTitle.trim();

    const subtitle =
      customSubtitle.trim();

    if (!title) {
      return;
    }

    if (
      totalSelected >=
      couponCount
    ) {
      return;
    }

    const coupon = {
      id: `custom-${Date.now()}`,
      title: title.toUpperCase(),
      subtitle:
        subtitle ||
        "A little promise, just for you.",
      category: "custom",
      custom: true,
    };

    setCustomCoupons(
      (current) => [
        ...current,
        coupon,
      ]
    );

    setCustomTitle("");
    setCustomSubtitle("");
    setShowCustom(false);
  }

  function removeCustomCoupon(id) {
    setCustomCoupons(
      (current) =>
        current.filter(
          (coupon) =>
            coupon.id !== id
        )
    );
  }

  function createGift() {
    const gift =
      createLoveCouponsGift({
        senderName,
        recipientName,
        selectedCouponIds:
          selected,
        customCoupons,
        contactType,
        contact,
        dailyLimit,
      });

    saveLoveCouponsGift(gift);

    window.location.href =
      "/gift/love-coupons";
  }

  if (showReview) {
    return (
      <GiftReview
        senderName={senderName}
        recipientName={recipientName}
        coupons={reviewCoupons}
        dailyLimit={dailyLimit}
        contactType={contactType}
        contact={contact}
        onBack={() =>
          setShowReview(false)
        }
        onCreate={createGift}
      />
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <a
          href="/"
          className="logo"
        >
          WI♡ELI
        </a>

        <span>
          LOVE COUPONS
        </span>
      </header>

      <section className="intro">
        <p className="eyebrow">
          CREATE THEIR GIFT
        </p>

        <h1>
          LOVE
          <br />
          <em>COUPONS</em>
        </h1>

        <p className="introText">
          Pick the little
          promises, dates and
          surprises you want to
          give them.
        </p>
      </section>

      <section className="builder">
        <aside className="setup">
          <div className="setupHeader">
            <span>01</span>

            <div>
              <p>
                MAKE IT PERSONAL
              </p>

              <h2>
                Your gift
              </h2>
            </div>
          </div>

          <label>
            Your name

            <input
              value={senderName}
              onChange={(event) =>
                setSenderName(
                  event.target.value
                )
              }
              placeholder="Alex"
            />
          </label>

          <label>
            Recipient's name

            <input
              value={recipientName}
              onChange={(event) =>
                setRecipientName(
                  event.target.value
                )
              }
              placeholder="Sophie"
            />
          </label>

          <label>
            How many coupons?

            <select
              value={couponCount}
              onChange={(event) =>
                changeCouponCount(
                  event.target.value
                )
              }
            >
              <option value={8}>
                8 coupons
              </option>

              <option value={12}>
                12 coupons
              </option>

              <option value={18}>
                18 coupons
              </option>

              <option value={24}>
                24 coupons
              </option>

              <option value={30}>
                30 coupons
              </option>
            </select>
          </label>

          <div className="divider" />

          <p className="smallTitle">
            SEND REDEMPTIONS TO
            ME VIA
          </p>

          <div className="contactTabs">
            {[
              "WhatsApp",
              "Telegram",
              "SMS",
            ].map((type) => (
              <button
                key={type}
                type="button"
                className={
                  contactType ===
                  type
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setContactType(
                    type
                  )
                }
              >
                {type}
              </button>
            ))}
          </div>

          <label>
            {contactType ===
            "Telegram"
              ? "Telegram username"
              : "Phone number"}

            <input
              value={contact}
              onChange={(event) =>
                setContact(
                  event.target.value
                )
              }
              placeholder={
                contactType ===
                "Telegram"
                  ? "@username"
                  : "+1 234 567 89 00"
              }
            />
          </label>

          <label>
            Daily redemption
            limit

            <select
              value={dailyLimit}
              onChange={(event) =>
                setDailyLimit(
                  event.target.value
                )
              }
            >
              <option value={1}>
                1 coupon per day
              </option>

              <option value={2}>
                2 coupons per day
              </option>

              <option value={3}>
                3 coupons per day
              </option>

              <option value="unlimited">
                Unlimited
              </option>
            </select>
          </label>

          <div className="notice">
            <span>♡</span>

            <p>
              Redemption
              notifications will
              be sent here once
              messaging is
              connected.
            </p>
          </div>
        </aside>

        <section className="chooser">
          <div className="chooserTop">
            <div>
              <p className="eyebrow">
                02 · CHOOSE THE
                IDEAS
              </p>

              <h2>
                PICK THEIR
                <br />
                FAVORITES.
              </h2>
            </div>

            <div className="counter">
              <strong>
                {totalSelected}
              </strong>

              <span>
                / {couponCount}
              </span>

              <small>
                {remaining === 0
                  ? "READY ♡"
                  : `${remaining} LEFT`}
              </small>
            </div>
          </div>

          <div className="categories">
            {couponCategories.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    category ===
                    item.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCategory(
                      item.id
                    )
                  }
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          <div className="couponGrid">
            {filteredCoupons.map(
              (coupon, index) => {
                const isSelected =
                  selected.includes(
                    coupon.id
                  );

                return (
                  <button
                    type="button"
                    key={coupon.id}
                    className={`ticket ${
                      isSelected
                        ? "selected"
                        : ""
                    } ${
                      coupon.special
                        ? "special"
                        : ""
                    }`}
                    onClick={() =>
                      toggleCoupon(
                        coupon.id
                      )
                    }
                  >
                    <div className="ticketMain">
                      <div className="hearts">
                        ♡
                        <br />
                        ♥
                        <br />
                        ♡
                      </div>

                      <div className="ticketCopy">
                        <small>
                          WIVELI · LOVE
                          COUPON
                        </small>

                        <h3>
                          {coupon.title}
                        </h3>

                        <p>
                          {
                            coupon.subtitle
                          }
                        </p>
                      </div>
                    </div>

                    <div className="ticketStub">
                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div className="barcode">
                        ||| || ||| |
                      </div>

                      <small>
                        JUST FOR YOU
                      </small>
                    </div>

                    <div className="check">
                      {isSelected
                        ? "✓"
                        : "+"}
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {customCoupons.length >
            0 && (
            <div className="customList">
              <p className="customLabel">
                YOUR PERSONAL
                COUPONS
              </p>

              {customCoupons.map(
                (coupon) => (
                  <div
                    className="personalTicket"
                    key={coupon.id}
                  >
                    <div>
                      <small>
                        ONE OF A KIND ♡
                      </small>

                      <h3>
                        {
                          coupon.title
                        }
                      </h3>

                      <p>
                        {
                          coupon.subtitle
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeCustomCoupon(
                          coupon.id
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          <div className="customCoupon">
            <span>＋</span>

            <div>
              <strong>
                CREATE YOUR OWN
              </strong>

              <p>
                Add a completely
                personal coupon
                only the two of
                you will
                understand.
              </p>
            </div>

            <button
              type="button"
              disabled={
                totalSelected >=
                couponCount
              }
              onClick={() =>
                setShowCustom(
                  true
                )
              }
            >
              Add coupon →
            </button>
          </div>
        </section>
      </section>

      <div className="bottomBar">
        <div>
          <span>
            {totalSelected} OF{" "}
            {couponCount} SELECTED
          </span>

          <div className="progress">
            <i
              style={{
                width: `${
                  (totalSelected /
                    couponCount) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          className="continue"
          onClick={() =>
            setShowReview(true)
          }
          disabled={
            totalSelected !==
              couponCount ||
            !senderName.trim() ||
            !recipientName.trim() ||
            !contact.trim()
          }
        >
          CONTINUE TO YOUR GIFT →
        </button>
      </div>

      {showCustom && (
        <div
          className="modalBackdrop"
          onClick={() =>
            setShowCustom(false)
          }
        >
          <div
            className="customModal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="modalClose"
              onClick={() =>
                setShowCustom(
                  false
                )
              }
            >
              ×
            </button>

            <p className="modalEyebrow">
              MAKE IT YOURS
            </p>

            <h2>
              CREATE YOUR
              <br />
              <em>OWN COUPON.</em>
            </h2>

            <p className="modalText">
              Something only the
              two of you would
              understand ♡
            </p>

            <label>
              Coupon title

              <input
                value={customTitle}
                maxLength={40}
                onChange={(event) =>
                  setCustomTitle(
                    event.target
                      .value
                  )
                }
                placeholder="ONE RANDOM ROAD TRIP"
              />

              <small className="characterCount">
                {customTitle.length}
                /40
              </small>
            </label>

            <label>
              Little description

              <input
                value={
                  customSubtitle
                }
                maxLength={80}
                onChange={(event) =>
                  setCustomSubtitle(
                    event.target
                      .value
                  )
                }
                placeholder="No plans. Just us."
              />

              <small className="characterCount">
                {customSubtitle.length}
                /80
              </small>
            </label>

            <div className="previewTitle">
              LIVE PREVIEW
            </div>

            <div className="previewTicket">
              <div>
                <small>
                  WIVELI · LOVE
                  COUPON
                </small>

                <h3>
                  {customTitle ||
                    "YOUR LITTLE PROMISE"}
                </h3>

                <p>
                  {customSubtitle ||
                    "Something made just for them."}
                </p>
              </div>

              <div className="previewStub">
                <span>♡</span>

                <small>
                  JUST FOR YOU
                </small>
              </div>
            </div>

            <button
              type="button"
              className="addCustom"
              disabled={
                !customTitle.trim()
              }
              onClick={
                addCustomCoupon
              }
            >
              ADD TO MY COUPONS
              <span>♥</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 0%,
              #f8d9d5 0,
              transparent 32%
            ),
            #f2c9c7;
          color: #430a12;
          padding-bottom: 120px;
        }

        .topbar {
          height: 74px;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom:
            1px solid
            rgba(67, 10, 18, 0.18);
          font-size: 11px;
          letter-spacing: 0.18em;
        }

        .logo {
          color: #430a12;
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .intro {
          padding: 70px 5vw 54px;
          max-width: 820px;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          margin: 0 0 15px;
        }

        .intro h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size:
            clamp(
              70px,
              9vw,
              138px
            );
          line-height: 0.75;
          letter-spacing: -0.075em;
        }

        .intro h1 em {
          font-weight: 400;
        }

        .introText {
          max-width: 450px;
          margin: 35px 0 0;
          font-size: 18px;
          line-height: 1.5;
        }

        .builder {
          display: grid;
          grid-template-columns:
            350px 1fr;
          gap: 28px;
          padding: 0 5vw;
          align-items: start;
        }

        .setup,
        .chooser {
          border:
            1px solid
            rgba(67, 10, 18, 0.22);
          border-radius: 24px;
        }

        .setup {
          background:
            rgba(
              255,
              235,
              229,
              0.68
            );
          padding: 26px;
          position: sticky;
          top: 20px;
        }

        .setupHeader {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 30px;
        }

        .setupHeader > span {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #4c0710;
          color: #f8d7d1;
          display: grid;
          place-items: center;
          font-size: 12px;
        }

        .setupHeader p,
        .setupHeader h2 {
          margin: 0;
        }

        .setupHeader p {
          font-size: 9px;
          letter-spacing: 0.16em;
        }

        .setupHeader h2 {
          font-family: Georgia, serif;
          font-size: 28px;
        }

        label {
          display: block;
          position: relative;
          font-size: 11px;
          font-weight: 700;
          margin-top: 18px;
        }

        input,
        select {
          width: 100%;
          margin-top: 8px;
          height: 47px;
          border-radius: 11px;
          border:
            1px solid
            rgba(67, 10, 18, 0.18);
          background:
            rgba(
              255,
              244,
              239,
              0.8
            );
          padding: 0 13px;
          color: #430a12;
          font: inherit;
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: #650c18;
        }

        .divider {
          height: 1px;
          background:
            rgba(
              67,
              10,
              18,
              0.14
            );
          margin: 27px 0;
        }

        .smallTitle {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        .contactTabs,
        .categories {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .contactTabs button,
        .categories button {
          border:
            1px solid
            rgba(67, 10, 18, 0.22);
          color: #430a12;
          background: transparent;
          border-radius: 100px;
          padding: 9px 13px;
          cursor: pointer;
        }

        .contactTabs button.active,
        .categories button.active {
          background: #4c0710;
          color: #f7d8d3;
        }

        .notice {
          margin-top: 24px;
          border-radius: 14px;
          padding: 15px;
          background: #4c0710;
          color: #f7d8d3;
          display: flex;
          gap: 10px;
          font-size: 11px;
          line-height: 1.5;
        }

        .notice p {
          margin: 0;
        }

        .chooser {
          padding: 32px;
          background:
            rgba(
              248,
              218,
              213,
              0.32
            );
        }

        .chooserTop {
          display: flex;
          justify-content:
            space-between;
          gap: 30px;
          align-items: flex-start;
        }

        .chooserTop h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size:
            clamp(
              42px,
              5vw,
              72px
            );
          line-height: 0.86;
          letter-spacing: -0.055em;
        }

        .counter {
          text-align: right;
          min-width: 110px;
        }

        .counter strong {
          font-family: Georgia, serif;
          font-size: 46px;
        }

        .counter span {
          font-size: 17px;
        }

        .counter small {
          display: block;
          margin-top: 4px;
          font-size: 9px;
          letter-spacing: 0.15em;
        }

        .categories {
          margin: 30px 0;
        }

        .couponGrid {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 14px;
        }

        .ticket {
          min-height: 168px;
          padding: 0;
          border:
            1px solid #68101b;
          background: #f6d2cd;
          color: #4a0912;
          display: grid;
          grid-template-columns:
            1fr 82px;
          position: relative;
          cursor: pointer;
          text-align: left;
          border-radius: 7px;
          overflow: hidden;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .ticket:hover {
          transform:
            translateY(-3px)
            rotate(-0.4deg);
          box-shadow:
            0 14px 30px
            rgba(
              68,
              5,
              14,
              0.13
            );
        }

        .ticket.selected {
          outline:
            3px solid #4c0710;
          outline-offset: 2px;
        }

        .ticket.special {
          background: #4c0710;
          color: #f4c9c4;
        }

        .ticketMain {
          display: flex;
          align-items: center;
          padding: 22px 18px;
          gap: 16px;
        }

        .hearts {
          font-size: 15px;
          line-height: 1.7;
        }

        .ticketCopy small {
          font-size: 8px;
          letter-spacing: 0.13em;
        }

        .ticketCopy h3 {
          margin: 8px 0;
          font-family: Georgia, serif;
          font-size:
            clamp(
              22px,
              2vw,
              31px
            );
          line-height: 0.9;
          font-style: italic;
        }

        .ticketCopy p {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 11px;
          text-transform: uppercase;
        }

        .ticketStub {
          border-left:
            1px dashed
            currentColor;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .ticketStub > span {
          font-family: Georgia, serif;
          font-size: 22px;
        }

        .ticketStub small {
          writing-mode:
            vertical-rl;
          font-size: 7px;
          letter-spacing: 0.1em;
        }

        .barcode {
          font-size: 9px;
          letter-spacing: -1px;
        }

        .check {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4c0710;
          color: #f6d2cd;
          display: grid;
          place-items: center;
          font-size: 12px;
        }

        .special .check {
          background: #f6d2cd;
          color: #4c0710;
        }

        .customList {
          margin-top: 30px;
        }

        .customLabel {
          margin: 0 0 12px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .personalTicket {
          min-height: 130px;
          margin-bottom: 10px;
          padding:
            22px 70px
            22px 24px;
          position: relative;
          border:
            1px solid #68101b;
          border-radius: 7px;
          background: #5a0a16;
          color: #f4ceca;
        }

        .personalTicket small {
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .personalTicket h3 {
          margin: 18px 0 6px;
          font-family: Georgia, serif;
          font-size: 27px;
          font-style: italic;
          line-height: 0.9;
        }

        .personalTicket p {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .personalTicket button {
          position: absolute;
          right: 18px;
          top: 18px;
          width: 34px;
          height: 34px;
          border:
            1px solid
            rgba(
              244,
              206,
              202,
              0.4
            );
          border-radius: 50%;
          background: transparent;
          color: #f4ceca;
          font-size: 20px;
          cursor: pointer;
        }

        .customCoupon {
          margin-top: 16px;
          border:
            1px dashed #68101b;
          border-radius: 12px;
          padding: 20px;
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 17px;
        }

        .customCoupon > span {
          font-size: 30px;
        }

        .customCoupon strong {
          font-family: Georgia, serif;
        }

        .customCoupon p {
          margin: 5px 0 0;
          font-size: 11px;
        }

        .customCoupon button {
          border: none;
          background: #4c0710;
          color: #f7d8d3;
          border-radius: 100px;
          padding: 11px 17px;
          cursor: pointer;
        }

        .customCoupon button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .bottomBar {
          position: fixed;
          left: 50%;
          bottom: 18px;
          transform:
            translateX(-50%);
          width:
            min(
              90%,
              900px
            );
          background: #4c0710;
          color: #f6d2cd;
          border-radius: 18px;
          padding:
            14px 16px
            14px 22px;
          display: flex;
          justify-content:
            space-between;
          align-items: center;
          gap: 25px;
          box-shadow:
            0 15px 50px
            rgba(
              50,
              0,
              8,
              0.25
            );
          z-index: 20;
        }

        .bottomBar span {
          font-size: 9px;
          letter-spacing: 0.15em;
        }

        .progress {
          width: 170px;
          height: 3px;
          margin-top: 7px;
          background:
            rgba(
              255,
              255,
              255,
              0.18
            );
          overflow: hidden;
        }

        .progress i {
          display: block;
          height: 100%;
          background: #f4c9c4;
          transition:
            width 0.25s ease;
        }

        .continue {
          border: none;
          border-radius: 100px;
          background: #f5d1cc;
          color: #4c0710;
          padding: 15px 22px;
          font-weight: 700;
          cursor: pointer;
        }

        .continue:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .modalBackdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          padding: 22px;
          display: grid;
          place-items: center;
          background:
            rgba(
              47,
              2,
              9,
              0.72
            );
          backdrop-filter:
            blur(14px);
        }

        .customModal {
          position: relative;
          width:
            min(
              620px,
              100%
            );
          max-height:
            calc(
              100svh - 35px
            );
          overflow-y: auto;
          padding: 48px;
          border-radius: 26px;
          background: #f3cbc8;
          color: #4c0710;
          box-shadow:
            0 35px 100px
            rgba(
              35,
              0,
              6,
              0.35
            );
        }

        .modalClose {
          position: absolute;
          right: 18px;
          top: 18px;
          width: 38px;
          height: 38px;
          border:
            1px solid
            rgba(
              76,
              7,
              16,
              0.25
            );
          border-radius: 50%;
          background: transparent;
          color: #4c0710;
          font-size: 23px;
          cursor: pointer;
        }

        .modalEyebrow {
          margin: 0 0 15px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .customModal h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size:
            clamp(
              45px,
              7vw,
              72px
            );
          line-height: 0.82;
          letter-spacing: -0.055em;
        }

        .customModal h2 em {
          font-weight: 400;
        }

        .modalText {
          margin: 22px 0 28px;
          font-family: Georgia, serif;
          font-size: 14px;
        }

        .characterCount {
          position: absolute;
          right: 10px;
          bottom: 15px;
          font-size: 8px;
          opacity: 0.5;
        }

        .previewTitle {
          margin: 30px 0 10px;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .previewTicket {
          min-height: 180px;
          display: grid;
          grid-template-columns:
            1fr 70px;
          border:
            1px solid #68101b;
          background: #f7d7d2;
          transform:
            rotate(-1deg);
          box-shadow:
            0 15px 35px
            rgba(
              68,
              5,
              14,
              0.12
            );
        }

        .previewTicket > div:first-child {
          padding: 25px;
        }

        .previewTicket small {
          font-size: 7px;
          letter-spacing: 0.14em;
        }

        .previewTicket h3 {
          max-width: 90%;
          margin: 35px 0 7px;
          font-family: Georgia, serif;
          font-size: 29px;
          line-height: 0.9;
          font-style: italic;
        }

        .previewTicket p {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 11px;
        }

        .previewStub {
          border-left:
            1px dashed #68101b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content:
            space-around;
          padding: 18px 0;
        }

        .previewStub span {
          font-size: 25px;
        }

        .previewStub small {
          writing-mode:
            vertical-rl;
        }

        .addCustom {
          width: 100%;
          height: 56px;
          margin-top: 25px;
          padding: 0 22px;
          border: none;
          border-radius: 100px;
          background: #4c0710;
          color: #f6d2cd;
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        .addCustom:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        @media (
          max-width: 900px
        ) {
          .builder {
            grid-template-columns:
              1fr;
          }

          .setup {
            position: static;
          }
        }

        @media (
          max-width: 650px
        ) {
          .page {
            padding-bottom: 150px;
          }

          .intro {
            padding-top: 45px;
          }

          .intro h1 {
            font-size: 66px;
          }

          .builder {
            padding: 0 14px;
          }

          .setup,
          .chooser {
            border-radius: 18px;
          }

          .chooser {
            padding: 20px 13px;
          }

          .chooserTop {
            align-items:
              flex-end;
          }

          .chooserTop h2 {
            font-size: 42px;
          }

          .couponGrid {
            grid-template-columns:
              1fr;
          }

          .ticket {
            min-height: 145px;
          }

          .customCoupon {
            grid-template-columns:
              auto 1fr;
          }

          .customCoupon button {
            grid-column:
              1 / -1;
          }

          .bottomBar {
            width:
              calc(
                100% - 24px
              );
            bottom: 12px;
            flex-direction:
              column;
            align-items:
              stretch;
            gap: 10px;
          }

          .progress {
            width: 100%;
          }

          .continue {
            width: 100%;
          }

          .customModal {
            padding:
              45px 20px
              25px;
          }

          .customModal h2 {
            font-size: 48px;
          }

          .previewTicket {
            grid-template-columns:
              1fr 55px;
          }

          .previewTicket h3 {
            font-size: 25px;
          }
        }
      `}</style>
    </main>
  );
}

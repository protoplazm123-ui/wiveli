"use client";

import { useMemo, useState } from "react";
import { couponIdeas, couponCategories } from "../coupons";
import {
  createLoveCouponsGift,
  saveLoveCouponsGift,
} from "../storage";

import GiftDelivery from "./GiftDelivery";

export default function LoveCouponsPersonalize() {
  const [step, setStep] = useState(1);

  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const [couponCount, setCouponCount] = useState(8);
  const [selected, setSelected] = useState([]);
  const [customCoupons, setCustomCoupons] = useState([]);

  const [category, setCategory] = useState("all");

  const [contactType, setContactType] = useState("Telegram");
  const [contact, setContact] = useState("");
  const [dailyLimit, setDailyLimit] = useState(3);

  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDelivery, setShowDelivery] = useState(false);
  const [creating, setCreating] = useState(false);

  const filteredCoupons = useMemo(() => {
    if (category === "all") return couponIdeas;

    return couponIdeas.filter(
      (coupon) => coupon.category === category
    );
  }, [category]);

  const selectedCoupons = [
    ...couponIdeas.filter((coupon) =>
      selected.includes(coupon.id)
    ),
    ...customCoupons,
  ];

  function toggleCoupon(id) {
    if (selected.includes(id)) {
      setSelected((current) =>
        current.filter((item) => item !== id)
      );
      return;
    }

    if (selectedCoupons.length >= couponCount) return;

    setSelected((current) => [...current, id]);
  }

  function saveEditedCoupon() {
    if (!editingCoupon) return;

    const existing = customCoupons.find(
      (coupon) => coupon.originalId === editingCoupon.id
    );

    if (existing) {
      setCustomCoupons((current) =>
        current.map((coupon) =>
          coupon.originalId === editingCoupon.id
            ? {
                ...coupon,
                title: editingCoupon.title,
                subtitle: editingCoupon.subtitle,
              }
            : coupon
        )
      );
    } else {
      setSelected((current) =>
        current.filter((id) => id !== editingCoupon.id)
      );

      setCustomCoupons((current) => [
        ...current,
        {
          id: `custom-${Date.now()}`,
          originalId: editingCoupon.id,
          title: editingCoupon.title,
          subtitle: editingCoupon.subtitle,
          category: "custom",
          custom: true,
        },
      ]);
    }

    setEditingCoupon(null);
  }

  async function createGift() {
    if (!senderName.trim() || !recipientName.trim()) return;

    setCreating(true);

    const gift = createLoveCouponsGift({
      senderName,
      recipientName,
      selectedCouponIds: selected,
      customCoupons,
      contactType,
      contact,
      dailyLimit,
    });

    try {
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftType: "love-coupons",
          giftData: gift,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        throw new Error("Could not create gift");
      }

      saveLoveCouponsGift({
        ...gift,
        serverId: data.id,
      });

      setShowDelivery(true);
    } catch (error) {
      console.error(error);
      alert("We couldn't create your gift ♡");
    } finally {
      setCreating(false);
    }
  }

  if (showDelivery) {
    return (
      <GiftDelivery
        recipientName={recipientName}
      />
    );
  }

  return (
    <main className="page">
      <header>
        <a href="/" className="logo">
          WI♡ELI
        </a>

        <div className="steps">
          <button
            className={step === 1 ? "active" : ""}
            onClick={() => setStep(1)}
          >
            01 DETAILS
          </button>

          <span>—</span>

          <button
            className={step === 2 ? "active" : ""}
            onClick={() => setStep(2)}
          >
            02 COUPONS
          </button>

          <span>—</span>

          <button
            className={step === 3 ? "active" : ""}
            onClick={() => setStep(3)}
          >
            03 READY
          </button>
        </div>

        <span className="brand">LOVE COUPONS</span>
      </header>

      {step === 1 && (
        <section className="workspace">
          <div className="left">
            <p className="eyebrow">
              01 · MAKE IT PERSONAL
            </p>

            <h1>
              WHO'S THIS
              <br />
              <em>FOR?</em>
            </h1>

            <div className="fields">
              <label>
                YOUR NAME
                <input
                  value={senderName}
                  onChange={(e) =>
                    setSenderName(e.target.value)
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                THEIR NAME
                <input
                  value={recipientName}
                  onChange={(e) =>
                    setRecipientName(e.target.value)
                  }
                  placeholder="Their name"
                />
              </label>

              <div className="two">
                <label>
                  COUPONS
                  <select
                    value={couponCount}
                    onChange={(e) =>
                      setCouponCount(Number(e.target.value))
                    }
                  >
                    <option value={6}>6</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                    <option value={12}>12</option>
                  </select>
                </label>

                <label>
                  DAILY LIMIT
                  <select
                    value={dailyLimit}
                    onChange={(e) =>
                      setDailyLimit(e.target.value)
                    }
                  >
                    <option value={1}>1 / day</option>
                    <option value={2}>2 / day</option>
                    <option value={3}>3 / day</option>
                    <option value="unlimited">
                      Unlimited
                    </option>
                  </select>
                </label>
              </div>

              <div className="two">
                <label>
                  CONTACT
                  <select
                    value={contactType}
                    onChange={(e) =>
                      setContactType(e.target.value)
                    }
                  >
                    <option>Telegram</option>
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Email</option>
                  </select>
                </label>

                <label>
                  USERNAME / NUMBER
                  <input
                    value={contact}
                    onChange={(e) =>
                      setContact(e.target.value)
                    }
                    placeholder="@username"
                  />
                </label>
              </div>
            </div>

            <button
              className="next"
              disabled={!senderName || !recipientName}
              onClick={() => setStep(2)}
            >
              CHOOSE COUPONS →
            </button>
          </div>

          <MachinePreview
            senderName={senderName}
            recipientName={recipientName}
          />
        </section>
      )}

      {step === 2 && (
        <section className="couponStep">
          <div className="couponTop">
            <div>
              <p className="eyebrow">
                02 · PICK THEIR PROMISES
              </p>

              <h1>
                CHOOSE
                <br />
                <em>THE COUPONS.</em>
              </h1>
            </div>

            <div className="counter">
              <strong>{selectedCoupons.length}</strong>
              <span>/ {couponCount}</span>
            </div>
          </div>

          <div className="categories">
            {couponCategories.map((item) => (
              <button
                key={item.id}
                className={
                  category === item.id ? "active" : ""
                }
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="tickets">
            {filteredCoupons.map((coupon, index) => {
              const active = selected.includes(coupon.id);

              return (
                <article
                  key={coupon.id}
                  className={`ticket ${
                    active ? "selected" : ""
                  }`}
                >
                  <div
                    className="ticketBody"
                    onClick={() => toggleCoupon(coupon.id)}
                  >
                    <small>WI♡ELI · LOVE COUPON</small>

                    <h3>{coupon.title}</h3>
                    <p>{coupon.subtitle}</p>

                    <span className="ticketNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="ticketActions">
                    <button
                      onClick={() => toggleCoupon(coupon.id)}
                    >
                      {active ? "✓ SELECTED" : "+ ADD"}
                    </button>

                    <button
                      onClick={() =>
                        setEditingCoupon({ ...coupon })
                      }
                    >
                      EDIT
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="bottomBar">
            <button onClick={() => setStep(1)}>
              ← BACK
            </button>

            <span>
              {selectedCoupons.length} OF {couponCount} SELECTED
            </span>

            <button
              className="primary"
              disabled={!selectedCoupons.length}
              onClick={() => setStep(3)}
            >
              PREVIEW GIFT →
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="workspace ready">
          <div className="left">
            <p className="eyebrow">
              03 · READY
            </p>

            <h1>
              READY TO
              <br />
              <em>MAKE THEIR DAY?</em>
            </h1>

            <div className="summary">
              <div>
                <small>FROM</small>
                <strong>{senderName}</strong>
              </div>

              <div>
                <small>FOR</small>
                <strong>{recipientName}</strong>
              </div>

              <div>
                <small>COUPONS</small>
                <strong>{selectedCoupons.length}</strong>
              </div>

              <div>
                <small>DAILY</small>
                <strong>
                  {dailyLimit === "unlimited"
                    ? "∞"
                    : dailyLimit}
                </strong>
              </div>
            </div>

            <div className="readyButtons">
              <button
                className="secondary"
                onClick={() => setStep(2)}
              >
                ← EDIT
              </button>

              <button
                className="next"
                onClick={createGift}
                disabled={creating}
              >
                {creating
                  ? "CREATING..."
                  : "SEND GIFT →"}
              </button>
            </div>
          </div>

          <MachinePreview
            senderName={senderName}
            recipientName={recipientName}
            coupons={selectedCoupons}
          />
        </section>
      )}

      {editingCoupon && (
        <div
          className="modal"
          onClick={() => setEditingCoupon(null)}
        >
          <div
            className="modalCard"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setEditingCoupon(null)}
            >
              ×
            </button>

            <p className="eyebrow">EDIT COUPON</p>

            <h2>MAKE IT YOURS ♡</h2>

            <label>
              TITLE
              <input
                value={editingCoupon.title}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    title: e.target.value,
                  })
                }
              />
            </label>

            <label>
              LITTLE NOTE
              <input
                value={editingCoupon.subtitle}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    subtitle: e.target.value,
                  })
                }
              />
            </label>

            <button
              className="next"
              onClick={saveEditedCoupon}
            >
              SAVE COUPON ♡
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100svh;
          background:
            radial-gradient(circle at 70% 20%, #f9dfda, transparent 35%),
            #efc6c3;
          color: #570b17;
          font-family: Georgia, "Times New Roman", serif;
        }

        header {
          height: 72px;
          border-bottom: 1px solid rgba(87, 11, 23, 0.18);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 42px;
        }

        .logo {
          color: inherit;
          text-decoration: none;
          font-size: 22px;
          font-weight: bold;
        }

        .brand {
          justify-self: end;
          font-size: 10px;
          letter-spacing: 0.18em;
          font-family: Arial, sans-serif;
        }

        .steps {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .steps button {
          border: 0;
          background: transparent;
          color: rgba(87, 11, 23, 0.4);
          font: 10px Arial;
          letter-spacing: 0.13em;
          cursor: pointer;
        }

        .steps button.active {
          color: #570b17;
          font-weight: 700;
        }

        .workspace {
          min-height: calc(100svh - 72px);
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          max-width: 1320px;
          margin: auto;
          padding: 48px;
          gap: 70px;
          align-items: center;
        }

        .left {
          max-width: 520px;
        }

        .eyebrow {
          font: 700 10px Arial;
          letter-spacing: 0.18em;
          margin-bottom: 20px;
        }

        h1 {
          margin: 0 0 32px;
          font-size: clamp(54px, 6vw, 94px);
          line-height: 0.78;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        h1 em {
          font-weight: 400;
        }

        .fields {
          display: grid;
          gap: 14px;
        }

        label {
          display: grid;
          gap: 7px;
          font: 700 9px Arial;
          letter-spacing: 0.13em;
        }

        input,
        select {
          width: 100%;
          height: 52px;
          border: 1px solid rgba(87, 11, 23, 0.25);
          background: rgba(255, 244, 241, 0.35);
          border-radius: 10px;
          padding: 0 15px;
          color: #570b17;
          font: 16px Georgia;
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: #570b17;
        }

        .two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .next,
        .secondary {
          height: 54px;
          padding: 0 26px;
          border-radius: 100px;
          cursor: pointer;
          font: 700 10px Arial;
          letter-spacing: 0.14em;
        }

        .next {
          margin-top: 24px;
          border: 0;
          background: #670d1b;
          color: #f8dcd7;
        }

        .next:disabled {
          opacity: 0.35;
          cursor: default;
        }

        .machineArea {
          min-height: 590px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .machine {
          width: min(520px, 100%);
          height: 315px;
          border-radius: 34px;
          background: linear-gradient(145deg, #7a1221, #4f0712);
          box-shadow: 0 30px 60px rgba(76, 7, 18, 0.2);
          padding: 30px;
          position: relative;
          z-index: 2;
        }

        .machineTop {
          display: flex;
          justify-content: space-between;
          color: #f5d4cf;
          font: 700 10px Arial;
          letter-spacing: 0.15em;
        }

        .machineLogo {
          margin-top: 65px;
          text-align: center;
          color: #f7d8d2;
          font-size: 46px;
        }

        .machineName {
          text-align: center;
          color: #f7d8d2;
          opacity: 0.8;
          margin-top: 10px;
          font-style: italic;
        }

        .slot {
          height: 13px;
          border-radius: 20px;
          background: #270209;
          position: absolute;
          left: 55px;
          right: 55px;
          bottom: 28px;
        }

        .sampleTickets {
          position: absolute;
          bottom: -95px;
          width: 390px;
          z-index: 1;
        }

        .sample {
          background: #f8e5df;
          min-height: 112px;
          border: 1px solid #8b3944;
          padding: 20px 25px;
          position: relative;
          margin-top: -1px;
        }

        .sample small {
          font: 700 8px Arial;
          letter-spacing: 0.14em;
        }

        .sample strong {
          display: block;
          margin-top: 18px;
          font-size: 20px;
        }

        .sample span {
          display: block;
          margin-top: 4px;
          font-style: italic;
          font-size: 12px;
        }

        .couponStep {
          max-width: 1320px;
          margin: auto;
          padding: 42px 48px 120px;
        }

        .couponTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .couponTop h1 {
          font-size: 68px;
          margin-bottom: 15px;
        }

        .counter strong {
          font-size: 62px;
          font-weight: 400;
        }

        .counter span {
          font-size: 22px;
        }

        .categories {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 15px 0 25px;
        }

        .categories button {
          flex: 0 0 auto;
          border: 1px solid rgba(87, 11, 23, 0.25);
          background: transparent;
          color: #570b17;
          border-radius: 100px;
          padding: 10px 17px;
          cursor: pointer;
          font: 700 9px Arial;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .categories button.active {
          background: #670d1b;
          color: #f7d8d2;
        }

        .tickets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .ticket {
          background: rgba(255, 241, 237, 0.55);
          border: 1px solid rgba(87, 11, 23, 0.25);
          border-radius: 14px;
          overflow: hidden;
          transition: 0.2s;
        }

        .ticket.selected {
          background: #670d1b;
          color: #f7d8d2;
          transform: translateY(-3px);
        }

        .ticketBody {
          min-height: 160px;
          padding: 20px;
          cursor: pointer;
          position: relative;
        }

        .ticketBody small {
          font: 700 8px Arial;
          letter-spacing: 0.12em;
        }

        .ticketBody h3 {
          max-width: 80%;
          font-size: 22px;
          line-height: 1;
          margin: 30px 0 7px;
        }

        .ticketBody p {
          margin: 0;
          font-size: 13px;
          font-style: italic;
        }

        .ticketNumber {
          position: absolute;
          right: 18px;
          top: 18px;
          font-size: 12px;
        }

        .ticketActions {
          display: flex;
          border-top: 1px dashed currentColor;
        }

        .ticketActions button {
          flex: 1;
          height: 38px;
          border: 0;
          border-right: 1px solid rgba(87, 11, 23, 0.18);
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: 700 8px Arial;
          letter-spacing: 0.1em;
        }

        .bottomBar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          min-height: 76px;
          background: rgba(239, 198, 195, 0.92);
          backdrop-filter: blur(18px);
          border-top: 1px solid rgba(87, 11, 23, 0.18);
          padding: 10px 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 20;
        }

        .bottomBar button {
          border: 0;
          background: transparent;
          color: #570b17;
          cursor: pointer;
          font: 700 9px Arial;
          letter-spacing: 0.12em;
        }

        .bottomBar .primary {
          background: #670d1b;
          color: #f7d8d2;
          padding: 17px 25px;
          border-radius: 100px;
        }

        .summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .summary div {
          min-height: 105px;
          border: 1px solid rgba(87, 11, 23, 0.22);
          border-radius: 14px;
          padding: 17px;
        }

        .summary small {
          display: block;
          font: 700 8px Arial;
          letter-spacing: 0.13em;
        }

        .summary strong {
          display: block;
          font-size: 30px;
          margin-top: 16px;
          font-weight: 400;
        }

        .readyButtons {
          display: flex;
          gap: 10px;
        }

        .secondary {
          margin-top: 24px;
          border: 1px solid #670d1b;
          background: transparent;
          color: #670d1b;
        }

        .modal {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(55, 4, 12, 0.45);
          backdrop-filter: blur(10px);
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .modalCard {
          width: min(520px, 100%);
          background: #f2d0cc;
          border-radius: 20px;
          padding: 38px;
          box-shadow: 0 30px 80px rgba(40, 0, 8, 0.3);
          position: relative;
        }

        .modalCard h2 {
          font-size: 42px;
          margin: 0 0 28px;
        }

        .modalCard label {
          margin-top: 15px;
        }

        .close {
          position: absolute;
          right: 20px;
          top: 15px;
          border: 0;
          background: transparent;
          color: #570b17;
          font-size: 28px;
          cursor: pointer;
        }

        @media (max-width: 800px) {
          header {
            padding: 0 18px;
          }

          .brand {
            display: none;
          }

          .workspace {
            grid-template-columns: 1fr;
            padding: 35px 20px 120px;
          }

          .machineArea {
            min-height: 480px;
          }

          .tickets {
            grid-template-columns: 1fr;
          }

          .couponStep {
            padding: 35px 20px 120px;
          }

          .couponTop h1 {
            font-size: 50px;
          }

          .bottomBar {
            padding: 10px 18px;
          }

          .bottomBar span {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

function MachinePreview({
  senderName,
  recipientName,
  coupons = [],
}) {
  const examples =
    coupons.length > 0
      ? coupons.slice(0, 3)
      : [
          {
            title: "BREAKFAST IN BED",
            subtitle: "Wake up happier.",
          },
          {
            title: "MIDNIGHT DRIVE",
            subtitle: "Music on. No destination.",
          },
          {
            title: "ONE LONG HUG",
            subtitle: "No time limit.",
          },
        ];

  return (
    <div className="machineArea">
      <div className="machine">
        <div className="machineTop">
          <span>WI♡ELI</span>
          <span>LOVE COUPON MACHINE</span>
        </div>

        <div className="machineLogo">WI♡ELI</div>

        <div className="machineName">
          {recipientName
            ? `made for ${recipientName}`
            : "made for someone special"}
          {senderName ? ` · by ${senderName}` : ""}
        </div>

        <div className="slot" />
      </div>

      <div className="sampleTickets">
        {examples.map((coupon, index) => (
          <div className="sample" key={index}>
            <small>
              WI♡ELI · LOVE COUPON ·{" "}
              {String(index + 1).padStart(2, "0")}
            </small>

            <strong>{coupon.title}</strong>
            <span>{coupon.subtitle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

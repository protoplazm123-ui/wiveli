"use client";

import { useMemo, useState } from "react";
import { couponIdeas, couponCategories } from "../coupons";
import {
  createLoveCouponsGift,
  saveLoveCouponsGift,
} from "../storage";

export default function LoveCouponsPersonalize() {
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderTelegram, setSenderTelegram] = useState("");
  const [couponCount, setCouponCount] = useState(8);
  const [dailyLimit, setDailyLimit] = useState(3);

  const [selected, setSelected] = useState([]);
  const [customCoupons, setCustomCoupons] = useState([]);
  const [category, setCategory] = useState("all");

  const [modal, setModal] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editTab, setEditTab] = useState("message");

  const [creating, setCreating] = useState(false);
  const [giftUrl, setGiftUrl] = useState("");

  const filteredCoupons = useMemo(() => {
    if (category === "all") return couponIdeas;
    return couponIdeas.filter((c) => c.category === category);
  }, [category]);

  const selectedCoupons = useMemo(() => {
    return selected
      .map((id) => {
        return (
          customCoupons.find((c) => c.originalId === id) ||
          couponIdeas.find((c) => c.id === id)
        );
      })
      .filter(Boolean);
  }, [selected, customCoupons]);

  function toggleCoupon(id) {
    if (selected.includes(id)) {
      setSelected((old) => old.filter((x) => x !== id));
      return;
    }

    if (selected.length >= couponCount) return;
    setSelected((old) => [...old, id]);
  }

  function openEditor(coupon) {
    const existing =
      customCoupons.find((c) => c.originalId === coupon.id) || coupon;

    setEditingCoupon({
      ...existing,
      originalId: coupon.id,
      message: existing.message || "",
      photoUrl: existing.photoUrl || "",
      videoUrl: existing.videoUrl || "",
      voiceUrl: existing.voiceUrl || "",
      giftUrl: existing.giftUrl || "",
      reminderEnabled: existing.reminderEnabled || false,
    });

    setEditTab("message");
    setModal("edit");
  }

  function saveEditedCoupon() {
    if (!editingCoupon) return;

    const saved = {
      ...editingCoupon,
      id: `custom-${editingCoupon.originalId}`,
      custom: true,
    };

    setCustomCoupons((old) => [
      ...old.filter(
        (c) => c.originalId !== editingCoupon.originalId
      ),
      saved,
    ]);

    if (!selected.includes(editingCoupon.originalId)) {
      if (selected.length < couponCount) {
        setSelected((old) => [
          ...old,
          editingCoupon.originalId,
        ]);
      }
    }

    setEditingCoupon(null);
    setModal("coupons");
  }

  async function createGift() {
    if (!senderName.trim() || !recipientName.trim()) return;

    setCreating(true);

    const enrichedCoupons = selectedCoupons.map((coupon) => ({
      ...coupon,
    }));

    const gift = createLoveCouponsGift({
      senderName,
      recipientName,
      selectedCouponIds: selected,
      customCoupons: enrichedCoupons,
      contactType: "Telegram",
      contact: senderTelegram,
      dailyLimit,
    });

    gift.senderTelegram = senderTelegram;
    gift.couponDetails = enrichedCoupons;

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
        throw new Error("Gift creation failed");
      }

      const savedGift = {
        ...gift,
        serverId: data.id,
      };

      saveLoveCouponsGift(savedGift);

      const url = `${window.location.origin}/gift/love-coupons/${data.id}`;

      setGiftUrl(url);
      setModal("send");
    } catch (error) {
      console.error(error);
      alert("Couldn't create the gift ♡");
    } finally {
      setCreating(false);
    }
  }

  async function copyLink() {
    if (!giftUrl) return;
    await navigator.clipboard.writeText(giftUrl);
  }

  return (
    <main className="page">
      <header>
        <a href="/" className="logo">
          WI♡ELI
        </a>

        <span className="centerTitle">
          LOVE COUPON STUDIO
        </span>

        <span className="brand">LOVE COUPONS</span>
      </header>

      <section className="workspace">
        <div className="formSide">
          <p className="eyebrow">MAKE IT PERSONAL ♡</p>

          <h1>
            MAKE SOMETHING
            <br />
            <em>JUST FOR THEM.</em>
          </h1>

          <div className="fields">
            <div className="two">
              <label>
                YOUR NAME
                <input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
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
            </div>

            <label>
              YOUR TELEGRAM
              <input
                value={senderTelegram}
                onChange={(e) =>
                  setSenderTelegram(e.target.value)
                }
                placeholder="@username"
              />
              <small className="hint">
                We'll use this for coupon redemption
                notifications.
              </small>
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
          </div>

          <div className="mainActions">
            <button
              className="primary"
              disabled={!senderName || !recipientName}
              onClick={() => setModal("coupons")}
            >
              CHOOSE COUPONS
              <span>→</span>
            </button>

            {selected.length > 0 && (
              <button
                className="outline"
                onClick={() => setModal("preview")}
              >
                PREVIEW
              </button>
            )}
          </div>

          {selected.length > 0 && (
            <p className="selectedText">
              {selected.length} / {couponCount} coupons selected
            </p>
          )}
        </div>

        <MachinePreview
          senderName={senderName}
          recipientName={recipientName}
          coupons={selectedCoupons}
          couponCount={couponCount}
        />
      </section>

      {/* COUPONS */}

      {modal === "coupons" && (
        <Modal onClose={() => setModal(null)} wide>
          <p className="eyebrow">CHOOSE THEIR PROMISES</p>

          <div className="modalHeading">
            <h2>
              PICK THE
              <br />
              <em>COUPONS.</em>
            </h2>

            <div className="bigCounter">
              {selected.length}
              <span>/{couponCount}</span>
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

          <div className="ticketGrid">
            {filteredCoupons.map((coupon, index) => {
              const active = selected.includes(coupon.id);

              const custom = customCoupons.find(
                (c) => c.originalId === coupon.id
              );

              const display = custom || coupon;

              return (
                <PhysicalTicket
                  key={coupon.id}
                  coupon={display}
                  number={index + 1}
                  selected={active}
                  onSelect={() => toggleCoupon(coupon.id)}
                  onEdit={() => openEditor(coupon)}
                />
              );
            })}
          </div>

          <div className="modalFooter">
            <span>
              {selected.length} OF {couponCount} SELECTED
            </span>

            <button
              className="primary"
              disabled={!selected.length}
              onClick={() => setModal("preview")}
            >
              PREVIEW GIFT →
            </button>
          </div>
        </Modal>
      )}

      {/* EDIT */}

      {modal === "edit" && editingCoupon && (
        <Modal
          onClose={() => {
            setEditingCoupon(null);
            setModal("coupons");
          }}
        >
          <p className="eyebrow">EDIT COUPON</p>

          <h2 className="editTitle">
            MAKE IT YOURS ♡
          </h2>

          <div className="editorTabs">
            {[
              ["message", "MESSAGE"],
              ["photo", "PHOTO"],
              ["video", "VIDEO"],
              ["voice", "VOICE"],
              ["gift", "GIFT"],
              ["reminder", "REMIND ME"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={editTab === id ? "active" : ""}
                onClick={() => setEditTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="editTicket">
            <small>WI♡ELI · LOVE COUPON</small>

            <input
              className="editTicketTitle"
              value={editingCoupon.title}
              onChange={(e) =>
                setEditingCoupon({
                  ...editingCoupon,
                  title: e.target.value,
                })
              }
            />

            <input
              className="editTicketSubtitle"
              value={editingCoupon.subtitle}
              onChange={(e) =>
                setEditingCoupon({
                  ...editingCoupon,
                  subtitle: e.target.value,
                })
              }
            />
          </div>

          {editTab === "message" && (
            <div className="panel">
              <label>
                PERSONAL MESSAGE
                <textarea
                  value={editingCoupon.message}
                  placeholder="Write something just for them ♡"
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      message: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          )}

          {editTab === "photo" && (
            <AttachmentPanel
              icon="◇"
              title="ADD A PHOTO"
              description="Add a photo they'll discover with this coupon."
              value={editingCoupon.photoUrl}
              placeholder="Photo URL"
              onChange={(value) =>
                setEditingCoupon({
                  ...editingCoupon,
                  photoUrl: value,
                })
              }
            />
          )}

          {editTab === "video" && (
            <AttachmentPanel
              icon="▷"
              title="ADD A VIDEO"
              description="Add a private video or memory."
              value={editingCoupon.videoUrl}
              placeholder="Video URL"
              onChange={(value) =>
                setEditingCoupon({
                  ...editingCoupon,
                  videoUrl: value,
                })
              }
            />
          )}

          {editTab === "voice" && (
            <AttachmentPanel
              icon="♪"
              title="VOICE MESSAGE"
              description="Add a voice message they'll hear when opening it."
              value={editingCoupon.voiceUrl}
              placeholder="Audio URL"
              onChange={(value) =>
                setEditingCoupon({
                  ...editingCoupon,
                  voiceUrl: value,
                })
              }
            />
          )}

          {editTab === "gift" && (
            <div className="panel">
              <p className="panelTitle">
                ATTACH A REAL GIFT ♡
              </p>

              <p className="panelText">
                Cinema ticket, reservation, digital gift,
                booking or any private link.
              </p>

              <label>
                GIFT / TICKET LINK
                <input
                  value={editingCoupon.giftUrl}
                  placeholder="https://..."
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      giftUrl: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          )}

          {editTab === "reminder" && (
            <div className="panel reminderPanel">
              <div className="switchRow">
                <div>
                  <strong>NOTIFY ME WHEN REDEEMED</strong>
                  <p>
                    Get a message when they choose this
                    coupon.
                  </p>
                </div>

                <button
                  className={`switch ${
                    editingCoupon.reminderEnabled
                      ? "on"
                      : ""
                  }`}
                  onClick={() =>
                    setEditingCoupon({
                      ...editingCoupon,
                      reminderEnabled:
                        !editingCoupon.reminderEnabled,
                    })
                  }
                >
                  <i />
                </button>
              </div>

              <div className="notifyPreview">
                <small>TELEGRAM PREVIEW</small>
                <strong>
                  {recipientName || "Someone special"} redeemed
                  “{editingCoupon.title}” ♡
                </strong>
                <span>
                  Time to make this little promise happen.
                </span>
              </div>
            </div>
          )}

          <button
            className="primary full"
            onClick={saveEditedCoupon}
          >
            SAVE COUPON ♡
          </button>
        </Modal>
      )}

      {/* PREVIEW */}

      {modal === "preview" && (
        <Modal onClose={() => setModal(null)} wide>
          <p className="eyebrow">ONE LAST LOOK ♡</p>

          <div className="previewLayout">
            <div>
              <h2>
                THEIR LITTLE
                <br />
                <em>PROMISES.</em>
              </h2>

              <p className="previewCopy">
                From <strong>{senderName}</strong>
                <br />
                for <strong>{recipientName}</strong>
              </p>

              <div className="previewStats">
                <span>
                  <small>COUPONS</small>
                  <strong>{selected.length}</strong>
                </span>

                <span>
                  <small>DAILY LIMIT</small>
                  <strong>
                    {dailyLimit === "unlimited"
                      ? "∞"
                      : dailyLimit}
                  </strong>
                </span>
              </div>

              <button
                className="primary"
                onClick={createGift}
                disabled={creating}
              >
                {creating
                  ? "CREATING..."
                  : "SEND GIFT →"}
              </button>
            </div>

            <MiniTicketRoll coupons={selectedCoupons} />
          </div>
        </Modal>
      )}

      {/* SEND */}

      {modal === "send" && (
        <Modal onClose={() => setModal(null)} wide>
          <p className="eyebrow">YOUR GIFT IS READY ♡</p>

          <h2>
            HOW SHOULD
            <br />
            <em>IT ARRIVE?</em>
          </h2>

          <div className="sendChoices">
            <div className="sendChoice dark">
              <small>01 · LET WIVELI DO IT</small>

              <h3>
                SEND IT
                <br />
                <em>FOR ME.</em>
              </h3>

              <p>
                We'll send them a sweet message with their
                private gift.
              </p>

              <button
                onClick={() => setModal("sendForMe")}
              >
                CHOOSE THIS →
              </button>
            </div>

            <div className="sendChoice">
              <small>02 · KEEP THE MOMENT YOURS</small>

              <h3>
                I'LL SEND IT
                <br />
                <em>MYSELF.</em>
              </h3>

              <p>
                Copy your private link and send it however
                feels right.
              </p>

              <button onClick={() => setModal("link")}>
                CHOOSE THIS →
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SEND FOR ME */}

      {modal === "sendForMe" && (
        <Modal onClose={() => setModal("send")}>
          <p className="eyebrow">SEND IT FOR ME</p>

          <h2 className="editTitle">
            WHERE SHOULD
            <br />
            WE SEND IT? ♡
          </h2>

          <div className="panel">
            <label>
              TELEGRAM / EMAIL
              <input placeholder="@username or email" />
            </label>

            <label>
              MESSAGE
              <textarea
                defaultValue={`Someone special sent you a little something ♡`}
              />
            </label>
          </div>

          <button
            className="primary full"
            onClick={() =>
              alert(
                "Delivery connection comes next — your private gift is already created ♡"
              )
            }
          >
            SEND WITH WIVELI →
          </button>
        </Modal>
      )}

      {/* LINK */}

      {modal === "link" && (
        <Modal onClose={() => setModal("send")}>
          <p className="eyebrow">PRIVATE GIFT LINK</p>

          <h2 className="editTitle">
            READY TO
            <br />
            SHARE ♡
          </h2>

          <div className="linkBox">{giftUrl}</div>

          <button className="primary full" onClick={copyLink}>
            COPY PRIVATE LINK
          </button>

          <a
            className="previewLink"
            href={giftUrl}
            target="_blank"
            rel="noreferrer"
          >
            PREVIEW RECIPIENT GIFT →
          </a>
        </Modal>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        .page {
          min-height: 100svh;
          overflow-x: hidden;
          color: #5d0b18;
          background:
            radial-gradient(
              circle at 74% 28%,
              rgba(255, 238, 233, 0.8),
              transparent 32%
            ),
            #efc5c2;
          font-family: Georgia, "Times New Roman", serif;
        }

        .page header {
          height: 72px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 40px;
          border-bottom: 1px solid
            rgba(93, 11, 24, 0.16);
        }

        .logo {
          color: #fff8f3;
          text-decoration: none;
          font-size: 22px;
          font-weight: 700;
        }

        .centerTitle,
        .brand,
        .eyebrow {
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.17em;
        }

        .brand {
          justify-self: end;
        }

        .workspace {
          width: min(1240px, calc(100% - 50px));
          min-height: calc(100svh - 72px);
          margin: auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 70px;
          align-items: center;
        }

        .formSide {
          max-width: 500px;
        }

        .eyebrow {
          margin: 0 0 20px;
        }

        .formSide h1,
        .modalCard h2 {
          margin: 0 0 30px;
          font-size: clamp(48px, 5.4vw, 76px);
          line-height: 0.83;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        h1 em,
        h2 em,
        h3 em {
          font-weight: 400;
        }

        .fields {
          display: grid;
          gap: 14px;
        }

        .two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        label {
          display: grid;
          gap: 7px;
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        input,
        select,
        textarea {
          width: 100%;
          color: #5d0b18;
          border: 1px solid rgba(93, 11, 24, 0.22);
          border-radius: 10px;
          background: rgba(255, 244, 241, 0.38);
          outline: none;
        }

        input,
        select {
          height: 50px;
          padding: 0 14px;
          font-family: Georgia, serif;
          font-size: 15px;
        }

        textarea {
          min-height: 105px;
          resize: vertical;
          padding: 14px;
          font-family: Georgia, serif;
          font-size: 15px;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #720f20;
        }

        .hint {
          opacity: 0.55;
          font-family: Georgia, serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .mainActions {
          display: flex;
          gap: 10px;
          margin-top: 22px;
        }

        .primary,
        .outline {
          min-height: 50px;
          border-radius: 100px;
          padding: 0 24px;
          cursor: pointer;
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        .primary {
          border: 0;
          background: #741020;
          color: #fbe1dc;
        }

        .primary:disabled {
          opacity: 0.35;
          cursor: default;
        }

        .primary span {
          margin-left: 25px;
        }

        .outline {
          border: 1px solid #741020;
          background: transparent;
          color: #741020;
        }

        .selectedText {
          margin-top: 13px;
          font-size: 12px;
          font-style: italic;
        }

        /* MACHINE */

        .machinePreview {
          position: relative;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .senderMachine {
          position: relative;
          z-index: 3;
          width: min(530px, 100%);
          height: 340px;
          overflow: hidden;
          border-radius: 32px;
          padding: 30px;
          color: #f8d8d2;
          background:
            radial-gradient(
              circle at 50% 10%,
              #8d1b2b,
              transparent 42%
            ),
            linear-gradient(145deg, #781323, #4b0711);
          box-shadow:
            0 35px 70px rgba(72, 5, 17, 0.22),
            inset 0 1px rgba(255, 255, 255, 0.12);
        }

        .machineHeader {
          display: flex;
          justify-content: space-between;
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }

        .machineStatus {
          display: flex;
          gap: 7px;
          align-items: center;
        }

        .machineStatus i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #efb5ae;
        }

        .machineHeart {
          margin-top: 55px;
          text-align: center;
          font-size: 18px;
        }

        .machineFor {
          margin-top: 12px;
          text-align: center;
        }

        .machineFor small {
          display: block;
          font-family: Arial, sans-serif;
          font-size: 8px;
          letter-spacing: 0.15em;
        }

        .machineFor strong {
          display: block;
          margin-top: 7px;
          font-size: 34px;
          font-weight: 400;
          font-style: italic;
        }

        .machineBottom {
          position: absolute;
          left: 30px;
          right: 30px;
          bottom: 28px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .machineCount small {
          display: block;
          font-family: Arial, sans-serif;
          font-size: 7px;
          letter-spacing: 0.14em;
        }

        .machineCount strong {
          font-size: 30px;
          font-weight: 400;
        }

        .machineCount span {
          opacity: 0.5;
          font-size: 15px;
        }

        .machineSlot {
          width: 270px;
          height: 13px;
          border-radius: 20px;
          background: #260108;
          box-shadow: inset 0 2px 5px #160004;
        }

        .rollPreview {
          position: absolute;
          z-index: 2;
          top: 420px;
          width: 365px;
        }

        .rollTicket {
          min-height: 118px;
          padding: 17px 20px;
          position: relative;
          border: 1px solid #8b3944;
          background: #f8e4de;
          margin-top: -1px;
        }

        .rollTicket:before,
        .physicalTicket:before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -1px;
          border-top: 1px dashed #8b3944;
        }

        .rollTicket small,
        .physicalTicket small {
          font-family: Arial, sans-serif;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .rollTicket strong {
          display: block;
          margin-top: 19px;
          font-size: 18px;
        }

        .rollTicket span {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          font-style: italic;
        }

        /* MODALS */

        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 25px;
          background: rgba(70, 20, 26, 0.42);
          backdrop-filter: blur(12px);
        }

        .modalCard {
          position: relative;
          width: min(560px, 96vw);
          max-height: 90svh;
          overflow-y: auto;
          padding: 36px;
          border: 1px solid
            rgba(93, 11, 24, 0.12);
          border-radius: 18px;
          background: #f2cfca;
          box-shadow: 0 35px 100px
            rgba(59, 4, 13, 0.28);
        }

        .modalCard.wide {
          width: min(1080px, 96vw);
        }

        .closeModal {
          position: absolute;
          z-index: 3;
          right: 20px;
          top: 15px;
          border: 0;
          background: none;
          color: #5d0b18;
          font-size: 27px;
          cursor: pointer;
        }

        .modalHeading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .modalHeading h2 {
          font-size: 60px;
          margin-bottom: 20px;
        }

        .bigCounter {
          margin-bottom: 25px;
          font-size: 52px;
        }

        .bigCounter span {
          font-size: 18px;
        }

        .categories {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 16px;
        }

        .categories button,
        .editorTabs button {
          flex: 0 0 auto;
          padding: 9px 14px;
          border: 1px solid
            rgba(93, 11, 24, 0.22);
          border-radius: 100px;
          background: transparent;
          color: #5d0b18;
          cursor: pointer;
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .categories button.active,
        .editorTabs button.active {
          background: #741020;
          color: #f9ddd8;
        }

        .ticketGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .physicalTicket {
          position: relative;
          min-height: 185px;
          overflow: hidden;
          border: 1px solid
            rgba(93, 11, 24, 0.3);
          border-radius: 10px;
          background: #f8e4de;
          transition: 0.18s;
        }

        .physicalTicket.selected {
          color: #f9dcd7;
          background: #741020;
          transform: translateY(-2px);
        }

        .ticketMain {
          min-height: 142px;
          padding: 17px;
          cursor: pointer;
        }

        .ticketNumber {
          position: absolute;
          right: 16px;
          top: 16px;
          font-size: 10px;
        }

        .physicalTicket h3 {
          margin: 30px 0 5px;
          font-size: 19px;
          line-height: 1;
        }

        .physicalTicket p {
          margin: 0;
          font-size: 11px;
          font-style: italic;
        }

        .ticketExtras {
          display: flex;
          gap: 5px;
          margin-top: 11px;
        }

        .ticketExtras i {
          display: inline-flex;
          width: 21px;
          height: 21px;
          align-items: center;
          justify-content: center;
          border: 1px solid currentColor;
          border-radius: 50%;
          font-size: 9px;
          font-style: normal;
        }

        .ticketButtons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px dashed currentColor;
        }

        .ticketButtons button {
          height: 40px;
          border: 0;
          border-right: 1px solid
            rgba(93, 11, 24, 0.2);
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .modalFooter {
          position: sticky;
          bottom: -36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 22px -36px -36px;
          padding: 15px 36px;
          background: rgba(242, 207, 202, 0.94);
          backdrop-filter: blur(10px);
          border-top: 1px solid
            rgba(93, 11, 24, 0.15);
          font-size: 11px;
        }

        /* EDITOR */

        .editTitle {
          font-size: 43px !important;
          line-height: 0.9 !important;
        }

        .editorTabs {
          display: flex;
          gap: 5px;
          overflow-x: auto;
          margin-bottom: 18px;
        }

        .editTicket {
          margin-bottom: 16px;
          padding: 20px;
          border: 1px solid #8b3944;
          border-radius: 10px;
          background: #f8e4de;
        }

        .editTicket small {
          font-family: Arial, sans-serif;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        .editTicketTitle,
        .editTicketSubtitle {
          height: auto;
          padding: 0;
          border: 0;
          border-radius: 0;
          background: transparent;
        }

        .editTicketTitle {
          margin-top: 23px;
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 700;
        }

        .editTicketSubtitle {
          margin-top: 6px;
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
        }

        .panel {
          display: grid;
          gap: 14px;
          margin-bottom: 16px;
          padding: 18px;
          border: 1px solid
            rgba(93, 11, 24, 0.17);
          border-radius: 12px;
          background: rgba(255, 246, 242, 0.28);
        }

        .attachmentPanel {
          text-align: center;
        }

        .attachmentIcon {
          display: grid;
          width: 52px;
          height: 52px;
          margin: 0 auto;
          place-items: center;
          border: 1px solid #741020;
          border-radius: 50%;
          font-size: 22px;
        }

        .attachmentPanel h3,
        .panelTitle {
          margin: 3px 0;
          font-family: Arial, sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        .attachmentPanel p,
        .panelText,
        .switchRow p {
          margin: 0;
          opacity: 0.6;
          font-size: 12px;
          font-style: italic;
        }

        .full {
          width: 100%;
        }

        .switchRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .switchRow strong {
          font-family: Arial, sans-serif;
          font-size: 9px;
          letter-spacing: 0.1em;
        }

        .switch {
          width: 46px;
          height: 25px;
          padding: 3px;
          border: 1px solid #741020;
          border-radius: 100px;
          background: transparent;
          cursor: pointer;
        }

        .switch i {
          display: block;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #741020;
          transition: 0.2s;
        }

        .switch.on {
          background: #741020;
        }

        .switch.on i {
          transform: translateX(19px);
          background: #f9ddd8;
        }

        .notifyPreview {
          display: grid;
          gap: 8px;
          padding: 16px;
          border-radius: 10px;
          color: #f9ddd8;
          background: #741020;
        }

        .notifyPreview small {
          font-family: Arial, sans-serif;
          font-size: 7px;
          letter-spacing: 0.13em;
        }

        .notifyPreview span {
          opacity: 0.7;
          font-size: 11px;
        }

        /* PREVIEW */

        .previewLayout {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 50px;
          align-items: center;
        }

        .previewLayout h2 {
          font-size: 58px;
        }

        .previewCopy {
          font-size: 16px;
          line-height: 1.5;
        }

        .previewStats {
          display: flex;
          gap: 10px;
          margin: 25px 0;
        }

        .previewStats span {
          min-width: 125px;
          padding: 15px;
          border: 1px solid
            rgba(93, 11, 24, 0.2);
          border-radius: 10px;
        }

        .previewStats small {
          display: block;
          font-family: Arial, sans-serif;
          font-size: 7px;
          letter-spacing: 0.1em;
        }

        .previewStats strong {
          display: block;
          margin-top: 8px;
          font-size: 28px;
        }

        .miniRoll {
          max-height: 520px;
          overflow-y: auto;
          padding: 10px;
        }

        .miniRoll .rollTicket {
          min-height: 105px;
        }

        /* SEND */

        .sendChoices {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .sendChoice {
          min-height: 330px;
          display: flex;
          flex-direction: column;
          padding: 28px;
          border: 1px solid
            rgba(93, 11, 24, 0.25);
          border-radius: 16px;
        }

        .sendChoice.dark {
          color: #f9dcd7;
          background: #741020;
        }

        .sendChoice small {
          font-family: Arial, sans-serif;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        .sendChoice h3 {
          margin: 60px 0 15px;
          font-size: 42px;
          line-height: 0.82;
        }

        .sendChoice p {
          max-width: 330px;
          font-size: 13px;
        }

        .sendChoice button {
          margin-top: auto;
          padding: 15px 0 0;
          border: 0;
          border-top: 1px solid currentColor;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .linkBox {
          margin: 20px 0 12px;
          padding: 16px;
          overflow-wrap: anywhere;
          border: 1px solid
            rgba(93, 11, 24, 0.2);
          border-radius: 10px;
          background: rgba(255, 246, 242, 0.3);
          font-size: 13px;
        }

        .previewLink {
          display: block;
          margin-top: 18px;
          color: #5d0b18;
          text-align: center;
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        @media (max-width: 800px) {
          .page header {
            padding: 0 18px;
          }

          .centerTitle {
            display: none;
          }

          .workspace {
            width: calc(100% - 36px);
            grid-template-columns: 1fr;
            padding: 35px 0 100px;
          }

          .machinePreview {
            min-height: 510px;
          }

          .senderMachine {
            height: 300px;
          }

          .machineSlot {
            width: 190px;
          }

          .rollPreview {
            top: 385px;
            width: 78%;
          }

          .two,
          .previewLayout,
          .sendChoices {
            grid-template-columns: 1fr;
          }

          .ticketGrid {
            grid-template-columns: 1fr;
          }

          .modalCard {
            padding: 28px 20px;
          }

          .modalHeading h2,
          .previewLayout h2 {
            font-size: 43px;
          }

          .modalFooter {
            margin: 20px -20px -28px;
            padding: 12px 20px;
          }
        }
      `}</style>
    </main>
  );
}

function Modal({ children, onClose, wide = false }) {
  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div
        className={`modalCard ${wide ? "wide" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="closeModal" onClick={onClose}>
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

function MachinePreview({
  senderName,
  recipientName,
  coupons,
  couponCount,
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
    <div className="machinePreview">
      <div className="senderMachine">
        <div className="machineHeader">
          <span>WI♡ELI</span>

          <span className="machineStatus">
            <i />
            LOVE COUPON MACHINE
          </span>
        </div>

        <div className="machineHeart">♡</div>

        <div className="machineFor">
          <small>MADE WITH LOVE FOR</small>
          <strong>
            {recipientName || "someone special"}
          </strong>
        </div>

        <div className="machineBottom">
          <div className="machineCount">
            <small>COUPONS</small>
            <strong>
              {String(coupons.length).padStart(2, "0")}
              <span>
                /{String(couponCount).padStart(2, "0")}
              </span>
            </strong>
          </div>

          <div className="machineSlot" />
        </div>
      </div>

      <div className="rollPreview">
        {examples.map((coupon, index) => (
          <div className="rollTicket" key={index}>
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

function PhysicalTicket({
  coupon,
  number,
  selected,
  onSelect,
  onEdit,
}) {
  return (
    <article
      className={`physicalTicket ${
        selected ? "selected" : ""
      }`}
    >
      <div className="ticketMain" onClick={onSelect}>
        <small>WI♡ELI · LOVE COUPON</small>

        <span className="ticketNumber">
          {String(number).padStart(2, "0")}
        </span>

        <h3>{coupon.title}</h3>
        <p>{coupon.subtitle}</p>

        <div className="ticketExtras">
          {coupon.message && <i>✎</i>}
          {coupon.photoUrl && <i>◇</i>}
          {coupon.videoUrl && <i>▷</i>}
          {coupon.voiceUrl && <i>♪</i>}
          {coupon.giftUrl && <i>♥</i>}
          {coupon.reminderEnabled && <i>↗</i>}
        </div>
      </div>

      <div className="ticketButtons">
        <button onClick={onSelect}>
          {selected ? "✓ SELECTED" : "+ ADD"}
        </button>

        <button onClick={onEdit}>EDIT</button>
      </div>
    </article>
  );
}

function AttachmentPanel({
  icon,
  title,
  description,
  value,
  placeholder,
  onChange,
}) {
  return (
    <div className="panel attachmentPanel">
      <span className="attachmentIcon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function MiniTicketRoll({ coupons }) {
  return (
    <div className="miniRoll">
      {coupons.map((coupon, index) => (
        <div className="rollTicket" key={coupon.id || index}>
          <small>
            WI♡ELI · LOVE COUPON ·{" "}
            {String(index + 1).padStart(2, "0")}
          </small>

          <strong>{coupon.title}</strong>
          <span>{coupon.subtitle}</span>
        </div>
      ))}
    </div>
  );
}

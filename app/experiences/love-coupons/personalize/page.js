"use client";

import { useMemo, useState } from "react";
import { couponIdeas, couponCategories } from "../coupons";
import LoveCouponTicket from "../../../gift/love-coupons/LoveCouponTicket";
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

    return couponIdeas.filter(
      (coupon) => coupon.category === category
    );
  }, [category]);

  const selectedCoupons = useMemo(() => {
    return selected
      .map((id) => {
        const custom = customCoupons.find(
          (coupon) => coupon.originalId === id
        );

        if (custom) return custom;

        return couponIdeas.find(
          (coupon) => coupon.id === id
        );
      })
      .filter(Boolean);
  }, [selected, customCoupons]);

  const toggleCoupon = (id) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter(
          (couponId) => couponId !== id
        );
      }

      if (current.length >= couponCount) {
        return current;
      }

      return [...current, id];
    });
  };

  const openEditor = (coupon) => {
    const existing = customCoupons.find(
      (item) => item.originalId === coupon.id
    );

    setEditingCoupon({
      ...coupon,
      ...existing,
      originalId: coupon.id,
      message: existing?.message || "",
      photoUrl: existing?.photoUrl || "",
      videoUrl: existing?.videoUrl || "",
      voiceUrl: existing?.voiceUrl || "",
      giftUrl: existing?.giftUrl || "",
      reminderEnabled:
        existing?.reminderEnabled || false,
    });

    setEditTab("message");
    setModal("edit");
  };

  const saveEditedCoupon = () => {
    if (!editingCoupon) return;

    setCustomCoupons((current) => {
      const exists = current.some(
        (coupon) =>
          coupon.originalId ===
          editingCoupon.originalId
      );

      if (exists) {
        return current.map((coupon) =>
          coupon.originalId ===
          editingCoupon.originalId
            ? editingCoupon
            : coupon
        );
      }

      return [...current, editingCoupon];
    });

    setSelected((current) => {
      if (
        current.includes(
          editingCoupon.originalId
        )
      ) {
        return current;
      }

      if (current.length >= couponCount) {
        return current;
      }

      return [
        ...current,
        editingCoupon.originalId,
      ];
    });

    setModal("coupons");
  };

  const createGift = async () => {
    if (!senderName.trim()) return;
    if (!recipientName.trim()) return;
    if (!selectedCoupons.length) return;

    setCreating(true);

    try {
      const gift = createLoveCouponsGift({
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        senderTelegram:
          senderTelegram.trim(),
        couponCount,
        dailyLimit,
        coupons: selectedCoupons,
      });

      await saveLoveCouponsGift(gift);

      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/gift/love-coupons/${gift.id}`
          : `/gift/love-coupons/${gift.id}`;

      setGiftUrl(url);
      setModal("send");
    } catch (error) {
      console.error(
        "Failed to create gift:",
        error
      );
    } finally {
      setCreating(false);
    }
  };

  const copyGiftLink = async () => {
    if (!giftUrl) return;

    try {
      await navigator.clipboard.writeText(
        giftUrl
      );
    } catch {
      const textarea =
        document.createElement("textarea");

      textarea.value = giftUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  };

  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="/">
          WI♡ELI
        </a>

        <div className="headerRight">
          <span>LOVE COUPONS</span>
          <span>♡</span>
        </div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">
            LOVE COUPON MACHINE
          </p>

          <h1>
            LITTLE PROMISES,
            <br />
            MADE FOR
            <br />
            <em>SOMEONE SPECIAL.</em>
          </h1>

          <p className="intro">
            Pick the promises you want to
            give. Make them personal. Send
            them to someone you love.
          </p>

          <button
            className="primary startButton"
            onClick={() =>
              setModal("details")
            }
          >
            CREATE LOVE COUPONS ♡
          </button>
        </div>

        <MachinePreview
          coupons={selectedCoupons}
        />
      </section>

      <section className="steps">
        <div>
          <span>01</span>
          <strong>WHO?</strong>
          <p>
            Tell us who the coupons are
            from and who they are for.
          </p>
        </div>

        <div>
          <span>02</span>
          <strong>CHOOSE.</strong>
          <p>
            Pick your favourite little
            promises and make them yours.
          </p>
        </div>

        <div>
          <span>03</span>
          <strong>SEND.</strong>
          <p>
            Send the gift from WIVELI or
            share the private link yourself.
          </p>
        </div>
      </section>

      {/* DETAILS */}

      {modal === "details" && (
        <Modal
          onClose={() =>
            setModal(null)
          }
        >
          <div className="detailsLayout">
            <div className="detailsForm">
              <p className="eyebrow">
                STEP 01 · DETAILS
              </p>

              <h2>
                WHO&apos;S
                <br />
                THIS FOR?
              </h2>

              <p className="modalIntro">
                Just the basics. We&apos;ll
                make the rest feel special.
              </p>

              <label>
                YOUR NAME
                <input
                  value={senderName}
                  onChange={(event) =>
                    setSenderName(
                      event.target.value
                    )
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                THEIR NAME
                <input
                  value={recipientName}
                  onChange={(event) =>
                    setRecipientName(
                      event.target.value
                    )
                  }
                  placeholder="Their name"
                />
              </label>

              <label>
                YOUR TELEGRAM
                <input
                  value={senderTelegram}
                  onChange={(event) =>
                    setSenderTelegram(
                      event.target.value
                    )
                  }
                  placeholder="@username"
                />

                <small>
                  Optional for now. We can
                  use it later for coupon
                  notifications.
                </small>
              </label>

              <div className="smallGrid">
                <label>
                  COUPONS
                  <select
                    value={couponCount}
                    onChange={(event) =>
                      setCouponCount(
                        Number(
                          event.target.value
                        )
                      )
                    }
                  >
                    <option value={4}>
                      4
                    </option>
                    <option value={6}>
                      6
                    </option>
                    <option value={8}>
                      8
                    </option>
                    <option value={10}>
                      10
                    </option>
                    <option value={12}>
                      12
                    </option>
                  </select>
                </label>

                <label>
                  DAILY LIMIT
                  <select
                    value={dailyLimit}
                    onChange={(event) =>
                      setDailyLimit(
                        Number(
                          event.target.value
                        )
                      )
                    }
                  >
                    <option value={1}>
                      1 / DAY
                    </option>
                    <option value={2}>
                      2 / DAY
                    </option>
                    <option value={3}>
                      3 / DAY
                    </option>
                    <option value={5}>
                      5 / DAY
                    </option>
                  </select>
                </label>
              </div>

              <button
                className="primary full"
                disabled={
                  !senderName.trim() ||
                  !recipientName.trim()
                }
                onClick={() =>
                  setModal("coupons")
                }
              >
                CHOOSE COUPONS →
              </button>
            </div>

            <div className="detailsMachine">
              <MachinePreview
                senderName={senderName}
                recipientName={
                  recipientName
                }
                coupons={
                  selectedCoupons
                }
              />
            </div>
          </div>
        </Modal>
      )}

      {/* COUPONS */}

      {modal === "coupons" && (
        <Modal
          wide
          onClose={() =>
            setModal(null)
          }
        >
          <div className="couponHeader">
            <div>
              <p className="eyebrow">
                STEP 02 · PICK YOUR
                PROMISES
              </p>

              <h2>
                CHOOSE THE
                <br />
                <em>COUPONS.</em>
              </h2>
            </div>

            <div className="counter">
              <strong>
                {selected.length}
              </strong>
              <span>
                / {couponCount}
              </span>
              <small>SELECTED</small>
            </div>
          </div>

          <div className="categoryBar">
            <button
              className={
                category === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory("all")
              }
            >
              ALL
            </button>

            {couponCategories.map(
              (item) => (
                <button
                  key={item.id}
                  className={
                    category === item.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCategory(item.id)
                  }
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          <div className="ticketGrid">
            {filteredCoupons.map(
              (coupon, index) => {
                const active =
                  selected.includes(
                    coupon.id
                  );

                const custom =
                  customCoupons.find(
                    (c) =>
                      c.originalId ===
                      coupon.id
                  );

                const display =
                  custom || coupon;

                return (
                  <LoveCouponTicket
                    key={coupon.id}
                    number={String(
                      index + 1
                    ).padStart(2, "0")}
                    title={display.title}
                    description={
                      display.subtitle
                    }
                    message={
                      display.message || ""
                    }
                    selected={active}
                    onSelect={() =>
                      toggleCoupon(
                        coupon.id
                      )
                    }
                    onEdit={() =>
                      openEditor(coupon)
                    }
                  />
                );
              }
            )}
          </div>

          <div className="modalFooter">
            <span>
              {selected.length} OF{" "}
              {couponCount} SELECTED
            </span>

            <button
              className="primary"
              disabled={
                !selected.length
              }
              onClick={() =>
                setModal("preview")
              }
            >
              PREVIEW GIFT →
            </button>
          </div>
        </Modal>
      )}

      {/* EDIT */}

      {modal === "edit" &&
        editingCoupon && (
          <Modal
            onClose={() => {
              setEditingCoupon(null);
              setModal("coupons");
            }}
          >
            <p className="eyebrow">
              EDIT COUPON
            </p>

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
                [
                  "reminder",
                  "REMIND ME",
                ],
              ].map(
                ([id, label]) => (
                  <button
                    key={id}
                    className={
                      editTab === id
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setEditTab(id)
                    }
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            <div className="editorContent">
              {editTab ===
                "message" && (
                <div className="panel">
                  <label>
                    COUPON TITLE
                    <input
                      value={
                        editingCoupon.title
                      }
                      onChange={(
                        event
                      ) =>
                        setEditingCoupon(
                          {
                            ...editingCoupon,
                            title:
                              event
                                .target
                                .value,
                          }
                        )
                      }
                    />
                  </label>

                  <label>
                    LITTLE NOTE
                    <textarea
                      value={
                        editingCoupon.message
                      }
                      onChange={(
                        event
                      ) =>
                        setEditingCoupon(
                          {
                            ...editingCoupon,
                            message:
                              event
                                .target
                                .value,
                          }
                        )
                      }
                      placeholder="Write something just for them..."
                    />
                  </label>
                </div>
              )}

              {editTab ===
                "photo" && (
                <AttachmentPanel
                  icon="◇"
                  title="ADD A PHOTO"
                  description="Add a photo that belongs with this promise."
                  value={
                    editingCoupon.photoUrl
                  }
                  placeholder="Paste photo URL"
                  onChange={(value) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      photoUrl: value,
                    })
                  }
                />
              )}

              {editTab ===
                "video" && (
                <AttachmentPanel
                  icon="▷"
                  title="ADD A VIDEO"
                  description="Attach a video to reveal when the coupon is opened."
                  value={
                    editingCoupon.videoUrl
                  }
                  placeholder="Paste video URL"
                  onChange={(value) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      videoUrl: value,
                    })
                  }
                />
              )}

              {editTab ===
                "voice" && (
                <AttachmentPanel
                  icon="♪"
                  title="VOICE NOTE"
                  description="Add a voice message for this coupon."
                  value={
                    editingCoupon.voiceUrl
                  }
                  placeholder="Paste audio URL"
                  onChange={(value) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      voiceUrl: value,
                    })
                  }
                />
              )}

              {editTab ===
                "gift" && (
                <AttachmentPanel
                  icon="♥"
                  title="ADD A REAL GIFT"
                  description="Add a ticket, reservation, gift card or any private link."
                  value={
                    editingCoupon.giftUrl
                  }
                  placeholder="Paste gift or ticket URL"
                  onChange={(value) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      giftUrl: value,
                    })
                  }
                />
              )}

              {editTab ===
                "reminder" && (
                <div className="panel reminderPanel">
                  <span className="attachmentIcon">
                    ↗
                  </span>

                  <h3>
                    DO IT TOGETHER
                  </h3>

                  <p>
                    When this coupon is
                    redeemed, WIVELI can
                    remind you that
                    they&apos;re ready to
                    use it.
                  </p>

                  <button
                    className={`reminderToggle ${
                      editingCoupon.reminderEnabled
                        ? "active"
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
                    {editingCoupon.reminderEnabled
                      ? "✓ REMINDER ON"
                      : "+ TURN REMINDER ON"}
                  </button>
                </div>
              )}
            </div>

            <div className="editorPreview">
              <LoveCouponTicket
                number="01"
                title={
                  editingCoupon.title
                }
                description={
                  editingCoupon.subtitle
                }
                message={
                  editingCoupon.message
                }
                selected
              />
            </div>

            <div className="modalFooter">
              <button
                className="textButton"
                onClick={() =>
                  setModal("coupons")
                }
              >
                ← BACK
              </button>

              <button
                className="primary"
                onClick={
                  saveEditedCoupon
                }
              >
                SAVE COUPON ♡
              </button>
            </div>
          </Modal>
        )}

      {/* PREVIEW */}

      {modal === "preview" && (
        <Modal
          onClose={() =>
            setModal("coupons")
          }
        >
          <p className="eyebrow">
            STEP 03 · PREVIEW
          </p>

          <h2>
            READY TO
            <br />
            <em>MAKE THEIR DAY?</em>
          </h2>

          <p className="modalIntro">
            A little collection of
            promises from {senderName} to{" "}
            {recipientName}.
          </p>

          <div className="previewCard">
            <div className="previewNames">
              <span>
                FROM
                <strong>
                  {senderName}
                </strong>
              </span>

              <i>♡</i>

              <span>
                FOR
                <strong>
                  {recipientName}
                </strong>
              </span>
            </div>

            <MiniTicketRoll
              coupons={
                selectedCoupons
              }
            />

            <div className="previewMeta">
              <span>
                {selectedCoupons.length}{" "}
                LOVE COUPONS
              </span>

              <span>
                UP TO {dailyLimit} / DAY
              </span>
            </div>
          </div>

          <div className="modalFooter">
            <button
              className="textButton"
              onClick={() =>
                setModal("coupons")
              }
            >
              ← EDIT COUPONS
            </button>

            <button
              className="primary"
              disabled={creating}
              onClick={createGift}
            >
              {creating
                ? "CREATING..."
                : "CREATE GIFT →"}
            </button>
          </div>
        </Modal>
      )}

      {/* SEND */}

      {modal === "send" && (
        <Modal
          onClose={() =>
            setModal(null)
          }
        >
          <div className="sendSuccess">
            <span className="successHeart">
              ♡
            </span>

            <p className="eyebrow">
              YOUR GIFT IS READY
            </p>

            <h2>
              HOW DO YOU
              <br />
              WANT TO SEND IT?
            </h2>

            <p>
              Your private Love Coupon
              collection for{" "}
              {recipientName} is ready.
            </p>

            <div className="sendOptions">
              <button
                className="sendOption"
                onClick={() => {
                  const subject =
                    encodeURIComponent(
                      `${senderName} sent you Love Coupons ♡`
                    );

                  const body =
                    encodeURIComponent(
                      `A little gift is waiting for you ♡\n\n${giftUrl}`
                    );

                  window.location.href =
                    `mailto:?subject=${subject}&body=${body}`;
                }}
              >
                <span>01</span>

                <strong>
                  SEND FROM WIVELI
                </strong>

                <small>
                  Open your email app with
                  the gift link ready.
                </small>

                <b>→</b>
              </button>

              <button
                className="sendOption"
                onClick={copyGiftLink}
              >
                <span>02</span>

                <strong>
                  I&apos;LL SEND IT MYSELF
                </strong>

                <small>
                  Copy the private link and
                  send it anywhere.
                </small>

                <b>→</b>
              </button>
            </div>

            <div className="giftLink">
              <span>
                PRIVATE GIFT LINK
              </span>

              <input
                readOnly
                value={giftUrl}
              />

              <button
                onClick={
                  copyGiftLink
                }
              >
                COPY
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          color: #68101e;
          background:
            radial-gradient(
              circle at 80% 18%,
              rgba(
                255,
                255,
                255,
                0.42
              ),
              transparent 26%
            ),
            #f2cfca;

          font-family:
            Georgia,
            "Times New Roman",
            serif;
        }

        .header {
          height: 76px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          padding: 0 4vw;

          border-bottom:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );
        }

        .logo {
          color: inherit;

          text-decoration: none;

          font-size: 21px;

          font-weight: 600;

          letter-spacing:
            -0.04em;
        }

        .headerRight {
          display: flex;

          align-items: center;

          gap: 18px;

          font-family:
            Arial,
            sans-serif;

          font-size: 8px;

          font-weight: 700;

          letter-spacing:
            0.16em;
        }

        .hero {
          min-height:
            calc(
              100vh - 76px
            );

          display: grid;

          grid-template-columns:
            minmax(0, 0.95fr)
            minmax(420px, 1.05fr);

          align-items: center;

          gap: 4vw;

          padding:
            70px
            5vw
            90px;
        }

        .heroCopy {
          max-width: 660px;
        }

        .eyebrow {
          margin:
            0
            0
            18px;

          font-family:
            Arial,
            sans-serif;

          font-size: 8px;

          font-weight: 700;

          letter-spacing:
            0.22em;
        }

        h1,
        h2 {
          margin: 0;

          font-weight: 400;

          letter-spacing:
            -0.055em;

          line-height: 0.91;
        }

        h1 {
          font-size:
            clamp(
              54px,
              6.6vw,
              108px
            );
        }

        h2 {
          font-size:
            clamp(
              42px,
              5.5vw,
              78px
            );
        }

        h1 em,
        h2 em {
          font-weight: 400;

          font-style: italic;
        }

        .intro,
        .modalIntro {
          max-width: 440px;

          margin:
            28px
            0;

          font-size: 15px;

          line-height: 1.55;
        }

        .primary {
          min-height: 48px;

          padding:
            0
            24px;

          border:
            1px solid
            #741020;

          border-radius: 100px;

          color: #f9dcd7;

          background: #741020;

          cursor: pointer;

          font-family:
            Arial,
            sans-serif;

          font-size: 8px;

          font-weight: 700;

          letter-spacing:
            0.14em;

          transition:
            transform 0.18s ease,
            opacity 0.18s ease;
        }

        .primary:hover {
          transform:
            translateY(-2px);
        }

        .primary:disabled {
          cursor: not-allowed;

          opacity: 0.35;

          transform: none;
        }

        .startButton {
          margin-top: 5px;
        }

        .full {
          width: 100%;

          margin-top: 12px;
        }

        .steps {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          border-top:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );

          border-bottom:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );
        }

        .steps > div {
          min-height: 190px;

          padding:
            30px
            4vw;

          border-right:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );
        }

        .steps > div:last-child {
          border-right: 0;
        }

        .steps span {
          display: block;

          margin-bottom: 30px;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;

          font-weight: 700;

          letter-spacing:
            0.15em;
        }

        .steps strong {
          display: block;

          font-size: 24px;

          font-weight: 400;
        }

        .steps p {
          max-width: 250px;

          margin:
            9px
            0
            0;

          font-size: 11px;

          line-height: 1.45;
        }
                .detailsLayout {
          display: grid;
          grid-template-columns:
            minmax(0, 0.92fr)
            minmax(360px, 1.08fr);
          gap: 54px;
          align-items: center;
        }

        .detailsForm {
          min-width: 0;
        }

        .detailsMachine {
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        label {
          display: block;
          margin-bottom: 17px;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        input,
        textarea,
        select {
          width: 100%;
          margin-top: 7px;

          border: 1px solid
            rgba(
              104,
              16,
              30,
              0.45
            );

          border-radius: 0;

          outline: none;

          color: #68101e;
          background:
            rgba(
              255,
              255,
              255,
              0.17
            );

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 15px;
        }

        input,
        select {
          height: 48px;
          padding: 0 14px;
        }

        textarea {
          min-height: 120px;
          padding: 14px;
          resize: vertical;
        }

        input::placeholder,
        textarea::placeholder {
          color:
            rgba(
              104,
              16,
              30,
              0.43
            );
        }

        label small {
          display: block;
          margin-top: 7px;

          font-family:
            Georgia,
            serif;

          font-size: 9px;
          font-weight: 400;
          line-height: 1.4;
          letter-spacing: 0;
          opacity: 0.65;
        }

        .smallGrid {
          display: grid;
          grid-template-columns:
            1fr
            1fr;
          gap: 12px;
        }

        /*
          COUPON PICKER
        */

        .couponHeader {
          display: flex;
          align-items: flex-end;
          justify-content:
            space-between;
          gap: 30px;
          margin-bottom: 30px;
        }

        .counter {
          min-width: 110px;
          text-align: right;
        }

        .counter strong {
          font-size: 42px;
          font-weight: 400;
        }

        .counter span {
          font-size: 18px;
          opacity: 0.55;
        }

        .counter small {
          display: block;
          margin-top: 3px;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .categoryBar {
          display: flex;
          gap: 6px;

          margin-bottom: 30px;

          padding-bottom: 13px;

          overflow-x: auto;

          border-bottom:
            1px solid
            rgba(
              104,
              16,
              30,
              0.28
            );

          scrollbar-width: none;
        }

        .categoryBar::-webkit-scrollbar {
          display: none;
        }

        .categoryBar button {
          flex: 0 0 auto;

          min-height: 34px;

          padding:
            0
            15px;

          border:
            1px solid
            rgba(
              104,
              16,
              30,
              0.55
            );

          border-radius: 100px;

          color: #68101e;
          background: transparent;

          cursor: pointer;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.13em;

          transition:
            color 0.18s ease,
            background 0.18s ease;
        }

        .categoryBar button:hover,
        .categoryBar button.active {
          color: #f8d9d4;
          background: #741020;
        }

        .ticketGrid {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap:
            34px
            24px;

          padding:
            8px
            2px
            34px;
        }

        /*
          EDITOR
        */

        .editTitle {
          margin-bottom: 26px;
        }

        .editorTabs {
          display: flex;
          gap: 5px;

          padding-bottom: 12px;

          overflow-x: auto;

          border-bottom:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );

          scrollbar-width: none;
        }

        .editorTabs::-webkit-scrollbar {
          display: none;
        }

        .editorTabs button {
          flex: 0 0 auto;

          min-height: 34px;

          padding:
            0
            13px;

          border:
            1px solid
            rgba(
              104,
              16,
              30,
              0.45
            );

          border-radius: 100px;

          color: #68101e;
          background: transparent;

          cursor: pointer;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .editorTabs button.active {
          color: #f8d9d4;
          background: #741020;
        }

        .editorContent {
          margin-top: 24px;
        }

        .panel {
          min-height: 210px;
        }

        .attachmentPanel,
        .reminderPanel {
          min-height: 250px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 35px;

          text-align: center;

          border:
            1px dashed
            rgba(
              104,
              16,
              30,
              0.45
            );
        }

        .attachmentIcon {
          display: block;

          margin-bottom: 12px;

          font-size: 35px;
          line-height: 1;
        }

        .attachmentPanel h3,
        .reminderPanel h3 {
          margin:
            0
            0
            9px;

          font-size: 25px;
          font-weight: 400;
        }

        .attachmentPanel p,
        .reminderPanel p {
          max-width: 420px;

          margin:
            0
            auto
            18px;

          font-size: 11px;
          line-height: 1.5;
        }

        .attachmentPanel input {
          max-width: 470px;
        }

        .reminderToggle {
          min-height: 42px;

          padding:
            0
            18px;

          border:
            1px solid
            #741020;

          border-radius: 100px;

          color: #68101e;
          background: transparent;

          cursor: pointer;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .reminderToggle.active {
          color: #f8d9d4;
          background: #741020;
        }

        .editorPreview {
          max-width: 590px;

          margin:
            28px
            auto
            10px;
        }

        /*
          MODAL FOOTER
        */

        .modalFooter {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 20px;

          margin-top: 30px;

          padding-top: 20px;

          border-top:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        .textButton {
          border: 0;
          padding: 10px 0;

          color: #68101e;
          background: transparent;

          cursor: pointer;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        /*
          PREVIEW
        */

        .previewCard {
          margin-top: 30px;

          padding: 24px;

          border:
            1px solid
            rgba(
              104,
              16,
              30,
              0.42
            );

          background:
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .previewNames {
          display: grid;
          grid-template-columns:
            1fr
            auto
            1fr;

          align-items: center;

          gap: 20px;

          padding-bottom: 20px;

          border-bottom:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );
        }

        .previewNames span {
          display: flex;
          flex-direction: column;
          gap: 4px;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .previewNames span:last-child {
          text-align: right;
        }

        .previewNames strong {
          font-family:
            Georgia,
            serif;

          font-size: 20px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .previewNames i {
          font-size: 25px;
          font-style: normal;
        }

        .previewMeta {
          display: flex;
          justify-content:
            space-between;

          gap: 20px;

          margin-top: 20px;

          padding-top: 17px;

          border-top:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        /*
          SEND
        */

        .sendSuccess {
          text-align: center;
        }

        .successHeart {
          display: block;

          margin-bottom: 15px;

          font-size: 55px;
          line-height: 1;
        }

        .sendSuccess > p:not(.eyebrow) {
          max-width: 440px;

          margin:
            20px
            auto
            28px;

          font-size: 13px;
          line-height: 1.5;
        }

        .sendOptions {
          display: grid;
          grid-template-columns:
            1fr
            1fr;

          gap: 12px;

          margin-top: 26px;
        }

        .sendOption {
          position: relative;

          min-height: 170px;

          display: flex;
          flex-direction: column;
          align-items: flex-start;

          padding: 20px;

          border:
            1px solid
            #741020;

          color: #68101e;
          background: transparent;

          text-align: left;

          cursor: pointer;

          transition:
            color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .sendOption:hover {
          color: #f7d8d3;
          background: #741020;
          transform:
            translateY(-3px);
        }

        .sendOption span {
          margin-bottom: 28px;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;
        }

        .sendOption strong {
          max-width: 230px;

          font-size: 21px;
          font-weight: 400;
        }

        .sendOption small {
          max-width: 230px;

          margin-top: 8px;

          font-family:
            Georgia,
            serif;

          font-size: 9px;
          line-height: 1.4;
        }

        .sendOption b {
          position: absolute;

          right: 18px;
          bottom: 17px;

          font-size: 18px;
          font-weight: 400;
        }

        .giftLink {
          display: grid;

          grid-template-columns:
            auto
            1fr
            auto;

          align-items: center;

          gap: 12px;

          margin-top: 20px;

          padding-top: 20px;

          border-top:
            1px solid
            rgba(
              104,
              16,
              30,
              0.25
            );
        }

        .giftLink > span {
          font-family:
            Arial,
            sans-serif;

          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }

        .giftLink input {
          height: 40px;
          margin: 0;

          font-size: 10px;
        }

        .giftLink button {
          height: 40px;

          padding:
            0
            17px;

          border:
            1px solid
            #741020;

          color: #f8d9d4;
          background: #741020;

          cursor: pointer;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        /*
          RESPONSIVE
        */

        @media (
          max-width: 1000px
        ) {
          .hero {
            grid-template-columns:
              1fr;

            min-height: auto;

            padding-top: 55px;
          }

          .heroCopy {
            max-width: 720px;
          }

          .detailsLayout {
            grid-template-columns:
              1fr;
          }

          .detailsMachine {
            display: none;
          }
        }

        @media (
          max-width: 800px
        ) {
          .header {
            height: 64px;

            padding:
              0
              20px;
          }

          .hero {
            padding:
              45px
              20px
              65px;
          }

          h1 {
            font-size:
              clamp(
                46px,
                14vw,
                72px
              );
          }

          h2 {
            font-size:
              clamp(
                39px,
                11vw,
                62px
              );
          }

          .steps {
            grid-template-columns:
              1fr;
          }

          .steps > div {
            min-height: auto;

            padding:
              24px
              20px;

            border-right: 0;

            border-bottom:
              1px solid
              rgba(
                104,
                16,
                30,
                0.25
              );
          }

          .steps > div:last-child {
            border-bottom: 0;
          }

          .steps span {
            margin-bottom: 12px;
          }

          .ticketGrid {
            grid-template-columns:
              1fr;

            gap: 32px;
          }

          .couponHeader {
            align-items:
              flex-start;
          }

          .sendOptions {
            grid-template-columns:
              1fr;
          }

          .giftLink {
            grid-template-columns:
              1fr;
          }

          .giftLink > span {
            text-align: left;
          }

          .smallGrid {
            grid-template-columns:
              1fr;
          }

          .previewNames strong {
            font-size: 16px;
          }
        }

        @media (
          max-width: 520px
        ) {
          .headerRight span:first-child {
            display: none;
          }

          .hero {
            padding-top: 35px;
          }

          .intro {
            margin:
              22px
              0;
          }

          .couponHeader {
            display: block;
          }

          .counter {
            margin-top: 18px;
            text-align: left;
          }

          .modalFooter {
            align-items: stretch;
            flex-direction: column;
          }

          .modalFooter .primary {
            width: 100%;
          }

          .previewNames {
            gap: 9px;
          }

          .previewNames strong {
            font-size: 13px;
          }

          .previewMeta {
            flex-direction: column;
            gap: 7px;
          }
        }
      `}</style>
    </main>
  );
}

/*
  MODAL
*/

function Modal({
  children,
  onClose,
  wide = false,
}) {
  return (
    <div className="modalOverlay">
      <button
        className="modalBackdrop"
        aria-label="Close"
        onClick={onClose}
      />

      <section
        className={`modalCard ${
          wide ? "wide" : ""
        }`}
      >
        <button
          className="modalClose"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {children}
      </section>

      <style jsx>{`
        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 1000;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 28px;

          overflow-y: auto;
        }

        .modalBackdrop {
          position: fixed;
          inset: 0;

          border: 0;

          background:
            rgba(
              65,
              4,
              16,
              0.66
            );

          backdrop-filter:
            blur(7px);

          cursor: default;
        }

        .modalCard {
          position: relative;
          z-index: 2;

          width:
            min(
              900px,
              100%
            );

          max-height:
            calc(
              100vh - 56px
            );

          overflow-y: auto;

          padding:
            clamp(
              30px,
              5vw,
              62px
            );

          color: #68101e;

          background: #f2cfca;

          box-shadow:
            0
            35px
            90px
            rgba(
              44,
              0,
              9,
              0.28
            );

          font-family:
            Georgia,
            "Times New Roman",
            serif;
        }

        .modalCard.wide {
          width:
            min(
              1180px,
              100%
            );
        }

        .modalClose {
          position: absolute;

          top: 15px;
          right: 18px;

          z-index: 5;

          width: 36px;
          height: 36px;

          border: 0;

          color: #68101e;
          background: transparent;

          cursor: pointer;

          font-family:
            Georgia,
            serif;

          font-size: 27px;
          line-height: 1;
        }

        @media (
          max-width: 700px
        ) {
          .modalOverlay {
            align-items:
              flex-start;

            padding: 0;
          }

          .modalCard,
          .modalCard.wide {
            width: 100%;
            min-height: 100vh;
            max-height: none;

            padding:
              70px
              20px
              35px;
          }

          .modalClose {
            position: fixed;

            top: 15px;
            right: 15px;
          }
        }
      `}</style>
    </div>
  );
}
/*
  ATTACHMENT PANEL
*/

function AttachmentPanel({
  icon,
  title,
  description,
  value,
  placeholder,
  onChange,
}) {
  return (
    <div className="attachmentPanel">
      <span className="attachmentIcon">
        {icon}
      </span>

      <h3>{title}</h3>

      <p>{description}</p>

      <input
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />

      <style jsx>{`
        .attachmentPanel {
          min-height: 250px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 35px;

          text-align: center;

          border:
            1px dashed
            rgba(104, 16, 30, 0.45);
        }

        .attachmentIcon {
          display: block;

          margin-bottom: 12px;

          color: #68101e;

          font-size: 35px;
          line-height: 1;
        }

        h3 {
          margin: 0 0 9px;

          color: #68101e;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 25px;
          font-weight: 400;
        }

        p {
          max-width: 420px;

          margin: 0 auto 18px;

          color: #68101e;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 11px;
          line-height: 1.5;
        }

        input {
          width: min(470px, 100%);
          height: 48px;

          padding: 0 14px;

          border:
            1px solid
            rgba(104, 16, 30, 0.45);

          outline: none;

          color: #68101e;

          background:
            rgba(255, 255, 255, 0.16);

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 13px;
        }

        input::placeholder {
          color:
            rgba(104, 16, 30, 0.42);
        }
      `}</style>
    </div>
  );
}

/*
  LOVE COUPON MACHINE
*/

function MachinePreview({
  senderName = "",
  recipientName = "",
  coupons = [],
}) {
  const examples =
    coupons.length > 0
      ? coupons.slice(0, 3)
      : [
          {
            id: "example-1",
            title: "BREAKFAST IN BED",
            subtitle: "Wake up happier.",
          },
          {
            id: "example-2",
            title: "MIDNIGHT DRIVE",
            subtitle:
              "Music on. No destination.",
          },
          {
            id: "example-3",
            title: "ONE LONG HUG",
            subtitle: "No time limit.",
          },
        ];

  return (
    <div className="machineArea">
      <div className="machineGlow" />

      <div className="machine">
        {/* TOP */}

        <div className="machineTop">
          <div className="topScrew left" />
          <div className="topScrew right" />

          <div className="machineBrand">
            <small>WI♡ELI</small>

            <strong>
              LOVE COUPON
              <br />
              MACHINE
            </strong>

            <span>
              MADE FOR LITTLE PROMISES
            </span>
          </div>

          <div className="machineLight">
            <i />
            READY
          </div>
        </div>

        {/* CONTROL PANEL */}

        <div className="controlPanel">
          <div className="controlText">
            <span>FROM</span>

            <strong>
              {senderName || "YOU"}
            </strong>
          </div>

          <div className="machineHeart">
            ♡
          </div>

          <div className="controlText right">
            <span>FOR</span>

            <strong>
              {recipientName ||
                "SOMEONE SPECIAL"}
            </strong>
          </div>
        </div>

        {/* SLOT */}

        <div className="slotSection">
          <div className="slotLabel">
            <span>
              YOUR LOVE COUPONS
            </span>

            <span>
              ✦ PRINTING ✦
            </span>
          </div>

          <div className="slot">
            <div className="slotInside" />
          </div>
        </div>

        {/* BUTTONS */}

        <div className="machineControls">
          <div className="roundButton">
            ♡
          </div>

          <div className="controlLines">
            <span />
            <span />
            <span />
          </div>

          <div className="serial">
            WVL
            <br />
            001
          </div>
        </div>

        {/* FEET */}

        <div className="machineFoot leftFoot" />
        <div className="machineFoot rightFoot" />
      </div>

      {/* PAPER COMING FROM MACHINE */}

      <div className="paperConnector">
        <div className="paperLine" />
        <span>✂</span>
        <div className="paperLine" />
      </div>

      <div className="printedRoll">
        {examples.map(
          (coupon, index) => (
            <div
              className="printedTicket"
              key={
                coupon.id ||
                `${coupon.title}-${index}`
              }
            >
              <LoveCouponTicket
                number={String(
                  index + 1
                ).padStart(2, "0")}
                title={coupon.title}
                description={
                  coupon.subtitle ||
                  coupon.description ||
                  ""
                }
                message={
                  coupon.message || ""
                }
                compact
              />
            </div>
          )
        )}
      </div>

      <div className="machineCaption">
        <span>
          ✦ ONE PROMISE AT A TIME ✦
        </span>
      </div>

      <style jsx>{`
        .machineArea {
          position: relative;

          width:
            min(
              610px,
              100%
            );

          margin: 0 auto;

          padding:
            20px
            24px
            45px;
        }

        .machineGlow {
          position: absolute;

          z-index: 0;

          top: 5%;
          left: 50%;

          width: 80%;
          height: 65%;

          transform:
            translateX(-50%);

          border-radius: 50%;

          background:
            rgba(
              255,
              244,
              239,
              0.32
            );

          filter: blur(45px);

          pointer-events: none;
        }

        .machine {
          position: relative;

          z-index: 4;

          width: 82%;

          margin: 0 auto;

          padding:
            22px
            24px
            25px;

          border:
            2px solid
            #5c0918;

          border-radius:
            25px
            25px
            18px
            18px;

          color: #f5d2cd;

          background:
            linear-gradient(
              145deg,
              #861a2d,
              #6e0c20 58%,
              #590716
            );

          box-shadow:
            inset
              0 1px 0
              rgba(
                255,
                255,
                255,
                0.16
              ),
            inset
              0 -15px 35px
              rgba(
                44,
                0,
                10,
                0.18
              ),
            0 25px 35px
              rgba(
                74,
                6,
                20,
                0.18
              );
        }

        .machine::before {
          content: "";

          position: absolute;

          inset: 8px;

          border:
            1px solid
            rgba(
              248,
              208,
              203,
              0.24
            );

          border-radius:
            18px;

          pointer-events: none;
        }

        .machineTop {
          position: relative;

          display: flex;

          align-items:
            flex-start;

          justify-content:
            space-between;

          min-height: 94px;

          padding:
            7px
            8px
            18px;

          border-bottom:
            1px solid
            rgba(
              246,
              210,
              205,
              0.28
            );
        }

        .topScrew {
          position: absolute;

          top: 0;

          width: 7px;
          height: 7px;

          border:
            1px solid
            rgba(
              248,
              216,
              210,
              0.55
            );

          border-radius: 50%;
        }

        .topScrew.left {
          left: 0;
        }

        .topScrew.right {
          right: 0;
        }

        .machineBrand small {
          display: block;

          margin-bottom: 8px;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;

          font-weight: 700;

          letter-spacing:
            0.2em;
        }

        .machineBrand strong {
          display: block;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              23px,
              3vw,
              37px
            );

          font-weight: 400;

          line-height: 0.88;

          letter-spacing:
            -0.05em;
        }

        .machineBrand span {
          display: block;

          margin-top: 9px;

          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.17em;

          opacity: 0.72;
        }

        .machineLight {
          display: flex;

          align-items: center;

          gap: 5px;

          margin-top: 8px;

          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.14em;
        }

        .machineLight i {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #f5d3cc;

          box-shadow:
            0 0 8px
            rgba(
              255,
              220,
              211,
              0.75
            );
        }

        .controlPanel {
          display: grid;

          grid-template-columns:
            1fr
            auto
            1fr;

          align-items: center;

          gap: 12px;

          padding:
            17px
            8px;
        }

        .controlText {
          min-width: 0;
        }

        .controlText.right {
          text-align: right;
        }

        .controlText span {
          display: block;

          margin-bottom: 3px;

          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.17em;

          opacity: 0.65;
        }

        .controlText strong {
          display: block;

          overflow: hidden;

          font-family:
            Georgia,
            serif;

          font-size: 12px;

          font-weight: 400;

          white-space: nowrap;

          text-overflow:
            ellipsis;
        }

        .machineHeart {
          width: 39px;
          height: 39px;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(
              246,
              211,
              205,
              0.5
            );

          border-radius: 50%;

          font-size: 21px;
        }

        .slotSection {
          padding:
            12px
            8px
            8px;

          border-top:
            1px solid
            rgba(
              246,
              210,
              205,
              0.25
            );
        }

        .slotLabel {
          display: flex;

          justify-content:
            space-between;

          gap: 15px;

          margin-bottom: 7px;

          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.14em;

          opacity: 0.7;
        }

        .slot {
          position: relative;

          height: 31px;

          padding: 6px;

          border:
            1px solid
            rgba(
              246,
              211,
              205,
              0.35
            );

          border-radius: 5px;

          background:
            rgba(
              39,
              0,
              9,
              0.23
            );

          box-shadow:
            inset
              0 5px 10px
              rgba(
                30,
                0,
                7,
                0.28
              );
        }

        .slotInside {
          width: 100%;
          height: 100%;

          border-radius: 2px;

          background:
            #35020c;

          box-shadow:
            inset
              0 0 9px
              #1d0005;
        }

        .machineControls {
          display: flex;

          align-items: center;

          gap: 14px;

          padding:
            15px
            8px
            1px;
        }

        .roundButton {
          width: 34px;
          height: 34px;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(
              246,
              211,
              205,
              0.55
            );

          border-radius: 50%;

          background:
            rgba(
              255,
              255,
              255,
              0.04
            );

          box-shadow:
            inset
              0 0 0
              4px
              rgba(
                69,
                0,
                14,
                0.16
              );
        }

        .controlLines {
          flex: 1;

          display: flex;

          flex-direction: column;

          gap: 5px;
        }

        .controlLines span {
          height: 1px;

          background:
            rgba(
              246,
              211,
              205,
              0.24
            );
        }

        .serial {
          font-family:
            Arial,
            sans-serif;

          font-size: 5px;

          font-weight: 700;

          line-height: 1.4;

          letter-spacing:
            0.16em;

          text-align: right;

          opacity: 0.6;
        }

        .machineFoot {
          position: absolute;

          bottom: -11px;

          width: 60px;
          height: 13px;

          border-radius:
            0
            0
            9px
            9px;

          background: #500513;
        }

        .leftFoot {
          left: 42px;
        }

        .rightFoot {
          right: 42px;
        }

        /*
          PAPER
        */

        .paperConnector {
          position: relative;

          z-index: 3;

          width: 68%;

          height: 33px;

          display: flex;

          align-items: center;

          gap: 8px;

          margin:
            -2px
            auto
            0;

          padding:
            0
            5px;

          color: #741020;

          background: #f5d2ce;
        }

        .paperConnector::before,
        .paperConnector::after {
          content: "";

          position: absolute;

          top: 0;

          width: 15px;
          height: 15px;

          border-radius: 50%;

          background: #f2cfca;
        }

        .paperConnector::before {
          left: -8px;
        }

        .paperConnector::after {
          right: -8px;
        }

        .paperConnector span {
          font-size: 9px;

          transform:
            rotate(-5deg);
        }

        .paperLine {
          flex: 1;

          border-top:
            1px dashed
            rgba(
              104,
              16,
              30,
              0.55
            );
        }

        /*
          PRINTED TICKETS
        */

        .printedRoll {
          position: relative;

          z-index: 2;

          width: 100%;

          display: flex;

          flex-direction: column;

          gap: 8px;

          margin:
            -1px
            auto
            0;
        }

        .printedTicket {
          width: 100%;

          transform-origin:
            top center;
        }

        .printedTicket:nth-child(1) {
          transform:
            rotate(0.4deg);
        }

        .printedTicket:nth-child(2) {
          transform:
            rotate(-0.35deg);
        }

        .printedTicket:nth-child(3) {
          transform:
            rotate(0.25deg);
        }

        .machineCaption {
          display: flex;

          justify-content: center;

          margin-top: 15px;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;

          font-weight: 700;

          letter-spacing:
            0.18em;

          opacity: 0.58;
        }

        @media (
          max-width: 1000px
        ) {
          .machineArea {
            max-width: 570px;

            margin-top: 25px;
          }
        }

        @media (
          max-width: 600px
        ) {
          .machineArea {
            padding:
              10px
              0
              35px;
          }

          .machine {
            width: 91%;

            padding:
              17px
              17px
              20px;

            border-radius:
              20px
              20px
              15px
              15px;
          }

          .machineTop {
            min-height: 78px;
          }

          .machineBrand strong {
            font-size: 25px;
          }

          .controlPanel {
            padding:
              13px
              5px;
          }

          .machineHeart {
            width: 32px;
            height: 32px;

            font-size: 17px;
          }

          .paperConnector {
            width: 76%;
          }

          .machineFoot {
            width: 43px;
          }

          .leftFoot {
            left: 30px;
          }

          .rightFoot {
            right: 30px;
          }
        }
      `}</style>
    </div>
  );
}

/*
  SMALL PREVIEW ROLL
*/

function MiniTicketRoll({
  coupons = [],
}) {
  const previewCoupons =
    coupons.length > 0
      ? coupons.slice(0, 3)
      : [];

  if (!previewCoupons.length) {
    return (
      <div className="emptyPreview">
        <span>♡</span>

        <p>
          YOUR COUPONS WILL APPEAR HERE
        </p>

        <style jsx>{`
          .emptyPreview {
            min-height: 180px;

            display: flex;

            flex-direction: column;

            align-items: center;
            justify-content: center;

            gap: 10px;

            padding: 25px;

            text-align: center;
          }

          .emptyPreview span {
            font-size: 38px;
          }

          .emptyPreview p {
            margin: 0;

            font-family:
              Arial,
              sans-serif;

            font-size: 6px;

            font-weight: 700;

            letter-spacing:
              0.17em;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="miniRoll">
      {previewCoupons.map(
        (coupon, index) => (
          <LoveCouponTicket
            key={
              coupon.id ||
              coupon.originalId ||
              `${coupon.title}-${index}`
            }
            number={String(
              index + 1
            ).padStart(2, "0")}
            title={coupon.title}
            description={
              coupon.subtitle ||
              coupon.description ||
              ""
            }
            message={
              coupon.message || ""
            }
            compact
          />
        )
      )}

      {coupons.length > 3 && (
        <div className="moreCoupons">
          + {coupons.length - 3} MORE
          COUPONS ♡
        </div>
      )}

      <style jsx>{`
        .miniRoll {
          display: flex;

          flex-direction: column;

          gap: 8px;

          max-width: 570px;

          margin:
            25px
            auto
            0;
        }

        .moreCoupons {
          padding-top: 8px;

          text-align: center;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;

          font-weight: 700;

          letter-spacing:
            0.15em;
        }
      `}</style>
    </div>
  );
}

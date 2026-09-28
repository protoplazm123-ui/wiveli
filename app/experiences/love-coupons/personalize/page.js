"use client";

import { useMemo, useState } from "react";
import { couponIdfunction MiniTicketRoll({eas, couponCategories } from "../coupons";
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
    /*
      Ready-made coupons keep their original IDs.
      Edited coupons are stored as custom coupons.
    */

    const selectedCouponIds = selected.filter(
      (id) =>
        !customCoupons.some(
          (coupon) => coupon.originalId === id
        )
    );

    const selectedCustomCoupons = customCoupons
      .filter((coupon) =>
        selected.includes(coupon.originalId)
      )
      .map((coupon) => ({
        ...coupon,

        // Recipient/redeem API needs a real coupon.id
        id: coupon.originalId,
      }));

   const giftData = {
  senderName: senderName.trim(),
  recipientName: recipientName.trim(),

  senderContact: {
    type: "telegram",
    value: senderTelegram.trim(),
  },

  couponIds: selectedCouponIds,
      customCoupons: selectedCustomCoupons,

      dailyLimit: Number(dailyLimit),

      redemptions: [],

      createdAt: new Date().toISOString(),
    };

    const response = await fetch("/api/gifts", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        giftType: "love-coupons",
        giftData,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.id) {
      throw new Error(
        data.error || "Could not create gift"
      );
    }

    /*
      Keep local copy only as cache/prototype data.
      Supabase is the real source of truth.
    */

    saveLoveCouponsGift({
      ...giftData,
      serverId: data.id,
    });

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/gift/love-coupons/${data.id}`
        : `/gift/love-coupons/${data.id}`;

    setGiftUrl(url);
    setModal("send");
  } catch (error) {
    console.error("Failed to create gift:", error);

    alert(
      "Could not create the gift. Please try again ♡"
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

         <h1 className="heroTitle">
  <strong>LITTLE PROMISES,</strong>
  <br />
  <span className="heroThin">MADE FOR</span>
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
                    <option value={4}>4</option>
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
                              event.target
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
                              event.target
                                .value,
                          }
                        )
                      }
                      placeholder="Write something just for them..."
                    />
                  </label>
                </div>
              )}

              {editTab === "photo" && (
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

              {editTab === "video" && (
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

              {editTab === "voice" && (
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

              {editTab === "gift" && (
                <AttachmentPanel
                  icon="♥"
                  title="ADD A REAL GIFT"
                  description="Add a ticket, reservation, gift card or any private link."
                  value={
                    editingCoupon.giftUrl
                  }
                  placeholder="Paste private gift link"
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
                <div className="panel">
                  <div className="reminderCard">
                    <div>
                      <span className="reminderHeart">
                        ♡
                      </span>

                      <div>
                        <strong>
                          REMIND ME WHEN
                          THEY USE IT
                        </strong>

                        <p>
                          We&apos;ll use
                          your contact
                          details later to
                          let you know when
                          this promise is
                          redeemed.
                        </p>
                      </div>
                    </div>

                    <button
                      className={
                        editingCoupon.reminderEnabled
                          ? "toggle active"
                          : "toggle"
                      }
                      onClick={() =>
                        setEditingCoupon({
                          ...editingCoupon,
                          reminderEnabled:
                            !editingCoupon.reminderEnabled,
                        })
                      }
                    >
                      <span />
                    </button>
                  </div>
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
                compact
              />
            </div>

            <button
              className="primary full"
              onClick={
                saveEditedCoupon
              }
            >
              SAVE COUPON ♡
            </button>
          </Modal>
        )}

      {/* PREVIEW */}

      {modal === "preview" && (
        <Modal
          onClose={() =>
            setModal("coupons")
          }
        >
          <div className="previewLayout">
            <div>
              <p className="eyebrow">
                STEP 03 · PREVIEW
              </p>

              <h2>
                READY TO
                <br />
                <em>PRINT?</em>
              </h2>

              <p className="modalIntro">
                From{" "}
                <strong>
                  {senderName}
                </strong>{" "}
                to{" "}
                <strong>
                  {recipientName}
                </strong>
                .
              </p>

              <p className="modalIntro">
                {selectedCoupons.length}{" "}
                little promises, waiting
                to be opened.
              </p>

              <button
                className="primary full"
                disabled={creating}
                onClick={createGift}
              >
                {creating
                  ? "PRINTING..."
                  : "CREATE GIFT ♡"}
              </button>
            </div>

            <MiniTicketRoll
              coupons={
                selectedCoupons
              }
            />
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
          <div className="sendLayout">
            <p className="eyebrow">
              YOUR GIFT IS READY
            </p>

            <h2>
              SEND A LITTLE
              <br />
              <em>LOVE.</em>
            </h2>

            <p className="modalIntro">
              Your love coupons for{" "}
              <strong>
                {recipientName}
              </strong>{" "}
              are ready ♡
            </p>

            <div className="sendChoices">
              <button
                className="sendChoice"
                onClick={copyGiftLink}
              >
                <span>01</span>

                <div>
                  <strong>
                    I&apos;LL SEND IT
                    MYSELF
                  </strong>

                  <p>
                    Copy the private link
                    and send it however you
                    like.
                  </p>
                </div>

                <b>→</b>
              </button>

              <button
                className="sendChoice"
                type="button"
              >
                <span>02</span>

                <div>
                  <strong>
                    SEND FROM WIVELI
                  </strong>

                  <p>
                    Let WIVELI deliver the
                    gift for you.
                  </p>
                </div>

                <b>♡</b>
              </button>
            </div>

            <div className="giftLink">
              <span>PRIVATE GIFT LINK</span>

              <input
                readOnly
                value={giftUrl}
              />

              <button
                onClick={copyGiftLink}
              >
                COPY
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;

          background: #efc9c5;
          color: #741020;
        }

        body {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          color: inherit;
        }

        .page {
          min-height: 100vh;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 72% 18%,
              rgba(
                255,
                246,
                240,
                0.22
              ),
              transparent 27%
            ),
            linear-gradient(
              180deg,
              #efc9c5 0%,
              #edc5c1 100%
            );
        }

        .header {
          width: min(
            1500px,
            calc(100% - 72px)
          );

          min-height: 86px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          margin: 0 auto;

          border-bottom:
            1px solid
            rgba(
              116,
              16,
              32,
              0.3
            );
        }

        .logo {
          color: #741020;

          font-size: 24px;
          font-weight: 700;

          letter-spacing:
            -0.06em;

          text-decoration: none;
        }

        .headerRight {
          display: flex;
          align-items: center;

          gap: 22px;

          font-family:
            Arial,
            sans-serif;

          font-size: 9px;
          font-weight: 700;

          letter-spacing:
            0.17em;
        }

        .headerRight span:last-child {
          font-family:
            Georgia,
            serif;

          font-size: 20px;
          font-weight: 400;
        }

        .hero {
          width: min(
            1500px,
            calc(100% - 72px)
          );

          min-height:
            calc(100vh - 86px);

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(420px, 0.82fr);

          align-items: center;

          gap: clamp(
            35px,
            6vw,
            110px
          );

          margin: 0 auto;

          padding:
            75px
            0
            90px;
        }

        .heroCopy {
          position: relative;
          z-index: 5;
        }

        .eyebrow {
          margin:
            0
            0
            22px;

          font-family:
            Arial,
            sans-serif;

          font-size: 8px;
          font-weight: 700;

          letter-spacing:
            0.23em;

          text-transform:
            uppercase;
        }

        h1,
        h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-weight: 400;

          color: #741020;

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

        /* NEW HERO TYPOGRAPHY */

        .heroTitle {
  max-width: 760px;
  line-height: 0.87;
  letter-spacing: -0.055em;
}

/* ТОНКИЙ — ПОЧТИ ЧЁРНЫЙ */
.heroTitle .heroThin {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-style: normal;
  color: #181313;
  letter-spacing: -0.065em;
}

/* ЖИРНЫЙ — БОРДОВЫЙ */
.heroTitle strong {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
  font-style: normal;
  color: #741020;
  letter-spacing: -0.07em;
}

/* ТОНКИЙ КУРСИВ — ПОЧТИ ЧЁРНЫЙ */
.heroTitle em {
  display: inline-block;
  margin-top: 7px;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-style: italic;
  color: #181313;
  letter-spacing: -0.07em;
  transform: translateX(8px);
}

        .intro {
          max-width: 450px;

          margin:
            34px
            0
            31px;

          font-size: 17px;

          line-height: 1.55;
        }

        .primary {
          min-height: 50px;

          padding:
            0
            27px;

          border:
            1px solid #741020;

          border-radius: 999px;

          color: #f4d5d0;

          background: #741020;

          font-family:
            Arial,
            sans-serif;

          font-size: 8px;
          font-weight: 700;

          letter-spacing:
            0.16em;

          cursor: pointer;

          transition:
            transform 180ms ease,
            opacity 180ms ease,
            background 180ms ease;
        }

        .primary:hover {
          transform:
            translateY(-2px);
        }

        .primary:disabled {
          opacity: 0.4;

          cursor: default;

          transform: none;
        }

        .full {
          width: 100%;

          margin-top: 22px;
        }

        .steps {
          width: min(
            1500px,
            calc(100% - 72px)
          );

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          margin: 0 auto;

          border-top:
            1px solid
            rgba(
              116,
              16,
              32,
              0.32
            );

          border-bottom:
            1px solid
            rgba(
              116,
              16,
              32,
              0.32
            );
        }

        .steps > div {
          min-height: 190px;

          padding:
            34px
            36px;
        }

        .steps > div + div {
          border-left:
            1px solid
            rgba(
              116,
              16,
              32,
              0.32
            );
        }

        .steps span {
          display: block;

          margin-bottom: 21px;

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

          font-size: 27px;

          font-weight: 400;
        }

        .steps p {
          max-width: 270px;

          margin:
            12px
            0
            0;

          font-size: 14px;

          line-height: 1.5;
        }

        label {
          display: block;

          margin-top: 18px;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;

          letter-spacing:
            0.15em;
        }

        input,
        textarea,
        select {
          width: 100%;

          margin-top: 8px;

          border: 0;

          border-bottom:
            1px solid
            rgba(
              116,
              16,
              32,
              0.55
            );

          border-radius: 0;

          outline: none;

          color: #741020;

          background:
            transparent;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 18px;

          letter-spacing: 0;
        }

        input,
        select {
          height: 44px;
        }

        textarea {
          min-height: 110px;

          padding-top: 12px;

          resize: vertical;
        }

        label small {
          display: block;

          margin-top: 8px;

          font-size: 6px;

          font-weight: 400;

          line-height: 1.5;

          letter-spacing:
            0.08em;

          opacity: 0.65;
        }

        .smallGrid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 22px;
        }

        .detailsLayout,
        .previewLayout {
          display: grid;

          grid-template-columns:
            minmax(0, 0.82fr)
            minmax(420px, 1fr);

          align-items: center;

          gap: 50px;
        }

        .detailsForm {
          max-width: 480px;
        }

        .detailsMachine {
          min-width: 0;
        }

        .modalIntro {
          max-width: 430px;

          margin:
            24px
            0;

          font-size: 16px;

          line-height: 1.55;
        }

        .couponHeader {
          display: flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap: 30px;
        }

        .counter {
          display: grid;

          grid-template-columns:
            auto
            auto;

          align-items:
            baseline;

          min-width: 100px;
        }

        .counter strong {
          font-size: 42px;

          font-weight: 400;
        }

        .counter span {
          font-size: 20px;
        }

        .counter small {
          grid-column:
            1 / -1;

          margin-top: 3px;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;
          font-weight: 700;

          letter-spacing:
            0.17em;
        }

        .categoryBar {
          display: flex;

          gap: 8px;

          overflow-x: auto;

          margin:
            35px
            0
            28px;

          padding-bottom: 4px;
        }

        .categoryBar button,
        .editorTabs button {
          flex: 0 0 auto;

          padding:
            10px
            15px;

          border:
            1px solid
            rgba(
              116,
              16,
              32,
              0.5
            );

          border-radius: 999px;

          color: #741020;

          background:
            transparent;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;

          letter-spacing:
            0.12em;

          cursor: pointer;
        }

        .categoryBar button.active,
        .editorTabs button.active {
          color: #f4d5d0;

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
            24px
            20px;
        }

        .modalFooter {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;

          margin-top: 34px;

          padding-top: 22px;

          border-top:
            1px solid
            rgba(
              116,
              16,
              32,
              0.32
            );

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;

          letter-spacing:
            0.15em;
        }

        .editTitle {
          margin-bottom: 28px;
        }

        .editorTabs {
          display: flex;

          gap: 7px;

          overflow-x: auto;

          padding-bottom: 4px;
        }

        .editorContent {
          margin-top: 25px;
        }

        .panel {
          padding:
            22px
            24px;

          border:
            1px solid
            rgba(
              116,
              16,
              32,
              0.42
            );

          border-radius: 16px;
        }

        .editorPreview {
          max-width: 570px;

          margin:
            25px
            auto
            0;
        }

        .reminderCard {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 25px;
        }

        .reminderCard > div {
          display: flex;

          align-items:
            flex-start;

          gap: 16px;
        }

        .reminderHeart {
          font-family:
            Georgia,
            serif;

          font-size: 30px;
        }

        .reminderCard strong {
          font-family:
            Arial,
            sans-serif;

          font-size: 8px;

          letter-spacing:
            0.13em;
        }

        .reminderCard p {
          max-width: 390px;

          margin:
            7px
            0
            0;

          font-size: 14px;

          line-height: 1.5;
        }

        .toggle {
          position: relative;

          flex: 0 0 auto;

          width: 48px;
          height: 27px;

          padding: 0;

          border:
            1px solid
            #741020;

          border-radius: 999px;

          background:
            transparent;

          cursor: pointer;
        }

        .toggle span {
          position: absolute;

          top: 4px;
          left: 4px;

          width: 17px;
          height: 17px;

          border-radius: 50%;

          background: #741020;

          transition:
            transform 180ms ease;
        }

        .toggle.active {
          background: #741020;
        }

        .toggle.active span {
          background: #efc9c5;

          transform:
            translateX(21px);
        }

        .sendLayout {
          max-width: 720px;

          margin: 0 auto;
        }

        .sendChoices {
          display: grid;

          gap: 12px;

          margin-top: 30px;
        }

        .sendChoice {
          width: 100%;

          display: grid;

          grid-template-columns:
            35px
            1fr
            auto;

          align-items: center;

          gap: 16px;

          padding:
            20px
            22px;

          border:
            1px solid
            rgba(
              116,
              16,
              32,
              0.55
            );

          border-radius: 15px;

          color: #741020;

          background:
            rgba(
              255,
              239,
              235,
              0.15
            );

          text-align: left;

          cursor: pointer;
        }

        .sendChoice > span {
          font-family:
            Arial,
            sans-serif;

          font-size: 7px;

          font-weight: 700;
        }

        .sendChoice strong {
          font-family:
            Arial,
            sans-serif;

          font-size: 8px;

          letter-spacing:
            0.13em;
        }

        .sendChoice p {
          margin:
            6px
            0
            0;

          font-size: 14px;
        }

        .sendChoice b {
          font-size: 21px;

          font-weight: 400;
        }

        .giftLink {
          display: grid;

          grid-template-columns:
            1fr
            auto;

          align-items:
            end;

          gap: 10px;

          margin-top: 25px;
        }

        .giftLink span {
          grid-column:
            1 / -1;

          font-family:
            Arial,
            sans-serif;

          font-size: 6px;

          font-weight: 700;

          letter-spacing:
            0.16em;
        }

        .giftLink input {
          margin: 0;

          font-size: 13px;
        }

        .giftLink button {
          height: 42px;

          padding:
            0
            18px;

          border:
            1px solid #741020;

          border-radius: 999px;

          color: #f4d5d0;

          background: #741020;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;
          font-weight: 700;

          letter-spacing:
            0.13em;

          cursor: pointer;
        }

        @media (
          max-width: 1000px
        ) {
          .hero {
            grid-template-columns:
              1fr;

            padding-top: 55px;
          }

          .heroCopy {
            max-width: 800px;
          }

          .detailsLayout,
          .previewLayout {
            grid-template-columns:
              1fr;
          }

          .detailsForm {
            max-width: none;
          }
        }

        @media (
          max-width: 700px
        ) {
          .header,
          .hero,
          .steps {
            width:
              calc(
                100% - 34px
              );
          }

          .header {
            min-height: 70px;
          }

          .headerRight span:first-child {
            display: none;
          }

          .hero {
            min-height: auto;

            padding:
              52px
              0
              65px;
          }

          h1 {
            font-size:
              clamp(
                48px,
                15vw,
                74px
              );
          }

          h2 {
            font-size:
              clamp(
                40px,
                12vw,
                62px
              );
          }

          .heroTitle em {
            transform: none;
          }

          .steps {
            grid-template-columns:
              1fr;
          }

          .steps > div {
            min-height: auto;

            padding:
              28px
              4px;
          }

          .steps > div + div {
            border-left: 0;

            border-top:
              1px solid
              rgba(
                116,
                16,
                32,
                0.32
              );
          }

          .ticketGrid {
            grid-template-columns:
              1fr;
          }

          .couponHeader {
            align-items:
              flex-start;
          }

          .smallGrid {
            grid-template-columns:
              1fr;
          }

          .modalFooter {
            align-items:
              stretch;

            flex-direction:
              column;
          }

          .modalFooter .primary {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
function Modal({
  children,
  onClose,
  wide = false,
}) {
  return (
    <div className="modalBackdrop">
      <div
        className={
          wide
            ? "modalCard wide"
            : "modalCard"
        }
      >
        <button
          className="modalClose"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {children}
      </div>

      <style jsx>{`
        .modalBackdrop {
          position: fixed;
          z-index: 1000;
          inset: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 30px;

          overflow-y: auto;

          background:
            rgba(83, 6, 21, 0.72);

          backdrop-filter:
            blur(13px);
        }

        .modalCard {
          position: relative;

          width: min(1050px, 100%);

          max-height:
            calc(100vh - 60px);

          overflow-y: auto;

          padding:
            clamp(34px, 5vw, 72px);

          border:
            1px solid
            rgba(116, 16, 32, 0.55);

          border-radius: 24px;

          color: #741020;

          background: #efc9c5;

          box-shadow:
            0 35px 90px
            rgba(60, 0, 12, 0.28);
        }

        .modalCard.wide {
          width: min(1380px, 100%);
        }

        .modalClose {
          position: absolute;

          z-index: 20;

          top: 20px;
          right: 23px;

          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border:
            1px solid
            rgba(116, 16, 32, 0.5);

          border-radius: 50%;

          color: #741020;
          background: transparent;

          font-family:
            Georgia,
            serif;

          font-size: 25px;

          cursor: pointer;
        }

        @media (max-width: 700px) {
          .modalBackdrop {
            align-items: flex-start;

            padding: 12px;
          }

          .modalCard {
            max-height: none;

            padding:
              58px
              20px
              35px;

            border-radius: 18px;
          }

          .modalClose {
            top: 13px;
            right: 13px;
          }
        }
      `}</style>
    </div>
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
    <div className="attachmentPanel">
      <div className="attachmentIcon">
        {icon}
      </div>

      <div className="attachmentCopy">
        <strong>{title}</strong>

        <p>{description}</p>

        <input
          value={value || ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
        />
      </div>

      <style jsx>{`
        .attachmentPanel {
          display: grid;

          grid-template-columns:
            60px
            1fr;

          gap: 20px;

          padding: 25px;

          border:
            1px solid
            rgba(116, 16, 32, 0.42);

          border-radius: 16px;
        }

        .attachmentIcon {
          width: 60px;
          height: 60px;

          display: flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(116, 16, 32, 0.5);

          border-radius: 50%;

          font-family:
            Georgia,
            serif;

          font-size: 26px;
        }

        .attachmentCopy strong {
          font-family:
            Arial,
            sans-serif;

          font-size: 8px;
          font-weight: 700;

          letter-spacing:
            0.14em;
        }

        .attachmentCopy p {
          margin:
            7px
            0
            14px;

          font-size: 14px;
          line-height: 1.45;
        }

        .attachmentCopy input {
          margin: 0;
        }

        @media (max-width: 600px) {
          .attachmentPanel {
            grid-template-columns: 1fr;
          }
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
            subtitle:
              "Wake up happier.",
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
            subtitle:
              "No time limit.",
          },
        ];

  return (
    <div className="machineArea">
      <div className="machineGlow" />

      <div className="machine">
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

        <div className="machineFoot leftFoot" />
        <div className="machineFoot rightFoot" />
      </div>

      {/* PAPER COMING DIRECTLY FROM SLOT */}

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

          width: min(610px, 100%);

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
            2px solid #5c0918;

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

          border-radius: 18px;

          pointer-events: none;
        }

        .machineTop {
          position: relative;

          display: flex;

          align-items: flex-start;
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

          text-overflow: ellipsis;
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

          background: #35020c;

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
          PAPER — SAME WIDTH AS OUTPUT
        */

        .paperConnector {
          position: relative;

          z-index: 3;

          width: 72%;

          height: 24px;

          display: flex;

          align-items: center;

          gap: 8px;

          margin:
            -8px
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

          width: 72%;

          display: flex;

          flex-direction: column;

          gap: 3px;

          margin:
            -9px
            auto
            0;
        }

        .printedTicket {
          position: relative;

          width: 100%;

          margin: 0;

          transform-origin:
            top center;
        }

        .printedTicket +
        .printedTicket {
          margin-top: -1px;
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
/* FIT EVERYTHING INTO ONE SCREEN */

.header {
  min-height: 58px;
  height: 58px;
}

.hero {
  width: min(1500px, calc(100% - 72px));
  height: calc(100vh - 58px);
  min-height: 0;

  grid-template-columns:
    minmax(0, 1.08fr)
    minmax(360px, 0.72fr);

  align-items: center;

  gap: 45px;

  padding: 12px 0 18px;
}

/* LEFT SIDE */

.heroTitle {
  max-width: 720px;

  font-size: clamp(42px, 4.65vw, 74px);

  line-height: 0.82;
}

.heroTitle em {
  margin-top: 3px;
}

.eyebrow {
  margin-bottom: 12px;
}

.intro {
  margin: 16px 0 17px;

  font-size: 13px;
  line-height: 1.35;
}

.startButton {
  min-height: 40px;

  padding: 0 23px;
}

/* MACHINE */

.machineArea {
  width: min(490px, 100%);

  margin: 0 auto;

  padding: 0 18px;
}

.machine {
  width: 82%;

  padding: 16px 18px 18px;
}

.machineTop {
  min-height: 70px;

  padding: 4px 6px 10px;
}

.machineBrand strong {
  font-size: 25px;
}

.controlPanel {
  padding: 10px 6px;
}

.machineHeart {
  width: 30px;
  height: 30px;

  font-size: 16px;
}

.slotSection {
  padding: 7px 6px 5px;
}

.slot {
  height: 24px;
}

.machineControls {
  padding: 9px 6px 0;
}

.roundButton {
  width: 27px;
  height: 27px;
}

/* PRINTED COUPONS */

.paperConnector {
  width: 72%;
  height: 16px;

  margin: -6px auto 0;
}

.printedRoll {
  width: 72%;

  gap: 1px;

  margin: -6px auto 0;
}

/* physically reduce each ticket */
.printedTicket {
  font-size: 0.82em;
}

.machineCaption {
  margin-top: 5px;
}

/* REMOVE SECOND SECTION FROM LANDING */

.steps {
  display: none !important;
}
        @media (max-width: 1000px) {
          .machineArea {
            max-width: 570px;

            margin-top: 25px;
          }
        }

        @media (max-width: 600px) {
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

          .paperConnector,
          .printedRoll {
            width: 78%;
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

function MiniTicketRoll({ coupons = [] }) {
  const firstCoupon = coupons[0];

  if (!firstCoupon) {
    return (
      <div className="previewEmpty">
        <span>♡</span>
        <strong>YOUR COUPONS</strong>
        <small>WILL APPEAR HERE</small>

        <style jsx>{`
          .previewEmpty {
            height: 230px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(116, 16, 32, 0.25);
            border-radius: 18px;
          }

          .previewEmpty span {
            margin-bottom: 10px;
            font-size: 34px;
          }

          .previewEmpty strong,
          .previewEmpty small {
            font-family: Arial, sans-serif;
            font-size: 7px;
            letter-spacing: 0.16em;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="previewStack">
      <div className="backTicket backTwo" />
      <div className="backTicket backOne" />

      <div className="previewTicket">
        <div className="previewMain">
          <div className="previewMeta">
            <span>WI♡ELI</span>
            <span>LOVE COUPON ✦</span>
          </div>

          <small>A LITTLE PROMISE FOR YOU</small>

          <h3>{firstCoupon.title}</h3>

          <p>
            {firstCoupon.subtitle ||
              firstCoupon.description ||
              "Made with love."}
          </p>

          <div className="previewBottom">
            <span>WITH LOVE ♡</span>
          </div>
        </div>

        <div className="previewStub">
          <span>♡</span>
          <strong>01</strong>

          <div className="previewBarcode">
            ||| || ||| |
          </div>
        </div>
      </div>

      <div className="couponCount">
        {coupons.length} LOVE COUPONS ♡
      </div>

      <style jsx>{`
        .previewStack {
          position: relative;
          width: min(440px, 100%);
          margin: 0 auto;
          padding: 26px 0 34px;
        }

        .backTicket {
          position: absolute;
          left: 50%;
          width: 88%;
          height: 178px;
          border: 1px solid #741020;
          border-radius: 14px;
          background: #eabdb9;
        }

        .backTwo {
          top: 10px;
          transform: translateX(-50%) rotate(3deg);
          opacity: 0.45;
        }

        .backOne {
          top: 18px;
          transform: translateX(-50%) rotate(-2deg);
          opacity: 0.7;
        }

        .previewTicket {
          position: relative;
          z-index: 3;
          min-height: 190px;

          display: grid;
          grid-template-columns: 1fr 76px;

          overflow: hidden;

          border: 1.5px solid #741020;
          border-radius: 15px;

          background: #f3cfcb;
          color: #741020;

          box-shadow:
            0 18px 35px rgba(76, 8, 20, 0.12);
        }

        .previewMain {
          position: relative;
          padding: 22px 24px;
        }

        .previewMeta {
          display: flex;
          justify-content: space-between;

          margin-bottom: 28px;

          font-family: Arial, sans-serif;
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        .previewMain > small {
          font-family: Arial, sans-serif;
          font-size: 5px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }

        .previewMain h3 {
          max-width: 280px;
          margin: 7px 0 5px;

          font-family: Georgia, serif;
          font-size: 30px;
          line-height: 0.9;
          letter-spacing: -0.04em;
        }

        .previewMain p {
          margin: 0;

          font-family: Georgia, serif;
          font-size: 11px;
          font-style: italic;
        }

        .previewBottom {
          position: absolute;
          left: 24px;
          bottom: 17px;

          font-family: Arial, sans-serif;
          font-size: 5px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }

        .previewStub {
          border-left: 1px dashed #741020;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 9px;
        }

        .previewStub > span {
          font-size: 25px;
        }

        .previewStub strong {
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .previewBarcode {
          font-family: monospace;
          font-size: 12px;
          writing-mode: vertical-rl;
        }

        .couponCount {
          margin-top: 15px;

          text-align: center;

          font-family: Arial, sans-serif;
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.16em;
        }
      `}</style>
    </div>
  );
}

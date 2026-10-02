"use client";

import { useEffect, useState } from "react";

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [activeTab, setActiveTab] = useState("gifts");

  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError("");
      try {
        const res = await fetch("/api/account/gifts", { cache: "no-store", signal: controller.signal });
        const data = await res.json();
        if (cancelled) return;
        setUnauthorized(res.status === 401);
        if (!res.ok) { setGifts([]); throw new Error(data.error || "Could not load gifts."); }
        setProfile(data.profile); setGifts(data.gifts);
      } catch (e) { if (!cancelled) setError(e.message); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; controller.abort(); };
  }, [revision]);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);
  useEffect(() => {
    setDetail(null); setDetailError("");
    if (!selectedId) return;
    let cancelled = false;
    const controller = new AbortController();
    fetch(`/api/account/gifts/${encodeURIComponent(selectedId)}`, {cache: "no-store", signal: controller.signal})
      .then(async res => { const data = await res.json(); if (!res.ok) throw new Error(data.error || "Could not load history."); return data.gift; })
      .then(gift => { if (!cancelled) setDetail(gift); })
      .catch(e => { if (!cancelled) setDetailError(e.message); });
    return () => { cancelled = true; controller.abort(); };
  }, [selectedId, revision]);
  const formatDate = value => value ? new Intl.DateTimeFormat(undefined, {dateStyle: "medium", timeStyle: "short"}).format(new Date(value)) : "Date unavailable";

  const messages = [
    {
      id: 1,
      title: "Welcome to WIVELI ♡",
      text: "Your account is ready. Everything you create will live here.",
      date: "TODAY",
    },
  ];
async function connectTelegram() {
  try {
    const response = await fetch("/api/telegram/connect", {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Could not connect Telegram.");
      return;
    }

    window.open(
      `https://t.me/WIVELI_bot?start=${data.connectCode}`,
      "_blank"
    );
  } catch {
    alert("Could not connect Telegram.");
  }
}
  return (
    <main className="accountPage">
      <header>
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <div className="headerRight">
          <a href="/experiences/love-coupons/personalize">CREATE A GIFT</a>
          <button>LOG OUT</button>
        </div>
      </header>

      <section className="account">
        <aside className="sidebar">
          <div className="profile">
            <div className="avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" />
              ) : (
                <span>
                  {profile.name?.charAt(0)?.toUpperCase() || "♡"}
                </span>
              )}
            </div>

            <div>
              <p className="small">YOUR ACCOUNT</p>
              <h2>{profile.name}</h2>
              <p className="email">{profile.email}</p>
            </div>
          </div>

          <nav>
            <button
              className={activeTab === "gifts" ? "active" : ""}
              onClick={() => setActiveTab("gifts")}
            >
              MY GIFTS
              <span>{gifts.length}</span>
            </button>

            <button
              className={activeTab === "purchases" ? "active" : ""}
              onClick={() => setActiveTab("purchases")}
            >
              PURCHASES
            </button>

            <button
              className={activeTab === "inbox" ? "active" : ""}
              onClick={() => setActiveTab("inbox")}
            >
              WIVELI INBOX
              <span>{messages.length}</span>
            </button>

            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              PROFILE
            </button>
          </nav>
        </aside>

        <section className="content">
          {activeTab === "gifts" && (
            <>
              <div className="contentHeader">
                <div>
                  <p className="small">YOUR COLLECTION</p>
                  <h1>
                    MY <em>GIFTS.</em>
                  </h1>
                </div>

                <a className="createButton" href="/experiences/love-coupons/personalize">
                  + CREATE A GIFT
                </a>
              </div>

              <button className="view" onClick={() => setRevision(v => v + 1)}>REFRESH ↻</button>
              {loading && <p role="status">Loading your gifts…</p>}
              {error && <p role="alert">{error} {unauthorized && <a href="/login?next=%2Faccount">Sign in</a>}</p>}
              {selectedId ? (
                <section className="history">
                  <button className="view" onClick={() => setSelectedId(null)}>← ALL GIFTS</button>
                  {detailError && <p role="alert">{detailError}</p>}
                  {!detail && !detailError && <p role="status">Loading history…</p>}
                  {detail && <>
                    <h2>For {detail.recipientName}</h2>
                    <p>{detail.redeemedCount} of {detail.couponCount} coupons used</p>
                    <p>Use times are shown in your local time zone.</p>
                    <h3>Used coupons</h3>
                    {!detail.redemptions.length && <p>No coupons used yet.</p>}
                    {detail.redemptions.map((r, index) => <article className="historyCard" key={`${r.couponId}-${index}`}>
                      <h3>{r.title}</h3>
                      <p>Used: {formatDate(r.redeemedAt)}</p>
                      {r.code && <p>Code: {r.code}</p>}
                      {r.recipientResponse && Object.values(r.recipientResponse).some(Boolean) ? <dl>
                        {[["choice", "Recipient’s choice"], ["date", "Planned date"], ["time", "Planned time"], ["place", "Where"], ["note", "Message"], ["timeZone", "Plan time zone"]].map(([key, label]) => r.recipientResponse[key] && <div key={key}><dt>{label}</dt><dd>{r.recipientResponse[key]}</dd></div>)}
                      </dl> : <p>No additional details supplied.</p>}
                    </article>)}
                    {!!detail.unusedCoupons.length && <><h3>Not used yet</h3><ul>{detail.unusedCoupons.map(c => <li key={c.id}>{c.title}</li>)}</ul></>}
                  </>}
                </section>
              ) : <div className="giftList">
                {!loading && !error && !gifts.length && <p>Your gifts will appear here after you create one.</p>}
                {gifts.map(gift => <div className="gift" key={gift.id}>
                  <div className="giftIcon">♡</div>
                  <div className="giftInfo"><p className="small">{gift.giftType?.replaceAll("-", " ").toUpperCase()}</p><h3>For {gift.recipientName}</h3><p>{gift.redeemedCount} / {gift.couponCount} used</p></div>
                  <div className="giftDate"><span>CREATED</span>{formatDate(gift.createdAt)}</div>
                  <button className="view" onClick={() => setSelectedId(gift.id)}>VIEW →</button>
                </div>)}
              </div>}

            </>
          )}

          {activeTab === "purchases" && (
            <div className="empty">
              <span>♡</span>
              <h1>YOUR PURCHASES</h1>
              <p>
                Payments and purchased gifts will appear here.
              </p>
            </div>
          )}

          {activeTab === "inbox" && (
            <>
              <div className="contentHeader">
                <div>
                  <p className="small">MESSAGES FROM US</p>
                  <h1>
                    WIVELI <em>INBOX.</em>
                  </h1>
                </div>
              </div>

              <div className="messages">
                {messages.map((message) => (
                  <div className="message" key={message.id}>
                    <div className="messageHeart">♥</div>

                    <div>
                      <p className="small">{message.date}</p>
                      <h3>{message.title}</h3>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <div className="profileSettings">
              <p className="small">YOUR DETAILS</p>

              <h1>
                YOUR <em>PROFILE.</em>
              </h1>

              <div className="photoUpload">
                <div className="bigAvatar">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="" />
                  ) : (
                    profile.name?.charAt(0)?.toUpperCase() || "♡"
                  )}
                </div>

                <button>CHANGE PHOTO</button>
              </div>

              <label>
                NAME
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                EMAIL
                <input value={profile.email} disabled />
              </label>

              <button className="save">SAVE CHANGES</button>
                    <button
  className="telegramButton"
  onClick={connectTelegram}
>
  CONNECT TELEGRAM →
</button>
            </div>
          )}
        </section>
      </section>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html),
        :global(body) {
          margin: 0;
          overflow: hidden;
        }

        .accountPage {
          --cream: #f7f0e8;
          --paper: #fffaf5;
          --pink: #ead3d2;
          --wine: #692f3c;
          --ink: #292322;

          height: 100svh;
          background: var(--cream);
          color: var(--ink);
          font-family: Arial, sans-serif;
        }

        header {
          height: 74px;
          padding: 0 4vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(41, 35, 34, 0.12);
        }

        .logo {
          color: var(--ink);
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .logo span {
          color: var(--wine);
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .headerRight a,
        .headerRight button {
          border: 0;
          background: transparent;
          color: var(--ink);
          text-decoration: none;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          cursor: pointer;
        }

        .account {
          height: calc(100svh - 74px);
          display: grid;
          grid-template-columns: 310px 1fr;
        }

        .sidebar {
          padding: 38px 28px;
          border-right: 1px solid rgba(41, 35, 34, 0.12);
          background: rgba(255, 250, 245, 0.45);
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 45px;
        }

        .avatar,
        .bigAvatar {
          overflow: hidden;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--pink);
          color: var(--wine);
          font-family: Georgia, serif;
        }

        .avatar {
          width: 55px;
          height: 55px;
          font-size: 23px;
        }

        .avatar img,
        .bigAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .small {
          margin: 0 0 6px;
          color: #8a7772;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .profile h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 21px;
          font-weight: 400;
        }

        .email {
          margin: 3px 0 0;
          color: #8b7d79;
          font-size: 10px;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        nav button {
          width: 100%;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #756764;
          cursor: pointer;
          text-align: left;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        nav button.active {
          background: var(--wine);
          color: white;
        }

        nav span {
          opacity: 0.6;
        }

        .content {
          padding: 5vh 5vw;
          overflow: hidden;
        }

        .contentHeader {
          display: flex;
          align-items: end;
          justify-content: space-between;
          margin-bottom: 35px;
        }

        h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(45px, 5vw, 78px);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.045em;
        }

        h1 em {
          color: var(--wine);
          font-weight: 400;
        }

        .createButton {
          padding: 15px 22px;
          border-radius: 100px;
          background: var(--wine);
          color: white;
          text-decoration: none;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .giftList {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .gift {
          min-height: 92px;
          padding: 17px 20px;
          display: grid;
          grid-template-columns: 55px 1fr 150px 100px 70px;
          align-items: center;
          gap: 18px;
          background: var(--paper);
          border: 1px solid rgba(41, 35, 34, 0.1);
          border-radius: 14px;
        }

        .giftIcon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--pink);
          color: var(--wine);
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .gift h3,
        .message h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 19px;
          font-weight: 400;
        }

        .giftDate {
          color: #695d59;
          font-size: 10px;
        }

        .giftDate span {
          display: block;
          margin-bottom: 5px;
          color: #9a8984;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .status {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .opened {
          color: #657a55;
        }

        .sent {
          color: var(--wine);
        }

        .view {
          border: 0;
          background: transparent;
          cursor: pointer;
          color: var(--wine);
          font-size: 8px;
          font-weight: 900;
        }

        .messages {
          max-width: 850px;
        }

        .message {
          padding: 25px;
          display: flex;
          gap: 20px;
          background: var(--paper);
          border-radius: 14px;
          border: 1px solid rgba(41, 35, 34, 0.1);
        }

        .messageHeart {
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--wine);
          color: white;
        }

        .message p:last-child {
          margin-bottom: 0;
          color: #756763;
          font-family: Georgia, serif;
          font-size: 13px;
        }

        .empty {
          height: 70%;
          display: grid;
          place-items: center;
          align-content: center;
          text-align: center;
        }

        .empty span {
          color: var(--wine);
          font-family: Georgia, serif;
          font-size: 55px;
        }

        .empty h1 {
          margin-top: 15px;
          font-size: 45px;
        }

        .empty p {
          color: #81736f;
          font-family: Georgia, serif;
        }

        .profileSettings {
          max-width: 560px;
        }

        .photoUpload {
          margin: 35px 0;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .bigAvatar {
          width: 90px;
          height: 90px;
          font-size: 34px;
        }

        .photoUpload button {
          border: 0;
          background: transparent;
          color: var(--wine);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        label {
          display: block;
          margin-top: 18px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        input {
          width: 100%;
          margin-top: 8px;
          padding: 15px;
          border: 1px solid rgba(41, 35, 34, 0.16);
          border-radius: 10px;
          outline: none;
          background: var(--paper);
        }

        .save {
          margin-top: 25px;
          padding: 16px 25px;
          border: 0;
          border-radius: 100px;
          background: var(--wine);
          color: white;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }
.telegramButton {
  margin-top: 12px;
  margin-left: 10px;
  padding: 16px 25px;
  border: 1px solid var(--wine);
  border-radius: 100px;
  background: transparent;
  color: var(--wine);
  cursor: pointer;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.12em;
}
        @media (max-width: 800px) {
          .account {
            grid-template-columns: 85px 1fr;
          }

          .sidebar {
            padding: 25px 10px;
          }

          .profile > div:last-child,
          nav button {
            font-size: 0;
          }

          nav button {
            justify-content: center;
          }

          .gift {
            grid-template-columns: 45px 1fr 60px;
          }

          .giftDate,
          .status {
            display: none;
          }
        }
      
        :global(html), :global(body) { overflow: auto; }
        .accountPage { height: auto; min-height: 100svh; }
        .account { height: auto; min-height: calc(100svh - 74px); }
        .content { overflow: visible; min-width: 0; }
        .gift { grid-template-columns: 55px minmax(0, 1fr) 150px 70px; }
        .giftInfo, .history { min-width: 0; overflow-wrap: anywhere; }
        .history { margin-top: 28px; }
        .historyCard { background: #fffaf5; border: 1px solid #e6ded8; border-radius: 22px; padding: 24px; margin: 18px 0; }
        .historyCard dt { font-weight: 600; margin-top: 12px; }
        .historyCard dd { margin: 5px 0; white-space: pre-wrap; }
        @media (max-width: 800px) {
          .account { display: block; }
          .sidebar { padding: 20px; border-right: 0; }
          .profile > div:last-child { font-size: 14px; }
          .profile h2 { font-size: 26px; }
          nav { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
          nav button { font-size: 11px; padding: 12px; width: auto; }
          .content { padding: 24px 18px 60px; }
          .gift { grid-template-columns: 40px minmax(0, 1fr) 60px; padding: 18px; gap: 12px; }
          .contentHeader { flex-wrap: wrap; gap: 20px; }
          .historyCard { padding: 18px; }
        }
      `}</style>
    </main>
  );
}



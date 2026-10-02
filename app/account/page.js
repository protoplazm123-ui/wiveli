"use client";

import { useEffect, useRef, useState } from "react";

import WishAccountDetail from "../components/WishAccountDetail";
import TelegramConnect from "../components/TelegramConnect";

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [draft, setDraft] = useState({name: "", email: "", avatar: ""});
  const dirty = useRef(false);
  const photoInput = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [messages, setMessages] = useState([]);
  const [inboxError, setInboxError] = useState("");
  const [inboxLoading, setInboxLoading] = useState(true);
  const [nextOffset, setNextOffset] = useState(null);
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
        setGifts(data.gifts);
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

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/profile", {cache: "no-store"}).then(async res => {
      const data = await res.json();
      if (!res.ok) { if (res.status === 401 && !cancelled) setUnauthorized(true); throw new Error(data.error || "Could not load profile."); }
      if (!cancelled) { setUnauthorized(false); setProfile(data.profile); if (!dirty.current) setDraft(data.profile); setProfileReady(true); setProfileError(""); }
    }).catch(e => { if (!cancelled) { setProfileError(e.message); setProfileReady(false); } });
    return () => { cancelled = true; };
  }, [revision]);
  useEffect(() => {
    let cancelled = false;
    setInboxLoading(true);
    fetch("/api/account/inbox", {cache: "no-store"}).then(async res => {
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Could not load Inbox.");
      if (!cancelled) { setMessages(data.messages); setNextOffset(data.nextOffset); setInboxError(""); }
    }).catch(e => { if (!cancelled) setInboxError(e.message); }).finally(() => { if (!cancelled) setInboxLoading(false); });
    return () => { cancelled = true; };
  }, [revision]);
  function editProfile(key, value) { dirty.current = true; setDraft(previous => ({...previous, [key]: value})); setProfileMessage(""); }
  async function saveProfile(event) {
    event.preventDefault(); setSaving(true); setProfileMessage(""); setProfileError("");
    try {
      const res = await fetch("/api/account/profile", {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(draft)});
      const data = await res.json(); if (!res.ok) { if (res.status === 401) setUnauthorized(true); throw new Error(data.error || "Could not save profile."); }
      setProfile(data.profile); setDraft(data.profile); dirty.current = false;
      setProfileMessage(data.emailConfirmationRequired ? `Profile saved. Confirm the email change using the messages sent to your email addresses. Pending email: ${data.pendingEmail}` : "Your profile has been saved ♡");
    } catch(e) { setProfileError(e.message); } finally { setSaving(false); }
  }
  async function uploadPhoto(event) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    setUploading(true); setProfileError("");
    let objectUrl;
    try {
      if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type) || file.size > 20 * 1024 * 1024) throw new Error("Choose a photo smaller than 20 MB (JPG, PNG or WebP recommended).");
      objectUrl = URL.createObjectURL(file);
      const image = new Image();
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error("This photo cannot be opened. Please choose a JPG or PNG.")); image.src = objectUrl; });
      const scale = Math.min(1, 512 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d"); context.fillStyle = "#fffaf5"; context.fillRect(0,0,canvas.width,canvas.height); context.drawImage(image,0,0,canvas.width,canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", .85));
      if (!blob) throw new Error("Could not prepare photo.");
      const form = new FormData(); form.append("photo", blob, "profile.jpg");
      const res = await fetch("/api/account/avatar", {method: "POST", body: form}); const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not upload photo.");
      editProfile("avatar", data.avatar); setProfileMessage("Photo uploaded. Press Save changes to use it.");
    } catch(e) { setProfileError(e.message); } finally { if (objectUrl) URL.revokeObjectURL(objectUrl); setUploading(false); }
  }
  async function openMessage(message) {
    if (message.readAt) return;
    try {
      const res = await fetch("/api/account/inbox", {method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify({id: message.id})});
      if (!res.ok) throw new Error("Could not mark the message as read.");
      setMessages(previous => previous.map(m => m.id === message.id ? {...m, readAt: new Date().toISOString()} : m));
    } catch(e) { setInboxError(e.message); }
  }
  async function loadMoreMessages() {
    setInboxLoading(true);
    try {
      const res = await fetch(`/api/account/inbox?offset=${nextOffset}`, {cache: "no-store"}); const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load messages.");
      setMessages(previous => [...previous, ...data.messages.filter(m => !previous.some(old => old.id === m.id))]); setNextOffset(data.nextOffset);
    } catch(e) { setInboxError(e.message); } finally { setInboxLoading(false); }
  }
  async function logout() {
    const res = await fetch("/api/auth/logout", {method: "POST"});
    if (res.ok) window.location.assign("/login"); else setProfileError("Could not log out. Please try again.");
  }
  return (
    <main className="accountPage">
      <header>
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <div className="headerRight">
          <a href="/#ideas">CREATE A GIFT</a>
          <button onClick={logout}>LOG OUT</button>
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
          {unauthorized && <p className="sessionNotice" role="alert">Your session ended. <a href="/login?next=%2Faccount">Sign in again</a> to manage your profile and gifts.</p>}
          {!unauthorized && profileReady && activeTab !== "profile" && !selectedId && <TelegramConnect />}

          {activeTab === "gifts" && (
            <>
              {!selectedId && <div className="contentHeader">
                <div>
                  <p className="small">YOUR COLLECTION</p>
                  <h1>
                    MY <em>GIFTS.</em>
                  </h1>
                </div>

                <a className="createButton" href="/#ideas">
                  + CREATE A GIFT
                </a>
              </div>

              }
              {!selectedId && <button className="view" onClick={() => setRevision(v => v + 1)}>REFRESH ↻</button>}
              {loading && <p role="status">Loading your gifts…</p>}
              {error && <p role="alert">{error} {unauthorized && <a href="/login?next=%2Faccount">Sign in</a>}</p>}
              {selectedId ? (
                <section className="history">
                  <div className="historyToolbar">
                    <button type="button" onClick={() => setSelectedId(null)}>← ALL GIFTS</button>
                    <button type="button" onClick={() => setRevision(v => v + 1)} aria-label="Refresh gift history">REFRESH ↻</button>
                  </div>
                  {detailError && <p role="alert">{detailError}</p>}
                  {!detail && !detailError && <p role="status">Loading history…</p>}
                  {detail?.giftType === "open-when" && <section className="giftHistory"><p className="small">OPEN WHEN…</p><h2>For {detail.recipientName}</h2><p>{detail.openedCount} / {detail.letterCount} letters opened · {detail.responseCount} replies</p><a href={`/gift/open-when/${detail.id}`} target="_blank" rel="noopener noreferrer">VIEW YOUR LETTERS →</a>{detail.letters.map(letter=><article className="giftCard" key={letter.id}><div><h3>{letter.title}</h3><p>{letter.openedAt?'Opened: '+formatDate(letter.openedAt):'Not opened yet'}</p>{letter.response&&<div><p>{letter.response.message}</p><p>Replied: {formatDate(letter.response.createdAt)}</p>{['note','date','time','place'].map(key=>letter.response[key]&&<p key={key}><strong>{key}: </strong>{letter.response[key]}</p>)}</div>}</div></article>)}</section>}
                  {detail?.giftType === "our-story" && <section className="giftHistory"><p className="small">OUR STORY</p><h2>For {detail.recipientName}</h2><p>{detail.viewedCount} / {detail.memoryCount} memories viewed</p><a href={`/gift/our-story/${detail.id}`} target="_blank" rel="noopener noreferrer">OPEN YOUR STORY →</a>{detail.memories.map(m=><article className="giftCard" key={m.id}><div><h3>{m.title}</h3><p>{m.date}{m.place?' · '+m.place:''}</p><p>{m.viewedAt?'Viewed: '+new Date(m.viewedAt).toLocaleString():'Not viewed yet'}</p></div></article>)}</section>}
                  {detail?.giftType === "wish-note" && <WishAccountDetail gift={detail}/>}
                  {detail && !["wish-note","our-story","open-when"].includes(detail.giftType) && <>
                    <div className="historyHero">
                      <div><p className="historyEyebrow">LOVE COUPONS · YOUR GIFT</p><h2>For <em>{detail.recipientName}.</em></h2><p className="historySubtitle">Little promises, brought to life.</p></div>
                      <div className="historyCount"><span>{detail.redeemedCount}<i> / {detail.couponCount}</i></span><p>COUPONS USED</p></div>
                    </div>
                    <div className="historyProgress" role="progressbar" aria-label="Coupons used" aria-valuemin={0} aria-valuemax={Math.max(1, detail.couponCount)} aria-valuenow={Math.min(detail.redeemedCount, Math.max(1, detail.couponCount))}><span style={{width: `${Math.min(100, detail.couponCount ? detail.redeemedCount / detail.couponCount * 100 : 0)}%`}} /></div>
                    <div className="historySectionTitle"><h3>Already <em>enjoyed.</em></h3><span>{String(detail.redeemedCount).padStart(2,"0")}</span></div>
                    {!detail.redemptions.length && <p className="historyEmpty">The first little memory is still to come ♡</p>}
                    <div className="historyCards">
                    {detail.redemptions.map((r, index) => <article className="historyCard" key={`${r.couponId}-${index}`}>
                      <div className="historyCardTop"><span className="historyEyebrow">LOVE COUPON</span><span className="historyBadge">USED ♡</span></div>
                      <h3>{r.title.toLowerCase()}</h3>
                      <div className="historyMeta"><time dateTime={r.redeemedAt || undefined}>{formatDate(r.redeemedAt)}</time>{r.code && <span className="historyCode">{r.code}</span>}</div>
                      {r.recipientResponse && Object.values(r.recipientResponse).some(Boolean) ? <div className="historyAnswers"><p className="historyEyebrow">A NOTE FROM YOUR PERSON</p><dl>
                        {[["choice", "Their choice"], ["date", "Planned date"], ["time", "Time"], ["place", "Place"], ["note", "Message"], ["timeZone", "Time zone"]].map(([key, label]) => r.recipientResponse[key] && <div key={key}><dt>{label}</dt><dd>{r.recipientResponse[key]}</dd></div>)}
                      </dl></div> : <p className="historyNoNote">No note left with this coupon.</p>}
                    </article>)}
                    </div>
                    <p className="historyTimezone">Use times are shown in your local time zone.</p>
                    {!!detail.unusedCoupons.length && <>
                      <div className="historySectionTitle"><h3>Still to <em>come.</em></h3><span>{String(detail.unusedCoupons.length).padStart(2,"0")}</span></div>
                      <ul className="historyUnused">{detail.unusedCoupons.map((c,index) => <li key={c.id}><span className="historyNumber">{String(index+1).padStart(2,"0")}</span><span className="historyUnusedTitle">{c.title.toLowerCase()}</span><span className="historyHeart" aria-label="Not used yet">♡</span></li>)}</ul>
                    </>}
                  </>}

                </section>
              ) : <div className="giftList">
                {!loading && !error && !gifts.length && <p>Your gifts will appear here after you create one.</p>}
                {gifts.map(gift => <div className="gift" key={gift.id}>
                  <div className="giftIcon">♡</div>
                  <div className="giftInfo"><p className="small">{gift.giftType?.replaceAll("-", " ").toUpperCase()}</p><h3>For {gift.recipientName}</h3><p>{gift.giftType === "open-when" ? `${gift.openedCount} / ${gift.letterCount} letters opened · ${gift.responseCount} replies` : gift.giftType === "our-story" ? `${gift.viewedCount} / ${gift.memoryCount} memories viewed` : gift.giftType === "wish-note" ? `${gift.createdCount} / ${gift.wishCount} wishes · ${gift.completedCount} completed` : `${gift.redeemedCount} / ${gift.couponCount} used`}</p></div>
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

              <button className="view" onClick={() => setRevision(v => v + 1)}>REFRESH ↻</button>
              {inboxLoading && <p role="status">Loading messages…</p>}
              {inboxError && <p role="alert">{inboxError}</p>}
              {!inboxLoading && !inboxError && !messages.length && <p>No updates yet. Gift openings and coupon uses will appear here.</p>}
              <div className="messages">
                {messages.map(message => <details className="inboxMessage" key={message.id} onToggle={event => { if (event.currentTarget.open) openMessage(message); }}>
                  <summary><span>{!message.readAt ? "● " : ""}{message.title}</span><small>{formatDate(message.date)}</small></summary>
                  <p>{message.text}</p>
                  {message.letterResponse && <div><p>{message.letterResponse.message}</p>{['note','date','time','place'].map(key=>message.letterResponse[key]&&<p key={key}><strong>{key}: </strong>{message.letterResponse[key]}</p>)}</div>}
                  {message.wish && <p>{message.wish.text}<br/>{message.wish.date} {message.wish.time}{message.wish.place ? " · " + message.wish.place : ""}</p>}
                  {message.redemption && <div><p>Used: {formatDate(message.redemption.redeemedAt)}</p><p>Code: {message.redemption.code}</p>
                    {[["choice", "Choice"], ["date", "Planned date"], ["time", "Planned time"], ["place", "Where"], ["note", "Message"], ["timeZone", "Time zone"]].map(([key,label]) => message.redemption.recipientResponse?.[key] && <p key={key}><strong>{label}: </strong>{message.redemption.recipientResponse[key]}</p>)}
                  </div>}
                  <button className="view" onClick={() => { setSelectedId(message.giftId); setActiveTab("gifts"); }}>VIEW GIFT →</button>
                </details>)}
              </div>
              {nextOffset !== null && <button className="view" disabled={inboxLoading} onClick={loadMoreMessages}>LOAD MORE</button>}

            </>
          )}

          {activeTab === "profile" && (
            <div className="profileSettings">
              <p className="small">YOUR DETAILS</p><h1>YOUR <em>PROFILE.</em></h1>
              {profileError && <p role="alert">{profileError}</p>}
              {profileMessage && <p role="status">{profileMessage}</p>}
              <form onSubmit={saveProfile}>
                <fieldset disabled={!profileReady || saving || uploading || unauthorized}>
                  <div className="photoUpload">
                    <div className="bigAvatar">{draft.avatar ? <img src={draft.avatar} alt="Profile preview"/> : draft.name?.charAt(0)?.toUpperCase() || "♡"}</div>
                    <input ref={photoInput} type="file" accept="image/*" hidden onChange={uploadPhoto}/>
                    <button type="button" onClick={() => photoInput.current?.click()}>{uploading ? "UPLOADING…" : "CHANGE PHOTO"}</button>
                  </div>
                  <label>NAME<input value={draft.name} onChange={e => editProfile("name", e.target.value)} required maxLength={100} autoComplete="name"/></label>
                  <label>EMAIL<input type="email" value={draft.email} onChange={e => editProfile("email", e.target.value)} required maxLength={254} autoComplete="email"/></label>
                  <p>Email changes may require confirmation. Your current email stays active until confirmation is complete.</p>
                  <button type="submit" className="save">{saving ? "SAVING…" : "SAVE CHANGES"}</button>
                </fieldset>
              </form>
              <TelegramConnect />
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
      
        fieldset { padding: 0; margin: 0; border: 0; min-width: 0; }
        fieldset:disabled { opacity: .6; }
        .profileSettings input { font-size: 16px; min-width: 0; }
        .profileSettings input[hidden] { display: none; }
        .profileSettings p, .sessionNotice { line-height: 1.6; overflow-wrap: anywhere; }
        .photoUpload { flex-wrap: wrap; gap: 20px; }
        .inboxMessage { padding: 22px; border: 1px solid #e6ded8; border-radius: 18px; background: #fffaf5; margin: 15px 0; overflow-wrap: anywhere; }
        .inboxMessage summary { cursor: pointer; line-height: 1.5; }
        .inboxMessage small { display: block; margin-top: 8px; }
        .inboxMessage p { white-space: pre-wrap; line-height: 1.6; }
        .bigAvatar img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
        @media(max-width: 600px) { .profileSettings h1 { font-size: clamp(32px, 9vw, 52px); } .photoUpload { padding: 20px; } .bigAvatar { width: 80px; height: 80px; flex-shrink: 0; } }
      
        .history { max-width: 940px; margin: 0 auto; color: var(--ink); }
        .historyToolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 40px; }
        .historyToolbar button { border: 0; background: none; padding: 10px 0; color: var(--wine); font: 700 10px Arial, sans-serif; letter-spacing: .12em; cursor: pointer; min-height: 44px; }
        .historyToolbar button:focus-visible { outline: 2px solid var(--wine); outline-offset: 4px; }
        .historyHero { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .history .historyEyebrow { margin: 0; font: 700 9px/1.5 Arial, sans-serif; letter-spacing: .16em; color: #8a7270; }
        .historyHero h2 { font: 400 clamp(40px,5vw,66px)/1.06 Georgia, serif; letter-spacing: -.045em; margin: 16px 0 14px; overflow-wrap: anywhere; }
        .historyHero h2 em { color: var(--wine); font-weight: 400; }
        .historySubtitle { font: 16px/1.6 Georgia, serif; color: #857571; margin: 0; }
        .historyCount { flex-shrink: 0; text-align: center; padding: 20px 26px; border-radius: 20px; background: #ecdedd; color: var(--wine); }
        .historyCount > span { font: 40px/1 Georgia, serif; }
        .historyCount i { font-size: 24px; font-style: normal; color: #a17c80; }
        .historyCount p { font: 700 8px/1.5 Arial, sans-serif; letter-spacing: .14em; margin: 10px 0 0; }
        .historyProgress { height: 3px; background: #e6d8d1; border-radius: 8px; margin: 30px 0 38px; overflow: hidden; }
        .historyProgress > span { display: block; height: 100%; background: var(--wine); border-radius: inherit; }
        .historySectionTitle { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 32px 0 18px; }
        .historySectionTitle h3 { margin: 0; font: 400 29px/1.2 Georgia, serif; letter-spacing: -.025em; }
        .historySectionTitle h3 em { color: var(--wine); font-weight: 400; }
        .historySectionTitle > span { color: #917c76; font: 11px Arial,sans-serif; }
        .historyCards { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; align-items: start; }
        .history .historyCard { margin: 0; padding: 26px; background: var(--paper); border: 1px solid #e5dad2; border-radius: 20px; min-width: 0; }
        .historyCardTop { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .historyBadge { background: #f0e3e1; border-radius: 20px; color: var(--wine); padding: 6px 10px; font: 700 8px/1 Arial,sans-serif; letter-spacing: .09em; white-space: nowrap; }
        .historyCard h3 { font: 400 28px/1.15 Georgia,serif; letter-spacing: -.025em; margin: 22px 0 16px; text-transform: none; }
        .historyCard h3::first-letter, .historyUnusedTitle::first-letter { text-transform: uppercase; }
        .historyMeta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; align-items: center; font: 11px/1.6 Arial,sans-serif; color: #83746e; }
        .historyCode { font-size: 9px; letter-spacing: .07em; color: var(--wine); }
        .historyNoNote { border-top: 1px dashed #e2d4ce; padding-top: 16px; margin: 18px 0 0; color: #8b7a73; font: italic 13px/1.5 Georgia,serif; }
        .historyAnswers { margin-top: 18px; padding-top: 18px; border-top: 1px dashed #dccbc6; }
        .historyAnswers dl { margin: 14px 0 0; }
        .historyAnswers dl > div { display: grid; grid-template-columns: 80px minmax(0,1fr); gap: 12px; margin: 10px 0; }
        .history .historyAnswers dt { margin: 0; font: 11px/1.7 Arial,sans-serif; font-weight: 400; color: #8b7a73; }
        .history .historyAnswers dd { margin: 0; font: 15px/1.4 Georgia,serif; color: var(--wine); white-space: pre-wrap; overflow-wrap: anywhere; }
        .historyTimezone { margin: 16px 0 30px; font: 10px/1.5 Arial,sans-serif; color: #8b7a73; }
        .historyEmpty { font: italic 16px/1.6 Georgia,serif; color: #8b7a73; padding: 20px 0; }
        .historyUnused { padding: 0; margin: 0; list-style: none; border-top: 1px solid #e1d6cd; }
        .historyUnused li { display: grid; grid-template-columns: 28px minmax(0,1fr) 24px; align-items: center; gap: 14px; padding: 20px 4px; border-bottom: 1px solid #e1d6cd; }
        .historyNumber { font: 10px Arial,sans-serif; color: #a08b83; }
        .historyUnusedTitle { font: 21px/1.25 Georgia,serif; overflow-wrap: anywhere; }
        .historyHeart { color: var(--wine); font-size: 24px; }
        @media(max-width: 600px) {
          .historyToolbar { margin-bottom: 22px; }
          .historyHero { gap: 14px; align-items: flex-start; }
          .historyHero > div:first-child { min-width: 0; }
          .historyHero h2 { font-size: clamp(34px,9vw,48px); }
          .historyCount { padding: 16px 12px; border-radius: 16px; }
          .historyCount > span { font-size: 30px; }
          .historyCount i { font-size: 18px; }
          .historyCount p { font-size: 7px; letter-spacing: .08em; }
          .historySubtitle { font-size: 14px; }
          .historyCards { grid-template-columns: minmax(0,1fr); gap: 14px; }
          .history .historyCard { padding: 22px; }
          .historySectionTitle h3 { font-size: 27px; }
          .historyUnusedTitle { font-size: 20px; }
        }
      `}</style>
    </main>
  );
}








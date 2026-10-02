"use client";

import { useState } from "react";

export default function TelegramGiftDelivery({ giftId, onBack, senderName = "", recipientName = "", giftType = "love-coupons" }) {
  const [invitationText, setInvitationText] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  async function createInvitation() {
    if (inviteBusy) return;
    setInviteBusy(true);
    setInviteMessage("");
    try {
      const response = await fetch(`/api/gifts/${encodeURIComponent(giftId)}/deliver`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not create invitation.");
      setInviteUrl(data.inviteUrl);
      setInvitationText(`${recipientName ? recipientName + ", " : ""}у меня для тебя особенный подарок ♡\nЯ создал(а) его специально для тебя.\n\nНажми на ссылку и затем Start в боте WIVELI — там тебя ждёт подарок. Регистрация не нужна.\n${data.inviteUrl}${senderName ? "\n\nС любовью, " + senderName : ""}`);
    } catch (error) { setInviteMessage(error.message); }
    finally { setInviteBusy(false); }
  }

  async function copyInvitation() {
    try {
      await navigator.clipboard.writeText(invitationText);
      setInviteMessage("INVITATION COPIED ♡ Send it to your person in any messenger.");
    } catch { setInviteMessage("Select and copy the invitation link below."); }
  }

  async function deliver(event) {
    event.preventDefault();
    if (busy || sent) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/gifts/${encodeURIComponent(giftId)}/deliver`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientUsername: username }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not deliver your gift.");
      setSent(true);
      setMessage(data.alreadySent ? "This gift was already delivered by WIVELI ♡" : "Your gift was sent by the WIVELI bot ♡");
    } catch (error) {
      setMessage(error.message || "Could not deliver your gift.");
    } finally { setBusy(false); }
  }

  return (
    <section className="delivery">
      <p className="eyebrow">SEND FROM WIVELI</p>
      <h2>A LITTLE SURPRISE<br /><em>IN TELEGRAM.</em></h2>
      <p>Send a personal invitation. They open the bot, press Start, and receive your gift — no WIVELI account needed.</p>
      {!inviteUrl ? (
        <button type="button" onClick={createInvitation} disabled={inviteBusy}>
          {inviteBusy ? "PREPARING…" : "CREATE BOT INVITATION ♡"}
        </button>
      ) : (
        <div>
          <label htmlFor="invitation-message">YOUR PERSONAL INVITATION — EDIT BEFORE SENDING</label>
          <textarea id="invitation-message" value={invitationText} onChange={e=>setInvitationText(e.target.value)} rows={9}/>
          <p>Copy this message and send it privately to your person. Nothing is sent automatically.</p>
          <label htmlFor="bot-invitation">PRIVATE BOT INVITATION</label>
          <input id="bot-invitation" value={inviteUrl} readOnly onFocus={e => e.target.select()} />
          <button type="button" onClick={copyInvitation}>COPY INVITATION ♡</button>
        </div>
      )}
      {inviteMessage && <p role="status">{inviteMessage}</p>}
      <hr />
      <p>Already using the WIVELI bot? You can also send the gift directly to their Telegram username.</p>
      <form onSubmit={deliver}>
        <label htmlFor="recipient-telegram">RECIPIENT&apos;S TELEGRAM USERNAME</label>
        <input id="recipient-telegram" value={username} onChange={e => setUsername(e.target.value)}
          placeholder="@username" required disabled={busy || sent} autoComplete="off" maxLength={33} />
        <p className="note">Check the username carefully — this person will receive your private gift link.</p>
        <button type="submit" disabled={busy || sent || !username.trim()}>
          {busy ? "SENDING…" : sent ? "SENT ♡" : "SEND GIFT VIA WIVELI ♡"}
        </button>
      </form>
      {message && <p role="status" aria-live="polite">{message}</p>}
      <p>To receive gift updates yourself, <a href="/account" target="_blank" rel="noopener noreferrer">connect your Telegram in your account</a>.
        {giftType === "open-when" ? "Letter openings and replies appear in your Inbox and your connected Telegram bot." : giftType === "our-story" ? "When your recipient opens the story, an update appears in your Inbox and your connected Telegram bot." : giftType === "wish-note" ? "Wish Note openings, new wishes and completed wishes appear in your Inbox; your connected bot also sends notifications." : "Then enable Remind me on a coupon, or let the recipient use Tell the sender after redeeming it."}</p>
      <button type="button" onClick={onBack} disabled={busy}>{["wish-note","our-story","open-when"].includes(giftType) ? "← OPEN YOUR ACCOUNT" : "← BACK TO GIFT LINK"}</button>
      <style jsx>{`
        textarea { display:block; box-sizing:border-box; width:100%; min-height:190px; resize:vertical; margin:12px 0; padding:16px; border:1px solid #a96b72; border-radius:12px; color:#741020; background:#fff4f0; font:16px/1.5 Georgia,serif; }
        .delivery { display: block; box-sizing: border-box; width: 100%; min-width: 0; height: auto; min-height: 0; padding: 0; position: relative; overflow-wrap: anywhere; }
        .delivery form, .delivery > div { display: block; width: 100%; min-width: 0; margin: 0; padding: 0; position: static; }
        .delivery input { min-width: 0; max-width: 100%; font-size: 16px; color: #741020; }
        .delivery button { max-width: 100%; height: auto; white-space: normal; overflow-wrap: anywhere; }
        .delivery h2 { overflow-wrap: normal; }

        .delivery { max-width: 620px; margin: auto; color: #741020; }
        .eyebrow, label { font: bold 10px Arial, sans-serif; letter-spacing: .13em; }
        h2 { font: 48px/.95 Georgia, serif; margin: 24px 0; }
        p { line-height: 1.5; }
        label { display: block; margin-top: 24px; }
        input { box-sizing: border-box; width: 100%; padding: 14px; margin-top: 12px; border: 1px solid #a96b72; border-radius: 10px; font: inherit; background: #fff4f0; }
        button { padding: 16px 22px; border: 0; border-radius: 30px; background: #741020; color: #fff0eb; cursor: pointer; margin: 12px 0; }
        button:disabled { opacity: .5; cursor: default; }
        a { color: inherit; text-decoration: underline; }
        .note { font-size: 13px; }
        @media (max-width: 600px) { h2 { font-size: 34px; } }
      `}</style>
    </section>
  );
}





"use client";

import { useState } from "react";

export default function TelegramGiftDelivery({ giftId, onBack }) {
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

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
      <p>The WIVELI bot will send your gift with an Open your gift button.</p>
      <p>First, your recipient needs to connect Telegram in their WIVELI account and press Start in the bot.</p>
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
      <p>To receive coupon updates yourself, <a href="/account" target="_blank" rel="noopener noreferrer">connect your Telegram in your account</a>.
        Then enable Remind me on a coupon, or let the recipient use Tell the sender after redeeming it.</p>
      <button type="button" onClick={onBack} disabled={busy}>← BACK TO GIFT LINK</button>
      <style jsx>{`
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

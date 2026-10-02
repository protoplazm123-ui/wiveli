"use client";
import { useCallback, useEffect, useState } from "react";

export default function TelegramConnect({onConnected}) {
  const [connected, setConnected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/telegram/connect", {cache: "no-store"});
      const data = await res.json();
      setNeedsLogin(res.status === 401);
      if (!res.ok) throw new Error(data.error || "Could not check Telegram.");
      setConnected(data.connected); setError("");
      if (data.connected) onConnected?.();
    } catch (e) { setError(e.message); }
    finally { setChecked(true); }
  }, [onConnected]);
  useEffect(() => { check(); window.addEventListener("focus", check); return () => window.removeEventListener("focus", check); }, [check]);
  useEffect(() => {
    if (!url || connected) return;
    const timer = setInterval(() => { if (document.visibilityState === "visible") check(); }, 4000);
    return () => clearInterval(timer);
  }, [url, connected, check]);
  async function connect() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/telegram/connect", {method: "POST"});
      const data = await res.json();
      setNeedsLogin(res.status === 401);
      if (!res.ok) throw new Error(data.error || "Could not connect Telegram.");
      if (data.connected) { setConnected(true); onConnected?.(); }
      else setUrl(data.url);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <section className="telegramConnect">
    <h3>{connected ? "Telegram connected ♡" : "Connect Telegram"}</h3>
    <p>Gift openings and used coupons appear in your WIVELI Inbox. Connect the bot to receive gift opening alerts in Telegram too. For coupon alerts, enable “Remind me” or let your recipient press “Tell the sender”.</p>
    {!checked && <p role="status">Checking connection…</p>}
    {!connected && checked && <>
      <button type="button" onClick={connect} disabled={busy || needsLogin}>{busy ? "PREPARING…" : url ? "GET A NEW CONNECTION LINK" : "CONNECT TELEGRAM →"}</button>
      {url && <><p>Open the bot using this personal link, press Start, then return here. The link expires in 15 minutes.</p><a className="openBot" href={url} target="_blank" rel="noopener noreferrer">OPEN WIVELI BOT →</a><button type="button" onClick={check}>I PRESSED START — CHECK</button></>}
    </>}
    {error && <p role="alert">{error} {needsLogin && <a href="/login?next=%2Faccount">Sign in again</a>}</p>}
    <style jsx>{`
      .telegramConnect { padding: 22px; margin: 24px 0; border: 1px solid #d4babc; border-radius: 18px; color: #692f3c; background: #fffaf5; overflow-wrap: anywhere; }
      h3 { margin: 0 0 10px; font: 24px Georgia, serif; }
      p { line-height: 1.6; font-size: 14px; }
      button, .openBot { display: inline-block; box-sizing: border-box; max-width: 100%; margin: 8px 8px 0 0; padding: 15px 18px; border: 1px solid #692f3c; border-radius: 24px; font: bold 12px Arial, sans-serif; color: #692f3c; background: transparent; text-decoration: none; white-space: normal; cursor: pointer; }
      .openBot { background: #692f3c; color: white; }
      button:disabled { opacity: .5; }
      a { color: inherit; }
    `}</style>
  </section>;
}

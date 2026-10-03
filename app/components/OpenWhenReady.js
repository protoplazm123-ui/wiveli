"use client";

import { useState } from "react";
import TelegramGiftDelivery from "./TelegramGiftDelivery";

export default function OpenWhenReady({ created, recipient, sender, onEdit }) {
  const [copyStatus, setCopyStatus] = useState("");
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(created.giftUrl);
      setCopyStatus("Link copied ♡");
    } catch {
      setCopyStatus("Select the link below and copy it manually.");
    }
  }
  return (
    <main className="ready">
      <header className="header">
        <a className="logo" href="/" aria-label="WIVELI home">WI<span>♥</span>ELI</a>
        <span className="section">OPEN WHEN</span>
        <a href="/account">MY ACCOUNT ↗</a>
      </header>
      <div className="layout">
        <section className="intro">
          <div className="seal" aria-hidden="true">♡</div>
          <p className="eyebrow">MADE BY YOU. JUST FOR THEM.</p>
          <h1>Your letters<br />are <em>ready.</em></h1>
          <p className="description">A little piece of you, ready for {recipient || "your person"} to open when they need it most.</p>
          <a className="preview" href={created.giftUrl} target="_blank" rel="noopener noreferrer">VIEW YOUR GIFT <span>↗</span></a>
          <div className="linkCard">
            <label htmlFor="ready-gift-link">YOUR PRIVATE GIFT LINK</label>
            <p>Keep it between you and your person.</p>
            <input id="ready-gift-link" value={created.giftUrl} readOnly onFocus={e=>e.target.select()} />
            <button type="button" onClick={copyLink}>COPY LINK ↗</button>
            <p role="status">{copyStatus}</p>
          </div>
          <button className="edit" type="button" onClick={onEdit}>EDIT A NEW COPY →</button>
        </section>
        <div className="deliveryCard">
          <TelegramGiftDelivery appearance="cosmic" giftType="open-when" giftId={created.id} recipientName={recipient} senderName={sender} onBack={()=>window.location.assign('/account')} />
        </div>
      </div>
      <footer>A LITTLE LOVE, SAVED FOR LATER. <span>♡</span> WIVELI</footer>
      <style jsx>{`
        .ready { min-height:100vh; background:radial-gradient(ellipse at 20% 20%,#291535 0,transparent 48%),#0d0912; color:#f7f1fb; font-family:Arial,Helvetica,sans-serif; }
        .ready * { box-sizing:border-box; }
        .header { min-height:76px; padding:20px 5%; display:flex; align-items:center; justify-content:space-between; gap:16px; border-bottom:1px solid #302239; }
        .header a { color:#d5b7e8; text-decoration:none; font-size:10px; letter-spacing:.12em; }
        .header .logo { font:22px Georgia,serif; color:#fff; letter-spacing:.08em; }
        .logo span { color:#c590eb; }
        .section,.eyebrow { font-size:10px; letter-spacing:.2em; color:#cda7e7; }
        .layout { max-width:1200px; margin:auto; padding:72px 32px; display:grid; grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr); gap:72px; align-items:start; }
        .intro { min-width:0; padding-top:20px; }
        .seal { display:grid; place-items:center; width:68px; height:68px; border:1px solid #76528f; border-radius:50%; color:#d9b4f4; font:40px Georgia,serif; margin-bottom:32px; }
        h1 { font:400 clamp(48px,5.7vw,76px)/1.02 Georgia,serif; letter-spacing:-.045em; margin:24px 0; }
        h1 em { color:#d1a5ef; font-weight:400; }
        .description { color:#c3b6ce; font-size:15px; line-height:1.8; max-width:340px; }
        .preview { display:flex; align-items:center; justify-content:space-between; gap:24px; text-decoration:none; margin:30px 0; padding:18px 24px; border-radius:30px; background:#d4b1ed; color:#24132f; font-size:11px; font-weight:700; letter-spacing:.1em; }
        .preview span { font-size:20px; }
        .linkCard { border-top:1px solid #493251; padding-top:24px; }
        label { font-size:10px; letter-spacing:.13em; color:#d9b9ed; }
        .linkCard p { color:#bcaac7; font-size:12px; line-height:1.6; }
        input { display:block; width:100%; min-width:0; padding:14px; margin:16px 0 8px; color:#e8d9f2; background:#191020; border:1px solid #665175; border-radius:12px; font:16px Arial,sans-serif; }
        button { min-height:44px; border:0; padding:12px 0; background:none; color:#d9b9ed; font:700 10px Arial,sans-serif; letter-spacing:.1em; cursor:pointer; text-align:left; }
        .edit { margin-top:18px; color:#b9a5c7; }
        .deliveryCard { min-width:0; border:1px solid #493251; background:linear-gradient(145deg,#24152e,#160e1d); padding:36px; border-radius:24px; }
        footer { padding:26px; border-top:1px solid #302239; text-align:center; font-size:9px; letter-spacing:.16em; color:#bcaac7; }
        footer span { margin:0 14px; color:#d1a5ef; }
        a:focus-visible,button:focus-visible,input:focus-visible { outline:2px solid #e0b9fa; outline-offset:4px; }
        @media(max-width:800px) { .layout { grid-template-columns:1fr; gap:36px; max-width:620px; padding:36px 20px; } .intro { padding-top:0; } .deliveryCard { padding:24px; } h1 { font-size:58px; } }
        @media(max-width:400px) { .section { display:none; } .deliveryCard { padding:20px; } h1 { font-size:50px; } }
      `}</style>
    </main>
  );
}

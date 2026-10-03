"use client";
import React, { useState } from "react";
import Link from "next/link";
import HomeAccount from "./components/HomeAccount";

const occasions = [
  { title: "For Someone Special", icon: "♡" },
  { title: "Birthday", icon: "✦" },
  { title: "For Two", icon: "∞" },
  { title: "For Friends", icon: "☺" },
  { title: "Just Because", icon: "✧" },
];

const experiences = [
  {
    id: "love-coupons",
    title: "Love Coupons",
    subtitle: "Promises & Special Vouchers",
    symbol: "✦",
    tag: "LITTLE PROMISES · BIG MEMORIES",
    image: "/assets/coupon-card.png",
    text: "Cute interactive tickets (breakfast in bed, movie night, hugs) they can tear & redeem.",
    href: "/experiences/love-coupons",
    cta: "Create Coupons"
  },
  {
    id: "open-when",
    title: "Open When...",
    subtitle: "Handcrafted Digital Journal",
    symbol: "✉",
    tag: "A LITTLE BOOK OF CARE",
    image: "/assets/open-when/diary-kit/journal-open.png",
    text: "Surprise letters for every mood: when they're sad, can't sleep, or miss you.",
    href: "/experiences/open-when",
    cta: "Write Letters"
  },
  {
    id: "wish-note",
    title: "Wish Note",
    subtitle: "365 Days of Daily Love",
    symbol: "♡",
    tag: "365 DAYS · 365 WISHES",
    image: "/assets/Изображение Codex 25 сент. 2026 г., 16_58_11.png",
    text: "A year of sealed little wishes, delivering a warm message one day at a time.",
    href: "/experiences/wish-note",
    cta: "Start Wishes"
  },
  {
    id: "our-story",
    title: "Our Story",
    subtitle: "Interactive Memory Timeline",
    symbol: "♥",
    tag: "YOUR STORY · YOUR MOMENTS",
    image: "/assets/home/21EA03BA-6EFC-40E2-8F98-708E97670EE2.png",
    text: "Turn your photos, road trips, and inside jokes into a beautiful interactive book.",
    href: "/experiences/our-story",
    cta: "Build Story"
  },
  {
    id: "the-gift",
    title: "The Gift",
    subtitle: "Unlock Surprises with Trivia",
    symbol: "✦",
    tag: "ANSWER · UNLOCK · REVEAL",
    image: "/assets/home/547AE97E-FC4B-40ED-9C1C-183411186401.png",
    text: "Answer sweet personal questions to unlock hidden photos, audio notes, and gifts.",
    href: "/experiences/the-gift/personalize",
    cta: "Create Quest"
  },
  {
    id: "unique-gift",
    title: "Unique Gift",
    subtitle: "Custom Made Just for Them",
    symbol: "✦",
    tag: "WIVELI BESPOKE · MADE JUST FOR THEM",
    image: "/assets/Изображение Codex 25 сент. 2026 г., 16_58_11.png",
    text: "Work directly with our team to craft a 100% bespoke emotional experience.",
    href: "/experiences/unique-gift",
    premium: true,
    cta: "Request Bespoke"
  },
];

export default function Home() {
  const [activeExp, setActiveExp] = useState(0);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState("For Someone Special");

  const current = experiences[activeExp];

  return (
    <main className="wiveli-page">
      {/* ================= 1. HEADER (C ЛИЧНЫМ КАБИНЕТОМ) ================= */}
      <header className="wiveli-nav">
        <Link href="/" className="wiveli-logo">
          WI<span>♥</span>ELI
        </Link>

        <nav className="wiveli-links">
          <a href="#hero">🎁 Gifts</a>
          <a href="#experiences">✨ Experiences</a>
          <a href="#how">💡 How it Works</a>
          <a href="#about">📖 About</a>
        </nav>

        {/* ПРАВЫЙ ВЕРХНИЙ УГОЛ: HomeAccount (Личный кабинет) + Кнопка */}
        <div className="wiveli-actions">
          <HomeAccount />
          <a className="btn-create" href="#experiences">
            Create a Gift →
          </a>
        </div>
      </header>

      {/* ================= 2. HERO: ЛЮБИМЫЕ КАРТИНКИ РУК И КОРОБКИ ================= */}
      <section className="wiveli-hero" id="hero">
        <div className="occasion-bar">
          {occasions.map((occ) => (
            <button
              key={occ.title}
              onClick={() => setActiveOccasion(occ.title)}
              className={activeOccasion === occ.title ? "occ-btn active" : "occ-btn"}
            >
              {occ.icon} {occ.title}
            </button>
          ))}
        </div>

        <h1 className="hero-title">
          Give them <br />
          <em>something personal.</em>
        </h1>

        <p className="hero-sub">
          Turn memories, sweet words, and little promises into an interactive gift made just for one person.
        </p>

        {/* Сцена с руками и коробкой подарка */}
        <div className="hero-visual-stage">
          <img
            src="/assets/Изображение Codex 25 сент. 2026 г., 16_56_33.png"
            alt="Left Hand"
            className="hand-img hand-left"
          />

          <div className="gift-container" onClick={() => setIsGiftOpen(!isGiftOpen)}>
            <img
              src="/assets/Изображение Codex 25 сент. 2026 г., 16_58_11.png"
              alt="Gift Box"
              className="gift-img"
            />
            <span className="tap-badge">
              {isGiftOpen ? "✕ Close note" : "✨ Tap to open gift"}
            </span>
          </div>

          <img
            src="/assets/Изображение Codex 25 сент. 2026 г., 16_57_18.png"
            alt="Right Hand"
            className="hand-img hand-right"
          />
        </div>

        {isGiftOpen && (
          <div className="revealed-note">
            <p>
              "The best gifts aren't bought in a shopping mall. They are made from inside jokes, late night talks, and memories only we share."
            </p>
            <small>With love, Wiveli ♡</small>
          </div>
        )}
      </section>

      {/* ================= 3. КОМПАКТНЫЙ ПОДИУМ ВПЕЧАТЛЕНИЙ (БЕЗ ДЛИННОГО СКРОЛЛА) ================= */}
      <section className="wiveli-experiences" id="experiences">
        <div className="section-head">
          <p className="eyebrow">PICK A FEELING · MAKE IT YOURS</p>
          <h2>6 Interactive Gift Formats</h2>
        </div>

        {/* Табы форматов */}
        <div className="tabs-row">
          {experiences.map((exp, idx) => (
            <button
              key={exp.id}
              onClick={() => setActiveExp(idx)}
              className={activeExp === idx ? "tab-btn active" : "tab-btn"}
            >
              <span>{exp.symbol}</span>
              <strong>{exp.title}</strong>
              {exp.premium && <span className="bespoke-tag">BESPOKE</span>}
            </button>
          ))}
        </div>

        {/* Карточка активного формата с картинкой */}
        <div className="stage-card">
          <div className="stage-media">
            <img src={current.image} alt={current.title} />
          </div>
          <div className="stage-info">
            <span className="info-tag">{current.tag}</span>
            <h3>{current.title}</h3>
            <p className="info-sub">{current.subtitle}</p>
            <p className="info-desc">{current.text}</p>

            <div className="stage-footer">
              <Link href={current.href} className="btn-action">
                {current.cta} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. КАК ЭТО РАБОТАЕТ ================= */}
      <section className="wiveli-how" id="how">
        <h3>How Wiveli Works</h3>
        <div className="how-steps">
          <div className="step-item">
            <span>1</span>
            <strong>Pick your format</strong>
            <p>Love coupons, letters, or daily wishes.</p>
          </div>
          <div className="step-item">
            <span>2</span>
            <strong>Add your memories</strong>
            <p>Upload photos, voice notes, and sweet words.</p>
          </div>
          <div className="step-item">
            <span>3</span>
            <strong>Send with love</strong>
            <p>Share a private link or deliver via Telegram.</p>
          </div>
        </div>
      </section>

      {/* ================= 5. FOOTER ================= */}
      <footer className="wiveli-footer" id="about">
        <div className="foot-brand">
          <strong>WI<span>♥</span>ELI</strong> · Wish + loVE + LIfe
        </div>
        <p>© 2026 WIVELI. Made for someone who matters.</p>
      </footer>
    </main>
  );
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import HomeAccount from "./components/HomeAccount";
import "./components/WiveliNewHome.css";

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
    subtitle: "Ticket Machine with Printed Wishes",
    symbol: "✦",
    tag: "LOVE IS... · WISH VOUCHERS",
    image: "/assets/loveis-coupons.jpg",
    loveIsQuote: "Любовь это... напечатать купон на внезапный поцелуй и утренний кофе ♡",
    text: "A charming mini ticket machine prints out cute perforated coupons with your personal promises and wishes.",
    mechanicBadge: "🖨️ Interactive Ticket Printer",
    href: "/experiences/love-coupons",
    cta: "Print Coupons"
  },
  {
    id: "open-when",
    title: "Open When...",
    subtitle: "Letters for Special Moments",
    symbol: "✉",
    tag: "LOVE IS... · SECRET LETTERS",
    image: "/assets/loveis-open-when.jpg",
    loveIsQuote: "Любовь это... оставить письмо с теплом на тот день, когда вы не рядом ♡",
    text: "Heartfelt cards that open on cue: 'Open when you miss me', 'Open when you need courage', 'Open when you need a hug'.",
    mechanicBadge: "💌 'Open When You Miss Me' Cards",
    href: "/experiences/open-when",
    cta: "Write Letters"
  },
  {
    id: "wish-note",
    title: "Wish Note",
    subtitle: "Wishes, Categories & Calendar",
    symbol: "♡",
    tag: "LOVE IS... · DATES CALENDAR",
    image: "/assets/loveis-wish-note.jpg",
    loveIsQuote: "Любовь это... забронировать в календаре день только для вас двоих ♡",
    text: "Give them a set of wishes and categories where they can book each wish on a personal interactive calendar.",
    mechanicBadge: "📅 Calendar & Category Booking",
    href: "/experiences/wish-note",
    cta: "Set Up Calendar"
  },
  {
    id: "our-story",
    title: "Our Story",
    subtitle: "Cards of Your Best Moments",
    symbol: "♥",
    tag: "LOVE IS... · SHARED MEMORIES",
    image: "/assets/loveis-our-story.jpg",
    loveIsQuote: "Любовь это... бережно хранить каждый полароид и билет из вашей первой поездки ♡",
    text: "Interactive cards featuring the sender's and recipient's best shared moments, road trips, and inside jokes.",
    mechanicBadge: "📸 Moment Cards Connecting You Two",
    href: "/experiences/our-story",
    cta: "Build Moments"
  },
  {
    id: "the-gift",
    title: "The Gift",
    subtitle: "Unlock Surprises with Trivia",
    symbol: "✦",
    tag: "LOVE IS... · SECRET QUEST",
    image: "/assets/loveis-the-gift.jpg",
    loveIsQuote: "Любовь это... разгадать все тайны друг друга с улыбкой ♡",
    text: "Answer sweet personal questions to unlock hidden photos, audio notes, and real surprise gifts.",
    mechanicBadge: "🧩 Secret Question Unlock Quest",
    href: "/experiences/the-gift/personalize",
    cta: "Create Quest"
  },
  {
    id: "unique-gift",
    title: "Wiveli Bespoke",
    subtitle: "Custom App Built by Developers",
    symbol: "✦",
    tag: "LOVE IS... · BESPOKE STUDIO",
    image: "/assets/loveis-bespoke.jpg",
    loveIsQuote: "Любовь это... создать приложение, которого больше нет ни у кого в мире ♡",
    text: "Order a completely custom, tailor-made digital application developed from scratch by our dev team just for you.",
    mechanicBadge: "💻 Custom Dev Studio Order",
    href: "/experiences/unique-gift",
    premium: true,
    cta: "Order Custom App"
  },
];

export default function Home() {
  const [activeExp, setActiveExp] = useState(0);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState("For Someone Special");

  const current = experiences[activeExp];

  return (
    <main className="wiveli-page">
      {/* 1. ШАПКА: Ссылка на Личный кабинет <HomeAccount /> сохранена! */}
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

        {/* Правый угол: HomeAccount (проверяет сессию) + Кнопка */}
        <div className="wiveli-actions">
          <HomeAccount />
          <a className="btn-create" href="#experiences">
            Create a Gift →
          </a>
        </div>
      </header>

      {/* 2. ГЕРОЙ: Руки и коробка подарка с интерактивом */}
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

        {/* Руки и коробка */}
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

      {/* 3. ВКЛАДЫШИ LOVE IS... (КОМПАКТНЫЙ ВЫБОР БЕЗ СКРОЛЛА) */}
      <section className="wiveli-experiences" id="experiences">
        <div className="section-head">
          <p className="eyebrow">LOVE IS... · PICK A FEELING</p>
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

        {/* Вкладыш Love Is... */}
        <div className="stage-card">
          <div className="stage-media">
            <div className="loveis-wrapper">
              <div className="loveis-head">
                <span className="loveis-logo">Love is... ♥♥</span>
                <span className="loveis-tag">{current.title}</span>
              </div>
              <div className="loveis-artwork">
                <img src={current.image} alt={current.title} />
              </div>
              <div className="loveis-quote">
                "{current.loveIsQuote}"
              </div>
            </div>
          </div>

          <div className="stage-info">
            <span className="info-tag">{current.tag}</span>
            <h3>{current.title}</h3>
            <p className="info-sub">{current.subtitle}</p>
            <div className="mechanic-pill">{current.mechanicBadge}</div>
            <p className="info-desc">{current.text}</p>

            <div className="stage-footer">
              <Link href={current.href} className="btn-action">
                {current.cta} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. КАК ЭТО РАБОТАЕТ */}
      <section className="wiveli-how" id="how">
        <h3>How Wiveli Works</h3>
        <div className="how-steps">
          <div className="step-item">
            <span>1</span>
            <strong>Pick your format</strong>
            <p>Tickets, letters, wishes calendar, or custom app.</p>
          </div>
          <div className="step-item">
            <span>2</span>
            <strong>Add your memories</strong>
            <p>Upload photos, select dates, and write promises.</p>
          </div>
          <div className="step-item">
            <span>3</span>
            <strong>Deliver with love</strong>
            <p>Send a private interactive link to their phone.</p>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="wiveli-footer" id="about">
        <div className="foot-brand">
          <strong>WI<span>♥</span>ELI</strong> · Wish + loVE + LIfe
        </div>
        <p>© 2026 WIVELI. Made for someone who matters.</p>
      </footer>
    </main>
  );
}

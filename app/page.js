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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [soundOn, setSoundOn] = useState(true);

  // 3D Parallax Mouse Tracking (Ciao Energy style)
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Organic Web Audio Synth (Ciao Energy haptic clicks)
  const playSfx = (type) => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === 'pop') {
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  };

  const current = experiences[activeExp];

  return (
    <main className="wiveli-page" onMouseMove={handleMouseMove}>
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

        {/* Правый угол: Звук + HomeAccount + Кнопка */}
        <div className="wiveli-actions">
          <button 
            onClick={() => setSoundOn(!soundOn)} 
            className="sfx-btn"
            title="Ciao Haptic Sound"
          >
            {soundOn ? "🔊 SFX: ON" : "🔇 SFX: OFF"}
          </button>
          <HomeAccount />
          <a className="btn-create" href="#experiences">
            Create a Gift →
          </a>
        </div>
      </header>

      {/* 2. ГЕРОЙ: РУКИ ОТ КРАЕВ + 3D ВРАЩЕНИЕ ПОДАРКА ЗА МЫШКОЙ */}
      <section className="wiveli-hero" id="hero">
        <div className="occasion-bar">
          {occasions.map((occ) => (
            <button
              key={occ.title}
              onClick={() => {
                setActiveOccasion(occ.title);
                playSfx('click');
              }}
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

        {/* 3D Сцена: руки выходят за пределы экрана, а коробка поворачивается в 3D */}
        <div className="hero-visual-stage">
          <img
            src="/assets/Изображение Codex 25 сент. 2026 г., 16_56_33.png"
            alt="Left Hand"
            className="hand-img hand-left"
            style={{
              transform: `translateY(-50%) translate(${mousePos.x * -30}px, ${mousePos.y * -15}px)`
            }}
          />

          <div 
            className="gift-container" 
            onClick={() => {
              setIsGiftOpen(!isGiftOpen);
              playSfx('pop');
            }}
            style={{
              transform: `rotateY(${mousePos.x * 24}deg) rotateX(${mousePos.y * -20}deg)`
            }}
          >
            {/* ВЫЕЗЖАЮЩИЙ ИЗ КОРОБКИ СМАРТФОН С ПРЕВЬЮ */}
            {isGiftOpen && (
              <div className="emerging-phone">
                <div className="phone-screen">
                  <div className="phone-island">
                    <span>09:41</span>
                    <div className="island-pill" />
                    <span>5G 🔋</span>
                  </div>

                  <div style={{ textAlign: 'center', margin: '4px 0' }}>
                    <small style={{ color: '#E11D48', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase' }}>
                      {current.title}
                    </small>
                    <div className="phone-preview-card">
                      <img src={current.image} alt={current.title} />
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '11px', margin: '4px 0', lineHeight: 1.3 }}>
                      "{current.loveIsQuote}"
                    </p>
                  </div>

                  <a href="#experiences" className="phone-btn">
                    Open Full Experience →
                  </a>
                </div>
              </div>
            )}

            <img
              src="/assets/Изображение Codex 25 сент. 2026 г., 16_58_11.png"
              alt="Gift Box"
              className="gift-img"
            />
            <span className="tap-badge">
              {isGiftOpen ? "✕ Close phone" : "📱 Tap to unwrap phone & preview"}
            </span>
          </div>

          <img
            src="/assets/Изображение Codex 25 сент. 2026 г., 16_57_18.png"
            alt="Right Hand"
            className="hand-img hand-right"
            style={{
              transform: `translateY(-50%) translate(${mousePos.x * 30}px, ${mousePos.y * 15}px)`
            }}
          />
        </div>

        {isGiftOpen && (
          <div className="revealed-note">
            <p>
              "The best gifts aren't bought in a shopping mall. They are made from inside jokes, late night talks, and memories only we share."
            </p>
            <small style={{ display: 'block', marginTop: '10px', fontSize: '13px', color: '#E11D48', fontStyle: 'normal', fontWeight: 'bold' }}>
              With love, Wiveli ♡
            </small>
          </div>
        )}
      </section>

      {/* 3. ВКЛАДЫШИ LOVE IS... С КНОПКАМИ НАВИГАЦИИ ПО БОКАМ ПРЕВЬЮ */}
      <section className="wiveli-experiences" id="experiences">
        <div className="section-head">
          <p className="eyebrow">CIAO MOTION SHOWCASE · PICK A FEELING</p>
          <h2>6 Interactive Gift Formats</h2>
        </div>

        {/* Табы форматов */}
        <div className="tabs-row">
          {experiences.map((exp, idx) => (
            <button
              key={exp.id}
              onClick={() => {
                setActiveExp(idx);
                playSfx('click');
              }}
              className={activeExp === idx ? "tab-btn active" : "tab-btn"}
            >
              <span>{exp.symbol}</span>
              <strong>{exp.title}</strong>
              {exp.premium && <span className="bespoke-tag">BESPOKE</span>}
            </button>
          ))}
        </div>

        {/* Сцена с кнопками по бокам от самого превью */}
        <div className="slider-flank-wrapper">
          {/* Кнопка Влево (по левому боку превью) */}
          <button 
            onClick={() => {
              setActiveExp((activeExp - 1 + experiences.length) % experiences.length);
              playSfx('click');
            }}
            className="flank-nav-btn flank-prev"
            aria-label="Previous Category"
          >
            ←
          </button>

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

          {/* Кнопка Вправо (по правому боку превью) */}
          <button 
            onClick={() => {
              setActiveExp((activeExp + 1) % experiences.length);
              playSfx('click');
            }}
            className="flank-nav-btn flank-next"
            aria-label="Next Category"
          >
            →
          </button>
        </div>
      </section>

      {/* 5. КАК ЭТО РАБОТАЕТ */}
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

      {/* 6. FOOTER */}
      <footer className="wiveli-footer" id="about">
        <div className="foot-brand">
          <strong>WI<span>♥</span>ELI</strong> · Wish + loVE + LIfe
        </div>
        <p>© 2026 WIVELI. Built with Ciao Motion Design.</p>
      </footer>
    </main>
  );
}

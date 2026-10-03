"use client";

import WiveliHero from "./WiveliHero";
import styles from "./WiveliUnifiedHero.module.css";

const occasions = [
  { title: "Birthday", text: "Make their day unforgettable", icon: "✦" },
  { title: "For Someone Special", text: "Love notes, stories and memories", icon: "♡" },
  { title: "For Two", text: "Shared moments, just for you two", icon: "∞" },
  { title: "For Friends", text: "For your favorite people", icon: "☺" },
  { title: "Just Because", text: "Turn an ordinary day into something special", icon: "✧" },
  { title: "Memories", text: "Your moments, made into a gift", icon: "◌" },
];

export default function WiveliUnifiedHero() {
  return (
    <section className={styles.unified} id="gifts" aria-label="Find the perfect way to give something personal">
      <nav className={styles.occasions} aria-label="Gift occasions">
        {occasions.map((occasion, index) => (
          <a key={occasion.title} href="#ideas" className={styles.card}
            style={{ "--order": index, "--tilt": `${[-7, 6, 5, -5, -6, 7][index]}deg` }}>
            <span className={styles.icon} aria-hidden="true">{occasion.icon}</span>
            <span className={styles.cardCopy}><strong>{occasion.title}</strong><small>{occasion.text}</small></span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
      <p className={styles.eyebrow}>FIND THE PERFECT WAY</p>
      <div className={styles.foreground}><WiveliHero /></div>
    </section>
  );
}

import styles from "./WiveliAbout.module.css";

const features = [
  ["01", "Personal & unique", "Every gift is made around your story."],
  ["02", "Quick & easy", "Create something meaningful without designing from scratch."],
  ["03", "For any occasion", "Birthdays, anniversaries, friendship — or no reason at all."],
];

export default function WiveliAbout() {
  return (
    <section className={styles.about} id="about" aria-labelledby="wiveli-about-title">
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>A MORE MEANINGFUL WAY</p>
          <h2 id="wiveli-about-title">More than<br />a gift.<br /><span>A feeling.</span></h2>
          <p className={styles.description}>Turn your thoughts, memories and little moments into a personal world — made for someone who matters.</p>
          <a className={styles.cta} href="#ideas">Create your gift <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.visual} aria-label="A preview of a personal WIVELI gift">
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.phone}>
            <div className={styles.notch} aria-hidden="true" />
            <p className={styles.phoneLabel}>FOR SOMEONE SPECIAL</p>
            <div className={styles.heart} aria-hidden="true">♡</div>
            <h3>A little world<br /><em>made for you.</em></h3>
            <p className={styles.phoneNote}>Your memories. Your words.<br />A little piece of your heart.</p>
            <a className={styles.phoneButton} href="#ideas">EXPLORE GIFTS <span aria-hidden="true">↗</span></a>
            <span className={styles.signature}>WITH LOVE, WIVELI</span>
          </div>
        </div>
        <div className={styles.features}>
          {features.map(([number, title, text]) => (
            <div className={styles.feature} key={number}>
              <span className={styles.number}>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

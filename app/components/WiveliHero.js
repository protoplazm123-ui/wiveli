"use client";

export default function WiveliHero() {
  return (
    <section className="wiveliHero">
      <div className="wiveliHeroGlow wiveliHeroGlowOne" />
      <div className="wiveliHeroGlow wiveliHeroGlowTwo" />

      <div className="wiveliHeroContent">
        <p className="wiveliHeroEyebrow">
          A GIFT THEY&apos;LL NEVER FORGET
        </p>

        <h1 className="wiveliHeroTitle">
          GIVE THEM
          <br />
          SOMETHING
          <br />
          <span>PERSONAL.</span>
        </h1>

        <p className="wiveliHeroText">
          Turn your memories, words and little moments into an
          interactive gift made just for them.
        </p>

        <div className="wiveliHeroActions">
          <a className="wiveliHeroButton" href="#gifts">
            <span>Create a Gift</span>
            <span className="wiveliHeroArrow">→</span>
          </a>

          <a className="wiveliHeroLink" href="#how-it-works">
            See how it works
          </a>
        </div>
      </div>

      <div className="wiveliGiftScene" aria-hidden="true">
        <img
          className="wiveliHand wiveliHandLeft"
          src="/assets/Изображение Codex 25 сент. 2026 г., 16_56_33.png"
          alt=""
        />

        <div className="wiveliGiftWrap">
          <div className="wiveliGiftAura" />

          <img
            className="wiveliGift"
            src="/assets/Изображение Codex 25 сент. 2026 г., 16_58_11.png"
            alt=""
          />
        </div>

        <img
          className="wiveliHand wiveliHandRight"
          src="/assets/Изображение Codex 25 сент. 2026 г., 16_57_18.png"
          alt=""
        />
      </div>

      <div className="wiveliHeroScroll" aria-hidden="true">
        <span>EXPLORE</span>
        <i />
      </div>
    </section>
  );
}

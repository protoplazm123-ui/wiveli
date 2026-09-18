"use client";

export default function WishNotePreview() {
  const categories = [
    "Dream Together",
    "Food & Places",
    "Our Time",
    "Little Things",
    "Adventures",
    "Something Special",
  ];

  return (
    <main className="previewPage">
      <header className="personalizeHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <div className="personalizeHeaderCenter">
          WISH NOTE / PREVIEW
        </div>

        <a
          className="personalizeExit"
          href="/experiences/wish-note"
        >
          Back
        </a>
      </header>

      <section className="previewHero">
        <p className="eyebrow">YOUR GIFT IS READY ♡</p>

        <h1>
          ONE LAST
          <br />
          LOOK.
        </h1>

        <p className="previewHeroText">
          This is exactly how your gift will feel before it's delivered.
        </p>
      </section>

      <section className="previewLayout">
        {/* LEFT */}

        <div className="previewSummary">
          <div className="summaryCard">
            <p>RECIPIENT</p>
            <strong>Sophie</strong>
          </div>

          <div className="summaryCard">
            <p>NUMBER OF WISHES</p>
            <strong>24 Wishes</strong>
          </div>

          <div className="summaryCard">
            <p>DELIVERY</p>
            <strong>Email • September 26 • 09:00</strong>
          </div>

          <div className="summaryMessage">
            <p>YOUR MESSAGE</p>

            <blockquote>
              “I made this little place for your wishes, dreams and all
              the things we still have to do together.”
            </blockquote>
          </div>

          <div className="summaryCategories">
            <p>WISH CATEGORIES</p>

            <div className="categoryChips">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="giftRevealCard">
          <div className="giftRevealHeader">
            <span>PRIVATE GIFT</span>
            <span>♡</span>
          </div>

          <div className="giftRevealHeart">♥</div>

          <p className="giftRevealSmall">
            365 DAYS OF HAPPINESS
          </p>

          <h2>
            A LITTLE WORLD
            <br />
            MADE FOR
            <br />
            SOPHIE.
          </h2>

          <div className="giftRevealPhoto">
            YOUR MEMORY PHOTO
          </div>

          <p className="giftRevealCaption">
            one of my favorite memories ♡
          </p>

          <button>OPEN YOUR GIFT →</button>

          <small>This button opens the private gift space.</small>
        </div>
      </section>

      <section className="deliveryPreviewSection">
        <div className="deliveryEnvelope">
          <span>✉</span>

          <p>THIS IS WHAT THEY RECEIVE</p>

          <h3>
            Someone made
            <br />
            something just for you.
          </h3>

          <button>Open Your Gift</button>

          <small>Delivered privately via Email / SMS / Telegram.</small>
        </div>

        <div className="deliveryCopy">
          <p className="eyebrow">PRIVATE GIFT SPACE</p>

          <h2>
            THEY NEVER
            <br />
            SEE THE
            <br />
            STORE.
          </h2>

          <p>
            The invitation opens directly into their own Wish Note.
            No catalog. No homepage. No distractions. Just their gift.
          </p>
        </div>
      </section>

      <section className="createGiftSection">
        <p>EVERYTHING LOOKS GOOD?</p>

        <h2>
          CREATE THE
          <br />
          GIFT ♡
        </h2>

        <button className="primary createGiftButton">
          Create Wish Note
        </button>

        <span>
          A unique private link will be generated after creation.
        </span>
      </section>
    </main>
  );
}

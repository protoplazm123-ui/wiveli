import WiveliWishEnvelope from "../../components/WiveliWishEnvelope";

export default function WishNote() {
  const categories = [
    {
      number: "01",
      name: "Dream Together",
      text: "Dreams, plans and things you want to experience together.",
      symbol: "♡",
    },
    {
      number: "02",
      name: "Food & Places",
      text: "Restaurants, trips and places you would love to discover.",
      symbol: "✦",
    },
    {
      number: "03",
      name: "Our Time",
      text: "Dates, activities and little ways to spend time together.",
      symbol: "♥",
    },
    {
      number: "04",
      name: "Little Things",
      text: "Simple wishes that can turn an ordinary day into something special.",
      symbol: "☺",
    },
    {
      number: "05",
      name: "Adventures",
      text: "Big ideas, spontaneous plans and things you have never tried.",
      symbol: "∞",
    },
    {
      number: "06",
      name: "Something Special",
      text: "A little space for wishes that don't fit anywhere else.",
      symbol: "✉",
    },
  ];

  return (
    <main className="productPage">
      {/* HEADER */}
      <header className="productHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <a className="backLink" href="/#ideas">
          ← All Experiences
        </a>
      </header>

      {/* HERO */}
      <section className="productHero">
        <div className="productHeroCopy">
          <p className="eyebrow">
            365 DAYS OF HAPPINESS ♡
          </p>

          <h1>
            WISH
            <br />
            <span>NOTE.</span>
          </h1>

          <p className="productLead">
            Give them a private little world where wishes,
            plans and dreams can turn into moments you share
            together.
          </p>

          <div className="productActions">
            <a
              className="primary"
              href="/experiences/wish-note/personalize"
            >
              Personalize This Gift →
            </a>

            <a
              href="#how-it-works"
              className="secondary productSecondary"
            >
              How It Works
            </a>
          </div>

          <p className="productHint">
            ♡ Personalized by you &nbsp; · &nbsp;
            Wishes made by them &nbsp; · &nbsp;
            Memories made together
          </p>
        </div>

        {/* NEW INTERACTIVE ENVELOPE */}
        <div className="wishPreview">
          <WiveliWishEnvelope />
        </div>
      </section>

      {/* STORY */}
      <section className="productStory">
        <p className="eyebrow">
          MORE THAN A MESSAGE
        </p>

        <h2>
          A LITTLE WORLD
          <br />
          FOR THEIR WISHES.
        </h2>

        <p>
          Wish Note is an interactive digital gift where
          someone special can collect the things they would
          love to do, try and experience with you.
        </p>

        <p>
          You choose how many wishes their Gift Space holds.
          They choose what to wish for and when they would
          love for it to happen.
        </p>
      </section>

      {/* EXPERIENCE DEMO */}
      <section className="wishDemo">
        <div className="demoPhone">
          <div className="demoPhoneTop" />

          <p className="demoTiny">
            WISH NOTE ♡
          </p>

          <h3>
            What are you
            <br />
            wishing for?
          </h3>

          <div className="wishNewPreview">
            <div>
              <span>♡</span>

              <strong>
                Dream Together
              </strong>

              <small>
                5 wishes
              </small>
            </div>

            <div>
              <span>✦</span>

              <strong>
                Food & Places
              </strong>

              <small>
                3 wishes
              </small>
            </div>

            <div>
              <span>♥</span>

              <strong>
                Our Time
              </strong>

              <small>
                4 wishes
              </small>
            </div>

            <div>
              <span>☺</span>

              <strong>
                Little Things
              </strong>

              <small>
                2 wishes
              </small>
            </div>
          </div>

          <p className="demoBottom">
            24 WISHES WAITING FOR YOU
          </p>
        </div>

        <div className="demoCopy">
          <p className="eyebrow">
            THE EXPERIENCE
          </p>

          <h2>
            WISH IT.
            <br />
            PLAN IT.
            <br />
            LIVE IT.
          </h2>

          <p>
            They choose a category, write their wish and
            pick the day they would love for it to happen.
            Every wish becomes part of your shared story.
          </p>

          <div className="wishCategories">
            {categories.map((category) => (
              <div key={category.number}>
                <span>
                  {category.number}
                </span>

                <strong>
                  {category.symbol}{" "}
                  {category.name}
                </strong>

                <p>
                  {category.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FROM WISH TO MEMORY */}
      <section className="productStory">
        <p className="eyebrow">
          FROM WISH TO MEMORY
        </p>

        <h2>
          THE BEST PART
          <br />
          HAPPENS AFTER.
        </h2>

        <p>
          A wish does not disappear when it comes true.
          Completed wishes can become memories — with a
          photo, date and little note about what actually
          happened.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="howWorks"
        id="how-it-works"
      >
        <p className="eyebrow">
          HOW IT WORKS
        </p>

        <h2>
          FROM YOU.
          <br />
          TO THEM.
        </h2>

        <div className="steps">
          <article>
            <span>01</span>

            <h3>
              Make it personal
            </h3>

            <p>
              Add their name, your message, choose how many
              wishes they can make and personalize their
              categories.
            </p>
          </article>

          <article>
            <span>02</span>

            <h3>
              Send the surprise
            </h3>

            <p>
              They receive a private invitation that opens
              directly into their own Wish Note Gift Space.
            </p>
          </article>

          <article>
            <span>03</span>

            <h3>
              Let the story grow
            </h3>

            <p>
              They add wishes and choose dates. When those
              wishes come true, they can become memories.
            </p>
          </article>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="productCTA">
        <p>
          MAKE SOMETHING ONLY THEY CAN OPEN.
        </p>

        <h2>
          READY TO MAKE
          <br />
          THEIR WISH NOTE?
        </h2>

        <a
          className="primary"
          href="/experiences/wish-note/personalize"
        >
          Personalize Wish Note →
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <p>
          Wish + loVE + LIfe
        </p>

        <p>
          © 2026 WIVELI
        </p>
      </footer>
    </main>
  );
}

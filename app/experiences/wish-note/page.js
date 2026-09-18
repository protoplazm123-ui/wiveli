export default function WishNote() {
  return (
    <main className="productPage">
      <header className="productHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <a className="backLink" href="/#ideas">
          ← All Experiences
        </a>
      </header>

      <section className="productHero">
        <div className="productHeroCopy">
          <p className="eyebrow">365 DAYS · 365 WISHES</p>

          <h1>
            WISH
            <br />
            <span>NOTE.</span>
          </h1>

          <p className="productLead">
            Give them a whole year of little wishes, plans and moments
            waiting to happen.
          </p>

          <div className="productActions">
            <button className="primary">Personalize This Gift →</button>

            <a
              href="#how-it-works"
              className="secondary productSecondary"
            >
              How It Works
            </a>
          </div>

          <p className="productHint">
            ♡ Personalized by you &nbsp; · &nbsp; Opened one day at a time
          </p>
        </div>

        <div className="wishPreview">
          <div className="wishEnvelope">
            <div className="wishEnvelopeTop"></div>

            <div className="wishSeal">♥</div>

            <div className="wishCard">
              <p>WISH NOTE ♡</p>

              <h2>
                365 days.
                <br />
                365 wishes.
              </h2>

              <span>made especially for you</span>
            </div>
          </div>
        </div>
      </section>

      <section className="productStory">
        <p className="eyebrow">NOT JUST ONE MESSAGE</p>

        <h2>
          A LITTLE SOMETHING
          <br />
          TO LOOK FORWARD TO.
        </h2>

        <p>
          Wish Note is an interactive digital gift that lasts an entire year.
          Each day gives the recipient a chance to choose a wish, idea or
          little moment they would love to share with you.
        </p>
      </section>

      <section className="wishDemo">
        <div className="demoPhone">
          <div className="demoPhoneTop"></div>

          <p className="demoTiny">WISH NOTE ♡</p>

          <h3>Choose a day</h3>

          <div className="demoCalendar">
            {Array.from({ length: 28 }, (_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </div>

          <p className="demoBottom">365 DAYS · 365 WISHES</p>
        </div>

        <div className="demoCopy">
          <p className="eyebrow">THE EXPERIENCE</p>

          <h2>
            ONE DAY.
            <br />
            ONE WISH.
          </h2>

          <p>
            They choose today's date, pick a category and write a wish.
            Once it is sealed, that day becomes part of your shared story.
          </p>

          <div className="wishCategories">
            <div>
              <span>01</span>
              <strong>Dream Together</strong>
              <p>
                Little plans and things you want to experience together.
              </p>
            </div>

            <div>
              <span>02</span>
              <strong>Food Dreams</strong>
              <p>
                Restaurants, dishes and spontaneous food adventures.
              </p>
            </div>

            <div>
              <span>03</span>
              <strong>Our Time</strong>
              <p>
                Dates, activities and ways to spend your time together.
              </p>
            </div>

            <div>
              <span>04</span>
              <strong>Honest Talk</strong>
              <p>
                A safe little space for things that need to be said.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="howWorks" id="how-it-works">
        <p className="eyebrow">HOW IT WORKS</p>

        <h2>
          FROM YOU.
          <br />
          TO THEM.
        </h2>

        <div className="steps">
          <article>
            <span>01</span>
            <h3>Make it personal</h3>
            <p>
              Add their name, your message, photos, dates and the details
              that make the gift yours.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Send the surprise</h3>
            <p>
              Share their private WIVELI link when the moment feels right.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Let the story grow</h3>
            <p>
              They return throughout the year and fill the gift with new
              wishes and moments.
            </p>
          </article>
        </div>
      </section>

      <section className="productCTA">
        <p>MAKE SOMETHING ONLY THEY CAN OPEN.</p>

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
</a>      </section>

      <footer>
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <p>Wish + loVE + LIfe</p>
        <p>© 2026 WIVELI</p>
      </footer>
    </main>
  );
}

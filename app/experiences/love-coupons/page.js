export default function LoveCoupons() {
  const coupons = [
    {
      number: "01",
      title: "Your Dream Date",
      text: "You choose the place. I'll take care of the rest.",
      symbol: "♡",
    },
    {
      number: "02",
      title: "Breakfast in Bed",
      text: "One lazy morning with absolutely nowhere to be.",
      symbol: "☕",
    },
    {
      number: "03",
      title: "Movie Night",
      text: "Your movie, your snacks, no complaints from me.",
      symbol: "★",
    },
    {
      number: "04",
      title: "A Little Adventure",
      text: "One spontaneous plan. Destination decided together.",
      symbol: "✦",
    },
    {
      number: "05",
      title: "Dinner on Me",
      text: "Pick whatever you're craving. This one's my treat.",
      symbol: "♥",
    },
    {
      number: "06",
      title: "Your Choice",
      text: "One wish. You decide what we're doing.",
      symbol: "∞",
    },
  ];

  return (
    <main className="productPage couponsPage">
      <header className="productHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <a className="backLink" href="/#ideas">
          ← All Experiences
        </a>
      </header>

      <section className="productHero couponsHero">
        <div className="productHeroCopy">
          <p className="eyebrow">LITTLE PROMISES · BIG MEMORIES</p>

          <h1>
            LOVE
            <br />
            <span>COUPONS.</span>
          </h1>

          <p className="productLead">
            Create a collection of little promises, dates and surprises
            they can redeem whenever they want.
          </p>

          <div className="productActions">
            <button className="primary">
              Personalize This Gift →
            </button>

            <a
              href="#coupon-collection"
              className="secondary productSecondary"
            >
              Explore Coupons
            </a>
          </div>

          <p className="productHint">
            ♡ Made by you &nbsp; · &nbsp; Redeemed by them
          </p>
        </div>

        <div className="couponPreview">
          <div className="previewCoupon couponBack">
            <p>WIVELI COUPON</p>
            <span>02</span>
            <h3>MOVIE NIGHT</h3>
            <small>VALID WHENEVER YOU WANT ♡</small>
          </div>

          <div className="previewCoupon couponMiddle">
            <p>WIVELI COUPON</p>
            <span>01</span>
            <h3>DINNER ON ME</h3>
            <small>ONE LITTLE PROMISE</small>
          </div>

          <div className="previewCoupon couponFront">
            <div className="couponHeart">♥</div>
            <p>JUST FOR YOU</p>
            <h2>
              ONE
              <br />
              DREAM DATE
            </h2>
            <small>REDEEM WHEN THE MOMENT FEELS RIGHT</small>
          </div>
        </div>
      </section>

      <section className="productStory">
        <p className="eyebrow">A GIFT THAT KEEPS GIVING</p>

        <h2>
          GIVE THEM
          <br />
          SOMETHING TO
          <br />
          LOOK FORWARD TO.
        </h2>

        <p>
          Love Coupons turns little promises into an interactive digital
          collection. They choose a coupon, redeem it, and turn a simple
          idea into a memory you make together.
        </p>
      </section>

      <section className="couponCollection" id="coupon-collection">
        <div className="couponHeading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>

            <h2>
              PICK ONE.
              <br />
              MAKE A MEMORY.
            </h2>
          </div>

          <p>
            Start with our ideas or create your own. Every coupon can be
            personalized around the things they actually love.
          </p>
        </div>

        <div className="couponGrid">
          {coupons.map((coupon) => (
            <article className="couponCard" key={coupon.number}>
              <div className="couponCardTop">
                <span>{coupon.number}</span>
                <i>{coupon.symbol}</i>
              </div>

              <p>THIS COUPON IS GOOD FOR</p>

              <h3>{coupon.title}</h3>

              <span className="couponDescription">
                {coupon.text}
              </span>

              <div className="couponDashedLine"></div>

              <button>Redeem →</button>
            </article>
          ))}
        </div>
      </section>

      <section className="couponRedeem">
        <div className="redeemTicket">
          <p>WIVELI / LOVE COUPON</p>

          <div className="redeemHeart">♥</div>

          <h2>DINNER ON ME</h2>

          <span>
            Pick the place.
            <br />
            Pick the day.
            <br />
            I've got the rest.
          </span>

          <button>REDEEM THIS COUPON</button>
        </div>

        <div className="redeemCopy">
          <p className="eyebrow">WHEN THEY'RE READY</p>

          <h2>
            ONE TAP.
            <br />
            ONE PLAN.
          </h2>

          <p>
            When they redeem a coupon, it becomes part of your shared
            experience. No forgotten paper coupons. No lost promises.
          </p>
        </div>
      </section>

      <section className="howWorks">
        <p className="eyebrow">HOW IT WORKS</p>

        <h2>
          CREATE.
          <br />
          SEND. REDEEM.
        </h2>

        <div className="steps">
          <article>
            <span>01</span>
            <h3>Build their collection</h3>
            <p>
              Choose ready-made coupon ideas or create completely personal
              ones from scratch.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Make every one personal</h3>
            <p>
              Add your own messages, little rules and details that make
              each promise yours.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Let them choose</h3>
            <p>
              Send one private link and let them redeem their favorite
              coupons whenever they want.
            </p>
          </article>
        </div>
      </section>

      <section className="productCTA couponsCTA">
        <p>THE BEST GIFTS BECOME MEMORIES.</p>

        <h2>
          GIVE THEM
          <br />
          SOMETHING TO DO.
        </h2>

        <button className="primary">
          Create Love Coupons →
        </button>
      </section>

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

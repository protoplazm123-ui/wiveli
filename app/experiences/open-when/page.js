export default function OpenWhen() {
  const letters = [
    {
      number: "01",
      title: "Open when you miss me",
      text: "A little reminder that distance never changes what you mean to me.",
      symbol: "♡",
    },
    {
      number: "02",
      title: "Open when you need a smile",
      text: "Something small to make an ordinary day feel a little better.",
      symbol: "☺",
    },
    {
      number: "03",
      title: "Open when you can't sleep",
      text: "A few words to keep you company when the world gets quiet.",
      symbol: "☾",
    },
    {
      number: "04",
      title: "Open when you're proud of yourself",
      text: "For the moments worth celebrating — even the little ones.",
      symbol: "✦",
    },
    {
      number: "05",
      title: "Open when you need courage",
      text: "A reminder of everything I already know you can handle.",
      symbol: "♥",
    },
    {
      number: "06",
      title: "Open when you need to hear this",
      text: "The words I never want you to forget.",
      symbol: "✉",
    },
  ];

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

      <section className="productHero openWhenHero">
        <div className="productHeroCopy">
          <p className="eyebrow">LETTERS FOR EVERY MOMENT</p>

          <h1>
            OPEN
            <br />
            <span>WHEN...</span>
          </h1>

          <p className="productLead">
            Write the words you want them to have — exactly when they need
            them most.
          </p>

          <div className="productActions">
            <button className="primary">
              Personalize This Gift →
            </button>

            <a
              href="#open-when-letters"
              className="secondary productSecondary"
            >
              Explore Letters
            </a>
          </div>

          <p className="productHint">
            ♡ Written by you &nbsp; · &nbsp; Opened in the right moment
          </p>
        </div>

        <div className="openWhenPreview">
          <div className="openLetter openLetterBack">
            <span>OPEN WHEN...</span>
            <strong>you need a smile</strong>
            <i>♡</i>
          </div>

          <div className="openLetter openLetterMiddle">
            <span>OPEN WHEN...</span>
            <strong>you miss me</strong>
            <i>♥</i>
          </div>

          <div className="openLetter openLetterFront">
            <span>JUST FOR YOU</span>
            <strong>
              Some words
              <br />
              for later.
            </strong>
            <p>open when the moment feels right ♡</p>
          </div>
        </div>
      </section>

      <section className="productStory">
        <p className="eyebrow">WORDS THAT WAIT FOR THEM</p>

        <h2>
          NOT JUST A
          <br />
          MESSAGE.
        </h2>

        <p>
          Open When turns your personal messages into a collection of digital
          letters. Each one is made for a different feeling, situation or
          moment — waiting to be opened when it matters.
        </p>
      </section>

      <section className="openWhenLetters" id="open-when-letters">
        <div className="openWhenHeading">
          <div>
            <p className="eyebrow">THE LETTERS</p>

            <h2>
              THERE WHEN
              <br />
              YOU CAN'T BE.
            </h2>
          </div>

          <p>
            Choose the moments that matter to you. Write something personal
            for each one and create a gift they can return to again and again.
          </p>
        </div>

        <div className="letterGrid">
          {letters.map((letter) => (
            <article className="letterCard" key={letter.number}>
              <div className="letterTop">
                <span>{letter.number}</span>
                <i>{letter.symbol}</i>
              </div>

              <p>OPEN WHEN...</p>

              <h3>{letter.title.replace("Open when ", "")}</h3>

              <div className="letterLine"></div>

              <span className="letterText">{letter.text}</span>

              <button>Open Letter →</button>
            </article>
          ))}
        </div>
      </section>

      <section className="openWhenMoment">
        <div className="momentCard">
          <p>OPEN WHEN YOU MISS ME</p>

          <div className="momentHeart">♥</div>

          <h2>
            Hey you,
          </h2>

          <p className="momentMessage">
            If you're reading this, I wish I could be there with you right
            now. So for a minute, imagine I am.
          </p>

          <span>made with ♡</span>
        </div>

        <div className="momentCopy">
          <p className="eyebrow">MAKE EVERY LETTER YOURS</p>

          <h2>
            YOUR WORDS.
            <br />
            THEIR MOMENT.
          </h2>

          <p>
            Add your own letters, messages, memories and little details.
            The experience becomes completely personal to the person receiving
            it.
          </p>
        </div>
      </section>

      <section className="howWorks">
        <p className="eyebrow">HOW IT WORKS</p>

        <h2>
          WRITE IT.
          <br />
          SEND IT.
        </h2>

        <div className="steps">
          <article>
            <span>01</span>
            <h3>Choose the moments</h3>
            <p>
              Pick from suggested letters or create completely new
              “Open When” moments yourself.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Write your letters</h3>
            <p>
              Add personal messages, photos and the little things only the two
              of you understand.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Send one special link</h3>
            <p>
              They receive their private collection and open each letter when
              the moment arrives.
            </p>
          </article>
        </div>
      </section>

      <section className="productCTA openWhenCTA">
        <p>SOME WORDS ARE WORTH SAVING.</p>

        <h2>
          WRITE SOMETHING
          <br />
          THEY'LL KEEP.
        </h2>

        <button className="primary">
          Create Open When →
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

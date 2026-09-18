export default function OurStory() {
  const moments = [
    {
      number: "01",
      date: "THE BEGINNING",
      title: "How We Met",
      text: "The moment everything started.",
      symbol: "♡",
    },
    {
      number: "02",
      date: "A FAVORITE DAY",
      title: "That One Memory",
      text: "A day you would happily live all over again.",
      symbol: "✦",
    },
    {
      number: "03",
      date: "OUR PLACE",
      title: "Somewhere Special",
      text: "A place that means more because you were there together.",
      symbol: "♥",
    },
    {
      number: "04",
      date: "RIGHT NOW",
      title: "Where We Are",
      text: "Another chapter of a story that is still being written.",
      symbol: "∞",
    },
  ];

  return (
    <main className="storyPage">
      <header className="productHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <a className="backLink" href="/#ideas">
          ← All Experiences
        </a>
      </header>

      <section className="storyHero">
        <div className="storyHeroCopy">
          <p className="eyebrow">YOUR STORY · YOUR MOMENTS</p>

          <h1>
            OUR
            <br />
            <span>STORY.</span>
          </h1>

          <p className="storyLead">
            Turn the moments that made you into an interactive story
            they can experience again and again.
          </p>

          <div className="productActions">
            <button className="primary">
              Personalize This Gift →
            </button>

            <a
              href="#story-experience"
              className="secondary productSecondary"
            >
              See the Experience
            </a>
          </div>

          <p className="productHint">
            ♡ Your photos &nbsp; · &nbsp; Your dates &nbsp; · &nbsp;
            Your story
          </p>
        </div>

        <div className="storyPreview">
          <div className="storyPhoto storyPhotoOne">
            <div className="storyPhotoImage">YOUR PHOTO</div>
            <p>where it all began ♡</p>
          </div>

          <div className="storyPhoto storyPhotoTwo">
            <div className="storyPhotoImage">YOUR MEMORY</div>
            <p>one of our favorites.</p>
          </div>

          <div className="storyHeart">♥</div>
        </div>
      </section>

      <section className="storyIntro">
        <p className="eyebrow">EVERY STORY STARTS SOMEWHERE</p>

        <h2>
          YOUR FAVORITE
          <br />
          MOMENTS.
          <br />
          <span>ALL IN ONE PLACE.</span>
        </h2>

        <p className="storyIntroText">
          Our Story turns photos, dates, messages and little memories
          into a personal digital journey made for the two of you.
        </p>
      </section>

      <section className="storyTimeline" id="story-experience">
        <div className="storyTimelineHeading">
          <p className="eyebrow">THE EXPERIENCE</p>

          <h2>
            FROM THEN
            <br />
            TO NOW.
          </h2>

          <p>
            Build a timeline of the moments that matter. Add photos,
            dates and personal notes to every chapter.
          </p>
        </div>

        <div className="storyMoments">
          {moments.map((moment) => (
            <article className="storyMoment" key={moment.number}>
              <div className="storyMomentTop">
                <span>{moment.number}</span>
                <span>{moment.symbol}</span>
              </div>

              <div className="storyMomentVisual">
                <span>ADD PHOTO</span>
              </div>

              <p className="storyMomentDate">{moment.date}</p>
              <h3>{moment.title}</h3>
              <p className="storyMomentText">{moment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="storyMessage">
        <div>
          <p className="eyebrow">A MESSAGE FROM YOU</p>

          <h2>
            SOME THINGS
            <br />
            DESERVE MORE
            <br />
            THAN A TEXT.
          </h2>
        </div>

        <div className="storyLetter">
          <p>FOR YOU ♡</p>

          <h3>
            “I wanted to make something that feels like us.”
          </h3>

          <span>
            Add your own message, memory or little note for them to
            discover.
          </span>
        </div>
      </section>

      <section className="howWorks storyHow">
        <p className="eyebrow">HOW IT WORKS</p>

        <h2>
          YOUR MEMORIES.
          <br />
          YOUR WAY.
        </h2>

        <div className="steps">
          <article>
            <span>01</span>
            <h3>Add your moments</h3>
            <p>
              Choose your favorite photos, important dates and memories.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Tell your story</h3>
            <p>
              Add captions, messages and little details only the two of
              you understand.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Share the surprise</h3>
            <p>
              Send their private WIVELI link and let them experience the
              story for themselves.
            </p>
          </article>
        </div>
      </section>

      <section className="productCTA storyCTA">
        <p>EVERY MEMORY DESERVES A PLACE.</p>

        <h2>
          TURN YOUR STORY
          <br />
          INTO A GIFT.
        </h2>

        <button className="primary">
          Personalize Our Story →
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

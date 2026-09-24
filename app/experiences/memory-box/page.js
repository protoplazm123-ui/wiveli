export default function MemoryBox() {
  const memories = [
    {
      number: "01",
      type: "PHOTO",
      title: "That Day",
      text: "A photo you never want to lose.",
      symbol: "♡",
    },
    {
      number: "02",
      type: "MESSAGE",
      title: "Something You Said",
      text: "The words that somehow stayed with you.",
      symbol: "✦",
    },
    {
      number: "03",
      type: "VIDEO",
      title: "Press Play",
      text: "A little moment worth watching again.",
      symbol: "▶",
    },
    {
      number: "04",
      type: "VOICE NOTE",
      title: "Listen to This",
      text: "Sometimes hearing their voice is the whole memory.",
      symbol: "♪",
    },
    {
      number: "05",
      type: "PLACE",
      title: "Our Place",
      text: "Somewhere that became special because you were there together.",
      symbol: "⌖",
    },
    {
      number: "06",
      type: "LITTLE THING",
      title: "Don't Forget This",
      text: "The tiny moments that somehow mean the most.",
      symbol: "♥",
    },
  ];

  return (
    <main className="productPage memoryPage">
      <header className="productHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <a className="backLink" href="/#ideas">
          ← All Experiences
        </a>
      </header>

      <section className="productHero memoryHero">
        <div className="productHeroCopy">
          <p className="eyebrow">
            KEEP THE GOOD STUFF
          </p>

          <h1>
            MEMORY
            <br />
            <span>BOX.</span>
          </h1>

          <p className="productLead">
            Collect the photos, videos, messages and little moments
            you never want the two of you to forget.
          </p>

          <div className="productActions">
            <a
              className="primary"
              href="/experiences/memory-box/personalize"
            >
              Personalize This Gift →
            </a>

            <a
              href="#memory-collection"
              className="secondary productSecondary"
            >
              Explore Memories
            </a>
          </div>

          <p className="productHint">
            ♡ Photos &nbsp; · &nbsp; Videos &nbsp; · &nbsp;
            Messages &nbsp; · &nbsp; Voice notes
          </p>
        </div>

        <div className="memoryPreview">
          <div className="memoryBoxShape">
            <div className="memoryBoxLabel">
              <p>MEMORY BOX</p>

              <h2>
                the good
                <br />
                stuff.
              </h2>

              <span>♡</span>
            </div>
          </div>

          <div className="memoryPolaroid memoryPolaroidOne">
            <div>YOUR PHOTO</div>
            <p>remember this?</p>
          </div>

          <div className="memoryPolaroid memoryPolaroidTwo">
            <div>YOUR MEMORY</div>
            <p>one for the box ♡</p>
          </div>
        </div>
      </section>

      <section className="productStory">
        <p className="eyebrow">
          A PLACE FOR THE LITTLE THINGS
        </p>

        <h2>
          SOME MOMENTS
          <br />
          ARE TOO GOOD
          <br />
          TO LOSE.
        </h2>

        <p>
          Memory Box turns your favorite pieces of a relationship,
          friendship or family story into one interactive digital
          collection they can keep coming back to.
        </p>
      </section>

      <section
        className="memoryCollection"
        id="memory-collection"
      >
        <div className="memoryHeading">
          <div>
            <p className="eyebrow">
              INSIDE THE BOX
            </p>

            <h2>
              KEEP MORE
              <br />
              THAN PHOTOS.
            </h2>
          </div>

          <p>
            Mix photos, videos, voice notes, messages and memories
            together instead of leaving them scattered across
            different apps.
          </p>
        </div>

        <div className="memoryGrid">
          {memories.map((memory) => (
            <article
              className="memoryCard"
              key={memory.number}
            >
              <div className="memoryCardTop">
                <span>{memory.number}</span>
                <i>{memory.symbol}</i>
              </div>

              <div className="memoryVisual">
                <span>{memory.type}</span>
              </div>

              <p className="memoryType">
                {memory.type}
              </p>

              <h3>{memory.title}</h3>

              <p className="memoryText">
                {memory.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="memoryFeature">
        <div className="memoryPhone">
          <div className="memoryPhoneTop" />

          <p>OUR MEMORY BOX ♡</p>

          <div className="memoryPhonePhoto">
            YOUR PHOTO
          </div>

          <span>SEPTEMBER 18</span>

          <h3>
            One of those days
            <br />
            I never want to forget.
          </h3>

          <button>
            OPEN NEXT MEMORY →
          </button>
        </div>

        <div className="memoryFeatureCopy">
          <p className="eyebrow">
            OPEN IT AGAIN AND AGAIN
          </p>

          <h2>
            A LITTLE
            <br />
            WORLD OF
            <br />
            YOUR OWN.
          </h2>

          <p>
            Instead of sending a folder of photos, give them an
            experience. Every memory becomes something they can
            discover, open and revisit.
          </p>
        </div>
      </section>

      <section className="howWorks">
        <p className="eyebrow">
          HOW IT WORKS
        </p>

        <h2>
          COLLECT.
          <br />
          CREATE. SHARE.
        </h2>

        <div className="steps">
          <article>
            <span>01</span>

            <h3>Add your memories</h3>

            <p>
              Upload photos, videos, voice notes and personal messages
              you want to keep together.
            </p>
          </article>

          <article>
            <span>02</span>

            <h3>
              Make it feel like yours
            </h3>

            <p>
              Add captions, dates and little details that give every
              memory its meaning.
            </p>
          </article>

          <article>
            <span>03</span>

            <h3>Give them the box</h3>

            <p>
              Share one private WIVELI link where all those moments
              live together.
            </p>
          </article>
        </div>
      </section>

      <section className="productCTA memoryCTA">
        <p>KEEP WHAT MATTERS.</p>

        <h2>
          FILL A BOX
          <br />
          WITH YOUR STORY.
        </h2>

        <a
          className="primary"
          href="/experiences/memory-box/personalize"
        >
          Create Memory Box →
        </a>
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

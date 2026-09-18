export default function HowWellDoYouKnowMe() {
  const questions = [
    {
      number: "01",
      question: "What's my perfect lazy Sunday?",
      answers: [
        "Stay home all day",
        "Coffee + a long walk",
        "Go somewhere new",
        "Sleep until dinner",
      ],
    },
    {
      number: "02",
      question: "What always makes me smile?",
      answers: [
        "Your terrible jokes",
        "Good food",
        "Random surprises",
        "All of the above",
      ],
    },
    {
      number: "03",
      question: "Where would I go tomorrow?",
      answers: [
        "Somewhere warm",
        "A big city",
        "Into the mountains",
        "Anywhere with you",
      ],
    },
    {
      number: "04",
      question: "What do I remember most?",
      answers: [
        "The big moments",
        "The little details",
        "Funny mistakes",
        "Everything somehow",
      ],
    },
  ];

  return (
    <main className="productPage quizPage">
      <header className="productHeader">
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <a className="backLink" href="/#ideas">
          ← All Experiences
        </a>
      </header>

      <section className="productHero quizHero">
        <div className="productHeroCopy">
          <p className="eyebrow">PLAY · LAUGH · DISCOVER</p>

          <h1>
            HOW WELL
            <br />
            <span>DO YOU KNOW ME?</span>
          </h1>

          <p className="productLead">
            Turn your inside jokes, favorite things and shared memories
            into a personalized quiz made just for them.
          </p>

          <div className="productActions">
            <button className="primary">
              Create Your Quiz →
            </button>

            <a
              href="#quiz-preview"
              className="secondary productSecondary"
            >
              See How It Works
            </a>
          </div>

          <p className="productHint">
            ♡ Your questions &nbsp; · &nbsp; Your answers &nbsp; · &nbsp;
            Their score
          </p>
        </div>

        <div className="quizPreview">
          <div className="quizPreviewCard">
            <div className="quizPreviewTop">
              <span>QUESTION 03 / 10</span>
              <span>♡</span>
            </div>

            <p>HOW WELL DO YOU KNOW ME?</p>

            <h2>
              What's my
              <br />
              dream trip?
            </h2>

            <div className="quizPreviewAnswers">
              <button>A. New York</button>
              <button>B. Somewhere tropical</button>
              <button>C. The mountains</button>
              <button>D. Anywhere together</button>
            </div>
          </div>

          <div className="quizScoreBubble">
            <strong>8/10</strong>
            <span>YOU KNOW ME ♡</span>
          </div>
        </div>
      </section>

      <section className="productStory">
        <p className="eyebrow">NOT YOUR AVERAGE QUIZ</p>

        <h2>
          MADE FROM
          <br />
          THE THINGS
          <br />
          ONLY YOU KNOW.
        </h2>

        <p>
          Create questions about your personality, memories, favorites
          and inside jokes. Then send the quiz and find out how much
          they've really been paying attention.
        </p>
      </section>

      <section className="quizExperience" id="quiz-preview">
        <div className="quizExperienceHeading">
          <div>
            <p className="eyebrow">THE EXPERIENCE</p>

            <h2>
              QUESTION
              <br />
              EVERYTHING.
            </h2>
          </div>

          <p>
            You write the questions and choose the correct answers.
            WIVELI turns them into a playful interactive experience
            made specifically for your person.
          </p>
        </div>

        <div className="quizQuestions">
          {questions.map((item) => (
            <article className="quizQuestionCard" key={item.number}>
              <div className="quizQuestionTop">
                <span>QUESTION {item.number}</span>
                <span>?</span>
              </div>

              <h3>{item.question}</h3>

              <div className="quizAnswers">
                {item.answers.map((answer, index) => (
                  <div key={answer}>
                    <span>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <p>{answer}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="quizResult">
        <div className="quizResultCard">
          <p>YOUR RESULT</p>

          <strong>9/10</strong>

          <h3>
            Okay...
            <br />
            you really know me.
          </h3>

          <span>♡ suspiciously well</span>

          <button>SEE YOUR ANSWERS →</button>
        </div>

        <div className="quizResultCopy">
          <p className="eyebrow">THE FINAL REVEAL</p>

          <h2>
            HOW DID
            <br />
            THEY DO?
          </h2>

          <p>
            At the end, they get their score and a personalized result
            message from you. Sweet, competitive, chaotic — you decide.
          </p>
        </div>
      </section>

      <section className="howWorks">
        <p className="eyebrow">HOW IT WORKS</p>

        <h2>
          ASK.
          <br />
          PLAY. REVEAL.
        </h2>

        <div className="steps">
          <article>
            <span>01</span>

            <h3>Create your questions</h3>

            <p>
              Write your own questions or start with WIVELI suggestions
              and personalize them.
            </p>
          </article>

          <article>
            <span>02</span>

            <h3>Choose the answers</h3>

            <p>
              Add possible answers, mark the correct one and include
              your own inside jokes.
            </p>
          </article>

          <article>
            <span>03</span>

            <h3>Send the challenge</h3>

            <p>
              Share their private quiz link and wait to see how well
              they actually know you.
            </p>
          </article>
        </div>
      </section>

      <section className="productCTA quizCTA">
        <p>THINK THEY KNOW YOU?</p>

        <h2>
          PUT THEM
          <br />
          TO THE TEST.
        </h2>

        <button className="primary">
          Create Your Quiz →
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

"use client";

import { useState } from "react";


export default function SignUp() {
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

function getLoginUrl() {
  if (typeof window === "undefined") {
    return "/login";
  }

  const params = new URLSearchParams(
    window.location.search
  );

  const nextUrl =
    params.get("next") || "/account";

  const safeNextUrl =
    nextUrl.startsWith("/") &&
    !nextUrl.startsWith("//") && !nextUrl.includes("\\")
      ? nextUrl
      : "/account";

  return `/login?next=${encodeURIComponent(
    "/onboarding?next=" + encodeURIComponent(safeNextUrl)
  )}`;
}

  async function signUp(e) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!email.trim() || !password) {
      setMessage(
        "Enter your email and password."
      );
      return;
    }

    if (password.length < 8) {
      setMessage(
        "Password must be at least 8 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not create account."
        );
      }

      if (data.authenticated) {
        const raw = new URLSearchParams(window.location.search).get("next") || "/account";
        const next = raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\") ? raw : "/account";
        window.location.assign(`/onboarding?next=${encodeURIComponent(next)}`);
        return;
      }
      setSuccess(true);

      setMessage(
        "Check your email to confirm your account. Then sign in to connect Telegram and receive gift updates ♡"
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signupPage">
      <header>
        <a className="logo" href="/">
          WI<span>♥</span>ELI
        </a>

        <a className="back" href="/">
          ← BACK HOME
        </a>
      </header>

      <section className="signupStage">
        <div className="copy">
          <p className="eyebrow">
            WELCOME TO WIVELI
          </p>

          <h1>
            MAKE SOMETHING
            <br />
            <em>MEANINGFUL.</em>
          </h1>

          <p className="lead">After registration, connect Telegram by opening the WIVELI bot and pressing Start. Gift updates will appear in your account and the bot. </p>
          <p className="lead">
            Create an account to make,
            save and share gifts made for
            the people who matter most.
          </p>
        </div>

        <div className="signupCard">
          {!success ? (
            <>
              <p className="mini">
                CREATE YOUR ACCOUNT
              </p>

              <h2>
                Nice to
                <br />
                meet you ♡
              </h2>

              <form onSubmit={signUp}>
                <label>
                  <span>EMAIL</span>

                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />
                </label>

                <label>
                  <span>PASSWORD</span>

                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />
                </label>

                {message && (
                  <p className="message">
                    {message}
                  </p>
                )}

                <button
                  disabled={loading}
                  type="submit"
                >
                  {loading
                    ? "CREATING ACCOUNT..."
                    : "CREATE ACCOUNT →"}
                </button>
              </form>

              <p className="loginText">
                Already have an account?{" "}
               <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    window.location.href =
      getLoginUrl();
  }}
>
                  Log in
                </a>
              </p>
            </>
          ) : (
            <div className="success">
              <div className="heart">
                ♡
              </div>

              <p className="mini">
                ONE LAST STEP
              </p>

              <h2>
                Check your
                <br />
                inbox.
              </h2>

              <p>{message}</p>

              <strong>{email}</strong>

              <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    window.location.href =
      getLoginUrl();
  }}
>
                GO TO LOG IN →
              </a>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        :global(html),
        :global(body) {
          margin: 0;
          overflow: hidden;
        }

        :global(*) {
          box-sizing: border-box;
        }

        .signupPage {
          --cream: #f7f0e8;
          --paper: #fffaf5;
          --pink: #ead3d2;
          --wine: #692f3c;
          --ink: #292322;

          min-height: 100svh;

          background:
            radial-gradient(
              circle at 75% 35%,
              rgba(199, 143, 145, 0.22),
              transparent 32%
            ),
            var(--cream);

          color: var(--ink);
          font-family: Arial, sans-serif;
        }

        header {
          height: 82px;
          padding: 0 5vw;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid
            rgba(41, 35, 34, 0.12);
        }

        .logo {
          color: var(--ink);
          text-decoration: none;

          font-family: Georgia, serif;
          font-weight: 700;
          font-size: 23px;
          letter-spacing: 0.08em;
        }

        .logo span {
          color: var(--wine);
        }

        .back {
          color: var(--ink);
          text-decoration: none;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .signupStage {
          height: calc(100svh - 82px);
          padding: 5vh 7vw;

          display: grid;
          grid-template-columns:
            1.1fr 0.9fr;

          align-items: center;
          gap: 8vw;
        }

        .copy {
          max-width: 760px;
        }

        .eyebrow,
        .mini {
          margin: 0 0 18px;

          color: var(--wine);

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          margin: 0;

          font-family: Georgia, serif;
          font-size:
            clamp(
              58px,
              7vw,
              115px
            );

          line-height: 0.84;
          letter-spacing: -0.055em;
          font-weight: 400;
        }

        h1 em {
          color: var(--wine);
          font-weight: 400;
        }

        .lead {
          max-width: 490px;
          margin: 30px 0 0;

          color: #6d615e;

          font-family: Georgia, serif;
          font-size: 17px;
          line-height: 1.55;
        }

        .signupCard {
          width: min(440px, 100%);
          padding: 42px;

          background:
            rgba(255, 250, 245, 0.92);

          border:
            1px solid
            rgba(41, 35, 34, 0.1);

          border-radius: 24px;

          box-shadow:
            0 35px 80px
            rgba(75, 45, 48, 0.12);
        }

        h2 {
          margin: 0 0 30px;

          font-family: Georgia, serif;
          font-size: 48px;
          line-height: 0.92;
          font-weight: 400;
          letter-spacing: -0.04em;
        }

        label {
          display: block;
          margin-top: 17px;
        }

        label span {
          display: block;
          margin-bottom: 7px;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        input {
          width: 100%;
          padding: 15px 16px;

          outline: none;

          border:
            1px solid
            rgba(41, 35, 34, 0.17);

          border-radius: 10px;

          background: var(--paper);
          color: var(--ink);

          font-size: 14px;
        }

        input:focus {
          border-color: var(--wine);
        }

        form button {
          width: 100%;
          margin-top: 22px;
          padding: 17px;

          border: 0;
          border-radius: 100px;

          background: var(--wine);
          color: white;

          cursor: pointer;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        form button:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .message {
          margin: 14px 0 0;

          color: var(--wine);

          font-size: 12px;
          line-height: 1.4;
        }

        .loginText {
          margin: 20px 0 0;

          text-align: center;
          color: #7b6c68;

          font-size: 11px;
        }

        .loginText a {
          color: var(--wine);
          font-weight: 800;
        }

        .success {
          text-align: center;
        }

        .heart {
          width: 72px;
          height: 72px;

          margin: 0 auto 22px;

          border-radius: 50%;

          display: grid;
          place-items: center;

          background: var(--pink);
          color: var(--wine);

          font-family: Georgia, serif;
          font-size: 30px;
        }

        .success h2 {
          margin-bottom: 20px;
        }

        .success p:not(.mini) {
          color: #71625f;

          font-family: Georgia, serif;
          line-height: 1.5;
        }

        .success strong {
          display: block;
          margin: 18px 0 25px;
          font-size: 13px;
        }

        .success a {
          display: inline-block;

          padding: 16px 24px;

          border-radius: 100px;

          background: var(--wine);
          color: white;

          text-decoration: none;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        @media (max-width: 800px) {
          header {
            height: 65px;
          }

          .signupStage {
            height:
              calc(100svh - 65px);

            grid-template-columns: 1fr;
            padding: 25px;
          }

          .copy {
            display: none;
          }

          .signupCard {
            margin: auto;
            padding: 30px 24px;
          }
        }
      `}</style>
    </main>
  );
}


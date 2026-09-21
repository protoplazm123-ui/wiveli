'use client';

import { useEffect, useMemo, useState } from 'react';
import { activeContent, safeLink } from './scenarios';
import s from './OpenWhen.module.css';

export function Flower({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 110 140" fill="none" aria-hidden="true">
      <path
        d="M56 69c-7 27 12 42 2 66M57 110c-24 0-34-14-34-14 21-2 29 7 34 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="55"
          cy="27"
          rx="12"
          ry="22"
          transform={`rotate(${angle} 55 48)`}
          fill="#fff8df"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="55" cy="48" r="12" fill="#e7b85c" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Polaroid({ photo, caption = 'a little piece of us', compact = false }) {
  return (
    <figure className={`${s.polaroid} ${compact ? s.compactPhoto : ''}`}>
      <span className={s.tape} aria-hidden="true" />

      {photo ? (
        <img src={photo.data} alt={caption} />
      ) : (
        <div className={s.paperArt} aria-hidden="true">
          <span className={s.sun} />
          <span className={s.hill} />
          <span className={s.hillTwo} />
          <span className={s.artNote}>
            somewhere
            <br />
            with you.
          </span>
        </div>
      )}

      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function Cover({ gift, preview = false }) {
  return (
    <div className={`${s.cover} ${preview ? s.coverPreview : ''}`}>
      <span className={s.coverSpine} aria-hidden="true" />

      <div className={s.coverTop}>
        <span>OPEN WHEN…</span>
        <span>VOL. 01 / JUST US</span>
      </div>

      <p className={s.coverFor}>a little book for {gift.to || 'you'}</p>

      <h2>
        THIS IS MY WAY
        <br />
        OF TAKING
        <br />
        <em>CARE OF YOU</em> <span>♡</span>
      </h2>

      <div className={s.coverCollage}>
        <Polaroid
          photo={gift.coverPhoto}
          caption="my favorite place is with you"
          compact
        />
        <span className={s.loveStamp}>
          MADE
          <br />
          WITH
          <br />
          LOVE ♡
        </span>
        <Flower className={s.coverFlower} />
        <span className={s.scribble}>
          for the good days,
          <br />
          and the not-so-good ones.
        </span>
      </div>

      <p className={s.coverSubtitle}>
        Open it whenever you need
        <br />
        a little bit of me.
      </p>

      <p className={s.signature}>with love, {gift.from || 'me'} x</p>

      {!preview && (
        <a className={s.coverOpen} href="#little-pages">
          OPEN YOUR JOURNAL <span>↗</span>
        </a>
      )}
    </div>
  );
}

function SurpriseContent({ entry, gift }) {
  const content = activeContent(entry);
  const link = safeLink(content.link);

  return (
    <div className={s.surpriseCard}>
      <span className={s.surpriseEyebrow}>A LITTLE SOMETHING FOR YOU</span>

      <h3>{entry.title}</h3>

      <p className={s.letterText}>{content.message}</p>

      {Object.entries(content.details || {})
        .filter(([, value]) => String(value || '').trim())
        .length > 0 && (
        <dl className={s.planDetails}>
          {Object.entries(content.details || {})
            .filter(([, value]) => String(value || '').trim())
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
      )}

      {content.audio && (
        <div className={s.mediaBlock}>
          <p>A little voice note for you ♡</p>
          <audio controls preload="none" src={content.audio.data}>
            Your browser does not support audio.
          </audio>
        </div>
      )}

      {link && (
        <a
          className={s.textLink}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          One more little thing ↗
        </a>
      )}

      {content.attachment && (
        <div className={s.mediaBlock}>
          {content.attachment.type?.startsWith('image/') && (
            <img
              className={s.ticketImage}
              src={content.attachment.data}
              alt="Your attached ticket, QR code, or surprise"
            />
          )}

          <a
            className={s.textLink}
            href={content.attachment.data}
            download={content.attachment.name}
          >
            Download {content.attachment.name} ↓
          </a>
        </div>
      )}

      <p className={s.signature}>
        always in your corner,
        <br />
        {gift.from || 'me'} ♡
      </p>
    </div>
  );
}

function Envelope({ entry, gift, isOpen, onToggle }) {
  return (
    <div className={`${s.bookEnvelope} ${isOpen ? s.bookEnvelopeOpen : ''}`}>
      <button
        type="button"
        className={s.envelopeButton}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Close' : 'Open'} surprise: ${entry.when}`}
      >
        <span className={s.bookEnvelopeBack} aria-hidden="true" />

        <span className={s.bookEnvelopeLetter} aria-hidden="true">
          <span>A little surprise</span>
          <small>for you ♡</small>
        </span>

        <span className={s.bookEnvelopeFront} aria-hidden="true" />

        <span className={s.bookEnvelopeFlap} aria-hidden="true" />

        <span className={s.bookSeal} aria-hidden="true">
          ♡
        </span>
      </button>

      <p className={s.envelopeInstruction}>
        {isOpen ? 'your surprise is open ♡' : 'tap the envelope to reveal your surprise'}
      </p>

      <div className={s.surpriseDrawer} aria-hidden={!isOpen}>
        {isOpen && <SurpriseContent entry={entry} gift={gift} />}
      </div>
    </div>
  );
}

function JournalSpread({ entry, gift, index, total, open, onToggle }) {
  return (
    <div className={s.bookSpread}>
      <section className={`${s.bookPage} ${s.bookPageLeft}`}>
        <div className={s.bookPageTop}>
          <span>OPEN WHEN…</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>

        <h2 className={s.bookWhen}>{entry.when}</h2>

        <span className={s.bookHeart} aria-hidden="true">
          ♡
        </span>

        <div className={s.leftPageStory}>
          <Polaroid
            photo={entry.photo || gift.coverPhoto}
            caption={entry.caption || 'same sky, different place ♡'}
          />

          <div className={s.pageMessage}>
            <p>
              {entry.note ||
                `Even when we're apart, I'm still right here. In your thoughts, in the little things, and in every moment that feels a bit quieter without me.`}
            </p>

            <span>
              you’re always
              <br />
              on my mind ♡
            </span>
          </div>
        </div>

        <span className={s.pageNumber}>{index * 2 + 2}</span>
      </section>

      <section className={`${s.bookPage} ${s.bookPageRight}`}>
        <p className={s.handQuote}>
          “A little love,
          <br />
          saved for exactly
          <br />
          when you need it.”
          <span>♡</span>
        </p>

        <Envelope
          entry={entry}
          gift={gift}
          isOpen={open}
          onToggle={onToggle}
        />

        <p className={s.youGotThis}>YOU GOT THIS</p>

        <span className={s.pageNumber}>{index * 2 + 3}</span>
      </section>

      <span className={s.bookGutter} aria-hidden="true" />
      <span className={s.bookPagesLeft} aria-hidden="true" />
      <span className={s.bookPagesRight} aria-hidden="true" />
    </div>
  );
}

export default function Journal({ gift }) {
  const entries = useMemo(
    () => (gift.entries || []).filter((entry) => entry.selected),
    [gift.entries]
  );

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('next');
  const [turning, setTurning] = useState(false);
  const [openEnvelope, setOpenEnvelope] = useState(null);

  const entry = entries[current];

  useEffect(() => {
    setOpenEnvelope(null);
  }, [current]);

  function goTo(nextIndex) {
    if (
      turning ||
      nextIndex < 0 ||
      nextIndex >= entries.length ||
      nextIndex === current
    ) {
      return;
    }

    setDirection(nextIndex > current ? 'next' : 'prev');
    setTurning(true);
    setOpenEnvelope(null);

    window.setTimeout(() => {
      setCurrent(nextIndex);

      window.setTimeout(() => {
        setTurning(false);
      }, 60);
    }, 330);
  }

  function nextPage() {
    goTo(current + 1);
  }

  function previousPage() {
    goTo(current - 1);
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'ArrowRight') nextPage();
      if (event.key === 'ArrowLeft') previousPage();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!entries.length) {
    return (
      <main className={`${s.root} ${s.reader}`}>
        <div className={s.emptyState}>
          <h1>Your journal is waiting ♡</h1>
          <p>Add at least one Open When surprise to begin.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`${s.root} ${s.reader}`}>
      <h1 className={s.srOnly}>
        A little book of care for {gift.to || 'you'}
      </h1>

      <header className={s.diaryHeader}>
        <a href="/" className={s.diaryLogo}>
          WIVELI
        </a>

        <p>
          Open When
          <span>A little love for every version of you.</span>
        </p>

        <div className={s.diaryHeaderRight}>
          <span>for {gift.to || 'you'} ♡</span>
        </div>
      </header>

      <div className={s.diaryScene} id="little-pages">
        <aside className={s.envelopeIndex}>
          <div className={s.indexIntro}>
            <strong>Open When</strong>
            <span>A little love for every version of you.</span>
          </div>

          <nav aria-label="Open When pages">
            {entries.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === current ? s.indexEnvelopeActive : ''}
                onClick={() => goTo(index)}
              >
                <span>{item.when}</span>
                <b aria-hidden="true">{item.symbol || '♡'}</b>
              </button>
            ))}
          </nav>

          <p className={s.indexScribble}>
            different moments,
            <br />
            same love ♡
          </p>
        </aside>

        <section className={s.bookStage}>
          <button
            type="button"
            className={`${s.pageArrow} ${s.pageArrowLeft}`}
            onClick={previousPage}
            disabled={current === 0 || turning}
            aria-label="Previous page"
          >
            ‹
          </button>

          <div
            className={`${s.bookPerspective} ${
              turning
                ? direction === 'next'
                  ? s.turningNext
                  : s.turningPrev
                : ''
            }`}
          >
            <JournalSpread
              entry={entry}
              gift={gift}
              index={current}
              total={entries.length}
              open={openEnvelope === entry.id}
              onToggle={() =>
                setOpenEnvelope((value) =>
                  value === entry.id ? null : entry.id
                )
              }
            />

            {turning && (
              <div
                className={`${s.turningSheet} ${
                  direction === 'next' ? s.turnSheetNext : s.turnSheetPrev
                }`}
                aria-hidden="true"
              >
                <div className={s.turnSheetFront} />
                <div className={s.turnSheetBack} />
              </div>
            )}
          </div>

          <button
            type="button"
            className={`${s.pageArrow} ${s.pageArrowRight}`}
            onClick={nextPage}
            disabled={current === entries.length - 1 || turning}
            aria-label="Next page"
          >
            ›
          </button>

          <div className={s.bookProgress}>
            {entries.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === current ? s.progressActive : ''}
                onClick={() => goTo(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </section>
      </div>

      <footer className={s.diaryFooter}>
        <span>made with WIVELI ♡</span>
        <span>
          {String(current + 1).padStart(2, '0')} /{' '}
          {String(entries.length).padStart(2, '0')}
        </span>
      </footer>
    </main>
  );
}
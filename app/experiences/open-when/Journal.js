'use client';

import { useMemo, useRef, useState } from 'react';
import { activeContent, safeLink } from './scenarios';
import s from './Journal.module.css';

const ASSET = '/assets/open-when/diary-kit';

function PhotoMemory({ entry, gift }) {
  const photo = entry.photo || gift.coverPhoto;

  return (
    <div className={s.memory}>
      <div className={s.polaroid}>
        {photo?.data && (
          <img
            className={s.photo}
            src={photo.data}
            alt="Our memory"
          />
        )}

        <img
          className={s.polaroidFrame}
          src={`${ASSET}/download-2.png`}
          alt=""
          draggable="false"
        />
      </div>

      <p className={s.caption}>
        {entry.caption || 'A tiny way to be a little closer. ♡'}
      </p>

      <div className={s.note}>
        <p>
          {entry.note ||
            `For the moments when you need a little reminder that I'm always here.`}
        </p>

        <small>
          with love,
          <br />
          {gift.from || 'me'} ♡
        </small>
      </div>

      <img
        className={s.flowers}
        src={`${ASSET}/download-4.png`}
        alt=""
        draggable="false"
      />

      <span className={s.tinyWords}>
        SOMEWHERE
        <br />
        WITH YOU ♡
      </span>
    </div>
  );
}

function Letter({ entry, gift }) {
  const content = activeContent(entry);
  const link = safeLink(content.link);

  const details = Object.entries(content.details || {}).filter(
    ([, value]) => String(value || '').trim()
  );

  return (
    <div className={s.letter}>
      <p className={s.eyebrow}>JUST FOR YOU ♡</p>

      <h3>{entry.title || 'A little something for you'}</h3>

      {content.message && (
        <p className={s.letterText}>{content.message}</p>
      )}

      {details.length > 0 && (
        <div>
          {details.map(([label, value]) => (
            <p className={s.letterText} key={label}>
              <strong>{label}: </strong>
              {value}
            </p>
          ))}
        </div>
      )}

      {content.audio?.data && (
        <div>
          <p className={s.letterText}>
            press play when you need me ♡
          </p>

          <audio
            controls
            preload="none"
            src={content.audio.data}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {link && (
        <p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            OPEN THIS LITTLE THING ↗
          </a>
        </p>
      )}

      {content.attachment?.data && (
        <div>
          {content.attachment.type?.startsWith('image/') && (
            <img
              src={content.attachment.data}
              alt="Attached surprise"
              style={{
                display: 'block',
                width: '100%',
                maxHeight: 220,
                objectFit: 'contain',
                marginBottom: 10,
              }}
            />
          )}

          <a
            href={content.attachment.data}
            download={content.attachment.name || 'surprise'}
          >
            OPEN YOUR SURPRISE ↓
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

function SurprisePage({ entry, gift }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className={s.surprisePage}>
      <p className={s.eyebrow}>OPEN WHEN…</p>

      <h2 className={s.title}>
        you
        <em>{entry.when}</em>
      </h2>

      {!opened ? (
        <>
          <button
            type="button"
            className={s.envelopeButton}
            onClick={() => setOpened(true)}
            aria-label={`Open when ${entry.when}`}
          >
            <img
              className={s.envelope}
              src={`${ASSET}/download-1.png`}
              alt=""
              draggable="false"
            />
          </button>

          <p className={s.envelopeHint}>
            tap the envelope ♡
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            className={s.envelopeButton}
            onClick={() => setOpened(false)}
            aria-label="Close letter"
          >
            <img
              className={s.envelope}
              src={`${ASSET}/download.png`}
              alt=""
              draggable="false"
            />
          </button>

          <Letter entry={entry} gift={gift} />
        </>
      )}

      <img
        className={s.ribbon}
        src={`${ASSET}/download-5.png`}
        alt=""
        draggable="false"
      />
    </div>
  );
}

/*
 * IMPORTANT:
 * OpenWhenBuilder imports this named export.
 */
export function Cover({ gift, onOpen = () => {} }) {
  return (
    <div
      style={{
        width: 'min(82vw, 430px)',
        margin: 'auto',
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          padding: 0,
          border: 0,
          background: 'transparent',
          cursor: 'pointer',
          filter: 'drop-shadow(0 28px 24px rgba(26,10,7,.4))',
        }}
      >
        <img
          src={`${ASSET}/journal-cover.png`}
          alt="Open When journal"
          draggable="false"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: '18% 19% 18% 16%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f1dfc6',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <small
            style={{
              marginBottom: 10,
              fontSize: 7,
              fontWeight: 800,
              letterSpacing: '.2em',
            }}
          >
            WIVELI
          </small>

          <strong
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(31px, 10vw, 50px)',
              fontWeight: 400,
              lineHeight: '.86',
            }}
          >
            OPEN
            <br />
            WHEN…
          </strong>

          <span
            style={{
              margin: '10px 0 3px',
              fontFamily: "'Care Hand', cursive",
              fontSize: 30,
              color: '#e6b6b3',
            }}
          >
            ♡
          </span>

          <em
            style={{
              fontFamily: "'Care Hand', cursive",
              fontSize: 'clamp(18px, 5vw, 27px)',
              fontStyle: 'normal',
            }}
          >
            for {gift?.to || 'you'}
          </em>
        </div>
      </button>
    </div>
  );
}

function Reader({ gift, entries, onClose }) {
  const [page, setPage] = useState(0);
  const touchStart = useRef(null);

  const entry = entries[page];

  function previous() {
    setPage((value) => Math.max(0, value - 1));
  }

  function next() {
    setPage((value) =>
      Math.min(entries.length - 1, value + 1)
    );
  }

  function touchBegin(event) {
    touchStart.current =
      event.touches?.[0]?.clientX ?? null;
  }

  function touchEnd(event) {
    if (touchStart.current === null) return;

    const end =
      event.changedTouches?.[0]?.clientX ??
      touchStart.current;

    const difference = end - touchStart.current;

    touchStart.current = null;

    if (Math.abs(difference) < 55) return;

    if (difference < 0) next();
    else previous();
  }

  return (
    <>
      <header className={s.top}>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 0,
            padding: 0,
            color: 'inherit',
            background: 'transparent',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '.15em',
            cursor: 'pointer',
          }}
        >
          CLOSE JOURNAL
        </button>

        <span className={s.counter}>
          {String(page + 1).padStart(2, '0')} /{' '}
          {String(entries.length).padStart(2, '0')}
        </span>
      </header>

      <div
        className={s.stage}
        onTouchStart={touchBegin}
        onTouchEnd={touchEnd}
      >
        <img
          className={s.book}
          src={`${ASSET}/journal-open.png`}
          alt=""
          draggable="false"
        />

        <section className={s.leftPage}>
          <PhotoMemory
            key={`memory-${page}`}
            entry={entry}
            gift={gift}
          />
        </section>

        <section className={s.rightPage}>
          <SurprisePage
            key={`surprise-${page}`}
            entry={entry}
            gift={gift}
          />
        </section>
      </div>

      <nav className={s.navigation}>
        <button
          type="button"
          className={s.navButton}
          onClick={previous}
          disabled={page === 0}
          aria-label="Previous surprise"
        >
          ←
        </button>

        <div className={s.pageDots}>
          {entries.map((item, index) => (
            <span
              key={item.id || index}
              className={`${s.dot} ${
                index === page ? s.dotActive : ''
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          className={s.navButton}
          onClick={next}
          disabled={page === entries.length - 1}
          aria-label="Next surprise"
        >
          →
        </button>
      </nav>
    </>
  );
}

export default function Journal({ gift }) {
  const entries = useMemo(
    () =>
      (gift?.entries || []).filter(
        (entry) => entry.selected
      ),
    [gift?.entries]
  );

  const [opened, setOpened] = useState(false);

  if (!entries.length) {
    return (
      <main className={s.root}>
        <div
          style={{
            minHeight: '100svh',
            display: 'grid',
            placeContent: 'center',
            padding: 30,
            color: '#fff4e7',
            textAlign: 'center',
          }}
        >
          <h1>Your little journal is waiting. ♡</h1>
          <p>Add at least one Open When surprise to begin.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={s.root}>
      {!opened ? (
        <>
          <header className={s.top}>
            <strong className={s.brand}>WIVELI</strong>
            <span className={s.counter}>OPEN WHEN…</span>
          </header>

          <div
            style={{
              minHeight: 'calc(100svh - 58px)',
              display: 'grid',
              placeItems: 'center',
              padding: '30px 15px 50px',
            }}
          >
            <Cover
              gift={gift}
              onOpen={() => setOpened(true)}
            />
          </div>
        </>
      ) : (
        <Reader
          gift={gift}
          entries={entries}
          onClose={() => setOpened(false)}
        />
      )}
    </main>
  );
}

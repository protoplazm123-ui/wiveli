'use client';

import { useMemo, useRef, useState } from 'react';
import { activeContent, safeLink } from './scenarios';
import s from './OpenWhen.module.css';

const ASSET = '/assets/open-when/diary-kit';

function SurpriseContent({ entry, gift }) {
  const content = activeContent(entry);
  const link = safeLink(content.link);

  const details = Object.entries(content.details || {}).filter(
    ([, value]) => String(value || '').trim()
  );

  return (
    <div className={s.newSurprise}>
      <p className={s.newEyebrow}>A LITTLE SURPRISE ♡</p>

      <h3>{entry.title}</h3>

      {content.message && (
        <p className={s.newSurpriseMessage}>{content.message}</p>
      )}

      {details.length > 0 && (
        <dl className={s.newDetails}>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {content.audio?.data && (
        <div className={s.newMedia}>
          <span>press play when you need me ♡</span>
          <audio controls preload="none" src={content.audio.data}>
            Your browser does not support audio.
          </audio>
        </div>
      )}

      {link && (
        <a
          className={s.newLink}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          OPEN THIS LITTLE THING ↗
        </a>
      )}

      {content.attachment?.data && (
        <div className={s.newMedia}>
          {content.attachment.type?.startsWith('image/') && (
            <img
              className={s.newAttachment}
              src={content.attachment.data}
              alt="Attached surprise"
            />
          )}

          <a
            className={s.newLink}
            href={content.attachment.data}
            download={content.attachment.name || 'surprise'}
          >
            OPEN YOUR SURPRISE ↓
          </a>
        </div>
      )}

      <p className={s.newSignature}>
        always in your corner,
        <br />
        {gift.from || 'me'} ♡
      </p>
    </div>
  );
}

function Polaroid({ photo, caption }) {
  return (
    <figure className={s.newPolaroid}>
      <div className={s.newPhotoWindow}>
        {photo?.data ? (
          <img src={photo.data} alt={caption || 'Our memory'} />
        ) : (
          <div className={s.newPhotoPlaceholder}>
            <span>♡</span>
            <small>our little memory</small>
          </div>
        )}
      </div>

      <figcaption>{caption || 'You. Always. ♡'}</figcaption>
    </figure>
  );
}

function Envelope({ entry, gift }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${s.newEnvelopeArea} ${open ? s.newEnvelopeIsOpen : ''}`}>
      <button
        type="button"
        className={s.newEnvelopeButton}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <img
          className={s.newEnvelopeImage}
          src={`${ASSET}/${open ? 'envelope-open.png' : 'envelope-closed.png'}`}
          alt=""
          draggable="false"
        />

        {!open && (
          <span className={s.newEnvelopeLabel}>
            <small>OPEN WHEN…</small>
            <strong>{entry.when}</strong>
          </span>
        )}
      </button>

      <p className={s.newEnvelopeHint}>
        {open ? 'tap again to close ↑' : 'tap the envelope ♡'}
      </p>

      {open && (
        <div className={s.newSurpriseReveal}>
          <SurpriseContent entry={entry} gift={gift} />
        </div>
      )}
    </div>
  );
}

/*
 * Keep this export.
 * OpenWhenBuilder already imports Cover.
 */
export function Cover({ gift, onOpen = () => {} }) {
  return (
    <div className={s.newCoverWrap}>
      <button type="button" className={s.newCoverButton} onClick={onOpen}>
        <img
          src={`${ASSET}/journal-cover.png`}
          alt="Open When journal"
          className={s.newCoverImage}
          draggable="false"
        />

        <div className={s.newCoverCopy}>
          <small>WIVELI</small>

          <strong>
            OPEN
            <br />
            WHEN…
          </strong>

          <span>♡</span>

          <em>for {gift?.to || 'you'}</em>
        </div>
      </button>
    </div>
  );
}

function IntroPage({ gift }) {
  return (
    <div className={s.newIntroPage}>
      <p className={s.newEyebrow}>THIS LITTLE BOOK BELONGS TO</p>

      <h2>{gift.to || 'you'} ♡</h2>

      <div className={s.newIntroPaper}>
        <span className={s.newTape} />

        <p>
          Open these pages whenever you need a little comfort, a smile,
          a reminder, or simply a little bit of me.
        </p>
      </div>

      <p className={s.newHandNote}>
        made with way too much love
        <br />
        {gift.from || 'me'} ♡
      </p>
    </div>
  );
}

function MemoryPage({ entry, gift, index }) {
  return (
    <div className={s.newMemoryPage}>
      <div className={s.newPageTop}>
        <span>WIVELI</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h2>
        Open when
        <br />
        <em>{entry.when}</em>
      </h2>

      <div className={s.newScrapbook}>
        <Polaroid
          photo={entry.photo || gift.coverPhoto}
          caption={entry.caption || 'You. Always. ♡'}
        />

        <div className={s.newPersonalPaper}>
          <span className={s.newTape} />

          <p>
            {entry.note ||
              `Even when we're apart, you're still so close to my heart.`}
          </p>

          <small>with love, {gift.from || 'me'} ♡</small>
        </div>

        <img
          src={`${ASSET}/flowers.png`}
          className={s.newFlowers}
          alt=""
          draggable="false"
        />

        <span className={s.newTinyWords}>
          SAME SOULS
          <br />
          DIFFERENT PLACES ♡
        </span>
      </div>

      <Envelope entry={entry} gift={gift} />
    </div>
  );
}

function FinalPage({ gift }) {
  return (
    <div className={s.newFinalPage}>
      <span className={s.newFinalHeart}>♡</span>

      <p className={s.newEyebrow}>ONE LAST LITTLE NOTE</p>

      <h2>
        And when you
        <br />
        reach the end…
      </h2>

      <div className={s.newFinalPaper}>
        <p>
          Remember there will always be another page for us to fill.
        </p>
      </div>

      <em>love, {gift.from || 'me'} x</em>
    </div>
  );
}

function LightweightBook({ gift, entries, onClose }) {
  const pages = useMemo(
    () => [
      { type: 'intro' },
      ...entries.map((entry, index) => ({
        type: 'memory',
        entry,
        index,
      })),
      { type: 'final' },
    ],
    [entries]
  );

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState('next');
  const touchStart = useRef(null);

  const current = pages[page];

  function goNext() {
    if (page >= pages.length - 1) return;
    setDirection('next');
    setPage((value) => value + 1);
  }

  function goPrevious() {
    if (page <= 0) return;
    setDirection('previous');
    setPage((value) => value - 1);
  }

  function handleTouchStart(event) {
    touchStart.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event) {
    if (touchStart.current === null) return;

    const end = event.changedTouches[0]?.clientX ?? touchStart.current;
    const distance = end - touchStart.current;

    touchStart.current = null;

    if (Math.abs(distance) < 55) return;

    if (distance < 0) goNext();
    else goPrevious();
  }

  return (
    <section className={s.newReader}>
      <div className={s.newReaderTop}>
        <button type="button" onClick={onClose}>
          CLOSE JOURNAL
        </button>

        <span>
          {String(page + 1).padStart(2, '0')} /{' '}
          {String(pages.length).padStart(2, '0')}
        </span>
      </div>

      <div
        className={s.newBookStage}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={`${ASSET}/journal-open.png`}
          className={s.newOpenJournal}
          alt=""
          draggable="false"
        />

        <div
          key={page}
          className={`${s.newPageContent} ${
            direction === 'next' ? s.newPageNext : s.newPagePrevious
          }`}
        >
          {current.type === 'intro' && <IntroPage gift={gift} />}

          {current.type === 'memory' && (
            <MemoryPage
              entry={current.entry}
              gift={gift}
              index={current.index}
            />
          )}

          {current.type === 'final' && <FinalPage gift={gift} />}
        </div>
      </div>

      <nav className={s.newControls}>
        <button
          type="button"
          onClick={goPrevious}
          disabled={page === 0}
          aria-label="Previous page"
        >
          ←
        </button>

        <div className={s.newProgress}>
          <span
            style={{
              width: `${((page + 1) / pages.length) * 100}%`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={page === pages.length - 1}
          aria-label="Next page"
        >
          →
        </button>
      </nav>

      <p className={s.newSwipeHint}>swipe or use the arrows ♡</p>
    </section>
  );
}

export default function Journal({ gift }) {
  const entries = useMemo(
    () => (gift?.entries || []).filter((entry) => entry.selected),
    [gift?.entries]
  );

  const [opened, setOpened] = useState(false);

  if (!entries.length) {
    return (
      <main className={s.newDiaryRoot}>
        <div className={s.newEmpty}>
          <span>♡</span>
          <h1>Your little journal is waiting.</h1>
          <p>Add at least one Open When surprise to begin.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={s.newDiaryRoot}>
      <div className={s.newAmbient} aria-hidden="true">
        <span className={s.newGlow} />
        <span className={s.newFabric} />
      </div>

      <header className={s.newDiaryHeader}>
        <strong>WIVELI</strong>
        <small>OPEN WHEN…</small>
      </header>

      {!opened ? (
        <div className={s.newCoverScene}>
          <Cover gift={gift} onOpen={() => setOpened(true)} />
          <p>tap the journal to open it ♡</p>
        </div>
      ) : (
        <LightweightBook
          gift={gift}
          entries={entries}
          onClose={() => setOpened(false)}
        />
      )}
    </main>
  );
}

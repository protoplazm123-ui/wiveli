'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { activeContent, safeLink } from './scenarios';
import s from './OpenWhen.module.css';

/* =========================================================
   SMALL SCRAPBOOK ELEMENTS
   ========================================================= */

function Polaroid({ photo, caption, rotate = 'left' }) {
  return (
    <figure
      className={`${s.flipPolaroid} ${
        rotate === 'right' ? s.flipPolaroidRight : s.flipPolaroidLeft
      }`}
    >
      <span className={s.flipTape} />

      {photo?.data ? (
        <img src={photo.data} alt={caption || 'A little memory'} />
      ) : (
        <div className={s.flipPhotoPlaceholder}>
          <span>♡</span>
          <small>our little memory</small>
        </div>
      )}

      <figcaption>{caption || 'a little piece of us ♡'}</figcaption>
    </figure>
  );
}

function SurpriseContent({ entry, gift }) {
  const content = activeContent(entry);
  const link = safeLink(content.link);

  const details = Object.entries(content.details || {}).filter(
    ([, value]) => String(value || '').trim()
  );

  return (
    <div className={s.flipSurpriseCard}>
      <span className={s.flipSurpriseTape} />

      <p className={s.flipEyebrow}>A LITTLE SURPRISE ♡</p>

      <h3>{entry.title}</h3>

      {content.message && (
        <p className={s.flipSurpriseMessage}>{content.message}</p>
      )}

      {details.length > 0 && (
        <dl className={s.flipDetails}>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {content.audio?.data && (
        <div className={s.flipMedia}>
          <span>press play when you need me ♡</span>
          <audio controls preload="none" src={content.audio.data}>
            Your browser does not support audio.
          </audio>
        </div>
      )}

      {link && (
        <a
          className={s.flipLink}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          OPEN THIS LITTLE THING ↗
        </a>
      )}

      {content.attachment?.data && (
        <div className={s.flipMedia}>
          {content.attachment.type?.startsWith('image/') && (
            <img
              className={s.flipAttachment}
              src={content.attachment.data}
              alt="Attached surprise"
            />
          )}

          <a
            className={s.flipLink}
            href={content.attachment.data}
            download={content.attachment.name || 'surprise'}
          >
            OPEN YOUR SURPRISE ↓
          </a>
        </div>
      )}

      <p className={s.flipSignature}>
        always in your corner,
        <br />
        {gift.from || 'me'} ♡
      </p>
    </div>
  );
}

function Envelope({ entry, gift }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${s.flipEnvelopeWrap} ${open ? s.flipEnvelopeOpen : ''}`}>
      <button
        type="button"
        className={s.flipEnvelope}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        aria-expanded={open}
      >
        <span className={s.flipEnvelopeBack} />

        <span className={s.flipEnvelopeLetter}>
          <small>something</small>
          <strong>just for you ♡</strong>
        </span>

        <span className={s.flipEnvelopeFront} />
        <span className={s.flipEnvelopeFlap} />

        <span className={s.flipWax}>♡</span>

        <span className={s.flipEnvelopeText}>
          OPEN WHEN…
          <strong>{entry.when}</strong>
        </span>
      </button>

      <p className={s.flipTap}>
        {open ? 'tap to close ↑' : 'tap the envelope ♡'}
      </p>

      {open && (
        <div
          className={s.flipSurpriseReveal}
          onClick={(event) => event.stopPropagation()}
        >
          <SurpriseContent entry={entry} gift={gift} />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COVER
   Keep exported because OpenWhenBuilder already imports Cover.
   ========================================================= */

export function Cover({ gift, onOpen = () => {} }) {
  return (
    <div className={s.flipCoverPreview}>
      <button
        type="button"
        className={s.flipPhysicalCover}
        onClick={onOpen}
      >
        <span className={s.flipCoverSpine} />

        <span className={s.flipCoverInner}>
          <small>WIVELI PRESENTS</small>

          <strong>
            OPEN
            <br />
            WHEN…
          </strong>

          <span className={s.flipCoverHeart}>♡</span>

          <em>
            a little book for
            <br />
            {gift?.to || 'you'}
          </em>

          <b>
            THIS IS MY WAY
            <br />
            OF TAKING CARE OF YOU
          </b>

          <i>with love, {gift?.from || 'me'} x</i>
        </span>
      </button>
    </div>
  );
}

/* =========================================================
   ACTUAL BOOK PAGES
   ========================================================= */

function IntroPage({ gift }) {
  return (
    <div className={s.flipIntro}>
      <span className={s.flipIntroHeart}>♡</span>

      <p>THIS LITTLE BOOK BELONGS TO</p>

      <h2>{gift.to || 'you'}</h2>

      <div className={s.flipIntroNote}>
        <span className={s.flipTape} />
        <p>
          Open these pages whenever you need a little comfort,
          a smile, a reminder, or simply a little bit of me.
        </p>
      </div>

      <span className={s.flipHandNote}>
        made with way too much love
        <br />
        {gift.from || 'me'} ♡
      </span>
    </div>
  );
}

function MemoryPage({ entry, gift, index }) {
  const layouts = [
    s.flipLayoutOne,
    s.flipLayoutTwo,
    s.flipLayoutThree,
    s.flipLayoutFour,
  ];

  return (
    <div className={`${s.flipMemoryPage} ${layouts[index % layouts.length]}`}>
      <div className={s.flipPageHeader}>
        <span>OPEN WHEN…</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h2>{entry.when}</h2>

      <div className={s.flipMemoryCollage}>
        <Polaroid
          photo={entry.photo || gift.coverPhoto}
          caption={entry.caption || 'one of my favorite moments ♡'}
          rotate={index % 2 ? 'right' : 'left'}
        />

        <div className={s.flipPersonalNote}>
          <span className={s.flipNoteTape} />
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

        <span className={s.flipDoodle}>
          {index % 3 === 0 ? '♡' : index % 3 === 1 ? '✦ ♡ ✧' : '↘ ♡'}
        </span>
      </div>

      <Envelope entry={entry} gift={gift} />
    </div>
  );
}

function FinalPage({ gift }) {
  return (
    <div className={s.flipFinalPage}>
      <span>♡</span>

      <h2>
        AND WHEN
        <br />
        YOU REACH
        <br />
        THE END…
      </h2>

      <p>
        remember there will always be another page for us to fill.
      </p>

      <em>love, {gift.from || 'me'} x</em>
    </div>
  );
}

/* =========================================================
   PAGE FLIP BOOK
   ========================================================= */

function RealBook({ gift, entries, onClose }) {
  const bookRef = useRef(null);
  const pageFlipRef = useRef(null);

  const [page, setPage] = useState(0);
  const totalPages = entries.length + 2;

  useEffect(() => {
    let cancelled = false;

    async function createBook() {
      if (!bookRef.current) return;

      const { PageFlip } = await import('page-flip');

      if (cancelled || !bookRef.current) return;

      const width = window.innerWidth <= 600 ? 330 : 430;
      const height = window.innerWidth <= 600 ? 540 : 620;

      const pageFlip = new PageFlip(bookRef.current, {
        width,
        height,

        size: 'stretch',

        minWidth: 280,
        maxWidth: 480,

        minHeight: 460,
        maxHeight: 700,

        maxShadowOpacity: 0.45,

        showCover: true,

        mobileScrollSupport: false,

        usePortrait: true,

        flippingTime: 900,

        drawShadow: true,

        autoSize: true,

        clickEventForward: true,

        useMouseEvents: true,

        swipeDistance: 25,

        showPageCorners: true,

        disableFlipByClick: false,
      });

      const pages = bookRef.current.querySelectorAll('[data-page]');

      pageFlip.loadFromHTML(pages);

      pageFlip.on('flip', (event) => {
        setPage(event.data);
      });

      pageFlipRef.current = pageFlip;
    }

    createBook();

    return () => {
      cancelled = true;

      try {
        pageFlipRef.current?.destroy();
      } catch {
        // PageFlip may already be destroyed during hot reload.
      }

      pageFlipRef.current = null;
    };
  }, []);

  function previous() {
    pageFlipRef.current?.flipPrev();
  }

  function next() {
    pageFlipRef.current?.flipNext();
  }

  return (
    <section className={s.realBookScene}>
      <div className={s.realBookTop}>
        <button type="button" onClick={onClose}>
          CLOSE JOURNAL
        </button>

        <span>
          {String(page + 1).padStart(2, '0')} /{' '}
          {String(totalPages).padStart(2, '0')}
        </span>
      </div>

      <div className={s.realBookStage}>
        <div ref={bookRef} className={s.realBook}>
          <div
            data-page
            data-density="hard"
            className={`${s.realBookPage} ${s.realBookCoverPage}`}
          >
            <div className={s.realInsideCover}>
              <span>WIVELI</span>

              <h2>
                OPEN
                <br />
                WHEN…
              </h2>

              <p>
                for {gift.to || 'you'} ♡
              </p>

              <small>turn the page →</small>
            </div>
          </div>

          <div data-page className={s.realBookPage}>
            <IntroPage gift={gift} />
          </div>

          {entries.map((entry, index) => (
            <div
              data-page
              className={s.realBookPage}
              key={entry.id || `${entry.when}-${index}`}
            >
              <MemoryPage
                entry={entry}
                gift={gift}
                index={index}
              />
            </div>
          ))}

          <div
            data-page
            data-density="hard"
            className={`${s.realBookPage} ${s.realBookLastPage}`}
          >
            <FinalPage gift={gift} />
          </div>
        </div>
      </div>

      <nav className={s.realBookControls}>
        <button
          type="button"
          onClick={previous}
          disabled={page === 0}
          aria-label="Previous page"
        >
          ←
        </button>

        <div className={s.realBookProgress}>
          <span
            style={{
              width: `${((page + 1) / totalPages) * 100}%`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={next}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
        >
          →
        </button>
      </nav>

      <p className={s.realBookHint}>
        swipe the page with your finger ♡
      </p>
    </section>
  );
}

/* =========================================================
   MAIN READER
   ========================================================= */

export default function Journal({ gift }) {
  const entries = useMemo(
    () => (gift?.entries || []).filter((entry) => entry.selected),
    [gift?.entries]
  );

  const [opened, setOpened] = useState(false);

  if (!entries.length) {
    return (
      <main className={s.realDiaryRoot}>
        <div className={s.realDiaryEmpty}>
          <span>♡</span>
          <h1>Your little journal is waiting.</h1>
          <p>Add at least one Open When surprise to begin.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={s.realDiaryRoot}>
      <div className={s.realDeskDecor} aria-hidden="true">
        <div className={s.realFabric} />
        <div className={s.realCoffee}>
          <span>♡</span>
        </div>

        <div className={s.realLoosePolaroid}>
          <span>♡</span>
        </div>

        <div className={s.realPressedFlower}>✿</div>

        <div className={s.realDeskNote}>
          made
          <br />
          for you ♡
        </div>
      </div>

      <header className={s.realDiaryHeader}>
        <span>WIVELI</span>
        <small>OPEN WHEN…</small>
      </header>

      {!opened ? (
        <div className={s.realCoverScene}>
          <Cover
            gift={gift}
            onOpen={() => setOpened(true)}
          />

          <p className={s.realCoverHint}>
            tap the journal to open it ♡
          </p>
        </div>
      ) : (
        <RealBook
          gift={gift}
          entries={entries}
          onClose={() => setOpened(false)}
        />
      )}
    </main>
  );
}
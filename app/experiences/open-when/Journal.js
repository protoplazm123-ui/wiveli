'use client';

import { useMemo, useState } from 'react';
import { activeContent, safeLink } from './scenarios';
import s from './Journal.module.css';

const ASSET = '/assets/open-when/diary-kit';

function SurpriseBack({ entry, gift }) {
  const content = activeContent(entry);
  const link = safeLink(content.link);

  const details = Object.entries(content.details || {}).filter(([, value]) =>
    String(value || '').trim()
  );

  return (
    <div className={s.cardBack}>
      <p className={s.kicker}>A LITTLE SURPRISE FOR YOU ♡</p>

      <h2>{entry.title || 'Just for you'}</h2>

      {content.message && (
        <p className={s.message}>{content.message}</p>
      )}

      {details.length > 0 && (
        <div className={s.details}>
          {details.map(([label, value]) => (
            <p key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </p>
          ))}
        </div>
      )}

      {content.audio?.data && (
        <audio
          className={s.audio}
          controls
          preload="none"
          src={content.audio.data}
        />
      )}

      {link && (
        <a
          className={s.surpriseLink}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          OPEN THIS LITTLE THING ↗
        </a>
      )}

      {content.attachment?.data && (
        <div className={s.attachment}>
          {content.attachment.type?.startsWith('image/') && (
            <img
              src={content.attachment.data}
              alt="Attached surprise"
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
        with love,
        <br />
        {gift.from || 'me'} ♡
      </p>
    </div>
  );
}

function MemoryFront({ entry, gift }) {
  const photo = entry.photo || gift.coverPhoto;

  return (
    <div className={s.cardFront}>
      <div className={s.photoWrap}>
        {photo?.data ? (
          <img
            className={s.photo}
            src={photo.data}
            alt="Our memory"
          />
        ) : (
          <div className={s.photoPlaceholder}>♡</div>
        )}

        <span className={s.tape} />
      </div>

      <p className={s.handCaption}>
        {entry.caption || 'A tiny way to be a little closer. ♡'}
      </p>

      <div className={s.littleNote}>
        for the moments when you need
        <br />
        a little bit of me ♡
      </div>

      <p className={s.flipHint}>
        tap the card to reveal your surprise →
      </p>
    </div>
  );
}

function SurpriseModal({ entry, gift, onClose }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={s.modal}
      role="dialog"
      aria-modal="true"
    >
      <button
        className={s.modalBackdrop}
        type="button"
        onClick={onClose}
        aria-label="Close"
      />

      <div className={s.modalContent}>
        <button
          className={s.close}
          type="button"
          onClick={onClose}
          aria-label="Close surprise"
        >
          ×
        </button>

        <p className={s.openWhen}>OPEN WHEN…</p>

        <h1 className={s.modalTitle}>
          {entry.when}
        </h1>

        <button
          type="button"
          className={s.flipButton}
          onClick={() => setFlipped((value) => !value)}
          aria-label={
            flipped ? 'Show memory' : 'Reveal surprise'
          }
        >
          <div
            className={`${s.flipCard} ${
              flipped ? s.flipped : ''
            }`}
          >
            <div
              className={`${s.cardFace} ${s.frontFace}`}
            >
              <MemoryFront
                entry={entry}
                gift={gift}
              />
            </div>

            <div
              className={`${s.cardFace} ${s.backFace}`}
            >
              <SurpriseBack
                entry={entry}
                gift={gift}
              />
            </div>
          </div>
        </button>

        <span className={s.modalTiny}>
          {flipped
            ? 'tap to see the photo again'
            : 'made just for you'}
        </span>
      </div>
    </div>
  );
}

function Envelope({ entry, index, onOpen }) {
  return (
    <button
      type="button"
      className={s.envelopeCard}
      style={{ '--i': index }}
      onClick={onOpen}
      aria-label={`Open when ${entry.when}`}
    >
      <div className={s.envelopePaper}>
        <span className={s.envelopeNumber}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className={s.envelopeSmall}>
          OPEN WHEN…
        </span>

        <strong>{entry.when}</strong>

        <span className={s.envelopeHeart}>♡</span>
      </div>

      <img
        src={`${ASSET}/download-1.png`}
        alt=""
        draggable="false"
      />
    </button>
  );
}

/*
 * IMPORTANT:
 * OpenWhenBuilder imports this named export.
 */
export function Cover({ gift, onOpen = () => {} }) {
  return (
    <button
      type="button"
      className={s.giftButton}
      onClick={onOpen}
    >
      <div className={s.giftScene}>
        <div className={s.giftShadow} />

        <div className={s.boxLid}>
          <span className={s.lidRibbon} />
          <span className={s.bow}>♡</span>
        </div>

        <div className={s.boxBody}>
          <span className={s.verticalRibbon} />

          <div className={s.boxLabel}>
            <small>WIVELI</small>

            <strong>OPEN WHEN…</strong>

            <em>
              for {gift?.to || 'you'} ♡
            </em>
          </div>
        </div>
      </div>

      <span className={s.coverHint}>
        tap to open your gift ♡
      </span>
    </button>
  );
}

function EnvelopeCollage({
  gift,
  entries,
  onClose,
}) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <header className={s.top}>
        <button
          type="button"
          className={s.backButton}
          onClick={onClose}
        >
          CLOSE GIFT
        </button>

        <strong className={s.brand}>WIVELI</strong>

        <span className={s.counter}>
          {entries.length} LITTLE SURPRISES
        </span>
      </header>

      <section className={s.collageIntro}>
        <p>MADE WITH LOVE, FOR</p>

        <h1>{gift.to || 'you'} ♡</h1>

        <span>
          Pick the envelope you need today.
        </span>
      </section>

      <div className={s.collage}>
        <span className={s.doodleOne}>♡</span>
        <span className={s.doodleTwo}>✦</span>
        <span className={s.doodleThree}>
          love you
        </span>

        {entries.map((entry, index) => (
          <Envelope
            key={entry.id || index}
            entry={entry}
            index={index}
            onOpen={() => setSelected(entry)}
          />
        ))}
      </div>

      <p className={s.footerNote}>
        there is always a little something here for you ♡
      </p>

      {selected && (
        <SurpriseModal
          entry={selected}
          gift={gift}
          onClose={() => setSelected(null)}
        />
      )}
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
  const [bursting, setBursting] = useState(false);

  if (!entries.length) {
    return (
      <main className={s.root}>
        <div className={s.empty}>
          <h1>
            Your little gift is waiting. ♡
          </h1>

          <p>
            Add at least one Open When surprise to begin.
          </p>
        </div>
      </main>
    );
  }

  function openGift() {
    if (bursting) return;

    setBursting(true);

    window.setTimeout(() => {
      setOpened(true);
      setBursting(false);
    }, 950);
  }

  return (
    <main className={s.root}>
      {!opened ? (
        <div
          className={`${s.coverScreen} ${
            bursting ? s.isOpening : ''
          }`}
        >
          <header className={s.top}>
            <strong className={s.brand}>
              WIVELI
            </strong>

            <span className={s.counter}>
              A LITTLE GIFT FOR YOU ♡
            </span>
          </header>

          <div className={s.coverCenter}>
            <p className={s.coverEyebrow}>
              SOME THINGS ARE BETTER OPENED
              WHEN YOU NEED THEM
            </p>

            <h1 className={s.coverTitle}>
              A box full of
              <br />
              <em>little moments.</em>
            </h1>

            <div
              className={s.flyingEnvelopes}
              aria-hidden="true"
            >
              {entries
                .slice(0, 7)
                .map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className={s.flyEnvelope}
                    style={{ '--fly': index }}
                  >
                    <span>OPEN WHEN…</span>
                    <strong>
                      {entry.when}
                    </strong>
                  </div>
                ))}
            </div>

            <Cover
              gift={gift}
              onOpen={openGift}
            />
          </div>
        </div>
      ) : (
        <EnvelopeCollage
          gift={gift}
          entries={entries}
          onClose={() => setOpened(false)}
        />
      )}
    </main>
  );
}

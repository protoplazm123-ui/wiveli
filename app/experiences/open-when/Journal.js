import { activeContent, safeLink } from './scenarios';
import s from './OpenWhen.module.css';

export function Flower({ className = '' }) {
  return <svg className={className} viewBox="0 0 110 140" fill="none" aria-hidden="true">
    <path d="M56 69c-7 27 12 42 2 66M57 110c-24 0-34-14-34-14 21-2 29 7 34 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {[0, 60, 120, 180, 240, 300].map(angle => <ellipse key={angle} cx="55" cy="27" rx="12" ry="22" transform={`rotate(${angle} 55 48)`} fill="#fff8df" stroke="currentColor" strokeWidth="1.5" />)}
    <circle cx="55" cy="48" r="12" fill="#e7b85c" stroke="currentColor" strokeWidth="1.5" />
  </svg>;
}
export function Polaroid({ photo, caption = 'a little piece of us', compact = false }) {
  return <figure className={`${s.polaroid} ${compact ? s.compactPhoto : ''}`}>
    <span className={s.tape} aria-hidden="true" />
    {photo ? <img src={photo.data} alt={caption} /> : <div className={s.paperArt} aria-hidden="true"><span className={s.sun} /><span className={s.hill} /><span className={s.hillTwo} /><span className={s.artNote}>somewhere<br />with you.</span></div>}
    <figcaption>{caption}</figcaption>
  </figure>;
}
export function Cover({ gift, preview = false }) {
  return <div className={`${s.cover} ${preview ? s.coverPreview : ''}`}>
    <span className={s.coverSpine} aria-hidden="true" />
    <div className={s.coverTop}><span>OPEN WHEN…</span><span>VOL. 01 / JUST US</span></div>
    <p className={s.coverFor}>a little book for {gift.to || 'you'}</p>
    <h2>THIS IS MY WAY<br />OF TAKING<br /><em>CARE OF YOU</em> <span>♡</span></h2>
    <div className={s.coverCollage}>
      <Polaroid photo={gift.coverPhoto} caption="my favorite place is with you" compact />
      <span className={s.loveStamp}>MADE<br />WITH<br />LOVE ♡</span>
      <Flower className={s.coverFlower} />
      <span className={s.scribble}>for the good days,<br />and the not-so-good ones.</span>
    </div>
    <p className={s.coverSubtitle}>Open it whenever you need<br />a little bit of me.</p>
    <p className={s.signature}>with love, {gift.from || 'me'} x</p>
    {!preview && <a className={s.coverOpen} href="#little-pages">OPEN YOUR JOURNAL <span>↗</span></a>}
  </div>;
}

// Native details keep every envelope usable in the exported, script-free gift.
export default function Journal({ gift }) {
  const entries = gift.entries.filter(entry => entry.selected);
  return <main className={`${s.root} ${s.reader}`}>
    <h1 className={s.srOnly}>A little book of care for {gift.to || 'you'}</h1>
    <div className={s.readerBrand}>WIVELI <span>♡</span> <small>A LITTLE BOOK OF CARE</small></div>
    <Cover gift={gift} />
    <section id="little-pages" className={s.contents}>
      <p className={s.eyebrow}>NO RIGHT ORDER. NO WRONG TIME.</p>
      <h2>A little bit of me,<br /><em>whenever you need it.</em></h2>
      <p>These pages are yours. Open a little envelope when the moment feels right, and come back as often as you like.</p>
      <nav className={s.indexLinks} aria-label="Journal pages">{entries.map((entry, index) => <a href={`#page-${index + 1}`} key={entry.id}><span>{String(index + 1).padStart(2, '0')}</span>{entry.when}<span aria-hidden="true">↗</span></a>)}</nav>
    </section>
    <div className={s.journalPages}>
      {entries.map((entry, index) => {
        const content = activeContent(entry);
        const link = safeLink(content.link);
        return <article id={`page-${index + 1}`} className={s.journalPage} key={entry.id}>
          <div className={s.pageHeading}><span>A LITTLE LOVE, SAVED FOR LATER</span><span>{String(index + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}</span></div>
          <div className={s.pageCollage}>
            <Polaroid photo={entry.photo || gift.coverPhoto} caption={entry.caption || 'a little piece of us ♡'} />
            <span className={s.pageDoodle} aria-hidden="true">{entry.symbol || '♡'}</span>
            <span className={s.marginNote}>this one’s<br />just for you ↙</span>
          </div>
          <details className={s.envelope}>
            <summary aria-label={`Open when ${entry.when}`}>
              <span className={s.envelopeFlap} aria-hidden="true" />
              <span className={s.envelopeLabel}>OPEN WHEN…</span>
              <span className={s.envelopeTitle}>{entry.when}</span>
              <span className={s.seal} aria-hidden="true">♡</span>
              <span className={s.openHint}>tap to open your little surprise</span>
              <span className={s.closeHint}>fold your letter back up ↑</span>
            </summary>
            <div className={s.surprise}>
              <span className={s.eyebrow}>A LITTLE SOMETHING FOR YOU</span>
              <h3>{entry.title}</h3>
              <p className={s.letterText}>{content.message}</p>
              <dl className={s.planDetails}>{Object.entries(content.details).filter(([, value]) => value.trim()).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              {content.audio && <div className={s.mediaBlock}><p>A little voice note for you</p><audio controls preload="none" src={content.audio.data}>Your browser does not support audio.</audio></div>}
              {link && <a className={s.textLink} href={link} target="_blank" rel="noopener noreferrer">One more little thing ↗</a>}
              {content.attachment && <div className={s.mediaBlock}>
                {content.attachment.type.startsWith('image/') && <img className={s.ticketImage} src={content.attachment.data} alt="Your attached ticket, QR code, or surprise" />}
                <a className={s.textLink} href={content.attachment.data} download={content.attachment.name}>Download {content.attachment.name} ↓</a>
              </div>}
              <p className={s.signature}>always in your corner,<br />{gift.from || 'me'} ♡</p>
            </div>
          </details>
          <div className={s.pageBottom}><span>made with a little too much love</span><a href={index < entries.length - 1 ? `#page-${index + 2}` : '#little-pages'}>{index < entries.length - 1 ? 'Next page →' : 'Back to your pages ↑'}</a></div>
        </article>;
      })}
    </div>
    <div className={s.readerEnd}><span aria-hidden="true">♡</span><p>Keep this little book.<br />My care for you doesn’t run out.</p><small>made with WIVELI</small></div>
  </main>;
}

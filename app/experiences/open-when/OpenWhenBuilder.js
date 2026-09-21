'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cover } from './Journal';
import { scenarios, createDraft, createEntry, activeContent, safeLink, PURCHASE_NOTICE, PURCHASE_HELP } from './scenarios';
import { loadDraft, saveDraft, readMedia } from './storage';
import { exportJournal } from './exportJournal';
import s from './OpenWhen.module.css';

const FILTERS = ['ALL IDEAS', 'FREE', 'A LITTLE PREP', 'OPTIONAL PURCHASE'];
const customScenario = { requirements: ['Give your envelope a name', 'Write your surprise; add photos or files if you like'], freeRequirements: ['Your words and a plan that uses what you already have'], fields: ['Your little plan'], freeFields: ['Your plan without a purchase'], tag: 'A LITTLE PREP', freeAlternative: 'Make it a personal letter, a homemade coupon, or time together using things you already have.' };

function FileField({ label, kind, value, onChange, onBusy }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const accept = kind === 'photo' ? 'image/jpeg,image/png,image/webp' : kind === 'audio' ? 'audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/x-wav,audio/ogg,audio/webm' : 'image/jpeg,image/png,image/webp,application/pdf';
  async function upload(event) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    setError(''); setBusy(true); onBusy(1);
    try { onChange(await readMedia(file, kind)); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); onBusy(-1); }
  }
  return <div className={s.fileField}>
    <label><span>{label}</span><input type="file" accept={accept} disabled={busy} onChange={upload} /></label>
    <small>{kind === 'photo' ? 'JPG, PNG or WebP · up to 15 MB' : kind === 'audio' ? 'MP3, M4A, WAV, OGG or WebM · up to 5 MB' : 'JPG, PNG, WebP or PDF · up to 5 MB'}</small>
    {busy && <p role="status">Preparing your file…</p>}
    {value && <div className={s.fileSelected}>{kind === 'photo' && <img src={value.data} alt="Your uploaded photo" />}<span>{value.name}</span><button type="button" onClick={() => onChange(null)} disabled={busy} aria-label={`Remove ${label.toLowerCase()}`}>Remove</button></div>}
    {error && <p className={s.error} role="alert">{error}</p>}
  </div>;
}

export default function OpenWhenBuilder() {
  const router = useRouter();
  const [draft, setDraft] = useState(createDraft);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Loading draft…');
  const [step, setStep] = useState(0);
  const [filter, setFilter] = useState('ALL IDEAS');
  const [query, setQuery] = useState('');
  const [busyFiles, setBusyFiles] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [readyFile, setReadyFile] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [activeEditor, setActiveEditor] = useState(null);
  const saveGeneration = useRef(0);
  const workbench = useRef(null);
  const selected = draft.entries.filter(entry => entry.selected);
  const busy = busyFiles > 0 || exporting;

  useEffect(() => { setReadyFile(null); }, [draft]);
  useEffect(() => () => { if (readyFile) URL.revokeObjectURL(readyFile.url); }, [readyFile]);

  useEffect(() => {
    let active = true;
    loadDraft().then(saved => {
      if (!active) return;
      if (saved?.version === 1 && Array.isArray(saved.entries)) setDraft(saved);
      setSaveStatus(saved ? 'Draft restored on this device' : 'Your little book starts here');
    }).catch(() => { if (active) setSaveStatus('Browser storage unavailable. Download your gift before leaving.'); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const generation = ++saveGeneration.current;
    setSaveStatus('Saving…');
    const timer = setTimeout(() => {
      saveDraft(draft).then(() => { if (generation === saveGeneration.current) setSaveStatus('Draft saved on this device'); })
        .catch(() => { if (generation === saveGeneration.current) setSaveStatus('Couldn’t save on this device. Download your gift before leaving.'); });
    }, 350);
    return () => clearTimeout(timer);
  }, [draft, ready]);

  function editEntry(id, changes) { setDraft(current => ({ ...current, entries: current.entries.map(e => e.id === id ? { ...e, ...changes } : e) })); }
  function editContent(id, changes) { setDraft(current => ({ ...current, entries: current.entries.map(e => e.id === id ? { ...e, [e.free ? 'alternative' : 'original']: { ...activeContent(e), ...changes } } : e) })); }
  function choose(scenario) {
    setDraft(current => {
      const entry = current.entries.find(e => e.id === scenario.id);
      return { ...current, entries: entry ? current.entries.map(e => e.id === scenario.id ? { ...e, selected: !e.selected } : e) : [...current.entries, createEntry(scenario)] };
    });
  }
  function switchVersion(scenario, free) {
    setDraft(current => {
      const entry = current.entries.find(e => e.id === scenario.id);
      return { ...current, entries: entry ? current.entries.map(e => e.id === scenario.id ? { ...e, free } : e) : [...current.entries, { ...createEntry(scenario), selected: false, free }] };
    });
  }
  function addCustom() {
    const entry = createEntry({ id: `custom-${crypto.randomUUID()}`, when: '', title: '', symbol: '♡', caption: 'a little something only we understand', message: '', freeMessage: '' });
    setDraft(current => ({ ...current, entries: [...current.entries, entry] }));
    setActiveEditor(entry.id); goToStep(1);
  }
  function move(id, direction) {
    setDraft(current => {
      const entries = [...current.entries]; const visible = entries.filter(e => e.selected);
      const position = visible.findIndex(e => e.id === id); const neighbor = visible[position + direction];
      if (!neighbor) return current;
      const a = entries.findIndex(e => e.id === id); const b = entries.findIndex(e => e.id === neighbor.id);
      [entries[a], entries[b]] = [entries[b], entries[a]]; return { ...current, entries };
    });
  }
  function goToStep(next) { setStep(next); setError(''); setNotice(''); requestAnimationFrame(() => { workbench.current?.scrollIntoView({ behavior: 'instant', block: 'start' }); workbench.current?.focus({ preventScroll: true }); }); }
  function validate() {
    if (!selected.length) { setError('Choose at least one moment for your journal.'); return false; }
    const invalid = selected.find(e => !e.when.trim() || !e.title.trim() || !activeContent(e).message.trim() || (activeContent(e).link.trim() && !safeLink(activeContent(e).link)));
    if (invalid) { setStep(1); setActiveEditor(invalid.id); setError('Add an envelope name, a surprise title, and a little note to each page. Links must start with https:// or http://.'); return false; }
    return true;
  }
  async function preview() {
    if (!validate()) return;
    try { await saveDraft(draft); router.push('/gift/open-when'); }
    catch { setError('Preview needs browser storage. You can still download your journal below.'); }
  }
  async function download() {
    if (!validate()) return;
    setExporting(true); setError(''); setNotice('');
    try { setReadyFile(await exportJournal(draft)); setNotice('Your file is ready. Choose Save journal file, then send it as an attachment. Open the gift file below to check it first. Some messaging apps require downloading the file before opening it in a browser.'); }
    catch (err) { setError(err.message || 'The download did not finish. Please try again.'); }
    finally { setExporting(false); }
  }
  const shown = scenarios.filter(idea => (filter === 'ALL IDEAS' || idea.tag === filter) && `${idea.when} ${idea.title}`.toLowerCase().includes(query.toLowerCase().trim()));

  return <main className={`${s.root} ${s.builder}`}>
    <header className={s.header}><a className={s.logo} href="/">WI<span>♥</span>ELI</a><a className={s.backLink} href="/#ideas">← All experiences</a></header>
    <section className={s.hero}>
      <div className={s.heroCopy}>
        <p className={s.eyebrow}><span className={s.tinyHeart}>♡</span> LITTLE GESTURES. A LOT OF LOVE.</p>
        <h1>Open when<span>you need me.</span></h1>
        <p className={s.heroLead}>You can’t always be there.<br />A little bit of you can.</p>
        <p className={s.heroDescription}>A handmade digital journal, filled with your words, your memories, and little surprises for their everyday moments.</p>
        <a className={s.primaryButton} href="#make-your-journal">Make their little book <span>↗</span></a>
        <a className={s.sampleLink} href="/gift/open-when?demo=1">Take a peek inside <span>→</span></a>
        <p className={s.heroFootnote}>made by you. kept close by them. <span>♡</span></p>
      </div>
      <div className={s.heroVisual}><span className={s.heroNote}>like you stayed up all night<br />making something just for them ↘</span><Cover gift={draft} preview /><span className={s.sideSticker}>a little<br />love letter<br />to life.</span></div>
    </section>
    <div className={s.howStrip}><span>01 <b>Choose their moments</b></span><i>♡</i><span>02 <b>Make each one yours</b></span><i>♡</i><span>03 <b>Give a little care</b></span></div>
    <section className={s.workbench} id="make-your-journal" ref={workbench} tabIndex={-1}>
      <div className={s.benchTop}><p className={s.eyebrow}>YOUR LITTLE BOOK, IN THE MAKING</p><p className={s.saveStatus} role="status">{saveStatus}</p></div>
      <nav className={s.stepTabs} aria-label="Create your journal">{['Choose moments', 'Make it yours', 'Wrap it up'].map((label, index) => <button key={label} type="button" disabled={!ready || busy || (index > 0 && !selected.length)} aria-current={step === index ? 'step' : undefined} className={step === index ? s.activeTab : ''} onClick={() => index === 2 ? validate() && goToStep(index) : goToStep(index)}><span>0{index + 1}</span>{label}</button>)}</nav>
      {!ready ? <p className={s.emptyState}>Opening your saved draft…</p> : <>
        {error && <p className={s.error} role="alert">{error}</p>}
        {step === 0 && <>
          <div className={s.sectionIntro}><div><h2>What do they <em>need a little more of?</em></h2><p>Pick one, pick twenty, or make up your own. There’s no right number of ways to care.</p></div><span className={s.pencilNote}>every idea has<br />a free version ♡</span></div>
          <div className={s.legend}><span><b>FREE</b> Just your words or time</span><span><b>A LITTLE PREP</b> Gather a memory or make a plan</span><span><b>OPTIONAL PURCHASE</b> Bring your own extra surprise</span></div>
          <div className={s.libraryTools}><div className={s.filters} aria-label="Filter ideas">{FILTERS.map(item => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === 'ALL IDEAS' ? ' · 20' : ''}</button>)}</div><label className={s.search}><span className={s.srOnly}>Search moments</span><input type="search" placeholder="Find a little moment…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
          <div className={s.ideaGrid}>
            {shown.map((idea, index) => {
              const entry = draft.entries.find(e => e.id === idea.id); const free = !!entry?.free;
              return <article key={idea.id} className={`${s.ideaCard} ${entry?.selected ? s.chosenCard : ''}`}>
                <div className={s.cardTop}><span className={s.badge}>{free ? 'FREE' : idea.tag}</span><span className={s.cardSymbol} aria-hidden="true">{idea.symbol}</span></div>
                <p className={s.eyebrow}>OPEN WHEN…</p><h3>{idea.when}</h3><p className={s.cardTitle}>{idea.title}</p>
                <div className={s.requirements}><b>YOU’LL NEED</b><ul>{(free ? idea.freeRequirements : idea.requirements).map(item => <li key={item}>{item}</li>)}</ul></div>
                <p className={s.freeCopy}><b>{free ? 'YOUR FREE PLAN' : 'NO-PURCHASE IDEA'}</b>{idea.freeAlternative}</p>
                {idea.tag === 'OPTIONAL PURCHASE' && !free && <p className={s.purchaseInline}>You provide any tickets, bookings, gift cards, food, or physical gifts. WIVELI doesn’t buy them.</p>}
                <div className={s.cardActions}><button className={entry?.selected ? s.chosenButton : s.addButton} type="button" aria-pressed={!!entry?.selected} aria-label={`${entry?.selected ? 'Remove' : 'Add'} ${idea.when}`} onClick={() => choose(idea)}>{entry?.selected ? '✓ Added to your book' : '+ Add this moment'}</button><button className={s.freeButton} type="button" onClick={() => switchVersion(idea, !free)}>{free ? 'BACK TO ORIGINAL IDEA' : idea.tag === 'OPTIONAL PURCHASE' ? 'MAKE IT FREE INSTEAD' : 'USE THE SIMPLE VERSION'} <span>↗</span></button></div>
              </article>;
            })}
            {!shown.length && <p className={s.noResults}>No moments found. Try another word or create your own below.</p>}
            <article className={s.customCard}><span aria-hidden="true">✎</span><p className={s.eyebrow}>ONLY YOU COULD THINK OF THIS</p><h3>Your inside joke.<br />Your little tradition.<br /><em>Your kind of care.</em></h3><p>Some things don’t come from a library.</p><button className={s.primaryButton} type="button" onClick={addCustom}>Create My Own <span>+</span></button></article>
          </div>
        </>}
        {step === 1 && <>
          <div className={s.sectionIntro}><div><h2>A little more <em>you.</em></h2><p>Keep our words or write your own. The little details make it theirs.</p></div><span className={s.pencilNote}>imperfect is<br />kind of perfect.</span></div>
          <div className={s.personalizeLayout}>
            <div className={s.editors}>
              <section className={s.personalCard}><p className={s.eyebrow}>ON THE COVER</p><h3>Made for them. From you.</h3><div className={s.nameFields}><label className={s.field}><span>For</span><input value={draft.to} maxLength={60} placeholder="Their name" onChange={event => setDraft(current => ({ ...current, to: event.target.value }))} /></label><label className={s.field}><span>With love, from</span><input value={draft.from} maxLength={60} placeholder="Your name" onChange={event => setDraft(current => ({ ...current, from: event.target.value }))} /></label></div><FileField label="A photo for the cover (optional)" kind="photo" value={draft.coverPhoto} onBusy={n => setBusyFiles(c => c + n)} onChange={coverPhoto => setDraft(current => ({ ...current, coverPhoto }))} /><p className={s.helper}>No photo? Your journal keeps its little paper illustration.</p></section>
              {selected.map((entry, index) => {
                const idea = scenarios.find(i => i.id === entry.id) || customScenario;
                const content = activeContent(entry); const custom = entry.id.startsWith('custom-');
                const open = activeEditor ? activeEditor === entry.id : index === 0;
                return <section className={s.entryEditor} key={entry.id}>
                  <button className={s.editorToggle} type="button" aria-expanded={open} aria-controls={`editor-${entry.id}`} onClick={() => setActiveEditor(open ? 'closed' : entry.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>Open when {entry.when || '…your own little moment'}</strong><span>{open ? '−' : '+'}</span></button>
                  {open && <div className={s.editorBody} id={`editor-${entry.id}`}>
                    <div className={s.editorActions}><button type="button" disabled={index === 0 || busy} onClick={() => move(entry.id, -1)}>↑ Move up</button><button type="button" disabled={index === selected.length - 1 || busy} onClick={() => move(entry.id, 1)}>↓ Move down</button><button type="button" disabled={busy} onClick={() => editEntry(entry.id, { selected: false })}>Remove page</button></div>
                    {custom && <label className={s.field}><span>Open when… <small>(required)</small></span><input value={entry.when} maxLength={120} placeholder="you need a kitchen dance party" onChange={event => editEntry(entry.id, { when: event.target.value })} /></label>}
                    <div className={s.variantBox}><span className={s.badge}>{entry.free ? 'FREE' : idea.tag}</span><p>{entry.free ? idea.freeAlternative : 'Start with this idea and make it yours.'}</p><ul>{(entry.free ? idea.freeRequirements : idea.requirements).map(item => <li key={item}>{item}</li>)}</ul>{idea.tag === 'OPTIONAL PURCHASE' && !entry.free && <p>{PURCHASE_HELP}</p>}<button type="button" className={s.freeButton} disabled={busy} onClick={() => editEntry(entry.id, { free: !entry.free })}>{entry.free ? 'BACK TO ORIGINAL IDEA' : 'MAKE IT FREE INSTEAD'} ↗</button><small>Each version keeps its own note, plan, and attachments.</small></div>
                    <label className={s.field}><span>Caption outside the envelope</span><input value={entry.caption} maxLength={160} onChange={event => editEntry(entry.id, { caption: event.target.value })} /><small>Visible before opening — keep the surprise a secret.</small></label>
                    <FileField label="Photo on this page (optional)" kind="photo" value={entry.photo} onBusy={n => setBusyFiles(c => c + n)} onChange={photo => editEntry(entry.id, { photo })} />
                    <div className={s.insideLabel}>↓ EVERYTHING BELOW GOES INSIDE THE ENVELOPE</div>
                    <label className={s.field}><span>Surprise title <small>(required)</small></span><input value={entry.title} maxLength={120} onChange={event => editEntry(entry.id, { title: event.target.value })} placeholder="Our kitchen dance party" /></label>
                    <label className={s.field}><span>Your little note <small>(required)</small></span><textarea rows={6} maxLength={6000} value={content.message} placeholder="Hey you…" onChange={event => editContent(entry.id, { message: event.target.value })} /></label>
                    {(entry.free ? idea.freeFields : idea.fields).map(label => <label className={s.field} key={label}><span>{label}</span><textarea rows={2} maxLength={2000} value={content.details[label] || ''} placeholder="Add your little details…" onChange={event => editContent(entry.id, { details: { ...content.details, [label]: event.target.value } })} /></label>)}
                    <label className={s.field}><span>A song, video, or place link (optional)</span><input type="url" inputMode="url" value={content.link} maxLength={2000} placeholder="https://…" onChange={event => editContent(entry.id, { link: event.target.value })} />{content.link && !safeLink(content.link) && <small className={s.error}>Use a full https:// or http:// link.</small>}</label>
                    <FileField label="Voice note (optional)" kind="audio" value={content.audio} onBusy={n => setBusyFiles(c => c + n)} onChange={audio => editContent(entry.id, { audio })} />
                    <FileField label="Your ticket, QR, reservation, or surprise (optional)" kind="attachment" value={content.attachment} onBusy={n => setBusyFiles(c => c + n)} onChange={attachment => editContent(entry.id, { attachment })} />
                    <p className={s.helper}>{PURCHASE_HELP}</p>
                  </div>}
                </section>;
              })}
              <button className={s.outlineButton} type="button" disabled={busy} onClick={addCustom}>+ Create My Own</button>
              {!selected.length && <p className={s.emptyState}>Your book is waiting for its first page. <button type="button" onClick={() => goToStep(0)}>Choose a moment →</button></p>}
            </div>
            <aside className={s.coverAside}><p className={s.eyebrow}>YOUR COVER, COMING TO LIFE</p><Cover gift={draft} preview /><p className={s.helper}>Photos, captions, and envelopes come together automatically. You just bring the love.</p></aside>
          </div>
        </>}
        {step === 2 && <div className={s.wrapLayout}>
          <div><p className={s.eyebrow}>SEALED WITH A LITTLE LOVE</p><h2>Something they<br /><em>can keep.</em></h2><p className={s.wrapLead}>{selected.length} little {selected.length === 1 ? 'moment' : 'moments'} for {draft.to || 'your favorite person'}. One book to come back to.</p><p>Take a peek through their eyes, then download the journal and send it as a file. Their photos, notes, and attachments travel with it.</p><div className={s.wrapActions}><button className={s.outlineButton} type="button" disabled={busy} onClick={preview}>Preview their journal ↗</button>{readyFile ? <><a className={s.primaryButton} href={readyFile.url} download={readyFile.name}>Save journal file ↓</a><a className={s.textLink} href={readyFile.url} target="_blank" rel="noopener noreferrer">Open the gift file ↗</a></> : <button className={s.primaryButton} type="button" disabled={busy} onClick={download}>{exporting ? 'Wrapping up your journal…' : 'Prepare download ↓'}</button>}</div><p className={s.helper}>This first version gives you a self-contained HTML gift, not a hosted link. Open the downloaded file in a browser. Anyone you send the file to can access its contents, including tickets and QR codes.</p>{notice && <p className={s.success} role="status">{notice}</p>}<div className={s.giftChecklist}><p className={s.eyebrow}>ONE LAST LITTLE CHECK</p><ul><li>Read through your notes and plans.</li><li>Check dates, addresses, and any tickets you provided.</li><li>Make sure the surprise is ready before you send it.</li></ul></div></div><Cover gift={draft} preview />
        </div>}
        <div className={s.carePromise}><span aria-hidden="true">♡</span><div><h3>WIVELI creates the experience — you create the surprise. ♡</h3><p>{PURCHASE_NOTICE}</p></div></div>
      </>}
    </section>
    <div className={s.bottomBar}><div><b>{selected.length} {selected.length === 1 ? 'moment' : 'moments'} in your book</b><span>No fixed size. Just your kind of care.</span></div>{step === 2 && readyFile ? <a className={s.primaryButton} href={readyFile.url} download={readyFile.name}>Save journal ↓</a> : <button className={s.primaryButton} type="button" disabled={!ready || busy || !selected.length} onClick={() => step === 0 ? goToStep(1) : step === 1 ? validate() && goToStep(2) : download()}>{step === 0 ? 'Make it yours' : step === 1 ? 'Wrap it up' : exporting ? 'Preparing…' : 'Prepare file'} <span>↗</span></button>}</div>
    <div className={s.builderFooter}><a className={s.logo} href="/">WI<span>♥</span>ELI</a><p>A little more thought. A little more love.</p><small>© 2026 WIVELI</small></div>
  </main>;
}

'use client';
import { useEffect, useState } from 'react';
import Journal from '../../experiences/open-when/Journal';
import { loadDraft } from '../../experiences/open-when/storage';
import { createDemo } from '../../experiences/open-when/scenarios';
import s from '../../experiences/open-when/OpenWhen.module.css';

export default function OpenWhenGift() {
  const [gift, setGift] = useState(null);
  const [status, setStatus] = useState('Loading your journal…');
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    let active = true;
    if (new URLSearchParams(window.location.search).get('demo') === '1') {
      setDemo(true); setGift(createDemo()); return;
    }
    loadDraft().then(draft => {
      if (!active) return;
      if (draft?.version === 1 && draft.entries?.some(e => e.selected)) setGift(draft);
      else setStatus('Your journal is waiting to be made. Choose a few moments first.');
    }).catch(() => { if (active) setStatus('We couldn’t load the journal from this browser. Open the builder and try again.'); });
    return () => { active = false; };
  }, []);
  return <>
    <div className={`${s.root} ${s.previewBar}`}><span>{demo ? 'SAMPLE JOURNAL' : 'YOUR PREVIEW · THIS BROWSER ONLY'}</span><a href="/experiences/open-when">{demo ? 'Make yours' : 'Back to your journal'} ↗</a></div>
    {gift ? <Journal gift={gift} /> : <main className={`${s.root} ${s.emptyState}`}><h1>A little book of care</h1><p role="status">{status}</p><a className={s.primaryButton} href="/experiences/open-when">Create your journal →</a></main>}
  </>;
}

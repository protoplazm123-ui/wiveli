"use client";
import {useState} from 'react';
import {useWishDraft} from '../../../lib/use-wish-draft';
import TelegramGiftDelivery from '../../../components/TelegramGiftDelivery';
export default function WishNoteDelivery() {
 const {draft,setDraft,ready,error:storageError}=useWishDraft();
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[copyMessage,setCopyMessage]=useState('');
 async function createGift(){
  if(busy || draft.createdGiftId)return;setBusy(true);setError('');
  try{
   const res=await fetch('/api/gifts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({giftType:'wish-note',giftData:{...draft,wishCount:draft.isCustom?Number(draft.customWishCount):draft.wishCount}})});
   const data=await res.json();if(!res.ok)throw Error(data.error||'Could not create gift.');
   setDraft(previous=>({...previous,createdGiftId:data.id,giftUrl:data.giftUrl}));
  }catch(e){setError(e.message);}finally{setBusy(false);}
 }
 async function copyLink(){try{await navigator.clipboard.writeText(draft.giftUrl);setCopyMessage('Copied ♡');}catch{setCopyMessage('Select the link and copy it manually.');}}
 return <main><a className="logo" href="/">WI♥ELI</a><p className="eyebrow">WISH NOTE / SEND WITH LOVE</p><h1>A little world.<br/><em>Just for them.</em></h1><p>Your Wish Note for <strong>{draft.recipientName||'your person'}</strong>, from {draft.senderName||'you'}.</p>
 {(error||storageError)&&<p role="alert">{error||storageError} <a href="/login?next=%2Fexperiences%2Fwish-note%2Fdelivery">Sign in</a></p>}
 {!draft.createdGiftId?<><p>Save your gift to your account, then prepare the message you will send personally. Your recipient does not need to register.</p><button disabled={!ready||busy} onClick={createGift}>{busy?'CREATING…':'CREATE MY WISH NOTE ♡'}</button><a className="back" href="/experiences/wish-note/preview">← BACK TO PREVIEW</a></>:<>
 <div className="giftLink"><label>PRIVATE GIFT LINK<input value={draft.giftUrl||''} readOnly onFocus={e=>e.target.select()}/></label><button onClick={copyLink}>COPY LINK</button><p role="status">{copyMessage}</p></div>
 <TelegramGiftDelivery giftType="wish-note" giftId={draft.createdGiftId} senderName={draft.senderName} recipientName={draft.recipientName} onBack={()=>window.location.assign('/account')}/>
 </>}
 <style jsx>{`main{min-height:100svh;box-sizing:border-box;padding:40px max(22px,calc((100vw - 720px)/2));background:#f7f0e8;color:#692f3c;font-family:Georgia,serif;}h1{font-size:clamp(40px,8vw,68px);font-weight:400;line-height:1;letter-spacing:-.04em;}p{line-height:1.6;}button{padding:16px 22px;border:0;border-radius:28px;background:#692f3c;color:#fffaf5;font:700 11px Arial,sans-serif;cursor:pointer;}button:disabled{opacity:.5;}a{color:inherit;}.back{display:block;margin:24px 0;}.eyebrow,label{font:700 10px Arial,sans-serif;letter-spacing:.1em;}.eyebrow{margin-top:40px;}input{display:block;width:100%;box-sizing:border-box;margin:12px 0;padding:14px;border:1px solid #d6c3bc;background:#fffaf5;border-radius:12px;font-size:16px;}.giftLink{padding:22px 0;margin-bottom:24px;border-bottom:1px solid #d6c3bc;}`}</style></main>;
}

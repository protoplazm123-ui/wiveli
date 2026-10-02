"use client";
import { useEffect, useState } from "react";
export const WISH_DRAFT_KEY='wiveli-wish-draft-v2';
export const EMPTY_WISH_DRAFT={recipientName:'',senderName:'',message:'I made this little place for your wishes, dreams and all the things we still have to do together.',wishCount:24,customWishCount:'',isCustom:false,categories:['Dream Together','Food & Places','Our Time','Little Things','Adventures','Something Special'],style:'soft',caption:'one of my favorite memories ♡',attachments:{}};
export function useWishDraft() {
 const [draft,setDraft]=useState(EMPTY_WISH_DRAFT),[ready,setReady]=useState(false),[error,setError]=useState('');
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(WISH_DRAFT_KEY)||'null');if(saved && typeof saved==='object')setDraft({...EMPTY_WISH_DRAFT,...saved});}catch{setError('Could not restore your draft. Please check your details.');}setReady(true);},[]);
 useEffect(()=>{if(!ready)return;try{localStorage.setItem(WISH_DRAFT_KEY,JSON.stringify(draft));}catch{setError('Your browser could not save the draft. Keep this page open and allow website storage.');}},[draft,ready]);
 const change=(key,value)=>setDraft(previous=>({...previous,[key]:typeof value==='function'?value(previous[key]):value,createdGiftId:null,giftUrl:null}));
 return {draft,setDraft,change,ready,error};
}

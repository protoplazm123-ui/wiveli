"use client";
import {useEffect,useState} from 'react';
export default function WishNoteMedia({giftId,wishId,claimToken,preview,revision=0,photoOnly=false,excludePhoto=false}) {
 const [files,setFiles]=useState([]),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const previewJson=preview?JSON.stringify(preview):'';
 useEffect(()=>{
  if(!giftId && !previewJson)return;
  let cancelled=false;const controller=new AbortController();setFiles([]);setError('');
  const url=previewJson?'/api/wish-note/attachments-preview':`/api/gifts/${encodeURIComponent(giftId)}/wish-note/attachments${wishId?'?wishId='+encodeURIComponent(wishId):''}`;
  const options=previewJson?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({files:Object.entries(JSON.parse(previewJson)).map(([kind,file])=>({...file,kind}))})}:{headers:claimToken?{'x-wiveli-gift-token':claimToken}:{}};
  fetch(url,{...options,signal:controller.signal,cache:'no-store'}).then(async res=>{const data=await res.json();if(!res.ok)throw Error(data.error||'Could not load files.');return data.attachments;}).then(data=>{if(!cancelled)setFiles(data);}).catch(e=>{if(!cancelled)setError(e.message);});
  return()=>{cancelled=true;controller.abort();};
 },[giftId,wishId,claimToken,previewJson,retry,revision]);
 return <div className="wishFiles">{files.filter(f=>photoOnly?f.kind==='photo':excludePhoto?f.kind!=='photo':true).map((f,i)=><figure key={f.path||i}>
  {f.url && <>{f.mimeType.startsWith('image/')?<img src={f.url} alt={f.name} loading="lazy"/>:f.mimeType.startsWith('video/')?<video src={f.url} controls playsInline preload="metadata"/>:f.mimeType.startsWith('audio/')?<audio src={f.url} controls preload="metadata"/>:<object data={f.url} type="application/pdf" aria-label={f.name}><p>Open the PDF below.</p></object>}<figcaption><a href={f.url} target="_blank" rel="noopener noreferrer">{f.name} ↗</a></figcaption></>}
  {f.error && <p>{f.error}</p>}
 </figure>)}{error && <p role="alert">{error}</p>}{(error||files.length>0) && <button type="button" onClick={()=>setRetry(v=>v+1)}>REFRESH FILES ↻</button>}
 <style jsx>{`.wishFiles{width:100%;min-width:0;margin:16px 0;}figure{margin:14px 0;}img,video,audio,object{display:block;width:100%;max-width:100%;border-radius:14px;}img{max-height:380px;object-fit:contain;}video{max-height:380px;background:#261e20;}object{height:340px;background:#fff;}figcaption{font:11px/1.5 Arial,sans-serif;margin:8px 0;overflow-wrap:anywhere;}button{font:700 9px Arial,sans-serif;padding:10px;border:1px solid currentColor;border-radius:18px;background:transparent;color:inherit;cursor:pointer;}p{font:13px/1.5 Arial,sans-serif;}`}</style></div>;
}

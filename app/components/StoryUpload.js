"use client";
import {useEffect,useState} from 'react';
import CouponAttachmentUpload from './CouponAttachmentUpload';
export default function StoryUpload({kind,attachment,onChange,onBusy,onPreview}){
 const [url,setUrl]=useState('');const [error,setError]=useState('');
 useEffect(()=>{let live=true;setUrl('');setError('');if(!attachment){onPreview?.('');return;}fetch('/api/wish-note/attachments-preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({files:[{...attachment,kind}]})}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);return d.attachments?.[0]?.url||'';}).then(u=>{if(live){setUrl(u);onPreview?.(u);}}).catch(()=>{if(live)setError('Preview unavailable. Reopen this step to try again.');});return()=>{live=false;};},[attachment?.path,kind]);
 return <div><CouponAttachmentUpload kind={kind} attachment={attachment} onChange={onChange} onBusy={onBusy} saveHint="Uploaded securely. Create your story to include this file."/>{url&&kind==='photo'&&<img src={url} alt="Your memory"/>}{error&&<p>{error}</p>}<style jsx>{`img{display:block;max-width:100%;max-height:180px;object-fit:contain;margin:12px auto;border-radius:8px;}div{min-width:0;}p{font-size:12px;}`}</style></div>;
}

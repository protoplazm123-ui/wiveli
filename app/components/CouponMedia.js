"use client";
import { useEffect, useState } from "react";
const safeUrl=value=>{try{const url=new URL(value);return ["https:","http:"].includes(url.protocol)?url.href:"";}catch{return "";}};

export default function CouponMedia({coupon,giftId,claimToken}) {
  const [files,setFiles]=useState({}),[error,setError]=useState(""),[loading,setLoading]=useState(false),[revision,setRevision]=useState(0);
  const hasUploads=Object.keys(coupon.attachments||{}).length>0;
  useEffect(()=>{
    setFiles({});setError(""); if(!hasUploads || !giftId)return;
    let cancelled=false;const controller=new AbortController();setLoading(true);
    fetch(`/api/gifts/${encodeURIComponent(giftId)}/attachments?couponId=${encodeURIComponent(coupon.id)}`,{cache:"no-store",headers:claimToken?{"x-wiveli-gift-token":claimToken}:{},signal:controller.signal,referrerPolicy:"no-referrer"})
      .then(async res=>{const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not load attachments.");return data.attachments;})
      .then(data=>{if(!cancelled)setFiles(data);}).catch(e=>{if(!cancelled)setError(e.message);}).finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;controller.abort();};
  },[coupon.id,giftId,claimToken,hasUploads,revision]);
  const items=[['photo','Your photo'],['video','A video for you'],['voice','A voice note'],['gift','Your gift certificate']].map(([kind,label])=>({kind,label,file:files[kind],url:files[kind]?.url || (!coupon.attachments?.[kind]?safeUrl(coupon[`${kind}Url`]):"")})).filter(item=>item.url || coupon.attachments?.[item.kind]);
  if(!items.length)return null;
  return <section className="couponMedia" aria-label="Coupon attachments">
    <p className="mediaEyebrow">SOMETHING EXTRA FOR YOU ♡</p>
    {loading && <p role="status">Opening your surprises…</p>}
    {error && <p role="alert">{error}</p>}
    {items.map(({kind,label,file,url})=><div className="mediaItem" key={kind}>
      <h3>{label}</h3>
      {file?.error && <p role="alert">{file.error}</p>}
      {url && <>
        {(kind==='photo'||kind==='gift'&&file?.mimeType?.startsWith('image/')) && <img src={url} alt={kind==='photo'?'Photo from your sender':'Gift certificate'} loading="lazy" referrerPolicy="no-referrer" onError={()=>setError("This image could not be displayed. Try refreshing the attachments.")}/>}
        {kind==='video' && <video controls playsInline preload="metadata" src={url} onError={()=>setError("This video cannot play here. Open the original file below or try another browser.")}/>}
        {kind==='voice' && <audio controls preload="metadata" src={url}/>}
        {kind==='gift' && file?.mimeType==='application/pdf' && <object data={url} type="application/pdf" aria-label="Gift certificate PDF"><p>Open the PDF using the link below.</p></object>}
        <a href={url} target="_blank" rel="noopener noreferrer">{kind==='gift'?'OPEN CERTIFICATE ↗':'OPEN ORIGINAL ↗'}</a>
      </>}
    </div>)}
    {hasUploads && <button type="button" disabled={loading} onClick={()=>setRevision(v=>v+1)}>REFRESH ATTACHMENTS ↻</button>}
    <style jsx>{`
      .couponMedia { margin: 22px 0; padding-top: 18px; border-top: 1px dashed #be8989; text-align: left; min-width: 0; }
      .mediaEyebrow { font: 700 9px/1.5 Arial,sans-serif; letter-spacing: .12em; }
      .mediaItem { margin: 18px 0; min-width: 0; }
      h3 { margin: 0 0 10px; font: 22px/1.2 Georgia,serif; }
      img,video,audio,object { display: block; width: 100%; max-width: 100%; border-radius: 10px; }
      img { max-height: 520px; object-fit: contain; background: #f9e3de; }
      video { max-height: 450px; background: #301a1d; }
      object { height: 360px; background: #fffaf5; }
      a,button { display: inline-block; margin-top: 12px; font: 700 9px/1.5 Arial,sans-serif; letter-spacing: .08em; color: #741020; }
      button { padding: 12px; border: 1px solid #bd8b8c; border-radius: 20px; background: transparent; cursor: pointer; }
      p { font: 13px/1.5 Arial,sans-serif; overflow-wrap: anywhere; }
    `}</style>
  </section>;
}

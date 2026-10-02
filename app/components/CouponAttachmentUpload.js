"use client";
import { useEffect, useRef, useState } from "react";
import { attachmentSpec } from "../lib/coupon-attachments";
const accepts = {photo:"image/*", video:"video/mp4,video/webm,video/quicktime", voice:"audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/webm", gift:"application/pdf,image/jpeg,image/png,image/webp"};

export default function CouponAttachmentUpload({kind, attachment, onChange, onBusy}) {
  const input = useRef(null), controller = useRef(null), mounted = useRef(true);
  const [busy,setBusy] = useState(false), [error,setError] = useState("");
  useEffect(() => { mounted.current = true; return () => {mounted.current=false; controller.current?.abort(); onBusy(false);}; }, []);
  async function upload(event) {
    let file=event.target.files?.[0]; event.target.value=""; if(!file) return;
    controller.current?.abort(); const abort = new AbortController(); controller.current=abort;
    setBusy(true); onBusy(true); setError("");
    try {
      // Resize phone photos before upload; this also strips unnecessary metadata.
      if(kind === "photo" && file.type.startsWith("image/")) {
        if(file.size > 25*1024*1024) throw new Error("Choose a photo smaller than 25 MB.");
        const url=URL.createObjectURL(file);
        try {
          const image=new Image(); await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error("This photo format cannot be opened. Try JPG or PNG."));image.src=url;});
          const scale=Math.min(1,2000/Math.max(image.width,image.height));
          const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
          const ctx=canvas.getContext("2d");ctx.fillStyle="#fffaf5";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
          const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",.9));if(!blob) throw new Error("Could not prepare photo.");
          file=new File([blob],file.name.replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"});
        } finally {URL.revokeObjectURL(url);}
      }
      attachmentSpec(kind,file.type,file.size);
      if(abort.signal.aborted) return;
      const res=await fetch("/api/coupon-attachments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind,name:file.name,size:file.size,mimeType:file.type}),signal:abort.signal});
      const data=await res.json();if(!res.ok)throw new Error(res.status===401?"Please sign in on this website before uploading files.":data.error||"Could not prepare upload.");
      const uploaded=await fetch(data.uploadUrl,{method:"PUT",headers:{"Content-Type":file.type,"x-upsert":"false"},body:file,signal:abort.signal});
      if(!uploaded.ok)throw new Error("Upload failed. Check the file size and your connection, then try again.");
      if(mounted.current && !abort.signal.aborted)onChange(data.attachment);
    } catch(e) {if(mounted.current && !abort.signal.aborted)setError(e.message);}
    finally {if(mounted.current){setBusy(false);onBusy(false);}}
  }
  return <div className="fileUpload">
    <input ref={input} type="file" accept={accepts[kind]} onChange={upload} hidden/>
    <button type="button" disabled={busy} onClick={()=>input.current?.click()}>{busy?"UPLOADING…":attachment?"REPLACE FILE":"CHOOSE FILE FROM DEVICE ↑"}</button>
    <p className="hint">{kind==="video"?"MP4, WebM or MOV · up to 50 MB. MP4 works best across devices.":kind==="voice"?"MP3, M4A, WAV, OGG or WebM · up to 20 MB.":kind==="gift"?"PDF, JPG, PNG or WebP · up to 10 MB.":"Choose a photo; we prepare it for the ticket."}</p>
    {attachment && <div className="uploaded"><span>✓ {attachment.name}</span><button type="button" disabled={busy} onClick={()=>onChange(null)}>REMOVE</button><p>Attached to this coupon. Press Save coupon to keep it.</p></div>}
    {error && <p role="alert">{error}</p>}
    <style jsx>{`
      .fileUpload { margin: 18px 0; min-width: 0; }
      input[hidden] { display: none; }
      button { border: 1px solid #741020; border-radius: 24px; padding: 13px 18px; background: #741020; color: #fff4f0; font: 700 10px Arial,sans-serif; letter-spacing: .07em; white-space: normal; max-width: 100%; cursor: pointer; }
      button:disabled { opacity: .5; }
      .hint, .uploaded p { font: 12px/1.6 Arial,sans-serif; margin: 12px 0; }
      .uploaded { background: #f7dfd9; border: 1px solid #ceaaa7; padding: 14px; border-radius: 12px; overflow-wrap: anywhere; }
      .uploaded span { display: block; font: 14px/1.5 Georgia,serif; }
      .uploaded button { margin-top: 10px; background: transparent; color: #741020; padding: 8px 12px; }
      [role=alert] { font: 13px/1.5 Arial,sans-serif; }
    `}</style>
  </div>;
}

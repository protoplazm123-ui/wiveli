import {validateAttachment} from './coupon-attachments';
function fail(message){throw Object.assign(Error(message),{status:400});}
function field(value,max,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))fail('Please check your letter fields.');return value.trim();}
export function normalizeOpenWhen(data,userId){
 if(!Array.isArray(data.moments)||data.moments.length<1||data.moments.length>50)fail('Choose between 1 and 50 letters.');
 const file=(value,kind)=>value?validateAttachment(value,kind,userId):null;const ids=new Set();
 const moments=data.moments.map(m=>{const id=String(m.id);if(!/^[a-zA-Z0-9-]{1,100}$/.test(id)||ids.has(id))fail('Letter IDs must be unique.');ids.add(id);const i=m.interaction||{};
 return {id,title:field(m.title,150,true),category:field(m.category||'CUSTOM',40),message:field(m.message,5000,true),date:field(m.date||'',100),time:field(m.time||'',40),place:field(m.place||'',300),photo:file(m.photo,'photo'),video:file(m.video,'video'),voice:file(m.voice,'voice'),gift:file(m.gift,'gift'),interaction:{enabled:i.enabled===true,type:['movie','dinner','trip','repeat','custom'].includes(i.type)?i.type:'custom',question:field(i.question||'',300),text:field(i.text||'',1000),button:field(i.button||'',100),response:field(i.response||'',500)}};});
 const theme=data.theme||{},backgroundKind=theme.customBackground?.mimeType?.startsWith('video/')?'video':'photo';
 return {version:3,sender:field(data.sender,100,true),recipient:field(data.recipient,100,true),senderName:field(data.sender,100,true),recipientName:field(data.recipient,100,true),moments,theme:{id:['romantic','cosmic','tech','dreamy','custom'].includes(theme.id)?theme.id:'cosmic',accent:/^#[a-f0-9]{6}$/i.test(theme.accent||'')?theme.accent:'#8c63c7',customBackground:file(theme.customBackground,backgroundKind)},openedMoments:[],responses:[],createdAt:new Date().toISOString()};
}
export function applyLetterEvent(gift,body){
 const moment=gift.moments?.find(m=>String(m.id)===body.momentId);if(!moment)fail('Letter not found.');
 const now=new Date().toISOString(),opened=gift.openedMoments||[],responses=gift.responses||[];
 if(body.action==='open'){
  if(opened.some(x=>x.momentId===moment.id))return {gift,duplicate:true};
  return {gift:{...gift,openedMoments:[...opened,{momentId:moment.id,openedAt:now}]},kind:'letter-opened',moment,eventTime:now,message:`${gift.recipient} opened “${moment.title}” ♡`};
 }
 if(body.action!=='respond')fail('Unknown letter action.');
 if(!moment.interaction?.enabled)fail('This letter does not accept a response.');
 if(!opened.some(x=>x.momentId===moment.id))fail('Open the letter before responding.');
 if(responses.some(x=>x.momentId===moment.id))return {gift,duplicate:true};
 const details={note:field(body.note||'',2000),date:field(body.date||'',10),time:field(body.time||'',5),place:field(body.place||'',300)};
 if(details.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(details.date)||!Number.isFinite(Date.parse(details.date))||new Date(details.date).toISOString().slice(0,10)!==details.date))fail('Choose a valid date.');
 if(details.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(details.time))fail('Choose a valid time.');
 const message=moment.interaction.response||`${gift.recipient} wants to do this with you ♡`;
 const response={momentId:moment.id,momentTitle:moment.title,message,...details,createdAt:now};
 return {gift:{...gift,responses:[...responses,response]},kind:'letter-response',moment,eventTime:now,message:[message,details.note,details.date,details.time,details.place].filter(Boolean).join('\n')};
}

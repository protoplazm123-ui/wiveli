import {validateAttachment} from './coupon-attachments';
function fail(message){throw Object.assign(Error(message),{status:400});}
function string(value,max,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))fail('Please check your story fields.');return value.trim();}
export function normalizeStory(data,userId){
 if(!Array.isArray(data.memories)||data.memories.length<1||data.memories.length>50)fail('Add between 1 and 50 memories.');
 const attachment=(file,kind)=>file?validateAttachment(file,kind,userId):null;
 const ids=new Set();
 const memories=data.memories.map(m=>{const id=String(m.id);if(!/^[a-zA-Z0-9-]{1,64}$/.test(id)||ids.has(id))fail('Memory IDs must be unique.');ids.add(id);const date=string(m.date||'',10);if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))fail('Check the memory date.');return {id,title:string(m.title,150,true),date,place:string(m.place||'',300),text:string(m.text||'',5000),photo:attachment(m.photo,'photo'),video:attachment(m.video,'video'),voice:attachment(m.voice,'voice'),gift:attachment(m.gift,'gift')};});
 return {version:2,sender:string(data.sender,100,true),recipient:string(data.recipient,100,true),senderName:string(data.sender,100,true),recipientName:string(data.recipient,100,true),openingLetter:string(data.openingLetter||'',5000),openingPhoto:attachment(data.openingPhoto,'photo'),customBackground:attachment(data.customBackground,'photo'),theme:['stars','clouds','color','custom'].includes(data.theme)?data.theme:'stars',customColor:/^#[a-f0-9]{6}$/i.test(data.customColor||'')?data.customColor:'#5d347f',finalMessage:string(data.finalMessage||'',5000),memories,views:[],createdAt:new Date().toISOString()};
}
export function viewMemory(gift,memoryId){
 if(!gift.memories?.some(m=>String(m.id)===memoryId))fail('Memory not found.');
 const views=gift.views||[];if(views.some(v=>v.memoryId===memoryId))return gift;
 return {...gift,views:[...views,{memoryId,viewedAt:new Date().toISOString()}]};
}

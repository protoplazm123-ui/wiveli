import { validateCouponAttachments, validateAttachment } from "./coupon-attachments";
export const WISH_CATEGORIES = ["Dream Together", "Food & Places", "Our Time", "Little Things", "Adventures", "Something Special"];
export const WISH_CATEGORY_IDS = ["dream", "food", "time", "little", "adventures", "special"];
const icons = ["♡", "✦", "♥", "☺", "∞", "✉"];
function fail(message) { throw Object.assign(new Error(message), {status:400}); }
function text(value, max, required=false) {
  if (typeof value !== 'string' || value.length > max || required && !value.trim()) fail("Please check the Wish Note fields.");
  return value.trim();
}
export function normalizeWishGift(data, userId) {
  const count=Number(data.wishCount);
  if (!Number.isInteger(count) || count<1 || count>365) fail("Choose between 1 and 365 wishes.");
  if (!Array.isArray(data.categories) || data.categories.length!==6) fail("Six wish categories are required.");
  const holder={customCoupons:[{attachments:data.attachments || {}}]};validateCouponAttachments(holder,userId);
  return {senderName:text(data.senderName,100,true),recipientName:text(data.recipientName,100,true),message:text(data.message || '',2000),wishCount:count,
    categories:data.categories.map(c=>text(c,35,true)),style:['soft','minimal','film','dark'].includes(data.style)?data.style:'soft',caption:text(data.caption||'',200),
    attachments:holder.customCoupons[0].attachments, wishes:[],createdAt:new Date().toISOString()};
}
export function makeWish(body, gift) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.wishId||'')) fail("Invalid wish request. Please reopen the form.");
  const index=WISH_CATEGORY_IDS.indexOf(body.categoryId);
  if(index<0)fail("Choose a category.");
  const date=text(body.date,10,true), time=text(body.time||'',5);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date)fail("Choose a valid date.");
  if(time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))fail("Choose a valid time.");
  let timeZone='UTC';try {new Intl.DateTimeFormat('en',{timeZone:body.timeZone});timeZone=body.timeZone||'UTC';}catch{fail("Invalid time zone.");}
  return {id:body.wishId,category:{id:body.categoryId,name:gift.categories?.[index]||WISH_CATEGORIES[index],icon:icons[index]},text:text(body.text,1000,true),date,time,place:text(body.place||'',300),timeZone,createdAt:new Date().toISOString(),completed:false,completedAt:null,memory:null};
}
export function makeMemory(body, wish, giftId) {
  if(!Array.isArray(body.files) || body.files.length>8)fail("Choose up to eight memory files.");
  const files=body.files.map(file=>({...validateAttachment(file,file.kind,`wish-${giftId}`),kind:file.kind}));
  const now=new Date().toISOString();
  return {...wish,completed:true,completedAt:wish.completedAt||now,memory:{note:text(body.note||'',2000),files,createdAt:wish.memory?.createdAt||now,updatedAt:now}};
}

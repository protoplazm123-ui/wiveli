import { requireSession } from "./session";
import { couponIdeas } from "../experiences/love-coupons/coupons";

export class AccountError extends Error {
  constructor(message, status = 500) { super(message); this.status = status; }
}

export async function accountUser() {
  try { return (await requireSession()).user; }
  catch (error) { throw new AccountError(error.message, error.status || 500); }
}

export async function accountRows(path) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new AccountError("Gift storage is not configured.");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store",
  });
  if (!response.ok) throw new AccountError("Could not load your gifts. Please try again.");
  return response.json();
}

export function giftDetails(row) {
  const data = row.gift_data || {};
  if(row.gift_type === "open-when"){
    const moments=data.moments||[],opened=data.openedMoments||[],responses=data.responses||[];
    return {id:row.id,giftType:row.gift_type,recipientName:data.recipient||"Your recipient",senderName:data.sender||"",createdAt:validDate(data.createdAt),letterCount:moments.length,openedCount:opened.length,responseCount:responses.length,letters:moments.map(m=>({id:m.id,title:m.title,openedAt:opened.find(x=>x.momentId===m.id)?.openedAt||null,response:responses.find(x=>x.momentId===m.id)||null})),redemptions:[],unusedCoupons:[],couponCount:0,redeemedCount:0};
  }
  if(row.gift_type === "our-story"){
    const memories=data.memories||[],views=data.views||[];
    return {id:row.id,giftType:row.gift_type,recipientName:data.recipient||data.recipientName||"Your recipient",senderName:data.sender||"",createdAt:validDate(data.createdAt),memoryCount:memories.length,viewedCount:views.length,memories:memories.map(m=>({id:m.id,title:m.title,date:m.date,place:m.place,viewedAt:views.find(v=>v.memoryId===String(m.id))?.viewedAt||null})),redemptions:[],unusedCoupons:[],couponCount:0,redeemedCount:0};
  }
  if (row.gift_type === "wish-note") {
    const wishes = Array.isArray(data.wishes) ? data.wishes : [];
    return {id:row.id,giftType:row.gift_type,recipientName:data.recipientName||"Your recipient",senderName:data.senderName||"",createdAt:validDate(data.createdAt),wishCount:data.wishCount||24,createdCount:wishes.length,completedCount:wishes.filter(w=>w.completed).length,wishes,redemptions:[],unusedCoupons:[],couponCount:0,redeemedCount:0};
  }
  const custom = Array.isArray(data.customCoupons) ? data.customCoupons : [];
  const ids = [...new Set([
    ...(Array.isArray(data.couponIds) ? data.couponIds : []),
    ...custom.map(c => c.id || c.originalId).filter(Boolean),
  ])];
  const title = id => custom.find(c => (c.id || c.originalId) === id)?.title
    || couponIdeas.find(c => c.id === id)?.title || "Love Coupon";
  const redemptions = (Array.isArray(data.redemptions) ? data.redemptions : [])
    .map(r => ({ couponId: r.couponId, title: title(r.couponId), code: r.code || null,
      redeemedAt: validDate(r.redeemedAt),
      recipientResponse: Object.fromEntries(["choice", "date", "time", "place", "note", "timeZone"].filter(key => typeof r.recipientResponse?.[key] === "string").map(key => [key, r.recipientResponse[key]])) }))
    .sort((a, b) => (Date.parse(b.redeemedAt) || 0) - (Date.parse(a.redeemedAt) || 0));
  return {
    id: row.id, giftType: row.gift_type,
    recipientName: data.recipientName || "Your recipient",
    senderName: data.senderName || "",
    createdAt: validDate(data.createdAt),
    couponCount: ids.length, redeemedCount: redemptions.length,
    redemptions,
    unusedCoupons: ids.filter(id => !redemptions.some(r => r.couponId === id))
      .map(id => ({ id, title: title(id) })),
  };
}

function validDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) ? value : null;
}





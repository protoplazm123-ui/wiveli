import { NextResponse } from "next/server";
import { database, requireGiftAccess, connectionForUser, sendOnce } from "../../../../lib/gift-telegram";
import { makeWish, makeMemory } from "../../../../lib/wish-note";

export async function POST(request,{params}) {
  try {
    const {id}=await params;
    const {participants}=await requireGiftAccess(request,id);
    const [row]=await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.wish-note&select=gift_data&limit=1`);
    if(!row)return NextResponse.json({error:"Wish Note not found."},{status:404});
    const body=await request.json(),gift=row.gift_data||{},wishes=gift.wishes||[];
    const existing=wishes.find(w=>w.id===body.wishId);
    let wish,kind;
    if(body.action==='create') {
      if(existing)return NextResponse.json({success:true,wish:existing,wishes});
      if(wishes.length>=gift.wishCount)return NextResponse.json({error:"All wish spaces have been filled."},{status:409});
      wish=makeWish(body,gift);kind='wish-created';
    } else if(body.action==='memory') {
      if(!existing)return NextResponse.json({error:"Wish not found."},{status:404});
      wish=makeMemory(body,existing,id);kind='wish-completed';
    } else return NextResponse.json({error:"Unknown Wish Note action."},{status:400});
    const updated={...gift,wishes:existing?wishes.map(w=>w.id===wish.id?wish:w):[...wishes,wish]};
    const eventKey=`${kind}:${id}:${wish.id}`;
    const saved=await database('rpc/wiveli_save_wish_note',{method:'POST',body:JSON.stringify({p_gift_id:id,p_expected:gift,p_updated:updated,p_event_key:eventKey,p_kind:kind,p_wish_id:wish.id})});
    if(!saved.length)return NextResponse.json({error:"Someone updated this gift. Refresh it and try again."},{status:409});
    let notification={sent:false};
    try {
      const sender=participants.find(p=>p.role==='sender'),connection=await connectionForUser(sender?.user_id);
      if(connection?.telegram_chat_id) notification=await sendOnce({key:eventKey,giftId:id,userId:sender.user_id,payload:{chat_id:connection.telegram_chat_id,text:`♡ WIVELI · Wish Note\n\n${gift.recipientName} ${kind==='wish-created'?'made a wish':'completed a wish'}:\n${wish.text}\n${wish.date}${wish.time?' · '+wish.time:''}${wish.place?'\n'+wish.place:''}`,reply_markup:{inline_keyboard:[[{text:'OPEN YOUR ACCOUNT →',url:new URL(request.url).origin+'/account'}]]}}});
    } catch { /* The wish and Inbox event are already saved atomically. */ }
    return NextResponse.json({success:true,wish,wishes:updated.wishes,notification},{headers:{'Cache-Control':'private, no-store'}});
  } catch(error) {return NextResponse.json({error:error.message||'Could not save wish.'},{status:error.status||500});}
}

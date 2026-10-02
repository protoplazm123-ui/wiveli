import {NextResponse} from 'next/server';
import {database,requireGiftAccess,currentUser} from '../../../../../lib/gift-telegram';
import {viewMemory} from '../../../../../lib/our-story';
export async function POST(request,{params}){
 try{
 const {id}=await params;const {participants}=await requireGiftAccess(request,id,true);let user;try{user=await currentUser();}catch{}
 if(user&&participants.some(p=>p.role==='sender'&&p.user_id===user.id))return NextResponse.json({preview:true});
 const {memoryId}=await request.json();if(typeof memoryId!=='string')return NextResponse.json({error:'Invalid memory.'},{status:400});
 for(let attempt=0;attempt<3;attempt++){
 const [row]=await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.our-story&select=gift_data&limit=1`);if(!row)return NextResponse.json({error:'Story not found.'},{status:404});
 const updated=viewMemory(row.gift_data,memoryId);if(updated===row.gift_data)return NextResponse.json({views:updated.views});
 const result=await database('rpc/wiveli_save_story_progress',{method:'POST',body:JSON.stringify({p_gift_id:id,p_expected:row.gift_data,p_updated:updated})});
 if(result.length)return NextResponse.json({views:updated.views},{headers:{'Cache-Control':'private, no-store'}});
 }
 return NextResponse.json({error:'Please reopen the memory to save its viewed status.'},{status:409});
 }catch(e){return NextResponse.json({error:e.message},{status:e.status||500});}
}

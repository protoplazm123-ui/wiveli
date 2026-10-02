import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=p=>readFileSync(new URL('../app/'+p,import.meta.url),'utf8');
const clean=s=>s.replace(/^import .*;\n/gm,'').replaceAll('export ','');
const ID='22222222-2222-4222-8222-222222222222';
const wishId='33333333-3333-4333-8333-333333333333';
const input={senderName:'Julia',recipientName:'Sam',wishCount:24,categories:['a','b','c','d','e','f'],attachments:{},message:'A wish for you'};
function context(extra={}){const c=vm.createContext({URL,console,process:{env:{SUPABASE_URL:'https://db.test',SUPABASE_SECRET_KEY:'service'}},NextResponse:{json:(body,opts)=>({body,status:opts?.status||200})},...extra});for(const file of ['lib/coupon-attachments.js','lib/wish-note.js','lib/gift-links.js'])vm.runInContext(clean(read(file)),c);return c;}
const body={action:'create',wishId,categoryId:'dream',text:'Watch a film',date:'2026-12-01',time:'19:30',place:'Home',timeZone:'Europe/Paris'};
test('Wish Note validates settings, removes client supplied history and preserves attachments',()=>{const c=context();const gift=c.normalizeWishGift({...input,wishes:[{fake:true}]},'sender');assert.equal(gift.wishes.length,0);assert.equal(gift.recipientName,'Sam');assert.throws(()=>c.normalizeWishGift({...input,wishCount:500},'sender'));assert.throws(()=>c.normalizeWishGift({...input,categories:[]},'sender'));});
test('wish planning fields are validated and category comes from gift',()=>{const c=context();const w=c.makeWish(body,{...input});assert.equal(w.category.name,'a');assert.equal(w.place,'Home');assert.equal(w.timeZone,'Europe/Paris');for(const patch of [{date:'2026-02-30'},{time:'25:00'},{wishId:'bad'},{categoryId:'other'}])assert.throws(()=>c.makeWish({...body,...patch},input));});
function api(options={}) {
 const gift={...input,wishes:options.wishes||[]};let writes=0,sends=0;const events=[];
 const c=context({requireGiftAccess:async()=>{if(options.denied)throw Object.assign(Error('Bad link'),{status:403});return {participants:[{role:'sender',user_id:'sender'}]};},database:async(path,opts)=>{if(path.startsWith('gifts?'))return [{gift_data:gift}];if(path==='rpc/wiveli_save_wish_note'){writes++;const data=JSON.parse(opts.body);events.push(data);if(options.conflict)return [];Object.assign(gift,data.p_updated);return [{gift_data:gift}];}throw Error(path);},connectionForUser:async()=>({telegram_chat_id:123}),sendOnce:async()=>{sends++;if(options.botFails)throw Error('Offline');return {sent:true};}});
 vm.runInContext(clean(read('api/gifts/[id]/wish-note/route.js')),c);
 return {run:b=>c.POST({url:'https://site.test/api',json:async()=>b},{params:Promise.resolve({id:ID})}),gift,events,writes:()=>writes,sends:()=>sends};
}
test('guest wish is durable, creates Inbox event and bot notification; retries do not duplicate',async()=>{const s=api();const result=await s.run(body);assert.equal(result.status,200);assert.equal(s.gift.wishes[0].text,'Watch a film');assert.equal(s.events[0].p_kind,'wish-created');assert.equal(s.sends(),1);assert.equal((await s.run(body)).status,200);assert.equal(s.writes(),1);});
test('invalid access or full wish book never writes',async()=>{const denied=api({denied:true});assert.equal((await denied.run(body)).status,403);assert.equal(denied.writes(),0);const full=api({wishes:Array.from({length:24},(_,i)=>({id:String(i)}))});assert.equal((await full.run(body)).status,409);assert.equal(full.writes(),0);});
test('concurrent conflict sends no bot message, bot failure leaves saved wish intact',async()=>{const conflict=api({conflict:true});assert.equal((await conflict.run(body)).status,409);assert.equal(conflict.sends(),0);const offline=api({botFails:true});assert.equal((await offline.run(body)).status,200);assert.equal(offline.gift.wishes.length,1);});
test('memory files are confined to the same gift and completed event is recorded',async()=>{const file={path:`wish-${ID}/photo/${wishId}.jpg`,mimeType:'image/jpeg',size:100,name:'Us.jpg',kind:'photo'};const s=api({wishes:[{id:wishId,text:'A day',date:'2026-12-01',completed:false}]});assert.equal((await s.run({action:'memory',wishId,note:'Lovely',files:[file]})).status,200);assert.equal(s.gift.wishes[0].completed,true);assert.equal(s.events[0].p_kind,'wish-completed');assert.equal((await s.run({action:'memory',wishId,note:'',files:[{...file,path:file.path.replace(ID,'other')}]})).status,400);});
test('Telegram links preserve type and cannot point at an arbitrary path',()=>{const c=context();assert.equal(c.giftPath('wish-note',ID),`/gift/wish-note/${ID}`);assert.equal(c.giftPath('love-coupons',ID),`/gift/love-coupons/${ID}`);assert.throws(()=>c.giftPath('../../evil',ID));});
test('account projection counts wishes and completed memories separately from coupons',()=>{const c=context({couponIdeas:[]});vm.runInContext(clean(read('lib/account-gifts.js')),c);const g=c.giftDetails({id:ID,gift_type:'wish-note',gift_data:{...input,wishes:[{id:wishId,completed:true}]}});assert.equal(g.createdCount,1);assert.equal(g.completedCount,1);assert.equal(g.wishCount,24);assert.equal(g.redemptions.length,0);});
function filesApi({denied=false,foreign=false}={}) {
 let signs=0;const file={path:`wish-${foreign?'other':ID}/photo/${wishId}.jpg`,mimeType:'image/jpeg',size:100,name:'Memory.jpg',kind:'photo'};
 const c=context({randomUUID:()=>wishId,requireGiftAccess:async()=>{if(denied)throw Object.assign(Error('Denied'),{status:403});return {participants:[{role:'sender',user_id:'sender'}]};},database:async()=>[{id:ID,gift_data:{wishes:[{id:wishId,memory:{files:[file]}}]}}],attachmentStorage:async(path)=>{signs++;return {url:'/upload',signedURL:'/view'};},storageUrl:p=>'https://storage.test'+p});
 return {c,signs:()=>signs};
}
test('guest memory upload is confined to the authorized gift namespace',async()=>{
 const s=filesApi();vm.runInContext(clean(read('api/gifts/[id]/wish-note/uploads/route.js')),s.c);
 const r=await s.c.POST({json:async()=>({kind:'photo',mimeType:'image/jpeg',size:100,name:'Us.jpg'})},{params:{id:ID}});
 assert.equal(r.status,200);assert.equal(r.body.attachment.path,`wish-${ID}/photo/${wishId}.jpg`);assert.equal(s.signs(),1);
});
test('missing gift access cannot upload or view private files',async()=>{
 for(const [route,method] of [['uploads','POST'],['attachments','GET']]){const s=filesApi({denied:true});vm.runInContext(clean(read(`api/gifts/[id]/wish-note/${route}/route.js`)),s.c);const r=await s.c[method]({url:'https://site.test/api'},{params:{id:ID}});assert.equal(r.status,403);assert.equal(s.signs(),0);}
});
test('memory viewing signs stored files only and rejects another gift namespace',async()=>{
 for(const foreign of [false,true]){const s=filesApi({foreign});vm.runInContext(clean(read('api/gifts/[id]/wish-note/attachments/route.js')),s.c);const r=await s.c.GET({url:`https://site.test/api?wishId=${wishId}`},{params:{id:ID}});assert.equal(r.status,200);assert.equal(s.signs(),foreign?0:1);assert.equal(Boolean(r.body.attachments[0].url),!foreign);}
});

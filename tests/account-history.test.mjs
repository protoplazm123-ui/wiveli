import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read = p => readFileSync(new URL('../app/'+p,import.meta.url),'utf8');
const clean = s => s.replace(/^import .*;\n/gm,'').replaceAll('export ','');
function context(extra={}) { return vm.createContext({console, process:{env:{SUPABASE_URL:'https://db.test',NEXT_PUBLIC_SUPABASE_ANON_KEY:'anon'}},couponIdeas:[{id:'movie',title:'Movie night'}],NextResponse:{json:(body,options)=>({body,status:options?.status||200})},...extra}); }
test('answers are trimmed, whitelisted and validated',()=>{
 const c=context();vm.runInContext(clean(read('lib/recipient-response.js')),c);
 assert.equal(c.normalizeRecipientResponse({choice:'  Film  ',secret:'hidden'}).choice,'Film');
 assert.equal(c.normalizeRecipientResponse({secret:'hidden'}).secret,undefined);
 for(const v of [{date:'2026-02-30'},{time:'25:00'},{note:'x'.repeat(2001)},[]]) assert.throws(()=>c.normalizeRecipientResponse(v));
 assert.equal(Object.keys(c.normalizeRecipientResponse(undefined)).length,0);
});
test('history retains answers and use time, resolves titles and excludes used coupons',()=>{
 const c=context();vm.runInContext(clean(read('lib/account-gifts.js')),c);
 const gift=c.giftDetails({id:'one',gift_data:{couponIds:['movie','dinner'],redemptions:[{couponId:'movie',redeemedAt:'2026-10-02T12:00:00Z',recipientResponse:{choice:'Film',date:'2026-10-05',place:'Cinema',secret:'hidden'}}]}});
 assert.equal(gift.redemptions[0].title,'Movie night');assert.equal(gift.redemptions[0].recipientResponse.place,'Cinema');assert.equal(gift.redemptions[0].recipientResponse.secret,undefined);assert.equal(gift.unusedCoupons.length,1);assert.equal(gift.redemptions[0].redeemedAt,'2026-10-02T12:00:00Z');
 assert.equal(c.giftDetails({gift_data:{}}).redemptions.length,0);
});
test('unauthenticated account cannot read storage',async()=>{
 const c=context({cookies:async()=>({get:()=>undefined}),fetch:()=>{throw Error('must not fetch')}});vm.runInContext(clean(read('lib/account-gifts.js')),c);
 await assert.rejects(c.accountUser(),e=>e.status===401);
});
test('detail requires sender membership before reading gift',async()=>{
 const calls=[];const c=context({accountUser:async()=>({id:'owner'}),accountRows:async p=>{calls.push(p);return []}});
 vm.runInContext('class AccountError extends Error { constructor(m,status){super(m);this.status=status;} }\n'+clean(read('api/account/gifts/[id]/route.js')),c);
 const result=await c.GET({}, {params:Promise.resolve({id:'other'})});assert.equal(result.status,404);assert.equal(calls.length,1);assert.match(calls[0],/user_id=eq.owner&role=eq.sender/);
});
test('list contains only sender gifts sorted newest first',async()=>{
 const c=context({accountUser:async()=>({id:'owner',email:'x@y'}),accountRows:async p=>p.startsWith('gift_participants')?[{gift_id:'a'},{gift_id:'b'}]:[{id:'a',gift_data:{createdAt:'2026-01-01'}},{id:'b',gift_data:{createdAt:'2026-10-01'}},{id:'intruder',gift_data:{}}]});
 vm.runInContext(clean(read('lib/account-gifts.js')),c);
 // Replace storage/auth with mocks after loading shared projection.
 c.accountUser=async()=>({id:'owner',email:'x@y'});c.accountRows=async p=>p.startsWith('gift_participants')?[{gift_id:'a'},{gift_id:'b'}]:[{id:'a',gift_data:{createdAt:'2026-01-01'}},{id:'b',gift_data:{createdAt:'2026-10-01'}},{id:'intruder',gift_data:{}}];
 vm.runInContext(clean(read('api/account/gifts/route.js')),c);
 const result=await c.GET();assert.equal(result.status,200);assert.equal(result.body.gifts.length,2);assert.equal(result.body.gifts[0].id,'b');assert.equal(result.body.gifts[0].redemptions,undefined);
});

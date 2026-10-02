import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read = path => readFileSync(new URL('../app/'+path,import.meta.url),'utf8');
const clean = source => source.replace(/^import .*;\n/gm,'').replaceAll('export ','');
const response = (body,status=200) => ({ok:status>=200&&status<300,status,json:async()=>body});
const context = (extra={}) => vm.createContext({console,Buffer,URL,process:{env:{SUPABASE_URL:'https://db.test',SUPABASE_SECRET_KEY:'service',NEXT_PUBLIC_SUPABASE_ANON_KEY:'anon'}},NextResponse:{json:(body,options)=>({body,status:options?.status||200})},...extra});
const load=(c,p)=>vm.runInContext(clean(read(p)),c);
const user={id:'sender',email:'old@example.com',user_metadata:{name:'Julia',avatar_url:''}};
const session=async()=>({user,accessToken:'verified'});
test('expired access token refreshes and writes both secure session cookies',async()=>{
 const writes=[];const c=context({cookies:async()=>({get:n=>({value:n.includes('refresh')?'refresh':'expired'}),set:(...args)=>writes.push(args)}),fetch:async url=>url.includes('grant_type=refresh_token')?response({user,access_token:'fresh',refresh_token:'rotated',expires_in:3600}):response({},401)});
 load(c,'lib/session.js');const result=await c.requireSession();assert.equal(result.user.id,'sender');assert.equal(result.accessToken,'fresh');assert.equal(writes.length,2);assert.equal(writes[0][2].httpOnly,true);assert.equal(writes[0][2].path,'/');
});
test('missing session fails before any auth or storage write',async()=>{
 const c=context({cookies:async()=>({get:()=>undefined}),fetch:()=>assert.fail('unexpected fetch')});load(c,'lib/session.js');await assert.rejects(c.requireSession(),e=>e.status===401);
});
test('concurrent refreshes share the rotation',async()=>{
 let calls=0;const c=context({cookies:async()=>({get:n=>n.includes('refresh')?{value:'refresh'}:undefined,set:()=>{}}),fetch:async()=>{calls++;return response({user,access_token:'a',refresh_token:'b'});}});load(c,'lib/session.js');await Promise.all([c.requireSession(),c.requireSession()]);assert.equal(calls,1);
});
test('auth outage does not silently turn into successful sign in',async()=>{
 const c=context({cookies:async()=>({get:()=>({value:'token'})}),fetch:async()=>response({},503)});load(c,'lib/session.js');await assert.rejects(c.requireSession(),e=>e.status===503);
});
test('profile changes use the verified user token and show pending email',async()=>{
 let sent;const c=context({requireSession:session,publicProfile:u=>({name:u.user_metadata.name,email:u.email,avatar:''}),fetch:async(url,options)=>{sent=options;return response({...user,user_metadata:{name:'New name'}});}});load(c,'api/account/profile/route.js');const result=await c.PUT({json:async()=>({name:'New name',email:'new@example.com',avatar:''})});assert.equal(result.status,200);assert.equal(result.body.emailConfirmationRequired,true);assert.equal(sent.headers.Authorization,'Bearer verified');assert.equal(JSON.parse(sent.body).email,'new@example.com');
});
test('foreign photo URL rejected before updating account',async()=>{
 const c=context({requireSession:session,publicProfile:()=>({avatar:''}),fetch:()=>assert.fail('unexpected write')});load(c,'api/account/profile/route.js');assert.equal((await c.PUT({json:async()=>({name:'Name',email:'a@b.com',avatar:'https://db.test/storage/v1/object/public/wiveli-avatars/other/photo.jpg'})})).status,400);
});
test('avatar rejects non-image bytes and enforces login',async()=>{
 const c=context({requireSession:session,fetch:()=>assert.fail('unexpected upload')});load(c,'api/account/avatar/route.js');const request={headers:{get:()=>null},formData:async()=>({get:()=>({size:20,arrayBuffer:async()=>Buffer.from('<script>not a photo</script>')})})};assert.equal((await c.POST(request)).status,400);
 c.requireSession=async()=>{throw Object.assign(new Error('Sign in'),{status:401})};assert.equal((await c.POST(request)).status,401);
});
test('avatar path always belongs to authenticated user',async()=>{
 let uploaded;const c=context({requireSession:session,randomUUID:()=> '00000000-0000-4000-8000-000000000000',fetch:async(url)=>{uploaded=url;return response({});}});load(c,'api/account/avatar/route.js');const bytes=Buffer.concat([Buffer.from([255,216,255]),Buffer.alloc(20)]);const result=await c.POST({headers:{get:()=>null},formData:async()=>({get:()=>({size:bytes.length,arrayBuffer:async()=>bytes})})});assert.equal(result.status,200);assert.match(uploaded,/wiveli-avatars\/sender\//);
});
test('connect preserves an already connected Telegram account',async()=>{
 const c=context({requireSession:session,connectionForUser:async()=>({telegram_chat_id:1}),database:()=>assert.fail('must not delete/recreate')});load(c,'api/telegram/connect/route.js');assert.equal((await c.POST()).body.connected,true);
});
test('new Telegram code has expiry and is tied to authenticated user',async()=>{
 let saved;const c=context({requireSession:session,connectionForUser:async()=>null,randomBytes:()=>({toString:()=> 'a'.repeat(48)}),database:async(path,options)=>{saved=JSON.parse(options.body);return [];}});load(c,'api/telegram/connect/route.js');const result=await c.POST();assert.equal(saved.user_id,'sender');assert.ok(Date.parse(saved.expires_at)>Date.now());assert.match(result.body.url,/start=a{48}$/);
});
test('Inbox reads and marks only current user messages',async()=>{
 const paths=[];const c=context({requireSession:session,database:async p=>{paths.push(p);return []}});load(c,'api/account/inbox/route.js');assert.equal((await c.GET({url:'https://site.test/api/account/inbox'})).status,200);await c.PATCH({json:async()=>({id:'other-message'})});assert.ok(paths.every(p=>p.includes('user_id=eq.sender')));
});
test('opening is saved in Inbox even when bot is unavailable',async()=>{
 const saved=[];const c=context({requireGiftAccess:async()=>({participants:[{role:'sender',user_id:'sender'}]}),currentUser:async()=>{throw Error('guest')},database:async(p,o)=>{if(p.startsWith('gifts?'))return [{gift_data:{}}];saved.push(JSON.parse(o.body));return [];},notifyGiftOpened:async()=>{throw Error('bot offline')}});load(c,'api/gifts/[id]/opened/route.js');const result=await c.POST({url:'https://site.test/api/gifts/g/opened'},{params:Promise.resolve({id:'g'})});assert.equal(result.status,200);assert.equal(saved[0].event_key,'opened:g');assert.equal(result.body.inboxSaved,true);
});
test('signup establishes session only when Supabase returns a session',async()=>{
 for (const authenticated of [true,false]) {
   const writes=[];const c=context({setSessionCookies:(store,data)=>writes.push(data),NextResponse:{json:body=>({body,cookies:{}})},fetch:async()=>response(authenticated?{access_token:'access',refresh_token:'refresh'}:{id:'new-user'})});
   load(c,'api/auth/signup/route.js');const result=await c.POST({json:async()=>({email:'new@example.com',password:'long-password'})});assert.equal(result.body.authenticated,authenticated);assert.equal(writes.length,authenticated?1:0);
 }
});
test('bot account connection only consumes codes in a private chat',async()=>{
 let calls=0;const c=context({supabaseRequest:async(path,options)=>{calls++;assert.equal(path,'/rest/v1/rpc/wiveli_connect_telegram');assert.equal(JSON.parse(options.body).p_chat_id,42);return true;}});
 const src=read('api/telegram/webhook/route.js');vm.runInContext(src.slice(src.indexOf('async function connectAccount('),src.indexOf('async function supabaseRequest(')),c);
 assert.equal(await c.connectAccount('a'.repeat(48),{chat:{id:42,type:'group'}}),false);
 assert.equal(await c.connectAccount('invalid',{chat:{id:42,type:'private'}}),false);
 assert.equal(await c.connectAccount('a'.repeat(48),{chat:{id:42,type:'private'},from:{id:42}}),true);assert.equal(calls,1);
});

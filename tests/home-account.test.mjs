import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=p=>readFileSync(new URL('../app/'+p,import.meta.url),'utf8');
const clean=s=>s.replace(/^import .*;\n/gm,'').replaceAll('export ','');
function client(status,body) {const c=vm.createContext({fetch:async(url,opts)=>{assert.equal(url,'/api/auth/me');assert.equal(opts.cache,'no-store');assert.equal(opts.credentials,'same-origin');return {status,ok:status===200,json:async()=>body};}});vm.runInContext(clean(read('lib/browser-profile.js')),c);return c;}
test('verified session supplies the header name and avatar',async()=>{const c=client(200,{authenticated:true,id:'u',name:'Julia',avatar:'https://example.test/photo.jpg'});const p=await c.fetchProfile();assert.equal(p.name,'Julia');assert.equal(p.avatar,'https://example.test/photo.jpg');});
test('only a genuine unauthorized response shows guest links',async()=>{assert.equal(await client(401,{}).fetchProfile(),null);await assert.rejects(client(503,{}).fetchProfile());});
test('malformed success cannot masquerade as a guest or authenticated account',async()=>{await assert.rejects(client(200,{authenticated:false}).fetchProfile());});
test('home account lookup refreshes an expired session instead of requesting login',async()=>{
 const writes=[];let rotated=0;
 const c=vm.createContext({process:{env:{SUPABASE_URL:'https://db.test',NEXT_PUBLIC_SUPABASE_ANON_KEY:'anon'}},cookies:async()=>({get:name=>({value:name.includes('refresh')?'refresh':'expired'}),set:(...args)=>writes.push(args)}),fetch:async url=>url.includes('grant_type=refresh_token')?(rotated++,{ok:true,json:async()=>({access_token:'fresh',refresh_token:'new-refresh',user:{id:'u',email:'j@example.test',user_metadata:{name:'Julia'}}})}):{ok:false,status:401},NextResponse:{json:(body,options)=>({body,status:options?.status||200})}});
 vm.runInContext(clean(read('lib/session.js')),c);vm.runInContext(clean(read('api/auth/me/route.js')),c);const r=await c.GET();assert.equal(r.status,200);assert.equal(r.body.name,'Julia');assert.equal(rotated,1);assert.equal(writes.length,2);assert.equal(writes[1][2].maxAge,2592000);
});

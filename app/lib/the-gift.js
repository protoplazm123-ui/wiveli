import { validateAttachment } from './coupon-attachments';
import { GIFT_THEMES } from './the-gift-theme';
export const REWARD_KINDS = {PHOTO:'photo',VIDEO:'video',VOICE:'voice',SURPRISE:'gift'};
function fail(message) { throw Object.assign(new Error(message),{status:400}); }
function field(value,max,required=false) { if(typeof value!=='string'||value.length>max||(required&&!value.trim()))fail('Please check the gift fields.');return value.trim(); }
export function safeRewardUrl(value) {
  if(!value)return '';
  try {const url=new URL(value);if(!['http:','https:'].includes(url.protocol))fail('Use an https:// or http:// link.');return url.href;}catch {fail('Use a valid https:// or http:// link.');}
}
export function normalizeTheGift(data,userId) {
  if(!Array.isArray(data.steps)||data.steps.length<1||data.steps.length>50)fail('Add between 1 and 50 gifts.');
  const ids=new Set();
  const steps=data.steps.map(step=>{
    const id=field(step.id,100,true);
    if(!/^[a-zA-Z0-9-]+$/.test(id)||ids.has(id))fail('Gift step IDs must be unique.');ids.add(id);
    const rewardType=field(step.rewardType,30,true);
    if(!['LETTER','PHOTO','VIDEO','VOICE','LINK','SURPRISE'].includes(rewardType))fail('Choose a supported reward type.');
    const kind=REWARD_KINDS[rewardType];
    const attachment=step.attachment&&kind?validateAttachment(step.attachment,kind,userId):null;
    const rewardUrl=safeRewardUrl(field(step.rewardUrl||'',2000));
    if(['PHOTO','VIDEO','VOICE'].includes(rewardType)&&!attachment&&!rewardUrl)fail('Upload a file for this gift.');
    if(rewardType==='LINK'&&!rewardUrl)fail('Add a link for this gift.');
    const rewardText=field(step.rewardText||'',10000);
    if(rewardType==='LETTER'&&!rewardText)fail('Write your letter.');
    if(rewardType==='SURPRISE'&&!rewardText&&!attachment&&!rewardUrl)fail('Add a message or file for your surprise.');
    return {id,question:field(step.question,500,true),answer:field(step.answer,500,true),hint:field(step.hint||'',1000),rewardType,rewardTitle:field(step.rewardTitle,200,true),rewardText,rewardUrl,attachment};
  });
  return {version:2,senderName:field(data.senderName,100,true),recipientName:field(data.recipientName,100,true),introMessage:field(data.introMessage||'',2000),finalMessage:field(data.finalMessage||'',2000),theme:Object.hasOwn(GIFT_THEMES,data.theme)?data.theme:'romantic',steps,createdAt:new Date().toISOString()};
}
export function publicTheGift(data) {
  return {senderName:data.senderName||'',recipientName:data.recipientName||'',introMessage:data.introMessage||'',finalMessage:data.finalMessage||'',theme:data.theme||'romantic',steps:(data.steps||[]).map(s=>({id:s.id,question:s.question,hint:s.hint})),createdAt:data.createdAt||null};
}
export function unlockedReward(data,stepId,answer) {
  const step=data.steps?.find(s=>String(s.id)===String(stepId));
  if(!step)fail('This gift step was not found.');
  if(typeof answer!=='string'||answer.length>500||answer.trim().toLocaleLowerCase()!==String(step.answer||'').trim().toLocaleLowerCase())return null;
  return {id:step.id,rewardType:step.rewardType,rewardTitle:step.rewardTitle,rewardText:step.rewardText,rewardUrl:safeRewardUrl(step.rewardUrl||''),attachment:step.attachment||null};
}

export function giftPath(type,id) {
  if (!['love-coupons','wish-note','our-story','open-when'].includes(type)) throw Object.assign(new Error('This gift type is not supported by Telegram yet.'),{status:400});
  return `/gift/${type}/${encodeURIComponent(id)}`;
}



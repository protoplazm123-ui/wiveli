export const GIFT_THEMES = {
  romantic: {name:'Romantic', background:'#f7f0e8', paper:'#fffaf5', accent:'#743747', ink:'#30232b', soft:'#ead3d8'},
  cosmic: {name:'Cosmic', background:'#100b1b', paper:'#24172f', accent:'#d1acee', ink:'#f5eafa', soft:'#493456'},
  dreamy: {name:'Dreamy', background:'#eee8f6', paper:'#faf6ff', accent:'#765197', ink:'#392b48', soft:'#dcd0ed'},
  tech: {name:'Tech / Future', background:'#091a22', paper:'#132c37', accent:'#8addeb', ink:'#edfaff', soft:'#244650'},
};
export function giftTheme(id) { return Object.hasOwn(GIFT_THEMES,id) ? GIFT_THEMES[id] : GIFT_THEMES.romantic; }

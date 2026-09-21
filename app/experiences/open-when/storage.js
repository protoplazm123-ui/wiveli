const DB = 'wiveli-open-when';
function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('journals');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Close other WIVELI tabs and try again.'));
  });
}
export async function loadDraft() {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('journals').objectStore('journals').get('draft');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
let saveQueue = Promise.resolve();
export function saveDraft(draft) {
  const next = saveQueue.catch(() => {}).then(() => writeDraft(draft));
  saveQueue = next;
  return next;
}
async function writeDraft(draft) {
  const db = await database();
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('journals', 'readwrite');
      transaction.objectStore('journals').put(draft, 'draft');
      transaction.oncomplete = resolve;
      transaction.onabort = () => reject(transaction.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } finally { db.close(); }
}
export function readDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('This file could not be read. Please try another.'));
    reader.readAsDataURL(file);
  });
}
export async function readMedia(file, kind) {
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  const isAudio = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm'].includes(file.type);
  if (kind === 'photo' && !isImage) throw new Error('Choose a JPG, PNG, or WebP photo.');
  if (kind === 'audio' && !isAudio) throw new Error('Choose an MP3, M4A, WAV, OGG, or WebM recording.');
  if (kind === 'attachment' && !isImage && file.type !== 'application/pdf') throw new Error('Choose a JPG, PNG, WebP, or PDF ticket or reservation.');
  if (file.size > (kind === 'photo' ? 15 : 5) * 1024 * 1024) throw new Error(`Choose a file smaller than ${kind === 'photo' ? '15' : '5'} MB.`);
  const data = await readDataURL(file);
  if (kind !== 'photo') return { data, name: file.name, type: file.type };
  // Photos are resized; tickets/QR codes retain the original file and resolution.
  const image = new Image();
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('This photo could not be opened. Try a JPG or PNG.')); image.src = data; });
  const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { data: canvas.toDataURL('image/jpeg', 0.86), name: file.name, type: 'image/jpeg' };
}

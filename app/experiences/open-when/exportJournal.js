import { renderToStaticMarkup } from 'react-dom/server';
import Journal from './Journal';
import { readDataURL } from './storage';

export async function exportJournal(gift) {
  // Include the same rendered reader and styles, with no app, tracking, or scripts.
  // Only selected entries and their active variants are rendered into the file.
  let css = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try { css += Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n'); }
    catch { /* Third-party styles are not part of this journal. */ }
  }
  if (!css.includes('envelope')) throw new Error('Journal styles are still loading. Please try again.');
  const response = await fetch('/assets/open-when/Caveat.ttf');
  if (!response.ok) throw new Error('The journal font could not be loaded. Please try again.');
  const font = await readDataURL(await response.blob());
  const licenseResponse = await fetch('/assets/open-when/OFL.txt');
  if (!licenseResponse.ok) throw new Error('The font license could not be loaded. Please try again.');
  css += '\n/* Bundled Caveat font license:\n' + (await licenseResponse.text()).replace(/\*\//g, '* /') + '\n*/';
  css = css.replace(/url\(["']?\/assets\/open-when\/Caveat\.ttf["']?\)/g, `url('${font}')`);
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>A little book of care — WIVELI</title><style>' + css.replace(/<\/style/gi, '<\\/style') + '</style></head><body>' + renderToStaticMarkup(<Journal gift={gift} />) + '</body></html>';
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  return { url: URL.createObjectURL(blob), name: 'a-little-book-of-care.html' };
}

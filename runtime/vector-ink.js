/* CLF Vector Ink v0.11. Original single-stroke SVG glyphs.
 * Deterministic timeline projection, not a font conversion or an arbitrary SVG parser.
 * No third-party runtime; unsupported characters use a visible fallback glyph.
 */
(function(root){
 'use strict';
 const G=Object.freeze({
  '0':'M1 1 Q4 -1 5 3 L5 8 Q2 11 1 8 Z',
  '1':'M1 3 L3 1 L3 9 M1 9 L5 9',
  '2':'M1 2 Q3 -1 5 2 Q6 4 1 9 L5 9',
  '3':'M1 1 L5 1 L3 5 Q7 4 5 8 Q3 11 1 8',
  '4':'M4 9 L4 1 L1 6 L6 6',
  '5':'M5 1 L1 1 L1 5 Q6 2 5 7 Q5 10 1 9',
  '6':'M5 1 Q1 2 1 6 Q1 11 5 9 Q7 5 1 5',
  '7':'M1 1 L6 1 L3 9',
  '8':'M3 5 Q-1 3 2 1 Q5 -1 5 3 Q5 4 3 5 Q0 5 1 8 Q3 11 5 8 Q6 6 3 5',
  '9':'M5 5 Q1 7 1 3 Q1 0 4 1 Q7 3 4 9',
  'A':'M0 9 L3 1 L6 9 M1 6 L5 6',
  'B':'M1 1 L1 9 M1 1 L4 1 Q7 3 4 5 L1 5 M4 5 Q7 7 4 9 L1 9',
  'C':'M6 2 Q2 -1 1 4 L1 7 Q3 11 6 8',
  'D':'M1 1 L1 9 M1 1 Q6 0 6 5 Q6 10 1 9',
  'E':'M6 1 L1 1 L1 9 L6 9 M1 5 L5 5',
  'F':'M1 9 L1 1 L6 1 M1 5 L5 5',
  'G':'M6 2 Q2 -1 1 4 L1 7 Q3 11 6 8 L6 5 L4 5',
  'H':'M1 1 L1 9 M6 1 L6 9 M1 5 L6 5',
  'I':'M1 1 L5 1 M3 1 L3 9 M1 9 L5 9',
  'J':'M5 1 L5 7 Q5 11 1 8',
  'K':'M1 1 L1 9 M6 1 L1 5 L6 9',
  'L':'M1 1 L1 9 L6 9',
  'M':'M0 9 L0 1 L3 5 L6 1 L6 9',
  'N':'M1 9 L1 1 L6 9 L6 1',
  'O':'M3 1 Q0 1 1 5 Q1 9 3 9 Q6 9 6 5 Q6 1 3 1',
  'P':'M1 9 L1 1 L4 1 Q7 3 4 5 L1 5',
  'Q':'M3 1 Q0 1 1 5 Q1 9 3 9 Q6 9 6 5 Q6 1 3 1 M4 7 L7 10',
  'R':'M1 9 L1 1 L4 1 Q7 3 4 5 L1 5 M4 5 L6 9',
  'S':'M6 2 Q1 -1 1 4 Q1 5 4 5 Q8 9 1 9',
  'T':'M0 1 L6 1 M3 1 L3 9',
  'U':'M1 1 L1 7 Q3 11 5 7 L5 1',
  'V':'M0 1 L3 9 L6 1',
  'W':'M0 1 L1 9 L3 5 L5 9 L6 1',
  'X':'M0 1 L6 9 M6 1 L0 9',
  'Y':'M0 1 L3 5 L6 1 M3 5 L3 9',
  'Z':'M0 1 L6 1 L0 9 L6 9',
  '+':'M0 5 L6 5 M3 2 L3 8',
  '-':'M0 5 L6 5',
  '=':'M0 3 L6 3 M0 7 L6 7',
  '*':'M0 2 L6 8 M6 2 L0 8 M3 1 L3 9',
  '/':'M1 10 L6 0',
  '(':'M5 0 Q0 5 5 10',
  ')':'M1 0 Q6 5 1 10',
  '.':'M3 9 L3.1 9',
  ',':'M3 8 L2 10',
  ':':'M3 3 L3.1 3 M3 8 L3.1 8',
  '%':'M1 1 L6 9 M1 2 Q1 0 3 2 Q3 4 1 4 Q0 4 1 2 M4 7 Q4 5 6 7 Q7 9 5 9 Q4 9 4 7',
  '×':'M1 2 L5 8 M5 2 L1 8',
  '÷':'M1 5 L5 5 M3 2 L3.1 2 M3 8 L3.1 8',
  '≤':'M5 1 L1 5 L5 8 M1 10 L5 10',
  '≥':'M1 1 L5 5 L1 8 M1 10 L5 10',
  '?':'M1 2 Q3 0 5 2 Q6 4 3 6 M3 9 L3.1 9',
  '[':'M5 0 L2 0 L2 10 L5 10',
  ']':'M1 0 L4 0 L4 10 L1 10',
  'Σ':'M6 1 L1 1 L4 5 L1 9 L6 9',
  'η':'M1 9 L1 3 Q3 0 5 3 L5 10',
  'ρ':'M2 10 L2 3 Q3 0 5 3 Q6 6 2 7',
  '²':'M1 2 Q3 -1 5 2 L1 5 L5 5',
  '^':'M1 4 L3 1 L5 4',
  '_':'M0 10 L6 10',
  '|':'M3 0 L3 10'
 });
 const clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
 const canonical=ch=>ch==='−'?'−':ch.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
 const normalizeText=text=>String(text).replace(/−/g,'-').replace(/\s+/g,' ').slice(0,160);
 function plan(text,progress=1){
  const chars=[...normalizeText(text)],p=clamp(progress),count=chars.length;
  return Object.freeze(chars.map((raw,i)=>{
   const ch=canonical(raw);const d=raw===' '?null:(G[raw]||G[ch]||G['?']);
   return Object.freeze({index:i,character:raw,d,x:i*8,visibility:clamp(p*count-i)});
  }));
 }
 function mount(host,text,{progress=1,color='#275b8d'}={}){
  if(!host||typeof host.appendChild!=='function'||typeof document==='undefined')throw new TypeError('Host SVG requerido');
  const glyphs=plan(text),ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${Math.max(8,glyphs.length*8)} 12`);svg.setAttribute('role','img');svg.setAttribute('aria-label',String(text));svg.setAttribute('preserveAspectRatio','xMinYMid meet');svg.classList.add('clf-vector-ink');
  const strokes=[];
  for(const g of glyphs){if(!g.d)continue;const path=document.createElementNS(ns,'path');path.setAttribute('d',g.d);path.setAttribute('transform',`translate(${g.x},0)`);path.setAttribute('stroke',color);path.setAttribute('stroke-width','2');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');path.setAttribute('fill','none');path.setAttribute('pathLength','100');path.setAttribute('stroke-dasharray','100');svg.append(path);strokes.push({path,index:g.index});}
  host.append(svg);
  function setProgress(n){const p=clamp(n);for(const {path,index} of strokes)path.setAttribute('stroke-dashoffset',String(100*(1-clamp(p*glyphs.length-index))));}
  setProgress(progress);
  return Object.freeze({element:svg,setProgress,destroy(){svg.remove();}});
 }
 root.CLFVectorInk=Object.freeze({version:'0.11.0',plan,mount,normalizeText});
})(globalThis);

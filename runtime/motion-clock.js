/* Cognitive Learning Flow — smooth deterministic rAF timeline, no dependencies.
 * Logical events advance only after their duration elapses. Every projection is
 * derived from the integer cursor; paint progress never reveals future events.
 */
(function(root){
 'use strict';
 const DEFAULT_MS=Object.freeze({glyph:38,key:140,scene:230,line:95,equation:280,station:380,result:240,clear:130});
 const speedValues=[.5,1,1.5,2];
 function eventDuration(event,reduced=false){
  if(reduced)return 1;
  const n=DEFAULT_MS[event?.type]??150;
  return Number.isFinite(n)&&n>0?n:150;
 }
 function createClock({events,onCursor,onFrame=()=>{},onComplete=()=>{},raf=root.requestAnimationFrame?.bind(root),cancel=root.cancelAnimationFrame?.bind(root),now=()=>root.performance?.now?.()??Date.now(),reduced=false}={}){
  if(!Array.isArray(events)||typeof onCursor!=='function')throw new TypeError('Timeline y observador requeridos');
  if(typeof raf!=='function'||typeof cancel!=='function')throw new TypeError('requestAnimationFrame no disponible');
  let cursor=0,playing=false,frame=null,last=null,elapsed=0,speed=1,destroyed=false;
  function check(){if(destroyed)throw new Error('Reloj destruido');}
  function unschedule(){if(frame!==null){cancel(frame);frame=null;}}
  function progress(){const event=events[cursor];return event?Math.min(1,elapsed/eventDuration(event,reduced)):1;}
  function getState(){return Object.freeze({cursor,playing,speed,progress:progress(),length:events.length});}
  function advance(ts){
   frame=null;if(!playing||destroyed)return;
   if(last===null)last=ts;
   const delta=Math.min(96,Math.max(0,ts-last));last=ts;
   elapsed+=delta*speed;
   let steps=0;
   while(cursor<events.length&&elapsed>=eventDuration(events[cursor],reduced)&&steps<48){
    elapsed-=eventDuration(events[cursor],reduced);
    cursor++;steps++;
   }
   if(steps)onCursor(cursor,events[cursor-1]);
   onFrame(getState());
   if(cursor===events.length){playing=false;elapsed=0;onComplete();return;}
   frame=raf(advance);
  }
  function play(){check();if(playing)return;if(cursor===events.length){cursor=0;elapsed=0;onCursor(cursor,null);}playing=true;last=null;frame=raf(advance);}
  function pause(){check();playing=false;last=null;unschedule();onFrame(getState());}
  function seek(n){check();playing=false;last=null;unschedule();cursor=Math.max(0,Math.min(events.length,Math.trunc(Number(n))||0));elapsed=0;onCursor(cursor,null);onFrame(getState());}
  function setSpeed(n){check();n=Number(n);if(!speedValues.includes(n))throw new RangeError('Velocidad no admitida');speed=n;onFrame(getState());}
  function destroy(){if(destroyed)return;playing=false;last=null;unschedule();destroyed=true;}
  return Object.freeze({play,pause,seek,setSpeed,getState,destroy});
 }
 root.CLFMotion=Object.freeze({version:'0.10.0',createClock,eventDuration});
})(globalThis);

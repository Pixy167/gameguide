
(function(){try{
const g=i=>document.getElementById(i),a=g('bgm'),S=g('st');if(!a||!S)return;
const DUR=259.2,C=2*Math.PI*33,fmt=s=>{s=Math.max(0,s|0);return(s/60|0)+':'+String(s%60).padStart(2,'0')};
const ico=(p,f)=>`<svg viewBox="0 0 24 24" fill="${f?'currentColor':'none'}" stroke="${f?'none':'currentColor'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const n10='<text x="12" y="15.2" font-size="7.5" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none">10</text>';
const SP='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>';
const I={note:ico('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>').replace('<svg','<svg width="34" height="34"'),
 play:ico('<path d="M7 4.5v15l13-7.5z"/>',1),pause:ico('<rect x="6" y="4.5" width="4.2" height="15" rx="1.2"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"/>',1),
 b:ico('<path d="M3 4v6h6"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L3 10"/>'+n10),f:ico('<path d="M21 4v6h-6"/><path d="M20.5 15a9 9 0 1 1-2.1-9.4L21 10"/>'+n10),
 loop:ico('<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'),
 vol:ico(SP+'<path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>'),mute:ico(SP+'<path d="M23 9l-6 6M17 9l6 6"/>')};
document.head.append(Object.assign(document.createElement('style'),{textContent:`
.dk.mx-btn{left:auto;right:16px;bottom:16px;width:72px;height:72px}
.mx-btn.pl{color:var(--cy)}
.mx-ring{position:absolute;left:-1px;top:-1px;width:72px;height:72px;pointer-events:none}
#mx-arc{transition:stroke-dashoffset .3s linear}
#mx-card{position:absolute;right:16px;bottom:104px;width:900px;z-index:14;display:none;flex-direction:column;gap:14px;padding:32px;background:rgba(14,10,34,.95);border-color:rgba(0,229,255,.4)}
#mx-card.on{display:flex}
.mx-top{display:flex;align-items:center;gap:28px}
.mx-disc{width:150px;height:150px;flex:none;border-radius:50%;display:grid;place-items:center;position:relative;background:repeating-radial-gradient(circle,#1b1538 0 2px,#0b0817 2px 4px);box-shadow:0 0 0 2px var(--bd),0 14px 36px -10px rgba(255,45,138,.6);animation:mxs 7s linear infinite;animation-play-state:paused}
.mx-disc::before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(transparent 0 8%,rgba(255,255,255,.18) 12%,transparent 18% 58%,rgba(255,255,255,.12) 62%,transparent 68%)}
.pl .mx-disc{animation-play-state:running}
.mx-lbl{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;position:relative;background:linear-gradient(135deg,#ff2d8a,#4b2a8f 55%,#00b8d4)}
@keyframes mxs{to{transform:rotate(360deg)}}
.mx-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.mx-row{display:flex;align-items:center;gap:14px}.mx-row small{font-size:22px;color:var(--mu)}
.mx-chip{padding:3px 16px;border-radius:12px;border:2px solid var(--bd);color:var(--mu);font:700 22px 'Plus Jakarta Sans',sans-serif}
.mx-chip.on{border-color:var(--cy);color:var(--cy);background:rgba(0,229,255,.1)}
.mx-meta h3{font-size:46px}.mx-meta p{font-size:28px;color:var(--mu)}
.mx-x{align-self:flex-start;width:64px!important;height:64px!important;font-size:28px}
.mx-sk{display:flex;align-items:center;gap:20px;font-size:26px;color:var(--mu);font-variant-numeric:tabular-nums}
.mx-sk span{width:76px;text-align:center}
#mx-card input{-webkit-appearance:none;appearance:none;flex:1;min-width:0;height:64px;margin:0;background:transparent;cursor:pointer;--p:0%}
#mx-card input:focus-visible{outline:3px solid var(--cy);outline-offset:2px;border-radius:12px}
#mx-card input::-webkit-slider-runnable-track{height:14px;border-radius:7px;background:linear-gradient(90deg,var(--pk),var(--cy)) 0 0/var(--p) 100% no-repeat,rgba(255,255,255,.12)}
#mx-card input::-webkit-slider-thumb{-webkit-appearance:none;width:34px;height:34px;margin-top:-10px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(255,45,138,.3),0 2px 10px rgba(0,0,0,.6)}
#mx-card input::-moz-range-track{height:14px;border-radius:7px;background:rgba(255,255,255,.12)}
#mx-card input::-moz-range-progress{height:14px;border-radius:7px;background:linear-gradient(90deg,var(--pk),var(--cy))}
#mx-card input::-moz-range-thumb{width:34px;height:34px;border:0;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(255,45,138,.3)}
.mx-ctl{display:flex;align-items:center;gap:18px}
.mx-b{width:84px;height:84px;flex:none;border-radius:50%;display:grid;place-items:center;background:var(--sf);border:1px solid var(--bd);color:var(--mu)}
.mx-b svg{width:42px;height:42px}.mx-b.sm{width:68px;height:68px}.mx-b.sm svg{width:34px;height:34px}
.mx-b.a{border-color:var(--cy);color:var(--cy);background:rgba(0,229,255,.12)}
.mx-play{width:104px;height:104px;flex:none;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#ff2d8a,#c2185b);box-shadow:0 0 28px rgba(255,45,138,.5)}
.mx-play svg{width:50px;height:50px}
.mx-vol{flex:1;min-width:0;display:flex;align-items:center;gap:10px;margin-left:12px}
.mx-vol span{width:76px;text-align:right;font-size:26px;color:var(--mu);font-variant-numeric:tabular-nums}
.nv .mx-vol input,.nv .mx-vol span{display:none}.nv .mx-vol{justify-content:flex-end}
`}));
S.insertAdjacentHTML('beforeend',`<button class="bt dk mx-btn" id="mx-btn" aria-label="Pemutar musik" aria-expanded="false" aria-controls="mx-card" title="Pemutar musik"><svg class="mx-ring" viewBox="0 0 72 72" aria-hidden="true"><defs><linearGradient id="mx-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff2d8a"/><stop offset="1" stop-color="#00e5ff"/></linearGradient></defs><circle cx="36" cy="36" r="33" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="3"/><circle id="mx-arc" cx="36" cy="36" r="33" fill="none" stroke="url(#mx-g)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 36 36)"/></svg>${I.note}</button>
<div id="mx-card" class="gl" role="region" aria-label="Pemutar musik"><div class="mx-top"><div class="mx-disc"><span class="mx-lbl">${typeof ic==='function'?ic('heart',26,'#fff'):''}</span></div><div class="mx-meta"><div class="mx-row"><span class="mx-chip" id="mx-st">Dijeda</span><small>MP3 320 kbps · 48 kHz</small></div><h3 class="o">Photograph</h3><p>Ed Sheeran</p></div><button class="bt bk mx-x" data-m="x" aria-label="Tutup pemutar">✕</button></div>
<div class="mx-sk"><span id="mx-t">0:00</span><input type="range" id="mx-k" min="0" max="1000" value="0" aria-label="Posisi lagu"><span id="mx-d">4:19</span></div>
<div class="mx-ctl"><button class="bt mx-b" data-m="b" aria-label="Mundur 10 detik">${I.b}</button><button class="bt mx-play" id="mx-p" data-m="p" aria-label="Putar">${I.play}</button><button class="bt mx-b" data-m="f" aria-label="Maju 10 detik">${I.f}</button><button class="bt mx-b" id="mx-l" data-m="l" aria-label="Ulangi lagu" aria-pressed="true">${I.loop}</button>
<div class="mx-vol"><button class="bt mx-b sm" id="mx-m" data-m="m" aria-label="Bisukan">${I.vol}</button><input type="range" id="mx-v" min="0" max="100" value="60" aria-label="Volume musik"><span id="mx-vp">60%</span></div></div></div>`);
const btn=g('mx-btn'),card=g('mx-card'),arc=g('mx-arc'),stt=g('mx-st'),k=g('mx-k'),tm=g('mx-t'),dd=g('mx-d'),pb=g('mx-p'),lb=g('mx-l'),mb=g('mx-m'),vi=g('mx-v'),vp=g('mx-vp');
let drag=0,vol=.6,fu=0,rt,first=1;
const t0=a.volume;try{a.volume=.5}catch(e){}if(Math.abs(a.volume-.5)>.01)card.classList.add('nv');try{a.volume=t0}catch(e){}
const dur=()=>isFinite(a.duration)&&a.duration>0?a.duration:DUR,pl=()=>!a.paused&&!a.ended;
function tick(){const d=dur(),t=a.currentTime||0,p=Math.min(1,t/d);arc.style.strokeDashoffset=C*(1-p);dd.textContent=fmt(d);if(drag)return;k.value=Math.round(p*1000);k.style.setProperty('--p',p*100+'%');tm.textContent=fmt(t)}
function sync(){const p=pl(),m=a.muted||!a.volume,v=m?0:Math.round(vol*100);[btn,card].forEach(e=>e.classList.toggle('pl',p));pb.innerHTML=p?I.pause:I.play;pb.setAttribute('aria-label',p?'Jeda':'Putar');stt.textContent=p?'Sedang diputar':'Dijeda';stt.classList.toggle('on',p);lb.classList.toggle('a',a.loop);lb.setAttribute('aria-pressed',a.loop);mb.innerHTML=m?I.mute:I.vol;mb.setAttribute('aria-label',m?'Suarakan':'Bisukan');vi.value=v;vi.style.setProperty('--p',v+'%');vp.textContent=v+'%'}
const play=on=>{try{if(typeof music==='function'){music(on);return}}catch(e){}on?a.play().catch(()=>{}):a.pause()};
['play','pause','ended','volumechange','loadedmetadata','durationchange','timeupdate','seeked'].forEach(n=>a.addEventListener(n,()=>{tick();sync()}));
a.addEventListener('ended',()=>{try{music(false)}catch(e){}});
a.addEventListener('volumechange',()=>{if(!a.muted&&performance.now()<fu&&a.volume>vol+.001)a.volume=vol});
a.addEventListener('playing',()=>{fu=performance.now()+2300;clearTimeout(rt);rt=setTimeout(()=>{if(pl()&&!a.muted&&Math.abs(a.volume-vol)>.011)a.volume=vol},2400);if(first){first=0;try{toast('♪ Photograph — Ed Sheeran')}catch(e){}}sync()});
k.addEventListener('input',()=>{drag=1;tm.textContent=fmt(k.value/1000*dur());k.style.setProperty('--p',k.value/10+'%')});
k.addEventListener('change',()=>{a.currentTime=Math.min(dur()-.05,k.value/1000*dur());drag=0;tick()});
k.addEventListener('pointerup',()=>setTimeout(()=>{drag=0;tick()},80));
vi.addEventListener('input',()=>{vol=vi.value/100;a.muted=false;a.volume=vol;sync()});
const jump=s=>{a.currentTime=Math.max(0,Math.min(dur()-.25,(a.currentTime||0)+s))};
const act={p:()=>play(!pl()),b:()=>jump(-10),f:()=>jump(10),l:()=>{a.loop=!a.loop;sync()},m:()=>{if(!a.volume&&!a.muted){vol=.6;a.volume=vol}else a.muted=!a.muted;sync()},x:()=>open(0)};
card.addEventListener('click',e=>{const b=e.target.closest('[data-m]');b&&act[b.dataset.m]&&act[b.dataset.m]()});
function open(v){v=v===undefined?!card.classList.contains('on'):!!v;card.classList.toggle('on',v);btn.setAttribute('aria-expanded',v);if(v){try{A(card,[{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:350})}catch(e){}tick();sync();pb.focus({preventScroll:true})}else btn.focus({preventScroll:true})}
btn.addEventListener('click',()=>open());
[btn,card].forEach(e=>{['touchstart','touchend'].forEach(t=>e.addEventListener(t,x=>x.stopPropagation(),{passive:true}));e.addEventListener('keydown',x=>x.stopPropagation())});
addEventListener('keydown',e=>{if(e.key==='Escape'&&card.classList.contains('on')&&!g('md').classList.contains('on')){e.stopPropagation();open(0)}},true);
try{add('Sedang diputar','Now playing');add('Dijeda','Paused')}catch(e){}
sync();tick();
}catch(e){console.warn('Pemutar musik:',e)}})();

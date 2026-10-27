
/* ===== v4: menu Hero Select (grid 133 hero + foto), guide AI ala Angela untuk semua hero ===== */
(function(){
const ESC=lbEsc,rr=V3.rr,slug=n=>String(n).toLowerCase().replace(/[^a-z0-9]/g,''),ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
let SRC={};const HS={f:'All',q:''},PH={},UPD=new Set(),PREP={on:0},
XP=`\n\nAlso add to EACH skills entry: "cd" (cooldown in seconds at level 1, number or null), "mana" (mana cost at level 1, number or null) and "adv" (one sentence of advanced detail, or ""). Search the web first to confirm the current official skill names, numbers, items and emblem talents.`;
document.head.append(Object.assign(document.createElement('style'),{textContent:`.sel .lks{display:grid;grid-template-rows:auto auto 1fr auto;gap:12px;height:100%;min-height:0;align-self:stretch}#hs1,#hs2,#hsm{display:flex;gap:10px;align-items:center}#hs2{flex-wrap:wrap}#hss{flex:1;min-width:0;height:62px;font:600 26px 'Plus Jakarta Sans',sans-serif;padding:0 20px;border-radius:16px;background:#1a1440;color:#fff;border:2px solid var(--bd);user-select:text;-webkit-user-select:text}#hs1 .bt,#hs2 .bt{height:56px;padding:0 11px;font-size:19px;border-radius:14px;white-space:nowrap}#hs2 .bt.a{background:var(--pk);color:#fff}#hsc{color:var(--mu);font-size:20px;margin-right:8px}#hsg{overflow-y:auto;min-height:0;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;align-content:start;grid-auto-rows:170px;padding:2px 6px 2px 2px}#hsg .hc{position:relative;padding:0;min-width:0;width:100%;height:170px;border-radius:16px;overflow:hidden;border:2px solid var(--bd);background:#120a2a center/cover no-repeat}#hsg .hc b{position:absolute;left:0;right:0;bottom:0;padding:8px 4px;background:rgba(8,4,20,.95);color:#fff;font:800 19px Outfit,sans-serif;text-align:center;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#hsg .hc.on{border-color:var(--pk);box-shadow:0 0 22px var(--pk)}#hsg .hc i{position:absolute;top:6px;right:6px;font:800 14px Outfit,sans-serif;background:#3ddc84;color:#04210f;border-radius:8px;padding:2px 7px}#hsm .bt{flex:1;height:84px;font-size:21px;padding:0 8px;border-radius:18px}`}));

/* foto: taruh file di folder heroes/ bernama huruf kecil tanpa spasi/simbol, contoh heroes/layla.jpg, heroes/change.webp, heroes/yisunshin.png */
const bgOf=n=>{const k=n.toLowerCase();return PH[slug(n)]?`url("${PH[slug(n)]}")`:(k==='angela'||k==='carmilla')?HD[k].av:`url("${V3.portrait(n,rr(n))}")`};
const found=(n,u)=>{PH[slug(n)]=u;const k=n.toLowerCase(),h=HD[k];if(h&&k!=='angela'&&k!=='carmilla'){h.hero=h.av=`url("${u}")`;if(HERO===k){st.style.setProperty('--hero',h.hero);st.style.setProperty('--av',h.av)}}};
const probe=(n,cb)=>{const s=slug(n);if(s in PH)return PH[s]&&cb(PH[s]);PH[s]='';const ex=['webp','jpg','png'];let i=0;const t=()=>{if(i>=ex.length)return;const u='heroes/'+s+'.'+ex[i++],im=new Image();im.onload=()=>{found(n,u);cb(u)};im.onerror=t;im.src=u};t()};

/* guide AI lengkap (cd, mana, detail lanjutan) + cache; heroes.json statis dipakai kalau ada */
const mkAI=(j,n,r)=>{const h=mkHero(j,n,r);j.skills.slice(0,4).forEach((s,i)=>{const t=h.skills[i];if(+s.cd)t.cd=+s.cd;if(+s.mana)t.mana=+s.mana;if(s.adv)t.adv=String(s.adv)});h.hero=h.av=bgOf(n);return h};
const aiHero=async(n,r)=>{const k=n.toLowerCase();let j=SRC[k];if(!j)try{j=JSON.parse(ls('hg3:'+k)||'null')}catch(e){}
 if(!j){const S2=await pxSamp();if(!S2)throw{code:'none'};j=await S2.json(hgPrompt(n,r)+XP,{modelTier:'default'});mkHero(j,n,r);try{localStorage.setItem('hg3:'+k,JSON.stringify(j))}catch(e){}}
 return mkAI(j,n,r)};
const ready=n=>{const k=n.toLowerCase();return !!(HD[k]&&!HD[k].fb)||!!(SRC[k]||ls('hg3:'+k))};
genHero=async(n,r)=>{try{return await aiHero(n,r)}catch(e){if(e&&e.code==='unknown')throw e;const h=mkHero(V3.fbJSON(n,r),n,r);h.fb=1;h.hero=h.av=bgOf(n);return h}};

const card=$('.card',S.heroSelect);
const sync=()=>{const h=HD[HERO];if(!h)return;card.dataset.h=HERO;card.children[2].textContent=h.name;card.children[3].textContent=h.role;$$('#hsg .hc').forEach(e=>e.classList.toggle('on',e.dataset.n.toLowerCase()===HERO))};
const selHero=n=>{const k=n.toLowerCase(),r=rr(n);if(!HD[k]){let h,j=SRC[k];if(!j)try{j=JSON.parse(ls('hg3:'+k)||'null')}catch(e){}
  try{h=j?mkAI(j,n,r):null}catch(e){}if(!h){h=mkHero(V3.fbJSON(n,r),n,r);h.fb=1}h.hero=h.av=bgOf(n);HD[k]=h}
 setHero(k);sync();snd('click')};
const upgrade=async n=>{const k=n.toLowerCase();if(!HD[k]||!HD[k].fb||UPD.has(k))return;UPD.add(k);
 try{const h=await aiHero(n,rr(n));HD[k]=h;if(HERO===k){HD.__={};HERO='__';setHero(k);delete HD.__;sync()}hsRender();toast(n+': guide lengkap siap')}catch(e){UPD.delete(k);if(e&&e.code==='unknown')HD[k].fb=0}};
openHero=async n=>{const h=ROSTER.find(x=>x.n.toLowerCase()===String(n).toLowerCase());n=h?h.n:n;selHero(n);const p=$('#hp');p&&p.classList.remove('on');if(cur!=='heroPage')go('heroPage',{zoom:1});upgrade(n)};
st.addEventListener('click',e=>{const b=e.target.closest('[data-a=open]');if(b&&!busy)upgrade(HN())},true);

/* ---- menu Hero Select ---- */
$('.lks',S.heroSelect).innerHTML=`<div id=hs1><input id=hss placeholder="Cari hero…" autocomplete=off><button class="bt bs" data-a=hsp id=hsp>SIAPKAN SEMUA (AI)</button><button class="bt bs" data-a=hsd>heroes.json</button></div><div id=hs2><small id=hsc></small>${['All',...Object.values(RN)].map(x=>`<button class="bt bs" data-a=hsf data-f="${x}">${x}</button>`).join('')}</div><div id=hsg></div><div id=hsm>${Object.entries(LBM).map(([k,m])=>`<button class="bt bs" data-a=lbo data-k=${k}>${m.n}</button>`).join('')}</div>`;
function hsRender(){const L=ROSTER.filter(h=>(HS.f==='All'||h.l.includes(HS.f))&&h.n.toLowerCase().includes(HS.q));
 $('#hsg').innerHTML=L.map(h=>`<button class="bt hc${h.n.toLowerCase()===HERO?' on':''}" data-a=hsel data-n="${ESC(h.n)}"><b>${ESC(h.n)}</b>${ready(h.n)?'<i>AI</i>':''}</button>`).join('')||'<p style="grid-column:1/-1;color:var(--mu)">Hero tidak ditemukan. Tanya Pixy untuk hero baru.</p>';
 $$('#hsg .hc').forEach(b=>{const n=b.dataset.n;b.style.backgroundImage=bgOf(n);probe(n,()=>{b.style.backgroundImage=bgOf(n)})});
 $('#hsc').textContent=ROSTER.filter(h=>ready(h.n)).length+'/'+ROSTER.length+' siap';
 $$('#hs2 [data-f]').forEach(b=>b.classList.toggle('a',b.dataset.f===HS.f))}
$('#hss').addEventListener('input',e=>{HS.q=e.target.value.trim().toLowerCase();hsRender()});$('#hss').addEventListener('keydown',e=>e.stopPropagation());

const prep=async()=>{const B=$('#hsp'),L='SIAPKAN SEMUA (AI)';if(PREP.on){PREP.on=0;B.textContent=L;return}
 const q=ROSTER.filter(h=>!ready(h.n)),t=q.length;if(!t)return toast('Semua guide sudah siap');PREP.on=1;let d=0;const lab=()=>{B.textContent=PREP.on?`BERHENTI (${d}/${t})`:L};lab();
 const w=async()=>{while(PREP.on&&q.length){const h=q.shift(),k=h.n.toLowerCase();try{const x=await aiHero(h.n,h.r);d++;if(HD[k]&&HD[k].fb&&HERO!==k)HD[k]=x;if(d%5===0)hsRender()}catch(e){if(e&&e.code==='none'){PREP.on=0;toast('Server AI belum aktif atau kena limit')}}lab()}};
 await Promise.all([w(),w()]);PREP.on=0;lab();hsRender();toast('Selesai: '+d+' guide siap. Tekan heroes.json untuk mengunduh.')};
const dl=()=>{const o={};ROSTER.forEach(h=>{const k=h.n.toLowerCase(),c=ls('hg3:'+k);if(c){try{o[k]=JSON.parse(c)}catch(e){}}else if(SRC[k])o[k]=SRC[k]});
 if(!Object.keys(o).length)return toast('Belum ada guide AI untuk diunduh');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));a.download='heroes.json';a.click();toast('heroes.json: '+Object.keys(o).length+' hero')};
Object.assign(XX,{hsel:b=>selHero(b.dataset.n),hsf:b=>{HS.f=b.dataset.f;hsRender()},hsp:prep,hsd:dl,
 vai:()=>{const n=HN(),k=n.toLowerCase();if(k==='angela'||k==='carmilla')return toast('Guide ini sudah lengkap, ditulis manual');try{localStorage.removeItem('hg3:'+k)}catch(e){}delete SRC[k];UPD.delete(k);HD[k].fb=1;shut();toast('Pixy riset ulang '+n+'…');upgrade(n)}});
fetch('heroes.json').then(r=>r.ok?r.json():null).then(o=>{if(o&&typeof o==='object'&&!Array.isArray(o)){SRC=o;hsRender()}}).catch(()=>{});
hsRender();sync();
const _pk=pick;pick=function(i){_pk(i);const n=HN(),k=n.toLowerCase();if(HD[k]&&HD[k].fb&&k!=='angela'&&k!=='carmilla'){const d=$('#dp .dsc');d&&d.insertAdjacentHTML('afterend','<div class="tipc pxn"><b>Pixy riset</b>Memuat nama dan efek resmi skill ini…</div>');upgrade(n).then(()=>{if(HD[k]&&!HD[k].fb&&HERO===k)_pk(i);else{const q=$('#dp .pxn');q&&(q.innerHTML='<b>Pixy riset</b>Ini penjelasan umum per peran. Nama dan angka resmi muncul begitu server AI aktif.')}})}};
window.V4={selHero,aiHero,upgrade};
})();

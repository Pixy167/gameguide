
/* ===== v2: musik original, AI via Vercel (/api/chat), lobby Emblem/Item/Hero/Compare ===== */

/* ---- 1. Musik original: dibuat oleh kode lewat Web Audio, jadi bebas hak cipta ---- */
(function(){
 const a=document.getElementById('bgm');if(!a)return;
 let want=0,ready=0;const P0=a.play.bind(a);
 a.play=()=>{want=1;return ready?P0():Promise.resolve()};
 const OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext,SR=22050,BT=60/80,C=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],F=m=>440*Math.pow(2,(m-69)/12);
 try{
  const O=new OAC(1,Math.ceil(SR*64*BT),SR),G=O.createGain();G.gain.value=.55;G.connect(O.destination);
  const T=(t,d,fr,ty,v)=>{const o=O.createOscillator(),e=O.createGain();o.type=ty;o.frequency.value=fr;e.gain.setValueAtTime(.0001,t);e.gain.linearRampToValueAtTime(v,t+Math.min(.1,d/3));e.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(e);e.connect(G);o.start(t);o.stop(t+d+.05)};
  for(let b=0;b<16;b++){const c=C[b%4],t=b*4*BT;
   c.forEach(n=>{T(t,4*BT,F(n),'triangle',.06);T(t,4*BT,F(n)*1.005,'sine',.05)});
   T(t,2*BT,F(c[0]-24),'sine',.22);T(t+2*BT,2*BT,F(c[0]-24),'sine',.18);
   if(b>3)for(let i=0;i<8;i++)T(t+i*BT/2,BT*.9,F(c[[0,1,2,1,0,2,1,2][i]]+12),'triangle',.06)}
  O.startRendering().then(r=>{
   const x=r.getChannelData(0),w=new DataView(new ArrayBuffer(44+x.length*2)),s=(o,t)=>[...t].forEach((c,i)=>w.setUint8(o+i,c.charCodeAt(0)));
   s(0,'RIFF');w.setUint32(4,36+x.length*2,true);s(8,'WAVEfmt ');w.setUint32(16,16,true);w.setUint16(20,1,true);w.setUint16(22,1,true);w.setUint32(24,SR,true);w.setUint32(28,SR*2,true);w.setUint16(32,2,true);w.setUint16(34,16,true);s(36,'data');w.setUint32(40,x.length*2,true);
   for(let i=0;i<x.length;i++)w.setInt16(44+i*2,Math.max(-1,Math.min(1,x[i]))*32000,true);
   a.src=URL.createObjectURL(new Blob([w],{type:'audio/wav'}));ready=1;if(want)P0().catch(()=>{})})
 }catch(e){}
})();

/* ---- 2. AI: pengganti claude.use('sample') yang memanggil /api/chat (Vercel) + riset web ---- */
function mkSampler(){
 const call=async b=>{let r;try{r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)})}catch(e){throw{code:'none'}}
  if(r.status===429)throw{code:'rate_limited'};if(!r.ok)throw{code:'none'};return r.json()};
 const f=async(m,o={})=>{
  const ts=o.tools||[],defs=ts.map(t=>({name:t.name,description:t.description,input_schema:t.inputSchema})),ms=m.map(x=>({role:x.role,content:x.content}));
  for(let i=0;i<5;i++){
   const j=await call({messages:ms,tools:defs});
   if(j.stop_reason==='tool_use'){
    ms.push({role:'assistant',content:j.content});const rs=[];
    for(const c of j.content)if(c.type==='tool_use'){const t=ts.find(x=>x.name===c.name);let out;try{out=t?await t.execute(c.input||{}):{error:'unknown tool'}}catch(e){out={error:String(e)}}rs.push({type:'tool_result',tool_use_id:c.id,content:JSON.stringify(out)})}
    ms.push({role:'user',content:rs});continue}
   const text=(j.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('').trim();
   if(o.onText)o.onText({text});return{text}}
  throw{code:'empty'}};
 f.json=async(p,o={})=>{const r=await f([{role:'user',content:p+'\n\nReply with ONLY the JSON object, no extra text.'}],o),s=r.text.indexOf('{'),e=r.text.lastIndexOf('}');if(s<0)throw{code:'bad'};return JSON.parse(r.text.slice(s,e+1))};
 return f}

/* ---- 3. Lobby baru: Emblem • Item • Hero • Compare Hero (pengenalan, penjelasan, training) ---- */
const LB={k:'emb',t:0,x:{},a:'Angela',b:'Carmilla',pass:0},
LBM={emb:{n:'Emblem',e:'Talent & atribut permanen',i:'shield'},itm:{n:'Item',e:'Build & urutan beli',i:'bolt'},hro:{n:'Hero',e:'Peran, skill & strategi',i:'heart'},cmp:{n:'Compare Hero',e:'Adu dua hero berdampingan',i:'star'}},
LBI={
emb:['Apa itu Emblem?','Emblem adalah bonus atribut permanen yang dipasang sebelum match dimulai. Tersedia beberapa set (Common, Tank, Assassin, Mage, Fighter, Marksman, Support). Setiap set memberi atribut dasar yang berbeda, jadi pilih set yang sesuai peran hero.','Setiap emblem punya 3 tier talent. Tier 1 umumnya atribut atau mobilitas, Tier 2 utilitas, Tier 3 efek inti yang paling menentukan gaya bermain. Menaikkan level emblem menambah bonus atributnya.','Cara memilih: lihat peran hero, tentukan kebutuhan (kabur, sustain, atau damage), lalu sesuaikan dengan lawan. Emblem melengkapi item dan battle spell, bukan menggantikannya.'],
itm:['Apa itu Item?','Item dibeli di toko memakai gold selama match. Kamu punya maksimal 6 slot, dan sepatu juga memakai satu slot. Jenisnya: Attack, Magic, Defense, Movement, serta item khusus Roam dan Jungle.','Banyak item punya Passive unik. Passive dengan nama yang sama tidak menumpuk jika dibeli dua kali, jadi hindari item yang efeknya sama. Sebagian item punya Active dengan cooldown.','Urutan beli menentukan kekuatan di tiap fase. Mulai dari item inti, lalu tambahkan item situasional sesuai lawan, misalnya anti-heal, penahan burst, atau penambah survivability.'],
hro:['Apa itu Hero?','Setiap hero punya satu Passive dan tiga skill aktif (Skill 1, Skill 2, Ultimate). Skill punya cooldown dan mana cost berbeda, jadi tahu kapan memakainya sama pentingnya dengan tahu fungsinya.','Peran utama: Tank, Fighter, Assassin, Mage, Marksman, dan Support. Peran menentukan lane, tugas di teamfight, serta emblem dan item yang cocok.','Di tab Penjelasan kamu bisa membaca kelebihan, kekurangan, detail skill, dan strategi hero aktif. Tekan GANTI HERO untuk memilih hero lain dari seluruh daftar.'],
cmp:['Apa itu Compare Hero?','Compare Hero menyandingkan dua hero: peran, kelebihan, kekurangan, skill, item inti, dan emblem.','Gunakan ini untuk memilih hero yang tepat bagi kebutuhan tim, bukan sekadar yang paling kuat. Hero yang bagus di satu komposisi bisa kurang cocok di komposisi lain.','Pilih dua hero lewat dropdown di tab Penjelasan. Hero yang belum dimuat akan diriset online oleh Pixy, jadi butuh koneksi dan server AI yang aktif.']};
const lbEsc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
lbSh=a=>[...a].sort(()=>Math.random()-.5),lbTc=s=>String(s).toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase()),
lbL=s=>String(s||'').split(',').map(x=>x.trim()).filter(Boolean),lbH=()=>HD[HERO],
lbC=(t,b)=>`<div class=lc><b>${lbEsc(t)}</b><br>${b}</div>`,
lbK=n=>HD[String(n).toLowerCase()],
lbLd=async n=>{const k=n.toLowerCase();if(!HD[k])HD[k]=await genHero(n,(ROSTER.find(r=>r.n.toLowerCase()===k)||{r:''}).r);return HD[k]},
lbMq=(q,r,p,w)=>{const o=lbSh([r,...lbSh(p.filter(x=>x&&x!==r)).slice(0,3)]);return{q,o,a:o.indexOf(r),w}};

function lbI(){const t=LBI[LB.k];return `<h3>${t[0]}</h3>${t.slice(1).map(p=>`<p>${p}</p>`).join('')}`+(LB.k==='cmp'?'':`<div class=lc><b>Hero aktif: ${lbEsc(HN())}</b><br><small>Tab Penjelasan dan Training Ground memakai data hero ini.</small></div>`)}

function lbX(){const h=lbH(),k=LB.k,
 sw=(q,g=1)=>`<div class=rw style="gap:14px;margin-top:22px">${g?'<button class="bt bs" data-a=heroes>GANTI HERO</button>':''}<button class="bt bs" data-a=lbp data-q="${lbEsc(q)}">TANYA PIXY (RISET ONLINE)</button>${k==='hro'?'<button class="bt bs" data-a=lbh>HALAMAN HERO LENGKAP</button>':''}</div>`;
 if(k==='emb')return `<h3>Emblem ${lbEsc(h.name)}</h3>`+h.emb.map(e=>lbC(e[0],lbEsc(e[1]))).join('')+`<h3>Battle Spell pendamping</h3>`+h.spl.map(e=>lbC(e[0],lbEsc(e[1]))).join('')+`<p>Talent, battle spell, dan item dipilih agar saling menutup kekurangan ${lbEsc(h.name)}: ${lbEsc(h.cons)}.</p>`+sw('Jelaskan emblem, talent, dan battle spell terbaik untuk '+h.name+' di patch terbaru, beserta alasannya');
 if(k==='itm')return `<h3>Build ${lbEsc(h.name)} (urutan beli)</h3>`+h.bd.map((s,i)=>{const o=s.o[0];return lbC((i+1)+'. '+o.n,`${lbEsc(o.r)}<br><small>${lbEsc(s.tag)} • prioritas ${lbEsc(s.p)}% • beli saat: ${lbEsc(o.w)}</small>${s.o.slice(1).map(a=>`<br><small>↔ ${lbEsc(a.n)}: ${lbEsc(a.r)} (ganti jika ${lbEsc(a.w)})</small>`).join('')}`)}).join('')+sw('Jelaskan build item '+h.name+' di patch terbaru, kapan harus swap, dan item mana yang sedang berubah');
 if(k==='hro')return `<h3>${lbEsc(h.name)} • ${lbEsc(h.role)}</h3><p><b style="color:#3ddc84">Kelebihan:</b> ${lbEsc(h.pros)}<br><b style="color:var(--rd)">Kekurangan:</b> ${lbEsc(h.cons)}</p>`+h.skills.map(s=>lbC(s.k+': '+s.n,`${s.cd?`<small>CD ${lbEsc(s.cd)}s • Mana ${lbEsc(s.mana)}</small><br>`:''}${lbEsc(strip(s.d))}${s.adv?`<br><small>${lbEsc(s.adv)}</small>`:''}${s.tip?`<br><small>Tips: ${lbEsc(s.tip)}</small>`:''}`)).join('')+`<h3>Strategi</h3>`+h.strat.map(x=>lbC(x[0]+' • '+x[1],lbEsc(x[2]))).join('')+sw('Jelaskan cara main '+h.name+' dari early sampai late game, termasuk counter dan combo');
 const o=ROSTER.map(r=>`<option>${lbEsc(r.n)}</option>`).join(''),A=lbK(LB.a),B=lbK(LB.b),
 row=(t,f)=>`<tr><th>${t}</th><td>${f(A)}</td><td>${f(B)}</td></tr>`;
 return `<div class=rw style="gap:14px;align-items:center;margin-bottom:20px"><select id=lcA>${o}</select><b>vs</b><select id=lcB>${o}</select><button class="bt bs" data-a=lbc>BANDINGKAN</button></div>`+(A&&B?`<table class=lx><tr><th></th><th>${lbEsc(A.name)}</th><th>${lbEsc(B.name)}</th></tr>${row('Peran',h=>lbEsc(h.role))+row('Kelebihan',h=>lbEsc(h.pros))+row('Kekurangan',h=>lbEsc(h.cons))+row('Skill',h=>h.skills.map(s=>lbEsc(s.n)).join(' • '))+row('Item inti',h=>h.bd.slice(0,4).map(s=>lbEsc(s.o[0].n)).join(' → '))+row('Emblem',h=>h.emb.map(e=>lbEsc(lbTc(e[0].split(' • ').pop()))).join(' • '))}</table>`:'<p>Hero ini belum dimuat. Tekan BANDINGKAN, Pixy akan meriset datanya secara online.</p>')+sw('Bandingkan '+LB.a+' dan '+LB.b+': laning, teamfight, item, tingkat kesulitan, dan kapan memilih masing-masing, pakai data patch terbaru',0)}

function lbQ(k){const h=lbH(),q=[];
 if(k==='emb')h.emb.forEach(e=>{const p=e[0].split(' • '),n=lbTc(p.pop()),all=h.emb.map(x=>lbTc(x[0].split(' • ').pop()));
  q.push(lbMq(`Talent mana yang cocok untuk: “${e[1]}”?`,n,[...all,'Bargain Hunter','Festival of Blood','Quantum Charge','Seasoned Hunter'],e[0]+': '+e[1]),lbMq(`${n} ada di tier berapa?`,p[0]||'TIER 1',['TIER 1','TIER 2','TIER 3'],e[0]+': '+e[1]))});
 if(k==='itm')h.bd.forEach((s,i)=>{q.push(lbMq(`Item ke-${i+1} yang direkomendasikan untuk ${h.name}?`,s.o[0].n,h.bd.map(x=>x.o[0].n),s.o[0].n+': '+s.o[0].r));s.o.forEach(o=>o.w&&q.push(lbMq(`Situasi: “${o.w}”. Item mana yang dipilih?`,o.n,[...s.o.map(x=>x.n),...h.bd.map(x=>x.o[0].n)],o.n+': '+o.r)))});
 if(k==='hro'){h.skills.forEach(s=>q.push(lbMq(`Skill mana yang seperti ini: “${strip(s.d).slice(0,170)}…”?`,s.n,h.skills.map(x=>x.n),s.k+': '+s.n+(s.tip?'. Tips: '+s.tip:''))));
  const c=lbL(h.cons)[0];c&&q.push(lbMq(`Mana yang BUKAN kelebihan ${h.name}?`,c,lbL(h.pros),`Kekurangan ${h.name}: ${h.cons}`))}
 if(k==='cmp'){const A=lbK(LB.a),B=lbK(LB.b);if(A&&B){[[A,B],[B,A]].forEach(([x,y])=>{lbL(x.pros).filter(p=>!lbL(y.pros).includes(p)).slice(0,2).forEach(p=>q.push(lbMq(`“${p}” adalah kelebihan hero mana?`,x.name,[A.name,B.name],x.name+': '+x.pros)));lbL(x.cons).filter(p=>!lbL(y.cons).includes(p)).slice(0,1).forEach(p=>q.push(lbMq(`“${p}” adalah kekurangan hero mana?`,x.name,[A.name,B.name],x.name+': '+x.cons)))});q.push(lbMq(`Siapa yang berperan sebagai ${A.role}?`,A.name,[A.name,B.name],`${A.name}: ${A.role}. ${B.name}: ${B.role}.`))}}
 return q}

function lbT(){const k=LB.k,x=LB.x,bt=k==='hro'?`<button class="bt bs" data-a=lbs>BUKA SIMULATOR TRAINING</button>`:'';
 if(x.k!==k||!x.qs){x.k=k;x.qs=lbSh(lbQ(k)).slice(0,8);x.i=0;x.s=0;x.d=0}
 if(!x.qs.length)return `<h3>Training Ground</h3><p>Muat dulu kedua hero di tab Penjelasan (tombol BANDINGKAN) supaya soal latihan bisa dibuat.</p>`;
 const q=x.qs[x.i];
 if(!q)return `<h3>Hasil: ${x.s} dari ${x.qs.length}</h3><p>${x.s>=x.qs.length*.8?'Mantap! Kamu sudah paham materi ini.':'Belum maksimal. Baca lagi tab Penjelasan lalu coba ulang.'}</p><div class=rw style="gap:14px"><button class="bt bs" data-a=lbr>ULANGI</button>${bt}</div>`;
 return `<small>Soal ${x.i+1} dari ${x.qs.length} • skor ${x.s}</small><h3>${lbEsc(q.q)}</h3><div class=lo>${q.o.map((o,i)=>`<button class="bt bs" data-a=lbA data-i=${i}>${lbEsc(o)}</button>`).join('')}</div><p id=lbf></p>${bt}`}

function lbR(){const m=LBM[LB.k];$('#lbe').textContent=m.e;$('#lbt').textContent=LB.k==='cmp'?m.n:m.n+' • '+HN();
 $$('#lt button').forEach((b,i)=>b.classList.toggle('a',i===LB.t));
 const b=$('#lbb');b.innerHTML=[lbI,lbX,lbT][LB.t]();b.scrollTop=0;
 if(LB.k==='cmp'&&LB.t===1){$('#lcA').value=LB.a;$('#lcB').value=LB.b}}

document.head.append(Object.assign(document.createElement('style'),{textContent:`#lab .lb2{height:800px;margin-top:18px}#lbb{height:100%;overflow:auto;padding:34px 48px;font-size:30px;line-height:1.5}#lbb h3{font:800 40px Outfit,sans-serif;margin:0 0 14px}#lbb p{margin:0 0 16px;color:#e8e4ff;max-width:1500px}#lbb small{color:var(--mu);font-size:24px}.lc{border:1px solid var(--bd);border-radius:22px;padding:20px 28px;margin:0 0 16px;background:rgba(255,255,255,.04)}.lc b{color:var(--cy)}.lo{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:18px 0}.lo .bt{height:auto;min-height:84px;padding:14px 22px;text-align:left;font-size:26px}.lo .ok{background:rgba(61,220,132,.25);border-color:#3ddc84;color:#fff}.lo .no{background:rgba(255,90,106,.22);border-color:var(--rd);color:#fff}#lt{padding:6px}#lt button{width:272px;height:64px;font-size:23px}#lt button.a{background:var(--pk);color:#fff}#lbb select{font:700 28px Outfit,sans-serif;padding:12px 16px;border-radius:14px;background:#1a1440;color:#fff;border:2px solid var(--bd)}.lx{width:100%;border-collapse:collapse;font-size:26px}.lx td,.lx th{border:1px solid var(--bd);padding:12px 16px;vertical-align:top;text-align:left}.lx th{color:var(--cy)}`}));

mk('lab',`<div class="hd st"><button class="bt bk" data-a=back aria-label="Kembali">${ic('back')}</button><div><div class=cr id=lbe></div><h2 id=lbt style="font-size:52px"></h2></div><div class=rt><div class=tabs id=lt>${['PENGENALAN','PENJELASAN','TRAINING GROUND'].map((x,i)=>`<button class=bt data-a=lbt data-i=${i}>${x}</button>`).join('')}</div></div></div><div class="lb2 st"><div id=lbb class=gl></div></div>`);
PAR.lab='heroSelect';
$('.lks',S.heroSelect).innerHTML=Object.entries(LBM).map(([k,m])=>`<button class="bt lk st" data-a=lbo data-k=${k} style="opacity:1;padding:20px 32px;gap:24px"><i style="width:84px;height:84px;color:var(--cy)">${ic(m.i,44)}</i><span><b style="color:#fff">${m.n}</b><small>${m.e}</small><small style="display:block;font-size:22px;color:var(--cy)">Pengenalan • Penjelasan • Training Ground</small></span></button>`).join('');

const _en2=enter;enter=id=>{_en2(id);if(id==='lab')lbR()};
const _go=go;go=function(id,o){if(id==='heroPage'&&cur==='lab'){if(LB.pass)LB.pass=0;else{LB.x={};lbR();return Promise.resolve()}}return _go(id,o)};
Object.assign(XX,{
 lbo:b=>{LB.k=b.dataset.k;LB.t=0;LB.x={};go('lab')},
 lbt:b=>{LB.t=+b.dataset.i;lbR()},
 lbA:b=>{const x=LB.x,q=x.qs[x.i];if(x.d)return;x.d=1;const ok=+b.dataset.i===q.a;if(ok)x.s++;$$('.lo .bt').forEach((e,i)=>{if(i===q.a)e.classList.add('ok');else if(e===b)e.classList.add('no')});$('#lbf').innerHTML=(ok?'✔ Benar. ':'✘ Belum tepat. ')+lbEsc(q.w)+'<br><br><button class="bt bs" data-a=lbn>LANJUT</button>';snd(ok?'ok':'err')},
 lbn:()=>{LB.x.i++;LB.x.d=0;lbR()},
 lbr:()=>{LB.x={};lbR()},
 lbp:b=>pxOpen(b.dataset.q),
 lbh:()=>{LB.pass=1;go('heroPage')},
 lbs:()=>go(HERO==='angela'?'training':'gtr'),
 lbc:async()=>{const a=$('#lcA').value,b=$('#lcB').value;if(a===b)return toast('Pilih dua hero yang berbeda');
  if(!lbK(a)||!lbK(b))toast('Pixy lagi riset hero… tunggu sebentar');
  try{await lbLd(a);await lbLd(b)}catch(e){return toast(e&&e.code==='unknown'?'Hero tidak dikenal':'Server AI belum aktif: cek ANTHROPIC_API_KEY di Vercel')}
  LB.a=a;LB.b=b;LB.x={};lbR()}});


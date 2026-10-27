
/* ===== HELPER ===== */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,EZ='cubic-bezier(.22,1,.36,1)';
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const A=(e,k,o)=>e.animate(k,{easing:EZ,...o,...(RM?{duration:1,delay:0}:{})});
const st=$('#st'),S={};
let cur='menu',busy=false,sk=-1,tab=0,tk=0,ac,sfx=true,vib=true,hi=!RM,skipRot=false;

/* ===== KONFIGURASI (ubah di sini) ===== */
const ASSETS={splash:'splash.jpg',hero:'hero.jpg',avatar:'avatar.jpg',shots:['shot-1.jpg','shot-2.jpg','shot-3.jpg','shot-4.jpg']}; // GANTI GAMBAR DI SINI: URL/base64 art Angela (atau Setting > Ganti Gambar Hero)
const TIPS=['Spam skill secara berkala agar stack movement speed tetap maksimal.','Gunakan Heartguard ke Jungler atau Core yang sedang gank/diincar lawan.','Tetap di barisan belakang, masuk ke tubuh hero penyerang utama saat war.','Beli Glowing Wand lebih awal jika lawan punya lifesteal.','Winter Crown membantu menghindari burst damage karena Angela rapuh.'];
const LOAD=[[0,0],[650,30],[900,30],[1850,68],[2000,68],[2950,92],[3300,100]]; // [ms,%] total sekitar 3.3 dtk, diacak ±9%

/* ===== DATA KONTEN (dari PDF) ===== */
const D={
menu:{eb:'MOBILE LEGENDS: BANG BANG',t:'PROJECT: ANGELA',ping:18,pn:'GAME MENU',b:['START GAME (Hero Select)','MULTIPLAYER','SETTING','QUIT GAME']},
sel:{eb:'MODE: CLASSIC / RANKED',t:'HERO SELECT',coin:1786,dia:1330,badge:'SELECTED HERO',n:'Angela',role:'Support • Guard/Support',open:'BUKA HALAMAN HERO',lock:['Hero Terkunci (Slot 1)','Hero Terkunci (Slot 2)','Hero Terkunci (Slot 3)'],need:'Perlu 32,000 Battle Points'},
hero:{pros:'Global Shield, Heal Konsisten, Slow CC',cons:'Mobilitas Rendah, Rapuh',h:'PILIH SKILL & INFO',ins:'Klik salah satu ikon skill di bawah untuk melihat detail spesifik, cooldown, mana cost, dan tips penggunaannya.',bs:'BUILDS SETUP'},
skills:[
{k:'Passive',ey:'PASSIVE SKILL',n:'Smart Heart',tags:['Passive','Speed Up'],d:'Angela gains <b>5% extra Movement Speed</b> for 4s each time she casts a skill (<b class=p>up to 20%</b>). When attached to an allied hero, the Movement Speed boost is transferred to the allied hero.',tip:'Spam skill secara berkala untuk menjaga stack movement speed tetap maksimal saat rotasi atau mengejar musuh.'},
{k:'Skill 1',ey:'SKILL 1',n:'Love Waves',tags:['Heal','AOE'],cd:8,mana:60,d:'Menembakkan gelombang cinta memberikan <b>170 (+80% Total Magic Power) Magic Damage</b>, stack Lover’s Mark (tambah damage 20% & slow 8% per stack), serta memulihkan <b class=p>150 (+75% Total Magic Power) HP</b> rekan satu tim. Bisa menyimpan hingga 5 charge.',adv:'Spell Vamp 50%; menampakkan posisi musuh sesaat; saat attached ke rekan, cooldown skill ini berkurang 50%.',lt:'Tabel Level Skill 1',lv:['170','200','230','260','290','320']},
{k:'Skill 2',ey:'SKILL 2',n:'Puppet-on-a-String',tags:['Slow','CC'],cd:13,mana:90,d:'Meluncurkan benang ke musuh memberikan <b>300 (+40% Total Magic Power) Magic Damage</b> dan slow bertahap. Jika musuh tetap terikat selama 3 detik, mereka akan terkena <b class=p>Immobilize 1.5 detik</b> dan tambahan <b>450 (+60% Total Magic Power) Damage</b>.',adv:'slow bertahap hingga 80%; tiap stack Lover’s Mark menambah final damage 20%.',lt:'Tabel Level Skill 2 (Damage & CD)',lv:['300/13s','330/12.4s','360/11.8s','390/11.2s','420/10.6s','450/10.0s']},
{k:'Ultimate',ey:'ULTIMATE SKILL',n:'Heartguard',tags:['Attach','Shield'],cd:60,mana:100,d:'Angela memberikan <b>600 (+150% Total Magic Power) Shield</b> ke hero rekan tanpa batasan jarak. Setelah masuk ke tubuh rekan selama 20 detik, Angela dapat <b class=p>mengeluarkan skill tanpa menggunakan Mana</b>.',adv:'skill bisa ditekan lagi untuk membatalkan channeling atau melepas diri; attach berakhir lebih awal jika rekan mati.',lt:'Tabel Base Shield Ultimate',lv:['600 HP','800 HP','1000 HP']}],
items:[['Flask of the Oasis','Item support utama; memberi shield tambahan saat HP rekan turun di bawah 30% dalam 3 detik.'],['Fleeting Time','Assist atau kill mengurangi cooldown ultimate, membuat skill Heartguard lebih sering dipakai di teamfight.'],['Glowing Wand','Membakar musuh (Scorch) dan mengurangi efek regen/heal musuh (Lifebane). Bisa dibeli lebih awal jika lawan punya lifesteal.'],['Winter Crown','Efek aktif membekukan diri sesaat untuk menghindari burst damage musuh karena Angela rapuh.'],['Immortality','Memberikan kesempatan kedua bangkit setelah mati di war akhir permainan.'],['Demon Shoes','Sepatu mage untuk regen mana yang stabil selama fase laning.']],
emb:[['TIER 1 • AGILITY','Tambahan movement speed; melengkapi passive Smart Heart.'],['TIER 2 • PULL YOURSELF TOGETHER','Respawn & CD battle spell lebih singkat agar cepat siap.'],['TIER 3 • FOCUSING MARK','Menandai musuh agar rekan satu tim memberi damage tambahan.']],
spl:[['UTAMA • FLICKER','Teleport jarak pendek untuk kabur saat dikunci atau menyusul rekan.'],['SUSTAIN • REVITALIZE','Heal tambahan untuk diri sendiri dan tim di area sekitar saat teamfight.'],['ALTERNATIF • AEGIS / SPRINT','Aegis untuk shield diri atau Sprint untuk rotasi cepat.']],
strat:[['EARLY GAME','Dampingi Jungler / MM','Bantu membersihkan minion awal, lakukan poke menggunakan Skill 1, dan jaga posisi agar tidak mudah diculik.','--pk'],['MID GAME','Maksimalkan Ultimate','Perhatikan map mini. Gunakan Heartguard ke Jungler atau Core yang sedang melakukan gank atau diincar lawan.','--cy'],['LATE GAME','Teamfight Penentu','Tetap berada di barisan belakang yang aman, masuk ke tubuh hero penyerang utama saat war besar pecah.','--gd']]};

/* ===== IKON & ART PLACEHOLDER ===== */
const P={bolt:'M13 2L4 14h6l-1 8 9-12h-6z',heart:'M12 21s-8-5.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.5-8 11-8 11z',lock:'M6 10V8a6 6 0 1112 0v2h1v11H5V10zm3 0h6V8a3 3 0 10-6 0z',dia:'M12 21L3 9l3-5h12l3 5z',coin:'M12 3a9 9 0 100 18 9 9 0 000-18z',star:'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z',shield:'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5zM12 16s-3-2-3-4a1.7 1.7 0 013-1 1.7 1.7 0 013 1c0 2-3 4-3 4z',back:'M15 5l-7 7 7 7',chain:'M10 14l4-4M8 12l-2 2a3 3 0 004 4l2-2M16 12l2-2a3 3 0 00-4-4l-2 2',wifi:'M2 9a15 15 0 0120 0M5.5 12.5a10 10 0 0113 0M9 16a5 5 0 016 0M12 20h.01',spk:'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6',img:'M4 5h16v14H4zM4 17l5-5 4 4 3-3 4 4M9 10h.01'};
const FL='bolt heart lock dia coin star';
const ic=(n,z=44,c='currentColor')=>{const f=FL.includes(n);return `<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="${f?c:'none'}" fill-rule="evenodd" stroke="${f?'none':c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`};
const SVG="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ff2d8a'/><stop offset='.55' stop-color='#4b2a8f'/><stop offset='1' stop-color='#00b8d4'/></linearGradient></defs><rect width='800' height='1000' fill='url(#g)'/><g fill='#fff' opacity='.13'><circle cx='140' cy='160' r='70'/><circle cx='690' cy='720' r='110'/><circle cx='600' cy='200' r='40'/></g><circle cx='400' cy='300' r='110' fill='none' stroke='#ffd23f' stroke-width='6' opacity='.85'/><path d='M400 380c-90 0-150 80-160 220l-30 330h380l-30-330c-10-140-70-220-160-220z' fill='#1a1440' opacity='.88'/><circle cx='400' cy='300' r='72' fill='#ffb3cf'/><path d='M325 300c0-70 150-70 150 0-20-40-130-40-150 0z' fill='#ff5c9a'/><path d='M400 650c-60-40-60-90-20-90 12 0 20 8 20 20 0-12 8-20 20-20 40 0 40 50-20 90z' fill='#ff2d8a'/></svg>";
const art=(k,u)=>st.style.setProperty('--'+k,`url("${u}")`);
const PH='data:image/svg+xml,'+encodeURIComponent(SVG);art('art',ASSETS.splash||PH);art('hero',ASSETS.hero||PH);art('av',ASSETS.avatar||ASSETS.hero||PH);

/* ===== AUDIO, GETAR, TOAST, ANIMASI KECIL ===== */
const snd=t=>{if(!sfx||!ac)return;const[f,d,w]={click:[620,.06,'square'],back:[420,.08,'triangle'],ok:[880,.16,'sine'],err:[150,.22,'sawtooth'],tick:[1250,.03,'square'],ding:[1400,.4,'sine']}[t],o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=w;o.frequency.value=f;g.gain.setValueAtTime(.07,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(ac.destination);o.start(n);o.stop(n+d)};
const vb=p=>vib&&navigator.vibrate&&navigator.vibrate(p);
const toast=m=>{const t=$('#ts');t.textContent=m;t.animate([{opacity:0,transform:'translate(-50%,-30px)'},{opacity:1,transform:'translate(-50%,0)',offset:.12},{opacity:1,transform:'translate(-50%,0)',offset:.85},{opacity:0,transform:'translate(-50%,-30px)'}],{duration:2400})};
const cnt=(e,to,ms,f=v=>Math.round(v).toLocaleString('en-US'))=>{const t0=performance.now();(function s(t){const k=Math.min(1,(t-t0)/ms);e.textContent=f(to*(1-(1-k)**3));k<1&&requestAnimationFrame(s)})(t0)};
const stag=r=>$$('.st',r).forEach((e,i)=>A(e,[{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'none'}],{duration:500,delay:80+i*70,fill:'backwards'}));
const shake=e=>A(e,[{transform:'none'},{transform:'translateX(-14px)'},{transform:'translateX(14px)'},{transform:'translateX(-10px)'},{transform:'translateX(10px)'},{transform:'none'}],{duration:400});

/* ===== SCREEN ===== */
const mk=(id,h)=>{const s=document.createElement('section');s.className='sc';s.id=id;s.innerHTML=h;st.append(s);S[id]=s};
const hd=(t,eb,r='')=>`<div class="hd st"><button class="bt bk" data-a=back aria-label="Kembali">${ic('back')}</button><div>${eb?`<div class=cr>${eb}</div>`:''}<h2>${t}</h2></div><div class=rt>${r}</div></div>`;
const M=D.menu,SE=D.sel,H=D.hero;

mk('menu',`<div class=bg></div><div class=st><div class=cr style="color:var(--pk)">${M.eb}</div><h1 class=o>${M.t}</h1></div>
<div class="ping gl st">${ic('wifi',32,'var(--cy)')}<span id=ms>MS: ${M.ping}ms</span></div>
<div class="pn gl st"><h3>${M.pn}</h3>${M.b.map((b,i)=>`<button class="bt mb st ${['pk','','','rd'][i]}" data-a=${['start','multi','set','quit'][i]}>${b}</button>`).join('')}</div>`);

mk('loading',`<div class=bg></div><div class=cr>${M.t}</div>
<div class=lb><div class=lr><div class=ld><span class=av></span><div id=stt></div></div><div id=pc class=o>0%</div></div><div class=trk><div id=pb></div></div><div class="tip gl"><b>TIPS</b><span id=tp></span></div></div><div class=ver>v1.0 - MS: 18ms</div>`);

mk('heroSelect',hd(SE.t,SE.eb,`<div class=pill>${ic('coin',36,'var(--gd)')}<span id=coin>0</span></div><div class=pill>${ic('dia',36,'var(--cy)')}<span id=dia>0</span></div>`)+
`<div class=sel><button class="bt card st" data-a=open><span class=badge>${SE.badge}</span><span class=av></span><span class=o style="font-size:60px">${SE.n}</span><span style="color:var(--mu)">${SE.role}</span><span class=go>${SE.open}</span></button>
<div class=lks>${SE.lock.map(t=>`<button class="bt lk st" data-a=lock><i>${ic('lock',48)}</i><span><b>${t}</b><small>${SE.need}</small></span></button>`).join('')}</div></div>`);

mk('heroPage',`<div class="hd st"><button class="bt bk" data-a=back aria-label="Kembali">${ic('back')}</button><h2>${SE.n}</h2><span class=chip>${SE.role}</span><div class=rt><button class="bt bs" data-a=builds>${H.bs}</button></div></div>
<div class=hp><div class="art st"><div class=gl><small>KELEBIHAN</small><b>${H.pros}</b></div><div class=gl><small>KEKURANGAN</small><b style="color:var(--rd)">${H.cons}</b></div></div>
<div class="rc st"><h3>${H.h}</h3><p>${H.ins}</p><div class=ibs>${D.skills.map((s,i)=>`<button class="bt ib" data-a=sk data-i=${i} style="--c:var(--${['pk','cy','pk','cy'][i]})">${ic(['bolt','heart','chain','shield'][i],48)}<span>${s.k}</span></button>`).join('')}</div><div id=dp hidden></div></div></div>`);

mk('builds',`<div class="hd st"><button class="bt bk" data-a=back aria-label="Kembali">${ic('back')}</button><div><div class=cr id=beb></div><h2 id=bti></h2></div><div class=rt><div class=tabs><i id=ti></i>${['ITEM','EMBLEM','SPELL'].map((t,i)=>`<button class=bt data-a=tab data-i=${i}>${t}</button>`).join('')}</div></div></div><div id=pn class=pane></div><button class="bt go2 st" data-a=strat>GAME STRATEGY</button>`);

mk('strategy',hd('Pola Rotasi & Tips Bermain','GAME STRATEGY')+`<div class="tl st">${D.strat.map((x,i)=>`<button class="bt nd2" data-a=foc data-i=${i} style="--c:var(${x[3]})">${i+1}</button>`).join('')}</div><div class=sgs>${D.strat.map((x,i)=>`<button class="bt sg st" data-a=foc data-i=${i} style="--c:var(${x[3]})"><small>${x[0]}</small><h4>${x[1]}</h4><p>${x[2]}</p></button>`).join('')}</div><button class="bt go2 st" data-a=done>SELESAI</button>`);

mk('ending',`<div class="hc st">${ic('heart',90)}</div><h1 class="o st" style="font-size:96px">THANK YOU FOR PLAYING</h1><button class="bt mb pk st" style="width:480px" data-a=home>MAIN MENU</button>${Array.from({length:14},(_,i)=>`<span class=fl style="left:${5+i*6.8}%;animation-delay:${(i*.9)%6}s;font-size:${24+i%4*10}px">♥</span>`).join('')}`);
S.menu.classList.add('on');$('#sn').innerHTML=ic('spk',32);

/* ===== PANEL SKILL ===== */
function pick(i){
 if(i<0||i>3)return;sk=i;const s=D.skills[i],p=$('#dp'),mx=s.lv?Math.max(...s.lv.map(parseFloat)):0;
 $$('.ib').forEach((b,j)=>b.classList.toggle('a',j===i));p.hidden=false;p.className='';
 p.innerHTML=`<div class=r1><span class=cr style="color:var(--pk)">${s.ey}</span>${s.tags.map(t=>`<span class=tg>${t}</span>`).join('')}<span class=ab>${s.adv?'<button class="bt ad" data-a=adv>Detail Lanjutan ▾</button>':''}<button class="bt ad" data-a=shot aria-label="Screenshot">${ic('img',26,'var(--cy)')}</button></span></div>
<div class=r2><h3>${s.n}</h3><span>${s.cd?'<span class=ch id=cd></span><span class="ch c2" id=mn></span>':''}</span></div>${s.tip?'<div class=lt>Deskripsi Game</div>':''}<div class=dsc>${s.d}</div>${s.adv?`<div class=dtl><b>Detail Lanjutan</b>${s.adv}</div>`:''}${s.tip?`<div class=tipc><b>Tips Penggunaan</b>${s.tip}</div>`:''}
${s.lv?`<div class=lt>${s.lt}</div><div class=lvs>${s.lv.map((v,j)=>`<button class="bt lv${j?'':' a'}" data-a=lv><small>Lv.${j+1}</small><b>${v}</b><i style="height:${14+36*parseFloat(v)/mx}px"></i></button>`).join('')}</div>`:''}`;
 A(p,[{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'none'}],{duration:400});
 if(s.cd){cnt($('#cd'),s.cd,700,v=>'CD: '+v.toFixed(1)+'s');cnt($('#mn'),s.mana,700,v=>'Mana: '+Math.round(v))}
}

/* ===== TAB BUILDS ===== */
const paneItem=()=>buildPane();
const paneEmb=()=>`<div class=em><div class="eh st">${ic('shield',56,'var(--pk)')}<h3>Emblem Utama: Support</h3></div>${D.emb.map((x,i)=>`${i?'<div class=cn><i></i></div>':''}<div class="tier st"><div class=nd>${i+1}</div><div class=cd2><small>${x[0]}</small><p>${x[1]}</p></div></div>`).join('')}</div>`;
const paneSp=()=>`<div class="eh st">${ic('star',52,'var(--cy)')}<h3 style="color:var(--cy)">Battle Spell Pilihan</h3></div><div class=sps>${D.spl.map(x=>`<button class="bt sp st" data-a=spl><small>${x[0]}</small><p>${x[1]}</p></button>`).join('')}</div>`;
function tabTo(i,anim=1){
 if(i<0||i>2)return;const d=i>=tab?1:-1,k=++tk,p=$('#pn');tab=i;
 $$('.tabs button').forEach((b,j)=>b.classList.toggle('a',j===i));$('#ti').style.transform=`translateX(${i*190}px)`;
 $('#beb').textContent=i?'EMBLEM & SPELL SETUP':'BUILD & EQUIPMENT';$('#bti').textContent=i?'Konfigurasi Pendukung':'Rekomendasi Item '+HN();
 p.innerHTML=[paneItem,paneEmb,paneSp][i]();
 if(anim){A(p,[{opacity:0,transform:`translateX(${60*d}px)`},{opacity:1,transform:'none'}],{duration:450});stag(p)}
 if(i===0)$$('.sl').forEach((s,j)=>setTimeout(()=>{if(k!==tk)return;s.classList.add('f');s.textContent=j+1;A(s,[{transform:'scale(.3)'},{transform:'scale(1.15)'},{transform:'none'}],{duration:350});snd('tick')},700+j*260));
 if(i===1)$$('.nd,.cn i').forEach((e,j)=>setTimeout(()=>{if(k!==tk)return;e.classList.add('lit');e.matches('.nd')&&snd('tick')},300+j*350));
}

/* ===== LOADING SCREEN ===== */
function load(){
 const k=.91+Math.random()*.18,T=LOAD.map(([t,p])=>[t*k,p]),E=T[T.length-1][0],t0=performance.now(),pc=$('#pc'),pb=$('#pb'),sT=$('#stt'),tp=$('#tp');let lm=0,ti=-1,tt=-9e3;
 (function f(now){
  const t=now-t0;let p=100;
  if(t<E){const i=Math.max(1,T.findIndex(x=>t<=x[0])),a=T[i-1],b=T[i];p=a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])}
  pc.textContent=Math.floor(p)+'%';pb.style.transform=`scaleX(${p/100})`;
  sT.textContent=p<25?'Menghubungkan ke server...':p<55?'Memuat data hero...':p<85?'Menyiapkan arena...':'Siap bertempur!';
  const m=Math.floor(p/10);if(m>lm){lm=m;snd(m>=10?'ding':'tick')}
  if(t-tt>1100){tt=t;ti=(ti+1)%TIPS.length;tp.textContent=TIPS[ti];A(tp,[{opacity:0},{opacity:1}],{duration:400})}
  if(t<E)requestAnimationFrame(f);else setTimeout(()=>go('heroSelect',{fx:'black',ms:500}),300)
 })(t0)
}

/* ===== TRANSISI & NAVIGASI ===== */
const KF={wipe:[[{transform:'translateX(-130%) skewX(-18deg)'},{transform:'skewX(-18deg)'}],[{transform:'skewX(-18deg)'},{transform:'translateX(130%) skewX(-18deg)'}]],black:[[{opacity:0},{opacity:1}],[{opacity:1},{opacity:0}]]};
function enter(id){
 const b=S[id];
 if(id==='builds')tabTo(tab,0);
 stag(b);
 if(id==='loading'){$('#pb').style.transform='scaleX(0)';load()}
 if(id==='heroSelect'){cnt($('#coin'),SE.coin,900);cnt($('#dia'),SE.dia,900);A($('.card'),[{filter:'brightness(2.4)'},{filter:'none'}],{duration:600,delay:300});snd('ok');setTimeout(()=>toast('Hero dipilih: Angela'),500)}
}
async function swap(a,b,ko,mo,ki,mi){
 const x=A(a,ko,{duration:mo,fill:'forwards'});await x.finished;a.classList.remove('on');x.cancel();
 b.classList.add('on');enter(b.id);await A(b,ki,{duration:mi}).finished;
}
async function go(id,o={}){
 if(busy||id===cur)return;busy=true;st.style.pointerEvents='none';
 const a=S[cur],b=S[id],d=o.back?-1:1;
 if(o.fx){const f=$('#fx'),ms=o.ms||450;f.className=o.fx;f.style.display='block';const c=A(f,KF[o.fx][0],{duration:ms,fill:'forwards'});await c.finished;a.classList.remove('on');b.classList.add('on');enter(id);const u=A(f,KF[o.fx][1],{duration:ms,fill:'forwards'});c.cancel();await u.finished;u.cancel();f.style.display='none'}
 else if(o.zoom)await swap(a,b,[{opacity:1,transform:'none',filter:'blur(0px)'},{opacity:0,transform:'scale(1.25)',filter:'blur(14px)'}],350,[{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'none'}],450);
 else await swap(a,b,[{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${-40*d}px)`}],300,[{opacity:0,transform:`translateX(${40*d}px)`},{opacity:1,transform:'none'}],450);
 cur=id;busy=false;st.style.pointerEvents='';
}
const PAR={heroSelect:'menu',heroPage:'heroSelect',builds:'heroPage',strategy:'builds'};
const back=()=>PAR[cur]&&go(PAR[cur],{back:1});
const reset=()=>{sk=-1;tab=0;$$('.ib').forEach(b=>b.classList.remove('a'));$('#dp').hidden=true};
const nav=d=>{if(cur==='heroPage')pick(Math.max(0,Math.min(3,sk+d)));if(cur==='builds')tabTo(tab+d)};

/* ===== MODAL ===== */
function modal(h,c=''){const m=$('#md');m.innerHTML=`<div class="bx gl ${c}">${h}</div>`;m.classList.add('on');A(m.firstChild,[{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'none'}],{duration:200});$('button',m)?.focus()}
const shut=()=>{const m=$('#md');m.classList.remove('on');m.innerHTML=''};
const tg=(k,l,on)=>`<button class="bt tgl${on?' on':''}" data-a=tg data-k=${k}><span>${l}</span><i></i></button>`;
const hiTxt=()=>'Efek Partikel: <b>'+(hi?'Tinggi':'Rendah')+'</b>';

/* ===== DETAIL POP-UP ===== */
const DX={item:[
['ITEM #1 • SUPPORT','Flask of the Oasis','Beli pertama agar shield dan heal Angela makin terasa sejak fase laning. Rekan yang terdesak jadi lebih lama bertahan tanpa Angela harus mengorbankan posisi.','Arahkan Skill 1 ke rekan yang HP-nya hampir di bawah 30% agar efek shield aktif tepat waktu.'],
['ITEM #2 • COOLDOWN','Fleeting Time','Assist atau kill memangkas cooldown ultimate, sehingga Heartguard bisa dipakai berulang di teamfight yang panjang.','Jika lawan mengandalkan lifesteal, Glowing Wand boleh mengambil slot item ini lebih dulu.'],
['ITEM #3 • ANTI-HEAL','Glowing Wand','Memberi efek bakar (Scorch) dan Lifebane yang menurunkan regen dan heal musuh. Efektif untuk menekan hero lifesteal atau sustain tinggi.','Cek susunan hero lawan sebelum membeli; semakin banyak sustain di tim lawan, semakin cepat item ini dibeli.'],
['ITEM #4 • SURVIVAL','Winter Crown','Efek aktif membekukan Angela sesaat untuk menghindari burst damage, cocok karena Angela rapuh.','Aktifkan saat assassin atau core lawan sudah menargetkan Angela, bukan setelah HP terlanjur habis.'],
['ITEM #5 • REVIVE','Immortality','Slot terakhir: memberi kesempatan kedua bangkit setelah mati sehingga Angela masih bisa memakai ultimate di war akhir.','Beli saat game masuk late game, ketika satu kematian bisa menentukan hasil war.'],
['BOOTS • MANA','Demon Shoes','Sepatu mage untuk menjaga mana tetap stabil karena Skill 1 dan Skill 2 Angela cukup boros mana.','Dengan mana yang aman sejak awal, poke Skill 1 bisa dilakukan terus-menerus saat laning.']],
spl:[
['SPELL UTAMA','Flicker','Teleport jarak pendek untuk kabur saat dikunci atau menyusul rekan. Penting karena mobilitas Angela rendah.','Simpan Flicker untuk menyelamatkan diri saat diculik, bukan sekadar mengejar damage.'],
['SPELL SUSTAIN','Revitalize','Heal tambahan untuk diri sendiri dan tim di area sekitar saat teamfight, melengkapi heal dari Skill 1.','Pakai saat rekan sedang bertukar damage di jarak dekat agar heal tidak terbuang.'],
['SPELL ALTERNATIF','Aegis / Sprint','Aegis memberi shield diri untuk bertahan dari burst, sedangkan Sprint mempercepat rotasi dan membantu mengejar atau menjauh.','Pilih Aegis jika lawan banyak assassin; pilih Sprint jika tim sering rotasi cepat antar lane.']],
foc:[
['EARLY GAME','Dampingi Jungler / MM','Tempel dekat rekan inti, poke dengan Skill 1 saat minion lawan menumpuk, dan jaga jarak aman agar tidak mudah diculik.','Selalu lihat minimap; jika jungler lawan menghilang dari pandangan, mundurkan posisi.'],
['MID GAME','Maksimalkan Ultimate','Pantau minimap, lalu pasang Heartguard ke jungler atau core yang sedang gank atau diincar lawan agar mereka lebih aman dan lincah.','Gunakan Skill 2 untuk memperlambat musuh yang mengejar rekan; slow memberi waktu tim berbalik menyerang.'],
['LATE GAME','Teamfight Penentu','Tetap di barisan belakang yang aman, lalu pasang Heartguard ke hero penyerang utama saat war pecah dan jaga mereka tetap hidup.','Simpan Winter Crown dan Flicker sampai jelas siapa target musuh; keduanya penyelamat terakhir.']]};
const dtl=(k,i)=>{const x=DX[k][i];if(!x)return;modal(`<small>${x[0]}</small><h3>${x[1]}</h3><p>${x[2]}</p><div class=tp><b>TIPS</b>${x[3]}</div><button class="bt mb pk" data-a=x>TUTUP</button>`,'dt')};

/* ===== AKSI TOMBOL ===== */
st.addEventListener('click',e=>{
 if(e.target.id==='md')return shut();
 const b=e.target.closest('[data-a]');if(!b||busy)return;
 const X={
  start:()=>go('loading',{fx:'wipe'}),
  multi:()=>modal('<h3>MULTIPLAYER</h3><p>Fitur belum tersedia di versi demo.</p><button class="bt mb pk" data-a=x>OKE</button>'),
  set:()=>modal(`<h3>SETTING</h3>${tg('sfx','Suara Efek',sfx)}${tg('vib','Getar',vib)}${tg('mus','Musik Latar',mus)}${tg('lang','Bahasa: <b>'+(EN?'English':'Indonesia')+'</b>',EN)}${tg('hi',hiTxt(),hi)}<button class="bt mb" data-a=img>Ganti Gambar Hero</button><button class="bt mb pk" data-a=x>TUTUP</button><input type=file accept="image/*" id=fi hidden>`),
  quit:()=>modal('<h3>QUIT GAME</h3><p>Yakin ingin keluar?</p><div class=row><button class="bt mb rd" data-a=qy>KELUAR</button><button class="bt mb" data-a=x>BATAL</button></div>'),
  qy:()=>{shut();go('ending',{fx:'black',ms:800})},
  x:shut,img:()=>$('#fi').click(),
  tg:()=>{const k=b.dataset.k,v=k==='sfx'?(sfx=!sfx):k==='vib'?(vib=!vib):k==='mus'?music():k==='lang'?setLang(b):(hi=!hi,mkp(),hi);b.classList.toggle('on',v);if(k==='hi')b.firstChild.innerHTML=hiTxt();$('#sn').classList.toggle('off',!sfx)},
  mute:()=>{sfx=!sfx;b.classList.toggle('off',!sfx);BGM().muted=!sfx},
  open:()=>go('heroPage',{zoom:1}),
  lock:()=>{shake(b);toast('Perlu 32,000 Battle Points untuk membuka slot ini');snd('err');vb([30,40,30])},
  back,builds:()=>go('builds'),strat:()=>go('strategy'),
  done:()=>go('ending',{fx:'black',ms:800}),
  home:()=>{reset();go('menu',{fx:'black',ms:600})},
  sk:()=>pick(+b.dataset.i),tab:()=>tabTo(+b.dataset.i),
  adv:()=>{const on=$('#dp').classList.toggle('adv');b.textContent=on?'Deskripsi ▴':'Detail Lanjutan ▾'},
  lv:()=>$$('.lv').forEach(x=>x.classList.toggle('a',x===b)),
  shot:()=>modal(`<h3>${D.skills[sk].n}</h3><img src="${ASSETS.shots[sk]}" alt="Screenshot ${D.skills[sk].n}"><button class="bt mb pk" data-a=x>TUTUP</button>`,'w'),
  item:()=>{dtl('item',$$('.itc').indexOf(b));const f=b.classList.contains('f');$$('.itc').forEach(x=>x.classList.remove('f'));!f&&b.classList.add('f')},
  spl:()=>{dtl('spl',$$('.sp').indexOf(b));const f=b.classList.contains('f');$$('.sp').forEach(x=>x.classList.remove('f'));!f&&b.classList.add('f');$('.sps').classList.toggle('d',!f)},
  foc:()=>{dtl('foc',+b.dataset.i);const i=+b.dataset.i,c=$$('.sg')[i],f=c.classList.contains('f');$$('.sg,.nd2').forEach(x=>x.classList.remove('f'));if(!f){c.classList.add('f');$$('.nd2')[i].classList.add('f')}$('.sgs').classList.toggle('d',!f)}
 };
 X[b.dataset.a]&&X[b.dataset.a]();
});
st.addEventListener('pointerdown',e=>{const b=e.target.closest('.bt');if(b&&b.id!=='tap'){snd(b.dataset.a==='back'?'back':'click');vb(12)}});
$('#md').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(f){const u=URL.createObjectURL(f);art('hero',u);art('av',u);toast('Gambar hero diganti')}});

/* ===== INPUT: KEYBOARD & SWIPE ===== */
addEventListener('keydown',e=>{
 const m=$('#md').classList.contains('on');
 if(e.key==='Escape')return m?shut():back();
 if(m&&e.key==='Tab'){const b=$$('button',$('#md')),i=b.indexOf(document.activeElement);e.preventDefault();b[(i+(e.shiftKey?-1:1)+b.length)%b.length].focus()}
 else if(!m&&!busy&&(e.key==='ArrowRight'||e.key==='ArrowLeft'))nav(e.key==='ArrowRight'?1:-1);
});
let tx=0;addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>70&&!busy&&!$('#md').classList.contains('on'))nav(d<0?1:-1)},{passive:true});

/* ===== TAP TO START ===== */
$('#tap').onclick=function(){
 try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}
 snd('ok');music(true);A(this,[{opacity:1},{opacity:0}],{duration:500,fill:'forwards'}).finished.then(()=>this.remove());
 setTimeout(()=>stag(S.menu),250);
};
setInterval(()=>{$('#ms').textContent='MS: '+(15+Math.random()*9|0)+'ms'},2000);

/* ===== PARTIKEL (kelopak sakura) ===== */
const cx=$('#cv').getContext('2d');let ps=[];
function mkp(){ps=Array.from({length:hi?(matchMedia('(pointer:coarse)').matches?30:60):10},()=>({x:Math.random()*1920,y:Math.random()*1080,r:5+Math.random()*9,v:.3+Math.random()*.7,a:Math.random()*6.28,w:Math.random()*.02,c:Math.random()<.7?'#ff7eb6':'#7df3ff'}))}
function draw(){
 if(!document.hidden){cx.clearRect(0,0,1920,1080);for(const p of ps){p.y+=p.v;p.x+=Math.sin(p.a)*.6;p.a+=p.w+.01;if(p.y>1100){p.y=-20;p.x=Math.random()*1920}cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.globalAlpha=.35;cx.fillStyle=p.c;cx.beginPath();cx.ellipse(0,0,p.r,p.r*.55,0,0,6.28);cx.fill();cx.restore()}}
 requestAnimationFrame(draw)
}
mkp();draw();

/* ===== SKALA STAGE 1920x1080 ===== */
function fit(){
 const v=$('#vp'),w=v.clientWidth,h=v.clientHeight,s=Math.min(w/1920,h/1080);
 st.style.transform=`scale(${s})`;st.style.left=(w-1920*s)/2+'px';st.style.top=(h-1080*s)/2+'px';
 $('#rot').style.display=(!skipRot&&innerHeight>innerWidth)?'flex':'none';
}
$('#rk').onclick=()=>{skipRot=true;fit()};
addEventListener('resize',fit);addEventListener('orientationchange',fit);fit();

/* ===== FITUR TAMBAHAN (semua dibuat lewat JavaScript) ===== */
document.head.append(Object.assign(document.createElement('style'),{textContent:`
@keyframes up2{to{transform:translate(var(--dx,0),-120px);opacity:0}}
.fn{position:absolute;left:50%;top:30%;font:800 46px Outfit,sans-serif;text-shadow:0 0 14px #000;animation:up2 1s forwards;pointer-events:none;z-index:5}
.hh{position:absolute;color:var(--pk);font-size:40px;animation:up2 1.2s forwards;pointer-events:none;z-index:4}
.ar{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;height:350px;margin-top:6px}
.ac{position:relative;padding:22px;border-radius:28px;background:var(--sf);border:1px solid var(--bd);display:flex;flex-direction:column;align-items:center;gap:10px}
.ac .av{width:120px;height:120px;margin:0}
.dm{width:120px;height:120px;border-radius:50%;display:grid;place-items:center;color:#fff;background:radial-gradient(circle at 35% 30%,#ffb3cf,#6c5ce7)}
.ac b{font-size:30px}
.bar{width:100%;height:24px;border-radius:12px;background:rgba(255,255,255,.1);overflow:hidden;position:relative}
.bar i{position:absolute;inset:0;transform-origin:left;transition:transform .25s;transform:scaleX(var(--p,1))}
.hpb i{background:#3ddc84}.mpb i{background:#4d7cff}.shb i{background:var(--gd)}.shb{height:12px}
.tx{font-size:24px;color:var(--mu);text-align:center;line-height:1.3}
.cb{display:flex;gap:24px;margin-top:20px}
.sb{position:relative;width:300px;height:200px;border-radius:26px;overflow:hidden;background:var(--sf);border:2px solid var(--c);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:var(--c)}
.sb b{color:#fff;font-size:28px}.sb small{color:var(--mu);font-size:22px}
.cv{display:none;position:absolute;inset:0;background:rgba(5,3,15,.72);place-items:center;font:800 44px Outfit,sans-serif;color:#fff}
#ctl{flex:1;padding:22px 28px;display:flex;flex-direction:column;gap:12px;font-size:26px}
#ctl input{width:100%;accent-color:#ff2d8a}
.rw{display:flex;gap:10px;flex-wrap:wrap}
.rw .bt{padding:6px 18px;border-radius:12px;border:1.5px solid var(--bd);background:var(--sf);font:700 24px 'Plus Jakarta Sans',sans-serif}
.rw .bt.a{border-color:var(--pk);color:var(--pk)}
#lg{margin-top:14px;height:100px;overflow:hidden;font-size:26px;line-height:1.35;color:var(--mu)}
.lvd{margin-top:10px;padding:8px 18px;border-radius:14px;background:rgba(0,229,255,.1);font-size:24px;text-align:center}
`}));
P.fs='M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5';

/* data tabel level lengkap (dari screenshot skill) */
const LV={s1:{c:[60,65,70,75,80,85],d:[170,200,230,260,290,320],h:[150,160,170,180,190,200]},s2:{cd:[13,12.4,11.8,11.2,10.6,10],c:[90,95,100,105,110,115],d:[300,330,360,390,420,450],x:[450,495,540,585,630,675]},u:{c:[100,150,200],s:[600,800,1000]}};
const DT=[0,L=>`Lv.${L+1} · Mana ${LV.s1.c[L]} · Damage ${LV.s1.d[L]} · Heal ${LV.s1.h[L]}`,L=>`Lv.${L+1} · CD ${LV.s2.cd[L].toFixed(1)}s · Mana ${LV.s2.c[L]} · Damage ${LV.s2.d[L]} · Extra ${LV.s2.x[L]}`,L=>`Lv.${L+1} · Mana ${LV.u.c[L]} · Shield ${LV.u.s[L]}`];

/* achievement + misi */
const seen=new Set(),aw=new Set(),award=n=>{if(aw.has(n))return;aw.add(n);toast('ACHIEVEMENT: '+n);snd('ding');vb([20,30,20])};
function lvd(b,i=sk){const f=DT[i];if(!f)return;let e=$('#lvd');if(!e){e=document.createElement('div');e.id='lvd';e.className='lvd';$('#dp').append(e)}e.textContent=f(b?[...b.parentNode.children].indexOf(b):0)}
const _pk=pick;pick=i=>{_pk(i);if(i<0||i>3)return;seen.add(i);$('#mis').textContent=`Skill dipelajari ${seen.size}/4`;seen.size===4&&award('Angela Mastery');lvd(0,i)};
$('.rt',S.heroPage).insertAdjacentHTML('afterbegin','<button class="bt bs" data-a=train style="--c:var(--cy);border-color:var(--cy);color:var(--cy);background:rgba(0,229,255,.1)">HERO TRAINING</button>');
$('.art',S.heroPage).insertAdjacentHTML('afterbegin','<span class=chip id=mis style="position:absolute;left:24px;top:24px;z-index:1">Skill dipelajari 0/4</span>');

/* musik latar (arpeggio sederhana) */
let mus=false,mi,mn=0;const NT=[523,659,784,988,784,659,587,740,880,1109,880,740];
const BGM=()=>$('#bgm');
function music(on){const a=BGM();on=on===undefined?a.paused:on;if(on){a.volume=0;a.play().then(()=>{let v=0;const f=setInterval(()=>{v=Math.min(.6,v+.04);a.volume=v;if(v>=.6)clearInterval(f)},120)}).catch(()=>{mus=false});mus=true}else{a.pause();mus=false}return mus}
document.addEventListener('visibilitychange',()=>{const a=BGM();document.hidden?a.pause():mus&&a.paused&&a.play().catch(()=>{})});

/* ===== HERO TRAINING: simulator skill Angela ===== */
mk('training',hd('Training Ground','HERO TRAINING','<span class=chip>Mode Latihan</span>')+`<div class="ar st">
<div class=ac><span class=av></span><b>Angela</b><div class="bar mpb"><i id=mM></i></div><div class=tx id=mT></div><div class=tx id=sT></div></div>
<div class=ac id=aC><div class=dm>${ic('heart',64)}</div><b>Rekan</b><div class="bar hpb"><i id=aH></i></div><div class="bar shb"><i id=aS></i></div><div class=tx id=aT></div></div>
<div class=ac id=dC><div class=dm>${ic('star',64)}</div><b>Dummy Musuh</b><div class="bar hpb"><i id=dH></i></div><div class=tx id=dT></div><div class=tx id=dS></div></div></div>
<div class="cb st">${[['Love Waves','heart','--cy'],['Puppet-on-a-String','chain','--pk'],['Heartguard','shield','--cy']].map((x,k)=>`<button class="bt sb" data-a=cast data-i=${k} style="--c:var(${x[2]})">${ic(x[1],46)}<b>${x[0]}</b><small>Tombol ${k+1}</small>${k?'':'<small id=pp></small>'}<i class=cv id=v${k}></i></button>`).join('')}
<div id=ctl class=gl><label>Total Magic Power: <b id=mpv>400</b><input type=range id=mp min=0 max=1000 step=50 value=400></label><div class=rw>${[1,2,3,4,5,6].map(i=>`<button class="bt${i<2?' a':''}" data-a=tlv data-i=${i}>Lv.${i}</button>`).join('')}</div><div class=rw><button class=bt data-a=hit>Serang Rekan</button><button class=bt data-a=rst>Reset</button></div></div></div><div id=lg class=st></div>`);
PAR.training='heroPage';
const T={},mA=a=>a.filter(t=>t>performance.now()).length;
function trInit(){
 Object.assign(T,{mana:600,hp:5000,ahp:3000,sh:0,att:0,ms:[],mk:[],cd:[0,0,0],ch:5,chT:0,tz:0,imm:0,rev:0,lv:T.lv||1,mp:T.mp??400,log:[]});
 $('#mp').value=T.mp;$('#mpv').textContent=T.mp;$$('[data-a=tlv]').forEach(x=>x.classList.toggle('a',+x.dataset.i===T.lv));$('#lg').innerHTML='Tekan skill (atau tombol 1/2/3) untuk mencoba.';
 clearInterval(T.iv);T.iv=setInterval(trTick,100);trTick();
}
function log(m){T.log.unshift(m);T.log.length=Math.min(T.log.length,3);$('#lg').innerHTML=T.log.join('<br>')}
function pop(el,txt,col){const s=document.createElement('span');s.className='fn';s.textContent=txt;s.style.color=col;s.style.setProperty('--dx',(Math.random()*80-40)+'px');el.append(s);setTimeout(()=>s.remove(),1000)}
function cast(k){
 const n=performance.now(),L=T.lv-1,U=Math.min(L,2),att=T.att>n,mul=1+.2*mA(T.mk),cost=[LV.s1.c[L],LV.s2.c[L],LV.u.c[U]][k],free=att&&k<2;
 if(k===2&&att){T.att=0;T.sh=0;log('Heartguard dilepas dari rekan');snd('back');return}
 const bad=k===0&&T.ch<1?'Charge Love Waves habis':k&&T.cd[k]>n?'Skill masih cooldown':!free&&T.mana<cost?'Mana kurang':'';
 if(bad){log(bad);snd('err');vb(20);return}
 if(!free)T.mana-=cost;
 if(k===0){
  T.ch--;if(!T.chT)T.chT=n+(att?4000:8000);
  const d=Math.round((LV.s1.d[L]+.8*T.mp)*mul),h=Math.round(LV.s1.h[L]+.75*T.mp);
  T.hp=Math.max(0,T.hp-d);pop($('#dC'),d,'#fff');T.ahp=Math.min(3000,T.ahp+h);pop($('#aC'),'+'+h,'#3ddc84');
  T.mk=T.mk.filter(t=>t>n);T.mk.length<5?T.mk.push(n+3000):(T.mk=T.mk.map(()=>n+3000));
  log(`Love Waves: ${d} dmg · rekan +${h} HP`);if(T.mk.length>=5)award('Full Stack Love');
 }else if(k===1){
  T.cd[1]=n+LV.s2.cd[L]*1000;T.tz=n;T.tl=L;T.tm=T.mp;
  const d=Math.round((LV.s2.d[L]+.4*T.mp)*mul);T.hp=Math.max(0,T.hp-d);pop($('#dC'),d,'#fff');log(`Puppet-on-a-String: ${d} dmg · benang terpasang`);
 }else{
  T.sh=Math.round(LV.u.s[U]+1.5*T.mp);T.att=n+20000;T.cd[2]=n+60000;log(`Heartguard: shield ${T.sh} · attach 20 dtk, skill gratis Mana`);
 }
 T.ms.push(n+4000);T.ms=T.ms.filter(t=>t>n).slice(-4);snd('ok');vb(12);
}
function trTick(){
 if(cur!=='training'&&!busy){clearInterval(T.iv);return}
 const n=performance.now();T.mana=Math.min(600,T.mana+1.2);
 if(T.ch<5&&T.chT&&n>=T.chT){T.ch++;T.chT=T.ch<5?n+(T.att>n?4000:8000):0}
 if(T.tz&&n-T.tz>=3000){const x=Math.round((LV.s2.x[T.tl]+.6*T.tm)*(1+.2*mA(T.mk)));T.hp=Math.max(0,T.hp-x);T.imm=n+1500;T.tz=0;pop($('#dC'),x,'#ff2d8a');log(`Immobilize 1.5 dtk + ${x} dmg`);award('Dalang Boneka')}
 if(T.att&&T.att<=n){T.att=0;T.sh=0;log('Attach selesai')}
 if(T.rev&&n>=T.rev){T.rev=0;T.ahp=3000}
 if(T.hp<=0){T.hp=5000;log('Dummy hancur, HP dipulihkan')}
 const kk=mA(T.mk),ms=mA(T.ms),sl=Math.min(80,Math.max(kk*8,T.tz?(n-T.tz)/37.5:0));
 $('#mM').style.setProperty('--p',T.mana/600);$('#mT').textContent=`Mana ${Math.round(T.mana)}/600`;
 $('#sT').textContent=T.att>n?`Boost MS +${ms*5}% pindah ke rekan`:`Movement Speed +${ms*5}%`;
 $('#dH').style.setProperty('--p',T.hp/5000);$('#dT').textContent=`HP ${T.hp}/5000`;
 $('#dS').textContent=`Lover’s Mark ${'♥'.repeat(kk)}${'♡'.repeat(5-kk)} · Slow ${Math.round(sl)}%${T.imm>n?' · IMMOBILIZE':''}`;
 $('#aH').style.setProperty('--p',T.ahp/3000);$('#aS').style.setProperty('--p',Math.min(1,T.sh/1600));
 $('#aT').textContent=`HP ${Math.round(T.ahp)}/3000 · Shield ${T.sh}${T.att>n?` · Attach ${Math.ceil((T.att-n)/1000)}s`:''}${T.rev?' · gugur':''}`;
 [0,1,2].forEach(k=>{const r=k?Math.max(0,T.cd[k]-n):T.ch<1?Math.max(0,T.chT-n):0,v=$('#v'+k);v.style.display=r?'grid':'none';v.textContent=(r/1000).toFixed(1)});
 $('#pp').textContent='●'.repeat(T.ch)+'○'.repeat(5-T.ch);
}
$('#mp').oninput=e=>{T.mp=+e.target.value;$('#mpv').textContent=T.mp};
const _en=enter;enter=id=>{_en(id);if(id==='training')trInit()};
addEventListener('keydown',e=>{if(cur==='training'&&!busy&&!$('#md').classList.contains('on')&&e.key.length===1&&'123'.includes(e.key))cast(+e.key-1)});

/* aksi tambahan, parallax, hati saat tap, fullscreen */
const XX={
 train:()=>go('training'),cast:b=>cast(+b.dataset.i),rst:()=>trInit(),lv:b=>lvd(b),
 tlv:b=>{T.lv=+b.dataset.i;$$('[data-a=tlv]').forEach(x=>x.classList.toggle('a',x===b))},
 hit:()=>{if(T.rev)return;const n=performance.now();let d=500;const a=Math.min(T.sh,d);T.sh-=a;d-=a;T.ahp-=d;pop($('#aC'),'-500','#ff5a6a');snd('err');vb(15);log(`Rekan diserang 500${a?` (shield menyerap ${a})`:''}`);if(T.ahp<=0){T.ahp=0;T.rev=n+3000;if(T.att>n){T.att=0;T.sh=0;log('Rekan gugur, attach berakhir lebih awal')}}},
 home:()=>{seen.clear();aw.clear();$('#mis').textContent='Skill dipelajari 0/4'},
 fs:()=>{try{const d=document;(d.fullscreenElement?d.exitFullscreen():d.documentElement.requestFullscreen()).catch(()=>toast('Fullscreen tidak didukung di sini'))}catch(e){toast('Fullscreen tidak didukung di sini')}}
};
st.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||busy)return;const f=XX[b.dataset.a];f&&f(b)});
st.insertAdjacentHTML('beforeend','<button class="bt dk" style="left:92px" data-a=fs aria-label="Layar penuh">'+ic('fs',32)+'</button>');
const pt=e=>{const r=st.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
st.addEventListener('pointermove',e=>{if(cur!=='menu')return;const[x,y]=pt(e);$('#menu .bg').style.transform=`translate(${(.5-x)*24}px,${(.5-y)*16}px)`});
st.addEventListener('pointerdown',e=>{if(cur!=='menu'||e.target.closest('.bt'))return;const[x,y]=pt(e),h=document.createElement('span');h.className='hh';h.textContent='♥';h.style.left=x*1920+'px';h.style.top=y*1080+'px';S.menu.append(h);setTimeout(()=>h.remove(),1200)});

/* ===== BAHASA ID/EN, RIPPLE, PETUNJUK IDLE, SCANLINE ===== */
document.head.append(Object.assign(document.createElement('style'),{textContent:'#st::after{content:"";position:absolute;inset:0;z-index:6;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 4px)}'}));
let EN=false;const TR=new Map(),vp=$('#vp'),add=(a,b)=>a&&b&&TR.set(a.trim(),b),E2=(a,b)=>a.forEach((x,i)=>add(x,b[i]));
/* kamus teks UI: Indonesia=English */
'Menghubungkan ke server...=Connecting to server...|Memuat data hero...=Loading hero data...|Menyiapkan arena...=Preparing arena...|Siap bertempur!=Ready for battle!|BUKA HALAMAN HERO=OPEN HERO PAGE|Hero dipilih: Angela=Hero selected: Angela|Perlu 32,000 Battle Points=Requires 32,000 Battle Points|Perlu 32,000 Battle Points untuk membuka slot ini=Requires 32,000 Battle Points to unlock this slot|KELEBIHAN=STRENGTHS|KEKURANGAN=WEAKNESSES|PILIH SKILL & INFO=SELECT SKILL & INFO|Deskripsi Game=Game Description|Tips Penggunaan=Usage Tips|Detail Lanjutan=Advanced Details|Detail Lanjutan ▾=Advanced Details ▾|Deskripsi ▴=Description ▴|Tabel Level Skill 1=Skill 1 Level Table|Tabel Level Skill 2 (Damage & CD)=Skill 2 Level Table (Damage & CD)|Tabel Base Shield Ultimate=Ultimate Base Shield Table|Rekomendasi Item Angela=Angela Item Recommendations|Konfigurasi Pendukung=Support Setup|Emblem Utama: Support=Main Emblem: Support|Battle Spell Pilihan=Recommended Battle Spells|Pola Rotasi & Tips Bermain=Rotation Pattern & Gameplay Tips|SELESAI=DONE|Fitur belum tersedia di versi demo.=Feature not available in the demo version.|OKE=OK|Yakin ingin keluar?=Are you sure you want to quit?|KELUAR=QUIT|BATAL=CANCEL|TUTUP=CLOSE|Suara Efek=Sound Effects|Getar=Vibration|Musik Latar=Background Music|Bahasa:=Language:|Efek Partikel:=Particle Effects:|Tinggi=High|Rendah=Low|Ganti Gambar Hero=Change Hero Image|Gambar hero diganti=Hero image changed|Fullscreen tidak didukung di sini=Fullscreen is not supported here|Putar layar ke landscape=Rotate your screen to landscape|Tetap lanjut=Continue anyway|Mode Latihan=Practice Mode|Rekan=Ally|Dummy Musuh=Enemy Dummy|Serang Rekan=Hit Ally|Tekan skill (atau tombol 1/2/3) untuk mencoba.=Press a skill (or keys 1/2/3) to try.'.split('|').forEach(p=>add(...p.split('=')));
/* kamus dari DATA (urutan sama dengan D) */
E2(D.sel.lock,['Locked Hero (Slot 1)','Locked Hero (Slot 2)','Locked Hero (Slot 3)']);
E2(TIPS,['Spam skills regularly to keep your movement speed stacks maxed.','Use Heartguard on the Jungler or Core who is ganking or being targeted.','Stay in the back line and attach to the main attacker when the big war starts.','Buy Glowing Wand earlier if the enemy has lifesteal.','Winter Crown helps avoid burst damage because Angela is fragile.']);
E2([D.hero.pros,D.hero.cons,D.hero.ins],['Global Shield, Consistent Heal, Slow CC','Low Mobility, Fragile','Click one of the skill icons below to see specific details, cooldown, mana cost, and usage tips.']);
E2(D.items.map(x=>x[1]),['Main support item; grants an extra shield when an ally’s HP drops below 30% within 3s.','Assists or kills reduce the ultimate’s cooldown, letting you use Heartguard more often in teamfights.','Burns enemies (Scorch) and reduces their regen/heal effects (Lifebane). Buy it earlier if the enemy has lifesteal.','Its active briefly freezes you to avoid enemy burst damage, since Angela is fragile.','Gives a second chance to revive after dying in the late-game war.','Mage boots for steady mana regen during the laning phase.']);
E2(D.emb.map(x=>x[1]),['Extra movement speed; complements the Smart Heart passive.','Shorter respawn & battle spell cooldown so you’re ready faster.','Marks an enemy so teammates deal extra damage.']);
E2(D.spl.map(x=>x[1]),['Short-range teleport to escape when locked down or to catch up with allies.','Extra heal for yourself and nearby allies during teamfights.','Aegis to shield yourself, or Sprint for fast rotations.']);
E2(D.strat.flatMap(x=>[x[1],x[2]]),['Accompany the Jungler / MM','Help clear early minions, poke with Skill 1, and keep your position so you can’t be easily picked off.','Maximize Your Ultimate','Watch the minimap. Use Heartguard on the Jungler or Core who is ganking or being targeted by the enemy.','Decisive Teamfight','Stay safely in the back line, then attach to the main attacker when the big war breaks out.']);
E2([D.skills[0].tip,D.skills[1].adv,D.skills[2].adv,D.skills[3].adv],['Spam skills regularly to keep your movement speed stacks maxed when rotating or chasing enemies.','Spell Vamp 50%; briefly reveals enemy positions; when attached to an ally, this skill’s cooldown is reduced by 50%.','gradual slow up to 80%; each Lover’s Mark stack adds 20% final damage.','the skill can be pressed again to cancel the channeling or detach; the attach ends early if the ally dies.']);
const ENF=[0,['Fires waves of love dealing ',0,', stacking Lover’s Mark (+20% damage & 8% slow per stack), and restoring ',0,' to allies. Can store up to 5 charges.'],['Launches a string at the enemy dealing ',0,' and gradually slowing them. If the enemy stays tied for 3 seconds, they are hit with ','Immobilize for 1.5 seconds',' and take an additional ',0,0],['Angela gives a ',0,' to an allied hero with no distance limit. While attached to the ally for 20 seconds, Angela can ','cast skills without using Mana',0]];
D.skills.forEach((s,i)=>ENF[i]&&s.d.split(/<[^>]+>/).forEach((f,j)=>add(f,ENF[i][j])));
/* aturan untuk teks dinamis (log training, dll) */
const RX=[[/^Rekan gugur, attach berakhir lebih awal$/,'Ally down, attach ended early'],[/^Rekan diserang (\d+)/,'Ally hit for $1'],[/attach 20 dtk, skill gratis Mana/,'attached 20s, skills cost no Mana'],[/^Skill dipelajari /,'Skills learned '],[/^Tombol /,'Key '],[/pindah ke rekan/,'moved to ally'],[/\bgugur\b/,'down'],[/rekan \+/,'ally +'],[/benang terpasang/,'string attached'],[/shield menyerap/,'shield absorbed'],[/ dtk/g,'s'],[/^Attach selesai$/,'Attach ended'],[/^Dummy hancur, HP dipulihkan$/,'Dummy destroyed, HP restored'],[/^Heartguard dilepas dari rekan$/,'Heartguard detached from ally'],[/^Charge Love Waves habis$/,'Love Waves out of charges'],[/^Skill masih cooldown$/,'Skill on cooldown'],[/^Mana kurang$/,'Not enough Mana']];
function tn(n){const p=n.parentNode;if(!p||/^(SCRIPT|STYLE)$/.test(p.nodeName))return;const s=n.nodeValue,k=s.trim();if(!k)return;
 if(!EN){if(n._o!=null){n.nodeValue=n._o;n._o=null}return}
 let r=TR.get(k);if(r===undefined){r=k;for(const[a,b]of RX)r=r.replace(a,b)}
 if(r!==k){n._o=s;n.nodeValue=s.replace(k,r)}}
function walk(r){if(r.nodeType===3)return tn(r);if(r.nodeType!==1)return;const w=document.createTreeWalker(r,4);let n;while(n=w.nextNode())tn(n)}
const obs=()=>mo.observe(vp,{subtree:true,childList:true,characterData:true}),mo=new MutationObserver(ms=>{if(!EN)return;mo.disconnect();try{ms.forEach(m=>m.type==='characterData'?tn(m.target):m.addedNodes.forEach(walk))}finally{obs()}});
obs();
function setLang(b){EN=!EN;document.documentElement.lang=EN?'en':'id';mo.disconnect();try{walk(vp)}finally{obs()}if(b)b.firstChild.innerHTML='Bahasa: <b>'+(EN?'English':'Indonesia')+'</b>';return EN}

/* ripple di titik sentuh */
st.addEventListener('pointerdown',e=>{const b=e.target.closest('.bt');if(!b||b.id==='tap'||RM)return;const r=b.getBoundingClientRect(),k=r.width/b.offsetWidth||1,s=Math.max(b.offsetWidth,b.offsetHeight)*2,d=document.createElement('i');
 if(getComputedStyle(b).position==='static')b.style.position='relative';b.style.overflow='hidden';
 d.style.cssText=`position:absolute;pointer-events:none;border-radius:50%;background:rgba(255,255,255,.35);width:${s}px;height:${s}px;left:${(e.clientX-r.left)/k-s/2}px;top:${(e.clientY-r.top)/k-s/2}px`;b.append(d);
 d.animate([{transform:'scale(0)',opacity:1},{transform:'scale(1)',opacity:0}],{duration:600,easing:'ease-out'}).finished.then(()=>d.remove())});

/* petunjuk idle: ikon skill berdenyut bergantian jika belum ada yang dipilih */
let la=Date.now();['pointerdown','keydown'].forEach(t=>addEventListener(t,()=>{la=Date.now()}));
setInterval(()=>{if(cur==='heroPage'&&sk<0&&!busy&&Date.now()-la>6000){la=Date.now()-3000;$$('.ib').forEach((b,i)=>A(b,[{transform:'none'},{transform:'scale(1.12)'},{transform:'none'}],{duration:600,delay:i*180}))}},1000);

/* ===== BUILD ORDER + PIXY (added) ===== */
const ITEM_IMG={}; // optional official art: {'Flask of the Oasis':'img/flask.png', ...}
const PIXY_API=''; // optional: your own endpoint returning {reply:'...'}; empty = Pixy's built-in brain
const GL={flask:'M9 3h6M10 3v6L5 19a2 2 0 002 3h10a2 2 0 002-3l-5-10V3M7.5 15h9',hour:'M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9',wand:'M4 20l10-10M17 3l1.3 3L21 7.3 18.3 8.6 17 11.5 15.7 8.6 13 7.3 15.7 6z',crown:'M3 18L2.5 7 8 11l4-6 4 6 5.5-4L21 18zM4 21h16',ankh:'M12 3a3.5 3.5 0 013.5 3.5C15.5 9.5 12 11 12 11S8.5 9.5 8.5 6.5A3.5 3.5 0 0112 3zM12 11v10M7 14h10',boot:'M7 3h6v7c0 2 2 3 4 4l3 1.5V20H5zM5 17h15',gem:'M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l3 6 3-6',shield:'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z',meteor:'M16 8a5 5 0 11-7 7 5 5 0 017-7zM9 9L3 3M12 6L8 2M6 12L2 8',wing:'M3 19c1-8 7-13 18-14-1 5-4 8-8 10l3 3c-5 2-9 2-13 1z',orb:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v8M8 12h8',neck:'M5 3c0 9 3 12 7 12s7-3 7-12M12 15l-3 4 3 3 3-3z'};
const ic2=(o,z=84)=>ITEM_IMG[o.n]?`<span class=ic2 style="width:${z}px;height:${z}px"><img src="${ITEM_IMG[o.n]}" alt="${o.n}"></span>`:`<span class=ic2 style="--a:${o.c[0]};--b:${o.c[1]};width:${z}px;height:${z}px"><svg width=${z*.62|0} height=${z*.62|0} viewBox="0 0 24 24" fill=none stroke="#fff" stroke-width=1.7 stroke-linecap=round stroke-linejoin=round><path d="${GL[o.k]}"/></svg></span>`;
const mkO=(n,k,c,rx,r,w)=>({n,k,c,rx:new RegExp(rx,'i'),r,w});
const BD=[
{tag:'MUST BUY',p:100,d:"Buy it first. When an ally drops under 30% HP the extra shield pops, so every Love Waves cast keeps teammates alive through laning trades.",t:"Aim Skill 1 at whoever is about to fall under 30% HP so the shield lands on time.",o:[
 mkO("Flask of the Oasis","flask",["#3ddc84","#00b8d4"],"flask|oasis","Shield pops when an ally drops under 30% HP. Your whole job, in item form.","First buy. Always."),
 mkO("Oracle","orb",["#ffd23f","#ff9f43"],"oracle","Makes your shields and heals hit harder.","Your team already has plenty of sustain and you want bigger numbers."),
 mkO("Holy Crystal","gem",["#6c5ce7","#ff2d8a"],"holy|crystal","Raw Magic Power: bigger heals, shields and poke.","You would rather scale your numbers than your utility.")]},
{tag:'EARLY CORE',p:92,d:"Skill 1 and Skill 2 drink mana. Boots with mana regen let you poke the whole laning phase without recalling.",t:"Recall for boots straight after the Flask. Cheap, and your mana bar stops crying.",o:[
 mkO("Demon Shoes","boot",["#ff5a6a","#6c5ce7"],"demon","Steady mana so Skill 1 can keep poking all laning phase.","First recall, right after the Flask."),
 mkO("Magic Shoes","boot",["#00e5ff","#4d7cff"],"magic shoes|cooldown boots","Cooldown reduction: skills and ultimate return sooner.","Mana is fine and you want Heartguard more often."),
 mkO("Tough Boots","boot",["#b8b3d9","#6c5ce7"],"tough","Shorter crowd control on you.","Enemy has stuns, roots and pulls and you are their favorite target.")]},
{tag:'CORE',p:85,d:"Assists and kills shorten your ultimate cooldown, so Heartguard comes back inside long teamfights instead of once per war.",t:"Poke with Skill 1 and Skill 2 to farm assists. That is where the cooldown refunds come from.",o:[
 mkO("Fleeting Time","hour",["#00e5ff","#6c5ce7"],"fleeting","Assists and kills cut ultimate cooldown. More Heartguard, more wars won.","Third item."),
 mkO("Enchanted Talisman","gem",["#6c5ce7","#00e5ff"],"talisman|enchanted","Cooldown and mana relief in one slot.","Mana or cooldowns are your problem and assists are rare."),
 mkO("Ice Queen Wand","wand",["#7df3ff","#4d7cff"],"ice queen|queen","Extra slow to peel enemies off your carry.","Enemy has divers, or you want stronger chase and peel.")]},
{tag:'SITUATIONAL',p:70,d:"Scorch burns and Lifebane lowers enemy regen and healing. The more sustain the enemy team has, the sooner this item should be bought.",t:"Check the enemy lineup first. Two or more sustain heroes and this jumps up the list.",o:[
 mkO("Glowing Wand","wand",["#ff9f43","#ff2d8a"],"glowing","Burns enemies and cuts their healing. Lifesteal heroes hate it.","Fourth, or second if the enemy has lifesteal."),
 mkO("Necklace of Durance","neck",["#b8b3d9","#ff2d8a"],"necklace|durance","Cheaper anti-heal option.","You need anti-heal sooner and have less gold."),
 mkO("Dominance Ice","gem",["#7df3ff","#6c5ce7"],"dominance","Anti-heal with a slowing aura. Sturdier vs physical teams.","Enemy team is mostly physical damage and heal-heavy.")]},
{tag:'SURVIVAL',p:55,d:"Winter Crown's active freezes you for a moment so burst cannot reach you. Angela folds fast without an answer to assassins.",t:"Activate it when an assassin or core has targeted you, not after your HP is already gone.",o:[
 mkO("Winter Crown","crown",["#7df3ff","#6c5ce7"],"winter|crown","Freezes you briefly to dodge burst. Angela is fragile, remember?","Fifth, once you can afford to stop dying."),
 mkO("Rose Gold Meteor","meteor",["#ff9f43","#ff5a6a"],"rose|meteor","Shield when your HP gets low.","Their burst is magic damage and you want a passive safety net."),
 mkO("Radiant Armor","shield",["#ffd23f","#ff9f43"],"radiant","Tankier against magic damage.","Enemy has several mages and you are the one they chase.")]},
{tag:'LUXURY',p:40,d:"Immortality revives you after a death, so Heartguard can still be cast in the war that decides the game.",t:"Buy it when one death can lose the war. Before that, a cheaper survival item is usually smarter.",o:[
 mkO("Immortality","ankh",["#ffd23f","#ff2d8a"],"immortal|immo|revive","A second life for the late-game war.","Last slot, late game."),
 mkO("Athena's Shield","shield",["#00e5ff","#4d7cff"],"athena","Magic defense plus a shield for a safer back line.","Enemy mages punish you more than assassins do."),
 mkO("Blood Wings","wing",["#ff2d8a","#6c5ce7"],"blood|wings","More Magic Power and a built-in shield.","You are ahead and want your burst to matter too.")]}];
const BSEL=BD.map(()=>0);
const buildPane=()=>`<div class=bg2>${BD.map((s,i)=>{const o=s.o[BSEL[i]];return `<div class="bc st" style="--c:${o.c[0]}"><span class=nn>${i+1}</span><button class="bt bh" data-a=bd data-i=${i}>${ic2(o)}<span><h4>${o.n}</h4><span class=pr>${s.tag} · ${s.p}%</span></span></button><div class=mt><i style="width:${s.p}%"></i></div><p>${o.r}</p><div class=swr>${s.o.map((x,j)=>j===BSEL[i]?'':`<button class="bt sw" data-a=bs data-i=${i} data-j=${j}>${ic2(x,40)}<span>${j?'↔ ':'↺ '}${x.n}</span></button>`).join('')}</div></div>`}).join('')}</div><div class=hint>Reading order = buy order. Tap a card for details, a swap chip to replace, or ask Pixy.</div>`;

/* ===== PIXY: charming, sarcastic guide ===== */
let pctx=null;
const rnd=a=>a[Math.random()*a.length|0],strip=h=>h.replace(/<[^>]+>/g,''),
OPEN=["Oh, you want my opinion? Bold.","Asking before buying. Growth!","Fine, since you asked nicely-ish.","A thoughtful question. Mark the calendar."],
SIGN=["You're welcome.","Try to keep up.","Obviously.","Don't waste my sparkle."],
isQ=/^(can|could|may|should|is|are|would|will|do|does|boleh|bisa|apakah)\b|\?$/,SW=/swap|replace|change|switch|ganti|tukar|instead/,
SLOT=[/flask|oasis/,/boots?|shoes/,/fleeting|cooldown/,/glowing|lifesteal|anti.?heal/,/winter|crown|freeze/,/immortal|immo|revive/],
PXALL=BD.flatMap((s,i)=>s.o.map((o,j)=>({...o,i,j}))),cn=i=>BD[i].o[BSEL[i]].n,
doSwap=(i,j)=>{BSEL[i]=j;if(cur==='builds'&&tab===0)$('#pn').innerHTML=buildPane()};
function brain(raw){
 const q=raw.toLowerCase().trim(),F=PXALL.filter(o=>o.rx.test(q)).sort((a,b)=>q.search(a.rx)-q.search(b.rx)),sk=D.skills,fl=t=>(t.length>90&&Math.random()<.4?rnd(OPEN)+' ':'')+t+(Math.random()<.25?' '+rnd(SIGN):'');
 if(/^(hi|hello|hey|halo|hai|yo)\b/.test(q))return"Hello. I'm Pixy: fairy, guide, and the only reason this build isn't a crime. Ask about items, swaps, or what Angela can actually do.";
 if(/thank|thx|makasih|terima kasih/.test(q))return rnd(["Gratitude accepted. Payment in sparkles.","Aw. Don't make it weird.","Now go win something."]);
 if(/stupid|useless|dumb|bodoh|trash|jelek/.test(q))return rnd(["Rude. I'm a fairy with a spreadsheet for a brain. Try again.","Careful. I know your build order."]);
 if(pctx&&/^(yes|yeah|yep|sure|ok|okay|do it|apply|go ahead|swap it|iya|gas)\b/.test(q)){const t=pctx;pctx=null;if(BSEL[t.i]===t.j)return"Already done, sparkle-brain.";const p=cn(t.i);doSwap(t.i,t.j);return`Swapped ${p} for ${t.n} in slot ${t.i+1}. Try not to regret it.`}
 if(F.length){
  const t=F[F.length-1],s=BD[t.i],m=s.o[0],alts=s.o.filter(x=>x!==t).map(x=>x.n).join(' or ');
  if(SW.test(q)&&!isQ.test(q)){if(BSEL[t.i]===t.j)return`${t.n} is already in slot ${t.i+1}. Look at the screen, hero.`;const p=cn(t.i);doSwap(t.i,t.j);pctx=null;return fl(`Done: slot ${t.i+1} is now ${t.n} (was ${p}). ${t.j?'Use it when: '+t.w:'Back to the classic. Predictable, but fine.'}`)}
  if(t.j){pctx=t;return fl(`${t.n}? ${t.r} Take it over ${m.n} when: ${t.w} Otherwise stick with ${m.n}. Say "yes" and I'll swap it in.`)}
  if(/skip|without|tanpa|don.?t (buy|need)|not buy/.test(q))return fl(`You can skip ${t.n}, but you lose this: ${t.r} Stand-ins: ${alts}. Priority is ${s.p}%, so ${s.p>=85?"I would not.":s.p>=60?"only if the game forces you.":"sure, it's the optional one."}`);
  if(/first|order|before|early|when|dulu|kapan|urut/.test(q))return fl(`${t.n} is buy #${t.i+1} of 6 (${s.tag.toLowerCase()}). ${t.w}`);
  return fl(`${t.n} is buy #${t.i+1} (${s.tag.toLowerCase()}). ${s.d} Tip: ${s.t} Swap options: ${alts}.`)}
 const ab=[[/(shield|heal).*(self|myself|herself|diri)|self.?(shield|heal)/,"Heartguard shields your ally, not you. Love Waves heals teammates, and the guide lists 50% Spell Vamp on Skill 1, so you sip a little. A real self-shield needs the Aegis spell."],
 [/(attach|enter|ride|inside|masuk).*(enem|musuh)|(enem|musuh).*(attach|ride)/,"Allies only. Enemies are not that into you."],
 [/(die|dead|death|mati).*(ally|host|teammate|rekan)|(ally|host|rekan).*(die|dead|mati)/,"Attach ends early if your host dies. Choose hosts who plan on surviving."],
 [/\brange\b|distance|jauh|\bfar\b|global/,"Heartguard has no distance limit. Global shield, global smugness."],
 [/cancel|release|detach|lepas|leave/,"Press Heartguard again to cancel the channel or detach from your host."],
 [/(attach|ult).*(mana|free)|free (skill|cast)|mana.*(attach|heartguard)/,"While attached (20s) you cast skills without spending Mana. The only free lunch in this game."],
 [/movement|speed|\bms\b|faster|passive/,"Smart Heart: +5% Movement Speed for 4s per skill cast, up to 20%. While attached, the boost transfers to your host."],
 [/slow/,"Skill 2 slows gradually (up to 80%), and every Lover's Mark stack on Skill 1 adds 8% slow."],
 [/immobiliz|puppet|\btie\b|bind/,"Puppet-on-a-String: if the target stays tied for 3s you get Immobilize 1.5s plus 450 (+60% MP) damage. Slow CC, not an on-demand stun."]];
 for(const[r,a]of ab)if(r.test(q))return fl(a);
 const sc=/love waves|skill ?1|\bs1\b/.test(q)?1:/puppet|skill ?2|\bs2\b/.test(q)?2:/heartguard|ultimate|\bult\b|skill ?3/.test(q)?3:/smart heart/.test(q)?0:-1;
 if(sc>=0){const k=sk[sc];return fl(`${k.n}: ${strip(k.d)}${k.cd?` Cooldown ${k.cd}s, Mana ${k.mana}.`:''} ${k.tip||''}`)}
 const mu=[[/carry|solo|1v1|\bkill|dps|win the game/,"Carry? Angela? Adorable. No. She pokes (Love Waves 170 +80% MP) and ties people up, but your job is keeping the loud one alive."],
 [/escape|flee|run away|mobil|dash|kabur/,"Mobility is low. Your escape kit is Flicker, the passive speed boost from spamming skills, and having friends who look tastier than you."],
 [/charge|stack|mark/,"Love Waves stores up to 5 charges and stacks Lover's Mark: +20% damage and 8% slow per stack."],
 [/position|safe|front|back line|dive/,"Back line. Always. Hide behind whoever is making the most noise."],
 [/lifesteal|sustain|anti.?heal|heal(ing)? (hero|enemy)/,"Enemy lifesteal? Glowing Wand jumps to slot 2. Necklace of Durance is the cheaper version. Burn, Lifebane, sad enemy healers."],
 [/assassin|diculik|culik|picked off|get(ting)? caught/,"Assassins: Winter Crown before your HP is gone, Flicker or Aegis ready, and stand behind a body. Don't walk alone. Dramatic, I know."],
 [/stun|\bcc\b|root|lock|pull|ditahan/,"Angela's own CC is Skill 2: slow, then Immobilize. If you're the one getting stunned, swap boots to Tough Boots and save Flicker."],
 [/mana|boros|thirsty/,"Demon Shoes first, Enchanted Talisman if still thirsty, and remember: attached to a host, skills cost no Mana for 20s."],
 [/cooldown|\bcd\b/,"Fleeting Time refunds cooldown on assists and kills. Magic Shoes if you prefer guaranteed cooldowns over hope."],
 [/emblem|talent/,"Support emblem: "+D.emb.map(x=>x[0].replace(' • ',': ')).join(' → ')+". Short version: speed, faster cooldowns, and a mark so allies hit harder."],
 [/spell|flicker|revitalize|aegis|sprint/,"Flicker is the main pick (mobility is low, remember). Revitalize adds team heal. Aegis is for assassin-heavy teams, Sprint for fast rotations."],
 [/early|laning|lane/,strip(D.strat[0][2])+" Buy Flask, then boots."],[/mid game|\bmid\b|rotat/,D.strat[1][2]],[/late|teamfight|\bwar\b/,D.strat[2][2]],
 [/strategy|how (to|do) (i )?play|tips?\b/,"Early: stick to your jungler or MM and poke with Skill 1. Mid: Heartguard on whoever is ganking. Late: back line, attach to the main attacker. Repeat until victory."]];
 for(const[r,a]of mu)if(r.test(q))return fl(a);
 const si=SLOT.findIndex(r=>r.test(q));
 if(si>=0){const s=BD[si];return fl(`${s.o[0].n} is the pick for buy #${si+1} (${s.tag.toLowerCase()}). Alternatives: ${s.o.slice(1).map(x=>x.n+" ("+x.r.toLowerCase().replace(/\.$/,"")+")").join('; ')}.`)}
 if(/order|urutan|build|buy|beli|item|priority/.test(q))return fl("Buy order, most important first: "+BD.map((s,i)=>`${i+1}. ${cn(i)}`).join(', ')+". Ask me about any item, or tell me to swap one.");
 return"Hm. I only speak fluent Angela: items, swaps, skills, emblem, spells, strategy. Try “can I skip Winter Crown?” or “can Angela solo carry?”."}
async function pixyAsk(q){if(PIXY_API){try{const r=await fetch(PIXY_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q,build:BD.map((s,i)=>cn(i))})}),j=await r.json();if(j&&j.reply)return String(j.reply)}catch(e){}}return brain(q)}
const PXV=z=>`<svg width=${z} height=${z} viewBox="0 0 48 48"><ellipse cx=13 cy=22 rx=9 ry=14 fill="#7df3ff" opacity=.75 transform="rotate(-28 13 22)"/><ellipse cx=35 cy=22 rx=9 ry=14 fill="#7df3ff" opacity=.75 transform="rotate(28 35 22)"/><circle cx=24 cy=27 r=11 fill="#ffb3cf"/><path d="M13 26c0-11 22-11 22 0-5-6-17-6-22 0z" fill="#ff2d8a"/><circle cx=20 cy=29 r=1.6 fill="#1a1440"/><circle cx=28 cy=29 r=1.6 fill="#1a1440"/><path d="M17.500 25.500l5-1.500" stroke="#1a1440" stroke-width=1.400 stroke-linecap=round /><path d="M20 33q4 2.600 8 0" stroke="#1a1440" fill=none stroke-width=1.500 stroke-linecap=round /><path d="M24 2l1.800 4.200 4.200 1.800-4.200 1.800L24 14l-1.800-4.200L18 8l4.200-1.800z" fill="#ffd23f"/></svg>`;
st.insertAdjacentHTML('beforeend',`<button class="bt dk" id=pxb data-a=pxo style="display:none;left:168px;width:auto;padding:0 26px;gap:12px;align-items:center;border-radius:32px;color:#fff;border-color:var(--pk)">${PXV(36)}<b class=o style="font-size:24px">Ask Pixy</b></button>
<div id=pxp class=gl><div class=pxh>${PXV(60)}<div><h3 class=o>Pixy</h3><small>Fairy. Guide. Sarcasm included free.</small></div><button class="bt bk" data-a=pxc aria-label=Close>✕</button></div><div id=pxl></div>
<div id=pxq class=rw>${['Can I skip Winter Crown?','Enemy has lifesteal','Can Angela solo carry?','Swap Flask for Oracle'].map(x=>`<button class=bt data-a=pxk data-q="${x}">${x}</button>`).join('')}</div>
<div class=pxi><input id=pxt placeholder="Can I buy boots first?" maxlength=140 autocomplete=off><button class="bt bs" data-a=pxs style="height:72px">SEND</button></div></div>`);
function pxAdd(t,w){const l=$('#pxl'),m=document.createElement('div');m.className='pm '+w;m.textContent=t;l.append(m);l.scrollTop=l.scrollHeight;A(m,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:250});return m}
function pxOpen(q){$('#pxp').classList.add('on');if(!$('#pxl').children.length)pxAdd("Hi, aku Pixy. Tanya apa aja, serius apa aja: build, hero, game lain, atau pilihan hidupmu yang meragukan. English juga boleh. Aku mikir dulu sebelum jawab, biasanya.",'p');q?pxSend(q):setTimeout(()=>$('#pxt').focus(),60)}
async function pxSend(q){const i=$('#pxt');q=(q||i.value).trim();if(!q)return;i.value='';pxAdd(q,'u');const w=pxAdd('…','p');snd('tick');const r=await pixyAsk(q);await new Promise(f=>setTimeout(f,350+Math.random()*350));w.textContent=r;$('#pxl').scrollTop=1e5;snd('ok')}
$('#pxt').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')pxSend();if(e.key==='Escape')$('#pxp').classList.remove('on')});
['touchstart','touchend'].forEach(t=>$('#pxp').addEventListener(t,e=>e.stopPropagation(),{passive:true}));
Object.assign(XX,{
 bd:b=>{const i=+b.dataset.i,s=BD[i],o=s.o[BSEL[i]];modal(`<small>BUY #${i+1} · ${s.tag} · PRIORITY ${s.p}%</small><h3>${o.n}</h3><p>${BSEL[i]?o.r+' Use it when: '+o.w:s.d}</p>${BSEL[i]?'':`<div class=tp><b>TIP</b>${s.t}</div>`}${s.o.filter(x=>x!==o).map(x=>`<p style="font-size:26px;margin:4px 0"><b style="color:var(--cy)">${x.n}:</b> ${x.r} <b style="color:var(--pk)">Swap if:</b> ${x.w}</p>`).join('')}<div class=row><button class="bt mb" data-a=ask data-q="Tell me about ${o.n}">ASK PIXY</button><button class="bt mb pk" data-a=x>CLOSE</button></div>`,'dt')},
 bs:b=>{const i=+b.dataset.i,j=+b.dataset.j;BSEL[i]=j;$('#pn').innerHTML=buildPane();snd('ok');toast('Slot '+(i+1)+': '+BD[i].o[j].n)},
 pxo:()=>pxOpen(),pxc:()=>$('#pxp').classList.remove('on'),pxs:()=>pxSend(),pxk:b=>pxSend(b.dataset.q),ask:b=>{shut();pxOpen(b.dataset.q)}});
const _e3=enter;enter=id=>{_e3(id);const off=/^(menu|loading|ending)$/.test(id);$('#pxb').style.display=off?'none':'flex';off&&$('#pxp').classList.remove('on')};

/* ===== CARMILLA + free-form Pixy (added) ===== */
Object.assign(GL,{helm:'M4 20v-8a8 8 0 0116 0v8M4 14h16M10 20v-6M14 20v-6',bolt:'M13 2L4 14h6l-1 8 9-12h-6z'});
const CIMG='data:image/svg+xml,'+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#9b0f3a'/><stop offset='.6' stop-color='#2a0a3a'/><stop offset='1' stop-color='#0b0714'/></linearGradient></defs><rect width='800' height='1000' fill='url(#g)'/><circle cx='400' cy='320' r='180' fill='#ff2d55' opacity='.16'/><g fill='#12051a'><path d='M400 430C300 330 150 330 60 440c80-20 130 10 160 60-50-10-90 10-110 50 70-20 130 0 170 50 20-40 60-90 120-170z'/><path transform='matrix(-1 0 0 1 800 0)' d='M400 430C300 330 150 330 60 440c80-20 130 10 160 60-50-10-90 10-110 50 70-20 130 0 170 50 20-40 60-90 120-170z'/></g><path d='M400 560c-100 0-160 90-170 240l-30 200h400l-30-200c-10-150-70-240-170-240z' fill='#1a0a26'/><circle cx='400' cy='330' r='92' fill='#f3d6dc'/><path d='M300 330c-10-110 190-110 200 0-30-50-170-50-200 0z' fill='#d0104a'/><circle cx='370' cy='338' r='9' fill='#d0104a'/><circle cx='430' cy='338' r='9' fill='#d0104a'/><path d='M382 378l6 22 6-22M406 378l6 22 6-22' fill='#fff'/><path d='M400 620c-40-30-40-70-8-70 8 0 8 8 8 14 0-6 0-14 8-14 32 0 32 40-8 70z' fill='#ff2d55'/></svg>");
const BDC=[
{tag:'FIRST BUY',p:100,d:"Carmilla dives into fights, so shorter crowd control keeps her alive long enough for Curse of Blood and her passive to matter.",t:"Buy it on your first recall, right after your roam item.",o:[
 mkO("Tough Boots","boot",["#b8b3d9","#6c5ce7"],"tough","Cuts crowd control on you so your dive actually lands.","First recall, after your roam item."),
 mkO("Magic Shoes","boot",["#00e5ff","#4d7cff"],"magic shoes|cooldown boots","Cooldown reduction: more Crimson Flower, more Curse of Blood.","Enemy has little crowd control and your skills are rarely up."),
 mkO("Warrior Boots","boot",["#ffd23f","#ff9f43"],"warrior","Extra physical defense on your frontline body.","Enemy team is mostly physical damage.")]},
{tag:'CORE',p:92,d:"Cursed Helmet gives HP and its passive burns nearby enemies, so just standing in the fight adds damage while Vampire Pact keeps you sturdy.",t:"Stay in the middle of skirmishes so the burn keeps ticking.",o:[
 mkO("Cursed Helmet","helm",["#ff5a6a","#6c5ce7"],"cursed|helmet","Burning Soul: nearby enemies take steady magic damage while you brawl.","Second item. The heart of the tank-support build."),
 mkO("Antique Cuirass","shield",["#00e5ff","#4d7cff"],"antique|cuirass","Sturdier body against physical damage dealers.","Enemy has several attack-speed or physical carries."),
 mkO("Dominance Ice","gem",["#7df3ff","#6c5ce7"],"dominance","Chills nearby attackers and trims their healing.","Enemy carry relies on attack speed or lifesteal.")]},
{tag:'CORE',p:85,d:"Athena's Shield adds HP, magic defense and a passive shield, letting you stay in enemy mages' faces while the passive keeps working.",t:"Rush it earlier when the enemy has two or more mages.",o:[
 mkO("Athena's Shield","shield",["#00e5ff","#4d7cff"],"athena","Big magic defense and HP, plus a passive shield.","Third item, or earlier against mages."),
 mkO("Radiant Armor","shield",["#ffd23f","#ff9f43"],"radiant","Tankier against magic damage.","You want magic defense without relying on a shield."),
 mkO("Rose Gold Meteor","meteor",["#ff9f43","#ff5a6a"],"rose|meteor","Shield when your HP gets low.","Their burst is magic damage and you want a safety net.")]},
{tag:'SITUATIONAL',p:70,d:"Scorch burns targets and weakens enemy healing, which helps your long skirmishes against sustain heroes.",t:"Check the enemy lineup first. Heavy sustain means buy it sooner.",o:[
 mkO("Glowing Wand","wand",["#ff9f43","#ff2d8a"],"glowing","Scorch burns enemies and cuts their healing. Lifesteal heroes hate it.","Fourth, or earlier if the enemy has lifesteal."),
 mkO("Necklace of Durance","neck",["#b8b3d9","#ff2d8a"],"necklace|durance","Cheaper anti-heal option.","You need anti-heal sooner and have less gold."),
 mkO("Lightning Truncheon","bolt",["#ffd23f","#6c5ce7"],"lightning|truncheon","Burst damage for a damage-leaning Carmilla.","Your team already has a tank and you want to hit harder.")]},
{tag:'SUSTAIN',p:55,d:"Oracle's passive boosts shield absorption and HP regen, so Athena's Shield and your sustain work harder in long skirmishes.",t:"Skip it if fights are decided by burst, not attrition.",o:[
 mkO("Oracle","orb",["#ffd23f","#ff9f43"],"oracle","Boosts shield absorption and HP regen by up to 30%.","Fifth, once the core defense is done."),
 mkO("Holy Crystal","gem",["#6c5ce7","#ff2d8a"],"holy|crystal","Raw Magic Power for a damage-leaning build.","You play damage Carmilla and want bigger Crimson Flower hits."),
 mkO("Blood Wings","wing",["#ff2d8a","#6c5ce7"],"blood wings|wings","More Magic Power and a built-in shield.","You are ahead and want burst plus safety.")]},
{tag:'LUXURY',p:40,d:"Immortality revives you after a death so you can re-engage and curse the key target in the war that decides the game.",t:"Buy it when one death can lose the war.",o:[
 mkO("Immortality","ankh",["#ffd23f","#ff2d8a"],"immortal|immo|revive","A second life for the late-game war.","Last slot, late game."),
 mkO("Brute Force Breastplate","shield",["#b8b3d9","#6c5ce7"],"brute|breastplate","More physical defense for the main frontline.","Enemy is physical-heavy and you are the front line."),
 mkO("Winter Crown","crown",["#7df3ff","#6c5ce7"],"winter|crown","Active freeze to dodge a burst.","Enemy assassins keep deleting you.")]}];
const HD={angela:{name:SE.n,role:SE.role,pros:H.pros,cons:H.cons,skills:D.skills,emb:D.emb,spl:D.spl,strat:D.strat,dxs:DX.spl,dxf:DX.foc,dt:DT.slice(0,4),bd:BD.slice(),hero:st.style.getPropertyValue('--hero'),av:st.style.getPropertyValue('--av'),
 chips:['Can I skip Winter Crown?','Enemy has lifesteal','Can Angela solo carry?','Swap Flask for Oracle']},
carmilla:{name:'Carmilla',role:'Support • Tank/Roam',pros:'Sturdy, Crowd Control, Roams Well',cons:'Mana-Hungry, No Real Escape',hero:`url("${CIMG}")`,av:`url("${CIMG}")`,dt:[0,0,0,0],bd:BDC,
 chips:['Can I skip Cursed Helmet?','Can Carmilla escape?','Swap Tough Boots for Magic Shoes','Is she mana hungry?'],
 skills:[
 {k:'Passive',ey:'PASSIVE SKILL',n:'Vampire Pact',tags:['Passive','Defense'],d:"Scales with level. Guides describe it as <b>weakening the defenses of enemy heroes she hits</b> while keeping her <b class=p>sturdy in a brawl</b>.",tip:"Stay active in skirmishes so the passive effects keep rolling."},
 {k:'Skill 1',ey:'SKILL 1',n:'Crimson Flower',tags:['Damage','Sustain'],d:"Summons <b>Crimson Flowers circling around her</b>. This is her <b class=p>main damage skill</b> and it also helps her sustain in a fight.",tip:"Cast it once enemies are on top of you, not from across the map."},
 {k:'Skill 2',ey:'SKILL 2',n:'Bloodbath',tags:['Dash','Speed Up'],d:"Builds <b>Bloodbath Energy</b> that <b class=p>greatly increases her Movement Speed</b> for a fast dive onto a target. It works in two parts.",adv:"Cannot target minions while using this skill. Dash in, stack the passive, then finish with the ultimate.",tip:"Save it for the engage. Wasting it on a rotation leaves you with no way in."},
 {k:'Ultimate',ey:'ULTIMATE SKILL',n:'Curse of Blood',tags:['Curse','Slow'],d:"Casts a curse on a <b>designated enemy hero</b>. The slow <b class=p>drops to 20% after 2 seconds</b>, so time it with your team's follow-up.",adv:"The slow also makes it easier for allies to land their own skills on the target.",tip:"Curse the biggest threat, then let your team collect the kill."}],
 emb:[['TIER 1 • AGILITY','Extra movement speed. Pairs with Bloodbath so you reach fights sooner.'],['TIER 2 • PULL YOURSELF TOGETHER','Shorter respawn and battle spell cooldown so Flicker or Petrify is ready again.'],['TIER 3 • FOCUSING MARK','Marks an enemy so your team deals extra damage to your curse target.']],
 spl:[['UTAMA • FLICKER','Short blink to chase or escape. She has no real dash, so this one matters.'],['STUN • PETRIFY','Briefly stuns nearby enemies. Great with her close-range dive and ultimate.'],['ALTERNATIF • FLAMESHOT / RETRIBUTION','Flameshot knocks back at range. Retribution only if you jungle.']],
 strat:[['EARLY GAME','Roam & join skirmishes','Roam with your team, stay in the fights so the passive keeps working, and use Crimson Flower when enemies are close.','--pk'],['MID GAME','Dive with Bloodbath','Use Bloodbath to dive onto a backline target, then Curse of Blood to slow them for your team.','--cy'],['LATE GAME','Peel & lock down','Use the same combo to slow dives and protect your backline. Keep Immortality for the war that matters.','--gd']],
 dxs:[['SPELL UTAMA','Flicker','Carmilla lacks a significant dash or escape, so Flicker is how you chase a target or get out when the dive goes wrong.','Keep it for escaping, not for a cheap chase.'],['SPELL STUN','Petrify','Momentarily stuns nearby enemies, which pairs well with her close-range abilities and ultimate.','Use it the moment you land in the middle of the enemy team.'],['SPELL ALTERNATIF','Flameshot / Retribution','Flameshot is a ranged knockback. Retribution is only useful if you play Carmilla in the jungle.','Stick to Flicker or Petrify unless you are deliberately jungling.']],
 dxf:[['EARLY GAME','Roam & join skirmishes','Stay in the middle of fights so Vampire Pact keeps its effects, and poke with Crimson Flower when enemies are close.','Roam with your team rather than sitting alone in a lane.'],['MID GAME','Dive with Bloodbath','Bloodbath gives a big burst of Movement Speed to reach a backline target. Follow with Curse of Blood.','You cannot target minions during Bloodbath, so save it for heroes.'],['LATE GAME','Peel & lock down','On defense, use the same skill combo to slow dives and protect your backline.','Keep your revive item for the decisive war.']]}};
let HERO='angela';const HN=()=>HD[HERO].name;
function setHero(k){
 if(k===HERO||!HD[k])return;const h=HD[k],o=HD[HERO];o.hero=st.style.getPropertyValue('--hero');o.av=st.style.getPropertyValue('--av');HERO=k;
 D.skills=h.skills;D.emb=h.emb;D.spl=h.spl;D.strat=h.strat;DX.spl=h.dxs;DX.foc=h.dxf;DT.splice(0,4,...h.dt);
 BD.splice(0,BD.length,...h.bd);BSEL.fill(0);PXALL.length=0;PXALL.push(...BD.flatMap((s,i)=>s.o.map((x,j)=>({...x,i,j}))));
 st.style.setProperty('--hero',h.hero);st.style.setProperty('--av',h.av);st.dataset.hero=k;
 $('.hd h2',S.heroPage).textContent=h.name;$('.hd .chip',S.heroPage).textContent=h.role;
 const b=$$('.art b',S.heroPage);b[0].textContent=h.pros;b[1].textContent=h.cons;
 $$('.sg',S.strategy).forEach((e,i)=>{e.querySelector('small').textContent=h.strat[i][0];e.querySelector('h4').textContent=h.strat[i][1];e.querySelector('p').textContent=h.strat[i][2]});
 reset();seen.clear();$('#mis').textContent='Skill dipelajari 0/4';
 $('#pxq').innerHTML=h.chips.map(x=>`<button class=bt data-a=pxk data-q="${x}">${x}</button>`).join('');pctx=null;
 $('#pxl').children.length&&pxAdd('Switched to '+h.name+'. Same fairy, new victim. Ask away.','p')}
const l1=$$('.lk',S.heroSelect)[0];l1.dataset.a='open';l1.dataset.h='carmilla';l1.style.opacity=1;
l1.innerHTML='<i></i><span><b style="color:#fff">Carmilla</b><small style="color:var(--mu)">Support • Tank/Roam</small></span>';l1.firstChild.style.cssText=`background:url("${CIMG}") center/cover;border:3px solid var(--pk)`;
$('.card',S.heroSelect).dataset.h='angela';
st.addEventListener('click',e=>{const h=e.target.closest('[data-h]');if(h&&!busy)setHero(h.dataset.h)},true);
$('#pxt').maxLength=300;$('#pxt').placeholder='Tanya Pixy apa aja…';

/* free-form Pixy: searches the whole guide, never just says no */
const STOP=new Set('the and for can you how what does that with this from have are but not out who why was get use his her she they them when where which will would should could its into than then too very just any all our your hero angela carmilla'.split(' '));
function kbSearch(q){
 const T=(q.match(/[a-z']{3,}/g)||[]).filter(w=>!STOP.has(w));if(!T.length)return'';const h=HD[HERO];
 const docs=[...D.skills.map(s=>[(s.n+' '+s.k+' '+s.tags.join(' ')+' '+strip(s.d)).toLowerCase(),s.n+': '+strip(s.d)+(s.adv?' '+s.adv:'')+(s.tip?' Tip: '+s.tip:'')]),
 ...BD.flatMap(s=>s.o.map(o=>[(o.n+' '+s.tag+' '+o.r+' '+o.w).toLowerCase(),o.n+': '+o.r+' Use it when: '+o.w])),
 ...D.emb.map(e=>[e.join(' ').toLowerCase(),e.join(': ')]),...D.spl.map(e=>[e.join(' ').toLowerCase(),e.join(': ')]),...D.strat.map(x=>[x.slice(0,3).join(' ').toLowerCase(),x[0]+': '+x[2]]),
 ['strength weakness pros cons good bad overview role '+(h.pros+' '+h.cons+' '+h.role).toLowerCase(),h.name+' ('+h.role+'). Strengths: '+h.pros+'. Weaknesses: '+h.cons+'.']];
 let best=null,bs=0;for(const d of docs){const n=T.reduce((a,w)=>a+(d[0].includes(w)?1:0),0);if(n>bs){bs=n;best=d}}
 return best?(Math.random()<.5?rnd(OPEN)+' ':'')+best[1]:''}
function brainC(q){
 const sk=D.skills,say=k=>`${k.n}: ${strip(k.d)}${k.adv?' '+k.adv:''} ${k.tip||''}`;
 const R=[[/passive|vampire|pact/,say(sk[0])],[/crimson|flower|skill ?1|\bs1\b/,say(sk[1])],[/blood ?bath|skill ?2|\bs2\b|energy|minion/,say(sk[2])],[/curse|\bult\b|ultimate|skill ?3/,say(sk[3])],
 [/escape|flee|run away|mobil|kabur|dash/,"No real escape button. Bloodbath gives speed to dive, and Flicker is your way out. Plan your exits before you jump in, like an adult."],
 [/mana|boros|thirsty/,"Yes, she burns mana like it's a hobby. Magic Shoes can help, and recalling on time is free."],
 [/carry|solo|damage|burst/,"Carry? She's a tank-support. Crimson Flower is her damage, and Lightning Truncheon or Holy Crystal exist for a damage-leaning build, but your real job is the dive and the curse."],
 [/lifesteal|sustain|anti.?heal/,"Enemy sustain? Glowing Wand (Scorch) moves up the list, or the cheaper Necklace of Durance."],
 [/mage|magic damage/,"Against mages, Athena's Shield comes earlier. Hug the magic defense."],
 [/assassin|picked off|caught|cc\b|stun|root/,"Tough Boots first, Petrify when you land in their team, and Flicker for when the plan fails."],
 [/emblem|talent/,"Support emblem: "+D.emb.map(x=>x[0].replace(' • ',': ')).join(' → ')+". If you want a damage-leaning Carmilla, guides also mention an assassin-style setup. Check the in-game talents; they change."],
 [/spell|flicker|petrify|flameshot|retribution|blessing/,"Flicker is the safe main, Petrify for stunning a pile of enemies, Flameshot is the ranged alternate, and Retribution only if you jungle."],
 [/early|laning|roam/,D.strat[0][2]],[/\bmid\b|dive|engage|combo/,D.strat[1][2]],[/late|teamfight|\bwar\b|defen[sc]e/,D.strat[2][2]],
 [/strategy|how (to|do) (i )?play|tips?\b/,"Roam with your team, dive with Bloodbath, curse the biggest threat, then peel for your backline. Rinse, repeat, collect thanks."],
 [/weak|counter|cons\b/,"Weak spots: "+HD.carmilla.cons+". Strengths: "+HD.carmilla.pros+"."],
 [/order|build|buy|item|priority|beli/,"Buy order, most important first: "+BD.map((s,i)=>`${i+1}. ${cn(i)}`).join(', ')+". Ask about any item or tell me to swap one."]];
 for(const[r,a]of R)if(r.test(q))return a;return'Hm. I only speak fluent Carmilla'}
const _b=brain;
brain=q=>{const ql=q.toLowerCase().trim(),C=HERO==='carmilla',yes=pctx&&/^(yes|yeah|yep|sure|ok|okay|do it|apply|go ahead|swap it|iya|gas)\b/.test(ql);
 let r=C&&!/^(hi|hello|hey|halo|hai|yo|thank|thx|makasih)/.test(ql)&&!yes&&!PXALL.some(o=>o.rx.test(ql))?brainC(ql):_b(q);
 if(C)r=r.replace(/Angela/g,'Carmilla');
 return r.startsWith('Hm. I only speak')?(kbSearch(ql)||r+'. Try “can I skip an item?”, “what does her ultimate do?” or “which spell?”.'):r};

/* ===== PIXY LIVE AI: Claude thinks for itself (sample capability) ===== */
let PXH=[],pxBusy=0,pxS;
const pxSamp=async()=>{if(pxS!==undefined)return pxS;try{pxS=window.claude&&claude.use?await claude.use('sample'):null}catch(e){pxS=null}if(!pxS)pxS=mkSampler();return pxS};
const pxSys=()=>`You are Pixy, a charming, sarcastic fairy guide living inside a Mobile Legends hero guide page (it covers every official Mobile Legends hero: full guides for Angela and Carmilla, AI-written guides for the rest). The player can ask you ANYTHING: game strategy, builds, other heroes, general knowledge, jokes, advice. Think each question through yourself and give a real answer. Personality: witty, teasing, a little dramatic, warm underneath, never genuinely cruel. Reply in the language the player writes in (Indonesian or English; match their slang). Keep it short for a phone screen: 2 to 5 sentences (up to 10 short sentences for hero comparisons, strategy breakdowns or training coaching), plain text only, no markdown, no asterisks, no bullet symbols. For facts about the heroes, items, skills, emblem, battle spells or strategy on this page, call get_guide and trust it; for anything else use your own knowledge and say so when a patch may have changed it. When the player asks to swap, replace or use a different item, call swap_item so the screen really changes. Selected hero now: ${HN()}. Current build: ${BD.map((s,i)=>(i+1)+'. '+cn(i)).join(', ')}.`;
const pxTools=()=>[
{name:'get_guide',description:'Read this guide page for a hero: role, strengths, weaknesses, skills, emblem, battle spells, strategy and the six-item build order with swap alternatives.',inputSchema:{type:'object',properties:{hero:{type:'string',description:'Hero name, e.g. Angela or Carmilla'}}},
 execute:a=>{const q=String(a&&a.hero||'').toLowerCase(),k=HD[q]?q:q?'':HERO;if(!k)return{note:'That hero is not loaded in this page. Use your own Mobile Legends knowledge and say it may be outdated.'};const h=HD[k];return{hero:h.name,role:h.role,strengths:h.pros,weaknesses:h.cons,skills:h.skills.map(s=>({slot:s.k,name:s.n,text:strip(s.d),extra:s.adv||'',tip:s.tip||'',cooldown:s.cd,mana:s.mana})),emblem:h.emb.map(e=>e.join(': ')),spells:h.spl.map(e=>e.join(': ')),strategy:h.strat.map(x=>x[0]+' - '+x[1]+': '+x[2]),build:h.bd.map((s,i)=>({order:i+1,priority:s.p+'%',tag:s.tag,item:s.o[0].n,why:s.o[0].r,buyWhen:s.o[0].w,alternatives:s.o.slice(1).map(o=>({item:o.n,what:o.r,swapIf:o.w}))}))}}},
{name:'swap_item',description:'Swap the item shown in build slot 1-6 for the currently selected hero. Use only when the player asks to swap, replace or use an item. The item must be the recommended item or one of its alternatives for that slot.',inputSchema:{type:'object',properties:{slot:{type:'integer',minimum:1,maximum:6},item:{type:'string'}},required:['slot','item']},
 execute:a=>{const i=(a.slot|0)-1,s=BD[i];if(!s)return{ok:false,error:'slot must be 1-6'};const t=String(a.item).toLowerCase(),j=s.o.findIndex(o=>{const n=o.n.toLowerCase();return n===t||n.includes(t)||t.includes(n)});if(j<0)return{ok:false,error:'not an option for this slot',options:s.o.map(o=>o.n)};doSwap(i,j);return{ok:true,slot:i+1,now:s.o[j].n}}}];
pxSend=async function(q){
 const inp=$('#pxt');q=(q||inp.value).trim();if(!q||pxBusy)return;inp.value='';pxAdd(q,'u');const w=pxAdd('…','p');snd('tick');pxBusy=1;let r='',pushed=0;
 try{
  const S2=await pxSamp();if(!S2)throw{code:'none'};
  PXH.push({role:'user',content:q});pushed=1;PXH=PXH.slice(-10);while(PXH.length&&PXH[0].role!=='user')PXH.shift();
  const m=PXH.map((x,k)=>k?x:{role:'user',content:pxSys()+'\n\nPlayer: '+x.content});
  const res=await S2(m,{modelTier:'default',cache:false,tools:pxTools(),onText:({text})=>{w.textContent=text;$('#pxl').scrollTop=1e5}});
  r=(res.text||'').trim();if(!r)throw{code:'empty'};PXH.push({role:'assistant',content:r})
 }catch(e){
  if(pushed)PXH.pop();
  r=e&&e.code==='rate_limited'?"Easy, tiger. Terlalu banyak pertanyaan sekaligus. Kasih aku waktu buat tampil memukau.":brain(q)+(e&&e.code==='not_granted'?'  (Mode offline: kamu menolak izin. Muat ulang kalau mau Pixy mikir lagi.)':'')
 }
 w.textContent=r;$('#pxl').scrollTop=1e5;snd('ok');pxBusy=0};
/* ===== ALL HEROES + Training Ground for every hero + AI hero guides ===== */
const RN={T:'Tank',F:'Fighter',A:'Assassin',M:'Mage',K:'Marksman',S:'Support'},
RC={T:['#4d7cff','#00b8d4'],F:['#ff9f43','#ff5a6a'],A:['#ff2d55','#6c5ce7'],M:['#6c5ce7','#ff2d8a'],K:['#ffd23f','#ff9f43'],S:['#3ddc84','#00e5ff']},
ROSTER="Aamon:A,Akai:T,Aldous:F,Alice:MT,Alpha:F,Alucard:FA,Angela:S,Argus:F,Arlott:FA,Atlas:T,Aulus:F,Aurora:M,Badang:F,Balmond:F,Bane:FK,Barats:TF,Baxia:T,Beatrix:K,Belerick:T,Benedetta:A,Brody:K,Bruno:K,Carmilla:ST,Cecilion:M,Chang'e:M,Chip:ST,Chou:F,Cici:F,Claude:K,Clint:K,Cyclops:M,Diggie:S,Dyrroth:F,Edith:TK,Esmeralda:MT,Estes:S,Eudora:M,Fanny:A,Faramis:SM,Floryn:S,Franco:T,Fredrinn:FT,Freya:F,Gatotkaca:T,Gloo:T,Gord:M,Granger:K,Grock:T,Guinevere:FM,Gusion:A,Hanabi:K,Hanzo:A,Harith:MA,Harley:AM,Hayabusa:A,Helcurt:A,Hilda:FT,Hylos:T,Irithel:K,Ixia:K,Jawhead:F,Johnson:T,Joy:A,Julian:FA,Kadita:M,Kagura:M,Kaja:SF,Kalea:SF,Karina:A,Karrie:K,Khaleed:F,Khufra:T,Kimmy:KM,Lancelot:A,Lapu-Lapu:F,Layla:K,Leomord:F,Lesley:K,Ling:A,Lolita:TS,Lukas:F,Lunox:MA,Luo Yi:M,Lylia:M,Martis:F,Masha:FT,Mathilda:SA,Melissa:K,Minotaur:TS,Minsitthar:FT,Miya:K,Moskov:K,Nana:M,Natalia:A,Natan:K,Nolan:A,Novaria:M,Obsidia:K,Odette:M,Paquito:F,Pharsa:M,Phoveus:F,Popol and Kupa:K,Rafaela:S,Roger:FK,Ruby:FT,Saber:A,Selena:AM,Silvanna:FM,Sun:F,Suyou:FA,Terizla:F,Thamuz:F,Tigreal:T,Uranus:T,Valentina:M,Valir:M,Vale:M,Vexana:M,Wanwan:K,X.Borg:F,Xavier:M,Yi Sun-shin:AK,Yin:FA,Yu Zhong:F,Yve:M,Zhask:M,Zhuxin:M,Zilong:FA,Zetian:M,Sora:FA,Marcel:S,Hirara:A".split(',').map(x=>{const[n,r]=x.split(':');return{n,r,l:[...r].map(c=>RN[c]).join(' / ')}}),
mono=n=>n.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase(),
avOf=(n,r)=>{const c=RC[(r||'F')[0]]||RC.F;return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c[0]}'/><stop offset='1' stop-color='${c[1]}'/></linearGradient></defs><rect width='800' height='1000' fill='url(#g)'/><circle cx='400' cy='420' r='260' fill='#fff' opacity='.12'/><text x='400' y='520' font-size='300' font-family='Outfit,sans-serif' font-weight='800' text-anchor='middle' fill='#fff'>${mono(n)}</text></svg>`)},
rxOf=n=>n.toLowerCase().split(/\s+/).filter(w=>w.length>3).join('|')||n.toLowerCase().replace(/[^a-z]/g,''),
KC=[['#00e5ff','#6c5ce7'],['#ffd23f','#ff9f43'],['#ff2d8a','#6c5ce7']];
const hgPrompt=(n,r)=>`You write guide data for the mobile MOBA Mobile Legends: Bang Bang. Hero: ${n}${r?' (listed role: '+r+')':''}. Use your real knowledge of the current game with official skill and item names. If you are unsure of a detail, stay general rather than inventing numbers. If this is not a real Mobile Legends hero, answer {"unknown":true}. Reply with ONLY JSON (no markdown) in exactly this shape: {"role":"Role • Lane","pros":"three short strengths, comma separated","cons":"three short weaknesses, comma separated","skills":[{"n":"skill name","tags":["tag","tag"],"d":"1-2 sentences","tip":"1 sentence"}],"emb":[["TIER 1 • TALENT","why"],["TIER 2 • TALENT","why"],["TIER 3 • TALENT","why"]],"spl":[["MAIN • SPELL","why"],["ALT • SPELL","why"],["SITUATIONAL • SPELL","why"]],"strat":[["EARLY GAME","title","2 sentences"],["MID GAME","title","2 sentences"],["LATE GAME","title","2 sentences"]],"bd":[{"tag":"FIRST BUY","p":100,"d":"why, 2 sentences","t":"one tip","o":[{"n":"official item name","k":"icon","r":"what it does, max 70 chars","w":"when to buy or swap, max 70 chars"}]}]}. Rules: skills has exactly 4 entries in the order Passive, Skill 1, Skill 2, Ultimate; bd has exactly 6 build slots in buy order from most important to least important, tag one of FIRST BUY, CORE, SITUATIONAL, SURVIVAL, LUXURY, p decreasing from 100 to about 35; each slot o has 3 options (the recommended item, then 2 replaceable alternatives); k is one of flask, hour, wand, crown, ankh, boot, gem, shield, meteor, wing, orb, neck, helm, bolt.`;
const mkHero=(j,n,r)=>{
 if(!j||j.unknown||!Array.isArray(j.skills)||j.skills.length<4||!Array.isArray(j.bd))throw{code:j&&j.unknown?'unknown':'bad'};
 const bd=j.bd.slice(0,6).filter(s=>s&&s.o&&s.o.length).map((s,i)=>({tag:String(s.tag||'CORE').toUpperCase(),p:+s.p||100-i*12,d:s.d||'',t:s.t||'',o:s.o.slice(0,3).map((o,x)=>mkO(String(o.n),GL[o.k]?o.k:'gem',KC[x],rxOf(String(o.n)),o.r||'',o.w||''))}));
 const sp=(j.spl||[]).slice(0,3),st3=(j.strat||[]).slice(0,3),role=j.role||r.split('').map(c=>RN[c]).join(' / ')||'Hero',img=`url("${avOf(n,r)}")`;
 return{name:n,role,pros:j.pros||'',cons:j.cons||'',hero:img,av:img,dt:[0,0,0,0],bd,
  skills:j.skills.slice(0,4).map((s,i)=>({k:['Passive','Skill 1','Skill 2','Ultimate'][i],ey:['PASSIVE SKILL','SKILL 1','SKILL 2','ULTIMATE SKILL'][i],n:s.n,tags:(s.tags||[]).slice(0,3),d:s.d||'',tip:s.tip||''})),
  emb:(j.emb||[]).slice(0,3),spl:sp,strat:st3.map((x,i)=>[x[0],x[1],x[2],['--pk','--cy','--gd'][i]]),
  dxs:sp.map(x=>[x[0].split(' • ')[0],x[0].split(' • ').pop(),x[1],'Ask Pixy how this fits '+n+'.']),dxf:st3.map(x=>[x[0],x[1],x[2],'Ask Pixy for matchup-specific advice.']),
  chips:[`Explain ${n}'s strategy`,`How do I counter ${n}?`,`Which hero is similar to ${n}?`,`Beginner tips for ${n}`]}};
async function genHero(n,r){
 const k='hg:'+n.toLowerCase();try{const c=localStorage.getItem(k);if(c)return mkHero(JSON.parse(c),n,r)}catch(e){}
 const S2=await pxSamp();if(!S2)throw{code:'none'};
 const j=await S2.json(hgPrompt(n,r),{modelTier:'default'});const h=mkHero(j,n,r);
 try{localStorage.setItem(k,JSON.stringify(j))}catch(e){}return h}
let hBusy=0;
async function openHero(n){
 if(hBusy)return;const k=n.toLowerCase(),r=(ROSTER.find(h=>h.n.toLowerCase()===k)||{r:''}).r;
 if(!HD[k]){hBusy=1;modal(`<h3>Pixy lagi riset ${n}…</h3><p>Baca-baca dulu, bentar. Biasanya 20 sampai 40 detik.</p>`);
  try{HD[k]=await genHero(n,r)}catch(e){hBusy=0;shut();toast(e&&e.code==='unknown'?'Pixy nggak kenal hero itu':e&&e.code==='none'?'Server AI belum aktif: cek ANTHROPIC_API_KEY di Vercel':'Gagal bikin guide, coba lagi');return}
  hBusy=0;shut()}
 $('#hp').classList.remove('on');setHero(k);if(cur!=='heroPage')go('heroPage',{zoom:1})}
let HF='All';
const hpRender=()=>{const q=$('#hps').value.trim().toLowerCase(),L=ROSTER.filter(h=>(HF==='All'||h.l.includes(HF))&&h.n.toLowerCase().includes(q));
 $('#hpn').textContent='('+L.length+'/'+ROSTER.length+')';
 $('#hpg').innerHTML=L.map(h=>{const c=RC[h.r[0]];return `<button class=bt data-a=hpo data-n="${h.n}"><span class=ic2 style="--a:${c[0]};--b:${c[1]};width:56px;height:56px;font:800 22px Outfit,sans-serif;color:#fff">${mono(h.n)}</span><span>${h.n}<small>${h.l}${HD[h.n.toLowerCase()]?' · siap':''}</small></span></button>`}).join('')||(q?`<button class=bt data-a=hpo data-n="${q.replace(/[^a-z .'\-]/g,'').replace(/\b\w/g,c=>c.toUpperCase())}">Tanya AI soal “${q.replace(/[<>"]/g,'')}” (hero baru / belum terdaftar)</button>`:'')};
st.insertAdjacentHTML('beforeend',`<div id=hp class=gl><div class=pxh><h3 class=o>All Heroes <small id=hpn></small></h3><input id=hps placeholder="Cari hero… atau ketik hero baru" autocomplete=off><button class="bt bk" data-a=hpc aria-label=Close>✕</button></div><div id=hpf class=rw>${['All',...Object.values(RN)].map(x=>`<button class=bt data-a=hpf data-f="${x}">${x}</button>`).join('')}</div><div id=hpg></div></div>`);
$('#hps').addEventListener('input',hpRender);$('#hps').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape')$('#hp').classList.remove('on')});
$('#pxp .bk').insertAdjacentHTML('beforebegin','<button class="bt bs" data-a=cmp style="height:64px;font-size:22px;margin-left:auto">⚖ Compare</button>');
[[1,'heroes','All Heroes ('+ROSTER.length+')','Pilih hero mana pun, AI bikinin guide-nya'],[2,'cmp','Compare Heroes','AI jelasin perbandingan & strategi']].forEach(([i,a,t,d])=>{const b=$$('.lk',S.heroSelect)[i];b.dataset.a=a;b.style.opacity=1;b.innerHTML=`<i>${ic('star',48)}</i><span><b style="color:#fff">${t}</b><small>${d}</small></span>`});

/* generic Training Ground (every hero except Angela's special one) */
const gT={log:[]};
mk('gtr',hd('Training Ground','HERO TRAINING','<span class=chip id=gtn></span><button class="bt bs" data-a=gcoach>AI COACH</button>')+`<div class="ar st"><div class=ac><span class=av></span><b id=gHn></b><div class="bar mpb"><i id=gM></i></div><div class=tx id=gMT></div></div><div class=ac id=gA><div class=dm>${ic('heart',64)}</div><b>Rekan</b><div class="bar hpb"><i id=gAh></i></div><div class=tx id=gAT></div></div><div class=ac id=gD><div class=dm>${ic('star',64)}</div><b>Dummy Musuh</b><div class="bar hpb"><i id=gDh></i></div><div class=tx id=gDT></div><div class=tx id=gDS></div></div></div><div class="cb st" id=gCB></div><div id=gLg class=st></div>`);
PAR.gtr='heroPage';
function gInit(){
 const h=HD[HERO],IC=['star','bolt','chain','shield'],CL=['--gd','--cy','--pk','--cy'];
 Object.assign(gT,{mana:600,hp:5000,ahp:2400,cd:[0,0,0,0],st:0,sfl:'',log:[]});$('#gHn').textContent=h.name;$('#gtn').textContent=h.role;
 $('#gCB').innerHTML=D.skills.map((s,i)=>`<button class="bt sb" data-a=gcast data-i=${i} style="--c:var(${CL[i]})">${ic(IC[i],46)}<b>${s.n}</b><small>${i?'Tombol '+i:'Passive (tap = info)'}</small><i class=cv id=gv${i}></i></button>`).join('');
 $('#gLg').textContent='Tekan skill (atau tombol 1-3) buat coba di dummy. Tap Passive buat baca efeknya. AI COACH = Pixy ajarin cara pakainya.';
 clearInterval(gT.iv);gT.iv=setInterval(gTick,100);gTick()}
function gSay(m){gT.log.unshift(m);gT.log.length=Math.min(gT.log.length,3);$('#gLg').textContent=gT.log.join('  |  ')}
function gCast(i){
 const s=D.skills[i],n=performance.now(),t=((s.tags||[]).join(' ')+' '+strip(s.d)).toLowerCase();
 if(!i){gSay(s.n+' (passive): '+strip(s.d));snd('tick');return}
 if(gT.cd[i]>n){gSay('Skill masih cooldown');snd('err');return}
 const cost=[0,60,90,140][i];if(gT.mana<cost){gSay('Mana kurang');snd('err');return}
 gT.mana-=cost;gT.cd[i]=n+[0,3000,5000,10000][i];
 const d=Math.round([0,350,500,1100][i]*(.85+Math.random()*.3));gT.hp=Math.max(0,gT.hp-d);pop($('#gD'),d,'#fff');
 if(/heal|shield|sustain|protect/.test(t)){const h=Math.round(d*.8);gT.ahp=Math.min(3000,gT.ahp+h);pop($('#gA'),'+'+h,'#3ddc84')}
 const f=/stun|immobil|root|knock|airborne|petrify|taunt/.test(t)?'STUN':/slow|freeze|chill/.test(t)?'SLOW':/dash|blink|charge/.test(t)?'DASH':'';
 gT.st=f?n+1500:0;gT.sfl=f;gSay(`${s.n}: ${strip(s.d).split('. ')[0]} (damage demo ${d}, bukan angka asli)`);snd('ok');vb(12)}
function gTick(){
 if(cur!=='gtr'&&!busy){clearInterval(gT.iv);return}
 const n=performance.now();gT.mana=Math.min(600,gT.mana+1.2);if(gT.hp<=0)gT.hp=5000;
 $('#gM').style.setProperty('--p',gT.mana/600);$('#gMT').textContent=`Mana ${Math.round(gT.mana)}/600`;
 $('#gDh').style.setProperty('--p',gT.hp/5000);$('#gDT').textContent=`HP ${gT.hp}/5000`;$('#gDS').textContent=gT.st>n?'Status: '+gT.sfl:'';
 $('#gAh').style.setProperty('--p',gT.ahp/3000);$('#gAT').textContent=`HP ${Math.round(gT.ahp)}/3000`;
 [1,2,3].forEach(i=>{const r=Math.max(0,gT.cd[i]-n),v=$('#gv'+i);if(v){v.style.display=r?'grid':'none';v.textContent=(r/1000).toFixed(1)}})}
const _e4=enter;enter=id=>{_e4(id);if(id==='gtr')gInit()};
addEventListener('keydown',e=>{if(cur==='gtr'&&!busy&&!$('#md').classList.contains('on')&&e.key.length===1&&'0123'.includes(e.key))gCast(+e.key)});
st.addEventListener('click',e=>{const b=e.target.closest('[data-a=train]');if(b&&HERO!=='angela'&&!busy){e.stopPropagation();go('gtr')}},true);
const coach=()=>{pxOpen();pxSend(`Coach me in the training ground as ${HN()}: for each skill explain when to press it, the best combo order, one common beginner mistake, and how to practice it on the dummy.`)};
Object.assign(XX,{
 heroes:()=>{$('#hp').classList.add('on');hpRender()},hpc:()=>$('#hp').classList.remove('on'),hpf:b=>{HF=b.dataset.f;hpRender()},hpo:b=>openHero(b.dataset.n),
 gcast:b=>gCast(+b.dataset.i),gcoach:coach,
 cmp:()=>{const o=ROSTER.map(h=>`<option>${h.n}</option>`).join('');modal(`<h3>Compare Heroes</h3><div class=rw style="gap:14px;margin:14px 0;align-items:center"><select id=cA>${o}</select><b>vs</b><select id=cB>${o}</select></div><div class=row><button class="bt mb" data-a=cmpgo>EXPLAIN</button><button class="bt mb pk" data-a=x>CLOSE</button></div>`,'dt');const a=HD[HERO].name;$('#cA').value=a;$('#cB').value=a==='Carmilla'?'Angela':'Carmilla'},
 cmpgo:()=>{const a=$('#cA').value,b=$('#cB').value;shut();pxOpen();pxSend(`Compare ${a} and ${b} in Mobile Legends: roles, strengths and weaknesses, laning, teamfights, itemization, difficulty, and when to pick each one. End with which is better for a beginner and why.`)}});


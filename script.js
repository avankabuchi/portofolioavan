/* ── CURSOR ── */
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function ar(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(ar);})();
document.querySelectorAll('a,[onclick],.filter-btn,.cert-card,.soc-card,.proj-card,.sk-item,.tl-nav-item,.track-row,.id-row,.btn,.t-tab').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-xl'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-xl'));
});

/* ── CLOCK ── */
function updateClock(){const n=new Date();document.getElementById('topbar-clock').textContent=n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0');}
updateClock();setInterval(updateClock,30000);

/* ── PARTICLES ── */
const canvas=document.getElementById('particle-canvas'),ctx=canvas.getContext('2d');
let W,H,pts=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
for(let i=0;i<55;i++)pts.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.2+.4,c:Math.random()>.5?'rgba(124,111,255,.22)':'rgba(255,107,157,.15)'});
(function dp(){ctx.clearRect(0,0,W,H);pts.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();for(let j=i+1;j<pts.length;j++){const d=Math.hypot(p.x-pts[j].x,p.y-pts[j].y);if(d<95){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(124,111,255,${.035*(1-d/95)})`;ctx.stroke();}}});requestAnimationFrame(dp);})();

/* ── BOOT ── */
const bootLogs=['Memuat portofolio...','Inisialisasi UI engine...','Connecting to AMIKOM network...','Mounting project filesystem...','Loading music daemon...','Verifying credentials...','Configuring assets...','Siap! 🚀'];
let bi=0,bp=0;
const bb=document.getElementById('boot-bar'),bl=document.getElementById('boot-log');
function bootTick(){
  if(bi<bootLogs.length){
    bl.innerHTML=bootLogs.slice(Math.max(0,bi-2),bi+1).map((l,i,a)=>`<div style="opacity:${i===a.length-1?1:.45}">${l}</div>`).join('');
    bp=Math.round((bi+1)/bootLogs.length*100);bb.style.width=bp+'%';bi++;
    setTimeout(bootTick,bi===bootLogs.length?400:200);
  } else {
    document.getElementById('boot').classList.add('fade-out');
    setTimeout(()=>{document.getElementById('boot').style.display='none';},800);
    initPage();
  }
}
setTimeout(bootTick,280);

/* ── INIT ── */
function initPage(){
  typeLoop();
  initTrackList();
  initWaveform();
  buildSkillBars();
}

/* ── TYPING ── */
const phrases=['Networking Engineer','Web Developer','Content Creator','Musisi & Artist','Problem Solver','Freelancer'];
let pi=0,ci=0,del=false;
const typEl=document.getElementById('typing-out');
function typeLoop(){
  if(!typEl)return;
  const w=phrases[pi];
  if(!del){typEl.textContent=w.slice(0,ci+1);ci++;if(ci===w.length){del=true;setTimeout(typeLoop,1900);return;}}
  else{typEl.textContent=w.slice(0,ci-1);ci--;if(ci===0){del=false;pi=(pi+1)%phrases.length;}}
  setTimeout(typeLoop,del?50:90);
}

/* ── PAGE SWITCH ── */
const pageNames={home:'Home',about:'About Me',skills:'Skills',projects:'Projects',experience:'Experience',certs:'Certifications',music:'Music',connect:'Connect'};

function switchPage(id){
  // Ganti halaman aktif
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+id);
  if(pg){pg.classList.add('active');pg.scrollTop=0;}
  
  // Ganti teks pada breadcrumb
  document.getElementById('topbar-path').textContent=pageNames[id]||id;

  // Atur efek aktif pada tombol tab TOP
  document.querySelectorAll('.t-tab').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.t-tab[data-tab="${id}"]`);
  if(activeBtn) {
      activeBtn.classList.add('active');
      // Otomatis scroll menu ke tombol yang di-klik agar di HP tidak tertutup
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  if(id==='skills')setTimeout(animateBars,200);
  toast('📂 '+pageNames[id]);
}

/* ── SKILL BARS ── */
let barsAnimated=false;
function buildSkillBars(){document.querySelectorAll('.bar-fill[data-w]').forEach(b=>b.style.width='0');}
function animateBars(){if(barsAnimated)return;barsAnimated=true;document.querySelectorAll('.bar-fill[data-w]').forEach(b=>{b.style.width=b.dataset.w+'%';});}

/* ── MUSIC PLAYER ── */
const tracks=[
  {name:'Track 1',art:'🎸',dur:'3:24',plat:'Spotify & Apple Music'},
  {name:'Track 2',art:'🎹',dur:'2:58',plat:'Apple Music'},
  {name:'Track 3',art:'🎧',dur:'4:10',plat:'YouTube & Spotify'},
  {name:'Track 4',art:'🎻',dur:'3:45',plat:'Spotify'},
];
let trackIdx=0,isPlaying=false,progVal=0,progTimer;
function initTrackList(){
  const tl=document.getElementById('track-list');
  if(!tl)return;
  tl.innerHTML=tracks.map((t,i)=>`
    <div class="track-row${i===0?' playing-row':''}" id="tr-${i}" onclick="selectTrack(${i})">
      <div class="tr-num">${i+1}</div>
      <div class="tr-art">${t.art}</div>
      <div class="tr-info"><div class="tr-name">Avan Kabuchi — ${t.name}</div><div class="tr-sub">Avan Kabuchi</div></div>
      <div class="tr-dur">${t.dur}</div>
    </div>
  `).join('');
}
function initWaveform(){
  const wf=document.getElementById('waveform');if(!wf)return;
  const h=[30,50,70,40,80,60,90,45,65,55,75,35,85,50,70,40,60,80,50,65,45,75,55,85,40];
  wf.innerHTML=h.map((v,i)=>`<div class="wave-bar" style="height:${v}%;animation-delay:${i*.06}s;"></div>`).join('');
}
function updatePlayerUI(){
  const t=tracks[trackIdx];
  document.getElementById('track-title').textContent='Avan Kabuchi — '+t.name;
  document.getElementById('album-art').textContent=t.art;
  document.getElementById('track-plat').textContent='🎵 '+t.plat;
  document.getElementById('prog-dur').textContent=t.dur;
  document.querySelectorAll('.track-row').forEach((r,i)=>r.classList.toggle('playing-row',i===trackIdx));
}
function selectTrack(i){trackIdx=i;updatePlayerUI();if(!isPlaying)togglePlay();else{progVal=0;document.getElementById('prog-fill').style.width='0%';document.getElementById('prog-cur').textContent='0:00';startProg();}}
function togglePlay(){
  isPlaying=!isPlaying;
  const btn=document.getElementById('play-btn'),art=document.getElementById('album-art'),wf=document.getElementById('waveform');
  if(isPlaying){
    btn.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    art&&art.classList.add('spin');wf&&wf.classList.add('playing');startProg();
    toast('▶ Playing: Avan Kabuchi — '+tracks[trackIdx].name);
  } else {
    btn.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    art&&art.classList.remove('spin');wf&&wf.classList.remove('playing');clearInterval(progTimer);
  }
}
function startProg(){
  clearInterval(progTimer);const dur=parseDur(tracks[trackIdx].dur);
  progTimer=setInterval(()=>{progVal++;if(progVal>=dur){progVal=0;nextTrack();return;}document.getElementById('prog-fill').style.width=(progVal/dur*100)+'%';document.getElementById('prog-cur').textContent=fmtTime(progVal);},1000);
}
function parseDur(s){const[m,sec]=s.split(':');return +m*60+(+sec||0);}
function fmtTime(s){return Math.floor(s/60)+':'+(s%60).toString().padStart(2,'0');}
function prevTrack(){trackIdx=(trackIdx-1+tracks.length)%tracks.length;progVal=0;updatePlayerUI();if(isPlaying)startProg();}
function nextTrack(){trackIdx=(trackIdx+1)%tracks.length;progVal=0;updatePlayerUI();if(isPlaying)startProg();}

/* ── CERT FILTER ── */
function filterCerts(btn,cat){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.cert-card').forEach(c=>{c.style.display=(cat==='all'||c.dataset.cat===cat)?'':'none';});
}

/* ── TOAST ── */
let toastT;
function toast(msg){
  const t=document.getElementById('toast'),m=document.getElementById('toast-msg');
  m.textContent=msg;t.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2100);
}

/* ── 3D TILT (desktop only) ── */
if(window.matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.proj-card,.cert-card,.soc-card,.skill-panel,.about-card,.music-player-card,.discography-card,.tl-detail').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`translateY(-4px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;});
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
}

// Start typing script manually in case it didn't trigger from boot
// typeLoop();
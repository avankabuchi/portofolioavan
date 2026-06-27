/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10 ? '0 1px 0 rgba(0,0,0,0.06)' : '';
}, { passive: true });

/* ─── MOBILE MENU ─── */
const menuBtn = document.getElementById('menu-btn');
const navMobile = document.getElementById('nav-mobile');
menuBtn.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
function closeMobile() {
  navMobile.classList.remove('open');
}

/* ─── ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id], footer');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => observer.observe(s));

/* ─── TYPING ─── */
const phrases = ['Networking Engineer', 'Web Developer', 'Content Creator', 'Musisi & Artist', 'Problem Solver', 'Freelancer'];
let pi = 0, ci = 0, deleting = false;
const typEl = document.getElementById('typing-role');

function typeLoop() {
  if (!typEl) return;
  const word = phrases[pi];
  if (!deleting) {
    typEl.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typEl.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.skill-group, .bar-row, .tl-item, .proj-card, .cert-card, .social-card, .about-quote, .collab-cta, .music-player, .music-tracks'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 4) * 60 + 'ms';
  revealObserver.observe(el);
});

/* ─── SKILL BARS ─── */
const barsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill[data-w]').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 100);
      });
      barsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const profEl = document.querySelector('.proficiency-bars');
if (profEl) barsObserver.observe(profEl);

/* ─── CERT FILTER ─── */
document.getElementById('cert-filter')?.addEventListener('click', e => {
  const btn = e.target.closest('.cf-btn');
  if (!btn) return;
  document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.dataset.cat;
  document.querySelectorAll('.cert-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
});

/* ─── MUSIC PLAYER ─── */
const tracks = [
  { name: 'Track 1', art: '🎸', dur: '3:24', plat: 'Spotify & Apple Music' },
  { name: 'Track 2', art: '🎹', dur: '2:58', plat: 'Apple Music' },
  { name: 'Track 3', art: '🎧', dur: '4:10', plat: 'YouTube & Spotify' },
  { name: 'Track 4', art: '🎻', dur: '3:45', plat: 'Spotify' },
];
let trackIdx = 0, isPlaying = false, progVal = 0, progTimer;

function initTrackList() {
  const tl = document.getElementById('track-list');
  if (!tl) return;
  tl.innerHTML = tracks.map((t, i) => `
    <div class="track-row${i === 0 ? ' active-track' : ''}" data-idx="${i}">
      <div class="tr-num">${i + 1}</div>
      <div class="tr-art">${t.art}</div>
      <div class="tr-name">Avan Kabuchi — ${t.name}</div>
      <div class="tr-dur">${t.dur}</div>
    </div>
  `).join('');
  tl.addEventListener('click', e => {
    const row = e.target.closest('.track-row');
    if (!row) return;
    selectTrack(parseInt(row.dataset.idx));
  });
}

function updatePlayerUI() {
  const t = tracks[trackIdx];
  document.getElementById('player-title').textContent = 'Avan Kabuchi — ' + t.name;
  document.getElementById('player-art').textContent = t.art;
  document.getElementById('player-plat').textContent = t.plat;
  document.getElementById('prog-dur').textContent = t.dur;
  document.querySelectorAll('.track-row').forEach((r, i) =>
    r.classList.toggle('active-track', i === trackIdx)
  );
}

function selectTrack(i) {
  trackIdx = i;
  updatePlayerUI();
  progVal = 0;
  document.getElementById('prog-fill').style.width = '0%';
  document.getElementById('prog-cur').textContent = '0:00';
  if (!isPlaying) togglePlay();
  else startProg();
}

function togglePlay() {
  isPlaying = !isPlaying;
  const art = document.getElementById('player-art');
  const icon = document.getElementById('play-icon');
  if (isPlaying) {
    icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    icon.setAttribute('fill', 'currentColor');
    art?.classList.add('spinning');
    startProg();
  } else {
    icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    art?.classList.remove('spinning');
    clearInterval(progTimer);
  }
}

function startProg() {
  clearInterval(progTimer);
  const dur = parseDur(tracks[trackIdx].dur);
  progTimer = setInterval(() => {
    progVal++;
    if (progVal >= dur) { progVal = 0; nextTrack(); return; }
    const fill = document.getElementById('prog-fill');
    const cur = document.getElementById('prog-cur');
    if (fill) fill.style.width = (progVal / dur * 100) + '%';
    if (cur) cur.textContent = fmtTime(progVal);
  }, 1000);
}

function parseDur(s) {
  const [m, sec] = s.split(':');
  return +m * 60 + (+sec || 0);
}
function fmtTime(s) {
  return Math.floor(s / 60) + ':' + (s % 60).toString().padStart(2, '0');
}
function prevTrack() { trackIdx = (trackIdx - 1 + tracks.length) % tracks.length; progVal = 0; updatePlayerUI(); if (isPlaying) startProg(); }
function nextTrack() { trackIdx = (trackIdx + 1) % tracks.length; progVal = 0; updatePlayerUI(); if (isPlaying) startProg(); }

// expose for HTML onclick
window.togglePlay = togglePlay;
window.prevTrack = prevTrack;
window.nextTrack = nextTrack;

initTrackList();

/* ─── SMOOTH SCROLL OFFSET FOR FIXED NAV ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
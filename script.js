const pageLoader = document.getElementById('pageLoader');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section');
const typingText = document.getElementById('typingText');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const mobileToggle = document.getElementById('mobileToggle');
const siteNav = document.getElementById('siteNav');

const types = ['web applications.', 'performance-first products.', 'immersive experiences.', 'scalable interfaces.'];
let typeIndex = 0;

// Hacker mode toggle: apply .hacker-mode on the root element
(function(){
  const hackerToggle = document.getElementById('hackerToggle');
  const root = document.documentElement;
  if(!hackerToggle) return;

  function applyMode(on){
    root.classList.toggle('hacker-mode', !!on);
    hackerToggle.classList.toggle('active', !!on);
    hackerToggle.setAttribute('aria-pressed', !!on ? 'true' : 'false');
    try{ localStorage.setItem('hackerMode', !!on ? '1' : '0'); }catch(e){}
  }

  hackerToggle.addEventListener('click', ()=>{
    applyMode(!root.classList.contains('hacker-mode'));
  });

  // Keyboard shortcut: Ctrl+Shift+H
  window.addEventListener('keydown', (e)=>{
    if(e.key && (e.key === 'H' || e.key === 'h') && e.ctrlKey && e.shiftKey){
      e.preventDefault();
      applyMode(!root.classList.contains('hacker-mode'));
    }
  });

  // Load saved preference
  try{
    const saved = localStorage.getItem('hackerMode') === '1';
    applyMode(saved);
  }catch(e){ }
})();
let charIndex = 0;
let deleting = false;

const setTheme = (theme) => {
  if (theme === 'light') {
    body.dataset.theme = 'light';
    body.classList.add('light');
    themeToggle.querySelector('.theme-icon').textContent = '☀';
  } else {
    body.dataset.theme = 'dark';
    body.classList.remove('light');
    themeToggle.querySelector('.theme-icon').textContent = '☾';
  }
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme === 'light' ? 'light' : 'dark');
};

themeToggle.addEventListener('click', () => {
  const nextTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});

const typeWriter = () => {
  const currentText = types[typeIndex];
  if (!deleting) {
    typingText.textContent = currentText.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) {
      deleting = true;
      setTimeout(typeWriter, 1600);
      return;
    }
  } else {
    typingText.textContent = currentText.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      typeIndex = (typeIndex + 1) % types.length;
    }
  }
  setTimeout(typeWriter, deleting ? 60 : 100);
};

typeWriter();

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / height) * 100;
  scrollProgress.style.width = `${progress}%`;
  backToTop.classList.toggle('show', scrollTop > 500);
};

const updateActiveLink = () => {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const id = section.id;
    const link = document.querySelector(`.site-nav a[href="#${id}"]`);
    if (rect.top <= 120 && rect.bottom > 120) {
      navLinks.forEach((item) => item.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.glass-card, .section-header, .project-card, .case-card, .experience-card, .contact-card').forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  revealObserver.observe(card);
});

const initMobileNav = () => {
  mobileToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
    });
  });
};

const filterProjects = () => {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      projectCards.forEach((card) => {
        card.style.display = filter === 'all' || card.dataset.filter === filter ? 'grid' : 'none';
      });
    });
  });
};

const animateCounters = () => {
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const targetValue = parseInt(counter.dataset.target, 10);
          let value = 0;
          const step = Math.max(Math.floor(targetValue / 120), 1);
          const interval = setInterval(() => {
            value += step;
            counter.textContent = value >= targetValue ? targetValue : value;
            if (value >= targetValue) {
              clearInterval(interval);
            }
          }, 16);
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((counter) => counterObserver.observe(counter));
};

window.addEventListener('scroll', () => {
  handleScroll();
  updateActiveLink();
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('load', () => {
  loadTheme();
  handleScroll();
  initMobileNav();
  filterProjects();
  animateCounters();
  if (pageLoader) {
    pageLoader.classList.add('fade-out');
    setTimeout(() => {
      pageLoader.style.display = 'none';
    }, 600);
  }
});

// Contact card click handlers
(function() {
  const contactCards = document.querySelectorAll('.contact-card:not(.email-card)');
  contactCards.forEach((card) => {
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-url');
      const target = card.getAttribute('data-target');
      if (url) {
        if (target === '_blank') {
          window.open(url, '_blank', 'noreferrer');
        } else {
          window.location.href = url;
        }
      }
    });
    
    // Handle keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();

// Email copy functionality
(function() {
  const emailCard = document.querySelector('.email-card');
  if (!emailCard) return;
  
  const emailAddress = 'pranavprahaldkulkarni2007@gmail.com';
  
  emailCard.addEventListener('click', () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      const hint = emailCard.querySelector('.copy-hint');
      const originalText = hint.textContent;
      hint.textContent = 'Copied!';
      setTimeout(() => {
        hint.textContent = originalText;
      }, 2000);
    }).catch(() => {
      alert('Email: ' + emailAddress);
    });
  });
  
  emailCard.style.cursor = 'pointer';
  emailCard.setAttribute('role', 'button');
  emailCard.setAttribute('tabindex', '0');
  
  emailCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      emailCard.click();
    }
  });
})();

// Featured project rotation
(function() {
  const projects = [
    {
      badge: 'GV Pro',
      title: 'Ghost Free Vault',
      description: 'A secure financial management platform presented at college-level hackathons including TECH-TANTRA 1.0 and CHAKRAVYUH 2.0.',
      stat1: '3',
      stat2: '2'
    },
    {
      badge: 'Hardware',
      title: 'Fire Detector',
      description: 'Autonomous fire detection system with sensor monitoring, alert logic, and real-time response control.',
      stat1: 'Real-time',
      stat2: 'Safety'
    },
    {
      badge: 'Hardware',
      title: 'Gas Sensor Auto Window Opener',
      description: 'Automated ventilation system that opens windows when hazardous gas levels rise.',
      stat1: 'Auto',
      stat2: 'Smart'
    }
  ];

  let currentIndex = 0;
  const elementsToFade = [
    '#featureBadge',
    '#featuredTitle',
    '#featuredDescription',
    '#featuredStat1',
    '#featuredStat2'
  ];

  function updateFeatured() {
    const project = projects[currentIndex];
    
    // Fade out
    elementsToFade.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) el.style.opacity = '0';
    });

    // Update after fade out
    setTimeout(() => {
      document.getElementById('featureBadge').textContent = project.badge;
      document.getElementById('featuredTitle').textContent = project.title;
      document.getElementById('featuredDescription').textContent = project.description;
      document.getElementById('featuredStat1').textContent = project.stat1;
      document.getElementById('featuredStat2').textContent = project.stat2;

      // Fade in
      elementsToFade.forEach((selector) => {
        const el = document.querySelector(selector);
        if (el) el.style.opacity = '1';
      });
    }, 200);

    currentIndex = (currentIndex + 1) % projects.length;
  }

  // Initialize opacity to 1
  elementsToFade.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el) el.style.opacity = '1';
  });

  // Rotate every 5 seconds
  setInterval(updateFeatured, 5000);
})();

// Mini-Games App Store interactions
(function () {
  const installButtons = document.querySelectorAll('.btn.install');
  const previewTitle = document.getElementById('previewTitle');
  const previewMeta = document.getElementById('previewMeta');
  const previewStage = document.getElementById('previewStage');

  const apps = {
    'vault-hacker': {
      title: 'Vault Hacker',
      meta: 'Easy • Logic puzzle',
      desc: 'A terminal-style Mastermind where you guess a 4-digit vault code and receive positional hints.'
    },
    'grid-hunter': {
      title: 'Grid Hunter',
      meta: 'Medium • Explorer',
      desc: '10×10 coordinate treasure hunt. Enter X/Y guesses and get directional/distance feedback.'
    },
    'choice-protocol': {
      title: 'Choice Protocol',
      meta: 'Hard • Narrative',
      desc: 'Minimal text-adventure with branching choices influenced by hidden state.'
    }
  };

  function showPreview(id) {
    const app = apps[id];
    if (!app) return;
    previewTitle.textContent = app.title;
    previewMeta.textContent = app.meta;
    // load playable demo directly into previewStage
    if (id === 'vault-hacker') loadVaultHacker(previewStage);
    if (id === 'grid-hunter') loadGridHunter(previewStage);
    if (id === 'choice-protocol') loadChoiceProtocol(previewStage);
  }

  installButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.app;
      showPreview(id);
      // scroll preview into view on small screens
      document.getElementById('appPreview').scrollIntoView({ behavior: 'smooth' });
    });
  });

})();

// --- Demo loaders: inject playable apps into a container ---
function loadVaultHacker(container){
  container.innerHTML = `
    <div style="max-width:740px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">Vault Hacker</h3>
        <div style="color:var(--text-muted)">Crack the 4-digit vault (no duplicates) — 5 attempts</div>
      </div>
      <div id="vhTerminal" style="background:#0b0b0b;color:#7cff7c;padding:12px;border-radius:8px;font-family:monospace;min-height:100px">TERMINAL READY — Enter your guess below.</div>
      <div style="display:flex;gap:8px;margin-top:12px;align-items:center">
        <input id="vhGuess" inputmode="numeric" maxlength="4" placeholder="e.g. 0427" style="padding:8px;border-radius:8px;border:1px solid var(--border);width:160px" />
        <button id="vhSubmit" class="btn">Guess</button>
        <button id="vhReset" class="btn">Reset</button>
        <div style="margin-left:auto;color:var(--text-muted)" id="vhTries">Attempts left: 5</div>
      </div>
      <div id="vhLog" style="margin-top:10px;background:var(--surface-soft);border:1px solid var(--border);padding:10px;border-radius:8px;max-height:220px;overflow:auto;font-family:monospace"></div>
    </div>
  `;
  const log = container.querySelector('#vhLog');
  const term = container.querySelector('#vhTerminal');
  const input = container.querySelector('#vhGuess');
  const submit = container.querySelector('#vhSubmit');
  const reset = container.querySelector('#vhReset');
  const triesEl = container.querySelector('#vhTries');

  function newGame(){
    const digits = [];
    while(digits.length < 4){ const d = String(Math.floor(Math.random()*10)); if(!digits.includes(d)) digits.push(d); }
    return { secret: digits, attemptsLeft: 5, solved:false };
  }
  let game = newGame();

  function appendLog(text, cls){ const p = document.createElement('div'); if(cls) p.className = cls; p.textContent = text; log.prepend(p); }
  function revealSecret(){ appendLog('SECRET: ' + game.secret.join(''), 'vh-fail'); term.textContent = 'GAME OVER'; }
  function evaluateGuess(guess){ const g = guess.split(''); let correctPos=0; const sCount={}, gCount={}; for(let i=0;i<4;i++){ if(game.secret[i]===g[i]) correctPos++; else { sCount[game.secret[i]]=(sCount[game.secret[i]]||0)+1; gCount[g[i]]=(gCount[g[i]]||0)+1; } } let misplaced=0; for(const d in gCount){ if(sCount[d]) misplaced += Math.min(sCount[d], gCount[d]); } return { correctPos, misplaced }; }
  function updateUI(){ triesEl.textContent = 'Attempts left: ' + game.attemptsLeft; }

  function onGuess(){ const val=(input.value||'').trim(); if(!/^\d{4}$/.test(val)){ appendLog('Enter a 4-digit number.'); input.value=''; return; } const set=new Set(val.split('')); if(set.size!==4){ appendLog('Digits must be unique (no duplicates).'); input.value=''; return; } if(game.solved || game.attemptsLeft<=0){ appendLog('Game finished — reset to play again.'); return; } game.attemptsLeft--; const res=evaluateGuess(val); appendLog(`Guess ${5-game.attemptsLeft}: ${val} → Correct position: ${res.correctPos}, Misplaced: ${res.misplaced}`); if(res.correctPos===4){ appendLog('✅ CRACKED — you opened the vault!', 'vh-success'); term.textContent='VAULT OPENED'; game.solved=true; } else if(game.attemptsLeft<=0){ appendLog('❌ Out of attempts.','vh-fail'); revealSecret(); } else { term.textContent = `${res.correctPos} correct, ${res.misplaced} misplaced — keep trying.`; } updateUI(); input.value=''; }

  submit.addEventListener('click', onGuess);
  input.addEventListener('keypress', (e)=>{ if(e.key==='Enter') onGuess(); });
  reset.addEventListener('click', ()=>{ game=newGame(); log.innerHTML=''; term.textContent='TERMINAL READY — Enter your guess below.'; updateUI(); input.value=''; });
  updateUI();
}

function loadGridHunter(container){
  container.innerHTML = `
    <div style="max-width:820px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">Grid Hunter</h3>
        <div style="color:var(--text-muted)">Find the treasure on a 10×10 grid — 6 moves</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(10,28px);gap:6px" id="ghGrid"></div>
      <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
        <input id="ghX" type="number" min="1" max="10" placeholder="X" style="width:70px;padding:8px;border-radius:8px;border:1px solid var(--border)" />
        <input id="ghY" type="number" min="1" max="10" placeholder="Y" style="width:70px;padding:8px;border-radius:8px;border:1px solid var(--border)" />
        <button id="ghSubmit" class="btn">Guess</button>
        <button id="ghReset" class="btn">Reset</button>
        <div style="margin-left:auto;color:var(--text-muted)">Moves left: <span id="ghMoves">6</span></div>
      </div>
      <div id="ghLog" style="margin-top:10px;background:var(--surface-soft);border:1px solid var(--border);padding:10px;border-radius:8px;max-height:160px;overflow:auto;font-family:monospace"></div>
    </div>
  `;
  const gridEl = container.querySelector('#ghGrid'); const log = container.querySelector('#ghLog'); const movesEl = container.querySelector('#ghMoves');
  const inX = container.querySelector('#ghX'), inY = container.querySelector('#ghY');
  const submit = container.querySelector('#ghSubmit'), reset = container.querySelector('#ghReset');
  let tx, ty, moves;
  function newGame(){ tx=1+Math.floor(Math.random()*10); ty=1+Math.floor(Math.random()*10); moves=6; movesEl.textContent=moves; log.innerHTML=''; buildGrid(); }
  function buildGrid(){ gridEl.innerHTML=''; for(let y=1;y<=10;y++){ for(let x=1;x<=10;x++){ const btn=document.createElement('button'); btn.className='gh-cell'; btn.style.width='28px'; btn.style.height='28px'; btn.style.borderRadius='6px'; btn.style.border='1px solid rgba(255,255,255,0.04)'; btn.style.background='transparent'; btn.dataset.x=x; btn.dataset.y=y; btn.addEventListener('click', ()=>cellGuess(x,y,btn)); gridEl.appendChild(btn); } } }
  function append(line){ const p=document.createElement('div'); p.textContent=line; log.prepend(p); }
  function getDirection(dx,dy){ let vert = dy>0?'N':dy<0?'S':''; let hor = dx>0?'E':dx<0?'W':''; return (vert+hor) || 'Here'; }
  function getRangeClass(dist){ if(dist<=2.5) return 'Hot'; if(dist<=5) return 'Warm'; return 'Cold'; }
  function colorCell(el,range){ if(range==='Hot') el.style.background='linear-gradient(90deg,#ffb3b3,#ffefef)'; else if(range==='Warm') el.style.background='linear-gradient(90deg,#fff1b8,#fffef0)'; else el.style.background='linear-gradient(90deg,#dbeafe,#f8fbff)'; }
  function cellGuess(x,y,el){ if(moves<=0){ append('No moves left. Reset to play again.'); return; } if(x===tx && y===ty){ el.textContent='💎'; el.style.background='#ffd966'; append(`Found treasure at (${x},${y}) — You win!`); moves=0; movesEl.textContent=moves; return; } const dx = tx-x, dy=ty-y; const dist = Math.hypot(dx,dy); const dir = getDirection(dx,dy); const range = getRangeClass(dist); colorCell(el,range); el.textContent = range[0]; append(`Guess (${x},${y}) → ${range} — stronger toward ${dir} (dist ${dist.toFixed(2)})`); moves--; movesEl.textContent=moves; if(moves<=0){ append(`Out of moves — treasure was at (${tx},${ty}).`); revealSecret(); } }
  function revealSecret(){ const cells = gridEl.querySelectorAll('button'); cells.forEach(c=>{ if(parseInt(c.dataset.x)===tx && parseInt(c.dataset.y)===ty){ c.textContent='💎'; c.style.background='#ffd966'; } }); }
  submit.addEventListener('click', ()=>{ const x=parseInt(inX.value,10), y=parseInt(inY.value,10); if(!(x>=1 && x<=10 && y>=1 && y<=10)){ append('Enter coordinates 1–10.'); return; } const selector = `button[data-x="${x}"][data-y="${y}"]`; const el = gridEl.querySelector(selector); cellGuess(x,y,el); inX.value=''; inY.value=''; });
  reset.addEventListener('click', newGame);
  newGame();
}

function loadChoiceProtocol(container){
  container.innerHTML = `
    <div style="max-width:760px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">Choice Protocol</h3>
        <div style="color:var(--text-muted)">4-stage micro cyber-heist — track Stealth / Resources / Alert</div>
      </div>
      <div id="cpFeed" style="background:var(--surface-soft);border-radius:8px;padding:12px;min-height:140px"></div>
      <div id="cpChoices" style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap"></div>
      <div id="cpState" style="margin-top:12px;color:var(--text-muted)"></div>
      <div style="margin-top:10px"><button id="cpReset" class="btn">Restart</button></div>
    </div>
  `;
  const feed = container.querySelector('#cpFeed'); const choicesEl = container.querySelector('#cpChoices'); const stateEl = container.querySelector('#cpState'); const reset = container.querySelector('#cpReset');
  let state = { stealth:3, resources:2, alert:0 }; let stage = 0;
  const nodes = [
    { text: "You approach the secure facility's rear entrance. Night wind. A lone camera sweeps the corridor.", choices:[{t:'Use distraction (throw coin)', e:s=>{ s.resources--; s.stealth++; }},{t:'Sneak the fence', e:s=>{ s.stealth++; }},{t:'Brute force door', e:s=>{ s.resources--; s.alert++; }}] },
    { text: 'Inside, a locked corridor with a guard routine. You need access deeper.', choices:[{t:'Forge credentials', e:s=>{ s.resources--; s.stealth++; }},{t:'Follow guard pattern', e:s=>{ s.stealth++; }},{t:'Create false alarm', e:s=>{ s.alert++; s.resources--; }}] },
    { text: 'Server room ahead. Critical decision — how to extract data?', choices:[{t:'Use remote exploit', e:s=>{ s.resources--; s.stealth++; }},{t:'Plug USB (noisy)', e:s=>{ s.alert++; }},{t:'Copy quickly and run', e:s=>{ s.resources--; s.stealth--; }}] },
    { text: 'Exit route: choose your egress strategy.', choices:[{t:'Ghost exit (safe route)', e:s=>{ s.stealth++; }},{t:'Run to vehicle', e:s=>{ s.alert++; }},{t:'Hide and wait', e:s=>{ s.resources++; }}] }
  ];

  function render(){ const node = nodes[stage]; feed.innerHTML = `<div style="font-weight:600;margin-bottom:8px">${node.text}</div>`; choicesEl.innerHTML=''; node.choices.forEach((c,i)=>{ const b=document.createElement('button'); b.className='btn'; b.textContent=c.t; b.addEventListener('click', ()=>{ if(c.e) c.e(state); stage++; if(stage>=nodes.length) finish(); else render(); updateState(); }); choicesEl.appendChild(b); }); updateState(); }
  function updateState(){ stateEl.textContent = `Stealth: ${state.stealth} · Resources: ${state.resources} · Alert: ${state.alert}`; }
  function finish(){ feed.innerHTML = '<div style="font-weight:600">Final evaluation...</div>'; choicesEl.innerHTML=''; if(state.alert >= 3) feed.innerHTML += '<p style="color:#ffb3b3">Captured — Alert level too high. Mission failed.</p>'; else if(state.stealth >= 6) feed.innerHTML += '<p style="color:#9ef08a">Ghost Clean — You slipped away without detection. Perfect success.</p>'; else feed.innerHTML += '<p style="color:#fff2b3">Brute Force Success — You escaped with the data but left traces.</p>'; feed.innerHTML += `<div style="margin-top:8px;color:var(--text-muted)">Final state — Stealth: ${state.stealth}, Resources: ${state.resources}, Alert: ${state.alert}</div>`; }
  reset.addEventListener('click', ()=>{ state={stealth:3,resources:2,alert:0}; stage=0; render(); });
  render();
}




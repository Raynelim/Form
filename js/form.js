/* ═══════════════════════════════════════════════
   FORM — App Data & Constants
   data.js
═══════════════════════════════════════════════ */

const STAT_META = {
  STR: { label: 'Strength',     col: '#e05252', dim: '#3d1616', g: '⊕', acts: ['Weight Training', 'Bodyweight Circuit', 'Sports / Martial Arts', 'Manual Labour'] },
  END: { label: 'Endurance',    col: '#4da8d4', dim: '#0e2d3e', g: '◎', acts: ['Running / Jogging', 'Cycling', 'Swimming', 'Hiking'] },
  INT: { label: 'Intelligence', col: '#9b7fe8', dim: '#211840', g: '◈', acts: ['Reading / Books', 'Online Course', 'Language Study', 'Skill Practice'] },
  VIT: { label: 'Vitality',     col: '#4ec47a', dim: '#0d2e1a', g: '♡', acts: ['Sleep 8h+', 'Log All Meals', 'Meditation', 'Journaling'] },
  WLT: { label: 'Wealth',       col: '#c9a84c', dim: '#2b1f08', g: '◇', acts: ['Track Expenses', 'Save / Invest', 'Side Income', 'Budget Planning'] },
};

const XP_RANGES = ['+35–120 XP', '+80–200 XP', '+50–150 XP', '+40–100 XP'];

const STATS = {
  STR: { xp: 7200,  grade: 'C', lvl: 12, pct: .44 },
  END: { xp: 14800, grade: 'B', lvl: 15, pct: .72 },
  INT: { xp: 24100, grade: 'A', lvl: 14, pct: .60 },
  VIT: { xp: 3200,  grade: 'D', lvl:  8, pct: .32 },
  WLT: { xp: 6400,  grade: 'C', lvl: 11, pct: .28 },
};

const QUESTS = [
  { id: 1, stat: 'END', label: 'Run 5km or more',         verify: 'GPS / Health sync', xp: 200, done: true  },
  { id: 2, stat: 'INT', label: 'Study for 45 minutes',    verify: 'App timer',          xp: 150, done: true  },
  { id: 3, stat: 'VIT', label: 'Log all 3 meals + sleep', verify: 'Manual log',         xp: 120, done: false },
];

const TITLES = [
  { label: 'The Polyglot',  stat: 'INT', u: true,  eq: true  },
  { label: 'Marathon Soul', stat: 'END', u: true,  eq: false },
  { label: '???',           stat: null,  u: false, eq: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'CIPHER_X',   grade: 'SS', lvl: 47, me: false },
  { rank: 2, name: 'NightOwl',   grade: 'S',  lvl: 43, me: false },
  { rank: 3, name: 'IronWill_K', grade: 'A',  lvl: 38, me: false },
  { rank: 4, name: 'ALEX_01',    grade: 'C',  lvl: 15, me: true  },
  { rank: 5, name: 'RunnerB',    grade: 'D',  lvl: 12, me: false },
  { rank: 6, name: 'SleepHero',  grade: 'E',  lvl:  8, me: false },
  { rank: 7, name: 'Budgeter',   grade: 'F',  lvl:  3, me: false },
];

const TIERS = [
  { key: 'honour', label: 'Honour', mult: 1.0, d: '1.0×' },
  { key: 'timer',  label: 'Timer',  mult: 1.2, d: '1.2×' },
  { key: 'photo',  label: 'Photo',  mult: 1.3, d: '1.3×' },
  { key: 'sync',   label: 'Sync',   mult: 1.5, d: '1.5×' },
];

const SCREEN_NAMES = {
  dashboard:   'Dashboard',
  stat:        'Stat Detail',
  log:         'Log Session',
  quests:      'Daily Quests',
  profile:     'Profile',
  leaderboard: 'Leaderboard',
};

// Mutable state
let curStat    = 'INT';
let logStat    = 'INT';
let logTier    = 'timer';
let logMin     = 45;
/* ═══════════════════════════════════════════════
   FORM — Navigation
   nav.js
═══════════════════════════════════════════════ */

function nav(id) {
  // Screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');

  // Sidebar links
  document.querySelectorAll('.nl').forEach(l =>
    l.classList.toggle('active', l.dataset.screen === id)
  );

  // Bottom nav items
  document.querySelectorAll('.bi').forEach(b =>
    b.classList.toggle('active', b.dataset.screen === id)
  );

  // Topbar title
  document.getElementById('tbTitle').textContent = SCREEN_NAMES[id];

  window.scrollTo(0, 0);
  closeSB();

  // Trigger renders that need dynamic data
  if (id === 'stat')        renderSD(curStat);
  if (id === 'log')         renderLog();
  if (id === 'leaderboard') renderLB();
}

function toggleSB() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sbo').classList.toggle('open');
}

function closeSB() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sbo').classList.remove('open');
}
/* ═══════════════════════════════════════════════
   FORM — Dashboard
   dashboard.js
═══════════════════════════════════════════════ */

function renderDash() {
  // Stats grid
  document.getElementById('statsGrid').innerHTML =
    Object.entries(STATS).map(([code, s]) => {
      const m = STAT_META[code];
      return `
        <div class="sri" style="border-left-color:${m.col}"
             onclick="curStat='${code}'; nav('stat')">
          <div class="s-ic" style="background:${m.dim}">
            <span style="font-family:var(--font-m);font-size:17px;color:${m.col};line-height:1">${m.g}</span>
          </div>
          <div class="s-inf">
            <div class="snr">
              <span class="sn">${m.label}</span>
              <span class="sl">Lv.${s.lvl}</span>
            </div>
            <div class="xb-track">
              <div class="xb-fill" style="width:${s.pct * 100}%;background:${m.col}"></div>
            </div>
          </div>
          <span class="gl" style="color:${m.col}">${s.grade}</span>
        </div>`;
    }).join('');

  // Quest count
  const done = QUESTS.filter(q => q.done).length;
  document.getElementById('qCount').textContent = done + ' / ' + QUESTS.length;

  // Quest list
  document.getElementById('qList').innerHTML =
    QUESTS.map(q => {
      const m = STAT_META[q.stat];
      return `
        <div class="qrow">
          <div class="cc ${q.done ? 'done' : ''}"
               style="${q.done
                 ? 'background:' + m.col + ';border-color:' + m.col
                 : 'border-color:' + m.col}">
            ${q.done ? '<span class="ctick">✓</span>' : ''}
          </div>
          <span class="qlbl"
                style="${q.done ? 'color:var(--t3);text-decoration:line-through' : 'color:var(--t1)'}">
            ${q.label}
          </span>
          <span class="spill" style="background:${m.dim};color:${m.col}">${q.stat}</span>
          <span class="qxp"   style="color:${q.done ? 'var(--t3)' : m.col}">+${q.xp} XP</span>
        </div>`;
    }).join('');
}
/* ═══════════════════════════════════════════════
   FORM — Stat Detail
   stat.js
═══════════════════════════════════════════════ */

function renderSD(code) {
  const m = STAT_META[code];
  const s = STATS[code];

  document.getElementById('sdBack').style.color = m.col;
  document.getElementById('sdTint').style.background = m.dim;

  document.getElementById('sdWm').textContent = s.grade;
  document.getElementById('sdWm').style.color = m.col;

  document.getElementById('sdIc').innerHTML =
    `<span style="font-family:var(--font-m);font-size:26px;color:${m.col};line-height:1">${m.g}</span>`;
  document.getElementById('sdIc').style.background = m.dim;

  document.getElementById('sdTitle').textContent = m.label;
  document.getElementById('sdXpB').textContent   = s.xp.toLocaleString();
  document.getElementById('sdXpS').textContent   = 'XP · Grade ' + s.grade;

  document.getElementById('sdXpF').style.cssText =
    `width:${s.pct * 100}%;background:${m.col};height:6px`;

  document.getElementById('sdPct').textContent  = Math.round(s.pct * 100) + '%';
  document.getElementById('sdPct').style.color  = m.col;

  // Activities
  document.getElementById('actGrid').innerHTML =
    m.acts.map((act, i) => `
      <div class="ar ${i === 0 ? 'feat' : ''}"
           style="${i === 0 ? 'border-left-color:' + m.col : ''}"
           onclick="logStat='${code}'; nav('log')">
        <div class="aic" style="background:${m.dim}">
          <span style="font-family:var(--font-m);font-size:15px;color:${m.col};line-height:1">${m.g}</span>
        </div>
        <div style="flex:1">
          <div class="an" style="${i > 0 ? 'color:var(--t2);font-weight:400' : ''}">${act}</div>
          <div class="av">Timer</div>
        </div>
        <span class="ax" style="color:${m.col}">${XP_RANGES[i]}</span>
        <div class="pb" style="background:${m.dim};color:${m.col}">+</div>
      </div>`).join('');

  // Recolour recent session XP values
  document.querySelectorAll('#sessList .sxp').forEach(el => el.style.color = m.col);
}
/* ═══════════════════════════════════════════════
   FORM — Log Activity
   log.js
═══════════════════════════════════════════════ */

function renderLog() {
  const m = STAT_META[logStat];

  document.getElementById('lgBack').style.color   = m.col;
  document.getElementById('lgBack').textContent   = '← ' + m.label;
  document.getElementById('actIn').style.borderBottomColor = m.col;
  document.getElementById('lgCta').style.background = m.col;

  _updateSliderTrack();
  renderLgTabs();
  renderTiers();
  updateXP();
}

function renderLgTabs() {
  document.getElementById('lgTabs').innerHTML =
    Object.entries(STAT_META).map(([code, m]) => `
      <div class="stab ${code === logStat ? 'active' : ''}"
           style="${code === logStat ? 'background:' + m.dim + ';border-color:' + m.col : ''}"
           onclick="logStat='${code}'; renderLog()">
        <span class="stab-g" style="color:${code === logStat ? m.col : 'var(--t3)'}">${m.g}</span>
        <span class="stab-c" style="color:${code === logStat ? m.col : 'var(--t3)'}">${code}</span>
      </div>`).join('');
}

function renderTiers() {
  const m = STAT_META[logStat];
  document.getElementById('tRow').innerHTML =
    TIERS.map(t => `
      <div class="tbtn ${t.key === logTier ? 'active' : ''}"
           style="${t.key === logTier ? 'background:' + m.dim + ';border-color:' + m.col : ''}"
           onclick="logTier='${t.key}'; renderTiers(); updateXP()">
        <span class="tm" style="color:${t.key === logTier ? m.col : 'var(--t3)'}">${t.d}</span>
        <span class="tl" style="color:${t.key === logTier ? m.col : 'var(--t3)'}">${t.label}</span>
      </div>`).join('');
}

function updateXP() {
  const mult = TIERS.find(t => t.key === logTier).mult;
  const xp   = Math.round(logMin * 3.2 * mult * 1.1 * 1.05);
  document.getElementById('xpNum').textContent  = '+' + xp;
  document.getElementById('xpBrk').textContent  =
    Math.round(logMin * 3.2) + ' base × ' + mult + '× ' + logTier + ' × 1.1×';
}

function _updateSliderTrack() {
  const slider = document.getElementById('durS');
  const pct    = (logMin - 5) / 115 * 100;
  const col    = STAT_META[logStat].col;
  slider.style.background =
    `linear-gradient(to right, ${col} 0%, ${col} ${pct}%, var(--s4) ${pct}%, var(--s4) 100%)`;
}

// Slider event — wired up in init.js after DOM ready
function onSliderInput(e) {
  logMin = +e.target.value;
  document.getElementById('durN').textContent = logMin;
  _updateSliderTrack();
  updateXP();
}
/* ═══════════════════════════════════════════════
   FORM — Daily Quests
   quests.js
═══════════════════════════════════════════════ */

function renderQuests() {
  // Date label
  const d = new Date();
  document.getElementById('qDate').textContent =
    d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  // Quest cards
  document.getElementById('qCards').innerHTML =
    QUESTS.map(q => {
      const m = STAT_META[q.stat];
      return `
        <div class="qcard"
             style="${!q.done
               ? 'border-color:' + m.col + ';background:var(--s2)'
               : 'background:var(--s1)'}">
          <div class="qa" style="background:${q.done ? 'var(--t3)' : m.col}"></div>
          <div class="qb">
            <div class="qt">
              <span class="spill" style="background:${m.dim};color:${m.col}">${q.stat}</span>
              ${q.done
                ? `<span class="db" style="color:${m.col}">✓ COMPLETE</span>`
                : ''}
            </div>
            <div class="ql ${q.done ? 'dim' : ''}">${q.label}</div>
            <div class="qv">${q.verify}</div>
            ${!q.done
              ? `<div class="qcta" style="color:${m.col}"
                      onclick="logStat='${q.stat}'; nav('log')">→ LOG NOW</div>`
              : ''}
          </div>
          <div class="qxpc" style="color:${q.done ? 'var(--t3)' : m.col}">+${q.xp}</div>
        </div>`;
    }).join('');

  // Claim block
  const done = QUESTS.filter(q => q.done).length;
  const all  = done === QUESTS.length;
  document.getElementById('clm').style.opacity   = all ? '1' : '0.4';
  document.getElementById('clmT').textContent    = all
    ? 'All quests complete'
    : (QUESTS.length - done) + ' remaining';
  document.getElementById('clmM').textContent    = all
    ? 'Claim +200 Bonus XP'
    : done + ' / ' + QUESTS.length + ' done';
  document.getElementById('clmM').style.color    = all ? 'var(--gold)' : 'var(--t2)';
}
/* ═══════════════════════════════════════════════
   FORM — Profile
   profile.js
═══════════════════════════════════════════════ */

function renderProfile() {
  _renderSpider();
  _renderGrades();
  _renderTitles();
}

function _renderSpider() {
  const svg   = document.getElementById('spSvg');
  const CX = 130, CY = 130, R = 88;
  const codes = ['STR', 'END', 'INT', 'VIT', 'WLT'];
  const vals  = [0.55, 0.72, 0.88, 0.38, 0.55];
  const ghost = vals.map(v => Math.max(0.08, v - 0.15));

  function pt(v, i) {
    const a = Math.PI * 2 * i / 5 - Math.PI / 2;
    return [CX + Math.cos(a) * R * v, CY + Math.sin(a) * R * v];
  }
  function poly(vs) {
    return vs.map((_, i) => pt(vs[i], i).join(',')).join(' ');
  }
  function ring(r) {
    return codes.map((_, i) => pt(r, i).join(',')).join(' ');
  }

  let o = '';

  // Grid rings
  [0.25, 0.5, 0.75, 1].forEach(r => {
    o += `<polygon points="${ring(r)}" fill="none"
            stroke="${r === 1 ? '#222538' : '#1e2130'}" stroke-width="1"/>`;
  });

  // Axes
  codes.forEach((_, i) => {
    const [x, y] = pt(1, i);
    o += `<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}"
            stroke="#1e2130" stroke-width="1"/>`;
  });

  // Ghost polygon (30d ago)
  o += `<polygon points="${poly(ghost)}"
          fill="#222538" fill-opacity="0.5" stroke="#32364a" stroke-width="1"/>`;

  // Player polygon
  o += `<polygon points="${poly(vals)}"
          fill="#17140a" fill-opacity="0.4" stroke="#c9a84c" stroke-width="1.5"/>`;

  // Vertex dots
  vals.forEach((v, i) => {
    const [x, y] = pt(v, i);
    o += `<circle cx="${x}" cy="${y}" r="4.5"
            fill="${STAT_META[codes[i]].col}" stroke="#0d0e12" stroke-width="2"/>`;
  });

  // Axis labels
  codes.forEach((c, i) => {
    const [x, y] = pt(1.22, i);
    o += `<text x="${x}" y="${y + 4}" text-anchor="middle"
            font-size="10" font-weight="700"
            font-family="Share Tech Mono, monospace"
            fill="${STAT_META[c].col}">${c}</text>`;
  });

  svg.innerHTML = o;
}

function _renderGrades() {
  document.getElementById('gradeStrip').innerHTML =
    Object.entries(STATS).map(([code, s]) => {
      const m = STAT_META[code];
      return `
        <div class="gcol">
          <div class="gb" style="background:${m.col}"></div>
          <span class="glb" style="color:${m.col}">${s.grade}</span>
          <span class="lbl">${code}</span>
        </div>`;
    }).join('');
}

function _renderTitles() {
  document.getElementById('titlesEl').innerHTML =
    TITLES.map(t => {
      const sc = t.stat ? STAT_META[t.stat].col : 'var(--t3)';
      return `
        <div class="tr">
          <div class="tic"
               style="background:${t.u ? 'var(--gold-bg)' : 'var(--s2)'};
                      border:1px solid ${t.u ? 'var(--gold-d)' : 'var(--border)'};
                      color:${t.u ? 'var(--gold)' : 'var(--t3)'}">
            ${t.u ? '△' : '?'}
          </div>
          <div style="flex:1">
            <div class="tn ${t.eq ? '' : t.u ? 'dim' : 'lck'}">${t.label}</div>
            ${t.stat
              ? `<span class="lbl" style="color:${sc}">${t.stat}</span>`
              : '<span class="lbl">hidden</span>'}
          </div>
          ${t.eq  ? '<div class="eb">EQUIPPED</div>' : ''}
          ${t.u && !t.eq
            ? '<span class="lbl" style="cursor:pointer;color:var(--t3)">equip</span>'
            : ''}
          ${!t.u  ? '<span class="lbl" style="color:var(--s4)">???</span>' : ''}
        </div>`;
    }).join('');
}
/* ═══════════════════════════════════════════════
   FORM — Leaderboard
   leaderboard.js
═══════════════════════════════════════════════ */

function lbTab(el) {
  document.querySelectorAll('.tabbtn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function renderLB() {
  const medalCols = ['#c9a84c', '#8a8a9a', '#b87333'];
  const top3      = LEADERBOARD.slice(0, 3);
  const rest      = LEADERBOARD.slice(3);

  // Podium order: 2nd · 1st · 3rd
  const order   = [top3[1], top3[0], top3[2]];
  const heights = [100, 140, 82];

  document.getElementById('podium').innerHTML =
    order.map((e, idx) => {
      const pRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
      const col   = medalCols[pRank - 1];
      const h     = heights[idx];
      return `
        <div class="pc ${idx === 1 ? 'ctr' : ''}">
          <div class="pac" style="background:${col}"></div>
          <div class="pcard" style="height:${h + 60}px">
            <div class="pav2" style="border-color:${col};color:${col}">${e.name[0]}</div>
            <div class="prk"  style="color:${col}">#${pRank}</div>
            <div class="pnm">${e.name}</div>
            <div class="plv">Lv.${e.lvl}</div>
            <div class="pgr" style="color:${col}">${e.grade}</div>
          </div>
        </div>`;
    }).join('');

  document.getElementById('lbRows').innerHTML =
    rest.map(e => `
      <div class="lbr ${e.me ? 'me' : ''}">
        ${e.me ? '<div class="mebar"></div>' : ''}
        <span class="lbrk" style="${e.me ? 'color:var(--gold)' : ''}">#${e.rank}</span>
        <div class="lbav"
             style="${e.me
               ? 'border-color:var(--gold-d);color:var(--gold);background:var(--s2)'
               : ''}">${e.name[0]}</div>
        <div class="lbi">
          <div class="lbn" style="${e.me ? 'color:var(--gold);font-weight:700' : ''}">
            ${e.name}
            ${e.me
              ? '<span style="font-size:11px;font-weight:400;color:var(--gold-d)">(You)</span>'
              : ''}
          </div>
          <span class="lbl">overall level</span>
        </div>
        <div class="lbrt">
          <div class="lbg" style="${e.me ? 'color:var(--gold)' : ''}">${e.grade}</div>
          <span class="lbl">Lv.${e.lvl}</span>
        </div>
      </div>`).join('');
}

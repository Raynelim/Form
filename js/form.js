/* ═══════════════════════════════════════════════════════
   FORM — App Logic
   form.js
═══════════════════════════════════════════════════════ */

// ── Data ──────────────────────────────────────────────────────
const SM = {
  STR: { label:'Strength',     col:'#C0392B', dim:'#F5D5D3', bg:'#FDF0F0', g:'⊕', acts:['Weight Training','Bodyweight Circuit','Sports / Martial Arts','Manual Labour'] },
  END: { label:'Endurance',    col:'#2471A3', dim:'#D0E8F5', bg:'#EBF5FB', g:'◎', acts:['Running / Jogging','Cycling','Swimming','Hiking'] },
  INT: { label:'Intelligence', col:'#7D3C98', dim:'#EAD5F5', bg:'#F5EEF8', g:'◈', acts:['Reading / Books','Online Course','Language Study','Skill Practice'] },
  VIT: { label:'Vitality',     col:'#1E8449', dim:'#CCF0DC', bg:'#EAFAF1', g:'♡', acts:['Sleep 8h+','Log All Meals','Meditation','Journaling'] },
  WLT: { label:'Wealth',       col:'#9A7B2E', dim:'#F5EDD8', bg:'#FDF8EC', g:'◇', acts:['Track Expenses','Save / Invest','Side Income','Budget Planning'] },
};

const XP_RANGES = ['+35–120 XP','+80–200 XP','+50–150 XP','+40–100 XP'];

const STATS = {
  STR: { xp:7200,  grade:'C', lvl:12, pct:.44 },
  END: { xp:14800, grade:'B', lvl:15, pct:.72 },
  INT: { xp:24100, grade:'A', lvl:14, pct:.60 },
  VIT: { xp:3200,  grade:'D', lvl: 8, pct:.32 },
  WLT: { xp:6400,  grade:'C', lvl:11, pct:.28 },
};

const QUESTS = [
  { id:1, stat:'END', label:'Run 5km or more',         verify:'GPS / Health sync', xp:200, done:true  },
  { id:2, stat:'INT', label:'Study for 45 minutes',    verify:'App timer',          xp:150, done:true  },
  { id:3, stat:'VIT', label:'Log all 3 meals + sleep', verify:'Manual log',         xp:120, done:false },
];

const TITLES = [
  { label:'The Polyglot',  stat:'INT', u:true,  eq:true  },
  { label:'Marathon Soul', stat:'END', u:true,  eq:false },
  { label:'???',           stat:null,  u:false, eq:false },
];

const LEADERBOARD = [
  { rank:1, name:'CIPHER_X',   grade:'SS', lvl:47, me:false },
  { rank:2, name:'NightOwl',   grade:'S',  lvl:43, me:false },
  { rank:3, name:'IronWill_K', grade:'A',  lvl:38, me:false },
  { rank:4, name:'ALEX_01',    grade:'C',  lvl:15, me:true  },
  { rank:5, name:'RunnerB',    grade:'D',  lvl:12, me:false },
  { rank:6, name:'SleepHero',  grade:'E',  lvl: 8, me:false },
  { rank:7, name:'Budgeter',   grade:'F',  lvl: 3, me:false },
];

const TIERS = [
  { key:'honour', label:'Honour', mult:1.0, d:'1.0×' },
  { key:'timer',  label:'Timer',  mult:1.2, d:'1.2×' },
  { key:'photo',  label:'Photo',  mult:1.3, d:'1.3×' },
  { key:'sync',   label:'Sync',   mult:1.5, d:'1.5×' },
];

// ── State ─────────────────────────────────────────────────────
let curStat   = 'INT';
let logStat   = 'INT';
let logTier   = 'timer';
let logMin    = 45;

// ── Clock & greeting ──────────────────────────────────────────
function tick() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const timeEl = document.getElementById('sbTime');
  const greetEl = document.getElementById('tbGreet');
  if (timeEl) {
    timeEl.textContent = (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m;
  }
  if (greetEl) {
    greetEl.textContent = h < 12 ? 'good morning' : h < 18 ? 'good afternoon' : 'good evening';
  }
}

// ── Navigation ────────────────────────────────────────────────
function nav(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.bn-item').forEach(b =>
    b.classList.toggle('active', b.dataset.screen === id)
  );
  const screen = document.getElementById('screen-' + id);
  if (screen) screen.classList.add('active');
  const content = document.getElementById('content');
  if (content) content.scrollTop = 0;

  if (id === 'stat')        renderSD(curStat);
  if (id === 'log')         renderLog();
  if (id === 'leaderboard') renderLB();
}

// ── Dashboard ─────────────────────────────────────────────────
function renderDash() {
  // Quick log pills
  const pillsEl = document.getElementById('quickPills');
  if (pillsEl) {
    pillsEl.innerHTML = Object.entries(SM).map(([c, m]) =>
      `<div class="ql-pill" style="border-color:${m.col};color:${m.col};background:${m.bg}"
            onclick="logStat='${c}';nav('log')">
        <span class="ql-glyph">${m.g}</span>${c}
      </div>`
    ).join('');
  }

  // Stats grid
  const statsEl = document.getElementById('statsGrid');
  if (statsEl) {
    statsEl.innerHTML = Object.entries(STATS).map(([c, s]) => {
      const m = SM[c];
      return `<div class="stat-row" style="border-left-color:${m.col}"
                   onclick="curStat='${c}';nav('stat')">
        <div class="s-ic" style="background:${m.dim}">
          <span class="s-glyph" style="color:${m.col}">${m.g}</span>
        </div>
        <div class="s-inf">
          <div class="s-name-row">
            <span class="s-name">${m.label}</span>
            <span class="s-lvl">Lv.${s.lvl}</span>
          </div>
          <div class="xb-track">
            <div class="xb-fill" style="width:${s.pct*100}%;background:${m.col}"></div>
          </div>
        </div>
        <span class="s-grade" style="color:${m.col}">${s.grade}</span>
      </div>`;
    }).join('');
  }

  // Quest preview
  const done = QUESTS.filter(q => q.done).length;
  const countEl = document.getElementById('qCount');
  if (countEl) countEl.textContent = done + ' / ' + QUESTS.length;

  const listEl = document.getElementById('qList');
  if (listEl) {
    listEl.innerHTML = QUESTS.map(q => {
      const m = SM[q.stat];
      return `<div class="qrow">
        <div class="qrow-check ${q.done ? 'done' : ''}"
             style="${q.done
               ? 'background:' + m.col + ';border-color:' + m.col
               : 'border-color:' + m.col}">
          ${q.done ? '<span class="qrow-tick">✓</span>' : ''}
        </div>
        <span class="qrow-label ${q.done ? 'done' : ''}">${q.label}</span>
        <span class="spill" style="background:${m.dim};color:${m.col}">${q.stat}</span>
        <span class="qrow-xp" style="color:${q.done ? 'var(--t3)' : m.col}">+${q.xp}</span>
      </div>`;
    }).join('');
  }
}

// ── Stat Detail ───────────────────────────────────────────────
function renderSD(code) {
  const m = SM[code];
  const s = STATS[code];

  const backBtn = document.getElementById('sdBack');
  if (backBtn) backBtn.style.color = m.col;

  const tint = document.getElementById('sdTint');
  if (tint) tint.style.background = m.col;

  const wm = document.getElementById('sdWm');
  if (wm) { wm.textContent = s.grade; wm.style.color = m.col; }

  const ic = document.getElementById('sdIc');
  if (ic) {
    ic.innerHTML = `<span class="sdh-glyph" style="color:${m.col}">${m.g}</span>`;
    ic.style.background = m.dim;
  }

  const title = document.getElementById('sdTitle');
  if (title) title.textContent = m.label;

  const xpb = document.getElementById('sdXpB');
  if (xpb) xpb.textContent = s.xp.toLocaleString();

  const xps = document.getElementById('sdXpS');
  if (xps) xps.textContent = 'XP · Grade ' + s.grade;

  const xpf = document.getElementById('sdXpF');
  if (xpf) xpf.style.cssText = `width:${s.pct*100}%;background:${m.col};height:5px`;

  const pct = document.getElementById('sdPct');
  if (pct) { pct.textContent = Math.round(s.pct*100) + '%'; pct.style.color = m.col; }

  const actGrid = document.getElementById('actGrid');
  if (actGrid) {
    actGrid.innerHTML = m.acts.map((act, i) =>
      `<div class="act-row ${i === 0 ? 'feat' : ''}"
            style="${i === 0 ? 'border-left-color:' + m.col : ''}"
            onclick="logStat='${code}';nav('log')">
        <div class="act-ic" style="background:${m.dim}">
          <span class="act-g" style="color:${m.col}">${m.g}</span>
        </div>
        <div style="flex:1">
          <div class="act-name ${i > 0 ? 'dim' : ''}">${act}</div>
          <div class="act-verify">Timer</div>
        </div>
        <span class="act-xp" style="color:${m.col}">${XP_RANGES[i]}</span>
        <div class="act-plus" style="background:${m.dim};color:${m.col}">+</div>
      </div>`
    ).join('');
  }

  document.querySelectorAll('#sessList .sess-xp').forEach(el => el.style.color = m.col);
}

// ── Log Activity ──────────────────────────────────────────────
function renderLog() {
  const m = SM[logStat];

  const back = document.getElementById('lgBack');
  if (back) back.style.color = m.col;

  const actIn = document.getElementById('actIn');
  if (actIn) actIn.style.borderBottomColor = m.col;

  const cta = document.getElementById('lgCta');
  if (cta) cta.style.background = m.col;

  sliderTrack();
  renderLgTabs();
  renderTiers();
  updateXP();
}

function renderLgTabs() {
  const el = document.getElementById('lgTabs');
  if (!el) return;
  el.innerHTML = Object.entries(SM).map(([c, m]) =>
    `<div class="stab ${c === logStat ? 'active' : ''}"
          style="${c === logStat ? 'background:' + m.dim + ';border-color:' + m.col : ''}"
          onclick="logStat='${c}';renderLog()">
      <span class="stab-g" style="color:${c === logStat ? m.col : 'var(--t3)'}">${m.g}</span>
      <span class="stab-c" style="color:${c === logStat ? m.col : 'var(--t3)'}">${c}</span>
    </div>`
  ).join('');
}

function renderTiers() {
  const el = document.getElementById('tRow');
  if (!el) return;
  const m = SM[logStat];
  el.innerHTML = TIERS.map(t =>
    `<div class="tier-btn ${t.key === logTier ? 'active' : ''}"
          style="${t.key === logTier ? 'background:' + m.dim + ';border-color:' + m.col : ''}"
          onclick="logTier='${t.key}';renderTiers();updateXP()">
      <span class="tier-mult"  style="color:${t.key === logTier ? m.col : 'var(--t3)'}">${t.d}</span>
      <span class="tier-label" style="color:${t.key === logTier ? m.col : 'var(--t3)'}">${t.label}</span>
    </div>`
  ).join('');
}

function updateXP() {
  const mult = TIERS.find(t => t.key === logTier).mult;
  const xp   = Math.round(logMin * 3.2 * mult * 1.1 * 1.05);
  const numEl = document.getElementById('xpNum');
  const brkEl = document.getElementById('xpBrk');
  if (numEl) numEl.textContent = '+' + xp;
  if (brkEl) brkEl.textContent = Math.round(logMin * 3.2) + ' × ' + mult + '× ' + logTier;
}

function sliderTrack() {
  const slider = document.getElementById('durS');
  if (!slider) return;
  const pct = (logMin - 5) / 115 * 100;
  const col = SM[logStat].col;
  slider.style.background =
    `linear-gradient(to right, ${col} 0%, ${col} ${pct}%, var(--s3) ${pct}%, var(--s3) 100%)`;
}

// ── Quests ────────────────────────────────────────────────────
function renderQuests() {
  const dateEl = document.getElementById('qDate');
  if (dateEl) {
    const d = new Date();
    dateEl.textContent = d.toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
  }

  const done = QUESTS.filter(q => q.done).length;

  const cardsEl = document.getElementById('qCards');
  if (cardsEl) {
    cardsEl.innerHTML = QUESTS.map(q => {
      const m = SM[q.stat];
      const isActive = !q.done;
      return `<div class="qcard"
                   style="${isActive ? 'border-color:' + m.col : ''}"
                   onclick="${isActive ? "logStat='" + q.stat + "';nav('log')" : ''}">
        <div class="qa" style="background:${q.done ? 'var(--t3)' : m.col}"></div>
        <div class="qb">
          <div class="qt">
            <span class="spill" style="background:${m.dim};color:${m.col}">${q.stat}</span>
            ${q.done ? `<span class="db" style="color:${m.col}">✓ COMPLETE</span>` : ''}
          </div>
          <div class="ql ${q.done ? 'dim' : ''}">${q.label}</div>
          <div class="qv">${q.verify}</div>
          ${isActive ? `<div class="qcta" style="color:${m.col}">→ LOG NOW</div>` : ''}
        </div>
        <div class="qxpc" style="color:${q.done ? 'var(--t3)' : m.col}">+${q.xp}</div>
      </div>`;
    }).join('');
  }

  const all = done === QUESTS.length;
  const clmEl   = document.getElementById('clm');
  const clmTEl  = document.getElementById('clmT');
  const clmMEl  = document.getElementById('clmM');
  if (clmEl)  clmEl.style.opacity  = all ? '1' : '0.5';
  if (clmTEl) clmTEl.textContent   = all ? 'All quests complete' : (QUESTS.length - done) + ' remaining';
  if (clmMEl) {
    clmMEl.textContent  = all ? 'Claim +200 Bonus XP' : done + ' / ' + QUESTS.length + ' done';
    clmMEl.style.color  = all ? 'var(--sage)' : 'var(--t2)';
  }
}

// ── Profile ───────────────────────────────────────────────────
function renderProfile() {
  _renderSpider();
  _renderGrades();
  _renderTitles();
}

function _renderSpider() {
  const svg = document.getElementById('spSvg');
  if (!svg) return;

  const CX = 118, CY = 118, R = 80;
  const codes = ['STR','END','INT','VIT','WLT'];
  const vals  = [0.55, 0.72, 0.88, 0.38, 0.55];
  const ghost = vals.map(v => Math.max(0.08, v - 0.15));

  function pt(v, i) {
    const a = Math.PI * 2 * i / 5 - Math.PI / 2;
    return [CX + Math.cos(a) * R * v, CY + Math.sin(a) * R * v];
  }
  function poly(vs)   { return vs.map((_, i) => pt(vs[i], i).join(',')).join(' '); }
  function ring(r)    { return codes.map((_, i) => pt(r, i).join(',')).join(' '); }

  let o = '';

  // Grid rings
  [0.25, 0.5, 0.75, 1].forEach(r => {
    o += `<polygon points="${ring(r)}" fill="none"
            stroke="${r === 1 ? 'var(--border)' : 'var(--div)'}"
            stroke-width="1"/>`;
  });

  // Axes
  codes.forEach((_, i) => {
    const [x, y] = pt(1, i);
    o += `<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}"
            stroke="var(--div)" stroke-width="1"/>`;
  });

  // Ghost polygon (30d ago)
  o += `<polygon points="${poly(ghost)}"
          fill="var(--s3)" fill-opacity="0.6"
          stroke="var(--border)" stroke-width="1"/>`;

  // Player polygon
  o += `<polygon points="${poly(vals)}"
          fill="var(--sage-bg)" fill-opacity="0.7"
          stroke="var(--sage)" stroke-width="1.5"/>`;

  // Vertex dots
  vals.forEach((v, i) => {
    const [x, y] = pt(v, i);
    o += `<circle cx="${x}" cy="${y}" r="4"
            fill="${SM[codes[i]].col}" stroke="var(--bg)" stroke-width="2"/>`;
  });

  // Labels
  codes.forEach((c, i) => {
    const [x, y] = pt(1.26, i);
    o += `<text x="${x}" y="${y + 4}" text-anchor="middle"
            font-size="9" font-weight="700"
            font-family="Share Tech Mono, monospace"
            fill="${SM[c].col}">${c}</text>`;
  });

  svg.innerHTML = o;
}

function _renderGrades() {
  const el = document.getElementById('gradeStrip');
  if (!el) return;
  el.innerHTML = Object.entries(STATS).map(([c, s]) => {
    const m = SM[c];
    return `<div class="gcol">
      <div class="gb" style="background:${m.col}"></div>
      <span class="glb" style="color:${m.col}">${s.grade}</span>
      <span class="lbl">${c}</span>
    </div>`;
  }).join('');
}

function _renderTitles() {
  const el = document.getElementById('titlesEl');
  if (!el) return;
  el.innerHTML = TITLES.map(t => {
    const sc = t.stat ? SM[t.stat].col : 'var(--t3)';
    return `<div class="tr">
      <div class="tic"
           style="background:${t.u ? 'var(--sage-bg)' : 'var(--s2)'};
                  border:1px solid ${t.u ? 'var(--sage-dim)' : 'var(--border)'};
                  color:${t.u ? 'var(--sage)' : 'var(--t3)'}">
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
      ${!t.u  ? '<span class="lbl" style="color:var(--t4)">???</span>' : ''}
    </div>`;
  }).join('');
}

// ── Leaderboard ───────────────────────────────────────────────
function lbTab(el) {
  document.querySelectorAll('.tabbtn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function renderLB() {
  const medalCols = ['#9A7B2E', '#7A8A72', '#A0724A'];
  const top3  = LEADERBOARD.slice(0, 3);
  const rest  = LEADERBOARD.slice(3);
  const order = [top3[1], top3[0], top3[2]];
  const heights = [90, 130, 72];

  const podEl = document.getElementById('podium');
  if (podEl) {
    podEl.innerHTML = order.map((e, idx) => {
      const pRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
      const col   = medalCols[pRank - 1];
      const h     = heights[idx];
      return `<div class="pc ${idx === 1 ? 'ctr' : ''}">
        <div class="pac" style="background:${col}"></div>
        <div class="pcard" style="height:${h + 52}px">
          <div class="pav2" style="border-color:${col};color:${col}">${e.name[0]}</div>
          <div class="prk" style="color:${col}">#${pRank}</div>
          <div class="pnm">${e.name}</div>
          <div class="plv">Lv.${e.lvl}</div>
          <div class="pgr" style="color:${col}">${e.grade}</div>
        </div>
      </div>`;
    }).join('');
  }

  const rowsEl = document.getElementById('lbRows');
  if (rowsEl) {
    rowsEl.innerHTML = rest.map(e =>
      `<div class="lbr ${e.me ? 'me' : ''}">
        ${e.me ? '<div class="mebar"></div>' : ''}
        <span class="lbrk" style="${e.me ? 'color:var(--sage);font-weight:700' : ''}">#${e.rank}</span>
        <div class="lbav" style="${e.me ? 'border-color:var(--sage-dim);color:var(--sage);background:var(--sage-bg)' : ''}">${e.name[0]}</div>
        <div class="lbi">
          <div class="lbn" style="${e.me ? 'color:var(--sage-d);font-weight:700' : ''}">${e.name}${e.me ? ' <span style="font-size:11px;font-weight:400;color:var(--sage-l)">(You)</span>' : ''}</div>
          <span class="lbl">overall level</span>
        </div>
        <div class="lbrt">
          <div class="lbg" style="${e.me ? 'color:var(--sage)' : ''}">${e.grade}</div>
          <span class="lbl">Lv.${e.lvl}</span>
        </div>
      </div>`
    ).join('');
  }
}

// ── Slider event ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('durS');
  if (slider) {
    slider.addEventListener('input', function () {
      logMin = +this.value;
      const durN = document.getElementById('durN');
      if (durN) durN.textContent = logMin;
      sliderTrack();
      updateXP();
    });
  }

  // Init clock
  tick();
  setInterval(tick, 30000);

  // Init all renders
  renderDash();
  renderQuests();
  renderProfile();
  renderLB();
});

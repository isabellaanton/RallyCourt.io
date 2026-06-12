// ============================================================
//  Rally.io — UI Controller
//  Depende de: players.js, game.js, court.js
// ============================================================

let engine              = null;
let playerName          = '';
let selectedPlayerCfg   = null;
let selectedOpponentCfg = null;
let selectedSurface     = 'hard';
let gamePaused          = false;

// ─── THEME ────────────────────────────────────────────────────
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = dark ? 'Claro' : 'Escuro';
  localStorage.setItem('tennisRPG_theme', dark ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!document.body.classList.contains('dark'));
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('tennisRPG_theme');
  applyTheme(savedTheme === 'dark');

  document.getElementById('btn-theme')?.addEventListener('click', toggleTheme);

  document.getElementById('btn-pause')?.addEventListener('click', () => {
    gamePaused = true;
    showModal('modal-pause');
  });
  document.getElementById('btn-resume')?.addEventListener('click', () => {
    gamePaused = false;
    hideModal('modal-pause');
  });
  document.getElementById('btn-new-game')?.addEventListener('click', () => {
    MatchEngine.clearSave();
    gamePaused = false;
    hideModal('modal-pause');
    skipToPlayerSelect();
  });
  document.getElementById('btn-change-name')?.addEventListener('click', () => {
    hideModal('modal-pause');
    showModal('modal-register');
  });

  // Tutorial
  document.getElementById('btn-tutorial')?.addEventListener('click', () => {
    showModal('modal-tutorial');
  });
  document.getElementById('btn-close-tutorial')?.addEventListener('click', () => {
    hideModal('modal-tutorial');
  });

  // Restore save
  const saved = MatchEngine.load();
  if (saved && !saved.matchOver) {
    const savedName = localStorage.getItem('tennisRPG_playerName') || '';
    if (savedName) {
      playerName = savedName;
      engine     = saved;
      updateAIThinkingLabel();
      setSurfaceTheme(saved.surfaceId);
      hideModal('modal-register');
      hideModal('modal-start');
      hideModal('modal-select-opponent');
      updateUI();
      redrawCourt();
      addLog(`Bem-vindo de volta, ${playerName}! Partida restaurada.`, 'system');
      return;
    }
  }

  const storedName = localStorage.getItem('tennisRPG_playerName');
  if (storedName) {
    playerName = storedName;
    skipToPlayerSelect();
  } else {
    showModal('modal-register');
  }
});

function skipToPlayerSelect() {
  hideModal('modal-register');
  renderPlayerSelectGrid();
  showModal('modal-start');
}

// ─── MODAIS ───────────────────────────────────────────────────
function showModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hideModal(id) { document.getElementById(id)?.classList.add('hidden'); }

// ─── REGISTRO ─────────────────────────────────────────────────
document.getElementById('btn-confirm-name')?.addEventListener('click', confirmName);
document.getElementById('input-player-name')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmName();
});

function confirmName() {
  const input = document.getElementById('input-player-name');
  const val   = (input?.value || '').trim();
  if (!val) { input?.classList.add('border-red-500'); return; }
  playerName = val;
  localStorage.setItem('tennisRPG_playerName', playerName);
  setText('registered-name-display', playerName);
  hideModal('modal-register');
  renderPlayerSelectGrid();
  showModal('modal-start');
}

// ─── PLAYER GRID ──────────────────────────────────────────────
function renderPlayerSelectGrid() {
  const gridM = document.getElementById('player-grid-male');
  const gridF = document.getElementById('player-grid-female');
  if (!gridM || !gridF) return;
  gridM.innerHTML = '';
  gridF.innerHTML = '';
  MALE_PLAYERS.forEach(p   => gridM.appendChild(buildPlayerCard(p, 'player')));
  FEMALE_PLAYERS.forEach(p => gridF.appendChild(buildPlayerCard(p, 'player')));
}

function buildPlayerCard(p, mode) {
  const div = document.createElement('div');
  div.className   = 'player-select-card';
  div.dataset.id  = p.id;
  div.innerHTML   = `
    <div class="text-base">${p.country}</div>
    <div class="player-card-name">${p.name}</div>
    <div class="player-card-style">${p.style}</div>
    <div class="player-card-attrs">
      <span title="Saque">SV ${p.serve}</span>
      <span title="Velocidade">VL ${p.speed}</span>
      <span title="Forehand">FH ${p.forehand}</span>
      <span title="Mental">MT ${p.mental}</span>
    </div>`;
  div.addEventListener('click', () => {
    if (mode === 'player') selectHumanPlayer(p, div);
    else                   selectOpponent(p, div);
  });
  return div;
}

function selectHumanPlayer(cfg, el) {
  document.querySelectorAll('#modal-start .player-select-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedPlayerCfg = { ...cfg, isHuman: true };
  document.getElementById('btn-next-opponent')?.classList.remove('opacity-30','pointer-events-none');
}

document.getElementById('btn-next-opponent')?.addEventListener('click', () => {
  if (!selectedPlayerCfg) return;
  hideModal('modal-start');
  renderOpponentGrid();
  showModal('modal-select-opponent');
});

// ─── OPPONENT GRID ────────────────────────────────────────────
function renderOpponentGrid() {
  const gridM = document.getElementById('opp-grid-male');
  const gridF = document.getElementById('opp-grid-female');
  if (!gridM || !gridF) return;
  gridM.innerHTML = '';
  gridF.innerHTML = '';
  MALE_PLAYERS.forEach(p => {
    if (p.id !== selectedPlayerCfg.id) gridM.appendChild(buildPlayerCard(p, 'opponent'));
  });
  FEMALE_PLAYERS.forEach(p => {
    if (p.id !== selectedPlayerCfg.id) gridF.appendChild(buildPlayerCard(p, 'opponent'));
  });
}

function selectOpponent(cfg, el) {
  document.querySelectorAll('#modal-select-opponent .player-select-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedOpponentCfg = { ...cfg, isHuman: false };
  document.getElementById('btn-start-match')?.classList.remove('opacity-30','pointer-events-none');
}

document.getElementById('btn-back-to-players')?.addEventListener('click', () => {
  hideModal('modal-select-opponent');
  showModal('modal-start');
});

// ─── SURFACE ─────────────────────────────────────────────────
document.querySelectorAll('.surface-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedSurface = btn.dataset.surface;
    document.querySelectorAll('.surface-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ─── START MATCH ─────────────────────────────────────────────
document.getElementById('btn-start-match')?.addEventListener('click', () => {
  if (!selectedPlayerCfg || !selectedOpponentCfg) return;
  MatchEngine.clearSave();

  const p1 = new Player({ ...selectedPlayerCfg });
  const p2 = new Player({ ...selectedOpponentCfg });
  p1.aiWeights = selectedPlayerCfg.aiWeights || {};
  p2.aiWeights = selectedOpponentCfg.aiWeights || {};
  p1.playstyle = selectedPlayerCfg.playstyle || 'all_court';
  p2.playstyle = selectedOpponentCfg.playstyle || 'all_court';

  engine = new MatchEngine(p1, p2, selectedSurface);
  engine.save();
  gamePaused = false;

  setSurfaceTheme(selectedSurface);
  updateAIThinkingLabel();
  hideModal('modal-select-opponent');
  redrawCourt();
  updateUI();
  addLog(`Partida iniciada — ${SURFACES[selectedSurface].name}`, 'system');
  addLog(`${playerName} (${p1.name}) vs ${p2.name}`, 'system');
  addLog(`${engine.server.name} vai sacar primeiro.`, 'system');

  if (!engine.isHumanTurn) triggerAI();
});

function updateAIThinkingLabel() {
  if (!engine) return;
  const aiName = engine.players.find(p => !p.isHuman)?.name || 'Oponente';
  setText('ai-thinking-label', `${aiName} calculando...`);
}

// ─── SURFACE THEME ───────────────────────────────────────────
function setSurfaceTheme(surfaceId) {
  document.body.classList.remove('surface-clay','surface-grass','surface-hard');
  document.body.classList.add(`surface-${surfaceId}`);
  redrawCourt();
}

// ─── UI UPDATE ───────────────────────────────────────────────
function updateUI() {
  if (!engine) return;
  renderScoreboard();
  renderBars();
  renderPhaseBadge();
  renderShotPanel();
  updateTokenPositions();
  renderFatigueWarning();
}

// ─── SCOREBOARD ──────────────────────────────────────────────
function renderScoreboard() {
  const sc         = engine.score;
  const [p1, p2]   = engine.players;
  const [d1, d2]   = sc.pointDisplay;

  setText('p1-name',  p1.name);
  setText('p2-name',  p2.name);
  setText('p1-flag',  p1.country);
  setText('p2-flag',  p2.country);
  setText('p1-label', playerName || p1.name);

  const s1 = document.getElementById('serve-dot-1');
  const s2 = document.getElementById('serve-dot-2');
  if (s1) s1.style.visibility = sc.serving === 0 ? 'visible' : 'hidden';
  if (s2) s2.style.visibility = sc.serving === 1 ? 'visible' : 'hidden';

  renderSets(sc.sets);
  setText('p1-games',  sc.games[0]);
  setText('p2-games',  sc.games[1]);
  setText('p1-points', d1);
  setText('p2-points', d2);

  const tb = document.getElementById('tiebreak-label');
  if (tb) tb.classList.toggle('hidden', !sc.inTiebreak);
}

function renderSets(sets) {
  ['p1-sets','p2-sets'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = sets.map(s => {
      const mine = i === 0 ? s.p1 : s.p2;
      const opp  = i === 0 ? s.p2 : s.p1;
      return `<span class="set-score ${mine > opp ? 'text-yellow-400' : ''}">${mine}</span>`;
    }).join('');
  });
}

// ─── BARS ─────────────────────────────────────────────────────
function renderBars() {
  const [p1, p2] = engine.players;

  setBar('p1-energy', p1.energy);
  setBar('p1-conf',   p1.confidence);
  setBar('p2-energy', p2.energy);
  setBar('p2-conf',   p2.confidence);

  setText('p1-energy-val', Math.round(p1.energy));
  setText('p1-conf-val',   Math.round(p1.confidence));
  setText('p2-energy-val', Math.round(p2.energy));
  setText('p2-conf-val',   Math.round(p2.confidence));

  // Color energy bar based on fatigue level
  updateEnergyBarColor('p1-energy', p1.fatigueLevel);
  updateEnergyBarColor('p2-energy', p2.fatigueLevel);
  updateEnergyValColor('p1-energy-val', p1.fatigueLevel);
  updateEnergyValColor('p2-energy-val', p2.fatigueLevel);
}

function updateEnergyBarColor(id, level) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('bar-energy-warn','bar-energy-danger','bar-energy-critical');
  if (level === 'warn')     el.classList.add('bar-energy-warn');
  if (level === 'danger')   el.classList.add('bar-energy-danger');
  if (level === 'critical') el.classList.add('bar-energy-critical');
}

function updateEnergyValColor(id, level) {
  const el = document.getElementById(id);
  if (!el) return;
  const colors = { ok: '#16a34a', warn: '#ca8a04', danger: '#ea580c', critical: '#dc2626' };
  el.style.color = colors[level] || colors.ok;
}

function renderFatigueWarning() {
  if (!engine) return;
  const badge = document.getElementById('fatigue-warning');
  if (!badge) return;
  const [p1, p2] = engine.players;
  const humanPlayer = engine.players.find(p => p.isHuman);
  if (humanPlayer && (humanPlayer.fatigueLevel === 'danger' || humanPlayer.fatigueLevel === 'critical')) {
    badge.classList.remove('hidden');
    badge.textContent = humanPlayer.fatigueLevel === 'critical' ? 'EXAUSTO' : 'FADIGA';
    badge.className   = 'text-xs font-mono rounded px-2 py-0.5 font-bold fatigue-badge' +
                        (humanPlayer.fatigueLevel === 'critical' ? ' fatigue-critical' : ' fatigue-danger');
  } else {
    badge.classList.add('hidden');
  }
}

function setBar(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.round(Math.max(0, Math.min(100, pct))) + '%';
}
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── PHASE BADGE ─────────────────────────────────────────────
function renderPhaseBadge() {
  const badge = document.getElementById('phase-badge');
  if (!badge || !engine) return;
  const map = {
    serve:      ['SAQUE',   'phase-serve'],
    rally:      ['RALI',    'phase-rally'],
    net:        ['REDE',    'phase-net'],
    point_end:  ['PONTO',   'phase-end'],
    match_over: ['FIM',     'phase-end'],
  };
  const [text, cls] = map[engine.phase] || ['–','phase-rally'];
  badge.textContent = text;
  badge.className   = 'font-display text-xs px-3 py-1 rounded-full border transition-all ' + cls;
}

// ─── SHOT PANEL ──────────────────────────────────────────────
function renderShotPanel() {
  const panel  = document.getElementById('shot-cards');
  const cont   = document.getElementById('btn-continue');
  const aiBox  = document.getElementById('ai-thinking-box');
  const hint   = document.getElementById('shot-hint');
  if (!panel) return;
  panel.innerHTML = '';
  if (hint) hint.classList.add('hidden');

  if (engine.phase === 'point_end') {
    cont?.classList.remove('hidden');
    aiBox?.classList.add('hidden');
    panel.innerHTML = '<p class="text-sm text-center py-3" style="color:var(--text-muted)">Ponto encerrado.</p>';
    return;
  }
  cont?.classList.add('hidden');

  if (engine.matchOver) { showMatchOver(); return; }

  if (!engine.isHumanTurn) {
    aiBox?.classList.remove('hidden');
    return;
  }
  aiBox?.classList.add('hidden');

  // Show fatigue hint
  const humanPlayer = engine.players.find(p => p.isHuman);
  if (humanPlayer && hint) {
    const desc = humanPlayer.fatigueDescription();
    if (desc) {
      hint.textContent = desc;
      hint.classList.remove('hidden');
      hint.className = `shot-hint ${humanPlayer.fatigueLevel === 'critical' ? 'hint-critical' : 'hint-warn'}`;
    }
  }

  engine.availableShots().forEach(shot => panel.appendChild(buildShotCard(shot)));
}

function buildShotCard(shot) {
  const div  = document.createElement('div');
  const pct  = shot.successChance;
  const pCls = pct >= 70 ? 'success-high' : pct >= 45 ? 'success-mid' : 'success-low';
  div.className = 'shot-card p-3 flex flex-col gap-1.5' +
                  (shot.canAfford ? '' : ' disabled') +
                  (shot.fatigueWarning && shot.canAfford ? ' shot-fatigue' : '');
  div.innerHTML = `
    <div class="flex items-start justify-between">
      <span class="shot-icon-text">${shot.icon}</span>
      <span class="success-pill ${pCls}">${pct}%</span>
    </div>
    <div class="shot-name">${shot.name}</div>
    <div class="shot-desc">${shot.description}</div>
    <div class="shot-cost mt-auto pt-1">ST <span>${shot.energyCost}</span></div>`;
  if (shot.canAfford) div.addEventListener('click', () => handlePlayerShot(shot.id));
  return div;
}

// ─── CONTINUE ────────────────────────────────────────────────
document.getElementById('btn-continue')?.addEventListener('click', () => {
  if (!engine || engine.phase !== 'point_end') return;
  engine.phase = 'serve';
  engine.save();
  updateUI();
  addLog('— Novo ponto —', 'separator');
  if (!engine.isHumanTurn) triggerAI();
});

// ─── HUMAN SHOT ──────────────────────────────────────────────
function handlePlayerShot(shotId) {
  if (!engine || !engine.isHumanTurn || gamePaused) return;
  const result = engine.executeShot(shotId);
  if (!result) return;

  spawnHitEffect('token-p1');
  animateBallToken(result.outcome, result.attacker);

  result.lines.forEach((line, i) => {
    setTimeout(() => addLog(line, classifyLine(line)), i * 150);
  });
  setTimeout(() => {
    updateUI();
    if (!engine.matchOver && !engine.isHumanTurn && engine.phase !== 'point_end') triggerAI();
  }, result.lines.length * 150 + 120);
}

// ─── AI ──────────────────────────────────────────────────────
function triggerAI(delay = 800) {
  if (gamePaused) { setTimeout(() => triggerAI(delay), 500); return; }
  renderShotPanel();
  setTimeout(() => {
    if (!engine || engine.isHumanTurn || engine.matchOver || engine.phase === 'point_end' || gamePaused) return;
    const shotId = aiPickShotStyled(engine);
    const result = engine.executeShot(shotId);
    if (!result) return;

    spawnHitEffect('token-p2');
    animateBallToken(result.outcome, result.attacker);

    result.lines.forEach((line, i) => {
      setTimeout(() => addLog(line, classifyLine(line)), i * 150);
    });
    setTimeout(() => {
      updateUI();
      if (!engine.matchOver && !engine.isHumanTurn && engine.phase !== 'point_end') triggerAI(550);
    }, result.lines.length * 150 + 120);
  }, delay);
}

function aiPickShotStyled(eng) {
  const actor  = eng.currentActor;
  const shots  = eng.availableShots().filter(s => s.canAfford);
  if (!shots.length) return eng.availableShots()[0].id;

  // Exhausted AI plays safe
  if (actor.energy < 25) {
    const safe = shots.find(s => s.baseRisk < 12);
    if (safe) return safe.id;
  }
  const weights = actor.aiWeights || {};
  const scored  = shots.map(s => ({
    id: s.id,
    score: Math.pow(s.successChance, 1.4) * (weights[s.id] || 1.0),
  }));
  const total = scored.reduce((a, b) => a + b.score, 0);
  let r = Math.random() * total;
  for (const s of scored) { r -= s.score; if (r <= 0) return s.id; }
  return scored[scored.length - 1].id;
}

// ─── LOG ─────────────────────────────────────────────────────
function addLog(text, type = 'normal') {
  const log = document.getElementById('match-log');
  if (!log) return;
  const line = document.createElement('div');
  line.className   = 'log-line log-' + type;
  line.textContent = text;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 120) log.removeChild(log.firstChild);
}

function classifyLine(text) {
  if (/ACE|PARTIDA|VENCE/i.test(text))      return 'ace';
  if (/WINNER|grande estilo/i.test(text))   return 'winner';
  if (/REDE|fora|erro|exausto|fadiga/i.test(text)) return 'error';
  if (/Set|Game|save|Bem-vindo|iniciada|sacar|restaurada|recupera/i.test(text)) return 'system';
  return 'normal';
}

// ─── MATCH OVER ──────────────────────────────────────────────
function showMatchOver() {
  const overlay = document.getElementById('match-over-screen');
  if (!overlay || overlay._shown) return;
  overlay._shown = true;
  overlay.classList.remove('hidden');

  const [p1, p2]    = engine.players;
  const winner      = engine.winner;
  const sc          = engine.score;
  const winnerHuman = winner?.isHuman;

  setText('over-winner-name', winnerHuman ? `${playerName} VENCE!` : `${winner?.name} VENCE!`);
  setText('over-score', sc.sets.map(s => `${s.p1}–${s.p2}`).join('  '));
  setText('over-p1-name', playerName || p1.name);
  setText('over-p2-name', p2.name);
  renderFinalStats(p1, p2);

  document.getElementById('btn-play-again')?.addEventListener('click', () => {
    MatchEngine.clearSave();
    overlay._shown = false;
    overlay.classList.add('hidden');
    renderPlayerSelectGrid();
    showModal('modal-start');
  });
}

function renderFinalStats(p1, p2) {
  const rows = [
    ['Aces',           p1.stats.aces,           p2.stats.aces],
    ['Winners',        p1.stats.winners,         p2.stats.winners],
    ['Erros n/forç.',  p1.stats.unforcedErrors,  p2.stats.unforcedErrors],
    ['Erros forç.',    p1.stats.forcedErrors,     p2.stats.forcedErrors],
  ];
  const tbody = document.getElementById('stats-body');
  if (!tbody) return;
  tbody.innerHTML = rows.map(([label, v1, v2]) => `
    <div class="stat-row">
      <span class="stat-val text-yellow-400 text-right">${v1}</span>
      <span class="stat-label">${label}</span>
      <span class="stat-val text-blue-400">${v2}</span>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
//  COURT RENDERING — via CourtRenderer (court.js)
// ═══════════════════════════════════════════════════════════════

const COURT_CSS_W = 160;
const COURT_CSS_H = 260;

function redrawCourt() {
  const canvas = document.getElementById('court-3d-canvas');
  if (!canvas || typeof CourtRenderer === 'undefined') return;
  const surfId = (engine?.surfaceId) || selectedSurface || 'hard';
  const dark   = document.body.classList.contains('dark');
  CourtRenderer.draw(canvas, surfId, dark);
  updateTokenPositions();
}

// Token state in normalized court coords (0..1)
let tokenState = {
  p1:   { x: 0.5, z: 0.15 }, // z=0 is opp side, z=1 is near (you)
  p2:   { x: 0.5, z: 0.85 },
  ball: { x: 0.5, z: 0.5  },
};

function updateTokenPositions() {
  if (typeof CourtRenderer === 'undefined') return;

  const wrap  = document.getElementById('court-3d-wrap');
  if (!wrap) return;

  // Sync positions from engine
  if (engine) {
    const [p1, p2] = engine.players;
    tokenState.p1.z = p1.position === 'net' ? 0.40 : 0.12;
    tokenState.p2.z = p2.position === 'net' ? 0.60 : 0.88;
  }

  function applyToken(tokenId, normX, normZ, radius) {
    const tok = document.getElementById(tokenId);
    if (!tok) return;
    const px = CourtRenderer.courtToPixel(normX, normZ);
    const css = CourtRenderer.pixelToTokenCSS(px.x, px.y, wrap, radius);
    tok.style.left = css.left + 'px';
    tok.style.top  = css.top  + 'px';
  }

  applyToken('token-p1',   tokenState.p1.x,   tokenState.p1.z,   11);
  applyToken('token-p2',   tokenState.p2.x,   tokenState.p2.z,   10);
  applyToken('token-ball', tokenState.ball.x,  tokenState.ball.z,  5.5);
}

// ─── BALL ANIMATION ──────────────────────────────────────────
let ballAnimId = null;

function animateBallToken(outcome, fromPlayer) {
  if (!outcome || !engine) return;
  const [p1]  = engine.players;
  const isP1  = fromPlayer === p1;

  const fromZ = isP1 ? 0.12 : 0.88;
  let   toZ   = isP1 ? 0.88 : 0.12;
  const fromX = 0.35 + Math.random() * 0.3;
  let   toX   = 0.2  + Math.random() * 0.6;

  if (outcome === 'net') { toZ = 0.5; }
  if (outcome === 'out') { toZ = isP1 ? 0.98 : 0.02; }

  const duration = (outcome === 'ace' || outcome === 'winner') ? 280 : 450;
  const start    = performance.now();

  if (ballAnimId) cancelAnimationFrame(ballAnimId);

  const startX = fromX, startZ = fromZ;
  const endX   = toX,   endZ   = toZ;

  function step(now) {
    const t    = Math.min((now - start) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    tokenState.ball.x = startX + (endX - startX) * ease;
    tokenState.ball.z = startZ + (endZ - startZ) * ease;
    updateTokenPositions();

    if (t < 1) ballAnimId = requestAnimationFrame(step);
    else tokenState.ball = { x: endX, z: endZ };
  }
  ballAnimId = requestAnimationFrame(step);
}

// ─── HIT EFFECT ──────────────────────────────────────────────
function spawnHitEffect(tokenId) {
  const tok = document.getElementById(tokenId);
  if (!tok) return;
  const wrap = document.getElementById('court-3d-wrap');
  if (!wrap) return;
  const flash = document.createElement('div');
  flash.className = 'hit-flash';
  const r = tok.getBoundingClientRect();
  const w = wrap.getBoundingClientRect();
  flash.style.left = (r.left - w.left + r.width  / 2) + 'px';
  flash.style.top  = (r.top  - w.top  + r.height / 2) + 'px';
  wrap.appendChild(flash);
  setTimeout(() => flash.remove(), 500);
}

// Redraw on theme or resize
document.getElementById('btn-theme')?.addEventListener('click', () => {
  requestAnimationFrame(redrawCourt);
});
window.addEventListener('resize', () => { redrawCourt(); });
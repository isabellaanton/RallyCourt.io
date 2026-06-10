// ============================================================
//  Tennis RPG — UI Controller
//  Desenvolvido por Claude (Anthropic) — 2025
//  Depende de: players.js e game.js
// ============================================================

// ─── ESTADO GLOBAL ────────────────────────────────────────────
let engine = null;
let playerName = '';
let selectedPlayerCfg = null;
let selectedOpponentCfg = null;
let selectedSurface = 'hard';

// Ball animation state
let ballX = 0.5, ballY = 0.5;   // normalized 0..1 within court
let ballAnimFrame = null;

// ─── INICIALIZAÇÃO ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Verifica save existente
  const saved = MatchEngine.load();
  if (saved && !saved.matchOver) {
    const savedName = localStorage.getItem('tennisRPG_playerName') || '';
    if (savedName) {
      playerName = savedName;
      engine = saved;
      updateAIThinkingLabel();
      setSurfaceTheme(saved.surfaceId);
      hideModal('modal-register');
      hideModal('modal-start');
      hideModal('modal-select-opponent');
      updateUI();
      addLog(`💾 Bem-vindo de volta, ${playerName}! Partida restaurada.`, 'system');
      return;
    }
  }

  // Verifica se já tem nome registrado
  const storedName = localStorage.getItem('tennisRPG_playerName');
  if (storedName) {
    playerName = storedName;
    skipToPlayerSelect();
  } else {
    showModal('modal-register');
  }

  // Botões de pausa
  document.getElementById('btn-pause')?.addEventListener('click', () => showModal('modal-pause'));
  document.getElementById('btn-resume')?.addEventListener('click', () => hideModal('modal-pause'));
  document.getElementById('btn-new-game')?.addEventListener('click', () => {
    MatchEngine.clearSave();
    hideModal('modal-pause');
    skipToPlayerSelect();
  });
  document.getElementById('btn-change-name')?.addEventListener('click', () => {
    hideModal('modal-pause');
    showModal('modal-register');
  });
});

function skipToPlayerSelect() {
  hideModal('modal-register');
  renderPlayerSelectGrid();
  showModal('modal-start');
}

// ─── MODAIS ───────────────────────────────────────────────────
function showModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hideModal(id) { document.getElementById(id)?.classList.add('hidden'); }

// ─── REGISTRO DE NOME ─────────────────────────────────────────
document.getElementById('btn-confirm-name')?.addEventListener('click', confirmName);
document.getElementById('input-player-name')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmName();
});

function confirmName() {
  const input = document.getElementById('input-player-name');
  const val = (input?.value || '').trim();
  if (!val) { input?.classList.add('border-red-500'); return; }
  playerName = val;
  localStorage.setItem('tennisRPG_playerName', playerName);
  setText('registered-name-display', playerName);
  hideModal('modal-register');
  renderPlayerSelectGrid();
  showModal('modal-start');
}

// ─── SELEÇÃO DE JOGADOR (quem o USUÁRIO joga) ─────────────────
function renderPlayerSelectGrid() {
  const gridM = document.getElementById('player-grid-male');
  const gridF = document.getElementById('player-grid-female');
  if (!gridM || !gridF) return;
  gridM.innerHTML = '';
  gridF.innerHTML = '';

  MALE_PLAYERS.forEach(p => gridM.appendChild(buildPlayerCard(p, 'player')));
  FEMALE_PLAYERS.forEach(p => gridF.appendChild(buildPlayerCard(p, 'player')));
}

function buildPlayerCard(p, mode) {
  const div = document.createElement('div');
  div.className = 'player-select-card';
  div.dataset.id = p.id;
  div.innerHTML = `
    <div class="text-xl">${p.country}</div>
    <div class="player-card-name">${p.name}</div>
    <div class="player-card-style">${p.style}</div>
    <div class="player-card-attrs">
      <span title="Saque">🎯 ${p.serve}</span>
      <span title="Velocidade">⚡ ${p.speed}</span>
      <span title="Forehand">💥 ${p.forehand}</span>
      <span title="Mental">🧠 ${p.mental}</span>
    </div>
  `;
  div.addEventListener('click', () => {
    if (mode === 'player') selectHumanPlayer(p, div);
    else selectOpponent(p, div);
  });
  return div;
}

function selectHumanPlayer(cfg, el) {
  document.querySelectorAll('#modal-start .player-select-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedPlayerCfg = { ...cfg, isHuman: true };
  document.getElementById('btn-next-opponent')?.classList.remove('opacity-30', 'pointer-events-none');
}

document.getElementById('btn-next-opponent')?.addEventListener('click', () => {
  if (!selectedPlayerCfg) return;
  hideModal('modal-start');
  renderOpponentGrid();
  showModal('modal-select-opponent');
});

// ─── SELEÇÃO DE OPONENTE ──────────────────────────────────────
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
  document.getElementById('btn-start-match')?.classList.remove('opacity-30', 'pointer-events-none');
}

document.getElementById('btn-back-to-players')?.addEventListener('click', () => {
  hideModal('modal-select-opponent');
  showModal('modal-start');
});

// ─── SELEÇÃO DE SUPERFÍCIE ────────────────────────────────────
document.querySelectorAll('.surface-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedSurface = btn.dataset.surface;
    document.querySelectorAll('.surface-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ─── INICIAR PARTIDA ──────────────────────────────────────────
document.getElementById('btn-start-match')?.addEventListener('click', () => {
  if (!selectedPlayerCfg || !selectedOpponentCfg) return;
  MatchEngine.clearSave();

  // Aplica aiWeights no config
  const p1cfg = { ...selectedPlayerCfg };
  const p2cfg = { ...selectedOpponentCfg };

  const p1 = new Player(p1cfg);
  const p2 = new Player(p2cfg);

  // Transfere aiWeights para serem usados pelo motor
  p1.aiWeights = p1cfg.aiWeights || {};
  p2.aiWeights = p2cfg.aiWeights || {};
  p1.playstyle = p1cfg.playstyle || 'all_court';
  p2.playstyle = p2cfg.playstyle || 'all_court';

  engine = new MatchEngine(p1, p2, selectedSurface);
  engine.save();

  setSurfaceTheme(selectedSurface);
  updateAIThinkingLabel();

  hideModal('modal-select-opponent');
  updateUI();
  addLog(`⚡ Partida iniciada! ${SURFACES[selectedSurface].name}.`, 'system');
  addLog(`${playerName} (${p1.name}) vs ${p2.name}`, 'system');
  addLog(`🎾 ${engine.server.name} vai sacar primeiro.`, 'system');

  if (!engine.isHumanTurn) triggerAI();
});

function updateAIThinkingLabel() {
  if (!engine) return;
  const aiName = engine.players.find(p => !p.isHuman)?.name || 'IA';
  setText('ai-thinking-label', `${aiName} está calculando...`);
}

// ─── TEMA DA SUPERFÍCIE ───────────────────────────────────────
function setSurfaceTheme(surfaceId) {
  document.body.classList.remove('surface-clay', 'surface-grass', 'surface-hard');
  document.body.classList.add(`surface-${surfaceId}`);
  const courtColors = { clay: '#8B3A0F', grass: '#1a5e12', hard: '#1a5c8b' };
  const lineColors  = { clay: '#a04010', grass: '#228B22', hard: '#1e6ea8' };
  document.getElementById('court-main-fill')?.setAttribute('fill', courtColors[surfaceId] || '#1a5c8b');
  document.getElementById('court-service-box')?.setAttribute('fill', lineColors[surfaceId] || '#1e6ea8');
}

// ─── UPDATE COMPLETO DA UI ────────────────────────────────────
function updateUI() {
  if (!engine) return;
  renderScoreboard();
  renderBars();
  renderCourtPositions();
  renderPhaseBadge();
  renderShotPanel();
}

// ─── PLACAR ───────────────────────────────────────────────────
function renderScoreboard() {
  const sc = engine.score;
  const [p1, p2] = engine.players;
  const [d1, d2] = sc.pointDisplay;

  setText('p1-name', p1.name);
  setText('p2-name', p2.name);
  setText('p1-flag', p1.country);
  setText('p2-flag', p2.country);
  setText('p1-label', playerName || p1.name);

  const s1 = document.getElementById('serve-dot-1');
  const s2 = document.getElementById('serve-dot-2');
  if (s1) s1.style.visibility = sc.serving === 0 ? 'visible' : 'hidden';
  if (s2) s2.style.visibility = sc.serving === 1 ? 'visible' : 'hidden';

  renderSets(sc.sets);
  setText('p1-games', sc.games[0]);
  setText('p2-games', sc.games[1]);
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
      return `<span class="set-score ${mine > opp ? 'text-yellow-400' : 'text-slate-400'}">${mine}</span>`;
    }).join('');
  });
}

// ─── BARRAS ───────────────────────────────────────────────────
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
}

function setBar(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.round(pct) + '%';
}
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── MINI-QUADRA: POSIÇÕES E BOLINHA ─────────────────────────
// Coordenadas SVG da quadra (viewBox 0 0 200 320)
// Quadra: x=20..180, y=20..300  →  centro rede y=160
const COURT = { x1:20, x2:180, y1:20, y2:300, netY:160 };

function courtCoord(normX, normY) {
  return {
    x: COURT.x1 + normX * (COURT.x2 - COURT.x1),
    y: COURT.y1 + normY * (COURT.y2 - COURT.y1),
  };
}

function renderCourtPositions() {
  if (!engine) return;
  const [p1, p2] = engine.players;

  // P1 (humano) — lado de baixo
  const p1Y = p1.position === 'net' ? 0.62 : 0.88;
  const p1X = 0.5;
  const m1 = document.getElementById('marker-p1');
  if (m1) { m1.setAttribute('cx', courtCoord(p1X, p1Y).x); m1.setAttribute('cy', courtCoord(p1X, p1Y).y); }

  // P2 (IA) — lado de cima
  const p2Y = p2.position === 'net' ? 0.38 : 0.12;
  const p2X = 0.5;
  const m2 = document.getElementById('marker-p2');
  if (m2) { m2.setAttribute('cx', courtCoord(p2X, p2Y).x); m2.setAttribute('cy', courtCoord(p2X, p2Y).y); }
}

// Anima a bolinha de acordo com a fase e resultado do último golpe
function animateBall(outcome, fromPlayer) {
  if (!outcome) return;
  const [p1, p2] = engine?.players || [];

  // Posição de origem e destino baseado em quem bateu e o resultado
  const isP1 = fromPlayer === p1;
  const fromY = isP1 ? 0.85 : 0.15;
  const toY   = isP1 ? 0.15 : 0.85;
  const fromX = 0.4 + Math.random() * 0.2;
  let   toX   = 0.2 + Math.random() * 0.6;

  // Resultados especiais
  if (outcome === 'net')   { animateBallPath(fromX, fromY, fromX, 0.5, true);  return; }
  if (outcome === 'out')   { animateBallPath(fromX, fromY, toX, isP1 ? 0.02 : 0.98, false); return; }
  if (outcome === 'ace' || outcome === 'winner') {
    toX = 0.1 + Math.random() * 0.8;
    animateBallPath(fromX, fromY, toX, toY, false, true);
    return;
  }
  // Troca normal
  animateBallPath(fromX, fromY, toX, toY, false);
}

function animateBallPath(fx, fy, tx, ty, hitNet, fast) {
  if (ballAnimFrame) cancelAnimationFrame(ballAnimFrame);
  const duration = fast ? 280 : 480;
  const start = performance.now();
  const ballEl = document.getElementById('ball');
  if (!ballEl) return;

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease in-out

    const cx = fx + (tx - fx) * ease;
    const cy = fy + (ty - fy) * ease;

    // Arco de altura (a bola sobe no meio)
    const arc = hitNet ? 0 : (fast ? 0.06 : 0.12);
    const arcY = -arc * 4 * (ease - 0.5) * (ease - 0.5) + arc;
    const finalY = cy - arcY * 0.5;

    const coord = courtCoord(cx, finalY);
    ballEl.setAttribute('cx', coord.x);
    ballEl.setAttribute('cy', coord.y);

    // Tamanho: maior perto da câmera (y alto = perto), menor longe
    const distFactor = 0.5 + finalY * 0.7;
    const r = Math.max(3, Math.round(5 * distFactor));
    ballEl.setAttribute('r', r);

    // Opacidade reduz se saiu
    if (hitNet && ease > 0.45) ballEl.setAttribute('opacity', Math.max(0.2, 1 - (ease-0.45)*3));
    else ballEl.setAttribute('opacity', '1');

    if (t < 1) ballAnimFrame = requestAnimationFrame(step);
  }
  ballAnimFrame = requestAnimationFrame(step);
}

// ─── BADGE DE FASE ────────────────────────────────────────────
function renderPhaseBadge() {
  const badge = document.getElementById('phase-badge');
  if (!badge || !engine) return;
  const map = {
    serve:      ['SAQUE',    'phase-serve'],
    rally:      ['RALI',     'phase-rally'],
    net:        ['REDE',     'phase-net'],
    point_end:  ['PONTO ✓',  'phase-end'],
    match_over: ['FIM',      'phase-end'],
  };
  const [text, cls] = map[engine.phase] || ['–','phase-rally'];
  badge.textContent = text;
  badge.className = 'font-display text-xs px-3 py-1 rounded-full border transition-all ' + cls;
}

// ─── PAINEL DE CARTAS ─────────────────────────────────────────
function renderShotPanel() {
  const panel = document.getElementById('shot-cards');
  const cont  = document.getElementById('btn-continue');
  const aiBox = document.getElementById('ai-thinking-box');
  if (!panel) return;
  panel.innerHTML = '';

  if (engine.phase === 'point_end') {
    cont?.classList.remove('hidden');
    aiBox?.classList.add('hidden');
    panel.innerHTML = '<p class="text-slate-500 text-sm text-center py-3">Ponto encerrado.</p>';
    return;
  }
  cont?.classList.add('hidden');

  if (engine.matchOver) { showMatchOver(); return; }

  if (!engine.isHumanTurn) {
    aiBox?.classList.remove('hidden');
    return;
  }
  aiBox?.classList.add('hidden');

  engine.availableShots().forEach(shot => panel.appendChild(buildShotCard(shot)));
}

function buildShotCard(shot) {
  const div = document.createElement('div');
  div.className = 'shot-card p-3 flex flex-col gap-1.5' + (shot.canAfford ? '' : ' disabled');
  const pct = shot.successChance;
  const pctCls = pct >= 70 ? 'success-high' : pct >= 45 ? 'success-mid' : 'success-low';
  div.innerHTML = `
    <div class="flex items-start justify-between">
      <span class="shot-icon">${shot.icon}</span>
      <span class="success-pill ${pctCls}">${pct}%</span>
    </div>
    <div class="shot-name text-white">${shot.name}</div>
    <div class="shot-desc">${shot.description}</div>
    <div class="shot-cost mt-auto pt-1"><span>⚡</span><span>${shot.energyCost}</span></div>
  `;
  if (shot.canAfford) div.addEventListener('click', () => handlePlayerShot(shot.id));
  return div;
}

// ─── CONTINUAR ────────────────────────────────────────────────
document.getElementById('btn-continue')?.addEventListener('click', () => {
  if (!engine || engine.phase !== 'point_end') return;
  engine.phase = 'serve';
  engine.save();
  updateUI();
  addLog('── Novo ponto ──', 'separator');
  if (!engine.isHumanTurn) triggerAI();
});

// ─── JOGADA DO HUMANO ─────────────────────────────────────────
function handlePlayerShot(shotId) {
  if (!engine || !engine.isHumanTurn) return;
  const result = engine.executeShot(shotId);
  if (!result) return;

  animateBall(result.outcome, result.attacker);

  result.lines.forEach((line, i) => {
    setTimeout(() => addLog(line, classifyLine(line)), i * 150);
  });

  setTimeout(() => {
    updateUI();
    if (!engine.matchOver && !engine.isHumanTurn && engine.phase !== 'point_end') triggerAI();
  }, result.lines.length * 150 + 120);
}

// ─── IA ───────────────────────────────────────────────────────
function triggerAI(delay = 800) {
  renderShotPanel();
  setTimeout(() => {
    if (!engine || engine.isHumanTurn || engine.matchOver || engine.phase === 'point_end') return;
    const shotId = aiPickShotStyled(engine);
    const result = engine.executeShot(shotId);
    if (!result) return;

    animateBall(result.outcome, result.attacker);

    result.lines.forEach((line, i) => {
      setTimeout(() => addLog(line, classifyLine(line)), i * 150);
    });

    setTimeout(() => {
      updateUI();
      if (!engine.matchOver && !engine.isHumanTurn && engine.phase !== 'point_end') triggerAI(550);
    }, result.lines.length * 150 + 120);
  }, delay);
}

// IA com personalidade: usa aiWeights do jogador
function aiPickShotStyled(eng) {
  const actor = eng.currentActor;
  const shots = eng.availableShots().filter(s => s.canAfford);
  if (!shots.length) return eng.availableShots()[0].id;

  // Fadiga: joga seguro
  if (actor.energy < 25) {
    const safe = shots.find(s => s.baseRisk < 12);
    if (safe) return safe.id;
  }

  const weights = actor.aiWeights || {};
  const scored = shots.map(s => {
    const styleBonus = weights[s.id] || 1.0;
    return { id: s.id, score: Math.pow(s.successChance, 1.4) * styleBonus };
  });

  const total = scored.reduce((a, b) => a + b.score, 0);
  let r = Math.random() * total;
  for (const s of scored) { r -= s.score; if (r <= 0) return s.id; }
  return scored[scored.length - 1].id;
}

// ─── LOG ──────────────────────────────────────────────────────
function addLog(text, type = 'normal') {
  const log = document.getElementById('match-log');
  if (!log) return;
  const line = document.createElement('div');
  line.className = 'log-line log-' + type;
  line.textContent = text;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 100) log.removeChild(log.firstChild);
}

function classifyLine(text) {
  if (/ACE|PARTIDA|VENCE/i.test(text))      return 'ace';
  if (/WINNER|grande estilo/i.test(text))   return 'winner';
  if (/REDE|fora|erro/i.test(text))         return 'error';
  if (/Set|Game|save|Bem-vindo|iniciada|sacar/i.test(text)) return 'system';
  return 'normal';
}

// ─── FIM DE PARTIDA ───────────────────────────────────────────
function showMatchOver() {
  const overlay = document.getElementById('match-over-screen');
  if (!overlay || overlay._shown) return;
  overlay._shown = true;
  overlay.classList.remove('hidden');

  const [p1, p2] = engine.players;
  const winner = engine.winner;
  const sc = engine.score;
  const winnerIsHuman = winner?.isHuman;

  setText('over-winner-name', winnerIsHuman
    ? `🏆 ${playerName} VENCE!`
    : `${winner?.name} VENCE!`);
  setText('over-score', sc.sets.map(s => `${s.p1}-${s.p2}`).join('  '));
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
    ['Aces',             p1.stats.aces,           p2.stats.aces],
    ['Winners',          p1.stats.winners,         p2.stats.winners],
    ['Erros n/forçados', p1.stats.unforcedErrors,  p2.stats.unforcedErrors],
    ['Erros forçados',   p1.stats.forcedErrors,    p2.stats.forcedErrors],
  ];
  const tbody = document.getElementById('stats-body');
  if (!tbody) return;
  tbody.innerHTML = rows.map(([label, v1, v2]) => `
    <div class="stat-row">
      <span class="stat-val text-yellow-400 text-right">${v1}</span>
      <span class="stat-label">${label}</span>
      <span class="stat-val text-blue-400">${v2}</span>
    </div>
  `).join('');
}
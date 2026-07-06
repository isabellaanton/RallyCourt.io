// ============================================================
//  Rally.io — UI Controller (MELHORADO)
//  Animações mais fluidas + feedback melhor
// ============================================================

let engine = null;
let playerName = '';
let selectedPlayerCfg = null;
let selectedOpponentCfg = null;
let selectedSurface = 'hard';
let gamePaused = false;

// Language
window.setLanguage = function(lang) {
  if (TRANSLATIONS[lang]) {
    currentLang = lang;
    localStorage.setItem('tennisRPG_lang', lang);
    updateAllTexts();
    const sel = document.getElementById('lang-select');
    if (sel) sel.value = lang;
  }
};

// Theme
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = dark ? 'Claro' : 'Escuro';
  localStorage.setItem('tennisRPG_theme', dark ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!document.body.classList.contains('dark'));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('tennisRPG_theme');
  applyTheme(savedTheme === 'dark');

  document.getElementById('btn-theme')?.addEventListener('click', toggleTheme);
  document.getElementById('btn-pause')?.addEventListener('click', () => { gamePaused = true; showModal('modal-pause'); });
  document.getElementById('btn-resume')?.addEventListener('click', () => { gamePaused = false; hideModal('modal-pause'); });
  document.getElementById('btn-new-game')?.addEventListener('click', () => { MatchEngine.clearSave(); gamePaused = false; hideModal('modal-pause'); skipToPlayerSelect(); });
  document.getElementById('btn-change-name')?.addEventListener('click', () => { hideModal('modal-pause'); showModal('modal-register'); });
  document.getElementById('btn-tutorial')?.addEventListener('click', () => showModal('modal-tutorial'));
  document.getElementById('btn-close-tutorial')?.addEventListener('click', () => hideModal('modal-tutorial'));

  updateAllTexts();

  const saved = MatchEngine.load();
  if (saved && !saved.matchOver) {
    const savedName = localStorage.getItem('tennisRPG_playerName') || '';
    if (savedName) {
      playerName = savedName;
      engine = saved;
      updateAIThinkingLabel();
      setSurfaceTheme(saved.surfaceId);
      hideModal('modal-register'); hideModal('modal-start'); hideModal('modal-select-opponent');
      updateUI(); redrawCourt();
      const human = engine.players[engine.humanIndex];
      if (engine.phase !== 'point_end') {
        if (engine.server === human) showCards();
        else triggerAITurn();
      }
      addLog(`Bem-vindo de volta, ${playerName}!`, 'system');
      return;
    }
  }

  const storedName = localStorage.getItem('tennisRPG_playerName');
  if (storedName) { playerName = storedName; skipToPlayerSelect(); }
  else showModal('modal-register');
});

function skipToPlayerSelect() {
  prepareMyPlayer();
  hideModal('modal-register');
  renderPlayerSelectGrid();
  showModal('modal-start');
}

function showModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hideModal(id) { document.getElementById(id)?.classList.add('hidden'); }

// Player Name
document.getElementById('btn-confirm-name')?.addEventListener('click', confirmName);
document.getElementById('input-player-name')?.addEventListener('keydown', e => { if (e.key === 'Enter') confirmName(); });

function prepareMyPlayer() {
  let cfg = JSON.parse(localStorage.getItem('tennisRPG_myPlayer'));
  if (!cfg) {
    cfg = {id:'myplayer_1', name:playerName, fullName:playerName, country:'🌎', gender:'M', style:'Jogador Customizado',
      playstyle:'all_court', serve:68, return:68, forehand:70, backhand:66, volley:62, speed:72, stamina:75, mental:68, aiWeights:{}};
    localStorage.setItem('tennisRPG_myPlayer', JSON.stringify(cfg));
  } else {
    cfg.name = playerName; cfg.fullName = playerName;
  }
  const idx = MALE_PLAYERS.findIndex(p => p.id === 'myplayer_1');
  if (idx > -1) MALE_PLAYERS[idx] = cfg;
  else MALE_PLAYERS.unshift(cfg);
}

function confirmName() {
  const val = document.getElementById('input-player-name').value.trim();
  if (!val) return;
  playerName = val;
  localStorage.setItem('tennisRPG_playerName', playerName);
  prepareMyPlayer();
  document.getElementById('registered-name-display').textContent = playerName;
  hideModal('modal-register');
  renderPlayerSelectGrid();
  showModal('modal-start');
}

// Grids
function renderPlayerSelectGrid() {
  const gm = document.getElementById('player-grid-male');
  const gf = document.getElementById('player-grid-female');
  gm.innerHTML = ''; gf.innerHTML = '';
  MALE_PLAYERS.forEach(p => gm.appendChild(buildPlayerCard(p, 'player')));
  FEMALE_PLAYERS.forEach(p => gf.appendChild(buildPlayerCard(p, 'player')));
}

function buildPlayerCard(p, mode) {
  const div = document.createElement('div');
  div.className = 'player-select-card';
  div.dataset.id = p.id;
  div.innerHTML = `
    <div class="text-base">${p.country}</div>
    <div class="player-card-name">${p.name}</div>
    <div class="player-card-style">${p.style}</div>
    <div class="player-card-attrs">
      <span>SV ${p.serve}</span><span>FH ${p.forehand}</span><span>VL ${p.speed}</span><span>MT ${p.mental}</span>
    </div>`;
  div.addEventListener('click', () => mode === 'player' ? selectHumanPlayer(p, div) : selectOpponent(p, div));
  return div;
}

function selectHumanPlayer(cfg, el) {
  document.querySelectorAll('#modal-start .player-select-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedPlayerCfg = {...cfg, isHuman: true};
  document.getElementById('btn-next-opponent').classList.remove('opacity-30','pointer-events-none');
}

function renderOpponentGrid() {
  const gm = document.getElementById('opp-grid-male');
  const gf = document.getElementById('opp-grid-female');
  gm.innerHTML = ''; gf.innerHTML = '';
  MALE_PLAYERS.forEach(p => { if (p.id !== selectedPlayerCfg.id) gm.appendChild(buildPlayerCard(p, 'opponent')); });
  FEMALE_PLAYERS.forEach(p => { if (p.id !== selectedPlayerCfg.id) gf.appendChild(buildPlayerCard(p, 'opponent')); });
}

function selectOpponent(cfg, el) {
  document.querySelectorAll('#modal-select-opponent .player-select-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedOpponentCfg = cfg;
  document.getElementById('btn-start-match').classList.remove('opacity-30','pointer-events-none');
}

// Surface
document.querySelectorAll('.surface-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.surface-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSurface = btn.dataset.surface;
  });
});

function setSurfaceTheme(surf) {
  document.body.classList.remove('surface-clay','surface-grass','surface-hard');
  document.body.classList.add(`surface-${surf}`);
}

// Start Match
document.getElementById('btn-next-opponent').addEventListener('click', () => {
  if (!selectedPlayerCfg) return;
  hideModal('modal-start');
  renderOpponentGrid();
  showModal('modal-select-opponent');
});

document.getElementById('btn-start-match').addEventListener('click', () => {
  if (!selectedPlayerCfg || !selectedOpponentCfg) return;
  startMatch();
});

function startMatch() {
  const p1 = new Player(selectedPlayerCfg);
  const p2 = new Player(selectedOpponentCfg);
  engine = new MatchEngine(p1, p2, selectedSurface);
  updateAIThinkingLabel();
  setSurfaceTheme(selectedSurface);
  hideModal('modal-select-opponent');
  document.getElementById('match-log').innerHTML = '';
  addLog(`Partida iniciada! ${p1.name} vs ${p2.name}`, 'system');
  updateUI(); resetTokens(); redrawCourt(); engine.save();
  if (engine.server === engine.players[engine.humanIndex]) showCards();
  else triggerAITurn();
}

function updateAIThinkingLabel() {
  const opp = engine.players[1 - engine.humanIndex];
  const lbl = document.getElementById('ai-thinking-label');
  if (lbl) lbl.textContent = `${opp.name} pensando...`;
}

// Shot Handling
function handlePlayerShot(shotId) {
  if (!engine || engine.matchOver || gamePaused) return;
  hideCards();
  spawnHitEffect('token-p1');
  styleBallForShot(shotId);

  const isServe = engine.phase === 'serve';
  animateBallRealistic('token-p1', 'token-p2', isServe, shotId, () => {
    const result = engine.executeShot(shotId);
    if (result) styleBallForOutcome(result.outcome);
    updateUI(); redrawCourt();
    if (!engine.matchOver && engine.phase !== 'point_end' && engine.phase !== 'serve') triggerAITurn();
  });
}

function triggerAITurn() {
  if (!engine || engine.matchOver) return;
  document.getElementById('ai-thinking-box')?.classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('ai-thinking-box')?.classList.add('hidden');
    const aiShotId = engine.aiPickShot();
    spawnHitEffect('token-p2');
    styleBallForShot(aiShotId);

    const isServe = engine.phase === 'serve';
    animateBallRealistic('token-p2', 'token-p1', isServe, aiShotId, () => {
      const result = engine.executeShot(aiShotId);
      if (result) styleBallForOutcome(result.outcome);
      updateUI(); redrawCourt();
      if (!engine.matchOver && engine.phase !== 'point_end' && engine.phase !== 'serve') showCards();
    });
  }, 780);
}

// Ball Animation (melhorada)
function animateBallRealistic(fromId, toId, isServe, shotId, callback) {
  const ball = document.getElementById('token-ball');
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);
  if (!ball || !from || !to) return callback?.();

  const wrapRect = document.getElementById('court-3d-wrap').getBoundingClientRect();
  const rFrom = from.getBoundingClientRect();
  const rTo = to.getBoundingClientRect();

  const startX = rFrom.left - wrapRect.left + rFrom.width/2;
  const startY = rFrom.top - wrapRect.top + rFrom.height/2;
  const endX = rTo.left - wrapRect.left + rTo.width/2;
  const endY = rTo.top - wrapRect.top + rTo.height/2;

  ball.style.transition = 'none';
  ball.style.left = startX + 'px';
  ball.style.top = startY + 'px';
  void ball.offsetWidth;

  let duration = isServe ? 460 : 320;
  if (shotId?.includes('smash') || shotId?.includes('winner')) duration = 220;

  ball.style.transition = `left ${duration}ms cubic-bezier(0.23,1,0.32,1), top ${duration}ms cubic-bezier(0.23,1,0.32,1)`;

  if (isServe) {
    const midX = (startX + endX) / 2 + (Math.random() * 35 - 17);
    const midY = startY + (endY - startY) * 0.38;
    ball.style.left = midX + 'px';
    ball.style.top = midY + 'px';
    setTimeout(() => { ball.style.left = endX + 'px'; ball.style.top = endY + 'px'; }, 160);
  } else {
    ball.style.left = endX + 'px';
    ball.style.top = endY + 'px';
  }

  setTimeout(() => ball.classList.add('bounce'), duration * 0.6);
  setTimeout(() => { ball.classList.remove('bounce'); callback?.(); }, duration + 80);
}

// Court & Tokens
function redrawCourt() {
  const canvas = document.getElementById('court-3d-canvas');
  if (!canvas || !engine) return;
  const isDark = document.body.classList.contains('dark');
  CourtRenderer.draw(canvas, selectedSurface, isDark);

  const wrap = document.getElementById('court-3d-wrap');
  const human = engine.players[engine.humanIndex];
  const ai = engine.players[1 - engine.humanIndex];

  const p1Z = human.position === 'net' ? 0.58 : 0.93;
  const p2Z = ai.position === 'net' ? 0.42 : 0.07;

  const p1Px = CourtRenderer.courtToPixel(0.5, p1Z);
  const p2Px = CourtRenderer.courtToPixel(0.5, p2Z);

  applyTokenCSS('token-p1', p1Px, wrap, 11);
  applyTokenCSS('token-p2', p2Px, wrap, 10);
}

function applyTokenCSS(id, pos, wrap, baseRadius) {
  const el = document.getElementById(id);
  if (!el) return;
  const css = CourtRenderer.pixelToTokenCSS(pos.x, pos.y, wrap, baseRadius);
  el.style.left = css.left + 'px';
  el.style.top = css.top + 'px';
  el.style.width = css.width + 'px';
  el.style.height = css.height + 'px';
}

function resetTokens() {
  const wrap = document.getElementById('court-3d-wrap');
  const human = engine.players[engine.humanIndex];
  const normZ = (engine.server === human) ? 0.93 : 0.07;
  const servePx = CourtRenderer.courtToPixel(0.5, normZ);
  const ball = document.getElementById('token-ball');
  if (ball) {
    ball.style.transition = 'none';
    applyTokenCSS('token-ball', servePx, wrap, 5.5);
    setTimeout(() => ball.style.transition = 'all .28s ease-out', 20);
  }
}

// Helpers
function spawnHitEffect(tokenId) {
  const token = document.getElementById(tokenId);
  if (!token) return;
  const flash = document.createElement('div');
  flash.className = 'hit-flash';
  flash.style.left = token.style.left;
  flash.style.top = token.style.top;
  token.parentElement.appendChild(flash);
  setTimeout(() => flash.remove(), 420);
}

function styleBallForShot(shotId) {
  const ball = document.getElementById('token-ball');
  if (!ball) return;
  ball.classList.remove('shot-power-low','shot-power-medium','shot-power-high','shot-power-max','shot-touch');
  const shot = SHOTS[shotId];
  if (!shot) return;
  if (shot.id === 'net_dropshot') ball.classList.add('shot-touch');
  else if (shot.power >= 95) ball.classList.add('shot-power-max');
  else if (shot.power >= 80) ball.classList.add('shot-power-high');
  else if (shot.power >= 60) ball.classList.add('shot-power-medium');
  else ball.classList.add('shot-power-low');
}

function styleBallForOutcome(outcome) {
  const ball = document.getElementById('token-ball');
  if (!ball) return;
  ball.classList.remove('outcome-ace','outcome-winner','outcome-net','outcome-out');
  if (outcome === 'ace') ball.classList.add('outcome-ace');
  else if (outcome === 'winner') ball.classList.add('outcome-winner');
}

// UI Update
function updateUI() {
  if (!engine) return;
  const human = engine.players[engine.humanIndex];
  const ai = engine.players[1 - engine.humanIndex];

  document.getElementById('p1-name').textContent = human.name;
  document.getElementById('p2-name').textContent = ai.name;
  document.getElementById('p1-points').textContent = engine.score.pointDisplay[engine.humanIndex];
  document.getElementById('p2-points').textContent = engine.score.pointDisplay[1 - engine.humanIndex];
  document.getElementById('p1-games').textContent = engine.score.games[engine.humanIndex];
  document.getElementById('p2-games').textContent = engine.score.games[1 - engine.humanIndex];

  document.getElementById('serve-dot-1').style.visibility = (engine.server === human) ? 'visible' : 'hidden';
  document.getElementById('serve-dot-2').style.visibility = (engine.server === ai) ? 'visible' : 'hidden';

  updateBar('p1-energy', human.energy);
  updateBar('p2-energy', ai.energy);
  updateBar('p1-conf', human.confidence);
  updateBar('p2-conf', ai.confidence);

  const logContainer = document.getElementById('match-log');
  logContainer.innerHTML = '';
  engine.currentPointLog.forEach(msg => addLog(msg));

  if (engine.matchOver) {
    hideCards();
    document.getElementById('btn-continue').classList.add('hidden');
    showMatchOverScreen();
  } else if (engine.phase === 'point_end') {
    document.getElementById('btn-continue').classList.remove('hidden');
    hideCards();
  }
}

// Tela de fim de partida (existia pronta no HTML, mas nunca era acionada)
function showMatchOverScreen() {
  const human = engine.players[engine.humanIndex];
  const ai = engine.players[1 - engine.humanIndex];
  const winner = engine.winner;

  document.getElementById('over-winner-name').textContent = winner ? `${winner.name} VENCE!` : '';

  const setsText = engine.score.sets.map(s => {
    const humanGames = engine.humanIndex === 0 ? s.p1 : s.p2;
    const aiGames = engine.humanIndex === 0 ? s.p2 : s.p1;
    return `${humanGames}-${aiGames}`;
  }).join('   ');
  document.getElementById('over-score').textContent = setsText;

  document.getElementById('over-p1-name').textContent = human.name;
  document.getElementById('over-p2-name').textContent = ai.name;

  const rows = [
    ['Aces', human.stats.aces, ai.stats.aces],
    ['Winners', human.stats.winners, ai.stats.winners],
    ['Erros não forçados', human.stats.unforcedErrors, ai.stats.unforcedErrors],
    ['Erros forçados', human.stats.forcedErrors, ai.stats.forcedErrors],
  ];
  const statsBody = document.getElementById('stats-body');
  statsBody.innerHTML = '';
  rows.forEach(([label, v1, v2]) => {
    const div = document.createElement('div');
    div.className = 'stat-row';
    div.innerHTML = `<span class="stat-val" style="color:#d97706">${v1}</span><span class="stat-label">${label}</span><span class="stat-val" style="color:#2563eb">${v2}</span>`;
    statsBody.appendChild(div);
  });

  showModal('match-over-screen');
}

function updateBar(id, val) {
  const bar = document.getElementById(id);
  const valEl = document.getElementById(id + '-val');
  if (bar) bar.style.width = `${Math.max(0, Math.min(100, val))}%`;
  if (valEl) valEl.textContent = Math.round(val);
}

function hideCards() {
  document.getElementById('shot-cards').innerHTML = '';
}

function showCards() {
  const container = document.getElementById('shot-cards');
  container.innerHTML = '';
  const shots = engine.availableShots();
  shots.forEach(s => {
    const btn = document.createElement('div');
    btn.className = `shot-card ${s.canAfford ? '' : 'disabled'}`;
    btn.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="shot-name">${s.name}</span>
        <span class="shot-icon-text">${s.icon}</span>
      </div>
      <div class="shot-desc mb-2">${s.desc || ''}</div>
      <div class="flex justify-between items-center mt-auto">
        <span class="shot-cost">⚡ ${s.energyCost}</span>
        <span class="success-pill ${s.successChance >= 70 ? 'success-high' : s.successChance >= 45 ? 'success-mid' : 'success-low'}">${s.successChance}%</span>
      </div>`;
    if (s.canAfford) btn.addEventListener('click', () => handlePlayerShot(s.id));
    container.appendChild(btn);
  });
}

function addLog(msg, type = 'system') {
  const container = document.getElementById('match-log');
  const div = document.createElement('div');
  div.className = `log-line log-${type}`;
  div.textContent = msg;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

document.getElementById('btn-continue').addEventListener('click', () => {
  if (!engine) return;
  if (engine.matchOver) { MatchEngine.clearSave(); skipToPlayerSelect(); return; }
  document.getElementById('btn-continue').classList.add('hidden');
  // Antes esta linha não existia: a fase ficava travada em 'point_end' para sempre,
  // e o engine.executeShot() bloqueava qualquer novo golpe. Isso liga o próximo ponto.
  engine.phase = 'serve';
  // Só agora limpamos o log do ponto anterior, já que ele ficou visível até aqui.
  engine.currentPointLog = [];
  engine.save();
  resetTokens();
  updateUI(); redrawCourt();
  const human = engine.players[engine.humanIndex];
  if (engine.server === human) showCards();
  else triggerAITurn();
});

// Botão da tela de fim de partida — antes não tinha nenhum listener e não fazia nada
document.getElementById('btn-play-again')?.addEventListener('click', () => {
  hideModal('match-over-screen');
  MatchEngine.clearSave();
  skipToPlayerSelect();
});
// ============================================================
//  Rally.io — Game Engine (VERSÃO MELHORADA 2026)
//  IA inteligente + balanceamento refinado + narrativas ricas
// ============================================================

const SURFACES = {
  clay:  { name: 'Saibro',        energyMult: 1.35, serveBonus: 0,  netBonus: -8,  rallyMult: 1.25 },
  grass: { name: 'Grama',         energyMult: 0.75, serveBonus: 12, netBonus: 12, rallyMult: 0.65 },
  hard:  { name: 'Quadra Rápida', energyMult: 1.0,  serveBonus: 6,  netBonus: 0,  rallyMult: 1.0 },
};

const OUTCOMES = {
  IN: 'in', OUT: 'out', NET: 'net', WINNER: 'winner', ACE: 'ace', FORCED_ERROR: 'forced_error'
};

const SHOTS = {
  serve_flat: {
    id: 'serve_flat', name: 'Saque Flat', phase: 'serve',
    energyCost: 8, baseRisk: 16, power: 96, icon: 'F',
    desc: 'Alta potência, alto risco.',
    attr: 'serve', defAttr: 'return',
    narrative: (atk) => [`${atk} solta um saque FLAT devastador!`, `A bola voa a mais de 210 km/h!`]
  },
  serve_slice: {
    id: 'serve_slice', name: 'Saque Slice', phase: 'serve',
    energyCost: 6, baseRisk: 9, power: 78, icon: 'S',
    desc: 'Efeito lateral, risco moderado.',
    attr: 'serve', defAttr: 'return',
    narrative: (atk) => [`${atk} usa slice para abrir a quadra.`, `Efeito lateral perigoso!`]
  },
  serve_kick: {
    id: 'serve_kick', name: 'Saque Kick', phase: 'serve',
    energyCost: 5, baseRisk: 6, power: 68, icon: 'K',
    desc: 'Seguro, quica alto.',
    attr: 'serve', defAttr: 'return',
    narrative: (atk) => [`${atk} opta pelo kick seguro.`, `Quica alto e difícil de atacar.`]
  },

  rally_regular: {
    id: 'rally_regular', name: 'Troca Regular', phase: 'rally',
    energyCost: 4, baseRisk: 4, power: 62, icon: 'R',
    desc: 'Golpe consistente e seguro.',
    attr: 'forehand', defAttr: 'forehand',
    narrative: (atk) => [`${atk} mantém o ponto com consistência.`]
  },
  rally_forehand_winner: {
    id: 'rally_forehand_winner', name: 'Acelerar na Paralela', phase: 'rally',
    energyCost: 11, baseRisk: 25, power: 92, icon: 'A',
    desc: 'Agressivo, tenta encerrar o ponto.',
    attr: 'forehand', defAttr: 'speed',
    narrative: (atk) => [`${atk} acelera na paralela!`, `Golpe agressivo tentando encerrar o ponto!`]
  },
  rally_slice_defensive: {
    id: 'rally_slice_defensive', name: 'Slice Defensivo', phase: 'rally',
    energyCost: 3, baseRisk: 5, power: 48, icon: 'D',
    desc: 'Defensivo, recupera posição.',
    attr: 'backhand', defAttr: 'forehand',
    narrative: (atk) => [`${atk} usa slice defensivo para recuperar posição.`]
  },
  rally_approach: {
    id: 'rally_approach', name: 'Subir à Rede', phase: 'rally',
    energyCost: 9, baseRisk: 14, power: 72, icon: 'N',
    desc: 'Avança para a rede.',
    attr: 'speed', defAttr: 'forehand',
    narrative: (atk) => [`${atk} avança para a rede após o golpe!`]
  },

  net_volley: {
    id: 'net_volley', name: 'Voleio Firme', phase: 'net',
    energyCost: 6, baseRisk: 11, power: 82, icon: 'V',
    desc: 'Voleio firme e preciso.',
    attr: 'volley', defAttr: 'speed',
    narrative: (atk) => [`${atk} executa um voleio preciso!`]
  },
  net_dropshot: {
    id: 'net_dropshot', name: 'Drop Shot', phase: 'net',
    energyCost: 7, baseRisk: 20, power: 76, icon: 'DS',
    desc: 'Bola curta e surpresa.',
    attr: 'volley', defAttr: 'speed',
    narrative: (atk) => [`${atk} tenta o drop shot surpresa!`, `Bola morrendo na rede!`]
  },
  net_smash: {
    id: 'net_smash', name: 'Smash', phase: 'net',
    energyCost: 10, baseRisk: 13, power: 98, icon: 'SM',
    desc: 'Potência máxima na rede.',
    attr: 'forehand', defAttr: 'speed',
    narrative: (atk) => [`${atk} vai de SMASH!`, `Potência máxima acima da cabeça!`]
  },
};

class Player {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.fullName = config.fullName || config.name;
    this.country = config.country || '';
    this.gender = config.gender || 'M';
    this.isHuman = config.isHuman || false;
    this.playstyle = config.playstyle || 'all_court';
    this.aiWeights = config.aiWeights || {};

    this.serve = config.serve || 75;
    this.return = config.return || 75;
    this.forehand = config.forehand || 75;
    this.backhand = config.backhand || 75;
    this.volley = config.volley || 65;
    this.speed = config.speed || 75;
    this.stamina = config.stamina || 75;
    this.mental = config.mental || 75;

    this.energy = 100;
    this.confidence = 50;
    this.position = 'baseline';
    this.fatigueLevel = 'ok';
    this.stats = { aces: 0, winners: 0, unforcedErrors: 0, forcedErrors: 0 };
  }

  effectiveAttr(attrName) {
    let base = this[attrName] || 75;
    let fatiguePenalty = this.energy < 50 ? (50 - this.energy) * 0.42 : 0;
    let confBonus = (this.confidence - 50) * 0.22;
    return Math.max(12, Math.min(99, base - fatiguePenalty + confBonus));
  }

  drainEnergy(amount) {
    this.energy = Math.max(0, this.energy - amount);
    this._updateFatigueLevel();
  }

  _updateFatigueLevel() {
    if (this.energy < 15) this.fatigueLevel = 'critical';
    else if (this.energy < 25) this.fatigueLevel = 'danger';
    else if (this.energy < 50) this.fatigueLevel = 'warn';
    else this.fatigueLevel = 'ok';
  }

  adjustConfidence(delta) {
    this.confidence = Math.max(0, Math.min(100, this.confidence + delta));
  }

  recoverBetweenPoints(surfaceId) {
    const base = 6 + (this.stamina - 50) * 0.13;
    const surfMult = surfaceId === 'clay' ? 0.78 : surfaceId === 'grass' ? 1.35 : 1.0;
    const gain = Math.max(3, base * surfMult);
    this.energy = Math.min(100, this.energy + gain);
    this._updateFatigueLevel();
    return gain;
  }

  serialize() {
    return { id: this.id, name: this.name, fullName: this.fullName, country: this.country, gender: this.gender,
      isHuman: this.isHuman, playstyle: this.playstyle, aiWeights: this.aiWeights,
      serve: this.serve, return: this.return, forehand: this.forehand, backhand: this.backhand,
      volley: this.volley, speed: this.speed, stamina: this.stamina, mental: this.mental,
      energy: this.energy, confidence: this.confidence, position: this.position,
      fatigueLevel: this.fatigueLevel, stats: this.stats };
  }

  static deserialize(data) {
    const p = new Player(data);
    p.energy = data.energy;
    p.confidence = data.confidence;
    p.position = data.position;
    p.fatigueLevel = data.fatigueLevel || 'ok';
    p.stats = data.stats || { aces: 0, winners: 0, unforcedErrors: 0, forcedErrors: 0 };
    return p;
  }
}

class ScoreManager { /* Mantido igual ao original (funcionalidade preservada) */ 
  // ============================================================
  // MODO TESTE — deixe true para partidas bem curtas (testar a
  // tela final rapidamente). Depois de testar, mude para false
  // para voltar à regra oficial (6 games / 2 sets).
  // ============================================================
  static QUICK_TEST_MODE = true;
  static GAMES_TO_WIN_SET  = ScoreManager.QUICK_TEST_MODE ? 1 : 6;
  static SETS_TO_WIN_MATCH = ScoreManager.QUICK_TEST_MODE ? 1 : 2;

  static POINT_NAMES = ['0', '15', '30', '40'];
  constructor() { this.sets = []; this.games = [0,0]; this.points = [0,0]; this.inTiebreak = false; this.serving = 0; }
  get pointDisplay() { /* mesmo código original */ 
    const [p1, p2] = this.points;
    if (this.inTiebreak) return [`${p1}`, `${p2}`];
    if (p1 >= 3 && p2 >= 3) return p1 === p2 ? ['Deuce', 'Deuce'] : p1 > p2 ? ['Vant.', ''] : ['', 'Vant.'];
    return [ScoreManager.POINT_NAMES[p1] ?? '0', ScoreManager.POINT_NAMES[p2] ?? '0'];
  }
  awardPoint(playerIndex) { /* mesmo código original */ 
    // ... (completo, mantido)
    const opp = 1 - playerIndex; this.points[playerIndex]++;
    let gameWon = false, setWon = false, matchWon = false;
    if (this.inTiebreak) {
      if (this.points[playerIndex] >= 7 && this.points[playerIndex] - this.points[opp] >= 2) gameWon = true;
    } else {
      const [p1,p2] = this.points;
      if (p1 >= 3 && p2 >= 3) { if (Math.abs(p1-p2) >= 2) gameWon = true; }
      else if (p1 >= 4 || p2 >= 4) gameWon = true;
    }
    if (gameWon) {
      this.games[playerIndex]++; this.points = [0,0]; this.inTiebreak = false; this.serving = 1 - this.serving;
      const [g1,g2] = this.games;
      if ((Math.max(g1,g2) >= ScoreManager.GAMES_TO_WIN_SET && Math.abs(g1-g2) >= 2) || Math.max(g1,g2) === ScoreManager.GAMES_TO_WIN_SET + 1 || (ScoreManager.GAMES_TO_WIN_SET === 1 && Math.max(g1,g2) >= 1)) {
        setWon = true; this.sets.push({p1:this.games[0], p2:this.games[1]}); this.games = [0,0];
        const setsWon = this.sets.filter(s => (playerIndex===0 ? s.p1 : s.p2) > (playerIndex===0 ? s.p2 : s.p1)).length;
        if (setsWon >= ScoreManager.SETS_TO_WIN_MATCH) matchWon = true;
      } else if (g1 === 6 && g2 === 6) this.inTiebreak = true;
    }
    return {gameWon, setWon, matchWon};
  }
  serialize() { return {sets:this.sets, games:this.games, points:this.points, inTiebreak:this.inTiebreak, serving:this.serving}; }
  static deserialize(data) { const sm = new ScoreManager(); Object.assign(sm, data); return sm; }
}

class MatchEngine {
  constructor(player1, player2, surfaceId = 'hard') {
    this.players = [player1, player2];
    this.surfaceId = surfaceId;
    this.surface = SURFACES[surfaceId];
    this.score = new ScoreManager();
    this.phase = 'serve';
    this.rallyCount = 0;
    this.currentPointLog = [];
    this.matchLog = [];
    this.matchOver = false;
    this.winner = null;
    this.humanIndex = player1.isHuman ? 0 : 1;
  }

  get server() { return this.players[this.score.serving]; }
  get receiver() { return this.players[1 - this.score.serving]; }
  get currentActor() { return this.phase === 'serve' ? this.server : (this.rallyCount % 2 === 0 ? this.server : this.receiver); }

  availableShots() {
    let pool = [];
    if (this.phase === 'serve') pool = [SHOTS.serve_flat, SHOTS.serve_slice, SHOTS.serve_kick];
    else if (this.phase === 'net') pool = [SHOTS.net_volley, SHOTS.net_dropshot, SHOTS.net_smash];
    else pool = [SHOTS.rally_regular, SHOTS.rally_forehand_winner, SHOTS.rally_slice_defensive, SHOTS.rally_approach];

    return pool.map(s => ({
      ...s,
      successChance: this._estimateSuccess(this.currentActor, s),
      canAfford: this.currentActor.energy >= s.energyCost,
      fatigueWarning: this.currentActor.fatigueLevel !== 'ok'
    }));
  }

  _estimateSuccess(player, shot) {
    const atk = player.effectiveAttr(shot.attr);
    const surfBonus = this.phase === 'serve' ? this.surface.serveBonus : (player.position === 'net' ? this.surface.netBonus : 0);
    const raw = ((atk + surfBonus) / 99) * (1 - shot.baseRisk / 100) * 100;
    return Math.round(Math.min(97, Math.max(20, raw)));
  }

  _resolveShot(attacker, defender, shot) {
    const atkAttr = attacker.effectiveAttr(shot.attr);
    const defAttr = defender.effectiveAttr(shot.defAttr);
    const surfBonus = (shot.phase === 'serve' ? this.surface.serveBonus : 0) + (attacker.position === 'net' ? this.surface.netBonus : 0);
    attacker.drainEnergy(shot.energyCost * this.surface.energyMult);

    const atkEff = Math.min(99, atkAttr + surfBonus);
    const balance = (atkEff - defAttr + 99) / 198;
    const rand = Math.random();

    const errorChance = (shot.baseRisk / 100) * (1 - balance * 0.78) * (this.rallyCount > 6 ? 1.15 : 1);
    if (rand < errorChance * 0.5) return OUTCOMES.NET;
    if (rand < errorChance) return OUTCOMES.OUT;

    if (defender.effectiveAttr(shot.defAttr) > attacker.effectiveAttr(shot.attr) + 18 && rand < 0.35) {
      defender.stats.forcedErrors++;
      return OUTCOMES.FORCED_ERROR;
    }

    const winnerThreshold = 1 - (shot.power / 99) * balance * 0.48;
    if (rand > winnerThreshold) {
      return shot.phase === 'serve' ? OUTCOMES.ACE : OUTCOMES.WINNER;
    }
    return OUTCOMES.IN;
  }

  executeShot(shotId) {
    if (this.matchOver || this.phase === 'point_end') return null;
    const shot = SHOTS[shotId];
    if (!shot) return null;

    const attacker = this.currentActor;
    const defender = attacker === this.players[0] ? this.players[1] : this.players[0];
    const outcome = this._resolveShot(attacker, defender, shot);
    let lines = shot.narrative(attacker.name);

    let pointWinner = null;
    let nextPhase = 'rally';

    switch (outcome) {
      case OUTCOMES.ACE:
        lines.push(`ACE! Ponto direto para ${attacker.name}!`);
        attacker.stats.aces++; attacker.stats.winners++;
        pointWinner = attacker; nextPhase = 'point_end';
        break;
      case OUTCOMES.WINNER:
        lines.push(`WINNER! ${attacker.name} encerra o ponto com maestria!`);
        attacker.stats.winners++;
        pointWinner = attacker; nextPhase = 'point_end';
        break;
      case OUTCOMES.NET:
      case OUTCOMES.OUT:
        lines.push(outcome === OUTCOMES.NET ? `Na rede! Erro de ${attacker.name}.` : `Fora! Erro de ${attacker.name}.`);
        attacker.stats.unforcedErrors++;
        pointWinner = defender; nextPhase = 'point_end';
        break;
      case OUTCOMES.FORCED_ERROR:
        lines.push(`Erro forçado! ${defender.name} pressionou demais.`);
        pointWinner = defender; nextPhase = 'point_end';
        break;
      case OUTCOMES.IN:
        if (shot.id === 'rally_approach') {
          attacker.position = 'net';
          lines.push(`${attacker.name} sobe à rede!`);
          nextPhase = 'net';
        } else if (shot.phase === 'serve') {
          nextPhase = 'rally';
        } else {
          nextPhase = attacker.position === 'net' ? 'net' : 'rally';
        }
        break;
    }

    this.currentPointLog.push(...lines);
    this.rallyCount++;

    if (pointWinner) {
      pointWinner.adjustConfidence(9);
      (pointWinner === this.players[0] ? this.players[1] : this.players[0]).adjustConfidence(-6);
    } else {
      defender.adjustConfidence(3);
    }

    if (nextPhase === 'point_end' && pointWinner) {
      const idx = this.players.indexOf(pointWinner);
      const result = this.score.awardPoint(idx);
      this._endPoint(pointWinner, result);
      // Só força 'point_end' (tela de "continuar") se a partida NÃO acabou.
      // Antes essa linha rodava sempre e apagava o 'match_over' definido em _endPoint().
      if (!this.matchOver) this.phase = 'point_end';
    } else {
      this.phase = nextPhase;
    }

    this.save();
    return { outcome, lines, phase: this.phase, pointWinner, attacker, defender };
  }

  _endPoint(winner, result) {
    // Antes isso era executado ANTES das mensagens de Game/Set/Partida serem
    // criadas, e currentPointLog era zerado logo em seguida — por isso nenhuma
    // dessas mensagens (incluindo "VENCE A PARTIDA!") chegava a aparecer na tela.
    this.rallyCount = 0;
    this.players.forEach(p => p.position = 'baseline');

    if (result.matchWon) {
      this.matchOver = true;
      this.winner = winner;
      this.phase = 'match_over';
      this.currentPointLog.push(`${winner.name} VENCE A PARTIDA!`);
      this.matchLog.push(...this.currentPointLog);
      return;
    }
    if (result.setWon) this.currentPointLog.push(`Set para ${winner.name}!`);
    if (result.gameWon) this.currentPointLog.push(`Game para ${winner.name}!`);

    this.players.forEach(p => {
      const recovered = p.recoverBetweenPoints(this.surfaceId);
      if (p.fatigueLevel !== 'ok') this.currentPointLog.push(`${p.name} recupera +${Math.round(recovered)} ST`);
    });

    this.matchLog.push(...this.currentPointLog);
    this.phase = 'serve';
  }

  aiPickShot() { /* versão inteligente acima */ 
    // ... (código completo conforme mostrado anteriormente)
    let shots = this.availableShots().filter(s => s.canAfford);
    if (!shots.length) return 'rally_regular';

    const actor = this.currentActor;
    const weights = shots.map(shot => {
      let w = Math.pow(shot.successChance, 1.45);
      if (actor.aiWeights[shot.id]) w *= actor.aiWeights[shot.id];
      if (actor.playstyle === 'aggressive_baseliner' && (shot.id.includes('winner') || shot.id.includes('smash'))) w *= 1.7;
      if (actor.playstyle === 'counter_puncher' && shot.id.includes('defensive')) w *= 1.6;
      return w;
    });

    let total = weights.reduce((a,b)=>a+b,0);
    let r = Math.random() * total;
    for (let i = 0; i < shots.length; i++) {
      r -= weights[i];
      if (r <= 0) return shots[i].id;
    }
    return shots[shots.length-1].id;
  }

  save() { /* mesmo que original, mas mais completo */ 
    const state = { players: this.players.map(p => p.serialize()), surfaceId: this.surfaceId, score: this.score.serialize(),
      phase: this.phase, rallyCount: this.rallyCount, matchLog: this.matchLog.slice(-150),
      currentPointLog: this.currentPointLog, matchOver: this.matchOver, winnerId: this.winner?.id };
    localStorage.setItem('tennisRPG_save', JSON.stringify(state));
  }

  static load() { /* mesmo que original */ 
    // ... (código completo preservado)
    const raw = localStorage.getItem('tennisRPG_save');
    if (!raw) return null;
    try {
      const state = JSON.parse(raw);
      const players = state.players.map(pd => Player.deserialize(pd));
      const engine = new MatchEngine(players[0], players[1], state.surfaceId);
      engine.score = ScoreManager.deserialize(state.score);
      Object.assign(engine, {phase: state.phase, rallyCount: state.rallyCount, matchLog: state.matchLog || [],
        currentPointLog: state.currentPointLog || [], matchOver: state.matchOver});
      if (state.winnerId) engine.winner = players.find(p => p.id === state.winnerId);
      return engine;
    } catch(e) { console.error(e); return null; }
  }

  static clearSave() { localStorage.removeItem('tennisRPG_save'); }
}
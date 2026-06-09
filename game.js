// ============================================================
//  Tennis RPG — Game Engine
//  Depende de: players.js (carregado antes)
// ============================================================

// ─── SUPERFÍCIES ─────────────────────────────────────────────
const SURFACES = {
  clay:  { name: 'Saibro',        energyMult: 1.4, serveBonus: 0,  netBonus: -5, rallyMult: 1.3 },
  grass: { name: 'Grama',         energyMult: 0.8, serveBonus: 10, netBonus: 10, rallyMult: 0.7 },
  hard:  { name: 'Quadra Rápida', energyMult: 1.0, serveBonus: 5,  netBonus: 0,  rallyMult: 1.0 },
};

// ─── RESULTADOS POSSÍVEIS ─────────────────────────────────────
const OUTCOMES = {
  IN:           'in',
  OUT:          'out',
  NET:          'net',
  WINNER:       'winner',
  ACE:          'ace',
  FORCED_ERROR: 'forced_error',
};

// ─── CATÁLOGO DE GOLPES ───────────────────────────────────────
const SHOTS = {
  // Fase de Saque
  serve_flat: {
    id: 'serve_flat', name: 'Saque Flat', phase: 'serve',
    energyCost: 8, baseRisk: 18, power: 95,
    icon: '⚡', description: 'Veloz, direto, arriscado',
    attr: 'serve', defAttr: 'return',
    narrative: (atk) => [
      `${atk} saca FLAT com força máxima!`,
      `A bola corta o ar a mais de 200 km/h!`,
    ],
  },
  serve_slice: {
    id: 'serve_slice', name: 'Saque Slice', phase: 'serve',
    energyCost: 6, baseRisk: 10, power: 75,
    icon: '🔄', description: 'Abre a quadra, efeito lateral',
    attr: 'serve', defAttr: 'return',
    narrative: (atk) => [
      `${atk} saca com slice!`,
      `A bola quebra para fora da quadra...`,
    ],
  },
  serve_kick: {
    id: 'serve_kick', name: 'Saque Kick', phase: 'serve',
    energyCost: 5, baseRisk: 7, power: 65,
    icon: '🎯', description: 'Seguro, quica alto',
    attr: 'serve', defAttr: 'return',
    narrative: (atk) => [
      `${atk} opta pelo kick — segurança primeiro.`,
      `A bola sobe com efeito, difícil de atacar.`,
    ],
  },

  // Fase de Rali
  rally_regular: {
    id: 'rally_regular', name: 'Troca Regular', phase: 'rally',
    energyCost: 4, baseRisk: 5, power: 60,
    icon: '↔️', description: 'Consistente, constrói o ponto',
    attr: 'forehand', defAttr: 'forehand',
    narrative: (atk) => [
      `${atk} mantém a bola em jogo, aguardando oportunidade...`,
    ],
  },
  rally_forehand_winner: {
    id: 'rally_forehand_winner', name: 'Acelerar na Paralela', phase: 'rally',
    energyCost: 12, baseRisk: 28, power: 90,
    icon: '💥', description: 'Alto risco, alto ganho',
    attr: 'forehand', defAttr: 'speed',
    narrative: (atk) => [
      `${atk} vê a abertura e ACELERA na paralela!`,
      `Bola rasante tentando encerrar o ponto!`,
    ],
  },
  rally_slice_defensive: {
    id: 'rally_slice_defensive', name: 'Slice Defensivo', phase: 'rally',
    energyCost: 3, baseRisk: 6, power: 45,
    icon: '🛡️', description: 'Diminui o ritmo, recupera posição',
    attr: 'backhand', defAttr: 'forehand',
    narrative: (atk) => [
      `${atk} corta a bola — slice defensivo, diminuindo o ritmo!`,
    ],
  },
  rally_approach: {
    id: 'rally_approach', name: 'Subir à Rede', phase: 'rally',
    energyCost: 9, baseRisk: 15, power: 72,
    icon: '⬆️', description: 'Força o adversário a fazer passada',
    attr: 'volley', defAttr: 'forehand',
    narrative: (atk) => [
      `${atk} sobe em direção à rede — pressão máxima!`,
      `O rival precisa achar a passada agora!`,
    ],
  },

  // Fase de Rede
  net_volley: {
    id: 'net_volley', name: 'Voleio Firme', phase: 'net',
    energyCost: 6, baseRisk: 12, power: 78,
    icon: '🥊', description: 'Seco e preciso na rede',
    attr: 'volley', defAttr: 'speed',
    narrative: (atk) => [`${atk} ENCERRA com um voleio seco na rede!`],
  },
  net_dropshot: {
    id: 'net_dropshot', name: 'Drop Shot', phase: 'net',
    energyCost: 7, baseRisk: 22, power: 50,
    icon: '🎪', description: 'Curtinha surpresa',
    attr: 'volley', defAttr: 'speed',
    narrative: (atk) => [`${atk} arrisca a CURTINHA — drop shot inesperado!`],
  },
  net_smash: {
    id: 'net_smash', name: 'Smash', phase: 'net',
    energyCost: 10, baseRisk: 14, power: 95,
    icon: '🔥', description: 'Decisivo, encerra o ponto',
    attr: 'forehand', defAttr: 'speed',
    narrative: (atk) => [
      `${atk} salta e MASSACRA com o smash!`,
      `Impossível de alcançar!`,
    ],
  },
};

// ─── CLASSE PLAYER ───────────────────────────────────────────
class Player {
  constructor(cfg) {
    this.id      = cfg.id;
    this.name    = cfg.name;
    this.isHuman = cfg.isHuman ?? false;
    this.country = cfg.country ?? '';
    this.avatar  = cfg.avatar  ?? '🎾';

    // Atributos base (1–99)
    this.attrs = {
      serve:    cfg.serve    ?? 75,
      return:   cfg.return   ?? 75,
      forehand: cfg.forehand ?? 75,
      backhand: cfg.backhand ?? 75,
      volley:   cfg.volley   ?? 65,
      speed:    cfg.speed    ?? 75,
      stamina:  cfg.stamina  ?? 75,
      mental:   cfg.mental   ?? 75,
    };

    // Atributos dinâmicos
    this.energy     = 100;
    this.confidence = 50;
    this.position   = 'baseline'; // 'baseline' | 'net'

    // Estatísticas da partida
    this.stats = { aces: 0, winners: 0, unforcedErrors: 0, forcedErrors: 0, doubleFaults: 0 };
  }

  /**
   * Valor efetivo do atributo após fadiga e confiança.
   * Abaixo de 50% de energia aplica penalidade crescente.
   */
  effectiveAttr(attrName) {
    let base = this.attrs[attrName];

    if (this.energy < 50) {
      const penalty = (50 - this.energy) * 0.6; // até -30 com energia zero
      base = Math.max(20, base - penalty);
    }

    const confBonus = (this.confidence - 50) * 0.2; // -10 a +10
    return Math.min(99, Math.max(10, base + confBonus));
  }

  drainEnergy(amount) {
    this.energy = Math.max(0, this.energy - amount);
  }

  /** Recuperação entre pontos baseada no atributo Resistência e superfície. */
  recoverBetweenPoints(surfaceId) {
    const base  = 8 + (this.attrs.stamina / 99) * 6;
    const mod   = surfaceId === 'clay' ? 0.7 : surfaceId === 'grass' ? 1.2 : 1.0;
    this.energy = Math.min(100, this.energy + base * mod);
  }

  adjustConfidence(delta) {
    this.confidence = Math.max(0, Math.min(100, this.confidence + delta));
  }

  serialize() {
    return {
      id: this.id, name: this.name, attrs: this.attrs,
      energy: this.energy, confidence: this.confidence,
      position: this.position, stats: this.stats,
    };
  }

  static deserialize(data, cfg) {
    const p = new Player(cfg);
    p.energy     = data.energy;
    p.confidence = data.confidence;
    p.position   = data.position;
    p.stats      = data.stats;
    return p;
  }
}

// ─── CLASSE SCORE MANAGER ────────────────────────────────────
class ScoreManager {
  static POINT_NAMES = ['0', '15', '30', '40'];

  constructor() {
    this.sets       = [];       // [{p1, p2}]
    this.games      = [0, 0];
    this.points     = [0, 0];   // contagem bruta
    this.inTiebreak = false;
    this.serving    = 0;        // índice 0 ou 1
  }

  /** Retorna o display textual dos pontos (0/15/30/40/Deuce/Vant.) */
  get pointDisplay() {
    const [p1, p2] = this.points;
    if (this.inTiebreak) return [`${p1}`, `${p2}`];
    if (p1 >= 3 && p2 >= 3) {
      if (p1 === p2) return ['Deuce', 'Deuce'];
      return p1 > p2 ? ['Vant.', ''] : ['', 'Vant.'];
    }
    return [
      ScoreManager.POINT_NAMES[p1] ?? '0',
      ScoreManager.POINT_NAMES[p2] ?? '0',
    ];
  }

  /**
   * Atribui um ponto ao jogador de índice playerIndex.
   * Retorna { gameWon, setWon, matchWon }.
   */
  awardPoint(playerIndex) {
    const opp = 1 - playerIndex;
    this.points[playerIndex]++;

    let gameWon = false, setWon = false, matchWon = false;

    if (this.inTiebreak) {
      if (this.points[playerIndex] >= 7 &&
          this.points[playerIndex] - this.points[opp] >= 2) {
        gameWon = true;
      }
    } else {
      const [p1, p2] = this.points;
      if (p1 >= 3 && p2 >= 3) {
        if (Math.abs(p1 - p2) >= 2) gameWon = true;
      } else if (p1 >= 4 || p2 >= 4) {
        gameWon = true;
      }
    }

    if (gameWon) {
      this.games[playerIndex]++;
      this.points     = [0, 0];
      this.inTiebreak = false;
      this.serving    = 1 - this.serving; // alterna saque a cada game

      const [g1, g2] = this.games;
      const maxG = Math.max(g1, g2);
      const minG = Math.min(g1, g2);

      if ((maxG >= 6 && maxG - minG >= 2) || maxG === 7) {
        setWon = true;
        this.sets.push({ p1: this.games[0], p2: this.games[1] });
        this.games = [0, 0];

        const setsWon = this.sets.filter(s =>
          (playerIndex === 0 ? s.p1 : s.p2) > (playerIndex === 0 ? s.p2 : s.p1)
        ).length;
        if (setsWon >= 2) matchWon = true;

      } else if (g1 === 6 && g2 === 6) {
        this.inTiebreak = true;
      }
    }

    return { gameWon, setWon, matchWon };
  }

  serialize() {
    return {
      sets: this.sets, games: this.games, points: this.points,
      inTiebreak: this.inTiebreak, serving: this.serving,
    };
  }

  static deserialize(data) {
    const sm        = new ScoreManager();
    sm.sets         = data.sets;
    sm.games        = data.games;
    sm.points       = data.points;
    sm.inTiebreak   = data.inTiebreak;
    sm.serving      = data.serving;
    return sm;
  }
}

// ─── CLASSE MATCH ENGINE ─────────────────────────────────────
class MatchEngine {
  constructor(player1, player2, surfaceId = 'hard') {
    this.players         = [player1, player2];
    this.surfaceId       = surfaceId;
    this.surface         = SURFACES[surfaceId];
    this.score           = new ScoreManager();
    this.phase           = 'serve';   // serve | rally | net | point_end | match_over
    this.rallyCount      = 0;
    this.currentPointLog = [];
    this.matchLog        = [];
    this.matchOver       = false;
    this.winner          = null;
    this.humanIndex      = player1.isHuman ? 0 : 1;
  }

  // ── Getters de conveniência ──────────────────────────────
  get server()   { return this.players[this.score.serving]; }
  get receiver() { return this.players[1 - this.score.serving]; }

  get currentActor() {
    if (this.phase === 'serve') return this.server;
    return this.rallyCount % 2 === 0 ? this.server : this.receiver;
  }

  get isHumanTurn() {
    return this.currentActor.isHuman &&
           !this.matchOver &&
           this.phase !== 'point_end';
  }

  // ── Golpes disponíveis ───────────────────────────────────
  availableShots() {
    let pool = [];
    if      (this.phase === 'serve') pool = [SHOTS.serve_flat, SHOTS.serve_slice, SHOTS.serve_kick];
    else if (this.phase === 'net')   pool = [SHOTS.net_volley, SHOTS.net_dropshot, SHOTS.net_smash];
    else                             pool = [SHOTS.rally_regular, SHOTS.rally_forehand_winner,
                                             SHOTS.rally_slice_defensive, SHOTS.rally_approach];

    return pool.map(s => ({
      ...s,
      successChance: this._estimateSuccess(this.currentActor, s),
      canAfford:     this.currentActor.energy >= s.energyCost,
    }));
  }

  _estimateSuccess(player, shot) {
    const atk       = player.effectiveAttr(shot.attr);
    const surfBonus = this.phase === 'serve'
      ? this.surface.serveBonus
      : (player.position === 'net' ? this.surface.netBonus : 0);
    const raw = ((atk + surfBonus) / 99) * (1 - shot.baseRisk / 100) * 100;
    return Math.round(Math.min(97, Math.max(20, raw)));
  }

  // ── Resolução probabilística ─────────────────────────────
  _resolveShot(attacker, defender, shot) {
    const atkAttr   = attacker.effectiveAttr(shot.attr);
    const defAttr   = defender.effectiveAttr(shot.defAttr);
    const surfBonus = (shot.phase === 'serve' ? this.surface.serveBonus : 0) +
                      (attacker.position === 'net' ? this.surface.netBonus : 0);

    attacker.drainEnergy(shot.energyCost * this.surface.energyMult);

    const atkEff     = Math.min(99, atkAttr + surfBonus);
    const balance    = (atkEff - defAttr + 99) / 198;   // 0..1
    const riskFactor = shot.baseRisk / 100;
    const rand       = Math.random();

    const errorChance = riskFactor * (1 - balance * 0.8);
    if (rand < errorChance * 0.55) return OUTCOMES.NET;
    if (rand < errorChance)        return OUTCOMES.OUT;

    const winnerThreshold = 1 - (shot.power / 99) * balance * 0.45;
    if (rand > winnerThreshold) {
      return shot.phase === 'serve' ? OUTCOMES.ACE : OUTCOMES.WINNER;
    }

    return OUTCOMES.IN;
  }

  // ── Executa um golpe (humano ou IA) ─────────────────────
  executeShot(shotId) {
    if (this.matchOver || this.phase === 'point_end') return null;

    const shot     = SHOTS[shotId];
    const attacker = this.currentActor;
    const defender = attacker === this.players[0] ? this.players[1] : this.players[0];
    const outcome  = this._resolveShot(attacker, defender, shot);
    const lines    = shot.narrative(attacker.name, defender.name);

    let pointWinner = null;
    let nextPhase   = 'rally';

    switch (outcome) {
      case OUTCOMES.ACE:
        lines.push(`🏆 ACE! Impossível de alcançar! Ponto para ${attacker.name}!`);
        attacker.stats.aces++;
        attacker.stats.winners++;
        pointWinner = attacker;
        nextPhase   = 'point_end';
        break;

      case OUTCOMES.WINNER:
        lines.push(`🏆 WINNER! ${attacker.name} encerra o ponto em grande estilo!`);
        attacker.stats.winners++;
        pointWinner = attacker;
        nextPhase   = 'point_end';
        break;

      case OUTCOMES.NET:
        lines.push(`😬 NA REDE! Erro não-forçado de ${attacker.name}!`);
        attacker.stats.unforcedErrors++;
        pointWinner = defender;
        nextPhase   = 'point_end';
        break;

      case OUTCOMES.OUT:
        lines.push(`Out! Bola fora — erro de ${attacker.name}.`);
        attacker.stats.unforcedErrors++;
        pointWinner = defender;
        nextPhase   = 'point_end';
        break;

      case OUTCOMES.IN:
        if (shot.id === 'rally_approach') {
          attacker.position = 'net';
          lines.push(`${attacker.name} avança para a rede! Fase de voleio!`);
          nextPhase = 'net';
        } else if (shot.phase === 'serve') {
          lines.push(`${defender.name} vai devolver...`);
          nextPhase = 'rally';
        } else {
          const fatigue = this._checkFatigue(attacker, defender);
          if (fatigue) {
            lines.push(fatigue.msg);
            pointWinner = fatigue.winner;
            nextPhase   = 'point_end';
          } else {
            lines.push(`${defender.name} se prepara para responder...`);
            nextPhase = attacker.position === 'net' ? 'net' : 'rally';
          }
        }
        break;
    }

    this.currentPointLog.push(...lines);
    this.rallyCount++;

    // Ajuste de confiança
    if (pointWinner) {
      pointWinner.adjustConfidence(+8);
      const loser = pointWinner === this.players[0] ? this.players[1] : this.players[0];
      loser.adjustConfidence(-5);
    } else {
      defender.adjustConfidence(+2);
    }

    if (nextPhase === 'point_end' && pointWinner) {
      const idx    = this.players.indexOf(pointWinner);
      const result = this.score.awardPoint(idx);
      this._endPoint(pointWinner, result);
      this.phase = 'point_end';
    } else {
      this.phase = nextPhase;
    }

    this.save();
    return { outcome, lines, phase: this.phase, pointWinner };
  }

  _checkFatigue(attacker, defender) {
    if (attacker.energy < 15 && Math.random() < 0.35) {
      attacker.stats.unforcedErrors++;
      return { winner: defender, msg: `${attacker.name} está exausto! Erro não-forçado!` };
    }
    return null;
  }

  _endPoint(winner, result) {
    this.matchLog.push(...this.currentPointLog);
    this.currentPointLog = [];
    this.rallyCount      = 0;
    this.players.forEach(p => (p.position = 'baseline'));

    if (result.matchWon) {
      this.matchOver = true;
      this.winner    = winner;
      this.phase     = 'match_over';
      this.matchLog.push(`🏆🏆🏆 ${winner.name} VENCE A PARTIDA! 🏆🏆🏆`);
      return;
    }
    if (result.setWon)  this.matchLog.push(`── Set conquistado por ${winner.name}! ──`);
    if (result.gameWon) this.matchLog.push(`Game para ${winner.name}!`);

    this.players.forEach(p => p.recoverBetweenPoints(this.surfaceId));
    this.phase = 'serve';
  }

  // ── IA: escolha de golpe ─────────────────────────────────
  aiPickShot() {
    const shots = this.availableShots().filter(s => s.canAfford);
    if (!shots.length) return this.availableShots()[0].id;

    if (this.currentActor.energy < 25) {
      const safe = shots.find(s => s.baseRisk < 12);
      if (safe) return safe.id;
    }

    const weights = shots.map(s => Math.pow(s.successChance, 1.5));
    const total   = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < shots.length; i++) {
      r -= weights[i];
      if (r <= 0) return shots[i].id;
    }
    return shots[shots.length - 1].id;
  }

  // ── Persistência (LocalStorage) ──────────────────────────
  save() {
    const state = {
      players:         this.players.map(p => p.serialize()),
      surfaceId:       this.surfaceId,
      score:           this.score.serialize(),
      phase:           this.phase,
      rallyCount:      this.rallyCount,
      matchLog:        this.matchLog.slice(-120),
      currentPointLog: this.currentPointLog,
      matchOver:       this.matchOver,
      winnerId:        this.winner ? this.winner.id : null,
    };
    localStorage.setItem('tennisRPG_save', JSON.stringify(state));
  }

  static load(playerConfigs) {
    const raw = localStorage.getItem('tennisRPG_save');
    if (!raw) return null;
    try {
      const state   = JSON.parse(raw);
      const players = state.players.map((pd, i) => Player.deserialize(pd, playerConfigs[i]));
      const engine  = new MatchEngine(players[0], players[1], state.surfaceId);
      engine.score           = ScoreManager.deserialize(state.score);
      engine.phase           = state.phase;
      engine.rallyCount      = state.rallyCount;
      engine.matchLog        = state.matchLog;
      engine.currentPointLog = state.currentPointLog;
      engine.matchOver       = state.matchOver;
      if (state.winnerId) engine.winner = players.find(p => p.id === state.winnerId);
      return engine;
    } catch (e) {
      console.error('Falha ao carregar save:', e);
      return null;
    }
  }

  static clearSave() {
    localStorage.removeItem('tennisRPG_save');
  }
}
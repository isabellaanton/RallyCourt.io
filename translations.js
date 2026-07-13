/**
 * RallyCourt.io — Sistema de Traduções (PT / EN / FR)
 * Cobre toda a interface estática (HTML via data-i18n) e todo o
 * texto dinâmico gerado pelo motor do jogo (nomes de golpes, narrativas,
 * mensagens de log, placar, etc.) através da função t(key, vars).
 */

const TRANSLATIONS = {
  pt: {
    nav: { themeDark: "Escuro", themeLight: "Claro", tutorial: "Tutorial", pause: "Pausa" },
    register: {
      tagline: "Simulador Estratégico de Ténis",
      labelName: "Seu nome de jogador",
      placeholderName: "Ex: Rafael, Bia, Carlos...",
      labelLang: "Idioma / Language",
      enter: "ENTRAR NA ARENA",
    },
    playerSelect: {
      title: "ESCOLHA SEU JOGADOR",
      playingAs: "Jogando como:",
      male: "Masculino",
      female: "Feminino",
      surface: "Superfície",
      clayDesc: "Ralis longos · stamina crucial",
      hardDesc: "Equilibrado",
      grassDesc: "Pontos curtos · saque decisivo",
      chooseOpponent: "ESCOLHER OPONENTE",
    },
    opponentSelect: {
      title: "ESCOLHA O OPONENTE",
      subtitle: "Cada jogador tem estilo e IA únicos",
      back: "VOLTAR",
      startMatch: "INICIAR PARTIDA",
    },
    pauseModal: { title: "PAUSA" },
    tutorial: {
      title: "COMO JOGAR",
      subtitle: "RallyCourt.io — Guia de mecânicas",
      phasesHeading: "Fases do ponto",
      phasesText: "Cada ponto tem três fases: <strong>Saque</strong>, <strong>Rali</strong> e <strong>Rede</strong>. Você escolhe um golpe a cada turno — a IA responde automaticamente depois.",
      subServe: "3 opções de serviço",
      subRally: "construa o ponto",
      subNet: "ao subir à rede",
      successHeading: "Chance de sucesso",
      successText: "Cada golpe mostra uma porcentagem de sucesso calculada em tempo real: atributos do jogador, superfície, posição e stamina atual influenciam o número.",
      pillHigh: "70%+ seguro",
      pillMid: "45–69% arriscado",
      pillLow: "abaixo de 45% roleta",
      staminaHeading: "Stamina e Fadiga",
      staminaText: "A barra <strong>ST</strong> cai a cada golpe. Golpes poderosos custam mais. Com stamina baixa:",
      staminaItem1: "Abaixo de 50 — atributos penalizados",
      staminaItem2: "Abaixo de 25 — IA joga mais defensivo",
      staminaItem3: "Abaixo de 15 — risco de erro por exaustão",
      staminaNote: "Stamina <strong>recupera entre pontos</strong> — jogadores com alto atributo de resistência recuperam mais.",
      confidenceHeading: "Confiança",
      confidenceText: "A barra <strong>CF</strong> sobe ao ganhar pontos e cai ao errar. Alta confiança melhora atributos efetivos em até +10 pts; baixa confiança penaliza.",
      surfacesHeading: "Superfícies",
      surfClayItem: "<span class=\"tlist-surf-clay\">Saibro</span> — ralis longos, stamina 40% mais cara, defesa favorecida",
      surfHardItem: "<span class=\"tlist-surf-hard\">Rápida</span> — equilibrado, saque com pequeno bônus",
      surfGrassItem: "<span class=\"tlist-surf-grass\">Grama</span> — pontos curtos, saque decisivo, stamina barata",
      scoringHeading: "Pontuação",
      scoringText: "Pontuação oficial: 0 / 15 / 30 / 40 / Vantagem. Ganhe 6 games (com 2 de diferença) para fechar um set. Primeiro a vencer 2 sets leva a partida. Em 6–6, vai para tie-break.",
    },
    matchOver: { stats: "Estatísticas" },
    scoreboard: {
      tiebreak: "TIE-BREAK", fatigue: "FADIGA", you: "Você", opponent: "Oponente",
      pts: "pts", gms: "gms", waiting: "Aguardando início da partida...",
    },
    phase: { serve: "SAQUE", rally: "RALI", net: "REDE" },
    court: { you: "VOCÊ", opponent: "OPONENTE" },
    shots: {
      serve_flat: { name: "Saque Flat", desc: "Alta potência, alto risco.", n1: "{name} solta um saque FLAT devastador!", n2: "A bola voa a mais de 210 km/h!" },
      serve_slice: { name: "Saque Slice", desc: "Efeito lateral, risco moderado.", n1: "{name} usa slice para abrir a quadra.", n2: "Efeito lateral perigoso!" },
      serve_kick: { name: "Saque Kick", desc: "Seguro, quica alto.", n1: "{name} opta pelo kick seguro.", n2: "Quica alto e difícil de atacar." },
      rally_regular: { name: "Troca Regular", desc: "Golpe consistente e seguro.", n1: "{name} mantém o ponto com consistência." },
      rally_forehand_winner: { name: "Acelerar na Paralela", desc: "Agressivo, tenta encerrar o ponto.", n1: "{name} acelera na paralela!", n2: "Golpe agressivo tentando encerrar o ponto!" },
      rally_slice_defensive: { name: "Slice Defensivo", desc: "Defensivo, recupera posição.", n1: "{name} usa slice defensivo para recuperar posição." },
      rally_approach: { name: "Subir à Rede", desc: "Avança para a rede.", n1: "{name} avança para a rede após o golpe!" },
      net_volley: { name: "Voleio Firme", desc: "Voleio firme e preciso.", n1: "{name} executa um voleio preciso!" },
      net_dropshot: { name: "Drop Shot", desc: "Bola curta e surpresa.", n1: "{name} tenta o drop shot surpresa!", n2: "Bola morrendo na rede!" },
      net_smash: { name: "Smash", desc: "Potência máxima na rede.", n1: "{name} vai de SMASH!", n2: "Potência máxima acima da cabeça!" },
    },
    surfaces: { clay: { name: "Saibro" }, hard: { name: "Quadra Rápida" }, grass: { name: "Grama" } },
    outcomes: {
      ace: "ACE! Ponto direto para {name}!",
      winner: "WINNER! {name} encerra o ponto com maestria!",
      net: "Na rede! Erro de {name}.",
      out: "Fora! Erro de {name}.",
      forcedError: "Erro forçado! {name} pressionou demais.",
      climbsToNet: "{name} sobe à rede!",
      setFor: "Set para {name}!",
      gameFor: "Game para {name}!",
      matchWin: "{name} VENCE A PARTIDA!",
      recovers: "{name} recupera +{amount} ST",
      deuce: "Deuce",
      advantage: "Vant.",
    },
    stats: { aces: "Aces", winners: "Winners", unforcedErrors: "Erros não forçados", forcedErrors: "Erros forçados" },
    misc: {
      welcomeBack: "Bem-vindo de volta, {name}!",
      matchStarted: "Partida iniciada! {p1} vs {p2}",
      winnerAnnounce: "{name} VENCE!",
      aiThinkingName: "{name} pensando...",
      customStyle: "Jogador Customizado",
    },
    players: {
      alcaraz: "Atacante explosivo — forehand devastador e velocidade absurda",
      djokovic: "Defensor supremo — devolução e mental inabaláveis",
      sinner: "Batedor de linha — golpes planos de grande potência",
      medvedev: "Bloqueador clínico — devolução precisa e jogo de fundo sólido",
      federer: "All-court elegante — subida à rede e backhand slice icônicos",
      nadal: "Guerreiro do saibro — topspin pesado e resistência infinita",
      zverev: "Saque poderoso, forehand de alto nível",
      tsitsipas: "Artista da rede — subida constante, drop shots criativos",
      swiatek: "Rainha do saibro — topspin pesado e consistência brutal",
      sabalenka: "Potência pura — golpes devastadores e saque bomba",
      gauff: "Devolvedora excepcional, backhand de alto nível",
      rybakina: "Saque entre os melhores do tênis feminino — all-court poderosa",
      wta_williams: "Lenda absoluta — poder, velocidade e mental de campeã",
      halep: "Velocidade e defesa — consistência exemplar em qualquer superfície",
      pegula: "Sólida em todos os momentos — backhand e devolução consistentes",
      zheng: "Forehand explosivo e mentalidade guerreira",
    },
    // Chaves antigas (compatibilidade com trechos ainda simples)
    pause: "PAUSA", resume: "Retomar Partida", newGame: "Nova Partida", changeName: "Mudar nome",
    understood: "Entendido — Jogar", continue: "CONTINUAR — PRÓXIMO PONTO", playAgain: "JOGAR NOVAMENTE",
    liveNarration: "Narração ao vivo", opponentThinking: "Oponente calculando...",
  },

  en: {
    nav: { themeDark: "Dark", themeLight: "Light", tutorial: "Tutorial", pause: "Pause" },
    register: {
      tagline: "Tennis Strategy Simulator",
      labelName: "Your player name",
      placeholderName: "E.g.: Alex, Sam, Jordan...",
      labelLang: "Language",
      enter: "ENTER THE ARENA",
    },
    playerSelect: {
      title: "CHOOSE YOUR PLAYER",
      playingAs: "Playing as:",
      male: "Men",
      female: "Women",
      surface: "Surface",
      clayDesc: "Long rallies · stamina is key",
      hardDesc: "Balanced",
      grassDesc: "Short points · serve is decisive",
      chooseOpponent: "CHOOSE OPPONENT",
    },
    opponentSelect: {
      title: "CHOOSE THE OPPONENT",
      subtitle: "Each player has a unique style and AI",
      back: "BACK",
      startMatch: "START MATCH",
    },
    pauseModal: { title: "PAUSE" },
    tutorial: {
      title: "HOW TO PLAY",
      subtitle: "RallyCourt.io — Mechanics guide",
      phasesHeading: "Point phases",
      phasesText: "Each point has three phases: <strong>Serve</strong>, <strong>Rally</strong>, and <strong>Net</strong>. You choose a shot each turn — the AI responds automatically afterward.",
      subServe: "3 serve options",
      subRally: "build the point",
      subNet: "when approaching the net",
      successHeading: "Success chance",
      successText: "Each shot shows a success percentage calculated in real time: player attributes, surface, position, and current stamina all influence the number.",
      pillHigh: "70%+ safe",
      pillMid: "45–69% risky",
      pillLow: "below 45% gamble",
      staminaHeading: "Stamina and Fatigue",
      staminaText: "The <strong>ST</strong> bar drops with every shot. Powerful shots cost more. With low stamina:",
      staminaItem1: "Below 50 — attributes penalized",
      staminaItem2: "Below 25 — AI plays more defensively",
      staminaItem3: "Below 15 — risk of errors from exhaustion",
      staminaNote: "Stamina <strong>recovers between points</strong> — players with a high stamina attribute recover more.",
      confidenceHeading: "Confidence",
      confidenceText: "The <strong>CF</strong> bar rises when you win points and drops when you make errors. High confidence boosts effective attributes by up to +10 pts; low confidence penalizes them.",
      surfacesHeading: "Surfaces",
      surfClayItem: "<span class=\"tlist-surf-clay\">Clay</span> — long rallies, stamina costs 40% more, favors defense",
      surfHardItem: "<span class=\"tlist-surf-hard\">Hard</span> — balanced, serve gets a small bonus",
      surfGrassItem: "<span class=\"tlist-surf-grass\">Grass</span> — short points, decisive serve, cheap stamina",
      scoringHeading: "Scoring",
      scoringText: "Official scoring: 0 / 15 / 30 / 40 / Advantage. Win 6 games (by a 2-game margin) to close a set. First to win 2 sets takes the match. At 6–6, it goes to a tie-break.",
    },
    matchOver: { stats: "Statistics" },
    scoreboard: {
      tiebreak: "TIE-BREAK", fatigue: "FATIGUE", you: "You", opponent: "Opponent",
      pts: "pts", gms: "gms", waiting: "Waiting for the match to start...",
    },
    phase: { serve: "SERVE", rally: "RALLY", net: "NET" },
    court: { you: "YOU", opponent: "OPPONENT" },
    shots: {
      serve_flat: { name: "Flat Serve", desc: "High power, high risk.", n1: "{name} unleashes a devastating FLAT serve!", n2: "The ball flies at over 210 km/h!" },
      serve_slice: { name: "Slice Serve", desc: "Sidespin, moderate risk.", n1: "{name} uses slice to open up the court.", n2: "Dangerous sidespin!" },
      serve_kick: { name: "Kick Serve", desc: "Safe, high bounce.", n1: "{name} goes for the safe kick serve.", n2: "High bounce, hard to attack." },
      rally_regular: { name: "Regular Rally", desc: "Consistent, safe shot.", n1: "{name} keeps the point going with consistency." },
      rally_forehand_winner: { name: "Down-the-Line Blast", desc: "Aggressive, tries to end the point.", n1: "{name} blasts it down the line!", n2: "Aggressive shot trying to end the point!" },
      rally_slice_defensive: { name: "Defensive Slice", desc: "Defensive, recovers position.", n1: "{name} uses a defensive slice to recover position." },
      rally_approach: { name: "Approach the Net", desc: "Advances to the net.", n1: "{name} advances to the net after the shot!" },
      net_volley: { name: "Firm Volley", desc: "Firm and precise volley.", n1: "{name} executes a precise volley!" },
      net_dropshot: { name: "Drop Shot", desc: "Short, surprise shot.", n1: "{name} attempts a surprise drop shot!", n2: "The ball dies at the net!" },
      net_smash: { name: "Smash", desc: "Maximum power at the net.", n1: "{name} goes for the SMASH!", n2: "Maximum power overhead!" },
    },
    surfaces: { clay: { name: "Clay" }, hard: { name: "Hard Court" }, grass: { name: "Grass" } },
    outcomes: {
      ace: "ACE! Direct point for {name}!",
      winner: "WINNER! {name} finishes the point with mastery!",
      net: "Into the net! Error by {name}.",
      out: "Out! Error by {name}.",
      forcedError: "Forced error! {name} applied too much pressure.",
      climbsToNet: "{name} moves up to the net!",
      setFor: "Set for {name}!",
      gameFor: "Game for {name}!",
      matchWin: "{name} WINS THE MATCH!",
      recovers: "{name} recovers +{amount} ST",
      deuce: "Deuce",
      advantage: "Ad.",
    },
    stats: { aces: "Aces", winners: "Winners", unforcedErrors: "Unforced errors", forcedErrors: "Forced errors" },
    misc: {
      welcomeBack: "Welcome back, {name}!",
      matchStarted: "Match started! {p1} vs {p2}",
      winnerAnnounce: "{name} WINS!",
      aiThinkingName: "{name} thinking...",
      customStyle: "Custom Player",
    },
    players: {
      alcaraz: "Explosive attacker — devastating forehand and blistering speed",
      djokovic: "Supreme defender — unshakable return and mental strength",
      sinner: "Line hitter — powerful flat groundstrokes",
      medvedev: "Clinical blocker — precise return and solid baseline game",
      federer: "Elegant all-courter — iconic net approaches and slice backhand",
      nadal: "Clay-court warrior — heavy topspin and endless stamina",
      zverev: "Powerful serve, top-tier forehand",
      tsitsipas: "Net artist — constant approaches, creative drop shots",
      swiatek: "Queen of clay — heavy topspin and brutal consistency",
      sabalenka: "Pure power — devastating groundstrokes and a bomb serve",
      gauff: "Exceptional returner, top-tier backhand",
      rybakina: "One of the best serves in women's tennis — powerful all-courter",
      wta_williams: "Absolute legend — power, speed, and a champion's mindset",
      halep: "Speed and defense — exemplary consistency on any surface",
      pegula: "Solid at every moment — consistent backhand and return",
      zheng: "Explosive forehand and warrior mentality",
    },
    pause: "PAUSE", resume: "Resume Match", newGame: "New Match", changeName: "Change Name",
    understood: "Got it — Play", continue: "CONTINUE — NEXT POINT", playAgain: "PLAY AGAIN",
    liveNarration: "Live Narration", opponentThinking: "Opponent thinking...",
  },

  fr: {
    nav: { themeDark: "Sombre", themeLight: "Clair", tutorial: "Tutoriel", pause: "Pause" },
    register: {
      tagline: "Simulateur Stratégique de Tennis",
      labelName: "Votre nom de joueur",
      placeholderName: "Ex : Alex, Sam, Julien...",
      labelLang: "Langue",
      enter: "ENTRER DANS L'ARÈNE",
    },
    playerSelect: {
      title: "CHOISISSEZ VOTRE JOUEUR",
      playingAs: "Vous jouez :",
      male: "Hommes",
      female: "Femmes",
      surface: "Surface",
      clayDesc: "Échanges longs · endurance essentielle",
      hardDesc: "Équilibré",
      grassDesc: "Points courts · service décisif",
      chooseOpponent: "CHOISIR L'ADVERSAIRE",
    },
    opponentSelect: {
      title: "CHOISISSEZ L'ADVERSAIRE",
      subtitle: "Chaque joueur a un style et une IA uniques",
      back: "RETOUR",
      startMatch: "DÉMARRER LE MATCH",
    },
    pauseModal: { title: "PAUSE" },
    tutorial: {
      title: "COMMENT JOUER",
      subtitle: "RallyCourt.io — Guide des mécaniques",
      phasesHeading: "Phases du point",
      phasesText: "Chaque point comporte trois phases : <strong>Service</strong>, <strong>Échange</strong> et <strong>Filet</strong>. Vous choisissez un coup à chaque tour — l'IA répond automatiquement ensuite.",
      subServe: "3 options de service",
      subRally: "construisez le point",
      subNet: "en montant au filet",
      successHeading: "Chance de réussite",
      successText: "Chaque coup affiche un pourcentage de réussite calculé en temps réel : les attributs du joueur, la surface, la position et l'endurance actuelle influencent ce chiffre.",
      pillHigh: "70 %+ sûr",
      pillMid: "45–69 % risqué",
      pillLow: "moins de 45 % roulette",
      staminaHeading: "Endurance et Fatigue",
      staminaText: "La barre <strong>ST</strong> diminue à chaque coup. Les coups puissants coûtent plus cher. Avec une endurance faible :",
      staminaItem1: "En dessous de 50 — attributs pénalisés",
      staminaItem2: "En dessous de 25 — l'IA joue plus défensivement",
      staminaItem3: "En dessous de 15 — risque de faute par épuisement",
      staminaNote: "L'endurance <strong>récupère entre les points</strong> — les joueurs avec un attribut d'endurance élevé récupèrent davantage.",
      confidenceHeading: "Confiance",
      confidenceText: "La barre <strong>CF</strong> augmente quand vous gagnez des points et baisse en cas d'erreur. Une confiance élevée améliore les attributs effectifs jusqu'à +10 pts ; une confiance faible les pénalise.",
      surfacesHeading: "Surfaces",
      surfClayItem: "<span class=\"tlist-surf-clay\">Terre battue</span> — échanges longs, endurance 40 % plus coûteuse, défense favorisée",
      surfHardItem: "<span class=\"tlist-surf-hard\">Dur</span> — équilibré, léger bonus au service",
      surfGrassItem: "<span class=\"tlist-surf-grass\">Gazon</span> — points courts, service décisif, endurance économique",
      scoringHeading: "Score",
      scoringText: "Score officiel : 0 / 15 / 30 / 40 / Avantage. Remportez 6 jeux (avec 2 d'écart) pour conclure un set. Le premier à gagner 2 sets remporte le match. À 6–6, place au tie-break.",
    },
    matchOver: { stats: "Statistiques" },
    scoreboard: {
      tiebreak: "TIE-BREAK", fatigue: "FATIGUE", you: "Vous", opponent: "Adversaire",
      pts: "pts", gms: "jeux", waiting: "En attente du début du match...",
    },
    phase: { serve: "SERVICE", rally: "ÉCHANGE", net: "FILET" },
    court: { you: "VOUS", opponent: "ADVERSAIRE" },
    shots: {
      serve_flat: { name: "Service à Plat", desc: "Grande puissance, risque élevé.", n1: "{name} envoie un service à PLAT dévastateur !", n2: "La balle file à plus de 210 km/h !" },
      serve_slice: { name: "Service Slicé", desc: "Effet latéral, risque modéré.", n1: "{name} utilise le slice pour ouvrir le court.", n2: "Effet latéral dangereux !" },
      serve_kick: { name: "Service Lifté", desc: "Sûr, rebond haut.", n1: "{name} opte pour le service lifté, plus sûr.", n2: "Rebond haut, difficile à attaquer." },
      rally_regular: { name: "Échange Régulier", desc: "Coup solide et sûr.", n1: "{name} maintient l'échange avec constance." },
      rally_forehand_winner: { name: "Accélération en Ligne", desc: "Agressif, tente de conclure le point.", n1: "{name} accélère en ligne !", n2: "Coup agressif pour tenter de conclure le point !" },
      rally_slice_defensive: { name: "Slice Défensif", desc: "Défensif, permet de se replacer.", n1: "{name} utilise un slice défensif pour se replacer." },
      rally_approach: { name: "Montée au Filet", desc: "Avance vers le filet.", n1: "{name} avance vers le filet après le coup !" },
      net_volley: { name: "Volée Ferme", desc: "Volée ferme et précise.", n1: "{name} exécute une volée précise !" },
      net_dropshot: { name: "Amortie", desc: "Balle courte surprise.", n1: "{name} tente l'amortie surprise !", n2: "La balle meurt juste après le filet !" },
      net_smash: { name: "Smash", desc: "Puissance maximale au filet.", n1: "{name} envoie un SMASH !", n2: "Puissance maximale au-dessus de la tête !" },
    },
    surfaces: { clay: { name: "Terre Battue" }, hard: { name: "Court Dur" }, grass: { name: "Gazon" } },
    outcomes: {
      ace: "ACE ! Point direct pour {name} !",
      winner: "WINNER ! {name} conclut le point avec brio !",
      net: "Dans le filet ! Faute de {name}.",
      out: "Faute ! Erreur de {name}.",
      forcedError: "Faute provoquée ! {name} a mis trop de pression.",
      climbsToNet: "{name} monte au filet !",
      setFor: "Set pour {name} !",
      gameFor: "Jeu pour {name} !",
      matchWin: "{name} REMPORTE LE MATCH !",
      recovers: "{name} récupère +{amount} ST",
      deuce: "Égalité",
      advantage: "Av.",
    },
    stats: { aces: "Aces", winners: "Winners", unforcedErrors: "Fautes directes", forcedErrors: "Fautes provoquées" },
    misc: {
      welcomeBack: "Bon retour, {name} !",
      matchStarted: "Match commencé ! {p1} vs {p2}",
      winnerAnnounce: "{name} GAGNE !",
      aiThinkingName: "{name} réfléchit...",
      customStyle: "Joueur Personnalisé",
    },
    players: {
      alcaraz: "Attaquant explosif — coup droit dévastateur et vitesse folle",
      djokovic: "Défenseur suprême — retour et mental inébranlables",
      sinner: "Frappeur de ligne — coups plats surpuissants",
      medvedev: "Bloqueur clinique — retour précis et jeu de fond solide",
      federer: "Joueur complet élégant — montées au filet et revers slicé emblématiques",
      nadal: "Guerrier de la terre battue — lift lourd et endurance infinie",
      zverev: "Service puissant, coup droit de haut niveau",
      tsitsipas: "Artiste du filet — montées constantes, amorties créatives",
      swiatek: "Reine de la terre battue — lift lourd et constance implacable",
      sabalenka: "Puissance pure — coups dévastateurs et service canon",
      gauff: "Retourneuse exceptionnelle, revers de haut niveau",
      rybakina: "Un des meilleurs services du tennis féminin — joueuse complète puissante",
      wta_williams: "Légende absolue — puissance, vitesse et mental de championne",
      halep: "Vitesse et défense — constance exemplaire sur toute surface",
      pegula: "Solide à tout moment — revers et retour constants",
      zheng: "Coup droit explosif et mentalité de guerrière",
    },
    pause: "PAUSE", resume: "Reprendre le Match", newGame: "Nouveau Match", changeName: "Changer le nom",
    understood: "Compris — Jouer", continue: "CONTINUER — POINT SUIVANT", playAgain: "REJOUER",
    liveNarration: "Narration en direct", opponentThinking: "Adversaire réfléchit...",
  }
};

let currentLang = localStorage.getItem('tennisRPG_lang') || 'pt';

/**
 * Busca uma tradução por caminho com pontos (ex: "shots.serve_flat.name")
 * e substitui placeholders {var} pelos valores fornecidos em `vars`.
 * Também aceita chaves simples de nível superior (compatibilidade).
 */
function t(key, vars) {
  const resolve = (lang) => {
    const path = key.split('.');
    let node = TRANSLATIONS[lang];
    for (const p of path) {
      if (node == null) return undefined;
      node = node[p];
    }
    return node;
  };

  let node = resolve(currentLang);
  if (node === undefined) node = resolve('pt');
  if (node === undefined) return key;
  if (typeof node !== 'string') return node;

  if (vars) {
    return node.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
  }
  return node;
}

function setLanguage(lang) {
  if (TRANSLATIONS[lang]) {
    currentLang = lang;
    localStorage.setItem('tennisRPG_lang', lang);
    updateAllTexts();
    if (typeof onLanguageChanged === 'function') onLanguageChanged();
  }
}

/**
 * Atualiza todos os elementos estáticos marcados com data-i18n /
 * data-i18n-html / data-i18n-placeholder, além de alguns elementos
 * dinâmicos por id (mantidos por compatibilidade).
 */
function updateAllTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });

  const dark = document.body.classList.contains('dark');
  const themeBtn = document.getElementById('btn-theme');
  if (themeBtn) themeBtn.textContent = dark ? t('nav.themeLight') : t('nav.themeDark');

  document.getElementById('btn-continue') && (document.getElementById('btn-continue').textContent = t('continue'));
  document.getElementById('btn-play-again') && (document.getElementById('btn-play-again').textContent = t('playAgain'));

  const sel = document.getElementById('lang-select');
  if (sel) sel.value = currentLang;
}
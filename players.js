// ============================================================
//  RallyCourt.io — Elenco de Jogadores
//  Os textos de "style" abaixo são o fallback em PT; as traduções
//  EN/FR de cada jogador ficam em translations.js (chave players.<id>).
// ============================================================

// ─── JOGADORES MASCULINOS ─────────────────────────────────────
const MALE_PLAYERS = [
  {
    id: 'alcaraz', name: 'Alcaraz', fullName: 'Carlos Alcaraz',
    country: '🇪🇸', gender: 'M',
    style: 'Atacante explosivo — forehand devastador e velocidade absurda',
    playstyle: 'aggressive_baseliner',
    // Atributos base
    serve: 88, return: 91, forehand: 97, backhand: 85,
    volley: 78, speed: 96, stamina: 89, mental: 88,
    // Modificadores táticos (influenciam escolha de golpe da IA)
    aiWeights: { serve_flat: 1.3, rally_forehand_winner: 1.6, rally_approach: 1.4, net_smash: 1.5 },
    preferredSurface: 'clay',
  },
  {
    id: 'djokovic', name: 'Djokovic', fullName: 'Novak Djokovic',
    country: '🇷🇸', gender: 'M',
    style: 'Defensor supremo — devolução e mental inabaláveis',
    playstyle: 'counter_puncher',
    serve: 90, return: 99, forehand: 94, backhand: 98,
    volley: 82, speed: 93, stamina: 97, mental: 99,
    aiWeights: { rally_regular: 1.5, rally_slice_defensive: 1.6, serve_kick: 1.4 },
    preferredSurface: 'hard',
  },
  {
    id: 'sinner', name: 'Sinner', fullName: 'Jannik Sinner',
    country: '🇮🇹', gender: 'M',
    style: 'Batedor de linha — golpes planos de grande potência',
    playstyle: 'aggressive_baseliner',
    serve: 89, return: 93, forehand: 95, backhand: 94,
    volley: 76, speed: 88, stamina: 92, mental: 90,
    aiWeights: { rally_forehand_winner: 1.5, serve_flat: 1.4, rally_regular: 1.2 },
    preferredSurface: 'hard',
  },
  {
    id: 'medvedev', name: 'Medvedev', fullName: 'Daniil Medvedev',
    country: '🇷🇺', gender: 'M',
    style: 'Bloqueador clínico — devolução precisa e jogo de fundo sólido',
    playstyle: 'counter_puncher',
    serve: 91, return: 94, forehand: 86, backhand: 92,
    volley: 80, speed: 85, stamina: 88, mental: 93,
    aiWeights: { rally_slice_defensive: 1.5, serve_flat: 1.4, rally_regular: 1.4 },
    preferredSurface: 'hard',
  },
  {
    id: 'federer', name: 'Federer', fullName: 'Roger Federer',
    country: '🇨🇭', gender: 'M',
    style: 'All-court elegante — subida à rede e backhand slice icônicos',
    playstyle: 'all_court',
    serve: 93, return: 88, forehand: 95, backhand: 91,
    volley: 95, speed: 87, stamina: 85, mental: 96,
    aiWeights: { rally_approach: 1.7, net_volley: 1.8, serve_slice: 1.5, net_dropshot: 1.4 },
    preferredSurface: 'grass',
  },
  {
    id: 'nadal', name: 'Nadal', fullName: 'Rafael Nadal',
    country: '🇪🇸', gender: 'M',
    style: 'Guerreiro do saibro — topspin pesado e resistência infinita',
    playstyle: 'heavy_topspin',
    serve: 86, return: 90, forehand: 99, backhand: 88,
    volley: 74, speed: 90, stamina: 99, mental: 98,
    aiWeights: { rally_forehand_winner: 1.8, rally_regular: 1.5, rally_slice_defensive: 1.3 },
    preferredSurface: 'clay',
  },
  {
    id: 'zverev', name: 'Zverev', fullName: 'Alexander Zverev',
    country: '🇩🇪', gender: 'M',
    style: 'Saque poderoso, forehand de alto nível',
    playstyle: 'big_server',
    serve: 95, return: 84, forehand: 90, backhand: 85,
    volley: 72, speed: 82, stamina: 84, mental: 80,
    aiWeights: { serve_flat: 1.9, serve_kick: 1.4, rally_forehand_winner: 1.4 },
    preferredSurface: 'clay',
  },
  {
    id: 'tsitsipas', name: 'Tsitsipas', fullName: 'Stefanos Tsitsipas',
    country: '🇬🇷', gender: 'M',
    style: 'Artista da rede — subida constante, drop shots criativos',
    playstyle: 'all_court',
    serve: 87, return: 83, forehand: 91, backhand: 80,
    volley: 89, speed: 84, stamina: 82, mental: 82,
    aiWeights: { rally_approach: 1.6, net_dropshot: 1.8, net_volley: 1.5 },
    preferredSurface: 'clay',
  },
];

// ─── JOGADORES FEMININOS ──────────────────────────────────────
const FEMALE_PLAYERS = [
  {
    id: 'swiatek', name: 'Świątek', fullName: 'Iga Świątek',
    country: '🇵🇱', gender: 'F',
    style: 'Rainha do saibro — topspin pesado e consistência brutal',
    playstyle: 'heavy_topspin',
    serve: 83, return: 95, forehand: 97, backhand: 88,
    volley: 72, speed: 90, stamina: 94, mental: 96,
    aiWeights: { rally_forehand_winner: 1.8, rally_regular: 1.5, rally_slice_defensive: 1.2 },
    preferredSurface: 'clay',
  },
  {
    id: 'sabalenka', name: 'Sabalenka', fullName: 'Aryna Sabalenka',
    country: '🇧🇾', gender: 'F',
    style: 'Potência pura — golpes devastadores e saque bomba',
    playstyle: 'aggressive_baseliner',
    serve: 92, return: 85, forehand: 93, backhand: 90,
    volley: 70, speed: 83, stamina: 86, mental: 83,
    aiWeights: { serve_flat: 1.7, rally_forehand_winner: 1.6, serve_kick: 1.3 },
    preferredSurface: 'hard',
  },
  {
    id: 'gauff', name: 'Gauff', fullName: 'Coco Gauff',
    country: '🇺🇸', gender: 'F',
    style: 'Devolvedora excepcional, backhand de alto nível',
    playstyle: 'counter_puncher',
    serve: 82, return: 93, forehand: 87, backhand: 92,
    volley: 74, speed: 87, stamina: 88, mental: 89,
    aiWeights: { rally_regular: 1.6, rally_slice_defensive: 1.4, serve_kick: 1.3 },
    preferredSurface: 'hard',
  },
  {
    id: 'rybakina', name: 'Rybakina', fullName: 'Elena Rybakina',
    country: '🇰🇿', gender: 'F',
    style: 'Saque entre os melhores do tênis feminino — all-court poderosa',
    playstyle: 'big_server',
    serve: 94, return: 84, forehand: 88, backhand: 85,
    volley: 78, speed: 80, stamina: 82, mental: 84,
    aiWeights: { serve_flat: 1.9, serve_slice: 1.4, rally_approach: 1.3 },
    preferredSurface: 'grass',
  },
  {
    id: 'wta_williams', name: 'S. Williams', fullName: 'Serena Williams',
    country: '🇺🇸', gender: 'F',
    style: 'Lenda absoluta — poder, velocidade e mental de campeã',
    playstyle: 'aggressive_baseliner',
    serve: 96, return: 90, forehand: 94, backhand: 86,
    volley: 78, speed: 85, stamina: 90, mental: 99,
    aiWeights: { serve_flat: 1.8, rally_forehand_winner: 1.6, net_smash: 1.5 },
    preferredSurface: 'hard',
  },
  {
    id: 'halep', name: 'Halep', fullName: 'Simona Halep',
    country: '🇷🇴', gender: 'F',
    style: 'Velocidade e defesa — consistência exemplar em qualquer superfície',
    playstyle: 'counter_puncher',
    serve: 78, return: 92, forehand: 86, backhand: 87,
    volley: 76, speed: 94, stamina: 91, mental: 92,
    aiWeights: { rally_slice_defensive: 1.6, rally_regular: 1.5, rally_approach: 1.2 },
    preferredSurface: 'clay',
  },
  {
    id: 'pegula', name: 'Pegula', fullName: 'Jessica Pegula',
    country: '🇺🇸', gender: 'F',
    style: 'Sólida em todos os momentos — backhand e devolução consistentes',
    playstyle: 'all_court',
    serve: 80, return: 89, forehand: 85, backhand: 90,
    volley: 74, speed: 82, stamina: 86, mental: 86,
    aiWeights: { rally_regular: 1.5, rally_slice_defensive: 1.3, serve_kick: 1.4 },
    preferredSurface: 'hard',
  },
  {
    id: 'zheng', name: 'Zheng', fullName: 'Qinwen Zheng',
    country: '🇨🇳', gender: 'F',
    style: 'Forehand explosivo e mentalidade guerreira',
    playstyle: 'aggressive_baseliner',
    serve: 84, return: 86, forehand: 92, backhand: 82,
    volley: 70, speed: 88, stamina: 85, mental: 87,
    aiWeights: { rally_forehand_winner: 1.7, serve_flat: 1.3, rally_approach: 1.2 },
    preferredSurface: 'hard',
  },
];

// ─── ROSTER COMPLETO ──────────────────────────────────────────
const ALL_PLAYERS = [...MALE_PLAYERS, ...FEMALE_PLAYERS];

// Configuração padrão (usada pelo MatchEngine.load como fallback)
const PLAYER_CONFIGS = [MALE_PLAYERS[0], MALE_PLAYERS[1]];
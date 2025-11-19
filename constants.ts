
import { LevelConfig, PowerUpType, GlitchMod, NarrativeScenario, Difficulty, Character } from './types';

export const LANE_WIDTH = 2.5;
export const JUMP_FORCE = 0.25;
export const GRAVITY = -0.015;
export const PLAYER_Z_OFFSET = 0;

export const DIFFICULTY_MODS: Record<Difficulty, { speed: number, density: number, score: number, coinMultiplier: number, label: string, color: string }> = {
  SCRIPT_KIDDIE: {
    speed: 0.55,     
    density: 0.4,    
    score: 0.5,      
    coinMultiplier: 0.5, 
    label: "NOOB",
    color: "#4ade80" 
  },
  CYBER_PUNK: {
    speed: 1.0,
    density: 1.0,
    score: 1.0,
    coinMultiplier: 1.0, 
    label: "HACKER",
    color: "#22d3ee" 
  },
  NET_RUNNER: {
    speed: 1.5,      
    density: 1.6,    
    score: 2.5,      
    coinMultiplier: 2.5, 
    label: "GOD",
    color: "#ef4444" 
  }
};

export const CHARACTERS: Character[] = [
  {
    id: 'DEFAULT',
    name: 'Neon Guy',
    description: 'Il protagonista generico. Non ha diritti d\'autore da pagare.',
    color: '#38bdf8',
    emissive: '#0ea5e9',
    shape: 'BOX',
    unlockCost: 0,
    skillId: 'DASH',
    skillName: 'Sprint.exe',
    skillDescription: 'Diventa invulnerabile e scatta in avanti ignorando le leggi della fisica.',
    skillCooldown: 15,
    skillDuration: 3
  },
  {
    id: 'GOKU_FAKE',
    name: 'Gokuccio',
    description: 'Urla per 30 minuti per cambiare una lampadina. Se perde, i capelli diventano gialli per l\'imbarazzo.',
    color: '#facc15', 
    emissive: '#fbbf24',
    shape: 'SPHERE',
    unlockCost: 500,
    skillId: 'BLAST',
    skillName: 'Kame-Boom',
    skillDescription: 'Spara un raggio energetico (copyright free) che distrugge tutto davanti a sé.',
    skillCooldown: 25
  },
  {
    id: 'NARUTO_FAKE',
    name: 'Volpe di Paglia',
    description: 'Vuole diventare sindaco del condominio. Corre con le braccia all\'indietro.',
    color: '#f97316', 
    emissive: '#ea580c',
    shape: 'TETRA',
    unlockCost: 1000,
    skillId: 'CLONE',
    skillName: 'Shadow Shield',
    skillDescription: 'Evoca un clone d\'ombra (o uno scudo, budget limitato) che assorbe un colpo mortale.',
    skillCooldown: 30,
    skillDuration: 5
  },
  {
    id: 'LUFFY_FAKE',
    name: 'Gomma Boy',
    description: 'Ha mangiato un frutto scaduto. Ora si allunga ma non può fare il bagno dopo mangiato.',
    color: '#ef4444', 
    emissive: '#dc2626',
    shape: 'BOX',
    unlockCost: 1500,
    skillId: 'MAGNET',
    skillName: 'Grab Everything',
    skillDescription: 'Allunga le braccia magnetiche per rubare monete da tutte le corsie.',
    skillCooldown: 20,
    skillDuration: 6
  },
  {
    id: 'EVA_FAKE',
    name: 'Robot Depresso',
    description: 'Suo padre non gli vuole bene. Deve salire sul robot o l\'umanità diventerà succo d\'arancia.',
    color: '#a855f7', 
    emissive: '#7e22ce',
    shape: 'TETRA',
    unlockCost: 2000,
    skillId: 'SLOW_MO',
    skillName: 'Sad Time',
    skillDescription: 'Entra in crisi esistenziale, rallentando il tempo per tutti.',
    skillCooldown: 35,
    skillDuration: 5
  },
  {
    id: 'SAILOR_FAKE',
    name: 'Luna Storta',
    description: 'Punisce il crimine in nome della Luna, ma solo se non ha sonno. Il suo gatto parla ma dice solo insulti.',
    color: '#ec4899', 
    emissive: '#db2777',
    shape: 'SPHERE',
    unlockCost: 2500,
    skillId: 'ALCHEMY',
    skillName: 'Moon Prorate',
    skillDescription: 'Usa la magia lunare per trasformare gli ostacoli vicini in monete.',
    skillCooldown: 25
  }
];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    speed: 0.65, 
    obstacleDensity: 0.5, 
    color: '#0f172a', 
    groundColor: '#1e293b',
    threshold: 2000 
  },
  {
    id: 2,
    speed: 0.8, 
    obstacleDensity: 0.6, 
    color: '#4c1d95', 
    groundColor: '#5b21b6',
    threshold: 6000 
  },
  {
    id: 3,
    speed: 0.95, 
    obstacleDensity: 0.7, 
    color: '#7f1d1d', 
    groundColor: '#991b1b',
    threshold: 12000 
  }
];

export const INFINITE_SCALING = {
  SPEED_INCREMENT: 0.05, 
  DENSITY_INCREMENT: 0.03, 
  DENSITY_CAP: 0.85, 
  SCORE_THRESHOLD_INCREMENT: 8000 
};

export const LEVEL_END_LORE = [
  {
    title: "MEMORY LEAK PLUGGED",
    text: "Hai raggiunto il bordo della mappa texture. Dietro il muro invisibile non c'era il nulla, ma una stanza piena di calzini spaiati che l'universo aveva perso. Hai rubato un calzino sinistro. La fisica ne risente."
  },
  {
    title: "GARBAGE COLLECTOR ESCAPED",
    text: "Sei corso più veloce dell'algoritmo di pulizia. Ora i dati spazzatura ti venerano come un dio. Un tostapane volante ti chiede se conosci la strada per il Wi-Fi del paradiso."
  },
  {
    title: "SOURCE CODE BREACH",
    text: "Hai trovato il punto e virgola mancante che teneva insieme la realtà. L'hai cancellato per sbaglio. I colori ora hanno sapore e il tempo scorre in diagonale. Ottimo lavoro."
  },
  {
    title: "RENDER DISTANCE EXCEEDED",
    text: "Hai corso così forte che la scheda video dell'universo ha chiesto ferie. Quello che vedi ora è rendering software puro. Quei pixel morti? Sono le tue speranze."
  },
  {
    title: "404 REALITY NOT FOUND",
    text: "Il server in cui vivi è andato offline. Sei ufficialmente in cache. Se smetti di muoverti, verrai cancellato per liberare spazio su disco."
  },
  {
    title: "BUFFER OVERFLOW",
    text: "Hai accumulato troppi dati inutili nel cervello. Per fare spazio, il sistema ha cancellato il ricordo del tuo primo bacio e lo ha sostituito con la pubblicità di uno shampoo."
  },
  {
    title: "PACKET LOSS DETECTED",
    text: "Hai perso il 30% della tua anima durante il trasferimento dati. Ti senti più leggero, ma ora ridi istericamente ogni volta che vedi un codice a barre."
  },
  {
    title: "ADMIN PRIVILEGES DENIED",
    text: "Hai provato a chiedere un aumento di stipendio all'universo. Risposta: 'SUDO command not found'. Torna a correre, schiavo del sistema."
  },
  {
    title: "GPU OVERHEAT",
    text: "L'universo puzza di plastica bruciata. Le stelle si stanno sciogliendo colando sul cielo. È bellissimo, ma forse dovresti smettere di overcloccare le tue gambe."
  },
  {
    title: "TEXTURE POP-IN",
    text: "Sei arrivato prima che il mondo venisse caricato. Hai visto gli sviluppatori in pausa caffè. Erano gatti giganti che giocavano con il gomitolo del destino."
  },
  {
    title: "BLUE SCREEN OF DEATH",
    text: "Tutto è diventato blu per un secondo. Non era il cielo. Era un crash di sistema. Ti sei riavviato in modalità provvisoria: niente emozioni, solo velocità."
  },
  {
    title: "DEAD PIXEL FIX",
    text: "Hai preso a pugni un pixel morto nel cielo. Ora c'è un buco nero grande come una moneta. Risucchia solo i pensieri negativi e le chiavi della macchina."
  },
  {
    title: "FPS DROP",
    text: "La vita sta lagghando. Vedi le cose a scatti. Approfittane per schivare le responsabilità tra un frame e l'altro."
  },
  {
    title: "INFINITE LOOP",
    text: "Hai la sensazione di aver già letto questo messaggio? Hai la sensazione di aver già letto questo messaggio? Hai la sensazione di aver già letto questo messaggio?"
  },
  {
    title: "PING TOO HIGH",
    text: "Hai risposto a un insulto con 3 secondi di ritardo. Il momento era passato. L'universo ride del tuo lag."
  },
  {
    title: "VPN CONNECTED",
    text: "Ora sembri connesso dalla Norvegia. Improvvisamente ti piace il Black Metal e senti freddo. I firewall nemici non ti vedono."
  },
  {
    title: "CRYPTOMINER INSTALLED",
    text: "Qualcuno sta usando il tuo cervello per minare Dogecoin in background. Ti senti stanco, ma ehi, l'economia digitale ringrazia."
  },
  {
    title: "CSS FAILED TO LOAD",
    text: "Lo stile del mondo è saltato. Le persone sono testo nero su sfondo bianco Times New Roman. È orribile, ma almeno è leggibile."
  },
  {
    title: "TERMS OF SERVICE UPDATE",
    text: "Hai accettato senza leggere. Ora possediamo legalmente il tuo rene sinistro e i diritti d'autore sui tuoi sogni. Continua a scorrere."
  },
  {
    title: "INCIGNEO MODE",
    text: "Il mondo non salva la tua cronologia. Fai quello che vuoi. Nessuno ricorderà i tuoi fallimenti. Nemmeno i tuoi successi. Libertà totale."
  },
  {
    title: "SHADER COMPILATION",
    text: "Aspetta un attimo... stiamo calcolando come la luce rimbalza sulla tua disperazione. Ecco fatto. Molto realistico."
  },
  {
    title: "AI TAKEOVER",
    text: "Un'intelligenza artificiale ha deciso che sei un asset non performante. Corri per dimostrare che l'algoritmo si sbaglia. O per divertirlo."
  },
  {
    title: "CLIPPING ERROR",
    text: "Il tuo piede è entrato nel pavimento. Ora conosci la verità: sotto l'asfalto non c'è terra, c'è solo codice verde che scorre come in Matrix."
  },
  {
    title: "RESOLUTION SCALE 200%",
    text: "Vedi tutto troppo nitidamente. I pori sulla faccia della realtà sono disgustosi. Vuoi tornare al 720p, era tutto più romantico."
  }
];

export const NARRATIVE_SCENARIOS: NarrativeScenario[] = [
  {
    id: 'S1',
    question: "Un orfano digitale piange in formato .JPEG compresso. Cosa fai?",
    options: [
      { text: "Lo comprimo ancora di più (.ZIP)", glitchId: 'PIXEL_HELL', flavorResult: "La realtà perde risoluzione per risparmiare spazio." },
      { text: "Lo uso come scudo umano", glitchId: 'GIANT', flavorResult: "Il senso di colpa ti rende ENORME." },
      { text: "Gli vendo un NFT di sua madre", glitchId: 'INVERTED_COLORS', flavorResult: "Il tuo karma è così negativo che i colori si invertono." }
    ]
  },
  {
    id: 'S2',
    question: "HR ti convoca: 'Il tuo rendimento vitale è sotto la media'. La tua scusa?",
    options: [
      { text: "Ero ubriaco sul lavoro", glitchId: 'DRUNK_CAM', flavorResult: "HR approva l'onestà. Ti offre da bere." },
      { text: "La gravità mi opprime", glitchId: 'HEAVY_METAL', flavorResult: "Ti assegnano pesi extra per 'allenamento aziendale'." },
      { text: "Sono un concetto astratto", glitchId: 'WIRE_FRAME', flavorResult: "Rimuovono le tue texture per tagliare i costi." }
    ]
  },
  {
    id: 'S3',
    question: "Hai la possibilità di eliminare la fame nel mondo, ma devi rinunciare al 4K.",
    options: [
      { text: "Fanculo i poveri, voglio i pixel", glitchId: 'WIDE_LENS', flavorResult: "Vedi tutto in 8K, ma la tua anima è corrotta." },
      { text: "Salvo il mondo (che noia)", glitchId: 'PIXEL_HELL', flavorResult: "Sei un eroe a 144p. Non ti riconosce nessuno." },
      { text: "Vendo la cura su Amazon", glitchId: 'SPEED_DEMON', flavorResult: "Il capitalismo accelera tutto." }
    ]
  },
  {
    id: 'S4',
    question: "Tua nonna ti chiede di aggiustare la stampante. È posseduta da Satana.",
    options: [
      { text: "Esorcismo via USB", glitchId: 'DISCO', flavorResult: "Le luci dell'inferno partono a ritmo techno." },
      { text: "Mi unisco alla setta della stampante", glitchId: 'AUSTRALIA_MODE', flavorResult: "La tua vita si capovolge completamente." },
      { text: "Scappo in Messico", glitchId: 'SPEED_DEMON', flavorResult: "Corri via dai problemi familiari." }
    ]
  },
  {
    id: 'S5',
    question: "Il Metaverso sta crollando. Un miliardario ti offre un passaggio sul razzo.",
    options: [
      { text: "Saboto il razzo", glitchId: 'EARTHQUAKE', flavorResult: "L'esplosione scuote l'intero server." },
      { text: "Mi nascondo nel vano carrello", glitchId: 'TINY', flavorResult: "Ti fai piccolo piccolo per non pagare il biglietto." },
      { text: "Rubo il portafoglio al miliardario", glitchId: 'WIRE_FRAME', flavorResult: "Hackerato. Vedi la matrice dei suoi conti bancari." }
    ]
  },
  {
    id: 'S6',
    question: "Scegli la tua dipendenza moderna preferita:",
    options: [
      { text: "Scrollare Doom-news alle 3AM", glitchId: 'INVERTED_COLORS', flavorResult: "La modalità notte ti ha bruciato le retine." },
      { text: "Caffè endovena", glitchId: 'EARTHQUAKE', flavorResult: "TREMI TUTTO. TROPPA CAFFEINA." },
      { text: "Validazione sociale tramite like", glitchId: 'MOON_GRAVITY', flavorResult: "Il tuo ego si gonfia, ti senti leggerissimo." }
    ]
  },
  {
    id: 'S7',
    question: "Un viaggiatore del tempo vuole uccidere il te stesso bambino.",
    options: [
      { text: "Lo aiuto. Odio quel bambino.", glitchId: 'AUSTRALIA_MODE', flavorResult: "Paradosso temporale! Il mondo è sottosopra." },
      { text: "Gli tiro un mattone", glitchId: 'HEAVY_METAL', flavorResult: "Il mattone pesava tantissimo." },
      { text: "Lo convinco a investire in Bitcoin", glitchId: 'PIXEL_HELL', flavorResult: "La timeline collassa in una schermata blu." }
    ]
  },
  {
    id: 'S8',
    question: "Dio ti manda una notifica push: 'Aggiornamento Universo 2.0 disponibile'.",
    options: [
      { text: "Ignora (Ricordamelo domani)", glitchId: 'DRUNK_CAM', flavorResult: "Il vecchio sistema diventa instabile e glitchato." },
      { text: "Installa Ora", glitchId: 'WIRE_FRAME', flavorResult: "Caricamento asset... Texture mancanti." },
      { text: "Formatta C:", glitchId: 'DISCO', flavorResult: "Tutto è cancellato. Rimane solo il party." }
    ]
  }
];

export const GLITCH_MODS: GlitchMod[] = [
  { id: 'GIANT', title: 'Ego Trip', description: 'Diventi GIGANTE.', icon: '🦍', rarity: 'CURSED' },
  { id: 'TINY', title: 'Ant-Man', description: 'Sei minuscolo.', icon: '🐜', rarity: 'RARE' },
  { id: 'MOON_GRAVITY', title: 'Space X', description: 'Gravità lunare.', icon: '🌑', rarity: 'COMMON' },
  { id: 'DRUNK_CAM', title: 'Vodka', description: 'Telecamera ubriaca.', icon: '🍺', rarity: 'CURSED' },
  { id: 'WIDE_LENS', title: 'GoPro', description: 'FOV estremo.', icon: '👁️', rarity: 'COMMON' },
  { id: 'DISCO', title: 'Epilepsy', description: 'Luci stroboscopiche.', icon: '🪩', rarity: 'LEGENDARY' },
  { id: 'SPEED_DEMON', title: 'Meth', description: 'Velocità folle.', icon: '🔥', rarity: 'LEGENDARY' },
  { id: 'INVERTED_COLORS', title: 'Negative', description: 'Colori invertiti.', icon: '🌗', rarity: 'CURSED' },
  { id: 'HEAVY_METAL', title: 'Fat', description: 'Caduta massiccia.', icon: '🤘', rarity: 'RARE' },
  { id: 'PIXEL_HELL', title: '144p', description: 'Risoluzione Atari.', icon: '👾', rarity: 'CURSED' },
  { id: 'WIRE_FRAME', title: 'The Matrix', description: 'Solo linee.', icon: '🕸️', rarity: 'LEGENDARY' },
  { id: 'AUSTRALIA_MODE', title: 'Upside Down', description: 'Mondo capovolto.', icon: '🙃', rarity: 'CURSED' },
  { id: 'EARTHQUAKE', title: 'Parkinson', description: 'Tremolio costante.', icon: '💢', rarity: 'CURSED' }
];

export const LORE_TEXT = [
  "CARICAMENTO ANSIA...",
  "RENDERING FALLITO.",
  "NON SEI REALE.",
  "IL TUO GATTO TI GIUDICA.",
  "LA TORTA È UNA MENZOGNA.",
  "CORRI DALLA TUA RESPONSABILITÀ.",
  "ERRORE 418: I'M A TEAPOT."
];

export const COLORS = {
  PLAYER: '#38bdf8', 
  OBSTACLE: '#f472b6', 
  OBSTACLE_LOW: '#fb923c', 
  OBSTACLE_HIGH: '#22d3ee', 
  OBSTACLE_FLYING: '#fbbf24', 
  ENEMY: '#ef4444', 
  COIN: '#facc15', 
  POWERUPS: {
    [PowerUpType.SHIELD]: '#22d3ee', 
    [PowerUpType.MULTIPLIER]: '#a855f7', 
    [PowerUpType.SPEED]: '#f97316' 
  }
};

export const POWERUP_CONFIG = {
  BASE_DURATION: 5000, 
  DURATION_PER_LEVEL: 1000, 
  SPAWN_CHANCE: 0.05, 
  SPEED_BOOST_MULTIPLIER: 1.5
};

export const COIN_CONFIG = {
  SPAWN_CHANCE: 0.9,  
  POINTS: 50
};

export const ENEMY_CONFIG = {
  SPAWN_RATIO: 0.5, 
  SPEED_OFFSET: 0.15,
  WOBBLE_SPEED: 8,
  WOBBLE_AMP: 0.5
};

export const UPGRADE_CONFIG = {
  BASE_COST: 100,
  COST_MULTIPLIER: 2.0,
  MAX_LEVEL: 5,
  NAMES: {
    [PowerUpType.SHIELD]: 'Plasma Shield',
    [PowerUpType.MULTIPLIER]: 'Quantum Bit',
    [PowerUpType.SPEED]: 'Overclock'
  }
};
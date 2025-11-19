
import { LevelConfig, PowerUpType, GlitchMod, NarrativeScenario, Difficulty, Character, LocalizedText } from './types';

export const LANE_WIDTH = 2.5;
export const JUMP_FORCE = 0.25;
export const GRAVITY = -0.015;
export const PLAYER_Z_OFFSET = 0;

export const UI_TEXT = {
  START_RUN: { en: "START RUN", it: "INIZIA CORSA" },
  CHARACTERS: { en: "CHARACTERS", it: "PERSONAGGI" },
  UPGRADES: { en: "UPGRADES", it: "POTENZIAMENTI" },
  HIGH_SCORE: { en: "High Score", it: "Record" },
  SELECT_DIFFICULTY: { en: "SELECT DIFFICULTY", it: "SELEZIONA DIFFICOLTÀ" },
  PAUSED: { en: "PAUSED", it: "PAUSA" },
  RESUME: { en: "RESUME", it: "RIPRENDI" },
  BACK_TO_MENU: { en: "BACK TO MENU", it: "TORNA AL MENU" },
  STAGE_CLEARED: { en: "STAGE CLEARED", it: "LIVELLO COMPLETATO" },
  PROCEED: { en: "Proceed to System Check", it: "Procedi al Controllo Sistema" },
  SYSTEM_LOG: { en: "> SYSTEM LOG", it: "> LOG SISTEMA" },
  CRITICAL_DECISION: { en: "> CRITICAL DECISION REQUIRED_", it: "> DECISIONE CRITICA RICHIESTA_" },
  SYSTEM_UPDATED: { en: "SYSTEM UPDATED", it: "SISTEMA AGGIORNATO" },
  SELECT_FIGHTER: { en: "SELECT FIGHTER", it: "SCEGLI COMBATTENTE" },
  UNLOCK: { en: "UNLOCK", it: "SBLOCCA" },
  READY: { en: "READY", it: "PRONTO" },
  CLICK_TO_SELECT: { en: "CLICK TO SELECT", it: "CLICCA PER SCEGLIERE" },
  CRITICAL_FAILURE: { en: "CRITICAL FAILURE", it: "ERRORE CRITICO" },
  SCORE: { en: "SCORE", it: "PUNTEGGIO" },
  TOTAL_WALLET: { en: "TOTAL WALLET", it: "PORTAFOGLIO" },
  REBOOT: { en: "REBOOT SYSTEM", it: "RIAVVIA SISTEMA" },
  ACTIVE_GLITCHES: { en: "Active Glitches", it: "Glitch Attivi" },
  NONE: { en: "None", it: "Nessuno" },
  MAXED: { en: "MAXED", it: "MAX" },
  BASE_LEVEL: { en: "Base Level", it: "Livello Base" },
  SUBTITLE: { en: "Rispondi. Corri.", it: "Rispondi. Corri." },
  READ_LORE: { en: "READ STORY", it: "LEGGI STORIA" },
  LOCKED_CHAPTER: { en: "REACH STAGE {0} TO DECRYPT", it: "RAGGIUNGI LIVELLO {0} PER DECRITTARE" },
  CLOSE: { en: "CLOSE", it: "CHIUDI" }
};

export const DIFFICULTY_MODS: Record<Difficulty, { speed: number, density: number, score: number, coinMultiplier: number, label: LocalizedText, color: string }> = {
  SCRIPT_KIDDIE: {
    speed: 0.55,     
    density: 0.4,    
    score: 0.5,      
    coinMultiplier: 0.5, 
    label: { en: "NOOB", it: "NOOB" },
    color: "#4ade80" 
  },
  CYBER_PUNK: {
    speed: 1.0,
    density: 1.0,
    score: 1.0,
    coinMultiplier: 1.0, 
    label: { en: "HACKER", it: "HACKER" },
    color: "#22d3ee" 
  },
  NET_RUNNER: {
    speed: 1.5,      
    density: 1.6,    
    score: 2.5,      
    coinMultiplier: 2.5, 
    label: { en: "GOD", it: "DIO" },
    color: "#ef4444" 
  }
};

export const CHARACTERS: Character[] = [
  {
    id: 'DEFAULT',
    name: { en: 'Neon Guy', it: 'Neon Guy' },
    description: { 
      en: 'The generic protagonist. No royalties to pay here.', 
      it: 'Il protagonista generico. Non ha diritti d\'autore da pagare.' 
    },
    color: '#38bdf8',
    emissive: '#0ea5e9',
    shape: 'BOX',
    unlockCost: 0,
    skillId: 'DASH',
    skillName: { en: 'Sprint.exe', it: 'Sprint.exe' },
    skillDescription: { 
      en: 'Become invulnerable and dash forward, ignoring physics.', 
      it: 'Diventa invulnerabile e scatta in avanti ignorando le leggi della fisica.' 
    },
    skillCooldown: 15,
    skillDuration: 3
  },
  {
    id: 'GOKU_FAKE',
    name: { en: 'Goku-ish', it: 'Gokuccio' },
    description: { 
      en: 'Screams for 30 minutes to change a lightbulb. Hair turns yellow when embarrassed.', 
      it: 'Urla per 30 minuti per cambiare una lampadina. Se perde, i capelli diventano gialli per l\'imbarazzo.' 
    },
    color: '#facc15', 
    emissive: '#fbbf24',
    shape: 'SPHERE',
    unlockCost: 500,
    skillId: 'BLAST',
    skillName: { en: 'Kame-Boom', it: 'Kame-Boom' },
    skillDescription: { 
      en: 'Fires a (copyright free) energy beam that destroys everything ahead.', 
      it: 'Spara un raggio energetico (copyright free) che distrugge tutto davanti a sé.' 
    },
    skillCooldown: 25
  },
  {
    id: 'NARUTO_FAKE',
    name: { en: 'Straw Fox', it: 'Volpe di Paglia' },
    description: { 
      en: 'Wants to be the mayor of his condo. Runs with arms back like an idiot.', 
      it: 'Vuole diventare sindaco del condominio. Corre con le braccia all\'indietro.' 
    },
    color: '#f97316', 
    emissive: '#ea580c',
    shape: 'TETRA',
    unlockCost: 1000,
    skillId: 'CLONE',
    skillName: { en: 'Shadow Shield', it: 'Shadow Shield' },
    skillDescription: { 
      en: 'Summons a shadow clone (low budget shield) to absorb one hit.', 
      it: 'Evoca un clone d\'ombra (o uno scudo, budget limitato) che assorbe un colpo mortale.' 
    },
    skillCooldown: 30,
    skillDuration: 5
  },
  {
    id: 'LUFFY_FAKE',
    name: { en: 'Rubber Boy', it: 'Gomma Boy' },
    description: { 
      en: 'Ate expired fruit. Now stretches but can\'t swim after eating.', 
      it: 'Ha mangiato un frutto scaduto. Ora si allunga ma non può fare il bagno dopo mangiato.' 
    },
    color: '#ef4444', 
    emissive: '#dc2626',
    shape: 'BOX',
    unlockCost: 1500,
    skillId: 'MAGNET',
    skillName: { en: 'Grab Everything', it: 'Grab Everything' },
    skillDescription: { 
      en: 'Stretches magnetic arms to steal coins from all lanes.', 
      it: 'Allunga le braccia magnetiche per rubare monete da tutte le corsie.' 
    },
    skillCooldown: 20,
    skillDuration: 6
  },
  {
    id: 'EVA_FAKE',
    name: { en: 'Sad Robot', it: 'Robot Depresso' },
    description: { 
      en: 'His dad doesn\'t love him. Get in the robot or humanity becomes orange juice.', 
      it: 'Suo padre non gli vuole bene. Deve salire sul robot o l\'umanità diventerà succo d\'arancia.' 
    },
    color: '#a855f7', 
    emissive: '#7e22ce',
    shape: 'TETRA',
    unlockCost: 2000,
    skillId: 'SLOW_MO',
    skillName: { en: 'Existential Crisis', it: 'Sad Time' },
    skillDescription: { 
      en: 'Enters an existential crisis, slowing down time for everyone.', 
      it: 'Entra in crisi esistenziale, rallentando il tempo per tutti.' 
    },
    skillCooldown: 35,
    skillDuration: 5
  },
  {
    id: 'SAILOR_FAKE',
    name: { en: 'Moon Moody', it: 'Luna Storta' },
    description: { 
      en: 'Punishes crime in the name of the Moon, but only if not sleepy. Her cat insults you.', 
      it: 'Punisce il crimine in nome della Luna, ma solo se non ha sonno. Il suo gatto parla ma dice solo insulti.' 
    },
    color: '#ec4899', 
    emissive: '#db2777',
    shape: 'SPHERE',
    unlockCost: 2500,
    skillId: 'ALCHEMY',
    skillName: { en: 'Moon Profit', it: 'Moon Prorate' },
    skillDescription: { 
      en: 'Uses lunar magic to turn nearby obstacles into cold, hard cash.', 
      it: 'Usa la magia lunare per trasformare gli ostacoli vicini in monete.' 
    },
    skillCooldown: 25
  }
];

export const CHARACTER_STORIES: Record<string, { title: LocalizedText, chapters: LocalizedText[] }> = {
  'DEFAULT': {
    title: { en: "FILE: DEFAULT_USER.LOG", it: "FILE: UTENTE_BASE.LOG" },
    chapters: [
      { en: "Day 1: I realized I am just a standard asset. My name is Mesh_01. I tried to change my shirt color, but I need Admin privileges.", it: "Giorno 1: Ho capito di essere un asset standard. Mi chiamo Mesh_01. Ho provato a cambiarmi la maglietta, ma servono i privilegi di Admin." },
      { en: "Day 4: I found a texture seam in the skybox. I poked it. It bled binary code. I think the developer was drunk when he made the clouds.", it: "Giorno 4: Ho trovato una cucitura nella texture del cielo. L'ho toccata. Ha sanguinato codice binario. Credo che lo sviluppatore fosse ubriaco quando ha fatto le nuvole." },
      { en: "Day 12: I met a deleted polygon today. He was just a triangle floating in void. He asked me for a cigarette. I don't have hands.", it: "Giorno 12: Ho incontrato un poligono cancellato. Era solo un triangolo nel vuoto. Mi ha chiesto una sigaretta. Non ho le mani." },
      { en: "Day 28: The player keeps making me run into walls. I think he enjoys my pain. I have developed a concussion protocol.", it: "Giorno 28: Il giocatore continua a farmi schiantare sui muri. Credo che goda del mio dolore. Ho sviluppato un protocollo per la commozione cerebrale." },
      { en: "Day 99: I accepted my fate. I am the Tutorial Guy. I exist to die so others can learn to jump. It is honest work.", it: "Giorno 99: Ho accettato il mio destino. Sono il Tizio del Tutorial. Esisto per morire affinché altri imparino a saltare. È un lavoro onesto." }
    ]
  },
  'GOKU_FAKE': {
    title: { en: "THE SCREAMING LOGS", it: "DIARIO DELLE URLA" },
    chapters: [
      { en: "Entry 1: I am hungry. I ate 50 bowls of digital rice. The physics engine is lagging because of my mass.", it: "Voce 1: Ho fame. Ho mangiato 50 ciotole di riso digitale. Il motore fisico lagga a causa della mia massa." },
      { en: "Entry 2: My phone battery died. I screamed at it for 3 episodes. It is now fully charged but traumatized.", it: "Voce 2: Si è scaricato il telefono. Gli ho urlato contro per 3 episodi. Ora è carico ma traumatizzato." },
      { en: "Entry 3: I tried to dye my hair black to look normal. It turned gold instantly. The hair gel budget is ruining my family.", it: "Voce 3: Ho provato a tingermi i capelli di nero per sembrare normale. Sono tornati oro subito. Il budget per il gel sta rovinando la mia famiglia." },
      { en: "Entry 4: An enemy challenged me. I told him to wait while I power up. He waited 4 years. We are now best friends.", it: "Voce 4: Un nemico mi ha sfidato. Gli ho detto di aspettare mentre mi caricavo. Ha aspettato 4 anni. Ora siamo migliori amici." },
      { en: "Entry 5: I accidentally blew up the wrong planet. It was just a background sprite, but the Admin is furious. Oops.", it: "Voce 5: Ho fatto esplodere il pianeta sbagliato per sbaglio. Era solo uno sprite di sfondo, ma l'Admin è furioso. Oops." }
    ]
  },
  'NARUTO_FAKE': {
    title: { en: "THE NINJA WAY (OF RUNNING WEIRD)", it: "LA VIA DEL NINJA (CORRERE STRANO)" },
    chapters: [
      { en: "Log A: Why is there a swing set in every flashback? I hate swings. They make me dizzy.", it: "Log A: Perché c'è un'altalena in ogni mio flashback? Odio le altalene. Mi fanno girare la testa." },
      { en: "Log B: Running with arms behind my back is aerodynamic, they said. My shoulders are dislocated. I need a chiropractor.", it: "Log B: Correre con le braccia indietro è aerodinamico, dicevano. Ho le spalle lussate. Mi serve un chiropratico." },
      { en: "Log C: I ate ramen for breakfast, lunch, and dinner. My sodium levels are over 9000. The doctor is concerned.", it: "Log C: Ho mangiato ramen a colazione, pranzo e cena. I livelli di sodio sono oltre 9000. Il dottore è preoccupato." },
      { en: "Log D: The beast inside me speaks. It says 'Please eat a vegetable'. I told it to shut up. It's my ninja way.", it: "Log D: La bestia dentro di me parla. Dice 'Per favore mangia una verdura'. Le ho detto di stare zitta. È la mia via ninja." },
      { en: "Log E: I finally became the Mayor. It is 90% paperwork and 10% cutting ribbons. I miss fighting aliens.", it: "Log E: Sono finalmente diventato Sindaco. È 90% burocrazia e 10% tagliare nastri. Mi manca combattere gli alieni." }
    ]
  },
  'LUFFY_FAKE': {
    title: { en: "CAPTAIN'S LOG (WATERPROOF)", it: "DIARIO DEL CAPITANO (IMPERMEABILE)" },
    chapters: [
      { en: "Day X: I ate a weird fruit. Now I am made of rubber. Great for reaching the remote without getting up. Bad for dating.", it: "Giorno X: Ho mangiato un frutto strano. Ora sono di gomma. Ottimo per prendere il telecomando senza alzarmi. Pessimo per gli appuntamenti." },
      { en: "Day Y: I tried to scratch my back but my hand stretched and slapped a pedestrian 50 meters away. Lawsuit pending.", it: "Giorno Y: Volevo grattarmi la schiena ma la mano si è allungata e ha schiaffeggiato un pedone a 50 metri. Denuncia in arrivo." },
      { en: "Day Z: My hat is more valuable than my life. I would trade my crew for a lint roller to clean it.", it: "Giorno Z: Il mio cappello vale più della mia vita. Scambierei la mia ciurma per una spazzola adesiva per pulirlo." },
      { en: "Day Omega: I realized my crew is just hallucinations caused by scurvy. But they are funny, so I keep them.", it: "Giorno Omega: Ho capito che la ciurma è solo un'allucinazione dovuta allo scorbuto. Ma sono simpatici, li tengo." },
      { en: "Day Final: Found the treasure. It was a mirror. The real treasure was 'friendship'. I threw it in the ocean.", it: "Giorno Finale: Trovato il tesoro. Era uno specchio. Il vero tesoro era 'l'amicizia'. L'ho buttato nell'oceano." }
    ]
  },
  'EVA_FAKE': {
    title: { en: "AUDIO RECORDING: THERAPY SESSION", it: "REGISTRAZIONE: SEDUTA TERAPIA" },
    chapters: [
      { en: "Session 1: Dad didn't call on my birthday. He sent a giant robot instead. It doesn't hug well. Too metallic.", it: "Seduta 1: Papà non ha chiamato per il compleanno. Ha mandato un robot gigante. Non abbraccia bene. Troppo metallico." },
      { en: "Session 5: I spent 4 hours sitting on a chair in a dark room thinking about penguins. Is this normal?", it: "Seduta 5: Ho passato 4 ore seduto su una sedia al buio pensando ai pinguini. È normale?" },
      { en: "Session 12: The robot smells like orange juice and copper. I can't wash the smell off. It's in my soul.", it: "Seduta 12: Il robot puzza di succo d'arancia e rame. Non riesco a lavare via l'odore. È nella mia anima." },
      { en: "Session 20: Everyone stood around me and clapped. 'Congratulations!', they said. I still have to pay rent though.", it: "Seduta 20: Tutti mi hanno circondato e applaudito. 'Congratulazioni!', dicevano. Però devo ancora pagare l'affitto." },
      { en: "Session End: I rejected Human Instrumentality. Merging all souls into one goo sounds sticky. I prefer being alone.", it: "Fine Seduta: Ho rifiutato il Perfezionamento dell'Uomo. Fondere tutte le anime in una poltiglia sembra appiccicoso. Preferisco stare solo." }
    ]
  },
  'SAILOR_FAKE': {
    title: { en: "MOON PRISM DIARY", it: "DIARIO DEL PRISMA LUNARE" },
    chapters: [
      { en: "Moon 1: Late for school again. Toast in mouth. Ran into a pole. No handsome stranger helped me. Reality sucks.", it: "Luna 1: Di nuovo in ritardo a scuola. Toast in bocca. Sbattutto contro un palo. Nessun bel ragazzo mi ha aiutato. La realtà fa schifo." },
      { en: "Moon 2: My cat started talking. He criticized my fashion sense. I can't evict him because he pays half the rent.", it: "Luna 2: Il mio gatto ha iniziato a parlare. Ha criticato come mi vesto. Non posso cacciarlo perché paga metà affitto." },
      { en: "Moon 3: The transformation sequence takes 2 minutes. The villain went to get coffee while waiting. So rude.", it: "Luna 3: La sequenza di trasformazione dura 2 minuti. Il cattivo è andato a prendere un caffè nell'attesa. Che maleducato." },
      { en: "Moon 4: That guy in the tuxedo does nothing. He throws one rose and leaves. I do all the work. Men.", it: "Luna 4: Quel tizio in smoking non fa nulla. Lancia una rosa e se ne va. Faccio tutto io. Uomini." },
      { en: "Moon 5: The Moon Kingdom is actually a tax haven for billionaires. I fight for capitalism. I feel dirty.", it: "Luna 5: Il Regno della Luna è in realtà un paradiso fiscale per miliardari. Combatto per il capitalismo. Mi sento sporca." }
    ]
  }
};

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
    title: { en: "MEMORY LEAK PLUGGED", it: "MEMORY LEAK PLUGGED" },
    text: { 
      en: "You hit the edge of the texture map. Behind the invisible wall, there was just a room full of mismatched socks the universe lost. You stole a left one. Physics is crumbling.", 
      it: "Hai raggiunto il bordo della mappa texture. Dietro il muro invisibile non c'era il nulla, ma una stanza piena di calzini spaiati che l'universo aveva perso. Hai rubato un calzino sinistro. La fisica ne risente." 
    }
  },
  {
    title: { en: "GARBAGE COLLECTOR ESCAPED", it: "GARBAGE COLLECTOR ESCAPED" },
    text: { 
      en: "You outran the cleaning algorithm. Now the garbage data worships you as a god. A flying toaster asks for the Wi-Fi password to heaven.", 
      it: "Sei corso più veloce dell'algoritmo di pulizia. Ora i dati spazzatura ti venerano come un dio. Un tostapane volante ti chiede se conosci la strada per il Wi-Fi del paradiso." 
    }
  },
  {
    title: { en: "SOURCE CODE BREACH", it: "SOURCE CODE BREACH" },
    text: { 
      en: "You found the missing semicolon holding reality together. You deleted it by mistake. Colors now have taste and time flows diagonally. Good job.", 
      it: "Hai trovato il punto e virgola mancante che teneva insieme la realtà. L'hai cancellato per sbaglio. I colori ora hanno sapore e il tempo scorre in diagonale. Ottimo lavoro." 
    }
  },
  {
    title: { en: "RENDER DISTANCE EXCEEDED", it: "RENDER DISTANCE EXCEEDED" },
    text: { 
      en: "You ran so fast the universe's GPU asked for a holiday. You are now in software rendering mode. Those dead pixels? Those are your hopes.", 
      it: "Hai corso così forte che la scheda video dell'universo ha chiesto ferie. Quello che vedi ora è rendering software puro. Quei pixel morti? Sono le tue speranze." 
    }
  },
  {
    title: { en: "404 REALITY NOT FOUND", it: "404 REALITY NOT FOUND" },
    text: { 
      en: "The server you live in went offline. You are officially cached. If you stop moving, you will be deleted to free up disk space.", 
      it: "Il server in cui vivi è andato offline. Sei ufficialmente in cache. Se smetti di muoverti, verrai cancellato per liberare spazio su disco." 
    }
  },
  {
    title: { en: "BUFFER OVERFLOW", it: "BUFFER OVERFLOW" },
    text: { 
      en: "Too much junk data in your brain. To make space, the system deleted the memory of your first kiss and replaced it with a shampoo ad.", 
      it: "Hai accumulato troppi dati inutili nel cervello. Per fare spazio, il sistema ha cancellato il ricordo del tuo primo bacio e lo ha sostituito con la pubblicità di uno shampoo." 
    }
  },
  {
    title: { en: "PACKET LOSS DETECTED", it: "PACKET LOSS DETECTED" },
    text: { 
      en: "You lost 30% of your soul during data transfer. You feel lighter, but you laugh hysterically at barcodes now.", 
      it: "Hai perso il 30% della tua anima durante il trasferimento dati. Ti senti più leggero, ma ora ridi istericamente ogni volta che vedi un codice a barre." 
    }
  },
  {
    title: { en: "ADMIN PRIVILEGES DENIED", it: "ADMIN PRIVILEGES DENIED" },
    text: { 
      en: "You asked the universe for a raise. Response: 'SUDO command not found'. Get back to running, system slave.", 
      it: "Hai provato a chiedere un aumento di stipendio all'universo. Risposta: 'SUDO command not found'. Torna a correre, schiavo del sistema." 
    }
  },
  {
    title: { en: "GPU OVERHEAT", it: "GPU OVERHEAT" },
    text: { 
      en: "The universe smells like burnt plastic. Stars are melting onto the skybox. Beautiful, but maybe stop overclocking your legs.", 
      it: "L'universo puzza di plastica bruciata. Le stelle si stanno sciogliendo colando sul cielo. È bellissimo, ma forse dovresti smettere di overcloccare le tue gambe." 
    }
  },
  {
    title: { en: "TEXTURE POP-IN", it: "TEXTURE POP-IN" },
    text: { 
      en: "You arrived before the world loaded. You saw the developers on a coffee break. They were giant cats playing with the yarn of destiny.", 
      it: "Sei arrivato prima che il mondo venisse caricato. Hai visto gli sviluppatori in pausa caffè. Erano gatti giganti che giocavano con il gomitolo del destino." 
    }
  },
  {
    title: { en: "BLUE SCREEN OF DEATH", it: "BLUE SCREEN OF DEATH" },
    text: { 
      en: "Everything went blue. It wasn't the sky. System crash. You rebooted in Safe Mode: no emotions, just speed.", 
      it: "Tutto è diventato blu per un secondo. Non era il cielo. Era un crash di sistema. Ti sei riavviato in modalità provvisoria: niente emozioni, solo velocità." 
    }
  },
  {
    title: { en: "DEAD PIXEL FIX", it: "DEAD PIXEL FIX" },
    text: { 
      en: "You punched a dead pixel in the sky. Now there's a black hole the size of a coin. It sucks in only negative thoughts and car keys.", 
      it: "Hai preso a pugni un pixel morto nel cielo. Ora c'è un buco nero grande come una moneta. Risucchia solo i pensieri negativi e le chiavi della macchina." 
    }
  },
  {
    title: { en: "FPS DROP", it: "FPS DROP" },
    text: { 
      en: "Life is lagging. You see things in slideshow mode. Use the frames to dodge responsibilities.", 
      it: "La vita sta lagghando. Vedi le cose a scatti. Approfittane per schivare le responsabilità tra un frame e l'altro." 
    }
  },
  {
    title: { en: "INFINITE LOOP", it: "INFINITE LOOP" },
    text: { 
      en: "Do you feel like you've read this before? Do you feel like you've read this before? Do you feel like you've read this before?", 
      it: "Hai la sensazione di aver già letto questo messaggio? Hai la sensazione di aver già letto questo messaggio? Hai la sensazione di aver già letto questo messaggio?" 
    }
  },
  {
    title: { en: "PING TOO HIGH", it: "PING TOO HIGH" },
    text: { 
      en: "You responded to an insult with a 3-second delay. The moment passed. The universe laughs at your lag.", 
      it: "Hai risposto a un insulto con 3 secondi di ritardo. Il momento era passato. L'universo ride del tuo lag." 
    }
  },
  {
    title: { en: "VPN CONNECTED", it: "VPN CONNECTED" },
    text: { 
      en: "You now appear to be in Norway. You suddenly love Black Metal and feel cold. Enemy firewalls can't see you.", 
      it: "Ora sembri connesso dalla Norvegia. Improvvisamente ti piace il Black Metal e senti freddo. I firewall nemici non ti vedono." 
    }
  },
  {
    title: { en: "CRYPTOMINER INSTALLED", it: "CRYPTOMINER INSTALLED" },
    text: { 
      en: "Someone is using your brain to mine Dogecoin in the background. You feel tired, but hey, the digital economy thanks you.", 
      it: "Qualcuno sta usando il tuo cervello per minare Dogecoin in background. Ti senti stanco, ma ehi, l'economia digitale ringrazia." 
    }
  },
  {
    title: { en: "CSS FAILED TO LOAD", it: "CSS FAILED TO LOAD" },
    text: { 
      en: "World styling failed. People are black text on white backgrounds in Times New Roman. It's ugly, but readable.", 
      it: "Lo stile del mondo è saltato. Le persone sono testo nero su sfondo bianco Times New Roman. È orribile, ma almeno è leggibile." 
    }
  },
  {
    title: { en: "TERMS OF SERVICE UPDATE", it: "TERMS OF SERVICE UPDATE" },
    text: { 
      en: "You accepted without reading. We now legally own your left kidney and the copyright to your dreams. Keep scrolling.", 
      it: "Hai accettato senza leggere. Ora possediamo legalmente il tuo rene sinistro e i diritti d'autore sui tuoi sogni. Continua a scorrere." 
    }
  },
  {
    title: { en: "INCOGNITO MODE", it: "INCOGNITO MODE" },
    text: { 
      en: "The world isn't saving your history. Do whatever. No one will remember your failures. Or your success. Total freedom.", 
      it: "Il mondo non salva la tua cronologia. Fai quello che vuoi. Nessuno ricorderà i tuoi fallimenti. Nemmeno i tuoi successi. Libertà totale." 
    }
  },
  {
    title: { en: "SHADER COMPILATION", it: "SHADER COMPILATION" },
    text: { 
      en: "Wait a sec... calculating how light bounces off your desperation. There. Very realistic.", 
      it: "Aspetta un attimo... stiamo calcolando come la luce rimbalza sulla tua disperazione. Ecco fatto. Molto realistico." 
    }
  },
  {
    title: { en: "AI TAKEOVER", it: "AI TAKEOVER" },
    text: { 
      en: "An AI decided you are a non-performing asset. Run to prove the algorithm wrong. Or to entertain it.", 
      it: "Un'intelligenza artificiale ha deciso che sei un asset non performante. Corri per dimostrare che l'algoritmo si sbaglia. O per divertirlo." 
    }
  },
  {
    title: { en: "CLIPPING ERROR", it: "CLIPPING ERROR" },
    text: { 
      en: "Your foot clipped through the floor. Now you know: under the asphalt isn't dirt, it's just green code flowing like Matrix.", 
      it: "Il tuo piede è entrato nel pavimento. Ora conosci la verità: sotto l'asfalto non c'è terra, c'è solo codice verde che scorre come in Matrix." 
    }
  },
  {
    title: { en: "RESOLUTION SCALE 200%", it: "RESOLUTION SCALE 200%" },
    text: { 
      en: "You see everything too sharply. The pores on reality's face are disgusting. You want to go back to 720p.", 
      it: "Vedi tutto troppo nitidamente. I pori sulla faccia della realtà sono disgustosi. Vuoi tornare al 720p, era tutto più romantico." 
    }
  }
];

export const NARRATIVE_SCENARIOS: NarrativeScenario[] = [
  {
    id: 'S1',
    question: { 
      en: "A digital orphan cries in compressed .JPEG format. What do you do?", 
      it: "Un orfano digitale piange in formato .JPEG compresso. Cosa fai?" 
    },
    options: [
      { 
        text: { en: "Compress him more (.ZIP)", it: "Lo comprimo ancora di più (.ZIP)" }, 
        glitchId: 'PIXEL_HELL', 
        flavorResult: { en: "Reality loses resolution to save disk space.", it: "La realtà perde risoluzione per risparmiare spazio." } 
      },
      { 
        text: { en: "Use him as a human shield", it: "Lo uso come scudo umano" }, 
        glitchId: 'GIANT', 
        flavorResult: { en: "Your guilt makes you HUGE.", it: "Il senso di colpa ti rende ENORME." } 
      },
      { 
        text: { en: "Sell an NFT of his mom", it: "Gli vendo un NFT di sua madre" }, 
        glitchId: 'INVERTED_COLORS', 
        flavorResult: { en: "Your karma is so negative colors inverted.", it: "Il tuo karma è così negativo che i colori si invertono." } 
      }
    ]
  },
  {
    id: 'S2',
    question: { 
      en: "HR summons you: 'Your vital performance is below average'. Excuse?", 
      it: "HR ti convoca: 'Il tuo rendimento vitale è sotto la media'. La tua scusa?" 
    },
    options: [
      { 
        text: { en: "I was drunk on the job", it: "Ero ubriaco sul lavoro" }, 
        glitchId: 'DRUNK_CAM', 
        flavorResult: { en: "HR appreciates honesty. Have a drink.", it: "HR approva l'onestà. Ti offre da bere." } 
      },
      { 
        text: { en: "Gravity is oppressing me", it: "La gravità mi opprime" }, 
        glitchId: 'HEAVY_METAL', 
        flavorResult: { en: "They assign you extra weights for 'training'.", it: "Ti assegnano pesi extra per 'allenamento aziendale'." } 
      },
      { 
        text: { en: "I am an abstract concept", it: "Sono un concetto astratto" }, 
        glitchId: 'WIRE_FRAME', 
        flavorResult: { en: "They remove your textures to cut costs.", it: "Rimuovono le tue texture per tagliare i costi." } 
      }
    ]
  },
  {
    id: 'S3',
    question: { 
      en: "You can eliminate world hunger, but must give up 4K resolution.", 
      it: "Hai la possibilità di eliminare la fame nel mondo, ma devi rinunciare al 4K." 
    },
    options: [
      { 
        text: { en: "F**k the poor, I want pixels", it: "Fanculo i poveri, voglio i pixel" }, 
        glitchId: 'WIDE_LENS', 
        flavorResult: { en: "You see in 8K, but your soul is corrupted.", it: "Vedi tutto in 8K, ma la tua anima è corrotta." } 
      },
      { 
        text: { en: "Save the world (boring)", it: "Salvo il mondo (che noia)" }, 
        glitchId: 'PIXEL_HELL', 
        flavorResult: { en: "You are a 144p hero. Nobody recognizes you.", it: "Sei un eroe a 144p. Non ti riconosce nessuno." } 
      },
      { 
        text: { en: "Sell the cure on Amazon", it: "Vendo la cura su Amazon" }, 
        glitchId: 'SPEED_DEMON', 
        flavorResult: { en: "Capitalism accelerates everything.", it: "Il capitalismo accelera tutto." } 
      }
    ]
  },
  {
    id: 'S4',
    question: { 
      en: "Your grandma asks you to fix the printer. It is possessed by Satan.", 
      it: "Tua nonna ti chiede di aggiustare la stampante. È posseduta da Satana." 
    },
    options: [
      { 
        text: { en: "USB Exorcism", it: "Esorcismo via USB" }, 
        glitchId: 'DISCO', 
        flavorResult: { en: "Hell's lights start a techno party.", it: "Le luci dell'inferno partono a ritmo techno." } 
      },
      { 
        text: { en: "Join the printer cult", it: "Mi unisco alla setta della stampante" }, 
        glitchId: 'AUSTRALIA_MODE', 
        flavorResult: { en: "Your life turns upside down.", it: "La tua vita si capovolge completamente." } 
      },
      { 
        text: { en: "Flee to Mexico", it: "Scappo in Messico" }, 
        glitchId: 'SPEED_DEMON', 
        flavorResult: { en: "Running away from family problems.", it: "Corri via dai problemi familiari." } 
      }
    ]
  },
  {
    id: 'S5',
    question: { 
      en: "The Metaverse is collapsing. A billionaire offers a ride on his rocket.", 
      it: "Il Metaverso sta crollando. Un miliardario ti offre un passaggio sul razzo." 
    },
    options: [
      { 
        text: { en: "Sabotage the rocket", it: "Saboto il razzo" }, 
        glitchId: 'EARTHQUAKE', 
        flavorResult: { en: "The explosion shakes the server.", it: "L'esplosione scuote l'intero server." } 
      },
      { 
        text: { en: "Hide in the wheel well", it: "Mi nascondo nel vano carrello" }, 
        glitchId: 'TINY', 
        flavorResult: { en: "You shrink to avoid paying the ticket.", it: "Ti fai piccolo piccolo per non pagare il biglietto." } 
      },
      { 
        text: { en: "Steal his wallet", it: "Rubo il portafoglio al miliardario" }, 
        glitchId: 'WIRE_FRAME', 
        flavorResult: { en: "Hacked. You see his bank account matrix.", it: "Hackerato. Vedi la matrice dei suoi conti bancari." } 
      }
    ]
  },
  {
    id: 'S6',
    question: { 
      en: "Pick your favorite modern addiction:", 
      it: "Scegli la tua dipendenza moderna preferita:" 
    },
    options: [
      { 
        text: { en: "Doom-scrolling at 3AM", it: "Scrollare Doom-news alle 3AM" }, 
        glitchId: 'INVERTED_COLORS', 
        flavorResult: { en: "Night mode burned your retinas.", it: "La modalità notte ti ha bruciato le retine." } 
      },
      { 
        text: { en: "IV Drip Coffee", it: "Caffè endovena" }, 
        glitchId: 'EARTHQUAKE', 
        flavorResult: { en: "SHAKING. TOO MUCH CAFFEINE.", it: "TREMI TUTTO. TROPPA CAFFEINA." } 
      },
      { 
        text: { en: "Social validation via likes", it: "Validazione sociale tramite like" }, 
        glitchId: 'MOON_GRAVITY', 
        flavorResult: { en: "Your ego inflates, you feel weightless.", it: "Il tuo ego si gonfia, ti senti leggerissimo." } 
      }
    ]
  },
  {
    id: 'S7',
    question: { 
      en: "A time traveler wants to kill baby you.", 
      it: "Un viaggiatore del tempo vuole uccidere il te stesso bambino." 
    },
    options: [
      { 
        text: { en: "Help him. I hate that kid.", it: "Lo aiuto. Odio quel bambino." }, 
        glitchId: 'AUSTRALIA_MODE', 
        flavorResult: { en: "Time paradox! World is upside down.", it: "Paradosso temporale! Il mondo è sottosopra." } 
      },
      { 
        text: { en: "Throw a brick at him", it: "Gli tiro un mattone" }, 
        glitchId: 'HEAVY_METAL', 
        flavorResult: { en: "The brick was super heavy.", it: "Il mattone pesava tantissimo." } 
      },
      { 
        text: { en: "Convince him to buy Bitcoin", it: "Lo convinco a investire in Bitcoin" }, 
        glitchId: 'PIXEL_HELL', 
        flavorResult: { en: "Timeline collapses into blue screen.", it: "La timeline collassa in una schermata blu." } 
      }
    ]
  },
  {
    id: 'S8',
    question: { 
      en: "God sends a push notification: 'Universe 2.0 Update Available'.", 
      it: "Dio ti manda una notifica push: 'Aggiornamento Universo 2.0 disponibile'." 
    },
    options: [
      { 
        text: { en: "Ignore (Remind me tomorrow)", it: "Ignora (Ricordamelo domani)" }, 
        glitchId: 'DRUNK_CAM', 
        flavorResult: { en: "Old system becomes unstable and glitchy.", it: "Il vecchio sistema diventa instabile e glitchato." } 
      },
      { 
        text: { en: "Install Now", it: "Installa Ora" }, 
        glitchId: 'WIRE_FRAME', 
        flavorResult: { en: "Loading assets... Textures missing.", it: "Caricamento asset... Texture mancanti." } 
      },
      { 
        text: { en: "Format C:", it: "Formatta C:" }, 
        glitchId: 'DISCO', 
        flavorResult: { en: "Everything deleted. Only the party remains.", it: "Tutto è cancellato. Rimane solo il party." } 
      }
    ]
  }
];

export const GLITCH_MODS: GlitchMod[] = [
  { id: 'GIANT', title: { en: 'Ego Trip', it: 'Ego Trip' }, description: { en: 'You become GIANT.', it: 'Diventi GIGANTE.' }, icon: '🦍', rarity: 'CURSED' },
  { id: 'TINY', title: { en: 'Ant-Man', it: 'Ant-Man' }, description: { en: 'You are tiny.', it: 'Sei minuscolo.' }, icon: '🐜', rarity: 'RARE' },
  { id: 'MOON_GRAVITY', title: { en: 'Space X', it: 'Space X' }, description: { en: 'Moon Gravity.', it: 'Gravità lunare.' }, icon: '🌑', rarity: 'COMMON' },
  { id: 'DRUNK_CAM', title: { en: 'Vodka', it: 'Vodka' }, description: { en: 'Drunk Camera.', it: 'Telecamera ubriaca.' }, icon: '🍺', rarity: 'CURSED' },
  { id: 'WIDE_LENS', title: { en: 'GoPro', it: 'GoPro' }, description: { en: 'Extreme FOV.', it: 'FOV estremo.' }, icon: '👁️', rarity: 'COMMON' },
  { id: 'DISCO', title: { en: 'Epilepsy', it: 'Epilepsy' }, description: { en: 'Strobe Lights.', it: 'Luci stroboscopiche.' }, icon: '🪩', rarity: 'LEGENDARY' },
  { id: 'SPEED_DEMON', title: { en: 'Meth', it: 'Meth' }, description: { en: 'Insane Speed.', it: 'Velocità folle.' }, icon: '🔥', rarity: 'LEGENDARY' },
  { id: 'INVERTED_COLORS', title: { en: 'Negative', it: 'Negative' }, description: { en: 'Inverted Colors.', it: 'Colori invertiti.' }, icon: '🌗', rarity: 'CURSED' },
  { id: 'HEAVY_METAL', title: { en: 'Fat', it: 'Fat' }, description: { en: 'Heavy fall.', it: 'Caduta massiccia.' }, icon: '🤘', rarity: 'RARE' },
  { id: 'PIXEL_HELL', title: { en: '144p', it: '144p' }, description: { en: 'Atari Resolution.', it: 'Risoluzione Atari.' }, icon: '👾', rarity: 'CURSED' },
  { id: 'WIRE_FRAME', title: { en: 'The Matrix', it: 'The Matrix' }, description: { en: 'Lines only.', it: 'Solo linee.' }, icon: '🕸️', rarity: 'LEGENDARY' },
  { id: 'AUSTRALIA_MODE', title: { en: 'Upside Down', it: 'Upside Down' }, description: { en: 'World flipped.', it: 'Mondo capovolto.' }, icon: '🙃', rarity: 'CURSED' },
  { id: 'EARTHQUAKE', title: { en: 'Parkinson', it: 'Parkinson' }, description: { en: 'Constant shaking.', it: 'Tremolio costante.' }, icon: '💢', rarity: 'CURSED' }
];

export const LORE_TEXT = {
  en: [
    "LOADING ANXIETY...",
    "RENDERING FAILED.",
    "YOU ARE NOT REAL.",
    "YOUR CAT JUDGES YOU.",
    "THE CAKE IS A LIE.",
    "RUN FROM RESPONSIBILITY.",
    "ERROR 418: I'M A TEAPOT."
  ],
  it: [
    "CARICAMENTO ANSIA...",
    "RENDERING FALLITO.",
    "NON SEI REALE.",
    "IL TUO GATTO TI GIUDICA.",
    "LA TORTA È UNA MENZOGNA.",
    "CORRI DALLA TUA RESPONSABILITÀ.",
    "ERRORE 418: I'M A TEAPOT."
  ]
};

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
    [PowerUpType.SHIELD]: { en: 'Plasma Shield', it: 'Plasma Shield' },
    [PowerUpType.MULTIPLIER]: { en: 'Quantum Bit', it: 'Quantum Bit' },
    [PowerUpType.SPEED]: { en: 'Overclock', it: 'Overclock' }
  }
};

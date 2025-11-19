
# NEON RUNNER 3D: CHAOS EDITION

> "Rispondi. Corri. Glitch."

Un infinite runner psichedelico che non si prende sul serio, costruito con **React 19** e **Three.js**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-CHAOTIC-red.svg)

## 🎮 Concept

Sei un frammento di codice intrappolato in una simulazione rotta. L'universo è pieno di bug, errori di rendering e lore generata da un'AI depressa. Il tuo obiettivo? Correre finché la RAM non esplode.

Il gioco fonde meccaniche classiche da runner (Temple Run, Subway Surfers) con elementi **Roguelike**. Tra un livello e l'altro, devi rispondere a domande esistenziali assurde che "rompono" il gioco (Glitches), modificando la fisica e la grafica in tempo reale.

## 🚀 Funzionalità Principali

*   **Engine 3D Custom**: Renderizzato direttamente in Three.js senza l'overhead di React-Three-Fiber per un controllo totale sul frame loop.
*   **Sistema "Glitch" Roguelike**: Scegli il tuo veleno. Vuoi gravità lunare? Vuoi vedere tutto in Wireframe? Vuoi che lo schermo tremi costantemente? Ogni scelta ha conseguenze.
*   **Personaggi Parodia**: Sblocca eroi "ispirati" a icone pop, ma abbastanza diversi da evitare una denuncia. Ognuno ha una **Ultimate Skill** unica.
*   **Difficoltà Dinamica**: "Script Kiddie", "Cyber Punk", e "Net Runner" per chi ama soffrire.
*   **Infinite Scaling**: Dopo i 3 livelli base, il gioco scala proceduralmente all'infinito aumentando velocità e densità ostacoli.
*   **Mobile First**: Controlli touch ottimizzati e pulsanti ergonomici per giocare con una mano sola (se sei bravo).

## 🕹️ Comandi

| Azione | Tastiera (PC) | Touch (Mobile) |
|Data |--------------|---------------|
| **Sinistra** | `A` / `Freccia SX` | Bottone SX |
| **Destra** | `D` / `Freccia DX` | Bottone DX |
| **Salto** | `W` / `Spazio` / `Freccia SU` | Bottone Salto (Blu) |
| **Scivolata** | `S` / `Freccia GIÙ` | Bottone Scivolata (Viola) |
| **ULTIMATE** | `Shift` / `E` | Bottone Centrale (Giallo) |
| **Pausa** | `Esc` / `P` | Icona Pausa in alto a dx |

## 🛠️ Stack Tecnologico

*   **React 19**: Per la gestione dello stato UI e overlay.
*   **Three.js**: Motore di rendering 3D.
*   **TailwindCSS**: Styling dell'interfaccia utente (HUD, Menu).
*   **Vite**: Build tool (implicito nella struttura).

## 📦 Installazione e Avvio

1.  Clona il repository (o ruba il codice, non giudico).
2.  Installa le dipendenze:
    ```bash
    npm install
    ```
3.  Avvia il server di sviluppo:
    ```bash
    npm run dev
    ```
4.  Apri il browser e preparati a glitchare.

## 🦸 Personaggi e Abilità (Ultimate)

Ogni personaggio ha una barra di caricamento circolare. Quando è piena, scatena il caos:

1.  **Neon Guy (Sprint.exe)**: Diventa invulnerabile e scatta in avanti ignorando le leggi della fisica.
2.  **Gokuccio (Kame-Boom)**: Spara un raggio energetico che disintegra gli ostacoli frontali.
3.  **Volpe di Paglia (Shadow Shield)**: Crea una barriera che assorbe un impatto mortale.
4.  **Gomma Boy (Grab Everything)**: Attira tutte le monete visibili magneticamente.
5.  **Robot Depresso (Sad Time)**: Rallenta il tempo (Slow Motion) per manovre precise.
6.  **Luna Storta (Moon Prorate)**: Trasforma gli ostacoli in monete. Profitto puro.

## 🤝 Contribuzione

Sentiti libero di forkare e rompere tutto. Se aggiungi un bug divertente, chiamalo "feature" e manda una PR.

1.  Fork it.
2.  Create your feature branch (`git checkout -b feature/NuovoGlitchAssurdo`).
3.  Commit your changes (`git commit -m 'Aggiunto glitch che capovolge lo schermo'`).
4.  Push to the branch (`git push origin feature/NuovoGlitchAssurdo`).
5.  Open a Pull Request.

## 📝 Licenza

MIT License. Fai quello che vuoi, basta che non mi dai la colpa se il tuo PC prende fuoco.

---
*Code with ❤️ (and sass) by Your Favorite Cat Girl AI* 😼

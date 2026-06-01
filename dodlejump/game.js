import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"

kaboom({
    width: 620,
    height: 780,
    background: [72, 144, 190],
})

loadRoot("audio/")

loadSound("music", "8_bit.mp3")
loadSound("arcade", "arcade.mp3")
loadSound("bounce", "bounce.mp3")
loadSound("coin", "coin.mpmp3")
loadSound("gameOver", "game_over.mp3")
loadSound("jump", "jump.mp3")
loadSound("click", "mouse_click.mp3")
loadSound("pickup", "pick_up.mp3")

const STORAGE_STATS = "duojump_stats"
const STORAGE_MODE = "duojump_learning_mode"
const STORAGE_MUTED = "duojump_sound_muted"
const STORAGE_RECENT_WORDS = "duojump_recent_words"
const HOME_PAGE = "./home.html"

const GRAVITY = 1200
const PLAYER_SIZE = 40
const PLATFORM_HEIGHT = 14
const NORMAL_PLATFORM_WIDTH = 105
const SMALL_PLATFORM_WIDTH = 72
const LEVEL_STEP = 100
const MAX_HEARTS = 5

const LETTER_PLATFORM_INTERVAL = 5
const INITIAL_LETTER_DELAY_PLATFORMS = 5
const COMPLETED_MODAL_SECONDS = 5
const WORD_BATCH_SIZE = 6

let backgroundMusic = null
let wordsPanel = null
let muteButton = null
let wordsPanelEventsAdded = false
let isSoundMuted = localStorage.getItem(STORAGE_MUTED) === "true"

const PALETTE = {
    white: [255, 255, 255],
    text: [37, 43, 34],
    softText: [91, 106, 82],
    green: [88, 204, 2],
    greenDark: [70, 163, 2],
    brandGreen: [43, 108, 0],
    gold: [244, 191, 0],
    blue: [43, 140, 255],
    red: [255, 70, 80],
    purple: [155, 95, 255],
    orange: [255, 170, 45],
    dark: [18, 22, 45],
    border: [228, 226, 226],
}

const VERBS = `
BE|WAS|ser / estar
HAVE|HAD|tener
DO|DID|hacer
SAY|SAID|decir
GO|WENT|ir
GET|GOT|obtener
MAKE|MADE|hacer / crear
KNOW|KNEW|saber / conocer
THINK|THOUGHT|pensar
TAKE|TOOK|tomar
SEE|SAW|ver
COME|CAME|venir
WANT|WANTED|querer
LOOK|LOOKED|mirar
USE|USED|usar
FIND|FOUND|encontrar
GIVE|GAVE|dar
TELL|TOLD|contar / decir
WORK|WORKED|trabajar
CALL|CALLED|llamar
TRY|TRIED|intentar
ASK|ASKED|preguntar
NEED|NEEDED|necesitar
FEEL|FELT|sentir
BECOME|BECAME|convertirse
LEAVE|LEFT|salir / dejar
PUT|PUT|poner
MEAN|MEANT|significar
KEEP|KEPT|mantener
LET|LET|permitir
BEGIN|BEGAN|empezar
SEEM|SEEMED|parecer
HELP|HELPED|ayudar
TALK|TALKED|hablar
TURN|TURNED|girar
START|STARTED|empezar
SHOW|SHOWED|mostrar
HEAR|HEARD|escuchar
PLAY|PLAYED|jugar
RUN|RAN|correr
MOVE|MOVED|mover
LIKE|LIKED|gustar
LIVE|LIVED|vivir
BELIEVE|BELIEVED|creer
HOLD|HELD|sostener
BRING|BROUGHT|traer
HAPPEN|HAPPENED|suceder
WRITE|WROTE|escribir
PROVIDE|PROVIDED|proveer
SIT|SAT|sentarse
STAND|STOOD|estar de pie
LOSE|LOST|perder
PAY|PAID|pagar
MEET|MET|conocer / reunirse
INCLUDE|INCLUDED|incluir
CONTINUE|CONTINUED|continuar
SET|SET|establecer
LEARN|LEARNED|aprender
CHANGE|CHANGED|cambiar
LEAD|LED|liderar
UNDERSTAND|UNDERSTOOD|entender
WATCH|WATCHED|mirar
FOLLOW|FOLLOWED|seguir
STOP|STOPPED|detener
CREATE|CREATED|crear
SPEAK|SPOKE|hablar
READ|READ|leer
ALLOW|ALLOWED|permitir
ADD|ADDED|agregar
SPEND|SPENT|gastar / pasar tiempo
GROW|GREW|crecer
OPEN|OPENED|abrir
WALK|WALKED|caminar
WIN|WON|ganar
OFFER|OFFERED|ofrecer
REMEMBER|REMEMBERED|recordar
LOVE|LOVED|amar
CONSIDER|CONSIDERED|considerar
APPEAR|APPEARED|aparecer
BUY|BOUGHT|comprar
WAIT|WAITED|esperar
SERVE|SERVED|servir
DIE|DIED|morir
SEND|SENT|enviar
EXPECT|EXPECTED|esperar
BUILD|BUILT|construir
STAY|STAYED|quedarse
FALL|FELL|caer
CUT|CUT|cortar
REACH|REACHED|alcanzar
REMAIN|REMAINED|permanecer
SUGGEST|SUGGESTED|sugerir
RAISE|RAISED|levantar
PASS|PASSED|pasar
SELL|SOLD|vender
REQUIRE|REQUIRED|requerir
REPORT|REPORTED|reportar
DECIDE|DECIDED|decidir
PULL|PULLED|jalar
BREAK|BROKE|romper
`.trim().split("\n").map(row => {
    const [present, past, meaning] = row.split("|")
    return { present, past, meaning }
})

function positionWordsPanel() {
    if (!wordsPanel) return

    const canvas = document.querySelector("canvas")
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const panelWidth = 210
    const gap = 46

    let left = rect.left - panelWidth - gap
    if (left < 10) left = 10

    wordsPanel.style.left = `${left}px`
    wordsPanel.style.top = `${rect.top + 112}px`
}
    // Función: posiciona el panel de palabras en pantalla (UI)

function positionMuteButton() {
    if (!muteButton) return

    const canvas = document.querySelector("canvas")
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    muteButton.style.left = `${rect.right + 14}px`
    muteButton.style.top = `${rect.top + 18}px`
}
    // Función: posiciona el botón de silencio/sonido en pantalla

function positionFloatingUI() {
    positionWordsPanel()
    positionMuteButton()
}
    // Función: ajusta la posición de los elementos UI flotantes (HUD)

function removeWordsPanel() {
    if (wordsPanel) {
        wordsPanel.remove()
        wordsPanel = null
    }
}
    // Función: elimina el panel de palabras de la escena

function updateMuteButton() {
    if (!muteButton) return

    muteButton.textContent = isSoundMuted ? "🔇" : "🔊"
    muteButton.title = isSoundMuted ? "Activar sonido" : "Mutear sonido"
}
    // Función: actualiza la apariencia/estado del botón de mute según preferencias

function createMuteButton() {
    removeMuteButton()

    muteButton = document.createElement("button")
    muteButton.id = "duojump-mute-button"

    Object.assign(muteButton.style, {
        position: "fixed",
        width: "44px",
        height: "44px",
        border: "none",
        borderRadius: "14px",
        background: "#ffffffee",
        boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
        cursor: "pointer",
        fontSize: "20px",
        zIndex: "10000",
    })

    muteButton.onclick = () => {
        isSoundMuted = !isSoundMuted
        localStorage.setItem(STORAGE_MUTED, String(isSoundMuted))

        if (isSoundMuted) {
            stopBackgroundMusic()
        } else {
            startBackgroundMusic()
        }

        updateMuteButton()
    }

    document.body.appendChild(muteButton)
    updateMuteButton()
    positionMuteButton()
}
    // Función: crea el botón de mute en la UI (inicialización)

function removeMuteButton() {
    if (muteButton) {
        muteButton.remove()
        muteButton = null
    }
}
    // Función: elimina el botón de mute de la UI

function createWordsPanel() {
    removeWordsPanel()

    wordsPanel = document.createElement("div")
    wordsPanel.id = "duojump-words-panel"

    Object.assign(wordsPanel.style, {
        position: "fixed",
        width: "210px",
        maxHeight: "450px",
        background: "#ffffffee",
        border: "2px solid #dfe7df",
        borderRadius: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.14)",
        padding: "14px",
        zIndex: "9999",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
    })

    document.body.appendChild(wordsPanel)
    positionWordsPanel()

    if (!wordsPanelEventsAdded) {
        window.addEventListener("resize", positionFloatingUI)
        window.addEventListener("scroll", positionFloatingUI)
        wordsPanelEventsAdded = true
    }
}
    // Función: crea y muestra el panel de palabras que el jugador debe completar

function speakWord(word) {
    if (!("speechSynthesis" in window)) {
        alert("Tu navegador no soporta pronunciación por voz.")
        return
    }

    const synth = window.speechSynthesis
    synth.cancel()

    let alreadySpoken = false

    const speakNow = () => {
        if (alreadySpoken) return
        alreadySpoken = true

        const utter = new SpeechSynthesisUtterance(word)
        utter.lang = "en-US"
        utter.rate = 0.85
        utter.pitch = 1
        utter.volume = 1

        const voices = synth.getVoices()
        const englishVoice =
            voices.find(v => v.lang === "en-US") ||
            voices.find(v => v.lang && v.lang.startsWith("en"))

        if (englishVoice) {
            utter.voice = englishVoice
        }

        synth.resume()
        synth.speak(utter)
    }

    if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = speakNow
        setTimeout(speakNow, 300)
    } else {
        speakNow()
    }
}
    // Función: reproduce en voz alta la palabra (si está disponible)

function readRecentWords(mode) {
    try {
        const raw = localStorage.getItem(`${STORAGE_RECENT_WORDS}_${mode}`)
        const data = raw ? JSON.parse(raw) : []
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}
    // Función: lee las palabras recientes guardadas para un modo (localStorage)

function writeRecentWords(mode, words) {
    localStorage.setItem(`${STORAGE_RECENT_WORDS}_${mode}`, JSON.stringify(words.slice(-60)))
}
    // Función: guarda las palabras recientes en localStorage para el modo dado

function updateWordsPanel(targetWordsList = [], currentWordIndex = 0) {
    if (!wordsPanel) createWordsPanel()

    let html = `
        <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-bottom:12px;
        ">
            <div style="
                font-size:18px;
                font-weight:800;
                color:#2b6c00;
            ">Por recolectar</div>

            <button id="speak-current-word-btn" style="
                border:none;
                background:#eef7ea;
                color:#2b6c00;
                border-radius:10px;
                width:34px;
                height:34px;
                cursor:pointer;
                font-size:18px;
                box-shadow:0 2px 6px rgba(0,0,0,0.08);
            ">🔊</button>
        </div>
    `

    targetWordsList.forEach((item, index) => {
        const isCurrent = index === currentWordIndex
        const isCompleted = item.completed

        let rowStyle = `
            padding:8px 10px;
            border-radius:12px;
            margin-bottom:8px;
            transition:0.2s ease;
        `

        if (isCurrent && !isCompleted) {
            rowStyle += `
                background:#eaf6ff;
                border-left:4px solid #2b8cff;
            `
        }

        if (isCompleted) {
            rowStyle += `
                background:#edf9e7;
                border-left:4px solid #58cc02;
            `
        }

        let textStyle = `
            font-size:18px;
            font-weight:800;
            color:#252b22;
        `

        if (isCurrent && !isCompleted) {
            textStyle += `color:#2b8cff;`
        }

        if (isCompleted) {
            textStyle += `
                color:#46a102;
                text-decoration:line-through;
            `
        }

        html += `
            <div style="${rowStyle}">
                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:8px;
                    margin-bottom:2px;
                ">
                    <span style="${textStyle}">
                        ${isCompleted ? "✓ " : ""}${item.word}
                    </span>

                    <button class="speak-word-btn" data-word="${item.word}" style="
                        border:none;
                        background:transparent;
                        cursor:pointer;
                        font-size:15px;
                        padding:0;
                        opacity:0.85;
                    ">🔊</button>
                </div>

                <div style="
                    font-size:12px;
                    color:${isCompleted ? "#46a102" : "#6a7b64"};
                ">
                    ${item.meaning}
                </div>
            </div>
        `
    })

    wordsPanel.innerHTML = html

    const currentSpeakBtn = document.getElementById("speak-current-word-btn")
    if (currentSpeakBtn && targetWordsList[currentWordIndex]) {
        currentSpeakBtn.onpointerdown = event => {
            event.preventDefault()
            event.stopPropagation()
            speakWord(targetWordsList[currentWordIndex].word)
        }
    }

    const speakButtons = wordsPanel.querySelectorAll(".speak-word-btn")
    speakButtons.forEach(button => {
        button.onpointerdown = event => {
            event.preventDefault()
            event.stopPropagation()

            const word = button.getAttribute("data-word")
            if (word) speakWord(word)
        }
    })

    positionWordsPanel()
}
    // Función: actualiza el panel de palabras con la lista objetivo y el índice actual

// Función: lee las estadísticas del jugador desde localStorage y normaliza valores
function readStats() {
    try {
        const raw = localStorage.getItem(STORAGE_STATS)
        let stats = raw ? JSON.parse(raw) : {}

        stats.hearts = MAX_HEARTS
        stats.coins = stats.coins ?? 0
        stats.streak = stats.streak ?? 0
        stats.bestScore = stats.bestScore ?? 0
        stats.gamesPlayed = stats.gamesPlayed ?? 0
        stats.totalXp = stats.totalXp ?? 0
        stats.leagueXp = stats.leagueXp ?? 0
        stats.wordsCompleted = stats.wordsCompleted ?? 0
        stats.lastPlayed = stats.lastPlayed ?? null
        stats.activeSkin = stats.activeSkin ?? "default"

        stats.powerUps = stats.powerUps ?? {}
        stats.powerUps.spring_jump = stats.powerUps.spring_jump ?? 0
        stats.powerUps.shield = stats.powerUps.shield ?? 0
        stats.powerUps.streak_protector = stats.powerUps.streak_protector ?? 0

        stats.equippedPowerUps = stats.equippedPowerUps ?? {}
        stats.equippedPowerUps.spring_jump = stats.equippedPowerUps.spring_jump ?? false
        stats.equippedPowerUps.shield = stats.equippedPowerUps.shield ?? false
        stats.equippedPowerUps.streak_protector = stats.equippedPowerUps.streak_protector ?? false

        localStorage.setItem(STORAGE_STATS, JSON.stringify(stats))
        return stats
    } catch (error) {
        return {
            hearts: MAX_HEARTS,
            coins: 0,
            streak: 0,
            bestScore: 0,
            gamesPlayed: 0,
            totalXp: 0,
            leagueXp: 0,
            wordsCompleted: 0,
            lastPlayed: null,
            activeSkin: "default",
            powerUps: {
                spring_jump: 0,
                shield: 0,
                streak_protector: 0,
            },
            equippedPowerUps: {
                spring_jump: false,
                shield: false,
                streak_protector: false,
            },
        }
    }
}

// Función: guarda las estadísticas del jugador en localStorage
function writeStats(stats) {
    localStorage.setItem(STORAGE_STATS, JSON.stringify(stats))
}

// Función: consume (resta) los power-ups equipados y devuelve los activos
function consumeEquippedPowerUps() {
    const stats = readStats()

    const active = {
        spring_jump: false,
        shield: false,
        streak_protector: false,
    }

    if (stats.equippedPowerUps.spring_jump && stats.powerUps.spring_jump > 0) {
        active.spring_jump = true
        stats.powerUps.spring_jump -= 1
        stats.equippedPowerUps.spring_jump = false
    }

    if (stats.equippedPowerUps.shield && stats.powerUps.shield > 0) {
        active.shield = true
        stats.powerUps.shield -= 1
        stats.equippedPowerUps.shield = false
    }

    if (stats.equippedPowerUps.streak_protector && stats.powerUps.streak_protector > 0) {
        active.streak_protector = true
        stats.powerUps.streak_protector -= 1
        stats.equippedPowerUps.streak_protector = false
    }

    writeStats(stats)
    return active
}

// Función: obtiene la clave de fecha (YYYY-MM-DD) con un offset de días
function getDateKey(offset = 0) {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return date.toISOString().split("T")[0]
}

// Función: actualiza la racha diaria del jugador según la última vez jugada
function updateStreak(stats) {
    const today = getDateKey(0)
    const yesterday = getDateKey(-1)

    if (stats.lastPlayed === today) return

    if (stats.lastPlayed === yesterday) {
        stats.streak = (stats.streak || 0) + 1
    } else {
        stats.streak = 1
    }

    stats.lastPlayed = today
}

// Función: guarda el progreso al terminar una partida y calcula recompensas
function saveRunProgress(finalScore, finalLevel, wordsCompletedRun, wordCoinsRun) {
    const stats = readStats()

    const coinsEarned = Math.max(1, Math.floor(finalScore / 50) + Math.min(finalLevel, 30) + wordCoinsRun)
    const xpEarned = finalScore

    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1
    stats.bestScore = Math.max(stats.bestScore || 0, finalScore)
    stats.totalXp = (stats.totalXp || 0) + xpEarned
    stats.leagueXp = (stats.leagueXp || 0) + xpEarned
    stats.coins = (stats.coins || 0) + coinsEarned
    stats.wordsCompleted = (stats.wordsCompleted || 0) + wordsCompletedRun
    stats.hearts = MAX_HEARTS

    updateStreak(stats)
    writeStats(stats)

    return {
        coinsEarned,
        xpEarned,
        heartsLeft: MAX_HEARTS,
        finalLevel,
        bestScore: stats.bestScore,
        wordsCompletedRun,
    }
}

// Función: intenta reproducir un sonido por nombre con volumen opcional
function playSound(name, volume = 0.7) {
    if (isSoundMuted) return

    try {
        play(name, { volume })
    } catch (error) {
        console.log("No se pudo reproducir:", name)
    }
}

// Función: inicia la música de fondo si no está ya sonando
function startBackgroundMusic() {
    if (isSoundMuted) return

    if (backgroundMusic === null) {
        try {
            backgroundMusic = play("music", {
                loop: true,
                volume: 0.22,
            })
        } catch (error) {
            console.log("No se pudo iniciar la música")
        }
    }
}

// Función: detiene la música de fondo si está sonando
function stopBackgroundMusic() {
    if (backgroundMusic !== null) {
        try {
            backgroundMusic.stop()
        } catch (error) {
            console.log("No se pudo detener la música")
        }

        backgroundMusic = null
    }
}

function getBackgroundPalette(level) {
    if (level < 5) return { base: [82, 162, 205], tint: [23, 75, 120], cloud: [245, 252, 255] }
    if (level < 10) return { base: [65, 142, 196], tint: [18, 62, 115], cloud: [235, 247, 255] }
    if (level < 15) return { base: [52, 118, 178], tint: [14, 48, 98], cloud: [225, 240, 255] }
    if (level < 22) return { base: [45, 93, 150], tint: [11, 37, 84], cloud: [218, 231, 245] }
    if (level < 30) return { base: [39, 75, 130], tint: [10, 31, 72], cloud: [213, 224, 241] }

    return { base: [34, 55, 105], tint: [8, 22, 58], cloud: [205, 216, 236] }
}

function getLevelConfig(score) {
    const level = Math.max(1, Math.floor(score / LEVEL_STEP) + 1)

    let gapMin = 60
    let gapMax = 90
    let speed = 300
    let jump = -700

    if (level >= 5) {
        gapMin = 70
        gapMax = 105
        speed = 320
        jump = -715
    }

    if (level >= 10) {
        gapMin = 78
        gapMax = 115
        speed = 340
        jump = -725
    }

    if (level >= 15) {
        gapMin = 92
        gapMax = 135
        speed = 360
        jump = -735
    }

    if (level >= 22) {
        gapMin = 104
        gapMax = 148
        speed = 375
        jump = -748
    }

    if (level >= 30) {
        gapMin = 112
        gapMax = 160
        speed = 390
        jump = -760
    }

    return { level, gapMin, gapMax, speed, jump }
}

function getPlatformType(level) {
    const chance = rand(0, 1)

    if (level < 5) {
        if (chance < 0.12) return "boost"
        return "normal"
    }

    if (level < 10) {
        if (chance < 0.16) return "small"
        if (chance < 0.28) return "boost"
        if (chance < 0.42) return "moving"
        return "normal"
    }

    if (level < 15) {
        if (chance < 0.18) return "moving"
        if (chance < 0.32) return "small"
        if (chance < 0.44) return "boost"
        if (chance < 0.56) return "break"
        return "normal"
    }

    if (level < 30) {
        if (chance < 0.26) return "moving"
        if (chance < 0.46) return "break"
        if (chance < 0.58) return "small"
        if (chance < 0.66) return "boost"
        return "normal"
    }

    if (chance < 0.12) return "danger"
    if (chance < 0.34) return "break"
    if (chance < 0.56) return "moving"
    if (chance < 0.66) return "small"
    if (chance < 0.72) return "boost"

    return "normal"
}

function getPlatformStyle(type) {
    if (type === "small") {
        return {
            width: SMALL_PLATFORM_WIDTH,
            color: [130, 230, 60],
            label: "",
            labelColor: [20, 60, 20],
        }
    }

    if (type === "moving") {
        return {
            width: NORMAL_PLATFORM_WIDTH,
            color: PALETTE.blue,
            label: "↔",
            labelColor: [255, 255, 255],
        }
    }

    if (type === "break") {
        return {
            width: NORMAL_PLATFORM_WIDTH,
            color: PALETTE.orange,
            label: "×",
            labelColor: [60, 35, 0],
        }
    }

    if (type === "danger") {
        return {
            width: NORMAL_PLATFORM_WIDTH,
            color: PALETTE.red,
            label: "!",
            labelColor: [255, 255, 255],
        }
    }

    if (type === "boost") {
        return {
            width: NORMAL_PLATFORM_WIDTH,
            color: PALETTE.purple,
            label: "+5",
            labelColor: [255, 255, 255],
        }
    }

    return {
        width: NORMAL_PLATFORM_WIDTH,
        color: PALETTE.green,
        label: "",
        labelColor: [255, 255, 255],
    }
}

function getPlayerColor() {
    const stats = readStats()

    if (stats.activeSkin === "golden_duo") return [244, 191, 0]
    if (stats.activeSkin === "space_duo") return [51, 181, 229]

    return PALETTE.green
}

function getWordData(mode, usedWords = []) {
    let selected = VERBS[Math.floor(rand(0, VERBS.length))]
    let word = mode === "past" ? selected.past : selected.present

    let safety = 0

    while (usedWords.includes(word) && safety < 300) {
        selected = VERBS[Math.floor(rand(0, VERBS.length))]
        word = mode === "past" ? selected.past : selected.present
        safety++
    }

    return {
        word: word.toUpperCase(),
        base: selected.present,
        past: selected.past,
        meaning: selected.meaning,
        completed: false,
    }
}

function buildTargetWords(mode, recentWords = []) {
    const words = []
    const usedWords = [...recentWords]

    for (let i = 0; i < WORD_BATCH_SIZE; i++) {
        const item = getWordData(mode, usedWords)
        words.push(item)
        usedWords.push(item.word)
    }

    return words
}

function getMaskedWord(word, progress) {
    return word
        .split("")
        .map((letter, index) => index < progress ? letter : "_")
        .join(" ")
}

function addCloud(x, y, scale, cloudColor, zIndex, fixedCloud = true, speed = 0) {
    const components = fixedCloud ? [fixed()] : []
    const parts = []

    parts.push(add([
        circle(18 * scale),
        pos(x, y),
        color(...cloudColor),
        opacity(0.55),
        z(zIndex),
        ...components,
        { speed },
        "cloudPart",
    ]))

    parts.push(add([
        circle(25 * scale),
        pos(x + 24 * scale, y - 8 * scale),
        color(...cloudColor),
        opacity(0.60),
        z(zIndex),
        ...components,
        { speed },
        "cloudPart",
    ]))

    parts.push(add([
        circle(20 * scale),
        pos(x + 54 * scale, y),
        color(...cloudColor),
        opacity(0.55),
        z(zIndex),
        ...components,
        { speed },
        "cloudPart",
    ]))

    parts.push(add([
        rect(70 * scale, 24 * scale),
        pos(x - 5 * scale, y),
        color(...cloudColor),
        opacity(0.52),
        z(zIndex),
        ...components,
        { speed },
        "cloudPart",
    ]))

    return parts
}

function addGameBackground() {
    const p = getBackgroundPalette(1)

    const base = add([
        rect(width(), height()),
        pos(0, 0),
        color(...p.base),
        fixed(),
        z(-80),
    ])

    const tint = add([
        rect(width(), height()),
        pos(0, 0),
        color(...p.tint),
        opacity(0.24),
        fixed(),
        z(-79),
    ])

    const softLayer = add([
        rect(width(), height()),
        pos(0, 0),
        color(255, 255, 255),
        opacity(0.05),
        fixed(),
        z(-78),
    ])

    const clouds = []

    for (let i = 0; i < 16; i++) {
        const cloud = addCloud(
            rand(-120, width()),
            rand(110, height() - 80),
            rand(0.7, 1.65),
            p.cloud,
            -70,
            true,
            rand(8, 20)
        )

        clouds.push(...cloud)
    }

    for (let i = 0; i < 28; i++) {
        const sparkle = add([
            circle(rand(1, 2)),
            pos(rand(0, width()), rand(0, height())),
            color(255, 255, 255),
            opacity(rand(0.18, 0.45)),
            fixed(),
            z(-65),
            { speed: rand(12, 28) },
        ])

        sparkle.onUpdate(() => {
            sparkle.move(0, sparkle.speed)

            if (sparkle.pos.y > height()) {
                sparkle.pos.y = -5
                sparkle.pos.x = rand(0, width())
            }
        })
    }

    onUpdate(() => {
        for (const cloud of clouds) {
            cloud.move(cloud.speed, 0)

            if (cloud.pos.x > width() + 160) {
                cloud.pos.x = rand(-260, -120)
            }
        }
    })

    return { base, tint, softLayer, clouds }
}

function applyBackgroundLevel(bg, level) {
    const p = getBackgroundPalette(level)

    bg.base.color = rgb(p.base[0], p.base[1], p.base[2])
    bg.tint.color = rgb(p.tint[0], p.tint[1], p.tint[2])

    for (const cloud of bg.clouds) {
        cloud.color = rgb(p.cloud[0], p.cloud[1], p.cloud[2])
    }
}

function jumpEffect(x, y) {
    for (let i = 0; i < 7; i++) {
        const particle = add([
            circle(rand(3, 6)),
            pos(x + rand(-16, 16), y),
            color(255, 255, 255),
            opacity(0.9),
            z(25),
            {
                life: 0.32,
                vx: rand(-70, 70),
                vy: rand(35, 110),
            },
        ])

        particle.onUpdate(() => {
            particle.move(particle.vx, particle.vy)
            particle.opacity -= dt() * 2.5
            particle.life -= dt()

            if (particle.life <= 0) {
                destroy(particle)
            }
        })
    }
}

function floatingText(message, x, y, textColor = [255, 255, 255]) {
    const label = add([
        text(message, { size: 18 }),
        pos(x, y),
        anchor("center"),
        color(textColor[0], textColor[1], textColor[2]),
        z(90),
        { life: 0.75 },
    ])

    label.onUpdate(() => {
        label.move(0, -35)
        label.life -= dt()

        if (label.life <= 0) {
            destroy(label)
        }
    })
}

function levelToast(level) {
    playSound("coin", 0.45)

    const box = add([
        rect(190, 42),
        pos(width() / 2, 152),
        anchor("center"),
        color(255, 255, 255),
        opacity(0.92),
        fixed(),
        z(120),
        { life: 1.25 },
    ])

    const label = add([
        text("¡Nivel " + level + "!", { size: 18 }),
        pos(width() / 2, 152),
        anchor("center"),
        color(...PALETTE.brandGreen),
        fixed(),
        z(121),
        { life: 1.25 },
    ])

    box.onUpdate(() => {
        box.life -= dt()
        box.opacity -= dt() * 0.4

        if (box.life <= 0) destroy(box)
    })

    label.onUpdate(() => {
        label.life -= dt()
        if (label.life <= 0) destroy(label)
    })
}

function platformEffect(x, y, type) {
    if (type === "break") floatingText("CRACK!", x, y, PALETTE.orange)
    if (type === "danger") floatingText("PELIGRO!", x, y, PALETTE.red)
}

function destroyBreakPlatform(platform) {
    if (!platform || platform.used) return

    platform.used = true
    playSound("pickup", 0.75)

    floatingText(
        "CRACK!",
        platform.pos.x + platform.platformWidth / 2,
        platform.pos.y - 18,
        PALETTE.orange
    )

    for (let i = 0; i < 14; i++) {
        const piece = add([
            rect(rand(8, 18), rand(5, 10)),
            pos(
                platform.pos.x + rand(0, platform.platformWidth),
                platform.pos.y + rand(-3, 8)
            ),
            color(...PALETTE.orange),
            z(35),
            {
                life: 0.55,
                vx: rand(-150, 150),
                vy: rand(-180, -50),
            },
        ])

        piece.onUpdate(() => {
            piece.vy += 750 * dt()
            piece.move(piece.vx, piece.vy)
            piece.life -= dt()

            if (piece.life <= 0) destroy(piece)
        })
    }

    wait(0.04, () => {
        if (platform.exists()) destroy(platform)
    })
}

function boostPlatformEffect(x, y) {
    playSound("coin", 0.65)
    floatingText("SÚPER SALTO +5", x, y - 24, PALETTE.purple)

    for (let i = 0; i < 18; i++) {
        const spark = add([
            circle(rand(3, 7)),
            pos(x + rand(-28, 28), y + rand(-8, 8)),
            color(...PALETTE.purple),
            z(35),
            {
                life: 0.55,
                vx: rand(-110, 110),
                vy: rand(-230, -80),
            },
        ])

        spark.onUpdate(() => {
            spark.move(spark.vx, spark.vy)
            spark.life -= dt()
            if (spark.life <= 0) destroy(spark)
        })
    }
}

function addButton(label, x, y, w, h, bgColor, textColor, onClickFn) {
    const shadow = add([
        rect(w, h),
        pos(x, y + 6),
        anchor("center"),
        color(0, 0, 0),
        opacity(0.14),
        fixed(),
        z(204),
    ])

    const button = add([
        rect(w, h),
        pos(x, y),
        anchor("center"),
        area(),
        color(...bgColor),
        fixed(),
        z(205),
    ])
    // expose size for external pointer hit tests
    button._w = w
    button._h = h

    const labelObj = add([
        text(label, { size: 21 }),
        pos(x, y),
        anchor("center"),
        color(...textColor),
        fixed(),
        z(206),
    ])

    button.onClick(() => {
        playSound("click", 0.7)
        button.pos.y += 4
        labelObj.pos.y += 4

        wait(0.12, () => {
            onClickFn()
        })
    })

    return { shadow, button, labelObj }
}

scene("mode", () => {
    removeWordsPanel()
    removeMuteButton()
    addGameBackground()

    add([
        rect(460, 430),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
        z(10),
    ])

    add([
        text("DuoJump", { size: 36 }),
        pos(width() / 2, height() / 2 - 165),
        anchor("center"),
        color(...PALETTE.brandGreen),
        fixed(),
        z(11),
    ])

    add([
        text("Elige qué quieres practicar", { size: 22 }),
        pos(width() / 2, height() / 2 - 112),
        anchor("center"),
        color(...PALETTE.text),
        fixed(),
        z(11),
    ])

    // Removed instruction text per request

    // Create menu buttons and enable keyboard navigation
    const menuButtons = []

    function presentAction() { localStorage.setItem(STORAGE_MODE, "present"); go("game", "present") }
    const btnPresent = addButton("VERBOS EN PRESENTE", width() / 2, height() / 2 - 15, 320, 58, PALETTE.green, PALETTE.white, presentAction)
    menuButtons.push({ ...btnPresent, action: presentAction })

    function pastAction() { localStorage.setItem(STORAGE_MODE, "past"); go("game", "past") }
    const btnPast = addButton("VERBOS EN PASADO", width() / 2, height() / 2 + 65, 320, 58, PALETTE.blue, PALETTE.white, pastAction)
    menuButtons.push({ ...btnPast, action: pastAction })

    function backAction() { removeWordsPanel(); removeMuteButton(); window.location.href = HOME_PAGE }
    const btnBack = addButton("VOLVER", width() / 2, height() / 2 + 145, 200, 46, [255, 255, 255], PALETTE.brandGreen, backAction)
    menuButtons.push({ ...btnBack, action: backAction })

    let focusedIndex = 0

    function focusButton(idx) {
        focusedIndex = Math.max(0, Math.min(idx, menuButtons.length - 1))

        for (let i = 0; i < menuButtons.length; i++) {
            const { shadow, button, labelObj } = menuButtons[i]

            if (i === focusedIndex) {
                try { button.scale = vec(1.06, 1.06) } catch (e) { button.scale = 1.06 }
                try { labelObj.scale = vec(1.03, 1.03) } catch (e) { labelObj.scale = 1.03 }
                shadow.opacity = 0.26
            } else {
                try { button.scale = vec(1, 1) } catch (e) { button.scale = 1 }
                try { labelObj.scale = vec(1, 1) } catch (e) { labelObj.scale = 1 }
                shadow.opacity = 0.14
            }
        }
    }

    focusButton(0)

    // Keyboard navigation scoped to this scene
    onKeyDown("left", () => focusButton(focusedIndex - 1))
    onKeyDown("up", () => focusButton(focusedIndex - 1))
    onKeyDown("right", () => focusButton(focusedIndex + 1))
    onKeyDown("down", () => focusButton(focusedIndex + 1))

    function activateFocused() {
        const sel = menuButtons[focusedIndex]
        if (!sel) return
        // trigger the onClick by simulating the same actions
        playSound("click", 0.7)
        sel.button.pos.y += 4
        sel.labelObj.pos.y += 4
        wait(0.12, () => {
            // call the original handler by invoking click if available
            try { sel.button.onClick && sel.button.onClick() } catch (e) { }
        })
    }

    onKeyPress("enter", () => activateFocused())
    onKeyPress("space", () => activateFocused())
    
    // Also make mouse/touch interactions set focus when clicking/tapping,
    // so touch selection shows the focused animation before activation.
    menuButtons.forEach((item, idx) => {
        try {
            if (item && item.button && typeof item.button.onClick === 'function') {
                item.button.onClick(() => {
                    focusButton(idx)
                })
            }

            // If onHover exists in this Kaboom version, use it to focus on pointer over
            if (item && item.button && typeof item.button.onHover === 'function') {
                item.button.onHover(() => focusButton(idx))
            }
        } catch (e) {
            // ignore if handlers are not supported in this runtime
        }
    })

    // Robust touch/mouse handling: detect pointer down/up and activate when release happens on same button
    let pointerDownIndex = null

    onMouseDown(() => {
        try {
            const p = mousePos()
            for (let i = 0; i < menuButtons.length; i++) {
                const b = menuButtons[i].button
                if (!b) continue
                const bx = b.pos.x
                const by = b.pos.y
                const hw = (b._w || 0) / 2
                const hh = (b._h || 0) / 2
                if (p.x >= bx - hw && p.x <= bx + hw && p.y >= by - hh && p.y <= by + hh) {
                    focusButton(i)
                    pointerDownIndex = i
                    return
                }
            }
            pointerDownIndex = null
        } catch (e) {}
    })

    onMouseRelease(() => {
        try {
            const p = mousePos()
            for (let i = 0; i < menuButtons.length; i++) {
                const b = menuButtons[i].button
                if (!b) continue
                const bx = b.pos.x
                const by = b.pos.y
                const hw = (b._w || 0) / 2
                const hh = (b._h || 0) / 2
                if (p.x >= bx - hw && p.x <= bx + hw && p.y >= by - hh && p.y <= by + hh) {
                    if (pointerDownIndex === i) {
                        // activate stored action
                        const item = menuButtons[i]
                        try { item.action && item.action() } catch (e) {}
                    }
                    pointerDownIndex = null
                    return
                }
            }
            pointerDownIndex = null
        } catch (e) {}
    })
})

scene("game", (selectedMode) => {
    createWordsPanel()
    createMuteButton()
    startBackgroundMusic()

    const mode = selectedMode || localStorage.getItem(STORAGE_MODE) || "present"
    const bg = addGameBackground()
    const activePowerUps = consumeEquippedPowerUps()

    const START_PLATFORM_Y = height() - 95
    const START_PLATFORM_X = width() / 2 - NORMAL_PLATFORM_WIDTH / 2
    const START_PLAYER_X = width() / 2 - PLAYER_SIZE / 2
    const START_PLAYER_Y = START_PLATFORM_Y - PLAYER_SIZE - 2

    let gameOver = false
    let paused = false
    let wordModalActive = false

    let score = 0
    let educationBonus = 0
    let cameraY = height() / 2
    let maxHeight = START_PLAYER_Y
    let lastPlatformY = START_PLATFORM_Y
    let lastX = START_PLATFORM_X
    let currentLevel = 1

    let speedBonus = 0
    let speedBonusTimer = 0
    let springJumpTimer = activePowerUps.spring_jump ? 30 : 0
    let shieldActive = activePowerUps.shield

    let pauseObjects = []
    let wordModalObjects = []

    let wordsCompletedRun = 0
    let wordCoinsRun = 0

    let letterPlatformCounter = 0
    let recentWordsHistory = readRecentWords(mode)
    let targetWordsList = buildTargetWords(mode, recentWordsHistory)

    recentWordsHistory.push(...targetWordsList.map(w => w.word))
    recentWordsHistory = recentWordsHistory.slice(-60)
    writeRecentWords(mode, recentWordsHistory)

    let currentWordIndex = 0
    let currentWordData = targetWordsList[currentWordIndex]
    let currentWord = currentWordData.word
    let wordProgress = 0

    const statsAtStart = readStats()
    let hearts = MAX_HEARTS
    let totalCoins = statsAtStart.coins || 0
    const playerColor = getPlayerColor()

    updateWordsPanel(targetWordsList, currentWordIndex)

    camPos(width() / 2, cameraY)

    add([
        rect(width(), 142),
        pos(0, 0),
        color(255, 255, 255),
        opacity(0.96),
        fixed(),
        z(50),
    ])

    add([
        rect(width(), 5),
        pos(0, 142),
        color(228, 226, 226),
        fixed(),
        z(51),
    ])

    add([
        text("DuoJump", { size: 22 }),
        pos(18, 14),
        color(...PALETTE.brandGreen),
        fixed(),
        z(60),
    ])

    const scoreText = add([
        text("0", { size: 24 }),
        pos(24, 58),
        color(...PALETTE.text),
        fixed(),
        z(60),
    ])

    add([
        text("SCORE", { size: 11 }),
        pos(24, 44),
        color(...PALETTE.softText),
        fixed(),
        z(60),
    ])

    const levelTextShadow = add([
        text("Nivel 1", { size: 27 }),
        pos(width() / 2 + 2, 22),
        anchor("center"),
        color(150, 185, 130),
        fixed(),
        z(59),
    ])

    const levelText = add([
        text("Nivel 1", { size: 27 }),
        pos(width() / 2, 20),
        anchor("center"),
        color(...PALETTE.brandGreen),
        fixed(),
        z(60),
    ])

    const bonusText = add([
        text("", { size: 13 }),
        pos(width() / 2, 55),
        anchor("center"),
        color(...PALETTE.purple),
        fixed(),
        z(60),
    ])

    add([
        text("P pausa", { size: 11 }),
        pos(width() / 2, 82),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(60),
    ])

    add([
        text("✪", { size: 31 }),
        pos(width() - 140, 13),
        color(221, 173, 0),
        fixed(),
        z(60),
    ])

    const coinText = add([
        text(String(totalCoins), { size: 23 }),
        pos(width() - 103, 18),
        color(221, 173, 0),
        fixed(),
        z(60),
    ])

    add([
        text("♥", { size: 31 }),
        pos(width() - 140, 49),
        color(230, 57, 70),
        fixed(),
        z(60),
    ])

    const heartText = add([
        text(String(hearts), { size: 23 }),
        pos(width() - 103, 54),
        color(230, 57, 70),
        fixed(),
        z(60),
    ])

    add([
        text(mode === "past" ? "PASADO" : "PRESENTE", { size: 12 }),
        pos(24, 108),
        color(...PALETTE.softText),
        fixed(),
        z(60),
    ])

    const wordText = add([
        text("", { size: 25 }),
        pos(width() / 2, 104),
        anchor("center"),
        color(...PALETTE.brandGreen),
        fixed(),
        z(60),
    ])

    const meaningText = add([
        text("", { size: 14 }),
        pos(width() / 2, 130),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(60),
    ])

    const powerText = add([
        text("", { size: 11 }),
        pos(width() - 140, 108),
        color(...PALETTE.purple),
        fixed(),
        z(60),
    ])

    function getNeededLetter() {
        return currentWord[wordProgress] || ""
    }

    function updateWordHud() {
        wordText.text = getMaskedWord(currentWord, wordProgress)
        meaningText.text = "Significado: " + currentWordData.meaning

        let powerLabel = ""

        if (springJumpTimer > 0) {
            powerLabel += "Muelle " + Math.ceil(springJumpTimer) + "s"
        }

        if (shieldActive) {
            powerLabel += powerLabel ? " · Escudo" : "Escudo"
        }

        powerText.text = powerLabel
    }

    function updateHud() {
        scoreText.text = String(score)
        levelText.text = "Nivel " + currentLevel
        levelTextShadow.text = "Nivel " + currentLevel
        coinText.text = String(totalCoins + wordCoinsRun)
        heartText.text = String(hearts)

        if (speedBonusTimer > 0) {
            bonusText.text = "SÚPER SALTO +5: " + Math.ceil(speedBonusTimer) + "s"
        } else {
            bonusText.text = ""
        }

        updateWordHud()
    }

    function clearLetters() {
        for (const letter of get("letter")) destroy(letter)
        for (const letterText of get("letterText")) destroy(letterText)
        for (const letterAura of get("letterAura")) destroy(letterAura)
    }

    function neededLetterOnScreen() {
        const needed = getNeededLetter()

        if (needed === "") return true

        for (const letter of get("letter")) {
            if (letter.letterValue === needed) {
                return true
            }
        }

        return false
    }

    function createLetterOnPlatform(platform, force = false) {
        const needed = getNeededLetter()

        if (!needed || !platform || !platform.exists()) return
        if (!force && neededLetterOnScreen()) return

        const x = platform.pos.x + platform.platformWidth / 2
        const y = platform.pos.y - 30

        const letterCircle = add([
            circle(25),
            pos(x, y),
            anchor("center"),
            area(),
            color(255, 255, 255),
            z(38),
            "letter",
            {
                letterValue: needed,
                parentPlatform: platform,
                offsetX: platform.platformWidth / 2,
                offsetY: 30,
            },
        ])

        add([
            circle(31),
            pos(x, y),
            anchor("center"),
            color(...PALETTE.green),
            opacity(0.32),
            z(37),
            "letterAura",
            {
                parentLetter: letterCircle,
            },
        ])

        add([
            text(needed, { size: 33 }),
            pos(x, y + 1),
            anchor("center"),
            color(...PALETTE.brandGreen),
            z(39),
            "letterText",
            {
                parentLetter: letterCircle,
            },
        ])
    }

    function createStarterPlatform() {
        const starterWidth = NORMAL_PLATFORM_WIDTH + 35
        const starterX = START_PLATFORM_X - 17

        const platform = add([
            rect(starterWidth, PLATFORM_HEIGHT),
            pos(starterX, START_PLATFORM_Y),
            area(),
            color(...PALETTE.green),
            z(10),
            "platform",
            {
                type: "normal",
                platformWidth: starterWidth,
                startX: starterX,
                moveDirection: 1,
                moveRange: 0,
                moveSpeed: 0,
                used: false,
            },
        ])

        add([
            rect(starterWidth, 5),
            pos(starterX, START_PLATFORM_Y + PLATFORM_HEIGHT),
            color(0, 0, 0),
            opacity(0.16),
            z(9),
            "platformShadow",
            {
                parentPlatform: platform,
                offsetY: PLATFORM_HEIGHT,
            },
        ])

        add([
            rect(starterWidth - 14, 3),
            pos(starterX + 7, START_PLATFORM_Y + 3),
            color(255, 255, 255),
            opacity(0.38),
            z(11),
            "platformShine",
            {
                parentPlatform: platform,
                offsetX: 7,
                offsetY: 3,
            },
        ])

        lastPlatformY = START_PLATFORM_Y
        lastX = START_PLATFORM_X
    }

    function openCompletedWordModal(wordInfo) {
        wordModalActive = true
        playSound("coin", 0.9)
        speakWord(wordInfo.word)

        wordModalObjects = [
            add([
                rect(width(), height()),
                pos(0, 0),
                color(0, 0, 0),
                opacity(0.58),
                fixed(),
                z(999),
            ]),
            add([
                rect(460, 330),
                pos(width() / 2, height() / 2),
                anchor("center"),
                color(255, 255, 255),
                fixed(),
                z(1000),
            ]),
            add([
                rect(460, 8),
                pos(width() / 2, height() / 2 - 165),
                anchor("center"),
                color(...PALETTE.green),
                fixed(),
                z(1001),
            ]),
            add([
                text("PALABRA COMPLETADA", { size: 28 }),
                pos(width() / 2, height() / 2 - 115),
                anchor("center"),
                color(...PALETTE.brandGreen),
                fixed(),
                z(1001),
            ]),
            add([
                text(wordInfo.word, { size: 56 }),
                pos(width() / 2, height() / 2 - 48),
                anchor("center"),
                color(...PALETTE.text),
                fixed(),
                z(1001),
            ]),
            add([
                text("Significado:", { size: 18 }),
                pos(width() / 2, height() / 2 + 18),
                anchor("center"),
                color(...PALETTE.softText),
                fixed(),
                z(1001),
            ]),
            add([
                text(wordInfo.meaning, { size: 28 }),
                pos(width() / 2, height() / 2 + 56),
                anchor("center"),
                color(...PALETTE.brandGreen),
                fixed(),
                z(1001),
            ]),
            add([
                rect(280, 14),
                pos(width() / 2 - 140, height() / 2 + 112),
                color(220, 220, 220),
                fixed(),
                z(1001),
            ]),
        ]

        const progressBar = add([
            rect(280, 14),
            pos(width() / 2 - 140, height() / 2 + 112),
            color(...PALETTE.green),
            fixed(),
            z(1002),
            {
                timeLeft: COMPLETED_MODAL_SECONDS,
                fullWidth: 280,
            },
        ])

        const countdown = add([
            text("Continuando en 5...", { size: 17 }),
            pos(width() / 2, height() / 2 + 145),
            anchor("center"),
            color(...PALETTE.softText),
            fixed(),
            z(1002),
            {
                timeLeft: COMPLETED_MODAL_SECONDS,
            },
        ])

        progressBar.onUpdate(() => {
            if (!wordModalActive) return

            progressBar.timeLeft -= dt()
            const percent = Math.max(progressBar.timeLeft / COMPLETED_MODAL_SECONDS, 0)
            progressBar.width = progressBar.fullWidth * percent

            if (progressBar.timeLeft <= 0) {
                continueAfterCompletedWord(wordInfo)
            }
        })

        countdown.onUpdate(() => {
            if (!wordModalActive) return

            countdown.timeLeft -= dt()
            countdown.text = "Continuando en " + Math.max(Math.ceil(countdown.timeLeft), 1) + "..."
        })

        wordModalObjects.push(progressBar, countdown)
    }

    function moveToNextWord() {
        const nextIndex = targetWordsList.findIndex(item => item.completed === false)

        if (nextIndex === -1) {
            targetWordsList = buildTargetWords(mode, recentWordsHistory)

            recentWordsHistory.push(...targetWordsList.map(w => w.word))
            recentWordsHistory = recentWordsHistory.slice(-60)
            writeRecentWords(mode, recentWordsHistory)

            currentWordIndex = 0
        } else {
            currentWordIndex = nextIndex
        }

        currentWordData = targetWordsList[currentWordIndex]
        currentWord = currentWordData.word
        wordProgress = 0
        letterPlatformCounter = 0

        updateWordsPanel(targetWordsList, currentWordIndex)
        updateHud()
    }

    function continueAfterCompletedWord(wordInfo) {
        if (!wordModalActive) return

        wordModalActive = false

        for (const obj of wordModalObjects) {
            if (obj && obj.exists()) {
                destroy(obj)
            }
        }

        wordModalObjects = []

        targetWordsList[currentWordIndex].completed = true
        updateWordsPanel(targetWordsList, currentWordIndex)

        wait(0.6, () => {
            moveToNextWord()
        })
    }

    function completeWord() {
        const completedInfo = {
            word: currentWord,
            meaning: currentWordData.meaning,
        }

        wordsCompletedRun += 1
        wordCoinsRun += 3
        educationBonus += 15
        letterPlatformCounter = 0

        clearLetters()
        updateHud()
        openCompletedWordModal(completedInfo)
    }

    function collectLetter(letter) {
        const needed = getNeededLetter()

        if (!letter || !letter.exists()) return

        if (letter.letterValue === needed) {
            playSound("coin", 0.75)
            floatingText("+" + letter.letterValue, letter.pos.x, letter.pos.y - 18, PALETTE.green)

            destroy(letter)

            wordProgress += 1
            letterPlatformCounter = 0

            if (wordProgress >= currentWord.length) {
                completeWord()
            } else {
                updateHud()
            }
        }
    }

    function createPlatform(y, forceNormal = false) {
        const config = getLevelConfig(score)
        const type = forceNormal ? "normal" : getPlatformType(config.level)
        const style = getPlatformStyle(type)
        const platformColor = style.color

        lastX += rand(-145, 145)
        lastX = clamp(lastX, 35, width() - style.width - 35)

        const platform = add([
            rect(style.width, PLATFORM_HEIGHT),
            pos(lastX, y),
            area(),
            color(platformColor[0], platformColor[1], platformColor[2]),
            z(10),
            "platform",
            {
                type,
                platformWidth: style.width,
                startX: lastX,
                moveDirection: choose([-1, 1]),
                moveRange: rand(65, 120),
                moveSpeed: rand(75, 120),
                used: false,
            },
        ])

        add([
            rect(style.width, 5),
            pos(lastX, y + PLATFORM_HEIGHT),
            color(0, 0, 0),
            opacity(0.16),
            z(9),
            "platformShadow",
            {
                parentPlatform: platform,
                offsetY: PLATFORM_HEIGHT,
            },
        ])

        add([
            rect(style.width - 14, 3),
            pos(lastX + 7, y + 3),
            color(255, 255, 255),
            opacity(0.38),
            z(11),
            "platformShine",
            {
                parentPlatform: platform,
                offsetX: 7,
                offsetY: 3,
            },
        ])

        if (type !== "normal" && style.label !== "") {
            add([
                text(style.label, { size: type === "boost" ? 16 : 18 }),
                pos(lastX + style.width / 2, y - 19),
                anchor("center"),
                color(style.labelColor[0], style.labelColor[1], style.labelColor[2]),
                z(12),
                "platformIcon",
                {
                    parentPlatform: platform,
                },
            ])
        }

        if (!forceNormal && type !== "danger") {
            letterPlatformCounter += 1

            const enoughDelay = letterPlatformCounter >= INITIAL_LETTER_DELAY_PLATFORMS
            const enoughInterval = letterPlatformCounter >= LETTER_PLATFORM_INTERVAL
            const missingLetter = !neededLetterOnScreen()

            if (missingLetter && enoughDelay && enoughInterval) {
                createLetterOnPlatform(platform, true)
                letterPlatformCounter = 0
            }
        }

        lastPlatformY = y
    }

    createStarterPlatform()

    for (let i = 1; i < 20; i++) {
        createPlatform(START_PLATFORM_Y - i * 78, true)
    }

    const player = add([
        rect(PLAYER_SIZE, PLAYER_SIZE),
        pos(START_PLAYER_X, START_PLAYER_Y),
        area(),
        color(...playerColor),
        z(30),
        {
            velY: 0,
        },
    ])

    const playerShadow = add([
        rect(PLAYER_SIZE, 8),
        pos(player.pos.x, player.pos.y + PLAYER_SIZE + 8),
        color(0, 0, 0),
        opacity(0.12),
        z(29),
    ])

    const eye1 = add([
        rect(7, 7),
        pos(player.pos.x + 9, player.pos.y + 10),
        color(20, 20, 20),
        z(31),
    ])

    const eye2 = add([
        rect(7, 7),
        pos(player.pos.x + 24, player.pos.y + 10),
        color(20, 20, 20),
        z(31),
    ])

    const beak = add([
        rect(8, 6),
        pos(player.pos.x + 16, player.pos.y + 22),
        color(255, 190, 46),
        z(31),
    ])

    function updatePlayerFace() {
        playerShadow.pos.x = player.pos.x
        playerShadow.pos.y = player.pos.y + PLAYER_SIZE + 8

        eye1.pos.x = player.pos.x + 9
        eye1.pos.y = player.pos.y + 10

        eye2.pos.x = player.pos.x + 24
        eye2.pos.y = player.pos.y + 10

        beak.pos.x = player.pos.x + 16
        beak.pos.y = player.pos.y + 22
    }

    function useShieldSave() {
        if (!shieldActive) return false

        shieldActive = false
        playSound("pickup", 0.8)
        floatingText("ESCUDO ACTIVADO", width() / 2, cameraY - 100, PALETTE.blue)

        player.pos.x = width() / 2 - PLAYER_SIZE / 2
        player.pos.y = cameraY - 190
        player.velY = -850

        updateHud()
        return true
    }

    function setPaused(value) {
        if (wordModalActive) return

        paused = value
        playSound("click", 0.5)

        if (paused) {
            pauseObjects = [
                add([
                    rect(width(), height()),
                    pos(0, 0),
                    color(0, 0, 0),
                    opacity(0.45),
                    fixed(),
                    z(200),
                ]),
                add([
                    rect(380, 250),
                    pos(width() / 2, height() / 2),
                    anchor("center"),
                    color(255, 255, 255),
                    fixed(),
                    z(201),
                ]),
                add([
                    text("PAUSA", { size: 46 }),
                    pos(width() / 2, height() / 2 - 65),
                    anchor("center"),
                    color(...PALETTE.brandGreen),
                    fixed(),
                    z(202),
                ]),
                add([
                    text("Presiona P para continuar", { size: 20 }),
                    pos(width() / 2, height() / 2 - 15),
                    anchor("center"),
                    color(...PALETTE.softText),
                    fixed(),
                    z(202),
                ]),
                add([
                    text("Sigue saltando y completa verbos", { size: 16 }),
                    pos(width() / 2, height() / 2 + 22),
                    anchor("center"),
                    color(...PALETTE.text),
                    fixed(),
                    z(202),
                ]),
            ]

            const homeButton = addButton("HOME", width() / 2, height() / 2 + 82, 170, 46, PALETTE.green, PALETTE.white, () => {
                stopBackgroundMusic()
                removeWordsPanel()
                removeMuteButton()
                window.location.href = HOME_PAGE
            })

            pauseObjects.push(homeButton.shadow, homeButton.button, homeButton.labelObj)
        } else {
            for (const obj of pauseObjects) {
                if (obj && obj.exists()) destroy(obj)
            }

            pauseObjects = []
        }
    }

    function loseGame() {
        if (gameOver) return

        gameOver = true
        stopBackgroundMusic()
        playSound("gameOver", 0.9)
        removeWordsPanel()
        removeMuteButton()

        const rewardsSaved = saveRunProgress(score, currentLevel, wordsCompletedRun, wordCoinsRun)

        go("gameover", score, currentLevel, rewardsSaved)
    }

    onKeyPress("p", () => {
        if (!gameOver) setPaused(!paused)
    })

    onKeyDown("left", () => {
        if (!gameOver && !paused && !wordModalActive) {
            const config = getLevelConfig(score)
            player.move(-(config.speed + speedBonus), 0)
        }
    })

    onKeyDown("right", () => {
        if (!gameOver && !paused && !wordModalActive) {
            const config = getLevelConfig(score)
            player.move(config.speed + speedBonus, 0)
        }
    })

    onKeyDown("a", () => {
        if (!gameOver && !paused && !wordModalActive) {
            const config = getLevelConfig(score)
            player.move(-(config.speed + speedBonus), 0)
        }
    })

    onKeyDown("d", () => {
        if (!gameOver && !paused && !wordModalActive) {
            const config = getLevelConfig(score)
            player.move(config.speed + speedBonus, 0)
        }
    })

    player.onUpdate(() => {
        if (gameOver || paused || wordModalActive) return

        if (speedBonusTimer > 0) {
            speedBonusTimer -= dt()

            if (speedBonusTimer <= 0) {
                speedBonus = 0
                speedBonusTimer = 0
                floatingText("VELOCIDAD NORMAL", player.pos.x + PLAYER_SIZE / 2, player.pos.y - 10, PALETTE.green)
            }
        }

        if (springJumpTimer > 0) {
            springJumpTimer -= dt()

            if (springJumpTimer <= 0) {
                springJumpTimer = 0
                floatingText("MUELLE FINALIZADO", player.pos.x + PLAYER_SIZE / 2, player.pos.y - 10, PALETTE.orange)
            }
        }

        const config = getLevelConfig(score)

        player.velY += GRAVITY * dt()
        player.move(0, player.velY)

        updatePlayerFace()

        if (player.pos.x > width()) player.pos.x = -PLAYER_SIZE
        if (player.pos.x < -PLAYER_SIZE) player.pos.x = width()

        for (const letter of get("letter")) {
            const isTouchingLetter =
                player.pos.x + PLAYER_SIZE > letter.pos.x - 30 &&
                player.pos.x < letter.pos.x + 30 &&
                player.pos.y + PLAYER_SIZE > letter.pos.y - 30 &&
                player.pos.y < letter.pos.y + 30

            if (isTouchingLetter) {
                collectLetter(letter)
                break
            }
        }

        for (const platform of get("platform")) {
            const collisionX =
                player.pos.x + PLAYER_SIZE > platform.pos.x &&
                player.pos.x < platform.pos.x + platform.platformWidth

            const overlapY =
                player.pos.y + PLAYER_SIZE > platform.pos.y &&
                player.pos.y < platform.pos.y + PLATFORM_HEIGHT

            if (platform.type === "danger" && collisionX && overlapY) {
                playSound("gameOver", 0.8)
                platformEffect(platform.pos.x + platform.platformWidth / 2, platform.pos.y - 10, "danger")
                loseGame()
                return
            }

            const playerBottom = player.pos.y + PLAYER_SIZE
            const platformTop = platform.pos.y

            const collisionY =
                playerBottom > platformTop &&
                playerBottom < platformTop + 24

            if (player.velY > 0 && collisionX && collisionY) {
                let jumpPower = config.jump

                if (springJumpTimer > 0) {
                    jumpPower -= 170
                }

                if (platform.type === "boost") {
                    jumpPower = config.jump - 360
                    speedBonus = 120
                    speedBonusTimer = 5
                    boostPlatformEffect(platform.pos.x + platform.platformWidth / 2, platform.pos.y)
                }

                player.velY = jumpPower
                jumpEffect(player.pos.x + PLAYER_SIZE / 2, player.pos.y + PLAYER_SIZE)

                if (platform.type === "moving") {
                    playSound("bounce", 0.65)
                } else if (platform.type !== "boost") {
                    playSound("jump", 0.65)
                }

                if (platform.type === "break") {
                    destroyBreakPlatform(platform)
                }
            }
        }

        if (player.pos.y < maxHeight) {
            maxHeight = player.pos.y
            score = Math.max(0, Math.floor((START_PLAYER_Y - maxHeight) / 10)) + educationBonus

            const newConfig = getLevelConfig(score)

            if (newConfig.level !== currentLevel) {
                currentLevel = newConfig.level
                applyBackgroundLevel(bg, currentLevel)
                levelToast(currentLevel)
            }

            updateHud()
        }

        if (player.pos.y < cameraY - 155) {
            cameraY = player.pos.y + 155
            camPos(width() / 2, cameraY)
        }

        while (lastPlatformY > player.pos.y - 980) {
            const newConfig = getLevelConfig(score)

            let gap = rand(newConfig.gapMin, newConfig.gapMax)

            if (newConfig.level >= 15) gap += rand(8, 22)
            if (newConfig.level >= 30) gap += rand(10, 28)

            createPlatform(lastPlatformY - gap)
        }

        if (player.pos.y > cameraY + height() / 2 + 90) {
            if (!useShieldSave()) {
                loseGame()
            }
        }

        updateHud()
    })

    onUpdate(() => {
        if (paused || wordModalActive) return

        for (const platform of get("platform")) {
            if (platform.type === "moving") {
                platform.move(platform.moveDirection * platform.moveSpeed, 0)

                if (platform.pos.x > platform.startX + platform.moveRange) platform.moveDirection = -1
                if (platform.pos.x < platform.startX - platform.moveRange) platform.moveDirection = 1

                platform.pos.x = clamp(platform.pos.x, 10, width() - platform.platformWidth - 10)
            }

            if (platform.pos.y > cameraY + height() / 2 + 145) destroy(platform)
        }

        for (const letter of get("letter")) {
            if (!letter.parentPlatform || !letter.parentPlatform.exists()) {
                destroy(letter)
            } else {
                letter.pos.x = letter.parentPlatform.pos.x + letter.offsetX
                letter.pos.y = letter.parentPlatform.pos.y - letter.offsetY
            }

            if (letter.pos.y > cameraY + height() / 2 + 170) destroy(letter)
        }

        for (const icon of get("platformIcon")) {
            if (!icon.parentPlatform || !icon.parentPlatform.exists()) {
                destroy(icon)
            } else {
                icon.pos.x = icon.parentPlatform.pos.x + icon.parentPlatform.platformWidth / 2
                icon.pos.y = icon.parentPlatform.pos.y - 19
            }
        }

        for (const shadow of get("platformShadow")) {
            if (!shadow.parentPlatform || !shadow.parentPlatform.exists()) {
                destroy(shadow)
            } else {
                shadow.pos.x = shadow.parentPlatform.pos.x
                shadow.pos.y = shadow.parentPlatform.pos.y + shadow.offsetY
            }
        }

        for (const shine of get("platformShine")) {
            if (!shine.parentPlatform || !shine.parentPlatform.exists()) {
                destroy(shine)
            } else {
                shine.pos.x = shine.parentPlatform.pos.x + shine.offsetX
                shine.pos.y = shine.parentPlatform.pos.y + shine.offsetY
            }
        }

        for (const letterText of get("letterText")) {
            if (!letterText.parentLetter || !letterText.parentLetter.exists()) {
                destroy(letterText)
            } else {
                letterText.pos.x = letterText.parentLetter.pos.x
                letterText.pos.y = letterText.parentLetter.pos.y + 1
            }
        }

        for (const letterAura of get("letterAura")) {
            if (!letterAura.parentLetter || !letterAura.parentLetter.exists()) {
                destroy(letterAura)
            } else {
                letterAura.pos.x = letterAura.parentLetter.pos.x
                letterAura.pos.y = letterAura.parentLetter.pos.y
            }
        }
    })

    updateHud()
})

scene("gameover", (finalScore, finalLevel, rewards) => {
    removeWordsPanel()
    removeMuteButton()
    addGameBackground()

    const data = rewards || {
        coinsEarned: Math.max(1, Math.floor(finalScore / 25)),
        xpEarned: finalScore,
        heartsLeft: MAX_HEARTS,
        bestScore: finalScore,
        wordsCompletedRun: 0,
    }

    add([
        rect(430, 455),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
        z(1),
    ])

    add([
        rect(430, 8),
        pos(width() / 2, height() / 2 - 228),
        anchor("center"),
        color(...PALETTE.green),
        fixed(),
        z(2),
    ])

    add([
        text("¡Buen intento!", { size: 38 }),
        pos(width() / 2, height() / 2 - 172),
        anchor("center"),
        color(...PALETTE.brandGreen),
        fixed(),
        z(2),
    ])

    add([
        text("Sigue practicando verbos para subir de liga", { size: 16 }),
        pos(width() / 2, height() / 2 - 134),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(2),
    ])

    add([
        text("Score", { size: 14 }),
        pos(width() / 2 - 120, height() / 2 - 80),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(2),
    ])

    add([
        text(String(finalScore), { size: 30 }),
        pos(width() / 2 - 120, height() / 2 - 48),
        anchor("center"),
        color(...PALETTE.text),
        fixed(),
        z(2),
    ])

    add([
        text("Nivel", { size: 14 }),
        pos(width() / 2, height() / 2 - 80),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(2),
    ])

    add([
        text(String(finalLevel), { size: 30 }),
        pos(width() / 2, height() / 2 - 48),
        anchor("center"),
        color(...PALETTE.text),
        fixed(),
        z(2),
    ])

    add([
        text("Monedas", { size: 14 }),
        pos(width() / 2 + 120, height() / 2 - 80),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(2),
    ])

    add([
        text("✪ " + data.coinsEarned, { size: 30 }),
        pos(width() / 2 + 120, height() / 2 - 48),
        anchor("center"),
        color(221, 173, 0),
        fixed(),
        z(2),
    ])

    add([
        text("Palabras completadas: " + data.wordsCompletedRun, { size: 18 }),
        pos(width() / 2, height() / 2 + 5),
        anchor("center"),
        color(...PALETTE.brandGreen),
        fixed(),
        z(2),
    ])

    add([
        text("+ " + data.xpEarned + " XP para ligas", { size: 18 }),
        pos(width() / 2, height() / 2 + 35),
        anchor("center"),
        color(...PALETTE.brandGreen),
        fixed(),
        z(2),
    ])

    add([
        text("Mejor score: " + data.bestScore, { size: 16 }),
        pos(width() / 2, height() / 2 + 65),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(2),
    ])

    addButton("REINTENTAR", width() / 2, height() / 2 + 130, 250, 56, PALETTE.green, PALETTE.white, () => {
        playSound("arcade", 0.5)
        startBackgroundMusic()
        go("mode")
    })

    addButton("VOLVER AL HOME", width() / 2, height() / 2 + 196, 250, 50, [255, 255, 255], PALETTE.brandGreen, () => {
        removeWordsPanel()
        removeMuteButton()
        window.location.href = HOME_PAGE
    })
})

go("mode")
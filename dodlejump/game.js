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
loadSound("coin", "coin.mp3")
loadSound("gameOver", "game_over.mp3")
loadSound("jump", "jump.mp3")
loadSound("click", "mouse_click.mp3")
loadSound("pickup", "pick_up.mp3")

const STORAGE_STATS = "duojump_stats"
const STORAGE_MODE = "duojump_learning_mode"
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

let backgroundMusic = null

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

const VERBS = [
    { present: "BE", past: "WAS", meaning: "ser / estar" },
    { present: "HAVE", past: "HAD", meaning: "tener" },
    { present: "DO", past: "DID", meaning: "hacer" },
    { present: "SAY", past: "SAID", meaning: "decir" },
    { present: "GO", past: "WENT", meaning: "ir" },
    { present: "GET", past: "GOT", meaning: "obtener" },
    { present: "MAKE", past: "MADE", meaning: "hacer / crear" },
    { present: "KNOW", past: "KNEW", meaning: "saber / conocer" },
    { present: "THINK", past: "THOUGHT", meaning: "pensar" },
    { present: "TAKE", past: "TOOK", meaning: "tomar" },
    { present: "SEE", past: "SAW", meaning: "ver" },
    { present: "COME", past: "CAME", meaning: "venir" },
    { present: "WANT", past: "WANTED", meaning: "querer" },
    { present: "LOOK", past: "LOOKED", meaning: "mirar" },
    { present: "USE", past: "USED", meaning: "usar" },
    { present: "FIND", past: "FOUND", meaning: "encontrar" },
    { present: "GIVE", past: "GAVE", meaning: "dar" },
    { present: "TELL", past: "TOLD", meaning: "contar / decir" },
    { present: "WORK", past: "WORKED", meaning: "trabajar" },
    { present: "CALL", past: "CALLED", meaning: "llamar" },
    { present: "TRY", past: "TRIED", meaning: "intentar" },
    { present: "ASK", past: "ASKED", meaning: "preguntar" },
    { present: "NEED", past: "NEEDED", meaning: "necesitar" },
    { present: "FEEL", past: "FELT", meaning: "sentir" },
    { present: "BECOME", past: "BECAME", meaning: "convertirse" },
    { present: "LEAVE", past: "LEFT", meaning: "salir / dejar" },
    { present: "PUT", past: "PUT", meaning: "poner" },
    { present: "MEAN", past: "MEANT", meaning: "significar" },
    { present: "KEEP", past: "KEPT", meaning: "mantener" },
    { present: "LET", past: "LET", meaning: "permitir" },
    { present: "BEGIN", past: "BEGAN", meaning: "empezar" },
    { present: "SEEM", past: "SEEMED", meaning: "parecer" },
    { present: "HELP", past: "HELPED", meaning: "ayudar" },
    { present: "TALK", past: "TALKED", meaning: "hablar" },
    { present: "TURN", past: "TURNED", meaning: "girar" },
    { present: "START", past: "STARTED", meaning: "empezar" },
    { present: "SHOW", past: "SHOWED", meaning: "mostrar" },
    { present: "HEAR", past: "HEARD", meaning: "escuchar" },
    { present: "PLAY", past: "PLAYED", meaning: "jugar" },
    { present: "RUN", past: "RAN", meaning: "correr" },
    { present: "MOVE", past: "MOVED", meaning: "mover" },
    { present: "LIKE", past: "LIKED", meaning: "gustar" },
    { present: "LIVE", past: "LIVED", meaning: "vivir" },
    { present: "BELIEVE", past: "BELIEVED", meaning: "creer" },
    { present: "HOLD", past: "HELD", meaning: "sostener" },
    { present: "BRING", past: "BROUGHT", meaning: "traer" },
    { present: "HAPPEN", past: "HAPPENED", meaning: "suceder" },
    { present: "WRITE", past: "WROTE", meaning: "escribir" },
    { present: "PROVIDE", past: "PROVIDED", meaning: "proveer" },
    { present: "SIT", past: "SAT", meaning: "sentarse" },
    { present: "STAND", past: "STOOD", meaning: "estar de pie" },
    { present: "LOSE", past: "LOST", meaning: "perder" },
    { present: "PAY", past: "PAID", meaning: "pagar" },
    { present: "MEET", past: "MET", meaning: "conocer / reunirse" },
    { present: "INCLUDE", past: "INCLUDED", meaning: "incluir" },
    { present: "CONTINUE", past: "CONTINUED", meaning: "continuar" },
    { present: "SET", past: "SET", meaning: "establecer" },
    { present: "LEARN", past: "LEARNED", meaning: "aprender" },
    { present: "CHANGE", past: "CHANGED", meaning: "cambiar" },
    { present: "LEAD", past: "LED", meaning: "liderar" },
    { present: "UNDERSTAND", past: "UNDERSTOOD", meaning: "entender" },
    { present: "WATCH", past: "WATCHED", meaning: "mirar" },
    { present: "FOLLOW", past: "FOLLOWED", meaning: "seguir" },
    { present: "STOP", past: "STOPPED", meaning: "detener" },
    { present: "CREATE", past: "CREATED", meaning: "crear" },
    { present: "SPEAK", past: "SPOKE", meaning: "hablar" },
    { present: "READ", past: "READ", meaning: "leer" },
    { present: "ALLOW", past: "ALLOWED", meaning: "permitir" },
    { present: "ADD", past: "ADDED", meaning: "agregar" },
    { present: "SPEND", past: "SPENT", meaning: "gastar / pasar tiempo" },
    { present: "GROW", past: "GREW", meaning: "crecer" },
    { present: "OPEN", past: "OPENED", meaning: "abrir" },
    { present: "WALK", past: "WALKED", meaning: "caminar" },
    { present: "WIN", past: "WON", meaning: "ganar" },
    { present: "OFFER", past: "OFFERED", meaning: "ofrecer" },
    { present: "REMEMBER", past: "REMEMBERED", meaning: "recordar" },
    { present: "LOVE", past: "LOVED", meaning: "amar" },
    { present: "CONSIDER", past: "CONSIDERED", meaning: "considerar" },
    { present: "APPEAR", past: "APPEARED", meaning: "aparecer" },
    { present: "BUY", past: "BOUGHT", meaning: "comprar" },
    { present: "WAIT", past: "WAITED", meaning: "esperar" },
    { present: "SERVE", past: "SERVED", meaning: "servir" },
    { present: "DIE", past: "DIED", meaning: "morir" },
    { present: "SEND", past: "SENT", meaning: "enviar" },
    { present: "EXPECT", past: "EXPECTED", meaning: "esperar" },
    { present: "BUILD", past: "BUILT", meaning: "construir" },
    { present: "STAY", past: "STAYED", meaning: "quedarse" },
    { present: "FALL", past: "FELL", meaning: "caer" },
    { present: "CUT", past: "CUT", meaning: "cortar" },
    { present: "REACH", past: "REACHED", meaning: "alcanzar" },
    { present: "REMAIN", past: "REMAINED", meaning: "permanecer" },
    { present: "SUGGEST", past: "SUGGESTED", meaning: "sugerir" },
    { present: "RAISE", past: "RAISED", meaning: "levantar" },
    { present: "PASS", past: "PASSED", meaning: "pasar" },
    { present: "SELL", past: "SOLD", meaning: "vender" },
    { present: "REQUIRE", past: "REQUIRED", meaning: "requerir" },
    { present: "REPORT", past: "REPORTED", meaning: "reportar" },
    { present: "DECIDE", past: "DECIDED", meaning: "decidir" },
    { present: "PULL", past: "PULLED", meaning: "jalar" },
    { present: "BREAK", past: "BROKE", meaning: "romper" },
]

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

function writeStats(stats) {
    localStorage.setItem(STORAGE_STATS, JSON.stringify(stats))
}

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

function getDateKey(offset = 0) {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return date.toISOString().split("T")[0]
}

function updateStreak(stats) {
    const today = getDateKey(0)
    const yesterday = getDateKey(-1)

    if (stats.lastPlayed === today) {
        return
    }

    if (stats.lastPlayed === yesterday) {
        stats.streak = (stats.streak || 0) + 1
    } else {
        stats.streak = 1
    }

    stats.lastPlayed = today
}

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

function playSound(name, volume = 0.7) {
    try {
        play(name, {
            volume: volume,
        })
    } catch (error) {
        console.log("No se pudo reproducir:", name)
    }
}

function startBackgroundMusic() {
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
    if (level < 5) {
        return {
            base: [82, 162, 205],
            tint: [23, 75, 120],
            cloud: [245, 252, 255],
        }
    }

    if (level < 10) {
        return {
            base: [65, 142, 196],
            tint: [18, 62, 115],
            cloud: [235, 247, 255],
        }
    }

    if (level < 15) {
        return {
            base: [52, 118, 178],
            tint: [14, 48, 98],
            cloud: [225, 240, 255],
        }
    }

    if (level < 22) {
        return {
            base: [45, 93, 150],
            tint: [11, 37, 84],
            cloud: [218, 231, 245],
        }
    }

    if (level < 30) {
        return {
            base: [39, 75, 130],
            tint: [10, 31, 72],
            cloud: [213, 224, 241],
        }
    }

    return {
        base: [34, 55, 105],
        tint: [8, 22, 58],
        cloud: [205, 216, 236],
    }
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

    return {
        level,
        gapMin,
        gapMax,
        speed,
        jump,
    }
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

    if (stats.activeSkin === "golden_duo") {
        return [244, 191, 0]
    }

    if (stats.activeSkin === "space_duo") {
        return [51, 181, 229]
    }

    return PALETTE.green
}

function getWordData(mode, lastWord = "") {
    let selected = VERBS[Math.floor(rand(0, VERBS.length))]
    let word = mode === "past" ? selected.past : selected.present

    while (word === lastWord) {
        selected = VERBS[Math.floor(rand(0, VERBS.length))]
        word = mode === "past" ? selected.past : selected.present
    }

    return {
        word: word.toUpperCase(),
        base: selected.present,
        past: selected.past,
        meaning: selected.meaning,
    }
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

    return {
        base,
        tint,
        softLayer,
        clouds,
    }
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

        if (box.life <= 0) {
            destroy(box)
        }
    })

    label.onUpdate(() => {
        label.life -= dt()

        if (label.life <= 0) {
            destroy(label)
        }
    })
}

function platformEffect(x, y, type) {
    if (type === "break") {
        floatingText("CRACK!", x, y, PALETTE.orange)
    }

    if (type === "danger") {
        floatingText("PELIGRO!", x, y, PALETTE.red)
    }
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

            if (piece.life <= 0) {
                destroy(piece)
            }
        })
    }

    wait(0.04, () => {
        if (platform.exists()) {
            destroy(platform)
        }
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

            if (spark.life <= 0) {
                destroy(spark)
            }
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

    return {
        shadow,
        button,
        labelObj,
    }
}

scene("mode", () => {
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

    add([
        text("Atrapa letras encima de plataformas para completar verbos.", { size: 15 }),
        pos(width() / 2, height() / 2 - 78),
        anchor("center"),
        color(...PALETTE.softText),
        fixed(),
        z(11),
    ])

    addButton("VERBOS EN PRESENTE", width() / 2, height() / 2 - 15, 320, 58, PALETTE.green, PALETTE.white, () => {
        localStorage.setItem(STORAGE_MODE, "present")
        go("game", "present")
    })

    addButton("VERBOS EN PASADO", width() / 2, height() / 2 + 65, 320, 58, PALETTE.blue, PALETTE.white, () => {
        localStorage.setItem(STORAGE_MODE, "past")
        go("game", "past")
    })

    addButton("VOLVER", width() / 2, height() / 2 + 145, 200, 46, [255, 255, 255], PALETTE.brandGreen, () => {
        window.location.href = HOME_PAGE
    })
})

scene("game", (selectedMode) => {
    startBackgroundMusic()

    const mode = selectedMode || localStorage.getItem(STORAGE_MODE) || "present"
    const bg = addGameBackground()
    const activePowerUps = consumeEquippedPowerUps()

    let gameOver = false
    let paused = false
    let score = 0
    let educationBonus = 0
    let cameraY = height() / 2
    let maxHeight = 320
    let lastPlatformY = height() - 70
    let lastX = width() / 2
    let currentLevel = 1
    let speedBonus = 0
    let speedBonusTimer = 0
    let springJumpTimer = activePowerUps.spring_jump ? 30 : 0
    let shieldActive = activePowerUps.shield
    let rewardsSaved = null
    let pauseObjects = []
    let wordsCompletedRun = 0
    let wordCoinsRun = 0

    let letterPlatformCounter = 0
    let currentWordData = getWordData(mode)
    let currentWord = currentWordData.word
    let wordProgress = 0

    const statsAtStart = readStats()
    let hearts = MAX_HEARTS
    let totalCoins = statsAtStart.coins || 0
    const playerColor = getPlayerColor()

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

    function completeWord() {
        wordsCompletedRun += 1
        wordCoinsRun += 3
        educationBonus += 15
        letterPlatformCounter = 0

        playSound("coin", 0.8)
        floatingText("¡PALABRA COMPLETA! +3 ✪", width() / 2, cameraY - 160, PALETTE.green)

        const previousWord = currentWord
        currentWordData = getWordData(mode, previousWord)
        currentWord = currentWordData.word
        wordProgress = 0

        for (const letter of get("letter")) {
            destroy(letter)
        }

        updateHud()
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

    for (let i = 0; i < 20; i++) {
        createPlatform(height() - 70 - i * 78, true)
    }

    const player = add([
        rect(PLAYER_SIZE, PLAYER_SIZE),
        pos(width() / 2 - PLAYER_SIZE / 2, 320),
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
                window.location.href = HOME_PAGE
            })

            pauseObjects.push(homeButton.shadow, homeButton.button, homeButton.labelObj)
        } else {
            for (const obj of pauseObjects) {
                destroy(obj)
            }

            pauseObjects = []
        }
    }

    function loseGame() {
        if (gameOver) return

        gameOver = true
        stopBackgroundMusic()
        playSound("gameOver", 0.9)

        rewardsSaved = saveRunProgress(score, currentLevel, wordsCompletedRun, wordCoinsRun)

        go("gameover", score, currentLevel, rewardsSaved)
    }

    onKeyPress("p", () => {
        if (!gameOver) {
            setPaused(!paused)
        }
    })

    onKeyDown("left", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(-(config.speed + speedBonus), 0)
        }
    })

    onKeyDown("right", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(config.speed + speedBonus, 0)
        }
    })

    onKeyDown("a", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(-(config.speed + speedBonus), 0)
        }
    })

    onKeyDown("d", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(config.speed + speedBonus, 0)
        }
    })

    player.onUpdate(() => {
        if (gameOver || paused) return

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

        if (player.pos.x > width()) {
            player.pos.x = -PLAYER_SIZE
        }

        if (player.pos.x < -PLAYER_SIZE) {
            player.pos.x = width()
        }

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
            score = Math.floor((320 - maxHeight) / 10) + educationBonus

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

            if (newConfig.level >= 15) {
                gap += rand(8, 22)
            }

            if (newConfig.level >= 30) {
                gap += rand(10, 28)
            }

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
        if (paused) return

        for (const platform of get("platform")) {
            if (platform.type === "moving") {
                platform.move(platform.moveDirection * platform.moveSpeed, 0)

                if (platform.pos.x > platform.startX + platform.moveRange) {
                    platform.moveDirection = -1
                }

                if (platform.pos.x < platform.startX - platform.moveRange) {
                    platform.moveDirection = 1
                }

                platform.pos.x = clamp(platform.pos.x, 10, width() - platform.platformWidth - 10)
            }

            if (platform.pos.y > cameraY + height() / 2 + 145) {
                destroy(platform)
            }
        }

        for (const letter of get("letter")) {
            if (!letter.parentPlatform || !letter.parentPlatform.exists()) {
                destroy(letter)
            } else {
                letter.pos.x = letter.parentPlatform.pos.x + letter.offsetX
                letter.pos.y = letter.parentPlatform.pos.y - letter.offsetY
            }

            if (letter.pos.y > cameraY + height() / 2 + 170) {
                destroy(letter)
            }
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
        window.location.href = HOME_PAGE
    })
})

go("mode")
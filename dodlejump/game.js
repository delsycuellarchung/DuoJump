import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"

kaboom({
    width: 500,
    height: 700,
    background: [8, 8, 35],
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

const GRAVITY = 1200
const PLAYER_SIZE = 40
const PLATFORM_HEIGHT = 12
const NORMAL_PLATFORM_WIDTH = 100
const SMALL_PLATFORM_WIDTH = 70

let backgroundMusic = null

function playSound(name, volume = 0.7) {
    try {
        play(name, {
            volume: volume,
        })
    } catch (error) {
        console.log("No se pudo reproducir el sonido:", name, error)
    }
}

function startBackgroundMusic() {
    if (backgroundMusic === null) {
        try {
            backgroundMusic = play("music", {
                loop: true,
                volume: 0.25,
            })
        } catch (error) {
            console.log("No se pudo iniciar la música:", error)
        }
    }
}

function stopBackgroundMusic() {
    if (backgroundMusic !== null) {
        try {
            backgroundMusic.stop()
        } catch (error) {
            console.log("No se pudo detener la música:", error)
        }

        backgroundMusic = null
    }
}

function getLevelConfig(score) {
    if (score >= 350) {
        return {
            level: 5,
            name: "EXTREMO",
            gapMin: 95,
            gapMax: 130,
            speed: 390,
            jump: -760,
        }
    }

    if (score >= 220) {
        return {
            level: 4,
            name: "DIFICIL",
            gapMin: 85,
            gapMax: 120,
            speed: 360,
            jump: -740,
        }
    }

    if (score >= 120) {
        return {
            level: 3,
            name: "MEDIO",
            gapMin: 75,
            gapMax: 110,
            speed: 335,
            jump: -720,
        }
    }

    if (score >= 50) {
        return {
            level: 2,
            name: "FACIL+",
            gapMin: 70,
            gapMax: 100,
            speed: 315,
            jump: -700,
        }
    }

    return {
        level: 1,
        name: "FACIL",
        gapMin: 60,
        gapMax: 90,
        speed: 300,
        jump: -700,
    }
}

function getPlatformType(level) {
    const chance = rand(0, 1)

    if (level === 1) {
        return "normal"
    }

    if (level === 2) {
        if (chance < 0.25) return "small"
        return "normal"
    }

    if (level === 3) {
        if (chance < 0.25) return "moving"
        if (chance < 0.40) return "small"
        return "normal"
    }

    if (level === 4) {
        if (chance < 0.25) return "moving"
        if (chance < 0.45) return "break"
        if (chance < 0.60) return "small"
        return "normal"
    }

    if (level === 5) {
        if (chance < 0.25) return "moving"
        if (chance < 0.45) return "break"
        if (chance < 0.60) return "small"
        if (chance < 0.72) return "danger"
        return "normal"
    }

    return "normal"
}

function getPlatformStyle(type) {
    if (type === "small") {
        return {
            width: SMALL_PLATFORM_WIDTH,
            r: 120,
            g: 255,
            b: 120,
        }
    }

    if (type === "moving") {
        return {
            width: NORMAL_PLATFORM_WIDTH,
            r: 60,
            g: 190,
            b: 255,
        }
    }

    if (type === "break") {
        return {
            width: NORMAL_PLATFORM_WIDTH,
            r: 255,
            g: 170,
            b: 60,
        }
    }

    if (type === "danger") {
        return {
            width: NORMAL_PLATFORM_WIDTH,
            r: 255,
            g: 70,
            b: 80,
        }
    }

    return {
        width: NORMAL_PLATFORM_WIDTH,
        r: 0,
        g: 230,
        b: 100,
    }
}

function addStars() {
    for (let i = 0; i < 70; i++) {
        const star = add([
            circle(rand(1, 2)),
            pos(rand(0, width()), rand(0, height())),
            color(200, 200, 255),
            fixed(),
            z(-10),
            {
                speed: rand(10, 25),
            },
        ])

        star.onUpdate(() => {
            star.move(0, star.speed)

            if (star.pos.y > height()) {
                star.pos.y = -5
                star.pos.x = rand(0, width())
            }
        })
    }
}

function jumpEffect(x, y) {
    for (let i = 0; i < 6; i++) {
        const p = add([
            circle(rand(3, 5)),
            pos(x + rand(-15, 15), y),
            color(255, 255, 120),
            z(20),
            {
                life: 0.3,
                vx: rand(-60, 60),
                vy: rand(40, 100),
            },
        ])

        p.onUpdate(() => {
            p.move(p.vx, p.vy)
            p.life -= dt()

            if (p.life <= 0) {
                destroy(p)
            }
        })
    }
}

function centerMessage(msg) {
    playSound("coin", 0.7)

    const message = add([
        text(msg, { size: 34 }),
        pos(width() / 2, height() / 2 - 120),
        anchor("center"),
        color(255, 255, 0),
        fixed(),
        z(100),
        {
            life: 1.2,
        },
    ])

    message.onUpdate(() => {
        message.move(0, -25)
        message.life -= dt()

        if (message.life <= 0) {
            destroy(message)
        }
    })
}

function platformEffect(x, y, type) {
    let message = ""

    if (type === "break") message = "CRACK!"
    if (type === "danger") message = "PELIGRO!"

    if (message === "") return

    const label = add([
        text(message, { size: 18 }),
        pos(x, y),
        anchor("center"),
        color(255, 255, 255),
        z(80),
        {
            life: 0.45,
        },
    ])

    label.onUpdate(() => {
        label.move(0, -25)
        label.life -= dt()

        if (label.life <= 0) {
            destroy(label)
        }
    })
}

scene("start", () => {
    addStars()

    add([
        rect(420, 300),
        pos(width() / 2, height() / 2 - 10),
        anchor("center"),
        color(18, 18, 55),
        z(1),
    ])

    add([
        text("DOODLE JUMP", { size: 46 }),
        pos(width() / 2, height() / 2 - 130),
        anchor("center"),
        color(255, 255, 0),
        z(2),
    ])

    add([
        text("Obstaculos por niveles", { size: 20 }),
        pos(width() / 2, height() / 2 - 80),
        anchor("center"),
        color(180, 220, 255),
        z(2),
    ])

    const playButton = add([
        rect(220, 60),
        pos(width() / 2, height() / 2),
        anchor("center"),
        area(),
        color(255, 210, 0),
        z(3),
    ])

    add([
        text("JUGAR", { size: 28 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(10, 10, 30),
        z(4),
    ])

    add([
        text("Mover: Flechas o A / D", { size: 18 }),
        pos(width() / 2, height() / 2 + 85),
        anchor("center"),
        color(220, 220, 220),
        z(2),
    ])

    add([
        text("Pausar: P", { size: 18 }),
        pos(width() / 2, height() / 2 + 115),
        anchor("center"),
        color(180, 180, 180),
        z(2),
    ])

    playButton.onClick(() => {
        playSound("click", 0.8)
        playSound("arcade", 0.6)
        startBackgroundMusic()
        go("game")
    })
})

scene("game", () => {
    addStars()

    let gameOver = false
    let paused = false
    let score = 0
    let cameraY = height() / 2
    let maxHeight = 300
    let lastPlatformY = 650
    let lastX = 200
    let currentLevel = 1
    let pausePanel = null
    let pauseTitle = null
    let pauseInfo = null

    camPos(width() / 2, cameraY)

    add([
        rect(width(), 72),
        pos(0, 0),
        color(5, 5, 25),
        fixed(),
        z(50),
    ])

    const scoreText = add([
        text("Score: 0", { size: 20 }),
        pos(20, 15),
        color(255, 255, 255),
        fixed(),
        z(60),
    ])

    const levelText = add([
        text("Nivel 1 - FACIL", { size: 18 }),
        pos(width() / 2, 16),
        anchor("center"),
        color(255, 255, 0),
        fixed(),
        z(60),
    ])

    const obstacleText = add([
        text("Obstaculos: normales", { size: 15 }),
        pos(width() / 2, 43),
        anchor("center"),
        color(180, 220, 255),
        fixed(),
        z(60),
    ])

    add([
        text("P: Pausa", { size: 16 }),
        pos(475, 20),
        anchor("right"),
        color(180, 180, 180),
        fixed(),
        z(60),
    ])

    function updateObstacleText(level) {
        if (level === 1) {
            obstacleText.text = "Obstaculos: normales"
        }

        if (level === 2) {
            obstacleText.text = "Obstaculos: plataformas pequenas"
        }

        if (level === 3) {
            obstacleText.text = "Obstaculos: moviles"
        }

        if (level === 4) {
            obstacleText.text = "Obstaculos: moviles y rompibles"
        }

        if (level === 5) {
            obstacleText.text = "Obstaculos: peligrosos"
        }
    }

    function createPlatform(y, forceNormal = false) {
        const config = getLevelConfig(score)
        const type = forceNormal ? "normal" : getPlatformType(config.level)
        const style = getPlatformStyle(type)

        lastX += rand(-120, 120)
        lastX = clamp(lastX, 35, width() - style.width - 35)

        const platform = add([
            rect(style.width, PLATFORM_HEIGHT),
            pos(lastX, y),
            area(),
            color(style.r, style.g, style.b),
            z(10),
            "platform",
            {
                type: type,
                platformWidth: style.width,
                startX: lastX,
                moveDirection: choose([-1, 1]),
                moveRange: rand(55, 95),
                moveSpeed: rand(70, 115),
                used: false,
            },
        ])

        if (type === "danger") {
            add([
                text("!", { size: 18 }),
                pos(lastX + style.width / 2, y - 16),
                anchor("center"),
                color(255, 255, 255),
                z(11),
                "platformIcon",
                {
                    parentPlatform: platform,
                },
            ])
        }

        lastPlatformY = y
    }

    for (let i = 0; i < 18; i++) {
        createPlatform(650 - i * 75, true)
    }

    const player = add([
        rect(PLAYER_SIZE, PLAYER_SIZE),
        pos(230, 300),
        area(),
        color(255, 230, 0),
        z(30),
        {
            velY: 0,
        },
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

    function setPaused(value) {
        paused = value
        playSound("click", 0.5)

        if (paused) {
            pausePanel = add([
                rect(width(), height()),
                pos(0, 0),
                color(0, 0, 0),
                fixed(),
                z(200),
            ])

            pauseTitle = add([
                text("PAUSA", { size: 48 }),
                pos(width() / 2, height() / 2 - 30),
                anchor("center"),
                color(255, 255, 0),
                fixed(),
                z(201),
            ])

            pauseInfo = add([
                text("Presiona P para continuar", { size: 22 }),
                pos(width() / 2, height() / 2 + 35),
                anchor("center"),
                color(255, 255, 255),
                fixed(),
                z(201),
            ])
        } else {
            if (pausePanel) destroy(pausePanel)
            if (pauseTitle) destroy(pauseTitle)
            if (pauseInfo) destroy(pauseInfo)

            pausePanel = null
            pauseTitle = null
            pauseInfo = null
        }
    }

    function loseGame() {
        if (gameOver) return

        gameOver = true
        stopBackgroundMusic()
        playSound("gameOver", 0.9)
        go("gameover", score, currentLevel)
    }

    onKeyPress("p", () => {
        if (!gameOver) {
            setPaused(!paused)
        }
    })

    onKeyDown("left", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(-config.speed, 0)
        }
    })

    onKeyDown("right", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(config.speed, 0)
        }
    })

    onKeyDown("a", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(-config.speed, 0)
        }
    })

    onKeyDown("d", () => {
        if (!gameOver && !paused) {
            const config = getLevelConfig(score)
            player.move(config.speed, 0)
        }
    })

    player.onUpdate(() => {
        if (gameOver || paused) return

        const config = getLevelConfig(score)

        player.velY += GRAVITY * dt()
        player.move(0, player.velY)

        eye1.pos.x = player.pos.x + 9
        eye1.pos.y = player.pos.y + 10

        eye2.pos.x = player.pos.x + 24
        eye2.pos.y = player.pos.y + 10

        if (player.pos.x > width()) {
            player.pos.x = -PLAYER_SIZE
        }

        if (player.pos.x < -PLAYER_SIZE) {
            player.pos.x = width()
        }

        for (const platform of get("platform")) {
            const playerBottom = player.pos.y + PLAYER_SIZE
            const platformTop = platform.pos.y

            const collisionX =
                player.pos.x + PLAYER_SIZE > platform.pos.x &&
                player.pos.x < platform.pos.x + platform.platformWidth

            const collisionY =
                playerBottom > platformTop &&
                playerBottom < platformTop + 22

            if (player.velY > 0 && collisionX && collisionY) {
                if (platform.type === "danger") {
                    playSound("gameOver", 0.8)
                    platformEffect(platform.pos.x + platform.platformWidth / 2, platform.pos.y - 10, "danger")
                    loseGame()
                    return
                }

                player.velY = config.jump
                jumpEffect(player.pos.x + PLAYER_SIZE / 2, player.pos.y + PLAYER_SIZE)

                if (platform.type === "moving") {
                    playSound("bounce", 0.65)
                } else {
                    playSound("jump", 0.65)
                }

                if (platform.type === "break" && !platform.used) {
                    platform.used = true
                    playSound("pickup", 0.75)
                    platformEffect(platform.pos.x + platform.platformWidth / 2, platform.pos.y - 10, "break")

                    wait(0.12, () => {
                        destroy(platform)
                    })
                }
            }
        }

        if (player.pos.y < maxHeight) {
            maxHeight = player.pos.y
            score = Math.floor((300 - maxHeight) / 10)

            scoreText.text = "Score: " + score

            const newConfig = getLevelConfig(score)

            if (newConfig.level !== currentLevel) {
                currentLevel = newConfig.level
                centerMessage("NIVEL " + currentLevel)
                updateObstacleText(currentLevel)
            }

            levelText.text = "Nivel " + newConfig.level + " - " + newConfig.name
        }

        if (player.pos.y < cameraY - 140) {
            cameraY = player.pos.y + 140
            camPos(width() / 2, cameraY)
        }

        while (lastPlatformY > player.pos.y - 900) {
            const newConfig = getLevelConfig(score)
            const gap = rand(newConfig.gapMin, newConfig.gapMax)
            createPlatform(lastPlatformY - gap)
        }

        if (player.pos.y > cameraY + height() / 2 + 80) {
            loseGame()
        }
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

            if (platform.pos.y > cameraY + height() / 2 + 130) {
                destroy(platform)
            }
        }

        for (const icon of get("platformIcon")) {
            if (!icon.parentPlatform || !icon.parentPlatform.exists()) {
                destroy(icon)
            } else {
                icon.pos.x = icon.parentPlatform.pos.x + icon.parentPlatform.platformWidth / 2
                icon.pos.y = icon.parentPlatform.pos.y - 16
            }
        }
    })
})

scene("gameover", (finalScore, finalLevel) => {
    addStars()

    add([
        rect(430, 280),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(18, 18, 55),
        z(1),
    ])

    add([
        text("GAME OVER", { size: 46 }),
        pos(width() / 2, height() / 2 - 105),
        anchor("center"),
        color(255, 80, 80),
        z(2),
    ])

    add([
        text("Score: " + finalScore, { size: 30 }),
        pos(width() / 2, height() / 2 - 38),
        anchor("center"),
        color(255, 255, 255),
        z(2),
    ])

    add([
        text("Nivel alcanzado: " + finalLevel, { size: 24 }),
        pos(width() / 2, height() / 2 + 5),
        anchor("center"),
        color(255, 255, 0),
        z(2),
    ])

    const restartButton = add([
        rect(250, 55),
        pos(width() / 2, height() / 2 + 85),
        anchor("center"),
        area(),
        color(255, 210, 0),
        z(3),
    ])

    add([
        text("REINICIAR", { size: 24 }),
        pos(width() / 2, height() / 2 + 85),
        anchor("center"),
        color(10, 10, 30),
        z(4),
    ])

    restartButton.onClick(() => {
        playSound("click", 0.8)
        playSound("arcade", 0.5)
        startBackgroundMusic()
        go("game")
    })
})

go("start")
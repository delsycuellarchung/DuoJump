const GAME_PAGE = "./juego.html"
const LOGIN_PAGE = "./index.html"

const STORAGE_USER = "duojump_user"
const STORAGE_STATS = "duojump_stats"

const clickSound = new Audio("./audio/mouse_click.mp3")

function playClick() {
    clickSound.currentTime = 0
    clickSound.volume = 0.45
    clickSound.play().catch(() => {})
}

function getUser() {
    const data = localStorage.getItem(STORAGE_USER)
    return data ? JSON.parse(data) : null
}

function getStats() {
    const data = localStorage.getItem(STORAGE_STATS)

    if (data) {
        return JSON.parse(data)
    }

    const stats = {
        hearts: 5,
        coins: 0,
        streak: 0,
        bestScore: 0,
        wordsCompleted: 0,
        lastPlayed: null,
    }

    localStorage.setItem(STORAGE_STATS, JSON.stringify(stats))
    return stats
}

function injectStyles() {
    const style = document.createElement("style")

    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800&display=swap');

        * {
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            font-family: "Be Vietnam Pro", Arial, sans-serif;
            background: #dff7ff;
            color: #1b1c1c;
        }

        body {
            overflow-x: hidden;
        }

        .screen {
            width: 100%;
            min-height: 100vh;
            position: relative;
            padding-bottom: 96px;
            overflow: hidden;
            background: #dff7ff;
        }

        .home-bg-video {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
        }

        .home-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(223, 247, 255, 0.25);
            z-index: 1;
            pointer-events: none;
        }

        .topbar,
        .content,
        .bottom-nav {
            position: relative;
        }

        .topbar {
            z-index: 30;
        }

        .content {
            z-index: 5;
        }

        .bottom-nav {
            z-index: 40;
        }

        .topbar {
            width: 100%;
            display: flex;
            justify-content: center;
            background: rgba(255, 255, 255, 0.85);
            border-bottom: 2px solid rgba(220, 220, 220, 0.7);
            backdrop-filter: blur(8px);
            position: sticky;
            top: 0;
            z-index: 30;
        }

        .topbar-content {
            width: 100%;
            max-width: 1080px;
            height: 72px;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            font-size: 28px;
            font-weight: 800;
            color: #2b6c00;
            letter-spacing: -1px;
        }

        .top-stats {
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .stat-pill {
            min-width: 78px;
            height: 38px;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 15px;
            font-weight: 800;
        }

        .coin-icon {
            color: #f5b400;
        }

        .heart-img {
            width: 30px;
            height: 30px;
            object-fit: contain;
            display: block;
        }

        .life-pill {
            min-width: 82px;
            height: 42px;
        }

        .content {
            width: 100%;
            min-height: calc(100vh - 168px);
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 34px 24px;
        }

        .side-panel {
            position: absolute;
            left: 24px;
            top: 48px;
            width: 210px;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .info-card {
            background: rgba(255, 255, 255, 0.88);
            border: 2px solid rgba(141, 219, 175, 0.9);
            border-radius: 14px;
            padding: 16px 18px;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
        }

        .info-title {
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: #2b6c00;
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        .info-value {
            font-size: 20px;
            font-weight: 800;
            color: #1f5010;
        }

        .challenge-text {
            font-size: 14px;
            font-weight: 600;
            color: #2a3428;
            margin-bottom: 12px;
        }

        .progress {
            width: 100%;
            height: 8px;
            border-radius: 999px;
            background: #d9d9d9;
            overflow: hidden;
        }

        .progress-fill {
            width: 60%;
            height: 100%;
            background: #7ac70c;
        }

        .hero {
            width: 100%;
            max-width: 520px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-top: 20px;
        }

        .owl-wrap {
            width: 270px;
            height: 270px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 22px;
            border-radius: 30px;
        }

        .owl-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.18));
            animation: floatOwl 2.6s ease-in-out infinite;
        }

        @keyframes floatOwl {
            0%, 100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-10px);
            }
        }

        .play-button {
            width: 300px;
            height: 78px;
            border: none;
            border-radius: 18px;
            background: linear-gradient(180deg, #6ee516 0%, #58cc02 100%);
            border-bottom: 8px solid #46a302;
            color: #ffffff;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 1px;
            cursor: pointer;
            text-transform: uppercase;
            box-shadow: 0 14px 24px rgba(39, 120, 0, 0.28);
            position: relative;
            overflow: hidden;
            animation: playButtonIdle 1.55s ease-in-out infinite;
            transition: filter 0.18s ease, box-shadow 0.18s ease;
        }

        .play-button::before {
            content: "";
            position: absolute;
            top: 0;
            left: -90px;
            width: 70px;
            height: 100%;
            background: rgba(255, 255, 255, 0.35);
            transform: skewX(-22deg);
            animation: playButtonShine 2.4s ease-in-out infinite;
        }

        .play-button:hover {
            filter: brightness(1.06);
            box-shadow: 0 18px 28px rgba(39, 120, 0, 0.32);
        }

        .play-button:active {
            transform: translateY(6px) scale(0.98);
            border-bottom: 2px solid #46a302;
        }

        .play-button.is-pressed {
            animation: playButtonPress 0.28s ease-out;
        }

        @keyframes playButtonIdle {
            0%, 100% {
                transform: translateY(0) scale(1);
            }

            50% {
                transform: translateY(-5px) scale(1.025);
            }
        }

        @keyframes playButtonShine {
            0% {
                left: -90px;
                opacity: 0;
            }

            35% {
                opacity: 0;
            }

            55% {
                opacity: 1;
            }

            100% {
                left: 120%;
                opacity: 0;
            }
        }

        @keyframes playButtonPress {
            0% {
                transform: translateY(0) scale(1);
            }

            45% {
                transform: translateY(7px) scale(0.96);
            }

            75% {
                transform: translateY(-4px) scale(1.04);
            }

            100% {
                transform: translateY(0) scale(1);
            }
        }

        .level-pill {
            margin-top: 16px;
            min-width: 260px;
            padding: 8px 20px;
            border: 1px solid rgba(255, 255, 255, 0.9);
            background: rgba(255, 255, 255, 0.55);
            border-radius: 999px;
            font-size: 14px;
            font-weight: 700;
            color: #1d3a13;
            backdrop-filter: blur(6px);
        }

        .message-box {
            position: absolute;
            left: 50%;
            bottom: 34px;
            transform: translateX(-50%);
            width: 100%;
            max-width: 420px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .small-owl {
            width: 52px;
            height: 52px;
            background: #ffffff;
            border-radius: 50%;
            border: 2px solid #8ddbaf;
            padding: 5px;
            object-fit: contain;
        }

        .speech {
            position: relative;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-radius: 14px;
            padding: 15px 18px;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.4;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }

        .speech::before {
            content: "";
            position: absolute;
            left: -10px;
            top: 18px;
            width: 18px;
            height: 18px;
            background: #ffffff;
            border-left: 2px solid #e4e2e2;
            border-bottom: 2px solid #e4e2e2;
            transform: rotate(45deg);
        }

        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 86px;
            background: rgba(255, 255, 255, 0.93);
            border-top: 2px solid #e5e5e5;
            display: flex;
            justify-content: center;
            z-index: 40;
            backdrop-filter: blur(8px);
        }

        .bottom-content {
            width: 100%;
            max-width: 1080px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
        }

        .nav-item {
            border: none;
            background: transparent;
            color: #2a3428;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.5px;
            cursor: pointer;
            text-transform: capitalize;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
            position: relative;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            object-fit: contain;
            display: block;
        }

        .nav-item.active .nav-icon {
            transform: scale(1.08);
        }

        .nav-item.active {
            color: #2b6c00;
        }

        .nav-item.active::before {
            content: "";
            position: absolute;
            top: 0;
            width: 54px;
            height: 4px;
            background: #2b6c00;
            border-radius: 999px;
        }

        .toast {
            position: fixed;
            left: 50%;
            bottom: 105px;
            transform: translateX(-50%);
            background: #1b1c1c;
            color: #ffffff;
            padding: 14px 20px;
            border-radius: 999px;
            font-weight: 800;
            z-index: 99;
            opacity: 0;
            pointer-events: none;
            transition: 0.25s ease;
            text-align: center;
        }

        .toast.show {
            opacity: 1;
            bottom: 118px;
        }

        @media (max-width: 900px) {
            .topbar-content {
                height: 64px;
                padding: 0 18px;
            }

            .logo {
                font-size: 24px;
            }

            .stat-pill {
                min-width: 64px;
                height: 34px;
                font-size: 14px;
            }

            .content {
                padding: 20px 18px 150px;
                align-items: flex-start;
            }

            .side-panel {
                position: static;
                width: 100%;
                max-width: 420px;
                margin: 0 auto 24px;
                order: 1;
            }

            .hero {
                order: 2;
                margin: 0 auto;
            }

            .content {
                flex-direction: column;
            }

            .owl-wrap {
                width: 230px;
                height: 230px;
                margin-bottom: 16px;
            }

            .play-button {
                width: 100%;
                max-width: 310px;
                height: 70px;
                font-size: 23px;
            }

            .message-box {
                position: static;
                transform: none;
                margin: 28px auto 0;
                max-width: 420px;
            }
        }

        @media (max-width: 520px) {
            .top-stats {
                gap: 8px;
            }

            .stat-pill {
                min-width: 56px;
                padding: 0 8px;
            }

            .side-panel {
                gap: 10px;
            }

            .info-card {
                padding: 14px;
            }

            .owl-wrap {
                width: 205px;
                height: 205px;
            }

            .level-pill {
                min-width: 220px;
                font-size: 13px;
            }

            .bottom-nav {
                height: 78px;
            }

            .nav-item {
                font-size: 12px;
            }

            .nav-icon {
                width: 22px;
                height: 22px;
            }
            .heart-img {
                width: 26px;
                height: 26px;
            }
            .life-pill {
                min-width: 74px;
                height: 38px;
            }
        }
    `

    document.head.appendChild(style)
}

function showToast(message) {
    let toast = document.querySelector(".toast")

    if (!toast) {
        toast = document.createElement("div")
        toast.className = "toast"
        document.body.appendChild(toast)
    }

    toast.textContent = message
    toast.classList.add("show")

    setTimeout(() => {
        toast.classList.remove("show")
    }, 2200)
}

function renderHome() {
    const user = getUser()
    const stats = getStats()

    if (!user) {
        window.location.href = LOGIN_PAGE
        return
    }

    const app = document.getElementById("app")

    const coins = stats.coins || 0
    const hearts = stats.hearts || 5
    const bestScore = stats.bestScore || 0
    const remaining = Math.max(0, 50 - Math.min(bestScore, 50))
    const progress = Math.min(100, Math.floor((bestScore / 50) * 100))

        app.innerHTML = `
            <div class="screen">
                <video class="home-bg-video" autoplay muted loop playsinline>
                    <source src="./videos/nubes.mp4" type="video/mp4">
                </video>

                <div class="home-overlay"></div>

                <header class="topbar">
                <div class="topbar-content">
                    <div class="logo">DuoJump</div>

                    <div class="top-stats">
                        <div class="stat-pill">
                            <span class="coin-icon">✪</span>
                            ${coins}
                        </div>

                        <div class="stat-pill">
                            <span class="heart-icon">♡</span>
                            ${hearts}
                        </div>
                    </div>
                </div>
            </header>

            <main class="content">
                <aside class="side-panel">
                    <div class="info-card">
                        <div class="info-title">♙ Record personal</div>
                        <div class="info-value">${bestScore.toLocaleString()}</div>
                    </div>

                    <div class="info-card">
                        <div class="info-title">⚡ Desafío diario</div>
                        <div class="challenge-text">Salta 50 nubes</div>

                        <div class="progress">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </aside>

                <section class="hero">
                    <div class="owl-wrap">
                        <img class="owl-img" src="./images/duojumpR.png" alt="DuoJump personaje">
                    </div>

                    <button class="play-button" id="playGame">¡A jugar!</button>

                    <div class="level-pill">Nivel 4: Bosque de Nubes</div>
                </section>

                <div class="message-box">
                    <img class="small-owl" src="./images/duolingo.webp" alt="DuoJump">

                    <div class="speech">
                        ${remaining > 0 
                            ? `¡Estás a solo ${remaining} puntos de superar tu récord!` 
                            : "¡Ya superaste el desafío diario! Sigue practicando."}
                    </div>
                </div>
            </main>

            <nav class="bottom-nav">
                <div class="bottom-content">
                    <button class="nav-item active" data-nav="jugar">
                        <img class="nav-icon" src="./images/jugar.svg" alt="Jugar">
                        Jugar
                    </button>

                    <button class="nav-item" data-nav="ligas">
                        <img class="nav-icon" src="./images/ligas.svg" alt="Ligas">
                        Ligas
                    </button>

                    <button class="nav-item" data-nav="tienda">
                        <img class="nav-icon" src="./images/tienda.svg" alt="Tienda">
                        Tienda
                    </button>

                    <button class="nav-item" data-nav="perfil">
                        <img class="nav-icon" src="./images/perfil.svg" alt="Perfil">
                        Perfil
                    </button>
                </div>
            </nav>
        </div>
    `

    bindHomeEvents()
}

function bindHomeEvents() {
    document.getElementById("playGame").addEventListener("click", () => {
        playClick()
        window.location.href = GAME_PAGE
    })

    document.querySelectorAll("[data-nav]").forEach((button) => {
        button.addEventListener("click", () => {
            playClick()

            const nav = button.dataset.nav

            if (nav === "jugar") {
                return
            }

            if (nav === "ligas") {
                window.location.href = "./ligas.html"
                return
            }

            if (nav === "tienda") {
                window.location.href = "./tienda.html"
                return
            }

            if (nav === "perfil") {
                window.location.href = "./perfil.html"
            }
        })
    })
}

function init() {
    injectStyles()
    renderHome()
}

document.addEventListener("DOMContentLoaded", init)
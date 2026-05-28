const HOME_PAGE = "./home.html"
const LOGIN_PAGE = "./index.html"

const STORAGE_USER = "duojump_user"
const STORAGE_STATS = "duojump_stats"

const clickSound = new Audio("./audio/mouse_click.mp3")

function playClick() {
    clickSound.currentTime = 0
    clickSound.volume = 0.45
    clickSound.play().catch(() => {})
}

function safeNavigate(dest) {
    try {
        const destUrl = new URL(dest, location.href)
        if (destUrl.href !== location.href) {
            window.location.href = destUrl.href
        }
    } catch (e) {
        // fallback: if URL construction fails, navigate as before
        if (location.href !== dest) window.location.href = dest
    }
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
            background: #fbf9f8;
            color: #1b1c1c;
            font-family: "Be Vietnam Pro", Arial, sans-serif;
        }

        body {
            overflow-x: hidden;
        }

        .screen {
            width: 100%;
            min-height: 100vh;
            padding-bottom: 96px;
        }

        .topbar {
            width: 100%;
            height: 72px;
            background: #ffffff;
            border-bottom: 2px solid #e5e5e5;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .topbar-content {
            width: 100%;
            max-width: 1080px;
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
            gap: 14px;
            align-items: center;
        }

        .stat-pill {
            min-width: 76px;
            height: 40px;
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

        .heart-img {
            width: 32px;
            height: 32px;
            object-fit: contain;
            display: block;
        }

        .coin-icon {
            color: #ddad00;
            font-size: 22px;
        }

        .main {
            width: 100%;
            max-width: 560px;
            margin: 30px auto 0;
            padding: 0 20px;
        }

        .league-header {
            text-align: center;
            margin-bottom: 24px;
        }

        .badge-wrap {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(180deg, #ffdf92 0%, #f4bf00 100%);
            margin: 0 auto 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 20px rgba(117, 91, 0, 0.18);
        }

        .badge-img {
            width: 76px;
            height: 76px;
            object-fit: contain;
        }

        .league-tag {
            display: inline-block;
            background: #d62828;
            color: #ffffff;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 7px 18px;
            border-radius: 999px;
            text-transform: uppercase;
            margin-top: -4px;
        }

        .league-title {
            font-size: 28px;
            font-weight: 800;
            margin: 12px 0 4px;
            letter-spacing: -0.8px;
        }

        .league-subtitle {
            font-size: 16px;
            font-weight: 600;
            color: #4b5742;
        }

        .timer-card {
            width: 100%;
            height: 58px;
            border: 2px solid #e4e2e2;
            background: #ffffff;
            border-radius: 16px;
            margin: 24px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            color: #4b5742;
        }

        .timer-card strong {
            color: #755b00;
            margin-left: 6px;
        }

        .leaderboard {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .player-card {
            width: 100%;
            min-height: 76px;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            border-radius: 16px;
            display: grid;
            grid-template-columns: 46px 58px 1fr auto;
            align-items: center;
            gap: 12px;
            padding: 12px 18px;
        }

        .player-card.you {
            background: #58cc02;
            border-color: #58cc02;
            border-bottom-color: #46a302;
            color: #ffffff;
        }

        .rank {
            font-size: 16px;
            font-weight: 800;
            color: #755b00;
            text-align: center;
        }

        .player-card.you .rank {
            color: #ffffff;
        }

        .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #e4e2e2;
            border: 2px solid rgba(255, 255, 255, 0.75);
            object-fit: cover;
        }

        .player-name {
            font-size: 16px;
            font-weight: 700;
        }

        .player-message {
            font-size: 12px;
            font-weight: 800;
            opacity: 0.9;
            margin-top: 4px;
        }

        .xp {
            font-size: 16px;
            font-weight: 800;
            color: #2b6c00;
            white-space: nowrap;
        }

        .player-card.you .xp {
            color: #ffffff;
        }

        .separator {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 10px 0;
            color: #2b6c00;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        .separator::before,
        .separator::after {
            content: "";
            flex: 1;
            border-top: 2px dashed #becbb1;
        }

        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 86px;
            background: rgba(255, 255, 255, 0.96);
            border-top: 2px solid #e5e5e5;
            display: flex;
            justify-content: center;
            z-index: 40;
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

        @media (max-width: 620px) {
            .topbar-content {
                height: 64px;
                padding: 0 18px;
            }

            .logo {
                font-size: 24px;
            }

            .main {
                margin-top: 24px;
            }

            .player-card {
                grid-template-columns: 34px 48px 1fr auto;
                padding: 12px;
                gap: 10px;
            }

            .avatar {
                width: 42px;
                height: 42px;
            }

            .player-name {
                font-size: 14px;
            }

            .xp {
                font-size: 13px;
            }

            .bottom-nav {
                height: 78px;
            }

            .nav-icon {
                width: 22px;
                height: 22px;
            }

            .nav-item {
                font-size: 12px;
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

function getLeaguePlayers(user, stats) {
    const userScore = stats.bestScore || 0

    const players = [
        {
            rank: 1,
            name: "Alex_Jump",
            xp: 2840,
            avatar: "./images/avatar1.png",
        },
        {
            rank: 2,
            name: "Luna_Sky",
            xp: 2105,
            avatar: "./images/avatar2.png",
        },
        {
            rank: 3,
            name: "JumpMaster_99",
            xp: 1980,
            avatar: "./images/avatar3.png",
        },
        {
            rank: 4,
            name: user.name || "Tú",
            xp: userScore,
            avatar: user.avatar || "./images/avatar_user.png",
            you: true,
        },
        {
            rank: 5,
            name: "Phoebe_B",
            xp: 1240,
            avatar: "./images/avatar4.png",
        },
        {
            rank: 6,
            name: "Marcos_Jump",
            xp: 1110,
            avatar: "./images/avatar5.png",
        },
    ]

    return players.sort((a, b) => b.xp - a.xp).map((player, index) => {
        return {
            ...player,
            rank: index + 1,
        }
    })
}

function renderLeaderboard(players) {
    let html = ""

    players.forEach((player) => {
        if (player.rank === 6) {
            html += `<div class="separator">Zona de ascenso</div>`
        }

        html += `
            <div class="player-card ${player.you ? "you" : ""}">
                <div class="rank">${player.rank}</div>

                <img class="avatar" src="${player.avatar}" alt="${player.name}" onerror="this.onerror=null; this.src='./images/logo_duojump.png'">

                <div>
                    <div class="player-name">${player.you ? "Tú" : player.name}</div>
                    ${player.you ? `<div class="player-message">¡Sigue así para ascender!</div>` : ""}
                </div>

                <div class="xp">${player.xp.toLocaleString()} XP</div>
            </div>
        `
    })

    return html
}

function renderLigas() {
    const user = getUser()
    const stats = getStats()

    if (!user) {
        safeNavigate(LOGIN_PAGE)
        return
    }

    const app = document.getElementById("app")

    const coins = stats.coins || 0
    const hearts = stats.hearts ?? 5
    const heartIcon = hearts > 0 ? "./images/corazon.png" : "./images/corazon_vacio.svg"

    const players = getLeaguePlayers(user, stats)

    app.innerHTML = `
        <div class="screen">
            <header class="topbar">
                <div class="topbar-content">
                    <div class="logo">DuoJump</div>

                    <div class="top-stats">
                        <div class="stat-pill">
                            <span class="coin-icon">✪</span>
                            ${coins}
                        </div>

                        <div class="stat-pill">
                            <img class="heart-img" src="${heartIcon}" alt="Vidas">
                            ${hearts}
                        </div>
                        <div style="display:flex;align-items:center;gap:8px">
                            <img src="${user.avatar || './images/avatar_user.png'}" alt="avatar" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #e4e2e2">
                            <div style="font-weight:800;color:#2b6c00">${user.name || 'Tú'}</div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="main">
                <section class="league-header">
                    <div class="badge-wrap">
                        <img class="badge-img" src="./images/liga_oro.png" alt="Liga de Oro" onerror="this.onerror=null; this.style.display='none'">
                    </div>

                    <div class="league-tag">Liga Oro</div>

                    <h1 class="league-title">Liga de Oro</h1>
                    <div class="league-subtitle">¡Estás en el top 10% de los saltadores!</div>

                    <div class="timer-card">
                        🕒 Finaliza en: <strong>2d 13h 59m 58s</strong>
                    </div>
                </section>

                <section class="leaderboard">
                    ${renderLeaderboard(players)}
                </section>
            </main>

            <nav class="bottom-nav">
                <div class="bottom-content">
                    <button class="nav-item" data-nav="jugar">
                        <img class="nav-icon" src="./images/jugar.svg" alt="Jugar">
                        Jugar
                    </button>

                    <button class="nav-item active" data-nav="ligas">
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

    bindEvents()
}

function bindEvents() {
    const bottomContent = document.querySelector('.bottom-content')
    if (bottomContent) {
        bottomContent.addEventListener('click', (e) => {
            const button = e.target.closest('[data-nav]')
            if (!button) return
            playClick()

            const nav = button.dataset.nav

            if (nav === 'jugar') {
                safeNavigate(HOME_PAGE)
                return
            }

            if (nav === 'ligas') {
                return
            }

            if (nav === 'tienda') {
                window.location.href = './tienda.html'
                return
            }

            if (nav === 'perfil') {
                safeNavigate('./perfil.html')
                return
            }
        })
    }
}

function init() {
    injectStyles()
    renderLigas()
}

document.addEventListener("DOMContentLoaded", init)
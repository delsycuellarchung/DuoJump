const HOME_PAGE = "./home.html"
const LIGAS_PAGE = "./ligas.html"
const TIENDA_PAGE = "./tienda.html"
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

function saveUser(user) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user))
}

function removeUser() {
    localStorage.removeItem(STORAGE_USER)
}

function getStats() {
    const data = localStorage.getItem(STORAGE_STATS)

    let stats = data ? JSON.parse(data) : {}

    stats.hearts = stats.hearts ?? 5
    stats.coins = stats.coins ?? 0
    stats.streak = stats.streak ?? 0
    stats.bestScore = stats.bestScore ?? 0
    stats.wordsCompleted = stats.wordsCompleted ?? 0
    stats.gamesPlayed = stats.gamesPlayed ?? 0
    stats.totalXp = stats.totalXp ?? stats.bestScore ?? 0
    stats.lastPlayed = stats.lastPlayed ?? null

    localStorage.setItem(STORAGE_STATS, JSON.stringify(stats))
    return stats
}

function saveStats(stats) {
    localStorage.setItem(STORAGE_STATS, JSON.stringify(stats))
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
            min-width: 82px;
            height: 42px;
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
            color: #ddad00;
            font-size: 22px;
        }

        .heart-img {
            width: 34px;
            height: 34px;
            object-fit: contain;
            display: block;
        }

        .main {
            width: 100%;
            max-width: 980px;
            margin: 34px auto 0;
            padding: 0 22px;
        }

        .profile-header {
            display: grid;
            grid-template-columns: 130px 1fr;
            gap: 24px;
            align-items: center;
            padding-bottom: 30px;
            border-bottom: 2px solid #e5e5e5;
        }

        .avatar-wrap {
            position: relative;
            width: 120px;
            height: 120px;
        }

        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #b7f0e5;
            background: #e7fff9;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.10);
        }

        .edit-avatar {
            position: absolute;
            right: -2px;
            bottom: 8px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: #2b8a14;
            color: #ffffff;
            font-weight: 800;
            cursor: pointer;
        }

        .profile-name-row {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 6px;
        }

        .profile-name {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.6px;
        }

        .level-badge {
            background: #ededed;
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 14px;
            font-weight: 700;
            color: #555;
        }

        .profile-message {
            font-size: 16px;
            font-weight: 600;
            color: #4b5742;
            margin-bottom: 18px;
        }

        .action-row {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
        }

        .outline-btn {
            height: 46px;
            min-width: 165px;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            background: #ffffff;
            border-radius: 10px;
            color: #4b5742;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0 18px;
        }

        .outline-btn:active {
            transform: translateY(4px);
            border-bottom: 1px solid #d8d8d8;
        }

        .danger-btn {
            color: #c62828;
        }

        .section-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 30px 0 16px;
        }

        .section-title {
            font-size: 22px;
            font-weight: 800;
            margin: 0;
        }

        .view-all {
            color: #2b6c00;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }

        .stat-card {
            min-height: 132px;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-align: center;
        }

        .stat-icon {
            font-size: 24px;
            color: #2b6c00;
            font-weight: 800;
        }

        .stat-number {
            font-size: 30px;
            font-weight: 800;
            letter-spacing: -0.8px;
        }

        .stat-label {
            font-size: 12px;
            font-weight: 700;
            color: #4b5742;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .streak-card {
            border-color: #f6c58b;
        }

        .achievements-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .achievement-card {
            min-height: 104px;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            border-radius: 16px;
            padding: 16px;
            display: grid;
            grid-template-columns: 68px 1fr;
            gap: 16px;
            align-items: center;
        }

        .achievement-card.locked {
            opacity: 0.58;
        }

        .achievement-icon {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            background: #dff7ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
        }

        .achievement-card.gold .achievement-icon {
            background: #fff2bd;
        }

        .achievement-card.green .achievement-icon {
            background: #d9ffd4;
        }

        .achievement-title {
            font-size: 17px;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .achievement-desc {
            font-size: 14px;
            font-weight: 600;
            color: #4b5742;
            margin-bottom: 10px;
        }

        .progress {
            width: 100%;
            height: 8px;
            border-radius: 999px;
            background: #e4e2e2;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: #58cc02;
            border-radius: 999px;
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

        @media (max-width: 850px) {
            .main {
                max-width: 620px;
            }

            .profile-header {
                grid-template-columns: 1fr;
                text-align: center;
                justify-items: center;
            }

            .profile-name-row {
                justify-content: center;
            }

            .action-row {
                justify-content: center;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .achievements-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 520px) {
            .topbar-content {
                padding: 0 18px;
            }

            .logo {
                font-size: 24px;
            }

            .main {
                margin-top: 24px;
            }

            .profile-name {
                font-size: 23px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .achievement-card {
                grid-template-columns: 58px 1fr;
            }

            .achievement-icon {
                width: 56px;
                height: 56px;
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

function formatNumber(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(value >= 10000 ? 1 : 2).replace(".00", "") + "k"
    }

    return value.toLocaleString()
}

function getUserLevel(stats) {
    const xp = stats.totalXp || stats.bestScore || 0
    return Math.max(1, Math.floor(xp / 500) + 1)
}

function getAchievements(stats) {
    const games = stats.gamesPlayed || 0
    const words = stats.wordsCompleted || 0
    const bestScore = stats.bestScore || 0
    const streak = stats.streak || 0

    return [
        {
            title: "Primer Salto",
            desc: "Completa tu primer juego de DuoJump.",
            icon: "⚡",
            progress: Math.min(100, games >= 1 ? 100 : 0),
            color: "green",
            locked: games < 1,
        },
        {
            title: "Coleccionista",
            desc: "Completa 5 palabras diferentes.",
            icon: "📚",
            progress: Math.min(100, (words / 5) * 100),
            color: "gold",
            locked: words < 5,
        },
        {
            title: "A la Luna",
            desc: "Alcanza un score de 10,000 puntos.",
            icon: "🌙",
            progress: Math.min(100, (bestScore / 10000) * 100),
            color: "",
            locked: bestScore < 10000,
        },
        {
            title: "Constante",
            desc: "Mantén una racha de 7 días.",
            icon: "🔥",
            progress: Math.min(100, (streak / 7) * 100),
            color: "green",
            locked: streak < 7,
        },
    ]
}

function renderAchievements(stats) {
    const achievements = getAchievements(stats)

    return achievements.map(item => {
        return `
            <article class="achievement-card ${item.color} ${item.locked ? "locked" : ""}">
                <div class="achievement-icon">${item.icon}</div>

                <div>
                    <div class="achievement-title">${item.title}</div>
                    <div class="achievement-desc">${item.desc}</div>

                    <div class="progress">
                        <div class="progress-fill" style="width: ${item.progress}%"></div>
                    </div>
                </div>
            </article>
        `
    }).join("")
}

function renderProfile() {
    const user = getUser()
    const stats = getStats()

    if (!user) {
        window.location.href = LOGIN_PAGE
        return
    }

    const app = document.getElementById("app")

    const coins = stats.coins || 0
    const hearts = stats.hearts ?? 5
    const heartIcon = hearts > 0 ? "./images/corazon.png" : "./images/corazon_vacio.svg"

    const name = user.name || "Jugador DuoJump"
    const level = getUserLevel(stats)
    const totalXp = stats.totalXp || stats.bestScore || 0
    const bestScore = stats.bestScore || 0
    const gamesPlayed = stats.gamesPlayed || 0
    const streak = stats.streak || 0

    app.innerHTML = `
        <div class="screen">
            <header class="topbar">
                <div class="topbar-content">
                    <div class="logo">DuoJump</div>

                    <div class="top-stats">
                        <div class="stat-pill">
                            <span class="coin-icon">✪</span>
                            ${coins.toLocaleString()}
                        </div>

                        <div class="stat-pill">
                            <img class="heart-img" src="${heartIcon}" alt="Vidas">
                            ${hearts}
                        </div>
                    </div>
                </div>
            </header>

            <main class="main">
                <section class="profile-header">
                    <div class="avatar-wrap">
                        <img class="avatar" src="./images/avatar_user.png" alt="Avatar" onerror="this.onerror=null; this.src='./images/logo_duojump.png'">
                        <button class="edit-avatar" id="editAvatar">✎</button>
                    </div>

                    <div>
                        <div class="profile-name-row">
                            <div class="profile-name">${name}</div>
                            <div class="level-badge">Nivel ${level}</div>
                        </div>

                        <div class="profile-message">¡Saltando hacia el éxito desde tu primera partida!</div>

                        <div class="action-row">
                            <button class="outline-btn" id="settingsBtn">⚙ Configuración</button>
                            <button class="outline-btn" id="shareBtn">⌯ Compartir</button>
                            <button class="outline-btn danger-btn" id="logoutBtn">Salir</button>
                        </div>
                    </div>
                </section>

                <div class="section-title-row">
                    <h2 class="section-title">Estadísticas</h2>
                </div>

                <section class="stats-grid">
                    <article class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-number">${formatNumber(totalXp)}</div>
                        <div class="stat-label">Total XP</div>
                    </article>

                    <article class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-number">${bestScore.toLocaleString()}</div>
                        <div class="stat-label">High Score</div>
                    </article>

                    <article class="stat-card">
                        <div class="stat-icon">🎮</div>
                        <div class="stat-number">${gamesPlayed}</div>
                        <div class="stat-label">Partidas</div>
                    </article>

                    <article class="stat-card streak-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-number">${streak}</div>
                        <div class="stat-label">Días racha</div>
                    </article>
                </section>

                <div class="section-title-row">
                    <h2 class="section-title">Logros</h2>
                    <div class="view-all" id="viewAll">Ver todos</div>
                </div>

                <section class="achievements-grid">
                    ${renderAchievements(stats)}
                </section>
            </main>

            <nav class="bottom-nav">
                <div class="bottom-content">
                    <button class="nav-item" data-nav="jugar">
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

                    <button class="nav-item active" data-nav="perfil">
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
    document.getElementById("settingsBtn").addEventListener("click", () => {
        playClick()
        showToast("Configuración próximamente")
    })

    document.getElementById("editAvatar").addEventListener("click", () => {
        playClick()
        showToast("Cambio de avatar próximamente")
    })

    document.getElementById("viewAll").addEventListener("click", () => {
        playClick()
        showToast("Más logros próximamente")
    })

    document.getElementById("shareBtn").addEventListener("click", () => {
        playClick()

        const user = getUser()
        const stats = getStats()
        const message = `Estoy jugando DuoJump. Mi récord es ${stats.bestScore || 0} XP.`

        if (navigator.share) {
            navigator.share({
                title: "DuoJump",
                text: message,
            }).catch(() => {})
        } else {
            navigator.clipboard?.writeText(message)
            showToast("Texto copiado para compartir")
        }
    })

    document.getElementById("logoutBtn").addEventListener("click", () => {
        playClick()
        removeUser()
        showToast("Sesión cerrada")

        setTimeout(() => {
            window.location.href = LOGIN_PAGE
        }, 700)
    })

    // Use event delegation on the bottom nav to ensure clicks register on first press
    const bottomContent = document.querySelector('.bottom-content')
    if (bottomContent) {
        bottomContent.addEventListener('click', (e) => {
            const button = e.target.closest('[data-nav]')
            if (!button) return
            playClick()

            const nav = button.dataset.nav

            if (nav === 'jugar') {
                window.location.href = HOME_PAGE
                return
            }

            if (nav === 'ligas') {
                window.location.href = LIGAS_PAGE
                return
            }

            if (nav === 'tienda') {
                window.location.href = TIENDA_PAGE
                return
            }

            // perfil: already on this page
            if (nav === 'perfil') {
                return
            }
        })
    }
}

function init() {
    injectStyles()
    renderProfile()
}

document.addEventListener("DOMContentLoaded", init)
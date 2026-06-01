const HOME_PAGE = "./home.html"
const LOGIN_PAGE = "./index.html"
const LIGAS_PAGE = "./ligas.html"

const STORAGE_USER = "duojump_user"
const STORAGE_STATS = "duojump_stats"

const clickSound = new Audio("./audio/mouse_click.mp3")

const powerUps = [
    {
        id: "spring_jump",
        name: "Salto de Muelle",
        description: "Salta un 50% más alto durante 30 segundos en tu próxima partida.",
        price: 250,
        image: "./images/power_salto.png",
    },
    {
        id: "shield",
        name: "Escudo Protector",
        description: "Te protege de una caída accidental. ¡Dura toda la partida!",
        price: 400,
        image: "./images/power_escudo.png",
    },
    {
        id: "streak_protector",
        name: "Protector de Racha",
        description: "Mantiene tu racha diaria si olvidas jugar un día.",
        price: 600,
        image: "./images/power_racha.png",
    },
]

const skins = [
    {
        id: "space_duo",
        name: "Space Duo",
        description: "¡Listo para despegar hacia las ligas galácticas!",
        price: 1500,
        image: "./images/skin_space.png",
        buttonColor: "#006b93",
        borderColor: "#b4dce8",
    },
    {
        id: "golden_duo",
        name: "Golden Duo",
        description: "Brilla en el podio con el aspecto definitivo.",
        price: 5000,
        image: "./images/skin_golden.png",
        buttonColor: "#7a6800",
        borderColor: "#d8c887",
    },
]

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

    let stats = data ? JSON.parse(data) : {}

    stats.hearts = stats.hearts ?? 5
    stats.coins = stats.coins ?? 0
    stats.streak = stats.streak ?? 0
    stats.bestScore = stats.bestScore ?? 0
    stats.wordsCompleted = stats.wordsCompleted ?? 0
    stats.lastPlayed = stats.lastPlayed ?? null
    stats.powerUps = stats.powerUps ?? {}
    stats.ownedSkins = stats.ownedSkins ?? []
    stats.activeSkin = stats.activeSkin ?? "default"

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
            margin: 28px auto 0;
            padding: 0 22px;
        }

        .welcome-card {
            width: 100%;
            min-height: 130px;
            background: #e9f8ff;
            border: 2px solid #b9e3ee;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 22px;
            padding: 22px 24px;
            margin-bottom: 30px;
        }

        .welcome-avatar {
            width: 84px;
            height: 84px;
            border-radius: 50%;
            background: #58cc02;
            padding: 10px;
            object-fit: cover;
        }

        .welcome-title {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .welcome-text {
            font-size: 16px;
            font-weight: 600;
            color: #4b5742;
        }

        .section-title {
            font-size: 22px;
            font-weight: 800;
            margin: 28px 0 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .items-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }

        .power-card {
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            border-radius: 16px;
            padding: 18px;
            text-align: center;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .power-img {
            width: 82px;
            height: 82px;
            object-fit: contain;
            margin: 0 auto 12px;
        }

        .power-name {
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 8px;
        }

        .power-desc {
            font-size: 14px;
            line-height: 1.45;
            color: #4b5742;
            font-weight: 600;
            min-height: 58px;
        }

        .buy-btn {
            width: 100%;
            height: 48px;
            border: none;
            border-radius: 10px;
            background: #58cc02;
            border-bottom: 5px solid #46a302;
            color: #ffffff;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            margin-top: 16px;
        }

        .buy-btn:active {
            transform: translateY(4px);
            border-bottom: 1px solid #46a302;
        }

        .buy-btn.disabled {
            background: #d8d8d8;
            border-bottom-color: #bfbfbf;
            color: #777;
            cursor: not-allowed;
        }

        .skins-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .skin-card {
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            border-radius: 16px;
            padding: 22px;
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 20px;
            align-items: center;
        }

        .skin-img-box {
            width: 96px;
            height: 96px;
            border-radius: 12px;
            background: #dff7ff;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .skin-img {
            width: 78px;
            height: 78px;
            object-fit: contain;
        }

        .skin-name {
            font-size: 17px;
            font-weight: 800;
            margin-bottom: 6px;
        }

        .skin-desc {
            font-size: 14px;
            line-height: 1.4;
            color: #4b5742;
            font-weight: 600;
            margin-bottom: 14px;
        }

        .skin-btn {
            min-width: 130px;
            height: 42px;
            border: none;
            border-radius: 8px;
            border-bottom: 5px solid rgba(0,0,0,0.18);
            color: #ffffff;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            padding: 0 18px;
        }

        .skin-btn:active {
            transform: translateY(4px);
            border-bottom: 1px solid rgba(0,0,0,0.18);
        }

        .skin-btn.owned {
            background: #ffffff !important;
            border: 2px solid #58cc02;
            border-bottom: 5px solid #46a302;
            color: #2b6c00;
        }

        .skin-btn.active-skin {
            background: #58cc02 !important;
            border-bottom-color: #46a302;
            color: #ffffff;
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
            width: 32px;
            height: 32px;
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

        @media (max-width: 900px) {
            .main {
                max-width: 620px;
            }

            .items-grid,
            .skins-grid {
                grid-template-columns: 1fr;
            }

            .skin-card {
                grid-template-columns: 90px 1fr;
            }
        }

        @media (max-width: 540px) {
            .topbar-content {
                padding: 0 18px;
            }

            .logo {
                font-size: 24px;
            }

            .welcome-card {
                flex-direction: column;
                text-align: center;
            }

            .skin-card {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .skin-img-box {
                margin: 0 auto;
            }

            .bottom-nav {
                height: 78px;
            }

            .nav-item {
                font-size: 12px;
            }

            .nav-icon {
                width: 28px;
                height: 28px;
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

function buyPowerUp(id) {
    const item = powerUps.find(x => x.id === id)
    const stats = getStats()

    if (!item) return

    if (stats.coins < item.price) {
        showToast("No tienes suficientes estrellas")
        return
    }

    stats.coins -= item.price
    stats.powerUps[item.id] = (stats.powerUps[item.id] || 0) + 1

    saveStats(stats)
    showToast(`${item.name} comprado`)
    renderStore()
}

function buyOrUseSkin(id) {
    const skin = skins.find(x => x.id === id)
    const stats = getStats()

    if (!skin) return

    const alreadyOwned = stats.ownedSkins.includes(id)

    if (alreadyOwned) {
        stats.activeSkin = id
        saveStats(stats)
        showToast(`${skin.name} equipado`)
        renderStore()
        return
    }

    if (stats.coins < skin.price) {
        showToast("No tienes suficientes estrellas")
        return
    }

    stats.coins -= skin.price
    stats.ownedSkins.push(id)
    stats.activeSkin = id

    saveStats(stats)
    showToast(`${skin.name} comprado y equipado`)
    renderStore()
}

function renderPowerUps(stats) {
    return powerUps.map(item => {
        const quantity = stats.powerUps[item.id] || 0

        return `
            <article class="power-card">
                <div>
                    <img class="power-img" src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='./images/logo_duojump.png'">

                    <div class="power-name">${item.name}</div>
                    <div class="power-desc">${item.description}</div>

                    ${quantity > 0 ? `<div class="power-desc">Tienes: ${quantity}</div>` : ""}
                </div>

                <button class="buy-btn" data-buy-power="${item.id}">
                    ✪ ${item.price.toLocaleString()}
                </button>
            </article>
        `
    }).join("")
}

function renderSkins(stats) {
    return skins.map(skin => {
        const owned = stats.ownedSkins.includes(skin.id)
        const active = stats.activeSkin === skin.id

        let buttonText = `✪ ${skin.price.toLocaleString()}`
        let buttonClass = "skin-btn"

        if (owned) {
            buttonText = "Usar"
            buttonClass = "skin-btn owned"
        }

        if (active) {
            buttonText = "En uso"
            buttonClass = "skin-btn active-skin"
        }

        return `
            <article class="skin-card" style="border-color: ${skin.borderColor};">
                <div class="skin-img-box">
                    <img class="skin-img" src="${skin.image}" alt="${skin.name}" onerror="this.onerror=null; this.src='./images/logo_duojump.png'">
                </div>

                <div>
                    <div class="skin-name">${skin.name}</div>
                    <div class="skin-desc">${skin.description}</div>

                    <button 
                        class="${buttonClass}" 
                        style="background: ${skin.buttonColor};"
                        data-buy-skin="${skin.id}"
                        ${active ? "disabled" : ""}
                    >
                        ${buttonText}
                    </button>
                </div>
            </article>
        `
    }).join("")
}

function renderStore() {
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
                            <span class="heart-count">${hearts}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main class="main">
                <section class="welcome-card">
                    <img class="welcome-avatar" src="${user.avatar || './images/avatar_user.png'}" alt="${user.name || 'Avatar'}" onerror="this.onerror=null;this.src='./images/logo_duojump.png'">

                    <div>
                        <div class="welcome-title">¡Hola ${user.name || 'Jugador'}!</div>
                        <div class="welcome-text">
                            Usa tus estrellas para conseguir ventajas increíbles y nuevos aspectos para Duo.
                        </div>
                    </div>
                </section>

                <h2 class="section-title">⚡ Potenciadores</h2>

                <section class="items-grid">
                    ${renderPowerUps(stats)}
                </section>

                <h2 class="section-title">♙ Aspectos de Duo</h2>

                <section class="skins-grid">
                    ${renderSkins(stats)}
                </section>
            </main>

            <nav class="bottom-nav">
                <div class="bottom-content">
                    <button class="nav-item" data-nav="jugar">
                        <img class="nav-icon" src="./images/Home.svg" alt="Home">
                        Jugar
                    </button>

                    <button class="nav-item" data-nav="ligas">
                        <img class="nav-icon" src="./images/ligas.svg" alt="Ligas">
                        Ligas
                    </button>

                    <button class="nav-item active" data-nav="tienda">
                        <img class="nav-icon" src="./images/tienda.svg" alt="Tienda">
                        Tienda
                    </button>

                    <button class="nav-item" data-nav="perfil">
                        <img class="nav-icon nav-avatar" src="${user.avatar || './images/perfil.svg'}" alt="Perfil" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #e6e6e6">
                        Perfil
                    </button>
                </div>
            </nav>
        </div>
    `

    bindEvents()

    // Listen for profile updates and refresh avatar/title dynamically
    try {
        const applyUserUpdateStore = (user) => {
            try {
                const img = document.querySelector('.welcome-avatar')
                if (img && user && user.avatar) img.src = user.avatar
                const title = document.querySelector('.welcome-title')
                if (title && user && user.name) title.textContent = `¡Hola ${user.name || 'Jugador'}!`
                try {
                    const navImg = document.querySelector('.nav-avatar')
                    if (navImg && user && user.avatar) navImg.src = user.avatar
                } catch (e) {}

                try {
                    const hc = document.querySelector('.heart-count')
                    if (hc) hc.textContent = String(getStats().hearts || 0)
                    const heartEl = document.querySelector('.heart-img')
                    if (heartEl) heartEl.src = (getStats().hearts > 0) ? './images/corazon.png' : './images/corazon_vacio.svg'
                } catch (e) {}
            } catch (e) {}
        }

        window.addEventListener('duojump:user-updated', (e) => applyUserUpdateStore(e.detail || getUser()))
        window.addEventListener('storage', (ev) => {
            if (!ev) return
            if (ev.key === STORAGE_USER || ev.key === STORAGE_STATS) {
                try { applyUserUpdateStore(JSON.parse(localStorage.getItem(STORAGE_USER) || 'null')) } catch (e) {}
            }
        })
    } catch (e) {}
}

function bindEvents() {
    document.querySelectorAll("[data-buy-power]").forEach(button => {
        button.addEventListener("click", () => {
            playClick()
            buyPowerUp(button.dataset.buyPower)
        })
    })

    document.querySelectorAll("[data-buy-skin]").forEach(button => {
        button.addEventListener("click", () => {
            playClick()
            buyOrUseSkin(button.dataset.buySkin)
        })
    })

    // Delegate bottom nav clicks to ensure first-click works reliably
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
                return
            }

            if (nav === 'perfil') {
                window.location.href = './perfil.html'
                return
            }
        })
    }
}

function init() {
    injectStyles()
    renderStore()
}

document.addEventListener("DOMContentLoaded", init)
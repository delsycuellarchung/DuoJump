const HOME_PAGE = "./home.html"
const LOGIN_PAGE = "./index.html"

const STORAGE_USER = "duojump_user"
const STORAGE_STATS = "duojump_stats"
const MAX_HEARTS = 5

const clickSound = new Audio("./audio/mouse_click.mp3")

function playClick() {
    clickSound.currentTime = 0
    clickSound.volume = 0.45
    clickSound.play().catch(() => {})
}

function showInviteCodeModal(code, leagueId) {
    const existing = document.getElementById('inviteCodeOverlay')
    if (existing) return

    const overlay = document.createElement('div')
    overlay.id = 'inviteCodeOverlay'
    overlay.className = 'create-league-overlay'

    const modal = document.createElement('div')
    modal.className = 'create-league-modal'
    modal.innerHTML = `
        <h3>Código de invitación</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font-weight:800;font-size:20px;letter-spacing:2px;display:flex;align-items:center;gap:12px">
                <span style="background:#f4f4f4;padding:10px 14px;border-radius:8px;border:2px dashed #e6e6e6">${code}</span>
                <button id="copyInviteCode" class="btn-primary">Copiar</button>
            </div>
            <div style="color:#556b4a">Comparte este código para que otros se unan a tu liga.</div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
                <button id="closeInvite" class="btn-cancel">Cerrar</button>
            </div>
        </div>
    `

    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    document.getElementById('closeInvite').addEventListener('click', () => overlay.remove())

    document.getElementById('copyInviteCode').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(code)
            showToast('Código copiado')
        } catch (e) {
            showToast('Copia manual: ' + code)
        }
    })
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
        const stats = JSON.parse(data)
        try {
            const now = Date.now()
            if (Array.isArray(stats.lifeRefillQueue) && stats.lifeRefillQueue.length > 0) {
                let added = 0
                const remaining = []
                for (const t of stats.lifeRefillQueue) {
                    if (typeof t === 'number' && t <= now && stats.hearts < 5) {
                        stats.hearts = Math.min(5, stats.hearts + 1)
                        added++
                    } else {
                        remaining.push(t)
                    }
                }
                if (added > 0) {
                    stats.lifeRefillQueue = remaining
                    localStorage.setItem(STORAGE_STATS, JSON.stringify(stats))
                }
            }
        } catch (e) {}
        return stats
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
            background: #ffffff;
            border-bottom: 2px solid #e5e5e5;
            display: flex;
            justify-content: center;
            align-items: center;
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

        .page-logo {
            width: 96px;
            height: 96px;
            object-fit: contain;
            display: inline-block;
            vertical-align: middle;
            margin-right: 14px;
        }

        .logo-text { display: inline-block; font-size: 28px; font-weight:800; color:#2b6c00 }

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

        /* Use same visual style as store 'buy' buttons (green) */
        .create-league-btn {
            display: inline-block;
            padding: 8px 14px;
            background: #58cc02;
            border: none;
            border-radius: 10px;
            border-bottom: 5px solid #46a302;
            color: #ffffff;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 8px 16px rgba(43,138,20,0.18);
            margin-left: auto;
        }

        .create-league-btn:active {
            transform: translateY(4px);
            border-bottom: 1px solid #46a302;
        }

        /* Create League Modal */
        .create-league-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 120;
        }

        .create-league-modal {
            width: 92%;
            max-width: 520px;
            background: #fff;
            border-radius: 12px;
            padding: 18px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .create-league-modal h3 { margin: 0 0 12px; }
        .create-league-modal label { display:block;margin-top:8px;font-weight:700 }
        .create-league-modal input[type="text"], .create-league-modal input[type="date"] { width:100%;padding:10px;border:1px solid #e6e6e6;border-radius:8px;margin-top:6px }
        .create-league-actions { display:flex;justify-content:flex-end;gap:8px;margin-top:12px }
        .create-league-actions button { padding:8px 12px;border-radius:8px;border:none;cursor:pointer }
        .btn-cancel { background:#eee }
        .btn-primary { background:#2b8a14;color:#fff;font-weight:800 }

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

        /* Warning (yellow) and danger (red) styles for lower ranks */
        .player-card.warning {
            background: #fff8e6;
            border-color: #f0d18a;
            border-bottom-color: #e6c36a;
            color: #6b4a00;
        }

        .player-card.danger {
            background: #fff0f0;
            border-color: #f2b1b1;
            border-bottom-color: #e07a7a;
            color: #8a1717;
        }

        .separator.descent {
            color: #bf2b2b;
            border-top-color: #f2b1b1;
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
                width: 28px;
                height: 28px;
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
    // Return actual members for the user's league if any exist in localStorage.
    // We intentionally do NOT show sample/demo players here; the list stays empty
    // until real members join a league.
    try {
        const leagues = JSON.parse(localStorage.getItem('duojump_leagues') || '[]')
        const membersMap = JSON.parse(localStorage.getItem('duojump_leagues_members') || '{}')

        // Try to find a league created by this user (best-effort). If none, return empty.
        const myLeague = leagues.find(l => l.createdBy === (user.email || user.name))
        if (!myLeague) return []

        const members = membersMap[myLeague.id] || []

        // Ensure the current user (creator) appears in the members list if missing.
        try {
            const creatorId = user.id || user.email || user.name || myLeague.createdBy
            if (!members.some(m => m.userId === creatorId)) {
                const statsLocal = stats || getStats()
                const creatorMember = {
                    userId: creatorId,
                    name: user.name || creatorId,
                    avatar: user.avatar || './images/avatar_user.png',
                    xp: statsLocal.bestScore || 0
                }
                members.push(creatorMember)
                membersMap[myLeague.id] = members
                localStorage.setItem('duojump_leagues_members', JSON.stringify(membersMap))
            }
        } catch (e) {
            // ignore
        }

        // Normalize and sort by xp desc
        return (members || []).slice().sort((a, b) => (b.xp || 0) - (a.xp || 0)).map((m, i) => ({
            rank: i + 1,
            name: m.name || 'Jugador',
            xp: m.xp || 0,
            avatar: m.avatar || './images/avatar_user.png',
            you: m.userId === (user.id || user.email || user.name)
        }))
    } catch (e) {
        return []
    }
}

function getMyLeague(user) {
    try {
        const leagues = JSON.parse(localStorage.getItem('duojump_leagues') || '[]')
        if (!user) return null

        // first try leagues created by user
        const byCreator = leagues.find(l => l.createdBy === (user.email || user.name))
        if (byCreator) return byCreator

        // then try leagues where user is a member
        const membersMap = JSON.parse(localStorage.getItem('duojump_leagues_members') || '{}')
        for (const l of leagues) {
            const members = membersMap[l.id] || []
            if (members.some(m => m.userId === (user.id || user.email || user.name))) return l
        }

        return null
    } catch (e) {
        return null
    }
}

function formatRemaining(dateStr) {
    if (!dateStr) return 'Sin fecha'
    const target = new Date(dateStr).getTime()
    const now = Date.now()
    let diff = target - now
    if (isNaN(target)) return 'Sin fecha'
    if (diff <= 0) return 'Finalizada'

    const days = Math.floor(diff / (1000*60*60*24))
    diff -= days * (1000*60*60*24)
    const hours = Math.floor(diff / (1000*60*60))
    diff -= hours * (1000*60*60)
    const minutes = Math.floor(diff / (1000*60))
    diff -= minutes * (1000*60)
    const seconds = Math.floor(diff / 1000)

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

function renderLeaderboard(players) {
    if (!players || players.length === 0) {
        return `
            <div style="text-align:center;padding:30px;border:2px dashed #e4e2e2;border-radius:12px;background:#fff;color:#5a6b4a;font-weight:700">
                Aún no hay miembros en esta liga. Invita jugadores para que aparezcan aquí.
            </div>
        `
    }

    let html = ""

    players.forEach((player) => {
        // Insert ascent separator at rank 6 (existing behavior)
        if (player.rank === 6) {
            html += `<div class="separator">Zona de ascenso</div>`
        }

        // Determine special styling for lower ranks
        let extraClass = ''
        if (player.rank >= 30) extraClass = 'danger'
        else if (player.rank >= 10) extraClass = 'warning'

        // Insert descent separator before rank 30
        if (player.rank === 30) {
            html += `<div class="separator descent">Zona de descenso</div>`
        }

        html += `
            <div class="player-card ${player.you ? "you" : ""} ${extraClass}">
                <div class="rank">${player.rank}</div>

                <img class="avatar" src="${player.avatar}" alt="${player.name}" onerror="this.onerror=null; this.src='./images/logo_duojump.png'">

                <div>
                    <div class="player-name">${player.you ? "Tú" : player.name}</div>
                    ${player.you ? `<div class="player-message">¡Sigue así para ascender!</div>` : ""}
                </div>

                <div class="xp">${(player.xp||0).toLocaleString()} XP</div>
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

    const myLeague = getMyLeague(user)
    const players = getLeaguePlayers(user, stats)

    app.innerHTML = `
        <div class="screen">
            <header class="topbar">
                <div class="topbar-content">
                    <div class="logo">
                        <span class="logo-text">DuoJump</span>
                    </div>

                    <div style="display:flex;align-items:center;gap:12px">
                        <div class="top-stats">
                            <div class="stat-pill">
                                <span class="coin-icon">✪</span>
                                ${coins}
                            </div>

                            <div class="stat-pill">
                                <img class="heart-img" src="${heartIcon}" alt="Vidas">
                                <span class="heart-count">${hearts}</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px">
                                <img src="${user.avatar || './images/avatar_user.png'}" alt="avatar" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #e4e2e2">
                                <div style="font-weight:800;color:#2b6c00">${user.name || 'Tú'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="main">
                <section class="league-header">
                    <div class="badge-wrap">
                        <img class="badge-img" src="./images/liga_oro.png" alt="Liga de Oro" onerror="this.onerror=null; this.style.display='none'">
                    </div>

                    <div class="league-tag">${myLeague ? (myLeague.tag || 'Liga') : 'Liga Oro'}</div>

                    <h1 class="league-title">${myLeague ? myLeague.name : 'Liga de Oro'}</h1>
                    <div class="league-subtitle">${myLeague ? (myLeague.subtitle || 'Tu liga privada') : '¡Estás en el top 10% de los saltadores!'}</div>

                    <div class="timer-card">
                        🕒 Finaliza en: <strong id="leagueTimerText">${myLeague ? formatRemaining(myLeague.date) : '2d 13h 59m 58s'}</strong>
                    </div>

                    <div style="display:flex;justify-content:flex-end;margin-top:12px">
                        ${myLeague ? `<button id="viewLeagueBtn" class="create-league-btn">Ver liga · ${myLeague.code}</button>` : `<button id="createLeagueBtn" class="create-league-btn">+ Crear liga</button>`}
                    </div>

                </section>

                <section class="leaderboard">
                    ${renderLeaderboard(players)}
                </section>
            </main>

            <nav class="bottom-nav">
                <div class="bottom-content">
                    <button class="nav-item" data-nav="jugar">
                        <img class="nav-icon" src="./images/Home.svg" alt="Home">
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
                        <img class="nav-icon nav-avatar" src="${user.avatar || './images/perfil.svg'}" alt="Perfil" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #e6e6e6">
                        Perfil
                    </button>
                </div>
            </nav>
        </div>
    `

    // register profile-update listener once (outside the template)
    try {
        if (!window.__duojump_user_update_listener) {
            window.__duojump_user_update_listener = true

            const applyUserUpdate = (u) => {
                try {
                    const heartIconEl = document.querySelector('.heart-img')
                    if (heartIconEl) heartIconEl.src = (getStats().hearts > 0) ? './images/corazon.png' : './images/corazon_vacio.svg'
                    const statAvatar = document.querySelector(".top-stats img[alt='avatar']")
                    if (statAvatar && u && u.avatar) statAvatar.src = u.avatar
                    const nameEl = document.querySelector('.top-stats div[style*="font-weight:800"]')
                    if (nameEl && u && u.name) nameEl.textContent = u.name

                    // update bottom-nav avatar
                    try {
                        const navImg = document.querySelector('.nav-avatar')
                        if (navImg && u && u.avatar) navImg.src = u.avatar
                    } catch (e) {}

                    try {
                        const hc = document.querySelector('.heart-count')
                        if (hc) hc.textContent = String(getStats().hearts || 0)
                        const heartEl = document.querySelector('.heart-img')
                        if (heartEl) heartEl.src = (getStats().hearts > 0) ? './images/corazon.png' : './images/corazon_vacio.svg'
                    } catch (e) {}

                    // also update leaderboard entries where this user appears
                    try {
                        const playersEls = document.querySelectorAll('.player-card')
                        playersEls.forEach(el => {
                            const img = el.querySelector('img.avatar')
                            const pName = el.querySelector('.player-name')
                            if (!img || !pName) return
                            // if the DOM entry matches current user by name or avatar, refresh
                            if ((u.avatar && img.src && img.src.indexOf(u.avatar) !== -1) || (pName.textContent === (u.name || '')) ) {
                                img.src = u.avatar || img.src
                                pName.textContent = (u.name || pName.textContent)
                            }
                        })
                    } catch (e) {}
                } catch (e) {}
            }

            window.addEventListener('duojump:user-updated', (e) => {
                applyUserUpdate(e.detail || getUser())
                // refresh leaderboard fully in case the name/avatar changed
                try {
                    const players = getLeaguePlayers(getUser(), getStats())
                    const lb = document.querySelector('.leaderboard')
                    if (lb) lb.innerHTML = renderLeaderboard(players)
                } catch (e) {}
            })

            // storage event fires on other tabs when localStorage changes
            window.addEventListener('storage', (ev) => {
                if (!ev) return
                if (ev.key === STORAGE_USER || ev.key === STORAGE_STATS) {
                    try {
                        const u = JSON.parse(localStorage.getItem(STORAGE_USER) || 'null')
                        applyUserUpdate(u)
                        const players = getLeaguePlayers(getUser(), getStats())
                        const lb = document.querySelector('.leaderboard')
                        if (lb) lb.innerHTML = renderLeaderboard(players)
                    } catch (e) {}
                }
            })
            // apply immediately to sync header/leaderboard with current storage
            try { applyUserUpdate(getUser()); const playersNow = getLeaguePlayers(getUser(), getStats()); const lbNow = document.querySelector('.leaderboard'); if (lbNow) lbNow.innerHTML = renderLeaderboard(playersNow) } catch (e) {}
        }
    } catch (e) {}

    bindEvents()

    // start/stop live countdown
    stopLeagueCountdown()
    if (myLeague) startLeagueCountdown(myLeague)
}

function startLeagueCountdown(league) {
    stopLeagueCountdown()
    if (!league) return
    const el = document.getElementById('leagueTimerText')
    if (!el) return

    // update immediately
    el.textContent = formatRemaining(league.date)

    // update every second
    window._leagueTimerId = setInterval(() => {
        const t = document.getElementById('leagueTimerText')
        if (!t) { stopLeagueCountdown(); return }
        t.textContent = formatRemaining(league.date)
    }, 1000)
}

function stopLeagueCountdown() {
    if (window._leagueTimerId) {
        clearInterval(window._leagueTimerId)
        window._leagueTimerId = null
    }
}

// Utility to generate a simple id
function _genId() {
    return `lg_${Date.now()}_${Math.floor(Math.random()*9000+1000)}`
}

function openCreateLeagueModal() {
    const existing = document.getElementById('createLeagueOverlay')
    if (existing) return

    const user = getUser() || {}

    const overlay = document.createElement('div')
    overlay.id = 'createLeagueOverlay'
    overlay.className = 'create-league-overlay'

    const modal = document.createElement('div')
    modal.className = 'create-league-modal'
    modal.innerHTML = `
        <h3>Crear nueva liga</h3>
        <div>
            <label>Nombre de la liga</label>
            <input id="createLeagueName" type="text" placeholder="Ej: Liga de Primavera" />

            <label>Fecha de la liga</label>
            <input id="createLeagueDate" type="date" />

            <div class="create-league-actions">
                <button type="button" id="cancelCreateLeague" class="btn-cancel">Cancelar</button>
                <button type="button" id="submitCreateLeague" class="btn-primary">Crear liga</button>
            </div>
        </div>
    `

    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    document.getElementById('cancelCreateLeague').addEventListener('click', () => overlay.remove())

    document.getElementById('submitCreateLeague').addEventListener('click', () => {
        const name = document.getElementById('createLeagueName').value.trim()
        const date = document.getElementById('createLeagueDate').value || null

        if (!name) { showToast('Ingresa un nombre para la liga'); return }

        const leaguesRaw = localStorage.getItem('duojump_leagues')
        const leagues = leaguesRaw ? JSON.parse(leaguesRaw) : []

        // generate a short unique invite code
        let code
        do {
            code = Math.random().toString(36).substr(2,6).toUpperCase()
        } while (leagues.some(l => l.code === code))

        const league = {
            id: _genId(),
            name,
            date,
            code,
            createdBy: user.email || user.name || 'local',
            createdAt: Date.now(),
        }

        leagues.push(league)
        localStorage.setItem('duojump_leagues', JSON.stringify(leagues))

        // Add creator as first member of the league so they appear in the ranking
        try {
            const stats = getStats()
            const membersMap = JSON.parse(localStorage.getItem('duojump_leagues_members') || '{}')
            const creatorId = user.id || user.email || user.name || league.createdBy
            const creatorMember = {
                userId: creatorId,
                name: user.name || creatorId,
                avatar: user.avatar || './images/avatar_user.png',
                xp: stats.bestScore || 0
            }
            membersMap[league.id] = membersMap[league.id] || []
            // avoid duplicates
            if (!membersMap[league.id].some(m => m.userId === creatorMember.userId)) {
                membersMap[league.id].push(creatorMember)
            }
            localStorage.setItem('duojump_leagues_members', JSON.stringify(membersMap))
        } catch (e) {
            console.warn('Could not add creator to members', e)
        }

        showToast('Liga creada')
        overlay.remove()

        // refresh UI so the new league is shown immediately
        renderLigas()

        // show invite code modal so user can copy/share it
        showInviteCodeModal(code, league.id)
    })
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

    // Create league button - bind outside of nav click handler so it works immediately
    const createBtn = document.getElementById('createLeagueBtn')
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            playClick()
            openCreateLeagueModal()
        })
    }

    // View league button (when user already has a league)
    const viewBtn = document.getElementById('viewLeagueBtn')
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            playClick()
            const user = getUser()
            const league = getMyLeague(user)
            if (league) showViewLeagueModal(league)
        })
    }
}

function showViewLeagueModal(league) {
    const existing = document.getElementById('viewLeagueOverlay')
    if (existing) return

    const overlay = document.createElement('div')
    overlay.id = 'viewLeagueOverlay'
    overlay.className = 'create-league-overlay'

    const modal = document.createElement('div')
    modal.className = 'create-league-modal'

    // members
    const membersMap = JSON.parse(localStorage.getItem('duojump_leagues_members') || '{}')
    const members = membersMap[league.id] || []

    modal.innerHTML = `
        <h3>${league.name}</h3>
        <div style="margin-top:8px">Código: <strong>${league.code}</strong></div>
        <div style="margin-top:6px;color:#556b4a">Fecha: ${league.date || 'Sin fecha'}</div>
        <div style="margin-top:12px">
            <div style="font-weight:800;margin-bottom:8px">Miembros</div>
            ${members.length === 0 ? '<div style="color:#6b6b6b">Aún no hay miembros</div>' : members.map(m => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><img src="${m.avatar||'./images/avatar_user.png'}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #eaeaea"> <div style="font-weight:700">${m.name}</div> <div style="margin-left:auto;color:#2b6c00">${(m.xp||0).toLocaleString()} XP</div></div>`).join('')}
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
            <button id="copyLeagueCode" class="btn-primary">Copiar código</button>
            <button id="closeViewLeague" class="btn-cancel">Cerrar</button>
        </div>
    `

    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    document.getElementById('closeViewLeague').addEventListener('click', () => overlay.remove())
    document.getElementById('copyLeagueCode').addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(league.code); showToast('Código copiado') }
        catch(e) { showToast('Copia manual: '+league.code) }
    })
}

function init() {
    injectStyles()
    renderLigas()
}

document.addEventListener("DOMContentLoaded", init)
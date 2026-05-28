const GAME_PAGE = "./home.html"

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
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        #app {
            width: 100%;
        }

        .page {
            width: 100%;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 24px;
        }

        .auth-layout {
            width: 100%;
            max-width: 1080px;
            display: grid;
            grid-template-columns: 1fr 440px;
            gap: 64px;
            align-items: center;
        }

        .brand-panel {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
        }

        .main-logo {
            width: 100%;
            max-width: 520px;
            height: auto;
            display: block;
            object-fit: contain;
            margin-bottom: 34px;
        }

        .brand-title {
            font-size: 42px;
            font-weight: 800;
            letter-spacing: -1.4px;
            margin: 0 0 12px;
            color: #1b1c1c;
        }

        .brand-text {
            max-width: 520px;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.6;
            color: #4b5742;
            margin: 0;
        }

        .brand-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 28px;
        }

        .tag {
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-radius: 999px;
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 800;
            color: #2b6c00;
        }

        .auth-card {
            width: 100%;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-radius: 24px;
            padding: 34px 34px 30px;
            box-shadow: 0 18px 35px rgba(0, 0, 0, 0.06);
        }

        .mobile-logo {
            display: none;
            width: 100%;
            max-width: 340px;
            height: auto;
            margin: 0 auto 22px;
        }

        .title {
            text-align: center;
            font-size: 32px;
            font-weight: 800;
            margin: 0 0 8px;
            letter-spacing: -0.8px;
        }

        .subtitle {
            text-align: center;
            font-size: 16px;
            font-weight: 600;
            color: #3f4a36;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 18px;
        }

        .label {
            display: block;
            font-size: 12px;
            font-weight: 800;
            color: #6f7b64;
            letter-spacing: 2px;
            margin: 0 0 8px 4px;
            text-transform: uppercase;
        }

        .input {
            width: 100%;
            height: 56px;
            border: 2px solid #e4e2e2;
            border-radius: 14px;
            background: #f7f7f7;
            padding: 0 20px;
            font-size: 15px;
            font-weight: 700;
            color: #1b1c1c;
            outline: none;
        }

        .input::placeholder {
            color: #b9b9b9;
        }

        .input:focus {
            border-color: #58cc02;
            background: #ffffff;
        }

        .primary-btn {
            width: 100%;
            height: 58px;
            border: none;
            border-radius: 14px;
            background: #58cc02;
            border-bottom: 5px solid #46a302;
            color: #ffffff;
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 4px;
            cursor: pointer;
            margin-top: 18px;
            text-transform: uppercase;
        }

        .primary-btn:hover {
            filter: brightness(1.02);
        }

        .primary-btn:active {
            transform: translateY(4px);
            border-bottom: 1px solid #46a302;
        }

        .divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 34px 0 28px;
            color: #c6c6c6;
            font-weight: 800;
        }

        .divider::before,
        .divider::after {
            content: "";
            flex: 1;
            height: 2px;
            background: #e4e2e2;
        }

        .social-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .social-btn {
            height: 56px;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            border-radius: 14px;
            color: #00527a;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 1px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-transform: uppercase;
        }

        .social-btn:hover {
            background: #fbfbfb;
        }

        .social-btn:active {
            transform: translateY(4px);
            border-bottom: 1px solid #d8d8d8;
        }

        .social-icon {
            width: 22px;
            height: 22px;
            object-fit: contain;
            display: block;
        }

        .login-text {
            text-align: center;
            margin-top: 26px;
            font-size: 14px;
            font-weight: 800;
        }

        .login-link {
            color: #00527a;
            cursor: pointer;
            margin-left: 6px;
        }

        .profile-card {
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-radius: 18px;
            padding: 24px;
            margin-top: 20px;
        }

        .profile-name {
            font-size: 26px;
            font-weight: 800;
            margin-bottom: 6px;
            color: #1b1c1c;
        }

        .profile-email {
            font-size: 15px;
            color: #6f7b64;
            font-weight: 600;
            margin-bottom: 22px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            margin-bottom: 22px;
        }

        .stat-box {
            background: #f7f7f7;
            border: 2px solid #e4e2e2;
            border-radius: 16px;
            padding: 16px;
            text-align: center;
            font-weight: 800;
        }

        .stat-number {
            font-size: 24px;
            color: #58cc02;
        }

        .stat-label {
            font-size: 12px;
            color: #6f7b64;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .secondary-btn {
            width: 100%;
            height: 54px;
            background: #ffffff;
            border: 2px solid #e4e2e2;
            border-bottom: 5px solid #d8d8d8;
            border-radius: 14px;
            color: #3f4a36;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            margin-top: 14px;
            text-transform: uppercase;
        }

        .secondary-btn:active {
            transform: translateY(4px);
            border-bottom: 1px solid #d8d8d8;
        }

        .toast {
            position: fixed;
            left: 50%;
            bottom: 35px;
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
            bottom: 50px;
        }

        @media (max-width: 900px) {
            body {
                align-items: flex-start;
            }

            .page {
                padding: 24px 20px 40px;
                align-items: flex-start;
            }

            .auth-layout {
                max-width: 520px;
                display: block;
            }

            .brand-panel {
                display: none;
            }

            .auth-card {
                border: none;
                box-shadow: none;
                background: transparent;
                padding: 0;
            }

            .mobile-logo {
                display: block;
            }
        }

        @media (max-width: 520px) {
            .page {
                padding: 22px 22px 36px;
            }

            .mobile-logo {
                max-width: 340px;
                margin-bottom: 26px;
            }

            .title {
                font-size: 29px;
            }

            .subtitle {
                font-size: 15px;
                margin-bottom: 30px;
            }

            .social-row {
                grid-template-columns: 1fr 1fr;
                gap: 18px;
            }

            .social-btn {
                font-size: 13px;
                gap: 8px;
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

function createLogo() {
    return `<img class="mobile-logo" src="./images/logo_duojump-png.png" alt="DuoJump">`
}

function createBrandPanel() {
    return `
        <section class="brand-panel">
            <img class="main-logo" src="./images/logo_duojump-png.png" alt="DuoJump">

            <h1 class="brand-title">Aprende inglés jugando</h1>

            <p class="brand-text">
                Salta plataformas, completa palabras, gana monedas y mantén tu racha diaria mientras practicas vocabulario en inglés.
            </p>

            <div class="brand-tags">
                <div class="tag">Verbos</div>
                <div class="tag">Phrasal verbs</div>
                <div class="tag">Rachas</div>
                <div class="tag">Monedas</div>
            </div>
        </section>
    `
}

function createSocialButtons() {
    return `
        <div class="social-row">
            <button class="social-btn" data-social="google" type="button">
                <img class="social-icon" src="./images/google.png" alt="Google">
                Google
            </button>

            <button class="social-btn" data-social="facebook" type="button">
                <img class="social-icon" src="./images/facebook.png" alt="Facebook">
                Facebook
            </button>
        </div>
    `
}

function loginWithSocial(provider) {
    playClick()

    if (provider === 'google') {
        // Prefer Supabase OAuth when available (redirect flow)
        if (window.SupabaseHelper && typeof SupabaseHelper.signInWithGoogle === 'function') {
            try {
                SupabaseHelper.signInWithGoogle()
                return
            } catch (e) {
                console.error('Supabase OAuth failed', e)
                showToast('No se pudo iniciar sesión con Google')
                return
            }
        }

        // Fallback: if GoogleAuth is available, prompt One Tap / button (requires init)
        if (window.GoogleAuth && window.google?.accounts?.id) {
            try {
                showToast('Abriendo Google...')
                window.google.accounts.id.prompt()
                return
            } catch (e) {
                console.warn('Google prompt failed', e)
            }
        }

        showToast('Google no está configurado')
        return
    }

    // Fallback for other providers (local simulation for Facebook)
    const providerName = provider === "google" ? "Google" : "Facebook"
    const providerEmail = provider === "google" ? "usuario.google@duojump.com" : "usuario.facebook@duojump.com"

    saveUser({
        name: `Usuario ${providerName}`,
        email: providerEmail,
        password: "",
        provider: providerName,
        createdAt: new Date().toISOString(),
    })

    const stats = getStats()
    stats.hearts = 5
    saveStats(stats)

    showToast(`Sesión iniciada con ${providerName}`)

    setTimeout(() => {
        renderProfile()
    }, 700)
}

/*
Integration with Google Sign-In (client-side)

Steps to enable:
1) Create an OAuth 2.0 Client ID in Google Cloud Console and set your authorized origins.
2) Include the google-auth.js helper in the page (add <script src="./google-auth.js"></script>).
3) Initialize the helper on your login page after DOM is ready:

   GoogleAuth.init('<YOUR_GOOGLE_CLIENT_ID>', (profile) => {
       // profile contains fields like name, email, picture, sub (id)
       saveUser({
           name: profile.name || profile.email,
           email: profile.email,
           password: '',
           provider: 'google',
           createdAt: new Date().toISOString(),
       })

       const stats = getStats()
       stats.hearts = 5
       saveStats(stats)

       // render profile view as the app currently does
       renderProfile()
   })

4) Optionally render a Google button into a container with id `googleSignInButton`:

   <div id="googleSignInButton"></div>
   GoogleAuth.renderButton('googleSignInButton')

Important: For production verify the ID token on your server. Do not embed sensitive secrets.
*/

function renderRegister() {
    const app = document.getElementById("app")

    app.innerHTML = `
        <div class="page">
            <div class="auth-layout">
                ${createBrandPanel()}

                <section class="auth-card">
                    ${createLogo()}

                    <h1 class="title">Crea tu perfil</h1>
                    <div class="subtitle">Empieza tu aventura hoy mismo.</div>

                    <form id="registerForm">
                        <div class="form-group">
                            <label class="label">Nombre</label>
                            <input class="input" id="name" type="text" placeholder="Tu nombre" autocomplete="name">
                        </div>

                        <div class="form-group">
                            <label class="label">Correo electrónico</label>
                            <input class="input" id="email" type="email" placeholder="ejemplo@correo.com" autocomplete="email">
                        </div>

                        <div class="form-group">
                            <label class="label">Contraseña</label>
                            <input class="input" id="password" type="password" placeholder="Mínimo 8 caracteres" autocomplete="new-password">
                        </div>

                        <button class="primary-btn" type="submit">Crear perfil</button>
                    </form>

                    <div class="divider">o</div>

                    ${createSocialButtons()}

                    <!-- Usamos sólo el botón principal Google de la fila social -->

                    <div class="login-text">
                        ¿Ya tienes cuenta?
                        <span class="login-link" id="goLogin">Inicia sesión</span>
                    </div>
                </section>
            </div>
        </div>
    `

    bindRegisterEvents()
    if (window.GoogleAuth) {
        try { GoogleAuth.renderButton('googleSignInButton') } catch (e) {}
    }
}

function renderLogin() {
    const app = document.getElementById("app")

    app.innerHTML = `
        <div class="page">
            <div class="auth-layout">
                ${createBrandPanel()}

                <section class="auth-card">
                    ${createLogo()}

                    <h1 class="title">Inicia sesión</h1>
                    <div class="subtitle">Recupera tu progreso y tu racha.</div>

                    <form id="loginForm">
                        <div class="form-group">
                            <label class="label">Correo electrónico</label>
                            <input class="input" id="loginEmail" type="email" placeholder="ejemplo@correo.com" autocomplete="email">
                        </div>

                        <div class="form-group">
                            <label class="label">Contraseña</label>
                            <input class="input" id="loginPassword" type="password" placeholder="Tu contraseña" autocomplete="current-password">
                        </div>

                        <button class="primary-btn" type="submit">Iniciar sesión</button>
                    </form>

                    <div class="divider">o</div>

                    ${createSocialButtons()}

                    <!-- Usamos sólo el botón principal Google de la fila social -->

                    <div class="login-text">
                        ¿No tienes cuenta?
                        <span class="login-link" id="goRegister">Crear perfil</span>
                    </div>
                </section>
            </div>
        </div>
    `

    bindLoginEvents()
    // No extra Google UI here; social Google button will trigger OAuth if available
}

function renderProfile() {
    const user = getUser()
    const stats = getStats()
    const app = document.getElementById("app")

    if (!user) {
        renderRegister()
        return
    }

    app.innerHTML = `
        <div class="page">
            <div class="auth-layout">
                ${createBrandPanel()}

                <section class="auth-card">
                    ${createLogo()}

                    <h1 class="title">Tu perfil</h1>
                    <div class="subtitle">Revisa tu progreso de aprendizaje.</div>

                    <section class="profile-card">
                        <div class="profile-name">${user.name}</div>
                        <div class="profile-email">${user.email}</div>

                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-number">${stats.streak} 🔥</div>
                                <div class="stat-label">Racha</div>
                            </div>

                            <div class="stat-box">
                                <div class="stat-number">${stats.coins} ✪</div>
                                <div class="stat-label">Monedas</div>
                            </div>

                            <div class="stat-box">
                                <div class="stat-number">${stats.bestScore}</div>
                                <div class="stat-label">Mejor score</div>
                            </div>

                            <div class="stat-box">
                                <div class="stat-number">${stats.wordsCompleted}</div>
                                <div class="stat-label">Palabras</div>
                            </div>
                        </div>

                        <button class="primary-btn" id="playNow">Jugar ahora</button>
                        <button class="secondary-btn" id="logout">Cerrar sesión</button>
                    </section>
                </section>
            </div>
        </div>
    `

    document.getElementById("playNow").addEventListener("click", () => {
        playClick()
        window.location.href = GAME_PAGE
    })

    document.getElementById("logout").addEventListener("click", () => {
        playClick()
        removeUser()
        showToast("Sesión cerrada")
        renderRegister()
    })
}

function bindRegisterEvents() {
    document.getElementById("registerForm").addEventListener("submit", (event) => {
        event.preventDefault()
        playClick()

        const name = document.getElementById("name").value.trim()
        const email = document.getElementById("email").value.trim()
        const password = document.getElementById("password").value.trim()

        if (name.length < 2) {
            showToast("Escribe un nombre válido")
            return
        }

        if (!email.includes("@") || !email.includes(".")) {
            showToast("Escribe un correo válido")
            return
        }

        if (password.length < 8) {
            showToast("La contraseña debe tener mínimo 8 caracteres")
            return
        }

        saveUser({
            name,
            email,
            password,
            provider: "local",
            createdAt: new Date().toISOString(),
        })

        const stats = getStats()
        stats.hearts = 5
        saveStats(stats)

        showToast("Perfil creado correctamente")

        setTimeout(() => {
            // After creating a profile, enter the app automatically
            window.location.href = GAME_PAGE
        }, 700)
    })

    document.getElementById("goLogin").addEventListener("click", () => {
        playClick()
        renderLogin()
    })

    document.querySelectorAll("[data-social]").forEach((button) => {
        button.addEventListener("click", () => {
            loginWithSocial(button.dataset.social)
        })
    })
}

function bindLoginEvents() {
    document.getElementById("loginForm").addEventListener("submit", (event) => {
        event.preventDefault()
        playClick()

        const savedUser = getUser()
        const email = document.getElementById("loginEmail").value.trim()
        const password = document.getElementById("loginPassword").value.trim()

        if (!savedUser) {
            showToast("Primero crea un perfil")
            renderRegister()
            return
        }

        if (savedUser.provider !== "local") {
            showToast(`Tu cuenta usa ${savedUser.provider}`)
            return
        }

        if (email !== savedUser.email || password !== savedUser.password) {
            showToast("Correo o contraseña incorrectos")
            return
        }

        showToast("Inicio de sesión correcto")

        setTimeout(() => {
            // After login, enter the app automatically
            window.location.href = GAME_PAGE
        }, 700)
    })

    document.getElementById("goRegister").addEventListener("click", () => {
        playClick()
        renderRegister()
    })

    document.querySelectorAll("[data-social]").forEach((button) => {
        button.addEventListener("click", () => {
            loginWithSocial(button.dataset.social)
        })
    })
}

function init() {
    injectStyles()
    getStats()

    const user = getUser()

    if (user) {
        // If a local user exists, go directly into the app instead of showing profile here
        window.location.href = GAME_PAGE
    } else {
        renderRegister()
    }

    // Google Sign-In initialization (client-side)
    // Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Client ID from Google Cloud Console.
    // This will decode the credential JWT and call the callback with the profile.
    if (window.GoogleAuth) {
        try {
            GoogleAuth.init('YOUR_GOOGLE_CLIENT_ID', (profile) => {
                // profile contains fields like name, email, picture
                saveUser({
                    name: profile.name || profile.email,
                    email: profile.email,
                    password: '',
                    provider: 'google',
                    createdAt: new Date().toISOString(),
                })

                const stats = getStats()
                stats.hearts = 5
                saveStats(stats)

                showToast('Sesión iniciada con Google')

                setTimeout(() => {
                    // Enter the app after Google sign-in
                    window.location.href = GAME_PAGE
                }, 700)
            }, { prompt: false })
        } catch (e) {
            console.warn('GoogleAuth init failed', e)
        }
    }

    // Initialize SupabaseHelper if you want to use Supabase OAuth.
    // Replace with your Supabase project values or call SupabaseHelper.init(url, key) from elsewhere.
    if (window.SupabaseHelper) {
        try {
            // Uncomment and fill with your values, or call SupabaseHelper.init from another script
            // SupabaseHelper.init('https://your-project.supabase.co', 'public-anon-key')

            // If a Supabase session exists after redirect, we can read it and persist locally
            (async () => {
                try {
                    const suser = await SupabaseHelper.getUser()
                    if (suser) {
                        const profile = {
                            id: suser.id,
                            email: suser.email,
                            name: suser.user_metadata?.full_name || suser.email,
                            picture: suser.user_metadata?.avatar_url || suser.user_metadata?.picture || null,
                            provider: 'google'
                        }

                        // Upsert user into Supabase users table including local stats
                        try {
                            const stats = getStats()
                            await SupabaseHelper.upsertUser(profile, {
                                hearts: stats.hearts,
                                coins: stats.coins,
                                streak: stats.streak,
                                best_score: stats.bestScore,
                                words_completed: stats.wordsCompleted,
                                last_played: stats.lastPlayed || null
                            })
                        } catch (e) {
                            console.warn('Supabase upsert failed', e)
                        }

                        // Persist minimal local user and render profile
                        saveUser({ name: profile.name, email: profile.email, provider: 'supabase', password: '' })
                        const stats = getStats()
                        stats.hearts = 5
                        saveStats(stats)
                        // Enter the app after Supabase session is detected
                        window.location.href = GAME_PAGE
                    }
                } catch (e) {}
            })()
        } catch (e) {
            console.warn('SupabaseHelper init/read failed', e)
        }
    }
}

document.addEventListener("DOMContentLoaded", init)
/*
Google Sign-In helper (client-side, Google Identity Services)

Usage:
1) Create an OAuth 2.0 Client ID for Web application in Google Cloud Console:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create Credentials -> OAuth client ID -> Web application
   - Add your local origin (e.g. http://127.0.0.1:5500) to Authorized JavaScript origins
   - Copy the Client ID

2) Include this file in the page that shows the Google sign-in button (e.g. index.html or login page):
   <script src="./google-auth.js"></script>

3) Initialize with your client id and a callback that receives the user profile:
   GoogleAuth.init('<YOUR_CLIENT_ID>', (profile) => {
       // profile: {sub, name, given_name, family_name, email, picture, locale}
       // Example: save to localStorage like the existing app uses:
       saveUser({ name: profile.name, email: profile.email, provider: 'google', createdAt: new Date().toISOString() })
       // then update UI or call renderProfile()
   })

4) Render the Google button (optional) into a container with id 'googleSignInButton':
   GoogleAuth.renderButton('googleSignInButton')

Notes:
- This is a purely client-side integration using Google Identity Services (GSI). For production you should verify the ID token on your server.
- Do NOT embed client secrets in frontend code.
*/

const GoogleAuth = (function () {
    let _clientId = null
    let _callback = null
    let _scriptLoaded = false

    function loadGsiScript() {
        return new Promise((resolve, reject) => {
            if (_scriptLoaded || window.google?.accounts?.id) {
                _scriptLoaded = true
                return resolve()
            }

            const s = document.createElement('script')
            s.src = 'https://accounts.google.com/gsi/client'
            s.async = true
            s.defer = true
            s.onload = () => {
                _scriptLoaded = true
                resolve()
            }
            s.onerror = (e) => reject(e)
            document.head.appendChild(s)
        })
    }

    function parseJwt (token) {
        try {
            const payload = token.split('.')[1]
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
            return JSON.parse(decodeURIComponent(escape(decoded)))
        } catch (e) {
            return null
        }
    }

    function handleCredentialResponse(response) {
        if (!response || !response.credential) return
        const profile = parseJwt(response.credential)
        if (_callback && profile) {
            _callback(profile)
        }
    }

    async function init(clientId, callback, opts = {}) {
        _clientId = clientId
        _callback = callback

        if (!_clientId) {
            console.warn('GoogleAuth: clientId is required')
            return
        }

        await loadGsiScript()

        window.google.accounts.id.initialize({
            client_id: _clientId,
            callback: handleCredentialResponse,
            auto_select: opts.auto_select || false,
            cancel_on_tap_outside: opts.cancel_on_tap_outside !== false,
        })

        if (opts.prompt !== false) {
            // show One Tap if desired; disable on small screens or if not wanted
            try { window.google.accounts.id.prompt() } catch (e) { /* ignore */ }
        }
    }

    function renderButton(containerId, btnOpts = {}) {
        if (!window.google?.accounts?.id) {
            console.warn('GoogleAuth: GSI not loaded yet. Call init() first.')
            return
        }

        const container = document.getElementById(containerId)
        if (!container) {
            console.warn('GoogleAuth: container not found', containerId)
            return
        }

        // remove previous children
        container.innerHTML = ''

        window.google.accounts.id.renderButton(container, Object.assign({
            theme: 'outline',
            size: 'large',
        }, btnOpts))
    }

    function disableAutoPrompt() {
        if (window.google?.accounts?.id?.cancel) {
            try { window.google.accounts.id.cancel() } catch (e) {}
        }
    }

    return {
        init,
        renderButton,
        disableAutoPrompt,
    }
})()

// expose globally
window.GoogleAuth = GoogleAuth

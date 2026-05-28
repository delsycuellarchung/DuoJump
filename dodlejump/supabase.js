

(function () {
    const helper = {
        _client: null,
        _createClient: null,
    }

    async function _loadClient() {
        if (helper._createClient) return
        try {
            const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
            helper._createClient = mod.createClient
        } catch (e) {
            console.error('Failed to load supabase client', e)
            throw e
        }
    }

    async function init(url, anonKey) {
        await _loadClient()
        helper._client = helper._createClient(url, anonKey)

        // Try to handle redirect session if present (after OAuth)
        try {
            // v2: getSessionFromUrl
            if (helper._client.auth && helper._client.auth.getSessionFromUrl) {
                await helper._client.auth.getSessionFromUrl({ storeSession: true })
            }
        } catch (e) {
            // ignore
        }

        return helper._client
    }

    async function signInWithGoogle() {
        if (!helper._client) return console.warn('Supabase not initialized')
        try {
            const { error } = await helper._client.auth.signInWithOAuth({ provider: 'google' })
            if (error) console.error('Supabase OAuth error', error)
        } catch (e) {
            console.error('Supabase signInWithGoogle failed', e)
        }
    }

    async function signOut() {
        if (!helper._client) return
        try {
            await helper._client.auth.signOut()
        } catch (e) {}
    }

    async function getUser() {
        if (!helper._client) return null
        try {
            const { data } = await helper._client.auth.getUser()
            return data?.user ?? null
        } catch (e) {
            return null
        }
    }

    async function upsertUser(profile, stats = {}) {
        if (!helper._client) return null
        try {
            const userId = profile?.id || profile?.sub || profile?.user?.id
            const email = profile?.email
            const full_name = profile?.name || profile?.full_name || ''
            const avatar_url = profile?.picture || profile?.avatar_url || null
            const provider = profile?.provider || 'google'

            if (!userId) return null

            const row = {
                id: userId,
                email,
                full_name,
                avatar_url,
                provider,
            }

            // merge optional stats fields if provided
            if (stats && typeof stats === 'object') {
                if (typeof stats.hearts === 'number') row.hearts = stats.hearts
                if (typeof stats.coins === 'number') row.coins = stats.coins
                if (typeof stats.streak === 'number') row.streak = stats.streak
                if (typeof stats.best_score === 'number') row.best_score = stats.best_score
                if (typeof stats.words_completed === 'number') row.words_completed = stats.words_completed
                if (stats.last_played) row.last_played = stats.last_played
            }

            const { error } = await helper._client.from('users').upsert(row, { returning: 'minimal' })

            if (error) {
                console.error('Failed to upsert user', error)
                return null
            }

            return { id: userId, email, full_name, avatar_url }
        } catch (e) {
            console.error('upsertUser error', e)
            return null
        }
    }

    window.SupabaseHelper = {
        init,
        signInWithGoogle,
        signOut,
        getUser,
        upsertUser,
    }
})()

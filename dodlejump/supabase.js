

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

    // --- League helpers ---
    function _genCode(len = 6) {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
        let s = ''
        for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length))
        return s
    }

    async function createLeague(name, capacity = 50, code = null) {
        if (!helper._client) throw new Error('Supabase not initialized')
        const u = await getUser()
        if (!u) throw new Error('Not authenticated')
        const leagueCode = code || _genCode(6)
        const { data, error } = await helper._client.from('leagues').insert({ name, code: leagueCode, owner_id: u.id, capacity }).select().single()
        if (error) throw error
        return data
    }

    async function joinLeague(code) {
        if (!helper._client) throw new Error('Supabase not initialized')
        const res = await helper._client.from('leagues').select('*').eq('code', code).maybeSingle()
        if (res.error) throw res.error
        const league = res.data
        if (!league) throw new Error('Liga no encontrada')

        // check capacity
        const cnt = await helper._client.from('league_members').select('*', { count: 'exact', head: true }).eq('league_id', league.id)
        if (cnt.error) throw cnt.error
        const count = cnt.count || 0
        if (count >= league.capacity) throw new Error('La liga está llena')

        const u = await getUser()
        if (!u) throw new Error('Not authenticated')

        const up = await helper._client.from('league_members').insert({ league_id: league.id, user_id: u.id }).select().single()
        if (up.error) throw up.error
        return up.data
    }

    async function submitLeagueScore(leagueId, points) {
        if (!helper._client) throw new Error('Supabase not initialized')
        const u = await getUser()
        if (!u) throw new Error('Not authenticated')

        // upsert points (store max)
        const { data, error } = await helper._client.from('league_members').upsert(
            { league_id: leagueId, user_id: u.id, points },
            { onConflict: ['league_id', 'user_id'], returning: 'representation' }
        )

        if (error) throw error
        return data
    }

    async function getLeagueLeaderboard(leagueId, limit = 50) {
        if (!helper._client) throw new Error('Supabase not initialized')
        const { data, error } = await helper._client.from('league_members').select('user_id, points, joined_at').eq('league_id', leagueId).order('points', { ascending: false }).limit(limit)
        if (error) throw error
        return data
    }

    window.SupabaseHelper = {
        init,
        signInWithGoogle,
        signOut,
        getUser,
        upsertUser,
        // leagues
        createLeague,
        joinLeague,
        submitLeagueScore,
        getLeagueLeaderboard,
    }
})()

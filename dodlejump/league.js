// Minimal client for leagues using SupabaseHelper
function $id(id){return document.getElementById(id)}

async function initLeaguePage(){
    // Try to init Supabase if not yet
    if (window.SupabaseHelper && typeof SupabaseHelper.init === 'function') {
        // assume index.html initialized with constants; try to load client if not
        try { await SupabaseHelper.init('', '') } catch(e) {}
    }

    $id('createLeagueBtn').addEventListener('click', async ()=>{
        const name = $id('leagueName').value.trim() || 'Liga'
        const cap = parseInt($id('leagueCap').value) || 50
        try{
            const league = await SupabaseHelper.createLeague(name, cap)
            $id('createResult').textContent = `Liga creada. Código: ${league.code} | ID: ${league.id}`
        }catch(e){
            console.error(e)
            $id('createResult').textContent = 'Error: '+(e.message||e)
        }
    })

    $id('joinLeagueBtn').addEventListener('click', async ()=>{
        const code = $id('joinCode').value.trim()
        if (!code) { $id('joinResult').textContent = 'Ingresa un código'; return }
        try{
            await SupabaseHelper.joinLeague(code)
            $id('joinResult').textContent = 'Te uniste correctamente a la liga.'
        }catch(e){
            console.error(e)
            $id('joinResult').textContent = 'Error: '+(e.message||e)
        }
    })

    $id('loadLeaderboard').addEventListener('click', async ()=>{
        const id = $id('leaderLeagueId').value.trim()
        if (!id) { $id('leaderboard').textContent = 'Ingresa el id de la liga'; return }
        try{
            const rows = await SupabaseHelper.getLeagueLeaderboard(id, 50)
            $id('leaderboard').innerHTML = rows.map(r => `<div>${r.user_id} — ${r.points} pts</div>`).join('')
        }catch(e){
            console.error(e)
            $id('leaderboard').textContent = 'Error: '+(e.message||e)
        }
    })
}

document.addEventListener('DOMContentLoaded', initLeaguePage)

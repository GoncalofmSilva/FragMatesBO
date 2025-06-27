import pool from '../config/db.js'

export const listUsersPerFilter = async ({rankMin, ranKMax, lvlMin, lvlMax, roleMin, roleMax}) => {
    const users = await pool.query('SELECT user_id, steam_rank, faceit_lvl, discord, role FROM users_details WHERE steam_rank in (?, ?) and faceit_lvl (?, ?) and role in (?, ?)',
        [rankMin, ranKMax, lvlMin, lvlMax, roleMin, roleMax]
    )
    return users
}
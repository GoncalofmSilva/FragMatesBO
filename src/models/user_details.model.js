import pool from '../config/db.js'

export const listUsersPerFilter = async ({ rankMin, rankMax, lvlMin, lvlMax, roles }) => {
    // Ensure roles is an array like ['Support', 'IGL']
    if (!Array.isArray(roles) || roles.length === 0) {
        throw new Error('Roles must be a non-empty array')
    }

    // Dynamically create the role placeholders for SQL IN clause
    const rolePlaceholders = roles.map(() => '?').join(', ')

    const query = `
        SELECT DISTINCT ud.user_id, ud.steam_rank, ud.faceit_lvl, ud.discord, ud.role
        FROM user_details ud
        INNER JOIN cs_ratings cr ON ud.steam_rank BETWEEN cr.min_rating AND cr.max_rating
        INNER JOIN faceit_lvls fl ON ud.faceit_lvl = fl.level
        INNER JOIN roles r ON FIND_IN_SET(r.name, ud.role) > 0
        WHERE ud.steam_rank BETWEEN ? AND ?
          AND ud.faceit_lvl BETWEEN ? AND ?
          AND r.name IN (${rolePlaceholders})
    `

    const params = [rankMin, rankMax, lvlMin, lvlMax, ...roles]

    const [rows] = await pool.query(query, params)
    return rows
}

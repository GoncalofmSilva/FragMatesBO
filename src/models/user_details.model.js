import pool from '../config/db.js'

export const listUsersCS2 = async ({ rankMin, rankMax, lvlMin, lvlMax, roles, game }) => {
    if (game !== 'CS2') {
        throw new Error('Invalid game specified. Only CS2 is supported.')
    }
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
        INNER JOIN games g ON ud.game = g.name
        WHERE ud.steam_rank BETWEEN ? AND ?
          AND ud.faceit_lvl BETWEEN ? AND ?
          AND r.name IN (${rolePlaceholders})
          AND r.game_type = ud.game
          AND ud.game = ?
    `

    const params = [rankMin, rankMax, lvlMin, lvlMax, ...roles, game]

    const [rows] = await pool.query(query, params)
    return rows
}

export const listUsersValorant = async ({ rankMin, rankMax, lvlMin, lvlMax, roles, game }) => {
    if (game !== 'Valorant') {
        throw new Error('Invalid game specified. Only Valorant is supported.')
    }

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
        INNER JOIN games g ON ud.game = g.name
        WHERE ud.steam_rank BETWEEN ? AND ?
          AND ud.faceit_lvl BETWEEN ? AND ?
          AND r.name IN (${rolePlaceholders})
          AND r.game_type = ud.game
          AND ud.game = ?
    `

    const params = [rankMin, rankMax, lvlMin, lvlMax, ...roles, game]

    const [rows] = await pool.query(query, params)
    return rows
}

export const getUserDetailsById = async (userId) => {
    const query = `
        SELECT ud.user_id, ud.steam_rank, ud.faceit_lvl, ud.discord, ud.role, ud.steam, u.nationality, u.name, u.age
        FROM users u
        INNER JOIN user_details ud ON u.id = ud.user_id
        WHERE ud.user_id = ?
    `

    const [rows] = await pool.query(query, [userId])
    return rows[0]
}

/*CS2
SELECT DISTINCT ud.user_id, ud.steam_rank, ud.faceit_lvl, ud.discord, ud.role
FROM user_details ud
INNER JOIN cs_ratings cr ON ud.steam_rank BETWEEN cr.min_rating AND cr.max_rating
INNER JOIN faceit_lvls fl ON ud.faceit_lvl = fl.level
INNER JOIN roles r ON FIND_IN_SET(r.name, ud.role) > 0
INNER JOIN games g ON ud.game = g.name
WHERE ud.steam_rank BETWEEN ? AND ?
  AND ud.faceit_lvl BETWEEN ? AND ?
  AND r.name IN (?, ?, ...)  -- Replace with actual role values
  AND r.game_type = ud.game
  AND ud.game = 'CS2'; */

/*Valorant
SELECT DISTINCT ud.user_id, ud.steam_rank, ud.faceit_lvl, ud.discord, ud.role
FROM user_details ud
INNER JOIN cs_ratings cr ON ud.steam_rank BETWEEN cr.min_rating AND cr.max_rating
INNER JOIN faceit_lvls fl ON ud.faceit_lvl = fl.level
INNER JOIN roles r ON FIND_IN_SET(r.name, ud.role) > 0
INNER JOIN games g ON ud.game = g.name
WHERE ud.steam_rank BETWEEN ? AND ?
  AND ud.faceit_lvl BETWEEN ? AND ?
  AND r.name IN (?, ?, ...)  -- Replace with actual role values
  AND r.game_type = ud.game
  AND ud.game = 'Valorant'; */

/* Get user details by user ID
SELECT ud.user_id, ud.steam_rank, ud.faceit_lvl, ud.discord, ud.role, ud.steam, u.nationality, u.name, u.age
FROM users u
INNER JOIN user_details ud ON u.id = ud.user_id
WHERE ud.user_id = ?;  -- Replace with the actual user ID*/
import pool from "../config/db.js";

export const listConnections = async (connected_userId, userId) => {
    const query = `
        SELECT u.id, u.username
        FROM connections c
        JOIN users u ON 
        (u.id = c.user_id AND c.connected_user_id = ?) OR 
        (u.id = c.connected_user_id AND c.user_id = ?)
        WHERE c.status = 'accepted';
    `;

    const [rows] = await pool.query(query, [connected_userId, userId]);
    return rows;
}

export const receivedConnections = async (connected_userId) => {
    const query = `
        SELECT u.id, u.username
        FROM connections c
        JOIN users u ON c.user_id = u.id
        WHERE c.connected_user_id = ? AND c.status = 'pending';
    `;

    const [rows] = await pool.query(query, [connected_userId]);
    return rows;
}

export const sentConnections = async (connected_userId) => {
    const query = `
        SELECT u.id, u.username
        FROM connections c
        JOIN users u ON c.connected_user_id = u.id
        WHERE c.user_id = ? AND c.status = 'pending';
    `;

    const [rows] = await pool.query(query, [connected_userId]);
    return rows;
}

export const sendConnectionRequest = async (userId, connected_userId) => {
    const checkQuery = `
    SELECT * FROM connections 
    WHERE (user_id = ? AND connected_user_id = ?) 
       OR (user_id = ? AND connected_user_id = ?)
  `;

    const [existing] = await pool.query(checkQuery, [
        userId, connected_userId,
        connected_userId, userId,
    ]);

    if (existing.length > 0) {
        throw new Error("Connection already exists or is pending.");
    }

    const insertQuery = `
    INSERT INTO connections (user_id, connected_user_id, status)
    VALUES (?, ?, 'pending');
  `;

    const [result] = await pool.query(insertQuery, [userId, connected_userId]);
    return result;
};


export const acceptConnectionRequest = async (userId, connected_userId) => {
    const query = `
        UPDATE connections
        SET status = 'accepted'
        WHERE user_id = ? AND connected_user_id = ? AND status = 'pending';
    `;

    const [result] = await pool.query(query, [userId, connected_userId]);
    return result;
}

export const rejectConnectionRequest = async (userId, connected_userId) => {
    const query = `
        UPDATE connections
        SET status = 'rejected'
        WHERE user_id = ? AND connected_user_id = ? AND status = 'pending';
    `;

    const [result] = await pool.query(query, [userId, connected_userId]);
    return result;
}

export const cancelConnectionRequest = async (userId, connected_userId) => {
  const query = `
    DELETE FROM connections
    WHERE user_id = ? AND connected_user_id = ? AND status = 'pending';
  `;

  const [result] = await pool.query(query, [userId, connected_userId]);
  return result;
};

export const deleteConnection = async (userId, connected_userId) => {
  const query = `
    DELETE FROM connections
    WHERE ((user_id = ? AND connected_user_id = ?) OR (user_id = ? AND connected_user_id = ?))
      AND status = 'accepted';
  `;

  const [result] = await pool.query(query, [
    userId,
    connected_userId,
    connected_userId,
    userId,
  ]);

  return result;
};

/*listconnections
SELECT u.id, u.username
FROM connections c
JOIN users u ON 
(u.id = c.user_id AND c.connected_user_id = 1) OR 
(u.id = c.connected_user_id AND c.user_id = 2)
WHERE c.status = 'accepted'; */

/*receivedConnections
SELECT u.id, u.username
FROM connections c
JOIN users u ON c.user_id = u.id
WHERE c.connected_user_id = 1 AND c.status = 'pending';
*/

/*sentConnections
SELECT u.id, u.username
FROM connections c
JOIN users u ON c.connected_user_id = u.id
WHERE c.user_id = 1 AND c.status = 'pending';
*/

/*sendConnectionRequest
INSERT INTO connections (user_id, connected_user_id, status)
VALUES (1, 2, 'pending');
*/

/*acceptConnectionRequest
UPDATE connections
SET status = 'accepted'
WHERE user_id = 2 AND connected_user_id = 1 AND status = 'pending';
*/

/*rejectConnectionRequest
UPDATE connections
SET status = 'rejected'
WHERE user_id = 2 AND connected_user_id = 1 AND status = 'pending';
*/

/*cancelConnectionRequest
DELETE FROM connections
WHERE user_id = 1 AND connected_user_id = 2 AND status = 'pending';
*/

/*deleteConnection
DELETE FROM connections
WHERE ((user_id = 1 AND connected_user_id = 2) OR (user_id = 2 AND connected_user_id = 1))
  AND status = 'accepted';
*/
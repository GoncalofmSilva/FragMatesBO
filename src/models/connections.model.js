import pool from "../config/db";

export const listConnections = async (connected_userId, userId) => {
    const query = `
        SELECT u.id, u.username
        FROM conexoes c
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
        FROM conexoes c
        JOIN users u ON c.user_id = u.id
        WHERE c.connected_user_id = ? AND c.status = 'pending';
    `;

    const [rows] = await pool.query(query, [connected_userId]);
    return rows;
}

export const sentConnections = async (connected_userId) => {
    const query = `
        SELECT u.id, u.username
        FROM conexoes c
        JOIN users u ON c.connected_user_id = u.id
        WHERE c.user_id = ? AND c.status = 'pending';
    `;

    const [rows] = await pool.query(query, [connected_userId]);
    return rows;
}

export const sendConnectionRequest = async (userId, connected_userId) => {
    const checkQuery = `
    SELECT * FROM conexoes 
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
    INSERT INTO conexoes (user_id, connected_user_id, status)
    VALUES (?, ?, 'pending');
  `;

    const [result] = await pool.query(insertQuery, [userId, connected_userId]);
    return result;
};


export const acceptConnectionRequest = async (userId, connected_userId) => {
    const query = `
        UPDATE conexoes
        SET status = 'accepted'
        WHERE user_id = ? AND connected_user_id = ? AND status = 'pending';
    `;

    const [result] = await pool.query(query, [userId, connected_userId]);
    return result;
}

export const rejectConnectionRequest = async (userId, connected_userId) => {
    const query = `
        UPDATE conexoes
        SET status = 'rejected'
        WHERE user_id = ? AND connected_user_id = ? AND status = 'pending';
    `;

    const [result] = await pool.query(query, [userId, connected_userId]);
    return result;
}

export const cancelConnectionRequest = async (userId, connected_userId) => {
  const query = `
    DELETE FROM conexoes
    WHERE user_id = ? AND connected_user_id = ? AND status = 'pending';
  `;

  const [result] = await pool.query(query, [userId, connected_userId]);
  return result;
};

export const deleteConnection = async (userId, connected_userId) => {
  const query = `
    DELETE FROM conexoes
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
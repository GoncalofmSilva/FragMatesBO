import pool from '../config/db.js'

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

export const register = async ({ email, password, age, name, nationality }) => { // tirar age, name, nationality
    const [result] = await pool.query(
        'INSERT INTO users (email, password, age, name, nationality) VALUES (?, ?, ?, ?, ?)',
        [email, password, age, name, nationality]
    );
    return result.insertId;
};

export const makeTokenExpired = async (email) => {
    const [result] = await pool.query('UPDATE users SET token = NULL WHERE email = ?', [email]);
    return result
};

export const storeToken = async (email, token) => {
    const [result] = await pool.query('UPDATE users SET token = ? WHERE email = ?', [token, email]);
    return result
};
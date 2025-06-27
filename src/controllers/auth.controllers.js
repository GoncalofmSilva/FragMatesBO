import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { register, findUserByEmail, makeTokenExpired, storeToken } from '../models/user.model.js'
import dotenv from 'dotenv'
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

export const registerUser = async (req, res, next) => {
    try {
        const { email, password, age, name, nationality } = req.body;

        // Step 1 - Validate presence
        switch (true) {
            case !name:
                return res.status(400).json({ error: 'Missing name' });
            case !email:
                return res.status(400).json({ error: 'Missing email' });
            case !password:
                return res.status(400).json({ error: 'Missing password' });
            default:
                break;
        }

        // Step 2 - Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Step 3 - Check for existing email (await promise)
        const user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Step 4 - Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Step 5 - Create new user (await promise)
        const userId = await register({ email, password: hashedPassword, age, name, nationality });

        // Step 6 - Generate JWT
        const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        res.status(201).json({ message: 'User created', user: { id: userId, name, email, age, nationality }, token });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Step 1 - Validate presence
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Step 2 - Find user
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Step 3 - Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        
        // Step 4 - Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Step 5 - Store token in DB
        await storeToken(email, token);

        res.status(201).json({ message: 'Login successful', token});
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const { email } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        // Step 1 - Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Step 2 - Check if token matches stored token
        if (user.token !== token) {
            return res.status(401).json({ error: "Token mismatch" });
        }

        // Step 3 - Expire the token by clearing it from DB
        const result = await makeTokenExpired(email);
        if (!result) {
            return res.status(500).json({ error: "Failed to logout" });
        }

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error)

    }
}
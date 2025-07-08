import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Resend } from "resend";
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

        res.status(201).json({ message: 'Login successful', token });
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

export const recoverPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Step 1 - Validate presence
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Step 2 - Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(200).json({ message: "If this email exists, a recovery link has been sent." });
        }

         const resetToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        // Store the reset token and expiry in DB (implement this in your model)
        await storeToken(email, resetToken);

        const resetLink = `${process.env.FRAGMATES_FRONTEND_URL}/reset-password?token=${resetToken}`;

        const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #4a90e2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>If you did not request this, you can ignore this email.</p>
      <small>This link will expire in 1 hour.</small>
    </div>
  `;

        // Step 3 - Send recovery email
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: "FragMates <onboarding@fragmates.com>",
            to: [email],
            subject: "Password Recovery",
            html: htmlContent,
        });

        res.status(200).json({ message: 'If the email exists, a recovery email has been sent.' });

    } catch (error) {
        next(error);
    }
}
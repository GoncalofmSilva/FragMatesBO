import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {findUserByEmail} from "../models/user.model.js"
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

const authorize = async (req, res, next) => {
    try {
        let token

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await findUserByEmail(decoded.email)

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' })
        }

        if (user.token !== token) {
            return res.status(401).json({ message: 'Unauthorized: Token mismatch' });
        }

        req.user = user

        next()
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message })
    }
}

export default authorize
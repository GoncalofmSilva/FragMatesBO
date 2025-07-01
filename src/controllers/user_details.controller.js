//import jwt from "jsonwebtoken"
import { listUsersPerFilter } from '../models/user_details.model.js'
import dotenv from 'dotenv'
dotenv.config();

export const listUsersFilter = async (req, res, next) => {
    try {
        const { rankMin, rankMax, lvlMin, lvlMax, roles } = req.body
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        // Validate required parameters (optional, recommended)
        if (
            rankMin === undefined || rankMax === undefined ||
            lvlMin === undefined || lvlMax === undefined ||
            !Array.isArray(roles) || roles.length === 0
        ) {
            return res.status(400).json({ error: "Invalid or missing filter parameters" });
        }

        //procurar pelo range
        const filter = await listUsersPerFilter({rankMin, rankMax, lvlMin, lvlMax, roles})
        if (!filter) {
            return res.status(401).json({ error: "No users found for the given filters" });
        }

        res.status(200).json({ message: 'Filter applied', filter});
    } catch (error) {
        next(error);
    }
}
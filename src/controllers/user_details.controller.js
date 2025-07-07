//import jwt from "jsonwebtoken"
import { listUsersCS2, listUsersValorant, getUserDetailsById } from '../models/user_details.model.js'
import dotenv from 'dotenv'
dotenv.config();

export const listUsersPerGame = async (req, res, next) => {
    try {
        const { rankMin, rankMax, lvlMin, lvlMax, roles, game } = req.body
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        let filter;
        switch (game) {
            case 'CS2':
                if (!Array.isArray(roles) || roles.length === 0) {
                    filter = await listUsersCS2({ rankMin, rankMax, lvlMin, lvlMax, roles, game })
                    res.status(200).json({ message: 'Filter applied', filter });
                }
                break;
            case 'Valorant':
                if (!Array.isArray(roles) || roles.length === 0) {
                    filter = await listUsersValorant({ rankMin, rankMax, lvlMin, lvlMax, roles, game })
                    res.status(200).json({ message: 'Filter applied', filter });
                }
                break;
            default:
                return res.status(400).json({ error: "Invalid game specified. Only CS2 and Valorant are supported." });
        }
    } catch (error) {
        next(error);
    }
}

export const getSelectedUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const userDetails = await getUserDetailsById(userId);
        if (!userDetails) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(userDetails);
    } catch (error) {
        next(error);
    }
}
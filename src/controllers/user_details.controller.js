//import jwt from "jsonwebtoken"
import { listUsersPerFilter } from '../models/user_details.model.js'
import dotenv from 'dotenv'
dotenv.config();

export const listUsersFilter = async (req, res, next) => {
    try {
        const { rankMin, ranKMax, lvlMin, lvlMax, roleMin, roleMax } = req.body
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        //obter rank maximo e minimo, lvl maximo e minimo e role pretendidos

        //procurar pelo range
        const filter = await listUsersPerFilter(rankMin, ranKMax, lvlMin, lvlMax, roleMin, roleMax)
        if (!filter) {
            return res.status(401).json({ error: "Something went wrong" });
        }

        res.status(201).json({ message: 'Filter applied', filter});
    } catch (error) {
        next(error);
    }
}
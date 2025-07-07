import { Router } from "express";
import { listUsersPerGame} from "../controllers/user_details.controller.js";
import authorize from "../middlewares/auth.middleware.js"

const userDetailsRouter = Router()

userDetailsRouter.get('/users', authorize, listUsersPerGame)

export default userDetailsRouter

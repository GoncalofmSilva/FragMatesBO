import { Router } from "express";
import { listUsersFilter} from "../controllers/user_details.controller.js";
import authorize from "../middlewares/auth.middleware.js"

const userDetailsRouter = Router()

userDetailsRouter.post('/users', authorize, listUsersFilter)

export default userDetailsRouter

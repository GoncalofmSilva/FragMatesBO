import { Router } from "express";
import { listUsersFilter} from "../controllers/user_details.controller.js";
import authorize from "../middlewares/auth.middleware.js"

const userDetailsRouter = Router()

userDetailsRouter.get('/users', authorize, listUsersFilter)

export default userDetailsRouter

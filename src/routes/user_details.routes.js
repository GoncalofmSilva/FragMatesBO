import { Router } from "express";
import { listUsersFilter} from "../controllers/user_details.controller.js";

const userDetailsRouter = Router()

userDetailsRouter.post('/users', listUsersFilter)


export default userDetailsRouter
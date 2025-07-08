import { Router } from "express";
import { registerUser, login, logout, recoverPassword } from "../controllers/auth.controllers.js";
import authorize from "../middlewares/auth.middleware.js"

const authRouter = Router()

authRouter.post('/register', registerUser)

authRouter.post('/login', login)

authRouter.post('/logout', authorize, logout)

authRouter.post('/recover-password', recoverPassword);

export default authRouter

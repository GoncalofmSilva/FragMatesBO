import express from 'express'
import authRouter from './routes/auth.routes.js'
import userDetailsRouter from './routes/user_details.routes.js'
import connectionsRouter from './routes/connections.routes.js'

const app = express()

//middlewares
app.use(express.json()); // To handle JSON requests

//rotas
app.use(authRouter)
app.use(userDetailsRouter)
app.use(connectionsRouter)

app.get('/', (req, res) => {
    res.send('Welcome to FragMates')
})

export default app
import { Router } from "express";
import { listUserConnections, listUserReceivedConnections, listUserSentConnections, sendConnection, acceptConnection, rejectConnection, cancelConnection, removeConnection } from "../controllers/connections.controller.js";
import authorize from "../middlewares/auth.middleware.js"

const connectionsRouter = Router()

// Route to list connections for a user
connectionsRouter.get("/connections/:userId", authorize, listUserConnections);

// Route to list received connection requests
connectionsRouter.get("/connections/received/:userId", authorize, listUserReceivedConnections);

// Route to list sent connection requests
connectionsRouter.get("/connections/sent/:userId", authorize, listUserSentConnections);

// Route to send a connection request
connectionsRouter.post("/connections/:userId", authorize, sendConnection);

// Route to accept a connection request
connectionsRouter.put("/connections/accept/:userId", authorize, acceptConnection);

// Route to reject a connection request
connectionsRouter.put("/connections/reject/:userId", authorize, rejectConnection);

// Route to cancel a connection request
connectionsRouter.delete("/connections/cancel/:userId", authorize, cancelConnection);

// Route to delete a connection
connectionsRouter.delete("/connections/:userId", authorize, removeConnection);

export default connectionsRouter
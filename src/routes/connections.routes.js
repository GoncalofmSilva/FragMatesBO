import { Router } from "express";
import { listUserConnections, listUserReceivedConnections, listUserSentConnections, sendConnection, acceptConnection, rejectConnection, cancelConnection, removeConnection } from "../controllers/connections.controller.js";
import authorize from "../middlewares/auth.middleware.js"

const connectionsRouter = Router()

// Route to list connections for a user
connectionsRouter.get("/:userId/connections", authorize, listUserConnections);

// Route to list received connection requests
connectionsRouter.get("/:userId/connections/received", authorize, listUserReceivedConnections);

// Route to list sent connection requests
connectionsRouter.get("/:userId/connections/sent", authorize, listUserSentConnections);

// Route to send a connection request
connectionsRouter.post("/:userId/connections", authorize, sendConnection);

// Route to accept a connection request
connectionsRouter.put("/:userId/connections/accept", authorize, acceptConnection);

// Route to reject a connection request
connectionsRouter.put("/:userId/connections/reject", authorize, rejectConnection);

// Route to cancel a connection request
connectionsRouter.delete("/:userId/connections/cancel", authorize, cancelConnection);

// Route to delete a connection
connectionsRouter.delete("/:userId/connections", authorize, removeConnection);

export default connectionsRouter
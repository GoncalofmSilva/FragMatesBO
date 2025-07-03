import {listConnections, receivedConnections, sentConnections, sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, cancelConnectionRequest, deleteConnection} from "../models/connections.model.js";
import dotenv from 'dotenv';
dotenv.config();

// List connections for a user
export const listUserConnections = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const connections = await listConnections(userId);
    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

// List received connection requests
export const listUserReceivedConnections = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const connections = await receivedConnections(userId);
    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

// List sent connection requests
export const listUserSentConnections = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const connections = await sentConnections(userId);
    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

// Send a connection request
export const sendConnection = async (req, res, next) => {
  const { userId, connected_userId } = req.body;

  try {
    const result = await sendConnectionRequest(userId, connected_userId);
    res.status(201).json({ message: "Connection request sent", result });
  } catch (error) {
    next(error);
  }
};

// Accept a connection request
export const acceptConnection = async (req, res, next) => {
  const { userId, connected_userId } = req.body;

  try {
    const result = await acceptConnectionRequest(userId, connected_userId);
    res.status(200).json({ message: "Connection request accepted", result });
  } catch (error) {
    next(error);
  }
};

// Reject a connection request
export const rejectConnection = async (req, res, next) => {
  const { userId, connected_userId } = req.body;

  try {
    const result = await rejectConnectionRequest(userId, connected_userId);
    res.status(200).json({ message: "Connection request rejected", result });
  } catch (error) {
    next(error);
  }
};

// Cancel a connection request
export const cancelConnection = async (req, res, next) => {
  const { userId, connected_userId } = req.body;

  try {
    const result = await cancelConnectionRequest(userId, connected_userId);
    res.status(200).json({ message: "Connection request cancelled", result });
  } catch (error) {
    next(error);
  }
}

// Delete a connection
export const removeConnection = async (req, res, next) => {
  const { userId, connected_userId } = req.body;

  try {
    const result = await deleteConnection(userId, connected_userId);
    res.status(200).json({ message: "Connection deleted", result });
  } catch (error) {
    next(error);
  }
};
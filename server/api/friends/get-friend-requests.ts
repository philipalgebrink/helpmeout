import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      return { success: false, error: "Authorization header is missing" };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return { success: false, error: "Token is missing" };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const friendRequestsCollectionName = `friendrequests_${userId}`;
    const db = event.context.db;
    const friendRequests = await db.collection(friendRequestsCollectionName).find().toArray();

    // Separate sent and received requests
    const receivedRequests = friendRequests.filter(req => req.senderId && req.senderNickname);
    const sentRequests = friendRequests.filter(req => req.receiverId && req.receiverNickname);

    return { success: true, receivedRequests, sentRequests };
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    return { success: false, error: "Failed to fetch friend requests" };
  }
});
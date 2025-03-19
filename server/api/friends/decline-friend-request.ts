import jwt from 'jsonwebtoken';

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

    const body = await readBody(event);
    const { senderId } = body;

    if (!senderId) {
      return { success: false, error: "Missing required fields" };
    }

    const db = event.context.db;

    const senderRequestsCollectionName = `friendrequests_${senderId}`;
    const receiverRequestsCollectionName = `friendrequests_${userId}`;

    const senderResult = await db.collection(senderRequestsCollectionName).deleteOne({ receiverId: userId });
    const receiverResult = await db.collection(receiverRequestsCollectionName).deleteOne({ senderId: senderId });

    if (senderResult.deletedCount === 1 && receiverResult.deletedCount === 1) {
      return { success: true, message: "Friend request declined successfully" };
    } else {
      return { success: false, error: "Failed to decline friend request" };
    }
  } catch (err) {
    console.error("Error declining friend request:", err);
    return { success: false, error: "Failed to decline friend request" };
  }
});
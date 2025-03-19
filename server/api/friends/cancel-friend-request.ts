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
    const { receiverNickname } = body;

    if (!receiverNickname) {
      return { success: false, error: "Missing required fields" };
    }

    const db = event.context.db;
    const usersCollection = db.collection('users');
    const receiverUser = await usersCollection.findOne({ nickname: receiverNickname });
    if (!receiverUser) {
      return { success: false, error: "Receiver not found" };
    }

    const receiverId = receiverUser._id.toString();

    const senderRequestsCollectionName = `friendrequests_${userId}`;
    const receiverRequestsCollectionName = `friendrequests_${receiverId}`;

    const senderResult = await db.collection(senderRequestsCollectionName).deleteOne({ receiverId: receiverId });
    const receiverResult = await db.collection(receiverRequestsCollectionName).deleteOne({ senderId: userId });

    if (senderResult.deletedCount === 1 && receiverResult.deletedCount === 1) {
      return { success: true, message: "Friend request canceled successfully" };
    } else {
      return { success: false, error: "Failed to cancel friend request" };
    }
  } catch (err) {
    console.error("Error canceling friend request:", err);
    return { success: false, error: "Failed to cancel friend request" };
  }
});
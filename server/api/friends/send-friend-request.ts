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

    const body = await readBody(event);
    const { friendNickname, userNickname } = body;

    if (!friendNickname || !userNickname) {
      return { success: false, error: "Missing required fields" };
    }

    const db = event.context.db;
    const usersCollection = db.collection('users');

    // Validate the sender's nickname matches the authenticated user
    const senderUser = await usersCollection.findOne({ _id: new ObjectId(userId), nickname: userNickname });
    if (!senderUser) {
      return { success: false, error: "Sender not found or nickname does not match ID" };
    }

    // Fetch the receiver's user ID based on the friendNickname
    const friendUser = await usersCollection.findOne({ nickname: friendNickname });
    if (!friendUser) {
      return { success: false, error: "User not found" };
    }

    const friendUserId = friendUser._id.toString();

    // Check if the users are already friends
    const senderFriendsCollection = `friends_${userId}`;
    const existingFriend = await db.collection(senderFriendsCollection).findOne({ friendNickname });
    if (existingFriend) {
      return { success: false, error: "User is already a friend" };
    }

    // Check if a friend request already exists
    const friendRequestsCollectionName = `friendrequests_${friendUserId}`;
    const senderRequestsCollectionName = `friendrequests_${userId}`;
    const existingRequest = await db.collection(friendRequestsCollectionName).findOne({ senderId: userId });
    if (existingRequest) {
      return { success: false, error: "Friend request already sent" };
    }

    // Insert the friend request into both users' friend requests collections
    const friendRequestData = { senderId: userId, senderNickname: userNickname, receiverNickname: friendNickname };
    const senderRequestData = { receiverId: friendUserId, receiverNickname: friendNickname, senderNickname: userNickname };

    const friendRequestResult = await db.collection(friendRequestsCollectionName).insertOne(friendRequestData);
    const senderRequestResult = await db.collection(senderRequestsCollectionName).insertOne(senderRequestData);

    if (friendRequestResult.insertedId && senderRequestResult.insertedId) {
      return { success: true, message: "Friend request sent successfully" };
    } else {
      return { success: false, error: "Failed to send friend request" };
    }
  } catch (err) {
    console.error("Error sending friend request:", err);
    return { success: false, error: "Failed to send friend request" };
  }
});
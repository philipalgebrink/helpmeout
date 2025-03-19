import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      console.log("Authorization header is missing");
      return { success: false, error: "Authorization header is missing" };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log("Token is missing");
      return { success: false, error: "Token is missing" };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);
    console.log('Authenticated user ID (receiver):', userId.toString());

    const body = await readBody(event);
    const { senderId, senderNickname } = body;
    console.log('Sender ID:', senderId, 'Sender Nickname:', senderNickname);

    if (!senderId || !senderNickname) {
      console.log("Missing required fields");
      return { success: false, error: "Missing required fields" };
    }

    const db = event.context.db;
    const usersCollection = db.collection('users');
    const senderObjectId = new ObjectId(senderId);
    const senderUser = await usersCollection.findOne({ _id: senderObjectId, nickname: senderNickname });
    if (!senderUser) {
      console.log("Sender not found or nickname does not match ID");
      return { success: false, error: "Sender not found or nickname does not match ID" };
    }

    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      console.log("Authenticated user not found");
      return { success: false, error: "Authenticated user not found" };
    }
    const userNickname = user.nickname;
    console.log('Receiver Nickname:', userNickname);

    const friendsCollectionName = `friends_${userId}`;
    const senderFriendsCollectionName = `friends_${senderId}`;

    const friendData = { friendNickname: senderNickname };
    const userData = { friendNickname: userNickname };

    const friendResult = await db.collection(friendsCollectionName).updateOne(
      { friendNickname: senderNickname },
      { $set: friendData },
      { upsert: true }
    );
    console.log("Added sender to receiver's friends list:", friendResult);

    const userResult = await db.collection(senderFriendsCollectionName).updateOne(
      { friendNickname: userNickname },
      { $set: userData },
      { upsert: true }
    );
    console.log("Added receiver to sender's friends list:", userResult);

    if (friendResult.upsertedCount === 1 || friendResult.modifiedCount === 1) {
      if (userResult.upsertedCount === 1 || userResult.modifiedCount === 1) {
        const friendRequestsCollectionName = `friendrequests_${userId}`;
        const senderRequestsCollectionName = `friendrequests_${senderId}`;

        // Delete from receiver's friend requests
        const receiverDeleteResult = await db.collection(friendRequestsCollectionName).deleteOne({ senderId: senderId });
        console.log("Deleted friend request from receiver's collection:", receiverDeleteResult);

        // Delete from sender's friend requests
        const senderDeleteResult = await db.collection(senderRequestsCollectionName).deleteOne({ receiverId: userId.toString() });
        console.log("Deleted friend request from sender's collection:", senderDeleteResult);

        if (receiverDeleteResult.deletedCount === 1 && senderDeleteResult.deletedCount === 1) {
          console.log("Friend request accepted successfully");
          return { success: true, message: "Friend request accepted successfully" };
        } else {
          console.log("Failed to delete friend requests");
          return { success: false, error: "Failed to delete friend requests" };
        }
      } else {
        console.log("Failed to add user to sender's friends list");
        return { success: false, error: "Failed to add user to sender's friends list" };
      }
    } else {
      console.log("Failed to add sender to user's friends list");
      return { success: false, error: "Failed to add sender to user's friends list" };
    }
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return { success: false, error: "Failed to accept friend request" };
  }
});
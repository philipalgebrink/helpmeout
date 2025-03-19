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
    const userId = new ObjectId(decoded.userId);

    const body = await readBody(event);
    const { friendNickname } = body;

    if (!friendNickname) {
      return { success: false, error: "Missing required fields" };
    }

    const db = event.context.db;
    const usersCollection = db.collection('users');

    // Get the authenticated user's nickname
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return { success: false, error: "Authenticated user not found" };
    }
    const userNickname = user.nickname;

    // Get the friend's user ID
    const friendUser = await usersCollection.findOne({ nickname: friendNickname });
    if (!friendUser) {
      return { success: false, error: "Friend not found" };
    }
    const friendUserId = friendUser._id.toString();

    // Add the friend to the user's friends list
    const friendsCollectionName = `friends_${userId}`;
    const friendData = { friendNickname };
    const friendResult = await db.collection(friendsCollectionName).updateOne(
      { friendNickname },
      { $set: friendData },
      { upsert: true }
    );

    // Add the user to the friend's friends list
    const friendFriendsCollectionName = `friends_${friendUserId}`;
    const userData = { friendNickname: userNickname };
    const userResult = await db.collection(friendFriendsCollectionName).updateOne(
      { friendNickname: userNickname },
      { $set: userData },
      { upsert: true }
    );

    if ((friendResult.upsertedCount === 1 || friendResult.modifiedCount === 1) &&
        (userResult.upsertedCount === 1 || userResult.modifiedCount === 1)) {
      return { success: true, message: "Friend added successfully" };
    } else {
      return { success: false, error: "Failed to add friend" };
    }
  } catch (err) {
    console.error("Error adding friend:", err);
    return { success: false, error: "Failed to add friend" };
  }
});
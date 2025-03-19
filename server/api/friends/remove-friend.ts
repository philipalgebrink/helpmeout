import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    // Extract the token from the request headers
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

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);
    console.log('Authenticated user ID:', userId.toString());

    // Read the request body
    const body = await readBody(event);
    const { friendNickname } = body;
    console.log('Friend nickname to remove:', friendNickname);

    if (!friendNickname) {
      console.log("Missing required fields");
      return { success: false, error: "Missing required fields" };
    }

    // Get the database instance
    const db = event.context.db;
    const usersCollection = db.collection('users');

    // Get the authenticated user's nickname
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      console.log("Authenticated user not found");
      return { success: false, error: "Authenticated user not found" };
    }
    const userNickname = user.nickname;
    console.log('Authenticated user nickname:', userNickname);

    // Get the friend's user ID based on the friendNickname
    const friendUser = await usersCollection.findOne({ nickname: friendNickname });
    if (!friendUser) {
      console.log("Friend not found");
      return { success: false, error: "Friend not found" };
    }
    const friendUserId = friendUser._id.toString();
    console.log('Friend user ID:', friendUserId);

    // Construct the collection names
    const userFriendsCollectionName = `friends_${userId}`;
    const friendFriendsCollectionName = `friends_${friendUserId}`;

    // Delete the friend from the user's friends collection
    const userDeleteResult = await db.collection(userFriendsCollectionName).deleteOne({ friendNickname });
    console.log(`Friend deleted from collection ${userFriendsCollectionName}:`, userDeleteResult);

    // Delete the user from the friend's friends collection
    const friendDeleteResult = await db.collection(friendFriendsCollectionName).deleteOne({ friendNickname: userNickname });
    console.log(`User deleted from collection ${friendFriendsCollectionName}:`, friendDeleteResult);

    if (userDeleteResult.deletedCount === 1 && friendDeleteResult.deletedCount === 1) {
      console.log("Friend removed successfully from both users' friends lists");
      return { success: true, message: "Friend removed successfully" };
    } else {
      console.error("Failed to remove friend from both collections");
      return { success: false, error: "Failed to remove friend" };
    }
  } catch (err) {
    console.error("Error removing friend:", err);
    return { success: false, error: "Failed to remove friend" };
  }
});
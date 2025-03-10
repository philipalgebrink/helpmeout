import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    console.log("Handler started");

    // Extract the token from the request headers
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      console.log("Authorization header is missing");
      return { statusCode: 401, error: "Authorization header is missing" };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log("Token is missing");
      return { statusCode: 401, error: "Token is missing" };
    }

    // Verify the token and extract the user ID and nickname
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Read the request body
    const body = await readBody(event);
    const { senderId, senderNickname, userNickname } = body;
    console.log("Request body read, senderId:", senderId, "senderNickname:", senderNickname, "userId:", userId, "userNickname:", userNickname);

    if (!senderId || !senderNickname || !userId || !userNickname) {
      console.log("Missing required fields");
      return { statusCode: 400, error: "Missing required fields" };
    }

    // Construct the collection names
    const friendsCollectionName = `friends_${userId}`;
    const senderFriendsCollectionName = `friends_${senderId}`;
    console.log("Collection names constructed");

    // Insert the friend into the user's friends collection
    const db = event.context.db;
    const friendData = { friendNickname: senderNickname };
    const userData = { friendNickname: userNickname };

    const friendResult = await db.collection(friendsCollectionName).updateOne(
      { friendNickname: senderNickname },
      { $set: friendData },
      { upsert: true }
    );
    console.log("Friend added to user's friends collection");

    const userResult = await db.collection(senderFriendsCollectionName).updateOne(
      { friendNickname: userNickname },
      { $set: userData },
      { upsert: true }
    );
    console.log("User added to sender's friends collection");

    if (friendResult.upsertedCount === 1 || friendResult.modifiedCount === 1) {
      if (userResult.upsertedCount === 1 || userResult.modifiedCount === 1) {
        // Remove the friend request from both users' collections
        const friendRequestsCollectionName = `friendrequests_${userId}`;
        const senderRequestsCollectionName = `friendrequests_${senderId}`;
        await db.collection(friendRequestsCollectionName).deleteOne({ senderId });
        await db.collection(senderRequestsCollectionName).deleteOne({ userId });

        console.log("Friend request accepted successfully");
        return { statusCode: 200, message: "Friend request accepted successfully" };
      } else {
        console.log("Failed to add user to sender's friends list");
        return { statusCode: 500, error: "Failed to add user to sender's friends list" };
      }
    } else {
      console.log("Failed to add sender to user's friends list");
      return { statusCode: 500, error: "Failed to add sender to user's friends list" };
    }
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return { statusCode: 500, error: "Failed to accept friend request" };
  }
});
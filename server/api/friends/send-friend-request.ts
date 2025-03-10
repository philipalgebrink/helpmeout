import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    // Extract the token from the request headers
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, error: "Authorization header is missing" };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return { statusCode: 401, error: "Token is missing" };
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Read the request body
    const body = await readBody(event);
    const { friendNickname, userNickname } = body;

    if (!friendNickname || !userNickname) {
      return { statusCode: 400, error: "Missing required fields" };
    }

    // Fetch the user ID based on the friendNickname
    const db = event.context.db;
    const usersCollection = db.collection('users');
    const friendUser = await usersCollection.findOne({ nickname: friendNickname });

    if (!friendUser) {
      return { statusCode: 404, error: "User not found" };
    }

    const friendUserId = friendUser._id;

    // Construct the collection names
    const friendRequestsCollectionName = `friendrequests_${friendUserId}`;
    const senderRequestsCollectionName = `friendrequests_${userId}`;

    // Insert the friend request into both users' friend requests collections
    const friendRequestData = { senderId: userId, senderNickname: userNickname, receiverNickname: friendNickname };
    const senderRequestData = { receiverId: friendUserId, receiverNickname: friendNickname, senderNickname: userNickname };

    const friendRequestResult = await db.collection(friendRequestsCollectionName).insertOne(friendRequestData);
    const senderRequestResult = await db.collection(senderRequestsCollectionName).insertOne(senderRequestData);

    if (friendRequestResult.insertedCount === 1 && senderRequestResult.insertedCount === 1) {
      return { statusCode: 200, message: "Friend request sent successfully" };
    } else {
      return { statusCode: 500, error: "Failed to send friend request" };
    }
  } catch (err) {
    console.error("Error sending friend request:", err);
    return { statusCode: 500, error: "Failed to send friend request" };
  }
});
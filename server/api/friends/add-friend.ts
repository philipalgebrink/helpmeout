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
    const { friendNickname } = body;

    if (!friendNickname) {
      return { statusCode: 400, error: "Missing required fields" };
    }

    // Construct the collection name
    const friendsCollectionName = `friends_${userId}`;

    // Insert the friend into the user's friends collection
    const db = event.context.db;
    const friendData = { friendNickname };
    const friendResult = await db.collection(friendsCollectionName).updateOne(
      { friendNickname },
      { $set: friendData },
      { upsert: true }
    );

    if (friendResult.upsertedCount === 1 || friendResult.modifiedCount === 1) {
      console.log(`Friend added to collection ${friendsCollectionName}`);
      return { statusCode: 200, message: "Friend added successfully" };
    } else {
      console.error(`Failed to add friend to collection ${friendsCollectionName}`);
      return { statusCode: 500, error: "Failed to add friend" };
    }
  } catch (err) {
    console.error("Error adding friend:", err);
    return { statusCode: 500, error: "Failed to add friend" };
  }
});
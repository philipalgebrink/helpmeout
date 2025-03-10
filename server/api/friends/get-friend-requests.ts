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

    // Construct the collection name
    const friendRequestsCollectionName = `friendrequests_${userId}`;

    // Fetch the friend requests
    const db = event.context.db;
    const friendRequests = await db.collection(friendRequestsCollectionName).find().toArray();

    return { statusCode: 200, friendRequests };
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    return { statusCode: 500, error: "Failed to fetch friend requests" };
  }
});
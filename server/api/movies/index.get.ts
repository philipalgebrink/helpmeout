import { defineEventHandler, getQuery } from 'h3';
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

    // Extract the nickname from the query parameters
    const query = getQuery(event);

    const nickname = query.nickname;
    
    if (!nickname) {
      return { statusCode: 400, error: "Nickname is missing" };
    }

    // Fetch the user by nickname to get the user ID
    const user = await event.context.db.collection('users').findOne({ nickname });
    if (!user) {
      return { statusCode: 404, error: "User not found" };
    }

    // Construct the collection name
    const collectionName = `movies_${user._id}`;

    // Fetch movies from the user's collection
    const movies = await event.context.db.collection(collectionName).find().toArray();

    return { statusCode: 200, result: movies };
  } catch (err) {
    console.error("Failed to fetch movies:", err);
    return { statusCode: 500, error: "Failed to fetch movies" };
  }
});
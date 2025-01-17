import { defineEventHandler } from 'h3';
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
    const collectionName = `movies_${userId}`;
    console.log(`Fetching from collection: ${collectionName}`);

    // Fetch movies from the user's collection
    const movies = await event.context.db.collection(collectionName).find().toArray();

    console.log("Fetched movies from MongoDB:", movies);

    return { statusCode: 200, result: movies }; // Send a structured response
  } catch (err) {
    console.error("Failed to fetch movies:", err);
    return { statusCode: 500, error: "Failed to fetch movies" };
  }
});
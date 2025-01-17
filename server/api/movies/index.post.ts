import { defineEventHandler, readBody } from 'h3';
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

    // Read the request body
    const body = await readBody(event);

    // Insert the body into the collection
    const db = event.context.db;
    const result = await db.collection(collectionName).insertOne(body);

    return { statusCode: 200, message: "Movie added successfully", result };
  } catch (err) {
    console.error("Error adding movie:", err);
    return { statusCode: 500, error: "Failed to add the movie." };
  }
});
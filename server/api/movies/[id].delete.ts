import { defineEventHandler } from 'h3';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const imdbID = event.context.params?.id; // Extract the ID from the request

  if (!imdbID) {
    return { statusCode: 400, error: "Movie ID is required." };
  }

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

    const db = event.context.db;
    const result = await db.collection(collectionName).deleteOne({ imdbID });

    if (result.deletedCount === 1) {
      return { statusCode: 200, message: `Movie with ID ${imdbID} deleted successfully.` };
    } else {
      return { statusCode: 404, error: `Movie with ID ${imdbID} not found.` };
    }
  } catch (err) {
    console.error("Error deleting movie:", err);
    return { statusCode: 500, error: "Failed to delete the movie." };
  }
});
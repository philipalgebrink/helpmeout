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
    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);
    console.log('Authenticated user ID:', userId.toString());

    // Get the listId from query parameters
    const { listId } = getQuery(event);
    if (!listId) {
      console.log("List ID query parameter is missing");
      return { success: false, error: "List ID query parameter is required" };
    }
    console.log('List ID:', listId);

    // Construct the movies collection name
    const moviesCollectionName = `movies_${userId}`;
    console.log('Movies collection:', moviesCollectionName);

    // Fetch movies where the lists array contains the specified listId
    const db = event.context.db;
    const movies = await db.collection(moviesCollectionName)
      .find({ lists: listId })
      .toArray();
    console.log('Movies found:', movies);

    return { success: true, movies };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('JWT token expired');
      return { success: false, error: "jwt expired" };
    }
    console.error('Error fetching movies by list:', err.message);
    console.error('Stack trace:', err.stack);
    return { success: false, error: "Failed to fetch movies" };
  }
});
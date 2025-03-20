import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

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

    // Read the request body
    console.log('Reading request body...');
    const body = await readBody(event);
    const { imdbID, title, year = '', genre = '', director = '', plot = '', poster = '', listId, nickname } = body;
    console.log('Request body:', body);

    if (!imdbID || !title || !listId || !nickname) {
      console.log("Missing required fields");
      return { success: false, error: "Missing required fields" };
    }

    // Get the database instance
    console.log('Accessing database...');
    const db = event.context.db;
    const usersCollection = db.collection('users');

    // Verify the user
    console.log('Verifying user in users collection...');
    const user = await usersCollection.findOne({ _id: userId, nickname });
    if (!user) {
      console.log("User not found or nickname does not match ID");
      return { success: false, error: "User not found or nickname does not match ID" };
    }
    console.log('User verified:', user);

    // Construct the movies collection name
    const moviesCollectionName = `movies_${userId}`;
    console.log('Movies collection:', moviesCollectionName);

    // Prepare the movie document
    const movieData = {
      imdbID,
      title,
      year,
      genre,
      director,
      plot,
      poster,
    };
    console.log('Movie data to save:', movieData);

    // Update or insert the movie into the user's movies collection
    console.log('Updating/inserting movie into movies collection...');
    const movieResult = await db.collection(moviesCollectionName).updateOne(
      { imdbID },
      { $set: movieData, $addToSet: { lists: listId } },
      { upsert: true }
    );
    console.log('Movie update result:', movieResult);

    if (movieResult.upsertedCount === 1 || movieResult.modifiedCount === 1 || movieResult.matchedCount === 1) {
      console.log(`Movie ${imdbID} saved to ${moviesCollectionName} with list ${listId}`);
      return { success: true, message: "Movie added to list successfully" };
    } else {
      console.error(`Failed to save movie ${imdbID} to ${moviesCollectionName}`);
      return { success: false, error: "Failed to save movie to list" };
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('JWT token expired');
      return { success: false, error: "jwt expired" };
    }
    console.error("Error adding movie to list:", err.message);
    console.error("Stack trace:", err.stack);
    return { success: false, error: "Failed to add the movie to the list" };
  }
});
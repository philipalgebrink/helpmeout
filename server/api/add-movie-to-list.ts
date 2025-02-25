import { ObjectId } from 'mongodb';
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
    const { imdbID, title, year, genre, director, plot, poster, listId } = body;

    if (!imdbID || !title || !listId) {
      return { statusCode: 400, error: "Missing required fields" };
    }

    // Construct the collection names
    const moviesCollectionName = `movies_${userId}`;
    const listsCollectionName = `lists_${userId}`;

    // Insert the movie into the user's movies collection
    const db = event.context.db;
    const movieData = { imdbID, title, year, genre, director, plot, poster };
    const movieResult = await db.collection(moviesCollectionName).updateOne(
      { imdbID },
      { $set: movieData, $addToSet: { lists: listId } },
      { upsert: true }
    );

    // Insert the movie into the specified list
    const listResult = await db.collection(listsCollectionName).updateOne(
      { _id: new ObjectId(listId) },
      { $addToSet: { movies: { imdbID, title, year, genre, director, plot, poster } } }
    );

    if (movieResult.upsertedCount === 1 || listResult.modifiedCount === 1) {
      return { statusCode: 200, message: "Movie added to list successfully" };
    } else {
      return { statusCode: 404, error: "List not found" };
    }
  } catch (err) {
    console.error("Error adding movie to list:", err);
    return { statusCode: 500, error: "Failed to add the movie to the list" };
  }
});
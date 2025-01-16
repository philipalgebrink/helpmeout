import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const imdbID = event.context.params?.id; // Extract the ID from the request

  if (!imdbID) {
    return { statusCode: 400, error: "Movie ID is required." };
  }

  try {
    const db = event.context.db;
    const result = await db.collection("my_movies").deleteOne({ imdbID });

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

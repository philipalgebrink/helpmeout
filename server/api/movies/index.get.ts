export default defineEventHandler(async (event) => {
  try {
      const movies = await event.context.db.collection("my_movies").find().toArray();
      console.log("Fetched movies from MongoDB:", movies);
      return { statusCode: 200, result: movies }; // Send a structured response
  } catch (err) {
      console.error("Failed to fetch movies:", err);
      return { statusCode: 500, error: "Failed to fetch movies" };
  }
});

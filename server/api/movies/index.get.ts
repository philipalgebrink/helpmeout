export default defineEventHandler(async (event) => {
    try {
        // Fetch all movies from the 'my_movies' collection
        const movies = await event.context.db.collection("my_movies").find().toArray();

        // Debug log to ensure the data is fetched correctly
        console.log("Fetched movies from MongoDB:", movies);

        return movies; // Return the movies to the frontend
    } catch (err) {
        console.error("Failed to fetch movies:", err);
        return { statusCode: 500, body: { error: "Failed to fetch movies" } }; // Internal Server Error
    }
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    console.log("Event handler for index POST");
    console.log(body);

    const { imdbID, title, year } = body;

    if (!imdbID || !title || !year) {
        // Return an error if required fields are missing
        return { statusCode: 400, body: { error: "Missing required fields (imdbID, title, year)" } };
    }

    try {
        // Check if a movie with the same imdbID already exists in the collection
        const existingMovie = await event.context.db.collection("my_movies").findOne({ imdbID });

        if (existingMovie) {
            console.log("Movie already exists in the database:", existingMovie);
            return { statusCode: 409, body: { error: "Movie already exists in the list" } }; // Conflict
        }

        // Insert the new movie if it doesn't exist
        const result = await event.context.db.collection("my_movies").insertOne(body);
        console.log("Inserted movie result:", result);

        return { statusCode: 201, body: { message: "Movie added successfully", result } }; // Created
    } catch (err) {
        console.error("Failed to add movie:", err);
        return { statusCode: 500, body: { error: "Failed to add movie" } }; // Internal Server Error
    }
});

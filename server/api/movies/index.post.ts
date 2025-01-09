export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("eventh andler for index post");
  console.log(body);

  try {
    const result = await event.context.db.collection("my_movies").insertOne(body);
    console.log("result:", result);
    // res.status(201).json({ message: "Movie added successfully", result });
  } catch (err) {
    console.error("Failed to add movie:", err);
    // res.status(500).json({ error: "Failed to add movie" });
  }
})
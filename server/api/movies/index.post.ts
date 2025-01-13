export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("eventh andler for index post");
  console.log(body);

  try {
    const result = await event.context.db.collection("my_movies").insertOne(body);
    console.log("result:", result);
  } catch (err) {
    console.error("Failed to add movie:", err);
  }
})
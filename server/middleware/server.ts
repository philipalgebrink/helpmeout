import mongodb from "mongodb";

export default defineEventHandler(async (event) => {
  // const bodyParser = require("body-parser");
  // const { MongoClient } = require("mongodb");

  const uri = "mongodb://127.0.0.1:27017"; // Update this if using a remote database
  const client = new mongodb.MongoClient(uri);


  try {
    console.log("connecting to mongodb");
    await client.connect();
    console.log("Connected to MongoDB");
    event.context.db = client.db("helpmeout");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})

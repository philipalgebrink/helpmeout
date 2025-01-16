import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient | null = null;
let db: Db | null = null;

export default defineEventHandler(async (event) => {
  if (!client || !db) {
    const uri = process.env.MONGODB_URI; // Load URI from .env
    const dbName = process.env.MONGODB_DB_NAME; // Load DB name from .env

    if (!uri || !dbName) {
      throw new Error("MongoDB URI or Database name is missing from .env");
    }

    try {
      console.log("Connecting to MongoDB...");
      client = new MongoClient(uri); // Initialize the client once
      await client.connect();
      db = client.db(dbName); // Get the database reference
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  // Add the database reference to the event context
  event.context.db = db;
});

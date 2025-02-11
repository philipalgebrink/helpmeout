import { defineEventHandler, readBody } from 'h3';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}
const client = new MongoClient(uri);

export default defineEventHandler(async (event) => {
  const { listName, listImage, nickname } = await readBody(event);

  try {
    await client.connect();
    const db = client.db(dbName);
    const listsCollection = db.collection('lists');

    await listsCollection.insertOne({
      nickname,
      listName,
      listImage,
      createdAt: new Date(),
    });

    return { statusCode: 200, message: 'List created successfully' };
  } catch (error) {
    console.error('Error creating list:', error);
    return { statusCode: 500, message: 'Internal server error' };
  } finally {
    await client.close();
  }
});

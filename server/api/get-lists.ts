import { defineEventHandler, getQuery } from 'h3';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}
const client = new MongoClient(uri);

export default defineEventHandler(async (event) => {
  const { nickname } = getQuery(event);

  try {
    await client.connect();
    const db = client.db(dbName);
    const listsCollection = db.collection('lists');

    const lists = await listsCollection.find({ nickname }).toArray();

    return { statusCode: 200, lists };
  } catch (error) {
    console.error('Error fetching lists:', error);
    return { statusCode: 500, message: 'Internal server error' };
  } finally {
    await client.close();
  }
});

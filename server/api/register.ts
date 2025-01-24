import { defineEventHandler, readBody } from 'h3';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}
const client = new MongoClient(uri);

export default defineEventHandler(async (event) => {
  const { nickname, email, password } = await readBody(event);

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    
    const nick = await usersCollection.findOne({ nickname });

    if (nick) {
      return { statusCode: 401, message: 'This nickname is already in use!' };
    }

    const user = await usersCollection.findOne({ email });

    if (user) {
      return { statusCode: 401, message: 'This email is already in use!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({ nickname, email, password: hashedPassword });

    return { statusCode: 200, user: { nickname, email, password } };
  } catch (error) {
    console.error('Error during register:', error);
    return { statusCode: 500, message: 'Internal server error' };
  } finally {
    await client.close();
  }
});
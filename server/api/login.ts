import { defineEventHandler, readBody } from 'h3';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
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

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { statusCode: 200, token, user: { email: user.email, nickname: user.nickname } };
  } catch (error) {
    console.error('Error during login:', error);
    return { statusCode: 500, message: 'Internal server error' };
  } finally {
    await client.close();
  }
});
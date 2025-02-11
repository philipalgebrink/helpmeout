import { defineEventHandler, readBody, getQuery } from 'h3';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}
const client = new MongoClient(uri);

export default defineEventHandler(async (event) => {
  if (event.req.method === 'POST') {
    const { profilePictureUrl, nickname } = await readBody(event);

    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');

      await usersCollection.updateOne(
        { nickname },
        { $set: { profilePictureUrl } }
      );

      return { statusCode: 200, message: 'Profile picture updated successfully' };
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return { statusCode: 500, message: 'Internal server error' };
    } finally {
      await client.close();
    }
  } else if (event.req.method === 'GET') {
    const { nickname } = getQuery(event);

    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ nickname });
      if (user) {
        return { statusCode: 200, profilePictureUrl: user.profilePictureUrl };
      } else {
        return { statusCode: 404, message: 'User not found' };
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return { statusCode: 500, message: 'Internal server error' };
    } finally {
      await client.close();
    }
  } else {
    return { statusCode: 405, message: 'Method not allowed' };
  }
});

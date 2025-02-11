import { defineEventHandler, readBody } from 'h3';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}
const client = new MongoClient(uri);

export default defineEventHandler(async (event) => {
  const { listId, listName, listImage } = await readBody(event);

  try {
    await client.connect();
    const db = client.db(dbName);
    const listsCollection = db.collection('lists');

    const updateData: any = {};
    if (listName) updateData.listName = listName;
    if (listImage) updateData.listImage = listImage;

    await listsCollection.updateOne(
      { _id: new ObjectId(listId) },
      { $set: updateData }
    );

    return { statusCode: 200, message: 'List updated successfully' };
  } catch (error) {
    console.error('Error updating list:', error);
    return { statusCode: 500, message: 'Internal server error' };
  } finally {
    await client.close();
  }
});

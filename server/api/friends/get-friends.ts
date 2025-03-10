import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    // Extract the token from the request headers
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, error: 'Authorization header is missing' };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return { statusCode: 401, error: 'Token is missing' };
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get the nickname from the query parameters
    const { nickname } = getQuery(event);

    // Fetch the user ID based on the nickname
    const db = event.context.db;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ nickname });

    if (!user) {
      return { statusCode: 404, error: 'User not found' };
    }

    const friendsCollectionName = `friends_${userId}`;

    // Fetch the friends list
    const friends = await db.collection(friendsCollectionName).find().toArray();

    // Check if the profile owner is a friend
    const isFriend = friends.some(friend => friend.friendNickname === nickname);

    return { statusCode: 200, friends, isFriend };
  } catch (err) {
    console.error('Error fetching friends:', err);
    return { statusCode: 500, error: 'Failed to fetch friends' };
  }
});
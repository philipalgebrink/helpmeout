import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      console.log("Authorization header is missing");
      return { success: false, error: 'Authorization header is missing' };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log("Token is missing");
      return { success: false, error: 'Token is missing' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authenticatedUserId = decoded.userId;
    console.log('Authenticated user ID:', authenticatedUserId);

    const { nickname } = getQuery(event);
    if (!nickname) {
      console.log("Nickname query parameter is missing");
      return { success: false, error: 'Nickname query parameter is required' };
    }
    console.log('Profile nickname:', nickname);

    const db = event.context.db;
    const usersCollection = db.collection('users');
    const profileUser = await usersCollection.findOne({ nickname });
    if (!profileUser) {
      console.log(`User with nickname ${nickname} not found`);
      return { success: false, error: 'User not found' };
    }

    const profileUserId = profileUser._id.toString();
    console.log('Profile user ID:', profileUserId);

    const friendsCollectionName = `friends_${profileUserId}`;
    const friends = await db.collection(friendsCollectionName).find().toArray();
    console.log('Profile user friends:', friends);

    const friendsWithProfilePictures = await Promise.all(
      friends.map(async (friend) => {
        const friendUser = await usersCollection.findOne({ nickname: friend.friendNickname });
        return {
          friendNickname: friend.friendNickname,
          profilePictureUrl: friendUser?.profilePictureUrl || null,
        };
      })
    );

    const authenticatedUserFriendsCollectionName = `friends_${authenticatedUserId}`;
    const authenticatedUserFriends = await db.collection(authenticatedUserFriendsCollectionName).find().toArray();
    console.log('Authenticated user friends:', authenticatedUserFriends);

    const isFriend = authenticatedUserFriends.some(friend => 
      friend.friendNickname.toLowerCase() === nickname.toLowerCase()
    );
    console.log('isFriend:', isFriend);

    return { success: true, friends: friendsWithProfilePictures, isFriend };
  } catch (err) {
    console.error('Error fetching friends:', err);
    return { success: false, error: 'Failed to fetch friends' };
  }
});
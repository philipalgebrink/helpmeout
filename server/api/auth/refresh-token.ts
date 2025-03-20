import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      console.log("Authorization header is missing");
      return { success: false, error: "Authorization header is missing" };
    }

    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) {
      console.log("Refresh token is missing");
      return { success: false, error: "Refresh token is missing" };
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = new ObjectId(decoded.userId);
    console.log('Refresh token verified, user ID:', userId.toString());

    // Verify the user exists
    const db = event.context.db;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      console.log("User not found");
      return { success: false, error: "User not found" };
    }

    // Generate a new access token
    const newToken = jwt.sign(
      { userId: userId.toString(), nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Short-lived access token
    );
    console.log('New access token generated:', newToken);

    return { success: true, token: newToken };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Refresh token expired');
      return { success: false, error: "refresh token expired" };
    }
    console.error("Error refreshing token:", err.message);
    console.error("Stack trace:", err.stack);
    return { success: false, error: "Failed to refresh token" };
  }
});
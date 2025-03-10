import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    // Extract the refresh token from the request headers
    const authHeader = event.req.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, error: "Authorization header is missing" };
    }

    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) {
      return { statusCode: 401, error: "Refresh token is missing" };
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    // Issue a new token
    const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { statusCode: 200, token: newToken };
  } catch (err) {
    console.error("Error refreshing token:", err);
    return { statusCode: 500, error: "Failed to refresh token" };
  }
});
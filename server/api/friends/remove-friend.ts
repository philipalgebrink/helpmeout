import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    try {
        // Extract the token from the request headers
        const authHeader = event.req.headers.authorization;
        if (!authHeader) {
            return { statusCode: 401, error: "Authorization header is missing" };
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return { statusCode: 401, error: "Token is missing" };
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Read the request body
        const body = await readBody(event);
        const { friendNickname } = body;

        if (!friendNickname) {
            return { statusCode: 400, error: "Missing required fields" };
        }

        // Construct the collection name
        const friendsCollectionName = `friends_${userId}`;

        // Delete the friend from the user's friends collection
        const db = event.context.db;
        const friendResult = await db.collection(friendsCollectionName).deleteOne({ friendNickname });

        if (friendResult.deletedCount === 1) {
            console.log(`Friend deleted from collection ${friendsCollectionName}`);
            return { statusCode: 200, message: "Friend deleted successfully" };
        } else {
            console.error(`Failed to delete friend from collection ${friendsCollectionName}`);
            return { statusCode: 500, error: "Failed to delete friend" };
        }
    } catch (err) {
        console.error("Error deleting friend:", err);
        return { statusCode: 500, error: "Failed to delete friend" };
    }
});

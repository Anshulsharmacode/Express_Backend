import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utills/ApiError.js";
import async_handler from "../utills/async_handler.js";

const verifyToken = async_handler(async (req, res, next) => {
    // Get token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log(token)
    if (!token) {
        return next(new ApiError(401, "Access token is missing"));
    }

    try {
        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch user from database
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return next(new ApiError(401, "User not found"));
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return next(new ApiError(401, "Invalid or expired token"));
    }
});

export default verifyToken;

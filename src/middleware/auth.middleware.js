import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utills/ApiError.js";
import async_handler from "../utills/async_handler.js";

const verifyToken = async_handler(async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Invalid token");
        }

        console.log("Token: ", token);

        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("Decoded Token: ", decodedToken);

        // Fetch user from database
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        console.log("User: ", user);

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }
});

export default verifyToken;

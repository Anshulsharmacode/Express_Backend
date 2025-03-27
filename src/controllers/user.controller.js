import asyncHandler from "../utils/async_handler.js";  // Ensure correct filename and import

const registerUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        message: "User registered successfully",
    });
});

export default registerUser;

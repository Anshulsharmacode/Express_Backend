import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAccount, 
    avatarUpdate, 
    coverImageUpdate, 
    getUserChannelProfile, 
    getWatchHistory ,
    refreshAccessToken
} from "../controllers/user.controller.js"; // Import missing functions
import { upload } from "../middleware/multer.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";
// import refreshAccessToken from "../controllers/refreshToken.controller.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxcount: 1,
        },
        {
            name: "coverImage",
            maxcount: 1,
        },
    ]),
    registerUser
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyToken, logoutUser);

userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.route("/change-password").post(verifyToken, changeCurrentPassword);

userRouter.route("/current-user").get(verifyToken, getCurrentUser);
userRouter.route("/update-account").patch(verifyToken, updateUserAccount);

userRouter.route("/avatar").patch(verifyToken, upload.single("avatar"), avatarUpdate);
userRouter.route("/cover-image").patch(verifyToken, upload.single("coverImage"), coverImageUpdate);

userRouter.route("/c/:userName").get(verifyToken, getUserChannelProfile);
userRouter.route("/history").get(verifyToken, getWatchHistory);

export default userRouter;


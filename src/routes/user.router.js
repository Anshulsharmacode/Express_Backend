import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";
import RefreshAccessToken from "../controllers/refreshToken.controller.js";

const userRouter = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */
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

userRouter.route("/logout").post(verifyToken ,logoutUser);

userRouter.route("/refresh-token").post(RefreshAccessToken);

userRouter.route("/change-passworfd").post(verifyToken, changeCurrentPassword);

userRouter.route("/current-user").get(verifyToken, getCurrentUser)
userRouter.route("/update-account").patch(verifyToken, updateUserAccount)

userRouter.route("/avatar").patch(verifyToken, upload.single("avatar"), avatarUpdate)
userRouter.route("/cover-image").patch(verifyToken, upload.single("coverImage"), coverImageUpdate)

userRouter.route("/c/:username").get(verifyToken, getUserChannelProfile)
userRouter.route("/history").get(verifyToken, getWatchHistory)

  
export default userRouter;


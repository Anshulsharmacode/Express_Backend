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

userRouter.route("/refresh-token").post(RefreshAccessToken)
  
export default userRouter;


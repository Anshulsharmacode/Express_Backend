import ApiError from "../utills/ApiError.js";
import User from "../models/user.model.js"
import async_handler from "../utills/async_handler.js";
import uploadFileCloudinary from "../utills/Cloudanary.js";
import ApiResponse from "../utills/ApiResponse.js";
import jwt from "jsonwebtoken"
// import generateAccessAndRefereshTokens from "../controllers/Access.js"



const registerUser = async_handler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: userName, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, userName, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or userName already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    generateAccessAndRefereshTokens
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadFileCloudinary(avatarLocalPath)
    const coverImage = await uploadFileCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};

const loginUser = async_handler(async (req, res, next) => {
    const { email, password, userName } = req.body;

    if (!email && !userName) {
        throw new ApiError(400, "Email or userName is required");
    }
    console.log("email: ", email);


    const user = await User.findOne({
        $or: [{ email }, { userName }]
    });

    console.log(email)

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const ispasswordValid = await user.ispasswordCorrect(password);
    if (!ispasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // ✅ Corrected function call (using the standalone function)
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = async_handler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const RefreshAccessToken = async_handler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(400, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"));
});

const changeCurrentPassword = async_handler(async(req,res)=>{
    const {currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const ispasswordValid = await user.ispasswordCorrect(currentPassword);
    if (!ispasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})

const getCurrentUser = async_handler(async (req,res)=>{
    return res
    .status(200)
    .json("200", res.user ,"current user is here ")
})

const updateUserAccount = async_handler(async(req,res)=>{
    const {email,fullName}= req.body

    if (!(email || fullName)) {
        return ApiError (400,"email or id req")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email 
            }.select("-password")
        },
        {new: true}

    )
    return res
    .status(200)
    .json(
        new ApiResponse(200 , user,"update account ")
    )


})

const avatarUpdata = async_handler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw ApiError(400,"avatar image is not found")
    }

    const newupload = await uploadFileCloudinary(avatarLocalPath)

    if (!newupload.url){
        throw ApiError (400 ,"image is not upload")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                newupload : newupload.url
            }
        },
        {new: true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const coverImageUpdate = async_handler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw ApiError(400,"avatar image is not found")
    }

    const newupload = await uploadFileCloudinary(coverImageLocalPath)

    if (!newupload.url){
        throw ApiError (400 ,"image is not upload")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                newupload : newupload.url
            }
        },
        {new: true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "cover image updated successfully")
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    RefreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAccount ,
    avatarUpdata,
    coverImageUpdate
};

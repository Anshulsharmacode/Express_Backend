import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    avatar: {
        type: String,
        default: "https://www.gravatar.com/avatar/000?d=mp",
    },
    coverImage: {
        type: String,
        default: "",
    },
    WatchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    password: { 
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
        default: "",
    },
}, { timestamps: true });

//pre hook to hash password before saving data to database

userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.ispasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15h" } // Access token expires in 15 minutes

        
    );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // Refresh token expires in 7 days
    );
};

const User= mongoose.model("User",userSchema);

export default User;
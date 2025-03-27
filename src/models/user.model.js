import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import { JsonWebTokenError } from "jsonwebtoken";
const userSchema = new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    avatar:{
        type:String,
        default:"https://www.gravatar.com/avatar/000?d=mp"
    },
    coverImage:{
        type:String,
        default:""
    },
    WatchHistory:{
        type:Schema.Types.ObjectId,
        ref:'Video'
    },
    password:{
        type:String,
        required:true,
        trim:true,
        
    },
    refreshToken:{
        type:String,
        default:""
    }



},{timestamps:true});

//pre hook to hash password before saving data to database

userSchema.pre("save",async function(next){
    if (!this.isModified("Password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.method.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.genrateAcessToken = function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,   
        fullname:this.fullname,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRATION})
}

userSchema.genrateAcessToken = function(){
    return jwt.sign({
        _id:this._id,
       
    },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRATION})
}


export default use =moonngoose.model("User",userSchema)

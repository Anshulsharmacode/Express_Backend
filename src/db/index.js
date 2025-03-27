import mongoose from "mongoose";


const connectDB = async () => {
    try {
       const connection_db= await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_name}`);

        console.log(`MongoDB Connected: ${connection_db.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;
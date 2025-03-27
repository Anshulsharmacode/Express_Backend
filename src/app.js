import cookieParser from "cookie-parser";
import express from "express";  
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,  // Fixed typo
    credentials: true
}));

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));    
app.use(express.static("public"));  
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.router.js";   

app.use("/api/v1/users", userRouter);

export default app;

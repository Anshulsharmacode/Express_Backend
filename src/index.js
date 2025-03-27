import express from "express";  // Import Express
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"    
});

const app = express();  // Initialize Express App

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.error(error);
        console.log("Server is not running");
    });

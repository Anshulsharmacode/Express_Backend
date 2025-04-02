import cookieParser from "cookie-parser";
import express from "express";  
import cors from "cors";
import ApiError from "./utills/ApiError.js"; // Import ApiError
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,  // Fixed typo
    credentials: true
}));

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));  
app.use(cookieParser());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API documentation for the backend application",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8000}`,
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
import userRouter from "./routes/user.router.js";   

app.use("/users", userRouter);

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err); // Log unexpected errors
    return res.status(500).json({ message: "Internal Server Error" });
});

export default app;

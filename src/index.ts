import {server} from "./config/index.ts";
import routes from "./routes/index.ts";
import {initDatabase} from "./db/config.ts";
import {standardLimiter} from "./middleware/rate-limit.ts";
import {requestLogger} from "./middleware/request-logger.ts";
import {errorHandler, notFoundHandler} from "./utils/error-handler.ts";
import {logger} from "./utils/logger.ts";
import {toNodeHandler} from "better-auth/node";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import {auth} from "./utils/auth.ts";
import pkg from 'express';

const {Application} = pkg;

// Config is already loaded in @/config
// Express application
const app: Application = express();
const port = server.port;

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: ["http://localhost:3000"], // Replace with your frontend's origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

// Register better-auth route BEFORE body parsers and helmet
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(requestLogger);

// Apply rate limiting to all requests
app.use(standardLimiter);

// API routes
app.use("/api/v1", routes);

// Health check for load balancer
app.get("/health", (req, res) => {
    res.status(200).json({status: "ok"});
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start the server
const startServer = async () => {
    try {
        // Initialize database connection
        await initDatabase();

        // Start listening for requests
        app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
};

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", {promise, reason});
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
});

// Start the server
startServer();

export default app;

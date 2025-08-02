import {serverConfig} from "./config/index.js";
import routes from "./routes/index.js";
import {initDatabase} from "./db/config.js";
import {standardLimiter} from "./middleware/rate-limit.js";
import {requestLogger} from "./middleware/request-logger.js";
import {errorHandler, notFoundHandler} from "./utils/error-handler.js";
import {logger} from "./utils/logger.js";
import {toNodeHandler} from "better-auth/node";
import cors from "cors";
import express from "express";
import swaggerUi from 'swagger-ui-express';
import helmet from "helmet";
import {auth} from "./utils/auth.js";
import {readFileSync} from 'node:fs';

let swaggerApiDocument,swaggerAuthApiDocument


// Express application
export const app = express();
const port = serverConfig.port;
const host = serverConfig.host;

if (serverConfig.env === 'development') {
    //Api Docs
    try {
        swaggerApiDocument = JSON.parse(readFileSync('./api-swagger.json', 'utf8'));
        if (swaggerApiDocument) {
            // app.use('/api-docs-one', swaggerUi.serveFiles(swaggerDocumentOne, options), swaggerUi.setup(swaggerDocumentOne));

            app.use('/api-docs', swaggerUi.serveFiles(swaggerApiDocument), swaggerUi.setup(swaggerApiDocument));

            // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerApiDocument));
            console.log('api-swagger ui route loaded successfully!');
        }
    } catch (err) {
        console.error(`Error reading JSON file: ${err}`);
    }

    //better-auth-api-docs
    try {
        swaggerAuthApiDocument = JSON.parse(readFileSync('./better-auth-api-swagger.json', 'utf8'));
        if (swaggerAuthApiDocument) {
            app.use('/auth-api-docs', swaggerUi.serveFiles(swaggerAuthApiDocument), swaggerUi.setup(swaggerAuthApiDocument));
            console.log('better-auth-api-swagger ui route loaded successfully!');
        }
    } catch (err) {
        console.error(`Error reading JSON file: ${err}`);
    }
}


// Middleware
// app.use(helmet());
// app.use(
//     cors({
//         origin: ["http://localhost:3000"], // Replace with your frontend's origin
//         methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
//         credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//     })
// );

// Register better-auth route BEFORE body parsers and helmet
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(requestLogger);

// Apply rate limiting to all requests
app.use(standardLimiter);

// API routes
app.use("/api/v1", routes);
app.get("/api/boom", function (req, res, next) {
    try {
        throw new Error("Oops! matters are chaotic💥", 400);
    } catch (error) {
        next(error);
    }
});

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
        app.listen(port,host,() => {
            logger.info(`Server running on http://${host}:${port}`);
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

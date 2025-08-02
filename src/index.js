import {serverConfig} from "./config/index.js";
import 'dotenv/config';
import * as process from "node:process";
import routes from "./routes/index.js";
import {initDatabase} from "./db/dbSetup.js";
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


let swaggerApiDocument, swaggerAuthApiDocument
const authHandler = toNodeHandler(auth);

// Express application
export const app = express();

//Swagger
if (process.env.NODE_ENV === 'development') {
    //Api Docs
    try {
        swaggerApiDocument = JSON.parse(readFileSync('./api-swagger.json', 'utf8'));
        if (swaggerApiDocument) {
            // app.use('/api-docs-one', swaggerUi.serveFiles(swaggerDocumentOne, options), swaggerUi.setup(swaggerDocumentOne));

            app.use('/api-docs', swaggerUi.serveFiles(swaggerApiDocument), swaggerUi.setup(swaggerApiDocument));

            // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerApiDocument));
             logger.info('api-swagger ui route loaded successfully!');
        }
    } catch (err) {
        console.error(`Error reading JSON file: ${err}`);
    }

    //better-auth-api-docs
    try {
        swaggerAuthApiDocument = JSON.parse(readFileSync('./better-auth-api-swagger.json', 'utf8'));
        if (swaggerAuthApiDocument) {
            app.use('/auth-api-docs', swaggerUi.serveFiles(swaggerAuthApiDocument), swaggerUi.setup(swaggerAuthApiDocument));
             logger.info('better-auth-api-swagger ui route loaded successfully!');
        }
    } catch (err) {
        console.error(`Error reading JSON file: ${err}`);
    }

    //Test better-auth
     logger.info('🔧 Testing BetterAuth configuration...');
    try {
        await auth.api.getSession({
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        });
         logger.info('✅ BetterAuth configuration is valid');
    } catch (error) {
        console.error('❌ BetterAuth configuration error:', error);
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


app.use(express.urlencoded({extended: true}));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

//Logging
// app.use(requestLogger);

// Apply rate limiting to all requests
app.use(standardLimiter);


// BetterAuth handler with additional debugging
app.all('/api/auth/*splat', (req, res) => {
     logger.info(`🔐 BetterAuth handling: ${req.method} ${req.url}`);
     logger.info('🔐 Request body:', req.body);

    authHandler(req, res).catch(err => {
        console.error('BetterAuth handler error:', err);
        res.status(500).json({ error: 'Internal auth error' });
    });
});

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

// API routes
app.use("/api/v1", routes);

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
        app.listen(serverConfig.port, serverConfig.host, () => {
         logger.info(`🚀 Server running on http://${serverConfig.host}:${serverConfig.port}`);
         logger.info(`📚 API Documentation: http://localhost:${serverConfig.port}/api/health`);
         logger.info(`🔐 Auth endpoints: http://localhost:${serverConfig.port}/api/auth/*`);
         logger.info(`🔧 Environment: ${serverConfig.env}`);
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

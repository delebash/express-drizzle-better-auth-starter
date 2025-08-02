import 'dotenv/config';
import Joi from "joi";
import * as process from "node:process";

// Define the schema for environment variables
const configSchema = Joi.object({
    // Server
    NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: Joi.number().default(3000),
    HOST: Joi.string().default("localhost"),

    // Database
    DATABASE_URL: Joi.string().default("file:./database/local.db"),
    APP_NAME: Joi.string().default("My App"),
    EMAIL_SMTP_SERVE:Joi.string().default(""),
    EMAIL_SMTP_PORT:Joi.number().default(465),
    AUTH_EMAIL_USERNAME:Joi.string().default(""),
    AUTH_EMAIL_PASSWORD:Joi.string().default(""),
    EMAIL_FROM:Joi.string().default(""),
    RESEND_API_KEY:Joi.string().default(""),

    // JWT
    JWT_SECRET: Joi.string().when("NODE_ENV", {
        is: "production",
        otherwise: Joi.string().default("dev-secret"),
    }),
    JWT_EXPIRES_IN: Joi.string().default("1d"),

    // Logging
    LOG_LEVEL: Joi.string()
        .valid("error", "warn", "info", "http", "debug")
        .default("info"),

});

// Map environment variables to config object
const mapEnvToConfig = (env) => ({
    serverConfig: {
        env: process.env.NODE_ENV || "localhost",
        host: process.env.HOST || "development",
        port: parseInt(process.env.PORT || "3000", 10),
        appName: process.env.APP_NAME || "My App",
        emailSmptServer: process.env.EMAIL_SMTP_SERVE || "",
        emailSmtpPort: process.env.EMAIL_SMTP_PORT || "",
        emailAuthUsreName: process.env.AUTH_EMAIL_USERNAME || "",
        emailAuthPassword: process.env.AUTH_EMAIL_PASSWORD || "",
        emailFrom: process.env.EMAIL_FROM || "",
        emailResendApiKey: process.env.RESEND_API_KEY || "",
    },
    database: {
        url: process.env.DATABASE_URL || "file:./database/local.db",
        ssl: process.env.NODE_ENV === "production" ? {rejectUnauthorized: false} : false,
    },
    jwt: {
        secret: process.env.JWT_SECRET || "4d2dd6d298e7cc36cfc0056d9448a6322a90c790a93482467694f1f88e574ec874c7d8fc1017b210e5b62cf37dfcd36960980c4d0b8619fda7abd1106aa5a4eg",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    logging: {
        level: process.env.LOG_LEVEL || "info",
    },
});

// Build and validate config
const buildConfig = () => {
    // Validate environment variables against schema
    const {error, value: validatedEnv} = configSchema.validate(process.env, {
        allowUnknown: true, // Allow unknown env vars
        stripUnknown: true, // Remove unknown env vars
        abortEarly: false, // Report all validation errors
    });

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    // Map validated environment variables to config
    return mapEnvToConfig(validatedEnv);
};

// Export the config
export const config = buildConfig();

// Export individual configs for convenience
export const {serverConfig, database, jwt, logging} = config;

// Export the schema and functions for testing
export {buildConfig, configSchema, mapEnvToConfig};

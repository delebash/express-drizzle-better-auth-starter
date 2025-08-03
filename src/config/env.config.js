import 'dotenv/config';
import Joi from "joi";


// Define the schema for environment variables
const configSchema = Joi.object({
    // Server
    NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: Joi.number().default(3000),
    HOST: Joi.string().default("localhost"),
    APP_NAME: Joi.string().default("My App"),

    // Database
    DATABASE_URL: Joi.string().default('file:./database/local.db'),

    //Email
    EMAIL_SMTP_SERVER: Joi.string().default("your-smtp.server.com"),
    EMAIL_SMTP_PORT: Joi.number().default(587),
    AUTH_EMAIL_USERNAME: Joi.string().default("your-email"),
    AUTH_EMAIL_PASSWORD: Joi.string().default("your-password"),
    EMAIL_FROM: Joi.string().default("your-email@youremail.com"),
    RESEND_API_KEY: Joi.string().default("your-resend-api-key"),

    //Better-Auth framework
    BETTER_AUTH_URL: Joi.string().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: Joi.string().default("fallback-secret"),

    // Logging
    LOG_LEVEL: Joi.string()
        .valid("error", "warn", "info", "http", "debug")
        .default("info"),
});

// Map environment variables to config object
const mapEnvToConfig = (validatedEnv) => ({
    server: {
        nodeEnv: validatedEnv.NODE_ENV,
        port: parseInt(validatedEnv.PORT, 10),
        appName: validatedEnv.APP_NAME,
        host: validatedEnv.HOST,
    },
    email: {
        smptServer: validatedEnv.EMAIL_SMTP_SERVER,
        smptPort: validatedEnv.EMAIL_SMTP_PORT,
        authUserName: validatedEnv.AUTH_EMAIL_USERNAME,
        authPassword: validatedEnv.AUTH_EMAIL_PASSWORD,
        from: validatedEnv.EMAIL_FROM,
        resendApiKey: validatedEnv.RESEND_API_KEY,
    },
    database: {
        url: validatedEnv.DATABASE_URL,
    },
    betterAuth: {
        url: validatedEnv.BETTER_AUTH_URL,
        secret: validatedEnv.BETTER_AUTH_SECRET,
    },
    logging: {
        level: validatedEnv.LOG_LEVEL,
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
export const envConfig = buildConfig();

// Export individual configs for convenience
export const {server, database, logging, betterAuth, email} = envConfig;
// Export the schema and functions for testing
export {buildConfig, configSchema, mapEnvToConfig};

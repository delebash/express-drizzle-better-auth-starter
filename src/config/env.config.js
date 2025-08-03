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
    SMTP_SERVER: Joi.string().default("your-smtp.server.com"),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USERNAME: Joi.string().default("your-email"),
    SMTP_PASSWORD: Joi.string().default("your-password"),
    EMAIL_FROM: Joi.string().default("your-email@youremail.com"),
    SMTP_API_KEY: Joi.string().default("your-smtp-api-key"), // Example a resend api key for dev testing resend.com

    //Better-Auth framework
    BETTER_AUTH_URL: Joi.string().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: Joi.string().required(),
    BETTER_AUTH_BASEPATH: Joi.string().default("/api/auth"),
    //Swagger
    SWAGGER_BETTER_AUTH_API_JSON_PATH: Joi.string().default("./swagger-better-auth-api.json"),
    SWAGGER_API_JSON_PATH: Joi.string().default("./swagger-api.json"),


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
        swaggerApiJsonPath: validatedEnv.SWAGGER_API_JSON_PATH,
        swaggerBetterAuthApiJsonPath: validatedEnv.SWAGGER_BETTER_AUTH_API_JSON_PATH,
    },
    email: {
        smptServer: validatedEnv.SMTP_SERVER,
        smptPort: validatedEnv.SMTP_PORT,
        smtpUserName: validatedEnv.SMTP_USERNAME,
        smtpPassword: validatedEnv.SMTP_PASSWORD,
        from: validatedEnv.EMAIL_FROM,
        smtpApiKey: validatedEnv.SMTP_API_KEY,
    },
    database: {
        url: validatedEnv.DATABASE_URL,
    },
    betterAuth: {
        url: validatedEnv.BETTER_AUTH_URL,
        secret: validatedEnv.BETTER_AUTH_SECRET,
        basePath: validatedEnv.BETTER_AUTH_BASEPATH,
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

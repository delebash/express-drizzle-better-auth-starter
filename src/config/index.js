import 'dotenv/config';

export const serverConfig = {
    env: process.env.NODE_ENV || "development",
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT || "3000", 10),
    appName: process.env.APP_NAME || "My App",
    email: {
        smptServer: process.env.EMAIL_SMTP_SERVER || "",
        smptPort: process.env.EMAIL_SMTP_PORT || "",
        authUserName: process.env.AUTH_EMAIL_USERNAME || "",
        authPassword: process.env.AUTH_EMAIL_PASSWORD || "",
        from: process.env.EMAIL_FROM || "",
        resendApiKey: process.env.RESEND_API_KEY || "",
    },
    database: {
        url: process.env.DATABASE_URL || "file:./database/local.db"
    },
    jwt: {
        secret: process.env.JWT_SECRET || "your-jwt-secret-key",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    logging: {
        level: process.env.LOG_LEVEL || "info"``
    },
    betterAuth: {
        secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret',
        url: process.env.BETTER_AUTH_URL || process.env.HOST + ":" + process.env.PORT,
    },
}




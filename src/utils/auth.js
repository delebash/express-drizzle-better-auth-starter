import {db} from "../db/dbSetup.js";
import * as schema from "../db/schema/schema.js";
import {betterAuth, logger} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {admin, organization, openAPI, multiSession} from "better-auth/plugins";
// import {createAuthMiddleware} from "better-auth/api";
import sendEmail from "../email/sendEmail.js";
import {writeFileSync} from 'node:fs';
import {envConfig} from "../config/env.config.js";


// @ts-ignore
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: schema,
        usePlural: true,
    }),
    plugins: [
        admin({defaultRole: "user", adminRoles: ["admin"]}),
        organization(),
        openAPI({disableDefaultReference: true}),
        multiSession()
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
        storeSessionInDatabase: true, // Store session in database when secondary storage is provided (default: `false`)
        preserveSessionInDatabase: false, // Preserve session records in database when deleted from secondary storage (default: `false`)
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        }
    },
    secret: envConfig.betterAuth.secret,
    baseURL: envConfig.betterAuth.url,
    basePath: envConfig.betterAuth.basePath,
    trustedOrigins: ["http://localhost:3000"],
    rateLimit: {
        window: 10, // time in seconds,
        max: 100,
    },
    advanced: {
        defaultCookieAttributes: {
            secure: true,
            sameSite: "none",
        },
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
        sendResetPassword: async ({user, url, token}, request) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        },
        resetPasswordTokenExpiresIn: 3600, // 1 hour
        onPasswordReset: async ({user}, request) => {
            // your logic here
            logger.info(`Password for user ${user.email} has been reset.`);
        },
    },
    user: {
        deleteUser: {
            enabled: true,
            beforeDelete: async (user, request) => {
                // Perform any cleanup or additional checks here
                if (user.email.includes("admin")) {
                    throw new Error("BAD_REQUEST", {
                        message: "Admin accounts can't be deleted",
                    });
                }
            },
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({user, newEmail, url, token}, request) => {
                await sendEmail({
                    to: user.email, // verification email must be sent to the current user email to approve the change
                    subject: 'Approve email change',
                    text: `Click the link to approve the change: ${url}`
                })
            }
        }
    },
    onAPIError: {
        throw: true,
        onError: (error, ctx) => {
            // Custom error handling
            console.error("Auth error:", error);
        },
        errorURL: "/auth/error"
    },
    // afterDelete: async (user, request) => {
    //     // Perform any cleanup or additional actions here
    // },
    // sendDeleteAccountVerification: async (
    //     {
    //         user,   // The user object
    //         url, // The auto-generated URL for deletion
    //         token  // The verification token  (can be used to generate custom URL)
    //     },
    //     request  // The original request object (optional)
    // ) => {
    //     // Your email sending logic here
    //     // Example: sendEmail(data.user.email, "Verify Deletion", data.url);
    // },
    // emailVerification: {
    //     sendVerificationEmail: async ({ user, url, token }) => {
    //         // Send verification email to user
    //     },
    //     sendOnSignUp: true,
    //     autoSignInAfterVerification: true,
    //     expiresIn: 3600 // 1 hour
    // },
    // databaseHooks: {
    //     account: {
    //         //         create: {
    //         //             before(account, context) {
    //         //                 const withEncryptedTokens = { ...account };
    //         //                 if (account.accessToken) {
    //         //                     const encryptedAccessToken = encrypt(account.accessToken)
    //         //                     withEncryptedTokens.accessToken = encryptedAccessToken;
    //         //                 }
    //         //                 if (account.refreshToken) {
    //         //                     const encryptedRefreshToken = encrypt(account.refreshToken);
    //         //                     withEncryptedTokens.refreshToken = encryptedRefreshToken;
    //         //                 }
    //         //                 return {
    //         //                     data: resultAccount
    //         //                 }
    //         //             },
    //         //         }
    //     },
    //     user: {
    //         create: {
    //             before: async (user) => {
    //                 // Modify user data before creation
    //                 // return {data: {...user, customField: "value"}};
    //             },
    //             after: async (user) => {
    //                 // Perform actions after user creation
    //             }
    //         },
    //         update: {
    //             before: async (userData) => {
    //                 // Modify user data before update
    //                 // return {data: {...userData, updatedAt: new Date()}};
    //             },
    //             after: async (user) => {
    //                 // Perform actions after user update
    //             }
    //         }
    //     },
    //     session: {
    //         // Session hooks
    //     },
    //     verification: {
    //         // Verification hooks
    //     }
    // },
    // hooks: {
    //     before: createAuthMiddleware(async (ctx) => {
    //         // Execute before processing the request
    //         console.log("Request path:", ctx.path);
    //     }),
    //     after: createAuthMiddleware(async (ctx) => {
    //         // Execute after processing the request
    //         console.log("Response:", ctx.context.returned);
    //     })
    // },
});

//Generate better-auth schema OpenApi file
const openAPISchema = await auth.api.generateOpenAPISchema()
const jsonString = JSON.stringify(openAPISchema);

// Write the JSON string to the file
if (envConfig.server.nodeEnv === 'development') {
    try {
        writeFileSync(envConfig.server.swaggerBetterAuthApiJsonPath, jsonString)
        logger.info('better-auth-api-swagger.json api written to file successfully!');
    } catch (err) {
        logger.error(`Error writing better-auth swagger file: ${err}`);
    }
}


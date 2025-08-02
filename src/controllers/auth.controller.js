import {auth} from '../utils/auth.js';
import {fromNodeHeaders} from "better-auth/node";


export class AuthController {
    /**
     * Get current user info (enhanced version of BetterAuth's session)
     * This adds custom business logic on top of BetterAuth
     */
    me = async (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({error: 'User not authenticated'});
                return;
            }

            const userWithExtras = {
                ...req.user,
                // Add custom fields
                lastLoginAt: new Date().toISOString(),
                permissions: this.getUserPermissions(req.user.id),
                // Add any other custom data you need
            };

            res.json({
                message: 'User profile retrieved successfully',
                data: userWithExtras,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get session information with additional metadata
     */
    getSession = async (req, res, next) => {
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });

            if (!session) {
                res.status(401).json({error: 'No active session'});
                return;
            }

            // Add custom session metadata
            const sessionWithMetadata = {
                ...session,
                metadata: {
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    lastActivity: new Date().toISOString(),
                }
            };

            res.json({
                message: 'Session retrieved successfully',
                data: sessionWithMetadata,
            });
        } catch (error) {
            res.status(401).json({
                error: error.message || 'Failed to get session',
            });
        }
    };

    /**
     * Get user permissions based on roles or custom logic
     * This is a placeholder for future actual permission logic
     */
    getUserPermissions(userId) {
        // Implement your role/permission logic
        // This could query a roles table, check user type, etc.
        return ['read', 'write']; // Example
    }
}
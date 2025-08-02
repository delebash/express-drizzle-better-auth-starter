// src/middleware/cognitoAuth.ts
import {auth} from "../utils/auth.js";
import {fromNodeHeaders} from "better-auth/node";

// Middleware to verify session
export const verifyToken = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({message: "No Session provided"});
        }

        req.user = session.user
        req.session = session.session;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({message: "Unauthorized"});
    }
};

export const requireRole = (requiredRole) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const role = req.user.role;
        if (!role || role !== requiredRole) {
            return res.status(403).json({message: `Role ${requiredRole} required`});
        }

        next();
    };
};

export const requireAnyRole = (requiredRoles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const userRole = req.user.role;
        if (!userRole) {
            return res.status(403).json({message: `One of roles ${requiredRoles.join(", ")} required`});
        }
        const hasAccess = requiredRoles.some((role) => userRole === role);

        if (!hasAccess) {
            return res.status(403).json({message: `One of roles ${requiredRoles.join(", ")} required`});
        }

        next();
    };
};

export const currentSession = async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    res.locals.session = session
    return next()
}
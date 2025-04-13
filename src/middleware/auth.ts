// src/middleware/cognitoAuth.ts
import { auth } from "@/utils/auth";
import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";

// AWS Cognito configuration
const cognitoConfig = {
  region: process.env.AWS_REGION || "eu-west-1",
  userPoolId: process.env.COGNITO_USER_POOL_ID || "",
  appClientId: process.env.COGNITO_APP_CLIENT_ID || "",
};

// Cache for the JWKs (JSON Web Key Set)
let jwks: any = null;
let jwksPems: { [key: string]: string } = {};

// Define Cognito User type with all the properties from the token
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  role?: string;
  banned?: boolean;
  bannedReason?: string;
  banExpires?: Date;
  isAnonymous?: boolean;
}

// Define interface to extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// Middleware to verify JWT tokens
export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "No Session provided" });
    }

    req.user = session.user as unknown as AuthUser;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireRole = (requiredRole: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const role = req.user.role;
    if (!role || role !== requiredRole) {
      return res.status(403).json({ message: `Role ${requiredRole} required` });
    }

    next();
  };
};

export const requireAnyRole = (requiredRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = req.user.role;
    if (!userRole) {
      return res.status(403).json({ message: `One of roles ${requiredRoles.join(", ")} required` });
    }
    const hasAccess = requiredRoles.some((role) => userRole === role);

    if (!hasAccess) {
      return res.status(403).json({ message: `One of roles ${requiredRoles.join(", ")} required` });
    }

    next();
  };
};

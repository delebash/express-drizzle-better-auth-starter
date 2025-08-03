//Admin plugin
import {fromNodeHeaders} from "better-auth/node";
import {auth} from "../utils/auth";

export class AdminController {
    createUser = async (req, res) => {
        await auth.api.createUser({
            body: {
                email: req.body.email, // required
                password: req.body.password, // required
                name: req.body.name, // required
                role: "user"
            },
        })
    }


    listUsers = async (req, res) => {
        await auth.api.listUsers({
            query: {
                searchField: "name",
                searchOperator: "contains",
                limit: 100,
                offset: 100,
                sortBy: "name",
                sortDirection: "desc",
                filterField: "email",
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        })
    }

    setRole = async (req, res) => {
        await auth.api.setRole({
            body: {
                userId: "user-id",
                role: "admin", // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        })
    }

    setUserPassword = async (req, res) => {
        await auth.api.setUserPassword({
            body: {
                newPassword: 'new-password', // required
                userId: 'user-id', // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        })
    }

    banUser = async (req, res) => {
        await auth.api.banUser({
            body: {
                userId: "user-id", // required
                banReason: "Spamming",
                banExpiresIn: 60 * 60 * 24 * 7,
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        })
    }

    unbanUser = async (req, res) => {
        await auth.api.unbanUser({
            body: {
                userId: "user-id", // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        });
    }


    listUserSessions = async (req, res) => {
        await auth.api.listUserSessions({
            body: {
                userId: "user-id", // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        })
    }

    revokeUserSession = async (req, res) => {
        const data = await auth.api.revokeUserSession({
            body: {
                sessionToken: "session_token_here", // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        });
    }

    revokeUserSessions = async (req, res) => {
        const data = await auth.api.revokeUserSessions({
            body: {
                userId: "user-id", // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        });
    }

    impersonateUser = async (req, res) => {
        const data = await auth.api.impersonateUser({
            body: {
                userId: "user-id", // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        });
    }

    stopImpersonating = async (req, res) => {
        await auth.api.stopImpersonating({
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        });
    }

    removeUser = async (req, res) => {
        const deletedUser = await auth.api.removeUser({
            body: {
                userId: "user-id", // required
            },
            // This endpoint requires session cookies.
            headers: fromNodeHeaders(req.headers),
        });
    }

    userHasPermission = async (req, res) => {
        const data = await auth.api.userHasPermission({
            body: {
                userId: "user-id",
                role: "admin", // server-only
                permission: {"project": ["create", "update"]} /* Must use this, or permissions */,
            },
        });
    }
}


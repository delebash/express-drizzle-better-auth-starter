import {organizations, Seed, users} from "@better-auth-kit/seed";

export const seed = Seed({
    // Adds 100 users (including sessions and accounts)
    ...users({}, { createSessions: false ,count: 2}),
    ...organizations({count: 2})
});
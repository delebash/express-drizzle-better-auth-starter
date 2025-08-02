import { createAccessControl } from "better-auth/plugins/access";

const statement = {
    project: ["create", "share", "update", "delete"],
}

const ac = createAccessControl(statement);
import { Workspace, WORKSPACE_TYPES } from "@/api/workspace/workspaceSchema";
import { model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

const WorkspaceSchema = new Schema<Workspace>(
    {
        _id: {
            type: String,
            default: () => randomUUID()
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(WORKSPACE_TYPES),
            required: true,
            default: WORKSPACE_TYPES.personal,
        },
        ownerId: {
            type: String,
            ref: "User",
            required: true
        },
        teamId: {
            type: String,
            ref: "Team",
        },
    },
    {
        timestamps: true,
    }
)

WorkspaceSchema.index(
    { name: 1, ownerId: 1 },
    {
        unique: true,
        partialFilterExpression: { type: WORKSPACE_TYPES.personal }
    }
);

WorkspaceSchema.index(
    { name: 1, teamId: 1 },
    {
        unique: true,
        partialFilterExpression: { type: WORKSPACE_TYPES.team }
    }
)

export const WorkspaceModel = model<Workspace>("Workspace", WorkspaceSchema)

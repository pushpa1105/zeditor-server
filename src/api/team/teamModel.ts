import { type Team } from "@/api/team/teamSchema";
import { model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

const TeamSchema = new Schema<Team>(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        name: {
            type: String,
            required: true,
        },
        ownerId: {
            type: String,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true,
    }
)

export const TeamModel = model<Team>("Team", TeamSchema)

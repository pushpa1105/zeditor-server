import { Schema } from "mongoose";

export const baseSchema = {
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
        default: new Date(),
    },
    created_by: {
        type: String,
        ref: "Users",
    },
    updated_by: {
        type: String,
        ref: "Users",
    },
}
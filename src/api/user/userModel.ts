import { type User } from "@/api/user/userSchema";
import { model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

const UserSchema = new Schema<User>(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'user',
            required: true,
        },
        activeWorkspace: {
            type: String,
            ref: "Workspace",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret: any) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
)

export const UserModel = model<User>("User", UserSchema)

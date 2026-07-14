import { Pana } from "@/api/pana/panaSchema";
import { baseSchema } from "@/common/schema/baseSchema";
import { Document, model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

const PanaSchema = new Schema<Pana>({
    _id: {
        type: String,
        default: () => randomUUID()
    },
    title: {
        type: String,
        default: 'A New Page'
    },
    workspaceId: {
        type: String,
        ref: "Workspace",
        required: true,
    },
    parentId: {
        type: String,
        ref: "Pana",
    },
    ...baseSchema
})

export const PanaModel = model<Pana>("Pana", PanaSchema)

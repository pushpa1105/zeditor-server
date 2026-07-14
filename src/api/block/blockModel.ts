import { Document, model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3'

export interface BlockDocument {
    _id: String,
    type: BlockType;
    panaId: string;
    parentId: string;
    props: Schema.Types.Mixed;
    order: String;
    content?: JSON;
    created_at: Date;
    created_by: Schema.Types.ObjectId;
}

const BlockSchema = new Schema<BlockDocument>({
    _id: {
        type: String,
        default: () => randomUUID()
    },
    type: {
        type: String,
        required: true,
    },
    panaId: {
        type: String,
        ref: "Pana",
        required: true,
    },
    order: {
        type: String,
        required: true,
    },
    content: {
        type: Schema.Types.Mixed,
        default: [],
    },
    parentId: {
        type: String,
        ref: 'Block',
    },
    props: {
        type: Schema.Types.Mixed,
        default: {}
    },
},
    {
        timestamps: true,
    }
);

export const BlockModel = model<BlockDocument>('Block', BlockSchema);

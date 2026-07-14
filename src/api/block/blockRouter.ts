import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { blockController } from "@/api/block/blockController";
import { BlockSchema, CreateBlockSchema } from "@/api/block/blockSchema";
import { auth } from "@/common/middleware/auth";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import z from "zod";

export const blockRegistry = new OpenAPIRegistry();
export const blockRouter: Router = express.Router();

blockRegistry.register("Block", BlockSchema);

blockRegistry.registerPath({
    method: "get",
    path: "/{id}/blocks",
    tags: ["Block"],
    security: [{ cookieAuth: [] }],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: createApiResponse(BlockSchema, "Success")
})

blockRouter.get('/:id/blocks', auth, blockController.getBlocksByPanaId)

blockRegistry.registerPath({
    method: "post",
    path: "/{id}/blocks",
    tags: ["Block"],
    security: [{ cookieAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": { schema: CreateBlockSchema.shape.body }
            }
        },
        params: z.object({
            id: z.string(),
        })
    },
    responses: createApiResponse(BlockSchema, "Success")
})

blockRouter.post('/:id/blocks', auth, blockController.addOrUpdateBlocks)

blockRegistry.registerPath({
    method: "post",
    path: "/{id}/blocks/bulk-delete",
    tags: ["Block"],
    security: [{ cookieAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        blockIds: z.array(z.string())
                    })
                }
            }
        },
        params: z.object({
            id: z.string(),
        })
    },
    responses: createApiResponse(BlockSchema, "Success")
})

blockRouter.post('/:id/blocks/bulk-delete', auth, blockController.deleteBlocksById)
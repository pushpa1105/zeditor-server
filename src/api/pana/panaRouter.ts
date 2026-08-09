import { auth } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
import express, { type Router } from "express";
import { CreatePanaSchema, Pana, UpdateTitleSchema } from "./panaSchema";
import { panaController } from "./panaController";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import z, { any } from "zod";
import { PaginationQuerySchema, PaginationSchema } from "@/common/schema";

export const panaRegistry = new OpenAPIRegistry();
export const panaRouter: Router = express.Router();

panaRegistry.register("Pana", Pana)

panaRegistry.registerPath({
    method: "post",
    path: "/panas/create",
    tags: ['Pana'],
    security: [{ cookieAuth: [] }],
    request: {
        body: { content: { "application/json": { schema: CreatePanaSchema.shape.body } } },
        query: z.object({
            parentId: z.string().optional()
        }),
    },
    responses: createApiResponse(Pana, "Success")
})

panaRouter.post('/create', auth, validateRequest(CreatePanaSchema), panaController.createPana)

panaRegistry.registerPath({
    method: "delete",
    path: "/panas/{id}",
    tags: ['Pana'],
    security: [{ cookieAuth: [] }],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: createApiResponse(z.null(), "Success")
})

panaRouter.delete('/:id', auth, panaController.deletePanaById)

panaRegistry.registerPath({
    method: "post",
    path: "/panas/{id}/update-title",
    tags: ['Pana'],
    security: [{ cookieAuth: [] }],
    request: {
        params: z.object({
            id: z.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: UpdateTitleSchema.shape.body
                }
            }
        },

    },
    responses: createApiResponse(Pana, "Success")
})

panaRouter.post('/:id/update-title', auth, validateRequest(UpdateTitleSchema), panaController.updateTitle)
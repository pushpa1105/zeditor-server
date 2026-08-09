import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { CreateWorkspaceSchema, Workspace } from "./workspaceSchema";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { workspaceController } from "./workspaceController";
import { auth } from "@/common/middleware/auth";
import z from "zod";

export const workspaceRegistry = new OpenAPIRegistry();
export const workspaceRouter: Router = express.Router();

workspaceRegistry.register("Workspace", Workspace)

workspaceRegistry.registerPath({
    method: "post",
    path: "/workspaces/create",
    tags: ["Workspace"],
    security: [{ cookieAuth: [] }],
    request: { body: { content: { "application/json": { schema: CreateWorkspaceSchema.shape.body } } } },
    responses: createApiResponse(Workspace, "Success")
})

workspaceRouter.post("/create", auth, validateRequest(CreateWorkspaceSchema), workspaceController.createWorkspace)

workspaceRegistry.registerPath({
    method: "get",
    path: "/workspaces/my",
    tags: ["Workspace"],
    security: [{ cookieAuth: [] }],
    responses: createApiResponse(z.array(Workspace), "Success")
})

workspaceRouter.get("/my", auth, workspaceController.getMyWorkspaces)

workspaceRegistry.registerPath({
    method: "get",
    path: "/workspaces/{workspaceId}/panas",
    tags: ['Workspace'],
    security: [{ cookieAuth: [] }],
    request: {
        params: z.object({
            workspaceId: z.string()
        })
    },
    responses: createApiResponse(z.null(), "Success")
})

workspaceRouter.get('/:workspaceId/panas', auth, workspaceController.getPanasByWorkspace)

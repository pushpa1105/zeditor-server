import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { CreateTeamSchema, Team } from "./teamSchema";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { teamController } from "./teamController";
import { auth } from "@/common/middleware/auth";

export const teamRegistry = new OpenAPIRegistry();
export const teamRouter: Router = express.Router();

teamRegistry.register("Team", Team)

teamRegistry.registerPath({
    method: "post",
    path: "/teams/create",
    tags: ["Team"],
    security: [{ cookieAuth: [] }],
    request: { body: { content: { "application/json": { schema: CreateTeamSchema.shape.body } } } },
    responses: createApiResponse(Team, "Success")
})

teamRouter.post("/create", auth, validateRequest(CreateTeamSchema), teamController.createTeam)
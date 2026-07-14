import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { GetUserSchema, SetActiveWorkspaceSchema, User } from "@/api/user/userSchema";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";
import { auth } from "@/common/middleware/auth";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", User);

userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(User), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(User, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);

userRegistry.registerPath({
	method: "patch",
	path: "/users/me/active-workspace",
	tags: ["User"],
	request: { body: { content: { "application/json": { schema: SetActiveWorkspaceSchema.shape.body } } } },
	responses: createApiResponse(User, "Success"),
})

userRouter.patch("/me/active-workspace", auth, validateRequest(SetActiveWorkspaceSchema), userController.setActiveWorkspace);


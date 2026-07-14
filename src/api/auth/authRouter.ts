import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { CreateUserSchema, LoginResponseSchema, LoginUserSchema, User } from "@/api/user/userSchema";
import { auth } from "@/common/middleware/auth";
import { authController } from "@/api/auth/authController";
import { validateRequest } from "@/common/utils/httpHandlers";
import z from "zod";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
    method: "get",
    path: "/whoami",
    tags: ["Auth"],
    security: [{ cookieAuth: [] }],
    responses: createApiResponse(User, "Success")
})

authRouter.get("/whoami", auth, authController.getCurrentUser);

authRegistry.registerPath({
    method: "post",
    path: "/register",
    tags: ["Auth"],
    request: { body: { content: { "application/json": { schema: CreateUserSchema.shape.body } } } },
    responses: createApiResponse(User, "Success"),
})

authRouter.post("/register", validateRequest(CreateUserSchema), authController.createUser)


authRegistry.registerPath({
    method: "post",
    path: "/login",
    tags: ["Auth"],
    request: { body: { content: { "application/json": { schema: LoginUserSchema.shape.body } } } },
    responses: createApiResponse(LoginResponseSchema, "Success")
})

authRouter.post("/login", validateRequest(LoginUserSchema), authController.login)

authRegistry.registerPath({
    method: "post",
    path: "/auth/refresh",
    tags: ["Auth"],
    security: [{ cookieAuth: [] }],
    responses: createApiResponse(LoginResponseSchema, "Success")
})

authRouter.post("/auth/refresh", authController.refresh)

authRegistry.registerPath({
    method: "post",
    path: "/logout",
    tags: ["Auth"],
    security: [{ cookieAuth: [] }],
    responses: createApiResponse(z.null(), "Success")
})

authRouter.post("/logout", authController.logout)

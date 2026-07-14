import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof User>;
export type LoginUserData = z.infer<typeof LoginUserSchema.shape.body>;
export type CreateUserData = z.infer<typeof CreateUserSchema.shape.body>;
export type LoginReponse = z.infer<typeof LoginResponseSchema>

export const UserRole = z.enum(["admin", "user"]);

export const User = z.object({
	_id: z.string(),
	name: z.string(),
	email: z.string().email(),
	role: UserRole.default('user'),
	password: z.string().min(6),
	createdAt: z.date(),
	updatedAt: z.date(),
	activeWorkspace: z.string().nullable()
});

export const LoginResponseSchema = z.object({
	token: z.string(),
	user: User
})

export const CreateUserSchema = z.object({
	body: z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6, 'Password should be at least of 6 characters.'),
		age: z.number().default(18),
	})
})

export const LoginUserSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(6, 'Password should be at least of 6 characters.'),
	})
})

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
	params: z.object({ id: commonValidations.mongoId }),
});

export const SetActiveWorkspaceSchema = z.object({
	body: z.object({
		workspaceId: z.string()
	})
});

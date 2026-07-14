import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { authRegistry } from "@/api/auth/authRouter";
import { teamRegistry } from "@/api/team/teamRouter";
import { workspaceRegistry } from "@/api/workspace/workspaceRouter";
import { panaRegistry } from "@/api/pana/panaRouter";
import { blockRegistry } from "@/api/block/blockRouter";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry(
		[
			healthCheckRegistry,
			userRegistry,
			authRegistry,
			teamRegistry,
			workspaceRegistry,
			panaRegistry,
			blockRegistry
			/**
			 * Add registry above this comment.
			 */
		]
	);

	registry.registerComponent("securitySchemes", "bearerAuth", {
		type: "http",
		scheme: "bearer",
		bearerFormat: "JWT",
	});

	registry.registerComponent("securitySchemes", "cookieAuth", {
		type: "apiKey",
		in: "cookie",
		name: "authToken",
	});

	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}

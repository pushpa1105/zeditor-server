import { PaginationSchema } from "@/common/schema";
import z from "zod";

export type Workspace = z.infer<typeof Workspace>;
export type CreateWorkspaceData = z.infer<typeof CreateWorkspaceSchema.shape.body>;
export type GetMyWorkspace = z.infer<typeof GetMyWorkspaceSchema>;
export type WorkspaceType = z.infer<typeof WorkspaceType>;

export const WorkspaceType = z.enum(['personal', 'team'])
export const WORKSPACE_TYPES = WorkspaceType.enum

export const CreateWorkspaceSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        type: z.string().min(1, "Type is required"),
        teamId: z.string().optional(),
    })
})

export const Workspace = z.object({
    _id: z.string(),
    name: z.string(),
    ownerId: z.string(),
    type: z.string(),
    teamId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const GetMyWorkspaceSchema = z.object({
    pagination: PaginationSchema,
    userId: z.string()
})
import z from "zod";

export type CreatePanaData = z.infer<typeof CreatePanaSchema.shape.body>;
export type Pana = z.infer<typeof Pana>;

export const CreatePanaSchema = z.object({
    body: z.object({
        title: z.string().optional(),
    }).optional()
})

export const UpdateTitleSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Required"),
    })
})

export const Pana = z.object({
    _id: z.string(),
    title: z.string(),
    workspaceId: z.string(),
    parentId: z.string().nullable(),
    created_by: z.string(),
    created_at: z.date(),
})

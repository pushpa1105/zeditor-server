import z from "zod";

export type Team = z.infer<typeof Team>;
export type CreateTeamData = z.infer<typeof CreateTeamSchema.shape.body>;

export const CreateTeamSchema = z.object({
    body: z.object({
        name: z.string(),
    })
})

export const Team = z.object({
    _id: z.string(),
    name: z.string(),
    ownerId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})
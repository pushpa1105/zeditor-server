import z, { string } from "zod";

export const BlockSchema = z.object({
    type: z.string(),
    panaId: z.string(),
    order: z.number(),
    content: z.object({}).optional()
})

export const CreateBlockSchema = z.object({
    body: z.object({
        blocks: z.array(z.object({
            type: z.string(),
            panaId: z.string(),
            order: z.number(),
            content: z.object({}).optional()
        }))
    })
})
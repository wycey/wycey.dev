import { z } from "zod";

export const sharedDataSchema = z.object({
    // GraphQL CMS (Hygraph)
    graphql: z.object({
        url: z.string().min(1).url(),
    }),
});

export type SharedData = z.infer<typeof sharedDataSchema>;

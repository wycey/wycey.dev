import { sharedDataSchema } from "./schemas";

export default sharedDataSchema.parse({
    graphql: {
        url: import.meta.env.VITE_GRAPHQL_URL,
    },
});

import { createClient, dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";

import sharedEnv from "@/env/shared-env";
import schema from "@/generated/graphql.schema.json";

import type { ClientFactory } from "qwik-urql";

const {
    graphql: { url },
} = sharedEnv;

export const clientFactory: ClientFactory = ({ qwikStore }) =>
    createClient({
        url,
        exchanges: [dedupExchange, cacheExchange({ schema: schema as any }), fetchExchange],
    });

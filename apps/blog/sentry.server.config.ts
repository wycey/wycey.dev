import handler from "@astrojs/cloudflare/entrypoints/server";
import * as Sentry from "@sentry/cloudflare";

export default Sentry.withSentry(
  (env) => ({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  }),
  handler,
);

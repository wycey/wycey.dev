import { SENTRY_DSN } from "astro:env/client";
import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: 1.0,
});

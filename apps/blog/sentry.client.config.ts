import { SENTRY_DSN } from "astro:env/client";
import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: SENTRY_DSN,
  sendDefaultPii: false,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event, hint) {
    const error = hint.originalException;

    if (error instanceof Error && error.message.includes("Invalid origin")) {
      return null;
    }

    return event;
  },
});

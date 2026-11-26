import { SENTRY_DSN } from "astro:env/client";
import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({ colorScheme: "system" }),
  ],
  dataCollection: {
    userInfo: false,
  },
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

import * as Sentry from "@sentry/nextjs";

import { constants } from "@/constants";

if (constants.NODE_ENV === "production")
  Sentry.init({
    dsn: constants.SENTRY_DNS,
    integrations: [Sentry.replayIntegration()],
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
  });

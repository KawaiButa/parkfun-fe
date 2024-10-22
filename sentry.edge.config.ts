import * as Sentry from "@sentry/nextjs";

import { constants } from "@/constants";

if (constants.NODE_ENV === "production")
  Sentry.init({
    dsn: constants.SENTRY_DNS,
    tracesSampleRate: 1,
    debug: false,
  });

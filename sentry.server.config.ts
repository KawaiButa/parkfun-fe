import * as Sentry from "@sentry/nextjs";

import { constants } from "@/constants";

Sentry.init({
  dsn: constants.SENTRY_DNS,
  tracesSampleRate: 1,
  debug: false,
});

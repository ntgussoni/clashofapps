// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://55fab6dd3b4acdb7d3051de759aebf62@o4507289741164544.ingest.de.sentry.io/4508938662969424",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
      isEmailRequired: true,
      buttonLabel: "Send feedback",
      successMessageText: "Thank you for your feedback!",
      formTitle: "Send feedback",
      triggerLabel: "Send feedback",
      submitButtonLabel: "Send feedback",
      messagePlaceholder:
        "What's the bug/feature request? What did you expect?",
    }),
  ],

  skipOpenTelemetrySetup: true,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

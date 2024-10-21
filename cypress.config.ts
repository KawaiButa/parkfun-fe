import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    NEXT_PUBLIC_BASE_URL: "https://parkfun.vercel.app"
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

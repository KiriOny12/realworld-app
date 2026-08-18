import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright/tests",
  testMatch: /(?:e2e|api)\/.*\.spec\.mjs/,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
});

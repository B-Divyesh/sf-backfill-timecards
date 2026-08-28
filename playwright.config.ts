import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: [
    {
      command: "npm run build && npm run preview -- --port 4173",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: true,
    },
    {
      command: "npm run preview -- --port 4174",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: true,
    },
  ],
});

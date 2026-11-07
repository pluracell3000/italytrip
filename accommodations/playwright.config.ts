import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 390, height: 844 },
    launchOptions: {
      executablePath: existsSync("/usr/bin/chromium")
        ? "/usr/bin/chromium"
        : undefined,
      args: ["--no-sandbox"],
    },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    env: {
      APP_ORIGIN: "http://127.0.0.1:3000",
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        "postgres://postgres:local-test-only@127.0.0.1:5432/italy_test",
      FAMILY_PASSWORD: "test-family-password-only",
      ADMIN_PASSWORD: "test-admin-password-only",
      SESSION_SECRET: "test-only-session-secret-with-32-characters",
      CRON_SECRET: "test-only-cron-secret-with-32-characters",
      SCANS_ENABLED: "false",
    },
    timeout: 120000,
  },
});

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "node src/server.js",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});

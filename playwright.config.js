import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 15 Pro'], // Utilisé comme base technique pour le rendu
        viewport: { width: 393, height: 852 }, // Dimensions iPhone 17 Pro
        locale: 'fr-FR',
        timezoneId: 'Europe/Paris',
      },
    },
  ],
  webServer: {
    command: 'export PATH="/opt/homebrew/bin:$PATH" && npx serve . -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

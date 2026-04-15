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
        ...devices['iPhone 14 Pro'],
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

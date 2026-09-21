import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:1313',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  reporter: 'list'
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.langsam.test.ts'],
    testTimeout: 180_000,
  },
});

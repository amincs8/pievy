import { defineConfig } from "vitest/config";

export const baseVitestConfig = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    clearMocks: true,
    globals: true,
    include: ["src/**/*.test.ts"],
    restoreMocks: true,
  },
});

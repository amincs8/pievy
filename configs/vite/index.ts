import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

export const baseViteConfig = defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["es"],
    },
    minify: false,
    rolldownOptions: {
      external: [],
      output: {
        entryFileNames: "[name].js",
        preserveModules: true, // 👈 keep module structure
        preserveModulesRoot: "src", // 👈 trim folder nesting,
      },
    },
    sourcemap: false,
  },

  plugins: [
    dts({
      copyDtsFiles: true,
      exclude: [
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.stories.*",
        "**/__tests__.ts",
        "**/__tests__/**",
        "**/__mocks__/**",
      ],
      insertTypesEntry: true,
    }),
  ],
});

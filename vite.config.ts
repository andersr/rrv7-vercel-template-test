import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  test: {
    environment: "node",
    exclude: ["**/node_modules/**", "e2e/**", "tmp/**"],
    include: ["./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "coverage/**",
        "dist/**",
        "build/**",
        "tmp/**",
        "test/**",
        "**/*.d.ts",
        "**/*.test.*",
        "**/*.spec.*",
        "**/mocks/**",
        "playwright-report/**",
        "public/**",
        "**/node_modules/**",
      ],
    },
  },
});

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

// The source uses ".js" import specifiers that actually resolve to ".tsx"/".ts"
// (TypeScript "bundler" style — tsc rewrites them on build). Vite doesn't remap an
// explicit .js extension to .tsx, so do it here for the test build.
const jsToTsx = {
  name: "js-to-tsx",
  enforce: "pre" as const,
  resolveId(source: string, importer?: string) {
    if (importer && source.startsWith(".") && source.endsWith(".js")) {
      const base = resolve(dirname(importer), source.slice(0, -3));
      for (const ext of [".tsx", ".ts"]) {
        if (existsSync(base + ext)) return base + ext;
      }
    }
    return null;
  },
};

export default defineConfig({
  plugins: [jsToTsx, react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
  },
});

import type { StorybookConfig } from "@storybook/react-vite";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Source uses ".js" import specifiers that map to ".tsx"/".ts" — remap for Vite.
const jsToTsx = {
  name: "js-to-tsx",
  enforce: "pre" as const,
  resolveId(source: string, importer?: string) {
    if (importer && source.startsWith(".") && source.endsWith(".js")) {
      const base = resolve(dirname(importer), source.slice(0, -3));
      for (const ext of [".tsx", ".ts"]) if (existsSync(base + ext)) return base + ext;
    }
    return null;
  },
};

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  framework: { name: "@storybook/react-vite", options: {} },
  addons: [],
  async viteFinal(cfg) {
    cfg.plugins = [jsToTsx, ...(cfg.plugins ?? [])];
    return cfg;
  },
};

export default config;

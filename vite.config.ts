import { defineConfig } from "@lovable/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
      preset: "vercel",
    },
  },
});

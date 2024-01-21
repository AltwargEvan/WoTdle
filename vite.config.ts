import { defineConfig } from "@solidjs/start/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  start: {
    server: {
      preset: "vercel",
    },
  },
});

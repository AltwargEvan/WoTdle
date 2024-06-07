import { defineConfig } from "@solidjs/start/config";
import path from "path";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  },
  server: {
    preset: "vercel",
  },
});

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(projectDir, "github-pages"),
  base: "/shi-xun-song-search/",
  publicDir: resolve(projectDir, "public"),
  plugins: [react()],
  build: {
    outDir: resolve(projectDir, "github-pages-dist"),
    emptyOutDir: true,
  },
});


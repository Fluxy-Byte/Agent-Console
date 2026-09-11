import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // lineicons-react@2.0.0 declara "module": "dist/index.es.js" no
      // package.json, mas só publica o build CJS (dist/index.js) — sem esse
      // alias o Rollup falha em resolver o pacote no build de produção.
      "lineicons-react": path.resolve(__dirname, "./node_modules/lineicons-react/dist/index.js"),
    },
  },
  server: {
    port: 7072,
    strictPort: true,
  },
  preview: {
    port: 7072,
    strictPort: true,
  },
});

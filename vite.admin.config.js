// vite.admin.config.js — Separate Vite config for the Admin Panel
// Runs on http://localhost:5174 independently from the main app (port 5173)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",                      // project root
  build: {
    outDir: "dist-admin",         // separate build output
    rollupOptions: {
      input: path.resolve(__dirname, "admin.html"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,                   // separate port — does NOT conflict with main app
    open: "/admin.html",          // auto-open the admin page
    fs: {
      allow: ["."],               // allow serving from project root
    },
  },
});

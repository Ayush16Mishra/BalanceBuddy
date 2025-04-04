import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname manually for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Allows using @/ instead of relative paths
    },
  },
  server: {
    port: 3000, // Optional: Change the port if needed
    open: true, // Opens browser when running `npm run dev`
  },
});

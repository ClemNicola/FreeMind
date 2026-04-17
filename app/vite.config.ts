import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: true,
    allowedHosts: ["localhost", "127.0.0.1", "0.0.0.0"],
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});

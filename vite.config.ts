import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  css: {
    postcss: {
      // Prevent PostCSS from processing node_modules CSS
      // Fixes the '@import must precede all other statements' error
      map: true,
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Library build mode: bundles everything into a single self-contained file
  const isWidgetBuild =
    mode === "widget" || process.env.BUILD_WIDGET === "true";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Ensure proper production mode in builds
      "process.env.NODE_ENV": JSON.stringify(
        command === "build" ? "production" : "development",
      ),
    },
    build: isWidgetBuild
      ? {
          // Widget build: self-contained IIFE with all dependencies bundled
          lib: {
            entry: path.resolve(__dirname, "src/web-component/index.ts"),
            name: "WishlistDock",
            formats: ["iife"],
            fileName: () => "wishlist-dock.js",
          },
          rollupOptions: {
            // Bundle everything - do NOT externalize React
            external: [],
            output: {
              // Single file with all code
              inlineDynamicImports: true,
              // Globals not needed since we're not externalizing
              globals: {},
            },
          },
          // Inline CSS into JS
          cssCodeSplit: false,
          // Output directory
          outDir: "dist",
          // Minify for production
          minify: "esbuild",
          // Generate sourcemaps for debugging
          sourcemap: true,
          // Copy public directory files to dist
          copyPublicDir: true,
        }
      : {
          // Default development/preview build
          outDir: "dist",
        },
  };
});

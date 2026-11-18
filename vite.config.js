import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // "prompt" - the new version waits until the user clicks the update button
      registerType: "prompt",
      includeAssets: ["controller.svg", "icon-192.png", "icon-512.png", "manifest.json"],
      // The manifest is the file public/manifest.json
      manifest: false,
      workbox: {
        // Pre-cache the app shell: JS, CSS, HTML, icons
        globPatterns: ["**/*.{js,css,html,png,svg,json}"],
        // The API file is cached at runtime, not pre-cached
        globIgnores: ["api/**"],
        // The new service worker controls open pages right after activation
        clientsClaim: true,
        // Old versioned caches are removed on activate
        cleanupOutdatedCaches: true,
        // Every page of the SPA opens the cached index.html when offline
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Cache-first: images and fonts
            urlPattern: ({ request, url }) =>
              request.destination === "image" ||
              request.destination === "font" ||
              url.origin === "https://fonts.googleapis.com" ||
              url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Network-first: public API (list and details), only own origin
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-data",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 30 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  base: "/",
});

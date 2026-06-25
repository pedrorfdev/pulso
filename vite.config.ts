import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      /**
       * injectManifest: o Workbox injeta o manifest de precache no nosso
       * SW customizado (src/sw/sw.ts). A gente não perde o controle do
       * SW mas também não reescreve a lógica de cache de assets do zero.
       */
      strategies: "injectManifest",
      srcDir: "src/sw",
      filename: "sw.ts",

      injectManifest: {
        // evita que o Workbox tente injetar nos arquivos de source do React
        injectionPoint: "self.__WB_MANIFEST",
      },

      manifest: {
        name: "Pulso",
        short_name: "Pulso",
        description: "Sincronização operacional do seu time de louvor",
        theme_color: "#0B0B0D",
        background_color: "#0B0B0D",
        display: "standalone",
        orientation: "portrait",
        start_url: "/dashboard",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },

      // Em dev, não registra o SW automaticamente — evita conflitos com HMR
      devOptions: {
        enabled: false,
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
  },
})

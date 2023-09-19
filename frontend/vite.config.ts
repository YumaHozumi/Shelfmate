import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from "vite-plugin-pwa"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const pwaOptions = {
  manifest: {
    "theme_color": "#92b594",
    "background_color": "#4caf50",
    "display": "standalone",
    "scope": "/",
    "start_url": "/",
    "name": "Shelfmate",
    "short_name": "Shelfmate",
    "description": "\u6240\u6301\u3057\u3066\u3044\u308b\u672c\u3092\u7ba1\u7406\u3067\u304d\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u3059",
    "icons": [
        {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
          "src": "icons/icon-256x256.png",
          "sizes": "256x256",
          "type": "image/png"
        },
        {
            "src": "icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
  }

}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA(pwaOptions)
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 10400,
    host: true,
    proxy: {
      '/api': {
        target: 'http://shelfmate-back:8080',
        changeOrigin: true,
      }
    }
  }
})

import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    viteSingleFile()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging in production
    sourcemap: false,
    // Use default minification (esbuild) instead of terser
    minify: true
    // Note: manualChunks is incompatible with viteSingleFile plugin
    // which uses inlineDynamicImports, so we remove it
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-i18next',
      'i18next',
      'swr',
      'date-fns',
      'recharts'
    ]
  },
  // Performance improvements
  server: {
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..']
    }
  }
})

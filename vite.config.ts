import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Security headers applied to the dev server.
// For production, configure these on your hosting platform (Vercel / Nginx / Cloudflare).
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
}

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    headers: securityHeaders,
  },

  preview: {
    headers: securityHeaders,
  },

  build: {
    // Do not emit source maps in production — they expose source code
    sourcemap: false,

    rollupOptions: {
      output: {
        // Split vendor code into separate cacheable chunks
        manualChunks(id: string) {
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor'
          if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux-vendor'
          if (id.includes('@supabase')) return 'supabase-vendor'
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'form-vendor'
          }
          return undefined
        },
      },
    },
  },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          zustand: ['zustand'],
          dompurify: ['dompurify'],
          html2pdf: ['html2pdf.js'],
        },
      },
    },
  },
  server: {
    // Intentionally bind to 0.0.0.0 for development to allow access from other
    // devices on the local network (e.g., testing on mobile, or within Docker).
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['localhost', 'arcangelo.net', 'pages.dev'],
  },
});

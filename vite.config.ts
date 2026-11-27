import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/tvt-studio/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (
            normalized.includes('/node_modules/react/') ||
            normalized.includes('/node_modules/react-dom/') ||
            normalized.includes('/node_modules/scheduler/')
          ) {
            return 'react';
          }
          if (normalized.includes('/node_modules/@supabase/')) {
            return 'supabase';
          }
          if (normalized.includes('/node_modules/qrcode/')) {
            return 'qrcode';
          }
          if (
            normalized.includes('/src/engines/catalog.') ||
            normalized.includes('/src/engines/cart.') ||
            normalized.includes('/src/engines/orderLedger.') ||
            normalized.includes('/src/engines/authVault.') ||
            normalized.includes('/src/engines/vietqr.') ||
            normalized.includes('/src/engines/voucher.') ||
            normalized.includes('/src/engines/analyticsAndCms.') ||
            normalized.includes('/src/engines/adminOps.')
          ) {
            return 'engines';
          }
          return undefined;
        },
      },
    },
  },
});

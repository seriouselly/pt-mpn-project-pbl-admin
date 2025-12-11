import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Setiap request yang diawali '/api' akan diteruskan ke server backend
      '/api': {
        target: 'http://202.10.47.174:8000',
        changeOrigin: true,
        secure: false,
        // Hapus domain agar cookie mengikuti host dev apa pun (localhost/127.0.0.1)
        cookieDomainRewrite: '',
        cookiePathRewrite: '/', // pastikan berlaku untuk semua path
        // Hilangkan Secure & set SameSite ke Lax supaya cookie disimpan di http dev
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (!setCookie) return;
            const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
            proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
              cookie
                .replace(/;\\s*Secure/gi, '')
                .replace(/;\\s*SameSite=None/gi, '; SameSite=Lax')
            );
          });
        },
      },
    },
  },
})
